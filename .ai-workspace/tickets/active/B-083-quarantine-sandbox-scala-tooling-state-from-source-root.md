---
id: B-083
title: Quarantine sandbox Scala tooling state from odd_sdlc source-root
type: bug
ticket_category: sandbox_isolation
status: active
goal: typescript-live-lane-sandbox-integrity
change_intent: Prevent live/sandbox data_mapper Scala tooling from creating or indexing build artifacts at the odd_sdlc source-repo root.
change_class: realization_refactor
re_entry_point: test_harness
affected_boundary: TypeScript live data_mapper harness, sandbox workspace isolation, root-level generated state hygiene, editor/tooling side effects
priority: high
triaged_at: 2026-05-04
created_at: 2026-05-04
updated_at: 2026-05-04
build_tenant: typescript
owner: unassigned
review_status: implemented_pending_proof
governance_scope: STDO Method
intake_source: Live T-109/T-041 data_mapper PTY run inspection found generated Scala tooling state at `/Users/jim/src/apps/odd_sdlc` source-root instead of only under the intended run sandbox.
---

# B-083: Quarantine Sandbox Scala Tooling State From Source Root

## Triage

### First Missing Layer

Test harness / sandbox execution boundary.

The product/source repo must not become the execution workspace for downstream
generated Scala assets. The live data_mapper lane correctly materializes CDME
source and test files under a run sandbox, but Scala tooling state was still
created at the `odd_sdlc` source repo root.

### Lawful Change Class

`realization_refactor`.

No product requirement needs to change. The realization must make the live
harness and any tool probing bind their current working directory, workspace
root, Scala/Bloop/Metals directories, and cache/output locations to the sandbox
or an explicitly ignored scratch location.

## Problem

The source repo currently contains root-level generated Scala tooling state:

- `/Users/jim/src/apps/odd_sdlc/.scala-build/`
- `/Users/jim/src/apps/odd_sdlc/.metals/`

This violates the intended sandbox boundary for installed/live data_mapper
runs. The source repo should carry source, specs, tickets, tests, and expected
test archives. It should not become the active Scala build workspace for
generated downstream product files.

## Evidence

Repository law:

- `/Users/jim/src/apps/odd_sdlc/README.md` says the source repo does not carry
  repo-root `.abiogenesis/` runtime and installed runtime directories belong to
  downstream target workspaces and test sandboxes.
- `/Users/jim/src/apps/odd_sdlc/AGENTS.md` says installed `.genesis/` payloads
  are created only in downstream or sandbox workspaces by the installer.

Observed root-level generated state:

- `.scala-build/.bloop/odd_sdlc_d5c0a6989e.json`
- `.scala-build/.bloop/odd_sdlc_d5c0a6989e-test.json`
- `.metals/metals.log`
- Python-tenant fixture Scala files swept into the same source-root Scala
  tooling workspace:
  - `build_tenants/python/test_env/fixtures/test28_pass2_replay/code/JobSubmitter.scala`
  - `build_tenants/python/test_env/fixtures/test28_pass2_replay/code/Reconciler.scala`
  - `build_tenants/python/test_env/fixtures/test28_pass2_replay/code/SparkMorphismExecutor.scala`

The Bloop files declare:

- `workspaceDir`: `/Users/jim/src/apps/odd_sdlc`
- `directory`: `/Users/jim/src/apps/odd_sdlc/.scala-build`
- source inputs under:
  `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/t109_live_installed_data_mapper_pty/.../workspace/build_tenants/scala_spark/...`
- additional source inputs under:
  `/Users/jim/src/apps/odd_sdlc/build_tenants/python/test_env/fixtures/test28_pass2_replay/code/...`

This proves the source root became the Scala tooling workspace while compiling
or indexing files from a sandboxed installed data_mapper run and unrelated
Python-tenant replay fixtures.

Additional observation:

- `.metals/metals.log` records Metals/Scala CLI indexing sandbox files under
  `build_tenants/typescript/test_env/test_runs/t109_live_installed_data_mapper_pty/.../workspace/build_tenants/scala_spark/...`
  while the workspace root remained `/Users/jim/src/apps/odd_sdlc`.

Negative finding:

- The scan did not find CDME source/test product files directly materialized at
  `/Users/jim/src/apps/odd_sdlc/build_tenants/scala_spark`.
- The leak found in this pass is generated tooling/build-server state, not
  product source files copied into the source repo root.
- The Python fixture files already live in the source tree as test fixtures;
  the bug is not merely their existence. The bug is that source-root Scala
  tooling grouped them with live-run sandbox files into repo-root Bloop/Metals
  state, making fixtures and sandbox product output one apparent Scala project.

## Impact

- Source-root hygiene is compromised by generated build-server state.
- Future scans can confuse sandbox evidence with source-repo state.
- Editor tooling can keep stale Bloop/Metals references to deleted or old test
  run archives.
- Python-tenant replay fixtures can be accidentally treated as part of the
  active TypeScript live data_mapper Scala product workspace.
- Live-test forensic reports can become ambiguous because generated state exists
  both under the intended run sandbox and under the source repo root.
- A later cleanup or release process may accidentally include, preserve, or
  reason from source-root generated state.

## Suspected Cause

