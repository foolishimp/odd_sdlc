---
id: T-134
title: Define bootstrap_sdlc induction graph function
type: defect
ticket_category: design_reframe
status: active
review_status: triaged_pending_implementation
goal: typescript-rc-bounded-live-proof
build_tenant: typescript
owner: odd_sdlc
change_intent: Correct the bootstrap graph semantics so bootstrap_sdlc consumes a defined/conformed workspace surface and creates the project bootstrap authority documents, not the full release construction graph.
change_class: design_reframe
re_entry_point: design
affected_boundary:
  - build_tenants/typescript/code/src/graph/
  - build_tenants/typescript/code/src/start/
  - build_tenants/typescript/code/src/spec_method/
  - build_tenants/typescript/code/src/workspace/
  - build_tenants/typescript/test_env/live/
  - build_tenants/typescript/test_env/fixtures/
  - /Users/jim/src/apps/specification_methodology/specification/standards/templates/
priority: critical
triaged_at: 2026-05-09
created_at: 2026-05-09
updated_at: 2026-05-09
completed_at: null
governance_scope: STDO Method
dependencies:
  - T-129 ABG 3.7.1 evaluator and liveness substrate migration
related_tickets:
  - T-133 exposed the defect by mapping one Rust hello-world bootstrap to the broad bootstrap_release_self_test graph.
  - T-132 remains the broader escalation lane after bootstrap semantics are corrected.
intake_source: The operator clarified that bootstrap is the first SDLC edge after the workspace has been defined/conformed. It consumes available workspace assets and creates the initial project bootstrap documents: intent, product, and goals when supportable. It is not intended to generate requirements or run the release construction graph by default.
target_truth: odd_sdlc publishes a first-class `bootstrap_sdlc` GTL graph function. Given a defined/conformed workspace surface, it observes available assets and creates or updates the initial bootstrap authority surfaces inside that workspace: project bootstrap, intent when discoverable, product definition when discoverable, goals when discoverable, and build-tenant profile only when sufficiently defined. Requirement generation is not automatic bootstrap closure; it is a later evaluator-selected action.
superseded_truth: `bootstrap_release_self_test` is the default bootstrap entry for every new workspace, or bootstrap is equivalent to full release-depth construction from intent through code/test/release.
closure_law: This ticket closes only when bootstrap_sdlc is a published lawful graph function with deterministic tests and at least one live sandbox proof showing that a defined/conformed workspace is bootstrapped into project bootstrap, intent, product, and goals surfaces without advancing into requirements or product code unless the evaluator explicitly selects a later graph action.
evaluation_criteria:
  - `bootstrap_sdlc` is a published graph function distinct from `bootstrap_release_self_test`.
  - `bootstrap_sdlc` consumes a defined/conformed workspace surface, produced by the workspace definition/conformance step such as `Fg_conform_project`.
  - `bootstrap_sdlc` can run against a defined workspace with sparse assets.
  - `bootstrap_sdlc` uses the shared standard templates under `/Users/jim/src/apps/specification_methodology/specification/standards/templates/` as the source shape for created project documents.
  - The graph creates or updates `.ai-workspace/context/project_bootstrap.md` inside the defined workspace.
  - When intent is supported, `specification/INTENT.md` is created from `INTENT_TEMPLATE.md` shape and filled with observed/supportable content.
  - When product is supported, `specification/PRODUCT.md` is created from `PRODUCT_TEMPLATE.md` shape and filled with observed/supportable content.
  - When goals are supported, `specification/GOALS.md` is created from `GOALS_TEMPLATE.md` shape and filled with observed/supportable content.
  - If requirements are not supported yet, only the requirements directory/readme or deferred starter requirement template may be installed; no active requirement truth is invented.
  - Intent, product, goals, and build tenant surfaces are emitted only when they are supported by available assets or explicit operator input.
  - Requirement generation is represented as an open evaluator decision, not as implicit bootstrap completion.
  - The public gaps/evaluator view reports the next highest lawful action after bootstrap, such as derive requirements, clarify product, define build tenant, or build a declared product asset.
  - T133 no longer needs to call `bootstrap_release_self_test` to perform initial induction.
  - A regression proves that a hello-world bootstrap does not advance through broad documentation edges before the bootstrap/evaluator layer has selected that later action.
proof_surface:
  - build_tenants/typescript/code/src/graph/module.ts
  - build_tenants/typescript/code/src/graph/catalog.ts
  - build_tenants/typescript/code/src/spec_method/entry.ts
  - build_tenants/typescript/test_env/tests/
  - build_tenants/typescript/test_env/live/
non_closure_conditions:
  - `bootstrap_sdlc` is implemented as an alias for `bootstrap_release_self_test`.
  - Bootstrap automatically derives requirements, design, code, tests, or release surfaces without an evaluator-selected later action.
  - `bootstrap_sdlc` tries to define/conform the raw workspace itself instead of consuming a defined/conformed workspace surface.
  - Workspace bootstrap requires a predeclared full lifecycle graph.
  - The harness hardcodes release-construction targets instead of consuming the bootstrap/evaluator projection.
---

# T-134: Define bootstrap_sdlc Induction Graph Function

## STDO Triage

First missing layer: design.

The current live-lane behavior revealed a semantic error in the word
`bootstrap`. The implementation and harnesses treated bootstrap as:

