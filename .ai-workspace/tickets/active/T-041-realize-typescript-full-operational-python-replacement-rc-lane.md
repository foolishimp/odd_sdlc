---
id: T-041
title: Close TypeScript bounded RC on successful data_mapper build
type: feature
ticket_category: build_wave_followup
status: active
goal: typescript-bounded-data-mapper-build-rc
change_intent: Close the current odd_sdlc.TS bounded RC claim by proving a successful live data_mapper build through the installed TypeScript operator path, while preserving wider historical Python-comparison work as deferred scope.
change_class: product_reprice
re_entry_point: product_definition
affected_boundary: TypeScript CLI/install adapter, installed workspace normalization, live Claude F_P data_mapper build traversal, active total transition function, release-cut packaging, run archive comparison
priority: medium
triaged_at: 2026-04-26
created_at: 2026-04-26
updated_at: 2026-04-30T09:00:00Z
dependencies:
  - T-087 completed
  - T-088 completed
  - T-089 completed
  - T-086 completed
  - T-038 completed
  - T-053 completed
  - T-054 completed
  - T-055 completed
  - T-056 completed
  - T-057 completed
  - T-058 completed
  - T-059 completed
  - T-060 completed
  - T-066 completed
  - T-069 completed
  - T-075 consolidated
  - T-076 completed
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: T-038 RC qualification report bounded the TypeScript release claim; operator decision now sets T-041 closure on a successful live data_mapper build through the production TypeScript operator path.
active_design_refs:
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TENANT_DERIVATION.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_DETERMINISTIC_TRAVERSAL_STATE_MACHINE.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_LIVE_FP_DATA_MAPPER_QUALIFICATION.md
target_truth: odd_sdlc.TS can close the current bounded RC claim when the installed TypeScript operator path successfully builds the independent data_mapper workload through a real live worker lane, preserves ABG-owned traversal/runtime truth, and writes a governed postmortem archive over the production path.
superseded_truth: current bounded RC closure requires full Python operational replacement parity or historical multi-edge comparator equivalence.
closure_law: this ticket closes when TypeScript proves the bounded RC claim through installed-workspace mutation, public CLI/operator execution, live data_mapper build evidence on the production path, release-cut packaging evidence, and truthful postmortem/archive evidence showing the build succeeded without bypassing ABG or relying on premature closure.
evaluation_criteria:
  - CLI command grammar exposes the shared install/start/gaps/release operator surface without bypassing graph-function and ABG authority
  - install and normalize prepare an imported target workspace while preserving project-owned authority, substrate-owned surfaces, and installer-owned domain surfaces
  - live data_mapper build traversal uses an external live worker on the production installed-operator path and records the postmortem archive
  - release-cut packaging and binary binding are produced by declared TypeScript surfaces rather than inferred from local dev commands
  - the successful data_mapper build materializes the expected tenant-root product files and required build/test evidence for the traversed workload
  - the run remains truthful about open gaps, retries, and blocking reasons and does not collapse build success into unsupported historical parity claims
proof_surface:
  - TypeScript CLI/install design
  - installed-workspace sandbox archive
  - live data_mapper build run archive
  - release-cut artifact evidence
  - bounded RC postmortem
non_closure_conditions:
  - live F_P behavior is claimed without live worker evidence
  - workspace mutation happens outside an adapter that preserves ODD authority boundaries
  - CLI commands decide internal traversal outside ABG
  - release evidence is inferred from semantic tests alone
  - a sandbox-only or harness-only pass is substituted for the production installed-operator path
  - bounded RC closure is confused with full historical Python replacement or multi-edge parity
---

## STDO Reading

T-038 proves a bounded TypeScript package RC. This ticket now carries the
current bounded closure bar for the live data_mapper build workload.

It must not translate Python file boundaries directly. It must extract the
Python-observed behavior into graph-function programs, typed carriers, ABG
runtime truth, public adapters, and qualification archives.

