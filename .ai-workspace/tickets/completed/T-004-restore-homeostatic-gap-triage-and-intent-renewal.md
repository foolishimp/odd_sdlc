# T-004 Restore Homeostatic Gap Triage And Intent Renewal

- id: T-004
- title: Restore homeostatic gap triage, lawful re-entry, and intent renewal on top of the stabilized runtime boundary
- type: feature
- status: completed
- goal: ambiguity-governance-and-traceability
- priority: critical
- created_at: 2026-04-13
- updated_at: 2026-04-16
- dependencies: B-001, T-002, B-002, T-003

## Triage

- intake: feature / operator direction / live proving feedback / architectural review
- lawful_change_class: behavioral_completion
- affected_boundary: odd_sdlc gap analysis, lawful route selection, constitutional repricing gates, and traversal-scoped recovery products
- lawful_re_entry: odd_sdlc runtime analysis, gap triage, routing policy, and proof fixtures
- downstream_proof_span: named test28.02 survivor fixtures, deterministic route-selection proofs, repricing-gate proofs, and live downstream proving after checkpoint

## Why This Ticket Exists

`odd_sdlc` now has a materially better substrate than it had before:

- explicit analysis publication under `.ai-workspace/runtime/`
- explicit workspace readiness and stale-analysis invalidation
- stricter source-repo versus governed-workspace boundary behavior
- stronger traceability and testcase-authority ingestion
- stateful iterator and realization-deepening builder law from `T-002`

But `gaps()` is still mostly structural. It can tell us that an edge did not
close. It cannot yet lawfully answer the next question:

- what kind of mismatch is this
- which layer owns the mismatch
- where does lawful re-entry happen in the reverse path described by
  `SPEC_METHOD.md`
- is the next action fixed repair, deeper realization, reopened requirements,
  goal repricing, or a dynamic family such as discovery or PoC

That missing layer is what caused the current live evidence to feel one edge
late. Deterministic gates stopped bad work, which is good, but the system still
lacks a first-class triage product that turns failure evidence into lawful next
intent.

This ticket restores that homeostatic reverse path:

`current surface -> observed mismatch -> semantic triage -> lawful re-entry -> renewed forward derivation`

## Baseline Before T-004 Implementation

This ticket is not starting from zero. The following substrate is already the
baseline in whole or in part and must not be silently weakened:

- workspace state is published at
  `.ai-workspace/runtime/odd_sdlc-workspace-state.json`
- runtime start is gated on explicit published analysis readiness
- published analysis becomes stale when declared input surfaces change
- source-domain helper trees do not override the declared selected root unless
  the workspace is explicitly the real source-domain repo
- deterministic F_D gates remain authoritative and continue to stop malformed
  work before false convergence accumulates

Where these behaviors are already implemented, T-004 must preserve them. Where
they are only partially crystallized, Slice 1 must finish and prove them
without re-coupling runtime mutation, analysis refresh, topology recovery, and
route selection back into one ambient path.

## Design Position

T-004 adopts a closed-law / open-extension shape.

Closed law:

- workspace mode vocabulary
- analysis freshness law
- triage artifact law
- deterministic evidence minimums
- constitutional repricing gate
- retry and fallback law
- deterministic route binding

Open extension:

- `extensions {}` in triage artifacts
- additional shallow-pattern classifiers
- new dynamic candidate families declared through existing GTL/ABG machinery
- operator priority overrides in constraints

The builder is free to extend declared surfaces. It is not free to cross the
runtime contract boundary.

## Total-Function Boundary

T-004 applies a total-function lens to the process state machine, not to the
asset-under-construction itself.

The outer framework must be total:

```text
process_step(
  workspace_mode,
  process_state,
  observation_bundle,
  analysis_manifest,
  domain_registry,
  graphfunction_registry,
  policy_bundle,
) -> process_outcome
```

`process_outcome.kind` is a closed set:

- `converged`
- `advance_fixed_vector`
- `advance_dynamic_family`
- `propose_constitutional_reprice`
- `await_fh_resolution`
- `suppressed_by_mode`
- `blocked_stale_analysis`
- `blocked_missing_capability`
- `dependency_gap`
- `unclassified_gap`
- `no_lawful_route`

Unknown is not silence. Unknown is a named outcome.

Inside that closed shell, the framework remains open through:

- domain gap taxonomy and evidence refinements
- domain fixed-vector mappings
- future graphfunction families declared through the registry
- operator policy overrides

Extension boundaries are separate:

- `domain_registry` extends:
  - gap kinds
  - evidence collectors
  - `(framework_layer, framework_condition)` refinements
  - fixed-vector mappings
- `graphfunction_registry` extends:
  - dynamic-family resolution only
  - future graphfunctions
  - priorities, applicability filters, and capability requirements

Dynamic routing is itself a second total function:

```text
resolve_dynamic_route(
  dynamic_family,
  normalized_gap,
  workspace_mode,
  capabilities,
  graphfunction_registry,
  policy_bundle,
) -> route_outcome
```

`route_outcome.kind` is a closed set:

- `selected_graphfunction`
- `no_lawful_route`
- `suppressed_by_mode`
- `blocked_missing_capability`

