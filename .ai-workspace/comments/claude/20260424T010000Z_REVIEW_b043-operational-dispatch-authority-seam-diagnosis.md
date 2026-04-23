# REVIEW: B-043 operational-dispatch authority-seam diagnosis

**Author**: claude
**Date**: 2026-04-24
**Addresses**: `.ai-workspace/tickets/active/B-043-close-broad-query-plugin-and-operational-dispatch-open-projection-surfaces.md`, in-process vs installed-process authority divergence in `build_tenants/python/code/odd_sdlc/operational_dispatch.py`
**Status**: Open

## Summary

The diagnosis is correct at the headline level and identifies the right failure mode under the three evaluators: `dispatch_operational()` has become a hidden semantic center that caches controller-carried state between phase boundaries, which is why a fresh installed invocation sees correct next-edge truth while an in-process call made after a prior publish boundary can miss it. The proposed fix — make `dispatch_operational()` a thin adapter that re-enters published truth after every publish boundary — is the correct shape under `DESIGN_MODULE_METHOD.md §3B Ingress Collapse Rule` + `§10 No Semantic Center Rule` + `§13 Proxy Interface Prohibition`.

The analysis is underspecified in four places against the tightened method: it doesn't name the IACS for the operational-continuation lane, doesn't require a structural carrier diagram for that lane, doesn't include module-derived unit tests in the closure evidence, and frames the negative-proof as convergence-between-authorities rather than fail-closed-when-authority-removed. Those four gaps should go into B-043's tightened closure law before implementation opens.

Recommend keeping B-043 unsplit and owning the fix, but rewriting B-043 to match the full B-041/B-044-caliber ticket shape (which it currently lacks) as a precondition.

## Analysis

### The three-evaluator read is correct

**E1 Authority Seam Closure — confirmed violation.** Under `§3A E1`, the test is: *"if the authoritative carrier were removed, would the system fail closed, or would another path silently reconstruct the same meaning?"* Today the answer is *the meaning survives by reconstruction*, because `dispatch_operational()` synthesizes the next operational step from a blend of public-next, `release_operational_cycle` graph function, gap dossier, and app object state. That is the textbook E1 failure mode.

**E2 Essential Carrier Consolidation — the diagnosis's restraint is right.** The five carrier families already exist (public start result, admitted execution contract, project profile capability contracts, gap dossier read model, operational dispatch register). No new peer carrier is needed. Under `§5C Boundary Inflation Prohibition` the fix must *not* invent an operational-continuation carrier family just to make the adapter legible — that would be the drift `§5C` exists to prevent. The diagnosis correctly flags "rebind authority, not inflate carrier count" as the design target.

**E3 Enforcement After Proof — typing is holding but not complete.** The diagnosis says "typing is doing its job." Under strictest `§4A` that's partially true: mypy-strict is green package-wide since the B-041/B-042 closure upgrade, but `operational_dispatch.py` still carries ~9 `dict[str, Any]` occurrences including `dispatch_operational(app) -> dict[str, Any]`. Mypy tolerates these because `Any` is the escape hatch strict mode permits. That means E3 isn't actively failing, but it isn't actively gating either — the typed envelope is there, the semantic center is still open-shape. The closed-carrier work for the register return is part of the fix B-043 already scopes.

### The root cause is a §10 / §3B / §13 compounding

The diagnosis names "controller memory" as the root cause. The tightened method has three provisions that each name an aspect of this:

- **`§10 No Semantic Center Rule`**: `dispatch_operational()` is acting as the semantic center for operational continuation — it decides "what phase am I in and what comes next" by inspecting state from multiple authorities. Under `§10`, a module is acting as an unlawful semantic center when reviewers must read it to discover "what work is next" — which is precisely what `dispatch_operational()` has become.

- **`§3B Ingress Collapse Rule`**: *"Foreign, dynamic, or weakly-typed input is lawful only at ingress. Once admitted, it must collapse immediately into local carrier truth before semantic transforms begin."* `dispatch_operational()` violates this by carrying admitted state across phase boundaries rather than re-collapsing from published truth at each boundary. The "controller memory" the diagnosis names is exactly repeated-parsing-via-stale-memory.

- **`§13 Proxy Interface Prohibition`**: a proxy interface is one that *"forwards to the old authority path, reconstructs missing truth from the old path, keeps the old path executable behind a new name."* `dispatch_operational()` fits this — it looks like a distinct operational-dispatch surface but actually blends multiple existing authority paths while caching interpreted state. Retiring the proxy shape is the fix.

