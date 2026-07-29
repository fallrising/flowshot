---
document_type: task
id: T03
node_id: N00
title: Scaffold React, Vite, and Tauri
status: todo
depends_on:
  - T01
  - T02
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
  - package.json
  - package-lock.json
  - tsconfig*.json
  - vite.config.ts
  - vitest.config.ts
  - eslint.config.js
  - index.html
  - src/**
  - src-tauri/**
forbidden_paths:
  - product features
  - SPEC.md
expected_duration: 90m
---

# T03 — Scaffold React, Vite, and Tauri

## 單一交付結果

A minimal React 19/Vite frontend and Tauri 2 adapter compile without product
features or broad capabilities.

## 前置事實與證據

T01 has a working Node/npm toolchain and Tauri prerequisite route. T02 supplies
the Rust workspace.

## 輸入

N00 stack, CSP, capability, and offline constraints.

## 修改範圍

Frontend root configuration, `src/`, and the minimal `src-tauri/` crate/config.

## 禁止事項

No filesystem/HTTP capability, remote assets, product schema, Markdown parser,
annotation UI, or legacy command surface.

## 執行步驟

1. Save the failing frontend build.
2. Create locked package metadata and TypeScript/Vite configuration.
3. Add a minimal accessible application shell and component test.
4. Add the minimal Tauri adapter/configuration with strict capabilities.
5. Build frontend and platform-appropriate Rust targets.

## 首個失敗測試

- Command: `npm run build`
- Expected failure: no `package.json`.
- Requirement: reproducible React/Tauri shell.

## 完成驗證

- Command: `npm run test && npm run build`
- Expected result: shell test passes and production frontend builds.

## Handoff

- Changed files: frontend and `src-tauri` scaffold.
- Evidence: npm test/build and Cargo check output.
- Risks: target-macOS launch remains T08 evidence.
- Next task: T05 after T04.

