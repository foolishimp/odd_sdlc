---
id: T-173
title: Realize complexity-admitted Min(F_P) traversal selection
type: feature
ticket_category: design_reframe
status: active
proof_status: hello_world_live_green_data_mapper_pending
priority: high
owner: odd_sdlc
build_tenant: typescript
created_at: 2026-05-19
updated_at: 2026-05-20
triaged_at: 2026-05-19
goal: select the smallest lawful construction traversal from admitted product complexity instead of fixed graph breadth or prompt discretion
change_class: requirement_reprice
re_entry_point: requirements
first_missing_layer: requirements
governance_scope: STDO Method / odd_sdlc TypeScript traversal evaluation
source_documents:
  - .ai-workspace/comments/codex/20260517T082211Z_FOLLOWUP_edge_pruning_min_fp_review.md
  - .ai-workspace/comments/codex/20260519T164333AEST_STRATEGY_staged_construction_computation_test35_test82.md
  - .ai-workspace/tickets/active/T-172-realize-staged-disambiguation-graph-and-decomposition-admission.md
  - specification/requirements/18-typed-construction-algebra.md
  - specification/requirements/16-edge-gain-closure-contract.md
  - specification/requirements/17-target-carrier-contracts.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_EDGE_GAIN_CLOSURE_CONTRACT.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_ASSURANCE_INTEGRATION.md
related_tickets:
  - .ai-workspace/tickets/active/T-172-realize-staged-disambiguation-graph-and-decomposition-admission.md
  - .ai-workspace/tickets/completed/T-171-full-test35-parity-refactor-for-test72-execution-backed-closure.md
  - .ai-workspace/tickets/completed/T-102-define-typed-fp-function-stages-and-abg-owned-admission-flow.md
affected_boundary:
  requirements:
    - specification/requirements/16-edge-gain-closure-contract.md
    - specification/requirements/17-target-carrier-contracts.md
    - specification/requirements/18-typed-construction-algebra.md
  design:
    - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_EDGE_GAIN_CLOSURE_CONTRACT.md
    - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_ASSURANCE_INTEGRATION.md
  graph_code:
    - build_tenants/typescript/code/src/graph/edge_gain_closure_contracts.ts
    - build_tenants/typescript/code/src/graph/target_carrier_contracts.ts
  operator_code:
    - build_tenants/typescript/code/src/operator/carriers.ts
    - build_tenants/typescript/code/src/operator/handoff.ts
    - build_tenants/typescript/code/src/operator/installed_operator.ts
    - build_tenants/typescript/code/src/operator/traversal_consequence.ts
  analyzer_code:
    - build_tenants/typescript/code/src/analysis/run_analysis.ts
    - build_tenants/typescript/code/src/cli/main.ts
  tests:
    - build_tenants/typescript/test_env/tests
    - build_tenants/typescript/test_env/live
