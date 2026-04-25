---
id: B-061
title: Preserve data_mapper module topology and materialize governed tests
type: bug
ticket_category: ordinary
status: completed
goal: data-mapper-template-clean-run-preserves-cdme-modules-and-executable-test-source
change_intent: The test38/test39 review showed that the v3.2 odd_sdlc path could converge from the data_mapper template while collapsing the intended CDME module topology into `app-core` and treating test-module surfaces as markdown-only evidence. A clean RC proof needs the imported module structure carried into the generated Scala tree and non-zero governed `.scala` tests materialized before the archive edge.
change_class: design_reframe
re_entry_point: design
affected_boundary: project-profile normalization, constructor-generated Scala/Spark tree, test-module surface, test-run archive evidence, data_mapper clean install proof
priority: critical
triaged_at: 2026-04-25
created_at: 2026-04-25
updated_at: 2026-04-25
dependencies:
  - B-059 completed
  - B-060 completed
intake_source: `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/CODE_QUALITY_AND_TRAVERSAL_11_28_31_32_33_34_35_38.md`
target_truth: a clean install from `data_mapper.template` preserves the declared CDME modules, emits executable ScalaTest source under the governed code root, carries requirement traceability into main and test sources, and converges without manual generated-file edits.
superseded_truth: the workspace can converge with a single `app-core` scaffold and markdown-only test evidence, leaving the generated output far below the prior data_mapper quality bar and unable to run `sbt test` as evidence.
closure_law: this ticket closes when source tests and a clean template sandbox prove seven CDME modules, non-zero governed `.scala` tests, valid sbt syntax, and successful `sbt test`.
evaluation_criteria:
  - imported `module_structure` is read from the v3.2 nested design-tenant constraint shape
  - generated Scala/Spark `build.sbt` uses valid sbt string literals and module-scoped ScalaTest dependency settings
  - `derive_test_module_surface` materializes generated test source under the governed code root
  - test source carries `// Validates: REQ...` tags consumed by traceability checks
  - clean data_mapper sandbox converges and `sbt test` passes
proof_surface:
  - source regression `test_b059_planned_scala_tree_carries_requirement_traceability`
  - source regression `test_b060_normalize_data_mapper_template_maps_stale_execution_cues`
  - source regression over B-046/B-047/B-059/B-060: `4 passed`
  - clean sandbox `/tmp/data_mapper_quality_20260425T081630Z`
  - final gap dossier in that sandbox: `gap_count: 0`
  - generated tree: 7 main Scala files and 14 test Scala files
  - generated tenant proof: `sbt test` succeeded across seven subprojects
non_closure_conditions:
  - closure is claimed by manually editing generated Scala files in the sandbox
  - module topology collapses to `app-core`
  - test-module convergence is markdown-only with no governed `.scala` test files
  - generated sbt syntax is not executable
---

## Closure Note

Closed by:

- preserving nested v3.2 `module_structure` in `project_profile.py`
- generating ScalaTest-backed module tests and trace tests in `constructor.py`
- materializing planned generated test source at `derive_test_module_surface`
- documenting the revised test-lane boundary in `REALIZED_TEST_SOURCE_OBLIGATION.md`

The proof sandbox `/tmp/data_mapper_quality_20260425T081630Z` was created from the clean data_mapper template, installed with the current odd_sdlc source, advanced with `start --until converged`, and then executed with `sbt test`.

Observed result:

- `start`: `status: converged`, `stop_predicate: no_open_gap`
- final dossier: `gap_count: 0`
- main Scala files: `7`
- test Scala files: `14`
- `sbt test`: success

This closes the test38/test39 topology and governed-test-source defect. It does not claim parity with test35's 103-main-file A/B implementation depth.
