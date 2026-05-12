---
id: T-158
title: Replay product materialization manifest across repair attempts
type: defect
ticket_category: runtime_closure_recovery
status: active
review_status: deterministic_closure_passed_live_hello_passed_data_mapper_pending
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
  - specification/PRODUCT.md
  - specification/requirements/02-graph-functions.md
  - specification/requirements/10-odd-sdlc-software-domain-buildout.md
  - specification/requirements/12-declarative-operational-state-transitions.md
  - specification/requirements/13-odd-sdlc-typescript-tenant.md
  - specification/requirements/14-odd-sdlc-installed-product-contract.md
  - specification/requirements/15-odd-sdlc-scheduling-phase.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_FP_EVALUATION_LEDGER_PURPOSE.md
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
  graph_track_review_data_mapper_terminated: build_tenants/typescript/test_env/test_runs/full_external_data_mapper_sandbox/20260511T172019616Z_pid87986
  hello_world_live_sanity: build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260511T173911536Z_pid83128
  hello_world_worker_read_boundary_violation: build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260511T211334695Z_pid94827
affected_boundary:
  - build_tenants/typescript/code/src/operator/handoff.ts
  - build_tenants/typescript/code/src/operator/installed_operator.ts
  - build_tenants/typescript/code/src/operator/traversal_consequence.ts
  - build_tenants/typescript/code/src/projection/query_domain.ts
  - build_tenants/typescript/code/src/start/public_start.ts
  - build_tenants/typescript/code/src/spec_method/entry.ts
  - build_tenants/typescript/test_env/live/run_full_external_data_mapper_sandbox.mjs
  - build_tenants/typescript/test_env/tests/
implementation_refs:
  - build_tenants/typescript/code/src/operator/handoff.ts
  - build_tenants/typescript/code/src/graph/boundary_refs.ts
  - build_tenants/typescript/code/src/operator/installed_operator.ts
  - build_tenants/typescript/code/src/operator/traversal_consequence.ts
  - build_tenants/typescript/code/src/projection/query_domain.ts
  - build_tenants/typescript/code/src/spec_method/entry.ts
  - build_tenants/typescript/code/src/start/public_start.ts
  - build_tenants/typescript/test_env/tests/test_t066_product_materialization_contract.test.mjs
  - build_tenants/typescript/test_env/tests/test_t158_consequence_admission_regression.test.mjs
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

## Additional Runtime Bug: Eval Action Replaced Graph Edge Track

A fresh hello-world live run exposed a traversal identity drift introduced by the
Eval_Action wave:

```text
state path: initial_unstructured_docs -> Fg_conform_project -> Fg_conform_project_authority -> next
observed next: Fg_materialize_declared_product_asset
expected next: admitted graph edge track, with Eval_Action selecting the traversal/action for that edge
```

The failure was visible in the preserved live sandbox because product source
(`hello.js`) was created under the generic materialization graph function before
the graph-edge carrier for the component code surface was admitted. That is the
same design-law failure class as controller-side reconstruction: the runtime had
one field for "selected action" and reused it as "next graph target".

Targeted fix:

- `SdlcNextActionProjection.nextGraphFunctionRef` / `nextGraphVectorRef` carry
  the graph edge track that ABG should traverse next.
- `SdlcNextActionProjection.selectedActionRef` remains the Eval_Action result:
  the action/traversal guidance for that edge.
- post-authority product-materialization pressure may select the declared
  materialization action, but it must bind that action to the published graph
  edge that owns the target asset, e.g. `derive_component_code_surface` for
  `component_code_surface`.
- archive replay must fail closed for automatic next-target replay when
  `choosesNextTraversal=true` but `nextGraphVectorRef` is absent. Old action-only
  projections are not authoritative graph-track replay.

Design-module boundary:

This is one carrier seam, not a broad handoff rewrite. The producer, admitted
public-start replay carrier, and replay reader are the only lawful implementation
touches. Handoff, prompt, postflight, and assurance must continue consuming the
resolved execution basis and hook contract; they must not invent their own next
edge.

Implementation closure notes:

- The graph-track carrier now distinguishes the selected materialization action
  from the next graph edge to traverse. For `component_code_surface`, the action
  remains `Fg_materialize_declared_product_asset`, while the graph edge is
  `derive_component_code_surface`.
