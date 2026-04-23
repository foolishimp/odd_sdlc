---
id: B-040
title: Close half-typed public-start carrier family under Python typing and carrier-set law
type: bug
ticket_category: implementation_migration
migration_strategy: inside_out_hard_break
status: completed
goal: lawful-typed-public-start-carrier-family
change_intent: Rebind the odd_sdlc public-start interface family around one closed Python carrier set so the published gap dossier, public admission boundary, execution-contract projection, public iteration outcome, yielded continuation ingress, and query-domain projection stop carrying semantic dict[str, Any] / Mapping[str, Any] / Any at the load-bearing boundary.
change_class: design_reframe
re_entry_point: design_surface
affected_boundary: odd_sdlc public-start typing closure across build_tenants/python/code/odd_sdlc/gap_dossier.py, public_start.py, app.py, execution_contract.py, the direct query/start-target projection seam in query.py/query_contract.py/start_targeting.py, the odd_sdlc-owned ABG yielded continuation/result ingress boundary, the runtime serialization adapter that sits immediately outside those carriers, and the source/install/yield/static-typing proof lanes for the same slice
priority: high
triaged_at: 2026-04-23
created_at: 2026-04-23
updated_at: 2026-04-23
dependencies: B-035 completed; B-036 completed
intake_source: schema review at `.ai-workspace/comments/codex/20260422T171445Z_SCHEMA_typed-public-start-interface-touch-map.md`, strategy review at `.ai-workspace/comments/claude/20260423T020000Z_STRATEGY_half-typed-carriers-and-port-question.md`, method-tightening review at `.ai-workspace/comments/claude/20260423T030000Z_REVIEW_design-module-method-tightening.md`, and live source audit against `DESIGN_MODULE_METHOD.md` §§4A, 5A, 5B, 5C on the current odd_sdlc tree
target_truth: odd_sdlc carries the public-start family through one irreducible Python-native carrier set. The authoritative carriers are explicitly declared, semantic payloads are closed and typed at the public-start boundary, subordinate payloads remain subordinate unless they pass the Promotion Test, app/public_start stop reconstructing meaning from open dict payloads, the direct query/start-target projection republishes the same closed public-start law downstream, and odd_sdlc consumes ABG yielded/result truth through one typed ingress adapter. The bounded slice runs under a strict typing lane with no global import skip and no longer claims design completeness while semantic `dict[str, Any]`, `Mapping[str, Any]`, or `Any` remain at the named boundary.
superseded_truth: the current public-start family is typed at the envelope and still open at the payload. `gap_dossier.py`, `public_start.py`, `app.py`, `execution_contract.py`, and the direct query/start-target seam still exposed semantic `dict[str, Any]`, `Mapping[str, Any]`, and `Any`, while ABG yielded/result producers still entered odd_sdlc through open dict shapes. The slice therefore violated the current Python Typing Rule and kept a half-typed carrier family alive after B-035 and B-036.
closure_law: this migration closes only when the public-start family declares one irreducible architectural carrier set, the authoritative carriers and subordinate payloads are explicitly distinguished, the named source/admission/execution/yield/projection boundaries no longer use semantic `dict[str, Any]`, `Mapping[str, Any]`, or `Any`, one strict static typing lane runs clean over the bounded slice without a global `follow_imports = skip`, and source/install/yield proofs no longer rely on typed envelopes wrapped around open payload truth.
evaluation_criteria:
  - class design consolidates around the irreducible carrier set instead of mirroring every payload fragment as a peer top-level type
  - the ticket declares the irreducible architectural carrier set for the public-start boundary before introducing or promoting additional top-level types
  - every authoritative or persisted carrier in the bounded slice is closed and typed under `DESIGN_MODULE_METHOD.md` §4A rather than relying on semantic `dict[str, Any]`, `Mapping[str, Any]`, or `Any`
  - subordinate payloads are explicitly identified and remain private or nested unless they pass the Promotion Test under §5B
  - `gap_dossier.py` publishes and reloads a closed read model before semantic transforms begin
  - `public_start.py` exposes a closed admission family and a closed public iteration outcome family rather than `result: dict[str, Any]`
  - `execution_contract.py` no longer keeps a typed envelope around an open persisted payload
  - `app.py` consumes closed carriers at `_resolve_public_start_admission(...)`, `_resolve_public_next_iteration(...)`, and `_run_public_next_start(...)`; the effect shell stays last and does not decide semantic law procedurally
  - the direct query/start-target projection republishes the same closed public-start / gap-dossier / execution-contract truth and does not reintroduce open bags
  - odd_sdlc consumes ABG yielded/result truth through one explicit typed ingress boundary or an explicitly migrated upstream typed public contract
  - the bounded slice runs under one strict static typing proof lane and source/install tests are repriced to the closed carriers
non_closure_conditions:
  - any named authoritative boundary in this slice still exposes semantic `dict[str, Any]`, `Mapping[str, Any]`, `Any`, or open `.get(...)` interpretation chains
  - carrier proliferation is used to make typing easier without an explicit irreducible boundary or Promotion Test justification
  - the direct query/start-target projection or proof fixtures silently rebuild or reinterpret the same truth through raw dict payloads after the source slice is closed
  - odd_sdlc continues to consume raw ABG yielded/result dicts in multiple places instead of one typed ingress boundary
  - the strict typing lane is absent, disabled, or green only because the semantic center stayed open
  - closure is claimed from wrappers, adapters, or renamed carriers while the old open payload path remains authoritative in normal execution
