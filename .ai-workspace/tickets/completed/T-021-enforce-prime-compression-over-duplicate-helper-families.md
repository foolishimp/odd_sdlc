---
id: T-021
title: Enforce prime compression over duplicate helper families
type: chore
ticket_category: implementation_migration
migration_strategy: inside_out_hard_break
status: completed
goal: reduce odd_sdlc realization entropy by eliminating duplicate and small-variation helper truth under the adopted Design Module Method
change_intent: Replace duplicate and near-duplicate helper families with one prime helper seam per semantic responsibility, so local implementation meaning is not split across multiple convenience variants
change_class: design_reframe
re_entry_point: design_surface
affected_boundary: odd_sdlc helper-family parsing, classification, projection, register-read, and write-if-changed publication semantics across app, span analysis, constructor, operational dispatch, project profile, normalization, analysis, gap dossier, execution contract, and traceability index, including constructor-side project-constraints parsing that must collapse into the project-profile boundary
priority: medium
triaged_at: 2026-04-22
created_at: 2026-04-22
updated_at: 2026-04-22
dependencies:
intake_source: review against `SPEC_METHOD.md`, `TICKET_METHOD.md`, and `DESIGN_MODULE_METHOD.md` after Prime Law adoption as binding realization method
old_path_classification: duplicated helper families with the same semantic job across multiple modules = replace; retained pairs are lawful only when explicitly proven to consume different admitted truth or to sit at materially different effect boundaries
governing_design:
  - DESIGN_MODULE_METHOD.md
  - SPEC_METHOD.md core interface migration rule
  - TICKET_METHOD.md implementation migration category
authoritative_contract: one prime helper seam or one typed carrier/projection seam owns each semantic responsibility; duplicate helper variants are non-authoritative and block closure unless explicitly justified as distinct compatibility or boundary-specific behavior
target_truth: each named helper family has one authoritative implementation path, call sites consume that path directly, and any retained pair is documented as a true semantic distinction rather than a local convenience fork
superseded_truth: scattered duplicate or near-duplicate helpers in `app.py`, `span_analysis.py`, `constructor.py`, `operational_dispatch.py`, `project_profile.py`, `normalization.py`, `analysis.py`, `gap_dossier.py`, and `traceability_index.py`
closure_law: closes only when every named duplicate helper family is collapsed to one authoritative implementation or explicitly justified as semantically distinct, old helper variants are removed or demoted from authority, and mixed duplicated paths no longer count as acceptable execution
evaluation_criteria:
  - every named helper family resolves to one authoritative implementation path or one explicit documented distinction
  - no two live helpers perform the same semantic parse, classification, projection, register-read, or write-if-changed job with only local variation
  - call sites consume the authoritative helper family rather than preserving silent local twins
  - if a retained pair exists, the distinction is tied to different admitted truth or a materially different effect boundary
  - any new shared helper introduced by the migration satisfies the Prime Law rather than acting as convenience aggregation or proxy-interface preservation
non_closure_conditions:
  - a duplicate helper family remains live in normal execution
  - one helper becomes the preferred path but the old variant remains silently authoritative through wrappers, local copies, or near-identical forks
  - a retained helper pair differs only by filtering, naming, payload shape, or call-site convenience that could be parameterized
  - review cannot state which helper is authoritative for a named family
  - tests pass only because duplicate helpers still agree rather than because the old variant is gone or explicitly demoted
proof_surface:
  - structural source proof over the named helper families
  - focused unit or integration tests on the collapsed helper paths
  - negative proof that stale helper variants are rejected, unreachable, or absent from named public consumers
---

## Migration Declaration

- old_truth_path: duplicate and near-duplicate helper functions across multiple
  modules each perform the same local semantic job and can silently drift
  because callers select whichever helper is convenient
- new_truth_path: one prime helper seam owns each named semantic
  responsibility; all downstream callers consume that seam directly, and any
  retained pair is documented as a materially distinct boundary
