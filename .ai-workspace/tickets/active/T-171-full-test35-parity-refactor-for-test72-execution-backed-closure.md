---
id: T-171
title: Full test35 parity refactor for test72 execution-backed closure
type: feature
ticket_category: implementation_migration
status: active
proof_status: requirements_unmet
priority: critical
owner: odd_sdlc
build_tenant: typescript
created_at: 2026-05-17
updated_at: 2026-05-18
triaged_at: 2026-05-17
activated_at: 2026-05-17
goal: restore-test35-behavior-in-typescript-through-execution-backed-fp-closure
change_intent: Refactor the TypeScript SDLC implementation to recover the successful test35 behavior as one authoritative graph, ledger, prompt, execution, analyzer, and proof surface. The refactor removes the fragmented F_D-overweighted closure path, makes F_P content evaluation and admitted execution evidence the only product-completeness authority, preserves residual pressure across attempts, restores the missing graph products needed for test35 parity, and proves the result against test72-style data_mapper runs.
change_class: requirement_reprice
re_entry_point: requirements
first_missing_layer: requirements
governance_scope: STDO Method / SPEC_METHOD
ticket_status_authority: this ticket file; source posts and completed tickets are evidence only
execution_contract_policy: operator-admitted active ticket work; execution must derive from this ticket and the governing specification/design surfaces, not from prior commentary alone
implementation_scope_class: requirement_reprice with design_reframe and realization_refactor audit strictness
cutover_policy: hard cutover by design; the old closure and prompt paths are false-authority paths and must be deleted before close, not retained as fallback behavior
canonical_prompt_carrier: worker_construction_brief.json
test35_surface_loading_policy: TS must load the target workspace's existing source/spec/design/runtime surfaces as the current authority substrate, matching test35 behavior. Conformance may index, normalize, and expose those surfaces, but it must not replace them with a worker-authored conformant script or synthetic authority substitute.
legacy_decommission_policy: every legacy TypeScript feature touched by this refactor must be classified as retain, derive, replace, or delete; unmapped appendages are non-closure
current_closure_blocker: hello-world lifecycle now has an RC checkpoint through generated tests, execution-result admission, run archive, release-depth parity, and release preparation. T-171 remains open on the live data_mapper/test72 successor proof and test35 comparison.
closure_acceptance_policy: T-171 closes only when a TS.t171 successor run supports a like-for-like lifecycle comparison against data_mapper.test35 and matches or improves the test35 behavior. The run must traverse the full graph through active generated tests, admit concrete test execution results, review failures, preserve residual pressure, perform bug-fix continuation when needed, and close only from execution-backed evidence.
open_proof_gates:
  - live data_mapper test72 successor run admitting derive_test_execution_result_surface-class evidence with concrete pass/fail counts before release-level close
  - analyzer comparison showing test35 conceptual stages as mapped or explicitly invariant-preserving consolidated, not hidden by bounded scenario stop conditions
  - edge-by-edge like-for-like comparison showing TS.t171 matches or improves test35 on graph lifecycle, prompt/current-state construction, ledger pressure preservation, active test execution, failure review, bug-fix continuation, and final closure evidence
dependencies:
  - .ai-workspace/tickets/active/T-161-read-only-fd-run-analysis-linter.md
superseded_strategy_surfaces:
  - .ai-workspace/tickets/completed/T-168-build-design-consumer-test-pipeline-for-co-affirming-implementation.md
  - .ai-workspace/tickets/completed/T-169-implement-gtl-target-carrier-contracts-for-sdlc-vector-outputs.md
  - .ai-workspace/tickets/completed/T-170-implement-authority-placement-strategy-and-repair-fd-overreach.md
source_documents:
  - /Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md
  - specification/GOALS.md
  - specification/INTENT.md
  - specification/PRODUCT.md
  - specification/requirements/02-graph-functions.md
  - specification/requirements/03-runtime-governance.md
  - specification/requirements/10-odd-sdlc-software-domain-buildout.md
  - specification/requirements/13-odd-sdlc-typescript-tenant.md
  - specification/requirements/14-odd-sdlc-installed-product-contract.md
  - specification/requirements/15-odd-sdlc-scheduling-phase.md
  - specification/requirements/16-edge-gain-closure-contract.md
  - specification/requirements/17-target-carrier-contracts.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_EDGE_GAIN_CLOSURE_CONTRACT.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TARGET_CARRIER_CONTRACTS.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TEST_PIPELINE.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_DECOMMISSION_REGISTER.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_ASSURANCE_INTEGRATION.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_DETERMINISTIC_TRAVERSAL_STATE_MACHINE.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_FP_EVALUATION_LEDGER_PURPOSE.md
  - .ai-workspace/comments/codex/20260516T021725Z_MASTER_test35_attempts_failure_reference.md
  - .ai-workspace/comments/codex/20260516T024852Z_STRATEGY_fp_fd_eventual_consistency_steel_thread_execution.md
  - .ai-workspace/comments/codex/20260517T022635AEST_STRATEGY_test35_to_test72_next_steps.md
  - .ai-workspace/comments/claude/20260517T020000Z_STRATEGY_test35_feature_refactor_priority_for_test72_parity.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/comments/codex/20260516T121044Z_test35_python_success_walkthrough.md
  - .ai-workspace/comments/codex/20260428T114501Z_ANALYSIS_test35_code_iteration_manifests_vs_ts_prompt_gap.md
  - .ai-workspace/comments/codex/20260509_odd_sdlc_test35_edge_walkthrough_abg371_alignment.md
  - .ai-workspace/comments/codex/20260509_test35_capability_gap_computational_breakdown.md
  - .ai-workspace/comments/codex/20260511T025029Z_DESIGN_REVIEW_current_and_proposed_ledgers.md
  - .ai-workspace/comments/codex/20260513T035126Z_data_mapper_test35_vs_ts_followup.md
  - .ai-workspace/comments/codex/20260515_t164_data_mapper_full_capability_vs_test35_forensic.md
  - .ai-workspace/tickets/completed/T-164-declare-per-edge-gain-and-closure-functions-for-sdlc-traversals.md
related_tickets:
  - .ai-workspace/tickets/active/T-162-first-class-ticket-workflow-for-governed-change.md
  - .ai-workspace/tickets/completed/T-104-split-test-execution-from-test-run-archive-surface.md
  - .ai-workspace/tickets/completed/T-130-widen-design-depth-from-steel-thread-to-full-breadth.md
  - .ai-workspace/tickets/completed/T-158-replay-product-materialization-manifest-across-repair-attempts.md
  - .ai-workspace/tickets/completed/T-160-first-class-traversal-overlays-for-guided-graph-passes.md
  - .ai-workspace/tickets/completed/T-164-declare-per-edge-gain-and-closure-functions-for-sdlc-traversals.md