proof_surface:
  - explicit source selector bundle over the named public-start family in `test_odd_sdlc_first_slice.py`
  - explicit installed selector bundle over the public-start / query readback surface in `test_odd_sdlc_installation.py`
  - yielded continuation / re-entry proof in `test_odd_sdlc_yield_usecase.py`
  - direct query/start-target projection proof over the same typed surfaces
  - one strict static typing lane for the bounded slice with explicit per-module out-of-scope skips committed in-repo
  - negative proof that the old half-typed path cannot still pass by normal execution
---

## Scope Decision

This ticket explicitly chooses the bounded Python-native closure path for the
current line.

It does **not** choose:

- a TypeScript port of the public-start slice
- a whole-codebase typing migration
- generic cleanup of unrelated odd_sdlc families

If a later port is chosen, it can treat the result of this ticket as source
material. It is not the target of this ticket.

## Overriding Evaluators

These evaluators are closure-gating for every change under B-040.

If a change improves `mypy` or local ergonomics but fails any evaluator below,
it does not count as real progress for this ticket.

### 1. Authority Seam Closure

Every changed line must reduce the number of truth surfaces.

For B-040, that means:

- one authoritative carrier at each semantic boundary
- no controller-side reconstruction
- no raw JSON or open dict being trusted past the ingress seam

### 2. Essential Carrier Consolidation

The refactor must collapse the slice down to the few real identity-bearing
carrier families.

For B-040, that means:

- keep only the essential public-start / gap-dossier / execution-contract
  carrier categories
- keep subordinate payloads subordinate
- do not create fragment classes just to satisfy typing

### 3. Typed Enforcement After Proof

Strong typing is there to lock in a seam that has already been made real.

For B-040, that means:

- parse or construct first
- narrow unions explicitly
- use typing to enforce the proved shape
- do not use `cast(...)`, `Any`, or dynamic dict mutation as fake closure

## Evaluator Gate

These are review probes, not aspirations. Any B-040 closure claim must answer
them positively.

### Authority Seam Closure probes

- [x] carrier-beside-carrier is retired:
      fields owned by the new carrier family are not still produced
      authoritatively elsewhere
- [x] controller-side reconstruction is retired:
      `app.py`, `public_start.py`, `gap_dossier.py`, `query.py`, and
      `execution_contract.py` do not reconstruct semantic truth from raw
      `.get(...)` chains except at a named parse boundary
- [x] proxy interfaces are retired:
      no function accepts both a closed carrier and `dict` / `Mapping` / `Any`
      as a normal semantic union
- [x] dual-read single-write fallback is retired:
      removing the new carrier path fails closed rather than silently falling
      back to the old open payload
- [x] round-trip-through-dict is not ceremonial:
      closed carriers are not used only as `from_dict(...).to_dict()` wrappers

### Essential Carrier Consolidation probes

- [x] every promoted top-level carrier answers the Promotion Test out loud
- [x] no fragment-class promotion exists only to appease the checker
- [x] no literal-splitting inflation creates empty peer classes where a
      literal/discriminant already carries the distinction
- [x] no single-use TypedDict or dataclass is promoted where nested/private
      payload detail would satisfy the same boundary cleanly
- [x] execution-contract, gap-dossier, public-start, and query surfaces remain
      the few identity-bearing carrier families in scope

### Typed Enforcement After Proof probes

- [x] no `cast(...)` remains at the semantic center; surviving casts are
      documented post-proof narrowing casts only
- [x] no ticket-local `# type: ignore` exists in the bounded semantic slice
- [x] `Any` does not survive at semantic signatures without a named foreign
      boundary adapter and justification
- [x] constructor-by-mutation is not used to fake closed TypedDict payloads
- [x] JSON / dict ingress always passes through a named parse / validate /
      normalize function before semantic use

## Class Design Consequence

The practical consequence of the updated design-method framing is:

- this ticket does **not** ask for one new top-level class per payload fragment
- this ticket does ask for one closed carrier family per real
  identity-bearing boundary

So the implementation target is consolidation, not proliferation.

The earlier schema post named a large number of candidate `TypedDict` and
dataclass shapes so the interface family could be inspected exhaustively. That
post remains useful as seam inventory. It is **not** the implementation target
as written.

Under the current method, the implementation target is:

1. declare the few real carrier families
2. decide which are authoritative and which are downstream
3. keep row fragments, branch-local field groups, and one-off record detail
   nested or private unless they pass the Promotion Test
4. close the boundary without inflating it

So for B-040, "strong typing" means:

- fewer sharper top-level carrier families
- more nested or private subordinate payloads
- no open semantic dicts
- no one-class-per-JSON-fragment typing spree

## Trace Boundary

This ticket reads current repo-law truth from:

- `specification/INTENT.md`
- `specification/PRODUCT.md`
- `specification/requirements/03-runtime-governance.md`
- `specification/requirements/08-odd-sdlc-first-slice.md`
- `specification/requirements/11-odd-sdlc-homeostatic-gap-triage-and-intent-renewal.md`
- `specification/requirements/12-declarative-operational-state-transitions.md`

This ticket reads current method-law truth from:

- `/Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md`

The ticket is therefore grounded in both:

- odd_sdlc's current public-start / runtime-governance / command-transition law
- the tightened method requirements for Python typing, irreducible carrier
  sets, promotion, and boundary inflation

## Design-Method Review Against New Requirements

This ticket is driven directly by the current tightened design method.

### §4A Python Typing Rule

Current tree defects in scope:

- `public_start.py` still uses `result: dict[str, Any]`, `Mapping[str, Any]`,
  and `dict[str, object]`
