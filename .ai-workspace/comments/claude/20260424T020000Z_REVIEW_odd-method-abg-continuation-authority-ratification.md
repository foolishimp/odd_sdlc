# REVIEW: ODD method ratification of ABG continuation authority

**Author**: claude
**Date**: 2026-04-24
**Addresses**: `specification_methodology/specification/standards/ODD_METHOD.md` §11.5A (new), `odd_sdlc/build_tenants/python/design/adrs/ADR-002-abg-continuation-authority-and-cooperative-operational-dispatch.md` (Approved), `odd_sdlc/.ai-workspace/tickets/active/B-043-close-broad-query-plugin-and-operational-dispatch-open-projection-surfaces.md` (updated Context + closure_law + Scope)
**Status**: Open

## Summary

This is the right move and the method elevation is lawful under `ODD_METHOD.md §9 Method Governance And Audit`. Adding `§11.5A ABG Owns Continuation And Re-Entry` as shared constitutional law captures the architectural rule the B-043 operational-dispatch diagnosis surfaced. The ADR-002 is well-shaped as a tenant-local binding. B-043 now cites the shared law correctly.

Three structural concerns remain, none of which invalidate the ratification:

1. The method ratification is correct but B-043 itself still doesn't match B-041/B-044-caliber ticket shape — the ticket update patched Context + closure_law + Scope but did not rewrite the ticket into the full implementation-migration form the failure class requires.
2. The §5F structural carrier diagram and §6B module-derived unit test lane that my prior B-043 review flagged are not yet addressed by the method ratification pass (appropriate — different scope) and remain required before implementation opens.
3. ADR-002 cites `REQ-F-ODDSDLC-038` and `REQ-F-ODDSDLC-039` as implementing. Those requirements should be verified to exist and say what the ADR claims; ADRs implement requirements, not invent them.

## Analysis

### §9 Method Governance And Audit compliance — correct elevation

The ODD_METHOD §9 text explicitly says: *"approved shared-pattern work must update `ODD_METHOD.md` when it changes or clarifies the reusable structural law"* and *"no shared structural pattern becomes 'approved by usage' / no grey pattern becomes constitutional by drift / reusable structural law is ratified in `ODD_METHOD.md`."*

This ratification follows that path lawfully:

- A specific incident (odd_sdlc `dispatch_operational()` mixing authorities) exposed a latent method-level rule
- The rule applies to any GTL/ABG app, not only odd_sdlc — this is reusable structural law, not tenant-local semantic law
- Therefore it belongs in ODD_METHOD.md, not only in an odd_sdlc ADR
- The ADR is demoted to *tenant-local binding* role, which §8 Responsibility Layers And Local Binding explicitly sanctions

This is the textbook shape of §9 incorporation. The alternative path — leaving the rule only in ADR-002 — would be "approved by usage" drift per §9's explicit prohibition.

### §11.5A itself is well-shaped

Reading the new section against its method neighbors:

**Positive-law clause** (ADR-mandated activities):
- publish typed assets and evidence
- execute one admitted bounded constructive step
- publish downstream read models or domain overlays
- return control to ABG

**Negative-law clause** (prohibited shapes):
- hidden continuation loop
- multi-step controller memory across publish boundaries
- local step inference instead of ABG re-entry
- rival authority treatment of public `next` vs explicit graph-function continuation
- product-local orchestration that effectively replaces ABG

**Drift classification clause**:
> If an application attempts to replace ABG continuation with tenant-local control flow, it is no longer behaving as an ODD application over GTL/ABG. It has drifted into a different architecture that only happens to publish some ODD-shaped artifacts.

That last sentence is the strongest move in the ratification. It reclassifies the failure — not as a bug in ODD apps, but as exit from the architecture. That escalation matches how the tightened DESIGN_MODULE_METHOD.md §10 No Semantic Center Rule escalates hidden-semantic-center code: the issue is architectural identity, not just style.

### Cross-method coherence — clean

The ratification is coherent with provisions elsewhere:

- **§10 Core Law §11.5 Current State Is A Projection** and the new §11.5A are cleanly layered: §11.5 says state is projection not truth; §11.5A says continuation is ABG's truth, not the tenant's. Together they establish that the tenant neither owns current state authority nor owns step-selection authority.
- **§10.4 ABG ownership list** was extended to add *"re-entry after publish boundaries"* — that's §3B Ingress Collapse Rule surfaced as a positive ABG responsibility.
- **§10.6 Query And Service Layers** addition *"They also do not own continuation truth"* closes a specific drift vector (disguising continuation authority as service-layer concern).
- **§16 Failure Pattern** should probably be updated to add a new bullet naming the continuation-loop-drift failure mode (currently 8 bullets; tenant-replacing-ABG-continuation is a distinct pattern worth an explicit entry). Minor future-method work.

### ADR-002 is correctly shaped as tenant-local binding

Reading ADR-002 against the method:

- **Frontmatter** cites `Governed By: ODD_METHOD.md, DESIGN_MODULE_METHOD.md` — correct §8 responsibility-layer binding
- **Enforcement Shape section (L122-125)** says explicitly: *"This ADR is a tenant-local binding of the shared ODD method rule that GTL/ABG applications are cooperative bounded-step subsystems and must not replace ABG continuation."* — correct §9 role
- **Doesn't re-author the rule** — applies it specifically to `dispatch_operational()`
- **Operational Dispatch Rule section** enumerates the exact five-step shape for a lawful invocation (resolve → materialize-if-prepare → execute-if-declared-contract → publish → return)
- **Query And Read-Model Rule section** correctly broadens the principle to read-model surfaces — addresses the same §10.6 clarification the method added

**One observation**: the ADR says it implements `REQ-F-ODDSDLC-038, REQ-F-ODDSDLC-039`. Under SPEC_METHOD.md authority flow, requirements are the source of truth and ADRs implement them. These two requirement IDs should be verified to exist in `specification/requirements/` and to state the law the ADR implements. If they're new requirements added in this pass, the requirement family should be cited in the ratification summary for traceability. If they're pre-existing, the ADR's citation should be enough. A `rg -n 'REQ-F-ODDSDLC-03[89]'` pass over `specification/` would confirm.

### B-043 update — partial

B-043's updated Context section (L37-44) correctly cites:
- `ODD_METHOD.md` as governing
- ADR-002 as the local binding

B-043's updated closure_law (L15) correctly adds:
> operational_dispatch is reduced to a single-step cooperative adapter that publishes one admissible tenant-owned operational advance and returns control to ABG. It does not close by teaching odd_sdlc to own a multi-step operational continuation loop.

B-043's updated Scope (L48-58) correctly includes:
> tenant-local multi-step operational continuation logic

All three are correct pointer work.

**What the update did not do** (still flagged from my prior B-043 review):

- No `ticket_category: implementation_migration` frontmatter
- No `migration_strategy: inside_out_hard_break` frontmatter
- No `change_intent` distinct from target_truth
- No `triaged_at`
- No `superseded_truth`
- No `evaluation_criteria`
- No `non_closure_conditions`
- No Migration Declaration block
- No Migration Checklist
- No Evaluator Gate with three-evaluator checkboxes
- No Impacted Interface Review Checklist
- No Required Break Order (still has the softer `Initial Direction`)
- No Mixed-State Negative Proof
- No Links section
- No §5F structural carrier diagram requirement for the operational-continuation lane
- No §6B module-derived unit test lane named in proof_surface

These remain gaps. The method ratification pass didn't fix them because it was explicitly scoped to method + ADR + ticket-pointer work, not ticket-structural rewrite. Flagging so the implementer knows the ticket needs further treatment before implementation opens.

### Specific closure gates B-043 still needs to add

**§3A Evaluator Gate with method-cite probes:**

- **E1 Authority Seam Closure**: "removing the authoritative continuation carrier (disable `start(...)` re-entry OR clear gap dossier) must cause `dispatch_operational()` to fail closed, not silently advance on controller-cached state"
- **E2 Essential Carrier Consolidation**: "no new operational-continuation carrier family introduced — implementation uses the existing five families (public start result, admitted execution contract, project profile capability contracts, gap dossier read model, operational dispatch register)"
- **E3 Enforcement After Proof**: "`dispatch_operational()` return is a closed typed carrier; no `dict[str, Any]` escape hatch at the adapter boundary"

**§5F Structural Carrier Diagram** for the operational-continuation lane, showing the five existing carriers plus `dispatch_operational` as `<<binding/adapter>>` (per §6 taxonomy), NOT as a carrier.

