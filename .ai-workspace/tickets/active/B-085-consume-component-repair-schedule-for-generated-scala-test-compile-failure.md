---
id: B-085
title: Consume component repair schedule for generated Scala test compile failure
type: bug
ticket_category: rc_blocker
status: active
review_status: deterministic_reentry_plan_ready_pending_review_and_live_proof
goal: typescript-bounded-data-mapper-build-rc
change_intent: Repair the current data_mapper release-depth blocker by making odd_sdlc consume typed component repair schedule truth to target the generated Scala test compile failure, then re-run the implicated component test shard before release-depth parity.
change_class: realization_refactor
re_entry_point: realization
affected_boundary: component_test_surface generation, component_repair_schedule_surface consumption, ABG-visible repair reentry carrier, retry-local repair prompts, installed operator start/reentry, release_depth_parity_surface
priority: critical
triaged_at: 2026-05-06
created_at: 2026-05-06
updated_at: 2026-05-08
build_tenant: typescript
owner: odd_sdlc
governance_scope: STDO Method
related_tickets:
  - T-041 active bounded RC release claim
  - T-112 active complete semantic lifecycle
  - T-113 completed component-depth repair-flow surface
  - T-120 completed retry-local repair prompts
  - T-109 completed traversal-ledger proof
evidence_refs:
  - build_tenants/typescript/test_env/test_runs/t109_live_installed_data_mapper_pty/20260505T180726166Z_pid44582/workspace/.ai-workspace/runtime/odd_sdlc/assets/20260505T201602058Z_pid70576/test_execution_result_surface.md
  - build_tenants/typescript/test_env/test_runs/t109_live_installed_data_mapper_pty/20260505T180726166Z_pid44582/workspace/.ai-workspace/runtime/odd_sdlc/assets/20260505T203416625Z_pid24574/component_repair_schedule_surface.md
  - build_tenants/typescript/test_env/test_runs/t109_live_installed_data_mapper_pty/20260505T180726166Z_pid44582/workspace/.ai-workspace/runtime/odd_sdlc/assets/20260505T205724893Z_pid99262/release_depth_parity_surface.md
  - build_tenants/typescript/test_env/test_runs/t109_live_installed_data_mapper_pty/20260505T180726166Z_pid44582/workspace/build_tenants/scala_spark/cdme-compiler/src/test/scala/cdme/compiler/diagnostics/DiagnosticsFinalizeSpec.scala
---

# B-085: Consume Component Repair Schedule For Generated Scala Test Compile Failure

## Dependency Checkpoint - 2026-05-09

T-120 is now closed for typed retry-local repair prompt packaging. B-085 remains
active because its closure law is narrower and later: the live lane must consume
the component repair schedule for the generated Scala test failure, target
`derive_component_test_surface`, rerun the implicated shard, and admit pass
evidence or a new typed product/test blocker.

Current live archive:
`build_tenants/typescript/test_env/test_runs/t109_live_installed_data_mapper_pty/20260508T122226315Z_pid79621`.

This archive reached `derive_component_test_surface` and showed retry repair
instructions on that edge, but it did not reach release-depth parity or pass
evidence before the outer harness timeout.

## STDO Triage

### First Missing Layer

Realization.

ABG preserved the runtime truth: the live lane reached failed governed test
execution, admitted component failure attribution, projected a component repair
schedule, and blocked release-depth parity instead of closing falsely.

The missing layer is `odd_sdlc` realization over its own software-domain
repair carriers:

- the component test generator emitted ScalaTest code that does not compile;
- the repair schedule correctly identifies the implicated test source and
  failure row;
- the installed operator does not yet consume that repair schedule to re-enter
  the implicated component test repair before release-depth parity.

### Ownership

This is an `odd_sdlc` bug, not an ABG bug.

ABG owns traversal, events, replay, actor execution, and retry/reentry
substrate. Current evidence shows those boundaries worked: the graph advanced
through vectors 0-30 and projected the blocker as typed release-depth truth.

`odd_sdlc` owns:

- Scala product/test generation prompts and constraints;
- component/test topology meaning;
- component execution failure attribution interpretation;
- component repair schedule semantics;
- release-depth parity policy and repair consumption.

No ABG version bump is justified unless implementation proves the existing ABG
retry/reentry substrate cannot target the scheduled repair edge.

## Root Cause

The generated test
`DiagnosticsFinalizeSpec.scala` does not compile:

- `private val a = CompileDiagnostic.error(...)` collides with ScalaTest
  `Matchers` inherited matcher word `a`, producing a type mismatch against
  `AWord`.
- `out.size shouldBe in.size` triggers `Cannot prove that Int <:< AnyRef`.

The prior fixes did resolve the runtime/projection bug class: the lane no
longer loses the failure as pending, parser-invalid, or release-success. The
current defect is that the typed repair schedule is not yet acted on as the
next repair target.

## Forensic Review Finding - 2026-05-07

The live lane was stopped before RC continuation because the retry/reentry
ownership model is not lawful yet.

Finding:

- `component_depth` emits open release-depth repair rows as
  `repair_worker_output`.