- `gap_dossier.py` still publishes and reloads semantic dict payloads through
  the read-model and start-gate boundary
- `execution_contract.py` still keeps `AdmittedExecutionContractProjection`
  around `payload: Mapping[str, Any]`
- `app.py` still holds mutable `result: dict[str, Any]` and returns tuples that
  mix typed envelopes with open payloads
- `query.py` still publishes the same family as `dict[str, Any]`

Under §4A, this is not design-complete typing. It is active design debt.

### §5A Irreducible Architectural Carrier Set Rule

This ticket adopts the following **Irreducible Architectural Carrier Set** for
the bounded public-start family:

1. **Published Gap Dossier Carrier**
   the authoritative public source truth for homeostatic head-gap / dossier
   state
2. **Public Start Admission Carrier**
   the admission boundary that consumes the published gap dossier truth and
   resolves admit / block / human-gate requirements
3. **Admitted Execution Contract Carrier**
   the persisted execution truth that binds the admitted start target
4. **Public Start Iteration Outcome Carrier**
   the public outcome family for traversal-applied / terminal / blocked /
   proof-hold / yielded / failure semantics
5. **Yielded Continuation Ingress Carrier**
   one odd_sdlc-owned typed ingress boundary for ABG yielded/result truth unless
   the upstream contract is explicitly closed in ABG first

Everything else in this slice is subordinate by default until it passes the
Promotion Test.

### §5B Promotion Test

The following kinds of shapes are only promoted to top-level types if they
carry independent authority, are persisted/public, are direct pattern-match
variants, or are reused across modules without semantic bleed:

- public outcome variants
- persisted execution target variants
- yielded continuation ingress variants

The following remain subordinate unless the implementation proves otherwise:

- private field groupings used once inside one module
- one-off row-detail fragments inside the dossier read model
- helper-only record fragments created just to reduce typing discomfort
- internal payload detail that never crosses a true public/persisted boundary

### §5C Boundary Inflation Prohibition

This ticket is not allowed to explode the slice into many peer classes just to
escape `dict[str, Any]`.

Closure requires:

- the irreducible carrier set stays explicit
- promoted carriers are justified
- deferred subordinate payloads are named as deferred rather than silently
  promoted

The direct consequence for this ticket is:

- if two candidate types differ only as small record variations inside one
  carrier family, they should usually collapse into subordinate payload detail
- if a shape exists only because an open dict felt uncomfortable, it should not
  become a peer type
- if a payload never carries independent authority, persistence, or direct
  pattern-match semantics, it should not be promoted just to satisfy a type
  checker

## Migration Declaration

- old_truth_path: the public-start family is half-typed. The outer branch names exist, but semantic payloads still cross the public source/admission/execution/outcome/query boundaries as `dict[str, Any]`, `Mapping[str, Any]`, and `Any`, and odd_sdlc still consumes ABG yielded/result truth through open dict shapes
- new_truth_path: the public-start family is closed around one explicitly declared irreducible Python carrier set; each authoritative boundary is typed and closed; subordinate payloads are kept subordinate unless promoted lawfully; and ABG yielded/result truth enters odd_sdlc through one typed ingress contract rather than many raw dict consumers
- producers_old:
  - `odd_sdlc.gap_dossier` read-model builders and gate projection helpers
  - `odd_sdlc.public_start` envelope types over open result payloads
  - `odd_sdlc.execution_contract` persisted contract projection over open payload
  - `odd_sdlc.app` mutable result decoration and admission / iteration tuple returns
  - `odd_sdlc.query` open projection surfaces
  - ABG yielded/result producers consumed through open dicts
- producers_new:
  - one closed gap-dossier carrier family
  - one closed public-start admission family
  - one closed admitted execution-contract family
  - one closed public-start iteration outcome family
  - one typed ABG yielded/result ingress adapter or explicitly migrated upstream typed carrier
  - query-domain and proof surfaces derived from those closed carriers
- consumers_old:
  - `odd_sdlc.app.start(...)`
  - `odd_sdlc.continuation.continue_with_result(...)`
  - `odd_sdlc.query.query_domain(...)`
  - installation / usecase proofs that inspect public-start payloads
  - operator interpretation of public-start state through open bags
- consumers_new:
  - `odd_sdlc.app.start(...)`
  - `odd_sdlc` re-entry / continuation handling
  - `query-domain`
  - source/install/usecase proof lanes
  - operator interpretation through one closed carrier family
- derived_surfaces:
  - `.ai-workspace/runtime/odd_sdlc-gap-dossiers.json`
  - `.ai-workspace/runtime/odd_sdlc-gap-dossiers.md`
  - `.ai-workspace/runtime/odd_sdlc-execution-contract.json`
  - `.ai-workspace/runtime/odd_sdlc-execution-contract.md`
  - `.ai-workspace/runtime/active-workflow.json`
  - `.ai-workspace/events/events.jsonl`
  - `query-domain` projection
  - fp manifests / fp results / yielded continuation payloads as consumed by odd_sdlc

## Migration Checklist

- [x] old truth path is named explicitly
- [x] new truth path is named explicitly
- [x] producer set for the new truth is listed
- [x] consumer set for the new truth is listed
- [x] projection and read-model surfaces are listed
- [x] old truth path is removed or explicitly demoted from authority
- [x] mixed-state behavior is no longer accepted as closure evidence
- [x] tests proving mixed old and new behavior are removed or repriced
- [x] ticket wording, design wording, and proof claims are reconciled before closure

## Carrier Set Checklist

