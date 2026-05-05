---
ticket_id: T-122
title: Add feature scope carrier for steel-thread closure
status: active
ticket_category: sdlc_runtime_scope
change_class: design_reframe
reentry_point: design
created_at: 2026-05-05T00:00:00+10:00
updated_at: 2026-05-05T01:00:00+10:00
owner: odd_sdlc
affected_boundary:
  - build_tenants/typescript/code/src/operator/carriers.ts
  - build_tenants/typescript/code/src/operator/handoff.ts
  - build_tenants/typescript/code/src/assurance/design_completeness.ts
  - build_tenants/typescript/test_env/tests/
  - ai_sdlc_examples/local_projects/data_mapper/data_mapper.test68.TS.cx
depends_on:
  - T-116
  - T-121
evidence_refs:
  - /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test68.TS.cx/.ai-workspace/runtime/odd_sdlc/operator-runs/20260504T151113851Z_pid78217
  - /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test68.TS.cx/.ai-workspace/runtime/odd_sdlc/operator-runs/20260504T150504323Z_pid78217/gap_dossier.json
  - /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test68.TS.cx/.ai-workspace/runtime/odd_sdlc/operator-runs/20260504T150626581Z_pid78217/gap_dossier.json
  - /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test68.TS.cx/.ai-workspace/runtime/odd_sdlc/operator-runs/20260504T150725407Z_pid78217/gap_dossier.json
  - /Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/active/T-116-add-module-domain-schema-state-and-aggregate-design-surfaces.md
  - /Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/completed/T-121-adopt-steel-thread-delivery-strategy-by-default.md
proof_commands:
  - npm run build:semantic
  - node --test build_tenants/typescript/test_env/tests/test_t122_feature_scope_closure.test.mjs
  - ODD_SDLC_TS_AGENT_EXECUTOR_PROFILE=pty-terminal node_modules/.bin/odd-sdlc-ts start --workspace /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test68.TS.cx --target next --until converged --worker 'process://codex?model=gpt-5.3-codex-spark'
---

# T-122: Add feature scope carrier for steel-thread closure

## Why This Ticket Exists

The `data_mapper.test68.TS.cx` live run proved that the ABG callout loop and
same-edge retry mechanics are working. The aggregate design edge improved
through schema-level failures and then failed on substantive design
completeness.

The failure was lawful but over-broad for steel-thread delivery:

- `derive_aggregate_domain_model_surface` was running under the steel-thread
  strategy directive.
- The prompt asked for aggregate module/domain/state surfaces.
- The assurance pass evaluated every observed module schema and required every
  module state diagram.
- The final failure blocked on out-of-scope breadth, including state diagrams
  for modules outside the current vertical slice.

This is not an ABG runtime defect. It is an `odd_sdlc` scope defect. Strategy
selects build order, but it does not define which modules, entities, operations,
and proof obligations are in scope for the current feature traversal.

## Current Build State

`T-121` made steel thread the default delivery strategy. `T-116` added deeper
module/domain/state/aggregate design surfaces and is currently in a
steel-thread-passed-pending-widening state.

Current implementation gap:

- The worker handoff carries strategy refs but no typed feature scope carrier.
- The prompt can ask for steel-thread work, but assurance cannot distinguish
  selected vertical-slice obligations from deferred breadth.
- `deriveDesignCompletenessAssuranceLedger` evaluates all observed module
  schemas and all aggregate entities.
- Missing diagrams or attributes for deferred modules currently block the
  current slice.

## Target State

`odd_sdlc` carries an explicit, typed feature scope through the traversal.

The scope is small and functional. It carries refs and stable identifiers, not
copied design state.

```ts
export interface SdlcFeatureScope {
  readonly kind: "sdlc_feature_scope";
  readonly scopeVersion: "ts-scope-v1";
  readonly mode: "steel_thread" | "full_breadth";
  readonly scopeRef: string;
  readonly basisRefs: readonly string[];
  readonly includedModuleNames: readonly string[];
  readonly includedEntityIds: readonly string[];
  readonly includedOperationIds: readonly string[];
  readonly deferredModuleNames: readonly string[];
}
```

The framework derives this carrier from existing ledger/materialization truth.
Workers may consume it, but they do not author it as closure authority.

## Functional Design

Add a pure derivation boundary:

