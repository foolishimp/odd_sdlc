---
id: T-172
title: Realize staged disambiguation graph and zoom admission
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
target_truth: odd_sdlc construction is a staged disambiguation pipeline for every solution. Requirements must reduce through bounded design, module/component, dependency, traversal, code, and test subsurfaces before deterministic code or release closure can claim product completeness. The evaluator measures input-obligation to output-row ratios and either continues, selects steel-thread/parallel traversal, or zooms into another lawful intermediate stage before materialization.
superseded_truth: A full graph can close product depth by carrying many obligations directly into broad component-code or component-test materialization so long as every declared row has evidence and the runtime ledgers close.
closure_law: This ticket closes only when the TypeScript graph and evaluator admit staged decomposition summaries, enforce proportional residual predicates, select zoom/continue traversal from measured obligation-output ratios, and prove that code/test materialization cannot close from under-decomposed module or test topology. data_mapper remains the reference proof, but the rule applies to all solution construction including trivial degenerate products.
evaluation_criteria:
  - requirements/design state that SDLC construction is staged disambiguation ending in deterministic code
  - target-carrier contracts define decompositionSummary or equivalent measured fan-out carrier rows
  - evaluator predicates reject high-density/facade/under-decomposed module and test topology
  - trivial products publish admitted one-module/one-component decomposition instead of bypassing decomposition admission
  - module dependency and test dependency carriers exist or existing carriers are strengthened to carry equivalent authority
  - evaluator actions select steel-thread or parallel traversal over admitted dependency maps
  - evaluator action can zoom into another intermediate stage when input obligations to output rows exceed profile thresholds
  - component-code prompts consume admitted topology and do not ask workers to infer topology while writing code
  - component-test prompts consume admitted test topology and do not ask workers to infer testcase authority while writing tests
  - analyzer reports current graph, staged graph decisions, zoom decisions, and decomposition ratios
  - deterministic tests prove rejection of under-decomposed component-code and component-test carriers
  - data_mapper successor run proves the staged graph reaches execution evidence and release closure with deeper topology than test82 RC4
non_closure_conditions:
  - a component-code edge can still close with hundreds of obligations carried by a small module-facade file set and no admitted child topology
  - a component-test edge can still close with broad module-level tests and no admitted test-module dependency map
  - zoom decisions exist only in prompt text or comments rather than evaluator-owned traversal consequences
  - steel-thread or parallel-build is represented as a target carrier surface instead of an evaluator-selected traversal method
  - trivial products bypass decomposition admission entirely
  - data_mapper-specific file names or test35 source filenames become generic runtime law
  - release closure treats execution and ledger success as test35-depth parity without admitted topology-depth evidence
---

# T-172: Realize Staged Disambiguation Graph And Zoom Admission

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
- zoom-or-continue evaluator action after abstraction stages

Steel-thread and parallel build remain traversal methods selected by the
evaluator over admitted dependency maps. They are not target carrier surfaces.

## Zoom Admission

After each abstraction stage, the evaluator measures:

- input obligation count
- output row count
- fan-out ratio
- max owned inputs per output
- residual refs per output
- public boundary count
- substantive downstream responsibility count

If the measured ratio is proportional, traversal continues. If the ratio is
too large or residuals are carried outside the owning subsurface, the evaluator
selects another lawful zoom stage before materialization.

## Work Plan

1. Requirements: add the staged disambiguation and proportional residual rule.
2. Design: define decomposition summaries, density/facade predicates, and zoom
   action semantics.
3. Graph contracts: add or strengthen implementation-module, module-dependency,
   test-module, and test-dependency surfaces.
4. Evaluator: implement zoom/continue and steel-thread/parallel traversal
   selection over admitted dependency maps.
5. Handoff: make code/test prompts consume admitted topology rather than infer
   topology during materialization.
6. Analyzer: report graph shape, decomposition ratios, zoom decisions, and
   under-decomposition failures.
7. Tests: add deterministic negative tests for under-decomposed code/test
   carriers and positive tests for trivial one-component decomposition.
8. Live proof: rerun data_mapper as the reference staged-construction proof.

## Acceptance

- The product line rejects under-decomposed materialization before release.
- Every solution, including trivial solutions, publishes admitted decomposition.
- The evaluator can choose zoom/continue from measured obligation-output ratio.
- data_mapper proves the staged graph reaches execution and release closure
  with topology depth admitted before code/test materialization.
