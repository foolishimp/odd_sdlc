---
id: T-169
title: Implement GTL target carrier contracts for SDLC graph-vector outputs
type: feature
ticket_category: sdlc_target_carrier_contract_consumption
status: completed
review_status: closed_superseded_by_strategy_2026-05-16
closure_disposition: superseded_not_implemented
superseded_by:
  - .ai-workspace/comments/codex/20260516T024852Z_STRATEGY_fp_fd_eventual_consistency_steel_thread_execution.md
priority: critical
owner: odd_sdlc
created_at: 2026-05-15
updated_at: 2026-05-16
build_tenant: typescript
goal: sdlc-vector-output-shape-is-admitted-gtl-carrier-truth
change_intent: Consume ABIogenesis T-133 target carrier contracts inside odd_sdlc.TS so every close-capable SDLC graph-vector output declares, projects, admits, records, replays, and tests the same GTL target carrier contract instead of scattering output shape across graph rows, prompts, parsers, ledgers, and harness expectations.
change_class: requirement_reprice
re_entry_point: requirements
first_missing_layer: requirements
governance_scope: STDO Method
upstream_completed_ticket:
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-133-declare-gtl-target-carrier-contracts-for-graph-vector-outputs.md
required_substrate:
  - /Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript
  - "@abiogenesis/typescript-tenant >= 3.7.1-rc.4 or local source equivalent containing ABI T-133"
intake_source:
  - operator clarified this is an odd_sdlc implementation ticket for ABIogenesis T-133
  - T-164 showed SDLC edge gain and closure can be declared while target output carrier shape remains underdeclared
  - T-168 requires tests and implementation to consume the same design assets, which includes output carrier contracts for test assets and execution evidence
source_documents:
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
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_EDGE_GAIN_CLOSURE_CONTRACT.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_ASSURANCE_INTEGRATION.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_LEDGER_SOLUTION.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TEST_PIPELINE.md
  - .ai-workspace/comments/codex/20260516T024852Z_STRATEGY_fp_fd_eventual_consistency_steel_thread_execution.md
  - .ai-workspace/tickets/completed/T-164-declare-per-edge-gain-and-closure-functions-for-sdlc-traversals.md
  - .ai-workspace/tickets/completed/T-168-build-design-consumer-test-pipeline-for-co-affirming-implementation.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-133-declare-gtl-target-carrier-contracts-for-graph-vector-outputs.md
  - /Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/config/gtl.target-carrier-defaults.json
related_tickets:
  - .ai-workspace/tickets/completed/T-164-declare-per-edge-gain-and-closure-functions-for-sdlc-traversals.md
  - .ai-workspace/tickets/completed/T-168-build-design-consumer-test-pipeline-for-co-affirming-implementation.md
  - .ai-workspace/tickets/completed/T-100-require-test-module-materialization-discoverable-by-declared-test-contract.md
  - .ai-workspace/tickets/completed/T-104-split-test-execution-from-test-run-archive-surface.md
  - .ai-workspace/tickets/completed/T-145-replay-visible-closure-and-worker-report-authority-deletion.md
  - .ai-workspace/tickets/completed/T-151-one-closed-computational-loop-and-runner-evaluator-sovereignty.md
  - .ai-workspace/tickets/completed/T-157-first-pass-live-product-materialization-closure-contract.md
  - .ai-workspace/tickets/completed/T-160-first-class-traversal-overlays-for-guided-graph-passes.md
affected_boundary:
  requirements:
    - specification/GOALS.md
    - specification/PRODUCT.md
    - specification/requirements/02-graph-functions.md
    - specification/requirements/13-odd-sdlc-typescript-tenant.md
    - specification/requirements/14-odd-sdlc-installed-product-contract.md
    - specification/requirements/16-edge-gain-closure-contract.md
    - specification/requirements/17-target-carrier-contracts.md
  design:
    - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TARGET_CARRIER_CONTRACTS.md
    - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_EDGE_GAIN_CLOSURE_CONTRACT.md
    - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TEST_PIPELINE.md
  graph_code:
    - build_tenants/typescript/code/src/graph/catalog.ts
    - build_tenants/typescript/code/src/graph/library.ts
    - build_tenants/typescript/code/src/graph/module.ts
    - build_tenants/typescript/code/src/graph/overlays.ts
    - build_tenants/typescript/code/src/graph/boundary_refs.ts
    - build_tenants/typescript/code/src/graph/edge_gain_closure_contracts.ts
    - build_tenants/typescript/code/src/graph/target_carrier_contracts.ts
  domain_code:
    - build_tenants/typescript/code/src/domain/carriers.ts
    - build_tenants/typescript/code/src/domain/admission.ts
    - build_tenants/typescript/code/src/domain/software_domain_catalog.ts
  operator_code:
    - build_tenants/typescript/code/src/operator/carriers.ts
    - build_tenants/typescript/code/src/operator/edge_gain_closure.ts
    - build_tenants/typescript/code/src/operator/handoff.ts
    - build_tenants/typescript/code/src/operator/installed_operator.ts
    - build_tenants/typescript/code/src/operator/traversal_consequence.ts
    - build_tenants/typescript/code/src/operator/test_pipeline.ts
  projection_code:
    - build_tenants/typescript/code/src/projection/query_domain.ts
    - build_tenants/typescript/code/src/projection/requirement_closure.ts
  start_and_install_code:
    - build_tenants/typescript/code/src/start/public_start.ts
    - build_tenants/typescript/code/src/spec_method/entry.ts
    - build_tenants/typescript/code/src/install/
  tests:
    - build_tenants/typescript/test_env/tests/test_t169_target_carrier_contracts.test.mjs
    - build_tenants/typescript/test_env/tests/test_t164_edge_gain_closure_contract.test.mjs
    - build_tenants/typescript/test_env/tests/test_t168_design_consumer_test_pipeline.test.mjs
    - build_tenants/typescript/test_env/sandbox/test_scenario_sandbox.test.mjs
    - build_tenants/typescript/test_env/live/
