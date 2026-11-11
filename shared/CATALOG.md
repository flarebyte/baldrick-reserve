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

## Python Thoth metadata pipelines

| Canonical path | Purpose | Verified consumers |
| --- | --- | --- |
| `python/all/pipeline-python-maat.thoth.cue` | Python source imports, functions, methods, and classes | `flarebyte/astrea-fake-mail-generator` |
| `python/all/pipeline-python-test-maat.thoth.cue` | Python test symbols and statically detected test titles | `flarebyte/astrea-fake-mail-generator` |

Run from the consumer root with `thoth run --config <filename>`. Requirements:
Thoth with input-pipeline/Lua/shell support, `sh`, Node.js 24+, and npm/npx.
These pipelines pin `maat-ostraca@0.9.0`; the initial run needs npm registry
access. They analyze source statically without importing or executing Python.
No executable bit is required.

Discovery respects `.gitignore`, excludes common virtual environments and build
outputs, and does not assume a package name or `src/` layout. Files in `test/`
or `tests/`, or named `test_*.py` or `*_test.py`, use the test pipeline. Other
Python files, including maintenance scripts, use the source pipeline. Repositories
with other test conventions must assess compatibility before adopting these
files unchanged.

Durable YAML goes to `thoth-meta/python/` and `thoth-meta/python-test/`; ignore
debug JSON under `temp/`. Generated symbol lists refresh while curated `purpose`,
`responsibilities`, and `architecture_notes` survive merges. Pipelines fail fast
on analysis errors. Test titles are not a runtime test count. Deleted or moved
source files need explicit metadata cleanup.

Verification: both promoted files match the consumer byte-for-byte. Both
pipelines ran successfully in `astrea-fake-mail-generator`, covering all 22
tracked Python files exactly once, including release scripts, pytest functions,
and unittest methods. A second run preserved structural and curated metadata.
Other Python consumers have not yet been verified. Consumer remote integration
is pending a published immutable reserve commit containing these files.

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
