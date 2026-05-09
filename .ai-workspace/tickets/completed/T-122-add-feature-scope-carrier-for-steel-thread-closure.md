---
id: T-122
title: Add feature scope carrier for steel-thread closure
type: feature
status: completed
review_status: completed_live_feature_scope_carrier_proof
ticket_category: sdlc_runtime_scope
goal: odd-sdlc-rc-data-mapper-production-depth
change_intent: Realize a typed feature-scope carrier for steel-thread and targeted-repair traversal pressure without silently inventing scope or suppressing in-scope assurance failures.
change_class: design_reframe
re_entry_point: design
triaged_at: 2026-05-05
created_at: 2026-05-05
updated_at: 2026-05-09
completed_at: 2026-05-09
owner: odd_sdlc
affected_boundary:
  - build_tenants/typescript/code/src/operator/carriers.ts
  - build_tenants/typescript/code/src/operator/handoff.ts
  - build_tenants/typescript/code/src/operator/feature_scope.ts
  - build_tenants/typescript/code/src/assurance/design_completeness.ts
  - build_tenants/typescript/test_env/tests/
  - ai_sdlc_examples/local_projects/data_mapper/data_mapper.test68.TS.cx
depends_on:
  - T-116
  - T-121
related_tickets:
  - B-084 active design-depth admission closure correction
  - T-041 active bounded RC release claim
  - T-123 active traversal strategy authority correction
  - T-130 backlog full-breadth widening
evidence_refs:
  - /Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/active/T-116-add-module-domain-schema-state-and-aggregate-design-surfaces.md
  - /Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/completed/T-121-adopt-steel-thread-delivery-strategy-by-default.md
rejected_evidence_refs:
  - /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test68.TS.cx/.ai-workspace/runtime/odd_sdlc/operator-runs/20260504T151113851Z_pid78217
  - /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test68.TS.cx/.ai-workspace/runtime/odd_sdlc/operator-runs/20260504T150504323Z_pid78217/gap_dossier.json
  - /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test68.TS.cx/.ai-workspace/runtime/odd_sdlc/operator-runs/20260504T150626581Z_pid78217/gap_dossier.json
  - /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test68.TS.cx/.ai-workspace/runtime/odd_sdlc/operator-runs/20260504T150725407Z_pid78217/gap_dossier.json
proof_commands:
  - npm run build:semantic
  - node --test build_tenants/typescript/test_env/tests/test_t122_feature_scope_closure.test.mjs
  - ODD_SDLC_TS_AGENT_EXECUTOR_PROFILE=pty-terminal node_modules/.bin/odd-sdlc-ts start --workspace /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test68.TS.cx --target next --until converged --worker 'process://codex?model=gpt-5.3-codex-spark'
target_truth: odd_sdlc derives a typed feature-scope carrier from authoritative traversal strategy and selected refs, carries it through handoff/prompt/materialization/assurance, and never silently invents a scoped module when no selected chain can be derived.
superseded_truth: steel-thread scope is inferred from prompt strategy prose or from the first declared module when no selected refs bind a module.
closure_law: This ticket closes only when the ticket contract is method-compliant, deterministic tests prove full-breadth and scoped behavior plus no silent scope invention, design-completeness filtering is typed or proven sufficient against generic reasons, and live data_mapper evidence carries featureScope/traversalStrategyDecision while proving out-of-scope breadth no longer blocks the selected steel-thread edge.
evaluation_criteria:
  - SdlcFeatureScope exists as a typed carrier and is archived in handoff evidence.
  - Full-breadth mode is non-narrowing.
  - Steel-thread and targeted-repair modes do not silently pick the first declared module without selected refs.
  - Deferred breadth remains visible debt, not completed breadth.
  - Scope-aware assurance evaluates entity and operation identity at the level of disambiguation supplied by the scope and carrier instead of forcing a canonical spelling that the selected scope did not require.
  - Scope-aware design-completeness status checks admit scoped qualifiers such as `satisfied_for_steel_thread` as the corresponding base status when the selected feature scope supplies that qualifier context.
  - Design-completeness assurance filters by typed scope or tests prove generic reasons cannot be incorrectly suppressed or leaked.
  - Traceability headers name the T-122 surfaces that consume feature scope.
proof_surface:
  - deterministic feature-scope derivation tests
  - deterministic materialization and shard filtering tests
  - deterministic design-completeness scoping tests
  - live data_mapper handoff manifests with featureScope and traversalStrategyDecision
non_closure_conditions:
  - live evidence predates featureScope or traversalStrategyDecision in handoff manifests
  - focused tests pass while live steel-thread proof is still outstanding
  - no selected chain can be derived and code silently scopes to the first declared module
  - design-completeness scoping depends only on reason-string token matches without proof
  - feature-scope or F_D assurance fails only because equivalent in-scope entity/operation IDs use an allowed non-canonical spelling
  - feature-scope or F_D assurance fails only because a closed axis status is qualified by the selected scope
  - targeted_repair mode exists in code but is absent from the ticket contract
---