- Post-action candidates use the published graph-function name as the boundary
  ref. They must not serialize ABG internal graph-function IDs into
  `actionRef`, `targetOutcomeRef`, or `publishedTraversalTargetRef`; the
  data_mapper replay showed those IDs can expand into whole graph-function JSON.
- Installed-start JSON output is a command result, not the proof ledger. The
  serializer now compacts high-volume installed-start reason/evidence carriers
  and points to archive files for large inline carriers. The full proof remains
  in the operator archive; stdout no longer becomes the failure mode.
- The data_mapper regression fixture now validates the graph-edge repair path:
  first traversal fails on the component-code edge, retry context carries that
  prior gap, and the next attempt re-enters `derive_component_code_surface`
  rather than the generic materializer.

## Next Review Update: 2026-05-12 Goals/Product Re-read

This ticket is not ready for live `data_mapper` closure evidence yet.

Authority re-read:

- `GOALS.md` keeps the current loop on admitted ledger/event/consequence truth:
  after work output is admitted, continuation consumes
  `SdlcEdgeFulfillmentLedger -> SdlcEdgeClosureDecision -> SdlcNextActionProjection`;
  summaries, manifests, gap dossiers, archives, and worker reports are raw
  evidence or projections only.
- `PRODUCT.md` defines the installed operator loop as
  `start -> governed graph-function edge -> worker result admission -> runtime
  truth -> gaps`, with the agentic CLI and shell as clients, not second command
  truth or retry/traversal controllers.
- `REQ-F-GFUNC-001/004`, `REQ-F-ODDSDLC-013/014/015/020/021`,
  `REQ-F-ODDSDLC-038`, `REQ-F-ODDSDLC-040/042`,
  `REQ-F-ODDSDLC-051/053/054/055`, and `REQ-F-ODDSDLC-057/059/060` all require
  named graph functions, explicit edge contracts, distinct command/result/read
  models, replay-visible evidence, and no hidden controller-side reconstruction
  of next traversal.
- `DESIGN_MODULE_METHOD.md` makes this a design-method issue, not just a test
  issue: deterministic modules may construct, admit, validate, and project
  carriers, but they must not hide graph traversal, target movement, closure, or
  next-work semantics inside helper fallback logic.

The next round fixes are therefore:

1. **Promote graph-function boundary refs to one admitted carrier/helper.**
   `installed_operator.ts` now has a local `graphFunctionBoundaryRef`, but
   `start/public_start.ts`, `projection/query_domain.ts`, and
   `spec_method/entry.ts` still construct or accept mixed graph-function refs
   from `graphFunction.id`, `graphFunction.name`, or archive compatibility maps.
   This leaves multiple boundary truths in the same graph/action/projection
   seam.

   Fix:

   - define one shared graph-function boundary ref constructor/admission surface
     for published SDLC graph functions
   - use it for `actionRef`, `graphFunctionRef`, `nextGraphFunctionRef`,
     `publishedTraversalTargetRef`, `targetOutcomeRef`, gap dossiers, public
     start candidates, and replay archive reads
   - do not keep permanent dual truth where both ABG internal graph-function IDs
     and published names are accepted as authoritative next-traversal refs
   - if a legacy archive carries only an old graph-function ID, fail closed with
     a typed diagnostic such as `legacy_graph_function_boundary_ref` unless an
     explicit migration carrier is admitted

   Regression:

   - public `start`, public `gaps`, post-action projections, and archive replay
     all emit the same published graph-function boundary ref
   - no `actionRef`, `targetOutcomeRef`, `publishedTraversalTargetRef`,
     `nextGraphFunctionRef`, or `bestGraphFunctionRef` serializes an ABG
     graph-function object or an internal graph-function ID where the published
     SDLC boundary ref is required

