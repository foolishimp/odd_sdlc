---
id: T-134
title: Conform project authority from declared authority input
type: defect
ticket_category: design_reframe
status: completed
review_status: closed_implemented
goal: typescript-rc-bounded-live-proof
build_tenant: typescript
owner: odd_sdlc
change_intent: Correct the initial post-conformance graph semantics so Fg_conform_project_authority consumes a declared authority input inside a defined workspace and conforms the project authority documents, not the full release construction graph.
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
updated_at: 2026-05-10
completed_at: 2026-05-10
governance_scope: STDO Method
dependencies:
  - T-129 ABG 3.7.1 evaluator and liveness substrate migration
related_tickets:
  - T-133 exposed the defect by mapping one Rust hello-world bootstrap to the broad bootstrap_release_self_test graph.
  - T-132 remains the broader escalation lane after bootstrap semantics are corrected.
intake_source: The operator clarified that `bootstrap_sdlc` is the wrong name for this edge. The edge is project-authority conformance after the workspace has been defined/conformed. It consumes a declared authority input, such as `./specification`, a source file, or a specified source folder, then conforms the core authority documents: project context, intent, product, and goals when supportable. It is not intended to generate requirements or run the release construction graph by default.
target_truth: odd_sdlc publishes a first-class `Fg_conform_project_authority` GTL graph function. Given a defined workspace surface and an admitted declared authority input, it observes that bounded input and creates or updates the initial project authority surfaces inside that workspace: project context, intent when discoverable, product definition when discoverable, goals when discoverable, and build-tenant profile only when sufficiently defined. Requirement generation is not automatic authority conformance closure; it is a later `evaluate_next` selected action from gap pressure and published action authority.
superseded_truth: `bootstrap_release_self_test` is the default bootstrap entry for every new workspace, or bootstrap is equivalent to full release-depth construction from intent through code/test/release.
closure_law: This ticket closes only when Fg_conform_project_authority is a published lawful graph function with deterministic tests and at least one live sandbox proof showing that a declared authority input is admitted, normalized to source refs, and conformed into project context, intent, product, and goals surfaces without advancing into requirements or product code unless the evaluator explicitly selects a later graph action.
evaluation_criteria:
  - `Fg_conform_project_authority` is a published graph function distinct from `bootstrap_release_self_test`.
  - `Fg_conform_project_authority` consumes a defined/conformed workspace surface, produced by the workspace definition/conformance step such as `Fg_conform_project`.
  - The graph consumes an explicit declared authority input: `specification_folder`, `source_file`, or `source_folder`.
  - Declared authority input admission is fail-closed with typed reasons: `authority_input_required`, `authority_input_not_found`, or `authority_input_ambiguous`.
  - Admitted authority inputs publish deterministic source refs bounded to the declared input path; the graph must not scan the whole workspace as authority.
  - `Fg_conform_project_authority` can run against a defined workspace with sparse assets.
  - `Fg_conform_project_authority` uses the shared standard templates under `/Users/jim/src/apps/specification_methodology/specification/standards/templates/` as the source shape for created project documents.
  - The graph creates or updates `.ai-workspace/context/project_bootstrap.md` inside the defined workspace.
  - When intent is supported, `specification/INTENT.md` is created from `INTENT_TEMPLATE.md` shape and filled with observed/supportable content.
  - When product is supported, `specification/PRODUCT.md` is created from `PRODUCT_TEMPLATE.md` shape and filled with observed/supportable content.
  - When goals are supported, `specification/GOALS.md` is created from `GOALS_TEMPLATE.md` shape and filled with observed/supportable content.
  - If requirements are not supported yet, only the requirements directory/readme or deferred starter requirement template may be installed; no active requirement truth is invented.
  - Intent, product, goals, and build tenant surfaces are emitted only when they are supported by available assets or explicit operator input.
  - Requirement generation is represented as an open `evaluate_next` decision, not as implicit bootstrap completion.
  - The public gaps/evaluation view reports the next highest lawful action after authority conformance, such as derive requirements, clarify product, define build tenant, or build a declared product asset.
  - Authority-conformance next-action rows identify `evaluate_next` explicitly and do not claim `eval_gap` or `evaluate_action` authority.
  - T133 no longer needs to call `bootstrap_release_self_test` to perform initial induction.
  - A regression proves that a hello-world authority-conformance run can use a preexisting hello-world bootstrap document as a declared `source_file` authority input and does not advance through broad documentation or product-code edges before the evaluator layer has selected that later action.
