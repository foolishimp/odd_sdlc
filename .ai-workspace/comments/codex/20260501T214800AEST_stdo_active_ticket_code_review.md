# STDO Active-Ticket Code Review - 2026-05-01

Scope:

- `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/active`
- Current dirty worktree implementation in `build_tenants/typescript`
- Review lens: STDO method governance, ticket authority, design-method closure, and code/proof alignment

## Findings

### High - T-104/B-079 archive closure can pass without admitted execution-result truth

Files:

- `build_tenants/typescript/code/src/operator/handoff.ts:184`
- `build_tenants/typescript/code/src/operator/handoff.ts:317`
- `build_tenants/typescript/code/src/operator/handoff.ts:2393`
- `build_tenants/typescript/code/src/operator/handoff.ts:2823`
- `build_tenants/typescript/test_env/tests/test_t066_product_materialization_contract.test.mjs:822`

`test_run_archive_surface` is configured with execution shards, but it does not
admit or evaluate execution evidence. Archive postflight currently checks only
that fulfilled source-asset obligations name the source asset type in archive
content. The semantic test titled "T-104 test-run archive closure depends on
cited execution-result truth" passes with archive prose that lists
`test_execution_result_surface`; it does not prove the cited source was an
admitted execution-result surface with shard rows.

Under STDO, this leaves a bridge authority seam: archive prose can stand in for
the prior admitted execution-result truth. That conflicts with T-104's closure
law that archive closure requires prior execution-result source truth, and with
B-079's closure law that the schedule/execution/archive path cannot be satisfied
by unsharded evidence.

Required correction:

- make archive closure consume a concrete admitted execution-result carrier or
  source-asset evidence reference, not just the source asset type string;
- fail closed when the cited execution-result source cannot be resolved as
  admitted execution truth;
- add a negative test where archive prose names `test_execution_result_surface`
  but no admitted execution-result/shard truth is present.

### Medium - Active-ticket authority is mostly untracked

Files:

- `.ai-workspace/tickets/active/B-071-consume-abg-streamed-process-actor-supervision-for-live-claude-lanes.md`
- `.ai-workspace/tickets/active/B-072-admit-test-run-execution-evidence-from-transform-artifacts.md`
- `.ai-workspace/tickets/active/B-073-route-pending-test-execution-evidence-to-triage-not-retry-or-closure.md`
- `.ai-workspace/tickets/active/B-074-prevent-invalid-scala-cross-suffixed-dependency-coordinates.md`
- `.ai-workspace/tickets/active/B-075-ignore-build-tool-byproducts-during-test-module-materialization.md`
- `.ai-workspace/tickets/active/B-077-classify-contradictory-test-execution-evidence-as-triage-gap.md`
- `.ai-workspace/tickets/active/B-078-add-silent-worker-inactivity-policy-for-live-fp-processes.md`
- `.ai-workspace/tickets/active/B-079-decompose-test-execution-schedule-into-bounded-shards.md`
- `.ai-workspace/tickets/active/B-080-self-heal-silent-live-workers-through-inactivity-recovery.md`
- `.ai-workspace/tickets/active/T-102-define-typed-fp-function-stages-and-abg-owned-admission-flow.md`
- `.ai-workspace/tickets/active/T-104-split-test-execution-from-test-run-archive-surface.md`
- `.ai-workspace/tickets/active/T-105-migrate-start-until-converged-to-abg-owned-whole-graph-iteration.md`

`git status --short` shows these active ticket files as untracked. STDO treats
tickets as durable work authority. Closure review should not accept ticket
state, closure bars, or proof boundaries that exist only as untracked local
worktree files.

Required correction:

- before any ticket is moved to `completed/`, stage/commit or otherwise publish
  the active ticket authority together with the implementation/proof surface.

## Per-Ticket Verdict

- B-071: code direction accepted pending external review. The started-context
  carrier is now written on `actor_process_started`, before postflight, and
  carries manifest/prompt/report/output/process refs. No additional code finding.
- B-072: code direction accepted pending fresh live proof. Transform-artifact
  execution evidence is admitted, malformed evidence becomes a typed invalid
  blocker, and missing evidence does not masquerade as closure.
- B-073: code direction accepted pending fresh live proof. Pending execution
  evidence routes to `triage_gap` and produces non-retry gap projection.
- B-074: code direction accepted pending fresh live proof. Invalid Scala
  double-cross-suffixed coordinates fail closed through
  `invalid_dependency_coordinate`.
- B-075: code direction accepted pending external review. Test-module
  materialization ignores build-tool byproducts without admitting them as test
  products.
- B-077: code direction accepted pending fresh live proof. Contradictory
  execution evidence routes to `triage_gap`, not same-edge retry.
- B-078: code direction accepted pending external review. Silent worker
  inactivity is typed, includes process evidence refs, and missing/invalid
  process summaries fail closed.
- B-079: blocked by the archive closure finding above. Execution-result shard
  evidence enforcement is good, but archive-path closure does not yet prove the
  admitted shard truth it claims to consume.
- B-080: code direction accepted pending external review. Silent execution
  recovery carries shard identity and triage action; no additional code finding.
- T-041: not closeable. Test64 stopped before RC completion, so bounded RC
  live proof remains absent.
- T-102: not closeable. The typed F_P/admission model has strong child-ticket
  evidence, but final live lane proof remains incomplete.
- T-104: blocked by the archive closure finding above. Archive rejects fresh
  execution evidence, but the admitted-prior-truth check is too weak.
- T-105: code direction accepted pending external review. `start --until`
  delegates whole-graph iteration to ABG and Test64 proves multi-hop behavior;
  closure still waits on accepted external review/proof wording.

## Verification

- `git diff --check`: passed.
- `npm run lint:semantic`: passed.
- `npm run test:semantic`: passed, 164/164.