2. **Fail closed when product-materialization graph-track binding is unresolved
   or ambiguous.** `deriveSdlcPostProductMaterializationActionInput` still
   produces an executable action when `graphTrackActionTargetFor(...)` returns
   null by falling back to the generic product materializer as the next graph
   function. `graphTrackActionTargetFor(...)` also chooses a first candidate
   when multiple published graph edges target the same asset type.

   Fix:

   - no post-product-materialization action may be returned unless exactly one
     graph-track target is admitted for the downstream target binding
   - zero candidates emits a typed diagnostic such as
     `graph_track_target_unresolved_for_product_materialization_action`
   - multiple candidates emits a typed diagnostic such as
     `graph_track_target_ambiguous_for_product_materialization_action`
   - the generic materializer remains the selected Eval_Action, not the graph
     edge to execute, unless the graph itself declares that edge as the unique
     owner of the target asset

   Regression:

   - duplicate graph functions that output the same asset type do not select the
     first candidate
   - missing graph-track target binding does not execute
     `Fg_materialize_declared_product_asset`
   - the data_mapper component-code path still selects
     `derive_component_code_surface` as graph track and
     `Fg_materialize_declared_product_asset` as selected action guidance

3. **Split compact CLI JSON from the authoritative installed-start outcome.**
   The current serializer compacts high-volume `sdlc_installed_operator_start_outcome`
   payloads while preserving the same carrier kind. That fixes stdout bloat but
   creates a false machine contract: a lossy read model presents itself as the
   full operator outcome.

   Fix:

   - introduce an explicit compact CLI/read-model carrier, for example
     `sdlc_installed_operator_start_cli_projection`
   - include `sourceOutcomeKind`, `archiveRoot`, source carrier refs, omitted
     counts, and `compacted: true`
   - keep the full `sdlc_installed_operator_start_outcome` in the archive as the
     proof carrier
   - plain text output remains concise; JSON output must make projection vs proof
     carrier explicit

   Regression:

   - `ODD_SDLC_TS_OUTPUT=json odd-sdlc-ts start ...` never returns a compacted
     payload with kind `sdlc_installed_operator_start_outcome`
   - compact JSON includes enough archive refs for replay-free diagnosis without
     inlining high-volume proof ledgers
   - full proof remains available in the operator archive

4. **Repair `F_P.evaluate` carrier semantics so report admission is not named
   or statused like closure.** `sdlc_fp_evaluate_result` currently carries
   `stage: "F_P.evaluate"` and `status: passed` when postflight passes, even if
   `obligationAssessmentCounts.blocked` or `unassessed` is non-zero. That is a
   report/admission result, not edge closure.

   Fix:

   - either rename/split the carrier to report-admission semantics, or add a
     distinct semantic status that cannot be `passed` while blocked, partial, or
     unassessed obligations remain
   - keep closure status solely on `SdlcEdgeClosureDecision`
   - keep next-action selection solely on `SdlcNextActionProjection`
   - update tests that currently assert `fp_evaluate_result.status === "passed"`
     to assert report admission separately from closure disposition

   Regression:

   - a worker report with valid JSON/postflight but blocked obligations produces
     an admitted report result plus a retry/block closure decision, not a
     misleading passed evaluation result
   - public `gaps` reads the consequence chain and does not treat
     `fp_evaluate_result.status` as closure authority

5. **Keep the fix generic.** None of these fixes may encode data_mapper,
   Scala/SBT, or one live sandbox's file layout as core SDLC law. Tenant-specific
   build/test grammar belongs in declared tenant capability assets, tenant-local
   validators, or the live agentic builder repair loop.

## Deterministic Closure Update: 2026-05-12

Implemented the next-round T-158 fixes in the TypeScript tenant. This is
deterministic closure evidence only; the ticket remains active until the fresh
live `data_mapper` run named in the closure criteria is captured.

Implemented surfaces:

- `graph/boundary_refs.ts` is the single helper/admission surface for published
  SDLC graph-function boundary refs. Public start, public gaps, post-action
  projections, and archive replay now use published graph-function names as the
  boundary ref instead of ABG internal graph-function IDs.
- `SdlcNextActionProjection.choosesNextTraversal` is true only when
  `selectedActionRef`, `nextGraphFunctionRef`, and `nextGraphVectorRef` are all
  present.
- Archive replay fails closed when `choosesNextTraversal=true` lacks
  `nextGraphVectorRef`, and legacy/internal graph-function refs are rejected
  instead of remapped through a compatibility table.