proof_surface:
  - build_tenants/typescript/code/src/graph/module.ts
  - build_tenants/typescript/code/src/graph/catalog.ts
  - build_tenants/typescript/code/src/spec_method/entry.ts
  - build_tenants/typescript/test_env/tests/
  - build_tenants/typescript/test_env/live/
non_closure_conditions:
  - `Fg_conform_project_authority` is implemented as an alias for `bootstrap_release_self_test`.
  - Authority conformance automatically derives requirements, design, code, tests, or release surfaces without an evaluator-selected later action.
  - `Fg_conform_project_authority` tries to define/conform the raw workspace itself instead of consuming a defined/conformed workspace surface.
  - Authority conformance guesses authority by scanning the entire workspace when no declared authority input has been admitted.
  - A missing, absolute, path-escaping, or type-mismatched authority input is silently accepted.
  - Authority conformance requires a predeclared full lifecycle graph.
  - The harness hardcodes release-construction targets instead of consuming the authority-conformance/next-action projection.
---

# T-134: Conform Project Authority From Declared Authority Input

## STDO Triage

First missing layer: design.

The current live-lane behavior revealed a semantic error in the word
`bootstrap`. The implementation and harnesses treated the first post-conformance
authority edge as:

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

That is not the intended first graph function for a defined workspace.

The intended graph function is project-authority conformance. It is the first
SDLC edge after the workspace has been defined/conformed:

```text
defined_workspace_surface
  -> project_bootstrap_surface
  -> intent_surface when supported
  -> product_surface when supported
  -> goals_surface when supported
  -> build_tenant_profile when sufficiently defined
  -> evaluate_next projection of the next lawful action
```

Raw folder discovery and workspace conformance are upstream of this edge. The
input to this edge is not "the repository"; it is a declared authority input
inside the already-defined workspace. `Fg_conform_project_authority` conforms
the SDLC authority surfaces inside that workspace and makes `evaluate_next`
truth visible. It does not itself perform the whole SDLC.

## Declared Authority Input Contract

Project-authority conformance starts from one admitted authority input:

```yaml
authority_input:
  kind: specification_folder | source_file | source_folder
  path: ./specification | ./bootstrap.md | ./docs/product_seed
```

The input path is workspace-relative. Absolute paths, `..` traversal, missing
paths, and type mismatches fail closed before authority surfaces are projected.

Typed fail-closed outcomes:

- `authority_input_required`
- `authority_input_not_found`
- `authority_input_ambiguous`

Admitted input becomes bounded source refs for this graph function. A
`specification_folder` input admits files under that folder. A `source_file`
admits exactly that file. A `source_folder` admits files under that folder. The
edge must not use a repo-wide scan as replacement authority.

The target transform is:

```text
declared_authority_input
  -> admitted_source_refs
  -> project_bootstrap_surface
  -> intent_surface when supportable
  -> product_surface when supportable
  -> goal_surface when supportable
  -> evaluate_next projection
```

The T-132 hello-world single-tenant bootstrap document is the conformant
source-file regression. It is preexisting product authority. T-134 must conform
project authority from that file and must not use it as permission to run the
broad release/self-test graph.

## Design Boundary

Project-authority conformance produces initial authority and observation
surfaces. It does not own construction of later assets.

Source:

- `defined_workspace_surface`
- admitted declared authority input source refs
- optional operator seed input

Primary target:

- `{intent, product, goals}` as supportable authority surfaces, plus
  explicit ambiguity / `evaluate_next` rows for anything not yet supportable.

Allowed authority-conformance outputs:

- `.ai-workspace/context/project_bootstrap.md`
- project normalization/profile surface
- ambiguity register / missing-identity pressure
- `specification/INTENT.md` from the shared `INTENT_TEMPLATE.md` shape when supported by observed assets
- `specification/PRODUCT.md` from the shared `PRODUCT_TEMPLATE.md` shape when supported by observed assets
- `specification/GOALS.md` from the shared `GOALS_TEMPLATE.md` shape when supported by observed assets
- `specification/requirements/README.md` or deferred starter requirements from shared templates when requirement authority is not yet available
- build tenant profile when language/runtime/output root are sufficiently defined
- `evaluate_next` projection of the next lawful action

Not authority-conformance outputs by default:

- requirement surface
- design surface
- implementation design
- implementation module surface
- aggregate domain model
- component topology
- component code
- component tests
- release readiness

Those are later graph functions selected by `evaluate_next` after authority
truth and gap pressure exist.

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

Authority conformance must not invent document shape locally. The standard
templates already exist under:

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

The authority-conformance edge must instantiate or fill these shapes according
to observed authority. If a surface is not supportable yet, it should leave the
standard placeholder/deferred shape honest and project an `eval_gap` /
`evaluate_next` gap instead
of fabricating active truth.

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

- [x] Publish `Fg_conform_project_authority` as a distinct graph function.
- [x] Keep `bootstrap_release_self_test` as a broader release/testing executive, not the default unknown-folder bootstrap.
- [x] Wire authority document creation to the shared standard templates, not code-local ad hoc document strings.
- [x] Add declared authority input admission for `specification_folder`, `source_file`, and `source_folder`.
- [x] Fail closed when a required declared authority input is missing, absent on disk, path-escaping, absolute, or type-mismatched.
- [x] Wire installed start entry so raw folders first pass through workspace definition/conformance, then `Fg_conform_project_authority` creates the authority documents inside the defined workspace.
- [x] Add deterministic tests for sparse defined workspace, imported-document workspace, and declared hello-world bootstrap source-file workspace.
- [x] Add a regression proving bootstrap stops before requirements unless the evaluator selects requirements as the next action.
- [x] Update T133 to use authority-conformance/evaluator truth instead of hardcoded `bootstrap_release_self_test`.

## Session B Implementation Evidence - 2026-05-09

Status: active; implementation slice ready for review, not closeable.

Implemented surfaces:

- `build_tenants/typescript/code/src/graph/library.ts` publishes `Fg_conform_project_authority`
  as a distinct reusable graph function with defined/conformed workspace inputs
  and authority/evaluator outputs. It does not publish requirement, design,
  component code, test, or release outputs.
- `build_tenants/typescript/code/src/graph/module.ts` admits the reusable graph
  function into the semantic module without removing `bootstrap_release_self_test`.
- `build_tenants/typescript/code/src/workspace/project_authority_conformance.ts` adds a
  read-only conformance projection over shared standard template refs for
  project context, intent, product, goals, and deferred requirements. Post-review
  correction: authority conformance no longer emits an independent
  `derive_requirement_surface` candidate merely because authority is
  supportable. Its next-action rows now render declared
  `TargetObligationBinding` truth when present, or emit
  `target_binding_required_before_next_action`. Follow-up constitutional
  correction: those rows now declare `evaluationFunction: evaluate_next`; the
  projection declares no `eval_gap` or `evaluate_action` authority.
- `build_tenants/typescript/code/src/workspace/project_authority_conformance.ts` now admits
  declared authority inputs as a bounded source-ref surface before authority
  projection. Supported input kinds are `specification_folder`, `source_file`,
  and `source_folder`. Missing input, missing path, path escape, absolute path,
  or file/folder type mismatch fail closed with typed reason refs instead of a
  repo-wide scan.
- `build_tenants/typescript/code/src/workspace/project_authority_conformance.ts` now also
  exposes `materializeSdlcProjectAuthorityConformance`, a deterministic
  authority-materialization helper for the graph function. It writes only
  authority/conformance files: `.ai-workspace/context/project_bootstrap.md`,
  `specification/INTENT.md`, `specification/PRODUCT.md`,
  `specification/GOALS.md`, and deferred `specification/requirements/README.md`
  when supportable. Intent, product, goals, and requirements README shape comes
  from shared standard templates under
  `specification_methodology/specification/standards/templates/`. The bootstrap
  context file remains a compact deterministic read model because no
  project-bootstrap standard template exists. The helper emits no runtime events
  and does not construct release graph, requirements truth, or product files.
