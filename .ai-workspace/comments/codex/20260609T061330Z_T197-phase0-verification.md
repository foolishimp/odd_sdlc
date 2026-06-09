# T-197 Phase 0 Verification

Author: codex
Date: 2026-06-09T06:13:30Z
Ticket: `.ai-workspace/tickets/active/T-197-reconcile-product-boundary-and-remove-authority-leakage.md`

## Summary

Phase 0 is complete for W-006/W-007. The verified result is narrower than the
original high-severity ranking:

- A2 is a real installed multi-attempt loop, but it is a boundary-tension row,
  not a safe immediate deletion target.
- A3 is a local caller over ABG `runEventedNativeSagaFrontier(...)`, not a
  proven rival scheduler by itself.
- A5 is the real closure-boundary design lock: SDLC currently constructs product
  edge gain, residual pressure, ledger, closure decision, next-action projection,
  admitted-state ref, and consequence projection in one chain.
- H3 is currently reachable as a B-068 probe/sandbox surface, not an active
  public-start/operator default gate.
- T-197 P2 data-mapper breadth proof is deferred to T-198; it is not part of
  T-197's closure law unless T-197 is later repriced.

## A2

Surface:
`build_tenants/typescript/code/src/operator/installed_operator.ts:10170`

Evidence:

- The loop chooses attempt budget from `sdlcOperatorRuntimePolicy()`:
  `installedConvergenceAttemptLimit` for `requestedUntil === "converged"`, else
  `installedYieldReentryAttemptLimit` at lines 10195-10199.
- Each iteration re-runs `executeInstalledOperatorStart(...)` at lines
  10205-10218.
- It evaluates closure disposition and re-entry blocker counts at lines
  10238-10280.
- It derives retry context at lines 10286-10292 and refreshes replay/start state
  via the supplied callback at lines 10293-10296.

Disposition:

Verified boundary tension. Treat as installed UX over admitted ABG turns only if
the Phase 1 design lock proves that ownership. Do not delete or reframe it until
A5 names the closure/fold/transition boundary.

## A3

Surface:
`build_tenants/typescript/code/src/operator/installed_operator.ts:2813`

Evidence:

- SDLC compiles declarations, branch rows, fan-in rows, policy, and task payloads
  locally, then calls `runEventedNativeSagaFrontier(...)` at lines 2813-2846.
- The artifact explicitly records `executionAuthority:
  "abg_evented_saga_frontier"`, `parallelismControl:
  "abg_branch_execution_policy"`, and `graphTruthSource:
  "sdlc_feature_dependency_dag"` at lines 2851-2854.

Disposition:

Verified owner-boundary tension, not a settled rival scheduler finding. Phase 1
must either move live parallel dispatch behind an ABG-owned entry or ratify SDLC
as a thin caller over an ABG frontier primitive while keeping DAG compilation
projection-only.

## A5

Surfaces:

- `build_tenants/typescript/code/src/operator/installed_operator.ts:7936`
- `build_tenants/typescript/code/src/operator/traversal_consequence.ts:751`
- `build_tenants/typescript/code/src/operator/traversal_consequence.ts:991`

Evidence:

- `installed_operator.ts` constructs edge obligations/evidence admission,
  edge gain, residual pressure, assurance close decision, edge fulfillment
  ledger, closure state transition, edge closure decision, next-action
  projection, admitted-state ref, and consequence projection at lines 7936-8289.
- `constructSdlcEdgeFulfillmentLedger(...)` validates/counts target carrier
  admission, evidence bundles, convergence, and predecessor refs at
  `traversal_consequence.ts` lines 751-989.
- `deriveSdlcEdgeClosureDecision(...)` validates edge-assurance drift and
  derives disposition from ledger, close decision, retry/repair/re-enter/reprice
  refs, yield basis, and policy at lines 991-1235.

Disposition:

Verified boundary tension. SDLC product meaning candidates/read models are real,
but final closure authority must be split from ABG admission/fold/transition
before any A-row deletion.

## H3

Surfaces:

- `build_tenants/typescript/code/src/qualification/enterprise_core_inventory.ts:5`
- `build_tenants/typescript/code/src/qualification/enterprise_core_iteration_sandbox.ts:226`
- `build_tenants/typescript/code/src/qualification/enterprise_core_iteration_sandbox.ts:467`

Evidence:

- `ENTERPRISE_CORE_COMPONENTS` and `ENTERPRISE_CORE_CAPABILITY_INVENTORY` encode
  CDME names in source at `enterprise_core_inventory.ts` lines 5-108.
- The active `code/src` consumer is the B-068 enterprise-core iteration sandbox.
  It labels the graph function as `odd_outcome_iteration_probe` at
  `enterprise_core_iteration_sandbox.ts` lines 286-288.
- The evaluator plugin calls `evaluateEnterpriseCoreInventory(...)` at lines
  467-474.
- Grep found test consumption through `test_env/sandbox/test_b068_*`; no
  active public-start/operator live default gate caller was found in `code/src`.

Disposition:

Downgrade from live/default high severity to medium probe-only current
reachability. Remediation should contain or relocate it as a B-068 fixture and
guard against production default-gate reachability.

## P2

T-197 closure law names the lite installed proof lane with graph-owned
`sdlc_worker_execution_evidence`, not a broad data_mapper live lane. P2 is
deferred to `.ai-workspace/tickets/backlog/T-198-prove-data-mapper-breadth-live-after-t197-boundary-cleanup.md`.

This keeps T-197 focused on boundary cleanup while preserving the data_mapper
breadth proof as an explicit successor, not orphaned debt.