These boxes are closure-gating. A green typing lane or partial wrapper refactor
does not satisfy this ticket while any carrier below is still half-typed.

- [x] Published Gap Dossier Carrier
  Closure: one closed published/read-model family exists for dossier load,
  dossier projection, head-gap classification, and start-gate projection; no
  semantic dossier dict crosses from publication into the semantic kernel.
- [x] Public Start Admission Carrier
  Closure: admit / block / human-gate / unavailable branches are carried by one
  closed admission family and no controller branch depends on anonymous start
  payloads.
- [x] Admitted Execution Contract Carrier
  Closure: the persisted admitted contract and its target variants are closed
  and pattern-matched directly; no open payload remains authoritative.
- [x] Public Start Iteration Outcome Carrier
  Closure: traversal-applied / terminal / blocked / proof-hold / yielded /
  failure are direct closed variants and no mutable result dict remains the
  semantic center.
- [x] Yielded Continuation Ingress Carrier
  Closure: ABG yielded/result truth enters odd_sdlc through exactly one closed
  ingress contract; no duplicate raw-dict ingress survives.

## Carrier Role Matrix

The design method requires each carrier in the irreducible set to state whether
it is authoritative source truth or a downstream projection/consumer boundary.
These rows are closure-gating.

- [x] Published Gap Dossier Carrier
  Role: authoritative source truth.
  Closure: ticket-local implementation and proofs still treat this as the sole
  published source carrier for public head-gap / dossier state.
- [x] Public Start Admission Carrier
  Role: downstream consumer boundary over the published gap dossier carrier.
  Closure: this carrier consumes authoritative dossier truth and does not
  become a rival source of head-gap meaning.
- [x] Admitted Execution Contract Carrier
  Role: authoritative persisted execution truth after admission.
  Closure: this carrier is the sole admitted execution truth and downstream
  projections consume it rather than rebuilding target semantics.
- [x] Public Start Iteration Outcome Carrier
  Role: downstream public projection over admitted execution and ABG/runtime
  outcome truth.
  Closure: this carrier projects public iteration law and does not outrank the
  admitted execution contract or ABG runtime facts.
- [x] Yielded Continuation Ingress Carrier
  Role: authoritative odd_sdlc ingress boundary for upstream ABG yielded/result
  truth as consumed locally.
  Closure: odd_sdlc has one authoritative ingress adapter/contract and no
  second raw-dict ingress path survives beside it.

## Class Consolidation Checklist

These boxes exist to stop the implementation from translating one open carrier
family into many inflated peer types.

- [x] the top-level class/type count for the public-start family is justified
  by the irreducible carrier set, not by payload convenience
- [x] every promoted top-level type names the independent authority,
  persistence, or direct pattern-match reason that justifies promotion
- [x] row fragments used only inside the dossier family remain nested/private or
  are explicitly justified as promoted persisted/public contracts
- [x] branch-local field groups inside start admission and iteration outcome
  remain nested/private unless they are direct public variants
- [x] execution-target branch detail is promoted only where the persisted/public
  contract truly requires a distinct variant
- [x] query/read-model-only detail is not promoted into the authoritative
  carrier family
- [x] no implementation step claims progress by multiplying peer classes while
  leaving the semantic center unchanged

## Subordinate Payload Register

This register prevents boundary inflation. Every entry must end in exactly one
state before closure:

- remains subordinate and nested/private
- promoted with explicit Promotion Test justification in this ticket
- deferred to a named successor ticket

- [x] `gap_truth`
  Closure: kept subordinate inside the dossier family, promoted with explicit
  justification, or deferred explicitly.
- [x] `observation`
  Closure: kept subordinate inside the dossier family, promoted with explicit
  justification, or deferred explicitly.
- [x] `triage`
  Closure: kept subordinate inside the dossier family, promoted with explicit
  justification, or deferred explicitly.
- [x] `route_binding`
  Closure: kept subordinate inside the dossier family, promoted with explicit
  justification, or deferred explicitly.
- [x] `constitutional_proposal`
  Closure: kept subordinate inside the dossier family or start-gate family,
  promoted with explicit justification, or deferred explicitly.
- [x] `evidence_bundle_refs`
  Closure: kept subordinate inside the dossier family, promoted with explicit
  justification, or deferred explicitly.
- [x] `fh_gate`
  Closure: either remains subordinate under the public-start gate family or is
  promoted as a direct public/persisted variant with explicit justification.
- [x] `proof_hold`
  Closure: either remains subordinate under the public-start iteration family
  or is promoted as a direct public/persisted variant with explicit
  justification.
- [x] execution-target detail fields
  Scope: `route_contract`, `ticket_id`, `ticket_relative_path`,
  `ticket_target_truth`, and other branch-local binding fields.
  Closure: only true persisted/public target variants are promoted; branch-local
  detail stays subordinate.
- [x] query/read-model-only subordinate detail
  Scope: query-domain-only row detail, asset projection fragments, and
  operator-facing derived fields.
  Closure: no query/read-model-only detail is promoted into the carrier set
  solely to make typing easier.

## ABG Ingress Decision Checklist

This ticket must not close while the odd_sdlc side is undecided about the ABG
yielded/result ingress seam.

- [x] one ingress strategy is chosen explicitly
  Decision: either
  - one odd_sdlc-local typed ingress adapter owns the seam
  - or one linked ABG-side migration closes the upstream public result family
- [x] if the local odd_sdlc adapter path is chosen, the owning module is named
  and every odd_sdlc consumer routes through it
- [x] if the upstream ABG migration path is chosen, the linked ABG ticket is
  named and odd_sdlc does not keep a rival local truth path