## Closure Note - 2026-05-09

Closed under STDO for the feature-scope carrier and steel-thread/targeted-scope
closure slice.

Current live evidence:

- Fresh data_mapper live archive:
  `build_tenants/typescript/test_env/test_runs/t109_live_installed_data_mapper_pty/20260508T122226315Z_pid79621`.
- Live handoff manifests carry both `featureScope` and
  `traversalStrategyDecision`.
- Early induction surfaces such as `derive_intent_surface`,
  `derive_product_surface`, `derive_goal_surface`, and
  `derive_requirement_surface` carried non-narrowing `full_breadth` scope.
- Post-induction construction surfaces such as `derive_uat_testcases_surface`,
  `derive_implementation_design_surface`,
  `derive_aggregate_domain_model_surface`, and
  `derive_aggregate_sunny_day_sequence_surface` carried `steel_thread` scope
  over `cdme-compiler`.
- Later full-breadth component/test surfaces remained explicit and visible
  rather than silently invented.

Closure boundary:

- This closes the carrier/projection/proof requirement for T-122.
- Full-breadth widening beyond the selected scope remains separate backlog
  scope, not a reopened defect here.

## Reopen Finding - 2026-05-07

Reopened under STDO. The completed claim is not accepted.

Findings:

- The ticket marked `status: completed` and
  `review_status: completed_live_installed_scope_proof`, but its focused
  verification section says live data_mapper steel-thread proof remains
  outstanding. That contradicts the closure criteria requiring live proof.
- The cited `test68` live evidence predates the feature-scope proof surface. The
  referenced handoff manifests do not carry `featureScope` or
  `traversalStrategyDecision`, so they cannot prove T-122 closure.
- The original header was not structurally TICKET_METHOD-compliant. It used
  `ticket_id` / `reentry_point` and lacked `id`, `goal`, `change_intent`,
  `re_entry_point`, `triaged_at`, `target_truth`, `closure_law`,
  `evaluation_criteria`, and `proof_surface` as a completed closure contract.
- Current `feature_scope.ts` silently selects the first declared module when no
  selected refs bind a module. That violates this ticket's rule that no selected
  chain should fall back to full breadth or emit a defect, not invent scope.
- Current `design_completeness.ts` scopes axis-verdict reasons by string-token
  matching. That is a functional risk until typed reason scope exists or tests
  prove generic reasons cannot be suppressed and incidental token matches cannot
  leak out-of-scope blockers.
- `design_completeness.ts` consumes `SdlcFeatureScope` but did not declare T-122
  in its implementation header.
- T-123 lawfully extends feature-scope mode to `targeted_repair`; T-122 must name
  that extension instead of documenting only `steel_thread | full_breadth`.

## Corrected Closure Bar - 2026-05-07

T-122 closes only when:

- the header contract remains method-compliant;
- feature-scope derivation does not silently choose the first declared module
  when selected refs do not bind scope;
- design-completeness scoping is typed or covered by negative tests for generic
  and incidental-token reasons;
- deterministic tests prove full-breadth, steel-thread, targeted-repair, no
  worker-authored override, no silent scope invention, deferred breadth, and
  materialization/shard filtering behavior;
- live data_mapper evidence includes `featureScope` and
  `traversalStrategyDecision` in the handoff manifest and proves the aggregate
  edge no longer blocks on out-of-scope module diagrams or aggregate breadth;
- the T-123 traversal strategy authority correction remains compatible with the
  T-122 scope carrier.

## Implementation Checkpoint - 2026-05-07

Status: active, pending operator review of test results and live data_mapper
proof.

Implemented deterministic corrections for the reopened findings:

- `feature_scope.ts` no longer selects the first declared module when scoped
  strategy refs do not bind a module.
- steel-thread and targeted-repair derivation now fall back to
  `mode: "full_breadth"` when no selected chain can be derived.
- malformed/manual non-full feature scopes with no included modules no longer
  behave as all-modules in `sdlcModuleNameInFeatureScope` /
  `sdlcTextMatchesFeatureScope`.
- `design_completeness.ts` no longer suppresses generic axis-verdict blockers
  in scoped mode. It suppresses worker-authored axis reasons only when all
  reasons are clearly deferred-scope reasons.

Verification run for operator review:

- `npm run build:semantic && node --test test_env/tests/test_t122_feature_scope_closure.test.mjs` passed: 16/16.

This checkpoint does not close T-122. Remaining closure still requires live
data_mapper evidence carrying `featureScope` and `traversalStrategyDecision`
after the T-123 strategy authority correction is complete.

## Ticket-Level Assurance Clarification - 2026-05-07

Status: active, pending operator review and fresh live data_mapper proof.

Feature scope is a disambiguation carrier, not a demand that workers rewrite
all local design identities into one canonical spelling. T-122 assurance must
therefore judge whether a design fact is in scope and whether its referenced
operation/entity is present at the level of identity the scope actually
declared.

Current rule for T-122/B-084 interaction:

- `featureScope.includedModuleNames` remains exact module authority.
- `featureScope.includedEntityIds` and `featureScope.includedOperationIds`
  admit scoped alias comparison when they do not disambiguate a single spelling.
- aggregate-domain and sunny-day assurance may compare scheme-prefixed,
  local-name, separator/case, and compact alphanumeric aliases when module
  identity is compatible.
- if both sides declare conflicting module identity, the match fails.
- design-completeness axis statuses may carry selected-scope qualifiers, for
  example `satisfied_for_steel_thread`, and still admit as the corresponding
  base status.
- exact canonical carrier spelling can be required only when the handoff,
  selected scope, source authority, or ticket contract explicitly required it.

This clarification prevents false steel-thread failures where the selected
scope is lawful but F_D demands a spelling normalization the worker was not
asked to perform.

Verification run for operator review:

- `npm run build:semantic && node --test test_env/tests/test_t122_feature_scope_closure.test.mjs test_env/tests/test_t116_design_depth_steel_thread.test.mjs` passed: 25/25.
- `npm run test:semantic` passed: 240/240.
- `npm run test:sandbox` passed: 15/15.

Stopped live archive for this finding:

- `build_tenants/typescript/test_env/test_runs/t109_live_installed_data_mapper_pty/20260507T023042351Z_pid93685`
  proved the selected `featureScope.mode: "steel_thread"` carrier was present at
  `derive_aggregate_domain_model_surface`, but the first aggregate attempt was
  still rejected for scoped status spelling. That archive is evidence for this
  clarification, not T-122 closure proof.

This does not close T-122. Remaining closure still requires fresh live
data_mapper evidence carrying `featureScope` and `traversalStrategyDecision`
through the corrected identity and status assurance path.

## Superseded Closure Note - 2026-05-06

Closed under STDO.

Current proof:

- `test_t122_feature_scope_closure.test.mjs` passed in the focused bundle and
  full semantic suite.
- `npm run test:semantic` passed: 216/216.
- `npm run test:sandbox` passed: 15/15.
- Live installed proof
  `ODD_SDLC_TS_T115_DATA_MAPPER_LIVE=1 npm run test:t115:data-mapper-repair-live`
  passed and archived a full data_mapper traversal through aggregate design,
  component, test execution, failure attribution, and repair schedule edges.
- The live T-109 PTY workspace advanced past out-of-scope design breadth and
  now blocks only at release-depth parity.

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
  readonly mode: "steel_thread" | "targeted_repair" | "full_breadth";
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

`targeted_repair` was added by the T-123 traversal strategy correction. T-122
owns the shared feature-scope carrier semantics; T-123 owns strategy selection
and the conditions under which targeted repair is selected.

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

## Test69 Admission Bug Link

The test69 run proved that scoped pressure reaches later design edges, but it
also exposed that scoped design-depth output can be useful while still
ambiguous or relational. B-084 owns the ingest-side correction: normalize safe
ambiguous candidates, admit partial design-depth carriers, and force missing
detail later instead of rejecting the first unexpected field.

T-122 depends on B-084 for live closure because feature scope can only be
evaluated lawfully when design-depth candidates survive ingest long enough to
be classified against the selected scope.

## 2026-05-06 Focused Verification

Passed from `build_tenants/typescript`:

```bash
npm run build:semantic
node --test test_env/tests/test_t122_feature_scope_closure.test.mjs
```

Observed proof:
- `build:semantic` passed.
- `test_t122_feature_scope_closure.test.mjs` passed: 8 tests.

Status: deterministic proof refreshed. Live data_mapper steel-thread proof
remains outstanding for full closure.

## 2026-05-07 Deterministic Proof Refresh

Reconciled the feature-scope carrier with T-123 strategy authority and B-084
design-depth admission:

- steel-thread and targeted-repair scope no longer silently selects the first
  declared module when refs do not bind a module;
- unbound scoped refs fall back to non-narrowing full breadth;
- generic worker-authored design-completeness verdicts remain blocking in
  steel-thread scope;
- deferred-scope verdicts remain non-blocking only when reason scope is
  explicitly deferred;
- full-breadth behavior still evaluates all declared modules.

Verification:

- `npm run build:semantic`
- focused T-122/B-084 suite:
  `node --test test_env/tests/test_t122_feature_scope_closure.test.mjs`
  -> 19/19 passed
- combined focused suite:
  `node --test test_env/tests/test_t058_spec_method_entrypoint.test.mjs test_env/tests/test_t120_retry_local_repair_prompt.test.mjs test_env/tests/test_t122_feature_scope_closure.test.mjs test_env/tests/test_t123_per_edge_traversal_strategy.test.mjs test_env/tests/test_t115_component_execution_failure_repair_flow.test.mjs test_env/tests/test_t064_installed_operator_ux.test.mjs`
  -> 57/57 passed
- `npm run test:semantic` -> 239/239 passed
- `npm run test:sandbox` -> 15/15 passed

Status: deterministic and sandbox proof refreshed. Live data_mapper
steel-thread proof remains outstanding for full closure.
