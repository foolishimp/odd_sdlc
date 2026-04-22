# Review: odd_sdlc admission and runtime surfaces under ABG B-027 criteria

**Category**: REVIEW
**Author**: Claude
**Date**: 2026-04-21
**Addresses**: odd_sdlc admission (T-023 completed), runtime_config fallback, T-020 traceability split
**Status**: Open
**Updated**: 2026-04-22

---

## Update log

- **2026-04-22** — Reviewer pass flagged Finding 4 (runtime_config.domain_package side-channel) as stale for the current tree. `bootstrap()` at `app.py:302` now installs an explicit `query_assets_binding_contract()` when runtime_config is missing an asset-binding contract; `runtime_contract.py` publishes the typed contract. Normal odd_sdlc source bootstrap no longer reaches the ABG `domain_package → query-domain` fallback. Finding 4 and the original T-025 proposal have been repriced below; the structural complaint (source bootstrap fell back to query-domain) was valid at time of original post but is now addressed by the `runtime_contract.py` landing (2026-04-21 23:25, post-publication of this review). Findings 1, 2, 3 (typed carrier, graph-owned admission, route carrier, FD/traceability split) all stand as valid. T-024 has since been created and captures the remaining typed-carrier/admission/route work. T-025 as originally scoped is no longer needed.

## Summary

Applying the ABG B-027 Functional Review Criteria directly to odd_sdlc shows the equivalent domain-layer work has not been done. Scorecard against the B-027 bar: 0/8 Functional Review Criteria pass, 7/8 non_closure_conditions structurally true (down from 8/8 after the `runtime_contract.py` landing), Mixed-State Rejection fails on all three conditions. T-023's completion was at the "functionality shipped" bar; B-027's bar is "semantic center reduced." Recommendation: **T-024** (typed carrier + graph-owned admission, supersedes T-023) — now created, captures the remaining work; keep **T-020** active as the traceability side of the same wave. T-025 as originally scoped is no longer needed (the source-bootstrap asset-binding fallback has been closed via explicit contract installation at `app.py:302`); the ABG-level `domain_package` fallback still exists as a defensive path that no longer fires during odd_sdlc source bootstrap.

## Review basis

`abiogenesis/.ai-workspace/tickets/completed/B-027-refactor-abg-runtime-from-controller-orchestration-to-graph-owned-event-first-transitions.md` — specifically:

- Functional Review Criteria (§158-192) — 8 numbered criteria for every code-review pass
- Mixed-State Rejection proof rule (§411-423) — 3 structural conditions
- non_closure_conditions (§73-81) — 8 defect patterns
- target_truth (§62) — typed carrier family as authoritative source

B-027 itself: *"Passing tests do not satisfy this section by themselves. A slice that keeps the same semantic center alive behind helpers, dict payloads, or adapter-local policy still fails review even if behavior remains green."*

This post applies that framing at the odd_sdlc domain layer.

## Findings (detailed)

### 1. The 8 Functional Review Criteria against odd_sdlc

**Criterion 1 — Did control-flow-owned meaning get replaced with carrier/algebra-owned meaning?**

**FAIL.** `app.py:480` still calls `admit_execution_contract_surface(...)` directly. The returned value is a `dict[str, Any]` which `bound_execution_start_from_contract` at `execution_contract.py:557` then mutates via `contract = dict(execution_contract)` and interprets procedurally.

Under B-027, ABG's `gen_start()` collapsed to a thin wrapper. The odd_sdlc equivalent still owns the admission call, the binding interpretation, and the target extraction as control flow.

---

**Criterion 2 — Reduce semantic center, or rename/relocate?**

**RELOCATED, not reduced.** T-023 moved execution admission from raw operator phrasing to an `execution_contract_surface`. The surface is real and logged. But:

- `_start_target_from_execution_contract` (`execution_contract.py:519`) is a second interpretation center
- `bound_execution_start_from_contract` (`execution_contract.py:557`) is a third
- `load_work_item_ticket_surface` + `_parse_key_value_lines` + `_unchecked_checklist_items` (`execution_contract.py:183+`) reads the ticket markdown a second time beside the claimed carrier