excluded_boundary:
  - changing ABIogenesis T-133 contract semantics except under a separate ABI bug ticket
  - moving SDLC product meaning into ABG core
  - creating a second odd_sdlc runtime or payload ledger outside ABG-owned runtime truth
  - treating target carrier contracts as prompt-only instructions
  - treating artifact existence, worker prose, manifests, or harness expected files as target satisfaction
  - replacing T-168's design-consumer test pipeline; this ticket supplies the target carrier contract that pipeline must consume
  - making ABG a product-specific SDLC schema engine
target_truth: >
  Every close-capable odd_sdlc TypeScript graph-vector output has an effective
  GTL target carrier contract binding. Product-specific bindings are declared
  on the SDLC graph-vector surface where SDLC output shape matters; generic
  defaults are consumed only as visible ABI config-backed defaults. Handoff
  prompts, worker result admission, edge evidence ledgers, closure decisions,
  query-domain/gaps projections, test pipeline assets, run archives, and replay
  all carry the same selected target carrier contract ref and digest.
superseded_truth: >
  SDLC output carrier shape is implied by graph catalog output names, edge
  assurance rows, prompt text, parser predicates, expected-file lists, local
  fixture conventions, or worker result summaries without one declared GTL
  target carrier contract binding.
closure_law: >
  This ticket closes only when odd_sdlc.TS declares SDLC target carrier
  contracts as product-owned GTL graph-vector output law, binds every
  close-capable output vector to an effective ABI T-133 target carrier
  contract, projects that contract into worker handoff packages, admits or
  rejects returned output candidates against the selected contract, records
  selected contract ref and digest in evidence/ledger/closure/read-model
  surfaces, derives tests from the same carrier contract assets, and proves
  malformed target carriers cannot close an SDLC edge or compound traversal.
evaluation_criteria:
  - requirements declare SDLC target carrier contracts as a mandatory output-shape law for close-capable vectors
  - design declares the SDLC target carrier carrier family, graph binding, projection, admission, replay, and test-case-generation model
  - every close-capable edge assurance row either binds a product-specific SDLC target carrier contract or explicitly accepts the visible ABI generic default
  - no effective target carrier contract is null or code-manufactured outside ABI visible config or SDLC graph declarations
  - vector-local target carrier declarations are identity-bound to the hosting vector target node and target schema
  - handoff packages include the selected target carrier contract projection and worker-fillable field boundary
  - worker result parsing/admission validates the returned carrier envelope, nested payload path, required fields, fixed protocol fields, literal domains, and contract digest
  - target carrier admission remains structural and identity-bound only; it does not evaluate SDLC content quality, obligation fulfillment, design completeness, implementation correctness, or test adequacy
  - content-missing and content-weak conditions are emitted by assurance/content ledgers with lawful re-entry, not by the target-carrier admission function
  - edge evidence, payload/assurance ledgers, closure decisions, query-domain, gaps, run archives, and replay carry the selected target carrier contract ref and digest
  - T-168 test-pipeline graph functions consume target carrier contracts when generating test assets, test data, execution evidence, and result verification assets
  - malformed target carriers produce typed non-close diagnostics, not TypeError-only crashes or silent parser skips
  - deterministic tests derive positive and negative carrier cases from the same contract asset consumed by implementation
  - live or live-equivalent hello-world and data_mapper proof archives show target carrier contract refs/digests in handoff, admission, closure, and query evidence
proof_surface:
  static:
    - npm run lint:semantic
    - npm run lint:test-harness
  focused:
    - npm run test:t169
    - npm run test:t164:edge-contract
    - npm run test:t168
  broader:
    - npm run test:semantic
  live_or_equivalent:
    - npm run test:t132:hello-world-live
    - npm run test:t164:data-mapper-full-capability-live
    - preserved resume of any already-progressed T-164/T-168 run when the failure category is SDLC product code rather than ABI platform code