## Triage Note

This ticket is closable in the bounded TypeScript RC pass once the live
data_mapper build succeeds through the production installed-operator path.

The wider historical Python-replacement and multi-edge comparator claim is
deferred to `backlog/T-103-evaluate-historical-data-mapper-depth-and-python-parity.md`.

## 2026-04-28 Dependency Closeout

Closed prerequisites:

- `T-066` downstream product materialization and evaluator closure
- `T-086` typed blocking-reason carriers
- `T-087` project induction as `Fg_conform_project`
- `T-088` cumulative traversal intent package
- `T-089` traversal pressure enforcement on every prompt-bearing edge

Current verified TypeScript semantic state:

- `npm run lint:semantic` passed
- `npm run test:semantic` passed, 124 tests
- `npm run test:sandbox` passed, 6 tests
- `ODD_SDLC_TS_LIVE_FP=1 npm run test:live` passed, 1 test,
  361.673s

Remaining T-041 work is the bounded live data_mapper build proof: live external
F_P data_mapper evidence has been refreshed at
`build_tenants/typescript/test_env/test_runs/t053_live_data_mapper/20260428T042026358Z_pid46962`.
The remaining work is a successful production-path build run plus current
release-cut evidence. It is intentionally not closed by semantic, sandbox, or
non-production live-dispatch proof alone.

T-089 corrected the immediate T-087/T-088 pressure-loss defect by forcing
non-empty target/evaluator/requirement/prior-gap obligation pressure on prompt
edges and by rejecting missing or unassessed worker obligation reports. The
invalid `T-090` draft was rejected: `test35` is historical evidence and a
comparator, not an authority surface to alter, and no design ticket may reopen
closed-edge semantics without first repricing product/requirement authority.

The current tenant has a bounded public CLI adapter from T-058 and
side-effecting install/normalize plus release-cut package evidence from T-059.
T-053 closed the first live external `F_P` data_mapper qualification lane.
These proofs are preconditions to the current bounded close. T-060 remains
useful comparison evidence, but it is no longer the closure gate for T-041.

Operator clarification:

- install means npm package plus scripts, not a direct copy of Python install
  mechanics
- `start` and `gaps` should come from ABG/public graph-function authority where
  available, with SDLC-owned bootstrap instructions or `/cmds` for Claude and
  Codex rather than a rival traversal engine
- `data_mapper` is the decisive independent real-world qualification workload;
  it is not part of `odd_sdlc` product scope
- the sandbox framework should converge on the common ABG sandbox framework
  rather than an odd_sdlc-only duplicate harness

The ticket is active as the RC envelope. While it remains open, the bounded RC
qualification must continue to state that TypeScript does not replace Python
operationally.

## Decomposition

The TypeScript live-test build-out is split into and completed by:

- `completed/T-053-build-typescript-live-fp-data-mapper-qualification-lane.md`

T-053 owns the concrete `test:live` lane, external `F_P` worker dispatch,
ABG-installed workspace setup, data_mapper qualification scenario binding, and
live archive proof. T-041 remains the bounded RC envelope covering CLI
replacement, install/normalize behavior, release-cut packaging, and the
production-path data_mapper build proof.

The operational blocker map is split into:

- `T-054-publish-python-to-typescript-operational-rc-blocker-map.md`

T-054 owns the single control surface that classifies Python-to-TypeScript
operational gaps, maps each blocker to a ticket, and distinguishes bounded
package RC from any future wider historical-parity claim.

Control surface:

- `build_tenants/typescript/qualification/ODD_SDLC_TYPESCRIPT_PYTHON_PARITY_RC_BLOCKER_MAP.md`

The reusable graph-function library implementation is split into:

- `T-055-realize-typescript-reusable-single-typed-traversal-library-slice.md`
- `T-056-realize-typescript-ingress-project-library-slice.md`

These tickets prevent bounded RC from hardening around product-local
leaf functions and TypeScript helper loops instead of reusable GTL/ABG program
truth.