affected_boundary:
  requirements:
    - specification/PRODUCT.md
    - specification/requirements/02-graph-functions.md
    - specification/requirements/03-runtime-governance.md
    - specification/requirements/10-odd-sdlc-software-domain-buildout.md
    - specification/requirements/13-odd-sdlc-typescript-tenant.md
    - specification/requirements/14-odd-sdlc-installed-product-contract.md
    - specification/requirements/15-odd-sdlc-scheduling-phase.md
    - specification/requirements/16-edge-gain-closure-contract.md
    - specification/requirements/17-target-carrier-contracts.md
  design:
    - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_EDGE_GAIN_CLOSURE_CONTRACT.md
    - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TARGET_CARRIER_CONTRACTS.md
    - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TEST_PIPELINE.md
    - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_DECOMMISSION_REGISTER.md
    - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_ASSURANCE_INTEGRATION.md
    - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_DETERMINISTIC_TRAVERSAL_STATE_MACHINE.md
    - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_FP_EVALUATION_LEDGER_PURPOSE.md
  graph_code:
    - build_tenants/typescript/code/src/graph/catalog.ts
    - build_tenants/typescript/code/src/graph/module.ts
    - build_tenants/typescript/code/src/graph/library.ts
    - build_tenants/typescript/code/src/graph/overlays.ts
    - build_tenants/typescript/code/src/graph/edge_gain_closure_contracts.ts
    - build_tenants/typescript/code/src/graph/target_carrier_contracts.ts
    - build_tenants/typescript/code/src/graph/boundary_refs.ts
  domain_code:
    - build_tenants/typescript/code/src/domain/software_domain_catalog.ts
    - build_tenants/typescript/code/src/domain/carriers.ts
    - build_tenants/typescript/code/src/domain/admission.ts
  operator_code:
    - build_tenants/typescript/code/src/operator/assurance_gate.ts
    - build_tenants/typescript/code/src/operator/carriers.ts
    - build_tenants/typescript/code/src/operator/edge_gain_closure.ts
    - build_tenants/typescript/code/src/operator/handoff.ts
    - build_tenants/typescript/code/src/operator/installed_operator.ts
    - build_tenants/typescript/code/src/operator/traversal_consequence.ts
    - build_tenants/typescript/code/src/operator/design_depth_register.ts
    - build_tenants/typescript/code/src/operator/component_depth_register.ts
    - build_tenants/typescript/code/src/operator/test_design_register.ts
    - build_tenants/typescript/code/src/operator/test_pipeline.ts
  projection_code:
    - build_tenants/typescript/code/src/projection/query_domain.ts
    - build_tenants/typescript/code/src/projection/requirement_closure.ts
  analyzer_code:
    - build_tenants/typescript/code/src/cli/main.ts
    - build_tenants/typescript/code/src/analysis/run_analysis.ts
    - build_tenants/typescript/code/src/analysis
  test_surfaces:
    - build_tenants/typescript/test_env/tests
    - build_tenants/typescript/test_env/live
    - build_tenants/typescript/test_env/test_runs
excluded_boundary:
  - adding a second mechanical runtime loop outside ABG traversal
  - preserving old closure semantics behind compatibility switches
  - treating target-carrier or envelope shape admission as product-content closure
  - treating postflight shape/conformance pass as close evidence
  - treating a preparation edge as equivalent to execution result evidence
  - closing from worker assertion without F_P fulfillment ledger and execution evidence
  - creating sibling child tickets for the same truth surface; ordered gates inside this ticket are allowed
  - carrying duplicate prompt-construction pathways after the refactor
  - hiding missing graph products behind analyzer aliases
  - retaining legacy TypeScript features that serve no named test35-parity or current-product purpose
migration_strategy: Full replacement of the wrong-direction TypeScript closure and construction path. The work must remove or rewrite superseded behavior instead of carrying bridges, compatibility modes, or parallel truths. The migration order is requirements/design first, then graph/ledger/runtime implementation, then analyzer proof, then live parity proof.
library_usage: none
library_rationale: This is an internal graph, ledger, prompt, and closure refactor over existing odd_sdlc and ABIogenesis substrate APIs. Introducing a library would not address the authority-placement defect.
target_truth: Product completeness in odd_sdlc TypeScript is F_P content convergence proven by admitted execution evidence and recorded in one fulfillment ledger. F_D admits shape, identity, routing, diagnostics, and replay facts, but F_D does not close product meaning. Residual pressure is preserved until execution-backed evidence clears it. The graph declares the products required to build, test, execute, analyze, and close the target product; prompts are coherent construction carriers sourced from those graph products and ledgers. Legacy TS appendages that do not serve this truth are deleted or reduced to derived projections.
superseded_truth: Product closure can be inferred from target-carrier shape, postflight conformance, preparation-edge completion, rollup-edge completion, or worker declaration alone. A retry on hello-world is acceptable framework variance. Conformance can create early authority surfaces without explicit F_P product work. Analyzer aliases can hide missing graph products. Multiple prompt or closure surfaces can coexist until later cleanup.
closure_law: This ticket closes only when the TypeScript SDLC implementation has one authoritative test35-parity closure path, the superseded T-170 path is not independently active, product closure requires F_P fulfillment plus admitted execution evidence, residual pressure cannot be cleared by shape/conformance alone, the missing graph products from test35 are declared or deliberately consolidated in one graph/design truth with named pressure-direction invariants preserved, legacy TypeScript appendages are inventoried and resolved as retain/derive/replace/delete, the worker receives worker_construction_brief.json as the single coherent construction carrier instead of scattered prompt text, analyzer output distinguishes constructive edges from rollups, and a TS.t171/data_mapper successor run supports a like-for-like lifecycle comparison against data_mapper.test35 that matches or improves test35 by traversing the full graph, running active generated tests, admitting execution results, reviewing failures, preserving pressure, bug-fixing through continuation when needed, and closing only from execution-backed evidence.
evaluation_criteria:
  - requirements and design name F_P fulfillment plus execution evidence as product-completeness authority
  - no active ticket besides T-171 controls this refactor scope
  - closure fold rejects target-carrier-only, postflight-only, prep-only, and worker-assertion-only close
  - deterministic proof shows an execution-required edge cannot close without admitted execution evidence
  - execution result surface is restored or declared as the canonical execution-evidence edge, and live proof admits at least one derive_test_execution_result_surface-class event before release-level close
  - UAT, testcase, test implementation, test execution, run archive, release, implementation module, stack/profile, and materialization tracking products are each declared or explicitly consolidated into one graph truth while preserving named pressure-direction invariants
  - prompt construction has worker_construction_brief.json as its one source carrier and includes current state, failed output where present, obligations, target state, prior evidence, residual pressure, and execution context
  - surface loading matches test35: existing target workspace authority surfaces are imported/indexed as current state and prompt substrate; no worker-authored conformant script or synthetic authority surface substitutes for them
  - every legacy TypeScript feature touched by the refactor has a recorded disposition and no unused appendage remains active by default
  - retries on hello-world/data_mapper are classified as framework failure or drift unless caused by admitted product ambiguity or external runtime failure
  - analyzer reports edge timing, prompt source, ledger state, constructive-vs-rollup status, execution evidence status, and residual pressure transitions
proof_surface:
  static:
    - npm run lint:semantic
    - npm test
  focused:
    - deterministic tests for closure rejection of shape-only, prep-only, postflight-only, and worker-assertion-only evidence
    - deterministic tests for residual pressure preservation and execution-backed clearing
    - deterministic tests for prompt-source package construction and replay
    - deterministic tests for analyzer constructive-edge and rollup-edge disambiguation
  live_or_archive:
    - data_mapper test72 successor run using the active TypeScript tenant
    - npm run test:t171:data-mapper-lifecycle-live
    - analyzer markdown and JSON output for the same run
    - comparison update against /Users/jim/src/apps/abiogenesis/.ai-workspace/comments/codex/20260516T121044Z_test35_python_success_walkthrough.md
non_closure_conditions:
  - T-170 or any other ticket remains an independent active implementation authority for the same refactor
  - product closure can still pass with no admitted execution evidence
  - product closure can still pass from target-carrier shape admission or postflight conformance alone
  - residual pressure can be cleared without execution-backed F_P evidence or an explicit operator-admitted deferment
  - hello-world requires retry because of framework carrier/parser/prompt shape drift
  - analyzer collapses constructive edges into rollup aliases without preserving the missing traversal
  - prompt construction has multiple unsynchronized sources
  - TS asks a worker to create a conformant script or synthetic authority replacement where test35 would load and carry existing workspace surfaces
  - legacy TypeScript features remain active without a retain/derive/replace/delete disposition
  - design or code keeps TODO compatibility bridges for the superseded closure path
---

# T-171: Full Test35 Parity Refactor For Test72 Execution-Backed Closure

## STDO Intake

Smallest lawful re-entry point: `requirements`.

Reason: the defect is not a local implementation bug. The current TypeScript line has been pushed toward the wrong authority placement: F_D shape and conformance evidence can dominate or substitute for F_P product-content evaluation and execution-backed proof. Correcting that changes the constitutional product-completeness rule, then the design and code must follow.

Primary `change_class` remains `requirement_reprice` because lawful re-entry starts at requirements. Audit strictness is multi-layer: this ticket must also carry design-reframe and realization-refactor proof before close.

## One Surface Rule

This ticket is the single controlling work surface for the test35-to-test72 parity refactor.