- [x] no mixed local-adapter plus raw-ABG-dict consumption remains on the
  current tree
- [x] yielded continuation, repair/review variants, and no-continuation
  failure variants are all covered by the chosen ingress contract

## Old Open-Site Retirement Checklist

These are the live old seams. Each item must either be retired in this ticket
or explicitly demoted to a foreign/dynamic boundary that collapses immediately
at ingress.

- [x] `public_start.py`
  - `PublicStartReturn.result: dict[str, Any}`
  - `PublicStartDispatchRequired.result: dict[str, Any}`
  - `PublicStartHumanGateRequired.result: dict[str, Any}`
  - `project_public_start_gen_start_outcome(result: Mapping[str, Any], ...)`
  - `project_public_start_dispatch_outcome(dispatch_result: Mapping[str, Any])`
- [x] `gap_dossier.py`
  - `GapDossierInputRow` semantic dict fields
  - `PendingConstitutionalStartGate.to_start_result() -> dict[str, Any]`
  - `PublicNextStartBlock.to_start_result() -> dict[str, Any]`
  - `load_published_gap_dossier_register(...)`
  - `load_gap_dossier_read_model(...) -> dict[str, Any]`
  - `require_published_gap_dossier_read_model(...)`
  - `project_gap_dossier_read_model(...) -> dict[str, Any]`
- [x] `execution_contract.py`
  - `AdmittedExecutionContractProjection.payload: Mapping[str, Any]`
  - `ExecutionContractCarrier.payload: dict[str, Any]`
  - any `to_dict()` / loader pair that preserves open semantic payload truth
- [x] `app.py`
  - `_resolve_public_start_admission(...) -> tuple[..., Any | None, dict[str, Any] | None]`
  - `_resolve_public_next_iteration(...) -> tuple[..., Any | None, dict[str, Any] | None]`
  - `_run_public_next_start(...) -> dict[str, Any]`
  - mutable `result: dict[str, Any]` decoration at the semantic center
- [x] `query.py`
  - `query_domain(...) -> dict[str, Any]`
  - public-start-adjacent query projections still using open semantic payloads
- [x] `query_contract.py`
  - `query_domain_contract()` or adjacent query contract truth widening back to
    open bags after the source carriers are closed
- [x] ABG ingress seam as consumed by odd_sdlc
  - raw yielded/result dicts crossing into odd_sdlc semantic code without one
    closed ingress contract

## Schema Touch Inventory Checklist

This checklist lifts Sections 1-7 of
`.ai-workspace/comments/codex/20260422T171445Z_SCHEMA_typed-public-start-interface-touch-map.md`
into ticket-local closure gates so the full touch inventory cannot be silently
narrowed later.

- [x] Section 1: gap dossier source carriers and publication boundary
  Touches: `GapDossierInputRow`, `GapDossierInput`,
  `PendingConstitutionalStartGate`, `PendingConstitutionalStartGate.to_start_result()`,
  `PublicNextStartDirective`, `PublicNextStartBlock`,
  `PublicNextStartBlock.to_start_result()`, `PublicNextStartResolution`,
  `normalize_gap_dossier_scope(...)`, `_gap_dossier_relative_paths(...)`,
  `_published_gap_dossier_paths(...)`, `project_gap_dossier_input(...)`,
  `build_gap_dossier_register(...)`, `publish_gap_dossier_surfaces(...)`,
  `load_published_gap_dossier_register(...)`,
  `unavailable_gap_dossier_projection(...)`,
  `load_gap_dossier_read_model(...)`,
  `require_published_gap_dossier_read_model(...)`,
  `head_gap_dossier(...)`, `project_pending_constitutional_start_gate(...)`,
  `project_unavailable_public_next_start_block(...)`,
  `project_public_next_start_directive(...)`,
  `project_blocked_public_next_start_block(...)`,
  `project_public_next_start_resolution(...)`,
  `project_gap_dossier_surface(...)`,
  `project_gap_dossier_read_model(...)`.
- [x] Section 2: public-start admission carriers
  Touches: `PublicStartReturn`, `PublicStartRepublishAndContinue`,
  `PublicStartDispatchRequired`, `PublicStartHumanGateRequired`,
  `PublicStartAdmissionDirective`, `PublicStartIterationOutcome`,
  `PublicStartAdmissionResolution`,
  `project_public_start_admission_for_next(...)`,
  `project_public_start_admission_for_explicit(...)`.
- [x] Section 3: execution contract target truth and admitted projection
  Touches: `BoundExecutionStart`, `AdmittedExecutionContractProjection`,
  `NextExecutionTarget`, `GraphFunctionExecutionTarget`,
  `AssetExecutionTarget`, `ExecutionTarget`, `OperatorExecutionSource`,
  `TicketWorkItemExecutionSource`, `DraftExecutionContract`,
  `AdmittedExecutionContract`, `RejectedExecutionContract`,
  `SupersededExecutionContract`, `ExecutionContractCarrier`,
  `_admitted_execution_contract_projection_from_payload(...)`,
  `load_admitted_execution_contract_projection(...)`,
  `derive_execution_contract_surface(...)`,
  `admit_execution_contract_surface(...)`.