The bounded TypeScript public CLI adapter is split into and completed by:

- `completed/T-058-realize-typescript-public-cli-adapter-over-graph-query-start-surfaces.md`

T-058 proves command grammar over the current graph/query/start surfaces. It
does not close install/normalize mutation, release-cut packaging, or Python
comparison.

The TypeScript install/normalize and release-cut adapter is split into and
completed by:

- `completed/T-059-realize-typescript-install-normalize-and-release-cut-adapters.md`

T-059 proves package-backed install, ABG runtime population, installed command
execution, normalization/bootstrap surfaces, and release-cut package/binary
evidence. It does not close Python archive comparison or final full
historical parity.

The TypeScript/Python archive comparison is split into and completed by:

- `completed/T-060-publish-typescript-live-vs-python-archive-comparison-postmortem.md`

T-060 proves the comparison surface exists. It does not itself prove
multi-edge `data_mapper` qualification equivalence. The remaining T-041
decision is no longer whether that depth is required for bounded closure. That
depth is deferred to `T-103`.

The historical data_mapper qualification comparator is consolidated into this RC envelope from:

- `completed/T-075-publish-data-mapper-recursive-realization-success-comparator.md`

That comparator is the final RC decision projection over admitted truth, not a
separate active design ticket.

## Current Closure State

Closed preconditions:

- public CLI adapter: T-058
- ABG-populated installed sandbox: T-052
- live external `F_P` data_mapper qualification single-edge run: T-053
- install/normalize and release-cut package evidence: T-059
- TypeScript/Python archive comparison: T-060

Remaining bounded-RC question:

- Does the production installed-operator path complete a successful live
  data_mapper build with truthful archive evidence and no premature closure?

The operator decision on the closure bar is now made. When that build succeeds,
T-041 may close. Historical Python parity and multi-edge depth remain deferred
scope, not current closure gates.

## Test64 RC Closure Assessment - 2026-05-01

Fresh successor lane:

`/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test64.TS.cl`

Outcome:

- the installed TypeScript operator path reached `derive_code_surface`;
- the terminal archive was
  `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test64.TS.cl/.ai-workspace/runtime/odd_sdlc/operator-runs/20260501T083037157Z_pid63915`;
- postflight blocked with typed `silent_worker_inactivity`;
- the final gap dossier has `retryEligible: false` and
  `nextLawfulActions: ["triage_gap"]`.

This is not RC closure evidence. The lane did not complete code
materialization, build execution, test execution, release qualification, or a
successful data_mapper build through the production installed-operator path.

T-041 remains active. The current lawful interpretation is a real live-lane
blocker, not a bounded RC pass.

## 2026-04-28 Test52 Bootstrap Closure Bug

Fresh installed workspace:

- `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test52.ts`

Observed sequence:

- install topology passed with `.abiogenesis/odd_sdlc/typescript/`,
  `.abiogenesis/typescript-installer-manifest.json`, `AGENTS.md`,
  `CLAUDE.md`, and installed command shims
- `gaps` selected `Fg_conform_project`
- `Fg_conform_project` closed with event sequence
  `graph_call_opened -> frame_opened -> vector_traversal_planned -> vector_evaluated -> vector_closed`
- first live F_P edge `derive_intent_surface` closed after escalation allowed
  the installed worker to access Codex session files

RC blocker:

- induction created `specification/requirements/00-imported-sources.md`, but
  not separate requirement-family files
- `conform_project_report.json` reported `status: passed` while listing only
  four source refs, even though the imported ledger listed eleven admitted
  source documents
- downstream `traversal_intent_package.json` carried 97 obligations, including
  90 requirement IDs, but the summaries were generic ID stubs and evidence
  pointed back to the single imported ledger

This is not a code-generation failure. It is a bootstrap pressure-loss defect:
the system can now create the required folder topology, but it can still close
project induction before imported requirement authority is structured enough
to drive downstream graph computation.

