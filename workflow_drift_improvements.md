# Workflow Drift Improvements

This document highlights pragmatic fixes based on drift between each repo’s broth (`temp/workflows/<repo>__<lang>.yaml`) and the canonical `data/<lang>/baldrick-broth.yaml`. Task names are preserved; only behavior/content is adjusted. “Small improvements” are intentionally out of scope.

## TypeScript (ts)
Affected repos (remove zest + jest):
- baldrick-broth, baldrick-doc-ts, baldrick-pest, baldrick-zest-mess, fairlie-functional, faora-kai, incy-wincy-code-bite, lunar-diamond-engraving, lunar-multiple-prism-beam, lunar-obsidian-crypt, pico-accountancy

Changes
- Remove Test/spec (zest) task and any zest references under Release/ready (has-zest-files, should-run-zest, zest run, report rows mentioning zest).
- Remove Test/jest (deprecated).
- Keep Test/unit, Test/pest, Test/pest1, and Test/cli.

Notes
- Some repos contain an accidental command `run: npx npx baldrick-broth@latest test spec`; dropping zest removes this entirely.

## Dart (dart)
Observed
- No zest/jest occurrences; publish flow present but “publish” step often lacks concrete `dart pub publish` details.

Changes
- Keep existing Release/publish entry but ensure dry-run is enforced by default (manual follow‑up can add the exact publish command in each repo if required). No task rename.

## Go (go)
Observed
- Publish uses build + `gh release` artifacts, no zest/jest present.

Changes
- None required from drift review.

## Unknown language (needs classification)
Repos
- ai-content, baldrick-reserve, beaming-well-of-mimir, beaming-yggdrasil, elegant_fragment_copperframe, overview

Changes
- Add Markdown workflow (md/check + md/fix) where missing. Found missing in: baldrick-reserve.
- Classify language via sentinel files and realign to the matching canonical broth (ts/go/dart). No task renames; copy canonical task blocks into the repo broth as needed.

## Summary of actions
- TS: remove zest and jest across 11 repos; keep unit/pest.
- Dart: keep as‑is; consider adding explicit `dart pub publish --dry-run` within existing publish step (same task name).
- Go: no change.
- Unknown: add md workflow (at least for baldrick-reserve) and align to canonical once language is confirmed.
