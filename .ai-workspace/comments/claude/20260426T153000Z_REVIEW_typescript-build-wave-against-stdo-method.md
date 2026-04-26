# REVIEW: TypeScript Build Wave (T-031–T-038, T-018, T-019, B-004) Against STDO Method

**Author**: Claude
**Date**: 2026-04-26T15:30:00Z
**Addresses**: `.ai-workspace/tickets/backlog/T-018, T-019, T-031..T-038, B-004`; `build_tenants/typescript/` carrier surface; `specification_methodology/specification/standards/ODD_METHOD.md` (2026-04-26 amendment); `specification_methodology/strategy/OODD_future_strategy.md`
**Status**: Draft

## Summary

This review evaluates the coordinated TypeScript build wave (`T-031`
through `T-038`) plus the orthogonal Python seam-split tickets (`T-018`,
`T-019`) and the parked `odd_service` debt (`B-004`) against STDO Method
— the four-method composite governance scope each ticket declares
(`S=SPEC_METHOD`, `T=TICKET_METHOD`, `D=DESIGN_MODULE_METHOD`,
`O=ODD_METHOD`) — and against the current state of the
`build_tenants/typescript/` carrier surface.

The wave **as authored** is internally coherent and STDO-correct in
shape. The wave **as realized** sits at roughly one of eight tickets
partially started: T-031 (ingress) is partial, T-034 (constructor +
evaluator hooks) is partial with the strongest realized surface in the
tenant, T-037 (operational transitions) is a stub, and T-032, T-033,
T-035, T-036, T-038 have not started. T-018 and T-019 are silently
being violated by T-031's monolithic ingress shape. The DESIGN_MODULE
leg of STDO is the weakest — neither tickets nor tenant carry design
surfaces backing the realization.

This post describes both current reality and target direction. Findings
are separated from recommended action.

## Method Anchoring Caveat

ODD_METHOD (2026-04-26 amendment) and SPEC_METHOD-derived authority
chains were read directly. TICKET_METHOD and DESIGN_MODULE_METHOD were
inferred from ticket frontmatter shape (which is a faithful
TICKET_METHOD application) and from the absence of design-module
surfaces in the tenant. Where conclusions depend on those two methods
specifically, the dependency is flagged inline.

## Wave Shape

The wave is a strictly sequential dependency chain:

```
T-031 → T-032 → T-033 → T-034 → T-035 → T-036 → T-037 → T-038
```

T-018 and T-019 are orthogonal Python-side seam-split chores born from
the same monolith pattern that T-031 is currently re-creating in
TypeScript. B-004 is parked `odd_service` debt, correctly out of scope
for this wave but not yet cross-linked from `OODD_future_strategy.md`.

T-038 is the RC qualification gate. Its `change_class: product_reprice`
distinguishes it from the seven `realization_refactor` tickets above
it — closure requires evidence that RC readiness is not inferred from
unit tests alone but from sandbox, live F_P, and Python parity.

The wave shape is method-correct in TICKET_METHOD terms: each ticket
carries `target_truth`, `superseded_truth`, `closure_law`,
`evaluation_criteria`, `proof_surface`, `non_closure_conditions`. This
is a clean lawful re-entry chain per SPEC_METHOD.

## Realization vs Ticket Scope

