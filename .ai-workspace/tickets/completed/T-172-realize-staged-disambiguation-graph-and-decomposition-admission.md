---
id: T-172
title: Realize staged disambiguation graph and decomposition admission
type: feature
ticket_category: design_reframe
status: completed
proof_status: closed_data_mapper_test85_live
priority: critical
owner: odd_sdlc
build_tenant: typescript
created_at: 2026-05-19
updated_at: 2026-05-22
completed_at: 2026-05-22
triaged_at: 2026-05-19
activated_at: 2026-05-19
goal: make every solution construction traverse through staged disambiguation before deterministic code closure
change_class: requirement_reprice
re_entry_point: requirements
first_missing_layer: requirements
governance_scope: STDO Method / odd_sdlc TypeScript construction algebra
current_closure_blocker: none; data_mapper.test85 live proof accepted after G4 runtime-dispatch enforcement
source_documents:
  - specification/GOALS.md
  - specification/INTENT.md
  - specification/PRODUCT.md
  - specification/requirements/10-odd-sdlc-software-domain-buildout.md
  - specification/requirements/13-odd-sdlc-typescript-tenant.md
  - specification/requirements/16-edge-gain-closure-contract.md
  - specification/requirements/17-target-carrier-contracts.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_EDGE_GAIN_CLOSURE_CONTRACT.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TARGET_CARRIER_CONTRACTS.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TEST_PIPELINE.md
  - .ai-workspace/comments/codex/20260519T164333AEST_STRATEGY_staged_construction_computation_test35_test82.md
  - .ai-workspace/comments/codex/20260519T162932AEST_ANALYSIS_data_mapper_test82_vs_test35_divergent_construction_surface.md
  - .ai-workspace/comments/codex/20260519T160359AEST_ANALYSIS_data_mapper_test82_vs_test35_rc4_depth.md
  - .ai-workspace/tickets/completed/T-171-full-test35-parity-refactor-for-test72-execution-backed-closure.md
current_rc_reference:
  workspace: /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test82.TS.cl
  analyzer_command: node build_tenants/typescript/build/semantic/code/src/cli/main.js analyze-run --workspace /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test82.TS.cl --format markdown
  final_archive: /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test82.TS.cl/.ai-workspace/runtime/odd_sdlc/operator-runs/20260519T045221059Z_pid80159
  release_cut: .ai-workspace/release-cuts/typescript/20260519T051709Z_t171_data_mapper_test82_rc4
accepted_data_mapper_test85_workspace: /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test85.TS.cl
accepted_data_mapper_test85_final_archive: /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test85.TS.cl/.ai-workspace/runtime/odd_sdlc/operator-runs/20260521T171514045Z_pid276
accepted_data_mapper_test85_execution_archive: /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test85.TS.cl/.ai-workspace/runtime/odd_sdlc/operator-runs/20260521T171129964Z_pid276
accepted_data_mapper_test85_repair_schedule_surface: /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test85.TS.cl/build_tenants/scala_spark/design/component_repair_schedule_surface.md
closure_proof_gates:
  - data_mapper.test85 successor run traversed staged design, code, test, execution, repair-schedule, archive, release-depth, and release-preparation surfaces
  - final archive 20260521T171514045Z_pid276 returned status converged, graph_function prepare_release_surface, and nextLawfulAction disposition://close
  - execution archive 20260521T171129964Z_pid276 reported passedCount 7 and failedCount 0
  - component_repair_schedule_surface reports scheduleStatus no_repair_required and repairRows []
  - focused odd_sdlc regression checks passed after the continuation and component-depth admission fixes
related_tickets:
  - .ai-workspace/tickets/backlog/T-161-read-only-fd-run-analysis-linter.md
  - .ai-workspace/tickets/backlog/T-162-first-class-ticket-workflow-for-governed-change.md
  - .ai-workspace/tickets/completed/T-102-define-typed-fp-function-stages-and-abg-owned-admission-flow.md
  - .ai-workspace/tickets/completed/T-164-declare-per-edge-gain-and-closure-functions-for-sdlc-traversals.md
  - .ai-workspace/tickets/completed/T-171-full-test35-parity-refactor-for-test72-execution-backed-closure.md
  - .ai-workspace/tickets/completed/T-173-realize-complexity-admitted-min-fp-traversal-selection.md
