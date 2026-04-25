---
id: B-063
title: Write v3.2 inferred execution contracts at the normalization boundary
type: bug
ticket_category: ordinary
status: completed
goal: canonical-project-constraints-and-project-profile-agree-on-capability-truth
change_intent: A residual install test exposed split capability truth for imported v3.2 `structure.design_tenants[]` constraints. Normalization rewrote empty execution contracts to `undeclared`, while `ProjectProfile` inferred build and test contracts from the same selected Scala/test-runner cues. The normalized surface and runtime profile must carry the same admitted execution truth.
change_class: realization_refactor
re_entry_point: realization
affected_boundary: project constraint normalization, project-profile admission, capability ambiguity projection, install proof
priority: high
triaged_at: 2026-04-25
created_at: 2026-04-25
updated_at: 2026-04-25
completed_at: 2026-04-25
dependencies:
  - B-056 completed
  - B-060 completed
intake_source: install regression selection after B-053/B-062, especially `test_install_reports_named_capability_diagnostic_before_operational_traversal`
target_truth: v3.2 `structure.design_tenants[]` constraints receive the same admitted execution-contract inference as migrated v3.1 `build_tenants:` constraints. Normalized `project_constraints.yml`, `ProjectProfile`, workspace-state capability projection, and ambiguity register do not disagree.
superseded_truth: empty v3.2 execution fields normalize to `undeclared` while `ProjectProfile` later infers declared build/test capability from Scala and `sbt test` cues.
closure_law: this ticket closes when direct v3.2 normalization writes admitted inferred contracts into the canonical constraint surface and focused install/source tests prove that capability ambiguity is only raised for still-undeclared families.
evaluation_criteria:
  - direct v3.2 selected-tenant cues infer through the same rule as legacy v3.1 migration
  - normalized YAML and `ProjectProfile` agree on build/test declared capability
  - deployment/runtime remain capability-gated when selected truth is insufficient
  - no data_mapper-specific post-install manual edit is required
proof_surface:
  - focused install regression for imported v3.2 constraints
  - existing B-060 stale data_mapper template source regression
  - normalization shape regression for imported workspace constraints
non_closure_conditions:
  - runtime consumers branch on raw YAML shape
  - ambiguity assertions are weakened while YAML/profile truth still diverges
  - explicit unavailable capability is silently reported as declared without selected tenant evidence
---

## Closure Note

Closed by writing admitted execution-contract inference into the v3.2
`structure.design_tenants[]` normalization path, matching the already-canonical
v3.1 `build_tenants:` migration path.

The residual split-brain is gone:

- normalized YAML writes `build_execution_contract: "sbt compile"` and
  `test_execution_contract: "sbt test"` for the minimal Scala/sbt imported
  workspace
- `ProjectProfile`, workspace-state capability projection, and ambiguity
  register agree that build/test execution are declared
- deployment/runtime remain undeclared for the minimal imported workspace and
  are still projected as capability-gated
- the full data_mapper template still admits all four execution families:
  `sbt clean assembly`, `sbt test`, `spark-submit`, and `OpenLineage`

Related cleanup:

- the release operational executive is now all-or-none over build, test,
  deployment, and runtime-observation capability so partial capability does not
  publish a misleading `release_operational_cycle`
- sandbox/use-case tests were updated for current valid-template behavior:
  no synthetic FH gate, query-domain contract `v17`, and event-history
  provenance via `history_basis`

Proof:

- focused install regression: `3 passed, 40 deselected`
- B-060/source profile regression: `3 passed, 121 deselected`
- full install suite: `41 passed, 2 skipped`
- capability-gating use case: `2 passed`
- sandbox focused repairs: `1 passed, 12 deselected` plus the forensic valid
  template route test passed in the paired focused run
- clean data_mapper template install at
  `/tmp/odd_sdlc_b063_data_mapper_20260425T211018Z`
- clean installed bare gaps returns `odd_sdlc.operator_gap_analysis` with
  frontier `derive_intent_surface` and route `advance_fixed_vector`
