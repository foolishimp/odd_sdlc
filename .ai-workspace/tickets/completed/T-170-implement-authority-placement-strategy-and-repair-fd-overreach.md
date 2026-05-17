---
id: T-170
title: Implement authority-placement strategy and repair F_D overreach
type: feature
ticket_category: authority_placement_refactor
status: completed
review_status: closed_superseded_by_t171_2026-05-17
closure_disposition: superseded_not_implemented
superseded_by:
  - .ai-workspace/tickets/active/T-171-full-test35-parity-refactor-for-test72-execution-backed-closure.md
priority: critical
owner: odd_sdlc
build_tenant: typescript
created_at: 2026-05-16
updated_at: 2026-05-17
activated_at: 2026-05-16
goal: restore-fp-execution-completeness-with-fd-support
change_intent: Implement the superseding F_P/F_D authority-placement strategy, repair the current TypeScript state pushed in the wrong direction by T-168/T-169, and make execution-plus-iteration the product completeness path while retaining F_D for admission, identity, folding, diagnostics, and routing.
change_class: requirement_reprice
re_entry_point: requirements
first_missing_layer: requirements
governance_scope: STDO Method
strategy_authority:
  - .ai-workspace/comments/codex/20260516T024852Z_STRATEGY_fp_fd_eventual_consistency_steel_thread_execution.md
superseded_work:
  - .ai-workspace/tickets/completed/T-168-build-design-consumer-test-pipeline-for-co-affirming-implementation.md
  - .ai-workspace/tickets/completed/T-169-implement-gtl-target-carrier-contracts-for-sdlc-vector-outputs.md
source_documents:
  - specification/GOALS.md
  - specification/INTENT.md
  - specification/PRODUCT.md
  - specification/requirements/13-odd-sdlc-typescript-tenant.md
  - specification/requirements/14-odd-sdlc-installed-product-contract.md
  - specification/requirements/16-edge-gain-closure-contract.md
  - specification/requirements/17-target-carrier-contracts.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_EDGE_GAIN_CLOSURE_CONTRACT.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TARGET_CARRIER_CONTRACTS.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TEST_PIPELINE.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_ASSURANCE_INTEGRATION.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_DETERMINISTIC_TRAVERSAL_STATE_MACHINE.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_FP_EVALUATION_LEDGER_PURPOSE.md
  - .ai-workspace/comments/codex/20260516T021725Z_MASTER_test35_attempts_failure_reference.md
  - .ai-workspace/comments/codex/20260516T024852Z_STRATEGY_fp_fd_eventual_consistency_steel_thread_execution.md
  - .ai-workspace/comments/codex/20260428T114501Z_ANALYSIS_test35_code_iteration_manifests_vs_ts_prompt_gap.md
  - .ai-workspace/comments/codex/20260509_odd_sdlc_test35_edge_walkthrough_abg371_alignment.md
  - .ai-workspace/comments/codex/20260509_test35_capability_gap_computational_breakdown.md
  - .ai-workspace/comments/codex/20260511T025029Z_DESIGN_REVIEW_current_and_proposed_ledgers.md
  - .ai-workspace/comments/codex/20260513T035126Z_data_mapper_test35_vs_ts_followup.md
  - .ai-workspace/comments/codex/20260515_t164_data_mapper_full_capability_vs_test35_forensic.md
  - .ai-workspace/tickets/completed/T-164-declare-per-edge-gain-and-closure-functions-for-sdlc-traversals.md
  - .ai-workspace/tickets/completed/T-168-build-design-consumer-test-pipeline-for-co-affirming-implementation.md
  - .ai-workspace/tickets/completed/T-169-implement-gtl-target-carrier-contracts-for-sdlc-vector-outputs.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-133-declare-gtl-target-carrier-contracts-for-graph-vector-outputs.md
related_tickets:
  - .ai-workspace/tickets/active/T-161-read-only-fd-run-analysis-linter.md
  - .ai-workspace/tickets/active/T-162-first-class-ticket-workflow-for-governed-change.md
  - .ai-workspace/tickets/completed/T-144-reclassify-repairable-assurance-and-tenant-grammar-boundaries.md
  - .ai-workspace/tickets/completed/B-084-admit-ambiguous-design-depth-candidates-before-strict-closure.md
affected_boundary:
  requirements:
    - specification/PRODUCT.md
    - specification/requirements/16-edge-gain-closure-contract.md
    - specification/requirements/17-target-carrier-contracts.md
  design:
    - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_EDGE_GAIN_CLOSURE_CONTRACT.md
    - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TARGET_CARRIER_CONTRACTS.md
    - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TEST_PIPELINE.md
    - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_ASSURANCE_INTEGRATION.md
    - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_DETERMINISTIC_TRAVERSAL_STATE_MACHINE.md
    - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_FP_EVALUATION_LEDGER_PURPOSE.md
  graph_code:
    - build_tenants/typescript/code/src/graph/target_carrier_contracts.ts
    - build_tenants/typescript/code/src/graph/edge_gain_closure_contracts.ts
    - build_tenants/typescript/code/src/graph/overlays.ts
    - build_tenants/typescript/code/src/graph/catalog.ts
    - build_tenants/typescript/code/src/graph/module.ts
    - build_tenants/typescript/code/src/graph/library.ts
    - build_tenants/typescript/code/src/graph/boundary_refs.ts
  operator_code:
    - build_tenants/typescript/code/src/operator/edge_gain_closure.ts
    - build_tenants/typescript/code/src/operator/traversal_consequence.ts
    - build_tenants/typescript/code/src/operator/installed_operator.ts
    - build_tenants/typescript/code/src/operator/handoff.ts
    - build_tenants/typescript/code/src/operator/carriers.ts
    - build_tenants/typescript/code/src/operator/assurance_gate.ts
    - build_tenants/typescript/code/src/operator/design_depth_register.ts
    - build_tenants/typescript/code/src/operator/component_depth_register.ts
    - build_tenants/typescript/code/src/operator/test_design_register.ts
    - build_tenants/typescript/code/src/operator/test_pipeline.ts
  projection_code:
    - build_tenants/typescript/code/src/projection/query_domain.ts
    - build_tenants/typescript/code/src/projection/requirement_closure.ts
  workspace_and_policy_code:
    - build_tenants/typescript/code/src/workspace/project_profile.ts
    - build_tenants/typescript/code/src/operator/traversal_strategy.ts
    - build_tenants/typescript/code/src/shared/traversal_strategy_plan.ts
    - build_tenants/typescript/code/src/shared/blocking_reason.ts
    - build_tenants/typescript/code/src/spec_method/entry.ts
    - build_tenants/typescript/code/src/start/public_start.ts
  tests:
    - build_tenants/typescript/test_env/tests/
    - build_tenants/typescript/test_env/live/
    - build_tenants/typescript/test_env/fixtures/
    - build_tenants/typescript/test_env/sandbox/
