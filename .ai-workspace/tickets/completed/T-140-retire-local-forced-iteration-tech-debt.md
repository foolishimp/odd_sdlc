---
id: T-140
title: Retire local forced-iteration tech debt
type: chore
ticket_category: implementation_migration
status: completed
review_status: closed_implemented
goal: typescript-rc-remove-rival-iteration-authority
build_tenant: typescript
owner: odd_sdlc
change_intent: Remove or demote accumulated local retry/repair/re-entry/loop shims after the evaluator-owned runner and T-109 closure carriers are implemented.
change_class: realization_refactor
re_entry_point: code
affected_boundary:
  - build_tenants/typescript/code/src/operator/installed_operator.ts
  - build_tenants/typescript/code/src/operator/handoff.ts
  - build_tenants/typescript/code/src/cli/main.ts
  - build_tenants/typescript/code/src/spec_method/entry.ts
  - build_tenants/typescript/code/src/projection/query_domain.ts
  - build_tenants/typescript/code/src/assurance/
  - build_tenants/typescript/test_env/tests/
priority: high
rc_blocker: true
release_blocker_reason: Old forced-iteration paths must be deleted or visibly demoted after the evaluator-owned spine lands.
migration_strategy: inside_out_hard_break
library_usage: consume
governing_library: T-109 traversal consequence carriers and T-135/T-139 evaluator-owned runner/read-model surfaces
triaged_at: 2026-05-09
created_at: 2026-05-09
updated_at: 2026-05-10
completed_at: 2026-05-10
source_ticket: T-109
governance_scope: STDO Method
dependencies:
  - T-135 realize evaluator-owned runner traversal spine
  - T-136 add yield closure disposition and resume basis
  - T-137 enforce target obligation binding and published action law
  - T-138 preserve causal chain and replayability for traversal consequence
  - T-139 consolidate public gaps as read-only evaluator view
related_tickets:
  - T-107 split operator handoff into prime domain modules
  - T-108 extract installed operator F_P dispatch closure
intake_source: The operator asked whether the evaluator migration lets odd_sdlc retire tech debt used to force iteration. The answer is yes, but only after the single evaluator/closure surface is in place and tested.
target_truth: Local forced-iteration code is removed or demoted to display/adaptation. The only lawful iteration states are closure dispositions and evaluator-selected intents over T-109/ABG truth.
superseded_truth: Local loops, local retry strings, broad fallback heuristics, prompt-pressure action prose, and CLI retry controllers are necessary to keep construction moving.
closure_law: This ticket closes only when the known local forced-iteration surfaces are removed or marked as derived display, tests fail if they regain authority, and no production code path can bypass the evaluator-owned runner spine.
evaluation_criteria:
  - Inventory all local forced-iteration surfaces before deletion.
  - Remove installed-operator local attempt loops that decide business traversal.
  - Remove or demote local action strings used as executable commands.
  - Remove prompt-prose instructions that function as routing authority.
  - Remove CLI retry/context injection business logic.
  - Remove local public-gaps ranking/fallback code not backed by evaluator truth.
  - Keep necessary effect adapters, process supervision, and rendering code.
  - Add guard tests that grep or import-check retired authority surfaces do not reappear.
  - Update design notes to distinguish deleted authority from retained adapters.
proof_surface:
  - build_tenants/typescript/test_env/tests/test_t140_no_local_forced_iteration_authority.test.mjs
  - code search evidence for retired strings/branches
  - focused runner/gaps tests from T-135 and T-139
non_closure_conditions:
  - Retired local strings still cause graph invocation.
  - CLI still owns retry/re-entry iteration.
  - Prompt text remains a required routing authority.
  - Local fallback heuristics can choose broad graph action for narrow target pressure.
  - Tech debt is hidden behind compatibility aliases instead of deleted or visibly demoted.
---

# T-140: Retire Local Forced-Iteration Tech Debt

