# Workflow Code Analysis

This review covers the canonical workflows in `data/*/baldrick-broth.yaml` and flags tasks that are obsolete, AI-replaceable, or candidates for light improvement. Task names are preserved; recommendations focus on behavior/content.

## Test
- jest (deprecated): Remove or hide. Prefer `unit` and CLI acceptance tests.
- spec (zest): Remove (zest no longer supported). Also drop any `release.ready` steps invoking zest.
- unit: Keep. Ensure it runs the project’s current test runner (`node:test`, Vitest, or Jest) via package script.
- pest / pest1: Keep. Snapshot-style CLI acceptance remains valuable.
- scc: Keep optional. Keep as metrics-only; do not gate CI.
- cli: Keep. Useful for local dev without install.

## Lint
- check/fix: Keep. No AI replacement; static analysis catches specific classes of errors. Prefer project’s native linter (xo/eslint, go vet, dart analyze).

## Markdown (md)
- check/fix: Keep. Consider adding AI-assisted rewrite as an optional substep (new opt-in task) for larger edits; retain deterministic formatter as the default.

## Release
- ready: Keep but update steps:
  - Remove zest probes and execution.
  - Keep build, lint, markdown, outdated, audit; make “audit/outdated” non-blocking or nightly.
  - For multi-language repos, split language-specific steps (TS: `yarn build`; Go: `go build`; Dart: `dart analyze` + `dart test`).
- pr: Keep task name; switch description/body generation to AI-assisted summary from git diff and conventional commits. Keep human confirmation before submit.
- publish: Keep; ensure correct per-language commands. Examples:
  - TS: `npm publish --access public` after `npm pack` sanity check.
  - Go: tag + `gh release create` is sufficient; no central registry publish.
  - Dart: use `dart pub publish --dry-run` then manual confirm; current `run: dart` looks incomplete.

## Scaffold / Normalize (TS)
- Keep. Consider adding a validation step to verify generated files (e.g., lint and markdown check immediately after render). Allow AI to propose README/PR drafts but keep deterministic templates as source of truth.

## Small improvements
- Parameterize owners/branches for `gh` commands.
- Make expensive checks (audit/outdated) cache-aware and skippable via flags.
- Emit machine-readable artifacts (JSON) for key results to integrate with dashboards.