excluded_boundary:
  - creating another T-168/T-169 replacement ticket
  - preserving backwards compatibility with the incorrect closure semantics
  - deleting GTL target carrier contracts instead of repositioning them
  - treating target-carrier admission as SDLC content closure
  - treating test-pipeline conformance as product completeness
  - treating register shape perfection as a prerequisite for product work when the malformed fields are not downstream-read by routing, admission, closure, or execution construction
  - bypassing GTL/ABG defects with odd_sdlc-local hacks
  - creating a second runtime, ledger, or test controller outside the ABG-owned traversal/evidence path
target_truth: >
  The TypeScript tenant implements the superseding authority-placement strategy:
  F_D narrows and preserves; F_P constructs and judges ambiguous SDLC content;
  declared execution returns product truth; iteration closes completeness.
  Target-carrier contracts, test-pipeline assets, registers, ledgers, and
  overlays remain useful, but only as admission, identity, evidence,
  diagnostics, pressure, and routing support. The current wrong-direction state
  introduced by T-168/T-169 is audited and repaired in requirements, design,
  code, tests, and live proof.
superseded_truth: >
  T-168 and T-169 may continue independently, target-carrier admission may act
  as a product/content close precondition, deterministic register compliance may
  dominate worker repair, overlay completion may clear pressure without
  execution/F_P evidence, and test-pipeline conformance may stand in for
  execution-backed co-affirmation.
closure_law: >
  This ticket closes only when the TypeScript tenant has removed the incorrect
  T-168/T-169 closure semantics from requirements, design, runtime folds,
  projections, and tests; preserves target-carrier identity as admission/evidence
  law rather than content closure; classifies F_D failures by severity and
  downstream-read graph; preserves residual pressure until clearing evidence or
  lawful reprice exists; selects a small executable steel-thread overlay for
  small profiles; attempts declared execution as soon as artifacts are minimally
  runnable; and proves the corrected behavior through deterministic fixtures
  plus live or live-equivalent hello-world and data_mapper archives.
evaluation_criteria:
  - requirements reprice REQ-F-ODDSDLC-070 and related target-carrier language so target-carrier admission is envelope/identity evidence admission, not SDLC content closure
  - target-carrier design replaces "closure needs both" and "block close on rejected carrier" wording with evidence-admission and pressure-preservation wording
  - edge gain and close folds separate target-carrier protocol admission from content completeness and never use target-carrier status as the product/content close predicate
  - selected target-carrier identity is total and preserved for admitted, rejected, missing, and not-required states
  - malformed carrier envelopes produce typed protocol diagnostics; well-formed carriers with weak or incomplete SDLC content are admitted structurally and routed to F_P/content pressure
  - design-depth, component-depth, and test-design register failures are classified through the downstream-read graph as protocol_invalid, construction_context_invalid, diagnostic_shape_invalid, or content_unproven
  - diagnostic_shape_invalid records residual diagnostic pressure and does not block F_P construction when the malformed field is not read by routing, admission, closure, or execution-command construction
  - closure and overlay projection preserve required/downstream pressure unless a clearing evidence ref, lawful reprice/re-entry ref, or declared no-close/projection-only policy exists
  - `product_converged` cannot clear remaining graph, requirement, or asset pressure by projection alone
  - project profile or explicit operator selection admits an overlay binding with `thread`, `breadth`, or `full_lifecycle`; `hello_world` uses the thread path and data_mapper uses breadth/full_lifecycle according to proof goal
  - declared execution is attempted once command, files, parse/load/import, and worker-process protocol thresholds are satisfied
  - tests and implementation co-affirm through admitted execution evidence and F_P/content judgment, not by test-pipeline carrier conformance alone
  - query-domain, gaps, and run archives expose the corrected states as read models and do not become routing or closure authorities
  - no code path preserves compatibility with the superseded T-168/T-169 closure placement
proof_surface:
  static:
    - npm run lint:semantic
    - npm run lint:test-harness
  focused:
    - npm run test:t164:edge-contract
    - npm run test:t168
    - npm run test:t169
    - npm run test:semantic
  new_or_updated:
    - deterministic test proving target-carrier rejection blocks evidence admission but does not masquerade as SDLC content judgment
    - deterministic test proving a well-formed carrier with incomplete content routes to F_P/content pressure
    - deterministic test proving unconsumed register-shape drift is diagnostic_shape_invalid and does not block construction
    - deterministic test proving consumed register fields still block when required by routing/admission/closure/execution construction
    - deterministic test proving overlay completion cannot erase remaining pressure without clearing evidence
    - deterministic test proving hello_world profile selects the thread overlay and reaches execution before full lifecycle apparatus
    - deterministic test proving data_mapper breadth/full_lifecycle preserves test/release pressure across partial closes
  live_or_equivalent:
    - npm run test:t132:hello-world-live
    - npm run test:t164:data-mapper-full-capability-live
    - preserved archive comparison against test35 showing execution-backed pressure survival and fewer framework-only worker passes