affected_boundary:
  requirements:
    - specification/requirements/10-odd-sdlc-software-domain-buildout.md
    - specification/requirements/13-odd-sdlc-typescript-tenant.md
    - specification/requirements/16-edge-gain-closure-contract.md
    - specification/requirements/17-target-carrier-contracts.md
  design:
    - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_EDGE_GAIN_CLOSURE_CONTRACT.md
    - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TARGET_CARRIER_CONTRACTS.md
    - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TEST_PIPELINE.md
    - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_ASSURANCE_INTEGRATION.md
  graph_code:
    - build_tenants/typescript/code/src/graph/catalog.ts
    - build_tenants/typescript/code/src/graph/edge_gain_closure_contracts.ts
    - build_tenants/typescript/code/src/graph/target_carrier_contracts.ts
  domain_code:
    - build_tenants/typescript/code/src/domain/carriers.ts
    - build_tenants/typescript/code/src/domain/admission.ts
  operator_code:
    - build_tenants/typescript/code/src/operator/handoff.ts
    - build_tenants/typescript/code/src/operator/installed_operator.ts
    - build_tenants/typescript/code/src/operator/traversal_consequence.ts
    - build_tenants/typescript/code/src/operator/design_depth_register.ts
    - build_tenants/typescript/code/src/operator/component_depth_register.ts
    - build_tenants/typescript/code/src/operator/test_design_register.ts
    - build_tenants/typescript/code/src/operator/test_pipeline.ts
  analyzer_code:
    - build_tenants/typescript/code/src/analysis/run_analysis.ts
    - build_tenants/typescript/code/src/cli/main.ts
  tests:
    - build_tenants/typescript/test_env/tests
    - build_tenants/typescript/test_env/live
target_truth: odd_sdlc construction is a staged disambiguation pipeline for every solution. Requirements must reduce through bounded design, admitted tenant technology-stack description, module/component, dependency, traversal, code, and test subsurfaces before deterministic code or release closure can claim product completeness. The evaluator admits measured decomposition summaries and tenant stack sufficiency, then selects steel-thread or parallel traversal from admitted dependency maps before materialization. The selected graph itself is admitted: every retained edge must account for unique construction pressure or be deleted, merged, replaced, conditionalized, or reclassified as projection/no-close.
superseded_truth: A full graph can close product depth by carrying many obligations directly into broad component-code or component-test materialization so long as every declared row has evidence and the runtime ledgers close, while retaining inherited rollup or transition edges without proving they own unique construction pressure.
closure_law: This ticket closes only when the TypeScript graph and evaluator admit staged decomposition summaries and tenant technology-stack sufficiency, enforce proportional residual predicates, select steel-thread/parallel traversal from admitted dependency maps, account for every selected executive edge, and prove that code/test materialization cannot close from under-decomposed module/test topology or undefined/contradictory tenant stack authority. Any edge that cannot account for unique pressure must be deleted from the selected graph, merged into its owning edge, replaced by a staged authority edge, conditionalized, or reclassified as projection/no-close. data_mapper remains the reference proof, but the rule applies to all solution construction including trivial degenerate products.
evaluation_criteria:
  - requirements/design state that SDLC construction is staged disambiguation ending in deterministic code
  - bootstrap derives tenant technology-stack descriptions with explicit implementation and testing sections, and evaluator admission classifies them as undefined, sufficient, or contradictory before executable materialization
  - TypeScript handoff consumes declared tenant stack targets/commands generically instead of hard-coding SBT, Cargo, Maven, Gradle, Node, Python, or other ecosystem grammar as SDLC law
  - target-carrier contracts define SdlcDecompositionSummary or equivalent measured compression/expansion carrier rows
  - evaluator predicates reject high-density/facade/under-decomposed/exploded/unowned module and test topology
  - F_P implementation-design workers write ADR/design artifact content only; evaluator code derives the design-depth register, decomposition summary, and module dependency map as framework-owned admission evidence
  - trivial products publish admitted one-module/one-component decomposition instead of bypassing decomposition admission
  - module dependency and test dependency carriers exist or existing carriers are strengthened to carry equivalent authority
  - evaluator actions select steel-thread or parallel traversal over admitted dependency maps
  - component-code prompts consume admitted topology and do not ask workers to infer topology while writing code
  - component-test prompts consume admitted test topology and do not ask workers to infer testcase authority while writing tests
  - edge-accounting register covers every selected full traversal edge and reports delete/merge/projection/conditional disposition
  - unaccounted or unneeded edges cannot remain close-capable in the selected executive graph
  - analyzer reports current graph, staged graph decisions, dependency-map traversal selection, and compression/expansion decomposition ratios
  - deterministic tests prove rejection of under-decomposed, compressed, exploded, unowned, and invalid-reference component-code and component-test carriers
  - data_mapper successor run proves the staged graph reaches execution evidence and release closure with deeper topology than test82 RC4