```text
bootstrap_release_self_test
  -> intent
  -> product
  -> goals
  -> requirements
  -> design
  -> implementation design
  -> component code
  -> tests
  -> release
```

That is not the intended first graph function.

The intended SDLC bootstrap graph function is the first SDLC edge after the
workspace has been defined/conformed:

```text
defined_workspace_surface
  -> project_bootstrap_surface
  -> intent_surface when supported
  -> product_surface when supported
  -> goals_surface when supported
  -> build_tenant_profile when sufficiently defined
  -> evaluator projection of the next lawful action
```

Raw folder discovery and workspace conformance are upstream of this edge.
`bootstrap_sdlc` prepares the SDLC authority surfaces inside the defined
workspace and makes the next action visible. It does not itself perform the
whole SDLC.

## Design Boundary

Bootstrap produces initial authority and observation surfaces. It does not own
construction of later assets.

Source:

- `defined_workspace_surface`
- available/imported assets discovered during workspace conformance
- optional operator seed input

Primary target:

- `{intent, product, goals}` as supportable bootstrap authority surfaces, plus
  explicit ambiguity/evaluator rows for anything not yet supportable.

Allowed bootstrap outputs:

- `.ai-workspace/context/project_bootstrap.md`
- project normalization/profile surface
- ambiguity register / missing-identity pressure
- `specification/INTENT.md` from the shared `INTENT_TEMPLATE.md` shape when supported by observed assets
- `specification/PRODUCT.md` from the shared `PRODUCT_TEMPLATE.md` shape when supported by observed assets
- `specification/GOALS.md` from the shared `GOALS_TEMPLATE.md` shape when supported by observed assets
- `specification/requirements/README.md` or deferred starter requirements from shared templates when requirement authority is not yet available
- build tenant profile when language/runtime/output root are sufficiently defined
- evaluator projection of the next lawful action

Not bootstrap outputs by default:

- requirement surface
- design surface
- implementation design
- implementation module surface
- aggregate domain model
- component topology
- component code
- component tests
- release readiness

Those are later graph functions selected by the evaluator after bootstrap truth
exists.

## Test35 Precedent

`data_mapper.test35` already shows the intended distinction.

The project bootstrap surface says:

```text
This generated surface is a deterministic read model over imported project authority.
It is not a replacement for project-owned specification truth.
```

It then records workspace identity, project identity, source titles, ontology
anchors, read order, and installed runtime start guidance. That is bootstrap as
orientation and induction over known/imported authority, not construction of the
entire product.

The generated requirement file
`specification/requirements/10-generated-bootstrap.md` uses "bootstrap" in a
different local sense: it is a generated requirement inventory for the initial
construction wave. It explicitly says the authority sources are imported
requirement-like documents and that code/test traceability had not started.

The later `bootstrap_release_self_test` executive is therefore a release/self
test construction program, not the definition of bootstrap itself. T133 exposed
the bug because it treated that executive as the default bootstrap action for a
new tiny product.

## Shared Template Authority

Bootstrap must not invent document shape locally. The standard templates already
exist under:

```text
/Users/jim/src/apps/specification_methodology/specification/standards/templates/
```

Relevant templates:

- `INTENT_TEMPLATE.md`
- `PRODUCT_TEMPLATE.md`
- `GOALS_TEMPLATE.md`
- `requirements/README_TEMPLATE.md`
- `requirements/STARTER_REQUIREMENTS_TEMPLATE.md`
- `build_tenants/TENANT_REGISTRY_TEMPLATE.md`
- `build_tenants/variant/README_TEMPLATE.md`
- `build_tenants/common/README_TEMPLATE.md`

The first bootstrap edge must instantiate or fill these shapes according to
observed authority. If a surface is not supportable yet, bootstrap should leave
the standard placeholder/deferred shape honest and project an evaluator gap
instead of fabricating active truth.

## T133 Evidence

The T133 Rust hello-world live run eventually passed and generated:

- `build_tenants/hello_world_rust/Cargo.toml`
- `build_tenants/hello_world_rust/src/main.rs`
- `build_tenants/hello_world_rust/src/proof_contract.rs`

But it did so by invoking `graph_function:bootstrap_release_self_test` and
walking broad SDLC edges until `derive_component_code_surface`. The run duration
was about 4,466,397 ms, or 74.4 minutes.

That is valid evidence that broad construction can eventually materialize a
tiny Rust product. It is not valid evidence for minimum bootstrap overhead.

## Implementation Checklist

- [ ] Publish `bootstrap_sdlc` as a distinct graph function.
- [ ] Keep `bootstrap_release_self_test` as a broader release/testing executive, not the default unknown-folder bootstrap.
- [ ] Wire bootstrap document creation to the shared standard templates, not code-local ad hoc document strings.
- [ ] Wire installed start/bootstrap entry so raw folders first pass through workspace definition/conformance, then `bootstrap_sdlc` creates the bootstrap documents inside the defined workspace.
- [ ] Add deterministic tests for sparse defined workspace, imported-document workspace, and defined hello-world bootstrap workspace.
- [ ] Add a regression proving bootstrap stops before requirements unless the evaluator selects requirements as the next action.
- [ ] Update T133 to use bootstrap/evaluator truth instead of hardcoded `bootstrap_release_self_test`.
