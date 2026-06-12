---
id: T-199
title: Prove data-mapper code-depth from prior graph state
type: chore
ticket_category: ordinary
status: completed
proof_status: live_passed
goal: isolate the data_mapper code-build depth mechanism by resuming from a substantive prior data_mapper graph state instead of replaying the full upstream lane
build_tenant: typescript
owner: odd_sdlc
change_intent: >-
  Add a guarded live proof lane that takes a prior data_mapper archive with
  admitted upstream design, events, ledgers, and target assets, copies it into a
  new sandbox, reinstalls the current odd_sdlc/ABG package, prunes only the
  code-generation product outputs, and starts ABG directly at the lite component
  code surface. The proof must fail if the seed archive does not carry
  substantive upstream state.
change_class: realization_refactor
re_entry_point: tests_proof
priority: medium
triaged_at: 2026-06-11
created_at: 2026-06-11
updated_at: 2026-06-12
completed_at: 2026-06-12
governance_scope: STDO Method
source_documents:
  - .ai-workspace/tickets/completed/T-198-prove-data-mapper-breadth-live-after-t197-boundary-cleanup.md
  - .ai-workspace/tickets/completed/T-197-reconcile-product-boundary-and-remove-authority-leakage.md
  - build_tenants/typescript/test_env/live/DATA_MAPPER_LIVE_RUNBOOK.md
  - specification/PRODUCT.md
  - specification/requirements/16-edge-gain-closure-contract.md
affected_boundary:
  - build_tenants/typescript/test_env/live/
  - build_tenants/typescript/test_env/tests/
  - build_tenants/typescript/package.json
target_truth: >-
  The code-depth proof lane is not a synthetic one-hop fixture. It is a
  code-generation re-entry over a copied data_mapper archive whose prior
  events, runtime ledgers, design-depth register, handoff assets, and
  materialization authority are present before the direct code-generation
  start.
superseded_truth: >-
  The only way to prove code-depth behavior on data_mapper is to rerun the full
  upstream graph from a fresh template, or to cite an old code-generation
  archive without forcing a fresh current-code code-generation run.
closure_law: >-
  This ticket closes when the guarded live runner can start from a substantive
  prior data_mapper archive, prove the copied seed state before execution,
  reinstall current code, prune code-generation outputs and stale sandbox
  build/cache byproducts, produce one fresh code-generation operator run, admit
  the current whole-file JSON component-depth carrier, and record any
  review-grade residual as product pressure rather than proof-harness failure.
evaluation_criteria:
  - live runner defaults to a known substantive data_mapper archive
  - runner fails before execution if prior events, ledgers, handoffs, or design-depth registers are missing
  - runner starts ABG directly at derive_lite_component_code_surface
  - runner records a fresh code-generation operator run rather than replaying the old one
  - runner asserts current whole-file JSON component-depth prompt/admission behavior
  - runner does not count copied build caches or stale target directories as evidence
  - runner records blocked review-grade residuals separately from depth-admission proof
non_closure_conditions:
  - seed archive validation is only workspace file presence
  - runner uses a fresh fixture template instead of copied prior graph state
  - runner runs the full upstream graph by default
  - old code-generation closure is accepted without a new operator run
  - component-depth proof accepts the fenced legacy carrier prompt
proof_surface:
  - build_tenants/typescript/test_env/live/run_t199_data_mapper_code_depth_resume.mjs
  - build_tenants/typescript/test_env/tests/test_t199_data_mapper_code_depth_resume.test.mjs
  - npm run test:t199
  - npm run test:t199:data-mapper-code-depth-resume-live
---

# T-199: Data Mapper Code-Depth Resume Proof

## STDO Triage

First missing layer: tests/proof.

This is a live-proof harness change. It does not change product definition,
requirements, design law, or odd_sdlc runtime semantics. The re-entry point is
the proof surface for isolating a high-cost data_mapper code-generation depth
mechanism from the already-proven upstream graph.

## Execution Notes

Default seed:

```text
build_tenants/typescript/test_env/test_runs/full_external_data_mapper_sandbox/20260610T202608490Z_pid46762
```

This is the T-198 converged data_mapper breadth archive. The literal latest
data_mapper archive may be a lawful `gap_stop`; that can be supplied by
environment override only if its copied workspace still passes the substantive
seed gate.

The lane must copy the seed workspace and run current code in the copy. Do not
mutate the seed archive in place.

Cleanup rule:

- keep the substantive prior graph inputs: event ledger, runtime ledgers,
  handoffs, design-depth register, materialization authority, and prior edge
  records needed to authorize the code-generation re-entry
- remove copied build byproducts and tool caches such as `target`, `.bloop`,
  `.metals`, `.scala-build`, `sbt-boot`, `sbt-global`, `ivy2`, `coursier`, and
  `scalac-classes`
- force Scala/SBT/Coursier cache roots into the live archive, not host-level
  user directories
- stop measuring at the first fresh code-generation edge result; do not treat a
  same-edge retry loop as part of this isolation proof

Observed cleanup evidence:

- archive:
  `build_tenants/typescript/test_env/test_runs/t199_data_mapper_code_depth_resume_live/20260611T184452501Z_pid63069`
- fresh operator run:
  `.ai-workspace/runtime/odd_sdlc/operator-runs/20260611T184456771Z_pid63255`
- outcome: fresh code-generation ran from the copied prior graph and produced
  all declared product targets for the fresh invocation, including the
  `cdme-compiler` Scala files, broad module source directories, `build.sbt`,
  `project/build.properties`, and
  `build_tenants/scala_spark/design/component_code_surface.md`
- terminal reason:
  `harness_stopped_after_first_fresh_codegen_result`
- command binding:
  `abg_cli_direct_code_depth_start_until_first_fresh_codegen_result`
- review-grade result: `blocked`, 160 obligations reviewed, 109 blocked
- residual class: generated compiler tranche is substantive, but broad tenant
  modules (`cdme-accounting`, `cdme-adjoint`, `cdme-assurance`, `cdme-engine`,
  `cdme-executor`, `cdme-fidelity`) and bootstrap lineage traces remain
  product-pressure for a downstream/same-edge tranche

The live runner now treats ABG `--until first_traversal` as insufficient by
itself for this proof, because prior attempts showed the runtime may still
schedule a same-edge retry after a blocked review-grade result. The T-199
harness therefore stops archive-scoped ABG processes as soon as the first fresh
codegen run has produced `handoff_manifest.json`, `worker_result_report.json`,
and `review_grade_edge_fulfillment_assessment.json`. That stop boundary is the
measured proof surface; same-edge retry behavior remains outside this ticket.

The run also forces SBT/Ivy/Coursier cache roots under the copied workspace at
`.ai-workspace/runtime/odd_sdlc/tool-cache` so Codex worker sandbox writes stay
inside the admitted live archive instead of failing on host-level cache paths.
