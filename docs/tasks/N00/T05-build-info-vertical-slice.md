---
document_type: task
id: T05
node_id: N00
title: Complete the build-info vertical slice
status: done
depends_on:
  - T03
  - T04
derived_from:
  - 00-implementation-plan.md
  - 01-test-plan.md
source_version: 1.0.1
source_sha256:
  SPEC.md: dd79293480f237ee9ff881f9b5a661d320cd65dfda66e70a256cd9309ac29b2e
  N00: 91031b64ad8c48d1fbfd65e5869888ab99352e01696d7bac4b5550710fd3ab13
  plan: 17652c931ccc39d69475aa28e030221dbd933aa40405f062cc86fdd8c883875c
  test_plan: b6c2a83e196b2970b7af130d383b5f2c486533f7d33c74a7d5ff1242068271ea
owner: codex
allowed_paths:
  - src-tauri/src/**
  - src/**
  - src/generated/contracts/**
forbidden_paths:
  - DB schema
  - filesystem capability
  - SPEC.md
expected_duration: 75m
---

# T05 — Complete the build-info vertical slice

## 單一交付結果

The frontend calls `get_build_info` through the generated wrapper and renders a
typed success/error state using the same Rust DTO registered by Tauri.

## 前置事實與證據

T03 supplies the shell. T04 supplies frozen generated contracts.

## 輸入

Frozen N00 contract lock and build metadata available to the Rust adapter.

## 修改範圍

Tauri build-info command/registration and the minimal frontend consumer/tests.

## 禁止事項

No duplicate DTO, raw string command in feature code, filesystem/DB access,
remote request, or generated-file hand edit.

## 執行步驟

1. Write failing Rust adapter and React loading/success/error tests.
2. Implement build metadata injection and the Tauri command.
3. Register the command using the shared DTO.
4. Consume it only through the generated wrapper.
5. Verify serialization matches the golden fixture.

## 首個失敗測試

- Command: targeted Rust command test and frontend build-info component test.
- Expected failure: command/consumer do not exist.
- Requirement: first contract-to-UI vertical slice.

## 完成驗證

- Command: targeted Rust tests plus `npm run test`
- Expected result: typed success/error tests pass and no duplicate contract is
  present.

## Handoff

- Changed files: build-info adapter and frontend consumer.
- Evidence: `evidence/T05-build-info-slice.md`.
- Risks: full repository gate awaits T07.
- Next task: T07 after T06.
