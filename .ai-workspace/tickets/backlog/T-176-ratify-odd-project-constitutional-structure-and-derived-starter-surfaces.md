---
id: T-176
title: Ratify ODD project constitutional structure and derived starter surfaces
type: method_reprice
ticket_category: shared_method_migration
status: backlog
proof_status: method_structure_not_started
priority: high
owner: odd_sdlc
created_at: 2026-05-22
updated_at: 2026-05-30
triaged_at: 2026-05-22
activated_at: 2026-05-22
goal: promote the T-175 source-of-truth cleanup from an odd_sdlc repair into shared ODD project construction law and derived starter material
change_class: requirement_reprice
re_entry_point: shared_method
first_missing_layer: ODD_METHOD constitutional structure
governance_scope: STDO Method / ODD Method / Design Module Method / Ticket Method
owning_context: odd_sdlc observed the defect class; specification_methodology owns the shared method surface
upstream_method_target:
  - /Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md
derived_artifact_targets:
  - shared ODD realization/helper library decision
  - empty ODD project template
  - ODD project build guide
source_documents:
  - .ai-workspace/tickets/active/T-175-collapse-design-method-source-of-truth-inconsistencies.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md
related_tickets:
  - .ai-workspace/tickets/active/T-175-collapse-design-method-source-of-truth-inconsistencies.md
affected_boundary:
  shared_method:
    - /Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md
  shared_guides_or_templates:
    - /Users/jim/src/apps/specification_methodology/specification/standards/templates/
    - future ODD project build guide surface
  reusable_realization:
    - shared or tenant-local ODD project helper library surface to be selected by design
  downstream_reference:
    - odd_sdlc TypeScript T-175 consolidation pattern
target_truth: ODD_METHOD states the constitutional structure of any ODD project: specification owns WHAT, realization roots own HOW, design/module decomposition precedes implementation, semantic authority collapses into admitted carriers/catalogs at ingress, effects are isolated at explicit boundaries, and projections/templates/guides/libraries never become rival sources of truth. Starter templates, helper libraries, and build guides are derived aids that must consume or enforce that law rather than redefine it.
superseded_truth: ODD project structure may be learned by copying odd_sdlc, by following local precedent, by reading a guide, by starting from a template, or by repeating ad hoc controller/analyzer/archive/test string lists until inconsistency bugs force local cleanup.
closure_law: This ticket closes only when ODD_METHOD ratifies the general ODD project constitutional structure, the method distinguishes law from library/template/guide surfaces, a reusable-library decision is recorded, an empty project template plan is derived from the method without adding authority, an ODD project build-guide plan is derived from the method without adding authority, and T-175 is explicitly referenced as evidence rather than the source of shared law.
non_closure_conditions:
  - only odd_sdlc is cleaned up while new ODD projects still learn structure by copying odd_sdlc
  - the starter template carries policy not present in ODD_METHOD or product-local specification
  - a build guide introduces authority that ODD_METHOD does not ratify
  - a helper library hides constitutional law inside executable defaults
  - repeated semantic value lists remain acceptable across controllers, analyzers, prompts, archives, projections, and tests
  - compatibility layers preserve old local truth surfaces as active authority
  - ODD_METHOD is updated without a derived implementation/template/guide adoption path
proof_surface:
  method:
    - ODD_METHOD diff reviewed against SPEC_METHOD and DESIGN_MODULE_METHOD
  downstream:
    - T-175 remains the odd_sdlc local cleanup and exemplar
  acceptance:
    - no guide/template/library surface outranks ODD_METHOD or local specification
---

# T-176: Ratify ODD Project Constitutional Structure And Derived Starter Surfaces

## STDO Intake

Smallest lawful re-entry point: `requirement_reprice` at the shared method
surface.

Reason: T-175 identifies a defect class that is larger than `odd_sdlc`
implementation hygiene. The defect is that ODD project structure is not stated
strongly enough as shared constitutional law. Without that law, new ODD
projects can start from copied local patterns, starter templates, or guide prose
that drift into multiple sources of truth.

T-175 remains the `odd_sdlc` cleanup and proof slice. T-176 promotes the
general lesson into shared ODD method law and derived starter material.

