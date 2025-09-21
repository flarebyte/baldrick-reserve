# baldrick-reserve

Templates, schemas, and acceptance tests used across the Baldrick toolchain.

## Overview
- Templates: Handlebars scaffolds for TypeScript, Dart, and Go (`template/*`).
- Schemas: Zod-based generators that emit JSON Schemas (`reserve-schema/*`).
- Tests: YAML-driven acceptance tests using baldrick-pest (`pest-spec/*`).
- Data: Language presets and broth snippets consumed by templates (`data/*`).
- Workflows: Declarative tasks orchestrated by baldrick-broth (`baldrick-broth.yaml`).

## Quick Start
- Run acceptance tests (TS + Dart):
  - `npx baldrick-broth@latest test pest`
- Generate all JSON Schemas defined here:
  - `npx baldrick-broth@latest generate schema`
  - Note: the TypeScript broth schema generator expects dev deps `zod@3.24.x` and `zod-to-json-schema@3.x`. If needed: `npm i -D zod@3.24.1 zod-to-json-schema@3.24.6` and then `npx zx reserve-schema/typescript-broth-schema.mjs`.
- Render a README from a broth model:
  - `npx baldrick-whisker@latest render baldrick-broth.yaml github:flarebyte:baldrick-reserve:template/ts/readme.hbs README.md`

## Project Layout
- `template/ts`, `template/dart`, `template/go`: README, maintenance, technical design, license, agents, etc.
- `reserve-schema/`: `*-schema.mjs` → `*.schema.json` (zod + zod-to-json-schema).
- `pest-spec/`: `*.pest.yaml` specs with `fixtures/` and `snapshots/`.
- `data/`: language presets (e.g., TS Biome config, workflow templates).
- `script/`: helper zx scripts (scaffolding, dependencies, reporting).

## Contributing
- Please read `AGENTS.md` (contributor guide).
- See analysis docs for context and decisions:
  - `CODE_ANALYSIS.md`
  - `workflow_code_analysis.md`
  - `workflow_drift_improvements.md`

## Use From Other Repos
Reference these templates directly in your broth with baldrick-whisker.

- Generate a README (TypeScript):
  - `npx baldrick-whisker@latest render baldrick-broth.yaml github:flarebyte:baldrick-reserve:template/ts/readme.hbs README.md`
- Generate docs (Dart/Go):
  - `npx baldrick-whisker@latest render baldrick-broth.yaml github:flarebyte:baldrick-reserve:template/dart/readme.hbs README.md`
  - `npx baldrick-whisker@latest render baldrick-broth.yaml github:flarebyte:baldrick-reserve:template/go/readme.hbs README.md`
- Typical broth step (YAML):
  -
    title: Create README.md\n
    run: npx baldrick-whisker@latest render baldrick-broth.yaml\n
      github:flarebyte:baldrick-reserve:template/ts/readme.hbs\n
      README.md

## Requirements
- Node.js 22+ is recommended for local scripts and CI parity.
- The CLIs used here are fetched via `npx`: `baldrick-broth`, `baldrick-whisker`, `baldrick-pest`, and `zx`.

## License
MIT — see `LICENSE`.