The prior strategy posts, Claude reviews, Codex reviews, T-168, T-169, and T-170 are source evidence. They do not independently authorize implementation once this ticket is active.

There is no compatibility lane. A previous behavior is either the target truth, explicitly retained as a named graph/design contract, or removed. Bridges, duplicate closure folds, duplicate prompt package builders, duplicate ledger authorities, and "temporary" analyzer aliases are non-closure.

No rollback path exists by design. The superseded path is not a safe fallback; it is the false-authority behavior this ticket removes. During implementation, partial work may be validated in local tests or unmerged branches, but the accepted product line must not retain old closure behavior behind a runtime switch.

## Root Cause

The successful Python test35 line behaved like a construction system:

- it kept F_P semantic pressure alive until execution and iteration produced content evidence
- it used ledgers and runtime events to preserve state across attempts
- it built prompts from current state, target state, failed output, obligations, prior evidence, and execution results
- it generated explicit build, test, run, archive, release, and materialization products
- it treated execution as the practical completeness lever

The TypeScript test72 line has enough substrate to run, but it does not yet reproduce that behavior. The system can still behave as if carrier shape, postflight checks, or prep-edge closure are sufficient. That produces framework-induced retries, fragile hello-world behavior, missing or aliased traversals, and incomplete proof artifacts.

## Target Architecture

### Closure Authority

One closure rule governs close-capable product edges:

`F_P fulfillment ledger + admitted execution evidence + no surviving residual pressure => close`

F_D evidence is admissibility and replay support. It can block invalid protocol state. It cannot assert product completeness.

### Residual Pressure

Residual pressure is a first-class state carrier. It survives each attempt until one of these clears it:

- admitted execution evidence satisfies the referenced obligation
- admitted F_P evaluation retires the pressure because the obligation is now fulfilled
- an operator-admitted deferment moves the pressure out of close scope with a traceable reason

Shape validity, postflight conformance, target-carrier admission, and worker assertion do not clear pressure.

### Execution Evidence

The graph must contain a canonical execution-evidence path. The target sequence is:

1. `prepare_test_execution_surface`: declares executable command, environment, inputs, and expected evidence.
2. `derive_test_run_archive_surface`: executes or records the run archive under the declared contract.
3. `derive_test_execution_result_surface`: admits the run result as product evidence and binds it to obligations.

If implementation consolidates any of these, the graph/design must name the single canonical replacement and prove the analyzer can still report the missing conceptual stages. Silent consolidation is non-closure.

### Prompt Construction

Worker prompts are rendered from one structured construction carrier: `worker_construction_brief.json`.

The existing prompt-adjacent packages are either inputs to this carrier, derived projections from it, or deleted:

- `handoff_manifest.json`
- `worker_invocation_package.json`
- `worker_brief.json`
- `traversal_intent_package.json`
- `gap_dossier.json`

None of those packages may independently source prompt meaning after this refactor. The carrier must include:

- current workspace state and admitted artifacts
- selected graph edge and target product
- open obligations and residual pressure
- prior F_P evidence and execution results
- failed output when present
- accepted authority surfaces
- explicit excluded authority surfaces
- concrete next product target

Prompt text is a rendering of that carrier. Prompt text is not the carrier.

### Test35 Surface Loading

The TypeScript line must recover the same surface-loading behavior that made test35 successful.

test35 did not begin by asking a worker to author a conformant script that replaced the project. It loaded the target workspace's existing source, specification, requirement, design, register, runtime-event, and ledger surfaces as the stateful reality, then constructed the next F_P attempt from that observed state.

TS must follow the same rule:

- conformance imports, indexes, normalizes, and exposes existing target workspace surfaces
- conformance may create read-models and projection artifacts that point at those surfaces
- conformance must not create a worker-authored conformant script or synthetic authority surface as a substitute for the workspace truth
- `worker_construction_brief.json` must carry the loaded surface refs/current-state summaries into the prompt substrate
- graph traversal starts from loaded current state and residual pressure, not from a regenerated bootstrap interpretation of the project

The test72 conformant-script shape is superseded by this ticket. It was a misunderstanding of the target behavior.

### Graph Products

The refactor must restore or explicitly consolidate the test35 graph products needed for parity:

- intent/product/goal/requirement authority products when they carry content
- design ADR and design-depth products
- UAT testcase products
- testcase authority qualification
- test design and test implementation products
- test execution preparation, run archive, and execution result products
- implementation module products
- stack/profile/module selection products
- product materialization manifest and replay products
- release preparation products

The graph may consolidate redundant stages only when the single remaining stage owns the full authority and the analyzer can prove the consolidation. Consolidation is not a license to hide missing work.

Any consolidation must name and preserve its pressure-direction invariant:

- UAT consolidation must preserve "test pressure exists before design construction".
- Stack/profile/module consolidation must preserve "implementation decisions are replay-visible facts, not config-resolved opacity".
- Execution-lane consolidation must preserve "execution result evidence is admitted before product closure".
- Release consolidation must preserve "release close waits for admitted implementation and execution evidence".

Restoration is the default. Consolidation is accepted only when the invariant is explicit in design, enforced in code, and visible in analyzer output.

## Ordered Gate Register

This is not a split into child tickets. These are ordered proof gates inside the single T-171 surface so progress can be evaluated without weakening the one-truth rule.

Current gate status: T-171 is open. The current graph catalog declares the later test/execution/release edges, but the latest live hello-world proof did not traverse them. Declared graph coverage is not closure proof. A bounded scenario that stops after component-code materialization does not satisfy the test35 full-graph or execution-backed test-run requirement.

| Gate | Work Covered | Required Proof Before Moving On |
| --- | --- | --- |
| G0 | W0 | Legacy TS appendages touched by the refactor are inventoried with retain/derive/replace/delete disposition before code edits widen. |
| G1 | W1, W2, W3, W4, W5 | Requirements/design and focused tests prove execution-required closure fails without admitted execution evidence, F_P fulfillment gates close, and residual pressure survives shape-only or postflight-only evidence. |
| G2 | W6, W11 | `worker_construction_brief.json` is the only prompt-source carrier on the steel-thread path, and superseded closure/prompt helper imports are deleted rather than bypassed. |
| G3 | W7, W8 | Missing graph products are restored or consolidated with named pressure-direction invariants, and analyzer distinguishes constructive, projection, rollup, missing, and unmapped stages. |
| G4 | W9, W10, W12, W14 | Retry classification, timing, prompt-source, ledger, pressure, artifact, execution evidence views, and the named TS.t171 lifecycle delivery run support a like-for-like data_mapper comparison against test35. |

No gate is a closure boundary for the ticket. The ticket closes only when all gates pass and the final live/archive proof is recorded.

## Analyzer Ownership

T-161 owns the generic read-only analyzer capability. T-171 owns the parity requirements the analyzer must expose for this refactor: timing, prompt-source identity, constructive-vs-rollup classification, missing/unmapped conceptual stages, ledger state, residual-pressure transitions, and execution-evidence status.

If T-171 changes analyzer code before T-161 closes, the implementation note must update both surfaces: T-161 as the analyzer owner and T-171 as the consuming parity refactor. Analyzer extensions do not become a second authority for closure; they remain evidence/projection over the runtime truth.

## Legacy TS Decommission Register

This refactor is not only a move toward test35 behavior. It is also a removal pass over TypeScript appendages that were added while chasing parity but no longer serve a named product purpose.

Every touched legacy feature must be classified with one disposition:

- `retain`: the feature directly serves current test35-parity/product truth and remains authoritative.
- `derive`: the feature remains only as a projection from a newer authoritative carrier.
- `replace`: the feature is removed from active authority and replaced by the named target surface.
- `delete`: the feature has no remaining purpose and is removed.

Unclassified legacy code is non-closure.

