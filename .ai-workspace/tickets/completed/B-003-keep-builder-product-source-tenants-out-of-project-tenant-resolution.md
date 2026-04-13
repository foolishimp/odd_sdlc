# B-003 Keep Builder Product Source Tenants Out Of Project-Tenant Resolution

- id: B-003
- title: Keep builder product source tenants out of project-tenant resolution
- type: bug
- status: completed
- goal: ambiguity-governance-and-traceability
- priority: high
- created_at: 2026-04-13
- updated_at: 2026-04-13
- dependencies: B-001, T-003

## Triage

- intake: bug / architectural regression / source-vs-installed boundary confusion
- lawful_change_class: realization_refactor
- affected_boundary: odd_sdlc source-repo profile resolution, ambiguity detection, and source-side regression proof
- lawful_re_entry: odd_method realization surfaces for project-profile resolution and source-side proof lanes
- downstream_proof_span: source-repo profile resolution plus non-regression against installed workspace topology rules

## Why This Ticket Exists

Recent resolver changes started treating sibling builder product lines inside the
`odd_method` source repo as though they were competing project realization
tenants.

That is a category error.

The intended ontology is:

- immutable released products install under `.genesis/` and `.odd_sdlc/`
- enduring mutable workspace state lives under `.ai-workspace/`
- `build_tenants/` in a governed target workspace carries the project's own
  mutable realization tenants

The `odd_method` source repo is builder source, not an installed target project.
Incubating builder product lines such as `odd_sdlc` and `odd_service` must not
enter project-tenant ambiguity selection for source-side profile resolution.

## Intended Direction

Source-side project-profile resolution should preserve the declared source
tenant root and ignore sibling builder product tenants when detecting competing
project realization roots.

This is a bug fix, not a change in downstream workspace law.

Installed target workspaces should continue to resolve project realization under
their declared `build_tenants/<tenant>/` roots. The source-repo fix only
restores the boundary that recent resolver changes blurred.

Follow-on architectural work may still make workspace mode explicit, but this
ticket closes the immediate category regression first.

## Task List

- [x] Prevent builder product source tenants from being treated as project
  realization candidates during source-side resolution.
- [x] Add a regression proving that sibling `odd_sdlc` / `odd_service` roots do
  not trigger `multiple_realization_roots` or
  `declared_root_vs_realized_root_mismatch` in a source-style workspace.
- [x] Prove that query/traceability still bind to the declared source tenant
  rather than a sibling builder product line.
- [x] Record the fix in the parent boundary wave so the boundary restoration is
  visible in RC tracking.

## Proof Required

- source-side resolver proof:
  - a source-style workspace with sibling `odd_sdlc` and `odd_service` trees
    still resolves to the declared project tenant root
- ambiguity proof:
  - source-side ambiguity detection does not emit competing-root ambiguities
    from sibling builder product tenants
- query proof:
  - requirement closure binds code refs to the declared source tenant, not a
    sibling builder product line

## Acceptance

- builder product source tenants are no longer treated as competing project
  realization roots in source-side profile resolution
- source-style query/traceability bind to the declared project tenant root
- downstream installed workspace topology behavior remains unchanged

## Progress

- 2026-04-13: restored the source-repo boundary in
  `odd_sdlc.project_profile` by excluding incubating builder product tenants
  from project realization candidate discovery
- added source-side regression proof in `test_odd_sdlc_installation.py`
  covering sibling `odd_sdlc` and `odd_service` trees
- verified live source-repo behavior:
  - `output_dir == build_tenants/odd_method/python/`
  - candidate list is empty
  - competing-root ambiguity no longer fires

## Completion

Closed 2026-04-13 on focused internal proof.

Internal proof completed:

- `python -m pytest build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_installation.py -q -k 'governance_neighbor_exists or builder_product_neighbors_in_source_repo'`
  - result: `2 passed, 16 deselected in 1.60s`
- live source-repo resolver check:
  - `load_project_profile('.') -> build_tenants/odd_method/python/`
  - `realization_candidates_for_declared_root('.') -> []`
  - ambiguity classes no longer include `multiple_realization_roots` or
    `declared_root_vs_realized_root_mismatch`

## Links

- parent: `/Users/jim/src/apps/odd_method/.ai-workspace/tickets/active/B-001-refactor-odd-method-to-released-abg-boundary.md`
- sibling: `/Users/jim/src/apps/odd_method/.ai-workspace/tickets/completed/T-003-enforce-spec-method-structured-build-topology-for-project-tenants.md`
- strategy: `/Users/jim/src/apps/odd_method/.ai-workspace/comments/codex/20260413T023750Z_STRATEGY_preserve-builder-direction-separate-runtime-boundaries.md`
- standard: `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`
- standard: `/Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md`