proof_surface:
  static:
    - npm run lint:semantic
    - npm test
  focused:
    - npm run test:t172:decomposition-admission
    - npm run test:t172:edge-accounting
    - npm run test:t172:staged-contracts
    - npm run test:t172:run-analysis
    - npm run test:t172
  live_or_archive:
    - npm run test:t171:data-mapper-lifecycle-live
    - odd-sdlc-ts analyze-run --workspace /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test82.TS.cl --format markdown
non_closure_conditions:
  - a component-code edge can still close with hundreds of obligations carried by a small module-facade file set and no admitted child topology
  - a component-test edge can still close with broad module-level tests and no admitted test-module dependency map
  - steel-thread or parallel-build is represented as a target carrier surface instead of an evaluator-selected traversal method
  - trivial products bypass decomposition admission entirely
  - component-code or component-test materialization proceeds when the active tenant technology-stack description is undefined or contradictory
  - stack-specific build manifest names or write roots are embedded as core handoff law instead of admitted tenant-spec data
  - any selected executive graph edge lacks an accounting row
  - an edge identified as unneeded remains close-capable instead of being deleted, merged, replaced, conditionalized, or projection/no-close
  - analyzer observes worker dispatch for any edge whose accounting row declares `workerDispatchAllowed: false`
  - data_mapper-specific file names or test35 source filenames become generic runtime law
  - release closure treats execution and ledger success as test35-depth parity without admitted topology-depth evidence
---

# T-172: Realize Staged Disambiguation Graph And Decomposition Admission

## STDO Intake

Smallest lawful re-entry point: `requirements`.

Reason: the defect is not local to data_mapper and not only a TypeScript
implementation bug. The current RC graph can close runtime authority while
allowing broad obligation sets to flow into shallow component-code and
component-test surfaces. Correcting that changes the product construction law:
solution construction must reduce ambiguity through measured intermediate
surfaces before deterministic code or tests can close.

## Current RC Finding

T-171 / data_mapper test82 RC4 proved the runtime authority repair:

- typed F_P stage authority is live
- execution evidence is admitted before release closure
- release closure is ledger/evaluator backed
- the graph reaches `prepare_release_surface`

The same RC graph exposes the next defect. It jumps from
`derive_implementation_design_surface` to `derive_component_code_surface`, and
from `derive_test_design_surface` to `derive_component_test_surface`, without
admitted implementation-module/test-module decomposition and dependency maps.

That allowed 885 obligations to close over 9 source files and 1126 obligations
to close over 7 test files. This is coherent under the current RC graph but not
sufficient as a general construction-depth law.

## Target Graph

T-172 realizes the staged graph described in:

`.ai-workspace/comments/codex/20260519T164333AEST_STRATEGY_staged_construction_computation_test35_test82.md`

Required intermediate authority:

- implementation module decomposition after design and before component code
- admitted tenant technology-stack description before executable
  materialization
- module dependency map before evaluator-selected build traversal
- test module decomposition after test design and before component tests
- test dependency map before evaluator-selected test traversal
- explicit test stack profile selection as an evidence/build-tenant decision
- decomposition summary rows on staged carriers

Steel-thread and parallel build remain traversal methods selected by the
evaluator over admitted dependency maps. They are not target carrier surfaces.