Tracked by:

- `active/T-091-harden-typescript-traversal-closure-against-lossy-obligation-carriers.md`

## 2026-04-28 Project Induction Blocker

Fresh `data_mapper.test51.ts` evidence invalidated the earlier wider RC path
before downstream code quality can be evaluated. TypeScript install/start
allowed downstream traversal while the imported workspace lacked the required
spec_method induction topology, including `specification/requirements/`.

`T-087` became a critical blocker for this RC envelope. Bounded RC requires
TypeScript to prove project induction as graph-function-owned `F_D`
truth before any downstream SDLC graph-program edge opens.

## 2026-04-27 Installed Data Mapper Test46 Evidence

Workspace:

- `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test46.ts`

Installed command:

- `node_modules/.bin/odd-sdlc-ts start --workspace . --target next --until blocked --worker process://codex`

Result:

- `bootstrap_release_self_test` traversed all 18 vectors and `gaps` reports
  `status: converged`.
- Final archive:
  `.ai-workspace/runtime/odd_sdlc/operator-runs/20260427T103548128Z_pid44432`
- Final edge: `prepare_release_surface`
- Final next action: `close_or_reprice`
- Event log length after convergence: 90 events.

Observed live defects:

1. `project_constraints.yml` was not instantiated by the installer/setup with
   `project.name`, `test_runner`, and `active_tenant`. The graph lawfully
   blocked on `select_implementation_stack_profile` until the independent
   test workspace was repaired to `active_tenant: "scala_spark"`.
2. `derive_code_surface` produced only
   `.ai-workspace/runtime/odd_sdlc/assets/20260427T095902442Z_pid38741/code_surface.md`.
   `find build_tenants -maxdepth 5 -type f` failed because `build_tenants/`
   did not exist. This was the critical bounded-RC blocker tracked by
   `active/T-066-realize-typescript-downstream-product-code-materialization-over-odd-graph-functions.md`.
3. `derive_test_run_archive_surface` initially failed hook postflight because
   the installed operator hardcoded constructor `operationType: "generate"`
   while hook policy requested `qualify`. This was fixed and closed under
   `completed/T-067-repair-typescript-installed-operator-operation-type-propagation-for-qualification-edges.md`.
4. Refreshing the installed package initially reset
   `.ai-workspace/events/events.jsonl`, forcing graph replay back to vector 0.
   This was fixed and closed in abiogenesis under
   `completed/T-083-preserve-runtime-event-log-on-typescript-installer-refresh.md`.

Current verdict:

- The TypeScript tenant proves installed graph traversal through a full
  18-vector data_mapper surface graph.
- The TypeScript tenant did not yet prove successful bounded data_mapper build.
  It could converge the graph without materializing downstream
  product source or tests. T-066 is therefore the governing RC blocker.

## 2026-04-28 Test55 Managed Traversal Update

Fresh installed workspace:

- `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test55.ts`

First one-shot installed command:

- `ODD_SDLC_TS_OUTPUT=json node_modules/.bin/odd-sdlc-ts start --workspace . --target next --until blocked --worker process://codex`

Proven improvements:

- `T-091` lossy obligation pressure is closed: project induction materialized
  family requirements under `specification/requirements/`, the conformance
  report preserved 29 source refs, and downstream handoff manifests carried
  concrete requirement payloads and source snippets.
- `T-092` autonomous installed loop is closed: one command advanced through
  the graph from project conformance to the test archive edge without manual
  `gaps -> start` between successful vectors.
- `T-093` schedule surfaces are closed: realization and test schedule edges
  are published and consumed before code and test archive edges.
- `T-094` execution-evidence vocabulary is closed: retry no longer failed on
  the worker's execution-evidence schema.
- `T-095` live-test archive closure is hardened: zero observed tests no longer
  close the archive edge.
