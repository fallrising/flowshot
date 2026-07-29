import {
  existsSync,
  mkdtempSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  execFileSync,
  spawn,
  spawnSync,
} from "node:child_process";

const budgetMs = 1_500;
const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const appBinary = resolve(repositoryRoot, "target/release/flowshot-tauri");
const windowSource = resolve(
  repositoryRoot,
  "scripts/macos-window-check.swift",
);

if (process.platform !== "darwin") {
  throw new Error("macos-launch-smoke requires macOS");
}

if (!existsSync(appBinary)) {
  throw new Error(`release application does not exist: ${appBinary}`);
}

const temporaryDirectory = mkdtempSync(join(tmpdir(), "flowshot-launch-"));
const windowProbe = join(temporaryDirectory, "macos-window-check");

function systemFact(command, args) {
  return execFileSync(command, args, { encoding: "utf8" }).trim();
}

function delay(milliseconds) {
  return new Promise((resolveDelay) => {
    setTimeout(resolveDelay, milliseconds);
  });
}

function stopProcess(child) {
  if (child.exitCode === null && child.signalCode === null) {
    child.kill("SIGTERM");
  }
}

function parseCompletionLine(line) {
  try {
    const value = JSON.parse(line);
    if (
      value.event === "command_complete" &&
      value.command === "get_build_info" &&
      value.resultCode === "OK" &&
      typeof value.correlationId === "string" &&
      value.correlationId.length > 0
    ) {
      return value;
    }
  } catch {
    // Native framework output may share stdout; only JSON command records count.
  }
  return undefined;
}

function waitForCommand(child, output, deadline) {
  return new Promise((resolveCommand, rejectCommand) => {
    let buffer = "";

    const fail = (message) => {
      rejectCommand(new Error(message));
    };

    child.once("exit", (code, signal) => {
      fail(
        `Flowshot exited before command completion (code=${code}, signal=${signal})`,
      );
    });

    child.stdout.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      output.stdout += chunk;
      buffer += chunk;
      const lines = buffer.split(/\r?\n/u);
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const completion = parseCompletionLine(line);
        if (completion !== undefined) {
          resolveCommand(completion);
          return;
        }
      }
    });

    const remaining = Math.max(0, deadline - performance.now());
    setTimeout(() => {
      fail("timed out waiting for the frontend-originated get_build_info record");
    }, remaining);
  });
}

async function waitForVisibleWindow(pid, deadline) {
  let lastDiagnostic = "";

  while (performance.now() < deadline) {
    const result = spawnSync(windowProbe, [String(pid)], {
      encoding: "utf8",
    });
    if (result.status === 0) {
      return JSON.parse(result.stdout);
    }
    lastDiagnostic = result.stderr.trim();
    await delay(20);
  }

  throw new Error(
    `timed out waiting for an on-screen Flowshot window: ${lastDiagnostic}`,
  );
}

try {
  execFileSync(
    "xcrun",
    ["swiftc", windowSource, "-o", windowProbe],
    { stdio: "inherit" },
  );

  const output = { stdout: "", stderr: "" };
  const startedAt = performance.now();
  const deadline = startedAt + budgetMs;
  const child = spawn(appBinary, [], {
    cwd: repositoryRoot,
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
  });

  child.stderr.setEncoding("utf8");
  child.stderr.on("data", (chunk) => {
    output.stderr += chunk;
  });

  try {
    const [commandOutcome, windowOutcome] = await Promise.allSettled([
      waitForCommand(child, output, deadline),
      waitForVisibleWindow(child.pid, deadline),
    ]);

    const failures = [
      commandOutcome.status === "rejected" &&
        `command check: ${commandOutcome.reason}`,
      windowOutcome.status === "rejected" &&
        `window check: ${windowOutcome.reason}`,
    ].filter(Boolean);
    if (failures.length > 0) {
      throw new Error(failures.join("\n"));
    }

    const completion = commandOutcome.value;
    const window = windowOutcome.value;
    const durationMs = Math.round(performance.now() - startedAt);

    if (durationMs >= budgetMs) {
      throw new Error(
        `cold launch took ${durationMs} ms; budget is under ${budgetMs} ms`,
      );
    }

    const result = {
      event: "macos_launch_smoke",
      result: "pass",
      durationMs,
      budgetMs,
      visibleWindow: window,
      correlationId: completion.correlationId,
      commandDurationMs: completion.durationMs,
      buildInfo: completion.buildInfo,
      hardware: {
        architecture: process.arch,
        cpu: systemFact("sysctl", ["-n", "machdep.cpu.brand_string"]),
        macos: systemFact("sw_vers", ["-productVersion"]),
      },
    };
    console.log(JSON.stringify(result));
  } catch (error) {
    const diagnostic = [
      error instanceof Error ? error.message : String(error),
      output.stdout && `stdout:\n${output.stdout}`,
      output.stderr && `stderr:\n${output.stderr}`,
    ]
      .filter(Boolean)
      .join("\n");
    throw new Error(diagnostic);
  } finally {
    stopProcess(child);
  }
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true });
}