The selected executive graph is also in scope. T-172 must account for the
current full graph edge-by-edge. A retained edge needs a positive construction
claim: owned pressure, authority output, predecessor/successor pressure,
closure evidence, and a reason the pressure is not already owned elsewhere.
Edges that cannot make that claim are not kept for ceremony; they are deleted
from the selected graph, merged into the owning edge, replaced by a staged
authority edge, conditionalized behind capability/failure pressure, or
reclassified as projection/no-close over admitted carriers.

## Out Of Scope

Complexity-admitted traversal selection, including dynamic zoom admission and
Min(F_P) pressure-preservation decisions, is split to active follow-on ticket
`.ai-workspace/tickets/completed/T-173-realize-complexity-admitted-min-fp-traversal-selection.md`.

T-172 may record compression, expansion, and residual metrics in decomposition summaries, but it
does not implement evaluator insertion or selection of new intermediate stages.

## Implementation Decisions

T-172 is a fixed staged-graph implementation. It does not require every stage
to become a new graph edge when an existing admitted carrier already owns the
right row family.

| Stage | Existing Carrier | T-172 Disposition |
|---|---|---|
| tenant technology-stack description | conformed project profile and project constraints carry partial language/tool/test-runner data; product/requirements may name build config and proof commands | add or elevate tenant-local spec carrier(s) under `build_tenants/<tenant>/spec/` and admit sufficiency before executable materialization |
| implementation-module decomposition | `SdlcComponentTopologyRow`, `SdlcComponentRealizationRow`, `componentTopologyRows`, `componentRealizationRows` in `build_tenants/typescript/code/src/operator/carriers.ts` | strengthen existing implementation-design/component-depth carriers with `SdlcDecompositionSummary` and admission predicates |
| module dependency map | no standalone admitted dependency carrier | add `SdlcModuleDependencyMap` or equivalent authority section before component-code traversal selection |
| test-module decomposition | `SdlcTestModuleRow`, `SdlcTestComponentTopologyRow`, `componentTestRows` in `carriers.ts` and `test_design_register.ts` | strengthen existing test-design/component-test carriers with `SdlcDecompositionSummary` and admission predicates |
| test dependency map | no standalone admitted test dependency carrier | add `SdlcTestDependencyMap` or equivalent authority section before component-test traversal selection |
| test stack profile | `SdlcTestStackProfileRow` / `testStackProfileRows` | strengthen existing rows as the admitted test-stack selection; do not add a separate `select_test_stack_profile` edge in T-172 unless the existing carrier cannot express the decision |

This is the implementation rule for the proposed staged graph: new authority
may be a new carrier section on an existing edge when ordering and admission
are explicit. A new graph edge is required only when the stage cannot be
admitted before the downstream materialization edge using existing carriers.

## Tenant Technology-Stack Description

T-172 treats stack semantics as tenant authority, not handoff heuristics. The
bootstrap traversal may derive tenant-local spec surfaces from the initial
document, for example:

```text
{ initial document }
-> bootstrap
-> INTENT.md
-> PRODUCT.md
-> GOALS.md
-> requirements/*
-> build_tenants/<tenant>/spec/TECH_STACK.*
-> build_tenants/<tenant>/spec/TESTING_TECH_STACK.*
-> build_tenants/<tenant>/spec/PRODUCT_TARGETS.*
-> build_tenants/<tenant>/spec/EXECUTION_CONTRACT.*
```

The exact file names may be consolidated into one typed carrier, but the
minimum tenant spec must cover these sections:

- Implementation technology stack: language/runtime, build tool, required
  build/config targets, implementation source roots, build commands,
  tool install/use assumptions, and implementation byproduct cleanup rules.
- Testing technology stack: test language/runtime when different from
  implementation, test framework or runner, test source roots, fixture/data
  strategy, test build/config targets, proof commands, execution environment
  assumptions, returned evidence format, and test byproduct cleanup rules.
- Stack relationship: whether testing uses the implementation build tenant or
  a distinct test tenant. Defaulting to same-stack testing is lawful only when
  the tenant spec declares that relationship.
- Execution contract: which declared commands or validators produce admissible
  evidence and which outputs the evaluator may read.

Admission classifies each active tenant stack surface:

| Class | Meaning | Lawful Action |
|---|---|---|
| `undefined` | The tenant spec does not define enough executable construction truth. | Block or zoom back to bootstrap/design before materialization. |
| `sufficient` | The tenant spec defines enough stack truth to build while leaving implementation choices open. | `F_P.transform` may make bounded assumptions inside the tenant surface and preserve them in artifacts/evidence. |
| `contradictory` | Product, design, and tenant spec conflict. | Block or reprice the owning authority surface before materialization. |

This replaces embedded SBT/Rust/Node/Python-style handoff branches. Core SDLC
may consume declared build-config targets and execution commands, run declared
validators, and admit returned evidence. It does not own ecosystem manifest
grammar such as `build.sbt`, `Cargo.toml`, `package.json`, `pyproject.toml`,
`pom.xml`, or `build.gradle`.

## Decomposition Summary Schema

T-172 introduces one common measured summary shape. The exact TypeScript name
may live in `operator/carriers.ts`, but the required semantic fields are:

```ts
interface SdlcDecompositionSummary {
  readonly kind: "sdlc_decomposition_summary";
  readonly stageId: string;
  readonly upstreamKind:
    | "requirement"
    | "design"
    | "module"
    | "component"
    | "testcase";
  readonly downstreamKind:
    | "design"
    | "module"
    | "component"
    | "function"
    | "test_module"
    | "test_class";
  readonly stageUpstreamUniverseRefs: readonly string[];
  readonly upstreamCount: number;
  readonly downstreamCount: number;
  readonly upstreamPerDownstreamRatio: number;
  readonly downstreamPerUpstreamRatio: number;
  readonly maxUpstreamPerDownstreamRatio: number;
  readonly maxDownstreamPerUpstream: number;
  readonly maxOwnedUpstreamPerDownstream: number;
  readonly maxOwnedUpstreamWithoutBoundary: number;
  readonly rows: readonly SdlcDecompositionSummaryRow[];
  readonly overloadedDownstreamIds: readonly string[];
  readonly explosionUpstreamRefs: readonly string[];
  readonly unownedDownstreamIds: readonly string[];
  readonly facadeDownstreamIds: readonly string[];
  readonly underDecomposedParentIds: readonly string[];
  readonly residualRefs: readonly string[];
  readonly residualOutsideSubsurfaceRefs: readonly string[];
  readonly invalidReferenceFields: readonly string[];
  readonly admissionDecision: "admit" | "reject";
}

interface SdlcDecompositionSummaryRow {
  readonly downstreamId: string;
  readonly parentId?: string;
  readonly ownedUpstreamRefs: readonly string[];
  readonly ownedUpstreamCount: number;
  readonly publicBoundaryRefs: readonly string[];
  readonly publicBoundaryCount: number;
  readonly substantiveResponsibilityRefs: readonly string[];
  readonly substantiveResponsibilityCount: number;
  readonly materializationTargetRefs: readonly string[];
  readonly residualRefs: readonly string[];
}
```

The worker may emit candidate rows, but evaluator admission recomputes the
counts and rejection lists from admitted topology rows, requirement refs, public
boundary fields, materialization targets, and residual refs. The emitted
candidate is evidence; the evaluator-owned summary is authority.

Thresholds live in the selected product construction profile or edge assurance
contract. If no profile is declared, the default TypeScript profile must still
publish concrete threshold values; prompt text cannot supply them.

## Admission Predicates

T-172 uses these predicate shapes. Numeric limits are profile data; the
predicate names and required inputs are runtime law.

| Predicate | Rejects When |
|---|---|
| compression collapse | `upstreamPerDownstreamRatio > maxUpstreamPerDownstreamRatio` |
| high-density downstream row | `ownedUpstreamCount > maxOwnedUpstreamPerDownstream` |
| downstream explosion | one upstream ref is owned by more than `maxDownstreamPerUpstream` downstream rows |
| unowned downstream row | a downstream row owns no upstream refs |
| invalid reference values | candidate row or stage-universe refs are empty or whitespace-padded |
| facade row | `ownedUpstreamCount > maxOwnedUpstreamWithoutBoundary` and `publicBoundaryCount == 0`, or `ownedUpstreamCount > 0` and `substantiveResponsibilityCount == 0` |
| under-decomposed parent | a module/test parent owns high-density obligations and all admitted child component/test rows are facade rows |
| residual outside subsurface | a residual ref belongs to a requirement/design/module/testcase outside the explicit stage upstream universe; when no universe is supplied, the evaluator falls back to the owned upstream refs in the submitted rows |
| trivial degenerate product | admitted only when the summary is explicitly 1 upstream / 1 downstream with one public or executable boundary; no product bypasses decomposition admission |

