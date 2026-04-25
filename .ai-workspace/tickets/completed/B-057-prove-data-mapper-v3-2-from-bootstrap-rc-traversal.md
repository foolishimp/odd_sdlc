---
id: B-057
title: Prove data_mapper v3.2 from-bootstrap RC traversal
type: chore
ticket_category: ordinary
status: completed
goal: release-candidate-proof-from-fresh-imported-data-mapper-workspace
change_intent: After B-051 and B-052, the focused product bugs from `data_mapper.test39` are covered, but RC readiness still lacks a fresh v3.2.0 from-bootstrap proof. This ticket is the release-candidate gate: install odd_sdlc into a fresh `data_mapper` imported workspace, run the current operator path with the worker attachment and canonical constraints in place, and prove traversal reaches the release/test-archive boundary without hidden manual repair.
change_class: realization_refactor
re_entry_point: realization
affected_boundary: RC proof harness, installed `data_mapper` workspace, public `gaps`/`start` operator flow, F_P worker attachment, project-profile canonicalization, runtime events, generated artifacts, release notes
priority: critical
triaged_at: 2026-04-25
created_at: 2026-04-25
updated_at: 2026-04-25
dependencies:
  - B-051 completed
  - B-052 completed
  - B-053 active; explicitly deferred from RC traversal as operator UX/product reprice
  - B-054 completed
  - B-055 completed
  - B-056 completed
  - B-058 completed
  - B-059 completed
  - B-060 completed
intake_source: RC readiness review after `data_mapper.test39`; B-051/B-052 are green on focused proof, but no fresh v3.2.0 from-bootstrap end-to-end proof exists
target_truth: the RC candidate is backed by a fresh imported `data_mapper` workspace that starts from installer/normalization output, uses the current operator `gaps`/`start` guidance, has admitted worker attachment truth, consumes canonical project constraints, and reaches at least the release/test-run-archive proof boundary with F_P results consumed and lawful F_H gates either carried forward or human-proxy admitted.
superseded_truth: RC confidence is inferred from source-level proofs, completed tickets, stale `test35` success, or a partially progressed/primed workspace, while the fresh v3.2.0 from-bootstrap path remains unproved.
closure_law: this ticket closes only when a fresh `data_mapper` imported workspace proves the v3.2.0 from-bootstrap path under the current source line. Closure requires archived commands, events, gap projections, generated artifacts, and a written RC verdict. If the run fails, this ticket remains active and the failure must be triaged into linked successor tickets rather than marked as a known limitation without explicit approval.
evaluation_criteria:
  - workspace is fresh from imported `data_mapper` source, not copied from a progressed prior run
  - B-055 worker attachment/readiness truth is present before F_P dispatch progress is claimed
  - B-056 canonical project-profile truth is present before evaluator/route claims are accepted
  - public `gaps` and `start` operator surfaces match B-053/B-054 guidance
  - runtime events show F_P dispatches consumed by worker results, not just manifests written
  - final artifacts include release/test-run-archive boundary evidence or a specifically admitted equivalent RC boundary
proof_surface:
  - archived install/normalize/gaps/start commands and outputs
  - `.ai-workspace/events/events.jsonl` showing consumed F_P work and lawful F_H handling
  - generated `build_tenants/` and `specification/` artifacts proving traversal beyond initial authority edges
  - final gap dossier and requirement closure/readiness projection
  - RC verdict post in `.ai-workspace/comments/`
non_closure_conditions:
  - proof uses `data_mapper.test35`, `data_mapper.test39`, or any already-progressed workspace as the primary run
  - proof requires undocumented manual edits to `project_constraints.yml`
  - proof depends on a worker loop that is not admitted by B-055
  - proof accepts unconsumed F_P manifests as progress
  - proof stops at first dispatch/yield and calls the candidate RC-ready anyway
  - active B-053 or B-054 closure claims remain unresolved
---

## Why This Ticket Exists

Focused regression proof is not the same as RC readiness.