This is the formal "else condition" for the process. No branch may fall
through into implicit repair, silent retry, or undefined state.

## Homeostatic Event Chain

T-004 adopts an explicitly homeostatic event chain. The runtime must not
collapse sensing, appraisal, and action selection into one opaque step.

The lawful sequence is:

`observation -> triage -> route -> repricing`

### 1. Observation Event

An observation event is the disturbance signal.

This is produced when the system detects a meaningful departure from expected
closure or expected readiness, for example:

- deterministic evaluator failure
- malformed generated-asset contract
- unresolved ambiguity
- stale analysis
- missing capability
- shallow existing realization

The observation event is the closest runtime analogue to homeostatic sensing or
interoceptive disturbance.

Observation is also the primary future telemetry hook.

That means:

- observation must be emitted even when triage does not yet run
- observation must survive retries, gating, and unresolved routing states
- observation must be queryable independently of triage success
- future telemetry and operator-facing analytics should key off observation
  streams rather than reconstructing salience only from later route or closure
  artifacts

At minimum an observation event must be durable enough to answer:

- what changed
- where it was detected
- which edge or boundary was affected
- which published-analysis fingerprint was current at the time
- whether the disturbance later converged, rerouted, gated, or escalated

### 2. Triage Event

A triage event is structured appraisal.

It transforms the observation into:

- `framework_layer`
- `framework_condition`
- `gap_kind`
- `reentry_layer`
- evidence and policy context

This is the salience-forming step. It is not yet route binding and not yet
constitutional repricing.

### 3. Route Event

A route event is lawful action selection.

It binds the triage result into one of:

- fixed-vector advance
- dynamic-family advance
- gated or suppressed state
- explicit unresolved route state

This is where action selection happens. It must remain distinct from triage so
the system can explain not only what is wrong, but why a particular next move
was selected or blocked.

### 4. Constitutional Event

A constitutional event exists only when the lawful re-entry point is above the
current design or realization layer.

This is not ordinary repair. It is allostatic repricing:

- proposed goal change
- proposed intent change
- F_H approval or rejection

This layer must remain explicitly gated.

### 5. Correlation Law

These events must be durable and correlated. The runtime must be able to query
the chain for a given traversal edge.

At minimum, the chain must remain joinable by:

- `run_id`
- `edge_id`
- `observation_id`
- `triage_id`
- `route_id`

There must be no silent jump from observation straight to code repair and no
silent jump from triage straight to constitutional write.

## Observation Telemetry Contract

Because observation is the primary telemetry hook, the runtime must preserve an
observation stream that remains useful even before higher-order triage is fully
implemented.

Minimum observation payload:

- `observation_id`
- `run_id`
- `edge_id`
- `analysis_fingerprint`
- `detected_at`
- `detected_by`
- `observed_boundary`
- `observed_signal`
- `evidence[]`
- `extensions {}`

The observation contract is intentionally generic. Domain-specific triage may
later refine the meaning, but the telemetry stream must remain stable enough to
support:

- live operator inspection
- replay and historical comparison
- future alerting and anomaly detection
- future dashboards over failure pressure, stale-analysis pressure, and
  unresolved-route pressure

This telemetry stream must not depend on successful F_P triage.

## Existing Runtime Hook

The substrate hook already exists in ABG and must be reused rather than
shadowed:

- append-only correlated events through `emit()` and `EventStream`
- continuation lifecycle
- policy bundle resolution
- candidate-family selection
- graphfunction routing and child-lineage opening
- explicit routed-selection provenance through `workflow_selected`
- explicit approval and revocation events for F_H decisions

The important boundary is:

- ABG owns the event substrate, causation/correlation fields, continuation
  truth, deterministic selection application, and approval plumbing
- `odd_sdlc` owns the semantic domain model layered on top of that substrate:
  `observation`, `triage`, `route`, and constitutional repricing semantics

So T-004 must add domain events and domain projections on top of ABG event
truth. It must not introduce:

- a second event store
- a second continuation store
- a second route-selection mechanism
- an approval path outside ABG `approved` / `revoked` event truth

T-004 is therefore domain wiring, not a new orchestration stack. `odd_sdlc`
must emit lawful triage products and lawful next vectors that bind into the
existing continuation and candidate-family machinery.

The minimum preserved hook set is:

- `emit()` / `EventStream` as the only lawful event write path
- ABG event causation and correlation fields as the join key substrate
- `continuation_opened` / `continuation_resolved` / related continuation truth
- `workflow_selected` as the lawful routed-selection provenance event
- `approved` / `revoked` as the lawful approval boundary for gated human review

ABG event truth in this design is the real coordination substrate for an
event-driven, saga-shaped runtime, and also the forensic/divergence substrate.

That means:

- events drive continuation, routing, approvals, and future distributed
  coordination
- events remain the durable causation and correlation record
- events support replay, audit, divergence analysis, and historical comparison
- triage artifacts may still be the operational domain read model for current
  queries
- the ticket does not require classical deterministic replay equivalence of F_P
  semantic outputs

So the law is:

- no second event substrate
- no second continuation substrate
- no second approval substrate
- but domain triage artifacts are allowed as live operational read models so
  long as they remain correlated to ABG event truth and do not silently diverge
  from it

## Event-Driven Stance

`odd_sdlc` remains event-driven.

Events are not only history. They are the real process drivers in the
event-calculus / saga-pattern sense:

- continuation state advances through events
- route selection and route application are recorded through events
- approval and rejection are event-driven state changes
- future distributed coordination should compose through the same event truth

In an F_P-bearing system, however, event sourcing is not a claim of classical
deterministic replay equivalence for semantic judgments.

That means:

- the live triage artifact is authoritative for current queries
- the event stream is authoritative for:
  - what drove the process
  - what was decided
  - by whom
  - with what evidence
  - when reruns disagreed
- F_P non-determinism is expected
- divergence is first-class information, not automatically a bug

So T-004 does not require:

- deterministic reconstruction of current F_P semantic state only by replay
- rollback of prior triage as a primitive
- consensus or confidence thresholds as a mandatory v1 route gate

Instead it requires:

- event-driven process coordination through the ABG substrate
- durable current triage state for operational queries
- durable event history for forensic analysis and divergence tracking
- explicit divergence reporting when repeated triage at the same authority basis
  materially disagrees

## Runtime Law For Triage

### 1. Authority Separation

Three authorities must remain separate:

1. `workspace_state`
   - authoritative for workspace mode, selected root, declared root,
     readiness, and published-analysis identity
2. `analysis_manifest`
   - authoritative for published analysis artifact paths and the
     analysis-fingerprint they were built from
3. per-edge triage artifacts
   - authoritative for traversal-scoped semantic triage results only

`workspace_state` must not become the authority for per-edge triage payloads or
their schema evolution. Triage is traversal-scoped, not readiness-scoped.

### 2. Artifact Law

The runtime must publish and consume three distinct artifact classes:

- workspace state:
  - `.ai-workspace/runtime/odd_sdlc-workspace-state.json`
- analysis manifest:
  - `.ai-workspace/runtime/odd_sdlc-analysis-manifest.json`
- per-edge triage artifact:
  - `.ai-workspace/runtime/triage/<edge_id>.json`

`workspace_state` may point to the active analysis manifest. It must not inline
triage results. The analysis manifest may enumerate current published analysis
artifacts. The triage artifact is the current live read model for that edge and
must carry its own `run_id`, `analysis_fingerprint`, `triage_id`, and
`triage_hash`.

Current-state law:

- there is at most one current live triage projection per `edge_id` in the
  workspace
- overlapping or repeated runs may compete to update that current projection
- the current artifact must therefore carry the winning `run_id`,
  `analysis_fingerprint`, `triage_id`, and `triage_hash`
- historical per-run distinction remains in the event stream, not in multiple
  current artifact files

Artifact law for this ticket is:

- event truth is the durable event-driven coordination substrate and forensic
  substrate
- triage artifacts are the latest operational read models
- query surfaces may read the live artifact directly for current domain state
- historical supersession and divergence remain queryable through event
  correlation rather than requiring historical artifact filenames

### 2a. Divergence Law

When a new triage is produced for the same `(edge_id, analysis_fingerprint)`
tuple:

- if the normalized triage payload hash matches the current artifact hash, the
  runtime may treat it as equivalent and avoid meaningless route churn
- if the normalized triage payload hash differs, the runtime emits a
  `triage_divergence` event referencing both the previous and current hashes
- the newer triage becomes authoritative for current routing and query surfaces

Divergence is informational. It is not automatically failure.

### 2b. Analysis Manifest Schema

The analysis manifest must carry at least:

- `manifest_kind`
- `schema_version`
- `workspace_mode`
- `selected_root`
- `declared_root`
- `analysis_fingerprint`
- `published_artifacts[]`
- `source_inputs[]`

`published_artifacts[]` entries must carry:

- `artifact_kind`
- `path`
- `fingerprint`
- `last_written`

`source_inputs[]` entries must carry:

- `input_kind`
- `path`
- `fingerprint`

This is the minimal schema needed to explain what published analysis exists,
which declared inputs it was built from, and which selected root it is
describing.

### 3. Freshness Law

Published analysis is fresh only when its fingerprint matches all declared
inputs that can change ambiguity or closure truth.

At minimum the `analysis_fingerprint` must include:

- `.ai-workspace/context/project_constraints.yml`
- `.odd_sdlc/release/genesis.yml` when present
- `specification/INTENT.md`
- `specification/PRODUCT.md`
- `specification/GOALS.md`
- all requirement surfaces under `specification/requirements/**/*.md`
- testcase-authority and scenario surfaces under
  `specification/scenarios/**/*.md`
- implementation-planning and planned-test surfaces under the active tenant
  design and test roots
- realized code and test files under the active selected root that carry
  requirement or testcase trace tags

No published ambiguity register, closure register, prompt context, or triage
artifact may be served as current truth against a mismatched
`analysis_fingerprint`.

Operational implication:

- authority-surface edits and trace-tagged code/test edits will stale published
  analysis frequently
