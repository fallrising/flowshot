---
document_type: task
id: T02
node_id: N00
title: Scaffold the Rust workspace
status: done
depends_on:
  - T01
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
  - Cargo.toml
  - Cargo.lock
  - crates/core/**
  - crates/db/**
  - crates/xtask/**
forbidden_paths:
  - src-tauri/**
  - src/**
  - SPEC.md
expected_duration: 60m
---

# T02 — Scaffold the Rust workspace

## 單一交付結果

A compiling Rust workspace contains pure `core`, placeholder `db`, and `xtask`
crates with one discovered unit test.

## 前置事實與證據

T01 has recorded an available supported Rust toolchain.

## 輸入

N00 repository structure and core dependency restrictions.

## 修改範圍

Root Rust workspace configuration and the three non-Tauri crates.

## 禁止事項

No SQLite dependency/schema, Tauri dependency in core, filesystem logic,
business feature, or contract generation implementation.

## 執行步驟

1. Save the failing workspace command.
2. Create workspace manifests and minimal crate entry points.
3. Add a pure placeholder function and unit test.
4. Confirm format, compile, and test discovery.

## 首個失敗測試

- Command: `cargo metadata --no-deps`
- Expected failure: root `Cargo.toml` does not exist.
- Requirement: reproducible Rust workspace.

## 完成驗證

- Command: `cargo fmt --check && cargo test --workspace`
- Expected result: all three crates build and the placeholder test passes.

## Handoff

- Changed files: root Cargo files and `crates/{core,db,xtask}`.
- Evidence: `evidence/T02-rust-workspace.md`.
- Risks: adapter crate is added in T03.
- Next task: T04 after T01.