- Product-materialization replay rows carry per-file provenance:
  `materializationSource`, `sourceManifestRef`, `sourceHandoffManifestRef`,
  `sourceAttemptRef`, `overwritesMaterializationRef`, and `rolePolicyRef`.
- Replay manifest reading distinguishes clean absence from corrupt or mismatched
  replay input with typed blocking reasons.
- Observed unchanged repair files can inherit prior admitted materialization
  role/policy when path and digest match a predecessor row.
- Product-materialization Eval_Action now fails closed when graph-track binding
  is unresolved or ambiguous; it no longer falls back to the broad
  `Fg_materialize_declared_product_asset` graph track.
- Installed-start JSON serialization now emits
  `sdlc_installed_operator_start_cli_projection` for compact CLI JSON and points
  to the full archived `run.json` proof carrier.
- `F_P.evaluate` no longer reports `passed` when admitted report obligations
  remain partial, blocked, or unassessed. It reports
  `admitted_with_open_obligations` while preserving `postflightStatus`.
- Non-close dispatch branches capture the admitted consequence chain before
  returning, and the dispatch outcome evidence reaches the captured
  `SdlcNextActionProjection` ref.

Regression coverage added or updated:

- `T-158 product materialization repair replays prior same-edge manifest`
- `T-158 product materialization repair without predecessor still blocks`
- `T-158 mismatched predecessor materialization cannot satisfy repair`
- `T-158 corrupt predecessor materialization emits replay diagnostic`
- `T-158 F_P.evaluate keeps report admission distinct from open obligation closure`
- `T-158 replayed Eval_Action must carry graph-vector track authority`
- `T-158 product materialization Eval_Action fails closed on unresolved graph track`
- `T-158 product materialization Eval_Action fails closed on ambiguous graph track`
- `T-158 installed operator admits non-close consequence before dispatch return`
- `T-158 installed start JSON serialization emits compact CLI projection`

Verification from `build_tenants/typescript`:

```bash
npm run build:semantic
node --test test_env/tests/test_t158_consequence_admission_regression.test.mjs
npm run test:t066
node --test test_env/tests/test_t064_installed_operator_ux.test.mjs
node --test test_env/tests/test_t076_deterministic_traversal_state_machine.test.mjs test_env/tests/test_t152_data_mapper_transformation_set_partition.test.mjs
npm run test:semantic
```

Observed result:

- `npm run build:semantic`: passed
- T-158 consequence/graph-track suite: 5/5 passed
- `npm run test:t066`: 38/38 passed
- T-064 installed UX suite: 10/10 passed
- T-076/T-152 data_mapper traversal suites: 5/5 passed
- `npm run test:semantic`: 439/439 passed

Live closure evidence remains pending.

## Cross-Agent Review Reconciliation: 2026-05-12

Claude's second review is mostly current against the checkout. The exact line
ranges have drifted slightly, but the underlying seams are valid and must be
closed before T-158 can move to live `data_mapper` evidence.

Accepted blocking fixes:

1. **Replay role policy from prior admission, not from current helper
   derivation.** `operator/handoff.ts` still validates replayed
   materialization files through current declared-target reconciliation and role
   derivation. That preserves useful validation, but it also means the admitted
   prior role policy is not the replay source of truth. The repair must thread
   the prior materialization contract, required roles, target role policy refs,
   and per-file admitted roles through the replay context and validate against
   those admitted values. `materializationRolePolicyForTarget(...)` may be used
   while admitting a new target policy; it must not silently reconstruct policy
   for inherited replay rows.

2. **Preserve per-file materialization lineage.** The current effective
   manifest merger de-duplicates by absolute path and lets a current-attempt row
   replace a replayed row without a per-file provenance record. The top-level
   replay block proves a replay happened, but it does not tell a consumer which
   file row came from the predecessor, which came from the current attempt, or
   which current row intentionally overwrote a replayed predecessor row. Add
   per-file provenance such as `materializationSource`,
   `sourceManifestRef`, `sourceHandoffManifestRef`, `sourceAttemptRef`, and
   `overwritesMaterializationRef`, or admit an explicit overwrite carrier.