B-051 and B-052 repaired the concrete odd_sdlc product bugs observed in
`data_mapper.test39`. The remaining RC question is whether the current source
line can operate a fresh imported workspace under the new carrier topology.

This ticket makes that question durable and blocks RC closure on a real
from-bootstrap run rather than comment-layer optimism.

## Trace Boundary

This ticket reads current repo-law truth from:

- `specification/GOALS.md`
- `specification/INTENT.md`
- `specification/PRODUCT.md`
- `specification/requirements/03-runtime-governance.md`
- `specification/requirements/10-odd-sdlc-software-domain-buildout.md`
- `specification/requirements/12-declarative-operational-state-transitions.md`

This ticket reads current design truth from:

- `build_tenants/python/design/README.md`
- `build_tenants/python/design/EXECUTION_CONTRACT_SOURCE_CARRIER.md`
- `build_tenants/python/design/GAP_ANALYSIS_DOSSIER.md`
- `build_tenants/python/design/FP_WORKER_ATTACHMENT_CONTRACT.md`
- `build_tenants/python/design/PROJECT_PROFILE_CONSTRAINTS_CANONICALIZATION.md`
- `build_tenants/python/design/adrs/ADR-002-abg-continuation-authority-and-cooperative-operational-dispatch.md`

This ticket reads current forensic truth from:

- `.ai-workspace/comments/claude/20260424T090000Z_MATRIX_test39-regression-vs-test35.md`
- `.ai-workspace/comments/claude/20260424T100000Z_REVIEW_b051-b052-test39-remediation-coverage.md`
- `.ai-workspace/comments/codex/20260424T101838Z_FORENSIC_test39_failure_ledger.md`

This ticket reads current method-law truth from:

- `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/RELEASE_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md`

## RC Gate Inventory

- B-051: imported intent carry-forward authority is closed
- B-052: policy bundle ingress/human-proxy crash is closed
- B-053: operator `gaps` surface is explicitly deferred from this RC traversal gate as an operator UX/product reprice
- B-054: operator `start` bootstrap guidance is closed
- B-055: worker attachment/readiness is closed and must be exercised in this proof
- B-056: project constraints canonicalization is closed and must be exercised in this proof
- B-058: execution-layer public-start routing is closed
- B-059: generated code traceability is closed
- B-060: stale execution cue canonicalization is closed

## Proof Run Requirements

- start from a clean imported `data_mapper` template or source
- install current odd_sdlc into the workspace
- run normalization/bootstrap without manual shape edits
- inspect `gaps` through the current public operator surface
- run `start` through the current maximum-autonomy operator guidance
- attach worker truth only through the B-055 admitted surface
- preserve the full run archive, events, manifests, results, and final projections

## Functional Review Criteria

1. Does the proof begin from a clean imported workspace?
2. Are B-055 and B-056 exercised in the live run rather than assumed from source tests?
3. Are all F_P dispatches either consumed or lawfully blocked with classified truth?
4. Are all F_H gates either carried forward, human-proxy-admitted, or lawfully blocked?
5. Does the final state demonstrate release/test-run-archive readiness at the declared RC boundary?
6. Is the RC verdict grounded in artifacts and events rather than comments or stale successful workspaces?

## Required Execution Order

1. Close or explicitly reprice B-053 and B-054 operator-surface tickets.
2. Close B-055 worker attachment/readiness.
3. Close B-056 project constraints canonicalization.
4. Create a fresh `data_mapper` workspace from imported source.
5. Install current odd_sdlc and record the exact source revision.
6. Run `gaps` and `start` through the current operator contract.
7. Archive all events, manifests, results, projections, generated artifacts, and logs.
8. Publish an RC verdict post with pass/fail and any successor tickets.

## Closure Note Template

When closing this ticket, include:

- source revision
- installed workflow version
- workspace path
- command transcript summary
- final edge/release state
- counts for `fp_dispatched`, worker results, `worker_turn_started`, `run_completed`, and `edge_converged`
- final gap summary
- explicit RC verdict