non_closure_conditions:
  - T-168 or T-169 remains active as an independent implementation ticket
  - REQ-F-ODDSDLC-070 still states target-carrier admission is an output-shape closure precondition
  - target-carrier design still says "closure needs both" without the evidence-admission boundary
  - `measureSdlcEdgeGain` or close decision treats target-carrier status as content completeness
  - missing/rejected target carrier identity is lost or becomes null in ledgers/read models
  - register admission rejects content work because of fields no downstream consumer reads
  - component-code or overlay close clears downstream test, execution, release, requirement, or asset pressure without clearing evidence
  - hello-world still exercises the full data_mapper lifecycle before first execution
  - tests close on source existence, carrier conformance, zero-test output, or postflight status without admitted execution evidence when execution is declared
  - live proof relies on harness expectations instead of product test path execution
  - any workaround hides a GTL/ABG substrate bug instead of fixing it under the right substrate surface
---

# Supersession Notice

Closed as superseded, not implemented.

The valid authority-placement content in this ticket is absorbed by the single
active refactor surface:

- `.ai-workspace/tickets/active/T-171-full-test35-parity-refactor-for-test72-execution-backed-closure.md`

Reason: T-170 was too broad and still left room for multiple implementation
truths. T-171 replaces it with one STDO/spec-method surface for the full
test35-to-test72 parity refactor, including execution-backed F_P closure,
residual pressure preservation, prompt-source consolidation, missing graph
products, analyzer proof, and live parity evidence.

# T-170: Authority Placement Strategy Implementation

## STDO Triage

Smallest lawful re-entry point: requirements.

Change class: requirement_reprice.

The superseding strategy changes the work authority:

```text
F_D narrows and preserves.
F_P constructs and judges ambiguous content.
Execution returns product truth.
Iteration closes completeness.
```

T-168 and T-169 are closed as superseded because they moved useful mechanisms in
the wrong direction. They tried to solve real problems, but the implementation
pressure promoted deterministic structure into the closure center.

This ticket is the single active implementation surface for repairing that
state.

## Current Wrong-Direction State Register

This ticket must repair the current state caused by the superseded tickets. The
first implementation step is an audit against this register before code changes
claim completion.

| Surface | Current wrong-direction state | Required correction |
| --- | --- | --- |
| `specification/requirements/17-target-carrier-contracts.md` | REQ-F-ODDSDLC-070 says SDLC edge assurance closure consumes target carrier admission as an output-shape precondition and edge close cannot pass when required admission is rejected or absent. | Reprice target-carrier admission as envelope/identity evidence admission. Missing/rejected envelope blocks evidence admission and preserves pressure; it is not SDLC content closure. |
| `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TARGET_CARRIER_CONTRACTS.md` | Runtime flow says "block close on rejected carrier" and closure rule says closure needs target-carrier admission plus edge assurance. | Rewrite as output identity admission feeding evidence and pressure. Content completeness remains with F_P/content ledgers and declared execution evidence. |
| `build_tenants/typescript/code/src/operator/edge_gain_closure.ts` | `targetCarrierSatisfied` participates in `obligationsAndLedgersComplete`; missing/rejected carrier status drives close disposition. | Separate protocol/evidence admission from content completion. Preserve target-carrier pressure and identity, but do not let it masquerade as product/content closure. |
| `build_tenants/typescript/code/src/operator/installed_operator.ts` | `targetCarrierPayloadForState` uses design/test/component register admission as structural target-carrier payload; register rejection can become carrier rejection. | Classify register failures by downstream-read graph. Unconsumed register drift records diagnostics; consumed protocol/context failures block only the appropriate admission or construction step. |
| `build_tenants/typescript/code/src/operator/installed_operator.ts` | overlay segment completion sets remaining pressure refs to `[]` when `productConverged` projects true. | Preserve remaining pressure unless every pressure ref has clearing evidence, lawful reprice/re-entry, or declared no-close/projection-only ownership. |
| `build_tenants/typescript/code/src/projection/query_domain.ts` | target-carrier diagnostics are projected as close-capable row diagnostics and risk becoming operator-facing closure truth. | Keep query/gaps read-only. Expose severity, pressure, and evidence refs without choosing routing or closure. |
| `build_tenants/typescript/code/src/operator/handoff.ts` and `operator/carriers.ts` | worker packages can optimize around carrier/register conformance rather than executable product behavior. | Project concise target identity and worker-fillable templates; make execution target, content gaps, and current evaluated pressure explicit. |
| `build_tenants/typescript/code/src/graph/overlays.ts` and traversal strategy | small products can be routed through a full lifecycle graph before first execution. | Add profile/explicit overlay binding: `thread`, `breadth`, `full_lifecycle`. Hello-world uses `thread`; data_mapper uses breadth/full lifecycle by declared proof goal. |
| test harness/live lanes | proof can stop at deterministic fixture pass or harness expectation without showing product-path execution. | Proof must include deterministic negative/positive cases and live or live-equivalent archives showing execution-backed pressure survival. |

## Authority Placement Rules

1. `F_D` may admit envelope identity, validate protocol fields, fold ledger rows,
   compute diagnostics, preserve pressure, and route next action from admitted
   truth.
2. `F_D` must not judge open-ended SDLC content completeness unless a product
   contract declares that edge deterministic, projection-only, or no-close.
3. `F_P` owns constructive SDLC work and ambiguous content judgment.
4. Declared execution evidence is required for executable closure where the edge
   declares execution.
5. Pressure cannot disappear behind a close, overlay, or query projection.
6. Target-carrier contracts stay mandatory, but their authority is output
   identity/evidence admission, not content closure.

## Implementation Progress

### 2026-05-16 target-carrier authority-placement slice

Implemented the first controlling T-170 correction end to end across
requirements, design, runtime folds, and deterministic proof:

- repriced `REQ-F-ODDSDLC-070` so target-carrier admission is output envelope
  and identity evidence admission, not SDLC content closure;
- added edge-closure requirement language that carrier admission,
  materialization, worker assertion, postflight success, and register
  conformance are evidence dimensions rather than product/content closure by
  themselves;
- repaired `ODD_SDLC_TYPESCRIPT_TARGET_CARRIER_CONTRACTS.md` so rejected and
  missing carriers preserve protocol/evidence pressure instead of acting as the
  content-completeness predicate;
- repaired `ODD_SDLC_TYPESCRIPT_EDGE_GAIN_CLOSURE_CONTRACT.md` to state that
  target-carrier admission is an evidence dimension and executable edges need
  admitted execution evidence when declared;