- producers_old:
  - `app._parse_scope_selector(...)`
  - `span_analysis._parse_scope_selector(...)`
  - `app._declared_obligation_specs(...)`
  - `span_analysis._declared_obligation_specs(...)`
  - `app._capability_gap_entries(...)`
  - `span_analysis._capability_gap_entries(...)`
  - `constructor._classify_operational_binding(...)`
  - `operational_dispatch.classify_operational_binding(...)`
  - `project_profile._strip_quotes(...)`
  - `constructor._strip_quotes(...)`
  - `constructor._project_constraints_path(...)`
  - `constructor._project_constraint_scalar(...)`
  - `constructor._module_names(...)`
  - `project_profile._default_project_slug(...)`
  - `normalization.default_project_slug(...)`
  - `analysis._write_json_if_changed(...)`
  - `gap_dossier._write_json_if_changed(...)`
  - `analysis._write_text_if_changed(...)`
  - `gap_dossier._write_text_if_changed(...)`
  - `execution_contract._write_if_changed(...)`
  - `analysis._workspace_mode(...)`
  - `traceability_index._workspace_mode(...)`
  - `constructor._load_operational_dispatch_register(...)`
  - `operational_dispatch.load_operational_dispatch_register(...)`
- producers_new:
  - one authoritative helper owner per named family, hosted in the deepest
    existing owner module unless a new helper seam is proven prime and
    irreducible
- consumers_old:
  - `app.gaps(...)`, `app.iterate(...)`, and `app.start(...)`
  - `span_analysis.span_gap_analysis(...)`
  - constructor asset builders and operational surface constructors
  - local operational dispatch and register reads
  - project-profile and normalization parsing flows
  - constructor project-constraints reads for module, tool, and version interpretation
  - analysis and gap-dossier publication
  - execution-contract register and context publication
  - traceability code-root and workspace-mode selection
- consumers_new:
  - the same public and internal callers, rebound to one authoritative helper
    seam per family
- projection_read_model_surfaces:
  - gap surfaces
  - span analysis rows
  - operational dispatch records
  - analysis manifest and gap dossier publication
  - project/profile-derived workspace interpretations

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

## Functional Review Criteria

Every implementation and review pass must ask:

1. Did the slice collapse a duplicate helper family, or only add a delegating
   wrapper while both old variants remain live?
2. Is one helper clearly authoritative for the named semantic job, or can
   callers still pick among small local variants?
3. If a new shared helper was introduced, is it structurally prime, or is it
   convenience aggregation that merely centralizes noise?
4. Do call sites consume the same helper seam directly, or do they preserve
   local copies that can drift independently?
5. If two helpers remain, is the distinction tied to different admitted truth
   or a materially different effect boundary, rather than to naming or payload
   drift?
6. Did the slice reduce semantic duplication without collapsing unrelated
   boundaries into a false abstraction?
7. Can structural proof show that the old helper path is gone or explicitly
   demoted from the named public consumers?

Passing tests do not satisfy this section if two live helper variants still
carry the same semantic job in normal execution.

## Required Break Order

1. Inventory the full best-guess duplicate-helper family set for this ticket.
2. Choose one authoritative owner per family, or explicitly justify why one
   irreducible new helper seam is needed.
3. Sever one old helper variant in a family and keep it broken.
4. Rebind all named call sites in that family to the authoritative helper seam.
5. Remove or explicitly demote wrapper/proxy variants that only preserve the
   old local call shape.
6. Add structural proof that the old variant no longer participates in normal
   execution.

## Break-To-Closure Map

- Breaks 1-2 close the source-inventory and prime-owner declaration clause.
- Breaks 3-4 close the “one authoritative implementation path” clause.
- Break 5 closes the no-proxy/no-wrapper clause.
- Break 6 closes the negative-proof and mixed-state clause.

## Impacted Interface Review Checklist

Every implementation and review pass must walk this list before tests are used
as closure evidence.

- [x] scope selector parsing has one authoritative helper family across
  [app.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/app.py:156)
  and
  [span_analysis.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/span_analysis.py:14)
- [x] declared-obligation spec extraction has one authoritative helper family
  across
  [app.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/app.py:168)
  and
  [span_analysis.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/span_analysis.py:91)
- [x] capability-gap projection has one authoritative helper family across
  [app.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/app.py:193)
  and
  [span_analysis.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/span_analysis.py:39)
- [x] operational binding classification has one authoritative helper family
  across
  [constructor.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/constructor.py:142)
  and
  [operational_dispatch.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/operational_dispatch.py:82)
- [x] quote stripping has one authoritative helper family across
  [project_profile.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/project_profile.py:167)
  and
  [constructor.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/constructor.py:155)
- [x] project slug defaulting has one authoritative helper family across
  [project_profile.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/project_profile.py:174)
  and
  [normalization.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/normalization.py:135)
- [x] project-constraints parsing for module/tool/version interpretation has one authoritative helper family across
  [constructor.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/constructor.py:122)
  and
  [project_profile.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/project_profile.py:867)