3. **Add the missing negative replay tests.** The existing markdown-only
   materialization test proves the base no-product-files block, but T-158 needs
   exact replay negatives:
   - no reachable predecessor manifest leaves
     `materialized_product_files_missing` and role-missing blocks intact
   - predecessor mismatch on tenant root, selected output root, target asset
     type, graph function, edge, vector, role policy, declared modules, or
     execution contracts cannot satisfy the repair attempt

4. **Fail closed on stale next-action replay instead of returning null.**
   `spec_method/entry.ts` currently returns null when an archived
   `sdlc_next_action_projection` has `choosesNextTraversal=true` but lacks
   `nextGraphVectorRef`. That allows the command to fall back to current
   workspace/query-domain derivation. Replace this with a typed diagnostic such
   as `next_action_projection_graph_vector_missing`; an action-only old
   projection is not authoritative replay of graph track.

Accepted medium fixes:

- Strengthen `constructSdlcNextActionProjection`: `choosesNextTraversal` is true
  only when `selectedActionRef`, `nextGraphFunctionRef`, and
  `nextGraphVectorRef` are all present. An admitted Eval_Action without a graph
  track is action guidance, not replayable traversal authority.
- Distinguish clean predecessor absence from corrupt replay input.
  `readProductMaterializationReplayManifest(...)` may return null for a missing
  file, but parse errors, wrong kind, malformed file rows, and structural
  mismatch need typed replay diagnostics so corruption is not hidden behind
  `materialized_product_files_missing`.
- For observed unchanged files on a repair attempt, if the path and digest match
  a prior admitted product materialization row, source the role from prior
  admission instead of re-running path-pattern classification through
  `materializedRoleForObservedFile(...)`.
- In the no-candidates post-action branch, pass explicit
  `nextGraphFunctionRef: null` and `nextGraphVectorRef: null` into
  `constructSdlcNextActionProjection(...)`.
- Structurally pair postflight gap dossier writes with consequence-chain writes.
  Gap dossiers remain subordinate evidence; no branch may persist a dossier
  without either writing the consequence chain in the same logical step or
  failing with a missing-consequence diagnostic.

Accepted nits:

- Tighten `test_t158_consequence_admission_regression.test.mjs` so non-close
  dispatch branches must capture the `publishDispatchState(current)` result and
  prove the captured ref reaches the dispatch outcome.
- Validate execution-contract refs before raw equality comparisons in
  `priorMaterializationContractMatchesCurrent(...)`.
- Add a short code comment where public start sets replay
  `nextGraphVectorRef` to null, documenting that null means "no automatic graph
  track replay; rely on current Eval_Action".

## STDO Triage

Smallest lawful re-entry for manifest replay remains `realization_refactor`.

The graph-boundary and `F_P.evaluate` status repairs are still in the same
runtime-closure seam, but they are no longer mere implementation cleanup. They
must be treated as design-method enforcement over the installed operator,
projection/query, and public-start modules. If the compact CLI JSON carrier
changes the public machine contract, update the installed operator design note
before claiming closure.

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
- Replayed and current materialized file rows carry per-file provenance. A
  current-attempt overwrite of a replayed row is explicit and traceable.
- Observed unchanged files that match a prior admitted path and digest use the
  prior admitted file role and role-policy refs rather than path-pattern role
  derivation.
- If target binding, output root, graph function, vector, edge, or target asset
  type differs, manifest replay fails closed with a typed reason.
- A negative test proves that no predecessor manifest still blocks with
  `materialized_product_files_missing`.
- A negative test proves that a mismatched predecessor manifest cannot satisfy
  a different tenant or target.
- Corrupt or malformed predecessor manifests produce typed replay diagnostics
  and do not collapse into ordinary missing-product-file evidence.
- An archived `SdlcNextActionProjection` with `choosesNextTraversal=true` must
  carry both `nextGraphFunctionRef` and `nextGraphVectorRef`; otherwise replay
  fails closed with a typed diagnostic instead of re-deriving current graph
  track.
- `choosesNextTraversal` is structurally true only when selected action,
  next graph function, and next graph vector are all present.
- No gap dossier write is accepted as a standalone runtime truth surface; it is
  paired with the consequence-chain archive or reported as a missing consequence.
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

## Added Runtime Bug: Late Consequence Admission After F_P.transform