Four functions now share responsibility for deriving execution truth. One semantic center became four seams with the same authority. This is the "declarative theater" pattern B-027 called out and fixed in ABG.

---

**Criterion 3 — Typed carrier/closed transition family, or open dict?**

**OPEN DICT.** Type annotations throughout:

- `execution_contract.py:519` — `def _start_target_from_execution_contract(contract: dict[str, Any])`
- `execution_contract.py:557` — `def bound_execution_start_from_contract(*, scope, execution_contract: Mapping[str, Any])`
- `_start_target_from_execution_contract` uses `target_truth.get("kind")`, `.get("handle")`, `.get("binding_source")`

Compare to B-027's delivered carrier in ABG:

```python
AdvancementTransition: TypeAlias = (
    FdAdvanceTransition
    | FpDispatchRequiredTransition
    | FpDispatchTransition
    | FhEscalationTransition
    | TerminalTransition
)
```

— a sealed sum with `isinstance`-based pattern matching at consumption sites. The odd_sdlc equivalent would be something like `ExecutionContract = OperatorRequestContract | TicketWorkItemContract` and `StartTargetContract = NextTarget | GraphFunctionTarget | AssetTarget`. Neither exists.

B-027 §Carrier Shape Commitment: *"The replacement for controller-owned runtime law must not be another open dict surface."* odd_sdlc fails this commitment directly.

---

**Criterion 4 — Pure transform, or orchestration branch?**

**ORCHESTRATION BRANCH.** `app.start()` body runs through `ensure_workspace_ready`, `_parse_scope_selector`, `app.scope`, `admit_execution_contract_surface`, `bound_execution_start_from_contract`, target extraction, branching on `until / root_mode / fh_mode / fp_mode`, and ABG invocation — 70+ lines of orchestration.

B-027's landed `gen_start` is a thin wrapper over `_iterate_kernel_outcome` that attaches typed carrier metadata. No emit, no file write, no orchestration branch at that level.

---

**Criterion 5 — Effects pushed to the edge?**

**MIXED.** `app.start()` interleaves reads and effects:

- `ensure_workspace_ready(...)` — effect at entry (OK, edge)
- `admit_execution_contract_surface(...)` — **effect mid-function**: writes event, writes register file
- `bound_execution_start_from_contract(...)` — **can call `load_work_item_ticket_surface`** mid-function, a filesystem read
- ABG dispatch at the end — effect at edge (OK)

The middle of the function mixes register write (an event emit) with downstream interpretation. Not edge-pushed.

---

**Criterion 6 — Pattern-match or `.get(...)` payloads?**

**`.get()` payloads.**

- `execution_contract.py:519-525` — `target_truth.get("kind")`, `.get("handle")`, `.get("binding_source")`
- `execution_contract.py:183+` ticket reread — `metadata.get(...)`, `sections.get(...)`, `migration_declaration.get(...)`
- `execution_contract.py` other sites — `contract.get("required_direction")`, `.get("acceptance")`
- `span_analysis.py:223` — `canonical_edge_gaps(*, edge_names, raw_graph_gaps: list[dict[str, Any]], ledger_gaps: list[dict[str, Any]])` — open dict lists consumed as closure evidence

No `isinstance`-based pattern matching on sealed variants anywhere in the admission path.

---

**Criterion 7 — Event truth authoritative, projections derived?**

**PARTIAL.** `execution_contract_surface` is recorded as a register file plus an event. But:

- `execution_contract.py:183` re-reads the ticket markdown surface (`load_work_item_ticket_surface`) and re-parses the same data the register should have captured — second read path with its own interpretation
- `span_analysis.py` and `fd_checks.py` read from `traceability.py` raw helpers, not from the register — requirement-closure truth lives in two places

Event truth exists but is not singular. Multiple projections can disagree.

---

**Criterion 8 — F_D informs without structurally blocking F_P (ADR-035)?**