The phrase "hundreds of obligations" is not a predicate. It is evidence of a
probable high-density failure. Admission must use the measured counts and
profile thresholds.

## Edge Accounting Register

T-172 adds an edge-accounting register for the selected TypeScript full
traversal. The register is not a documentation appendix; it is a deterministic
surface the analyzer and tests can inspect.

Each row carries:

```ts
interface SdlcExecutiveEdgeAccountingRow {
  readonly edgeName: string;
  readonly disposition:
    | "required"
    | "conditional"
    | "projection_no_close"
    | "merge_required"
    | "replace_required"
    | "delete_required";
  readonly ownedPressureRefs: readonly string[];
  readonly authorityOutputRefs: readonly string[];
  readonly predecessorEdgeNames: readonly string[];
  readonly successorEdgeNames: readonly string[];
  readonly closureEvidenceRefs: readonly string[];
  readonly workerDispatchAllowed: boolean;
  readonly rationale: string;
}
```

Close-capable `required` rows must carry owned pressure and closure evidence.
`projection_no_close`, `merge_required`, `replace_required`, and
`delete_required` rows must not dispatch `F_P.transform` for fresh product
judgment. Conditional rows must cite the capability, failure, or operational
pressure that makes the edge lawful when present. The runtime dispatch path
consumes the register: rows marked `workerDispatchAllowed: false` execute as
deterministic evaluator/projection edges, and any observed live/archive worker
dispatch on those rows is a G4 rejection.

T-172 closure requires the register to cover every selected full traversal
edge, report no missing rows, and either justify or remove every edge marked
for merge, replacement, or deletion.

## Gate Register

| Gate | Required Result | Proof Before Next Gate |
|---|---|---|
| G0 requirements/design | staged disambiguation, graph-edge accounting/deletion, no-bypass trivial decomposition, and projection-vs-authority wording are ratified | requirement/design diff plus review |
| G1 carrier schema | `SdlcDecompositionSummary`, module dependency map, and test dependency map shapes are declared with compression and expansion measures | focused type/admission tests compile |
| G2 edge accounting | selected full traversal edges are all accounted, with merge/delete/projection/conditional disposition reported | deterministic edge-accounting tests compile |
| G3 evaluator admission | compression, explosion, high-density, facade, under-decomposed, unowned-row, invalid-ref, and residual-scope predicates reject invalid carriers | deterministic negative tests fail close before materialization |
| G4 graph/handoff/analyzer | code/test prompts consume admitted topology through compact intent probes; replay uses compact identity indexes and bounded liveness summaries on hot paths; analyzer reports ratios, traversal selection, edge-accounting disposition, and observed worker-dispatch violations for no-dispatch rows; runtime dispatch consults the register before live closure | focused staged-graph tests plus archive analysis rejecting observed no-dispatch worker runs and prompt/replay volume regressions |
| G5 live proof | hello-world successor run closes as the degenerate one-component case with bounded upstream product requirement refs, and data_mapper successor run closes with admitted substantive topology depth before code/test materialization and no unaccounted selected edges | live archives plus analyzer reports |

## Work Plan

1. Requirements: add the staged disambiguation, proportional residual, and
   graph-edge accounting/deletion rules.
2. Design: define decomposition summaries and density/facade predicates.
3. Edge register: account for every selected full traversal edge and delete,
   merge, replace, conditionalize, or projection-classify edges that do not own
   unique construction pressure.
4. Graph contracts: add or strengthen implementation-module, module-dependency,
   test-module, and test-dependency surfaces.
5. Evaluator: implement steel-thread/parallel traversal selection over admitted
   dependency maps.
6. Handoff: make code/test prompts consume admitted topology rather than infer
   topology during materialization.