- removed `targetCarrierSatisfied` from
  `build_tenants/typescript/code/src/operator/edge_gain_closure.ts`; required
  obligations and required ledger inputs now own
  `obligationsAndLedgersComplete`, while target-carrier rejected/missing states
  add protocol pressure;
- changed edge assurance close disposition to derive from unresolved pressure
  instead of directly from target-carrier status;
- changed `build_tenants/typescript/code/src/operator/traversal_consequence.ts`
  so missing/rejected carrier state is preserved as residual pressure and
  closure cannot converge while that pressure remains;
- changed the installed operator component-depth target-carrier path so
  component register rejection no longer becomes target-carrier rejection for
  the generic component payload path; the carrier envelope can be admitted and
  the content/register issue remains pressure for retry/evaluation;
- updated T-169/T-164/T-118/T-159 tests to prove the corrected placement:
  rejected/missing carrier admission preserves protocol pressure without
  lowering SDLC content completeness, legacy non-carrier fixtures declare
  `not_required`, and construction-template authority replaces duplicated
  prompt prose.

Verification:

- `npm run lint:semantic` - pass
- `npm run test:t164:edge-contract` - pass, 19 tests
- `npm run test:t168` - pass, 9 tests
- `npm run test:t169` - pass, 5 tests
- `npm run test:semantic` - pass, 588 tests

`npm run lint:test-harness` is listed in this ticket's proof surface, but the
TypeScript tenant `package.json` currently has no `lint:test-harness` script.
That proof command remains an unresolved harness-surface item rather than a
runtime failure.

### 2026-05-16 overlay pressure-preservation slice

Repaired the installed overlay completion path that was still able to erase
pressure when a terminal graph function allowed product convergence:

- `build_tenants/typescript/code/src/operator/installed_operator.ts` now
  computes product convergence only when the overlay allows product convergence
  and the overlay termination has no remaining graph, requirement, asset, or
  next-overlay pressure;
- installed overlay completion always passes the active overlay's remaining
  pressure refs into `constructSdlcOverlaySegmentCompletion` instead of
  replacing them with `[]`;
- `build_tenants/typescript/test_env/tests/test_t168_design_consumer_test_pipeline.test.mjs`
  now proves that a full-overlay terminal function with remaining pressure
  records `overlay_segment_complete`, keeps graph/requirement/asset pressure,
  and does not project `product_converged`.

Verification:

- `npm run lint:semantic` - pass
- `npm run test:t168` - pass, 9 tests

### 2026-05-16 F_D severity-classification slice

Introduced the first typed F_D severity-placement surface:

- `build_tenants/typescript/code/src/shared/blocking_reason.ts` now declares
  `protocol_invalid`, `construction_context_invalid`,
  `diagnostic_shape_invalid`, and `content_unproven`;
- added `classifySdlcFdFailure(...)` so existing blocking reason truth can be
  mapped into the T-170 severity classes without changing lawful re-entry;
- added downstream-read placement: a failure on a field that is not consumed by
  downstream routing, admission, closure, or execution construction classifies
  as `diagnostic_shape_invalid`, records residual pressure, and does not block
  admission or construction;
- added `target_carrier_admission_missing` as protocol/evidence admission
  pressure instead of content failure;
- `build_tenants/typescript/test_env/tests/test_t086_blocking_reason_carriers.test.mjs`
  now proves protocol, construction-context, diagnostic-shape, and content
  classifications.

Verification:

- `npm run lint:semantic` - pass
- `npm run test:t086` - pass, 7 tests

### 2026-05-16 proof-surface repair

The ticket proof surface named `npm run lint:test-harness`, but the TypeScript
tenant package did not expose that script. Added
`lint:test-harness = eslint --max-warnings=0 "test_env/{tests,sandbox,live}/**/*.mjs"`
to `build_tenants/typescript/package.json` so the proof command is executable.

The first script shape used `test_env/**/*.mjs`, which walked generated live
archives under `test_env/test_runs/**/node_modules`. That made the proof
surface depend on installed/generated workspaces instead of the tenant harness.
The narrowed script keeps the proof on source-controlled test harness files.

Verification:

- `npm run lint:semantic` - pass
- `npm run lint:test-harness` - pass
- `npm run test:semantic` - pass, 594 tests

### 2026-05-16 profile overlay-strategy slice

Made overlay selection profile/operator truth instead of catalog-order
accident:

- added the closed overlay strategy vocabulary `thread | breadth |
  full_lifecycle` in
  `build_tenants/typescript/code/src/shared/overlay_strategy.ts`;
- `SdlcConformProjectProfile` now admits `overlayStrategy` and `overlayRef`
  from project constraints/profile truth, and the canonical constraints
  template materializes those fields;
- `publicStartOnce(... target.kind = "next")` now consumes the conformed
  profile overlay binding before falling back to published catalog order;
- explicit operator overlay starts may use strategy handles such as `thread`;
- hello-world fixtures now declare `overlay_strategy: thread`, while the
  data_mapper induction fixture declares `overlay_strategy: full_lifecycle`;
- `ODD_SDLC_TYPESCRIPT_WORKSPACE_INGRESS_SEAMS.md` now records that the
  profile overlay binding is routing/admission truth, not closure evidence.

Verification:

- `npm run build:semantic` - pass
- `npm run lint:semantic` - pass
- `node --test test_env/tests/test_t160_traversal_overlays.test.mjs` - pass,
  19 tests
- `node --test test_env/tests/test_t068_conform_project_profile.test.mjs` -
  pass, 6 tests
- `npm run lint:test-harness` - pass
- `npm run test:semantic` - pass, 592 tests

### 2026-05-16 replay/continuation identity slice

The first fresh hello-world live run after profile overlay selection exposed a
real replay bug:

```text
preserved run:
  20260516T094133711Z_pid55116
failure:
  after closing derive_lite_design_adr_surface, target next replay restarted
  vector 0 instead of selecting derive_lite_component_code_surface
root cause:
  startOutcomeForObservedReplay rewrote target: next into
  target: graph_function(lite_design_module_implementation). That changed the
  public-start source identity from next/next to graph_function/<selected>,
  which changed the overlay binding/frame lineage. ABG therefore saw a new
  basis and lawfully restarted the basis at vector 0.
```