| Legacy Surface | Suspect Appendage | Target Disposition | Required Proof |
| --- | --- | --- | --- |
| Closure fold | target-carrier, postflight, preparation-edge, or worker-report paths that can imply product close | `replace` with F_P fulfillment plus execution-evidence closure | deterministic rejection tests and no active imports for old helpers |
| Prompt packages | parallel prompt sources across `handoff_manifest.json`, `worker_invocation_package.json`, `worker_brief.json`, `traversal_intent_package.json`, and `gap_dossier.json` | `derive` from or `replace` with `worker_construction_brief.json` | prompt-source identity in analyzer and replay test |
| Analyzer aliases | rollup or alias rows that hide missing constructive graph products | `replace` with constructive/projection/rollup/missing/unmapped classification | analyzer output shows each class explicitly |
| Graph product shortcuts | consolidated stages that erase test pressure, execution evidence, stack/profile decisions, materialization, or release wait conditions | `retain` only if invariant-preserving; otherwise `replace` with explicit graph products | pressure-direction invariant named in design and visible in analyzer |
| Residual pressure | projections that clear pressure because a shape/conformance step passed | `replace` with execution-backed clearing predicate | focused pressure preservation tests |
| Harness push-along behavior | harness or test fixture code that advances closure/product state on behalf of the user/agent | `delete` from proof authority; retain only archive/setup mechanics | live proof shows runtime/user action, not harness advancement |
| Bootstrap expansion | bootstrap content that injects broad project method garbage into small product runs | `replace` with compact build-tenant description and admitted authority refs | hello-world prompt/bootstrap inspection |
| Conformant script surface | worker-authored script/synthetic authority replacing loaded project surfaces | `replace` with test35-style surface loading over existing source/spec/design/runtime/ledger surfaces | conformance emits indexed surface refs and prompt carrier carries loaded current state |
| Controller-side reconstruction | handoff, installed execution, or query projection re-materializing carrier truth separately | `replace` with one registry/projection authority | duplicate derivation removed or downgraded to derived projection |
| Product-specific core rules | hardcoded data_mapper/hello_world assumptions in generic SDLC core | `delete` or move into graph/domain/product profile authority | grep/audit shows generic core is tenant-neutral |

## Work Register

| ID | Work | Required Outcome | Non-Closure |
| --- | --- | --- | --- |
| W0 | Legacy appendage decommission | Every touched TS legacy feature is classified retain/derive/replace/delete. | Unmapped legacy feature remains active by default. |
| W1 | Requirements authority placement | Requirements state F_P plus execution evidence as product-completeness authority. | Closure law remains commentary-only. |
| W2 | Design closure contract | Design declares the single closure fold, residual pressure carrier, and execution-evidence path. | Multiple closure folds remain active. |
| W3 | Execution evidence edge path | Test execution result is a graph product and ledger input. | Prep/run archive closes as if it were execution result. |
| W4 | F_P fulfillment ledger | Ledger owns semantic fulfillment and close eligibility. | Worker report or target-carrier status bypasses ledger. |
| W5 | Residual pressure preservation | Pressure survives failed/incomplete attempts and clears only by admitted evidence/deferment. | Remaining pressure can disappear behind projection. |
| W6 | Prompt construction carrier | `worker_construction_brief.json` sources all worker prompts. | Prompt meaning exists only in text or multiple package builders. |
| W7 | Missing graph products | UAT, testcase, execution, release, module, profile, and materialization surfaces are restored or explicitly consolidated. | Analyzer aliases hide missing traversals. |
| W8 | Constructive-vs-rollup distinction | Analyzer and runtime identify constructive edges separately from rollup/projection edges. | Rollup closure is reported as product construction. |
| W9 | Retry classification | Retry is failure/drift unless caused by admitted product ambiguity or external runtime failure. | Hello-world retry is treated as acceptable variance. |
| W10 | Test35/test72 timing and prompt comparison | Analyzer reports per-edge timing and prompt-source evidence for parity review. | Comparison relies on manual archive inspection only. |
| W11 | Delete superseded truth | Old F_D-overweighted closure, prompt, analyzer alias, harness push-along, bootstrap expansion, controller reconstruction, and tenant-hardcoded paths are removed or reduced to derived projections. | Compatibility switches, duplicate authority, TODO bridges, or purposeless appendages remain. |
| W12 | Live parity proof | A data_mapper test72 successor run produces comparable artifacts to test35. | Deterministic unit tests pass but no run proves the behavior. |
| W13 | Test35 surface loading | TS conformance loads/imports existing workspace surfaces as current state and prompt substrate, matching test35. | Worker-authored conformant script or synthetic authority substitutes for loaded workspace truth. |
| W14 | TS.t171 lifecycle delivery run | A named TS.t171/data_mapper successor run traverses the full graph, creates and runs active generated tests, admits execution results, reviews failures, preserves pressure, performs bug-fix continuation when needed, reaches release closure from execution-backed evidence, and is archived/analyzed against test35. | The run stops at source materialization, only performs a direct process check, lacks active generated tests, lacks failure review/repair continuation, or cannot be compared edge-by-edge to test35. |

## Implementation Sequence

1. Reprice requirements and design under this ticket.
2. Complete G0: inventory touched legacy TS appendages and record retain/derive/replace/delete disposition.
3. Complete G1: replace the closure fold so content close depends on F_P fulfillment plus admitted execution evidence; make residual pressure total and replay-visible.
4. Complete G2: replace prompt construction with `worker_construction_brief.json`; delete superseded prompt and closure paths on the steel-thread path.
5. Complete G3: declare the graph products and any deliberate consolidations with their pressure-direction invariants; add analyzer distinction for constructive, projection, rollup, missing, and unmapped stages; replace the test72 conformant-script misunderstanding with test35-style surface loading.
6. Complete G4: add retry classification, timing, prompt-source, ledger, residual-pressure, artifact, and execution-evidence views.
7. Run deterministic proof.
8. Run and archive the named TS.t171 lifecycle delivery run over data_mapper.
9. Update the test35/test72 walkthrough with the final edge-by-edge comparison and the match-or-improve judgment.

## Acceptance Checklist

- [ ] Requirements declare that product completeness closes through F_P fulfillment plus admitted execution evidence.
- [x] TS conformance loads/indexes existing workspace authority surfaces like test35 instead of worker-authoring a conformant script or synthetic authority replacement.
- [x] Legacy TS appendages touched by the refactor are inventoried with retain/derive/replace/delete disposition.
- [ ] Design declares the single closure fold and residual pressure clearing predicate.
- [ ] Target-carrier admission is positioned as evidence admission, not product-content closure.
- [ ] Postflight conformance is positioned as admission/diagnostic support, not product-content closure.
- [x] Deterministic test proves closure on an execution-required edge fails when execution evidence is absent.
- [x] Test execution result is a first-class graph/evidence product required before product close.
- [ ] Live data_mapper successor run admits at least one `derive_test_execution_result_surface`-class event with concrete pass/fail counts and runtime command evidence before release-level close.
- [x] UAT testcase generation and testcase authority qualification are present or explicitly consolidated while preserving the invariant that test pressure exists before design construction.
- [x] Test implementation, execution preparation, run archive, and execution result are present or explicitly consolidated while preserving the invariant that execution result evidence is admitted before product closure.
- [x] Implementation module, stack/profile selection, product materialization, and release preparation surfaces are present or explicitly consolidated while preserving implementation replay visibility and release wait-for-execution invariants.
- [x] F_P fulfillment ledger gates product closure.
- [x] Residual pressure cannot clear without execution-backed F_P evidence or operator-admitted deferment.
- [x] Worker prompt construction derives from `worker_construction_brief.json`; `handoff_manifest.json`, `worker_invocation_package.json`, `worker_brief.json`, `traversal_intent_package.json`, and `gap_dossier.json` do not independently source prompt meaning.
- [x] Analyzer reports per-edge timing for every constructive and rollup traversal.
- [x] Analyzer reports prompt-source carrier identity and prompt rendering identity for each worker edge.
- [x] Analyzer reports execution evidence status and residual pressure transitions.
- [x] Analyzer distinguishes constructive edges, projection edges, rollup edges, and missing/unmapped conceptual test35 stages.
- [x] Retry classification treats framework carrier/parser/prompt shape drift as failure.
- [x] Hello-world no-op path has no framework-induced retry.
- [x] Live hello-world full-graph scenario drives past component-code materialization into generated test design, component tests, test execution preparation, execution result admission, test run archive, and release preparation.
- [ ] Data_mapper test72 successor run admits execution result evidence and can be compared against test35 edge by edge.
- [ ] TS.t171/data_mapper lifecycle comparison shows the TypeScript run matches or improves test35 on edge sequence, active test execution, result review, residual pressure, bug-fix continuation, and final release closure evidence.
- [ ] Superseded closure and prompt paths are deleted, not retained as compatibility debt.
- [ ] Superseded T-170-era closure and prompt helpers are no longer imported by active runtime paths.
- [ ] Harness push-along behavior, bootstrap expansion, controller-side reconstruction, analyzer alias hiding, and tenant-hardcoded core rules are deleted or reduced to named derived projections where touched by this refactor.
- [x] `worker_construction_brief.json` carries loaded current-state surface refs/summaries as prompt substrate, not regenerated bootstrap/conformant-script authority.
- [ ] Close-time audit maps every acceptance item to concrete files, tests, run artifacts, and analyzer output.

