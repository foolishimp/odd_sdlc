---
id: B-035
title: Public odd_sdlc start next bypasses published constitutional pending_fh gate and proof lanes do not audit run lawfulness
type: bug
ticket_category: implementation_migration
migration_strategy: inside_out_hard_break
status: completed
goal: lawful-public-start-homeostatic-constitutional-gating
change_intent: Rebind public odd_sdlc start so public start entry paths consume the same published homeostatic gap and constitutional-proposal carrier as gaps, stop at fh_gate when the head edge is pending_fh, and prove that event streams match the governing code path rather than only superficial command success
change_class: design_reframe
re_entry_point: design_surface
affected_boundary: public odd_sdlc start behavior for public start entry paths, homeostatic gap triage and constitutional proposal publication, execution-contract admission, public-start target resolution, installed sandbox proof lanes, and event-forensic review practice
priority: high
triaged_at: 2026-04-22
created_at: 2026-04-22
updated_at: 2026-04-23
dependencies: B-034 completed; T-023 completed; T-024 completed
intake_source: RC forensic audit over installed workspace data_mapper.test36 after pristine install, operator-run gaps, and event-by-event code walk
target_truth: public odd_sdlc start and public odd_sdlc gaps consume one authoritative homeostatic carrier, so a head edge with constitutional_proposal.state=pending_fh and route_binding.state=await_fh_resolution stops public start at fh_gate and emits no execution_contract or constructive run events until a lawful FH resolution event exists
superseded_truth: gaps publishes pending_fh constitutional truth, but public odd_sdlc start entry paths can still resolve directly to raw module jobs and continue constructive traversal without consuming that published carrier, while current proof lanes assert event presence and command success without auditing whether the emitted run sequence is lawful
closure_law: this migration closes only when public odd_sdlc start cannot bypass a published pending_fh constitutional gate, execution-contract and run events are absent until lawful FH resolution exists, and sandbox or installation proofs include event-forensic assertions that the emitted sequence matches the governing code path
evaluation_criteria:
  - public odd_sdlc start reads the published homeostatic carrier before admitting execution for public start entry paths
  - when the head edge is pending_fh with route_binding.state=await_fh_resolution, public start stops with stopped_by=fh_gate and no execution_contract_drafted or run_bound events are emitted for constructive work
  - execution_contract admission, public-start target resolution, and job selection consume the same source truth as gaps rather than parallel module-order truth
  - sandbox and installation proofs reproduce the bypass on the old path and prove the corrected fail-closed behavior on the new path
  - forensic proof checks both positive and negative event expectations, not only command return payloads or generic event presence
  - event-lawfulness review distinguishes lawful multiplicity such as per-obligation assessed events from unlawful progression such as constructive dispatch past an unresolved FH gate
non_closure_conditions:
  - public start still admits an execution contract while the published head edge carries constitutional_proposal.state=pending_fh and route_binding.state=await_fh_resolution
  - no fh_gate or resolution event exists, yet constructive run events continue downstream
  - proof lanes still accept event-presence checks without asserting the absence of pre-gate constructive events
  - sandbox or installation proofs can pass while gaps and start tell different stories about whether constitutional FH resolution is required
  - RC evidence is taken from a pre-fix installed substrate, so source truth and install truth are silently split
proof_surface:
  - installed sandbox reproduction over data_mapper.test36 style workspaces
  - paired installed comparison over data_mapper.test35 and data_mapper.test36 style workspaces
  - installed substrate proof that the workspace under review carries the post-fix public-start carrier path
  - source proof for public start carrier consumption across public target types
  - event-forensic tests that compare emitted execution order to the governing code path
  - repriced installation and sandbox tests that currently validate only superficial traversal success
---

## Migration Declaration