non_closure_conditions:
  - a close-capable graph vector output lacks an effective target carrier contract binding
  - SDLC relies on ABI generic defaults without recording whether the generic default or product-specific contract was selected
  - output shape remains prompt prose, parser-only code, graph output names, or harness expected-file lists
  - a worker can return a target carrier for the wrong target node or schema and still pass SDLC admission
  - edge assurance close can pass without target carrier admission under the selected contract ref and digest
  - replay reconstructs output truth without the selected target carrier contract identity
  - test pipeline assets are generated from implementation code shape rather than the same target carrier contract assets
  - malformed carriers for missing nested payload, wrong kind literal, missing required field, fixed-field mutation, or digest mismatch are not covered by negative tests
  - a well-formed target carrier with incomplete SDLC content is rejected as malformed shape instead of admitted and then blocked by content assurance
  - retry instructions treat content-gaps such as missing design attributes or missing operations as schema-local repair instead of semantic/content repair
  - live proof stops at component-code or artifact-materialization closure without proving target carrier admission for downstream tests and release-depth outputs
---

# T-169: Implement GTL Target Carrier Contracts For SDLC Graph-Vector Outputs

## Supersession Closure - 2026-05-16

This ticket is closed as superseded, not implemented and not invalid.

The superseding surface is:

`.ai-workspace/comments/codex/20260516T024852Z_STRATEGY_fp_fd_eventual_consistency_steel_thread_execution.md`

The valid content from this ticket is absorbed by the strategy:

- target carrier contracts remain mandatory output identity and envelope law;
- selected carrier ref/digest must survive handoff, admission, ledgers, replay,
  and query evidence;
- worker-fillable boundaries must be explicit;
- malformed envelopes must be typed admission failures.

The ticket no longer stands as an independent active implementation surface
because the prior implementation direction promoted target-carrier admission
too high in the closure stack. The corrected placement is: target-carrier
admission admits or rejects output envelope identity; it does not judge SDLC
content completeness, implementation quality, test adequacy, or product close.

Any future implementation must start from the superseding strategy and must
repair current code/design state created by this ticket where target-carrier or
register admission became a closure gate over product meaning.

## STDO Triage

Smallest lawful re-entry point: `requirements`.

Change class: `requirement_reprice`.

ABIogenesis T-133 completed the substrate contract: every GTL graph-vector
output has an effective target carrier binding, vector-local declarations are
identity checked, visible config supplies generic defaults, ABG payload ledger
and assurance gate consume selected contract ref and digest, and tests prove
generic envelope rejection cases.

The missing SDLC layer is downstream product adoption.

`odd_sdlc` owns software-domain output meaning. ABI declares the generic target
carrier contract mechanism. SDLC must now declare which target carriers its
typed graph vectors produce, how those carrier contracts project into handoffs,
how returned worker outputs are admitted, and how edge closure/test-pipeline
proof consumes the same carrier identity.

This is not an ABI core change unless implementation exposes a substrate bug.
If a substrate bug is discovered, fix it under a separate ABI ticket and resume
this SDLC ticket after the substrate release or source dependency is available.

## Problem

T-164 made per-edge gain and closure explicit. It did not fully eliminate
carrier-shape drift.

Today an SDLC output surface can be implied by several independent places:

- graph catalog `outputs`
- graph-vector source and target nodes
- edge assurance matrix rows
- worker handoff text
- parser or admission predicates
- materialized file manifests
- fulfillment ledgers and closure decisions
- test harness expected files
- live archive assertions

Those surfaces must consume one declared target carrier contract.

The defect is not that SDLC lacks more prompt wording. The defect is that the
target output carrier is not yet a first-class SDLC product binding over the
ABI T-133 GTL contract.

## Upstream Contract To Consume

ABI T-133 introduced these durable substrate truths:

- `gtl.target_carrier_contract` is the GTL declaration family for graph-vector
  target carrier contracts.
- Every graph-vector output has an effective binding.
- A vector-local product-specific binding wins.
- If vector-local binding is absent, visible ABI config supplies a generic
  default.
- The effective binding may not be null.
- Vector-local target and schema identity must match the hosting vector.
- Contract digest is calculated over normalized content.
- Generic envelope validation covers nested payload path, required fields,
  literal kind, and fixed protocol fields.
- Payload ledger and assurance closure can require admitted target carrier
  satisfaction under the selected contract ref and digest.
- ABI owns generic admission, projection, replay, and closure gating.
- Downstream products own domain meaning and concrete worker-fillable fields.

SDLC must not duplicate this generic ABI mechanism. SDLC must instantiate it.

## Target SDLC Truth

Every close-capable SDLC graph vector has a target carrier binding with this
interpretation:

