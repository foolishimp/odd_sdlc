# B-011 Require Scale-Consistent Convergence Across Coarse And Refined Arcs

- id: B-011
- title: Make odd_sdlc convergence and gap analysis lawful across coarse/refined arcs and global executable requirement completeness
- type: bug
- status: completed
- goal: ambiguity-governance-and-traceability
- priority: high
- created_at: 2026-04-16
- updated_at: 2026-04-16
- dependencies: T-004

## Triage

- intake: downstream algebra review / scope-attention defect / scale-consistency gap
- lawful_change_class: interface_reprice
- affected_boundary: odd_sdlc convergence and gap analysis semantics over coarse contracts, refined inner vectors, executable requirement proof coverage, zoomed recursive/composed traversal, and the eventual ODD-level method statement that must capture the resolved global-convergence law
- lawful_re_entry: odd_sdlc graph/gap law, refinement-boundary admission semantics, requirement-closure/proof law, downstream proof over zoomed SDLC carriers, and post-fix propagation into ODD method authority
- downstream_proof_span: focused synthetic zoom fixture plus replay on `data_mapper.test32`

## Why This Ticket Exists

Current `odd_sdlc` convergence is too local.

It can certify a fine-grained branch or single arc as converged while the
enclosing coarse contract is not yet algebraically closed at the larger scale.

It can also allow the net system to look closed while live requirements remain
only specified or planned and are not yet executable through realized test or
proof surfaces.

This is a scope/attention defect, not just a missing threshold.

The GTL builder law already expects zoom work to remain algebraically lawful:

- one public outer carrier over the coarse contract
- explicit `RefinementBoundary` / `CandidateFamily` publication for inner work
- explicit selection and fold-back to the outer contract

That means if a coarse route is:

- `a -> b -> c -> d`

and `b -> c` is zoomed into:

- `b -> x -> y -> c`

then the system must preserve both truths:

1. the fine route converges lawfully
2. the coarse `b -> c` contract is also satisfied lawfully by that refinement

Without that law, gap analysis changes meaning depending on current zoom level:

- zoomed-in local arcs can look green
- zoomed-out product truth can still be open

The same problem appears on requirement completeness.

If a live requirement in the current branch is still only:

- specified
- planned
- implementation-claimed but not executable

then the outer product is still incomplete.

For the active software proving line, incompleteness of requirements being
executable by testcases is a global incompleteness and should force build-out
or explicit repricing/deferment. A local green arc is not enough.

That is the wrong behavior for ODD/SDLC proving.

## Intended Direction

Convergence must be closed under refinement.

That means:

1. a refined inner chain cannot be treated as sufficient proof by itself
2. the enclosing coarse contract must also be evaluated after fold-back
3. gap analysis must be available at multiple scales with algebraically
   consistent results
4. live current requirements lacking executable proof must keep the enclosing
   coarse carrier open unless they are explicitly deferred or repriced out of
   the active branch

Practical meaning:

- local convergence is not final convergence
- refined closure must rebind to and satisfy the coarse outer carrier
- zoomed and unzoomed views must agree on whether the enclosing contract is
  open, partially satisfied, or closed
- outer convergence must fail while any live requirement is only specified or
  planned without a lawful executable witness

For this bug, "executable witness" means at least one governed realized proof
surface appropriate to the requirement class, such as:

- realized testcase execution
- archived test evidence
- runtime observation
- deployment proof
- accounting / reconciliation proof

The immediate pressure on the current software line is realized testcase
executability, but the law should be proof-lane aware rather than hard-coded to
one witness type forever.

## Scope Boundary

This ticket is in scope for:

- repricing convergence semantics so refined closure is checked against coarse
  contract truth
- repricing outer convergence so live requirements without executable proof
  keep the enclosing carrier open
- adding explicit multi-scale gap analysis where coarse and refined arcs can be
  inspected consistently
- wiring the requirement-closure / testcase-authority / test-run-archive truth
  into that coarser convergence judgment
- carrying the resolved law upward into `ODD_METHOD.md` once the implementation
  semantics are proven so global convergence is declared as an ODD-level
  concern rather than left as a local odd_sdlc convention