**§6B Module-Derived Unit Tests**:
- `dispatch_operational()` admits no truth it did not receive from the five IACS carriers
- `dispatch_operational()` re-reads published state from filesystem at each phase boundary, not from app-object cache
- Single-invocation can advance at most one operational step
- When the admitted step is not tenant-owned, `dispatch_operational()` declines and returns

**§11B Opportunistic Optimization** fence: if implementation surfaces the temptation to unify public-next truth and explicit-graph-function truth inside `dispatch_operational()` — that IS the retired semantic center; triage as a successor ticket, not silent absorption.

**Mixed-State Negative Proof** per §11.5A:
1. Test that an invocation that carries multi-step controller state across a publish boundary fails a named assertion
2. Test that `dispatch_operational()` returns after one admissible advance even if there is a next step available
3. Test that `dispatch_operational()` never blends public-next authority and explicit-graph-function authority in the same invocation

### On keeping `dispatch_operational()` at all

Under §11.5A strictest reading, the question isn't hidden but worth naming: *if ABG owns all continuation, does the tenant need a tenant-local `dispatch_operational()` function at all?* An alternative would be operator commands issue `start(target=...)` calls directly and observe results.

ADR-002 chose the middle path: `dispatch_operational()` exists but is restricted to one admissible advance. That's defensible as operator ergonomics — the adapter bundles "admit → materialize → execute → publish evidence" into one command so operators don't need to script five calls manually. But it's worth naming that this is the *justification* for the adapter's existence under §11.5A. Without the justification, a future reviewer might legitimately ask "why isn't this function deleted?"

**Recommendation**: ADR-002 could add one paragraph explicitly naming the ergonomic justification: `dispatch_operational()` is retained (rather than deleted) as a one-step operator adapter that bundles ABG-owned step resolution + tenant-owned prepare/execute + evidence publication into one operator command. The one-step restriction makes it cooperative; the bundling makes it operator-useful.

### Priority rating

B-043 is `priority: medium`. Given that the failure mode is now classified as *architectural drift out of the ODD shape itself* (per §11.5A's "it has drifted into a different architecture that only happens to publish some ODD-shaped artifacts"), medium may be too low. This is a high-severity architectural integrity issue, not a routine cleanup.

**Recommendation**: consider escalating to `priority: high`, matching B-041's severity rating. The rationale: a tenant that silently replaces ABG continuation has exited the ODD architecture, and the repair belongs at the same priority as the Python-side strict-lane fixes that B-040/B-041/B-042/B-044 tracked.

### Method test coverage — appropriate to not run

The user noted no tests were run on this pass. Under §9 Method Governance, method ratification is specification/design work, not runtime code. Testing the method itself is not the right check; testing the *implementations governed by* the method is the right check, and those are B-043 scope.

However: one method-level sanity probe is lawful and cheap — verify that the claimed `REQ-F-ODDSDLC-038` and `REQ-F-ODDSDLC-039` actually exist in `specification/requirements/` and state law consistent with ADR-002. If those requirements are missing or contradict the ADR, the ratification chain is incomplete. This is a one-line `rg` check; worth running before leaving the ratification unverified.

## Recommended Action

1. **Accept the method ratification** — ODD_METHOD.md §11.5A and the tightened §10 surface are correctly shaped, correctly elevated per §9, and correctly bound by ADR-002. This is the right architectural move.

2. **Verify REQ-F-ODDSDLC-038 and REQ-F-ODDSDLC-039 exist and match.** One-line `rg` check over `specification/requirements/`. If they don't exist or don't match, add or reconcile.

3. **Do not open B-043 implementation against the current ticket shape.** The method ratification made the governing law clear but did not rewrite B-043 to peer-ticket shape. Before implementation:
   - Rewrite B-043 to match B-041/B-044-caliber shape per my prior B-043 review
   - Add the §3A Evaluator Gate, §5F Structural Carrier Diagram, §6B Module-Derived Unit Tests, Mixed-State Negative Proof, Required Break Order listed above
   - Incorporate §11.5A citations into the Evaluator Gate as named probes
   - Consider escalating priority to `high` given architectural-drift classification

4. **Optionally add one paragraph to ADR-002** naming the operator-ergonomics justification for retaining `dispatch_operational()` rather than deleting it. Avoids a future reviewer asking "why not remove the function?"

5. **Consider adding a §16 Failure Pattern bullet** to ODD_METHOD.md naming "tenant replaces ABG continuation" as an explicit 9th pattern. Minor future-method work; the current ratification is complete without it.
