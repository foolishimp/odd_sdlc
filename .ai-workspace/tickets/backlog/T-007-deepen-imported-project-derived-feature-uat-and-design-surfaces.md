# T-007 Deepen Imported Project Derived Feature, UAT, And Design Surfaces

- id: T-007
- title: Deepen imported software-project feature, UAT, and design surfaces so the first generated cut is materially useful
- type: feature
- status: backlog
- goal: ambiguity-governance-and-traceability
- priority: medium
- created_at: 2026-04-16
- updated_at: 2026-04-17
- dependencies:

## Triage

- intake: downstream dogfood proving feedback / imported-project constructive weakness / product-quality gap
- lawful_change_class: requirement_reprice
- affected_boundary: odd_sdlc imported software-project readback for feature decomposition, testcase/UAT derivation, and design derivation over an inherited mutable source project
- lawful_re_entry: odd_sdlc product and requirement surfaces for imported-project readback quality, plus design/realization of the corresponding generated surfaces
- downstream_proof_span: non-live constructor/readback proof plus replay through the odd_domain dogfood line

## Why This Ticket Exists

The released installed `odd_sdlc` product is now governing the mutable
`odd_domain` source project.

That dogfood line has already proved that `odd_sdlc` can generate the next
intermediate surfaces:

- `20-generated-feature-decomp.md`
- `20-generated-uat-testcases.md`
- `30-generated-odd-design.md`

But it also exposed a clear product-quality limitation:

- the first generated imported-project cuts are still too thin to carry the
  line meaningfully on their own
- they do not yet read back enough of the live product authority, semantic
  chain, module boundary, or proof/query shape to be strong first iterations
- to keep the dogfood line moving, those surfaces had to be materially
  hand-authored rather than simply reviewed and refined

That is acceptable as a proving maneuver, but it is too weak as steady-state
imported-project behavior.

`odd_sdlc` should generate a first cut that is already a useful readback of the
project, not just a placeholder shell.

This is not a fundamental constructive failure.

The current line can still advance lawfully through operator iteration and
manual deepening. The issue is that the first generated cut is not yet strong
enough to carry enough momentum on its own.

## Intended Direction

For imported software projects, the first generated feature/UAT/design surfaces
should read materially from live project authority, including where relevant:

- `INTENT.md`
- `PRODUCT.md`
- live requirement families
- current design surfaces
- declared project constraints and selected tenant profile
- observed semantic chain and module boundaries

The target is not "perfect autonomous design."

The target is:

- a first generated cut that is specific enough to review and refine
- stronger continuity from imported project authority into generated
  intermediate surfaces
- less need for the operator to replace generic boilerplate just to preserve
  momentum

## Scope Boundary

This ticket is in scope for:

- repricing product/requirement expectations for imported-project derived
  feature/UAT/design quality
- improving the first generated cut for those surfaces
- proving the richer cut on at least one imported workspace

This ticket is not in scope for:

- forcing full autonomous closure of design/code/test from thin context
- removing operator review and refinement
- changing `odd_domain` semantics to fit `odd_sdlc`

## Task List

- [ ] Make the minimum useful richness for imported-project feature, UAT, and
  design surfaces explicit in odd_sdlc authority.
- [ ] Reprice the corresponding generation path so the first cut reads more of
  the live local project authority rather than emitting near-generic shells.
- [ ] Ensure the generated surfaces can express semantic chain, major module
  boundaries, and proof/query shape where the local project already makes those
  visible.
- [ ] Add focused proof that imported-project generated surfaces contain
  materially specific readback rather than placeholder boilerplate only.
- [ ] Replay the richer path through the current `odd_domain` dogfood line.

## Acceptance

- imported software-project feature/UAT/design generation produces materially
  useful first cuts
- the generated surfaces read back meaningful local project authority rather
  than mostly boilerplate structure
- operators can refine the first cut instead of replacing it wholesale just to
  preserve constructive momentum
- the richer generated cut is proved on at least one imported project, ideally
  the current odd_domain dogfood line

## Current Workaround

The current lawful workaround is operator deepening:

- let `odd_sdlc` generate the first intermediate cut
- refine or materially rewrite that cut where needed
- ingest the result and continue the graph

That means imported-project work is not blocked today. This ticket exists to
make the first generated cut materially stronger so operator effort shifts from
replacement toward refinement.

## Links

- downstream dogfood ticket: `/Users/jim/src/apps/odd_domain/.ai-workspace/tickets/active/T-018-dogfood-odd-domain-through-released-odd-sdlc.md`
- downstream design note: `/Users/jim/src/apps/odd_domain/build_tenants/common/design/ODD_SDLC_DOGFOOD_LINE.md`
- related backlog: `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/backlog/T-008-add-arbitrary-span-graph-gap-analysis-with-lawful-zoom.md`
- standard: `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`
- standard: `/Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md`