- [x] Section 4: public-start result classification and loop state
  Touches: `_project_public_start_stop_predicate(...)`,
  `_stopped_by_for_public_start_stop_predicate(...)`,
  `project_public_start_gen_start_outcome(...)`,
  `project_public_start_dispatch_outcome(...)`,
  `resolve_public_start_result_policy(...)`,
  `emit_public_start_human_proxy_approval(...)`,
  `_publish_pending_constitutional_start_gate(...)`,
  `_apply_pending_constitutional_human_proxy(...)`,
  `_attach_public_next_result_metadata(...)`, `publish_gap_surface(...)`,
  `republish_gap_surface(...)`, `_public_next_gap_surface(...)`,
  `_resolve_public_start_admission(...)`,
  `_resolve_public_next_iteration(...)`, `_run_public_next_start(...)`,
  `start(...)`.
- [x] Section 5: ABG result and continuation producer boundary
  Touches: ABG `YieldedContinuationContract.public_result(...)`,
  `YieldedContinuationContract.run_yielded_event_data(...)`, `gen_start(...)`,
  `auto_dispatch_from_result(...)`, yielded continuation return sites in
  `dispatch_runtime.py`, and repair / `fh_review` yield return sites in
  `result_ingest.py`, as consumed through the chosen odd_sdlc ingress seam.
- [x] Section 6: query and projection surfaces
  Touches: `query.py::query_domain(...)`,
  `query_contract.py::query_domain_contract()`.
- [x] Section 7: proof and static typing lane
  Touches: `test_odd_sdlc_first_slice.py`,
  `test_odd_sdlc_installation.py`, `test_odd_sdlc_yield_usecase.py`,
  the strict typing lane, and the negative proof that half-typed carriers
  cannot still pass in normal execution.

## Strict Typing Lane Checklist

The typing lane is closure evidence, not optional cleanup.

- [x] the exact bounded module slice for the strict checker is named in-repo
- [x] strict checker configuration is committed or already authoritative in-repo
- [x] the typing lane does not rely on a global `follow_imports = skip`; only
      explicitly named out-of-scope transitive modules are skipped
- [x] `build_tenants/python/code/odd_sdlc/gap_dossier.py`
- [x] `build_tenants/python/code/odd_sdlc/public_start.py`
- [x] `build_tenants/python/code/odd_sdlc/execution_contract.py`
- [x] `build_tenants/python/code/odd_sdlc/start_targeting.py`
- [x] `build_tenants/python/code/odd_sdlc/runtime_effects.py`
- [x] `build_tenants/python/code/odd_sdlc/app.py`
- [x] `build_tenants/python/code/odd_sdlc/query.py`
- [x] the chosen ABG ingress module on the odd_sdlc side, or the explicitly
  linked upstream typed module if the seam is moved there
- [x] no semantic `Any`, semantic `Mapping[str, Any]`, semantic
  `dict[str, Any]`, broad `cast(...)`, or ticket-local `# type: ignore`
  exemptions remain in the bounded semantic slice
- [x] `assert_never(...)` or equivalent exhaustiveness guards are present at
  the admission and public-start outcome union decision points
- [x] checker output is captured as ticket-local closure evidence

## Proof Repricing Checklist

- [x] `test_odd_sdlc_first_slice.py`
- [x] `test_odd_sdlc_installation.py`
- [x] `test_odd_sdlc_yield_usecase.py`
- [x] query-domain projection proofs
- [x] negative proof that half-typed carriers cannot still pass in normal execution

## Final Leg Gate

This ticket does not close from "mostly green" status.

Closure on the final leg is blocked until all of the following are true:

- [x] the ABG ingress decision is made and implemented:
      odd_sdlc either consumes one typed ingress adapter for yielded/result
      truth or explicitly moves that seam upstream with linked authority
- [x] residual semantic `Any` in the bounded semantic slice is either removed or
      explicitly moved outside the slice behind a named typed adapter with
      justification
- [x] `test_odd_sdlc_yield_usecase.py` is repriced to the closed carriers and
      green
- [x] no remaining cast sites exist in the bounded semantic slice except
      documented post-proof narrowing casts
- [x] the ticket's remaining-boundary-debt register is empty or each item is
      explicitly deferred out of scope with justification and a successor ticket

Passing `mypy` and the currently focused runtime bundles is necessary but not
sufficient for closure.

## Remaining Boundary Debt

These are the explicit remaining blockers for the final B-040 leg. They must be
closed, explicitly deferred, or moved behind a named typed adapter.

- [x] `app.py`
      public-start admission/iteration shell is closed for this ticket; broader
      runtime-config and non-public-start effect-shell debt is not closure
      evidence for B-040
- [x] `execution_contract.py`
      direct admitted execution carrier is closed for this ticket; broader
      transitive GTL/ABG strict typing debt is outside the bounded slice
- [x] `query.py`
      direct public-start/start-target projection seam is closed; broader
      query-domain plugin object projections are deferred to `B-043`
- [x] chosen ABG yielded/result ingress boundary is named and typed
- [x] yield-usecase proof lane is repriced and green
- [x] `operational_dispatch.py`
      removed from B-040 closure scope and deferred to `B-043`

## Progress Notes

### 2026-04-23 B-040 Reopen And Final Closure Note

- B-040 was reopened after self-review because the earlier completed note
  overclaimed:
  - a globally skipped import typing lane
  - file-level proof counts without reproducible selectors
  - broader query/plugin and `operational_dispatch.py` closure that this ticket
    had not actually finished
- The ticket was then repriced to the actual bounded family:
  - published gap dossier
  - public-start admission/outcome
  - admitted execution contract
  - odd_sdlc-owned yielded/result ingress
  - direct query/start-target projection seam
- Residual broad query/plugin and `operational_dispatch.py` debt is deferred to
  [B-043-close-broad-query-plugin-and-operational-dispatch-open-projection-surfaces.md](/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/active/B-043-close-broad-query-plugin-and-operational-dispatch-open-projection-surfaces.md).
