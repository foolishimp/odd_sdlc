---
id: B-042
title: Stop governance surfaces from drifting into builder-strategy law
type: bug
ticket_category: implementation_migration
migration_strategy: inside_out_hard_break
status: completed
goal: lawful-governance-and-observability-boundary-over-builder-lanes
change_intent: Rebind the odd_sdlc homeostatic and builder-context family so odd_sdlc remains a governance and observability product over GTL/ABG and over the target builder, not a replacement agentic builder. The current tree publishes builder-facing strategy law (`prefer deepening`, `widen only when`, `inspect shallow work first`) and derives fixed-vector strategy (`deepen_realization`) from framework-owned shallowness heuristics. The fix is to demote those strategy surfaces and keep only lawful governance truth: observation, preservation pressure, unmet requirement pressure, lawful edit frontier, explicit route eligibility, and prior-turn continuity.
change_class: design_reframe
re_entry_point: design_surface
affected_boundary: odd_sdlc builder-governance boundary across `build_tenants/python/code/odd_sdlc/triage.py`, `runtime_contexts.py`, `repair_frontier.py`, `analysis.py`, `gtl_module.py`, the published builder-context markdown surfaces under `.ai-workspace/runtime/`, and the ratified design text that currently authorizes or describes those prompt/control frames
priority: high
triaged_at: 2026-04-23
created_at: 2026-04-23
updated_at: 2026-04-23
dependencies: B-041 completed (shared realization-edge route and builder-continuity boundary; the governance cleanup remains clean after B-041's continuity landing); B-037 active (test-lane realization family may consume the same repair-frontier context)
intake_source: source review on 2026-04-23 over `triage.py`, `runtime_contexts.py`, `repair_frontier.py`, `analysis.py`, `gtl_module.py`, `build_tenants/python/design/fp/REALIZATION_DEEPENING_CONTROL_FRAME.md`, and `build_tenants/python/design/fp/DETERMINISTIC_REPAIR_FRONTIER.md`, grounded against `specification/INTENT.md`, `specification/PRODUCT.md`, `specification/requirements/03-runtime-governance.md`, `specification/requirements/11-odd-sdlc-homeostatic-gap-triage-and-intent-renewal.md`, `TICKET_METHOD.md`, and `DESIGN_MODULE_METHOD.md`
target_truth: odd_sdlc publishes governance and observability surfaces, not builder-strategy law. It may publish current gap state, preservation pressure, unmet requirement ids, lawful edit frontier, lawful proof frontier, explicit route eligibility, and prior-turn continuity. It must not publish imperative builder strategy such as `prefer deepening`, `widen only when`, `inspect shallow work first`, or fixed-vector `deepen_realization` chosen from framework-owned shallowness heuristics. If repo-law still wants to preserve a deepening preference, that preference must be carried as governance truth or route eligibility over current state, not as builder-facing imperative prompt law. The builder or substrate remains the agentic assessment surface.
superseded_truth: the current tree publishes a realization-deepening control frame and a deterministic repair-frontier context that explicitly instruct builders to inspect shallow work first, prefer deepening existing artifacts, and widen only under named conditions. The current triage route policy also derives `fixed_vector = "deepen_realization"` from framework-owned shallowness findings. That means odd_sdlc is not just publishing governance truth; it is prescribing builder strategy and partially recreating the builder's own judgment.
closure_law: this migration closes only when (1) odd_sdlc no longer publishes builder-facing imperative strategy law in the named runtime-context and repair-frontier surfaces; (2) triage no longer emits `deepen_realization` or equivalent builder-strategy vectors from framework-owned shallowness heuristics; (3) the GTL builder lanes consume only lawful continuity and observability contexts from odd_sdlc rather than strategy law; (4) any remaining deepening-vs-expansion preference is expressed as governance/read-model truth or explicit route eligibility, not as imperative builder instruction; (5) repo-law wording across ticket, design, and requirements is reconciled so closure is not claimed while the written law still authorizes the old strategy-bearing shape; and (6) no new rival agent-judgment surface is introduced in the form of retry budgets, turn counters, gain rules, depth scores, or similar framework-owned assessments.
evaluation_criteria:
  - `triage.py` publishes route and re-entry truth without deriving builder-strategy vectors from shallowness findings
  - `runtime_contexts.py` and the published `.ai-workspace/runtime/*.md` files carry continuity and governance truth, not imperative repair strategy
  - `repair_frontier.py` exposes current preservation pressure, unmet ids, and lawful edit/proof frontier without telling the builder how to repair
  - `gtl_module.py` injects only lawful governance/continuity contexts into builder lanes
  - the active design text no longer describes odd_sdlc as the owner of builder strategy in this slice
  - if `REQ-F-ODDSDLC-035` AC-3 or related design text is currently interpreted as builder-facing imperative law, that interpretation is repriced or narrowed before closure
  - no framework-owned retry budget, turn counter, monotone-depth rule, gain rule, or equivalent replacement agent surface appears in the bounded slice
  - source/install proof lanes demonstrate continuity and observability still work after the strategy law is removed
non_closure_conditions:
  - any named odd_sdlc prompt/context surface still contains imperative builder strategy such as `prefer deepening`, `widen only when`, `inspect shallow`, `repair in place before widening`, or equivalent
  - `triage.py` still emits `deepen_realization` or equivalent builder-strategy fixed vectors from local shallowness findings
  - odd_sdlc removes the old strategy text but replaces it with a different framework-owned agent-assessment surface such as retry budgets, turn counters, gain rules, or depth scores
  - closure is claimed while `gtl_module.py` still injects strategy-bearing contexts into realization lanes
  - closure is claimed from source edits alone while design/requirement wording still authorizes the old shape
  - closure is claimed from prompt softening or wording tweaks while the same semantic center remains alive in route policy, runtime contexts, or downstream projections
proof_surface:
  - source structural proof over the named code/design files
  - source proof that triage route emission no longer carries `deepen_realization` from local shallowness
  - source proof that published runtime contexts and repair-frontier prompt context no longer contain builder-strategy directives
  - installation proof that builder continuity still carries prior-turn state and lawful frontier data after strategy text is removed
  - query/dossier proof that governance/read-model surfaces still expose preservation pressure and unmet ids without reconstructing builder strategy
  - negative proof that no new rival agent-judgment surface was introduced in the bounded slice
---

## Trace Boundary

This ticket reads current repo-law truth from:

- `specification/INTENT.md`
- `specification/PRODUCT.md`
- `specification/GOALS.md`
- `specification/requirements/03-runtime-governance.md`
- `specification/requirements/11-odd-sdlc-homeostatic-gap-triage-and-intent-renewal.md`
- `specification/requirements/10-odd-sdlc-software-domain-buildout.md`

This ticket reads current method-law truth from:

- `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md`

## Observed Strategy Drift (Code Review 2026-04-23)

Direct source inspection on the current tree returns concrete line-level evidence that `odd_sdlc` publishes imperative builder strategy and derives builder-strategy vectors from local heuristics. The findings below are the deepening evidence for the migration; downstream checklists cite them by line.

**D1 — `triage.py` shallowness heuristic emits `deepen_realization` builder-strategy vector**

- `build_tenants/python/code/odd_sdlc/triage.py:240-288` — `_scan_file_for_shallow_findings(path)` scans realization artifacts and tags lines matching `???` (line 249, `finding_kind="missing_implementation"`), `_TRIVIAL_PASSTHROUGH_RE` (line 262, `finding_kind="trivial_passthrough"`), and `_HARDCODED_SUCCESS_RE` (line 275, `finding_kind="hard_coded_success"`)
- `build_tenants/python/code/odd_sdlc/triage.py:291-307` — `_collect_shallow_findings` walks `asset_path(workspace_root, asset_id)` under `"code_surface"` or `"test_module_surface"` and aggregates up to `_SHALLOW_FINDING_LIMIT` entries
- `build_tenants/python/code/odd_sdlc/triage.py:597-602` — for `reentry_layer == "code"`: `fixed_vector = "deepen_realization" if shallow else "repair_output_contract"` (the shallowness predicate at line 597-601 checks `finding.get("finding_kind") in {"missing_implementation", "trivial_passthrough", "hard_coded_success"}`)
- `build_tenants/python/code/odd_sdlc/triage.py:604-609` — same pattern for `reentry_layer == "test"`: `fixed_vector = "deepen_realization" if shallow else "realize_missing_tests"`
- `build_tenants/python/code/odd_sdlc/triage.py:836-860` — the triage block for `delta > 0 and shallow_findings` assigns `framework_condition: "shallow"` (line 840), publishes `asset_findings: shallow_findings` as authoritative state (line 848), and emits `"extensions": {"deepening_preferred_over_expansion": True}` (line 859) — a framework-owned preference, not operator-observable governance truth
- calls `_assign_route_proposal` at line 861, which consumes `_build_fixed_route_proposal` at line 702 and writes `route_proposal.fixed_vector = "deepen_realization"` into the published triage

**D2 — `runtime_contexts.py` publishes the realization-deepening strategy frame as a runtime context**

- `build_tenants/python/code/odd_sdlc/runtime_contexts.py:13-15` — `REALIZATION_DEEPENING_CONTEXT_PATH = Path(".ai-workspace/runtime/odd_sdlc-realization-deepening-control-frame.md")`
- `build_tenants/python/code/odd_sdlc/runtime_contexts.py:31-35` — `publish_runtime_contexts` copies `design/fp/REALIZATION_DEEPENING_CONTROL_FRAME.md` to the workspace runtime path under label `"realization_deepening_control_frame"`, making it a first-class odd_sdlc publication

**D3 — `REALIZATION_DEEPENING_CONTROL_FRAME.md` is six lines of imperative builder strategy**

- `build_tenants/python/design/fp/REALIZATION_DEEPENING_CONTROL_FRAME.md:5-10` — the entire file body after the header is one bullet list of builder directives:
  - L5: "Existing files and existing module groups are obligations, not proof of completion." (borderline — phrased as observation, but functions as instruction)
  - L6: "Inspect the current realization first and identify shallow or placeholder work in existing artifacts before expanding laterally." (imperative)
  - L7: "Treat placeholder bodies, identity pass-throughs, constant-success paths, unused inputs, and unwired validations as unresolved realization." (imperative classification)
  - L8: "Prefer deepening or correcting existing artifacts when the current requirement family is already present but shallow." (imperative preference)
  - L9: "Add new files or new groups only when the gap is genuinely uncovered capability rather than incomplete existing realization." (imperative precondition on builder action)
  - L10: "When deterministic evidence names specific requirement ids or files, repair those in place before widening the surface area." (imperative ordering)

**D4 — `repair_frontier.py` prompt context injects imperative "Global Law" block**

- `build_tenants/python/code/odd_sdlc/repair_frontier.py:248-257` — `build_repair_frontier_prompt_context` emits an `"## Global Law"` header (line 253) followed by four imperative directives (lines 254-257):
  - "inspect the current target asset first and treat existing structure as an obligation, not a blank slate"
  - "preserve satisfied requirement ids and the existing files, sections, and tests that already carry them"
  - "deepen or correct current carriers before widening laterally"
  - "widen only when the named frontier has no existing carrier for the unmet requirement ids"
- `build_tenants/python/code/odd_sdlc/repair_frontier.py:129-132` — `requirements` lane `widening_conditions`: "widen only when…", "reframe upward only when…"
- `build_tenants/python/code/odd_sdlc/repair_frontier.py:155-158` — `design` lane `widening_conditions`: "widen only when…", "prefer deepening existing design surfaces before adding new design groups or lateral branches"
- `build_tenants/python/code/odd_sdlc/repair_frontier.py:184-187` — `code` lane `widening_conditions`: "widen only when…", "prefer repairing shallow or placeholder implementation in current files before adding new files or module groups"
- `build_tenants/python/code/odd_sdlc/repair_frontier.py:215-218` — `test` lane `widening_conditions`: "widen only when…", "prefer realizing missing tests and run-archive evidence for current ids before widening to unrelated test surface"
- these `widening_conditions` strings are embedded in the JSON register at lines 129, 155, 184, 215 and re-emitted into the markdown prompt context at lines 283-284 (via `widening_conditions = [f"  - {condition}" for condition in lane.get("widening_conditions", ())]`)
- the governance-legitimate fields on the same lane dicts (`unmet_requirement_ids`, `preservation_requirement_ids`, `lawful_edit_frontier`, `lawful_proof_frontier`) are *not* drift — they are observability truth; only the `widening_conditions` strings and the `"## Global Law"` header are the drift surface

**D5 — `DETERMINISTIC_REPAIR_FRONTIER.md` names odd_sdlc as owner of builder-facing law**

- `build_tenants/python/design/fp/DETERMINISTIC_REPAIR_FRONTIER.md:20-22` — "The repair frontier is a builder-facing read model."
- `build_tenants/python/design/fp/DETERMINISTIC_REPAIR_FRONTIER.md:50-52` — "The markdown context is the builder-facing prompt carrier injected into the constructive lanes."
- `build_tenants/python/design/fp/DETERMINISTIC_REPAIR_FRONTIER.md:86-91` — closure rule "builders no longer depend on prompt discretion alone for scope control" and "widening beyond the published frontier is justified by one named widening condition rather than by ambient rewrite behavior" — this is explicit framework ownership of builder scope control

**D6 — `gtl_module.py` injects both strategy contexts into realization and realized-test builder lanes**

- `build_tenants/python/code/odd_sdlc/gtl_module.py:38` — `from .repair_frontier import REPAIR_FRONTIER_CONTEXT_PATH`
- `build_tenants/python/code/odd_sdlc/gtl_module.py:40` — `from .runtime_contexts import ... REALIZATION_DEEPENING_CONTEXT_PATH as _REALIZATION_DEEPENING_CONTEXT_PATH`
- `build_tenants/python/code/odd_sdlc/gtl_module.py:422-425` — `_repair_frontier_context = _workspace_context("odd_sdlc_repair_frontier", REPAIR_FRONTIER_CONTEXT_PATH)` registers the strategy context as a builder-lane injection
- `build_tenants/python/code/odd_sdlc/gtl_module.py:430-433` — `_realization_deepening_context = _workspace_context("odd_sdlc_realization_deepening_control_frame", _REALIZATION_DEEPENING_CONTEXT_PATH)`
- `build_tenants/python/code/odd_sdlc/gtl_module.py:434-437` — `_requirement_builder_contexts = (_requirement_closure_context, _repair_frontier_context,)` — requirement lanes receive the repair-frontier strategy
- `build_tenants/python/code/odd_sdlc/gtl_module.py:438-442` — `_realization_builder_contexts = (_requirement_closure_context, _repair_frontier_context, _realization_deepening_context,)` — realization lanes receive both strategy contexts
- `build_tenants/python/code/odd_sdlc/gtl_module.py:443-447` — `_realized_test_builder_contexts = (_requirement_closure_context, _repair_frontier_context, _realized_test_source_context,)` — realized-test lanes receive the repair-frontier strategy
- edge registrations that consume `_realization_builder_contexts` (and therefore the two strategy contexts): `gtl_module.py:1042, 1058, 1098` (includes the realization edges that B-041 addresses)
- edge registrations that consume `_realized_test_builder_contexts`: `gtl_module.py:1114`
- edge registrations that consume `_requirement_builder_contexts` (receiving the repair-frontier strategy context only): `gtl_module.py:908, 918, 933, 948, 987, 1003, 1018, 1074, 1137`

**D7 — `analysis.py` is the publication pipeline that makes all of the above authoritative**

- `build_tenants/python/code/odd_sdlc/analysis.py:27-33` — imports `REPAIR_FRONTIER_CONTEXT_PATH`, `REPAIR_FRONTIER_REGISTER_PATH`, `build_repair_frontier_prompt_context`, `build_repair_frontier_register`, and `publish_runtime_contexts`
- `analysis.py:91-94` — published-path classifier returns `"repair_frontier_register"` / `"repair_frontier_prompt_context"` as named artifact kinds, elevating them into the analysis manifest as first-class publications

**Boundary classification of what's found**

| Surface | Classification | Action |
| --- | --- | --- |
| `triage._scan_file_for_shallow_findings` / `_collect_shallow_findings` | framework-owned builder-heuristic scan | remove or demote to non-routing observability |
| `triage.py:602, 609` — `fixed_vector = "deepen_realization"` | framework-owned builder-strategy vector | remove |
| `triage.py:859` — `"deepening_preferred_over_expansion": True` | framework-owned builder preference | remove or demote to pure observation label |
| `REALIZATION_DEEPENING_CONTROL_FRAME.md` L5-10 | imperative builder strategy | remove the document, or rewrite as non-imperative continuity/preservation observation only |
| `repair_frontier.py:253-257` `"## Global Law"` block | imperative builder strategy in prompt context | remove the block; keep the per-lane id/frontier publication |
| `repair_frontier.py:129, 155, 184, 215` `widening_conditions` strings | imperative builder strategy embedded in register | remove the strings; replace with neutral route-eligibility or preservation-pressure labels if preserved at all |
| `DETERMINISTIC_REPAIR_FRONTIER.md:20-22, 50-52, 86-91` | design text authorizing builder-facing law | rewrite so the frontier is a governance read model consumed by the builder on its own initiative, not a builder-facing law owned by odd_sdlc |
| `gtl_module.py:430-433, 441` realization_deepening_context injection | framework-owned strategy injection | remove |
| `gtl_module.py:422-425, 436, 440, 444` repair_frontier_context injection | mixed — carrier for legitimate governance state AND strategy prose | either remove the strategy prose from the prompt emission (preferred) or remove the injection and let the builder consume the register directly |
| `repair_frontier.py` `unmet_requirement_ids` / `preservation_requirement_ids` / `lawful_edit_frontier` / `lawful_proof_frontier` | legitimate governance/observability | **retain** |
| `analysis.py` publication pipeline | legitimate — publishes whatever the upstream law defines | retain, regenerates from neutralized sources |

## Migration Declaration

- old_truth_path: odd_sdlc publishes builder-strategy law in runtime contexts and repair-frontier prompt carriers, and triage emits builder-strategy fixed vectors from framework-owned shallowness heuristics
- new_truth_path: odd_sdlc publishes governance and observability truth only; builder contexts carry continuity, preserved structure, unmet pressure, lawful frontiers, and explicit route eligibility, while builder strategy remains outside odd_sdlc
- producers_old:
  - `build_tenants/python/code/odd_sdlc/triage.py`
  - `build_tenants/python/code/odd_sdlc/runtime_contexts.py`
  - `build_tenants/python/code/odd_sdlc/repair_frontier.py`
  - `build_tenants/python/code/odd_sdlc/analysis.py`
  - `build_tenants/python/code/odd_sdlc/gtl_module.py`
  - `build_tenants/python/design/fp/REALIZATION_DEEPENING_CONTROL_FRAME.md`
  - `build_tenants/python/design/fp/DETERMINISTIC_REPAIR_FRONTIER.md`
- producers_new:
  - route and re-entry publication in `triage.py` without builder-strategy vectors
  - neutral continuity/governance runtime contexts in `runtime_contexts.py`
  - repair-frontier register and prompt context in `repair_frontier.py` reduced to current-state and lawful-frontier truth
  - GTL context injection in `gtl_module.py` limited to lawful governance/continuity contexts
  - reconciled design text that names the same law
- consumers_old:
  - realization builder lanes consuming `_realization_deepening_context`
  - requirement, realization, and realized-test lanes consuming `_repair_frontier_context`
  - operator/query interpretation of triage route state where it currently implies builder strategy
- consumers_new:
  - realization builder lanes consuming continuity and governance context only
  - operator/query surfaces consuming route eligibility and preservation pressure without reconstructing strategy
  - source/install proofs over the same neutralized context family
- derived_surfaces:
  - `.ai-workspace/runtime/odd_sdlc-realization-deepening-control-frame.md`
  - `.ai-workspace/runtime/odd_sdlc-repair-frontier.json`
  - `.ai-workspace/runtime/odd_sdlc-repair-frontier.md`
  - triage/gap dossier/query projections that currently expose route state

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

## Functional Review Criteria

1. Did the change remove builder-strategy meaning from odd_sdlc and leave only governance/observability truth?
2. Did the change demote a semantic center, or merely soften its wording while leaving the same strategy law alive?
3. Are route, preservation, and frontier surfaces readable as current-state publication rather than imperative builder instruction?
4. Did the change avoid replacing one strategy layer with another framework-owned agent-assessment layer?
5. Are effects at the edge, with publication and injection consuming admitted state rather than deciding builder law procedurally?
6. Do downstream consumers read the same governance truth directly, or rebuild strategy from prompt text, route strings, or fallback heuristics?
7. Are design and requirement surfaces reconciled to the new law rather than silently contradicting the code?
8. Does the resulting slice keep odd_sdlc as governance/runtime over the target builder rather than as a replacement builder policy engine?

## Evaluator Gate

### 1. Authority Seam Closure

- [x] one authoritative publication surface names governance truth for the affected lane, and downstream prompt/report/query surfaces consume that truth rather than inventing it
- [x] deleting or neutralizing the old strategy-bearing source causes explicit fail-closed behavior or empty publication, not silent reconstruction of the same strategy through triage, prompt context, or query prose
- [x] route, continuity, and frontier truth remain published after the strategy drift is removed
- [x] no controller-side reconstruction turns observability fields back into imperative builder law

### 2. Essential Carrier Consolidation

- [x] the migration reuses the existing route/frontier/context carrier families rather than creating a new peer "strategy policy" family
- [x] no budget/counter/gain-score/depth-score replacement family is introduced as a new strategy seam
- [x] any retained deepening-vs-expansion information stays subordinate to existing governance/read-model carriers and is justified as route eligibility or state publication, not promoted as a peer policy carrier

### 3. Typed Enforcement After Proof

- [x] strict-lane files touched by this migration do not use `Any`, `Mapping[str, object]`, `dict[str, Any]`, `cast(...)`, or progressive dict mutation to preserve the old semantic center
- [x] non-strict files touched by this migration do not introduce new raw-dict or proxy-interface seams at the semantic center
- [x] if a publication path remains dynamically shaped at an outer boundary, one named parser/normalizer owns that ingress and downstream consumers do not repeatedly re-narrow it

## Concrete Change Inventory

This is the implementation laundry list. Closure requires either completing each item or explicitly repricing it out of this ticket before any close claim.

- [x] `build_tenants/python/code/odd_sdlc/triage.py`
  - [x] remove `deepen_realization` as a published route/fixed-vector outcome
  - [x] remove `deepening_preferred_over_expansion` and `framework_condition: "shallow"` as framework-owned builder preferences
  - [x] remove or demote `_scan_file_for_shallow_findings` / `_collect_shallow_findings` so they no longer decide route or builder strategy
  - [x] keep only route eligibility, re-entry, unmet pressure, and observability truth
- [x] `build_tenants/python/code/odd_sdlc/runtime_contexts.py`
  - [x] stop publishing `REALIZATION_DEEPENING_CONTROL_FRAME.md` as a runtime context, or rename/rewrite it so it carries non-imperative continuity/preservation observation only
  - [x] reconcile runtime-context inventory names with the new meaning
- [x] `build_tenants/python/code/odd_sdlc/repair_frontier.py`
  - [x] remove the `"## Global Law"` builder-directive block
  - [x] remove `widening_conditions` as imperative strategy text from the register and markdown context
  - [x] retain only lawful frontier and pressure truth such as `unmet_requirement_ids`, `preservation_requirement_ids`, `lawful_edit_frontier`, and `lawful_proof_frontier`
  - [x] if any deepening-vs-expansion signal remains, publish it only as neutral route eligibility or current-state evidence
- [x] `build_tenants/python/code/odd_sdlc/gtl_module.py`
  - [x] remove `_realization_deepening_context`
  - [x] rebind `_requirement_builder_contexts`, `_realization_builder_contexts`, and `_realized_test_builder_contexts` so they inject governance/continuity context only
  - [x] ensure no builder lane still consumes strategy-bearing odd_sdlc prompt law
- [x] `build_tenants/python/code/odd_sdlc/analysis.py`
  - [x] keep publication plumbing
  - [x] regenerate manifest-classified artifacts from the neutralized sources only
- [x] `build_tenants/python/design/fp/REALIZATION_DEEPENING_CONTROL_FRAME.md`
  - [x] remove the file
  - [x] or rewrite it as non-imperative rationale and stop runtime publication
- [x] `build_tenants/python/design/fp/DETERMINISTIC_REPAIR_FRONTIER.md`
  - [x] rewrite away from "builder-facing read model" / "builder-facing prompt carrier" ownership
  - [x] restate the frontier as governance/read-model publication over current state and lawful frontier
- [x] query / dossier / operator projections
  - [x] verify they do not reconstruct the removed strategy through prose, summary labels, or fallback field synthesis
- [x] test and proof lanes
  - [x] add source proof for removed strategy publication
  - [x] add install proof that continuity/frontier publication still works
  - [x] add negative proof that no replacement retry/gain/depth strategy surface appears

## Governance Publication Role Matrix

| Surface | Role | Authority |
| --- | --- | --- |
| `triage.py` route publication | authoritative governance source | may publish route eligibility, re-entry layer, unmet pressure, preservation pressure, and current-state observations; must not publish builder strategy |
| `repair_frontier.py` register | authoritative governance source | may publish current frontier truth and preserved/unmet ids; must not publish imperative repair instructions |
| `runtime_contexts.py` runtime sidecars | downstream publication | may mirror lawful continuity/governance truth; must not become a second strategy source |
| `gtl_module.py` builder-context tuples | downstream injection | may pass lawful governance/continuity carriers downstream; must not originate builder law |
| `analysis.py` manifest publications | downstream classifier | may classify generated artifacts; must not bless strategy drift by naming it as authoritative law |
| query / dossier / operator projections | downstream read models | may summarize published governance truth; must not reconstruct strategy from removed seams |

## Impacted Interface Review Checklist

- [x] `triage.py`
  Closure means route/re-entry publication remains intact while framework-owned builder strategy is gone.
- [x] `runtime_contexts.py`
  Closure means no runtime-published sidecar teaches the builder how to act; runtime context remains continuity/governance only.
- [x] `repair_frontier.py`
  Closure means the frontier is a current-state/read-model carrier, not a builder-facing law carrier.
- [x] `gtl_module.py`
  Closure means builder lanes consume only lawful governance/continuity contexts and do not receive odd_sdlc strategy doctrine.
- [x] `analysis.py`
  Closure means publication plumbing remains, but no authoritative artifact kind or manifest entry depends on strategy-bearing content.
- [x] `REALIZATION_DEEPENING_CONTROL_FRAME.md`
  Closure means the file is removed from runtime authority or rewritten as non-imperative rationale.
- [x] `DETERMINISTIC_REPAIR_FRONTIER.md`
  Closure means design text no longer names odd_sdlc as owner of builder strategy in this slice.
- [x] query / dossier / operator read models
  Closure means they summarize preserved structure, unmet ids, route eligibility, and lawful frontiers without rebuilding strategy prose.
- [x] source proof lane
  Closure means named selectors prove the strategy seam is gone and governance continuity remains.
- [x] install proof lane
  Closure means installed behavior still carries continuity/frontier truth without strategy publication.

## Proof Selector Plan

Before closure, the ticket must record exact selectors and results for each proof family below. Counts without selectors do not count as closure evidence.

- [x] structural retirement probes
  - [x] `rg -n '"deepen_realization"|deepening_preferred_over_expansion|framework_condition.*"shallow"' build_tenants/python/code/odd_sdlc/`
  - [x] `rg -n '_scan_file_for_shallow_findings|_collect_shallow_findings|_SHALLOW_SOURCE_SUFFIXES|_SHALLOW_FINDING_LIMIT|_TRIVIAL_PASSTHROUGH_RE|_HARDCODED_SUCCESS_RE' build_tenants/python/code/odd_sdlc/`
  - [x] `rg -n '"## Global Law"|inspect the current|prefer deepening|widen only when|repair.*in place before widening|inspect shallow' build_tenants/python/`
  - [x] `rg -n 'REALIZATION_DEEPENING_CONTEXT_PATH|_realization_deepening_context|realization_deepening_control_frame' build_tenants/python/code/odd_sdlc/`
- [x] source pytest selector
  - [x] record one named selector over `build_tenants/python/test_env/tests/test_odd_sdlc_*.py` proving route continuity, frontier continuity, and absence of strategy publication
- [x] install / sandbox selector
  - [x] record one named selector over installed/sandbox proof files proving the same law survives installation
- [x] negative-proof selector
  - [x] record one named selector proving no replacement retry-budget, turn-counter, gain-rule, or depth-score surface was introduced

## Drift Surface Inventory

Each checkbox is anchored to the line-cited findings under **Observed Strategy Drift** (D1–D7). A checked box asserts the drift is gone on the current tree, not intended direction.

- [x] `build_tenants/python/code/odd_sdlc/triage.py` (D1)
  - [x] `_scan_file_for_shallow_findings` (line 240) and `_collect_shallow_findings` (line 291) either removed or demoted to non-routing observation (they currently implement a framework-owned agent-judgment scan)
  - [x] `_build_fixed_route_proposal` (line 577) no longer emits `fixed_vector = "deepen_realization"` from shallowness findings — lines 602 and 609 must no longer condition the vector on `shallow`
  - [x] triage block at line 836 no longer emits `framework_condition: "shallow"` (line 840) or `"extensions": {"deepening_preferred_over_expansion": True}` (line 859); `deepening_preferred_over_expansion` is removed or demoted to a pure observability label with non-imperative semantics
  - [x] route publication still names re-entry and current route truth without prescribing builder behavior
- [x] `build_tenants/python/code/odd_sdlc/runtime_contexts.py` (D2)
  - [x] `REALIZATION_DEEPENING_CONTEXT_PATH` (lines 13-15) is removed, or renamed, or its content is replaced with a lawful non-imperative continuity/preservation observation
  - [x] `publish_runtime_contexts` (line 18) no longer copies `REALIZATION_DEEPENING_CONTROL_FRAME.md` as a runtime context under the label `"realization_deepening_control_frame"` (lines 31-35)
  - [x] published runtime-context inventory is reconciled to the new names and meanings
- [x] `build_tenants/python/code/odd_sdlc/repair_frontier.py` (D4)
  - [x] register shape exposes only `unmet_requirement_ids`, `preservation_requirement_ids`, `lawful_edit_frontier`, `lawful_proof_frontier`; `widening_conditions` (lines 129, 155, 184, 215) removed or replaced with route-eligibility labels that do not carry imperative strategy
  - [x] `build_repair_frontier_prompt_context` (line 239) no longer emits the `"## Global Law"` header (line 253) or the four imperative directives on lines 254-257
  - [x] any remaining deepening-vs-widening information is carried as governance/read-model truth (for example an `existing_carrier_refs` observability field), never as imperative law
- [x] `build_tenants/python/code/odd_sdlc/analysis.py` (D7)
  - [x] published repair-frontier context is regenerated from the neutralized source law; the analysis manifest continues to classify the publications as named artifacts but reflects the neutralized content
- [x] `build_tenants/python/code/odd_sdlc/gtl_module.py` (D6)
  - [x] `_realization_deepening_context` (lines 430-433) is removed
  - [x] `_realization_builder_contexts` tuple (lines 438-442) no longer includes a strategy-bearing context; reduced to continuity/governance contexts only
  - [x] `_repair_frontier_context` (lines 422-425) either is removed from the builder-lane tuples (lines 434-446) or retained only after the strategy text has been removed from its emission surface
  - [x] edge registrations at lines 1042, 1058, 1098 (realization lanes) and 1114 (realized-test lane) and 908, 918, 933, 948, 987, 1003, 1018, 1074, 1137 (requirement lanes) all bind to neutralized context tuples
- [x] `build_tenants/python/design/fp/REALIZATION_DEEPENING_CONTROL_FRAME.md` (D3)
  - [x] the six imperative bullets on lines 5-10 are removed; the file is removed entirely, or demoted to a non-runtime-published rationale document, or rewritten as non-imperative observation only
- [x] `build_tenants/python/design/fp/DETERMINISTIC_REPAIR_FRONTIER.md` (D5)
  - [x] lines 20-22 ("builder-facing read model"), 50-52 ("builder-facing prompt carrier injected into the constructive lanes"), and 86-91 (builder scope-control closure rule) are rewritten so the frontier is a governance read model the builder may read on its own initiative — not a builder-facing law owned by odd_sdlc

## Governance Boundary Checklist

- [x] odd_sdlc may still publish:
  - [x] preserved structure or preservation requirement ids
  - [x] unmet requirement ids or current gap pressure
  - [x] lawful edit frontier
  - [x] lawful proof frontier
  - [x] explicit route eligibility and re-entry layer
  - [x] prior-turn continuity and source references
- [x] odd_sdlc may not publish:
  - [x] imperative builder strategy (`prefer deepening`, `widen only when`, `inspect shallow work first`)
  - [x] builder-choice fixed vectors derived from local implementation heuristics
  - [x] retry budgets
  - [x] turn counters
  - [x] gain rules
  - [x] depth scores
  - [x] any equivalent framework-owned replacement for builder judgment

## Old Seam Retirement Checklist

Each check is a `rg` probe over the current tree. Retirement is asserted against concrete greppable substrings, not paraphrase.

- [x] `rg -n '"deepen_realization"' build_tenants/python/code/odd_sdlc/` returns no hits (today: `triage.py:602` and `triage.py:609`)
- [x] `rg -n 'deepening_preferred_over_expansion' build_tenants/python/code/odd_sdlc/` returns no hits (today: `triage.py:859`)
- [x] `rg -n 'framework_condition.*"shallow"' build_tenants/python/code/odd_sdlc/` returns no hits (today: `triage.py:840`)
- [x] `rg -n '_scan_file_for_shallow_findings|_collect_shallow_findings|_SHALLOW_SOURCE_SUFFIXES|_SHALLOW_FINDING_LIMIT|_TRIVIAL_PASSTHROUGH_RE|_HARDCODED_SUCCESS_RE' build_tenants/python/code/odd_sdlc/` returns no hits (today: in `triage.py`) — or they are demoted to non-routing observation with explicit justification
- [x] `rg -n 'inspect the current|prefer deepening|widen only when|repair.*in place before widening|inspect shallow' build_tenants/python/` returns no hits in runtime contexts or published markdown contexts (today: `REALIZATION_DEEPENING_CONTROL_FRAME.md:6-10`, `repair_frontier.py:254-257`, `repair_frontier.py:155-158, 184-187, 215-218`)
- [x] `rg -n '"## Global Law"' build_tenants/python/code/odd_sdlc/` returns no hits (today: `repair_frontier.py:253`)
- [x] `rg -n 'REALIZATION_DEEPENING_CONTEXT_PATH|_realization_deepening_context|realization_deepening_control_frame' build_tenants/python/code/odd_sdlc/` returns no hits, or returns only historical/demoted-documentation references with no runtime publication or builder-lane injection (today: `runtime_contexts.py:13, 34`, `gtl_module.py:40, 430-433, 441`)
- [x] no published odd_sdlc runtime context file under `.ai-workspace/runtime/` contains imperative builder strategy — sample fixture workspace check: `rg -n 'inspect|prefer|widen only|repair.*in place' <workspace>/.ai-workspace/runtime/odd_sdlc-*.md` returns no strategy hits
- [x] no GTL builder-context tuple (`_requirement_builder_contexts`, `_realization_builder_contexts`, `_realized_test_builder_contexts` in `gtl_module.py:434-447`) injects a strategy-bearing odd_sdlc context
- [x] no dossier / query / operator projection rebuilds the same strategy through prose or reconstructed fields: `rg -n 'deepen|widen only|prefer.*before'` over query-domain builders, dossier builders, and read-model projections returns no imperative strategy hits

## Requirement And Design Reconciliation Checklist

- [x] `REQ-F-RUNTIME-002` remains satisfied with the new shape and is cited explicitly in closure notes
- [x] `REQ-F-ODDSDLC-033` and `REQ-F-ODDSDLC-034` remain satisfied with observation/triage/route separation preserved
- [x] `REQ-F-ODDSDLC-035` AC-3 is reconciled:
  - [x] either retained as governance/read-model preference only
  - [x] or explicitly repriced if it is currently interpreted as builder-facing imperative law
- [x] design text no longer calls the repair frontier a builder-facing law owned by odd_sdlc
- [x] ticket wording, design wording, and requirement wording describe one consistent governance boundary

## Mixed-State Negative Proof

- [x] negative proof shows the old strategy-bearing route/context family is actually gone rather than merely renamed
- [x] negative proof shows no new retry-budget, turn-counter, gain-rule, or equivalent framework-owned assessment was introduced in the bounded slice
- [x] negative proof shows builder continuity still works after strategy text is removed
- [x] mixed old/new green tests do not count as closure evidence

## Required Break Order

1. sever builder-strategy fixed vectors from `triage.py`
2. sever strategy-bearing runtime-context publication from `runtime_contexts.py` and the corresponding design frame
3. sever builder-strategy law from `repair_frontier.py` and its design document while preserving current-state frontier truth
4. rebind `gtl_module.py` builder-context tuples to the neutralized continuity/governance contexts only
5. reprice source/install/query proof lanes to the new law
6. reconcile requirement and design wording before closure

## Old Seam Inventory By Break

1. `triage.py:240-307` shallowness-heuristic scanner (`_scan_file_for_shallow_findings` / `_collect_shallow_findings`) plus `triage.py:597-609` shallowness-driven `deepen_realization` fixed-vector selection plus `triage.py:836-860` `framework_condition: "shallow"` / `deepening_preferred_over_expansion: True` emission
2. published `realization_deepening_control_frame` — file at `build_tenants/python/design/fp/REALIZATION_DEEPENING_CONTROL_FRAME.md` (D3) plus `runtime_contexts.py:13-15, 31-35` publication of its runtime-context sidecar
3. published `repair_frontier` builder-law prompt context — `repair_frontier.py:253-257` `"## Global Law"` block plus `widening_conditions` strings at lines 129, 155, 184, 215 plus `DETERMINISTIC_REPAIR_FRONTIER.md:20-22, 50-52, 86-91` authorizing wording
4. GTL builder-lane injection at `gtl_module.py:422-447` — `_repair_frontier_context` + `_realization_deepening_context` + their tuple memberships, consumed at `gtl_module.py:908, 918, 933, 948, 987, 1003, 1018, 1042, 1058, 1074, 1098, 1114, 1137`
5. proof lanes, query surfaces, dossier builders, and published analysis-manifest entries (`analysis.py:91-94`) that still bless the old strategy law
6. requirement/design/ticket wording (including `REQ-F-ODDSDLC-035 AC-3` if interpreted as builder-facing imperative) that still authorizes the old shape

## Per-Break Negative Proof

1. after Break 1, `rg -n '"deepen_realization"|deepening_preferred_over_expansion|framework_condition.*"shallow"|_collect_shallow_findings' build_tenants/python/code/odd_sdlc/` returns no hits and no route publication on the current tree emits those fields
2. after Break 2, `REALIZATION_DEEPENING_CONTROL_FRAME.md` is absent or rewritten as non-imperative observation; `runtime_contexts.py` no longer publishes it under the `realization_deepening_control_frame` label; a fixture workspace under `.ai-workspace/runtime/` contains no strategy directives in the runtime-context files
3. after Break 3, `rg -n '"## Global Law"|inspect the current|prefer deepening|widen only when' build_tenants/python/code/odd_sdlc/repair_frontier.py` returns no hits; the repair-frontier prompt context carries only `unmet_requirement_ids`, `preservation_requirement_ids`, `lawful_edit_frontier`, `lawful_proof_frontier`; `DETERMINISTIC_REPAIR_FRONTIER.md` is rewritten so the frontier is a governance read model, not a builder-facing law
4. after Break 4, `_realization_deepening_context` is absent from `gtl_module.py` and the realization/realized-test/requirement builder-context tuples at lines 434-447 bind to continuity/governance contexts only; a grep over the file returns no reference to the removed context
5. after Break 5, source/install proof lanes (including `test_odd_sdlc_*` and installed reproduction over a scala_spark workspace) exercise builder continuity, governance publication, and route emission without any strategy surface; no proof-lane fixture expects strategy directives in prompt context or route_proposal
6. after Break 6, `rg -n 'inspect the current|prefer deepening|widen only when|builder-facing prompt carrier|builder-facing read model|builder strategy' specification/ build_tenants/python/design/` returns no hits in current design or requirement text, or each remaining hit is explicitly tagged as historical rationale

## Progress Note

- 2026-04-23: governance-boundary retirement landed on the current tree
  - `triage.py` no longer derives `deepen_realization`, `framework_condition: "shallow"`, or `deepening_preferred_over_expansion` from local heuristics
  - `runtime_contexts.py` no longer publishes `REALIZATION_DEEPENING_CONTROL_FRAME.md`
  - `repair_frontier.py` no longer emits `widening_conditions` or the `"## Global Law"` builder-directive block
  - `gtl_module.py` no longer injects `_realization_deepening_context`, and builder lanes consume governance/continuity context only
  - downstream read-model/design/spec wording was reconciled so odd_sdlc no longer claims builder-strategy ownership in this slice
- current named proofs on the closure tree:
  - source selector:
    - `PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py -q -k 'test_module_build_does_not_publish_runtime_sidecars or test_constructive_vectors_consume_repair_frontier_context or test_code_edge_prompt_uses_neutral_repair_frontier_context or test_refresh_analysis_publishes_deterministic_repair_frontier or test_refresh_analysis_does_not_publish_replacement_strategy_surface or test_shallow_code_findings_do_not_publish_deepening_strategy'`
    - result: `6 passed, 89 deselected`
  - install selector:
    - `PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_installation.py -q -k 'test_normalize_workspace_standardizes_imported_workspace_shape or test_install_deploys_runtime_contract_and_enables_odd_sdlc_gaps or test_default_claude_manifest_declares_domain_dispatch_timeout or test_requirement_closure_register_ignores_family_headers_and_counts_written_testcase_authority'`
    - result: `4 passed, 32 deselected`
  - retirement probe:
    - `rg -n 'REALIZATION_DEEPENING_CONTROL_FRAME|builder-facing|builder law|realization_deepening_control_frame|deepen_realization|deepening_preferred_over_expansion|framework_condition.*"shallow"|## Global Law|widening_conditions|retry budget|turn counter|gain rule|depth score' build_tenants/python/code/odd_sdlc build_tenants/python/design specification`
    - result: no hits
  - package strict typing lane:
    - `python -m mypy --config-file mypy.ini -p odd_sdlc`
    - result: `Success: no issues found in 48 source files`

## Closure Note

odd_sdlc closes this ticket on boundary law, not on prompt effectiveness. The current tree no longer publishes builder-facing strategy doctrine in route policy, runtime contexts, repair-frontier prompt law, or GTL builder-context injection. The retained surfaces are governance, observability, lawful frontier, and prior-turn continuity only, and that retirement remains clean after B-041's realization-iteration landing.