- explicit `refresh-analysis` discipline is therefore part of normal operation
- auto-refresh-on-edit hooks are out of scope for this ticket

### 4. Mode Law

The canonical traversable workspace modes are:

- `source_domain_repo`
- `installed_target`
- `governed_workspace`

`unclassified_workspace` is not a lawful traversal mode. It is a readiness
failure.

`test_sandbox` is not a fourth workspace mode. Sandbox behavior is a governed
workspace policy profile or fixture class, not a different ontology.

Identity law:

- `installed_target`
  - marked by `.odd_sdlc/release/genesis.yml`
- `source_domain_repo`
  - marked by the real `odd_sdlc` source-repo structure
- `governed_workspace`
  - marked by the presence of `.ai-workspace/context/project_constraints.yml`
    while not satisfying `installed_target` or `source_domain_repo`

### 5. Deterministic Truth Boundary

T-004 does not replace or weaken deterministic F_D and asset-contract gates.

Instead:

- deterministic truth closes first wherever possible
- triage consumes deterministic evidence and failed-evaluator output
- triage may classify, route, or reprice
- triage may not overrule a deterministic failure into success

### 5a. Framework-First Classification Law

The framework classifies generic process conditions first, domain meaning
second.

Closed framework layer set:

- `intent`
- `goals`
- `product`
- `requirements`
- `design`
- `code`
- `test`
- `execution`
- `ambiguity`
- `capability`
- `routing`
- `analysis`

Closed framework condition set:

- `complete`
- `missing`
- `shallow`
- `contradictory`
- `unproven`
- `blocked`
- `stale`
- `unroutable`
- `insufficient`

The framework totalizes over `(framework_layer, framework_condition)` first.
The domain then refines that result with richer `gap_kind`, evidence, and
vector semantics.

Only declared meaningful pairs must produce specific domain triage. Any
undeclared, semantically void, or unsupported `(framework_layer,
framework_condition)` pair defaults to `unclassified_gap`.

Examples:

- `(code, shallow)` -> `advance_fixed_vector`
- `(requirements, insufficient)` -> `propose_constitutional_reprice` or
  `advance_fixed_vector` depending on policy
- `(analysis, stale)` -> `blocked_stale_analysis`
- `(routing, unroutable)` -> `no_lawful_route`
- `(capability, blocked)` -> `blocked_missing_capability`
- F_P triage exhaustion -> `dependency_gap`

### 5b. Scope Law

Triage does not run on every edge by default.

Default scope:

- edges with unresolved deterministic evaluators
- edges explicitly surfaced by `gaps()`
- edges reopened by continuation, repricing, or explicit operator request

Default non-scope:

- edges that passed deterministically and are already converged
- edges outside the active frontier unless explicitly queried

This keeps the framework generic-first and bounded. Domain-specific expansions
may widen scope deliberately through policy or explicit query surfaces.

### 6. Constitutional Repricing Gate

Constitutional repricing means proposed writes to `GOALS.md` or `INTENT.md`.

That path requires two gates:

1. workspace-mode policy gate
2. explicit F_H approval

The governed-workspace branch must be explicit through:

- `policy_bundle.constitutional_repricing.mode`

Closed values:

- `fh_gate`
- `suppress`

Mode law:

- `source_domain_repo` defaults to `fh_gate`
- `installed_target` defaults to `fh_gate`
- `governed_workspace` resolves through
  `policy_bundle.constitutional_repricing.mode`
- sandbox-style governed fixtures are not a separate workspace mode; they are
  governed workspaces with `constitutional_repricing.mode = suppress`
- missing `constitutional_repricing.mode` defaults to `fh_gate`
- malformed or unknown `constitutional_repricing.mode` is a readiness failure

Law:

- no code path may write `specification/GOALS.md` or `specification/INTENT.md`
  without a recorded approved constitutional-change event
- when `constitutional_repricing.mode = suppress`, triage may record the
  recommendation but write application remains suppressed
- in `source_domain_repo` and `installed_target`, traversal must stop in a
  gated state until the operator approves or rejects the proposal

Triage may propose constitutional repricing. It may not apply it silently.

Approval outcome law:

- `approve`
  - apply the proposed constitutional change
- `approve_with_edits`
  - apply the operator-edited constitutional change while preserving the
    original proposal in history
- `reject`
  - keep the current constitution and record the rejection rationale
- `defer`
  - keep the proposal pending across traversals
  - apply no constitutional write
  - keep the affected constitutional path blocked or explicitly deferred until
    approved, rejected, or superseded

### 7. Retry And Fallback Law

F_P triage is fallible, but "no result" is not lawful runtime state.

Law:

- every triage attempt must terminate as exactly one of:
  - `triage_produced`
  - `triage_failed_fallback_dependency_gap`
  - `triage_gated`
- default retry budget: three attempts with deterministic backoff policy
- failure classes must be recorded (`timeout`, `schema_invalid`,
  `transport_error`, `empty_response`, `policy_rejected`)
- after retry exhaustion, the system emits a first-class `dependency_gap`
  triage result rather than hanging or silently resuming breadth-first work

### 7a. Stability And Supersession Law

Triage is F_P reasoning and is therefore probabilistic.