```text
SDLC graph vector
  -> selected GTL target carrier contract binding
  -> handoff projection for the worker
  -> returned target carrier candidate
  -> ABI target carrier validation/admission
  -> SDLC edge evidence admission
  -> SDLC gain/residual/close fold
  -> query-domain/gaps/archive/replay projection
  -> tests derived from same carrier contract
```

The carrier contract is the output shape authority. The edge assurance contract
is the gain and closure authority. Neither replaces the other.

```text
target carrier contract answers:
  what shape did this vector output have to produce?

edge assurance contract answers:
  did admitted evidence under that output shape satisfy the SDLC edge?
```

## Refactor Boundary: Typing Is Not Content Evaluation

This ticket must preserve the product boundary in
`specification/PRODUCT.md`: generic SDLC construction is `F_P`; `F_D` supports
deterministic optimization, admission, validation, folding, diagnostics, and
routing around admitted constructive work. It does not become the hidden
constructor or semantic judge for open-ended SDLC content.

Target carrier typing is still mandatory. It disambiguates the selected output
surface, fixed protocol fields, worker-fillable payload area, nested payload
path, and selected contract ref/digest. That makes worker input and returned
evidence consumable by downstream graph functions, tests, ledgers, and replay.

The clean refactor boundary is:

```text
GTL target carrier contract
  -> shape and identity admission
  -> typed candidate carrier admitted or rejected

SDLC assurance/content ledgers
  -> requirement, design, implementation, test, execution, and closure meaning
  -> retry, repair, reprice, or close decision
```

Required correction:

- target carrier admission may reject malformed envelope or carrier identity:
  missing nested payload, wrong literal kind, missing required protocol field,
  fixed-field mutation, wrong selected contract ref/digest, or parse failure;
- target carrier admission must not return content-completeness states such as
  partial design, missing domain entity, missing operation, weak flow, weak
  tests, or incomplete implementation;
- a well-formed carrier with incomplete content is admitted structurally, then
  blocked by the appropriate assurance/content ledger;
- retry repair instructions must expose accepted carrier shape for shape
  failures only, and must expose content/assurance gaps as semantic/content
  repair pressure;
- construction templates in the worker package are input-disambiguation
  carriers, not evaluation rubrics and not duplicated prompt-schema prose.

## Required SDLC Contract Shape

The implementation may name the carrier differently, but it must expose an
equivalent SDLC product row:

```ts
export interface SdlcTargetCarrierContractRow {
  readonly kind: "sdlc_target_carrier_contract_row";
  readonly graphVectorRef: string;
  readonly edgeRef: string;
  readonly targetAssetType: string;
  readonly targetNodeRef: string;
  readonly targetSchemaRef: string;
  readonly targetCarrierContractRef: string;
  readonly targetCarrierContractDigest: string;
  readonly targetCarrierTemplateRef: string;
  readonly outputCarrierFamilyRef: string;
  readonly outputCarrierKind: string;
  readonly nestedPayloadPath: string;
  readonly requiredFieldRefs: readonly string[];
  readonly fixedProtocolFieldRefs: readonly string[];
  readonly workerFillableFieldRefs: readonly string[];
  readonly literalDomainRefs: readonly string[];
  readonly schemaRef: string;
  readonly admissionRef: string;
  readonly payloadLedgerBindingRef: string;
  readonly edgeAssuranceBindingRef: string;
  readonly handoffProjectionRef: string;
  readonly constructionTemplateRef: string;
  readonly replayDigestPolicyRef: string;
  readonly materializationPolicyRef: string;
  readonly closurePreconditionRef: string;
  readonly testCaseGenerationRef: string;
}
```

This row is not a replacement for ABI `TargetCarrierContractBinding`. It is the
SDLC read/write contract row that binds the ABI carrier identity to SDLC graph
vectors, edge assurance rows, handoff packages, tests, and query surfaces.

## Missing Contract Register

### Graph Catalog And Module

Current contract:

- graph functions publish input and output asset names
- module construction creates graph vectors from source and target nodes
- graph-vector declarations already carry traversal strategy, transform, eval,
  compute basis, and proof obligation refs

Missing components:

- graph-vector declaration for `gtl.target_carrier_contract`
- product-specific SDLC carrier rows for close-capable output vectors
- target node and target schema identity cross-checks surfaced in SDLC tests
- carrier contract digest exposed beside graph catalog digest
- matrix validation that all close-capable vectors resolve a target carrier

### Edge Assurance Matrix

Current contract:

- every published vector has closure classification
- close-capable vectors have gain, evidence, metric, threshold, close,
  residual-pressure, and composition fields

Missing components:

- target carrier contract ref and digest for each close-capable edge
- distinction between target carrier admission failure and semantic edge
  residual pressure
- closure precondition that target carrier admission succeeds before edge close
- rejection categories for malformed output carriers
- contract trace from edge assurance row to target carrier row