target_truth: odd_sdlc evaluates product and stage complexity before materialization, then selects the smallest lawful construction traversal that preserves closure pressure. Low-complexity products such as hello-world may close through an admitted single-hop or dual-hop traversal. Substantive products such as data_mapper require staged decomposition, dependency maps, and possible zoom before code/test materialization. Min(F_P) is lawful only when skipped or collapsed pressure is preserved as an admitted typed template, replay-visible projection, bundled F_P output, or outcome-class graph variant.
superseded_truth: all products must traverse one fixed full graph, or else edge pruning can delete work by label/prompt discretion without an admitted pressure-preservation proof.
closure_law: This ticket closes only when requirements/design, public-start graph selection, runtime carriers, evaluator consequences, analyzer output, and deterministic tests admit complexity/hop selection and Min(F_P) pressure preservation. The evaluator must prove whether a stage may continue, collapse, project, use a typed template, bundle coupled work, select a smaller outcome-class graph variant, select a zoom stage, or block before materialization.
evaluation_criteria:
  - requirements/design define complexity-admitted traversal selection as runtime law
  - outcomeClass defaults to domain_product and may admit framework_smoke/tutorial_example variants only with pressure preservation
  - zoom admission metrics include input obligation count, output row count, upstream-per-downstream compression ratio, downstream-per-upstream expansion ratio, max owned inputs per output, residual refs per output, public boundary count, and substantive downstream responsibility count
  - hop selection supports single_hop, dual_hop, staged, zoom_required, and blocked outcomes
  - hello-world evaluates as a lawful low-complexity single-hop or dual-hop traversal, not as full graph work by default
  - data_mapper evaluates as substantive staged work unless admitted decomposition and dependency metrics prove a smaller traversal is lawful
  - rollup-only surfaces may become replay-visible projections over admitted carriers/events without F_P dispatch
  - direct materialization means admitted GTL typed template plus admitted config/declaration, not harness-authored truth
  - bundled constructive work is admitted only when coupled pressure remains visible and evaluator-owned
  - analyzer reports selected hop class, outcome class, pressure-preservation mechanism, zoom metrics, and rejected alternatives
  - proportionality and Min(F_P) decisions are replay-auditable through archived carriers plus typed runtime-event refs
  - public `start --target next` selects the graph variant from admitted proportionality and outcome class; live harnesses may start traversal but must not select each stage
  - deterministic tests cover continue, single-hop, dual-hop, projection, typed-template, bundle, zoom, and block outcomes
abg_dependency_boundary: serial execution of selected plans is in odd_sdlc scope. True concurrent F_P dispatch is out of scope and requires ABG support for branch work identity, deterministic fan-out/fan-in event merge, retry isolation, resource caps, cancellation, and workspace write isolation.
non_closure_conditions:
  - Min(F_P) is implemented as edge deletion without admitted pressure-preservation evidence
  - zoom selection is implemented as prompt text without evaluator-owned consequence
  - hello-world bypasses admission entirely because it is simple
  - data_mapper/test35 filenames become generic runtime law
  - analyzer labels become authority for skipped edges
  - materialization edges absorb overloaded abstraction stages without an admitted continue/zoom/block decision
  - true concurrent F_P workers write one workspace root without ABG-owned branch isolation and merge law
---

# T-173: Realize Complexity-Admitted Min(F_P) Traversal Selection

## STDO Intake

Smallest lawful re-entry point: `requirements`.

Reason: this changes traversal law. The question is not whether a specific edge
can be skipped. The question is how odd_sdlc evaluates product complexity and
stage pressure before choosing the next construction graph. That is a
requirements-level rule over the TypeScript construction algebra.

## Consolidated Scope

T-173 combines two previously separate follow-up ideas into one coherent active
ticket:

- evaluator zoom admission from obligation-output ratios
- Min(F_P) / outcome-class traversal selection from the edge-pruning strategy
  post

These are one rule: choose the smallest lawful traversal only after the
evaluator proves that pressure remains owned, visible, and admissible.

T-172 realizes fixed staged decomposition and dependency-map admission. T-173
uses those admitted measurements to choose traversal depth.

## Core Rule

The evaluator must select the next construction traversal from admitted
complexity evidence, not from prompt discretion, fixed graph breadth, or a live
test harness stepping individual graph stages.

The lawful outcomes are:

| Outcome | Meaning |
|---|---|
| `single_hop` | the admitted product/stage is small enough for one construction hop or exact typed-template materialization |
| `dual_hop` | one intermediate authority surface is required before materialization |
| `staged` | the fixed staged graph from T-172 is required |
| `zoom_required` | the current abstraction still carries too much residual pressure and must insert/select another intermediate stage |
| `blocked` | no lawful next stage is available or pressure ownership is ambiguous |

The selected outcome must be replay-visible and cite the measured inputs that
made it lawful.

The audit contract is explicit:

- `sdlc_decomposition_summary.json` records the proportionality summary selected
  for the current operator-run archive
