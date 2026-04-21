# REVIEW: T-023 Source-Carrier — Reviewer Handoff Answers

**Author**: claude
**Date**: 2026-04-20
**Addresses**: T-023 active
(`.ai-workspace/tickets/active/T-023-admit-ticket-shaped-execution-contracts-and-log-them-before-work-executes.md`),
T-022 active dependency
(`.ai-workspace/tickets/active/T-022-publish-gap-analysis-dossier-for-operator-review-and-prompt-consumption.md`),
and the five reviewer-handoff focus questions
**Status**: Draft — commentary, not ratified

## Summary

The source-carrier migration has landed materially. The admitted
`execution_contract_surface` now writes a register + context, emits the full
drafted → admitted → (superseded) event chain, supersedes prior admitted
contracts by content hash, and is read directly by prompt/manifest
provenance. Backlog ticket leakage is gated at four layers. T-023 closure is
blocked by three concrete structural items: intake normalization still lives
outside the carrier, the non-ticket `_ordinary_execution_contract` path
silently collapses the change-class surface, and the graph-traversal edge for
admission is declared but `selection_visible: False`. T-022 remains correctly
downstream-open because `gap_dossier.py` does not yet cite the admitted
`contract_id`.

Findings below describe current reality. Recommendations are separated.

---

## Analysis

### Q1 — Is `app.start()` still too authoritative?

Narrower than the handoff suggests, but not yet neutral.

**What `app.start()` owns after the landed work**
(`build_tenants/python/code/odd_sdlc/app.py:872-946`):

1. `_resolve_start_target(app, target)` at app.py:884 — turns raw operator
   phrasing into a `ResolvedOddStartTarget`.
2. `admit_execution_contract_surface(...)` at app.py:886 — the single
   admission callsite in the entire repo.
3. `_start_target_from_execution_contract(execution_contract)` at app.py:898
   — re-derives resolved target from the admitted contract.
4. `_module_with_injected_target_job(...)` and `diagnostic_edge_override`
   plumbing at app.py:906-918 — applies the admitted `reentry_vector`.

The admission **event** chain and **validation** live in
`execution_contract.py` (drafted → admitted → rejected → superseded).
`app.start` does not own that law.

**What `app.start` still owns that the carrier could own**:

- `_resolve_start_target` is OUTSIDE the carrier. Intake normalization (raw
  target string → `ResolvedOddStartTarget`) runs before admission and is
  consumed by admission as input. Anything executable asserts that the
  carrier is the lawful-admission boundary, but the carrier does not own
  "operator phrase → resolved target" derivation; `app.start` does.
- `_start_target_from_execution_contract` lives in app.py, not the carrier
  module.
- `_run_start_until_converged` at app.py:963 is correctly
  admission-inheriting — no re-admit in the converged loop. One callsite is
  preserved. Good.

**Graph-traversal shape**:
`GF_DERIVE_EXECUTION_CONTRACT` and `GF_ADMIT_EXECUTION_CONTRACT` are
published in gtl_module.py:1218 and gtl_module.py:1239 but carry
`selection_visible: False` (gtl_module.py:1224, 1245). ABG does not traverse
`work_request_surface → execution_contract_surface` as a selectable edge.
Admission is a published graph function by declaration, an imperative call
by behavior. The handoff's phrasing "the upstream admission step is not yet
graph-traversed end-to-end" is confirmed.

### Q2 — Is the `execution_contract_surface` payload complete?

**Ticket path is complete.** `_ticket_execution_contract` at
execution_contract.py:153 carries source_kind, ticket_id, ticket_title,
ticket_status, ticket_category, change_class, re_entry_point,
affected_boundary, target_truth (with normalized `route_contract`),
superseded_truth, closure_law, evaluation_criteria,
non_closure_conditions, proof_surface, migration_declaration,
migration_checklist, required_direction, acceptance. That is all six first-
class admission fields TICKET_METHOD names, plus migration-declaration and
acceptance.

**Ordinary path is incomplete.** `_ordinary_execution_contract` at
execution_contract.py:109-150 hardcodes:

- `ticket_category: "ordinary"`
- `change_class: "realization_refactor"`
- `re_entry_point: "realization_surface"`
- a fixed `affected_boundary`, `closure_law`, `evaluation_criteria`,
  `non_closure_conditions`, and `proof_surface`.

Every non-ticket operator start is silently reframed as
`realization_refactor / realization_surface`. An operator cannot emit a
`goal_reprice`, `intent_reprice`, `product_reprice`, `requirement_reprice`,
or `design_reframe` admission without first filing a ticket. This is a
structural collapse of the class surface at the admission boundary — it
violates the spirit of `superseded_truth: work begins from raw operator
phrasing...` because the non-ticket admission *replaces* raw phrasing with
*fixed* phrasing. That is the same defect in a different direction.

