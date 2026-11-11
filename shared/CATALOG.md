# Shared file catalog

These files are the source of truth for unchanged copies in the listed consumer
repositories. Use `shared/<language>/<profile>/<consumer-relative-path>` for new
curated entries. Legacy templates remain separate and are not implicitly managed.

## Thoth metadata pipelines

Run these configs from the consumer repository root using
`thoth run --config <filename>`. They require Thoth with input-pipeline/Lua/shell
support, `/bin/sh`, Node.js 24+, npm/npx, and the `maat-ostraca` package. The
package is currently unpinned and may require npm registry access. Output goes
to `thoth-meta/` (durable YAML) and `temp/` (debug JSON); consumers should ignore
the debug directory. No executable bit is required for these CUE files.

| Canonical path | Purpose | Verified consumers |
| --- | --- | --- |
| `go/all/pipeline-go-maat.thoth.cue` | Go production imports and function names | `flarebyte/gh-arrow`, `flarebyte/gh-flarebyte`, `flarebyte/baldrick-flying-buttress` |
| `go/all/pipeline-go-test-maat.thoth.cue` | Go test imports and function names | `flarebyte/gh-arrow`, `flarebyte/gh-flarebyte`, `flarebyte/baldrick-flying-buttress` |
| `typescript/cli/pipeline-ts-e2e-maat.thoth.cue` | Imports and test titles from `e2e/**/*.test.ts` and `e2e/**/*.suite.ts` | `flarebyte/gh-flarebyte`; `flarebyte/gh-arrow` retains an identical inactive copy |

Verification: every listed consumer copy was compared byte-for-byte with the
promoted file in sibling checkouts. Go source/test layouts were inspected in
`gh-arrow` and `gh-flarebyte`; the latter has matching TypeScript e2e files.
The two Go pipelines previously generated 27 successful analysis records for
`gh-arrow`. No TypeScript execution or new analysis generation was performed
as part of promotion. Go discovery also includes fixture Go files when present;
consumers must assess that scope before adopting the unchanged config.

The TypeScript pipeline has no matching files in `gh-arrow`; copying or syncing
it does not enable an e2e test workflow there. These pipelines analyze source
structure and do not execute tests. Go method maps and test-case titles are
outside the selected Go rule set. All pipelines keep going on errors; inspect
debug records rather than relying only on populated YAML files.

## Updating consumers

Change the canonical file here, validate the declared consumers, commit and
publish the reserve revision, then update each consumer's immutable commit pin.
Consumer Makefiles should enumerate each source/destination pair explicitly,
provide read-only `reserve-check` and intentional `reserve-sync` targets, and
keep sync separate from builds and tests. Sync replaces the listed local files.
Use a dedicated empty Arrow mapping config so global working-tree mappings
cannot override a pinned remote source. Do not automatically reverse-sync local
changes. `gh-arrow` is the initial consumer with managed Makefile sync targets;
other verified copies have not been migrated to managed sync by this change.