## STDO Triage

Smallest lawful re-entry: `realization_refactor`.

This is cleanup with release impact. It must run after the new consequence
surface is available, otherwise deleting the shims would remove the only current
iteration path.

## Migration Declaration

- migration strategy: `inside_out_hard_break`
- old truth path: local retry loops, local action strings, broad fallback
  heuristics, prompt-pressure route instructions, CLI retry controllers, and
  compatibility aliases keep iteration moving outside the evaluator/closure
  surface.
- new truth path: `SdlcEdgeClosureDecision`, `EvaluatorProjection`, and admitted
  `ConstructionIntent` are the only traversal/iteration authorities.
- old producers: installed-operator helper branches, handoff prompt pressure,
  CLI retry-loop code, query-domain fallback builders, local assurance action
  strings.
- new producers: T-109 closure/evaluator carriers, T-135 runner spine, T-139
  read-only public surfaces.
- old consumers: runner, CLI, public gaps, live harnesses, RC reports, tests
  that grep or assert legacy route strings.
- new consumers: runner, CLI rendering, gaps/read models, tests and live lanes
  bound to evaluator/closure truth.
- projections/proof surfaces: code-search inventory, no-local-authority tests,
  runner/gaps tests, design notes distinguishing retained adapters from deleted
  authority.
- migration closure: old local iteration paths cannot pass normal execution
  unless explicitly retained as display-only compatibility with no authority.

## Migration Checklist

- [x] old truth path is named explicitly
- [x] new truth path is named explicitly
- [x] producer set for the new truth is listed
- [x] consumer set for the new truth is listed
- [x] projection/read-model surfaces are listed
- [x] old truth path is removed or explicitly demoted from authority
- [x] mixed-state behavior is no longer accepted as closure evidence
- [x] tests proving mixed old/new behavior are removed or repriced
- [x] recurring realization patterns are checked against existing library/commonization surfaces
- [x] ticket declares library usage and names the governing library or rationale
- [x] if the work exists in more than one build tenant, this backlog/active ticket carries only one tenant lifecycle and any sibling tenant work lives on its own suffixed ticket
- [x] ticket wording, product wording, and proof claims are reconciled before closure

## Functional Review Criteria

- [x] Old local iteration paths are deleted or explicitly marked display-only.
- [x] Compatibility aliases cannot dispatch work or close/retry/re-enter edges.
- [x] Tests fail if legacy strings regain authority.
- [x] Effect adapters remain, but source-truth interpretation is not hidden
      behind them.
- [x] No third local rebuild of the same iteration pattern remains.

## Impacted Interface Review Checklist

- [x] `installed_operator.ts`: no local business loop or route-string dispatch.
- [x] `operator/handoff.ts`: no prompt-pressure route authority.
- [x] `cli/command.ts`: no retry controller or hidden context injection.
- [x] `projection/query_domain.ts`: no local ranking/fallback authority.
- [x] `assurance/`: no action-string fold that can bypass closure decision.
- [x] tests: no green lane relies on old and new authority coexisting.

## Required Break Order

1. Inventory all old local iteration surfaces with code refs.
2. Wait until T-135/T-139 provide the replacement runner/read-model paths.
3. Delete or visibly demote one old authority surface at a time.
4. Add guard tests for each retired authority surface.
5. Reprice old tests that required compatibility aliases.
6. Update design notes to name retained adapters and deleted authorities.

## Break-To-Closure Map

- Deleting installed-operator route-string dispatch closes the runner-authority
  debt.
- Deleting CLI retry control closes the adapter-controller debt.
- Deleting prompt-pressure route authority closes the worker-prompt debt.
- Deleting query-domain fallback ranking closes the public-read-model debt.

## Mixed-State Negative Proof

At least one structural test must leave a legacy route string present in a
fixture while withholding evaluator/closure authority. Normal execution must not
dispatch work from the legacy string.

