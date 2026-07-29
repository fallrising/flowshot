---
document_type: task
id: T04
node_id: N00
title: Implement and freeze the contract generator
status: done
depends_on:
  - T02
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
  - crates/core/src/contracts/**
  - crates/core/tests/**
  - crates/xtask/**
  - src/generated/contracts/**
  - contracts/locks/N00.json
forbidden_paths:
  - handwritten generated files
  - src-tauri/**
  - SPEC.md
expected_duration: 90m
---

# T04 — Implement and freeze the contract generator

## 單一交付結果

Rust contract authority generates deterministic TypeScript DTOs, typed invoke
metadata, and a command manifest; the N00 lock becomes genuinely frozen.

## 前置事實與證據

T02 provides the core and xtask crates. The planned lock explicitly contains no
fake source hash.

## 輸入

`CommandContract`, `EmptyRequest`, `BuildInfoDto`, `AppErrorDto`, and the
`get_build_info` command name from N00.

## 修改範圍

Core contract source/tests, xtask generation, generated output, and N00 lock.

## 禁止事項

No hand edits to generated output, positional command arguments, unstable
ordering, absolute build paths, or adapter implementation.

## 執行步驟

1. Save the missing-generator failure.
2. Write Rust DTOs and serialization golden tests.
3. Implement deterministic generation into an explicit destination.
4. Test isolated double generation and drift reporting.
5. Generate committed artifacts.
6. Record source hash, generator version, and frozen timestamp in the lock.

## 首個失敗測試

- Command: `cargo xtask contracts`
- Expected failure: contracts command is absent.
- Requirement: Rust-authoritative one-way contract generation.

## 完成驗證

- Command: `cargo xtask contracts --check && cargo test -p flowshot-core`
- Expected result: no drift; serialization and determinism tests pass; lock
  status is `frozen` with non-null hashes.

## Handoff

- Changed files: core contracts, xtask generator, generated TS, frozen lock.
- Evidence: `evidence/T04-contract-generator.md`.
- Risks: adapter integration is not yet proven.
- Next task: T05 and T06.