```ts
export function deriveSdlcFeatureScope(input: {
  readonly targetAssetType: string;
  readonly strategyDirectiveRef: string | null;
  readonly selectedScheduleItemRefs: readonly string[];
  readonly declaredModuleNames: readonly string[];
  readonly materializedEntityIds: readonly string[];
  readonly materializedOperationIds: readonly string[];
}): SdlcFeatureScope;
```

Rules:

- If strategy is steel-thread, derive `mode: "steel_thread"` and choose the
  current vertical-slice module/entity/operation chain from selected schedule
  refs and available materialization refs.
- If no selected chain can be derived, fall back to `mode: "full_breadth"` or
  emit a scope derivation defect. Do not silently invent scope.
- If strategy is not steel-thread, derive `mode: "full_breadth"` and include
  all declared modules and materialized entities/operations.
- `deferredModuleNames` records known breadth outside the current slice.
- Scope derivation is deterministic and does not inspect worker prose.

## Required Refactoring Points

1. Add the carrier type.

Add `SdlcFeatureScope` to the TypeScript carrier surface. Keep it small,
readonly, and JSON-serializable.

2. Carry scope through traversal intent and handoff.

Add `featureScope` to the traversal intent package and
`SdlcWorkerHandoffManifest`. The archived handoff manifest must show the exact
scope used for the worker call.

3. Project scope into prompts.

Update the design-depth prompt pressure so workers see:

- current mode
- included modules
- included entities
- included operations
- deferred modules
- rule that deferred modules are not closure authority for the current
  steel-thread edge

4. Make assurance scope-aware.

Update `deriveDesignCompletenessAssuranceLedger` so it receives feature scope.

For `mode: "steel_thread"`:

- missing attributes for in-scope entities block closure
- missing diagrams for in-scope modules block closure
- missing flows for in-scope operations block closure
- deferred modules are recorded as deferred breadth, not as current blocking
  defects

For `mode: "full_breadth"`:

- preserve current all-module, all-entity, all-operation behavior

5. Make traversal pressure scope-aware.

Use `featureScope` before constructing worker handoff pressure. In
`mode: "steel_thread"`, the handoff must carry only in-scope requirement,
module, authority, retrieval, and tranche pressure to the worker. Target,
source, evaluator, runtime, and prior-gap obligations remain admissible because
they define the current call boundary. Deferred modules remain visible on
`featureScope.deferredModuleNames`; they must not be emitted as current closure
obligations.

6. Preserve deferred breadth as visible debt.

Do not hide or erase deferred modules. Emit non-blocking ledger entries or
deferred closure notes so widening work remains visible after the steel thread
passes.

7. Add deterministic tests.

Add focused tests that prove:

- steel-thread mode does not block on deferred module diagrams
- steel-thread mode still blocks on missing in-scope diagrams
- steel-thread mode still blocks on missing in-scope entity attributes
- full-breadth mode still blocks on missing diagrams for any declared module
- worker-authored scope cannot override framework-derived scope

8. Add live proof.

Rerun the data mapper steel-thread lane with Codex Spark over the PTY executor.
The aggregate edge must either advance past `derive_aggregate_domain_model_surface`
or fail only on an in-scope closure defect.

## Non-Closure Conditions

This ticket is not closed by:

- checking only `strategyDirectiveRef` without adding a typed scope carrier
- copying full schemas, requirements, or design registers into the scope object
- trusting worker-authored scope as closure authority
- suppressing design completeness failures globally
- treating deferred breadth as completed breadth
- making steel-thread mode pass by weakening full-breadth closure
- adding an external loop around ABG instead of carrying scope through ABG-owned
  traversal and `odd_sdlc` handoff surfaces

## Closure Criteria

This ticket closes when:

- `SdlcFeatureScope` exists as a typed carrier
- scope is archived in traversal handoff evidence
- prompt pressure includes scope and deferred breadth instructions
- design completeness assurance is scope-aware
- deterministic positive and negative tests pass
- full-breadth assurance behavior is preserved
- a live data mapper steel-thread run proves the aggregate edge no longer
  blocks on out-of-scope module diagrams or out-of-scope aggregate breadth

## Notes

The ledger contains evidence needed to derive scope, but the current ledger does
not itself define scope. The optimal fix is not to carry massive state. The
optimal fix is to promote the selected vertical-slice chain into a small typed
scope projection and make every downstream prompt and evaluator consume that
projection.
