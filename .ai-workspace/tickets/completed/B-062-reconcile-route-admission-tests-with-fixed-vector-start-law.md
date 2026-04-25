---
id: B-062
title: Reconcile route-admission tests with fixed-vector start law
type: bug
ticket_category: ordinary
status: completed
goal: rc-suite-route-admission-law-is-explicit-and-green
change_intent: After the data_mapper topology/test-source fix, the full `test_odd_sdlc_first_slice.py` suite still had a residual cluster of route-admission failures. The failing tests expected dynamic/no-lawful-route behavior when route declarations were removed or dynamic candidates were supplied, while current triage selected fixed vectors first. The route admission order needed one explicit law.
change_class: design_reframe
re_entry_point: design
affected_boundary: triage route admission, fixed-vector route declarations, dynamic route candidate handling, self-test fail-closed behavior, RC suite proof
priority: high
triaged_at: 2026-04-25
created_at: 2026-04-25
updated_at: 2026-04-25
completed_at: 2026-04-25
dependencies:
  - B-054 completed
  - B-058 completed
intake_source: full source test run after B-061 implementation
target_truth: route admission has one explicit precedence law for fixed vectors, missing declarations, and dynamic candidates. Declared authoritative graph-function routes win first; graph-function-only edges fail closed when declaration is absent; declared dynamic routing is consulted before fixed-vector fallback; fixed vectors remain the fallback only when no dynamic-routing declaration is supplied.
superseded_truth: route-admission tests asserted dynamic/no-route behavior while current triage projected `advance_fixed_vector`, leaving the source suite non-green and the RC claim ambiguous.
closure_law: this ticket closes when design law is reviewed and either the triage implementation or the tests are updated, then the route-admission selector and full source file are green.
evaluation_criteria:
  - `prepare_release_surface` with removed declaration has explicit admitted behavior
  - dynamic candidates either participate in route selection by design or are explicitly rejected by design
  - zero-candidate dynamic routing has deterministic fail-closed or fixed-vector behavior
  - self-test agrees with the same route-admission law
  - full `test_odd_sdlc_first_slice.py` passes after the decision
proof_surface:
  - route-admission focused pytest selector
  - full source file pytest run
non_closure_conditions:
  - closure is claimed by weakening assertions without design review
  - dynamic routing is reintroduced as an implicit fallback
  - fixed-vector routing silently ignores missing route authority where method law says it must fail closed
---

## Closure Note

Closed by ratifying and implementing route-admission precedence:

1. realization-iteration graph-function re-entry
2. explicitly declared authoritative head graph functions
3. graph-function-only fail-closed guard rails
4. declared dynamic-routing candidates, including explicit `no_lawful_route`
   when no candidate matches
5. fixed-vector fallback only when no dynamic-routing declaration was supplied

Changed:

- `build_tenants/python/design/HOMEOSTATIC_GAP_TRIAGE_AND_INTENT_RENEWAL.md`
- `build_tenants/python/code/odd_sdlc/triage.py`

Proof:

- focused route selector:
  `5 passed, 114 deselected in 71.53s`
- full source first-slice file:
  `119 passed in 331.36s`