Correction:

- `build_tenants/typescript/code/src/start/public_start.ts` now admits
  `replayNextGraphFunctionRef`;
- public start keeps the original `target: next` source identity and uses the
  replay next-graph-function ref only as the selected vector inside that stable
  public-start basis;
- `build_tenants/typescript/code/src/spec_method/entry.ts` preserves
  archived `target: next` replay identity and carries `nextGraphFunctionRef`
  separately;
- tests now prove that archived `next` replay keeps basis identity while
  selecting the next lite overlay vector.

Verification:

- `npm run build:semantic` - pass
- focused T-160 replay tests - pass
- focused T-058 archived-next replay test - pass
- preserved archive continuation against
  `build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260516T094133711Z_pid55116`
  advanced to `derive_lite_component_code_surface`, closed the edge with
  admitted target carrier, materialized
  `build_tenants/hello_world_javascript/src/hello.js`, and `node` printed
  `Hello, world!`.

### 2026-05-16 live hello-world proof

Fresh live proof:

```text
command:
  ODD_SDLC_WORKER_TIMEOUT_MS=14400000 \
  ODD_SDLC_TS_T132_HELLO_WORLD_JS_SCENARIO_LIVE=1 \
  ODD_SDLC_TS_T132_HELLO_WORLD_JS_SCENARIO_MAX_ADVANCES=4 \
  npm run test:t132:hello-world-live

archive:
  build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260516T100857716Z_pid91791

result:
  1 test, 0 failures, duration 518710.540375ms
```

Observed graph behavior:

- deterministic conform start completed first as `Fg_conform_project`;
- first F_P handoff used
  `overlay://odd-sdlc/lite-design-module-implementation`;
- first ADR attempt blocked with preserved target-carrier admission pressure;
- ADR retry repaired the target-carrier/register placement and closed with
  `targetCarrierAdmissionStatus: admitted`;
- continuation selected `derive_lite_component_code_surface` rather than
  restarting vector 0;
- component-code edge materialized
  `build_tenants/hello_world_javascript/src/hello.js`;
- the harness process check ran `node
  build_tenants/hello_world_javascript/src/hello.js` and observed
  `Hello, world!`.

Harness correction:

- live scenario expectations no longer treat the deterministic conform start as
  the first F_P handoff;
- `test_env/sandbox/scenario_sandbox.mjs` now asserts first handoff overlay
  from the first `handoff_manifest.json`;
- T-132 live expectations assert the lite edge-assurance archive sequence and
  materialization ledger evidence, not merely file existence.

Verification:

- `npm run lint:test-harness` - pass
- focused sandbox descriptor test - pass
- `npm run test:t132:hello-world-live` - pass

This proof was not sufficient by itself for T-170 closure. It showed the product
could execute through the harness process check, but the component-code edge's
runtime ledger still recorded `executionEvidence = null`. That meant product
execution truth existed outside the SDLC closure spine.

### 2026-05-16 runtime execution-evidence placement slice

Repaired the executable component-code path so declared execution evidence is
runtime-admitted before closure:

- `test_env/fixtures/t132_hello_world_single_tenant/.ai-workspace/context/project_constraints.yml`
  now declares `test_execution_contract:
  node build_tenants/hello_world_javascript/src/hello.js`;
- `build_tenants/typescript/code/src/operator/handoff.ts` now materializes an
  execution shard for `derive_lite_component_code_surface` when the target is a
  required component-code surface and the conformed project declares an
  execution contract;
- the emitted shard runs from the module workdir with tenant-local command
  `node src/hello.js`, while preserving the declared product command as the
  contract;
- component-code postflight now requires governed
  `sdlc_worker_execution_evidence` when that executable contract is declared;
- `build_tenants/typescript/code/src/workspace/project_profile.ts` now preserves
  `build_execution_contract` and `test_execution_contract` in canonical
  conformance output, so conforming the project cannot erase the declared
  execution contract before the first handoff.

Deterministic proof:

- `build_tenants/typescript/test_env/tests/test_t066_product_materialization_contract.test.mjs`
  proves the lite component-code edge emits the execution shard and blocks
  postflight when governed execution evidence is missing;
- `build_tenants/typescript/test_env/tests/test_t068_conform_project_profile.test.mjs`
  proves canonical conformance preserves execution contracts;
- `build_tenants/typescript/test_env/tests/test_t160_traversal_overlays.test.mjs`
  preserves the profile/overlay routing and replay identity proofs.

Fresh live proof:

```text
command:
  ODD_SDLC_WORKER_TIMEOUT_MS=14400000 \
  ODD_SDLC_TS_T132_HELLO_WORLD_JS_SCENARIO_LIVE=1 \
  ODD_SDLC_TS_T132_HELLO_WORLD_JS_SCENARIO_MAX_ADVANCES=4 \
  npm run test:t132:hello-world-live

archive:
  build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260516T103117345Z_pid53647

result:
  1 test, 0 failures, duration 421321.089167ms
```

Runtime evidence in the archive:

- component-code handoff
  `operator-runs/20260516T103634878Z_pid53647/handoff_manifest.json`
  contains `testExecutionContract:
  node build_tenants/hello_world_javascript/src/hello.js`;
- the same handoff contains one execution shard:
  `command: node src/hello.js`,
  `requiredEvidenceKind: sdlc_worker_execution_evidence`,
  `workingDirectory:
  .../workspace/build_tenants/hello_world_javascript`;
- `worker_result_report.json` for the component-code edge records
  `executionEvidence.status: succeeded`, `testsObserved: 1`,
  `passedCount: 1`, `failedCount: 0`;
- `fp_evaluate_result.json` records `executionEvidenceStatus: succeeded` and
  `postflightStatus: passed`;
- `test_shard_hello_world_javascript.stdout.log` contains `Hello, world!`;
- the component-code close decision records
  `targetCarrierAdmissionStatus: admitted` for
  `gtl://target-carrier-contract/odd-sdlc/derive_lite_component_code_surface/component_code_surface`.