- `odd_sdlc.public_start` remains the chosen odd_sdlc-owned typed ingress
  adapter for yielded/result truth.
- The final authority-seam fix in this ticket was the yielded public carrier:
  runtime truth emitted `observer_handoff`, while the public yielded carrier
  used to rewrite unknown handoff kinds to `repair`. The closure slice extended
  the closed yielded vocabulary instead of overriding runtime meaning.
- Final closure evidence on the current tree is explicit and reproducible:
  - strict typing lane:
    `python -m mypy --config-file mypy.ini -m odd_sdlc.public_start_contract -m odd_sdlc.public_start -m odd_sdlc.gap_dossier -m odd_sdlc.query_contract -m odd_sdlc.query -m odd_sdlc.start_targeting -m odd_sdlc.execution_contract -m odd_sdlc.runtime_effects -m odd_sdlc.app`
    -> `Success: no issues found in 9 source files`
  - source/install selector bundle:
    `PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py::test_start_runs_through_declared_entry_and_emits_abg_facts build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py::test_bound_execution_start_rejects_open_dict_execution_contract_payload build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py::test_downstream_consumers_reject_corrupt_execution_contract_surface build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py::test_query_domain_rejects_malformed_published_gap_dossier_register build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py::test_query_domain_exposes_domain_views_without_runtime_duplication build_tenants/python/test_env/tests/test_odd_sdlc_installation.py::test_imported_workspace_first_generated_readback_is_materially_specific -q`
    -> `6 passed in 54.88s`
  - yield/usecase proof lane:
    `PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_yield_usecase.py -q`
    -> `5 passed in 333.39s (0:05:33)`
  - negative proof is carried directly by:
    - `test_bound_execution_start_rejects_open_dict_execution_contract_payload`
    - `test_downstream_consumers_reject_corrupt_execution_contract_surface`
    - `test_query_domain_rejects_malformed_published_gap_dossier_register`

### 2026-04-23 B-040 Root-Cause-First Slice

- Replaced the worst return-line `cast(...)` scaffolding in
  `public_start.py`, `gap_dossier.py`, `query.py`, `execution_contract.py`,
  and `app.py` with explicit field-level constructors, parsers, and one shared
  execution-contract normalizer.
- `query_domain(...)` now consumes the published gap-dossier carrier only; it
  no longer rebuilds private current gap truth via `gap_snapshot(...)`.
- Persisted gap-dossier and execution-contract carriers now fail closed on
  malformed payloads rather than being accepted through raw cast-based trust.
- Bounded strict typing lane is green on:
  `odd_sdlc.public_start_contract`, `odd_sdlc.public_start`,
  `odd_sdlc.gap_dossier`, `odd_sdlc.query_contract`, `odd_sdlc.query`,
  `odd_sdlc.start_targeting`, `odd_sdlc.execution_contract`,
  `odd_sdlc.runtime_effects`, `odd_sdlc.app`.
- The original file-level pytest counts were retired because they were not a
  reproducible closure surface for this ticket.
- Remaining open work from this earlier slice is now closed by the final
  closure leg recorded above.

## Existing Live Violations On The Current Tree

No live semantic `Any` / half-typed carrier violations remain in the bounded
slice claimed by B-040.

Remaining casts are lawful post-proof narrowing casts only:

- literal narrowing in `public_start.py`
- validated status/source/target narrowing in `execution_contract.py`
- validated mode narrowing in `app.py`

Broader query/plugin object projections and `operational_dispatch.py` remain
active debt, but they are no longer claimed by this ticket and are deferred to
`B-043`.

This ticket exists because the slice is already small enough to inventory
exhaustively. It is no longer honest to leave it as “general typing cleanup
later.”

## Functional Review Criteria

Review this ticket as a carrier-closure migration and method-compliance repair,
not as generic type cleanup.

Every implementation and review pass must ask:

1. Did the change replace open payload truth with carrier-owned truth, or did it
   only wrap the same open bags in typed envelopes?
2. Is the irreducible carrier set declared and preserved, or did the slice
   inflate into many peer types without Promotion Test justification?
3. Are persisted/public boundaries closed before semantic transforms begin?
4. Does `app.py` consume closed carriers directly, or does it still reconstruct
   law procedurally from dict payloads and `.get(...)` chains?
5. Does odd_sdlc consume ABG yielded/result truth through one typed ingress
   boundary rather than multiple raw dict consumers?
6. Is the direct public-start/start-target query projection a downstream
   projection of the same carriers, or can it still silently widen or rebuild
   the truth?
7. Is the static typing lane strict and meaningful, or merely green around an
   unchanged semantic center?
8. Are subordinate payloads staying subordinate unless they need independent
   authority, independent persistence, direct pattern-match semantics, or
   stable cross-module reuse?
9. Has the implementation consolidated around a few identity-bearing carrier
   families, or has it merely replaced one open bag with many shallow peer
   classes?

Passing tests do not satisfy this section by themselves. A slice that keeps the
same semantic center alive behind typed wrappers, adapter-local policy, raw
payload carriers, or boundary inflation still fails review.

## Impacted Interface Review Checklist

- [x] `gap_dossier.py` source carrier and publication boundary
  Closure: published register/context load into closed local carriers before semantic transforms; start-gate/read-model emit no semantic dict payloads; scope remains a real discriminator.
- [x] `gap_dossier.py` start-gate projection family
  Closure: pending constitutional gate, public-next directive, and block variants expose closed result carriers and do not use `to_start_result() -> dict[str, Any]`.
