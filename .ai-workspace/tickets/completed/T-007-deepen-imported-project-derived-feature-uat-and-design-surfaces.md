---
id: T-007
title: Deepen imported software-project feature, UAT, and design surfaces so the first generated cut is materially useful
type: feature
ticket_category: implementation_migration
status: completed
goal: imported software-project first-cut readback becomes materially useful on the live odd_sdlc line
change_intent: Replace thin imported-workspace feature/UAT/design first cuts with authority-carrying generated surfaces that preserve project specificity on the first pass
change_class: requirement_reprice
re_entry_point: requirement_definition
affected_boundary: odd_sdlc imported software-project feature/UAT/design generation quality, imported workspace normalization intake, constructor readback prompts, installed imported-workspace proof
priority: medium
triaged_at: 2026-04-16
created_at: 2026-04-16
updated_at: 2026-04-20
completed_at: 2026-04-20
dependencies:
intake_source: downstream dogfood proving feedback / imported-project constructive weakness / product-quality gap
---

## Migration Declaration

- old_truth_path: imported software-project feature/UAT/design generation emits thin boilerplate-first shells that force the operator to replace large sections before constructive momentum can continue
- new_truth_path: imported software-project feature/UAT/design generation emits materially specific first cuts that read back live requirement authority, module boundaries, proof/query shape, and imported project identity on the first pass
- producers_old:
  - imported-workspace constructor prompt templates with generic shells
  - imported-workspace normalization that fails to project legacy `build_tenants` intake into the canonical current tenant surface
- producers_new:
  - repriced product and requirement surfaces for first-cut readback quality
  - imported-workspace constructor prompts with explicit requirement carry-forward, module boundary, proof/query shape, and imported authority sections
  - imported-workspace normalization that projects legacy `build_tenants` intake into canonical `design_tenants` before generation
- consumers_old:
  - operators manually rewriting generated feature/UAT/design surfaces
  - downstream imported-workspace design/code/test work that cannot rely on the first generated cut
- consumers_new:
  - imported-workspace operator review/refinement flow
  - downstream imported-workspace generation over materially specific first cuts
  - installed imported-workspace proof lanes
- derived_surfaces:
  - `20-generated-feature-decomp.md`
  - `20-generated-uat-testcases.md`
  - `30-generated-design.md` or domain-equivalent design surface
  - imported-workspace normalization report and canonical `project_constraints.yml`
  - installed imported-workspace proof readback
- closure_law: this migration closes only when imported software-project feature/UAT/design first cuts are materially useful on the first generated pass, the old thin-shell path is no longer closure evidence, and installed imported-workspace proof demonstrates the richer readback path

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

## Why This Ticket Existed

Imported-workspace dogfood proved that odd_sdlc could generate the next
intermediate surfaces, but the first generated feature/UAT/design cuts were too
thin to carry the project meaningfully. Operators had to replace large sections
instead of refining a useful first pass.

That was not a need for autonomous one-shot closure. It was a first-cut quality
defect: imported-workspace generation was not reading back enough live project
authority, module boundary, or proof/query shape to preserve momentum.

## Required Direction

1. Make first-cut imported-workspace readback quality explicit in live product
   and requirement authority.
2. Reprice the constructor path so imported software-project feature/UAT/design
   generation reads live requirement authority, imported authority, module
   boundaries, and proof/query shape on the first pass.
3. Prove that an installed imported workspace now gets materially specific
   first generated cuts instead of placeholder boilerplate.

## Acceptance

- imported software-project feature/UAT/design generation produces materially
  useful first cuts
- generated surfaces read back meaningful local project authority rather than
  placeholder shells
- operators refine the first cut instead of replacing it wholesale to preserve
  constructive momentum
- the richer generated cut is proved on at least one installed imported
  workspace

## Completion

- live product and requirement authority now ratify materially useful
  first-cut imported-workspace feature/UAT/design readback in:
  - `specification/PRODUCT.md`
  - `specification/requirements/10-odd-sdlc-software-domain-buildout.md`
- imported software-project constructor prompts now carry:
  - `## Requirement Authority Carry-Forward`
  - `## Declared Module Branches` / `## Major Module Boundaries`
  - `## Proof And Query Shape`
  - `## Imported Authority`
  - `## Governed Project Position`
- imported-workspace normalization now projects legacy imported
  `build_tenants` intake into the canonical current `design_tenants` surface
  so the first-cut generation path runs over one current tenant truth
- focused installed proof is green:
  - `test_normalize_workspace_standardizes_imported_workspace_shape`
  - `test_default_claude_manifest_declares_domain_dispatch_timeout`
  - `test_imported_workspace_first_generated_readback_is_materially_specific`

## Links

- downstream dogfood ticket: `/Users/jim/src/apps/odd_domain/.ai-workspace/tickets/active/T-018-dogfood-odd-domain-through-released-odd-sdlc.md`
- downstream design note: `/Users/jim/src/apps/odd_domain/build_tenants/common/design/ODD_SDLC_DOGFOOD_LINE.md`
- related backlog: `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/backlog/T-008-add-arbitrary-span-graph-gap-analysis-with-lawful-zoom.md`
- standard: `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`
- standard: `/Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md`