### Handoff Projection

Current contract:

- worker handoff packages include graph, edge, operation, target, and evidence
  instructions
- some prompts include exact closed carrier shapes for specialized payloads

Missing components:

- target carrier projection generated from the selected contract row
- explicit worker-fillable fields
- fixed protocol fields that the worker must not mutate
- nested payload path and literal kind surfaced as contract truth
- contract ref and digest in the handoff archive

### Worker Result Admission

Current contract:

- installed operator parses result reports, product file manifests, and
  execution evidence
- edge evidence admission can reject worker percent complete or unsupported
  artifact presence

Missing components:

- candidate output object validation against ABI target carrier binding
- digest-bound admission keyed to selected carrier contract
- malformed-carrier diagnostics for missing nested payload, wrong literal kind,
  missing required field, fixed-field mutation, and contract mismatch
- separation between invalid carrier shape and valid carrier with incomplete
  SDLC semantic fulfillment
- no `partial` or content-gap status in target-carrier or design-depth
  structural admission; content gaps must flow through assurance ledgers

### Payload, Evidence, And Closure Ledgers

Current contract:

- SDLC edge fulfillment ledgers and closure decisions carry edge contract ref
  and digest
- query-domain can expose edge assurance read models

Missing components:

- target carrier contract ref and digest on admitted evidence that represents a
  graph-vector output
- target carrier admission state as a closure precondition
- read-model diagnostics for missing or rejected target carrier admission
- replay reuse gated by selected carrier contract identity

### Test Pipeline

Current contract:

- T-168 declares tests and implementation as sibling consumers of design assets
- UAT cases produce UAT integration tests
- execution evidence must be admitted before product convergence

Missing components:

- test design/test module/test case/test data/test execution output carrier
  contracts
- generated test cases derived from carrier contract obligations
- negative carrier-shape tests derived from the same contract asset
- execution evidence carrier contract for observed test results

### Installed Product Boundary

Current contract:

- installed workspaces receive ABI substrate and SDLC product payload
- cold agents read installed bootstrap, gaps, and start surfaces

Missing components:

- ABI target-carrier defaults config presence verified or surfaced in install
  proof
- SDLC installed payload able to project product-specific carrier rows without
  source-repo hidden state
- installed archive preserving selected target carrier ref/digest for replay

## Graph And Graph Function Inventory

This ticket touches the SDLC product graph and reusable graph-function library.
The register below is the initial complete work surface. Implementation must
update this register when graph names are added, removed, or renamed.

### Traversal Overlays

Affected overlays:

- `overlay://odd-sdlc/current-full-traversal`
- `overlay://odd-sdlc/lite-design-module-implementation`
- `overlay://odd-sdlc/solution-architecture`
- `overlay://odd-sdlc/bootstrap-requirements`
- `overlay://odd-sdlc/uat-test-cases`
- any T-168 test-pipeline overlay introduced during active work

Required overlay behavior:

- every selected close-capable vector resolves an edge assurance row and a
  target carrier row
- overlay close cannot bypass a target carrier rejection
- compound traversal residual pressure preserves target-carrier failures from
  intermediate edges

### Published SDLC Graph Functions

Affected bootstrap and architecture functions:

- `derive_intent_surface`
- `derive_product_surface`
- `derive_goal_surface`
- `derive_requirement_surface`
- `derive_feature_decomp_surface`
- `derive_design_surface`
- `derive_scenario_surface`
- `derive_implementation_design_surface`

Affected lite implementation functions:

- `derive_lite_design_adr_surface`
- `derive_lite_component_code_surface`

Affected UAT/test functions:

- `derive_test_design_surface`
- `derive_component_test_surface`
- `prepare_test_execution_surface`
- `derive_test_execution_result_surface`
- `qualify_component_test_execution_surface`
- `derive_component_repair_schedule_surface`
- `derive_test_run_archive_surface`

T-169 binds the current published graph-function names. Testcase, test-data,
expected-result, module/allocation, topology, and execution-schedule truth live
as rows inside `test_design_surface`.

### Reusable Graph Functions

Affected reusable functions:

- `Fg_single_typed_traversal`
- `Fg_ingress_project`
- `Fg_conform_project`
- `Fg_conform_project_authority`
- `Fg_materialize_declared_product_asset`
- `Fg_materialization_assurance_ledger`
- `Fg_semantic_convergence_assurance_ledger`
- `Fg_obligation_carry_assurance_ledger`
- `Fg_requirement_fulfillment_assurance_ledger`
- `Fg_ambiguity_assurance_ledger`
- `Fg_capability_assurance_ledger`
- `Fg_shallow_realization_assurance_ledger`
- `Fg_traversal_assurance_fold`

Required reusable behavior:

- reusable traversal functions must not assume target shape from output asset
  name alone
- reusable materialization functions must carry target carrier contract identity
  into returned evidence
