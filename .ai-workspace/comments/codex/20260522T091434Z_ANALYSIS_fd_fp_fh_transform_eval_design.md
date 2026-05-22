# FD/FP/FH Transform/Eval Boundary Analysis

Status: commentary, not ratified specification.
Author: Codex
Date: 2026-05-22

## Claim

The current TypeScript installed-operator design does not cleanly implement the
intended regime model:

```text
A -> F_{D|P|H}.transform -> B -> F_{D|P|H}.eval -> actions
```

It currently implements this shape:

```text
A
-> F_P.transform
-> B
-> F_D admit/report/postflight/measure/route
-> artifact labeled F_P.evaluate
-> actions
```

The behavior mostly preserves the important boundary that the probabilistic
worker does not evaluate itself. The semantic defect is that deterministic
framework admission is named as `F_P.evaluate`.

## Regime Convention

The governing convention is:

```text
F_D = deterministic functor
F_P = probabilistic functor
F_H = human functor
```

That category applies to both transforms and evals.

Therefore:

```text
F_D.transform = deterministic transform
F_P.transform = probabilistic transform
F_H.transform = human transform

F_D.eval = deterministic evaluation
F_P.eval = probabilistic evaluation
F_H.eval = human evaluation
```

An eval is not automatically deterministic. An eval can be deterministic,
probabilistic, or human, and the selected regime must be explicit.

## Current Runtime Flow

The current installed-operator post-transform path starts around:

- `build_tenants/typescript/code/src/operator/installed_operator.ts`
- `completeReportDispatch(...)`
- `buildPostTransformWorkerResultReport(...)`
- `evaluateWorkerResultPostflight(...)`
- `writeFpEvaluateResult(...)`
- `deriveSdlcOperatorAssuranceGate(...)`
- `constructorResultFromWorkerOutput(...)`
- `runSdlcHookTurn(...)`
- `publishDispatchState(...)`

Current flow:

```text
ABG selects graph edge
-> odd_sdlc prepares worker handoff
-> F_P.transform runs through external worker
-> F_D observes worker output
-> F_D builds worker_result_report
-> F_D runs postflight
-> F_D writes fp_evaluate_result.json
-> F_D derives assurance ledgers
-> F_D runs constructor/hook admission
-> F_D derives edge gain, residual pressure, closure, next action
```

The problem carrier is constructed in:

```text
build_tenants/typescript/code/src/operator/handoff.ts
constructFpEvaluateResult(...)
```

It writes:

```ts
stage: "F_P.evaluate"
stageAuthority: "typed_fp_stage_carriers"
```

That is wrong under the regime convention if no probabilistic evaluator ran.
The artifact is deterministic framework admission/evaluation over an
`F_P.transform` result.

## Current Responsibility Split

Current `F_P`:

```text
- external worker/process actor
- probabilistic construction
- writes target artifact, product files, and execution evidence where required
- does not own postflight
- does not own assurance ledgers
- does not own closure
- does not own next action
```

Current `F_D`:

```text
- derives handoff
- observes file delta
- builds worker_result_report
- admits output artifact
- checks postflight
- writes fp_evaluate_result.json
- derives assurance ledgers
- measures edge gain
- decides close/retry/block
- projects next action
```

Current `F_H`:

```text
- appears as escalation/human-governed route
- is not represented as a first-class eval regime in this stage model
```

## Current Post-Transform Pseudocode

```ts
F_D.prepare_dispatch(edge) {
  contract = hookContractByEdgeName(edge)
  manifest = deriveWorkerHandoffManifest(contract, traversal_context)
  before = snapshotProductMaterializationRoot(manifest.productMaterialization)

  writeHandoffFiles(manifest)
  // handoff_manifest.json
  // worker_prompt.md
  // worker_construction_brief.json
}

F_P.transform(manifest, prompt) {
  // External probabilistic worker.
  // May write:
  // - declared target output artifact
  // - product files under allowed roots
  // - execution evidence if requested
  //
  // Must not write:
  // - postflight
  // - ledgers
  // - closure decisions
  // - runtime events
  // - evaluator projections
}

F_D.observe_and_admit_transform() {
  report = buildPostTransformWorkerResultReport(manifest, before)
  write worker_result_report.json

  fpTransformResult = writeWorkerFpTransformResult(manifest, report)
  write fp_transform_result.json when ABG supplied an fpTransformRequest

  writeProductMaterializationManifest(manifest, report)
  write product_materialization_manifest.json
}

F_D.postflight(report) {
  postflight = evaluateWorkerResultPostflight(manifest, report)
  write postflight.json

  if (postflight.status == "blocked") {
    writeFpEvaluateResult(status = "blocked")
    gapDossier = constructPostflightGapDossier(postflight)
    write gap_dossier.json

    state = postflight_failed
    consequence = publishDispatchState(state)
    return next_action_or_gap(consequence)
  }

  writeFpEvaluateResult(status = "passed" | "admitted_with_open_obligations")
  continue
}
```

This is not `F_P.eval`. It is `F_D.eval` or `F_D.admit/eval`, despite the
artifact label.

## Current Ledgers And Read Surfaces

Post-transform `F_D` reads:

```text
- handoff manifest
- worker output artifact
- materialized product-file delta
- product materialization contract
- product materialization replay where present
- traversal obligation context
- staged construction authority
- implementation/test design registers
- decomposition summaries
- module/test dependency maps
- dependency traversal selections
- execution evidence
- worker obligation assessments
```

Post-transform `F_D` writes:

```text
- worker_result_report.json
- fp_transform_result.json when request exists
- product_materialization_manifest.json
- postflight.json
- fp_evaluate_result.json
- gap_dossier.json when blocked
- assurance_ledgers.json
- assurance_satisfaction.json
- assurance_postflight.json when assurance blocks
- constructor_result.json
- hook_outcome.json
- hook_postflight.json when hook blocks
- sdlc_construction_intent.json
- sdlc_worksite_evidence.json
- sdlc_edge_gain.json
- sdlc_edge_residual_pressure.json
- sdlc_edge_fulfillment_ledger.json
- sdlc_edge_closure_decision.json
- sdlc_overlay_segment_completion.json when applicable
- sdlc_overlay_binding_post_action.json
- sdlc_next_action_projection.json
```

Assurance ledgers currently include ledgers such as:

```text
- materialization_assurance_ledger
- semantic_convergence_assurance_ledger
- obligation_carry_assurance_ledger
- requirement_fulfillment_assurance_ledger
- ambiguity_assurance_ledger
- capability_assurance_ledger
- shallow_realization_assurance_ledger
- component/design depth ledgers where applicable
```

Edge closure expects required ledger input kinds from the edge gain/closure
contract. The common required input kinds are:

```text
- sdlc_edge_fulfillment_ledger
- sdlc_edge_closure_decision
- sdlc_next_action_projection
```

Those are framework-owned deterministic ledgers. The probabilistic worker must
not generate them.

## Proposed Design

The proposed model should make the selected transform and eval regime explicit:

```text
A
-> F_{D|P|H}.transform
-> B
-> F_{D|P|H}.eval
-> actions
```

Valid examples:

```text
A -> F_D.transform -> B -> F_D.eval -> actions
A -> F_P.transform -> B -> F_D.eval -> actions
A -> F_P.transform -> B -> F_P.eval -> actions
A -> F_P.transform -> B -> F_H.eval -> actions
A -> F_H.transform -> B -> F_D.eval -> actions
```

The current generic SDLC worker lane should be named as:

```text
A -> F_P.transform -> B -> F_D.eval -> actions
```

not:

```text
A -> F_P.transform -> B -> F_P.evaluate -> actions
```

## Proposed Carrier Shape

The stage carrier should make both regimes explicit:

```ts
type FunctionRegime = "F_D" | "F_P" | "F_H";

interface SdlcStageExecution {
  transform: {
    regime: FunctionRegime;
    functionRef: string;
    requestRef: string | null;
    resultRef: string | null;
    actorRef: string | null;
  };

  eval: {
    regime: FunctionRegime;
    functionRef: string;
    requestRef: string | null;
    resultRef: string | null;
    actorRef: string | null;
  };

  transition: {
    inputAssetRef: string;
    outputAssetRef: string;
    admittedEvidenceRefs: string[];
    actionProjectionRef: string;
  };
}
```

Current post-transform truth would then be represented as:

```json
{
  "kind": "sdlc_stage_execution",
  "transform": {
    "regime": "F_P",
    "functionRef": "function://odd-sdlc/derive_component_code_surface/transform",
    "resultRef": "file://.../fp_transform_result.json"
  },
  "eval": {
    "regime": "F_D",
    "functionRef": "function://odd-sdlc/postflight/eval",
    "resultRef": "file://.../fd_eval_result.json"
  }
}
```

## Proposed Flow

```ts
selected = selectStagePlan(edge)

transformResult = runTransform({
  regime: selected.transform.regime,
  input: A,
  manifest
})

candidate = admitTransformBoundary(transformResult)

evalResult = runEval({
  regime: selected.eval.regime,
  input: candidate,
  manifest,
  ledgers,
  contracts
})

actions = deriveActions({
  evalResult,
  edgeContract,
  residualPressure,
  closurePolicy
})
```

For the current normal worker path:

```ts
runTransform(F_P) {
  invoke probabilistic worker
  return candidate artifact refs
}

runEval(F_D) {
  deterministically admit report
  deterministically check postflight
  deterministically derive assurance ledgers
  deterministically measure gain
  deterministically close/retry/block
}
```

For a probabilistic eval lane:

```ts
runEval(F_P) {
  invoke evaluator worker/model
  produce probabilistic evaluation artifact
  F_D still admits that evaluation artifact structurally
  F_D routes only from admitted eval truth
}
```

For human eval:

```ts
runEval(F_H) {
  request human judgment
  admit human decision carrier
  route from admitted human eval
}
```

## Required Design Law

The generic law should be:

```text
No transform regime writes eval truth for itself.
Every eval result declares its own regime.
F_D may admit any eval result structurally.
F_D may itself be the eval regime.
Closure consumes admitted eval truth, not worker prose or raw output.
```

## Migration Implication

The current `fp_evaluate_result.json` should be renamed, demoted, or wrapped by
a new regime-explicit carrier. It is not `F_P.evaluate` when no probabilistic
evaluator ran.

Possible replacement names:

```text
fd_transform_admission_result.json
fd_postflight_eval_result.json
sdlc_stage_eval_result.json
```

The hard requirement is not the filename. The hard requirement is that the
carrier truth says:

```text
transformRegime = F_P
evalRegime = F_D
```

for the current default worker path.

## Closure Note

This post is analysis and design commentary. It should become a ticket or
ratified design change before implementation. The key implementation target is
to replace the ambiguous `stage: "F_P.evaluate"` convention with an explicit
transform/eval regime model.