- [x] `public_start.py` admission family
  Closure: admission resolution and admission directive consume closed carriers only; no branch-local open result payload remains authoritative.
- [x] `public_start.py` iteration outcome family
  Closure: public start return / dispatch-required / human-gate-required / republish outcomes are closed carriers; no `result: dict[str, Any]` remains.
- [x] `execution_contract.py` admitted projection and target payload family
  Closure: admitted contract projection and execution-target variants agree on one closed persisted payload family; loaders/projections do not keep `payload: Mapping[str, Any]`.
- [x] `app.py` public-start admission shell
  Closure: `_resolve_public_start_admission(...)` consumes and returns closed carriers only; no tuple slot remains `Any | None` or `dict[str, Any] | None`.
- [x] `app.py` public-start iteration shell
  Closure: `_resolve_public_next_iteration(...)` and `_run_public_next_start(...)` operate over closed carriers; effect emission stays outermost and semantic law is not reconstructed procedurally.
- [x] `query.py` / `query_contract.py` / `start_targeting.py`
  Closure: the direct public-start/start-target query seam exposes downstream
  projections of the same closed family and does not widen back to
  `dict[str, Any]` as the authoritative story.
- [x] broader query/plugin and `operational_dispatch.py` projection debt
  Closure: explicitly removed from B-040 scope and deferred to `B-043`, so this
  ticket no longer overclaims them.
- [x] odd_sdlc continuation / ABG yielded-result ingress boundary
  Closure: one odd_sdlc-owned typed ingress adapter or one explicitly migrated upstream ABG typed public contract exists; there are no duplicate raw dict consumers across odd_sdlc.
- [x] source proof lane
  Closure: `test_odd_sdlc_first_slice.py` reprices the public-start family against the closed carriers and removes acceptance of mixed half-typed behavior.
- [x] installed / usecase proof lanes
  Closure: `test_odd_sdlc_installation.py` and `test_odd_sdlc_yield_usecase.py` consume the same closed public payloads and prove no split source/install carrier story survives.
- [x] strict static typing lane
  Closure: one strict checker run is added for the bounded slice and passes without relying on semantic `Any`, semantic `Mapping[str, Any]`, or ticket-local exemptions that keep the old path alive.

## Required Break Order

1. Declare the irreducible carrier set and subordinate payload inventory for the
   bounded public-start family.
   Old seam severed: typing-by-accumulation and ad hoc promotion of payload
   fragments into peer types.
   Negative proof: no implementation artifact claims closure while the carrier
   set and subordinate payloads remain implicit.

2. Close the published gap-dossier read-model family.
   Old seam severed: raw register / read-model dicts passing directly into
   public-start semantics.
   Negative proof: public-start and query consumers cannot still accept raw
   dossier mappings as authoritative semantic truth.

3. Close the public start gate/admission boundary.
   Old seam severed: `to_start_result()` and admission helpers emitting or
   consuming open dict payloads.
   Negative proof: `app.start(...)` cannot still branch over anonymous start
   gate dicts in normal execution.

4. Close the admitted execution-contract projection family.
   Old seam severed: typed execution-contract envelope over open persisted
   payload.
   Negative proof: loaders/projections cannot still keep
   `payload: Mapping[str, Any]` as authoritative contract truth.

5. Close the public-start iteration/result family.
   Old seam severed: mutable result decoration and stop-predicate projection
   over raw dict payloads.
   Negative proof: `_run_public_next_start(...)` cannot still hold
   `result: dict[str, Any]` at the semantic center.

6. Close the ABG yielded/result ingress boundary.
   Old seam severed: multiple odd_sdlc consumers reading raw ABG yielded/result
   dicts.
   Negative proof: the same ABG payload cannot still be interpreted in more
   than one odd_sdlc location through open `.get(...)` logic.

7. Rebind downstream projections and proof lanes.
   Old seam severed: query-domain and tests reintroducing open bags or green
   bars around a still-open semantic center.
   Negative proof: query/proof consumers cannot still accept mixed typed
   envelope plus open payload behavior as closure evidence.

## Break-To-Closure Map

- Break 1 closes the method-authority ambiguity and boundary-inflation risk.
- Break 2 closes the deepest public source truth boundary.
- Break 3 closes admission semantics over that source truth.
- Break 4 closes persisted admitted execution truth.
- Break 5 closes the public iteration/result shell.
- Break 6 closes the cross-repo yielded/result ingress seam.
- Break 7 closes projection, proof, and static-typing acceptance surfaces.

## Mixed-State Negative Proof

Closure requires proof that the following mixed state is impossible:

1. the public-start branch family is described as typed and carrier-owned
2. one or more load-bearing boundaries in `gap_dossier.py`, `public_start.py`,
   `execution_contract.py`, `app.py`, `query.py`, or odd_sdlc’s ABG ingress
   still expose semantic `dict[str, Any]`, `Mapping[str, Any]`, or `Any`
3. the typing lane is either absent or green only because the open semantic
   payload remained authoritative behind typed wrappers

If that mixed state still exists, this ticket remains open.

## Recommended Source-Carry Direction

This ticket should implement the bounded slice in this order:

1. gap-dossier carrier / read-model closure
2. admission directive / result family closure
3. execution-contract payload closure
4. public-start iteration/result family closure
5. ABG yielded/result ingress closure
6. query and proof lane closure

This is intentionally the same inside-out sequence named by the schema post.
The ticket adopts that sequence as ticket authority rather than leaving it in
commentary only.
