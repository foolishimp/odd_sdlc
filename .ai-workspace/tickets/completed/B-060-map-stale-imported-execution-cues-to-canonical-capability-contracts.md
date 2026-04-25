---
id: B-060
title: Map stale imported execution cues to canonical capability contracts
type: bug
ticket_category: ordinary
status: completed
goal: imported-data-mapper-template-yields-admitted-build-and-test-execution-contracts
change_intent: The B-057 data_mapper sandbox preserved canonical tenant capability contracts, but build and test execution remained `undeclared` after normalization. The imported template contains stale execution hints that need lawful mapping into the v3.2 project-profile shape so the RC traversal can reach the test-run-archive boundary without undocumented manual edits.
change_class: realization_refactor
re_entry_point: realization
affected_boundary: project constraint normalization, imported template cue mapping, operational capability projection, build/test execution edges, RC sandbox proof
priority: high
triaged_at: 2026-04-25
created_at: 2026-04-25
updated_at: 2026-04-25
dependencies:
  - B-056 completed
  - B-057 completed
intake_source: B-057 fresh data_mapper sandbox at `/tmp/odd_sdlc_b057_data_mapper_20260425T022937Z`
target_truth: stale imported data_mapper execution hints are normalized into canonical `build_execution_contract` and `test_execution_contract` truth, or are rejected with an explicit actionable reason. The operator does not need undocumented manual edits to `.ai-workspace/context/project_constraints.yml` before the build/test/archive path can be evaluated.
superseded_truth: normalization preserves `capability_contracts` but leaves build and test execution undeclared, while a stale `test_runner` string such as `"""  # set by active tenant (sbt test | dbt test)` survives as unusable operator folklore.
closure_law: this ticket closes when the data_mapper template install produces either admitted build/test execution contracts or a deterministic gap explaining exactly what imported cue is insufficient, and the RC proof no longer depends on manual project-constraints surgery.
evaluation_criteria:
  - stale test/build runner hints are parsed or rejected through one normalization rule
  - canonical `ProjectProfile` exposes usable build/test execution truth when the imported source provides enough evidence
  - final gap dossiers do not report missing build/test capability solely because stale comments were carried as string values
  - no ad hoc data_mapper-only manual edit is required in the proof workspace
proof_surface:
  - source regression test for stale data_mapper-style project constraints
  - installed sandbox proof showing operational capability projection after install/refresh
  - final B-057 successor proof documenting the accepted or rejected contracts
non_closure_conditions:
  - closure is claimed by manually editing the sandbox constraints file
  - stale comments are silently treated as executable commands
  - build/test capability remains `undeclared` without an explicit deterministic reason
---

## Failure Evidence

The B-057 sandbox normalized project constraints to:

- `capability_contracts.spark_session: "true"`
- `capability_contracts.spark_submit_compatible: "true"`
- `build_execution_contract: "undeclared"`
- `test_execution_contract: "undeclared"`
- `test_runner: "\"\"  # set by active tenant (sbt test | dbt test)"`

The final gap dossier still reported:

- `prepare_build_execution_surface`: `missing_build_execution_capability`
- `prepare_test_execution_surface`: `missing_test_execution_capability`

These are not the first RC blocker, but they will block the release/test-run archive boundary after the code traceability edge is repaired.

## Functional Review Criteria

1. Is the imported stale cue mapped through the normalizer instead of by hand?
2. Does the operator-facing gap explain when the cue is insufficient?
3. Does the accepted contract remain canonical v3.2 project-profile truth?
4. Does the proof cover the data_mapper template, not only a synthetic fixture?

## Closure Note

Closed by canonical execution-contract inference in `build_tenants/python/code/odd_sdlc/project_profile.py`, legacy-template normalization in `build_tenants/python/code/odd_sdlc/normalization.py`, and the local design admission rule in `build_tenants/python/design/PROJECT_PROFILE_CONSTRAINTS_CANONICALIZATION.md`.

The data_mapper template now normalizes to:

- `test_runner: "sbt test"`
- `build_execution_contract: "sbt clean assembly"`
- `test_execution_contract: "sbt test"`
- `deployment_contract: "spark-submit"`
- `runtime_observation_contract: "OpenLineage"`

Proof surfaces:

- source regression `test_b060_normalize_data_mapper_template_maps_stale_execution_cues`
- design surface `PROJECT_PROFILE_CONSTRAINTS_CANONICALIZATION.md`
- fresh reset sandbox `/tmp/odd_sdlc_rc_data_mapper_20260425T041353Z`
- final generated execution artifacts `docs/45-generated-build-execution.md`, `docs/47-generated-test-execution.md`, `docs/50-generated-deployment.md`, and `docs/60-generated-runtime-observation.md`
- final B-057 reset gaps: `gap_count: 0`