Verification:

- `npm run lint:semantic` - pass
- `npm run lint:test-harness` - pass
- `npm run build:semantic` - pass
- `node --test test_env/tests/test_t066_product_materialization_contract.test.mjs`
  - pass, 74 tests
- `node --test test_env/tests/test_t068_conform_project_profile.test.mjs` -
  pass, 6 tests
- `node --test test_env/tests/test_t160_traversal_overlays.test.mjs` - pass,
  20 tests
- `npm run test:semantic` - pass, 595 tests

### 2026-05-16 data-mapper live-equivalent smoke

Ran the internal data-mapper induction sandbox as a data-mapper-scale
live-equivalent check:

```text
command:
  npm run test:t087-t096:data-mapper-sandbox

result:
  4 tests, 0 failures, duration 19090.263375ms
```

This proof confirms the data-mapper fixture still inducts through the governed
conformance path, canonicalizes the legacy output root into
`build_tenants/scala_spark`, imports the large requirement surface, and advances
past `Fg_conform_project` before downstream traversal.

This is not the full external data-mapper capability live run. The full
`npm run test:t164:data-mapper-full-capability-live` archive remains the
remaining high-cost proof if T-170 is to be closed strictly against its
`live_or_equivalent` line rather than accepted on deterministic and
live-equivalent substrate proof.

## Detailed By-Module Design From test35 Review

The old test35 design review does not say "make the prompt bigger." It says the
runtime must preserve one current-state-first construction loop:

```text
current workspace state
+ exact failing F_D/evaluator output
+ declared obligation ledger policy
+ current target asset state
+ admitted prior evidence
-> next bounded F_P construction pass
-> admitted evidence
-> edge ledger
-> close / yield / retry / repair / re-enter / reprice / block
```

T-170 implements that loop by repairing the modules below. Each module must keep
one authority role. A module may project or display another module's truth; it
must not compute a parallel closure, routing, or product-completeness truth.

### Requirements Modules

`specification/requirements/16-edge-gain-closure-contract.md`

- Owns the generic edge-gain law.
- Must state that each close-capable edge declares authority basis, obligation
  set, evidence policy, metric function, threshold, close function, residual
  pressure function, and composition rule.
- Must state that materialization, carrier admission, worker assertion, and
  postflight pass are admissible evidence dimensions, not product behavior
  closure by themselves.
- Must require execution evidence for executable edges when an execution
  contract is declared. If execution evidence is absent, `ClosedEdge(e)` has no
  inhabitant.
- Must carry the pressure-preservation predicate: required/downstream pressure
  can clear only by clearing evidence, lawful reprice/re-entry, or declared
  no-close/projection-only ownership.

`specification/requirements/17-target-carrier-contracts.md`

- Owns the SDLC consumption of ABI T-133 output-carrier law.
- Must keep effective target-carrier bindings mandatory and non-null.
- Must reprice REQ-F-ODDSDLC-070 away from "target carrier admission is an
  output-shape closure precondition" toward "target carrier admission is
  envelope/identity evidence admission."
- Must distinguish malformed envelope pressure from incomplete SDLC content
  pressure.
- Must not let target-carrier status become the metric that decides requirement
  fulfillment, implementation correctness, test adequacy, or product close.

### Design Modules

`build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TARGET_CARRIER_CONTRACTS.md`

- Rewrite the claim from "closure needs target carrier admission plus edge
  assurance" to "target-carrier admission admits output identity and envelope
  evidence that may feed edge assurance."
- Define total target-carrier state:
  `admitted | rejected | missing | not_required`.
- Define rejected and missing as protocol/evidence admission states with pressure
  refs. They are not content-failure verdicts.
- State that well-formed carriers with weak content are admitted structurally,
  then routed to F_P/content pressure.
- Keep target carrier rows as the single source for contract ref, digest,
  target node, target schema, nested payload path, fixed protocol fields, and
  worker-fillable fields.

`build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TEST_PIPELINE.md`

- Rewrite test-pipeline closure around three distinct states:
  planned coverage, realized test source, and executed test evidence.
- Test design and test modules are construction assets; they do not close
  product behavior until declared tests execute and results are admitted.
- UAT-derived integration tests must preserve source testcase authority,
  generated/selected test data, expected results, observed results, and
  verification rows.
- Test conformance failures may become construction pressure; they cannot replace
  F_P/content judgment or declared execution evidence.

`build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_EDGE_GAIN_CLOSURE_CONTRACT.md`

- Align the design with the test35 gain-function form:
  `O = derive_obligations(authority, edge_policy)`,
  `E = admit_evidence(...)`,
  `m(o) = metric_function(o, E)`,
  and close only when all required thresholds and pressure predicates hold.
- Declare worker obligation assessments as candidate evidence only. They cannot
  supply the metric numerator, denominator, or threshold.
- Add explicit examples for executable code/test edges:
  materialization is necessary but insufficient; execution evidence and
  behavioral/content evidence are required where declared.

`build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_ASSURANCE_INTEGRATION.md`

- Keep assurance ledgers as dimension evidence and diagnostics.
- Assurance statuses may feed `SdlcEdgeClosureDecision`; they must not become a
  parallel next-action authority.
- Add F_D severity placement:
  `protocol_invalid`, `construction_context_invalid`,
  `diagnostic_shape_invalid`, and `content_unproven`.
- Define which severity classes block admission, block construction, record
  residual pressure, or route to F_P/execution.

`build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_DETERMINISTIC_TRAVERSAL_STATE_MACHINE.md`

- Reframe deterministic state transitions as support around the F_P loop.
- Add the execution-attempt threshold: command resolves, declared files exist,
  cheapest parse/load/import passes when available, and worker process did not
  end in crash/policy/missing-output protocol failure.
- State that those checks gate the execution attempt, not product closure.

`build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_FP_EVALUATION_LEDGER_PURPOSE.md`

- Make F_P evaluation explicit: F_P judges ambiguous product/content meaning
  over admitted evidence and current workspace state.
- F_P evaluator output must be admitted back into the ledger/event spine before
  it can affect closure or routing.