| Ticket | Boundary | State | Carrier Kind | Critical Gap |
|---|---|---|---|---|
| T-031 | Workspace ingress + bootstrap lineage | **Partial** | Plain TS data + admission fns (`workspace/ingress.ts:40,176,212,236`, `domain/admission.ts`) | Monolithic — already inheriting the T-019 anti-pattern in new code |
| T-032 | query-domain, gaps, gap-dossier projections | **Not started** | — | Blocks T-033, T-036, T-038 |
| T-033 | public start admission + execution contract + worker attachment | **Not started** | — | Substrate binding (`abiogenesis_substrate.ts:39,53`) declares F_P worker consumption but does not construct it |
| T-034 | SDLC constructor + evaluator hook set | **Partial** | Published `GraphFunction` / `Module` via `graph/module.ts:300–319,349–350`; catalog `SDLC_FUNCTION_CATALOG` (27 entries) at `graph/catalog.ts:222` | Constructor / evaluator registry not separated from module assembly |
| T-035 | Traceability + requirement closure | **Not started** | — | `SdlcBootstrapLineageRecord` covers source→requirement seed only; nothing links requirements to downstream assets |
| T-036 | Gap → Triage homeostatic loop + ticket routing | **Not started** | — | No Triage carrier of any kind in TS |
| T-037 | Operational transition + runtime return | **Stub** | Carriers + projection (`domain/carriers.ts:60–65,178–195`, `domain/operational_projection.ts:20`) | Capability-gating + lane state machines absent |
| T-038 | RC qualification gate | **Not started** | — | Cannot satisfy without T-031–T-037 |
| T-018 | Triage seam split (Python) | Not started | — | TS is being built monolithic before Python's lesson lands |
| T-019 | Workspace-asset seam split (Python) | Not started | — | T-031 ingress already monolithic in TS |
| B-004 | odd_service consensus + remote-client debt | Parked | — | Out of scope for this wave per its own framing |

The TS tenant has substrate binding, ingress data carriers, a real
GraphFunction catalog, and a published `Module`. The operative product
loop (query → start → constructor → traceability → triage →
operational) is essentially un-realized. The wave defines the work
cleanly; the work has not yet started past T-031 ingress and T-034
module publication.

## STDO Evaluation

### S — SPEC_METHOD

**Strong.** Each ticket carries `intake_source`, `target_truth`,
`superseded_truth`, `closure_law` and a named `change_class` and
`re_entry_point`. The wave as a whole has one declared goal
(`build-odd-sdlc-typescript-as-odd-native-app`). The lawful re-entry
chain is intact.

Compliance is in the *ticket authoring*, not yet in the *realization*.

**Concrete gap:** T-033, T-036, and B-004 do not cite specification
sections directly. T-033's `intake_source` names Python files; T-036
the same; B-004 cites `09-odd-service-orchestration-plane.md` but
T-033 and T-036 should carry analogous links to active
`odd_sdlc`-spec sections.

### T — TICKET_METHOD

**Strong in shape.** Frontmatter is consistent across the wave,
evaluation criteria are concrete and falsifiable, `non_closure_conditions`
are present and pointed.