- `sdlc_frontdoor_decomposition_summary.json` records the public-start
  proportionality summary that selected the graph before the first F_P dispatch
- implementation/test-specific summary and dependency-map carriers preserve the
  full staged authority inputs when available
- `sdlc_traversal_hop_selection.json` records the selected hop class,
  outcome class, graph variant, zoom disposition, Min(F_P) mechanism, rejected
  alternatives, and evidence refs
- `sdlc_frontdoor_traversal_hop_selection.json` records the public-start hop
  selection that chose the executive graph variant
- the runtime event stream emits an ABG-typed
  `fd_authority_outcome_admitted` event whose evidence refs cite the traversal
  selection carrier and its proportionality inputs

The event stream carries the auditable pointer. The operator-run carriers carry
the full decision payload.

## Complexity Admission

At public start and after each abstraction stage, the evaluator measures:

- input obligation count
- output row count
- upstream-per-downstream compression ratio
- downstream-per-upstream expansion ratio
- max owned inputs per output
- residual refs per output
- public boundary count
- substantive downstream responsibility count
- declared product/outcome class
- typed-template availability
- projection-only surface eligibility
- coupled-surface bundle eligibility

If the measured ratio is proportional, traversal may continue. If the measured
ratio is small and pressure has no residual ambiguity, traversal may select a
single-hop or dual-hop graph. If the ratio is too large, residuals are carried
outside the owning subsurface, or public boundaries are too broad for the next
materialization edge, the evaluator selects zoom or block.

Thresholds belong to product construction profiles, graph/edge contracts, or
admitted evaluator policy. They must not live only in worker prompt text.

## Hello-World Degenerate Case

Hello-world is the reference low-complexity product.

An admitted hello-world complexity assessment should usually classify it as:

- `outcomeClass: framework_smoke`
- `hopClass: single_hop` or `dual_hop`
- one product intent
- one executable behavior
- one source module or typed template
- one test assertion or equivalent execution proof
- no residual domain ambiguity outside the owning surface

That does not mean hello-world bypasses the SDLC. It means hello-world publishes
an admitted minimal decomposition and the evaluator proves that the full staged
graph would add ceremony rather than disambiguation.

For hello-world, lawful Min(F_P) mechanisms may include:

- typed-template materialization for stable bootstrap surfaces
- one bundled F_P call for tightly coupled test-design and test-file pressure
- projection-only rollups over admitted execution evidence
- a framework-smoke graph variant selected by admitted outcome class

## Rust Hello Service Bounded Case

The Rust hello service is the reference bounded service product.

It is larger than the JavaScript hello-world degenerate case because it
materializes a Rust/Cargo service, starts a local HTTP server, and proves the
behavior with `curl`. It is still not the data_mapper counterexample: its
requirements are bounded, its module topology is intentionally small, and its
execution proof is one service behavior.

The Rust service proof should classify as a bounded low-complexity or small
staged traversal depending on the admitted decomposition summary. It must not
be admitted by filename, language, or fixture label. It must be admitted by the
same proportionality and pressure-preservation carriers used for JavaScript
hello-world and data_mapper.

## data_mapper Counterexample

data_mapper is the reference substantive product.

data_mapper may not inherit the hello-world route. Its requirements, module
topology, behavioral semantics, and test depth require staged decomposition
unless admitted metrics prove otherwise.

For data_mapper, closure pressure should normally require:

- implementation module decomposition
- module dependency map
- evaluator-selected steel-thread or serial/parallel traversal plan
- test module decomposition
- test dependency map
- execution evidence
- release-depth comparison against the accepted reference behavior

The evaluator may reduce F_P calls only when each skipped or collapsed surface
has an admitted pressure-preservation record.

## Min(F_P) Pressure Preservation

Min(F_P) means minimizing probabilistic worker invocations subject to the
closure-law floor.

An F_P edge may be collapsed or skipped only through one of these mechanisms:

1. typed-template direct materialization from admitted GTL declarations
2. bundling tightly coupled constructive work into one F_P invocation
3. replacing rollup artifacts with replay-visible projections over admitted
   carriers/events
4. selecting smaller graph-function variants by declared outcome class

Every decision must answer:

| Question | Required answer |
|---|---|
| What pressure did the full graph edge carry? | named source/target pressure and invariant |
| Where does the pressure live after selection? | admitted template, projection, bundle, or graph variant |
| What evidence proves pressure was not lost? | deterministic test, analyzer output, and run archive reference |
| Is content judgment still F_P-owned? | yes, unless exact typed-template materialization is admitted |
| Is execution evidence still required for close? | yes |

## ABG Boundary

This ticket does not require true ABG parallel execution.

odd_sdlc may compute a selected graph variant, zoom decision, steel-thread plan,
or parallel partition and execute it serially while preserving replay evidence.
That is enough to prove traversal selection and Min(F_P) pressure preservation.

ABG support is required only when the runtime dispatches multiple F_P workers at
the same time. That later support must include:

- branch work identity
- deterministic fan-out/fan-in event merge
- per-branch retry isolation
- resource caps
- cancellation and interruption semantics
- workspace write isolation and merge admission

Until those exist, parallel-build selection is an admitted plan, not concurrent
workspace mutation.

## Required Runtime Surfaces

T-173 should add or strengthen these surfaces:

- `SdlcTraversalComplexityAssessment`
- `SdlcTraversalHopSelection`
- `SdlcMinFpPressurePreservationDecision`
- `SdlcOutcomeClassSelection`
- `SdlcZoomAdmissionDecision`

The exact names can follow local TypeScript naming conventions, but the carrier
family must express:

- measured complexity inputs
- selected hop class
- selected outcome class
- pressure-preservation mechanism
- rejected alternatives with reasons
- predecessor refs to decomposition summaries, dependency maps, execution
  evidence, or typed-template declarations

## Deterministic Implementation Surface

The TypeScript deterministic slice publishes:

- `SdlcTraversalComplexityAssessment`
- `SdlcTraversalHopSelection`
- `SdlcMinFpPressurePreservationDecision`
- `SdlcOutcomeClassSelection`
- `SdlcZoomAdmissionDecision`
- `deriveSdlcTraversalHopSelection`

The evaluator consumes admitted `SdlcDecompositionSummary` evidence from T-172.
It selects `single_hop`, `dual_hop`, `staged`, `zoom_required`, or `blocked`
and records the pressure-preservation mechanism as `typed_template`,
`replay_visible_projection`, `bundled_fp_output`,
`outcome_class_graph_variant`, or `none`. Analyzer output includes the
selection as a read-only projection and blocks when no admitted complexity
evidence is present; analyzer output is not itself traversal authority.

The runtime archive slice now writes:

- `sdlc_implementation_decomposition_summary.json`
- `sdlc_module_dependency_map.json`
- `sdlc_module_dependency_traversal_selection.json`
- `sdlc_test_decomposition_summary.json`
- `sdlc_test_dependency_map.json`
- `sdlc_test_dependency_traversal_selection.json`
- `sdlc_decomposition_summary.json`
- `sdlc_traversal_hop_selection.json`

When a traversal-hop selection is written, the root event log and the
operator-run `runtime_events.json` contain a typed
`fd_authority_outcome_admitted` event pointing at the archived decision.
Analyzer output consumes those archived carriers before deriving a fallback
projection.

## Work Plan

1. Requirements/design: ratify complexity-admitted traversal selection and
   Min(F_P) pressure preservation.
2. Carrier schema: add traversal complexity, hop selection, outcome class,
   pressure-preservation, and zoom decision carriers.
3. Evaluator consequences: derive continue/collapse/project/template/bundle/
   zoom/block decisions from admitted metrics.
4. Graph selection: select full staged, single-hop, dual-hop, framework-smoke,
   or projection-only variants from admitted outcome class.
