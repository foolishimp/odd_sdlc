# B-019 Operator Gap Truth Still Mixes Declared-Obligation Edges With Fallback Graph Gaps

- id: B-019
- title: Narrow the remaining gap-analysis defect to one canonical operator gap surface that explicitly distinguishes declared-obligation edges from fallback graph-gap edges
- type: bug
- ticket_category: implementation_migration
- severity: sev-1
- status: completed
- goal: requirement-realization-fidelity
- priority: critical
- created_at: 2026-04-17
- updated_at: 2026-04-20
- dependencies: odd_sdlc B-020 completed; abiogenesis B-013 completed; abiogenesis B-014 completed

## Triage

- intake: pipeline evaluation correctness / false convergence signal / silent feature failure
- change_intent: finish the remaining operator-gap truth cleanup by making the public gap surface distinguish declared-obligation edges from fallback graph-gap edges instead of presenting them as one homogeneous semantic class
- change_class: design_reframe
- re_entry_point: design_surface
- triaged_at: 2026-04-18
- lawful_change_class: design_reframe
- affected_boundary: odd_sdlc canonical gap projection, span aggregation, operator-facing gap semantics, and explicit classification of non-ledger lanes
- lawful_re_entry: gap-projection design first; then operator/read-model realization and re-proving on a fresh workspace
- downstream_proof_span: operator-facing gaps must distinguish edges with declared carry/fulfillment accounting from edges that still expose only fallback graph-gap truth

## Migration Declaration

- old_truth_path: canonical operator gaps merge declared-ledger edges and fallback graph gaps into one read model while fallback rows still publish synthetic carry/fulfillment convergence
- new_truth_path: canonical operator gaps classify `declared_obligation_edge_gap` and `graph_edge_gap` separately and preserve that distinction through span aggregation and operator projection
- producers_old:
  - `odd_sdlc.span_analysis._canonical_graph_gap`
  - `odd_sdlc.span_analysis.aggregate_edge_gap_truth`
- producers_new:
  - `odd_sdlc.traceability.collect_declared_obligation_gaps`
  - `odd_sdlc.span_analysis.canonical_edge_gaps`
  - `odd_sdlc.span_analysis.aggregate_edge_gap_truth`
- consumers_old:
  - `odd_sdlc.app.gaps`
  - `odd_sdlc.query.query_domain`
  - operator span-gap reads
- consumers_new:
  - `odd_sdlc.app.gaps`
  - `odd_sdlc.query.query_domain`
  - operator span-gap reads
- derived_surfaces:
  - `odd_sdlc gaps`
  - span gap summary
  - `query_domain()["gaps"]`
  - first-slice proof lanes
- closure_law: this migration closes only when fallback graph gaps no longer claim synthetic carry/fulfillment truth, mixed fallback-plus-ledger summaries are explicitly classified, and mixed old/new proof is no longer accepted as closure evidence

## Migration Checklist

- [x] old truth path is named explicitly
- [x] new truth path is named explicitly
- [x] producer set for the new truth is listed
- [x] consumer set for the new truth is listed
- [x] projection/read-model surfaces are listed
- [x] old truth path is removed or explicitly demoted from authority
- [x] mixed-state behavior is no longer accepted as closure evidence
- [x] tests proving mixed old/new behavior are removed or repriced
- [x] ticket wording, product wording, and proof claims are reconciled before closure

## Completion

This ticket is closed.

The surviving operator-gap defect is now resolved at the read-model layer:

- fallback `graph_edge_gap` rows no longer publish synthetic carry/fulfillment
  convergence as if those fields were real edge truth
- canonical gap summary now publishes the declared-vs-fallback class split
  explicitly
- mixed declared/fallback span proof now asserts the distinction instead of
  treating one summary as semantically homogeneous

The landed realization is in:

- `odd_sdlc/build_tenants/python/code/odd_sdlc/span_analysis.py`
- `odd_sdlc/build_tenants/python/code/odd_sdlc/app.py`

The repriced proof is in:

- `odd_sdlc/build_tenants/python/test_env/tests/test_odd_sdlc_first_slice.py`

## Scope Boundary

This closure does **not** claim that every vector in the graph now has one
declared obligation-ledger family.

It closes the narrower migration seam carried by `B-019`:

- operator-facing gap rows now distinguish declared-ledger truth from fallback
  graph-gap truth
- summary publication no longer flattens those classes into one semantically
  over-strong read model

Remaining design and routing work stays open in:

- `T-010`
- `T-016`
- `T-017`
- `B-030`
- `B-032`