- the postflight gap dossier preserves that action.
- the installed summary previously keyed continuation on `retry_same_edge` /
  `retry_same_edge_with_gap_dossier`; T-120 now projects
  `repair_worker_output` as `plan_repair_reentry_with_gap_dossier`.
- `cli/command.ts` previously owned bounded retry iteration and synthesized
  `SdlcWorkerRetryContext` overrides; T-120 removed that file and moved
  same-edge retry/reentry control behind the installed operator boundary.

That is not self-healing under the design model. It is adapter-owned retry over
runtime observations. The CLI may admit command intent and render projection,
but it must not decide retry, own retry budget, synthesize retry context, or
select the next repair edge.

Second finding:

`derive_component_test_surface` names admitted component repair schedules in
intent prose, but the graph contract does not declare
`component_repair_schedule_surface` as an input. Since handoff manifests derive
their source asset list from the graph contract, the repair schedule is not yet
lawful handoff authority for the component-test repair edge.

Do not fix this by adding a naive graph cycle from repair schedule back to
component tests. The required fix is an explicit repair reentry carrier: gap
dossier plus `component_repair_row_open:*` plus admitted repair schedule truth
must become ABG-visible reentry pressure that targets the implicated repair edge
with side repair context.

## Target Truth

When component test execution fails at Scala test-compile time, odd_sdlc must:

1. preserve failed execution evidence as failed, not pending;
2. attribute the failure to the generated test source;
3. emit a component repair schedule row targeting `component_test`;
4. feed that repair row into the next worker prompt as retry-local repair law;
5. regenerate or patch only the implicated test source;
6. re-run the implicated test shard;
7. allow release-depth parity only after pass evidence exists.

## Acceptance Criteria

- The component repair schedule can target test-source repair for
  `DiagnosticsFinalizeSpec.scala`.
- Retry-local worker prompt includes the repair row, rejected artifact, exact
  scalac errors, accepted carrier shape, and instruction to avoid broad
  regeneration.
- ScalaTest generation guidance prevents matcher-word collisions such as
  local identifiers `a`, `an`, `be`, `empty`, and `contain`.
- Numeric/primitive ScalaTest assertions avoid the `Int <:< AnyRef` compile
  trap.
- `component_repair_row_open:*` produces a typed repair reentry plan targeting
  `derive_component_test_surface` when the repair row target is
  `component_test`.
- The repair reentry plan carries the repair row, implicated file path, exact
  scalac diagnostics/evidence refs, accepted carrier schema or field set, and
  no-broad-regeneration rule.
- The Spec Method entrypoint and process launcher do not own retry iteration,
  retry budget, retry context synthesis, or repair edge selection.
- A deterministic regression proves this exact compile-failure class becomes a
  component-test repair prompt.
- A live data_mapper lane proves the repair schedule is consumed and advances
  past the current `derive_release_depth_parity_surface` blocker or blocks on
  a new typed product/test failure.

## Non-Closure Conditions

- Manually editing the generated Scala file in the live workspace and claiming
  product closure.
- Treating release-depth parity as met while any component repair schedule row
  remains open.
- Fixing only prompt prose without proving retry-local repair consumption.
- Treating `component_repair_schedule_surface` as prompt prose without graph or
  reentry-carrier authority.
- Teaching an entrypoint loop to consume `repair_worker_output` while leaving
  retry authority outside the installed operator/ABG boundary.
- Reclassifying the compile failure as pending or non-blocking.
- Asking ABG for a runtime bump before proving odd_sdlc cannot express the
  repair target over existing retry/reentry substrate.

## Implementation Checkpoint - 2026-05-06

Implemented the first B-085 routing fix in
`build_tenants/typescript/code/src/operator/assurance_gate.ts`.

The assurance gate now preserves each folded assurance reason's
`lawfulReentryPoint` when projecting assurance retry pressure into typed
postflight blocking reason carriers. The previous projection rebuilt every
non-reprice assurance reason as `same_edge_retry`, which hid the
`repair_worker_output` route already emitted by the component-depth assurance
layer for release-depth parity and open component repair rows.

Added a deterministic regression in
`build_tenants/typescript/test_env/tests/test_t115_component_execution_failure_repair_flow.test.mjs`:

- fixture: `derive_release_depth_parity_surface`;
- live-shaped repair row:
  `fail.compiler.diagnostics.scalac.001`;
- repair target:
  `build_tenants/scala_spark/cdme-compiler/src/test/scala/cdme/compiler/diagnostics/DiagnosticsFinalizeSpec.scala`;
- expected postflight route: `repair_worker_output`;
- expected gap-dossier action: `repair_worker_output`;
- forbidden collapse: `same_edge_retry`.

Updated the RC qualification carrier so `odd-sdlc-ts rc-report` no longer
claims `bounded_rc_ready` for the current RC lane while B-085 remains active.

Proof run:

- `npm run lint:semantic`
- `node --test test_env/tests/test_t115_component_execution_failure_repair_flow.test.mjs`
- `npm run test:semantic` -> 217/217 passed
- `npm run test:sandbox` -> 15/15 passed