- old_truth_path: public `gaps` publishes the homeostatic triage carrier and records a constitutional proposal with `pending_fh`, but public `start` entry paths can still resolve directly through the admitted execution contract and raw module job order, so constructive traversal continues without consuming that gate truth
- new_truth_path: public `start` consumes the same published homeostatic carrier as `gaps`, treats unresolved `pending_fh` constitutional truth as the authoritative pre-dispatch stop condition for public start entry paths, and requires explicit FH resolution before execution-contract admission and constructive traversal proceed
- producers_old:
  - `odd_sdlc.triage._build_constitutional_proposal(...)`
  - `odd_sdlc.triage._publish_edge_projection(...)`
  - `odd_sdlc.app.start(...)` with parallel public-start truth
  - `odd_sdlc.execution_contract.admit_bound_execution_start(...)`
  - `genesis.services.gen_start(...)` / `_resolve_start_jobs(...)`
- producers_new:
  - published edge triage carrier
  - published constitutional proposal state and route binding
  - public start admission that consumes the published head-gap truth before execution-contract admission
  - event-forensic proof surfaces that validate the emitted sequence
- consumers_old:
  - public `odd_sdlc start`
  - installation and sandbox proofs that assert traversal/event presence only
  - operator interpretation of RC readiness from partial event review
- consumers_new:
  - public `odd_sdlc start`
  - installation and sandbox proofs with event-lawfulness assertions
  - operator forensic review of RC runs
- derived_surfaces:
  - current edge triage artifacts under `.ai-workspace/runtime/triage/`
  - `odd_sdlc-execution-contract.json`
  - `.ai-workspace/events/events.jsonl`
  - fp manifests and fp results
  - gap dossier surface
- closure_law: this migration closes only when `gaps`, `start`, execution-contract publication, and the event stream no longer disagree about whether constitutional FH resolution is required before constructive work begins

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

## Existing Live Reproduction

Current RC sandbox evidence already reproduces the defect.

Installed workspace:

- `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test36`

Observed sequence from `.ai-workspace/events/events.jsonl`:

1. `2026-04-22T09:15:23Z` `gaps` publishes `constitutional_proposal_recorded` for `derive_intent_surface` with `state=pending_fh`
2. no `fh_gate_pending`, `approved`, `revoked`, `constitutional_proposal_approved_with_edits`, or `proposal_applied` events occur
3. `2026-04-22T09:47:13Z` an execution contract is drafted and admitted for `target_truth.kind=next`, `until=converged`
4. constructive run events then progress through `derive_intent_surface`, `derive_product_surface`, `derive_goal_surface`, `derive_requirement_surface`, and further downstream edges

This is the reproducing symptom:

- public `gaps` says the head edge is parked on `await_fh_resolution`
- public `start --target next --until converged` still begins constructive dispatch with no FH resolution event in the stream

## Additional RC Comparison Criteria

`data_mapper.test35` and `data_mapper.test36` must be treated as paired RC
review surfaces for this ticket.

Relevant comparison facts:

- `data_mapper.test35` is the qualified executed reference in the line:
  admitted execution evidence exists and the workspace has historical full-path
  convergence under an older cut
- `data_mapper.test36` is the pristine RC pending-execution reference:
  new requirement families are present, no realized execution evidence exists,
  and the first lawful public posture is governed by current published
  homeostatic carrier truth

This ticket closes only if the fix proves workspace-specific lawful behavior
rather than one hard-coded bootstrap assumption:

- on a `test36`-style pristine RC workspace, public `start(next)` must stop at
  the published constitutional or publication gate when the published carrier
  says it must
- on a `test35`-style executed workspace, public `start(next)` must derive its
  behavior from that workspace's own published carrier, not from a generalized
  bootstrap branch or template default
- the same public entry point must therefore produce different results across
  the two installs only when the published carriers differ, not because the
  controller contains repo-level or template-level hidden truth

The 2026-04-22 Claude forensic comparison adds two more requirements:

- `data_mapper.test36` reproduced the mixed-state defect on a pre-fix installed
  substrate; closure therefore requires proof on a freshly installed post-fix
  line, not only on the mutable source tree
- `test35` vs `test36` surfaced adjacent runtime concerns
  (`worker_turn_salvaged` on every F_P dispatch in the cited `test36` run,
  shallower retry/reset behavior than `test35`), but those are separate from
  B-035's primary start-gating boundary and must not be folded into this ticket
  as vague residual noise

## Expected Graph Flow

The expected bootstrap graph flow for public `start --target next` is the
published bootstrap order, not a controller-owned reinterpretation of module
order.

