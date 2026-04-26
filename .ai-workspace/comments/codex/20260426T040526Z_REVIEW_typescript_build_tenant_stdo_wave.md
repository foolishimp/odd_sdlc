# Review: odd_sdlc TypeScript Build Tenant STDO Wave

**Date**: 2026-04-26
**Reviewer**: Codex
**Scope**: TypeScript build-tenant tickets T-025 through T-038 under `.ai-workspace/tickets/backlog/` and `.ai-workspace/tickets/completed/`, plus the current `build_tenants/typescript/` realization.
**Method basis**: STDO as declared by the tickets: `S` = specification authority, `T` = ticket authority, `D` = design/module authority, `O` = ODD/GTL/ABG ownership.

## Findings

### Critical: TypeScript tenant and ticket authority are not durable in git

`git status --short` reports the whole TypeScript tenant, the T-025..T-038 tickets, and the supporting review comments as untracked:

```text
?? .ai-workspace/tickets/backlog/T-035-realize-typescript-traceability-lineage-and-requirement-closure.md
?? .ai-workspace/tickets/backlog/T-036-realize-typescript-gap-triage-homeostatic-loop-and-ticket-routing.md
?? .ai-workspace/tickets/backlog/T-037-realize-typescript-operational-transition-and-runtime-return-surfaces.md
?? .ai-workspace/tickets/backlog/T-038-qualify-odd-sdlc-typescript-rc-against-python-functionality-and-odd-scenarios.md
?? .ai-workspace/tickets/completed/T-025-reprice-odd-sdlc-typescript-tenant-as-odd-native-build-line.md
...
?? .ai-workspace/tickets/completed/T-034-realize-typescript-sdlc-constructor-and-evaluator-hook-set.md
?? build_tenants/typescript/
?? specification/requirements/13-odd-sdlc-typescript-tenant.md
```

This is a release/blocking issue, not cosmetic. TICKET_METHOD says the ticket folders are the ticket authority and completed tickets move to `.ai-workspace/tickets/completed/` (`/Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md:147`, `/Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md:832`). If the authority and implementation are untracked, a clean clone or release cut cannot replay or inspect the claimed STDO closure.

Impact: current green tests are local workspace evidence only. They are not yet durable source evidence for the TypeScript tenant build wave.

### High: T-031 proof is tied to an absolute local fixture path

`test_t031_workspace_ingress.test.mjs` hardcodes Jim's machine path:

- `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/tests/test_t031_workspace_ingress.test.mjs:20`
- `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/tests/test_t031_workspace_ingress.test.mjs:23`

That means `npm run test:semantic` only proves replayability on a workspace that has `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.template` in the expected sibling location. T-031 claims real imported fixture proof, but the proof lane is not portable to a clean folder, CI worker, or release checkout unless that external fixture is also governed and addressed by an explicit fixture contract.

Impact: this blocks RC-grade qualification and weakens T-038's future sandbox/data_mapper gate.

### High: Query-domain projection can use catalog truth independent of the supplied GTL module

`projectSdlcQueryDomain` accepts a `module`, but reconstructs the function catalog separately:

- `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/code/src/projection/query_domain.ts:153`
- `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/code/src/projection/query_domain.ts:158`
- `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/code/src/projection/query_domain.ts:171`
- `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/code/src/projection/query_domain.ts:175`

The result mixes module-derived surfaces (`graphFunctions`, `startTargets`) with separately reconstructed catalog-derived surfaces (`functions`, `programs`, `assetOwnership`). T-032's non-closure condition says projection files must not become authority over graph publication. As written, a stale or malformed module can still receive a query projection containing canonical catalog/program/ownership truth that did not come from that module.

Impact: the read model can disagree with the actual published GTL module. That is exactly the kind of facade drift the current ODD method is trying to prevent.

Expected fix: derive `functions`, `programs`, and `assetOwnership` from the supplied admitted module, or fail closed when the module does not match the canonical catalog.

### High: Hook closure does not verify requested operation against returned operation

`SdlcHookInvocation` carries `requestedOperation`:

- `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/code/src/hooks/hook_set.ts:128`
- `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/code/src/hooks/hook_set.ts:136`

But `constructSdlcWorkReport` copies `constructorResult.operationType` into the report:

- `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/code/src/hooks/hook_set.ts:780`
- `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/code/src/hooks/hook_set.ts:790`

`evaluateSdlcHookPostflight` only receives the contract and report, not the invocation, so it cannot compare requested operation to returned operation:

- `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/code/src/hooks/hook_set.ts:804`
- `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/code/src/hooks/hook_set.ts:854`

This leaves a behavioral hole: an F_P constructor can return the wrong work operation and still pass if the target binding, evidence, and generated-asset attestation are otherwise valid. T-034 says the first hook set must support bounded constructor/evaluator turns through declared work-report/evaluator contracts; operation mismatch should be a postflight block.

Impact: work-act class can drift while the hook appears closed. That weakens the "no trace-only shell, no hidden merge" protection T-034 is trying to establish.

Expected fix: carry `requestedOperation` into the report or pass invocation into postflight, then add a blocking reason such as `operation_type_mismatch`.

### Medium: Public start can throw on stale query/module mismatch instead of returning a blocked outcome

`publicStartOnce` resolves asset targets from `queryDomain.assetOwnership` and `queryDomain.programs`, then constructs an ABI `ExecutionBasis` against the supplied `module`:

- `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/code/src/start/public_start.ts:130`
- `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/code/src/start/public_start.ts:143`
- `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/code/src/start/public_start.ts:239`
- `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/code/src/start/public_start.ts:258`

If the query projection and module are out of sync, target resolution may return a graph function name that the module cannot resolve. ABI admission then throws rather than returning the public-start blocked shape used for `target_unavailable`.

Impact: the public command adapter does not fail closed at its own boundary for stale read-model input. This is downstream of the query-domain drift above, but it deserves its own guard because T-033 is the public ignition boundary.

Expected fix: validate the selected target against `module.graphFunctions` before constructing the execution contract, and return `target_unavailable` or a more specific stale-query blocked reason.

### Medium: T-034 closure is synthetic, not data_mapper behavioral proof

T-034 lists `data_mapper behavioral fixture proof candidate` in its proof surface:

- `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/completed/T-034-realize-typescript-sdlc-constructor-and-evaluator-hook-set.md:35`
- `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/completed/T-034-realize-typescript-sdlc-constructor-and-evaluator-hook-set.md:39`

The actual T-034 test suite exercises synthetic hook invocations and constructor results:

- `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/tests/test_t034_hook_set.test.mjs:20`
- `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/tests/test_t034_hook_set.test.mjs:50`
- `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/tests/test_t034_hook_set.test.mjs:123`

That is useful unit coverage, but it is not behavioral data_mapper proof. This is not a closure reversal for T-034 if the word "candidate" is intentional, but it must not be reused as RC evidence.

Impact: T-038 still needs real imported-workspace proof. Do not let T-034's green tests stand in for that.

## Ticket Review

The ticket sequence is coherent:

- T-025 and T-026 establish the lawful re-entry point and design authority.
- T-027 through T-034 build the tenant in a mostly proper inside-out order: scaffold, substrate, carriers, GTL publication, ingress, projections, public start, hooks.
- T-035 through T-038 correctly leave traceability, gap triage, operational return, and RC qualification open.

The most important governance point: `build_tenants/TENANT_REGISTRY.md` still says `typescript` may not claim realization closure until operational-return and RC qualification close (`/Users/jim/src/apps/odd_sdlc/build_tenants/TENANT_REGISTRY.md:37`). T-037 and T-038 are still backlog (`/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/backlog/T-037-realize-typescript-operational-transition-and-runtime-return-surfaces.md:6`, `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/backlog/T-038-qualify-odd-sdlc-typescript-rc-against-python-functionality-and-odd-scenarios.md:6`).

So the current state is not RC. It is a promising implementation slice with open RC-gating tickets.

## Verification Run

From `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript`:

```text
npm run test:semantic
```

Result: passed, 25 tests.

```text
npm run lint:semantic
```

Result: passed.

From `/Users/jim/src/apps/odd_sdlc`:

```text
git diff --check
```

Result: passed for tracked diffs. This does not cover the untracked TypeScript tenant or untracked ticket/comment files.

## RC Judgment

Not RC-ready.

The method is mostly being followed at the ticket-sequencing level, and the code is moving in the right ODD shape: graph functions are published through ABI carriers, projections are read-only, public start does not own iteration, and hooks avoid selecting next traversal.

The remaining gaps are concrete:

- make the TypeScript tenant and T-ticket authority durable in git
- make fixture proof portable or formally govern the external data_mapper fixture
- remove query-domain/catalog drift by deriving read models from admitted module truth
- block hook operation mismatches
- fail closed on stale public-start query/module pairings
- complete T-035, T-036, T-037, and T-038 before any RC claim
