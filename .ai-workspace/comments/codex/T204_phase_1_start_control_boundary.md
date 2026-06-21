# T-204 Phase 1 Start/Control Boundary Audit

Date: 2026-06-22

Entry baseline: Phase 0 audit at
`.ai-workspace/comments/codex/T204_phase_0_baseline_inventory.md`.

## Claim

Phase 1 removed the remaining local start-status projection from the SDLC
runtime-binding path. `odd_sdlc` now projects a product runtime-binding
contract for ABG consumption; it no longer labels that projection as a local
start outcome, transition, dispatch, advancement, or convergence.

## Changed Surfaces

| Surface | Change | Result |
| --- | --- | --- |
| `code/src/start/public_start.ts` | Deleted local `deriveAdvancementTransition(...)` call, `statusFromTransition(...)`, `transition` output, and `emittedRuntimeEventKinds` from the start projection. | No SDLC-local transition/status truth is emitted by the binding projection. |
| `code/src/start/public_start.ts` | Renamed `publicStartOnce(...)` to `projectSdlcRuntimeBindingContract(...)`. | The exported symbol no longer presents itself as a public start/control API. |
| `code/src/start/public_start.ts` | Replaced `SdlcPublicStartOutcome` with `SdlcRuntimeBindingContractProjection`. | The carrier now expresses only contract projection or projection blocker. |
| `code/src/operator/abg_runtime_binding.ts` | Uses `projectSdlcRuntimeBindingContract(...)` before creating ABG plugin callbacks. | Runtime command/control still enters through ABG CLI; SDLC supplies product contract context. |
| `code/src/operator/installed_operator.ts` | Re-typed plugin-session input from `SdlcPublicStartOutcome` to `SdlcRuntimeBindingContractProjection`. | Installed plugin session no longer consumes a local start outcome shape. |
| Focused tests | Replaced old local `dispatch_required` / transition assertions with contract-projection assertions. | Dispatch/convergence proof remains ABG-owned. |
| `test_t047_pre_refactor_sandbox` | Added complete conformance profile input instead of relying on a partial fixture object. | Fixture now exercises the product admission shape used by the source API. |

## Deliberate Retention

`code/src/start/public_start.ts` still exists. Its current accepted role is
temporary: SDLC domain start-contract projection.

Surviving domain responsibilities in that file are:

- target interpretation from graph function, asset, overlay, or next target;
- SDLC overlay binding;
- ticket execution contract binding;
- construction intent projection;
- worker attachment contract normalization;
- runtime traversal selection carriage into ABG `StartIntent`.

Rejected responsibilities removed in this phase:

- deriving an ABG advancement transition locally;
- projecting local start status such as `dispatch_required`, `advanced`, or
  `converged`;
- carrying local emitted runtime event kinds for start;
- exposing `publicStartOnce(...)` as a start-like API.

The next closure step for this file is to either move the generic ABG
`ExecutionBasis` construction into an ABG-provided plugin factory context or
rename/split the file into an explicit `runtime_binding_contract` product
module. It must not regress into a command or control loop.

## Remaining Phase 1 Debt

No `executeInstalledOperatorStart` implementation or export remains under
active source. No `publicStartOnce` implementation remains under active source.

Remaining adjacent debt moves to later phases:

- `operator/installed_operator.ts` still writes traversal consequence archives
  and owns consequence plugin state. That is Phase 3.
- `operator/event_store.ts` still owns SDLC runtime event storage. That is
  Phase 2.
- `workspace_api/entry.ts` still reads raw operator-run archives as a gaps read
  model. That is Phase 4.
- `start/public_start.ts` still constructs an `ExecutionBasis` from ABG
  admission APIs because ABG's runtime binding plugin factory does not yet
  pass the admitted basis into `createPlugins(...)`. That is tracked as an ABG
  interface consolidation candidate, not accepted SDLC control authority.

## Validation

Passed:

```text
npm run build:semantic
node --test \
  test_env/tests/test_t033_public_start.test.mjs \
  test_env/tests/test_t038_rc_qualification.test.mjs \
  test_env/tests/test_t197_product_gtl_gate.test.mjs \
  test_env/tests/test_t140_no_local_forced_iteration_authority.test.mjs \
  test_env/tests/test_t203_runtime_start_steel_thread.test.mjs \
  test_env/sandbox/test_t047_pre_refactor_sandbox.test.mjs
```

Focused test result: `68/68` passed.

## Completion Verdict

Phase 1 is complete for the local start/control boundary.

The remaining start-contract code is still too large and badly named, but the
runtime transition truth it previously projected has been removed. Further
shrinking belongs to the ABG interface and register/archive phases, not to a
compatibility restoration of local start behavior.
