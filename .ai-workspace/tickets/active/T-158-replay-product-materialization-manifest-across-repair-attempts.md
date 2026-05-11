---
id: T-158
title: Replay product materialization manifest across repair attempts
type: defect
ticket_category: runtime_closure_recovery
status: active
review_status: implemented_pending_live_evidence
goal: post-t157-live-data-mapper-closure-hardening
build_tenant: typescript
owner: odd_sdlc
change_intent: Make product-materialization repair attempts recover closure from admitted materialization evidence instead of requiring the live worker to rewrite every product file to satisfy current-process file observation.
change_class: realization_refactor
re_entry_point: realization
priority: critical
triaged_at: 2026-05-11
created_at: 2026-05-11
implemented_at: 2026-05-11
governance_scope: STDO Method
source_documents:
  - specification/GOALS.md
  - specification/requirements/14-odd-sdlc-installed-product-contract.md
  - .ai-workspace/tickets/completed/T-114-demote-worker-result-report-from-closure-authority.md
  - .ai-workspace/tickets/completed/T-145-replay-visible-closure-and-worker-report-authority-deletion.md
  - .ai-workspace/tickets/completed/T-147-tenant-role-policy-for-product-materialization.md
  - .ai-workspace/tickets/completed/T-157-first-pass-live-product-materialization-closure-contract.md
evidence_archive:
  root: build_tenants/typescript/test_env/test_runs/full_external_data_mapper_sandbox/20260511T112004427Z_pid37576
  authority_initial: build_tenants/typescript/test_env/test_runs/full_external_data_mapper_sandbox/20260511T112004427Z_pid37576/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260511T112009187Z_pid37753
  authority_repair: build_tenants/typescript/test_env/test_runs/full_external_data_mapper_sandbox/20260511T112004427Z_pid37576/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260511T113020103Z_pid37753
  materialization_initial: build_tenants/typescript/test_env/test_runs/full_external_data_mapper_sandbox/20260511T112004427Z_pid37576/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260511T115210348Z_pid99774
  materialization_trace_repair: build_tenants/typescript/test_env/test_runs/full_external_data_mapper_sandbox/20260511T112004427Z_pid37576/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260511T120614766Z_pid99774
  materialization_manifest_repair_timeout: build_tenants/typescript/test_env/test_runs/full_external_data_mapper_sandbox/20260511T112004427Z_pid37576/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260511T121340211Z_pid99774
affected_boundary:
  - build_tenants/typescript/code/src/operator/handoff.ts
  - build_tenants/typescript/code/src/operator/installed_operator.ts
  - build_tenants/typescript/code/src/operator/traversal_consequence.ts
  - build_tenants/typescript/test_env/live/run_full_external_data_mapper_sandbox.mjs
  - build_tenants/typescript/test_env/tests/
implementation_refs:
  - build_tenants/typescript/code/src/operator/handoff.ts
  - build_tenants/typescript/test_env/tests/test_t066_product_materialization_contract.test.mjs
  - build_tenants/typescript/test_env/tests/test_t091_traversal_obligation_payload.test.mjs
---

# T-158: Replay Product Materialization Manifest Across Repair Attempts

## Implementation Update: 2026-05-11

Implemented the contained replay fix in the TypeScript handoff/postflight
surface.

The deterministic regression is:

- `T-158 product materialization repair replays prior same-edge manifest`
- file:
  `build_tenants/typescript/test_env/tests/test_t066_product_materialization_contract.test.mjs`

The test reproduces the failure shape without a live worker:

1. first same-edge attempt writes a tenant-root source file and writes
   `product_materialization_manifest.json`
2. second same-edge repair writes only the output/proof artifact and reports
   `materializedFiles: []`
3. postflight must not emit `materialized_product_files_missing`
4. the repair attempt's effective manifest must record replay lineage to the
   predecessor product materialization manifest

