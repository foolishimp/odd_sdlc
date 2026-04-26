# Corrective Review: TypeScript Build Wave Before Closure

**Date**: 2026-04-26
**Reviewer**: Codex
**Scope**: Build-stage corrective review of the `odd_sdlc.TS` tenant wave before the build wave is allowed to close.
**Position**: This is not an RC review. The tenant is still in build. The purpose is to catch method and code gaps early enough that T-035 through T-038 can close on stronger ground.

## Findings

### High: Build authority and implementation are still local-only

Current `git status --short` shows the TypeScript tenant, the T-025..T-038 ticket files, and `specification/requirements/13-odd-sdlc-typescript-tenant.md` as untracked.

This is acceptable only while the build wave is in active local construction. It must not survive build closure. Under TICKET_METHOD, `.ai-workspace/tickets/backlog/`, `.ai-workspace/tickets/active/`, and `.ai-workspace/tickets/completed/` are ticket authority. If these files are not committed or otherwise cut into the source boundary, later review cannot distinguish real closure from local scratch state.

Corrective action before closing this build wave:

- commit or otherwise checkpoint the TypeScript tenant, the T-ticket authority, and requirement/design surfaces together
- do not move any additional ticket to completed unless its authority file is in the durable source boundary
- keep generated `build/` and `node_modules/` ignored

### High: T-031 fixture proof is not portable

`test_t031_workspace_ingress.test.mjs` hardcodes:

```text
/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.template
```

at `build_tenants/typescript/test_env/tests/test_t031_workspace_ingress.test.mjs:20`.

That proves useful local behavior, but not clean checkout behavior. The build wave can keep using data_mapper, but it needs a governed fixture boundary.

Corrective action before relying on this as build proof:

- introduce a fixture locator or fixture manifest
- allow the canonical fixture root to be provided by environment or checked-in fixture metadata
- make the test fail with a clear missing-fixture diagnostic instead of silently depending on Jim's path
- for T-038, record the exact fixture source/version used for comparison

### High: Query-domain read model can drift from the admitted GTL module

`projectSdlcQueryDomain` receives a `module`, but then constructs a fresh catalog for `functions`, `programs`, and `assetOwnership`:

- `build_tenants/typescript/code/src/projection/query_domain.ts:153`
- `build_tenants/typescript/code/src/projection/query_domain.ts:158`
- `build_tenants/typescript/code/src/projection/query_domain.ts:171`
- `build_tenants/typescript/code/src/projection/query_domain.ts:175`

This creates a read-model split: `graphFunctions` and `startTargets` come from the supplied module, while catalog and ownership truth come from a separate canonical reconstruction. If those disagree, query-domain can project a facade that looks valid while the admitted module cannot execute it.

Corrective action before T-036/T-037:

- derive query-domain catalog/ownership from the admitted module, or
- compare the supplied module to the canonical catalog and fail closed on mismatch
- add a negative test with a stale/missing module graph function and prove projection does not publish false ownership/start truth

### High: Hook postflight does not verify requested operation against returned operation

`SdlcHookInvocation` carries `requestedOperation`, but the work report uses `constructorResult.operationType`. Postflight receives only the contract and report, so it cannot reject a constructor that returns a different work operation.

Relevant code:

- `build_tenants/typescript/code/src/hooks/hook_set.ts:128`
- `build_tenants/typescript/code/src/hooks/hook_set.ts:136`
- `build_tenants/typescript/code/src/hooks/hook_set.ts:780`
- `build_tenants/typescript/code/src/hooks/hook_set.ts:804`

Corrective action before closing T-034's build implications into downstream work:

- carry `requestedOperation` into `SdlcWorkReport`, or pass invocation into postflight
- block when requested and returned operation disagree
- add a negative test where `derive_code_surface` requests `generate` but the constructor returns `release`

### Medium: Public start should fail closed on stale query/module pairs

`publicStartOnce` resolves targets from the query-domain projection, then admits an ABI `ExecutionBasis` against the supplied module.

Relevant code:

- `build_tenants/typescript/code/src/start/public_start.ts:130`
- `build_tenants/typescript/code/src/start/public_start.ts:143`
- `build_tenants/typescript/code/src/start/public_start.ts:239`
- `build_tenants/typescript/code/src/start/public_start.ts:258`

If query-domain and module disagree, ABI admission may throw instead of returning the public blocked result. The public adapter should own this boundary and return a typed blocked outcome.

Corrective action:

- validate the selected target exists in `module.graphFunctions` before execution-contract construction
- return `target_unavailable` or a new stale-read-model blocking reason
- test graph-function, asset, and `next` target mismatch paths

### Medium: Serialized carrier admission normalizes wrong `kind` values

The shared closed-record parser rejects unexpected fields but does not enforce discriminator values:

- `build_tenants/typescript/code/src/shared/validation.ts:8`
- `build_tenants/typescript/code/src/shared/validation.ts:20`

Several `admit*` functions accept a `kind` field in the allowed shape but then return the expected kind without validating the input kind. For constructed in-memory values this is harmless. For replay, imported evidence, or serialized result admission, it can silently normalize an object with the wrong declared carrier kind.

Corrective action before T-035 traceability/closure relies on replayed carriers:

- add `parseKind(input, expectedKind, label)` or equivalent
- use it in admissions that accept serialized carriers with a `kind` field
- add negative tests for wrong-kind source input, work report, and operational result

### Low: Public tenant status is stale or under-specified

`ODD_SDLC_TYPESCRIPT_TENANT_STATUS` remains `"substrate_bound"` in `build_tenants/typescript/code/src/index.ts:7`.

That is safer than overclaiming completion, but after T-030 through T-034 it no longer tells reviewers what state the tenant is in. Since this build is not RC, the status should say something like `build_active` or expose a separate capability list instead of pretending the only meaningful state is substrate binding.

Corrective action:

- either keep the conservative status and document it as "minimum attained status"
- or replace it with a build-stage status plus explicit capability flags

## What Is Already Sound Enough To Build On

The current implementation passes the declared semantic lane:

```text
npm run test:semantic
```

Result: 25 tests passed.

The lint lane passes:

```text
npm run lint:semantic
```

Result: passed.

The code shape is directionally right for ODD:

- GTL graph functions are published through ABIogenesis carriers
- ABG remains the source of runtime/traversal truth
- query and gap surfaces are read-only
- public start performs one handoff and does not own internal iteration
- hooks do not select next traversal or emit runtime events

## Corrective Sequence

Recommended order before the build wave closes:

1. Durability checkpoint: make ticket/spec/design/code authority tracked.
2. Query-domain consistency: remove catalog/module drift.
3. Public-start stale-read-model guard.
4. Hook requested/returned operation validation.
5. Portable fixture contract for data_mapper.
6. Serialized carrier kind validation before T-035 uses carriers for closure evidence.
7. Continue with T-035, T-036, T-037, then T-038.

This preserves the current build momentum while preventing the later RC gate from discovering avoidable method defects too late.