**BLOCKS.** `fd_checks.py:19` imports `_expected_implementation_code_requirement_ids`, `missing_code_traceability_ids`, `missing_planned_test_traceability_ids`, `missing_realized_test_traceability_ids`, `missing_requirement_ids_from_current_surface` directly from `traceability.py` — used as blocking F_D gates.

If those F_D gates hold a generated surface open because `REQ-*` IDs are missing from markdown — and the yield lane's entire symptom shows they do — then F_P dispatch cannot proceed on the same edge until F_D is resolved.

Under ADR-035: *"deterministic observation may inform F_P without structurally blocking lawful constructive dispatch when resolved runtime policy permits it."* The odd_sdlc FD-traceability coupling blocks structurally, not via resolved policy.

---

### Functional Review Criteria scorecard

| # | Criterion | odd_sdlc | ABG (post-B-027) |
|---|---|---|---|
| 1 | Carrier-owned meaning | FAIL | pass |
| 2 | Reduce semantic center | RELOCATED | pass |
| 3 | Typed sum vs open dict | OPEN DICT | pass |
| 4 | Pure transform | ORCHESTRATION | pass |
| 5 | Effects at edge | MIXED | pass |
| 6 | Pattern-match consumption | `.get()` | pass |
| 7 | Event truth authoritative | PARTIAL | pass |
| 8 | F_D without structurally blocking F_P | BLOCKS | pass |

**0/8 pass, 1/8 partial, 7/8 fail.**

---

### 2. Mixed-State Rejection proof rule

B-027 §Proof Rule For Mixed-State Rejection:

> 1. removing or disabling the new upstream runtime carrier makes advancement impossible rather than merely degraded
> 2. every regime transition that matters to closure is replay-visible in the event stream
> 3. downstream status/dossier/operator consumers can only pass through the new carrier/event path

| # | Rule | odd_sdlc |
|---|---|---|
| 1 | Remove carrier → advancement impossible | FAIL — removing `execution_contract_surface` falls through: `app.start` still has `resolved_scope`, ABG dispatch still works, `app.start` could be rewired to call ABG directly as it used to |
| 2 | Every transition replay-visible | PARTIAL — admission event exists; route decisions are not events, they are ticket rereads |
| 3 | Consumers can only pass through new path | FAIL — `execution_contract.py:183` ticket reread proves a second path exists |

0/3 fully satisfied.

---

### 3. non_closure_conditions (B-027's 8 items translated to odd_sdlc)

| # | B-027 wording | odd_sdlc translation | Status |
|---|---|---|---|
| 1 | `gen_start()/gen_iterate()` still semantic center | `app.start()` still owns admission sequencing | TRUE |
| 2 | `_iterated_outcome()` / dispatch-runtime still semantic center | `_start_target_from_execution_contract` + `bound_execution_start_from_contract` + ticket-reread path still own interpretation | TRUE |
| 3 | Upstream carrier unnamed/implicit/reconstructible from controller | `execution_contract_surface` is a dict reconstructed inline; no sealed typed form | TRUE |
| 4 | `runtime_config` still authoritative | ~~`runtime_config.domain_package` is fallback authority for asset-binding contracts~~ ✗ **Stale as of 2026-04-22**: `bootstrap()` at `app.py:302` now installs explicit `query_assets_binding_contract()` when missing; normal source bootstrap no longer reaches the ABG `domain_package → query-domain` fallback. Condition is **FALSE** at the odd_sdlc source boundary. The ABG-level fallback still exists defensively but does not fire for normal odd_sdlc bootstrap. | FALSE (repriced) |
| 5 | Old and new path both pass | Ticket reread at `execution_contract.py:183` AND carrier both pass. (The runtime-config double-path claim is no longer applicable — `asset_binding_contract` is always installed explicitly.) | TRUE (narrower — ticket reread only) |
| 6 | Regime binding procedural not one algebra | F_D checks import raw traceability helpers; F_P dispatch bound separately; no `RegimeBindingSet` equivalent | TRUE |
| 7 | F_D blocks F_P structurally | Traceability-missing `REQ-*` blocks F_D gate, blocks F_P dispatch — not policy-driven | TRUE |
| 8 | Wording implies more declarative than code | T-023 closure claim includes "closed admitted contract" but code has open dict; `gtl_module.py:1227` declares graph functions `selection_visible: False` | TRUE |

