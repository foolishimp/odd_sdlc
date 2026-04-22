# REVIEW: S-037 Deliverable 1 — odd_sdlc Core Domain Model

**Author**: claude
**Date**: 2026-04-23T00:00:00Z
**Addresses**: S-037 §Deliverables 1; governs classification used in subsequent per-file review posts
**Status**: Open

## Summary

This post defines the odd_sdlc domain model and the boundary taxonomy used by the rest of the S-037 review pass. It names what odd_sdlc owns, what GTL owns, what ABG owns, the authoritative carriers inside odd_sdlc, and the module roles allowed to interpret domain meaning versus bind, project, or emit effects.

This is the prerequisite frame for the per-file reviews under S-037 §Deliverables 2 and the fault-line synthesis under §Deliverables 3. It does not decide per-file refactors or land design changes; it supplies the rubric.

## Analysis

### 1. Three-layer responsibility split

| Layer | Role | Authority it carries | Authority it must not carry |
|---|---|---|---|
| **GTL** (`gtl.*`) | constructive graph-native product shape | typed graphs, graph functions, module publication, refinement/candidate boundaries, jobs/roles | governance law, runtime decisions, workspace effects |
| **ABG** (`genesis.*`) | generic interpreter/runtime for GTL | traversal, event stream, dispatch, carriers for advancement, selection, materialization, salvage, proof holds, continuation semantics | project identity, requirement law, domain gap meaning |
| **odd_sdlc** (`odd_sdlc.*`) | domain governance/control over published carriers | intake triage, requirement closure truth, head-gap decision, constitutional proposal law, execution-contract admission, public control surface | graph topology, traversal mechanics, event append mechanics |

The repair wave's recurring pattern is this split getting blurred — either odd_sdlc controllers reach past their carrier and mint runtime decisions, or ABG code is asked to understand odd_sdlc domain truth. The review should name the boundary every time it is crossed.

### 2. Authoritative carriers inside odd_sdlc

A **carrier** here is a typed immutable value that some downstream consumer must pattern-match to decide meaning. Controller code is not allowed to rebuild a carrier's meaning from raw dicts or event fragments.

The core odd_sdlc carriers identified in the review set:

| Carrier | Source file | What it carries |
|---|---|---|
| `RawGraphGap`, `DeclaredObligationGap`, `CanonicalEdgeGap`, `GraphProjection`, `GraphEdgeGapProjection`, `DeclaredObligationEdgeGapProjection`, `EdgeGapTruthSummary` | `span_analysis.py` | normalized gap truth for one edge and aggregate delta summary |
| `GapDossierInputRow`, `GapDossierInput` | `gap_dossier.py` | triaged input row per edge, before dossier projection |
| `PendingConstitutionalStartGate`, `PublicNextStartBlock`, `PublicNextStartDirective` | `gap_dossier.py` | head-gap-derived decision for `start(next)` — gate / blocked / directive |
| `DraftExecutionContract`, `AdmittedExecutionContract`, `RejectedExecutionContract`, `SupersededExecutionContract`, `AdmittedExecutionContractProjection` | `execution_contract.py` | the contract carrier admitted (or rejected) for a run |
| `BoundExecutionStart` | `execution_contract.py` | admitted contract bound to a resolved `Scope` + `StartTarget` ready to dispatch |
| `OperatorExecutionSource`, `TicketWorkItemExecutionSource`, `NextExecutionTarget`, `GraphFunctionExecutionTarget`, `AssetExecutionTarget` | `execution_contract.py` | typed source/target polymorphism for contracts |
| `ResolvedOddStartTarget` | `start_targeting.py` | resolved target plus route contract for a raw target string |
| `RequirementTraceabilityIndex`, `TraceabilitySourceScan`, `RequirementFamilyTraceabilityPublication` | `traceability_index.py` | requirement ↔ surface ↔ code/test cross-reference |
| Edge triage projection record (`projection` dict under `.ai-workspace/runtime/triage/<edge>.json`) | `triage.py` | the published per-edge projection with observation/triage/route_binding/constitutional_proposal |
| Gap dossier register + context (`odd_sdlc-gap-dossier.json`, `-context.md`) | `gap_dossier.py` | published read model of per-edge dossiers |
| Requirement closure register (`odd_sdlc-requirement-closure.json`) | `requirement_closure.py` | obligation ledger per requirement with carry/fulfillment status |
| Repair frontier register (`odd_sdlc-repair-frontier.json`, `-repair-frontier.md`) | `repair_frontier.py` | declared open obligations and repair context |
| Analysis manifest + workspace state (`-workspace-normalization.json`, `workspace_state.json`) | `analysis.py` | fingerprinted input/output inventory for staleness discipline |
| Ambiguity register (`odd_sdlc-ambiguity-register.json`) | `ambiguity.py` (outside review set) | open ambiguity with risk-appetite resolution |