- reusable assurance ledgers must distinguish target carrier admission from
  semantic fulfillment
- reusable retry handoff functions must not convert content-assurance reasons
  into schema-local accepted-carrier repair unless the carrier itself was
  malformed

### Target Asset Families And Carrier Outputs

The following output asset families require target carrier contract decisions:

- `intent_surface`
- `product_surface`
- `goal_surface`
- `requirement_surface`
- `feature_decomp_surface`
- `design_surface`
- `scenario_surface`
- `implementation_design_surface`
- `design_adr_surface`
- `component_code_surface`
- `test_design_surface`
- `component_test_surface`
- `test_execution_surface`
- `test_execution_result_surface`
- `component_test_qualification_surface`
- `component_repair_schedule_surface`
- `test_run_archive_surface`
- `release_depth_parity_surface`
- `release_surface`

The first implementation may use generic ABI defaults for low-risk surfaces,
but close-capable product outputs with SDLC-specific closure semantics must
declare product-specific rows before closure is claimed.

## Full Graph Overlay Consolidation Review

T-169 changes the economics of the full traversal overlay. The current full
overlay was expanded to force smaller worker computations by splitting design,
implementation planning, test planning, execution scheduling, and proof into
many graph stages. Target carrier contracts now let a single admitted carrier
preserve row-level obligations, fixed protocol fields, worker-fillable fields,
test-case generation refs, closure preconditions, and digest identity without
requiring every row family to be a separate prompt-bearing edge.

The consolidation target is latency and contract reduction. It must not remove
the lifecycle boundaries that carry external command execution, materialized
code/test artifacts, replay-visible evidence, or release proof.

### Current Redundant Design-To-Implementation Stages

The full catalog uses one prompt-bearing implementation planning stage:

- keep `derive_design_surface` and `derive_scenario_surface` as upstream design
  authority boundaries;
- `derive_implementation_design_surface` produces the composite
  implementation plan carrier, including stack profile, module rows, aggregate
  domain model rows, component topology rows, sunny-day sequence rows,
  realization schedule rows, and file target rows;
- keep `derive_component_code_surface` as the first implementation
  materialization boundary;
- keep `qualify_component_realization_surface` as the proof boundary over
  produced component code;
- keep `derive_code_surface` only if it remains an aggregate code/package
  surface distinct from component materialization. If it merely repeats
  component-code closure for one-component products, it should become a row in
  the code/materialization carrier.

### Current Redundant Design-To-Test Stages

The full catalog uses one prompt-bearing test-planning stage. Test cases, test
data, expected results, test modules, topology, and schedule are typed rows on
the composite test carrier. Target carrier contracts make that row-packing safe
because the carrier contract requires those row families and binds them to the
same contract digest consumed by implementation and tests.

- `derive_test_design_surface` produces the composite test plan carrier,
  including design-consumption rows, UAT testcase rows, testcase-authority rows,
  stack profile rows, test module/allocation rows, test component topology rows,
  test data bindings, expected-result bindings, UAT-to-integration bindings,
  and execution schedule rows;
- keep `derive_component_test_surface` as the test-source materialization
  boundary;
- keep `prepare_test_execution_surface` because declared framework/command
  execution is an external transition, not design prose;
- keep `derive_test_execution_result_surface`,
  `qualify_component_test_execution_surface`,
  `derive_component_repair_schedule_surface`, and
  `derive_test_run_archive_surface` because they carry observed execution,
  verification, repair pressure, and archive proof.

### Proposed Optimized Full Overlay Shape

The optimized full overlay should be able to run this reduced high-level spine:

```text
derive_feature_decomp_surface
derive_design_surface
derive_scenario_surface
derive_implementation_design_surface
derive_component_code_surface
qualify_component_realization_surface
derive_code_surface
derive_test_design_surface
derive_component_test_surface
prepare_test_execution_surface
derive_test_execution_result_surface
qualify_component_test_execution_surface
derive_component_repair_schedule_surface
derive_test_run_archive_surface
derive_release_depth_parity_surface
prepare_release_surface
```

If `derive_code_surface` proves to be only an aggregate alias over
`component_code_surface` for a given product shape, the overlay may collapse it
into code/materialization rows. If it owns release package composition across
multiple components, it remains first-class.

### Contract And Test Implications

This consolidation is a graph reprice, not a parser tweak. Implementation must
move design, code, edge, and tests together:

- graph catalog inputs/outputs must stop treating demoted planning rows as
  independent target nodes in the optimized full overlay;
- edge assurance rows for demoted planning stages must either be removed from
  the optimized overlay or replaced with deterministic row-validation contracts;
- target carrier contracts for the composite implementation and test plan
  carriers must list the required subcarrier row refs and fixed identity fields;
- handoff projection must show the worker the composite carrier contract rather
  than a chain of small independent surface contracts;