The data_mapper live failure exposed a second closure bug in the same recovery
surface. `F_P.transform` produced a worker result, postflight/assurance admitted
the non-close state, and the installed operator returned a dispatch outcome
whose `resultRef` pointed at the gap dossier. The authoritative consequence
chain was written only after the outer ABG iteration returned.

That made the run vulnerable to losing lawful resume truth if the next
retry/pre-handoff path failed, hung, or was killed after postflight files had
already been written. The archive then contained report, postflight, assurance,
and gap artifacts, but not the replay-visible chain that `gaps` and retry
selection are meant to consume:

```text
SdlcWorksiteEvidence
-> SdlcEdgeFulfillmentLedger
-> SdlcEdgeClosureDecision
-> SdlcNextActionProjection
```

### Root Cause

The installed operator treated `fp_evaluate_result.json` and gap dossiers as
enough post-transform evidence until the outer runner completed. That violates
the TypeScript F_P evaluation design: report admission and gap pressure are not
closure or action-selection authority. The consequence chain is the authority
surface.

### Design Repair

- Publish `SdlcWorksiteEvidence`, `SdlcEdgeFulfillmentLedger`,
  `SdlcEdgeClosureDecision`, and `SdlcNextActionProjection` immediately for
  every admitted F_P dispatch branch.
- Keep ABG `resultRef` semantics intact where it identifies an attached result
  artifact; that transport field is not closure authority.
- Return the admitted `SdlcNextActionProjection.nextActionProjectionRef` only
  for branches that do not attach an artifact carrier.
- Keep gap dossiers as evidence/pressure only.
- Let public `gaps` continue to rehydrate from the consequence triple; if the
  triple is missing, that is a missing consequence diagnostic, not a recomputed
  closure result.

### Regression

`test_t158_consequence_admission_regression.test.mjs` reproduces an admitted
non-close `F_P.transform` result: product output is present, assurance blocks
because traversal obligations are unassessed, and the edge disposition is
`retry`.

The test asserts:

- the archive contains the closure decision and next-action projection,
- the source-level dispatch branches publish the consequence chain before
  returning to ABG,
- `gaps` rehydrates the retry disposition from the admitted consequence chain.

## Review Closure Addendum: 2026-05-12

The later full external `data_mapper` run was intentionally terminated before
closure so the review fixes could be made first:

```text
command: npm run live:data-mapper-sandbox
archive: build_tenants/typescript/test_env/test_runs/full_external_data_mapper_sandbox/20260511T172019616Z_pid87986
state: step-01 Fg_conform_project_authority worker heartbeat-only after Claude compaction
runtime archive: build_tenants/typescript/test_env/test_runs/full_external_data_mapper_sandbox/20260511T172019616Z_pid87986/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260511T172024387Z_pid88167
```

That archive is retained as runtime bug evidence, not as closure evidence. The
first step still showed the T-158 graph-track repair reflected in admitted
data: the start projection selected
`construction-action://odd-sdlc/public-start/Fg_conform_project`, carried
`nextGraphFunctionRef: Fg_conform_project`, carried `nextGraphVectorRef: null`,
and set `choosesNextTraversal: false`.

Closed review items in this pass:

- Missing archived `nextGraphVectorRef` now emits the typed blocking reason
  `next_action_projection_graph_vector_missing` instead of throwing a raw
  `TypeError`.
- Graph-vector refs at the SDLC boundary use published vector names, not ABG
  internal vector IDs.
- Observed unchanged repair files look up prior admitted path+digest role
  policy before path-pattern filtering, so replayed roles are not dead-pathed by
  current heuristics.
- Product-materialization graph-track selection ignores broad executive
  fallback functions, but fails closed when multiple non-executive candidates
  compete for the same target asset.
- Regression coverage now pins the stale-vector diagnostic, non-executive
  peer ambiguity, and prior-admitted role replay before path heuristics.

Verification from `build_tenants/typescript`:

```bash
npm run build:semantic
node --test test_env/tests/test_t158_consequence_admission_regression.test.mjs test_env/tests/test_t066_product_materialization_contract.test.mjs test_env/tests/test_t058_spec_method_entrypoint.test.mjs test_env/tests/test_t152_data_mapper_transformation_set_partition.test.mjs
npm run test:semantic
npm run test:scenario:t132-hello-world-js-live
```