Rule-of-thumb: **if a downstream consumer reads a raw dict / event payload directly instead of matching one of the carriers above, that is a candidate fault.**

### 3. Module role taxonomy (per DESIGN_MODULE_METHOD §6)

The review set classifies as follows. Rationale per file is in the per-file reviews; this is the index.

| File | Primary role | Notes |
|---|---|---|
| `span_analysis.py` | **Carrier** + small **Semantic kernel** | carrier dataclasses + pure gap-aggregation transforms |
| `gap_dossier.py` | **Carrier** + **Projection** | carrier dataclasses + `project_*` read-model functions + one `publish_gap_dossier_surfaces` effect edge |
| `execution_contract.py` | **Carrier** + **Semantic kernel** + effect edge for register/context publication | admit/reject/supersede decision logic alongside carriers |
| `start_targeting.py` | **Semantic kernel** (pure resolver) | `resolve_start_target`, published catalogs |
| `triage.py` | **Semantic kernel** + **Effect shell** | `_build_*` transforms build projection; `_publish_edge_projection` emits 4 event kinds and writes current-edge artifact |
| `homeostatic_loop.py` | **Effect shell** (thin) | applies proposal to target surface, emits events, triggers `refresh_analysis` |
| `analysis.py` | **Semantic kernel** + **Effect shell** | fingerprint transform + manifest write |
| `repair_frontier.py` | **Projection** | derives repair register + prompt context from declared obligations |
| `requirement_closure.py` | **Semantic kernel** + **Projection** | builds closure register; exposes read-model loaders |
| `traceability_index.py` | **Semantic kernel** + **Projection** | requirement ↔ surface index + publication dataclasses |
| `query.py` | **Projection** only | pure read over app state |
| `app.py` | **Binding/adapter** + the only lawful **Public control surface** | bootstrap, public `start`/`gaps`/`iterate`, orchestrates a small number of kernels and effect shells |
| `constructor.py` | **Constructor/materialization** | writes generated workspace artifacts (intent, product, design, code, release, ...) |

### 4. Who is allowed to interpret domain meaning

**Allowed** to decide odd_sdlc-level meaning (what is a gap, what is a head edge, what proposal is lawful, what closure means, what the next start step is):

- `span_analysis.py` — what a canonical edge gap is and what the aggregate delta says
- `triage.py` — what kind of gap an edge carries, what process outcome it entails, what constitutional proposal to mint
- `gap_dossier.py` — what decision the head gap supports for public `start(next)` (gate / block / directive)
- `execution_contract.py` — what makes a contract lawful to admit, reject, or supersede
- `requirement_closure.py` — what counts as fulfilled, carried, blocked per obligation
- `traceability_index.py` — what counts as a valid requirement ↔ surface/code/test reference
- `analysis.py` — what counts as current/stale analysis

**Not allowed** to decide odd_sdlc-level meaning, only to bind boundaries, project read models, or perform explicit effects:

- `app.py` — may orchestrate published carriers; must not rebuild carrier meaning from raw dicts or invent fh/gate/yield states that carriers do not already express
- `query.py` — read-only projection
- `repair_frontier.py` — derived register only; must not decide whether a requirement closes
- `homeostatic_loop.py` — writes, event emission, re-analysis trigger; no gap meaning
- `constructor.py` — file materialization only; must not decide whether a requirement is closed or whether an edge converges

### 5. Public control surface — single lawful entry

`app.start` and `app.gaps` (via `OddSdlcApp`) are the only lawful public entries. They must:

1. Build or consult a carrier (e.g. `gap_snapshot` → `project_public_next_start_resolution` → typed resolution).
2. Match on carrier variant (`PendingConstitutionalStartGate` | `PublicNextStartBlock` | `PublicNextStartDirective`).
3. Delegate to the appropriate effect edge (`admit_bound_execution_start`, `_publish_pending_constitutional_start_gate`).