Expected constructive edge order:

1. `derive_intent_surface`
2. `derive_product_surface`
3. `derive_goal_surface`
4. `derive_requirement_surface`
5. `derive_feature_decomp_surface`
6. `derive_uat_testcases_surface`
7. `derive_design_surface`
8. `derive_scenario_surface`
9. `derive_implementation_design_surface`
10. `select_implementation_stack_profile`
11. `derive_implementation_module_surface`
12. `derive_code_surface`
13. `derive_test_design_surface`
14. `select_test_stack_profile`
15. `derive_test_module_surface`

Expected public `start(next)` state machine:

1. normalize scope and public target
2. load the published homeostatic carrier used by `gaps`
3. classify the head gap from that published carrier
4. if the head gap is `pending_fh` with `await_fh_resolution`:
   - emit `fh_gate_pending`
   - stop with `stopped_by=fh_gate`
   - emit no `execution_contract_*`, `run_*`, `graph_call_*`, or `fp_dispatched`
5. if the head gap is open but start-authoritative:
   - admit the execution contract from the same published head-gap carrier
   - bind the admitted start basis to the head edge or public dynamic graph-function route
   - traverse only the lawful next constructive edge
6. if there is no open head gap:
   - report converged and emit no constructive traversal events

Expected event consequences:

- lawful pending FH:
  - `fh_gate_pending` present
  - `execution_contract_drafted` absent
  - `execution_contract_admitted` absent
  - `run_bound` absent
  - `worker_turn_started` absent
  - `fp_dispatched` absent
- lawful admitted traversal:
  - one admitted execution-contract sequence
  - one constructive edge chosen from the same published head-gap carrier
  - event stream order consistent with the bootstrap graph order above

## Impacted Interface Review Checklist

Best-guess audit scope based on the current code walk. This is closure scope,
not closure evidence.

- [x] `odd_sdlc.app.gaps(...)` remains the authoritative publication path for homeostatic triage and constitutional proposal truth
- [x] `odd_sdlc.triage._build_constitutional_proposal(...)` remains the singular constructor of constitutional proposal state and resumption truth
- [x] `odd_sdlc.triage._publish_edge_projection(...)` remains the singular emitter of `constitutional_proposal_recorded`
- [x] `odd_sdlc.app.start(...)` reads the published head-gap carrier before admitting execution for public start entry paths
- [x] `odd_sdlc.execution_contract.resolve_start_target(...)` and `admit_bound_execution_start(...)` do not create a rival public-start authority path that bypasses the published head-gap truth
- [x] `genesis.services.gen_start(...)` and `_resolve_start_jobs(...)` consume a scope already constrained by published constitutional gate truth rather than raw module job order alone
- [ ] ABG `cli_adapter._run_start_until_converged(...)` sees `human_gate_required` only when the odd_sdlc entry path lawfully surfaces it, rather than masking an upstream bypass
- [x] `odd_sdlc query-domain`, gap dossiers, and operator-facing read models tell the same gating story as public start
- [x] installation proof in `test_odd_sdlc_installation.py` asserts absence of execution-contract and run events before FH resolution when the head edge is pending_fh
- [x] sandbox proof in `test_odd_sdlc_sandbox_usecase.py` or an adjacent dedicated test asserts the same event-lawfulness rule
- [x] source proof adds a minimal reproducer for `gaps -> start(...)` on one workspace and inspects the event stream event by event
- [ ] proof review distinguishes lawful event multiplicity such as per-obligation `assessed` events from unlawful constructive progression

## Existing Proof Gap

The current proof shape is too shallow for this boundary.

Existing source proof already shows the homeostatic carrier can publish
constitutional gate truth:

- `test_odd_sdlc_first_slice.py`
  - `initial["gaps"][0]["constitutional_proposal"]["state"] == "pending_fh"`
  - `initial["gaps"][0]["route_binding"]["state"] == "await_fh_resolution"`

But the current installation and sandbox proofs still accept event-presence
success without checking pre-gate lawfulness:

- `test_odd_sdlc_installation.py`
  - asserts `worker_turn_started`, `graph_call_closed`, `continuation_opened`,
    and `run_yielded`
  - does not assert that a published `pending_fh` gate prevents
    `execution_contract_drafted`, `run_bound`, or `worker_turn_started`
- `test_odd_sdlc_yield_usecase.py`
  - likewise checks yield ordering and event presence, not whether the run was
    lawful to begin
- current RC sandbox reproduction already exhibits the mixed-state defect in a
  real installed workspace

This ticket exists partly because the proof lane validated traversal outcomes
without validating whether the run should have been admitted in the first
place.

## Functional Review Criteria

Review this ticket as a carrier-consumption and forensic-proof migration, not
as a timeout or command-output patch.

Every implementation and review pass must ask:

1. Did the slice make public `odd_sdlc start` consume the same published
   homeostatic carrier as `gaps`, or did it only add another stop check?
2. Did it remove the semantic split between head-gap truth and next-target job
   selection, or does `start(next)` still own a rival semantic center?
3. Is constitutional gating expressed as a closed carrier and transform over
   published triage truth, rather than controller logic over raw module order?
4. Are effects limited to execution-contract publication and traversal once the
   gate has lawfully cleared?
5. Did the slice keep event meaning explicit and consistent with
   `DESIGN_MODULE_METHOD.md`, especially the No Semantic Center rule, Interface
   Bleed prohibition, and Effect-Edge rule?
6. Do proof lanes inspect both the presence of lawful events and the absence of
   unlawful early events?
7. Does the forensic proof identify which event multiplicity is expected by
   design, such as one `assessed` event per fulfillment assessment, and which
   multiplicity is a defect?
8. Can an operator or reviewer replay the event stream and derive the same
   gating decision that the code should have taken?
9. Does the emitted execution-contract carrier identify the same head-edge
   route truth that the published gap dossier exposed, rather than deriving a
   second private next-target interpretation?
10. Under `DESIGN_MODULE_METHOD.md`, is the pre-dispatch decision carried by a
    typed admitted carrier rather than hidden in `app.start(...)` branch logic
    or helper fallback paths?
11. Under the Prime Law, did the slice avoid adding convenience wrappers that
    merely move the old controller-owned meaning behind a new name?
12. Does a paired `test35` / `test36` comparison show that public `start(next)`
    behavior varies only with published carrier truth, not with template
    assumptions or repo-global bootstrap heuristics?
13. Does the reviewed evidence come from a post-fix installed substrate rather
    than a stale pre-fix release copy?
14. Does the review keep transport-salvage and retry/recovery observations
    separate from the primary B-035 semantic boundary so the carrier migration
    remains sharp under `DESIGN_MODULE_METHOD.md`?

Passing installed `start` scenarios does not satisfy this section by itself. A
slice that still allows `pending_fh` in `gaps` while `start(next)` continues on
the constructive path fails review even if later edges converge.

## Progress Notes

### 2026-04-23 - Public Admission Hard Break Expanded

- public `start(...)` now consults the published head-gap carrier before
  admission for:
  - `target=next`
  - explicit `graph_function:` targets
  - explicit `asset:` targets
- explicit public start admission now routes through the same typed admission
  seam as `next` rather than using a pending-FH special case plus a direct
  fallback admission path
- scope-owned dossier publication/read-model hardening is in place, so
  `work_key:<id>` gaps publication no longer poisons workspace dossier truth
- the shared constitutional-surface normalization/digest law now lives in
  `odd_sdlc.constitutional_surface`

Focused proof now green on the current source line:

- source public-start gate bundle:
  - explicit `graph_function:` public target stops at published `pending_fh`
  - explicit `asset:ticket/...` public target stops at published `pending_fh`
  - `target=next` continues to stop fail-closed before admission
  - result: `4 passed, 78 deselected`
- install public-start gate bundle:
  - explicit `asset:ticket/...` install proof stops at the same published gate
  - existing `next` gate proofs remain green
  - result: `4 passed, 30 deselected`

This leaves B-035 materially fixed at the source/install carrier boundary, but
the ticket remains open until the broader comparison/forensic closure surface
named above is reconciled.