This ticket does not require perfect reproducibility. It requires bounded,
addressable, and supersedable decisions.

Law:

- the actionable current triage result is carried by the live per-edge artifact
  and identified by `triage_id`, `analysis_fingerprint`, and `triage_hash`
- retries are schema-validated and bounded
- later triage for the same `(edge_id, analysis_fingerprint)` may supersede an
  earlier result without erasing its forensic event trail
- unchanged normalized triage should not create meaningless new route work
- materially changed normalized triage at the same authority basis must emit a
  divergence signal

Future confidence, consensus, or multi-agent agreement signals are lawful
extension fields under `extensions {}`. They are not required as a hard gate for
the first implementation cut.

There is no rollback primitive for triage. Later traversal may produce a new
triage and let the newer result win for current routing.

### 7b. Resumption Law

Blocked or gated states must declare their re-entry trigger explicitly.

- `blocked_stale_analysis`
  - re-enter on `analysis_published` for a newer valid `analysis_fingerprint`
- `blocked_missing_capability`
  - re-enter on capability declaration or runtime-capability change
- `await_fh_resolution`
  - re-enter on `approved` or `revoked`
- deferred constitutional proposals
  - remain pending until approved, rejected, or superseded

### 8. Routing Law

Triage output and route binding are separate.

For route-bearing outcomes, the domain emits a lawful route proposal:

- fixed vectors:
  - `deepen_realization`
  - `repair_output_contract`
  - `realize_missing_tests`
  - `reopen_design`
  - `reopen_product`
  - `reopen_requirements`
  - `goal_reprice`
  - `intent_reprice`
- dynamic vector:
  - `dynamic_family`

Only `dynamic_family` is bound through candidate-family selection.

Deterministic selection algorithm:

1. filter by declared applicable `gap_kind`
2. filter by `reentry_layer`
3. filter by `workspace_mode` / policy profile
4. filter by capability contract
5. rank by declared priority
6. apply stable lexicographic tie-break

If zero lawful dynamic candidates remain, the route state is
`no_lawful_route`. It must not silently demote to code repair.

Edge-scoped route law:

- route selection remains edge-scoped by default
- when one edge triage carries multiple `asset_findings[]`, the route proposal
  may carry `target_assets[]`
- the route executes once for the edge unless a future graphfunction contract
  explicitly declares per-finding execution

### 8a. Deepen-Versus-Expand Enforcement Law

The distinction between deepening existing shallow realization and widening the
surface laterally is domain law, not ABG substrate law.

It must be carried on three surfaces:

- triage:
  - classifies shallow existing realization and may emit
    `deepening_preferred_over_expansion`
- routing:
  - prefers `deepen_realization` when shallow existing assets remain unresolved
- graphfunction applicability:
  - dynamic graphfunctions may declare that they are lawful only when no
    higher-priority deepening obligation is active

It is not enough to record the preference in triage and then allow lateral
expansion to satisfy the same gap silently.

### 9. Evidence Law

For shallow-realization and similar content-level findings, evidence must carry:

- `path`
- `excerpt`
- `evidence_role`
- `line_start` when available
- `line_end` when available

Exact line numbers alone are too brittle. Free-form prose alone is too weak.

The triage artifact must not claim completion against evidence such as:

- literal `???`
- trivial pass-through assignment
- hard-coded success

## Gap Triage Model

The closed core taxonomy is:

- `code_gap`
- `test_gap`
- `design_gap`
- `requirement_gap`
- `ambiguity_gap`
- `topology_gap`
- `dependency_gap`

The closed core taxonomy intentionally does not include `product_gap`,
`goal_gap`, `intent_gap`, `execution_gap`, or `capability_gap` as first-class
gap kinds.
Those are modeled through:

- `framework_layer`
- `framework_condition`
- `reentry_layer`
- `process_outcome_kind`

If a future domain cut needs them as first-class gap kinds, they must be added
deliberately through the extension surface rather than inferred implicitly.

Granularity law:

- the primary triage unit is the edge
- per-edge triage may carry nested `asset_findings[]` when the motivating
  evidence is asset-local
- route selection still occurs at the lawful edge/re-entry boundary, not by
  pretending every asset is its own graph edge

This preserves generic-first process structure while retaining enough resolution
to act on shallow module-level findings.

The core routing signal is `reentry_layer`, not a boolean constitutional flag.

Canonical `reentry_layer` values:

- `code`
- `test`
- `design`
- `requirements`
- `product`
- `goals`
- `intent`

Ambiguity or constitutional findings must still choose one lawful re-entry
layer. For example:

- unresolved downstream ambiguity in design evidence may re-enter at `design`
- constitutional insufficiency that cannot be solved beneath current goals may
  re-enter at `goals` or `intent`

Boolean `constitutional_insufficiency` may exist only as supporting detail or
extension data. It is not the main routing carrier.

## Triage Result Schema

Each per-edge triage artifact must carry at least:

- `observation_id`
- `triage_id`
- `run_id`
- `edge_id`
- `analysis_fingerprint`
- `triage_hash`
- `framework_layer`
- `framework_condition`
- `gap_kind`
- `reentry_layer`
- `process_outcome_kind`
- `authority_basis`
- `realized_basis`
- `asset_findings[]`
- `route_proposal`
- `constitutional_proposal`
- `evidence[]`
- `policy_gate`
- `route_binding`
- `extensions {}`

Expected semantics:

- `policy_gate`
  - `none`
  - `fh_approval_required`
  - `sandbox_suppressed`
  - `capability_blocked`
- `process_outcome_kind`
  - one of the closed `process_outcome.kind` values
- `authority_basis`
  - structured extract of the governing basis used for comparison
  - may draw from requirement, design, scenario, testcase-authority, or other
    declared authority surfaces
- `realized_basis`
  - structured extract of the realized basis used for comparison
  - may draw from code, tests, generated assets, manifests, or execution
    evidence
- `asset_findings[]`
  - optional per-asset nested findings for module-local or file-local evidence
  - each finding carries its own `path`, `excerpt`, `evidence_role`, and
    optional line data
- `route_proposal`
  - null for non-routing outcomes
  - present only when `process_outcome_kind` is
    `advance_fixed_vector` or `advance_dynamic_family`
  - carries:
    - `vector_kind`
      - `fixed`
      - `dynamic_family`
    - `fixed_vector`
      - present only when `vector_kind == fixed`
    - `dynamic_family`
      - present only when `vector_kind == dynamic_family`
    - `target_assets[]`
      - optional list of asset identifiers or paths when one edge route targets
        multiple specific findings
- `constitutional_proposal`
  - null unless `process_outcome_kind` is
    `propose_constitutional_reprice` or `await_fh_resolution`
  - carries proposed constitutional target, rationale, and evidence
- `route_binding`
  - null until route binding runs
  - then records:
    - `route_id`
    - `state`
    - `selected_graphfunction` or `no_lawful_route_reason`
    - `priority_source`
- `observation_id`
  - links the triage result back to the originating disturbance event

`extensions {}` is the lawful forward-extension surface for builder-specific
annotations, extra evidence classifiers, richer rationales, and future domain
gap kinds.

`authority_basis` and `realized_basis` are not raw unconstrained prose dumps.
They must be built from structured extracts of the relevant authority and
realized surfaces so different builders remain query-compatible even when the
semantic diff itself is F_P-mediated.

Ambiguity law:

- `ambiguity_gap` is primarily a pass-through envelope over existing ambiguity
  register truth
- triage may normalize that ambiguity into the common triage shape for uniform
  downstream routing
- triage must not silently invent a second independent ambiguity classification
  regime

Observation chain law:

- each disturbance detection produces a new `observation_id`
- repeated detection for the same edge at a later checkpoint may carry
  `prior_observation_id`
- later triage and route artifacts correlate to the current `observation_id`
  while preserving prior detections for divergence analysis

## Event Schemas

These are domain event payloads carried on the ABG event substrate.

### Observation Event

Minimum payload:

- `observation_id`
- `prior_observation_id` or null
- `run_id`
- `edge_id`
- `analysis_fingerprint`
- `detected_at`
- `detected_by`
- `observed_boundary`
- `observed_signal`
- `evidence[]`
- `extensions {}`

### Triage Event

Minimum payload:

- `triage_id`
- `observation_id`
- `run_id`
- `edge_id`
- `analysis_fingerprint`
- `triage_hash`
- `process_outcome_kind`
- `gap_kind`
- `reentry_layer`
- `policy_gate`
- `route_proposal`
- `constitutional_proposal`
- `evidence[]`
- `extensions {}`

### Route Event

Minimum payload:

- `route_id`
- `triage_id`
- `observation_id`
- `run_id`
- `edge_id`
- `analysis_fingerprint`
- `route_state`
- `selected_graphfunction` or `no_lawful_route_reason`
- `priority_source`
- `target_assets[]`
- `extensions {}`

### Constitutional Event

Minimum payload:

- `proposal_id`
- `triage_id`
- `run_id`
- `edge_id`
- `analysis_fingerprint`
- `constitutional_target`
- `approval_outcome`
- `proposed_diff`
- `operator_diff` or null
- `rationale`
- `extensions {}`

## Task Slices

### Slice 1. Substrate And Freshness

- [x] Add `odd_sdlc-analysis-manifest.json` as a separate published artifact.
- [x] Move published-analysis artifact pointers out of `workspace_state` and
  into the analysis manifest, leaving `workspace_state` focused on readiness,
  mode, selected root, and published-analysis identity.
- [x] Publish one live per-edge triage artifact under
  `.ai-workspace/runtime/triage/<edge_id>.json`.
- [x] Reuse ABG event truth rather than adding a second event or continuation
  store for observation, triage, route, or repricing state.
- [x] Codify the freshness law against declared input surfaces and require
  `analysis_fingerprint` match before any published analysis or triage result is
  treated as current truth.
- [x] Prove that source-domain helper trees cannot override the declared
  selected root unless `workspace_mode == source_domain_repo`.

### Slice 2. Per-Edge Triage

