---
document_type: task
id: T08
node_id: N00
title: Prove macOS launch and command observability
status: todo
depends_on:
  - T07
derived_from:
  - 00-implementation-plan.md
  - 01-test-plan.md
source_version: 1.0.1
source_sha256:
  SPEC.md: dd79293480f237ee9ff881f9b5a661d320cd65dfda66e70a256cd9309ac29b2e
  N00: 91031b64ad8c48d1fbfd65e5869888ab99352e01696d7bac4b5550710fd3ab13
  plan: 4d44223fb500c353bcb5afa90669531d519a35d5c2d45247a37df5c733838c41
  test_plan: 9e882c98fc013b9f606c70b1658f0b82fabc8a938efab42bc3b56b5865a1028a
owner: codex
allowed_paths:
  - Makefile
  - .github/**
  - scripts/macos-launch-smoke.mjs
  - scripts/macos-window-check.swift
  - src-tauri/Cargo.toml
  - src-tauri/src/commands/build_info.rs
  - docs/tasks/N00/**
forbidden_paths:
  - crates/core/src/contracts/**
  - src/generated/contracts/**
  - contracts/locks/N00.json
  - product features
  - SPEC.md
expected_duration: 90m
---

# T08 — Prove macOS launch and command observability

## 單一交付結果

A release Flowshot binary launches a visible native window on both supported Mac
architectures, reaches the existing build-info vertical slice within the cold
start budget, and emits structured command completion metadata.

## 前置事實與證據

T07 proves clean-checkout builds and native tests on Ubuntu, Apple Silicon, and
Intel macOS, but it deliberately does not claim a window launch or interactive
timing result.

## 輸入

N00 performance/observability requirements, the frozen `get_build_info`
contract, and the existing React-to-Tauri invocation path.

## 修改範圍

The build-info adapter log, a Mac-only launch/window probe, its Make target, and
the macOS hosted workflow steps.

## 禁止事項

No new command, contract/lock change, telemetry, remote reporting, product
feature, weakened `< 1.5 s` budget, or process-only result presented as a
visible-window launch.

## 執行步驟

1. Save the missing launch target and missing command-log evidence.
2. Emit one JSON line with command, correlation ID, duration, result code, and
   build info for `get_build_info`.
3. Test the log record structure without capturing global process output.
4. Build a release binary on macOS and launch it as a child process.
5. Require both the frontend-originated command record and a CoreGraphics
   on-screen window owned by the child PID.
6. Measure spawn-to-command time and fail at `>= 1.5 s`.
7. Run the same oracle on Apple Silicon and Intel hosted Macs.

## 首個失敗測試

- Command: `make macos-launch-smoke`
- Expected failure: the target and launch probe do not exist.
- Requirement: real target-Mac launch, observability, and cold-start evidence.

## 完成驗證

- Command: `make macos-launch-smoke`
- Expected result: a release binary reports a structured successful
  `get_build_info` record, owns an on-screen native window, and reaches the
  signal in under 1.5 seconds.

## Handoff

- Changed files: adapter logging, launch/window probes, Makefile, macOS CI.
- Evidence: `evidence/T08-macos-launch-observability.md`.
- Risks: hosted measurements describe the recorded runner hardware, not every
  end-user Mac.
- Next task: T09.