The diagnosis implicitly identified all three. Making them explicit in the ticket gives three separate review probes rather than one fuzzy "mixed authority" probe.

### The authority map is correct; name it as the IACS

The diagnosis proposes this authority map:

- Route authority → `start(target="graph_function:release_operational_cycle")`
- Local command authority → execution contracts from `project_profile.py`
- Post-dispatch published state → published gap dossier / workspace gaps
- Execution evidence → operational dispatch register

Under `§5A Irreducible Architectural Carrier Set Rule`, this IS the IACS declaration for the operational-continuation lane. B-043 should name it explicitly as such, with Role Matrix (authoritative vs downstream), subordinate payload register, and the promotion test for any candidate addition.

Specifically:

| Carrier | Role | Ingress boundary | Effect boundary | Downstream consumers |
|---|---|---|---|---|
| `release_operational_cycle` graph function dispatch result | authoritative route truth | `start(...)` invocation | none | `dispatch_operational()` phase decision |
| Execution contract (from `project_profile.py`) | authoritative local command truth | project profile resolution | none | prepare-surface admission + result-surface execution |
| Published gap dossier | authoritative post-dispatch state | `publish_gap_surface()` | filesystem publication | re-resolution via next `start(...)` |
| Operational dispatch register | authoritative execution evidence | register write at phase complete | filesystem append | operator read + proof assertion |

`dispatch_operational()` itself is NOT a carrier. It's a binding/adapter module under `§6 Design Module Taxonomy`. The fix is to re-shape it into that role strictly, and name the four carriers above as the IACS it consumes.

### The proposed fix shape matches the method

The 8-step pattern in the diagnosis (resolve → construct prerequisite → publish → re-resolve → run contract → publish → re-resolve → return) is the correct §3B shape: every publish boundary is followed by a re-ingress-collapse. The phrase *"every phase re-enters through published truth. It must not carry forward controller-assumed state"* is the §3B + §10 mandate expressed operationally. That's the right target.

The one implicit assumption worth making explicit: the "published truth" being re-read at each phase boundary is the published gap dossier, and the "authoritative route truth" being re-read is a fresh `start(...)` invocation. Those are two distinct re-reads per phase boundary (state + route). The adapter shape needs both, not just one.

### Closure criteria need four method-aligned additions

The diagnosis proposes these closure criteria:

- query-domain broad projections no longer publish anonymous semantic bags
- `dispatch_operational()` does not mix public next authority with operational-program authority after release-boundary handoff
- every operational continuation step is re-resolved from published truth
- harnessed proof: first/second/third dispatch all succeed in one installed workspace
- negative proof: fresh installed `start(graph_function:release_operational_cycle)` and `dispatch_operational()` agree on the same next operational edge

These are good but incomplete under the tightened method. Four additions:

**1. `§3A` Evaluator Gate with explicit three-evaluator checkboxes.**

Not just "these conditions must hold" but three separate evaluator gates with named probes:
- E1: "if `dispatch_operational()` is forced to re-read only from the four named authorities, does it still produce the correct next-phase answer? Removing any one carrier must fail closed, not silently reconstruct."
- E2: "carrier family count in B-043's slice is five or fewer; no new operational-continuation carrier added."
- E3: "`dispatch_operational()` return is a closed typed carrier (replacing `dict[str, Any]`); `operational_dispatch_register` return is closed; no `cast()` or `@ts-ignore`-equivalent added at the adapter boundary."

**2. `§5F` Structural Carrier Diagram for the operational-continuation lane.**

Mermaid classDiagram showing the four IACS carriers above plus their consumers, with stereotypes `<<authoritative>>` / `<<downstream>>` / `<<subordinate>>` and visibility markers. The diagram fixes the authority map visually so future reviewers don't need to re-derive it from prose.

**3. `§6B` Module-derived unit tests in addition to integration proofs.**

The proposed proofs are all integration-level (three successive dispatches + fresh-start convergence). Under `§6B`, B-043 also needs module-derived unit tests for the adapter:

- Adapter re-reads published gap dossier at each phase boundary (not cached app state)
- Adapter re-reads `start(...)` result at each phase boundary (not cached prior result)
- Adapter rejects stale app-object state when published state has advanced
- Adapter output is a closed carrier, not `dict[str, Any]`

These test the §3B re-ingress discipline directly, at the unit level. The integration proofs test the emergent behavior; the unit tests test the law.

**4. Stronger negative proof framing.**

