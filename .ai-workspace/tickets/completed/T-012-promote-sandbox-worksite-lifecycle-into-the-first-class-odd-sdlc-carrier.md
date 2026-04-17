# T-012 Promote Sandbox Worksite Lifecycle Into The First-Class odd_sdlc Carrier

- id: T-012
- title: Make sandbox definition, creation, reset, execution, and evidence first-class odd_sdlc product behavior instead of pytest-harness-only machinery
- type: feature
- status: completed
- goal: verification-and-operational-proof
- priority: high
- created_at: 2026-04-17
- updated_at: 2026-04-18
- dependencies: T-006, B-013

## Triage

- intake: product-boundary clarification / installed-dev proof reprice / proving-lane promotion
- change_intent: promote sandboxed installed-dev proving from harness-only orchestration into the declared odd_sdlc product carrier
- lawful_change_class: requirement_reprice
- affected_boundary: odd_sdlc product definition, verification requirements, operational command/result/state surfaces, installed-dev proof topology, and downstream proving harness ownership
- lawful_re_entry: requirements and product-definition surfaces for installed-dev proof, then design, graph functions, query surfaces, and proving lanes
- downstream_proof_span: odd_sdlc installed workspace replay, repeatable sandbox reset/rerun proof, and comparison against current sandbox harness behavior

## Why This Ticket Exists

`odd_sdlc` already treats sandbox proof as decisive installed-dev evidence.

That is visible in the current product and requirement surfaces:

- installed-dev proof is the decisive proving lane
- canonical sandbox repeatability is an explicit scenario
- downstream installed workspaces are treated as governed target projects

But the actual orchestration for:

- creating a clean sandbox worksite
- confirming the installed ABG/runtime/kernel is present
- seeding odd_sdlc-local package/design/spec surfaces
- resetting the sandbox to a clean runtime state
- running the canonical proving flow
- capturing and interpreting resulting evidence

still mostly lives in pytest support code and helper scripts.

That means the current situation is structurally mixed:

- sandbox proof is declared as real product truth
- sandbox orchestration is still mostly realized as harness-only implementation detail

That is not the right long-term boundary.

If defining and running a sandbox is real odd_sdlc behavior, then it must be
declared and realized like any other feature build:

- as product behavior
- as requirement truth
- as named assets
- as named graph functions
- as command/result/state surfaces
- as queryable evidence

The harness may remain as a proving client, but it must no longer be the sole
authority for how sandbox lifecycle works.

`B-013` closed the tier-1 bug where the sandbox harness overwrote installer-owned
ABG runtime with repo-root `.genesis`. That fix restores lawful installed-dev
proof, but it does not yet make sandbox lifecycle a first-class product
capability. This ticket is the follow-on promotion.

## Intended Direction

`odd_sdlc` should own sandbox lifecycle explicitly inside the carrier.

That means the product should publish typed assets and graph functions for:

1. sandbox definition
2. sandbox preparation / installation
3. sandbox execution
4. sandbox execution result admission
5. sandbox observation / archive / comparison
6. sandbox reset / rerun semantics

The proving harness should become a client of those surfaces, not the hidden
owner of them.

The governing rule is:

- one lawful surface for sandbox lifecycle truth
- harnesses may invoke it
- harnesses may not silently redefine it

## Candidate Asset Surface

Exact names may be repriced during implementation, but the capability should be
expressible in surfaces like:

- `sandbox_definition_surface`
- `sandbox_preparation_surface`
- `sandbox_preparation_result_surface`
- `sandbox_execution_surface`
- `sandbox_execution_result_surface`
- `sandbox_runtime_observation_surface`
- `sandbox_reset_surface`
- `sandbox_archive_surface`
- `sandbox_comparison_surface`

These should sit alongside the existing operational command/result/state model
rather than as an out-of-band pytest concern.

## Candidate Graph Function Shape

Exact names may change, but the product should be able to publish functions in
the shape of:

- `prepare_sandbox_surface`
- `derive_sandbox_preparation_result_surface`
- `run_sandbox_execution_surface`
- `derive_sandbox_execution_result_surface`
- `derive_sandbox_runtime_observation_surface`
- `prepare_sandbox_reset_surface`
- `derive_sandbox_archive_surface`
- `derive_sandbox_comparison_surface`

