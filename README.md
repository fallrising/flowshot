# Flowshot

Flowshot is the repository for **Markdown Annotator**, a local-first,
read-only desktop application for reading Markdown and keeping annotations
attached as documents evolve.

## Product promise

Flowshot treats a Markdown workspace as user-owned source material:

- Workspace files are never edited, renamed, deleted, or reformatted.
- Annotations, comments, tags, and document records are never silently lost.
- External edits trigger conservative re-anchoring.
- Uncertain matches become visible, manually recoverable orphans.
- Core reading and annotation workflows require no network connection.

## Planned v1

- Multiple local workspace roots with a lazy Markdown file tree
- Safe GFM rendering, syntax highlighting, TOC, and deterministic headings
- Persistent tabs and per-document scroll positions
- Range annotations, document notes, overlapping highlights, and comments
- Document and annotation tags with cross-document AND filtering
- File watching, conservative rename detection, and audited re-anchoring
- In-document search, command palette, wikilinks/backlinks, and Mermaid
- Versioned JSON and Markdown export outside workspace roots

The primary release target is macOS 13+ on Apple Silicon and Intel. Windows
and Linux should remain architecturally portable, but are not v1 release
gates.

## Architecture

- Tauri 2 desktop shell
- Rust stable backend and pure domain core
- React 19, TypeScript, and Vite frontend
- unified/remark/rehype Markdown document model
- SQLite with WAL and migration-backed repositories
- Rust-authored contracts with generated TypeScript bindings

## Current status

The project is at the specification baseline. Production implementation starts
with the N00 foundation node: repository structure, CI, contract generation,
dependency boundaries, and the first end-to-end command.

The documentation baseline is available in:

- [`SPEC.md`](SPEC.md): product, architecture, security, and data authority
- [`docs/graph.yaml`](docs/graph.yaml): machine-readable implementation DAG
- [`docs/nodes/`](docs/nodes/): independently executable SDD node specs
- [`docs/protocols/`](docs/protocols/): execution and document-change rules
- [`docs/templates/`](docs/templates/): plan, task, test, ADR, and verification templates

Build instructions will be added only after N00 establishes and verifies the
actual toolchain.

## Engineering approach

Development is specification-driven and test-first:

1. Freeze a node's contracts and test plan.
2. Split the node into small, independently verifiable tasks.
3. Preserve red-to-green evidence.
4. Run the complete CI gate.
5. Publish a verification report and node outcome.
6. Pass the milestone's real dogfood gate before advancing.

Scope expansion such as Markdown editing, AI/RAG, cloud sync, accounts,
telemetry, plugins, terminal integration, or arbitrary web content is excluded
from v1.
