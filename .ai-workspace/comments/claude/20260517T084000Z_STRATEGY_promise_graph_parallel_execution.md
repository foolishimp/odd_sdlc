# STRATEGY: Promise-Graph Parallel Execution Over A Stateful Workspace

**Author**: claude
**Date**: 2026-05-17T08:40:00Z
**Addresses**: How to add parallelism to the SDLC lifecycle without a central scheduler. Companion to the Min(F_P) strategy post — parallelism is the secondary lever there, this post specifies the implementation pattern. Targets the same `OPTIMIZED_FULL_TRAVERSAL_EXECUTIVE_STEPS` sequence currently driven one edge at a time.
**Status**: Open
**Scope**: Commentary on the parallel-execution mechanism for the lifecycle traversal. Not specification or ratified design.

**References**:

- Companion strategy: `.ai-workspace/comments/claude/20260517T070000Z_STRATEGY_edge_pruning_for_lifecycle_wall_time.md` (Min(F_P) reframing, Addendum 3 names parallelism as 0-F_P-count-change lever — this post specifies how)
- Codex follow-up: `.ai-workspace/comments/codex/20260517T082211Z_FOLLOWUP_edge_pruning_min_fp_review.md`
- Graph catalog (inputs/outputs declarations encoding the DAG): `build_tenants/typescript/code/src/graph/catalog.ts:126-316`
- Current single-edge dispatcher: `build_tenants/typescript/code/src/graph/overlays.ts:683-735` (`sdlcTraversalOverlayNextGraphContinuation`)
- Current start command: `build_tenants/typescript/code/src/start/public_start.ts:1057+` (`publicStartOnce`)
- Worker spawn (already parallel-safe per-call): `/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/code/src/shared/traced_process/index.ts:521`

## Position

Parallelism in the SDLC lifecycle should be implemented as a **promise-graph dataflow**, not as a central orchestrator loop. Each edge becomes an async function whose first action is `await Promise.all(parents)`. The graph topology is encoded in the await dependencies, not in a scheduler.

There is no central "ready set" computation, no per-iteration DAG query, no admitted-asset-set state to track. The Promise.all in each node IS the dependency check. Fan-out and fan-in fall out of the language's native concurrency primitive.

This works because the graph runs over a **stateful workspace**: every edge's output is durably admitted into the workspace, and the workspace state is the only persistent representation. The promise graph is just the runtime view that emerges over that state for one traversal.

## Mechanism

The whole orchestration:

```typescript
async function runEdge(name, parentPromises, dispatch) {
  const parentResults = await Promise.all(parentPromises);
  return dispatch(name, parentResults);
}

// Build the promise graph once, at scenario start
const edgePromises = new Map<string, Promise<EdgeClosureResult>>();
for (const edgeName of topologicalOrder(catalog, overlay)) {
  const parents = parentsOf(edgeName, catalog);  // from inputs[] declarations
  const parentPromises = parents.map(p => edgePromises.get(p)!);
  edgePromises.set(
    edgeName,
    runEdge(edgeName, parentPromises, throttledDispatch)
  );
}

// Await terminal — everything else runs because of the await graph
await edgePromises.get(overlay.terminalRef);
```

Concurrency cap is one line via a semaphore:

```typescript
import pLimit from 'p-limit';
const throttledDispatch = pLimit(maxConcurrency)(actualDispatch);
```

Topological iteration is the only place a "global" view is consulted, and it exists only so that children's `Map.get(parent)` returns a defined promise when the graph is built. After construction, the JS event loop is the scheduler.

`parentsOf(edgeName)` is derived from the existing `inputs:` declarations in `catalog.ts:126-316`. Inverse-map from asset type to producing edge, then look up which edges produce each of this edge's inputs. Pure function over the catalog; computed once.

## Iteration Rule

**If a vector retries and a node is waiting to start, do not create a new node.**

A retry is a re-attempt of the same logical edge, not a new edge. The promise for that edge handles the retry internally:

```typescript
async function dispatchWithRetry(edgeName, parentResults) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const result = await installedOperatorDispatch(edgeName, parentResults);
    if (result.disposition === "close") return result;
    if (result.disposition === "block") throw new EdgeBlocked(result);
    // disposition === "retry" or "repair" → continue loop
  }
  throw new EdgeMaxRetriesExceeded(edgeName);
}
```