## Core Decision

Recommended response:

1. Update `ODD_METHOD.md`.
2. Decide and/or create the reusable library surface that enforces repeatable
   mechanics.
3. Create an empty ODD project template derived from the method.
4. Write an ODD project build guide derived from the method.

This order is required.

The method states the law. The library enforces mechanics. The template
instantiates the empty shape. The guide teaches use. No guide, template, or
library may introduce authority not present in `ODD_METHOD.md` or the
project-local specification.

## Constitutional Structure To Ratify In ODD_METHOD

`ODD_METHOD.md` should gain a section such as:

```text
ODD Project Constitutional Structure
```

Natural placement: after the existing Product Boundary section, because that
section already distinguishes installed product, target project, `specification/`,
and realization roots such as `build_tenants/`.

The section should ratify these invariants:

- an ODD project has one project-owned constitutional `specification/` surface
  for WHAT
- `GOALS.md`, `INTENT.md`, `PRODUCT.md`, and `requirements/` remain the
  governing product truth under `SPEC_METHOD.md`
- realization roots such as `build_tenants/` own HOW and never outrank
  `specification/`
- design/module decomposition is the load-bearing bridge from requirement truth
  to executable realization
- graph functions are the constructive carrier; imperative controllers,
  scripts, services, prompts, or archive readers must not hide the constructive
  carrier
- every semantic boundary has one authoritative carrier, contract, catalog, or
  admitted graph surface
- loose input collapses at ingress into admitted carrier truth
- projections, prompts, reports, archives, query outputs, gap views, and tests
  consume admitted truth; they do not reconstruct authority from sibling files,
  filenames, prose, or local string lists
- effects are isolated to explicit edge modules and consume semantic plans or
  admitted outcomes
- read models remain read models even when they are generated by the runtime
- ABG owns traversal, runtime fact, event, provenance, continuation, and
  projection mechanics; the product owns domain meaning and proof
  interpretation
- a starter template, guide, or helper library is a derived artifact, not a
  constitutional source

## Required Source-Of-Truth Law

ODD_METHOD should make this defect class unlawful for new ODD projects:

- duplicated semantic value lists across carrier unions, validators,
  constructors, analyzer guards, start fallbacks, installed operator fallbacks,
  prompt builders, archives, and tests
- archive artifact filename/kind/requiredness lists maintained separately by
  producers, loaders, runtime gap scanners, liveness checks, fixtures, and
  analyzers
- graph edge, target carrier, closure, dependency, or traversal rows maintained
  as unrelated peer registries
- target coverage, tenant stack, technology capability, or work-plan logic
  reconstructed from Markdown/JSON heuristics after an admitted carrier exists
- prompt or report logic becoming admission logic
- one module both deciding semantic meaning and performing file/process effects

The method should require one source of truth for each semantic boundary and
fail-closed behavior when an authoritative carrier is missing, malformed, or
structurally divergent.

## Derived Artifact 1: Reusable Library

The reusable library decision must come after ODD_METHOD law is explicit.

The library should contain repeatable mechanics, not constitutional policy:

- carrier domain catalogs
- artifact catalogs
- graph/target-carrier contract catalogs
- admission codecs and validators
- effect-shell helpers for archive/file/process edges
- projection helpers that derive from admitted carrier truth
- fixture builders that consume the same catalogs as production code

The library must not:

- hide method law in defaults
- preserve old local truth paths as compatibility layers
- become a place where projects inherit product-specific domain semantics
- let a template or guide define truth that the method does not ratify

The library may be shared globally or tenant-local. The design pass must record
which surface owns it and why.

## Derived Artifact 2: Empty ODD Project Template

The empty template should be thin and derived from `ODD_METHOD.md`.

Candidate starter shape:

```text
specification/
  GOALS.md
  INTENT.md
  PRODUCT.md
  requirements/
build_tenants/
  TENANT_REGISTRY.md
  <tenant>/
    design/
    code/
      src/
        contracts/
        admission/
        effects/
        projections/
    test_env/
.ai-workspace/
  tickets/
    active/
    backlog/
    completed/
  comments/
```

