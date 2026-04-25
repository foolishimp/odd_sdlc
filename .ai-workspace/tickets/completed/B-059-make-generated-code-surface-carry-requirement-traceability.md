---
id: B-059
title: Make generated code surface carry requirement traceability
type: bug
ticket_category: ordinary
status: completed
goal: generated-code-surface-satisfies-code-traceability-and-obligation-carry
change_intent: The B-057 data_mapper RC sandbox generated a Scala/Spark code surface, but deterministic checks still failed `code_traceability_present` and `derive_code_surface_obligation_ledger_carry_converged`. The constructor fulfilled requirement obligations in the result ledger but did not materialize enough requirement traceability into generated source/test artifacts for the deterministic proof surface to accept the code edge.
change_class: realization_refactor
re_entry_point: realization
affected_boundary: bounded constructor output for `code_surface`, traceability index expectations, generated Scala/Spark source/test files, fulfillment ledger carry, RC traversal proof
priority: critical
triaged_at: 2026-04-25
created_at: 2026-04-25
updated_at: 2026-04-25
dependencies:
  - B-056 completed
  - B-057 completed
intake_source: B-057 fresh data_mapper sandbox at `/tmp/odd_sdlc_b057_data_mapper_20260425T022937Z`
target_truth: generated code and test artifacts for `derive_code_surface` carry the requirement IDs and code/test refs needed by deterministic traceability and declared-obligation carry checks. A generated code surface that claims fulfillment in the worker result must be accepted by `code_traceability_present` and `derive_code_surface_obligation_ledger_carry_converged` without manual tagging.
superseded_truth: the constructor can emit source/test files and fulfillment assessments while the deterministic traceability surface still reports all imported requirements as missing from code refs and the generated Scala file as orphan code.
closure_law: this ticket closes when source and installed proof show `derive_code_surface` can converge past code traceability and declared-obligation carry for the data_mapper imported requirement set.
evaluation_criteria:
  - generated code files contain admissible trace tags for carried requirement IDs
  - generated test files contain admissible test trace tags where the edge expects test refs
  - `code_traceability_present` passes for the generated code surface
  - `derive_code_surface_obligation_ledger_carry_converged` passes or reports only lawful downstream blockers
  - the fix is generated from the constructor/traceability contract, not a manual sandbox edit
proof_surface:
  - source regression test over the bounded constructor output
  - installed data_mapper sandbox proof reaching beyond `derive_code_surface`
  - final gap dossier showing no code traceability blocker at `derive_code_surface`
non_closure_conditions:
  - closure is claimed by editing generated sandbox files by hand
  - traceability is faked in a read model without tags or code/test refs in generated artifacts
  - code edge still reports orphan generated source files or missing requirement IDs
---

## Failure Evidence

The B-057 final gap dossier reported `derive_code_surface` as the head blocker:

- `blocking_reasons: ["missing_from_edge_obligation_set"]`
- `graph_failing: ["code_traceability_present", "code_surface_semantically_converged"]`
- deterministic failure included `derive_code_surface_obligation_ledger_carry_converged`

The traceability check reported:

- `code_file_count: 1`
- `test_file_count: 1`
- `missing_requirement_ids.total_count: 82`
- first missing IDs included `REQ-ACC-001` through `REQ-ADJ-003`
- `orphan_code_files: ["build_tenants/scala_spark/app-core/src/main/scala/cdme/app_core/AppCoreModule.scala"]`

## Functional Review Criteria

1. Does the code generator know the edge obligation set it must carry?
2. Are requirement tags emitted in the same syntax consumed by `traceability_index`?
3. Does the generated test surface carry enough planned/realized test traceability for downstream test edges?
4. Does proof cover the imported data_mapper requirement volume rather than a tiny synthetic set only?

## Closure Note

Closed by constructor-generated requirement traceability in `build_tenants/python/code/odd_sdlc/constructor.py`.

The planned Scala/Spark tree now emits:

- `// Implements: REQ...` tags in generated main source
- `// Validates: REQ...` tags in generated test source
- `implementedRequirements: List[String]`
- `validatedRequirements: List[String]`

Proof surfaces:

- source regression `test_b059_planned_scala_tree_carries_requirement_traceability`
- targeted source proof covering B-055/B-056/B-058/B-059/B-060: `7 passed, 112 deselected`
- installed data_mapper proof: generated `AppCoreModule.scala`, `AppCoreModuleSpec.scala`, and `AppCoreGeneratedTraceSpec.scala` carry the imported requirement set
- final B-057 reset gaps: `gap_count: 0`, no `derive_code_surface` traceability blocker