Observed result:

- `npm run build:semantic`: passed
- focused T-158/T-066/T-058/T-152 slice: 59/59 passed
- `npm run test:semantic`: 441/441 passed
- shaped JavaScript hello-world live sandbox: passed in 186.3s

Hello-world live archive:

```text
build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260511T173911536Z_pid83128
```

The hello-world archive directly reflects the graph-track carrier fix:

- first materialization projection:
  `nextGraphFunctionRef: derive_component_code_surface`,
  `nextGraphVectorRef: derive_component_code_surface`,
  `choosesNextTraversal: true`
- final projection:
  `nextGraphFunctionRef: null`,
  `nextGraphVectorRef: null`,
  `choosesNextTraversal: false`

T-158 remains active only for the full live `data_mapper` closure run. The
latest killed `data_mapper` archive is preserved as regression evidence; it is
not accepted as closure evidence.

## Review Closure Addendum: 2026-05-12 Follow-up

Claude's follow-up review was valid on two blocking points and one medium
metadata point. Those are now fixed in the TypeScript tenant.

Closed in this pass:

- Corrupt, empty, kind-mismatched, and target-mismatched predecessor
  materialization replay manifests now remain typed replay diagnostics. Observed
  unchanged files no longer bypass those diagnostics by falling back to
  path-pattern materialization.
- Product-materialization post-action graph-track failure now returns a typed
  `post_materialization_graph_track_unresolved` blocking reason. It no longer
  escapes as a raw `TypeError`, and the installed operator admits a blocked
  closure decision rather than returning a close-eligible dispatch result.
- Replay diagnostic blocking-reason codes are explicitly wired through blocking
  metadata:
  `materialized_product_manifest_replay_kind_mismatch`,
  `materialized_product_manifest_replay_target_mismatch`,
  `materialized_product_manifest_replay_empty`,
  `materialized_product_manifest_replay_parse_failed`, and
  `materialized_product_replay_role_policy_missing`.

New deterministic regression:

- `T-158 unchanged observed files cannot bypass corrupt predecessor replay diagnostics`
- file:
  `build_tenants/typescript/test_env/tests/test_t066_product_materialization_contract.test.mjs`

Verification from `build_tenants/typescript`:

```bash
npm run build:semantic
node --test test_env/tests/test_t158_consequence_admission_regression.test.mjs test_env/tests/test_t066_product_materialization_contract.test.mjs
node --test test_env/tests/test_t152_data_mapper_transformation_set_partition.test.mjs test_env/tests/test_t154_no_harness_target_data_mapper_parity.test.mjs test_env/tests/test_t058_spec_method_entrypoint.test.mjs
npm run test:semantic
```

Observed result:

- `npm run build:semantic`: passed
- focused T-158/T-066 suite: 46/46 passed
- data_mapper graph-track/spec-method slice: 16/16 passed
- `npm run test:semantic`: 442/442 passed

The hello-world sanity run also exposed a separate product-asset requirement
lineage defect: `src/hello.js` was created under the correct
`derive_component_code_surface` traversal, but the product file and admitted
manifest row do not carry requirement lineage. That defect is split into
T-159 because it is not a product-materialization replay bug.

## Additional Runtime Bug: Worker Read Boundary Leak

A later JavaScript hello-world live run was killed because the live worker read
from a preserved sibling sandbox instead of the active workspace:

```text
archive: build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260511T211334695Z_pid94827
offending runtime archive: workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260511T212044737Z_pid94827
observed tool input: Read.file_path=/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260511T205731202Z_pid76780/workspace/build_tenants/hello_world_javascript/design/scenario_surface.md
```

Root cause: the launch contract told the worker which package refs were
authoritative but did not explicitly close the readable filesystem boundary.
Because Claude ran with the active workspace as `cwd` and broad tool access, a
glob/read over `test_runs` could import stale sibling-sandbox design evidence.
That contaminates downstream reconciliation because the output can be shaped by
non-current authority while still satisfying ordinary output/report checks.

Contained fix:

- `worker_invocation_package.transformAxioms` now carries a read-boundary axiom:
  use only relative paths under the current workspace; do not glob/read/copy
  sibling sandboxes, historical `test_runs`, home memory, or absolute paths
  outside the active workspace.