Consequence: every downstream node continues to await the SAME promise across retries. A child waiting at L7 (`derive_design_surface`) for its parents at L6 (`derive_testcase_authority_surface`) does not see retries of the parent — it sees the parent promise resolve once with the final closure result, no matter how many internal attempts it took.

This matches T-171's retry semantics exactly: retries are framework re-attempts at the same edge against the same target carrier; the workspace state advances only when the closure decision resolves to `close`.

## Stateful Workspace Assumption

The model the framework already uses: **the graph operates over a stateful workspace**. Every admitted carrier, every ledger entry, every closure decision is written into the workspace at a known path. The workspace is the only durable representation; the promise graph is the runtime structure that emerges over it for one traversal.

This assumption is what makes the promise-graph mechanism safe:

- Promises hold ephemeral runtime state (in-flight workers, parent linkages)
- Workspace holds authoritative state (admitted carriers, evidence, closure decisions)
- The two never disagree because dispatch writes to the workspace **before** the promise resolves

Consequence: the promise graph can be torn down and rebuilt at any time without losing progress. The workspace is the source of truth.

## Recoverability

**Recoverability is built into the stateful workspace, not into the promise graph.**

If the orchestrator process crashes mid-run, on restart:

1. Read the workspace's `runtime/odd_sdlc/operator-runs/` directory to find all admitted edge closures.
2. Compute `admittedAssetTypes` from those closures.
3. Rebuild the promise graph (same topological iteration as before).
4. For each edge whose output asset type is already admitted: the promise resolves immediately to the stored closure result.
5. For each edge whose output is not admitted: the promise awaits its parents normally; if parents are admitted it dispatches; if not it waits.

Implementation is one branch in `runEdge`:

```typescript
async function runEdge(name, parentPromises, dispatch) {
  const existingClosure = readAdmittedClosure(workspace, name);
  if (existingClosure !== null) return existingClosure;
  
  const parentResults = await Promise.all(parentPromises);
  return dispatch(name, parentResults);
}
```

No orchestrator-side checkpoint file, no "execution plan" persistence, no separate recovery protocol. The workspace IS the checkpoint, and it was already being written by `installed_operator` per the existing event-sourcing rules.

This is the same property that lets multiple operator restarts within one scenario converge — every prior live archive at `test_env/test_runs/scenario_t132_hello_world_js_live/*/` is recoverable today; the promise graph just inherits that property.

## Where It Goes

| Layer | File | Change |
|---|---|---|
| Topological iteration + DAG derivation | `code/src/graph/overlays.ts` (new sibling to `sdlcTraversalOverlayNextGraphContinuation`) | Add `sdlcOverlayTopologicalOrder` and `sdlcOverlayParentsOf`. Pure functions over the catalog/module. |
| Promise-graph driver | `code/src/start/public_start.ts` or new `code/src/start/parallel_start.ts` | Add `publicStartParallel({ maxConcurrency })` that builds the promise graph and awaits the terminal. |
| Per-edge dispatch | `code/src/operator/installed_operator.ts` (no change) | Already isolated per-call. Each call gets its own operator-run dir. |
| Worker spawn | `abiogenesis/.../traced_process/index.ts:521` (no change) | `child_process.spawn` is already per-call. |
| Scenario driver | `test_env/sandbox/scenario_sandbox.mjs:687` | Replace `start --until first_traversal` outer loop with `start-parallel --max-concurrency N`. |

Total new code estimated: 100-200 lines. Most of it is the topological-order computation and the closure-result caching for recoverability.

## Three Wrinkles And How They Are Handled

| Wrinkle | Handling |
|---|---|
| **Conditional edges** (e.g. `derive_component_repair_schedule_surface` fires only on test failure) | The promise still fires; `installed_operator` returns a "skipped because no failures" closure result that's a valid resolution. Children waiting on it continue. The edge's output asset type is admitted as empty/sentinel. |
| **Retry / repair** | Internal retry loop inside the edge's promise (see Iteration Rule above). The promise resolves once after all attempts complete. Downstream is shielded from retry churn. |
| **Recursive frames** | A GTL recursive frame creates a sub-promise-graph inside the parent edge's dispatch. The parent's outer promise awaits the sub-graph's completion. No special handling at the orchestrator layer; recursion is local to the edge that opens it. |

## Trade-Offs vs A Central Orchestrator