**7/8 non_closure_conditions structurally true** at the odd_sdlc domain layer (condition 4 repriced to FALSE after the `runtime_contract.py` landing; condition 5 narrowed to the ticket-reread path only).

---

### 4. Specific evidence citations (file:line)

- `app.py:296` — `bootstrap()` injects `"domain_package": "odd_sdlc"` into runtime_config (contextual: `domain_package` is still present but no longer the authority for asset-binding, see `app.py:302` below)
- `app.py:302` — **(added after original post)** `bootstrap()` now installs `query_assets_binding_contract()` when `asset_binding_contract` is absent; closes the source-bootstrap side-channel that Finding 4 originally flagged
- `runtime_contract.py:12` — **(added after original post)** `query_assets_binding_contract()` publishes the typed asset-binding contract (`command`, `assets_key`, `asset_id_key`, `uri_key`, `relative_path_key`, `path_kind_key`, `exists_key`)
- `app.py:480` — `execution_contract = admit_execution_contract_surface(...)` direct call
- `AGENTS.md:13` — claims installed runtime contract at `workspace://.genesis/odd_sdlc/release/genesis.yml`
- `AGENTS.md:63` — acknowledges source repo does not carry installed `.genesis/` runtime (the contract path from line 13 does not exist in source scope)
- `execution_contract.py:183` — ticket-surface reread via `load_work_item_ticket_surface` and markdown reparse
- `execution_contract.py:519` — `_start_target_from_execution_contract(contract: dict[str, Any])` with `.get(...)` payload reads
- `execution_contract.py:557` — `bound_execution_start_from_contract(*, scope, execution_contract: Mapping[str, Any])` coerces back to mutable dict
- `fd_checks.py:19` — imports raw helpers `_expected_implementation_code_requirement_ids`, `missing_code_traceability_ids`, `missing_planned_test_traceability_ids`, `missing_realized_test_traceability_ids`, `missing_requirement_ids_from_current_surface` from `traceability.py`
- `gtl_module.py:1227` — `GF_DERIVE_EXECUTION_CONTRACT` declared with `declarations=Attrs(entries=(("selection_visible", False),))`
- `span_analysis.py:223` — `canonical_edge_gaps(*, edge_names, raw_graph_gaps: list[dict[str, Any]], ledger_gaps: list[dict[str, Any]])`
- `start_targeting.py:255` — published index entry contains `handle`, `asset_id`, `uri`, `relative_path`, `operator_target` — no `route_contract` field
- `start_targeting.py:350` — `route_contract=None` despite design spec requiring it on the asset entry
- `design/TICKET_WORK_ITEM_REENTRY_ROUTING.md:48` — design states `route_contract` on asset entry (contradicted by `start_targeting.py:350`)
- `abiogenesis/.../binding.py:752` — ABG fallback `AssetBindingQueryContract` from `config.get("domain_package")`

All citations verified by direct reads during this review.

---

### 5. T-023 closure-integrity review

T-023 shipped marked completed. Its own Functional Review Criteria (from `completed/T-023-...md:172`):

> 1. Did the slice replace raw operator/ticket/prompt phrasing with the admitted `execution_contract_surface` as the source of execution truth?
> 2. Did it reduce a semantic center, or only move execution law into `app.start(...)`, helper functions, manifest glue, or prompt assembly?
> 3. Is execution basis expressed as a **closed admitted contract** with explicit status, criteria, non-closure conditions, proof surface, and carrier graph functions **rather than an open dict** assembled differently per consumer?
> 4. Is `app.start(...)` a thin binding over the admitted carrier, or does it still decide execution law procedurally?

Scoring against live code:

- Criterion 1: pass — `execution_contract_surface` is produced and logged
- Criterion 2: FAIL — execution law moved into `app.start()` + helper functions
- Criterion 3: FAIL — contract is `dict[str, Any]` / `Mapping[str, Any]` with `.get()`-driven interpretation
- Criterion 4: FAIL — `app.start()` calls `admit_execution_contract_surface` directly, calls `bound_execution_start_from_contract`, branches on `until/root_mode`