Runtime behavior now resolves an effective worker report for product
materialization validation. Replay is only attempted when the current product
materialization report is missing required product files or roles. A predecessor
manifest is eligible only when the sibling archive handoff matches workspace
root, graph function, edge, vector, and target asset type, and the predecessor
materialization contract matches tenant root, selected output root, required
roles, declared modules, and execution contracts.

The effective manifest is written back with a `replay` block carrying lineage
refs and file counts. Replayed files still pass through the normal postflight
path, digest, byte-count, role-policy, declared-target, and tenant-root checks;
stale or mismatched predecessor evidence therefore fails closed instead of
silently satisfying closure.

Verification run from `build_tenants/typescript`:

```bash
npm run build:semantic
node --test --test-name-pattern "T-158" test_env/tests/test_t066_product_materialization_contract.test.mjs
npm run test:t066
node --test test_env/tests/test_t143_product_materialization_authority_targets.test.mjs test_env/tests/test_t147_tenant_role_policy_materialization.test.mjs
npm run test:semantic
```

Observed result:

- T-158 focused regression: passed
- T-066 suite: 34/34 passed
- T-143/T-147 focused product-target and role-policy suites: 20/20 passed
- semantic suite: 428/428 passed

This ticket remains active pending a fresh live `data_mapper` run. The live lane
must show terminal closure or a typed non-close disposition with postflight and
assurance carriers; a harness timeout with missing postflight files is still not
closure evidence.

## Additional Runtime Bug: Requirement Section Payload Loss

A later fresh full external `data_mapper` live run on 2026-05-11 stopped before
product materialization:

```text
command: npm run live:data-mapper-sandbox
archive: build_tenants/typescript/test_env/test_runs/full_external_data_mapper_sandbox/20260511T131501369Z_pid22068
failure: step-01-start-Fg_conform_project_authority
exit: 2
error: traversal obligation payload insufficient: requirement:workspace.stage_01_acc_requirements.req_acc_004
```

This was a second runtime recovery bug under the same live `data_mapper`
closure hardening ticket. The authority repair had produced a concrete
canonical requirement section:

```text
## REQ-ACC-004

**Description**: A run CANNOT be marked COMPLETE unless the accounting invariant verification passes.
```

The handoff payload builder only treated same-line requirement markers as
concrete. A canonical markdown section whose heading carried the requirement ID
and whose body carried the requirement text was misclassified as
`reference_only`. The strict handoff guard then failed closed before the next
authority worker invocation.

The contained fix is in `build_tenants/typescript/code/src/operator/handoff.ts`:
canonical requirement headings now derive a concrete snippet from section body
text, preferring `**Description**:` and otherwise the first non-metadata body
line. Marker-only requirements still fail closed.

Regression:

- `T-091 treats canonical requirement sections with body text as concrete traversal pressure`
- file:
  `build_tenants/typescript/test_env/tests/test_t091_traversal_obligation_payload.test.mjs`

Archive replay check against
`20260511T131501369Z_pid22068/workspace` now derives:

```json
{
  "status": "concrete",
  "snippet": "REQ-ACC-004: A run CANNOT be marked COMPLETE unless the accounting invariant verification passes."
}
```

`assertTraversalIntentPackagePressure` passes over that preserved workspace.

## STDO Triage

Smallest lawful re-entry: `realization_refactor`.

The product intent, product target derivation, and worker prompt closure law are
not repriced by this ticket. The defect is in the TypeScript runtime closure
and recovery mechanics after a product-materialization attempt has already
admitted product files and execution evidence.

If implementation discovers that the current consequence carriers cannot
represent carried-forward materialization inventory or role policy, that finding
must be recorded before widening this ticket to `design_reframe`.

## Failure Summary

A fresh full external `data_mapper` live run on 2026-05-11 did not close. The
outer live sandbox timed out on `Fg_materialize_declared_product_asset`:

```text
command: npm run live:data-mapper-sandbox
archive: build_tenants/typescript/test_env/test_runs/full_external_data_mapper_sandbox/20260511T112004427Z_pid37576
failure: step-02-start-Fg_materialize_declared_product_asset
signal: SIGTERM
error: spawnSync .../node_modules/.bin/odd-sdlc-ts ETIMEDOUT
startedAt: 2026-05-11T11:52:10.159Z
endedAt: 2026-05-11T12:37:10.073Z
wall: real 4627.28s
```

This was not a Scala product build failure. The generated `scala_spark`
tenant compiled and tested successfully. The live run failed because recovery
from a materialization-reporting gap forced a live worker rewrite loop instead
of deterministic replay from admitted evidence.

## Edge Walk

### `Fg_conform_project`

Archive:
`20260511T112007053Z_pid37722`

Result: converged.

No product-materialization exposure on this edge.

### `Fg_conform_project_authority` initial attempt

Archive:
`20260511T112009187Z_pid37753`

Observed evidence:

- `worker_run.json`: `elapsedMs: 610851`, `status: 0`
- `postflight.json`: `status: passed`
- `assurance_postflight.json`: `status: blocked`
- `gap_dossier.json`: `reasonCount: 54`

Representative blocking reasons:

- `obligation_assessment_blocked:requirement:workspace.mapper_requirements.req_ldm_004_a`
- `obligation_assessment_blocked:requirement:workspace.mapper_requirements.req_pdm_002_a`
- `obligation_assessment_blocked:requirement:workspace.mapper_requirements.req_typ_003_a`
- `obligation_assessment_blocked:requirement:workspace.requirements.req_cov_002`

### `Fg_conform_project_authority` repair

Archive:
`20260511T113020103Z_pid37753`

Observed evidence:

- `worker_run.json`: `elapsedMs: 1309501`, `status: 0`
- `postflight.json`: `status: passed`
- run summary recorded `assurance: close_allowed`

The run lawfully advanced to the product materialization edge.

### `Fg_materialize_declared_product_asset` initial attempt

Archive:
`20260511T115210348Z_pid99774`

Observed evidence:

- `worker_run.json`: `elapsedMs: 844164`, `status: 0`
- `worker_result_report.json`: `materializedFiles.length: 37`
- `product_materialization_manifest.json`: `files.length: 37`
- `executionEvidence.status: succeeded`
- `executionEvidence.testsObserved: 69`
- `executionEvidence.passedCount: 69`
- `executionEvidence.failedCount: 0`
- `postflight.json`: `status: passed`
- `assurance_postflight.json`: `status: blocked`
- `gap_dossier.json`: `reasonCount: 303`

Shard evidence recorded in the report:

| Shard | Tests | Result |
|---|---:|---|
| `cdme-compiler` | 14 | passed |
| `cdme-adjoint` | 12 | passed |
| `cdme-assurance` | 9 | passed |
| `cdme-executor` | 7 | passed |
| `cdme-accounting` | 9 | passed |
| `cdme-fidelity` | 9 | passed |
| `cdme-engine` | 9 | passed |

Representative assurance blocking reasons:

- `obligation_assessment_blocked:requirement:workspace.goals.req_trv_005`
- `obligation_assessment_blocked:requirement:workspace.mapper_requirements.req_acc`
- `obligation_assessment_blocked:requirement:workspace.mapper_requirements.req_adj`
- `obligation_assessment_blocked:requirement:workspace.mapper_requirements.req_bt`
- `obligation_assessment_blocked:requirement:workspace.mapper_requirements.req_cov`

The initial product materialization was mechanically valid but did not carry
exact requirement trace evidence for the full cumulative obligation context.

### `Fg_materialize_declared_product_asset` trace repair

Archive:
`20260511T120614766Z_pid99774`

Observed evidence:

- `worker_run.json`: `elapsedMs: 444738`, `status: 0`
- `executionEvidence.status: succeeded`
- `executionEvidence.testsObserved: 69`
- `executionEvidence.passedCount: 69`
- `executionEvidence.failedCount: 0`
- `worker_result_report.json`: `materializedFiles.length: 0`
- `product_materialization_manifest.json`: `files.length: 0`
- `postflight.json`: `status: blocked`
- `gap_dossier.json`: `reasonCount: 2`