Live workspace state after cleanup:

- command:
  `./node_modules/.bin/odd-sdlc-ts gaps --workspace .`
- workspace:
  `build_tenants/typescript/test_env/test_runs/t109_live_installed_data_mapper_pty/20260505T180726166Z_pid44582/workspace`
- status: `partial`
- current edge: `derive_release_depth_parity_surface`
- closed vectors: `0-30`

Live closure remains open. The next live proof must preserve the existing
`until:first_traversal` replay basis and target the current release-depth
blocker; `start --target next --until blocked` starts a separate fresh basis in
this workspace and is not a valid B-085 continuation proof. The remaining work
is to produce the retry-local component-test repair prompt, repair
`DiagnosticsFinalizeSpec.scala`, rerun the implicated `cdme-compiler` shard,
admit pass evidence, and rederive release-depth parity.

## Implementation Checkpoint - 2026-05-07

Implemented the typed repair-reentry package for open component repair rows.

Changed surfaces:

- `build_tenants/typescript/code/src/operator/carriers.ts`
  - added `SdlcComponentRepairReentryPlan`;
  - added `workerInvocationPackage.repairReentryPlans`;
  - retry instructions now reference the canonical plan by
    `repairReentryPlanId` instead of duplicating the repair row.
- `build_tenants/typescript/code/src/operator/handoff.ts`
  - recognizes `component_repair_row_open:*`;
  - reads admitted component repair rows from current runtime asset evidence;
  - maps `repairTarget: component_test` to
    `derive_component_test_surface` / `component_test_surface`;
  - carries repair row ids, testcase/component/requirement ids, implicated
    source/test refs, diagnostic evidence refs, an exact diagnostic excerpt,
    the accepted component-depth carrier field set, and
    `noBroadRegeneration: true`;
  - tells the worker to resolve `repairReentryPlanId` against
    `repairReentryPlans` and to read diagnostics before editing.
- `build_tenants/typescript/test_env/tests/test_t120_retry_local_repair_prompt.test.mjs`
  - added the B-085 deterministic regression for
    `DiagnosticsFinalizeSpec.scala`;
  - proves the exact scalac errors
    `type mismatch` and `Cannot prove that Int <:< AnyRef` are present in the
    repair package;
  - proves the next repair target is `derive_component_test_surface`, not
    release-depth retry or CLI-owned command logic.

Verification:

- `npm run build:semantic`
- `node --test test_env/tests/test_t120_retry_local_repair_prompt.test.mjs test_env/tests/test_t115_component_execution_failure_repair_flow.test.mjs`
  -> 16/16 passed

Review status:

This checkpoint does not close B-085. It closes the deterministic prompt/reentry
package gap for review. Live closure still requires a data_mapper installed lane
to consume the plan, patch `DiagnosticsFinalizeSpec.scala`, rerun
`sbt "cdme-compiler/test"`, admit pass evidence, and rederive
`release_depth_parity_surface`.

Live replay note:

The May 5 live workspace is now forensic evidence only. Current `gaps` over
that workspace rejects the ABG event log at `.ai-workspace/events/events.jsonl`
line 11 because the old `TraversalModulationResolvedEvent` does not carry the
current required `strategySelectionRef`. Do not add a compatibility shim for the
stale event shape. B-085 live closure must use a fresh installed data_mapper
lane under the current Spec Method/ABG event schema.

Installed repair-flow live check:

- command:
  `ODD_SDLC_TS_T115_DATA_MAPPER_LIVE=1 npm run test:t115:data-mapper-repair-live`
- result: passed, 1/1
- archive:
  `build_tenants/typescript/test_env/test_runs/t115_live_installed_data_mapper_repair_flow/20260507T004300650Z_pid27149`
- observed current schema path:
  failed `test_execution_result_surface` ->
  typed `component_test_qualification_surface` failure register ->
  `component_repair_schedule_surface` with `repair_required`

This proves installed repair-schedule truth under the current event schema. It
still does not close B-085 because it uses the T-115 local repair-flow worker,
not the final production Claude data_mapper lane that must consume the B-085
repair-reentry plan and produce pass evidence.

## ABG 3.7 Evaluator Boundary - 2026-05-08

T-129's ABG 3.7 migration gives odd_sdlc a read-only evaluator projection for
gap/action ranking. It does not consume the component repair schedule into the
installed runner.

Closure expectation update:

- `component_repair_row_open:*` and `repair_worker_output` must become typed
  repair/reentry pressure for the evaluator or an ABG T-128 admitted
  construction intent. They must not be consumed by public `gaps` as a dispatch
  instruction.
- The installed operator's current repair/reentry loop is temporary adapter
  debt. B-085 cannot close by teaching that adapter to rank repair routes
  locally.
- The production data_mapper lane must still prove that the
  `DiagnosticsFinalizeSpec.scala` repair row is carried into the next worker
  package, the implicated shard is rerun, pass evidence is admitted, and
  release-depth parity is rederived.
- If ABG T-128 is not available, B-085 may close only on production repair
  consumption evidence plus an explicit note that runner-level evaluator-driven
  traversal remains deferred.