The proposed negative proof ("fresh start vs in-process dispatch agree on same next edge") is a convergence test — it probes whether two paths produce the same answer. Good, but not the strongest `§3A E1` probe.

The stronger E1 probe per the method: *"if the authoritative carrier were removed, would the system fail closed?"*

Applied here: disable one of the four IACS carriers (monkeypatch the gap dossier read to return stale state, or monkeypatch `start(...)` to return an old edge) and assert that `dispatch_operational()` fails closed — with a named error — rather than silently proceeding on cached controller state. That's the strongest E1 test because it forces the adapter to prove it depends on the published authority rather than on controller memory.

Add both: the convergence probe and the authority-removal-fail-closed probe.

### On whether B-043 owns this — agree, don't split yet

The diagnosis recommends B-043 owns the fix and not splitting. Agree.

Two considerations:

- **Split would be warranted if** the query-domain half and operational_dispatch half had materially different carrier families AND materially different fix timelines. The four IACS carriers above are the operational lane; query-domain plugin projections are a separate lane. They're independent boundaries. But under `§5A` the ticket can legitimately declare TWO IACS (query-plugin IACS + operational-dispatch IACS) in one ticket if both are named explicitly and the Break Order sequences each boundary separately. That's what B-044 did successfully for prepare_release_surface + related consumers.

- **Split becomes warranted later if** implementation on operational_dispatch discovers cross-boundary entanglement with the query-plugin side that makes single-ticket closure infeasible. At that point, split by `§11B Opportunistic Optimization Rule`: any cross-boundary opportunity gets triaged as a successor ticket rather than silently absorbed.

Default: keep as one ticket with dual-IACS declaration. Split only if implementation surfaces a reason.

### B-043 is not currently in the ticket shape this fix requires

My prior B-043 review found the ticket is missing most of TICKET_METHOD.md required structure: no `ticket_category: implementation_migration`, no `migration_strategy: inside_out_hard_break`, no Migration Declaration / Migration Checklist, no Evaluator Gate, no Impacted Interface Review Checklist, no Required Break Order (has `Initial Direction` instead, softer), no Mixed-State Negative Proof, no Links. It was drafted as a thin scope-deferral vehicle for B-040's first-closure overclaim and never brought up to peer-ticket shape.

**This diagnosis cannot safely land under the current B-043 ticket shape.** Without an Evaluator Gate there's no mechanism to require the three-evaluator checkboxes. Without a Required Break Order there's no sequence for "declare IACS → diagram → implement → module unit tests → integration proofs." Without Mixed-State Negative Proof there's no gate on authority-removal-fail-closed.

The fix sequence should be:

1. Rewrite B-043 to match B-041/B-044 ticket shape, adding:
   - `ticket_category: implementation_migration`, `migration_strategy: inside_out_hard_break`, `change_intent`, `triaged_at`, `superseded_truth`, `evaluation_criteria`, `non_closure_conditions`
   - Migration Declaration (with the authority map above as producers_new)
   - Migration Checklist
   - Evaluator Gate with three-evaluator checkboxes
   - Two IACS declarations (query-plugin + operational-dispatch), each with §5F diagram
   - Impacted Interface Review Checklist
   - Required Break Order replacing `Initial Direction`
   - Mixed-State Negative Proof with both convergence and authority-removal-fail-closed probes
   - Module-derived unit test lane in proof_surface

2. Then implement the operational_dispatch adapter fix against that tightened ticket.

## Recommended Action

1. Take the diagnosis as proposed and expand it into a rewrite of B-043 matching B-041/B-044-caliber ticket shape. Include both IACS declarations (query-plugin + operational-dispatch), both §5F structural diagrams, the four-evaluator-gate additions above, and module-derived unit tests.

2. Treat `dispatch_operational()` as a binding/adapter module under `§6`. Its new closure law: *it admits no truth it did not receive from one of the four named IACS carriers, and re-admits after every publish boundary.*

3. Explicitly pin `REALIZED_TEST_SOURCE_OBLIGATION.md`-class probes against operational_dispatch: does any markdown / prompt / doc surface emit imperative strategy about *how to dispatch the next step*, or is all such language declarative/governance-shaped? (`§11A` adjacency — low-probability hit but worth a `rg` sweep.)

4. Close B-043 with both the convergence proof the diagnosis names and the authority-removal-fail-closed negative proof the method demands. The stronger test is the authority-removal one — it forces the adapter to prove it doesn't cache.

5. Do not split B-043 yet. If implementation on operational_dispatch surfaces cross-boundary entanglement with the query-plugin slice, split at that point per `§11B`, not preemptively.