Blocking reasons:

- `materialized_product_files_missing`
- `materialized_product_role_missing:source`

This attempt repaired the trace carrier but did not rewrite the 37 product
source/build files. The runtime then treated current-attempt file observations
as the entire materialization inventory and erased the previously admitted
manifest from the postflight view.

### `Fg_materialize_declared_product_asset` manifest repair timeout

Archive:
`20260511T121340211Z_pid99774`

Observed evidence before timeout:

- 37 source/build files were rewritten in the active attempt.
- `build_tenants/scala_spark/design/component_code_surface.md` was rewritten.
- The rewritten artifact contains `runId: 20260511T121340211Z_pid99774`.
- The artifact records `sbt test`, `testsObserved: 69`, `passedCount: 69`,
  `failedCount: 0`.

Missing because the outer harness timed out first:

- `worker_run.json`
- `worker_result_report.json`
- `product_materialization_manifest.json`
- `postflight.json`
- `assurance_postflight.json`
- `gap_dossier.json`

The live worker was killed by the outer harness after 45 minutes. A leaked PTY
worker remained and was manually terminated after the run failed.

## Root Cause

The closure runtime treats product materialization files as current-attempt
write observations, then uses that current-attempt inventory as if it were the
complete product materialization truth.

That is lawful on a first materialization attempt. It is defective on a repair
attempt whose purpose is to repair a proof carrier, trace register, or report
surface while preserving already materialized product files.

The specific failure chain was:

1. Initial materialization wrote 37 product files and proved `sbt test` 69/69.
2. Assurance rejected trace coverage, not product materialization.
3. The repair updated the trace carrier and preserved test evidence but did not
   rewrite the unchanged product files.
4. The runtime generated `product_materialization_manifest.json` from only the
   repair attempt's current write observations.
5. The manifest became `files: []`.
6. Postflight failed on `materialized_product_files_missing` and
   `materialized_product_role_missing:source`.
7. The next repair forced the live worker to reread and rewrite every product
   file purely to satisfy observation mechanics.
8. That live-agent rewrite loop exceeded the harness timeout before closure
   carriers were produced.

This contradicts the current one-truth-surface direction in `GOALS.md`:
closure should derive from admitted ledger/event/consequence truth, not from a
raw current-run observation set that loses predecessor evidence.

## Target Truth

Product-materialization repair attempts consume replay-visible predecessor
materialization truth.

When a prior attempt on the same edge has admitted product materialization
files, role policy, target binding, output root, and digest evidence, a repair
attempt that only changes proof/trace/report carriers must not be required to
rewrite unchanged product files.

The closure runtime shall either:

- carry forward the prior admitted `product_materialization_manifest.json`
  entries and role policy into the repair attempt's fulfillment ledger; or
- deterministically reconstruct the effective manifest from the prior admitted
  materialization ledger plus current repair outputs; or
- fail closed immediately with a typed runtime diagnostic when no reachable
  admitted predecessor manifest exists.

It must not silently collapse the effective manifest to `files: []` merely
because the repair worker did not rewrite unchanged source files.

## Required Design Constraints

- Do not restore `worker_result_report.json` as closure authority. T-114 and
  T-145 remain governing: worker reports are compatibility/read-model
  artifacts unless admitted through typed runtime truth.
- Do not hide data_mapper-specific rules in `odd_sdlc` core. The fix is generic
  for product-materialization repairs.
- Do not suppress `materialized_product_files_missing`. If no prior admitted
  materialization exists, the block remains correct.
- Do not use conversational memory, PTY session memory, or worker prose as
  proof of materialized files.
- Preserve distinct per-attempt archives. Carry-forward truth must be visible
  as predecessor evidence, not by overwriting the prior archive.
