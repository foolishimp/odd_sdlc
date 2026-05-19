---
id: T-172
title: Realize staged disambiguation graph and decomposition admission
type: feature
ticket_category: design_reframe
status: active
proof_status: action_ready
priority: critical
owner: odd_sdlc
build_tenant: typescript
created_at: 2026-05-19
updated_at: 2026-05-19
triaged_at: 2026-05-19
activated_at: 2026-05-19
goal: make every solution construction traverse through staged disambiguation before deterministic code closure
change_class: requirement_reprice
re_entry_point: requirements
first_missing_layer: requirements
governance_scope: STDO Method / odd_sdlc TypeScript construction algebra
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
related_tickets:
  - .ai-workspace/tickets/active/T-161-read-only-fd-run-analysis-linter.md
  - .ai-workspace/tickets/active/T-162-first-class-ticket-workflow-for-governed-change.md
  - .ai-workspace/tickets/completed/T-102-define-typed-fp-function-stages-and-abg-owned-admission-flow.md
  - .ai-workspace/tickets/completed/T-164-declare-per-edge-gain-and-closure-functions-for-sdlc-traversals.md
  - .ai-workspace/tickets/completed/T-171-full-test35-parity-refactor-for-test72-execution-backed-closure.md
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
target_truth: odd_sdlc construction is a staged disambiguation pipeline for every solution. Requirements must reduce through bounded design, module/component, dependency, traversal, code, and test subsurfaces before deterministic code or release closure can claim product completeness. The evaluator admits measured decomposition summaries and selects steel-thread or parallel traversal from admitted dependency maps before materialization.
superseded_truth: A full graph can close product depth by carrying many obligations directly into broad component-code or component-test materialization so long as every declared row has evidence and the runtime ledgers close.
closure_law: This ticket closes only when the TypeScript graph and evaluator admit staged decomposition summaries, enforce proportional residual predicates, select steel-thread/parallel traversal from admitted dependency maps, and prove that code/test materialization cannot close from under-decomposed module or test topology. data_mapper remains the reference proof, but the rule applies to all solution construction including trivial degenerate products.
evaluation_criteria:
  - requirements/design state that SDLC construction is staged disambiguation ending in deterministic code
  - target-carrier contracts define SdlcDecompositionSummary or equivalent measured fan-out carrier rows
  - evaluator predicates reject high-density/facade/under-decomposed module and test topology
  - trivial products publish admitted one-module/one-component decomposition instead of bypassing decomposition admission
  - module dependency and test dependency carriers exist or existing carriers are strengthened to carry equivalent authority
  - evaluator actions select steel-thread or parallel traversal over admitted dependency maps
  - component-code prompts consume admitted topology and do not ask workers to infer topology while writing code
  - component-test prompts consume admitted test topology and do not ask workers to infer testcase authority while writing tests
  - analyzer reports current graph, staged graph decisions, dependency-map traversal selection, and decomposition ratios
  - deterministic tests prove rejection of under-decomposed component-code and component-test carriers
  - data_mapper successor run proves the staged graph reaches execution evidence and release closure with deeper topology than test82 RC4
proof_surface:
  static:
    - npm run lint:semantic
    - npm test
  focused:
    - npm run test:t172:decomposition-admission
    - npm run test:t172:staged-graph
  live_or_archive:
    - npm run test:t171:data-mapper-lifecycle-live
    - odd-sdlc-ts analyze-run --workspace /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test82.TS.cl --format markdown
non_closure_conditions:
  - a component-code edge can still close with hundreds of obligations carried by a small module-facade file set and no admitted child topology
  - a component-test edge can still close with broad module-level tests and no admitted test-module dependency map
  - steel-thread or parallel-build is represented as a target carrier surface instead of an evaluator-selected traversal method
  - trivial products bypass decomposition admission entirely
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
- module dependency map before evaluator-selected build traversal
- test module decomposition after test design and before component tests
- test dependency map before evaluator-selected test traversal
- explicit test stack profile selection as an evidence/build-tenant decision
- decomposition summary rows on staged carriers

Steel-thread and parallel build remain traversal methods selected by the
evaluator over admitted dependency maps. They are not target carrier surfaces.

## Out Of Scope

Dynamic zoom admission is split to backlog ticket
`.ai-workspace/tickets/backlog/T-173-define-evaluator-zoom-admission-from-obligation-output-ratios.md`.

T-172 may record fan-out and residual metrics in decomposition summaries, but it
does not implement evaluator insertion or selection of new intermediate stages.

## Implementation Decisions

T-172 is a fixed staged-graph implementation. It does not require every stage
to become a new graph edge when an existing admitted carrier already owns the
right row family.

