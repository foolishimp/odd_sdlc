---
id: T-014
title: Establish a lawful self-induction lane where released odd_sdlc governs mutable odd_sdlc source development without boundary collapse
type: feature
ticket_category: implementation_migration
status: completed
goal: odd_sdlc self-induction becomes a governed installed-worksite behavior instead of an implied future
change_intent: Make released odd_sdlc governance over mutable odd_sdlc source development explicit in product/requirement/scenario truth and prove it through installed operator surfaces without collapsing source/install/product/worksite identity
change_class: product_reprice
re_entry_point: product_definition
affected_boundary: odd_sdlc self-induction product truth, software-domain requirements, buildout design, installed source-like workspace normalization/traceability, self-induction installed proof lane
priority: high
triaged_at: 2026-04-17
created_at: 2026-04-17
updated_at: 2026-04-20
completed_at: 2026-04-20
dependencies: T-012 completed, T-013 completed, T-015 completed
intake_source: self-hosting/topology review after sandbox runtime-surface correction and worksite-topology discussion
---

## Migration Declaration

- old_truth_path: odd_sdlc self-hosting remains an implied or ad hoc source-repo behavior, and install-time normalization can still collapse a declared odd_sdlc source realization root back onto the generic tenant path
- new_truth_path: released odd_sdlc explicitly governs mutable odd_sdlc source development through installed query/gaps surfaces while preserving the declared source realization root and keeping installed payload under `.genesis/odd_sdlc/`
- producers_old:
  - implied self-hosting commentary
  - install-time normalization that canonicalizes away declared source-style roots
- producers_new:
  - ratified product/requirement/scenario/design surfaces for self-induction
  - installed normalization that preserves conformant declared source-style output roots
  - installed query/gap proof over an odd_sdlc-like mutable source workspace
- consumers_old:
  - ambient source-repo assumptions
  - proof lanes that do not distinguish installed payload from mutable source realization
- consumers_new:
  - installed `odd_sdlc query-domain`
  - installed `odd_sdlc gaps`
  - workspace state / requirement closure register / analysis manifest consumers
  - future self-induction worksite scenarios
- derived_surfaces:
  - `specification/PRODUCT.md`
  - `specification/requirements/10-odd-sdlc-software-domain-buildout.md`
  - `specification/scenarios/15-odd-sdlc-self-induction-worksite.md`
  - `specification/scenarios/TESTCASE_AUTHORITY.md`
  - installed workspace state, analysis manifest, and requirement closure register
- closure_law: this migration closes only when released odd_sdlc governing mutable odd_sdlc source development is live product truth, installed self-induction proof preserves source/install/product/worksite boundaries, and the old normalization collapse no longer remains authoritative behavior

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

Downstream projects already proved the intended law:

- a released installed odd_sdlc product governs a mutable source project
- the released product, installed payload, mutable project, and mutable worksite
  remain distinct

odd_sdlc itself needed the same explicit boundary. Without it, self-hosting
stays half-implied and normalization can silently collapse source-style
realization roots into generic tenant defaults.

## Required Direction

1. Ratify self-induction as current product and requirement truth.
2. Keep installed odd_sdlc payload under `.genesis/odd_sdlc/` while preserving
   the declared mutable source realization root under `build_tenants/...`.
3. Prove that installed odd_sdlc query/gaps surfaces attribute source
   traceability to the mutable project realization rather than to the installed
   payload.

## Acceptance

- odd_sdlc self-induction is described as a real product behavior, not only as
  commentary
- released odd_sdlc can govern mutable odd_sdlc source development through an
  installed worksite lane
- the source/install/product/worksite boundary remains explicit
- odd_sdlc applies to itself the same governance law it applies to downstream
  governed projects
- self-hosting no longer depends on a normalization path that collapses the
  declared source realization root into a generic tenant default

## Completion

- live product truth now states that the same installed-workspace law used for
  downstream projects also governs odd_sdlc self-induction
- `REQ-F-ODDSDLC-034` now ratifies released odd_sdlc governing mutable odd_sdlc
  source development without boundary collapse
- the buildout design now states that installed query/gaps/start/traceability
  must attribute source truth to the declared realization root rather than to
  the installed payload
- installed normalization now preserves conformant declared source-style output
  roots under `build_tenants/...` instead of silently migrating them to the
  generic tenant root
- focused proof is green:
  - `test_load_project_profile_preserves_realized_declared_output_root_for_source_style_workspace`
  - `test_install_release_governs_source_style_odd_sdlc_workspace_without_boundary_collapse`
  - `test_normalize_workspace_standardizes_imported_workspace_shape`

## Links

- downstream analogue:
  `/Users/jim/src/apps/odd_domain/specification/scenarios/40-generated-scenarios.md`
- shared constitutional chain:
  `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`
- shared ODD constitutional method:
  `/Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md`
- topology context:
  `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/completed/T-013-reprice-installed-topology-around-genesis-root-and-tenant-workspaces.md`
- sandbox/worksite promotion:
  `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/completed/T-012-promote-sandbox-worksite-lifecycle-into-the-first-class-odd-sdlc-carrier.md`
