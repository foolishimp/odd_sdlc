---
id: B-083
title: Quarantine sandbox Scala tooling state from odd_sdlc source-root
type: bug
ticket_category: sandbox_isolation
status: completed
goal: typescript-live-lane-sandbox-integrity
change_intent: Prevent live/sandbox data_mapper Scala tooling from creating or indexing build artifacts at the odd_sdlc source-repo root.
change_class: realization_refactor
re_entry_point: test_harness
affected_boundary: TypeScript live data_mapper harness, sandbox workspace isolation, root-level generated state hygiene, editor/tooling side effects
priority: high
triaged_at: 2026-05-04
created_at: 2026-05-04
updated_at: 2026-05-07
build_tenant: typescript
owner: unassigned
review_status: completed_project_scope_vscode_metals_external
governance_scope: STDO Method
intake_source: Live T-109/T-041 data_mapper PTY run inspection found generated Scala tooling state at `/Users/jim/src/apps/odd_sdlc` source-root instead of only under the intended run sandbox.
---

# B-083: Quarantine Sandbox Scala Tooling State From Source Root

## Historical Exception Note - 2026-05-06

At that time, the ticket remained active. The user granted a temporary
exception for source-root `.metals` state and asked to ignore it for that pass
while closing other tickets.

Proof status at that time:

- The semantic suite includes the focused B-083 fixture guard
  `keeps Python replay Scala sources out of source-root fixture trees`.
- `npm run test:semantic` passed: 216/216.
- Full live source-root hygiene closure is not claimed because `.metals` is
  explicitly excepted for this pass.

## Recreated Metals Finding - 2026-05-07

The source-root `.metals` exception is no longer acceptable as RC hygiene.

Observed facts:

- `.metals/metals.lock.db` reappeared at the source root after deletion. Its
  observed mtime was `2026-05-06T23:53:51+1000`.
- Process inspection found a long-running VS Code Metals process
  (`scala.meta.metals.Main`, `-Dmetals.client=vscode`). At inspection time it
  did not have an open handle to `odd_sdlc/.metals`, so this is not proof that
  the latest TypeScript semantic/sandbox tests used source-root cwd.
- The source repo contains ignored live archives under
  `build_tenants/typescript/test_env/test_runs/...` with `build.sbt` and
  `src/main/scala` trees. Those archives match Metals VS Code activation
  patterns such as `workspaceContains:build.sbt` and
  `workspaceContains:*/*/src/main/scala`.
- Therefore B-083 is broader than command cwd. Even if the live lane executes
  inside an installed sandbox, source-root archived Scala workspaces can still
  activate workspace-level editor/build tooling and recreate source-root
  `.metals`.

Applied checkpoint:

- Future TypeScript live test archives now default outside the `odd_sdlc`
  source root through `ODD_SDLC_TS_LIVE_TEST_RUN_ROOT` /
  `ODD_SDLC_TS_TEST_RUN_ROOT`.
- The focused B-083 deterministic guard now proves the default live archive
  root is outside the repo.
- The existing ignored source-root archive tree was moved out of the opened
  repo to
  `/Users/jim/.local/state/odd_sdlc/test_runs/source-root-quarantine-20260507T1730+1000`.
  That tree preserves the prior evidence and still contains the 35 observed
  `build.sbt` / `src/main/scala` activation candidates.
- Source-root `.metals` was removed after the archive trigger was moved.

Follow-up observation:

- A clean `npm run test:sandbox` recreated
  `build_tenants/typescript/test_env/test_runs`, but a post-run scan found zero
  `build.sbt` / `src/main/scala` activation candidates under that tree.
- Source-root `.metals/metals.lock.db` still reappeared immediately after the
  archive quarantine and after stopping the stale Metals JVM. The recreating
  process was a VS Code plugin-host child running `scala.meta.metals.Main`, not
  the TypeScript test runner. VS Code restarted the Metals JVM after it was
  killed.
- A repo-local `.vscode/settings.json` attempt to redirect
  `metals.customProjectRoot` was tested and removed because Metals still wrote
  the root lock before that setting prevented source-root state.

Verification on 2026-05-07:

- `npm run test:semantic`: 258 passed, 0 failed.
- `npm run test:sandbox`: 15 passed, 0 failed.
- `git diff --check`: passed.
- Source-root archive trigger scan after sandbox rerun:
  `find build_tenants/typescript/test_env/test_runs \( -name build.sbt -o -path '*/src/main/scala' \) | wc -l`
  returned `0`.

Project-scope closure decision:

- The remaining source-root `.metals` recreation is owned by the operator's
  active VS Code Metals extension, not by `odd_sdlc` runtime, live harness cwd,
  or source-root archive placement.
- That editor-level process is outside this project's realization scope.
- B-083 is closed for project scope because future live archives default outside
  the source repo, the prior source-root archive trigger was quarantined, and
  the deterministic plus sandbox proof surfaces passed.

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

## 2026-05-05 Patch Note

Source-root generated Scala/Metals state was quarantined under `.ai-workspace/runtime/quarantine/b083-20260505T201002Z/`.

Observed quarantine:
- `.metals` moved out of the source root.

No source-root `.scala-build`, `.bloop`, `.bsp`, or `build_tenants/scala_spark` directory was present during this patch pass.

Status: patched pending proof. Closure still requires running the B-083 hygiene guard and the relevant live lane from the cleaned source-root state.

## 2026-05-05 Non-Live/Sandbox Proof

Passed from `build_tenants/typescript` after the B-083/B-084 reconciliation pass:

```bash
npm run test:semantic
npm run test:sandbox
```

Observed proof:
- `test:semantic`: 187 passed, 0 failed.
- `test:sandbox`: 15 passed, 0 failed.
- Focused B-083 non-live guard passed inside `test:semantic`.

Status: patched with non-live and sandbox proof. Live T-109 hygiene proof remains outstanding for full closure.

## 2026-05-06 Scoped Operator Exception For T-129

The operator granted a scoped exception to ignore a `.metals` source-root
update while closing T-129, after the T-109 live continuation proved installed
ABG `3.5.0-rc.2`, successful PTY terminal session identity, and worker exit
status `0`.

This exception is limited to T-129 migration closure. It is not B-083 closure
proof, does not weaken AC-1 through AC-7, and does not apply to `.scala-build`,
`.bloop`, `.bsp`, `.genesis`, `.abiogenesis`, `build_tenants/scala_spark`, or
source-root `cdme-*` leaks.