**Missing from both paths**: none of the admission fields TICKET_METHOD
names (`admit_source_carrier`, `admitted_contract_id`, `admission_event_id`,
`admission_evaluator`, `admission_proof`, `admission_checkpoint`) appear on
the admitted contract itself. The carrier generates a `contract_id` and
emits events, but the admission *event* id is not written back onto the
contract payload — consumers that want the admission event id must go scan
`events.jsonl` by aggregate_id. This is a self-link gap, not a correctness
gap.

### Q3 — Downstream consumers still reconstructing basis?

Converted consumers read the admitted carrier directly:

- `.genesis/genesis/binding.py:1879 _dispatch_provenance` — reads
  `.ai-workspace/runtime/odd_sdlc-execution-contract.json` and rejects
  non-admitted status at line 1873.
- `.genesis/genesis/binding.py:1906 _load_active_execution_contract_prompt_context`
  — reads the admitted markdown context.
- `.genesis/genesis/binding.py:1489` — stamps
  `dispatch_identity["execution_contract_id"] = contract_id` onto manifest
  identity.
- `odd_sdlc/prompt_template.py:32` — section `execution_contract_context`
  with marker `[ADMITTED EXECUTION CONTRACT]` is a first-class template
  slot.
- `odd_sdlc/workspace_assets.py:26,51,108,229,312-315` — publishes
  `execution_contract_surface` as a first-class workspace asset with a
  content marker. Query domain surfaces it as a read-model.

**Unconverted / not-yet-linked consumers**:

- `odd_sdlc/gap_dossier.py` — no reference to `execution_contract`,
  `contract_id`, or `admitted` anywhere. The dossier uses triage/observation
  /route_binding/constitutional event_ids (gap_dossier.py:57-80) but does
  not link back to the admitted `contract_id`. This is not a raw-phrasing
  leak — it is a one-truth-link gap, and it is exactly the T-022 downstream
  seam. T-022 closure should add `contract_id` provenance to every dossier
  entry.
- `odd_sdlc/query.py`, `odd_sdlc/query_contract.py` — no reference to
  `execution_contract`. Query domain surfaces the carrier asset
  (workspace_assets.py registry) but does not join dossier/gap rows to it.
- `odd_sdlc/app.py:795-865` (`_build_gap_surface`) — does not propagate
  `contract_id` into the gap payload.

**No raw-phrasing reconstruction was found in any downstream module.**
`gap_dossier`, `query`, `repair_frontier`, `constructor`, and
`normalization` do not read ticket frontmatter or body directly
(grep-confirmed: `load_work_item_ticket_surface`, `_parse_ticket`,
`triaged_work_item_assets` → no hits in those modules). The remaining
downstream work is about linking, not reconstruction.

### Q4 — Backlog / non-admitted ticket leakage?

Four-layer defense is in place and all four layers are exercised:

1. `work_item_routing.py:156` — `work_item_route_contract_from_asset`
   returns None unless `ticket_status in STARTABLE_WORK_ITEM_STATUSES =
   {"active"}`.
2. `app.py:333` — `_published_asset_ownership_index` drops any asset whose
   `ticket_status != "active"` even if a stale route_contract leaks through.
3. `app.py:_resolve_start_target` (line 443) — raises `unknown or
   non-start-addressable published asset handle` when the asset is not in
   the ownership index. Test coverage:
   `test_start_rejects_backlog_ticket_asset_handle` at
   `test_odd_sdlc_first_slice.py:1219`.
4. `execution_contract.py:246 _validate_execution_contract` — re-checks
   `ticket_status not in STARTABLE_WORK_ITEM_STATUSES` and rejects the
   contract (emits `execution_contract_rejected` and raises).

Backlog tickets remain VISIBLE as `work_request_surface` evidence via
`triaged_work_item_assets` at work_item_routing.py:177 — correctly scoped
to evidence only, no `route_contract`, no `reentry_vector`. This matches
the handoff's "backlog tickets are now visible as work_request_surface
evidence but are no longer start-addressable."

**I found no remaining path where backlog or non-admitted ticket state
reaches executable truth.**

### Q5 — Proof-set coverage of source-carrier seams

Covered (`test_odd_sdlc_first_slice.py`):

- Full real-path admission writes register + context and stamps prompt
  template + manifest provenance:
  `test_ticket_asset_start_carries_ticket_execution_context_into_manifest_prompt`
  (line 1234). This is the one test that exercises the real
  `admit_execution_contract_surface` end-to-end.
- Supersede chain: drafted → admitted → drafted → superseded → admitted,
  with `supersedes_contract_id` linkage:
  `test_new_execution_contract_supersedes_previous_admitted_contract`
  (line 1307, events asserted at line 1342-1350).