- `T-099` indexed/tranched pressure is closed: retry prompt pressure reduced
  from 354222 bytes to 56645 bytes while retaining full manifest and traversal
  intent package references.

Final retry loop evidence:

- archive:
  `.ai-workspace/runtime/odd_sdlc/operator-runs/20260428T151211468Z_pid89422`
- loop steps: 3 same-edge attempts at `derive_test_run_archive_surface`
- final event sequence:
  `graph_call_opened -> frame_opened -> vector_traversal_planned -> vector_evaluated -> retry_attempt_stopped`
- final next lawful action: `triage_gap`
- final blockers:
  - `worker_report_unresolved_reasons_present`
  - `test_execution_zero_tests_observed`

New residual closed locally by `T-100`:

- live worker generated seven Scala test source files, but as standalone
  `object/main` programs
- root `build.sbt` had no test framework binding
- `sbt test` exited 0 while `show Test / definedTests` returned `Vector()`

`T-100` now requires `derive_test_module_surface` to produce tests discoverable
by the declared test execution contract and blocks non-discoverable SBT tests
before the later test archive edge.

Verification after T-100:

- `npm run test:t100`: passed, 10 tests
- `npm run test:semantic`: passed, 139 tests
- `npm run lint:semantic`: passed

Current verdict:

- The loop, pressure, schedule, retry, and archive evidence laws are materially
  stronger and green.
- Bounded RC is still not claimed until a fresh successor live run proves the
  worker now materializes SBT-discoverable tests and observes passing build/test
  evidence under the real `data_mapper` workload.

## 2026-04-28 Test56 Retry-Eligible Report Rejection Bug

Fresh installed workspace:

- `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test56.ts`

Observed progress:

- the live lane advanced through project conformance, product, goals,
  requirements, feature decomposition, UAT testcases, design, scenarios,
  implementation design, stack profile, module surface, realization schedule,
  and code
- `derive_realization_schedule_surface` produced the required module
  dependency graph, realization tranches, obligation ledger, gap ledger, and
  next tranche selector
- `derive_code_surface` materialized non-trivial Scala product files before
  the worker timed out, including compiler model, topology compiler,
  execution planner, module sources, and SBT build files

Observed defect:

- final code archive:
  `.ai-workspace/runtime/odd_sdlc/operator-runs/20260428T165931233Z_pid51489`
- worker elapsed `600011.3158749994ms`
- worker error `spawnSync codex ETIMEDOUT`
- missing carrier `worker_result_report.json`
- operator emitted retry/continuation runtime truth and
  `nextLawfulAction: retry_same_edge_with_gap_dossier`
- autonomous loop still stopped at `worker_report_rejected`

Closed correction:

- `completed/T-101-honor-retry-eligible-worker-report-rejection-in-autonomous-start-loop.md`

Verification after T-101:

- `npm run test:t101`: passed, 1 test
- `npm run test:semantic`: passed, 140 tests
- `npm run lint:semantic`: passed

Current verdict:

- retry-eligible report rejection now remains inside the autonomous loop and
  re-enters the same edge with prior-gap pressure
- bounded RC remains open until a fresh successor live run proves the corrected
  loop against `data_mapper`

## 2026-04-27 T-066 First Guard Update

`T-066` now blocks the specific markdown-only false positive for
`code_surface` and `test_module_surface`.

Verification:

- `npm run test:semantic`: 77 tests passed
- `npm run lint:semantic`: passed
- `npm run test:sandbox`: 6 tests passed

Installed smoke workspace:

- `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test48.ts`
- result: converged through vectors `0..17` using a manifest-driven local worker
- source materialized:
  `build_tenants/scala_spark/src/main/scala/generated/DataMapper.scala`
- test materialized:
  `build_tenants/scala_spark/src/test/scala/generated/DataMapperSpec.scala`

This is still not bounded RC closure. It proves the carrier, tenant-root law,
and postflight rejection rule. It does not yet prove the live production-path
`data_mapper` build through the installed operator.