## Proof Plan

Deterministic proof:

```sh
cd /Users/jim/src/apps/odd_sdlc/build_tenants/typescript
npm run lint:semantic
npm test
```

Focused proof must include:

- shape-only target carrier cannot close product content
- postflight-only conformance cannot close product content
- prep-only test execution cannot close product content
- worker assertion without F_P fulfillment cannot close product content
- execution result evidence can clear residual pressure when it satisfies obligations
- residual pressure survives failed execution, missing execution, and content-unproven outcomes
- prompt carrier replay renders the same prompt-source package
- analyzer reports timing, prompt source, execution evidence, residual pressure, and constructive-vs-rollup classification

Live proof:

- run a data_mapper test72 successor from a clean snapshot of the current TypeScript tenant
- name the successful successor run as the TS.t171 comparison run
- preserve the run archive
- run `odd-sdlc-ts analyze-run --workspace <workspace> --format markdown`
- run `odd-sdlc-ts analyze-run --workspace <workspace> --format json`
- append the final comparison to the test35 walkthrough under ABIogenesis or the agreed odd_sdlc parity note
- prove like-for-like or better behavior against `data_mapper.test35`: full graph lifecycle, active generated tests, execution result admission, failure review, residual pressure preservation, bug-fix continuation when needed, and execution-backed release closure

## Close-Time Audit Required

Each gate must append its audit evidence as it lands. The close note then summarizes the accumulated gate evidence instead of reconstructing the whole refactor at the end.

The audit must include:

- the exact requirement and design files changed
- the exact graph edges restored, consolidated, or deleted
- the exact old closure and prompt paths deleted
- the exact deterministic tests run
- the exact live archive path
- the analyzer markdown and JSON paths
- the test35-to-test72 edge/timing/prompt/ledger/artifact comparison update
- a statement that no compatibility bridge remains for the superseded T-168/T-169/T-170 behavior

## Gate Audit Notes

### 2026-05-17 Deterministic Phase Evidence

Implemented surfaces:

- Test35-style surface loading: `build_tenants/typescript/code/src/workspace/project_profile.ts` now materializes `.ai-workspace/context/project_bootstrap.md` as a deterministic read model over existing authority surfaces instead of a worker-authored conformant script.
- Current-full start routing: `build_tenants/typescript/code/src/graph/overlays.ts`, `build_tenants/typescript/code/src/graph/library.ts`, and `build_tenants/typescript/code/src/operator/handoff.ts` start F_P work at `derive_intent_surface`; direct `Fg_conform_project_authority` is audit-only.
- Prompt carrier substrate: `build_tenants/typescript/code/src/operator/carriers.ts` and `build_tenants/typescript/code/src/operator/handoff.ts` make `worker_construction_brief.json` the canonical prompt carrier and include loaded authority refs/indexes in `currentState`.
- Requirement-pressure scoping: `build_tenants/typescript/code/src/operator/handoff.ts`, `build_tenants/typescript/code/src/operator/assurance_gate.ts`, and `build_tenants/typescript/code/src/operator/installed_operator.ts` carry unobserved requirements downstream for non-materializing F_P surfaces and classify those assessments as downstream transformation-set pressure instead of edge-local partials.
- Runtime failure classification: `build_tenants/typescript/code/src/operator/installed_operator.ts` maps silent no-output worker timeouts to retryable ABG `no_output`, repairable report-shape failures to `contract_failure`, and invalid runtime failures to non-retryable `runtime_failure`.

Deterministic proof:

- `npm run build:semantic`
- `node --test test_env/tests/test_t066_product_materialization_contract.test.mjs`
- `node --test test_env/tests/test_t101_retry_report_rejection_loop.test.mjs`
- `npm run test:semantic` passed at the then-current pre-audit count; superseded by the 2026-05-17 audit correction below.
- `npm run lint:semantic`
- `npm run lint:test-harness`

Live proof status:

- `data_mapper.test76.TS.cl` is invalid as final proof because the first `derive_intent_surface` traversal repaired due to framework requirement-pressure over-scope before the T-171 pressure-scoping fix.
- `data_mapper.test77.TS.cl` is invalid as final proof because the first `derive_intent_surface` traversal produced `intent_surface.md`, passed postflight, and admitted the selected target carrier, but closure still retried the same edge. Root cause: the assurance layer allowed `requirement_carried_for_downstream_closure:*`, but the installed fulfillment projection still counted those carried requirement assessments as edge-local partials. Fix: `sdlcAssessmentCarriesRequirementForDownstreamClosure` now promotes those assessments into downstream transformation-set pressure when the current edge is non-materializing.
- `data_mapper.test78.TS.cl` is invalid as final proof because the first live F_P worker invoked `node_modules/.bin/odd-sdlc-ts start --workspace . --target next --until converged --worker process://claude` from inside the worker process, creating nested same-edge run `20260517T004921448Z_pid17285` before the framework could evaluate the first artifact. Root cause: the worker prompt said the framework writes reports after process exit, but did not make the runtime-control boundary explicit. Fix: `build_tenants/typescript/code/src/operator/handoff.ts` now states that the worker must not run `odd-sdlc-ts`, `abiogenesis-ts`, `genesis-ts`, `start`, `gaps`, `analyze-run`, install, traversal, or resume commands, must not spawn another worker, and must write only contracted artifacts before exit.
- Current deterministic proof after the `test78` fix passed at the then-current pre-audit count; superseded by the 2026-05-17 audit correction below.
- `data_mapper.test79.TS.cl` is invalid as final proof because the first live F_P worker on `derive_intent_surface` wrote `intent_surface.md`, did not self-spawn a nested SDLC traversal, passed postflight, admitted the selected target carrier, produced a converged edge fulfillment ledger, and cleared edge residual pressure, but the post-action continuation blocked before selecting `derive_product_surface`. Root cause: post-action graph-track selection admitted the just-closed target/output asset types but omitted the source asset types consumed by the same passed edge. After `derive_intent_surface`, `intent_surface` alone left the downstream graph-track walk blocked on `input_set`; `input_set + intent_surface` lawfully selects `derive_product_surface`. Fix: `build_tenants/typescript/code/src/operator/installed_operator.ts` now includes `manifest.inputAssetTypes` in the admitted asset basis when the current edge postflight has passed. Regression: `build_tenants/typescript/test_env/tests/test_t158_consequence_admission_regression.test.mjs` adds `T-171 post-intent continuation admits source basis before selecting product`.
- Current deterministic proof after the `test79` fix passed at the then-current pre-audit count; superseded by the 2026-05-17 audit correction below.
- The next clean data_mapper run must be created from the current rebuilt tenant and must admit execution-result evidence before the live proof acceptance items can be checked.

### 2026-05-17 Current Main Review Assessment And Patches

Review baseline: current main at the review point had semantic build/lints
passing, but T-171 still could not close because the live proof path was
bounded before generated test execution and release.

Non-stale findings accepted into this ticket:

- H1 confirmed: `test_env/sandbox/scenarios/t132_hello_world_js.scenario.mjs`
  hard-stopped the live scenario at `derive_component_code_surface` with
  direct product process checks and `stopAfterWorkspaceFilesExist: true`.
  Patch: the live descriptor now names the full lifecycle edge sequence through
  `prepare_release_surface`, removes direct `node hello.js` process checks, and
  no longer stops when source files first exist. Proof pending: fresh live
  hello-world full-graph run.
- H2 partially stale: direct overlay continuation already had deterministic
  proof for `derive_component_code_surface` to
  `qualify_component_realization_surface`, but the integrated installed
  operator path could suppress that continuation when the
  product-materialization candidate was absent. Patch:
  `build_tenants/typescript/code/src/operator/installed_operator.ts` now falls
  through to overlay continuation when downstream pressure exists but no
  materialization action is selected.
- H3 confirmed: component-code smoke execution was being treated as lifecycle
  proof. Patch: full `derive_component_code_surface` no longer admits or
  requires execution evidence; graph-generated tests and
  `derive_test_execution_result_surface` own lifecycle execution evidence.
  The T-132 fixture now declares `node --test test/hello.test.js`, and analyzer
  output distinguishes `component_smoke` from
  `graph_test_execution_result`.
- H4 confirmed and fixed: the decommission map is ratified in
  `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_DECOMMISSION_REGISTER.md`
  instead of living only as a comment.
- H5 stale locally: the cited T-110 regression was not reproduced after the
  current build. Focused T-110 proof passed locally. Full suite proof remains
  to be rerun after this patch set.
- M2 accepted and fixed: `fallbackFulfillmentStatusForState` and the dead
  `fallbackStatus` parameter were removed because they suggested a closure
  bypass that no active code used.

New delivery surface:

- `build_tenants/typescript/test_env/live/run_t171_data_mapper_lifecycle.mjs`
  wraps the data_mapper live runner and fails unless the archive shows the full
  lifecycle edge order, graph-generated `derive_test_execution_result_surface`
  evidence with concrete test counts, release after execution evidence, and
  final close.
- `npm run test:t171:data-mapper-lifecycle-live` is the named delivery command
  for the TS.t171/data_mapper lifecycle proof. This command is not a substitute
  for the initial live hello-world full-graph gate; it is the final data_mapper
  comparison proof once deterministic and hello-world gates pass.

Current deterministic proof after this patch set:

```sh
cd /Users/jim/src/apps/odd_sdlc/build_tenants/typescript
npm run build:semantic
npm run lint:semantic
npm run lint:test-harness
node --test --test-name-pattern "hello-world live descriptors" test_env/sandbox/test_scenario_sandbox.test.mjs
node --test test_env/tests/test_t110_abg37_callout_projection.test.mjs test_env/tests/test_t171_execution_backed_closure_law.test.mjs test_env/tests/test_t066_product_materialization_contract.test.mjs test_env/tests/test_t161_fd_run_analysis_linter.test.mjs test_env/tests/test_t135_evaluator_owned_runner_spine.test.mjs
npm run test:semantic
```

Results so far:

- semantic build passed
- semantic lint passed
- test-harness lint passed
- hello-world live descriptor proof passed: `1/1`
- focused deterministic slice passed: `124/124`
- full semantic suite passed: `611/611`

This does not close T-171. The next required proof is a fresh live
hello-world full-graph run against the rebuilt tenant, followed by the
TS.t171/data_mapper lifecycle run only after the deterministic suite and
hello-world proof are green.

### 2026-05-17 Audit Correction After Claude Review

Claude review findings H1-H4 were evaluated against current workspace truth and corrected as follows:

- H1 test count correction: `npm run test:semantic` now passes `608/608` from `build_tenants/typescript`. Older `602/*` and `603/*` numbers above are historical pre-audit observations and are not current proof.
- H2 closure-law proof: focused deterministic proof is explicit in `test_env/tests/test_t171_execution_backed_closure_law.test.mjs`:
  - `T-171 execution-required closure fails without admitted execution evidence`
  - `T-171 F_P obligation pressure blocks close until fulfilled evidence is admitted`
  - `T-171 explicit residual pressure survives fulfilled counts`
  - `T-171 target-carrier admission alone cannot close product content`
- H3 live-state correction: `ps -p 56988,57039` returned no active process rows. `node build/semantic/code/src/cli/main.js analyze-run --workspace /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test80.TS.cl --format markdown` reports one `derive_intent_surface` operator-run, `aborted attempts: 1`, `process alive: false`, no `worker_run.json`, no `fp_evaluate_result.json`, no fulfillment ledger, no closure decision, and no next-action projection. `data_mapper.test80.TS.cl` is invalid as proof.
- H4 decommission map: G0 is now design-owned by `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_DECOMMISSION_REGISTER.md`. The prior comment post remains evidence only; the register classifies touched legacy surfaces as retain, derive, replace, or delete and is now part of the affected design boundary.

Current deterministic proof after the audit correction:

```sh
cd /Users/jim/src/apps/odd_sdlc/build_tenants/typescript
npm run build:semantic
node --test test_env/tests/test_t096_managed_traversal_bootstrap.test.mjs test_env/tests/test_t087_project_induction.test.mjs test_env/tests/test_t068_conform_project_profile.test.mjs test_env/tests/test_t030_graph_catalog_module.test.mjs test_env/tests/test_t066_product_materialization_contract.test.mjs test_env/tests/test_t160_traversal_overlays.test.mjs test_env/tests/test_t168_design_consumer_test_pipeline.test.mjs test_env/tests/test_t169_target_carrier_contracts.test.mjs test_env/tests/test_t171_component_depth_target_carrier_envelope.test.mjs test_env/tests/test_t171_execution_backed_closure_law.test.mjs
npm run test:semantic
npm run lint:semantic
npm run lint:test-harness
```

Results:

- semantic build passed
- focused deterministic slice: `133/133`
- full semantic suite: `608/608`

### 2026-05-17 Hello-World Live Proof After Materialization-Ledger Fix

Claude review H1/H2/H3/H4 correction remains accepted. A further live hello-world
proof exposed one additional framework evidence bug before the final passing run:

- Failed archive:
  `build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260517T024913252Z_pid54150`
- Failure: the scenario assertion rejected
  `specification/requirements/10-generated-bootstrap.md` because it had no
  materialization-ledger evidence.
- Root cause: `sdlc_edge_fulfillment_ledger.json` recorded product source
  materialization refs from `workerReport.materializedFiles`, but did not record
  the worker's selected graph target output file (`workerReport.outputFile`).
  Workspace-local graph products such as `specification/INTENT.md`,
  `specification/requirements/10-generated-bootstrap.md`,
  `specification/scenarios/20-generated-uat-testcases.md`, and
  `specification/scenarios/30-generated-testcase-authority.md` therefore existed
  but were not replay-visible as materialized graph outputs.
- Fix: `build_tenants/typescript/code/src/operator/installed_operator.ts` now
  derives ledger `materializationRefs` from the worker output file plus product
  materialized files.
- Regression: `build_tenants/typescript/test_env/tests/test_t064_installed_operator_ux.test.mjs`
  now proves fresh graph starts cite their target output file in
  `sdlc_edge_fulfillment_ledger.json`.

Current deterministic proof after this fix:

```sh
cd /Users/jim/src/apps/odd_sdlc/build_tenants/typescript
npm run build:semantic
npm run lint:semantic
npm run lint:test-harness
node --test test_env/tests/test_t064_installed_operator_ux.test.mjs test_env/tests/test_t158_consequence_admission_regression.test.mjs test_env/tests/test_t171_execution_backed_closure_law.test.mjs
npm run test:semantic
```

Results:

- semantic build passed
- semantic lint passed
- test-harness lint passed
- focused deterministic slice: `26/26`
- full semantic suite: `610/610`

Live hello-world proof:

```sh
cd /Users/jim/src/apps/odd_sdlc/build_tenants/typescript
npm run test:scenario:t132-hello-world-js-live
```

Result:

- passed: `1/1`
- duration: `2045.3s` wall-clock
- archive:
  `build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260517T032609453Z_pid8323`