The T-033 condition ("public start runs hidden multi-step SDLC
traversal") is a textbook ODD §11.5A guard baked into the ticket
itself — exemplary practice. The T-037 condition ("no tenant-local
saga replaces ABG continuation") is the same pattern. These guards
mean §11.5A compliance is enforced at the ticket level, before code is
written.

Dependency declarations form a clean DAG.

**Concrete gap:** T-018 and T-019 are six days stale (created
2026-04-20, still backlog) and have not been picked up by the TS wave
that re-creates the same monolith shapes. Either close them as
superseded by the TS wave or include them as explicit prerequisites
for T-031.

### D — DESIGN_MODULE_METHOD

**Weakest of the four.** Every realized carrier in the tenant — T-031
ingress (351 lines monolithic), T-034 module assembly (383 lines),
T-037 operational projection — is implemented without a discoverable
design-module surface backing the realization.

The tickets themselves do not point at design modules either:
`re_entry_point: realization` jumps past `design_surface`. For a wave
whose change class is `realization_refactor`, this means the wave is
effectively re-deriving design from intent at code time.

**Concrete gap:** none of T-031–T-037 has a paired design surface
under `build_tenants/typescript/design/` or equivalent. This is an
ODD §16 failure pattern #10 risk in waiting (operative behavior
implemented imperatively first, GTL/design vocabulary applied later).

### O — ODD_METHOD

**Mixed.**

- **Carrier law (§11.2, §11.4):** T-034 is best-in-class for the
  workspace — actual `Module` publication with `SDLC_FUNCTION_CATALOG`
  carrying named `GraphFunction` entries. This is genuinely ODD-built,
  not ODD-shaped. Materially better than the abiogenesis TS tenant
  reviewed in `goals_0426`.
- **Function catalog (§11.3):** present and machine-readable.
- **§11.5A ABG-owns-continuation:** the wave's design is
  method-correct — T-033 and T-037 carry the §11.5A guard explicitly.
  Whether it holds in code can only be answered when those tickets
  land.
- **§11.7 manual walkthrough:** a manual operator today can walk T-031
  (ingress → admission → bootstrap lineage) but cannot walk T-033–T-037
  because those steps don't exist. The wave knows this; T-038 RC gate
  requires the walk to be lawful end-to-end.
- **§11.9 zoom convergence:** not yet exercised; the wave does not
  call for `RefinementBoundary` operationalization. Consistent with
  the abiogenesis TS gap flagged in the earlier review — both tenants
  share that hole.
- **§14 dogfooding:** the wave is itself the dogfood — odd_sdlc TS
  being built using odd_sdlc method. T-038 makes this explicit by
  requiring real F_P worker traversal in the qualification.

## Code-Review Observations on Realized Carriers

### O1. `workspace/ingress.ts` is monolithic

351 lines spanning admission, source-input modeling, bootstrap-lineage
derivation. T-019 is a Python ticket explicitly born from the same
anti-pattern in `workspace_assets.py`. Translating Python verbatim and
re-creating the monolith on the TS side wastes the lesson encoded in
T-019. Either declare T-019 a prerequisite for T-031 or split T-031
into seam-aware sub-tickets before more code accretes.

### O2. `graph/module.ts` is the strongest surface in the tenant

Catalog publication, F_D and F_P evaluator binding per entry, jobs
targeting graph functions — this is the §11.2 / §11.4 pattern other
tenants should mirror. Pulling the constructor / evaluator registry
out of module assembly (T-034 evaluation criterion: "each hook has
typed input, output, work report, and evidence contract") is the small
refactor needed to land T-034 fully.

### O3. `abiogenesis_substrate.ts` declares F_P worker dependency without construction

Lines 39 and 53 declare consumption but do not construct. This is
honest substrate-binding (ODD §6 product boundary), but until T-033
lands the gap will surface as `fp_worker_unattached`. Make sure that
blocking-reason path is the literal projection path and not a thrown
exception, per T-033 evaluation criterion #4.

### O4. Operational carriers (T-037 stub) lack capability-gating

Carriers + projection function (`domain/carriers.ts:60–65,178–195`,
`domain/operational_projection.ts:20`) but no state-machine. The
Python analog `operational_dispatch.py` carries the lane logic; the
TS carriers + projection function alone will silently complete
`pending_evidence` paths unless the gating predicate is added before
any operator binds to them.

### O5. No traceability surface (T-035) means there is no closure witness for what T-031 already produces

Even with T-031 partial, requirement seeds derived from imported
sources have no path to a closure register in TS. Until T-035 lands,
T-031's own `evaluation_criteria[3]` ("lineage answers which input
produced each derived project element") is observable only through ad
hoc inspection — not as typed projection truth.

## Cross-Cutting Findings

### F1. Wave correctness vs realization debt

The wave as authored is internally coherent and STDO-compliant. The
realization sits at one of eight tickets partially started — almost
the entire wave is forward work. Honest read: the tickets are method,
the code is intent.

### F2. Python parity is one-sided lift, not co-design

Every TS gap maps cleanly to a Python file (`query.py`, `triage.py`,
`requirement_closure.py`, `operational_dispatch.py`,
`worker_attachment.py`, etc.). The risk is that the wave becomes a
transliteration exercise.

The OODD_future_strategy document the user has open argues for
cell-bounded recursion, reusable work vectors, and strict boundaries
with elastic execution. The wave's `intake_source` field consistently
names Python files as the source. The lift will succeed in carrier
terms while missing the structural lessons embedded in T-018 and
T-019.

Both Python seam-split tickets predate this wave by six days and are
still backlog; that is a method-quality signal worth treating.

### F3. DESIGN_MODULE_METHOD is the weak STDO leg

S and T are strong (in authoring). O has a strong realized exemplar
(T-034). D is structurally absent — neither tickets nor tenant carry
design modules linking carrier semantics to ODD §11.x obligations.
This is the highest-leverage gap to close before more realization
lands.

### F4. T-018 and T-019 are silently being violated by T-031

This is the single most concrete code-review issue. The new TS ingress
is already shaped like the Python monolith those two tickets exist to
dissolve. Without explicit dependency or split, the wave will close
T-031 by reproducing the very anti-pattern T-018 / T-019 were created
to retire.

### F5. `odd_service` debt (B-004) and the OODD strategy align

OODD's "elastic execution inside bounded cells" requires exactly the
remote-client / consensus boundary B-004 parks. B-004 should not be
activated mid-wave, but its `REQ-F-ODDSVC-007 / 008 / 009` references
should be cross-linked from the OODD strategy document so the
deferral is visible at the strategy layer, not only at the ticket
layer.

### F6. Cross-tenant ODD pattern: zoom convergence is missing in both

The abiogenesis TS review (2026-04-26T14:00:00Z) flagged
`RefinementBoundary` as declared-but-not-exercised. The odd_sdlc TS
wave does not call for it either. ODD §11.9 compliance at the
ecosystem level requires at least one tenant to operationalize zoom
convergence. Worth tracking as a cross-tenant dependency rather than
per-tenant gap.

## Recommended Action

In priority order, with STDO anchor:

1. **Add T-019 (and T-018) as explicit prerequisites of T-031** — or
   split T-031 into seam-aware sub-tickets (`T-031a` ingress
   filesystem, `T-031b` ingress model, `T-031c` ingress projection).
   Do this *before* T-031 closes.
   *Anchor: TICKET_METHOD dependency law; ODD §16 failure #10.*

2. **Author design modules for T-031, T-034, T-037 retroactively** —
   even short surfaces, one per ticket, naming carrier semantics and
   the §11.x clauses being honored. Otherwise the wave fails STDO's D
   leg by construction.
   *Anchor: DESIGN_MODULE_METHOD; ODD §11.2A clause 2.*

3. **Land T-032 next, not T-033** — the dependency chain says T-033
   depends on T-032; the catalogs T-033 needs (`start_target_catalog`,
   `asset_ownership_index`, `execution_contract_surface`) are T-032
   outputs. Honor the dependency order.
   *Anchor: TICKET_METHOD dependency law.*

4. **Pull constructor / evaluator registry out of `graph/module.ts`**
   as a separate published surface — T-034 finishing move. The module
   assembly is good; the registry-as-surface is missing.
   *Anchor: ODD §11.2, §11.3.*

5. **Add the §11.5A guard test before T-033 closes** — a test that
   fails if `publicStart` ever calls itself transitively, or if the
   controller — not ABG — chooses the next vector. The
   `non_closure_condition` is already in the ticket; make it
   executable.
   *Anchor: ODD §11.5A; TICKET_METHOD non-closure law.*

6. **Cross-link B-004 from the OODD strategy doc.** One line. The
   deferral is correct; the visibility is not yet.
   *Anchor: SPEC_METHOD authority chain; OODD organisational
   memory rule.*

7. **Backfill `intake_source` for B-004 and T-033 / T-036** with
   explicit specification-section pointers (`REQ-F-ODDSDLC-*` or
   `REQ-F-ODDSVC-*`). Currently B-004 cites
   `09-odd-service-orchestration-plane.md` but T-033 and T-036 cite
   Python files only.
   *Anchor: SPEC_METHOD intake-source rule; ODD §16 failure #1.*

8. **Treat ODD §11.9 zoom convergence as a cross-tenant dependency,
   not per-tenant gap.** Track it at the ecosystem level so one
   tenant's `RefinementBoundary` operationalization counts for both.
   *Anchor: ODD §11.9.*

This post is commentary. It becomes consequential only if its content
is adopted into `specification/`, ratified design, or accepted ticket
re-shaping.