- Preserve tenant role policy from admitted materialization truth. Do not
  rederive role policy from path or text patterns at repair validation time.

## Candidate Implementation Direction

1. In product-materialization postflight, resolve the current attempt's
   predecessor closure/consequence chain for the same graph function, vector,
   edge, target asset type, tenant output root, and target binding.
2. If the current attempt has no materialized source files but the retry reason
   is proof/trace/report repair, load the prior admitted product materialization
   manifest from the predecessor chain.
3. Build an effective materialization manifest:
   - prior admitted product files
   - current attempt product files
   - current output artifact and digest
   - replay-visible source refs to every predecessor carrier used
4. Preserve role policy from the admitted materialization carrier and replay it
   during validation.
5. Emit typed diagnostics:
   - `materialized_product_manifest_replayed_from_predecessor`
   - `materialized_product_manifest_predecessor_missing`
   - `materialized_product_manifest_replay_target_mismatch`
   - `materialized_product_manifest_replay_role_policy_mismatch`
6. Keep compatibility `product_materialization_manifest.json` and
   `worker_result_report.json` files, but generate them from the effective
   admitted truth rather than from worker prose.
7. Add timeout/yield handling so a live worker killed by the outer harness
   returns a replay-visible failed/yielded consequence and cleans PTY children.

## Closure Criteria

- A deterministic fixture reproduces the exact failure shape:
  - attempt 1 writes product files and passes product postflight
  - assurance blocks on trace coverage
  - attempt 2 repairs only the trace/output artifact
  - attempt 2 does not rewrite product source files
  - postflight still sees the effective prior materialization manifest and does
    not emit `materialized_product_files_missing`
- The effective manifest records predecessor refs to the prior admitted
  materialization evidence.
- Role satisfaction for `source` is replayed from the admitted materialization
  role policy, not rederived from path strings during repair validation.
- If target binding, output root, graph function, vector, edge, or target asset
  type differs, manifest replay fails closed with a typed reason.
- A negative test proves that no predecessor manifest still blocks with
  `materialized_product_files_missing`.
- A negative test proves that a mismatched predecessor manifest cannot satisfy
  a different tenant or target.
- The live data_mapper lane no longer needs to reread/rewrite all product
  files to repair trace-only closure gaps.
- A fresh live data_mapper run closes or stops on a typed non-close
  disposition, never on an outer harness timeout with no postflight carrier.
- Leaked PTY workers are cleaned when the outer harness times out or kills the
  installed command.

## Non-Closure Conditions

- The fix increases the materialization timeout and leaves replay semantics
  unchanged.
- The fix teaches the worker to rewrite all files again as the normal repair
  path.
- The fix accepts `materializedFiles: []` as successful product
  materialization.
- The fix treats `worker_result_report.json` prose as closure authority.
- The fix is specific to the `data_mapper` template or Scala/SBT paths.
- The fix hides carried-forward files in a compatibility manifest without
  replay-visible predecessor refs.

## Review Questions

- Should the effective materialization manifest live on
  `SdlcEdgeFulfillmentLedger`, `SdlcEdgeClosureDecision`, or a product
  materialization subcarrier consumed by both?
- Does T-147's role-policy carrier already provide the replay-visible role
  policy needed here, or does the implementation need a small extension?
- Should timeout cleanup be handled in this ticket or split if the manifest
  replay fix is otherwise narrow?

## Verification Plan

Run from `build_tenants/typescript`:

```bash
npm run build:semantic
```

```bash
node --test test_env/tests/test_t158_product_materialization_manifest_replay.test.mjs
```

```bash
npm run test:semantic
```

Closure evidence must also include a fresh live data_mapper run:

```bash
/usr/bin/time -p env TERM=xterm-256color npm run live:data-mapper-sandbox
```

The live proof is accepted only if it produces a terminal closure or a typed
non-close disposition with postflight/assurance carriers. Harness timeout with
missing postflight files is not closure.