- Preserve the W/L/E/Ev relation:
  mutable workspace, immutable ledger truth, replay events, evaluator work over
  ledger truth.

### Graph Modules

`build_tenants/typescript/code/src/graph/catalog.ts`
`build_tenants/typescript/code/src/graph/module.ts`
`build_tenants/typescript/code/src/graph/library.ts`

- Preserve graph functions as the constructive authority catalog.
- Expose graph actions as selectable rows, not only a sequential broad chain.
- Keep broad lifecycle functions for data_mapper-scale work, but make small
  executable product paths first-class graph/action rows.
- Ensure every close-capable action has an edge-gain/close contract and a target
  carrier row where output identity matters.
- Do not hide product construction inside controller-local service methods.

`build_tenants/typescript/code/src/graph/overlays.ts`

- Add admitted overlay binding:
  `thread | breadth | full_lifecycle`.
- `hello_world` profile uses `thread` so it can reach product source/test/
  execution before the full data_mapper lifecycle.
- `data_mapper` uses `breadth` or `full_lifecycle` according to declared proof
  goal.
- Overlay completion must project pressure from edge/consequence truth. It must
  not set remaining pressure refs to `[]` simply because a local segment closed.

`build_tenants/typescript/code/src/graph/target_carrier_contracts.ts`

- Be the single SDLC registry/projection for target carrier rows.
- Return typed diagnostics for malformed or mismatched declarations; do not
  throw TypeError out of query/projection paths.
- Preserve selected contract identity for all states, including missing and
  rejected.
- Provide handoff projection data but no content-completeness decision.

`build_tenants/typescript/code/src/graph/edge_gain_closure_contracts.ts`

- Keep edge contracts explicit per graph action.
- Separate evidence requirements into dimensions:
  materialization, execution, content/F_P judgment, target-carrier envelope,
  test evidence, release-depth pressure.
- A simple thread edge may have fewer dimensions, but its scope must be explicit
  and cannot project full product convergence when downstream pressure remains.

`build_tenants/typescript/code/src/graph/boundary_refs.ts`

- Centralize new refs for pressure, severity, clearing evidence, overlay
  strategy, target-carrier admission state, and execution evidence.
- Avoid string-literal drift across handoff, ledger, query, and tests.

### Workspace And Policy Modules

`build_tenants/typescript/code/src/workspace/project_profile.ts`

- Admit `overlayStrategy` and/or `overlayRef` as project/profile truth.
- Do not infer the small graph from file count or graph size.
- Profiles may declare `hello_world -> thread`; product-scale profiles may
  declare `breadth` or `full_lifecycle`.
- The profile binding is input to action selection; it is not closure evidence.

`build_tenants/typescript/code/src/shared/traversal_strategy_plan.ts`
`build_tenants/typescript/code/src/operator/traversal_strategy.ts`

- Convert overlay/profile policy into traversal plan rows.
- Preserve scope honesty in every plan: included assets, deferred assets,
  remaining pressure refs, and required execution/test evidence.
- Stop using traversal strategy as a way to erase deferred work. Deferred work is
  pressure unless the edge contract says it is out of scope.

`build_tenants/typescript/code/src/shared/blocking_reason.ts`

- Add or map blocking reasons into the four F_D severity classes.
- Classify `target_carrier_admission_missing` as protocol/evidence admission
  pressure, not content failure.
- Classify execution failures and missing test evidence as `content_unproven`
  or execution pressure that routes to F_P/test/execution, not register repair.
- Keep lawful re-entry separate from severity. Severity says what kind of
  failure it is; re-entry says where work resumes.

### Operator Consequence Modules

`build_tenants/typescript/code/src/operator/traversal_consequence.ts`

- Remains the spine:
  `ConstructionIntent -> WorksiteEvidence -> EdgeFulfillmentLedger ->
  EdgeClosureDecision -> NextActionProjection`.
- Extend existing carriers rather than introduce a parallel ledger.
- Add clearing evidence refs and retained pressure refs so pressure cannot
  disappear at close.
- Make target-carrier identity total on ledger and decision carriers.
- Store F_D severity mix and evidence refs as ledger facts.
- `SdlcNextActionProjection` is the only next-action projection surface; gap
  dossiers and summaries render it.

`build_tenants/typescript/code/src/operator/edge_gain_closure.ts`

- Compute gain from admitted evidence, not worker assertions.
- Remove `targetCarrierSatisfied` from product/content completeness.
- Treat target carrier as an admission/evidence dimension:
  missing/rejected adds protocol pressure; admitted supplies evidence refs.
- Compute content closure from declared metric functions over admitted evidence.
- Require execution evidence for executable edges when the edge contract declares
  execution.
- Derive close disposition from:
  required obligations, metric thresholds, required evidence, unresolved
  pressure, and lawful re-entry state.

`build_tenants/typescript/code/src/operator/installed_operator.ts`

- Orchestrate the one loop: observe current state, admit construction intent,
  invoke worker, admit evidence, derive ledger, derive closure, project next
  action.
- Stop clearing `remainingGraphPressureRefs`,
  `remainingRequirementPressureRefs`, or `remainingAssetPressureRefs` on
  `productConverged` unless clearing evidence exists for every ref.
- Stop letting register admission rejection become target-carrier rejection when
  the rejected fields are not downstream-read for routing/admission/closure/
  execution construction.
- Attempt declared execution as soon as the execution-attempt threshold is met.
- Preserve live/yield/retry/repair/reprice distinctions from the consequence
  chain; do not translate them into local summary authority.

`build_tenants/typescript/code/src/operator/handoff.ts`
`build_tenants/typescript/code/src/operator/carriers.ts`

- Worker handoff must carry the test35-critical pressure, compactly:
  current target asset state, exact failing evaluator/F_D output, current
  evaluated gaps, prior edge/gap refs, delta summary, obligation ledger policy,
  declared execution target, and accepted output envelope.
- Prompt text is a projection over those typed fields, not an independent
  contract.
- The worker receives worker-fillable fields and fixed protocol fields clearly.
  It should spend attention on product work and failing evidence, not guessing
  internal register shape.