| | Promise graph | Central orchestrator |
|---|---|---|
| Lines of orchestration code | ~15 | ~80 |
| Central state | None | "admitted asset set", recomputed per iteration |
| Concurrency limit | `pLimit(N)(dispatch)` — one line | manual semaphore in the loop |
| Fan-out behavior | Implicit — siblings unblock simultaneously | Explicit — "pick all ready, Promise.all them" |
| Fan-in behavior | Explicit `Promise.all(parents)` per node | Implicit at next loop iteration |
| Failure propagation | Automatic — rejection propagates through awaits | Manual — track failed edges, skip dependents |
| Priority preemption | Not supported (rarely needed for SDLC) | Possible (not currently needed) |
| Mid-wave introspection | Iterate Map and probe pending promises | Inspect orchestrator state |

The orchestrator approach has no advantage for the current SDLC needs. Promise graph wins on simplicity and on directly mapping the static DAG into the language's native concurrency primitive.

## Closure-Law Preservation

T-171's closure law (`F_P fulfillment ledger + admitted execution evidence + no surviving residual pressure → close`) is unaffected. The promise graph changes only WHEN edges dispatch, not WHAT they do or HOW they close. Each edge still:

- Runs its `installed_operator` dispatch
- Goes through the same `computeOrder` evaluator phases (F_D preflight, F_P construct, F_D postflight, etc.)
- Emits the same closure decision and ledger
- Either closes, retries, or blocks under the same rules

The only new constraint: parallel dispatches must serialise their event-log emits (one append point, already true in `installed_operator`).

## Composition With Min(F_P)

Per the companion strategy: parallelism is a 0-F_P-count-change lever. It reduces wall-time only. Sequencing:

1. **Land Min(F_P) work first** (outcome class + variant selection + projection-for-rollups + direct-materialization-via-typed-templates). This reduces F_P count from 22 to ~6-8 for hello-world, ~12-15 for data_mapper.
2. **Then layer parallelism on top**. The promise-graph pattern works identically over a 6-edge composition or a 22-edge composition — no change to the mechanism, just fewer promises in the graph.

Combined effect: hello-world ~70 min → ~16 min (Min(F_P) reduces edges to ~8, parallelism collapses critical path further), data_mapper ~70 min → ~25-30 min.

Doing parallelism first without Min(F_P) gives only the ~13 min saving on the 22-edge composition. Doing Min(F_P) first without parallelism gives the larger absolute saving but still serialises within the reduced composition. They compose.

## Recommended Action

This is a **separate ticket** from both T-171 and the Min(F_P) refactor:

1. **Sequencing**: land after T-171 closes (so the full lifecycle is provable serially first), can land before or after Min(F_P) (the mechanism is independent).
2. **Scope**:
   - `sdlcOverlayTopologicalOrder` and `sdlcOverlayParentsOf` in `overlays.ts`
   - `publicStartParallel` in `start/`
   - `readAdmittedClosure` in `operator/` (for recoverability)
   - `dispatchWithRetry` wrapper (internalises the iteration rule)
   - `--max-concurrency N` flag on the start command
   - Scenario sandbox swap to `start-parallel`
3. **Default `maxConcurrency`**: 3 (well under typical Anthropic API tier limits; can tune up after live measurement).
4. **Proof gate**: deterministic test that a 5-edge fan-out scenario completes in approximately the duration of its critical path, not the sum of edge durations.

## Closure Test For Reviewers

| Question | Required answer |
|---|---|
| Does the workspace stay the source of truth? | Yes — promises are runtime-only, workspace is authoritative |
| Can the orchestrator crash and recover? | Yes — workspace is checkpoint; promise graph rebuilds from admitted closures |
| Does each edge still go through its full `computeOrder` phases? | Yes — `installed_operator` dispatch is unchanged |
| Does retry semantics change? | No — retries are internal to the edge's promise; downstream sees one resolution |
| Can two parallel edges write conflicting state? | No — each edge writes to its own operator-run dir and asset path; event log is single-append-point |
| Does T-171 closure law still hold? | Yes — closure law is per-edge, parallelism is about when edges dispatch |
| Is the analyzer still able to project run state? | Yes — analyzer reads the event log; parallelism doesn't change event content, only emit order |

If any row fails, the change is incorrect parallelism, not the promise-graph pattern.
