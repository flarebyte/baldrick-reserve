# Repository Guidelines

## Project Structure & Module Organization
- `reserve-schema/`: Zod-to-JSON Schema generators (`*-schema.mjs`) and outputs (`*.schema.json`).
- `pest-spec/`: Acceptance tests for the CLI (`*.pest.yaml`) with `fixtures/` and `snapshots/`.
- `data/`: Language examples (`dart/`, `elm/`, `go/`, `ts/`) and `glossary.yaml`.
- `script/`: Utility scripts (e.g., `npm-dependencies.mjs`, `service-cost.mjs`).
- `template/`: Scaffolding templates used by the Baldrick toolchain.
- Config: `.editorconfig`, `.prettierrc.json`, `baldrick-broth.yaml`.

## Build, Test, and Development Commands
- Prefer Baldrick Broth workflows (no Makefile needed). See `workflows` in `baldrick-broth.yaml`; use the Broth runner to execute tasks (e.g., the `test` and `generate` workflows as declared).
- Run a specific acceptance test: `npx baldrick-pest@latest test --spec-file pest-spec/typescript.pest.yaml`.
- Generate all schemas: follow `workflows.generate.tasks.schema` in `baldrick-broth.yaml` or run, e.g., `npx zx --install reserve-schema/entity-schema.mjs`.
- Generate one schema (discover file): `find . -type f -name *-schema.mjs` then `npx zx --install <path>`.
- Format check/fix: `npx prettier -c .` / `npx prettier -w .`.

## Coding Style & Naming Conventions
- Indentation: 2 spaces, UTF-8, trim trailing whitespace; final newline (see `.editorconfig`).
- Prettier: width 80, semicolons, single quotes, `trailingComma: es5`.
- File naming: generators `*-schema.mjs` → outputs `*.schema.json`; test specs `*.pest.yaml`.
- Keep scripts small and composable; prefer `.mjs` and ES modules.

## Testing Guidelines
- Framework: baldrick-pest (YAML-driven acceptance tests in `pest-spec/`).
- Add new specs under `pest-spec/` and fixtures in `pest-spec/fixtures/`.
- Snapshots live in `pest-spec/snapshots/`; review diffs when they change.
- Aim for representative coverage of CLI behaviors and schema generation paths.

## Commit & Pull Request Guidelines
- Commit style: Prefer Conventional Commits (`feat(scope): ...`, `fix(scope): ...`, `chore: ...`).
- PRs: include a clear description, linked issues, and steps to reproduce.
- When schemas or snapshots change, include the command used and a summary of the impact.
- Ensure Prettier passes and acceptance tests are green before requesting review.