- Backlog rejected at intake: line 1219.
- Unpublished ticket rejected at intake: line 1205.
- Query domain exposure: `test_query_domain_publishes_triaged_work_item_assets`
  (line 990) and `test_query_domain_keeps_backlog_ticket_visible_but_not_start_addressable`
  (line 1016).
- GTL publication shape: lines 590-609 (both `derive` and `admit` graph
  functions assert `selection_visible: False`, `function_kind:
  odd_runtime_source_graph_function`, and the carrier/source asset
  declarations).

Missing proof surfaces:

1. **No test for `_ordinary_execution_contract` path.** `source_kind:
   operator_request` has zero hits in the test file. The non-ticket
   admission is unproven. Given Q2's finding that this path silently
   collapses the change-class surface, this is the highest-value missing
   test.
2. **No test for `execution_contract_rejected` event.** The validator
   (execution_contract.py:236-258) can reject on missing `closure_law`,
   missing `evaluation_criteria`, missing `proof_surface`, non-startable
   ticket status, missing route_contract, or (for
   `implementation_migration`) missing Migration Declaration / Checklist /
   non-closure conditions. The raise path + event emit + register
   write-through are unexercised.
3. **No test pinning `_load_active_execution_contract` status-guard at
   binding.py:1873.** If a stale register lingers with status `drafted` or
   `rejected`, `_dispatch_provenance` silently returns `{}`. That is
   correct behavior but unproven.
4. **Two tests still MOCK admission**
   (`test_start_uses_admitted_route_contract_for_diagnostic_override` at
   1095 and `test_start_uses_admitted_target_truth_for_start_intent` at
   1150) via `_fake_admit_execution_contract_surface`. These directly match
   the migration-checklist item "tests proving mixed old/new behavior are
   removed or repriced" — they should either be repriced to real admit
   calls or be explicitly retained as admission-decoupled unit tests with
   that justification documented.
5. **No graph-traversal proof.** ABG does not traverse
   `work_request_surface → execution_contract_surface` as a real edge. This
   is the structural T-023 closure item.
6. **No downstream-dossier proof citing `contract_id`.** `gap_dossier.py`
   is not yet under this proof. Correctly out of scope for T-023; in scope
   for T-022.

---

## Recommended Action

These are recommendations, not decisions. Separate them into T-023 closure
items and T-022 closure items.

### For T-023 to close

1. **Move `_resolve_start_target` into the carrier.** Make
   `derive_execution_contract_surface` accept `raw_target`, `scope`, and
   `workspace_root` and internally call the intake normalization. After
   this, `app.start` becomes:

   ```python
   contract = admit_execution_contract_surface(
       workspace_root=..., stream=..., raw_target=target, scope=scope, ...
   )
   intent = StartIntent.from_admitted_contract(contract)
   ```

   This makes the carrier the only lawful intake → admission boundary.

2. **Fix `_ordinary_execution_contract` or delete it.** Either accept
   explicit `ticket_category`, `change_class`, `re_entry_point` from the
   operator start call (and validate them against the published
   change-class enum), or require ticket-backed starts for any non-default
   class. Silently re-framing every non-ticket start as
   `realization_refactor / realization_surface` is the same defect that
   T-023 was written to remove.

3. **Flip `selection_visible` to `True` for `GF_DERIVE_EXECUTION_CONTRACT`
   and `GF_ADMIT_EXECUTION_CONTRACT`**, or add a ticket/sub-ticket
   explicitly stating that admission remains an app-level imperative call
   and is published as a graph function for declaration only. The current
   state (published but non-traversed) is ambiguous.

4. **Add `admission_event_id` to the contract payload.** When
   `publish_runtime_event` returns an event id, stamp it onto the contract
   before writing the register. Consumers can then link admission events
   without scanning `events.jsonl` by `aggregate_id`.

5. **Add the missing proofs** (Q5 items 1–4 above). Especially the rejected-
   event test — it pins the `_validate_execution_contract` surface and
   proves the write-through-then-raise behavior.

### For T-022 to close (downstream-dependent)

1. After T-023 closes, add `contract_id` and `contract_register_path` to
   every dossier entry in `build_gap_dossier_register` at
   `gap_dossier.py:83`. This closes the one-truth link.
2. Add a dossier proof asserting the admitted `contract_id` matches the
   dossier entry citation.

### Closure-ordering read

The handoff's honest summary — "T-023 is not closed because the app
boundary still owns admission; T-022 remains downstream-open by law and
should not close first" — remains correct. Items 1 and 3 above are the
material T-023 blockers. Item 2 is a correctness blocker for the ordinary
path. The checklist items on T-023 ("old truth path removed / mixed-state
behavior not accepted / tests repriced / wording reconciled") cannot be
marked done while `app.start` still owns intake resolution and the ordinary
path silently re-classes.