If `app.py` ever reaches inside raw payloads to make the decision, the No Semantic Center rule is violated.

### 6. Effect edges

The lawful effect edges in odd_sdlc:

- `triage._publish_edge_projection` — appends `observation_recorded` / `triage_produced` / `route_recorded` / `constitutional_proposal_recorded` / `triage_divergence` events and writes the current-edge artifact.
- `gap_dossier.publish_gap_dossier_surfaces` — writes dossier register + context.
- `execution_contract.admit_execution_contract_surface` — writes register/context, emits `execution_contract_drafted` / `admitted` / `rejected` / `superseded`.
- `homeostatic_loop.apply_constitutional_proposal` — edits the target surface file, emits `constitutional_proposal_approved_with_edits` + `proposal_applied`, then calls `refresh_analysis`.
- `homeostatic_loop.loopback_homeostatic_gap` — emits `derivation_reopened`, and either `gap_retired` or `gap_event`.
- `app._publish_pending_constitutional_start_gate` — emits `fh_gate_pending` (the B-035 fix boundary).
- `analysis.refresh_analysis` / `write_analysis_manifest` / `write_workspace_state` — persists analysis fingerprint artefacts.
- `constructor._construct_*` — writes generated workspace files.
- Requirement closure publication (in `requirement_closure.py`) — writes closure register and context.
- Repair-frontier publication (in `repair_frontier.py`) — writes repair register and context.

Any effect performed outside this list, or any semantic decision made inside one of these edges that should belong to a kernel, is a candidate fault line.

### 7. Dependency shape (preferred direction)

```
analysis  ───────────────────────────────┐
                                          ▼
span_analysis  ── traceability_index ─ requirement_closure ─ repair_frontier
        │                                   │
        ▼                                   │
      triage  ◄─────────────────────────────┘
        │
        ▼
   gap_dossier  (carriers + projections)
        │
        ▼
  start_targeting / execution_contract   (resolver + admission)
        │
        ▼
       app   (binding + public control surface, consumes carriers only)
        ▲
        │
   homeostatic_loop   (effect shell; reopens the above cycle on proposal application)
```

`query.py` reads from the left side only. `constructor.py` is consumed by edge-level F_P dispatch outside odd_sdlc proper and writes generated surfaces; it does not decide gap or closure meaning.

`app.py` should not write to anything left of `execution_contract` except through `homeostatic_loop`. Any left-ward write or decision from `app.py` is interface bleed.

### 8. Review Question from S-037 §Explicit Review Question

> *If this file were removed, what authoritative carrier or boundary would stop existing, and is that stop semantically lawful?*

Applied as a quick orientation pass:

| File | If removed, what stops existing? | Lawful stop? |
|---|---|---|
| `span_analysis.py` | canonical gap carrier + aggregate delta | yes — authoritative |
| `gap_dossier.py` | head-gap decision carrier + dossier read model | yes — authoritative |
| `execution_contract.py` | admission decision + bound-start construction | yes — authoritative |
| `start_targeting.py` | raw-target → `ResolvedOddStartTarget` resolver | yes — authoritative; start cannot proceed |
| `triage.py` | per-edge projection + event publication | yes — authoritative; no other minter |
| `requirement_closure.py` | closure register + obligation gap carrier | yes — authoritative |
| `traceability_index.py` | requirement ↔ surface/code/test index | yes — authoritative |
| `analysis.py` | analysis manifest + staleness truth | yes — authoritative |
| `repair_frontier.py` | repair register projection | weaker — derived; could be rebuilt from closure |
| `query.py` | packaged read surface | weak — projections could be consumed directly |
| `homeostatic_loop.py` | proposal application + loopback | yes — only lawful path |
| `app.py` | public entry + orchestration | yes — removal would require a replacement binding |
| `constructor.py` | generated workspace surfaces | yes — authoritative for materialization |

Files with a **weak** stop are projection conveniences. If they start carrying exclusive decision authority, that is a fault line.

## Recommended Action

1. Adopt this post's taxonomy index as the classification used by the S-037 per-file review posts.
2. Per-file reviews must either confirm the role assigned here or argue for a different role — no implicit reclassification.
3. The review question in §8 is the first check for each per-file post; a weak stop is a flag to examine for hidden semantic center, effect leakage, or projection-as-authority.
4. Any fault that surfaces in later posts must be named with a category from the list in S-037 §Evaluation Criteria.