## Retirement Rule

If a surface decides traversal, it must be one of:

```text
SdlcEdgeClosureDecision
EvaluatorProjection
admitted ConstructionIntent
```

Everything else is display, adaptation, effect execution, or deleted.

## Initial Inventory

Start the implementation by inventorying:

- installed-operator same-edge retry and repair-route branches
- CLI retry loops/context injection
- gap-dossier action strings used as commands
- prompt-pressure route instructions used as authority
- query-domain/public-gaps local ranking and fallback paths
- broad bootstrap/release fallback heuristics

## Closure Evidence - 2026-05-10

T-135 is closed as sufficient for the runner-spine migration. This ticket now
owns residual cleanup only; it must not be used to reopen T-135 unless new
execution evidence shows the runner spine itself is false.

Verified current state:

- Legacy executable route strings
  `retry_same_edge_with_gap_dossier`,
  `plan_repair_reentry_with_gap_dossier`, and
  `inspect_worker_archive` are absent from
  `build_tenants/typescript/code/src/operator/installed_operator.ts`.
- `npm run test:t135` passed, 4/4.
- `npm run lint:semantic` passed.
- `npm run test:semantic` passed, 330/330.
- `npm run test:sandbox` passed, 15/15.

Implemented cleanup:

- `build_tenants/typescript/code/src/operator/installed_operator.ts` no longer
  contains `retryContextFromGapDossier`, `gapActionRefs`,
  `nextLawfulActions.includes`, `retry_same_edge_with_gap_dossier`,
  `plan_repair_reentry_with_gap_dossier`, or `inspect_worker_archive`.
- Retry/resume context is now produced by
  `deriveSdlcWorkerRetryContextFromTraversalConsequence`, using
  `SdlcEdgeClosureDecision`, `SdlcNextActionProjection`, and the admitted
  construction intent chain as source truth.
- Consequence-derived retry context no longer repopulates `priorGapDossiers`;
  the retry attempt source projection ref comes from
  `SdlcNextActionProjection.nextActionProjectionRef`, and the prior basis is
  exposed as `priorAuthorityRef` so a closure-decision ref is not mislabeled as
  a manifest id.
- Retry-context derivation now returns typed absence statuses
  (`no_consequence`, `no_manifest`, `no_executable_intent`) instead of
  collapsing distinct ineligibility cases into `undefined`.
- Closure retry/repair/reprice reason refs are now derived from typed
  `SdlcBlockingReason.lawfulReentryPoint`, not from gap-dossier action strings.
- Repair re-entry graph-span events are gated by typed blocking-reason re-entry
  truth; gap dossiers remain available as bounded evidence/display pressure and
  repair-diagnostic input, not traversal-selection authority.
- `build_tenants/typescript/test_env/tests/test_t140_no_local_forced_iteration_authority.test.mjs`
  functionally proves retry context derivation from traversal consequence refs,
  proves no retry context is produced without executable evaluate-next truth,
  proves typed absence status for missing consequence/manifest inputs, and
  guards the retired authority surfaces.
- `build_tenants/typescript/package.json` exposes `npm run test:t140`.
- `build_tenants/typescript/code/src/qualification/rc_qualification.ts` includes
  the T-140 proof gate.

Verification:

```bash
npm run test:t140
# 6/6 passed

npm run test:t135
# 7/7 passed

npm run test:t064
# 9/9 passed

npm run test:t101
# 1/1 passed

npm run build:semantic && node --test test_env/tests/test_t120_retry_local_repair_prompt.test.mjs
# 8/8 passed

npm run lint:semantic
# passed

npm run test:semantic
# 332/332 passed
```

Closure note: closed as the residual local forced-iteration cleanup for the
T-109/T-135/T-139 evaluator-owned spine. Gap dossiers are archived
read-model/evidence pressure; T-140 consequence-derived retry context does not
re-inject them as iteration payload.