7. Analyzer: report graph shape, edge-accounting disposition, decomposition
   compression/expansion ratios, dependency-map traversal selection, observed
   no-dispatch worker violations, and under-decomposition failures.
8. Runtime dispatch: make installed operator dispatch consult the edge
   accounting register so rows marked `workerDispatchAllowed: false` execute as
   deterministic evaluator/projection edges before live proof.
9. Handoff/replay projection: make worker-facing construction briefs expose only
   the canonical intent probe plus refs/digests, and make replay/liveness hot
   paths consume compact indexes or bounded summaries instead of reparsing full
   forensic manifests and event streams.
10. Tests: add deterministic negative tests for unaccounted edges,
   under-decomposed code/test carriers, and positive tests for trivial
   one-component decomposition.
11. Live proof: rerun hello-world as the degenerate proportionality proof, run
    the Rust hello service as the bounded non-JS service proof, then rerun
    data_mapper as the reference substantive staged-construction proof.

## Proof Plan

Static proof:

- `npm run lint:semantic`
- `npm test`

Focused proof:

- `test:t171:hello-world-lifecycle-live` proves the minimal product profile does
  not inflate one requirement into separate runtime/source/test/execution
  obligations and still closes through admitted degenerate topology.
- `test:t164:rust-service-live` proves a bounded service product can generate
  Rust/Cargo product files and close through runtime HTTP execution evidence
  without promoting the proof to data_mapper-scale topology.
- `test_t172_decomposition_admission.test.mjs` rejects compressed,
  high-density, exploded, unowned, invalid-reference, and facade component-code
  carriers.
- `test_t172_decomposition_admission.test.mjs` rejects broad module-level test
  carriers without admitted test-module decomposition.
- `test_t172_decomposition_admission.test.mjs` admits a trivial one-component
  product only when it publishes an explicit decomposition summary.
- `test_t172_edge_accounting.test.mjs` proves every selected full traversal
  edge has an accounting row and projection/merge/delete rows do not dispatch
  `F_P.transform`.
- `test_t172_edge_accounting.test.mjs` proves the installed operator executes
  every `workerDispatchAllowed: false` accounting row without `worker_run.json`
  and without F_P transform refs, including deterministic qualification,
  projection, repair-schedule, release-depth, and release-preparation rows.
- `test_t172_edge_accounting.test.mjs` proves the no-dispatch
  `prepare_test_execution_surface` edge writes an admitted
  `sdlc_test_execution_surface_register` target carrier before the execution
  result edge owns test execution evidence.
- `test_t172_edge_accounting.test.mjs` proves the no-dispatch
  `derive_test_run_archive_surface` edge writes a framework-owned archive
  projection over a prior typed `test_execution_result_surface` report rather
  than dispatching F_P to rediscover execution truth.
- `test_t172_staged_target_carrier_contract.test.mjs` proves implementation
  and test materialization consume staged authority refs instead of inferring
  topology during materialization.
- `test_t118_worker_invocation_package.test.mjs` proves the worker-facing
  construction brief is the single prompt-source carrier and no longer advertises
  expanded forensic package paths as worker input.
- `test_t066_product_materialization_contract.test.mjs` proves replay can match
  prior handoff identity through compact handoff replay indexes and bounded
  prefix fallback instead of parsing full historical manifests.
- `test_t064_installed_operator_ux.test.mjs` proves runtime liveness projection
  remains replay-visible while the archived activity row set is bounded.
- `test_t172_run_analysis_edge_accounting.test.mjs` proves analyzer output reports
  edge-accounting disposition for the selected full graph and rejects observed
  worker dispatch on no-dispatch rows.
- `test_t172_run_analysis_edge_accounting.test.mjs` proves rejected analyzer
  output renders the blocking edge, dispatch policy, rationale, and typed
  reason so archive triage does not require opening the source register.

Live/archive proof:

- The accepted hello-world degenerate proportionality proof is:
  `build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260519T191520211Z_pid70560/workspace`.
  The run selected `framework_smoke_min_fp`, traversed only
  `derive_lite_design_adr_surface` and `derive_lite_component_code_surface`,
  reported same-edge retries `0`, repair attempts `0`, final closure `close`,
  and execution evidence `2/2/0`. Its admitted decomposition summary records
  one upstream obligation, one downstream row, compression ratio `1`, expansion
  ratio `1`, and `admissionDecision: admit`. Its traversal selection records
  `outcomeClass: framework_smoke`, `hopClass: single_hop`,
  `zoomDisposition: continue`, and pressure preservation through
  `outcome_class_graph_variant`.
- The Rust hello service live lane is the bounded service proof. It starts from
  `build_tenants/typescript/test_env/fixtures/t164_rust_hello_service_lite`,
  generates `build_tenants/hello_world_rust_service/Cargo.toml` and
  `build_tenants/hello_world_rust_service/src/main.rs`, then proves execution
  by running `cargo run --quiet` and `curl --fail --silent` against `GET /`.
  The accepted live archive is
  `build_tenants/typescript/test_env/test_runs/scenario_t164_rust_hello_service_lite_live/20260521T135652992Z_pid67177/workspace`.
  It proves that evaluator-derived ADR topology treats prose lineage as
  lineage, not component authority; the admitted decomposition summary records
  five upstream obligations, one downstream component row, compression ratio
  `5`, expansion ratio `0.2`, and `admissionDecision: admit`.
  This proof strengthens tenant/build-tool generality and runtime execution
  evidence, but it does not replace the data_mapper substantive-topology proof.
- The existing `data_mapper.test82` RC4 archive remains motivating evidence for
  T-171/T-102, not T-172 closure proof. The T-172 analyzer rejects it because
  it observes worker dispatch on rows now declared `workerDispatchAllowed:
  false`: `derive_code_surface`, `prepare_test_execution_surface`,
  qualification, repair-schedule, archive, release-depth, and release-prep
  rows. A successor archive must be produced after the G4 runtime-dispatch
  change.
- The data_mapper successor proof starts from
  `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.template`.
  That template, not a test harness patch, must carry the active
  `scala_spark` build-tenant definition under
  `build_tenants/scala_spark/spec/TECH_STACK.json` and
  `build_tenants/scala_spark/spec/TESTING_TECH_STACK.json`, including declared
  sbt build-config targets such as `build.sbt` and `project/`.
- The accepted data_mapper successor proof is:
  `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test85.TS.cl`.
  The final archive is
  `.ai-workspace/runtime/odd_sdlc/operator-runs/20260521T171514045Z_pid276`.
  The resumed live command returned `status: converged`,
  `graph_function: prepare_release_surface`, and
  `next_action: disposition://close`.
- The staged path closed these successor archives in order:
  `derive_component_code_surface`,
  `qualify_component_realization_surface`, `derive_code_surface`,
  `derive_test_design_surface`, `derive_component_test_surface`,
  `prepare_test_execution_surface`, `derive_test_execution_result_surface`,
  `qualify_component_test_execution_surface`,
  `derive_component_repair_schedule_surface`,
  `derive_test_run_archive_surface`, `derive_release_depth_parity_surface`,
  and `prepare_release_surface`.
- The execution evidence archive
  `.ai-workspace/runtime/odd_sdlc/assets/20260521T171129964Z_pid276/test_execution_result_surface.md`
  reports `passedCount: 7` and `failedCount: 0`.
- The repaired schedule in
  `build_tenants/scala_spark/design/component_repair_schedule_surface.md`
  reports `scheduleStatus: no_repair_required` and `repairRows: []`, retiring
  the stale seven-row repair schedule.
- The live run fixed product-local trace and repair-schedule defects without
  hard-coding test35 filenames as runtime law.

## Acceptance

- The product line rejects under-decomposed materialization before release.
- Every solution, including trivial solutions, publishes admitted decomposition.
- The evaluator chooses steel-thread or parallel traversal from admitted
  dependency maps.
- Every selected full traversal edge is accounted; unneeded edges are deleted,
  merged, replaced, conditionalized, or projection/no-close before closure.
- Rust hello service proves bounded non-JS service construction and execution
  evidence without weakening data_mapper's required substantive-topology role.
- data_mapper proves the staged graph reaches execution and release closure
  with topology depth admitted before code/test materialization.