### 2026-04-23 - Comparative And Forensic Closure Proof Landed

- installed paired comparison now proves that post-fix public `start(next)`
  varies only with published carrier truth across a pristine `test36`-style
  workspace and a progressed `test35`-style workspace
- sandbox forensic proof now locks the negative event law directly:
  published `pending_fh` on the head edge emits `fh_gate_pending` and emits no
  constructive admission/run events before lawful FH resolution
- the existing explicit public-start install bundle remains green on the same
  current source line, so the ticket no longer depends on stale pre-fix RC
  evidence

Closure-grade proof now green on the current source line:

- source public-start carrier bundle:
  - `test_odd_sdlc_first_slice.py -k 'explicit_public_start_requires_published_gap_dossier_before_admission or explicit_public_start_targets_stop_at_published_constitutional_head_gate or start_routes_ticket_asset_to_declared_reentry_vector or start_uses_admitted_route_contract_for_diagnostic_override or start_uses_admitted_target_truth_for_start_intent or start_rejects_unpublished_ticket_asset_handle or start_rejects_backlog_ticket_asset_handle or start_rejects_ticket_asset_without_published_route_contract or ticket_asset_start_carries_ticket_execution_context_into_manifest_prompt or new_execution_contract_supersedes_previous_admitted_contract'`
  - result: `12 passed, 73 deselected`
- installed public-start carrier bundle:
  - `test_odd_sdlc_installation.py -k 'install_exposes_public_odd_sdlc_start_contract or install_exposes_public_odd_sdlc_graph_function_and_asset_targets or install_start_routes_ticket_asset_without_manual_upstream_edit or default_claude_manifest_declares_domain_dispatch_timeout or install_explicit_asset_start_also_stops_at_published_constitutional_fh_gate or install_public_next_varies_only_with_published_carrier_truth_between_pristine_and_progressed_workspaces'`
  - result: `6 passed, 29 deselected`
- sandbox forensic bundle:
  - `test_odd_sdlc_sandbox_usecase.py -k 'sandbox_forensic_public_start_stops_before_constructive_events_at_published_fh_gate'`
  - result: `1 passed, 12 deselected`

## Required Break Order

The required order is:

1. write minimal source and installed reproducer tests for `gaps -> start(next)`
   showing that `pending_fh` truth and constructive start currently diverge
2. rebind public `start(next)` admission so it consumes the published head-gap
   carrier before execution-contract admission
3. make the constructive path emit `fh_gate` and stop before
   `execution_contract_drafted` or `run_bound` when the head edge is
   `await_fh_resolution`
4. prove that no FH-resolution event means no constructive run events
5. prove that lawful FH resolution allows the same workspace to proceed
   through the expected bootstrap graph flow from the published head edge
6. prove that the installed substrate under test actually contains the post-fix
   public-start carrier path before using it as closure evidence
7. add paired installed proof over a `test35`-style executed workspace and a
   `test36`-style pristine RC workspace so public `start(next)` is shown to be
   carrier-derived in both directions
8. reprice installation and sandbox proofs so they assert event-lawfulness
   rather than only event presence or traversal success
9. split adjacent transport-salvage and retry/recovery defects into explicit
   residual tickets if they still reproduce on the post-fix installed line
10. reconcile ticket wording, design wording, and RC-review guidance to require
   forensic run analysis for this boundary

## Break-To-Closure Map

- Break 1 closes the reproduction clause:
  - the defect is captured in source and installed proof
- Breaks 2-3 close the source-consumer clause:
  - public start consumes the published head-gap truth and stops lawfully
- Breaks 4-5 close the runtime behavior clause:
  - no resolution means no constructive progression; lawful resolution reopens
    the path
- Break 6 closes the install-truth clause:
  - source truth and installed truth are no longer silently split
- Break 7 closes the comparative proof clause:
  - `test35` and `test36` both derive public `next` behavior from published
    carrier truth rather than controller-default truth
- Break 8 closes the proof clause:
  - tests no longer accept superficial success
- Break 9 closes the residual-boundary clause:
  - adjacent transport and retry defects are tracked explicitly rather than
    hidden inside this ticket