## Scope Correction

The original ticket described the explicit per-edge obligation model as absent.
That is no longer true.

`odd_sdlc` now publishes declared requirement obligation ledgers and separates
carry from fulfillment on the main requirement-bearing lanes. `B-020` closed
that migration seam for the in-scope early authoring edges.

The remaining defect is narrower and operator-facing:

- fallback graph gaps still publish synthetic `carry_converged = true` and
  `fulfillment_converged = true`
- span aggregation still flattens declared-ledger gaps and fallback graph gaps
  into one summary without publishing the class split explicitly
- `gaps` therefore still looks semantically stronger and more uniform than the
  underlying truth really is

## Bug Statement

The public gap surface still mixes two different truth classes:

1. `declared_obligation_edge_gap`
   - edges with explicit carry and fulfillment accounting through the domain
     obligation-ledger family
2. `graph_edge_gap`
   - edges that still expose only raw graph-gap truth

`canonical_edge_gaps(...)` currently merges both into one operator read model.
For fallback graph gaps, `_canonical_graph_gap(...)` still projects:

- `carry_converged = true`
- `fulfillment_converged = true`
- `edge_converged = graph_converged`

That makes fallback graph gaps look semantically stronger than they are.

The real residual bug is:

- the operator gap surface does not clearly distinguish declared
  carry/fulfillment truth from raw fallback graph-gap truth
- remaining non-ledger lanes are not explicitly classified at the operator
  surface
- span aggregation and downstream reading can therefore over-read semantic
  equivalence where only graph-gap fallback exists

## Why This Matters

The current operator contract already gives `gaps` and bounded span analysis
real authority. That makes classification drift at this layer a real product
defect, not an internal cleanup task.

If a fallback graph-gap edge is presented as if it had carry/fulfillment truth,
operators can misread:

- what is actually certified at that edge
- which blocking reasons came from obligation accounting versus raw graph
  failure
- how much of the graph has actually migrated to the declared-ledger model

## Carried Requirement

The lawful bounded span-gap capability is already carried in `odd_sdlc`
authority and remains in force. This ticket must preserve and deepen that
published requirement rather than treating it as open ticket-only history.

Current authority already carries it here:

- [10-odd-sdlc-software-domain-buildout.md](/Users/jim/src/apps/odd_sdlc/specification/requirements/10-odd-sdlc-software-domain-buildout.md:167)
  `REQ-F-ODDSDLC-020 / AC-4` requires operator-facing gap analysis to lawfully
  zoom over a bounded span between graph points and their dependent realizing
  structure
- [PRODUCT.md](/Users/jim/src/apps/odd_sdlc/specification/PRODUCT.md:462)
  publishes bounded operator-invoked span gap analysis as active product
  behavior
- [PRODUCT.md](/Users/jim/src/apps/odd_sdlc/specification/PRODUCT.md:522)
  publishes the current `odd_sdlc gaps --from-edge ... --to-edge ... --zoom ...`
  surface

## Disambiguated Boundary

The fix belongs in `odd_sdlc`, not ABG.

### ABG owns

- dispatch
- bindings
- prompt assembly mechanism
- certification and event carriage
- convergence orchestration

### odd_sdlc owns

- how declared-ledger edges are projected to operators
- how fallback graph-gap edges are classified
- what distinction is visible at the operator/read-model layer
- what a blocking reason means when no declared obligation ledger exists

## Required Direction

1. Keep the declared obligation-ledger model already landed for migrated
   lanes.
2. Make the operator gap surface distinguish:
   - `declared_obligation_edge_gap`
   - `graph_edge_gap`
   in a way operators can lawfully read without assuming they mean the same
   thing.
3. Stop publishing synthetic carry/fulfillment convergence on fallback graph
   gaps as if those fields were real edge truth.
4. Make span aggregation preserve the class split explicitly rather than
   flattening mixed declared-ledger and fallback graph gaps into one summary.
5. Preserve the current no-shadow-tracker rule: extend the existing
   traceability / obligation-ledger family rather than inventing a second
   tracker.

## Acceptance

- operator-facing gaps clearly distinguish declared-ledger edges from fallback
  graph-gap edges
- fallback graph-gap edges are explicitly classified rather than silently
  treated as semantic-equivalent to declared-ledger edges
- fallback graph-gap rows do not publish synthetic carry/fulfillment convergence
  claims as if those fields were real edge truth
- span aggregation preserves the class distinction instead of flattening it away
- no new shadow tracker is introduced