- T-168 tests must assert continuation from `derive_code_surface` to
  `derive_test_design_surface` as the composite test-plan boundary;
- tests must assert stable row refs inside the composite test carrier rather
  than independent small-stage graph nodes;
- live proof must show that fewer worker turns still produce the same
  co-affirmation rows, execution evidence, verification rows, release-depth
  parity, and residual pressure behavior.

### Non-Consolidation Boundaries

Do not collapse these surfaces without a separate method-level reprice:

- requirements, design, and scenario authority;
- implementation materialization;
- component realization qualification;
- test-source materialization;
- declared command/framework execution;
- observed execution result admission;
- expected-vs-observed verification;
- repair pressure;
- test archive;
- release-depth parity and release readiness.

The target carrier contract can optimize away redundant small computations. It
must not hide external execution, proof, replay identity, or co-affirmation
inside one opaque worker answer.

## Work Sequence

### L0 - Requirement Reprice

Add or update SDLC requirements to state:

- close-capable SDLC vector outputs require effective GTL target carrier
  contracts
- SDLC may provide product-specific target carrier contracts through graph
  declarations
- generic ABI defaults are visible config-backed defaults, not hidden code
  defaults
- edge closure requires target carrier admission for output-bearing vectors
- query-domain/gaps expose target carrier identity and rejection diagnostics
- tests derive positive and negative carrier cases from the same contract
  assets as implementation

### L1 - Design Reframe

Create or update the TypeScript target-carrier design module:

- structural carrier diagram
- declaration sites and precedence
- relationship to edge assurance rows
- relationship to T-168 test pipeline assets
- handoff projection model
- worker result admission model
- replay/archive model
- negative case generation model
- installed product config and archive expectations

### L2 - Substrate Binding

Verify odd_sdlc.TS is consuming an ABI TypeScript substrate that contains
T-133:

- `gtl.target_carrier_contract` declarations
- target carrier defaults config
- `resolveTargetCarrierContractBinding`
- `targetCarrierContractDeclarationForTarget`
- `validateTargetCarrierCandidate`
- target carrier admission projection and closure guard

If these exports are missing or unstable, the ticket blocks on an ABI substrate
upgrade rather than reimplementing the substrate locally.

### L3 - Graph Declaration

Bind SDLC graph vectors to target carrier contracts:

- add product-specific rows where needed
- emit `gtl.target_carrier_contract` declarations in graph-vector declarations
- expose graph/catalog diagnostics for missing or duplicate rows
- digest target carrier rows with a stable normalized strategy
- ensure every close-capable vector has an effective carrier binding

### L4 - Handoff Projection

Make worker handoffs consume the selected target carrier contract:

- include contract ref and digest
- include output carrier kind
- include nested payload path
- list required fields
- list fixed protocol fields
- list worker-fillable fields
- include literal domain expectations
- archive the projected contract truth

### L5 - Result Admission

Make worker result and execution evidence admission validate target carriers:

- parse the returned carrier candidate
- validate via ABI target carrier binding
- reject malformed candidates with typed SDLC diagnostics
- record accepted target carrier contract ref and digest
- separate carrier-shape rejection from edge-semantic residual pressure

### L6 - Ledger, Closure, Query, And Replay

Carry target carrier identity through:

- admitted evidence
- edge fulfillment ledgers
- edge closure decisions
- next-action projections
- query-domain edge assurance read model
- gaps output
- run archive evidence
- replay reuse checks

Closure must fail closed when required target carrier admission is missing,
rejected, or digest-mismatched.

### L7 - Test Pipeline Binding

Wire target carrier contracts into T-168 surfaces:

- test design carrier
- test module carrier
- component test carrier
- UAT integration test carrier
- test data carrier
- test execution result carrier
- verification/result admission carrier

The same design carrier contracts must inform implementation and tests.

### L8 - Proof

Add focused deterministic proof:

- matrix completeness for target carriers
- vector-local target/schema mismatch rejection
- handoff projection includes selected carrier contract
- valid returned target carrier admits
- malformed returned target carrier rejects
- edge close blocks on rejected carrier
- query-domain/gaps surface contract identity and diagnostics
- T-168 test pipeline derives test carriers from design assets

Add live or live-equivalent proof:

- hello-world lane emits carrier refs/digests in handoff and closure evidence
- data_mapper lane preserves carrier refs/digests through component, test, and
  release-depth edges

## Functional Predicates

Effective carrier binding:

```text
effective_target_carrier(vector, sdlc_rows, abi_defaults) =
  vector-local SDLC product row
  else ABI visible generic default
  else reject
```

Vector admission:

```text
admit_sdlc_vector_output_contract(vector, row) iff
  row.graphVectorRef = vector.ref
  and row.targetNodeRef = vector.target.id
  and row.targetSchemaRef = vector.target.schema.ref
  and row.targetCarrierContractRef is non-empty
  and row.targetCarrierContractDigest = digest(normalize(row.binding))
```