- The materialization helper is now idempotent over project-authored truth. It
  creates missing authority files, updates only files that already carry the
  generated conformance marker, preserves manually authored content before the
  generated section, and skips existing non-generated project authority files
  rather than overwriting them.
- `build_tenants/typescript/code/src/workspace/index.ts` exports the
  project-authority conformance surface through the existing workspace public
  module boundary.
- `build_tenants/typescript/code/src/projection/query_domain.ts` now makes the
  initial gaps view explicit as `eval_gap` plus `evaluate_next` with
  `NextActionBasis: initial_selection`, `IntentLineage`, `ProductAssetModel`,
  gap pressure, target binding, action catalog, and next-action projection refs.
- `build_tenants/typescript/code/src/projection/query_domain.ts` exposes
  `Fg_conform_project_authority` as the post-conformance public authority target while keeping
  broader construction edges out of the public start-target set.
- `build_tenants/typescript/test_env/tests/test_t134_project_authority_conformance.test.mjs`
  proves the graph function is conformance-only, uses shared template authority
  refs, handles sparse defined workspaces as ambiguity, and stops before
  requirement/product-code/release construction. It now also proves Rust
  product-file pressure renders target-binding no-action truth instead of a
  requirements fallback, and that requirement action appears only when a
  declared requirement target binding admits it. It also uses the T-132
  hello-world single-tenant bootstrap as a preexisting conformant `source_file`
  authority input and proves authority conformance creates only authority docs,
  not hello-world product code.
- The bootstrap-backed live fixtures for T-131, T-132, and T-133 now declare
  `authorityInput: { kind: "source_file", path: "bootstrap.md", graphFunction:
  "Fg_conform_project_authority" }`. Their sandbox setup writes the declared
  authority input carrier under `.ai-workspace/context/`, materializes
  `.ai-workspace/context/project_bootstrap.md` through
  `materializeSdlcProjectAuthorityConformance`, and targets later product
  materialization as `asset:component_code_surface` instead of treating
  `bootstrap_release_self_test` as the bootstrap path.

Verification recorded for this slice:

- `npm run test:t134` passed, 12/12 after declared-authority, idempotency, and target-binding corrections.
- `npm run test:t030` passed, 9/9.
- `npm run test:t032` passed, 4/4.
- `npm run test:t087` passed, 1/1.

## Closure Note - 2026-05-10

Closed as implemented.

Current proof:

- `npm run test:t134` passed, 12/12.
- `npm run test:t133` passed deterministic contract checks, 2/2, with the full
  live product test skipped by design when `ODD_SDLC_TS_T133_RUST_HELLO_WORLD_LIVE`
  is unset.
- `ODD_SDLC_TS_T133_RUST_HELLO_WORLD_LIVE=1 ODD_SDLC_TS_LIVE_CONFORMANCE_ONLY=1 npm run test:t133`
  passed, 3/3.
- Fresh live archive:
  `build_tenants/typescript/test_env/test_runs/t133_rust_hello_world_bootstrap_sandbox/20260510T071801661Z_pid84063`.

Live closure evidence:

- `Fg_conform_project` converged first.
- `Fg_conform_project_authority` consumed the declared `source_file`
  authority input from `bootstrap.md`.
- The worker/materialization path produced project authority surfaces with
  product intent, product definition, goals, and induced requirement authority.
- The conformed authority content preserved the declared Rust tenant, output
  files, exact output, and execution command.
- The next lawful action projected product materialization through
  `Fg_materialize_declared_product_asset`.
- Product files were intentionally absent at the end of this proof:
  `Cargo.toml` and `src/main.rs` remained unmaterialized because this ticket is
  the authority-conformance edge, not the product-materialization ticket.

Closure boundary:

- claimed: project-authority conformance from declared authority input;
- claimed: initial conformance no longer substitutes `bootstrap_release_self_test`;
- claimed: T-133 can use authority-conformance/evaluator truth as its initial
  proof boundary;
- not claimed: T-133 full Rust product materialization;
- not claimed: `cargo run --quiet` execution proof;
- not claimed: multi-tenant/five-language fan-out.