| Stage | Existing Carrier | T-172 Disposition |
|---|---|---|
| implementation-module decomposition | `SdlcComponentTopologyRow`, `SdlcComponentRealizationRow`, `componentTopologyRows`, `componentRealizationRows` in `build_tenants/typescript/code/src/operator/carriers.ts` | strengthen existing implementation-design/component-depth carriers with `SdlcDecompositionSummary` and admission predicates |
| module dependency map | no standalone admitted dependency carrier | add `SdlcModuleDependencyMap` or equivalent authority section before component-code traversal selection |
| test-module decomposition | `SdlcTestModuleRow`, `SdlcTestComponentTopologyRow`, `componentTestRows` in `carriers.ts` and `test_design_register.ts` | strengthen existing test-design/component-test carriers with `SdlcDecompositionSummary` and admission predicates |
| test dependency map | no standalone admitted test dependency carrier | add `SdlcTestDependencyMap` or equivalent authority section before component-test traversal selection |
| test stack profile | `SdlcTestStackProfileRow` / `testStackProfileRows` | strengthen existing rows as the admitted test-stack selection; do not add a separate `select_test_stack_profile` edge in T-172 unless the existing carrier cannot express the decision |

This is the implementation rule for the proposed staged graph: new authority
may be a new carrier section on an existing edge when ordering and admission
are explicit. A new graph edge is required only when the stage cannot be
admitted before the downstream materialization edge using existing carriers.

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
  readonly upstreamCount: number;
  readonly downstreamCount: number;
  readonly fanoutRatio: number;
  readonly maxAllowedFanoutRatio: number;
  readonly maxOwnedUpstreamPerDownstream: number;
  readonly maxOwnedUpstreamWithoutBoundary: number;
  readonly rows: readonly SdlcDecompositionSummaryRow[];
  readonly overloadedDownstreamIds: readonly string[];
  readonly facadeDownstreamIds: readonly string[];
  readonly underDecomposedParentIds: readonly string[];
  readonly residualRefs: readonly string[];
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
| high-density downstream row | `ownedUpstreamCount > maxOwnedUpstreamPerDownstream` or `fanoutRatio > maxAllowedFanoutRatio` |
| facade row | `ownedUpstreamCount > maxOwnedUpstreamWithoutBoundary` and `publicBoundaryCount == 0`, or `ownedUpstreamCount > 0` and `substantiveResponsibilityCount == 0` |
| under-decomposed parent | a module/test parent owns high-density obligations through facade rows and has no admitted child component/test rows |
| residual outside subsurface | a residual ref belongs to a requirement/design/module/testcase not owned by the current stage |
| trivial degenerate product | admitted only when the summary is explicitly 1 upstream / 1 downstream with one public or executable boundary; no product bypasses decomposition admission |

The phrase "hundreds of obligations" is not a predicate. It is evidence of a
probable high-density failure. Admission must use the measured counts and
profile thresholds.

## Gate Register

| Gate | Required Result | Proof Before Next Gate |
|---|---|---|
| G0 requirements/design | staged disambiguation, no-bypass trivial decomposition, and projection-vs-authority wording are ratified | requirement/design diff plus review |
| G1 carrier schema | `SdlcDecompositionSummary`, module dependency map, and test dependency map shapes are declared | focused type/admission tests compile |
| G2 evaluator admission | high-density, facade, under-decomposed, and residual-scope predicates reject invalid carriers | deterministic negative tests fail close before materialization |
| G3 graph/handoff/analyzer | code/test prompts consume admitted topology; analyzer reports ratios and traversal selection | focused staged-graph tests |
| G4 live proof | data_mapper successor run closes with admitted topology depth before code/test materialization | live archive plus analyzer report |

## Work Plan

1. Requirements: add the staged disambiguation and proportional residual rule.
2. Design: define decomposition summaries and density/facade predicates.
3. Graph contracts: add or strengthen implementation-module, module-dependency,
   test-module, and test-dependency surfaces.
4. Evaluator: implement steel-thread/parallel traversal selection over admitted
   dependency maps.
5. Handoff: make code/test prompts consume admitted topology rather than infer
   topology during materialization.
6. Analyzer: report graph shape, decomposition ratios, dependency-map traversal
   selection, and under-decomposition failures.
7. Tests: add deterministic negative tests for under-decomposed code/test
   carriers and positive tests for trivial one-component decomposition.
8. Live proof: rerun data_mapper as the reference staged-construction proof.

## Proof Plan

Static proof:

- `npm run lint:semantic`
- `npm test`

Focused proof:

- `test_t172_decomposition_admission.test.mjs` rejects high-density/facade
  component-code carriers.
- `test_t172_decomposition_admission.test.mjs` rejects broad module-level test
  carriers without admitted test-module decomposition.
- `test_t172_decomposition_admission.test.mjs` admits a trivial one-component
  product only when it publishes an explicit decomposition summary.
- `test_t172_staged_graph.test.mjs` proves dependency-map traversal selection is
  evaluator-owned and not represented as a target carrier surface.
- `test_t172_run_analysis.test.mjs` proves analyzer output reports
  decomposition ratios, rejection reasons, and selected traversal method.

Live/archive proof:

- run a data_mapper successor after G0-G3 pass
- archive the analyzer output for the same run
- compare topology depth against test82 RC4 and test35 evidence without
  hard-coding test35 filenames as runtime law

## Acceptance

- The product line rejects under-decomposed materialization before release.
- Every solution, including trivial solutions, publishes admitted decomposition.
- The evaluator chooses steel-thread or parallel traversal from admitted
  dependency maps.
- data_mapper proves the staged graph reaches execution and release closure
  with topology depth admitted before code/test materialization.