- analyzer markdown:
  `.ai-workspace/comments/codex/20260517T140000Z_T171_hello_world_live_analyze.md`
- analyzer JSON:
  `.ai-workspace/comments/codex/20260517T140000Z_T171_hello_world_live_analyze.json`
- operator attempts: `11`
- same-edge retries: `0`
- repair attempts: `0`
- final closure: `close`
- execution evidence: `derive_component_code_surface` admitted
  `sdlc_worker_execution_evidence` for
  `node build_tenants/hello_world_javascript/src/hello.js` with
  `testsObserved: 1`, `passedCount: 1`, `failedCount: 0`
- product output:
  `build_tenants/hello_world_javascript/src/hello.js` prints `Hello, world!`
- graph-owned workspace surfaces produced by traversal:
  `specification/INTENT.md`, `specification/PRODUCT.md`,
  `specification/GOALS.md`,
  `specification/requirements/10-generated-bootstrap.md`,
  `specification/scenarios/20-generated-uat-testcases.md`,
  `specification/scenarios/30-generated-testcase-authority.md`

This proves only the bounded hello-world component-code steel thread: conformance
did not author the spec/UAT/testcase truth, GTL typed construction templates
shaped F_P output instead of closing product meaning, and no framework retry
occurred before the scenario stop condition.

It does not close T-171 and it does not meet the full test35 graph/test-run
requirements. The analyzer still reports the later test35 conceptual stages
(`derive_test_design_surface`, `derive_component_test_surface`,
`prepare_test_execution_surface`, `derive_test_run_archive_surface`,
`derive_test_execution_result_surface`, `derive_code_surface`,
`prepare_release_surface`) as missing in this bounded hello-world scenario
because the live test stops after component-code materialization and direct
process execution. Declared graph edges are not sufficient proof; a live
scenario must drive the full `current_full_traversal` through generated tests,
execution-result admission, run archive, and release preparation before the
ticket can close.
- semantic lint passed
- test-harness lint passed

Implementation corrections made in this audit pass:

- `Fg_conform_project` no longer materializes project-owned product/spec authority. It writes only `.ai-workspace/context/project_bootstrap.md`, `.ai-workspace/context/project_constraints.yml`, and `build_tenants/TENANT_REGISTRY.md`.
- Existing target workspace requirement authority such as `specification/REQUIREMENTS.md` is now loaded into handoff authority and obligation derivation; `specification/requirements/00-imported-sources.md` remains import/provenance support and is not accepted as the product-materialization lineage proof.
- `intent_surface`, `product_surface`, `goal_surface`, `requirement_surface`, `uat_testcases_surface`, and `testcase_authority_surface` now write to workspace-local specification/scenario paths through graph traversal output binding.
- `derive_uat_testcases_surface` and `derive_testcase_authority_surface` are explicit graph products before design/test construction, not analyzer aliases.

No live proof is accepted after this audit correction yet. The next proof step is a fresh live hello-world run against the rebuilt TypeScript tenant; data_mapper proof follows only after hello-world proves the graph restoration without framework-induced retry.

## Implementation Audit - 2026-05-17 Hello-World Steel Thread

Scope: G1 and G2 steel-thread proof only. This does not close T-171 because G3/G4 data_mapper parity and missing/consolidated test35 graph products remain active.

### Framework Bugs Found And Fixed

1. Target-carrier envelope drift on `derive_lite_design_adr_surface`.
   - Failure evidence: invalid run `build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260516T171121639Z_pid84176`.
   - Symptom: first design attempt emitted a valid target-carrier envelope with nested `payload`, while `design_depth_register.ts` admitted only raw `sdlc_design_depth_register` or legacy `design_depth_register` wrappers.
   - Fix: `build_tenants/typescript/code/src/operator/design_depth_register.ts` now admits the declared nested payload path.
   - Proof: `build_tenants/typescript/test_env/tests/test_t116_design_depth_steel_thread.test.mjs` adds `T-171 admits design-depth payload from the selected target-carrier envelope`.

2. Execution shard command drift on `derive_lite_component_code_surface`.
   - Failure evidence: invalid run `build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260516T171121639Z_pid84176`.
   - Symptom: worker execution evidence used the declared product command `node build_tenants/hello_world_javascript/src/hello.js`, but shard derivation rewrote the expected command to `node src/hello.js`, causing false `test_execution_command_mismatch` and same-edge retry after successful stdout.
   - Fix: `build_tenants/typescript/code/src/operator/handoff.ts` preserves the declared execution contract for Node product commands instead of rewriting it to a tenant-relative command.
   - Proof: `build_tenants/typescript/test_env/tests/test_t066_product_materialization_contract.test.mjs` now expects the declared execution command on T-170/T-171 component-code execution shards.

### Deterministic Proof

Commands run from `build_tenants/typescript`:

```sh
npm run build:semantic
node --test test_env/tests/test_t116_design_depth_steel_thread.test.mjs
node --test --test-name-pattern "T-170 .*component-code postflight requires declared execution evidence" test_env/tests/test_t066_product_materialization_contract.test.mjs
node --test test_env/tests/test_t164_edge_gain_closure_contract.test.mjs
npm run lint:semantic
node --test --test-name-pattern "Rust product materialization admits runner-prefixed execution evidence" test_env/tests/test_t143_product_materialization_authority_targets.test.mjs
```

Results:

- semantic build passed
- semantic lint passed
- T-116 focused tests: 8 passed
- T-066 focused tests: 2 passed
- T-164 focused tests: 20 passed
- T-143 focused test: 1 passed

### Live Hello-World Proof

Command:

```sh
npm run test:scenario:t132-hello-world-js-live
```

Clean proof archive:

`build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260516T172222420Z_pid96176`

Result:

- node test passed: 1 test, 0 failures
- total duration: 308.7s
- analyzer total wall-clock: 302.2s
- operator-run count: 2 F_P worker edges plus deterministic conformance
- same-edge retries: 0
- repair attempts: 0
- blocked/yielded/aborted attempts: 0
- final closure: `close`

Edge evidence:

- `derive_lite_design_adr_surface`: 17/17 obligations fulfilled, target carrier admitted, residual pressure empty, closure `close`
- `derive_lite_component_code_surface`: 19/19 obligations fulfilled, target carrier admitted, residual pressure empty, closure `close`
- product file generated: `build_tenants/hello_world_javascript/src/hello.js`
- execution evidence admitted:
  - command: `node build_tenants/hello_world_javascript/src/hello.js`
  - status: `succeeded`
  - tests observed: 1
  - passed: 1
  - failed: 0
  - stdout: `Hello, world!`

Analyzer command:

```sh
node build/semantic/code/src/cli/main.js analyze-run --workspace test_env/test_runs/scenario_t132_hello_world_js_live/20260516T172222420Z_pid96176/workspace --format markdown
```

Analyzer result:

- same-edge retries: 0
- final closure: close
- per-edge timing emitted for both constructive worker edges
- retry forensics: none
- runtime artifact gaps: none

## Implementation Audit - 2026-05-17 Full-Graph Hello-World Prep

Scope: G1/G2 deterministic proof plus live-run bug repair. This still does not
close T-171 because the accepted live proof must be a fresh full-graph run that
reaches generated test execution evidence, test-run archive, and release
preparation without framework-induced retry.

### Live Bug Repairs

1. Target-carrier envelope drift on `derive_test_design_surface`.
   - Failure evidence: invalid run
     `build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260517T045453428Z_pid23714`.
   - Symptom: worker returned the selected target-carrier envelope with nested
     `payload.kind = "sdlc_test_design_register"`, while
     `test_design_register.ts` admitted only the raw register payload. Closure
     blocked on missing target-carrier admission after useful F_P content.
   - Fix: `build_tenants/typescript/code/src/operator/test_design_register.ts`
     now admits the declared nested payload path.
   - Proof:
     `build_tenants/typescript/test_env/tests/test_t171_component_depth_target_carrier_envelope.test.mjs`
     adds `T-171 admits test-design payload from selected target-carrier envelope`.