- `worker_prompt.md` repeats the same terse boundary before the worker reads
  package refs.
- postflight scans worker tool-use/tool-result payloads in `worker_stdout.log`
  and `worker_process_events.jsonl`; absolute filesystem refs outside
  `manifest.workspaceRoot` now emit the typed blocking reason
  `worker_authority_read_outside_workspace`.
- The scanner ignores non-tool session metadata such as Claude `memory_paths`,
  so it blocks consumed tool authority rather than runtime-launch facts.

Regression:

- `T-158 postflight blocks worker reads outside active workspace`
- file:
  `build_tenants/typescript/test_env/tests/test_t066_product_materialization_contract.test.mjs`

Verification from `build_tenants/typescript`:

```bash
npm run build:semantic
node --test --test-name-pattern "T-118 writes a compact worker invocation package while preserving the full manifest by reference|T-118 prompt points workers to the compact package before the forensic manifest|T-158 postflight blocks worker reads outside active workspace" test_env/tests/test_t118_worker_invocation_package.test.mjs test_env/tests/test_t066_product_materialization_contract.test.mjs
```

Observed result:

- `npm run build:semantic`: passed
- focused T-118/T-158 read-boundary slice: 3/3 passed

## Additional Review Finding: Stale Graph Boundary Refs Were Generic Errors

Review found that stale `sdlc_next_action_projection.json` archives carrying
legacy or unknown graph-function/vector refs could escape as generic command
errors. That violated the T-158 rule that replay failure must fail closed with
typed runtime diagnostics.

Root cause:

- `admitSdlcGraphFunctionBoundaryRef()` and
  `admitSdlcGraphVectorBoundaryRef()` threw raw `TypeError`s for legacy or
  unknown boundary refs.
- `selectedNextGraphFunctionFromArchive()` only admitted the missing-vector
  diagnostic and did not convert graph-boundary admission failures into the
  spec-method blocking payload.

Fix:

- Added typed graph-boundary diagnostic errors for:
  `legacy_graph_function_boundary_ref`,
  `unknown_graph_function_boundary_ref`,
  `legacy_graph_vector_boundary_ref`, and
  `unknown_graph_vector_boundary_ref`.
- Routed those diagnostics through `specMethodBlockingPayload()` so `gaps`
  returns a typed blocking result instead of `status: error`.
- Registered all four codes in `blocking_reason.ts` metadata.

Regression:

- `T-158 replayed Eval_Action boundary refs fail as typed diagnostics`
- file:
  `build_tenants/typescript/test_env/tests/test_t158_consequence_admission_regression.test.mjs`

## Additional Review Findings: Replay Authority Must Stay Admitted

Review found three remaining replay-authority defects.

1. `fileWithMaterializationProvenance()` synthesized `rolePolicyRef` for replay
   rows when the predecessor row omitted it. That bypassed
   `materialized_product_replay_role_policy_missing`.
2. `resolveProductMaterializationReplay()` collected diagnostics from corrupt or
   mismatched predecessor manifests but returned `diagnostics: []` when any
   older predecessor could replay files.
3. The post-materialization action row selected the graph-track function/vector
   but set `publishedTraversalTargetRef` to the generic materializer action ref.

Root cause:

- Replay rows were still passing through current-target derivation surfaces.
- Replay diagnostics were treated as subordinate to finding any replayable
  predecessor.
- The action carrier mixed generic materializer authority with graph-track
  traversal authority.

Fix:

- Current-attempt rows may admit role policy from the current target contract.
  Replay rows now preserve only the predecessor row's admitted `rolePolicyRef`;
  missing predecessor role policy surfaces as the typed replay diagnostic.
- Replay diagnostics are retained even when older files can replay, so a corrupt
  newer predecessor cannot be silently ignored.
- Post-materialization actions now set
  `publishedTraversalTargetRef = graphTrackTarget.publishedTraversalTargetRef`.

Regression:

- `T-158 replay preserves predecessor role policy instead of synthesizing it`
- `T-158 replay keeps diagnostics when an older predecessor can replay`
- `T-152 product materialization action is selected from downstream pressure and target binding`
- `T-154 source/spec data_mapper pressure selects and replays product materialization without a harness target`