The critical thing is not the final spelling. The critical thing is that
sandbox lifecycle becomes visible as typed product behavior instead of hidden
test scaffolding.

## Scope Boundary

This ticket is in scope for:

- repricing `PRODUCT.md` and requirement surfaces so sandbox lifecycle is named
  as current product capability rather than only proving-harness practice
- defining the sandbox lifecycle assets and command/result/state boundary
- publishing graph functions or executive subgraphs for sandbox lifecycle
- making reset/rerun semantics explicit and queryable
- binding sandbox evidence into the governed archive/observation model
- reducing the pytest sandbox helpers so they call product surfaces rather than
  privately owning lifecycle semantics
- preserving the one-lawful-runtime-surface rule from `B-013`

This ticket is not in scope for:

- replacing all tests with graph execution
- forcing every local developer action to go through the sandbox
- changing ABG algebra
- weakening installed-dev proof requirements

## Design Constraints

The implementation must preserve these constraints:

- installer-owned `.genesis` remains the sole lawful runtime surface in the
  sandbox
- odd_sdlc may seed its own package/design/spec surfaces, but must not silently
  redefine ABG runtime truth
- sandbox lifecycle must be expressible through explicit command/result/state
  surfaces, not only imperative helper code
- reset/rerun must be governed and observable
- sandbox evidence must be queryable and retain comparative meaning across runs
- the proving harness may remain, but only as a client over published product
  behavior

## Concrete Failure Shape Today

Today the concrete mismatch is:

- product says installed-dev sandbox proof is decisive
- scenarios say canonical sandbox repeatability is required
- test helpers actually create and run the sandbox
- the runtime/proof lane is therefore partly constitutional and partly hidden
  harness logic

That creates three risks:

1. product behavior and proving machinery can drift apart
2. operators cannot invoke sandbox lifecycle as first-class product behavior
3. harness bugs can silently redefine the proving lane

`B-013` demonstrated exactly this class of failure.

## Task List

- [ ] Reprice `PRODUCT.md` so sandbox lifecycle is named as live product
  behavior rather than only as proving context.
- [ ] Reprice verification/operational requirements so sandbox creation,
  execution, reset, and evidence are explicit requirement truth.
- [ ] Add design surfaces describing sandbox topology, ownership, and lifecycle
  boundaries.
- [ ] Introduce typed sandbox lifecycle assets in the odd_sdlc domain model.
- [ ] Publish graph functions or executive subgraphs for sandbox lifecycle over
  those assets.
- [ ] Bind sandbox lifecycle into the existing operational command/result/state
  pattern introduced by `T-006`.
- [ ] Bind sandbox evidence into governed archive/observation/comparison
  surfaces.
- [ ] Reduce pytest sandbox helpers so they invoke product surfaces instead of
  privately owning lifecycle semantics.
- [ ] Prove a clean install -> prepare -> execute -> observe -> reset -> rerun
  loop through the first-class carrier.
- [ ] Prove that installer-owned ABG runtime remains the sole lawful runtime
  surface throughout that loop.

## Acceptance

- sandbox lifecycle is explicitly part of the live odd_sdlc carrier
- sandbox creation/execution/reset/evidence can be invoked through published
  product surfaces
- pytest harness code is no longer the sole owner of sandbox lifecycle meaning
- installed-dev proof still runs against installer-owned ABG runtime
- rerun/reset behavior is explicit, governed, and queryable
- sandbox evidence is retained as part of the product’s governed proof model
- hidden harness-only lifecycle semantics are removed or reduced to thin client
  wrappers over published surfaces

## Notes On Sequencing

This should follow the already-completed `T-006` operational command/result/state
boundary and the already-completed `B-013` runtime-surface correction.

The likely clean implementation order is:

1. product/requirement reprice
2. domain asset introduction
3. graph-function publication
4. harness reduction to client status
5. installed-dev proof replay

## Links

- completed runtime-surface fix:
  `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/completed/B-013-stop-sandbox-proof-from-overwriting-installer-owned-abg-runtime.md`
- related operational boundary work:
  `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/completed/T-006-add-declarative-operational-state-transitions-for-build-test-and-deploy.md`
- installed-dev proof rule:
  `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`