- proving one synthetic refinement example and one downstream replay

This ticket is not in scope for:

- changing GTL algebra
- removing refinement boundaries or candidate families
- replacing local evaluators with one giant monolithic global evaluator

## Concrete Failure Shape

The failure shape is:

- a local inner branch passes its active evaluators
- fold-back occurs or is implied
- the enclosing coarse contract is not separately checked as the true boundary
- some live requirements remain only specified / planned / not executable by
  governed proof surfaces
- the net system can therefore report a misleadingly converged state at one
  scale while remaining open at another

## Task List

- [x] Define coarse/refined convergence law explicitly for odd_sdlc.
- [x] Make fold-back or outer-carrier rebind reopen coarse evaluation when a
  refined branch closes.
- [x] Define the outer completeness law: any live current requirement lacking a
  lawful executable witness keeps the enclosing carrier open unless deferred or
  repriced.
- [x] Add a scale-consistent gap view so coarse and refined routes can both be
  inspected without contradiction.
- [x] Bind requirement-closure status and realized proof surfaces into that
  outer completeness judgment.
- [x] Prove a synthetic zoom example such as `a -> b -> (x, y) -> c -> d` where
  `b -> c` is refined but must still satisfy the coarse contract.
- [x] Replay on `data_mapper.test32` or an equivalent downstream fixture and
  confirm the reported state is consistent across zoom levels and requirement
  executability.
- [x] After the implementation law is resolved and replay-proven, update
  `/Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md`
  so global convergence is explicit at the ODD level rather than implicit in
  one SDLC realization.

## Acceptance

- a refined inner chain cannot by itself certify enclosing coarse closure
- the enclosing coarse contract is checked lawfully after refinement fold-back
- a live requirement that lacks executable proof cannot be silently absorbed by
  local green arcs
- outer convergence remains open until live requirements are either executable,
  explicitly deferred, or explicitly repriced out of scope
- gap analysis can be performed at multiple scales with algebraically
  consistent results
- zoomed-in and zoomed-out views no longer disagree about whether the net
  system is closed
- after the implementation fix is proven, `ODD_METHOD.md` is updated so the
  resolved global-convergence law is captured as ODD method authority

## Links

- GTL builder guide: `/Users/jim/src/apps/abiogenesis/docs/LLM_GTL_APP_BUILDER_GUIDE.md`
- ODD method authority:
  `/Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md`
- downstream workspace: `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test32`
- related bug:
  `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/completed/B-010-normalize-imported-requirement-ids-across-authority-and-traceability.md`

## Completion Notes

- vendored `genesis.interpret` now publishes `refinement_gaps` plus
  `refinement_total_delta`, so public recursive carriers expose a coarse
  parent-contract view instead of only their refined child vectors.
- recursive callable carriers now certify their own outer termination contract;
  `review_design_by_consensus` no longer depends on a hidden or unbound parent
  evaluator.
- `odd_sdlc gaps` and `gap_snapshot` now project
  `global_requirement_executability`, which keeps top-level convergence open
  while live current requirements remain only planned or partially realized.
- downstream replay on `data_mapper.test32` is now honestly open:
  `odd_sdlc gaps` reports the reopened requirement/test gaps and the global
  executable-requirement pressure instead of a cosmetically converged state.
- `odd_sdlc self-test` now reports a clean pending bootstrap dispatch on
  `data_mapper.test32` rather than crashing when the active bootstrap edge is
  already in flight.
- ODD-level authority is updated:
  `/Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md`
  now states that global convergence must remain stable under zoom and that
  live requirements without executable proof keep the enclosing carrier open.
- focused proof is green:
  - `python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_fd_evidence.py -q`
  - `python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_sandbox_usecase.py -q -k 'consensus_harness_module_runs_from_a_generated_design_surface or resumes_bootstrap_from_the_current_active_edge or reports_clean_pending_dispatch_when_bootstrap_edge_is_already_in_flight'`
  - `PYTHONPATH=.genesis:build_tenants/python/code python -m odd_sdlc gaps --workspace /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test32`
  - `PYTHONPATH=.genesis:build_tenants/python/code python -m odd_sdlc self-test --workspace /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test32`