- Break 10 closes the review-method clause:
  - operator and reviewer guidance now require event-forensic verification

## Mixed-State Negative Proof

Closure requires proof that the following mixed state is impossible:

1. `gaps` publishes `constitutional_proposal.state=pending_fh` and
   `route_binding.state=await_fh_resolution` for the head edge
2. no FH resolution event exists in `.ai-workspace/events/events.jsonl`
3. `execution_contract_drafted`, `execution_contract_admitted`, `run_bound`,
   `fp_dispatched`, or downstream constructive events still appear

If that mixed state is still observable in source tests, installation tests, or
RC sandbox reproductions, this ticket remains open.

## Initial Design Diagnosis

Current root cause from the event-by-event walk:

- `gaps` lawfully builds homeostatic truth through `odd_sdlc.app.gaps(...)`
  and `odd_sdlc.triage`
- `start(next)` resolves `next` directly and binds all scoped jobs without
  consulting the published head-gap carrier
- ABG FH gating is not the immediate defect here; it never receives an FH gate
  transition because odd_sdlc does not surface the constitutional gate into the
  constructive start path

So the prime-law consolidation target is not another helper wrapper. It is one
authoritative pre-dispatch source of head-edge truth that both `gaps` and
`start(next)` consume.

The constructive consequence of that diagnosis is specific:

- public `next` remains public `next`
- the admitted execution basis must carry the published head-edge directive
- fixed bootstrap continuation narrows by the published head edge
- dynamic family continuation may admit an explicit published graph-function
  handle when the published route binding names one
- no controller path is allowed to guess `graph_function:<edge>` when that edge
  is not itself a public start-addressable handle
- the public entry point must remain lawful across both a historically executed
  install (`test35`-style) and a pristine RC install (`test36`-style) without
  embedding special-case workspace assumptions in the controller

## Implementation Notes - 2026-04-22

An in-progress source-line slice exists, but the 2026-04-22 Claude forensic
comparison proved that `data_mapper.test36` was still running a pre-fix
installed substrate. Source-line work alone is therefore not closure evidence
for this ticket.

Implemented source changes:

- `odd_sdlc.gap_dossier` now owns one typed public-start classifier:
  `project_public_next_start_resolution(...)` returns either a
  `PendingConstitutionalStartGate`, a `PublicNextStartDirective`, or a
  `PublicNextStartBlock`
- `odd_sdlc.app.start(...)` no longer hands public `target=next` with
  `until=blocked|converged` to ABG as one stale admitted intent; it now runs a
  public-next control loop at the odd_sdlc boundary
- that loop:
  - reads the published gap-dossier carrier before every admission
  - emits `fh_gate_pending` and stops before execution-contract admission when
    the published head edge is `pending_fh`
  - admits one execution-contract sequence from the published head directive
  - republishes analysis and the published gap-dossier surface after each
    applied traversal or successful dispatch
  - reacquires the next head directive from the newly published carrier before
    continuing
- fixed bootstrap continuation now remains public `next` at the contract
  surface while carrying the published `edge_override`; dynamic-family
  continuation still admits an explicit published `graph_function:` target when
  the route binding names one
- explicit public start targets now consult the same published head-gap
  carrier before admission, so `graph_function:` and start-addressable
  `asset:` handles stop at the same `pending_fh` gate instead of bypassing it

Implemented proof changes:

- `test_odd_sdlc_first_slice.py`
  - proves `start(next)` stops before `gen_start(...)`, emits
    `fh_gate_pending`, and creates no execution-contract artifact while the
    head dossier is `pending_fh`
  - proves `until=blocked` reacquires a new published head-edge directive
    between traversals rather than reusing the first admitted edge forever
- `test_odd_sdlc_installation.py`
  - repriced the public-start contract and inherited `data_mapper` RC case to
    assert lawful absence of execution-contract and constructive run events
    before FH resolution
  - adds an installed explicit `asset:ticket/...` proof that the same
    published constitutional head gate stops explicit public targets before
    admission
- `test_odd_sdlc_yield_usecase.py`
  - repriced the yield lane so setup resolves the published constitutional
    proposal explicitly through the event channel before `next` progression is
    expected, preserving the yield proof without restoring the bypass