- [x] Define the closed `process_outcome.kind` and `route_outcome.kind` sets.
- [x] Define the generic `framework_layer` and `framework_condition` model.
- [x] Define the closed core gap taxonomy and `reentry_layer` model.
- [x] Define `unclassified_gap` as the default outcome for undeclared or
  semantically void `(framework_layer, framework_condition)` pairs.
- [x] Emit durable observation events before triage and keep them correlated to
  triage artifacts by `observation_id`.
- [x] Publish observation events in a stable telemetry shape that remains
  queryable even when triage fails, is gated, or is not yet implemented for a
  given disturbance class.
- [x] Implement triage result publication for failed or incomplete edges using
  deterministic evaluator output plus semantic evidence.
- [x] Emit `triage_divergence` when repeated triage for the same
  `(edge_id, analysis_fingerprint)` materially disagrees with the current
  artifact.
- [x] Ensure triage consumes deterministic truth rather than replacing it.
- [x] Define `authority_basis`, `realized_basis`, and `asset_findings[]` as
  structured comparison surfaces rather than unconstrained prose fields.
- [x] Add evidence extraction for shallow-realization patterns with durable
  `path`, `excerpt`, and line data when available.
- [x] Emit `dependency_gap` when F_P triage exhausts its retry budget.
- [x] Make ambiguity-gap handling an explicit pass-through envelope over the
  existing ambiguity register.
- [x] Define observation, triage, route, and constitutional event schemas as
  first-class domain payloads on the ABG event substrate.

### Slice 3. Routing And Repricing

- [x] Separate fixed vectors from dynamic-family route binding.
- [x] Emit route events as first-class correlated artifacts rather than
  implicit side effects of triage.
- [x] Bind `dynamic_family` through existing candidate-family machinery rather
  than new shadow routing code.
- [x] Reuse ABG `workflow_selected` provenance and ABG continuation truth
  rather than inventing a parallel routing or child-lineage model.
- [x] Make route selection deterministic and queryable.
- [x] Add constitutional repricing proposals with mode gate and F_H approval
  requirements.
- [x] Materialize governed-workspace constitutional policy through
  `policy_bundle.constitutional_repricing.mode` rather than fixture-name
  inference.
- [x] Define fail-closed/default behavior for missing or malformed
  `constitutional_repricing.mode`.
- [x] Reuse ABG `approved` / `revoked` events for constitutional approval state
  rather than introducing a second approval channel.
- [x] Define constitutional approval outcomes:
  - `approve`
  - `approve_with_edits`
  - `reject`
  - `defer`
- [x] Keep zero-candidate dynamic routing as `no_lawful_route`, not silent
  fallback to repair.
- [x] Define traversal budget rules for triage scope, caching, and overrun
  fallback.
- [x] Define blocked-state resumption triggers and deferred constitutional
  proposal semantics explicitly.

### Slice 4a. Convergence And Budget Guarantees

- [x] Bound triage attempts per edge per traversal.
- [x] Bound active constitutional repricing proposals per constitutional target
  per run.
- [x] Suppress no-op supersession when normalized triage has not materially
  changed.
- [x] Define cache reuse for the current triage artifact at the same
  `analysis_fingerprint`.

### Slice 4. Proof Fixtures

- [x] Add named shallow-realization fixtures from the `test28.02` survivor set.
- [x] Place the survivor fixture at
  `build_tenants/python/test_env/fixtures/test28_pass2_replay/`.
- [x] Add deterministic route-selection proofs over multiple matching dynamic
  candidates.
- [x] Add repricing-gate proofs for governed fixture and live installed/source
  modes.
- [x] Add stale-analysis and selected-root boundary proofs as explicit
  regression fixtures.
- [x] Re-run live downstream proving after checkpoint on the stabilized
  substrate.

## Proof Required

The proof bar for this ticket is the named behavior, not just generic categories.

Required acceptance tests:

1. `JobSubmitter.submit()` still `???`
   - triage kind: `code_gap`
   - re-entry: `code`
   - vector: `deepen_realization`
   - evidence includes file path, literal excerpt, and line data
2. `SparkMorphismExecutor` still `val output = input`
   - triage kind: `code_gap`
   - re-entry: `code`
   - vector: `deepen_realization`
   - evidence classifies trivial pass-through
3. `Reconciler.isConsistent` hard-codes `true`
   - triage kind: `code_gap`
   - re-entry: `code`
   - vector: `deepen_realization`
   - evidence classifies hard-coded success
4. Lateral-only second-pass expansion regression
   - triage kind: `topology_gap`
   - re-entry: `code` or `design` as lawful
   - vector prefers deepening existing shallow realization over lateral
     expansion
5. Unresolved major ambiguity
   - triage kind: `ambiguity_gap`
   - re-entry is explicit
   - policy escalation remains visible
6. Requirement missing from current requirement surface
   - triage kind: `requirement_gap`
   - re-entry: `requirements`
   - vector: `reopen_requirements`
7. Constitutional insufficiency under governed workspace with
   `constitutional_repricing.mode = suppress`
   - proposal recorded
   - no constitutional file write occurs
   - route remains gated or suppressed lawfully
8. Constitutional insufficiency under `installed_target`
   - traversal blocks pending F_H approval
   - no silent write occurs