- Product materialization contract must own exact target file roles and allowed
  roots; context scanning cannot remain an authority path.

`build_tenants/typescript/code/src/operator/design_depth_register.ts`
`build_tenants/typescript/code/src/operator/component_depth_register.ts`
`build_tenants/typescript/code/src/operator/test_design_register.ts`

- Emit structured admission with severity, evidence refs, and downstream-read
  classification.
- Required fields read by routing/admission/closure/execution construction may
  block as `protocol_invalid` or `construction_context_invalid`.
- Extra or malformed fields that no downstream consumer reads become
  `diagnostic_shape_invalid` and record residual diagnostic pressure.
- Do not force a worker retry merely to remove unconsumed fields.

`build_tenants/typescript/code/src/operator/assurance_gate.ts`
`build_tenants/typescript/code/src/assurance/*`

- Assurance ledgers remain evidence/diagnostic dimensions.
- Assurance may say content is unproven, execution is missing, tests are weak,
  stubs remain, or obligations are not covered.
- Assurance must not use carrier/register compliance as content fulfillment.
- Assurance output feeds `SdlcEdgeClosureDecision`; it does not route work by
  itself.

`build_tenants/typescript/code/src/operator/test_pipeline.ts`

- Materialize test pipeline truth as product evidence:
  test design, test data, expected results, realized test source, execution
  command, observed result, verification row, archive row.
- UAT tests are integration tests over product behavior.
- A pending skeleton, zero-test run, or source-only test file cannot close
  executable test pressure.

### Projection And Public Boundary Modules

`build_tenants/typescript/code/src/projection/query_domain.ts`

- Keep query-domain read-only.
- Project target-carrier state, severity, pressure, clearing evidence, execution
  evidence state, and overlay scope from ledger/consequence truth.
- Do not choose routing or improve closure. If the ledger is not closed, the
  projection must not say converged.
- Remove any controller-side reconstruction of carrier truth that duplicates the
  registry/consequence carriers.

`build_tenants/typescript/code/src/projection/requirement_closure.ts`

- Separate display requirement IDs from stable authority refs.
- Compute requirement closure from admitted evidence verdicts, not tag presence
  or worker fulfillment claims.
- Expose incomplete requirement closure as pressure that can feed F_P
  construction.

`build_tenants/typescript/code/src/spec_method/entry.ts`
`build_tenants/typescript/code/src/start/public_start.ts`

- Public start/gaps must render or consume the single consequence chain.
- Delete archive-derived or summary-derived closure authority.
- Do not let CLI/harness options become product-pressure authority. Product
  pressure comes from conformed workspace/profile/requirements and admitted
  construction intent.
- When no lawful action exists, fail closed with typed no-lawful-action pressure
  rather than falling back to broad lifecycle traversal.

### Test And Analyzer Modules

`build_tenants/typescript/test_env/tests/`

- Add T-170 focused tests for:
  target-carrier evidence admission versus content closure, F_D severity
  classification, pressure preservation, execution-attempt threshold,
  hello_world thread overlay, data_mapper scope honesty, and register
  diagnostic drift.
- Keep existing T-168/T-169 tests only as regression inputs after their expected
  assertions are reframed under T-170. They must not assert superseded closure
  semantics.

`build_tenants/typescript/test_env/live/`
`build_tenants/typescript/test_env/sandbox/`

- Live proof must exercise product paths, not harness-only expected files.
- Hello-world proof must show first execution before full lifecycle apparatus.
- data_mapper proof must show pressure survival, failure-driven continuation,
  realized tests, executed tests when declared, and no product convergence while
  downstream pressure remains.

`build_tenants/typescript/code/src/analysis/*` and T-161

- Analyzer remains read-only.
- Add or use metrics from the strategy:
  convergence rate per edge, execution coverage at close, F_D failure mix,
  worker-briefs-to-executed-test ratio, residual-pressure survival, and
  attempts-to-first-execution.
- Analyzer output can prove the correction landed; it cannot route work or close
  the product.

## Work Sequence

### L0 - Supersession Hygiene

- Move T-168 and T-169 out of active status.
- Make the strategy the controlling surface.
- Ensure no implementation task still cites T-168 or T-169 as active authority.

### L1 - Requirement Reprice

- Reprice REQ-F-ODDSDLC-070 so target-carrier admission is evidence admission.
- Preserve mandatory effective carrier bindings without promoting carrier
  status into product/content closure.
- Add the pressure-preservation predicate to requirements or the edge-closure
  requirement family.

### L2 - Design Repair

- Rewrite target-carrier design around admission, identity, and evidence.
- Rewrite test-pipeline design around execution-backed co-affirmation.
- Rewrite edge-closure design so closure preserves pressure and delegates
  ambiguous content judgment to F_P/content ledgers.
- Record failure severity classes and downstream-read graph classification.

### L3 - Runtime Refactor

- Refactor `edge_gain_closure.ts` so target-carrier state is total and
  evidence/admission-scoped.
- Refactor installed-operator pressure clearing and overlay completion.
- Refactor register admission consumption so diagnostic shape drift does not
  dominate worker repair.
- Refactor worker handoff packages so the worker sees current evaluated gaps,
  execution target, accepted envelope, and content pressure.

### L4 - Overlay And Execution

- Add explicit profile/overlay binding for `thread`, `breadth`, and
  `full_lifecycle`.
- Ensure `hello_world` reaches execution through the thread path before full
  lifecycle apparatus.
- Ensure `data_mapper` preserves breadth/full lifecycle pressure and does not
  falsely converge from partial component/code closure.

### L5 - Proof

- Update deterministic tests to prove the new authority placement.
- Run the live hello-world lane.
- Run a data_mapper live or live-equivalent lane.
- Compare the resulting archive against test35 for execution evidence, pressure
  survival, and worker-pass depth.

## Closure Review Standard

Do not close this ticket on green focused tests alone.

Closure requires:

- requirements and design repaired;
- wrong-direction code paths removed, not compatibility-shimmed;
- deterministic positive and negative tests updated;
- live or live-equivalent archive proof;
- explicit comparison against test35 behavior;
- no active T-168/T-169 residual implementation authority.
