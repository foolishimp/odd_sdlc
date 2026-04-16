# T-008 Add Arbitrary-Span Graph Gap Analysis With Lawful Zoom

- id: T-008
- title: Generalize odd_sdlc gap analysis so operators can zoom out over any two graph points and their dependent refined nodes for a full lawful gap analysis
- type: feature
- status: active
- goal: ambiguity-governance-and-traceability
- priority: high
- created_at: 2026-04-16
- updated_at: 2026-04-16
- dependencies: T-004, B-011

## Triage

- intake: downstream architecture follow-on / operator analysis expansion / multi-scale proving requirement
- lawful_change_class: behavioral_completion
- affected_boundary: odd_sdlc graph analysis, span selection, refinement expansion, gap publication, operator/runtime cost control, and multi-scale convergence inspection
- lawful_re_entry: odd_sdlc graph/gap analysis engine, graph-function publication semantics, span projection policy, cached proof reuse, and downstream operator surfaces
- downstream_proof_span: synthetic arbitrary-span fixtures plus replay on live recursive and non-recursive workspaces

## Why This Ticket Exists

`B-011` fixed the immediate false-convergence defect:

- public refined carriers now reopen their enclosing coarse contract
- top-level product convergence now stays open when live current requirements
  still lack executable proof

That fix was intentionally bounded.

It makes the current public parent contract truthful without turning every
`gaps()` call into a full recursive graph solver.

That is the correct first move for trust, but it is not the final capability.

The next required feature is broader:

- choose any two graph points
- zoom out to the lawful carrier spanning them
- include the dependent refined nodes that materially realize that span
- run a full gap analysis over that span at the chosen scale
- confirm that coarse and refined views agree

In other words, the system must support arbitrary span-level proving rather
than only:

- local active edges
- globally published product closure
- special-case parent contracts for recursive public carriers

This is needed for real operator work.

Without it, a designer or operator can still ask a lawful question such as:

- "show me the full gap state from requirements to reviewed design"
- "zoom out from scenario derivation to realized test evidence"
- "evaluate the span from coarse carrier `b` to coarse carrier `c`, including
  the refined inner nodes that currently realize that span"

and the current system cannot yet answer that as a first-class analysis
surface.

## Intended Direction

`odd_sdlc` should support arbitrary lawful graph-span analysis.

Given:

- a start graph point
- an end graph point
- an optional work key
- a zoom policy

the runtime should be able to derive:

1. the enclosing lawful span between those points
2. the dependent graph functions, vectors, and refinement boundaries that
   materially realize that span
3. a coarse gap view over the selected span
4. a refined gap view over the internal realizing structure
5. an algebraically consistent combined judgment over both

The result should make it possible to inspect closure at different scales
without redefining the meaning of convergence at each scale.

## Cost Strategy

This feature must not silently turn the default runtime into a whole-graph
global solver.

The implementation should stay economically bounded:

- default `gaps()` remains the current trust-preserving pass
- arbitrary-span analysis is explicit and operator-invoked or policy-invoked
- graph expansion is bounded by a declared span and zoom policy
- dependent-node inclusion is derived from published graph law, not heuristic
  filesystem scanning
- repeated analysis should reuse cached or previously published proof material
  where lawful

Practical meaning:

- no mandatory all-pairs graph analysis during ordinary iteration
- no unconditional traversal of every refinement boundary in the workspace
- explicit expansion limits and deterministic selection rules

## Scope Boundary

This ticket is in scope for:

- selecting an arbitrary lawful graph span between two graph points
- deriving the dependent nodes and refinement boundaries required to analyze
  that span honestly
- publishing coarse-only, refined-only, and combined span gap views
- ensuring that zoomed and unzoomed judgments over the selected span are
  algebraically consistent
- adding operator surfaces to request span analysis explicitly
- adding policy hooks for bounded expansion depth / refinement inclusion /
  cache reuse
- proving cost-bounded behavior on representative workspaces

This ticket is not in scope for:

- making default workspace convergence compute all possible spans
- replacing local evaluator machinery with one monolithic theorem prover
- changing GTL algebra or refinement-boundary law
- silently weakening the stricter convergence truth introduced by `B-011`

## Design Constraints

The full implementation should preserve these constraints:

- span selection must use published graph structure, not ad hoc naming
- the enclosing coarse contract for the selected span must remain visible even
  when the span is fully refined internally
- dependent refined nodes must be included because they are materially
  required, not because they happen to be nearby
- the returned analysis must distinguish:
  - direct span gaps
  - refinement-internal gaps
  - global proof-lane incompleteness that keeps the selected span open
- runtime cost must be inspectable and bounded

## Candidate Surface Shape

The exact API can be repriced during implementation, but the capability should
be expressible in a surface like:

```text
odd_sdlc gaps \
  --from <graph_point_a> \
  --to <graph_point_b> \
  --zoom <coarse|refined|combined> \
  --include-dependent
```

or an equivalent structured runtime request.

The important part is the law, not the exact flag spelling:

- the operator names two graph points
- the runtime computes the lawful span
- the runtime includes its dependent realizing structure
- the runtime returns a gap judgment that is stable under zoom

## Task List

- [ ] Define the lawful notion of a "graph span" between two graph points in
  odd_sdlc/GTL terms.
- [ ] Define how dependent nodes and refinement boundaries are selected for a
  requested span.
- [ ] Add a bounded span-expansion algorithm that can derive coarse and
  refined views for the selected span.
- [ ] Add a combined span-gap result that preserves algebraic agreement across
  coarse and refined views.
- [ ] Bind current executable-requirement completeness into span-level closure
  where the selected span encloses active current requirements.
- [ ] Add explicit operator/runtime surfaces for requesting span analysis.
- [ ] Add cost controls: declared expansion policy, deterministic pruning, and
  lawful proof/cache reuse.
- [ ] Prove at least one synthetic arbitrary-span example and one live replay
  on a downstream workspace.
- [ ] Document the capability and its cost model once proven.

## Acceptance

- an operator can request lawful gap analysis between any two graph points in a
  published graph
- the runtime derives the enclosing span and its dependent realizing
  structure deterministically
- coarse and refined views over that selected span no longer contradict each
  other
- span closure remains open when required dependent nodes or executable proof
  witnesses are still missing
- the implementation is bounded and does not force unconditional whole-graph
  analysis during normal runtime use
- the resulting analysis is useful for real zoom-in / zoom-out operator work
  rather than only for one hard-coded recursive parent case

## Links

- completed precursor:
  `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/completed/B-011-require-scale-consistent-convergence-across-coarse-and-refined-arcs.md`
- GTL builder guide:
  `/Users/jim/src/apps/abiogenesis/docs/LLM_GTL_APP_BUILDER_GUIDE.md`
- ODD method authority:
  `/Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md`