9. F_P triage failure
   - three failed attempts are recorded
   - final triage result is `dependency_gap`
10. Deterministic selection across two matching dynamic candidates
    - same inputs always yield the same selected graphfunction
11. Zero-candidate dynamic route
    - process outcome is `no_lawful_route`
    - there is no silent demotion to repair
12. Unknown or unmapped process condition
    - process outcome is `unclassified_gap`
    - there is no silent pass-through
13. Published analysis becomes stale when any declared input surface changes
    - stale analysis is not served as current truth
14. Source-domain helper trees never override the selected root unless
    `workspace_mode == source_domain_repo`
15. Homeostatic chain correlation
    - a given failed edge yields a durable `observation -> triage -> route`
      chain
    - constitutional repricing, when present, is a separate gated continuation
      rather than an inlined route side effect
16. Observation telemetry survivability
    - observation remains queryable even when triage fails, routing is blocked,
      or repricing is gated
    - later stages enrich or correlate the observation rather than replacing it
17. ABG hook preservation
    - observation, triage, route, and repricing state are carried on ABG event
      truth
    - there is no second event store, second continuation store, or second
      approval channel
    - dynamic route binding still resolves through ABG candidate-family and
      selection machinery
18. Edge-local triage with asset-local findings
    - one edge triage may carry multiple `asset_findings[]`
    - shallow module findings remain individually evidenced without pretending
      each module is its own graph edge
19. Ambiguity pass-through
    - `ambiguity_gap` wraps existing ambiguity-register truth rather than
      inventing a second ambiguity classifier
20. Triage scope and cache reuse
    - triage does not run on already-converged deterministic edges by default
    - current triage may be reused at the same `analysis_fingerprint`
21. Divergence reporting
    - repeated triage at the same `(edge_id, analysis_fingerprint)` with a
      changed normalized payload emits `triage_divergence`
    - the new triage becomes authoritative for current routing
    - prior triage remains visible through the forensic event trail

## Acceptance

- `odd_sdlc` produces a durable, queryable semantic triage artifact rather than
  only structural gap output
- the runtime preserves the homeostatic chain of `observation -> triage ->
  route -> repricing` rather than collapsing them into one opaque step
- observation is preserved as a first-class telemetry stream, not merely an
  internal precursor to triage
- ABG remains the sole event, continuation, selection, and approval substrate;
  T-004 adds domain semantics on top rather than parallel orchestration beneath
- the runtime remains event-driven in the saga/event-calculus sense while
  explicitly rejecting classical deterministic replay equivalence for F_P
  semantics
- lawful re-entry is explicit and anchored to the reverse path in
  `SPEC_METHOD.md`
- the framework is total at the process-outcome boundary while remaining open
  in domain gap taxonomy and graphfunction registry
- analysis publication, semantic triage, and route binding are separate
  authorities
- deterministic truth gates remain authoritative
- fixed vectors and dynamic route binding are not conflated
- constitutional repricing cannot happen silently
- no-candidate dynamic routing remains explicit unresolved state
- shallow-realization findings are backed by durable evidence, not prose alone
- source-domain behavior and governed target behavior do not collapse

## Deferred Scope

This ticket does not silently absorb the broader odd_service remote-client and
consensus product-line debt. That work remains explicitly tracked in `B-004`.

## Completion Notes

- `triage.py` now publishes a durable per-edge homeostatic chain over
  observation, semantic triage, route binding, and constitutional proposal
  state without introducing a second event or continuation substrate.
- semantic triage is now bounded, cache-aware, analysis-freshness aware, and
  divergence-aware; repeated materially changed triage emits
  `triage_divergence`.
- shallow-realization evidence is structured and durable, including path,
  excerpt, and line data from the survivor fixtures.
- the route layer now distinguishes fixed-vector repair from declared
  dynamic-family selection and records zero-candidate dynamic routing as an
  explicit `no_lawful_route` state.
- constitutional repricing remains explicit and gated through policy plus ABG
  approval/revocation truth rather than ambient file edits.
- focused proof is green:
  - `python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py -q`

## Links

- parent: `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/completed/B-001-refactor-odd-method-to-released-abg-boundary.md`
- sibling: `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/completed/T-002-refactor-odd-sdlc-from-pure-function-builder-framing-to-stateful-iterator.md`
- sibling: `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/completed/B-002-emit-repair-usable-fd-evidence-from-odd-sdlc-evaluators.md`
- sibling: `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/completed/T-003-enforce-spec-method-structured-build-topology-for-project-tenants.md`
- deferred_scope: `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/active/B-004-track-odd-service-remote-client-and-consensus-scope-debt.md`
- strategy: `/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/codex/20260413T023750Z_STRATEGY_preserve-builder-direction-separate-runtime-boundaries.md`
- review: `/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/claude/20260413T150000_REVIEW_odd-sdlc-in-progress-refactor.md`
- review: `/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/claude/20260413T160000_REVIEW_T-004-axiomatic-boundaries-for-agentic-builder.md`
- review: `/Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/claude/20260413T170000_REVIEW_post-checkpoint-runtime-boundary-fixes.md`
- standard: `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`
- standard: `/Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md`