Targeted verification now green:

- `test_odd_sdlc_first_slice.py -k 'explicit_public_start_requires_published_gap_dossier_before_admission or explicit_public_start_targets_stop_at_published_constitutional_head_gate or start_routes_ticket_asset_to_declared_reentry_vector or start_uses_admitted_route_contract_for_diagnostic_override or start_uses_admitted_target_truth_for_start_intent or start_rejects_unpublished_ticket_asset_handle or start_rejects_backlog_ticket_asset_handle or start_rejects_ticket_asset_without_published_route_contract or ticket_asset_start_carries_ticket_execution_context_into_manifest_prompt or new_execution_contract_supersedes_previous_admitted_contract'`
  - `12 passed, 73 deselected`
- `test_odd_sdlc_installation.py -k 'install_exposes_public_odd_sdlc_start_contract or install_exposes_public_odd_sdlc_graph_function_and_asset_targets or install_start_routes_ticket_asset_without_manual_upstream_edit or default_claude_manifest_declares_domain_dispatch_timeout or install_explicit_asset_start_also_stops_at_published_constitutional_fh_gate'`
  - `5 passed, 29 deselected`

## Closure Note

This ticket closes on the current `odd_sdlc` source line because the public
start boundary now consumes one published homeostatic carrier story across the
full closure surface named in the ticket:

- `gaps` publishes the governing homeostatic and constitutional truth
- public `start(next)` stops fail-closed at the published `pending_fh` head
  gate with no admission or constructive run events
- explicit public `graph_function:` and `asset:` starts consult the same
  published carrier family before admission rather than falling through a
  rival direct admission path
- post-fix installed comparison proves the same public `start(next)` entry
  point behaves differently only when the published carrier differs
- sandbox forensic proof now checks both positive and negative event-lawfulness
  instead of accepting traversal success alone

Adjacent transport-salvage and retry/recovery concerns remain separate
residual boundaries unless a future installed line reproduces them as part of a
new source-carrier defect.

Design reconciliation:

- `PROMPT_CONTEXT_CARRIAGE.md` now records that execution-contract admission is
  conditional on the homeostatic constitutional gate clearing
- `HOMEOSTATIC_GAP_TRIAGE_AND_INTENT_RENEWAL.md` now names the public
  `start --target next` pre-dispatch gate explicitly
- `GAP_ANALYSIS_DOSSIER.md` now treats public `start --target next` as another
  dossier consumer beside `gaps` and `query-domain`

Scoped-publication hardening:

- `gaps --scope work_key:<id>` now publishes a scope-owned dossier carrier
  instead of overwriting the workspace-global dossier register
- workspace `query-domain` and workspace `start(next)` continue to consume the
  workspace dossier carrier explicitly
- source proof now covers the publication hazard directly by showing that a
  scoped `gaps(...)` publication does not poison later workspace
  `query-domain` or workspace `start(next)` truth

Explicit public-start prerequisite hardening:

- explicit `graph_function:` and `asset:` starts no longer use the published
  head-gap carrier only for the `pending_fh` special case
- they now consume the same published head-gap resolution family as `next`
  for pre-admission truth, which means:
  - unpublished or stale public gap carriers fail closed before admission
  - published `pending_fh` still fails closed before admission
  - once the published prerequisite is lawful, explicit target resolution
    continues through the published start-target catalog or asset-ownership
    index rather than a controller-side shortcut
- source proof now covers both edges of that boundary:
  - explicit starts fail closed before any published gap carrier exists
  - explicit starts still resolve lawfully after published carrier refresh and
    constitutional approval
- install proof now no longer encodes the old fresh-install shortcut for
  explicit starts; explicit install starts are repriced to publish and clear
  the governing head constitutional gate before proving admitted traversal

Residual open review scope before closure:

- prove the installed substrate under review contains the post-fix start-gating
  carrier path
- add or reprice one sandbox-facing proof for the same event-lawfulness rule
- finish the remaining checklist review items around query/read-model
  storytelling and multiplicity review guidance
- split out transport-salvage and retry/recovery defects if they still
  reproduce on the post-fix installed line