The template must not carry product-specific semantic rows, local value lists,
fallback truth, or copied odd_sdlc catalog contents. It should show where truth
belongs, not pre-populate domain law.

## Derived Artifact 3: ODD Project Build Guide

The build guide should be operational, not constitutional.

It should teach:

- read order: shared method, local specification, requirements, design, then
  realization
- how to declare the smallest lawful re-entry point
- how to move from requirement truth to design/module decomposition
- how to create carrier catalogs and admission boundaries before projections
  or effects
- how to decide when a repeated pattern becomes a library/commonization
  candidate
- how to keep templates and guides from becoming authority
- how to prove no duplicated source-of-truth list remains active

The guide must say explicitly that `ODD_METHOD.md` and local specification
surfaces outrank the guide.

## Relationship To T-175

T-175 is the local `odd_sdlc` cleanup and exemplar.

T-176 is the shared-method extraction.

T-175 may provide concrete examples, including:

- carrier domain catalogs replacing local traversal value lists
- artifact catalogs replacing repeated archive filename/kind/requiredness lists
- admission codecs replacing analyzer-local JSON-shape helpers
- effect shells replacing semantic modules that write archive/process state
- tests consuming catalog/admission surfaces rather than duplicating semantic
  values

T-175 must not become the shared authority by precedent. The shared authority is
`ODD_METHOD.md` after ratification.

## Required Break Order

1. Patch `ODD_METHOD.md` with the constitutional ODD project structure.
2. Review the patch against `SPEC_METHOD.md` and `DESIGN_MODULE_METHOD.md`.
3. Record the reusable-library decision: shared library, tenant-local library,
   or explicit do-not-commonize rationale.
4. Derive the empty project template from the method text.
5. Derive the ODD project build guide from the method text.
6. Reconcile T-175 wording so it points to the shared law rather than acting as
   a local-only precedent.

## Acceptance Criteria

- [ ] `ODD_METHOD.md` states the ODD project constitutional structure.
- [ ] `ODD_METHOD.md` distinguishes method law from guide/template/library
  artifacts.
- [ ] The method states that semantic boundary truth must collapse to one
  carrier, contract, catalog, or admitted graph surface.
- [ ] The method states that projections, prompts, archives, gap views, and
  tests must consume admitted truth rather than reconstruct authority.
- [ ] The method states that effects must be isolated from semantic kernels.
- [ ] The method states that starter templates are derived convenience
  artifacts, not authority.
- [ ] The method states that build guides are operational guides, not authority.
- [ ] The reusable-library decision is recorded with an owning surface.
- [ ] The empty ODD project template plan is derived from the method and does
  not carry product-specific semantic truth.
- [ ] The ODD project build-guide plan is derived from the method and does not
  introduce guide-only law.
- [ ] T-175 remains a local cleanup/proof ticket and references the shared
  method law once ratified.

## Review Questions

1. If a new ODD project starts from the template, does it know where
   constitutional truth lives without copying odd_sdlc?
2. Does every semantic boundary have one authoritative carrier/catalog/admission
   path before projections and effects consume it?
3. Can a prompt, report, archive reader, analyzer, or test reconstruct authority
   when the admitted carrier is absent?
4. Does any guide or template introduce a rule not stated in ODD_METHOD or local
   specification?
5. Does any helper library hide method law in defaults or compatibility
   behavior?
6. Can a second recurrence of source-of-truth drift trigger a library review
   rather than another local patch?

## Non-Goals

- Do not close T-175 by writing shared method text alone.
- Do not create a compatibility layer for old local truth paths.
- Do not copy odd_sdlc-specific domain catalogs into a starter template.
- Do not move product-specific SDLC semantics into ODD_METHOD.
- Do not make `ODD_METHOD.md` a how-to guide; keep detailed operational steps
  in the build guide.
- Do not make the reusable library a substitute for project-local
  specification or design.

## Closure Evidence

Populate before close:

- [ ] ODD_METHOD patch path and summary
- [ ] Design/module-method review outcome
- [ ] reusable-library decision and owner
- [ ] empty template path or ratified plan
- [ ] build guide path or ratified plan
- [ ] T-175 reconciliation note