2. Empty predecessor materialization replay on `derive_component_test_surface`.
   - Failure evidence: invalid run
     `build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260517T054327856Z_pid84665`.
   - Symptom: one retry produced an empty
     `product_materialization_manifest.json`; the next attempt materialized
     `test/hello.test.js`, but stale predecessor diagnostic
     `materialized_product_manifest_replay_empty` still blocked the current
     admitted materialization rows.
   - Fix: `build_tenants/typescript/code/src/operator/handoff.ts` now treats
     current admitted materialization rows as superseding an empty predecessor
     replay diagnostic.
   - Proof:
     `build_tenants/typescript/test_env/tests/test_t066_product_materialization_contract.test.mjs`
     adds `T-171 current component-test materialization supersedes empty predecessor replay`.

3. Live proof executor mismatch.
   - Finding: the invalid `20260517T054327856Z_pid84665` hello-world run used
     `executorProfile = "local-spawn"`, `streamModel = "stdio"`, and
     `terminalSessionId = null`. `worker_process_started.json` only proves the
     null terminal session; executor profile and stream model are proven by
     `worker_run.json`.
   - Fix:
     `build_tenants/typescript/package.json` keeps
     `test:scenario:t132-hello-world-js-live` on the default fast
     `local-spawn` path and adds an explicit
     `test:scenario:t132-hello-world-js-live:pty` lane that sets
     `ODD_SDLC_TS_AGENT_EXECUTOR_PROFILE=pty-terminal` and
     `ABG_TS_AGENT_EXECUTOR_PROFILE=pty-terminal`. T-171 also exposes
     `test:t171:hello-world-lifecycle-live` and
     `test:t171:hello-world-lifecycle-live:pty` as the reviewer-facing
     lifecycle aliases over the default and PTY lanes.
   - Synthetic guard:
     `build_tenants/typescript/test_env/tests/test_t171_pty_executor_profile_guards.test.mjs`
     proves default executor selection, PTY prompt-file redirection, local
     stdio launch behavior, and the package-script split.
   - Proof required: the accepted PTY preconfigured live archive must show
     completed `worker_run.json` records with `executorProfile = "pty-terminal"`,
     `streamModel = "terminal-transcript"`, and non-empty
     `terminalSessionId`. Ordinary default live runs may remain local-spawn.

4. Component-code/test-role boundary drift.
   - Failure evidence: invalid run
     `build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260517T065143313Z_pid80634`.
   - Symptom: `derive_component_code_surface` retried after the worker emitted
     component-code output with only source materialization while the upstream
     implementation-design carrier had placed the proof test path
     `test/hello.test.js` into `componentRealizationRows`. The component-depth
     assurance fold therefore looked for a test file on the component-code edge
     and produced `component_declared_path_not_materialized:test/hello.test.js`.
   - Fix: `build_tenants/typescript/code/src/operator/handoff.ts` now pins the
     prompt contract at both `implementation_design_surface` and
     `component_code_surface`: `componentRealizationRows` are source /
     implementation rows only, role=`test` file targets remain `fileTargetRows`
     and are consumed by `test_design_surface` / `component_test_surface`.
   - Proof:
     `build_tenants/typescript/test_env/tests/test_t066_product_materialization_contract.test.mjs`
     extends `T-159 component-depth prompts pin the top-level register envelope
     on first attempt` to assert the source/test carrier split.

5. Component-test qualification row status drift.
   - Failure evidence: invalid PTY run
     `build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260517T073315118Z_pid10553`.
   - Symptom: the run reached `derive_test_execution_result_surface` and
     admitted execution evidence (`testsObserved = 6`, `passedCount = 6`,
     `failedCount = 0`), then retried on
     `qualify_component_test_execution_surface` because the worker emitted
     `componentTestQualificationRows[0].qualificationStatus = "passed"` while
     the component-depth row contract requires the literal field
     `componentTestQualificationRows[].status`.
   - Blocking reason:
     `component_depth_register_invalid:component_depth_register.componentTestQualificationRows[0].status: expected string`.
   - Root cause: prompt/contract drift at the worker boundary. The contract and
     admission parser already required `status`, but the compact component-depth
     prompt only said to emit qualification rows and did not explicitly forbid
     the natural but non-contract alias `qualificationStatus`.
   - Fix: `build_tenants/typescript/code/src/operator/handoff.ts` now spells
     the component-test-qualification row fields explicitly, requires
     `status` with the declared enum values, and forbids `qualificationStatus`
     or `verdict` as substitutes.
   - Proof:
     `build_tenants/typescript/test_env/tests/test_t066_product_materialization_contract.test.mjs`
     extends `T-159 component-depth prompts pin the top-level register envelope
     on first attempt` to assert the component-test-qualification status field
     directive.

### Deterministic Proof

Commands run from `build_tenants/typescript` after the fixes:

```sh
npm run build:semantic
node --test test_env/tests/test_t171_component_depth_target_carrier_envelope.test.mjs test_env/tests/test_t171_execution_backed_closure_law.test.mjs test_env/tests/test_t161_fd_run_analysis_linter.test.mjs test_env/tests/test_t066_product_materialization_contract.test.mjs
node --test test_env/tests/test_t171_pty_executor_profile_guards.test.mjs
npm run lint:semantic
npm run lint:test-harness
npm run test:semantic
```

Results:

- semantic build passed
- focused regression tests: 116/116 passed
- PTY/default executor guard tests: 4/4 passed
- component-code/source-test split prompt guard: 77/77 passed
- focused T-161/T-171 regression suite: 43/43 passed
- semantic lint passed
- test-harness lint passed
- full semantic suite: 617/617 passed
- 2026-05-17T08:39Z after component-test qualification status drift fix:
  - semantic build passed
  - T-066 prompt/materialization suite: 77/77 passed
  - semantic lint passed
  - focused T-161/T-171 regression suite: 43/43 passed
  - test-harness lint passed
  - full semantic suite: 617/617 passed
- 2026-05-17T10:00Z checkpoint RC deterministic gate:
  - semantic build passed
  - semantic lint passed
  - test-harness lint passed
  - focused T-093/T-101 schedule/retry tests passed: 4/4
  - focused T-066 data_mapper successor inventory test passed: 1/1
  - full semantic suite passed: 617/617
  - checkpoint release cut:
    `.ai-workspace/release-cuts/typescript/20260517T095944Z_t171_checkpoint_rc`
- 2026-05-18T12:57Z checkpoint RC live hello-world lifecycle gate:
  - `git diff --check` passed
  - semantic build passed
  - live command passed: `npm run test:t132:hello-world-live`
  - Node test result: `tests 1`, `pass 1`, `fail 0`
  - live archive:
    `build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260518T114036171Z_pid75297`
  - analyzer summary: `operatorRunCount=28`, `graphEdgeSequence=19`,
    `sameEdgeRetryCount=2`, `repairAttemptCount=4`, `blockedAttemptCount=2`,
    `yieldedAttemptCount=0`, `abortedAttemptCount=0`,
    `finalClosureDisposition=close`
  - execution evidence: `derive_test_execution_result_surface` passed with
    `executionEvidenceStatus=succeeded`, command `node --test test/hello.test.js`,
    `tests=1`, `passed=1`, `failed=0`
  - final live edge: `prepare_release_surface -> release_surface`, passed and
    closed
  - checkpoint release cut:
    `.ai-workspace/release-cuts/typescript/20260518T125740Z_t171_hello_world_lifecycle_rc`

### Proof Status

The invalid `20260517T054327856Z_pid84665`, `20260517T065143313Z_pid80634`,
and `20260517T073315118Z_pid10553` runs are not accepted as proof because they
retried and/or used a pre-fix runtime. They remain useful only as evidence
sources for the framework bugs above.

The 2026-05-17 checkpoint RC proof is deterministic only. The 2026-05-18
checkpoint RC proof adds the hello-world live lifecycle gate through generated
test design, component test materialization, test execution preparation,
execution-result admission with concrete pass/fail counts, test-run archive,
release-depth parity, and release preparation. This is still not a final release
and does not close T-171: the data_mapper/test72 successor proof and test35
comparison remain open.

The fast default lane may use local-spawn; the separate PTY preconfigured lane
must also remain available as a live regression guard.
