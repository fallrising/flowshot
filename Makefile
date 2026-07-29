SHELL := /bin/bash
.SHELLFLAGS := -eu -o pipefail -c
.DEFAULT_GOAL := help
.NOTPARALLEL:

CARGO ?= cargo
NPM ?= npm
PYTHON ?= python3

.PHONY: help bootstrap gen-contracts check-contracts check-boundaries \
	verify-sdd rust-ci frontend-ci native-ci macos-launch-smoke \
	native-if-supported ci

help:
	@echo "Flowshot development targets"
	@echo "  make bootstrap       Install locked JavaScript and Rust dependencies"
	@echo "  make gen-contracts   Generate TypeScript contracts from Rust"
	@echo "  make check-contracts Verify deterministic contracts and frozen lock"
	@echo "  make macos-launch-smoke  Prove a visible release window starts in budget"
	@echo "  make ci              Run every gate supported by this host"

bootstrap:
	$(NPM) ci --no-audit --no-fund
	$(CARGO) fetch --locked

gen-contracts:
	$(CARGO) run --locked -p flowshot-xtask -- contracts

check-contracts:
	$(CARGO) run --locked -p flowshot-xtask -- contracts --check-determinism --check

check-boundaries:
	$(CARGO) run --locked -p flowshot-xtask -- check-boundaries

verify-sdd:
	$(PYTHON) scripts/sdd.py verify

rust-ci:
	$(CARGO) fmt --all --check
	$(CARGO) test --workspace --exclude flowshot-tauri
	$(CARGO) clippy --workspace --all-targets --exclude flowshot-tauri -- -D warnings

frontend-ci:
	$(NPM) run lint
	$(NPM) run test
	$(NPM) run build

native-ci:
	$(CARGO) test -p flowshot-tauri
	$(CARGO) clippy -p flowshot-tauri --all-targets -- -D warnings
	$(NPM) run tauri -- build --debug --no-bundle --ci

macos-launch-smoke:
	@if [[ "$$(uname -s)" != "Darwin" ]]; then \
		echo "macos-launch-smoke: requires macOS"; \
		exit 1; \
	fi
	$(NPM) run tauri -- build --no-bundle --ci
	node scripts/macos-launch-smoke.mjs

native-if-supported:
	@if [[ "$$(uname -s)" == "Darwin" ]]; then \
		$(MAKE) native-ci; \
		$(MAKE) macos-launch-smoke; \
	elif command -v pkg-config >/dev/null && pkg-config --exists webkit2gtk-4.1; then \
		$(MAKE) native-ci; \
	else \
		echo "native-ci: skipped; install the documented Tauri platform prerequisites"; \
	fi

ci: verify-sdd check-contracts check-boundaries rust-ci frontend-ci native-if-supported
	@echo "Flowshot CI passed"