- [x] write-if-changed JSON publication is one authoritative helper family
  across
  [analysis.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/analysis.py:51)
  and
  [gap_dossier.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/gap_dossier.py:19),
  with
  [execution_contract.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/execution_contract.py:326),
  or is explicitly split by a real effect-boundary distinction
- [x] write-if-changed text publication is one authoritative helper family
  across
  [analysis.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/analysis.py:74)
  and
  [gap_dossier.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/gap_dossier.py:27),
  with
  [execution_contract.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/execution_contract.py:326),
  or is explicitly split by a real effect-boundary distinction
- [x] workspace mode detection has one authoritative helper family across
  [analysis.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/analysis.py:41)
  and
  [traceability_index.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/traceability_index.py:790),
  or is explicitly tied to different admitted source truth
- [x] operational dispatch register loading has one authoritative helper family
  across
  [constructor.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/constructor.py:125)
  and
  [operational_dispatch.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/operational_dispatch.py:57)

## Mixed-State Negative Proof

Closure requires structural proof that duplicate helper families no longer
stand in the named public consumers.

At minimum, proof must show one of:

- the old helper variant has been removed
- the old helper variant is unreachable from the named public consumers
- the old helper variant is explicitly demoted to compatibility with bounded
  scope and does not participate in normal execution

One happy-path test with both variants still present does not count as closure
evidence.

## Progress Notes - 2026-04-22

- T-021 is now active.
- The first duplicate-helper family is collapsed:
  `scope selector parsing`, `declared obligation spec extraction`, and
  `capability-gap projection` are now owned by `span_analysis.py` as the prime
  gap-analysis helper seam.
- `app.py` no longer defines local twin implementations for that family; it
  consumes `parse_gap_scope_selector(...)`, `declared_obligation_specs(...)`,
  and `capability_gap_entries(...)` from `span_analysis.py`.
- Structural proof was repriced so the test suite asserts `app.py` no longer
  defines the old helper variants while `span_analysis.py` remains the sole
  owner of the new authoritative helpers.
- The second duplicate-helper family is also collapsed:
  scalar quote stripping and default project-slug derivation are now owned by
  `project_profile.py`. `constructor.py` and `normalization.py` consume
  `strip_scalar_quotes(...)` / `default_project_slug(...)` directly instead of
  carrying local twins.
- The third duplicate-helper family is also collapsed:
  operational binding classification and operational dispatch register reads
  are now owned by `operational_dispatch.py`. `constructor.py` no longer
  carries local twins or a stale register-path constant; it imports
  `classify_operational_binding(...)` and `latest_operational_dispatch(...)`
  directly at the operational surface constructors.
- The fourth duplicate-helper family is also collapsed:
  idempotent JSON/text publication is now owned by `publication_io.py`.
  `analysis.py`, `gap_dossier.py`, and `execution_contract.py` no longer
  carry local write-if-changed twins; caller-specific action reporting remains
  local only in `analysis.py`.
- The fifth duplicate-helper family is also collapsed:
  workspace mode detection is now owned by `project_profile.py` through
  `resolve_workspace_mode(...)`. `analysis.py` consumes the canonical
  classification path directly, while `traceability_index.py` uses the same
  seam with published-state preference intact instead of carrying a second
  local `_workspace_mode(...)` helper.
- Structural source proof now walks the named retired helper defs directly and
  fails if they reappear in the previously affected modules.
- Reopened on 2026-04-22 after review found one missed live family:
  `constructor.py` still carried local parsing of `project_constraints.yml`
  for `module_structure`, `tool`, and `version`. Closure is blocked until
  that constructor-side parse authority is removed, structural proof names
  the retired helpers, and the project-profile boundary remains the sole
  owner of that interpretation.
- Final closure reconciliation on 2026-04-22:
  the constructor-side project-constraints parser family was removed,
  `ProjectProfile` now carries `tool`, `version`, and `module_structure`,
  constructor consumers use `load_project_profile(...)` and
  `declared_module_names()` directly, and the repriced proof bundles passed:
  `3 passed, 66 deselected` in `test_odd_sdlc_first_slice.py`,
  `5 passed, 27 deselected` in `test_odd_sdlc_installation.py`, and
  `1 passed, 26 deselected` in `test_odd_sdlc_fd_evidence.py`.

## Why This Ticket Exists

The Design Module Method now makes duplicate helper families a direct design
defect.

This ticket does not exist to punish large modules.

It exists because a small duplicated helper is still architecture when multiple
callers can select different semantic versions of the same local job.

The closure target is one prime helper seam per semantic responsibility, not a
cosmetic rename and not a broad module split for its own sake.