## 2026-04-25 Sandbox Run Note

Workspace: `/tmp/odd_sdlc_b057_data_mapper_20260425T022937Z`

Source revision: `015120e` with dirty local worktree carrying the current B-055/B-056 line.

Installed workflow: `abiogenesis.standard@3.2.0`

Result: not RC-ready. The sandbox installed and admitted worker attachment, then `start --scope workspace --target next --until converged --fh-mode human-proxy --root-mode supervised` advanced through the early authority/design edges and generated a Scala/Spark code surface. It yielded at `derive_code_surface` with deterministic findings:

- `code_traceability_present`
- `derive_code_surface_obligation_ledger_carry_converged`
- `code_surface_semantically_converged`

Post-refresh final gap summary:

- `gap_count`: 11
- `declared_obligation_gap_count`: 6
- `graph_edge_gap_count`: 5
- `total_delta`: 15.083333333333334
- first edge: `derive_code_surface`

Successor blockers:

- B-058: public start resume treats an already yielded worker result as an in-flight dispatch
- B-059: generated code surface does not carry requirement traceability/obligation refs
- B-060: stale imported build/test execution cues remain undeclared after normalization

This run kept B-057 active until successor tickets landed.

## 2026-04-25 Reset Sandbox RC Proof

Workspace: `/tmp/odd_sdlc_rc_data_mapper_20260425T041353Z`

Source revision: `015120e` with dirty local worktree carrying the current RC fix line.

Installed workflow: `abiogenesis.standard@3.2.0`

Freshness: copied from `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.template`, then installed current odd_sdlc with `--project-slug data_mapper --platform spark_scala`.

Worker attachment: admitted through `.genesis/odd_sdlc/release/test_transport_contract.json` referenced by `.genesis/odd_sdlc/release/genesis.yml`.

Normalized execution contracts:

- `test_runner: "sbt test"`
- `build_execution_contract: "sbt clean assembly"`
- `test_execution_contract: "sbt test"`
- `deployment_contract: "spark-submit"`
- `runtime_observation_contract: "OpenLineage"`

Command transcript summary:

- `refresh-analysis`: succeeded with analysis fingerprint `f94e51e537b9ee527333cbf9495fd5f4675f5ab44e8ed75bce7f7f93a86d83cf`
- initial `gaps --scope workspace --zoom combined --include-dependent`: `gap_count: 27`, `declared_obligation_gap_count: 12`, `graph_edge_gap_count: 15`
- `start --scope workspace --target next --until converged --fh-mode human-proxy --root-mode supervised`: `status: converged`, `blocking_reason: converged`, `stop_predicate: no_open_gap`, `stopped_by: converged`
- final `gaps --scope workspace --zoom combined --include-dependent`: `converged: true`, `gap_count: 0`, `declared_obligation_gap_count: 0`, `graph_edge_gap_count: 0`, `total_delta: 0`

Event counts:

- `run_started: 27`
- `run_completed: 27`
- `edge_converged: 27`
- `run_yielded: 0`
- `graph_call_failed: 0`

Generated RC boundary artifacts include:

- `docs/40-generated-release.md`
- `docs/45-generated-build-execution.md`
- `docs/46-generated-build-execution-result.md`
- `docs/47-generated-test-execution.md`
- `docs/48-generated-test-execution-result.md`
- `docs/50-generated-deployment.md`
- `docs/55-generated-deployment-result.md`
- `docs/56-generated-deployed-environment.md`
- `docs/60-generated-runtime-observation.md`
- `build_tenants/scala_spark/test_env/50-generated-run-archive.md`
- `build_tenants/scala_spark/design/60-generated-retrofit-plan.md`

RC verdict: pass for the data_mapper v3.2 from-bootstrap traversal gate. B-053 remains an explicitly deferred operator UX follow-up; it is not a blocker for this traversal proof.