5. Rollup conversion: convert rollup-only surfaces to projection-owned results
   where admitted carriers/events already own the truth.
6. Analyzer: report current graph, selected graph, hop class, outcome class,
   pressure-preservation mechanism, zoom metrics, and rejected alternatives.
7. Tests: prove low-complexity hello-world selection, bounded Rust service
   selection, substantive data_mapper staged selection, projection-only
   rollups, and overloaded zoom/block paths.
8. Audit: archive proportionality and hop-selection carriers and cite them from
   typed runtime events so decisions can be replayed from the event stream plus
   operator-run archive.

## Proof Plan

Focused deterministic proof:

- `npm run test:t173:complexity-selection`
- `npm run test:t173:min-fp-pressure-preservation`
- `npm run test:t173:zoom-admission`
- `npm run test:t173`

Integration proof:

- `npm run test:t173:rust-hello-service-live`
- hello-world lifecycle selects single-hop or dual-hop and still admits
  execution evidence
- Rust hello service lifecycle proves bounded service construction, non-JS
  build-tool execution, and HTTP behavior through the same admitted
  proportionality and Min(F_P) decision carriers
- data_mapper successor run selects staged traversal unless admitted metrics
  prove a smaller path
- analyzer output shows selected hop class, selected outcome class, and
  pressure-preservation evidence

Regression proof:

- no analyzer-only skipped edge can authorize traversal
- no prompt-only zoom selection can authorize traversal
- no simple product can bypass admitted decomposition entirely
- no substantive product can inherit framework-smoke route by filename or
  example label

## Accepted Hello-World Live Proof

The accepted low-complexity live proof is:

`build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260519T191520211Z_pid70560/workspace`

The live harness only started traversal. It did not select individual stages.
The public start path selected the `framework_smoke_min_fp` graph variant from
admitted proportionality and outcome-class evidence.

Observed proof:

- selected graph: `framework_smoke_min_fp`
- traversed edges: `derive_lite_design_adr_surface`,
  `derive_lite_component_code_surface`
- same-edge retries: `0`
- repair attempts: `0`
- final closure: `close`
- execution evidence: `succeeded`, `testsObserved: 2`, `passedCount: 2`,
  `failedCount: 0`
- proportionality carrier:
  `.ai-workspace/runtime/odd_sdlc/operator-runs/20260519T191934846Z_pid70560/sdlc_decomposition_summary.json`
  records one upstream obligation, one downstream row,
  `upstreamPerDownstreamRatio: 1`, `downstreamPerUpstreamRatio: 1`, and
  `admissionDecision: admit`
- Min(F_P) decision carrier:
  `.ai-workspace/runtime/odd_sdlc/operator-runs/20260519T191934846Z_pid70560/sdlc_traversal_hop_selection.json`
  records `outcomeClass: framework_smoke`, `hopClass: single_hop`,
  `zoomAdmission.disposition: continue`, and
  `pressurePreservation.mechanism: outcome_class_graph_variant`
- audit stream:
  `.ai-workspace/runtime/odd_sdlc/operator-runs/20260519T191934846Z_pid70560/runtime_events.json`
  contains `fd_authority_outcome_admitted` events whose evidence refs cite the
  traversal-selection carrier and proportionality inputs
- analyzer projection reports `same-edge retries: 0`, `repair attempts: 0`,
  `Traversal Selection: framework_smoke / single_hop`, and `blocking reasons:
  none`

## Closure Test

T-173 closes when hello-world, Rust hello service, and data_mapper demonstrate
the same law across three product sizes:

- hello-world proves simple products can use a small admitted traversal without
  losing SDLC authority
- Rust hello service proves a bounded non-JS service can use the selected
  traversal only when proportionality and pressure-preservation decisions are
  archived and replay-visible
- data_mapper proves substantive products still require staged decomposition or
  zoom when obligation pressure exceeds the next materialization surface

The result is not edge pruning. It is evaluator-owned traversal selection over
admitted complexity evidence.