Output admission:

```text
admit_sdlc_output_candidate(candidate, binding, selectedEdgeContract) iff
  validateTargetCarrierCandidate(candidate, binding) = admitted
  and candidate contract ref/digest match selected binding
  and admitted evidence is recorded under selected edge contract
```

Closure precondition:

```text
close_sdlc_edge(edgeDecision) iff
  target carrier admission status = admitted
  and edge gain contract admits evidence
  and residual pressure is clear
  and no required intermediate compound pressure remains
```

Replay reuse:

```text
reuse_prior_output_evidence(prior, current) iff
  prior.workspaceRef = current.workspaceRef
  and prior.graphVectorRef = current.graphVectorRef
  and prior.targetCarrierContractRef = current.targetCarrierContractRef
  and prior.targetCarrierContractDigest = current.targetCarrierContractDigest
  and prior.edgeAssuranceContractDigest = current.edgeAssuranceContractDigest
```

## Required Negative Cases

The proof must include these rejection cases:

- missing target carrier declaration and missing visible ABI default
- malformed vector-local declaration
- vector-local declaration points at the wrong target node
- vector-local declaration points at the wrong target schema
- returned candidate lacks nested payload path
- returned candidate has the wrong carrier kind literal
- returned candidate lacks a required field
- returned candidate mutates a fixed protocol field
- returned candidate carries a stale contract digest
- edge close tries to proceed after target carrier rejection
- replay tries to reuse prior evidence under a changed carrier digest
- test pipeline generates tests from produced code shape without target carrier
  contract input

## Acceptance Checklist

- [x] Requirement family added or updated for SDLC target carrier contracts.
- [x] TypeScript design module added or updated with structural carrier diagram.
- [x] Graph/function inventory reconciled with current catalog and T-168 names.
- [x] Full graph overlay reviewed for carrier-contract consolidation.
- [ ] Redundant implementation/test planning stages are either consolidated
      under composite carrier rows or split into a follow-up graph-reprice
      ticket before T-169 closure.
- [x] ABI T-133 substrate exports verified from the local dependency.
- [x] SDLC target carrier contract rows implemented.
- [x] Graph-vector declarations emit or resolve `gtl.target_carrier_contract`.
- [x] Edge assurance rows bind target carrier refs/digests where close-capable.
- [x] Handoff packages project selected target carrier contract truth.
- [x] Worker result admission validates target carrier candidates.
- [x] Ledgers and closure decisions record selected carrier contract identity.
- [x] Query-domain and gaps expose carrier identity and diagnostics.
- [x] Replay checks edge closure and fulfillment carrier identity drift.
- [x] T-168 graph outputs are covered by the target-carrier graph-vector matrix.
- [x] Positive and negative deterministic tests added.
- [x] `npm run lint:semantic` passes.
- [ ] `npm run lint:test-harness` passes.
- [x] `npm run test:t169` passes.
- [x] `npm run test:t164:edge-contract` passes.
- [x] `npm run test:t168` passes.
- [x] `npm run test:semantic` passes.
- [ ] Live or live-equivalent proof archives carrier refs/digests through
      handoff, admission, closure, query, and replay surfaces.

## Implementation Evidence

2026-05-15 deterministic implementation pass:

- `npm run lint:semantic` passed.
- `npm run test:t169` passed: 4 tests, 0 failures.
- `npm run test:t164:edge-contract` passed: 19 tests, 0 failures.
- `npm run test:t168` passed: 7 tests, 0 failures.
- `npm run test:semantic` passed: 582 tests, 0 failures.
- `git diff --check` passed.

The first full semantic run exposed two implementation defects that were fixed
before the passing run:

- ABG runner required visible GTL target-carrier defaults when invoked from the
  SDLC TypeScript package root. SDLC now carries
  `build_tenants/typescript/config/gtl.target-carrier-defaults.json` as visible
  source-package config instead of relying on a code fallback.
- The compact worker invocation package duplicated the full target-carrier
  projection and crossed the T-118 size bound. The full projection remains in
  the handoff manifest and traversal intent package; the compact package and
  worker brief carry the selected carrier ref/digest and reference the richer
  handoff surfaces.

`npm run lint:test-harness` is still unchecked because the package currently
does not define a `lint:test-harness` script.

## Closure Statement To Prove

T-169 closes when SDLC graph-vector outputs are no longer shape conventions.
They are admitted GTL target carrier contracts consumed by graph declarations,
handoff prompts, worker result admission, SDLC edge assurance, test-pipeline
asset generation, query/gaps read models, archives, and replay.

The boundary remains clean:

- ABI owns the generic target carrier contract machinery.
- SDLC owns product-specific output carrier meaning.
- Edge assurance owns SDLC gain and closure interpretation.
- Target carrier admission owns output shape satisfaction.
- Tests and implementation consume the same contract assets.