**2/4 of T-023's own criteria fail.** Under SPEC_METHOD §Consistency Gate Rule, a ticket should not close while its own non_closure conditions remain structurally true. T-023's closure was premature by its own bar.

---

### 6. Proposed Required Break Order for odd_sdlc (B-027 equivalent)

Mirroring B-027's 8-phase order at the domain layer:

1. **Publish the typed execution-contract carrier family.** Sealed sum: minimum `ExecutionContract = OperatorRequestContract | TicketWorkItemContract`; route contract as `RouteContract = GraphFunctionRoute | AssetRoute | NoRoute`; start target as `StartTargetContract` sum.
2. **Rebind `admit_execution_contract_surface` and `bound_execution_start_from_contract` to produce/consume the typed carrier.** Remove `dict[str, Any]` signatures; consumers pattern-match.
3. **Rebind `_start_target_from_execution_contract` as carrier pattern-match.** `.get()` paths deleted.
4. **Rebind ticket-surface reread path.** `execution_contract.py:183` `load_work_item_ticket_surface` becomes a pure projection over the typed carrier; remove as a parallel read authority.
5. **Publish `route_contract` on `start_targeting.py:350` asset entry.** Typed variant; downstream consumers read from published asset, not ticket markdown. Closes the design-vs-code contradiction with `design/TICKET_WORK_ITEM_REENTRY_ROUTING.md:48`.
6. **Rebind `app.start()` as thin adapter.** Remove direct `admit_execution_contract_surface` call; emit one `WorkRequestEvent` and dispatch through the published graph. `gtl_module.py:1227` `GF_DERIVE_EXECUTION_CONTRACT` flips to `selection_visible: True`.
7. **~~Demote `runtime_config.domain_package` from authority.~~** ✓ **Substantively landed as of 2026-04-22** at the odd_sdlc source boundary via `app.py:302` + `runtime_contract.py`. The ABG `domain_package → query-domain` fallback still exists defensively at `abiogenesis/.../binding.py:752` but does not fire during odd_sdlc source bootstrap because `asset_binding_contract` is always installed explicitly. Remaining question is whether to remove or fail-close the ABG-level fallback globally — that is a cross-repo concern separate from this wave.
8. **Reprice FD checks and gap-dossier/span-analysis consumers.** (T-020's existing scope.) FD checks consume a traceability-index carrier, not raw `traceability.py` helpers. `canonical_edge_gaps` consumes typed gap carriers, not open dicts.

### Proposed Break-to-Closure Map

| Clause | Breaks above | B-027 parallel | Status |
|---|---|---|---|
| Source-boundary | 1–4 (carrier + admission + reread demolition) | B-027 breaks 1–7 | Open — T-024 scope |
| Regime-algebra | 8 (T-020 FD/traceability split) | B-027 breaks 8–11 | Open — T-020 scope |
| Side-channel | 7 (runtime_config.domain_package demotion) | B-027 breaks 12–15 | **Substantively closed 2026-04-22** at odd_sdlc source boundary; ABG-level fallback defensive only |
| Delivery | 6 (app.start thin adapter) + bootstrap/install hardening | B-027 breaks 16–18 | Open — T-024 scope (app.start) |

---

### 7. Proposed ticket set

Under SPEC_METHOD §Core Interface Migration Rule, each is a real interface migration requiring explicit old/new contract, producer/consumer set, and closure law.

**T-024 — "Reframe execution-contract admission as typed carrier + graph-owned dispatch"**
- Status: Created 2026-04-22 (captures the remaining typed-carrier/admission/route-contract work)
- Supersedes: T-023 (completed-but-not-closure-clean under B-027 bar)
- Scope: Breaks 1–6 above
- Reference model: `abiogenesis/.ai-workspace/tickets/completed/B-027-...md`
- Closure law: open-dict admission no longer passes; `app.start()` cannot bypass the published graph; removing the typed carrier makes admission impossible (not degraded)

**~~T-025 — "Demote runtime_config.domain_package from asset-binding authority"~~** — **No longer proposed.**

As originally scoped, T-025 was a demotion of `runtime_config.domain_package` from asset-binding authority at the odd_sdlc source boundary. That work landed on 2026-04-21 23:25 via `app.py:302` and `runtime_contract.py:12`, before this ticket was needed. The narrower residual question — whether to remove or fail-close the ABG-level `domain_package → query-domain` fallback globally (it still exists at `abiogenesis/.../binding.py:752` as a defensive path) — is cross-repo and probably does not warrant its own ticket unless a concrete harm is identified. For now the fallback is dead code for odd_sdlc source bootstrap and survives as belt-and-braces for any other caller.

**T-020 — continues (existing active ticket)**
- No change. Break 8 above is T-020's existing scope.

### Dependency order

```
T-020 (traceability split) ──→ T-024 (execution-contract typed carrier + graph admission)
```

T-024 may start in parallel with T-020 but closure of T-024 on criterion 8 (F_D does not structurally block F_P) depends on T-020 landing the traceability carrier split.

---

### 8. ADR parity with B-027

B-027 was supported by three ADRs at the substrate layer:

- ADR-034 — runtime execution law is carrier-and-event owned
- ADR-035 — deterministic handling must not structurally block governed F_P
- ADR-036 — `ExecutionBasis` + `AdvancementTransition` carrier family

odd_sdlc equivalents worth drafting:

| B-027 ADR | odd_sdlc equivalent | Notes |
|---|---|---|
| ADR-034 | "odd_sdlc admission law is carrier-and-graph-dispatched" | Parallel claim at the domain layer |
| ADR-035 | Reuse directly | ADR-035 applies across layers; cite from odd_sdlc design docs |
| ADR-036 | "odd_sdlc admission uses `ExecutionContract` sum and `RouteContract` sum as the typed carrier family" | Names the typed-family shape for the domain |

---

## Verdict

Under B-027 criteria as of 2026-04-22: **odd_sdlc has partially done B-027's work at the domain layer — the source-bootstrap side-channel is closed, but the typed-carrier/admission/route-contract work is still open.**

- 0/8 Functional Review Criteria pass (1 partial, 7 fail)
- 7/8 non_closure_conditions structurally true (condition 4 repriced to FALSE after the `runtime_contract.py` landing)
- Mixed-State Rejection fails all three conditions
- T-023's own closure criteria: 2/4 fail against current code

T-023 shipped narrow closure (*"admit ticket-shaped execution contracts and log them before work executes"*) which is done — the surface is admitted and logged. But B-027-style closure still requires:

- typed sealed-sum carrier, not dict — **open**
- graph-owned admission, not app-owned — **open**
- no parallel ticket-reread path — **open**
- ~~runtime_config demoted, not a fallback authority~~ — **substantively closed 2026-04-22** at odd_sdlc source boundary via explicit asset-binding contract installation
- F_D informs without structurally blocking F_P — **open** (T-020 scope)

T-023's closure was at the "functionality shipped" bar, not at B-027's "semantic center reduced" bar. The remaining gap is captured by T-024.

## Recommended action

1. **T-024** (opened 2026-04-22) — typed carrier + graph-owned admission, supersedes T-023. Captures Breaks 1–6 above.
2. **T-020** continues active — traceability split (Break 8 above).
3. ~~**T-025** — runtime_config demotion~~ — **no longer proposed**. The source-bootstrap asset-binding side-channel landed via `runtime_contract.py` on 2026-04-21. The ABG-level `domain_package` fallback survives as defensive cross-repo material that does not fire for odd_sdlc; globally fail-closing it is a separate conversation not triggered by this wave.
4. Optional — draft one or two odd_sdlc ADRs mirroring ADR-034/036, or cite ABG ADRs directly from odd_sdlc design docs.

This post is commentary. It does not create the tickets or ADRs. T-024 now exists; other tickets need explicit ratification with old/new contract declaration, producer/consumer set, closure law, Functional Review Criteria, and Break-To-Closure Map before they become work-governing authority.