Some live-run inspection, Scala compile/probe, editor integration, or worker
tool call used `/Users/jim/src/apps/odd_sdlc` as the Scala CLI / Metals
workspace root while pointing at Scala files inside the run archive.

The Bloop metadata references both the 2026-05-03 T-109 live data_mapper archive
and Python `test28_pass2_replay` fixture Scala files while using `.scala-build`
at the source repo root. That means the execution/tooling boundary was not fully
sandbox-local and not tenant-local.

## Required Fix Direction

1. Identify every TypeScript live/sandbox lane or helper that invokes Scala,
   Bloop, Metals, Scala CLI, `sbt`, or editor/build tooling over generated
   data_mapper files.
2. Ensure those invocations run with `cwd` set to the installed run workspace,
   not `/Users/jim/src/apps/odd_sdlc`.
3. Set tool output/cache/build directories to the run sandbox when the tool
   supports it.
4. Add a source-root hygiene guard that fails if a live/sandbox lane creates
   any of:
   - `.scala-build/`
   - `.metals/`
   - `build_tenants/scala_spark/`
   - repo-root `cdme-*` module directories
   - repo-root `.abiogenesis/` or `.genesis/`
5. Add a source-root Scala workspace guard that fails when generated Bloop,
   Metals, or Scala CLI metadata includes source files from both:
   - `build_tenants/typescript/test_env/test_runs/...`
   - `build_tenants/python/test_env/fixtures/...`
6. Keep existing run archives under
   `build_tenants/typescript/test_env/test_runs/` as valid evidence, but do not
   allow their build/tooling side effects to escape the archive workspace.
7. Update `.gitignore` only as a secondary safety net. Ignore rules are not the
   fix; sandbox-local tool execution is the fix.

## Acceptance Criteria

- AC-1: Running the live data_mapper lane does not create or update
  `/Users/jim/src/apps/odd_sdlc/.scala-build/`.
- AC-2: Running the live data_mapper lane does not create or update
  `/Users/jim/src/apps/odd_sdlc/.metals/`.
- AC-3: Running the live data_mapper lane does not create repo-root
  `build_tenants/scala_spark/` or repo-root `cdme-*` module directories.
- AC-4: A focused hygiene test or post-run guard asserts the above after the
  lane completes or fails.
- AC-5: Legitimate sandbox output remains under the run workspace:
  `build_tenants/typescript/test_env/test_runs/.../workspace/...`.
- AC-6: If Scala/Bloop/Metals probing is intentionally supported, its workspace
  root and generated state are explicitly sandbox-local.
- AC-7: Source-root generated Scala tooling metadata does not group
  Python-tenant fixture Scala files with TypeScript live-run sandbox Scala
  files.

## Non-Closure Conditions

- Closing by deleting `.scala-build/` or `.metals/` once without preventing
  recurrence.
- Closing by adding ignore rules while the harness still writes root-level
  generated state.
- Treating source-root generated tooling state as valid product evidence.
- Moving generated state into another ungoverned source-root cache directory.
- Weakening the live data_mapper proof lane to avoid Scala/test materialization
  rather than sandboxing it correctly.
- Treating `build_tenants/python/test_env/fixtures/test28_pass2_replay/code/*.scala`
  as active live-run product sources or allowing them to be swept into
  source-root Bloop/Metals state during TypeScript live-lane runs.

## Suggested Proof Commands

Use a clean source-root state, then run the focused live lane with a bounded
step budget high enough to reach the component source/test materialization
edges:

```bash
cd /Users/jim/src/apps/odd_sdlc/build_tenants/typescript
ODD_SDLC_TS_T109_DATA_MAPPER_LIVE=1 npm run test:t109:data-mapper-live
```

Then assert from `/Users/jim/src/apps/odd_sdlc`:

```bash
test ! -e .scala-build
test ! -e .metals
test ! -e build_tenants/scala_spark
find . -maxdepth 1 -type d -name 'cdme-*' | grep -q . && exit 1 || exit 0
```

If `.metals/` is considered developer-local and intentionally present, the
harness guard should at minimum assert it was not updated by the live lane and
does not index generated run-archive Scala files from the source root.

Also assert that any Bloop/Metals metadata created by the lane is not rooted at
`/Users/jim/src/apps/odd_sdlc` and does not combine:

- `build_tenants/python/test_env/fixtures/test28_pass2_replay/code/*.scala`
- `build_tenants/typescript/test_env/test_runs/.../workspace/build_tenants/scala_spark/**/*.scala`

## Implementation Slice - 2026-05-04

Changed:

- Python `test28_pass2_replay` Scala fixture files are no longer checked into
  `build_tenants/python/test_env/fixtures/`. The focused Python test now
  synthesizes those replay sources inside its `tmp_path` proving workspace.
- The T-109 live data_mapper harness snapshots source-root generated tooling
  state after install and asserts that each `gaps` / `start` command does not
  create or update root-level sandbox leak paths.
- A non-live B-083 guard test asserts Python fixture trees do not contain
  checked-in `.scala` sources.
- `.gitignore` now ignores Scala/Metals/Bloop/generated root artifacts as a
  safety net only.

Still required for closure:

- remove or quarantine the already-existing local `.scala-build/` and
  `.metals/` generated state before proof
- run the B-083 guard and the live T-109 lane from a clean source-root state
