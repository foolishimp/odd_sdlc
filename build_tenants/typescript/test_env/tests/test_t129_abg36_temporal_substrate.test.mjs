// Validates: T-129
// Validates: ABG-3.6-temporal-runtime-substrate

import test from "node:test";
import assert from "node:assert/strict";

import {
  TEMPORAL_CONSTRAINT_CONFIG_KEY_VALUES,
  TEMPORAL_CONSTRAINT_VECTOR_ATTR_KEYS,
  admitExecutionBasis,
  admitModule,
  admitNode,
  admitResolvedPolicyIdentity,
  admitResolvedRuntimeIdentity,
  assertRuntimeEvent,
  constructDeadlineBreach,
  constructDeadlineBreachAdmittedEvent,
  constructFrameOpenedEvent,
  constructGraphCallOpenedEvent,
  constructScheduledContinuation,
  constructScheduledContinuationReopenedEvent,
  constructTimerIntent,
  constructTimerIntentAdmittedEvent,
  constructTimerOutcome,
  constructTimerOutcomeAdmittedEvent,
  deriveRuntimeAggregateProjection,
  deriveTemporalConstraintFromGtl,
  deriveTemporalHomeostaticProjection,
  deriveTemporalProjection,
  edge,
  graphFunctionForVector,
  temporalProjectionHoldsEligibility,
  tryDeriveTemporalConstraintFromGtl
} from "@abiogenesis/typescript-tenant";

function attrs(entries = []) {
  return Object.freeze({ entries: Object.freeze(entries) });
}

function scalarEntry(key, value) {
  return Object.freeze({
    key,
    value: Object.freeze({
      kind: "scalar",
      value
    })
  });
}

function temporalHookEntry(namespace, overrides = {}) {
  const constraintRef =
    overrides.constraintRef ??
    `temporal-constraint://odd-sdlc/t129/${namespace}/edge0`;
  const schedulePolicyRef =
    overrides.schedulePolicyRef ??
    `schedule-policy://odd-sdlc/t129/${namespace}`;
  const timerProviderRef =
    overrides.timerProviderRef ??
    `timer-provider://odd-sdlc/t129/${namespace}`;
  const entries = [
    scalarEntry("constraint_ref", constraintRef),
    scalarEntry("operator", "not_before"),
    scalarEntry(
      "not_before_ref",
      overrides.notBeforeRef ?? "instant://2026-05-07T00:00:00Z"
    ),
    scalarEntry("schedule_policy_ref", schedulePolicyRef),
    scalarEntry("timer_provider_ref", timerProviderRef),
    scalarEntry(
      "deadline_breach_action",
      overrides.deadlineBreachAction ?? "observe_drift"
    )
  ];
  if (overrides.deadlineRef !== undefined) {
    entries.push(scalarEntry("deadline_ref", overrides.deadlineRef));
  }

  return Object.freeze({
    key: "abg.temporal_constraint",
    value: Object.freeze({
      kind: "hook_ref",
      value: Object.freeze({
        ref: constraintRef,
        config: attrs(entries)
      })
    })
  });
}

function typedNode(id, name, kind, markov) {
  return admitNode({
    id,
    name,
    schema: { kind: "symbolic", ref: `schema://odd_sdlc/t129/${kind}` },
    markov: [markov],
    assetSurface: {
      kind,
      requiredContexts: ["workspace"],
      standardsRefs: [`t129:${kind}:standard`],
      outputContractRefs: [`t129:${kind}:contract`]
    },
    tags: ["t129", "odd_sdlc", kind]
  });
}

function buildOddSdlcAbg36Basis(input) {
  const source = typedNode(
    `node:t129/${input.name}/source`,
    `${input.name}_source`,
    "source",
    "declared"
  );
  const target = typedNode(
    `node:t129/${input.name}/target`,
    `${input.name}_target`,
    "target",
    "eligible"
  );
  const graph = edge([source], target, {
    id: `vector:t129/${input.name}/source-to-target`,
    name: `${input.name}_source_to_target`,
    evaluators: [
      {
        name: `${input.name}_target_ready`,
        regime: "F_P",
        description: "target accepted",
        binding: `binding://odd-sdlc/t129/${input.name}`,
        tags: ["t129", input.name]
      }
    ],
    declarations: input.declarations,
    tags: ["t129", "odd_sdlc", input.name]
  });
  const vector = graph.vectors[0];
  assert.notEqual(vector, undefined);
  const graphFunction = graphFunctionForVector(vector, {
    name: `${input.name}_graph_function`,
    declarations: attrs(),
    tags: ["t129", "odd_sdlc", input.name]
  });
  const module = admitModule({
    name: `${input.name}_module`,
    graphs: [],
    graphFunctions: [graphFunction],
    refinementBoundaries: [],
    candidateFamilies: [],
    jobs: [
      {
        id: `job:t129/${input.name}`,
        name: `${input.name}_job`,
        contracts: [{ kind: "graph_function", targetId: graphFunction.id }],
        roles: [],
        tags: ["t129", "odd_sdlc", input.name]
      }
    ],
    roles: [],
    operators: [],
    evaluators: [],
    rules: [],
    imports: [],
    metadata: attrs()
  });
  const basis = admitExecutionBasis({
    startIntent: {
      scope: {
        kind: "workspace",
        workspaceRoot: `/workspace/odd-sdlc/t129/${input.name}`,
        moduleName: module.name
      },
      target: {
        kind: "graph_function",
        handle: graphFunction.name
      },
      until: "converged"
    },
    module,
    runtimeIdentity: admitResolvedRuntimeIdentity({
      workerId: `worker://odd-sdlc/t129/${input.name}`,
      backendId: "backend://node",
      buildId: "build://odd-sdlc/typescript",
      resolvedRuntimeRef: "runtime://abiogenesis/typescript"
    }),
    resolvedPolicy: admitResolvedPolicyIdentity({
      resolvedPolicyBundleRef: `policy://odd-sdlc/t129/${input.name}`,
      defaultRegime: "F_P",
      dispatchRef: `dispatch://odd-sdlc/t129/${input.name}`,
      approvalSubjectRef: null
    }),
    runId: `run://odd-sdlc/t129/${input.name}`,
    workKey: `wk://odd-sdlc/t129/${input.name}`,
    frameId: null,
    frameLineageId: null
  });
  const publishedVector = basis.graph.vectors[0];
  assert.notEqual(publishedVector, undefined);
  return Object.freeze({ basis, vector: publishedVector });
}

function graphOpenedEvents(basis) {
  return [constructGraphCallOpenedEvent(basis), constructFrameOpenedEvent(basis)];
}

test("T-129 substrate boundary consumes ABG 3.6 temporal GTL syntax and event-calculus eligibility", () => {
  const { basis, vector } = buildOddSdlcAbg36Basis({
    name: "temporal_eligibility",
    declarations: attrs([temporalHookEntry("eligibility")])
  });
  const resolution = deriveTemporalConstraintFromGtl({
    basis,
    vectorIndex: 0,
    vector
  });
  const timerIntent = constructTimerIntent({
    basis,
    constraint: resolution.constraint,
    policy: resolution.policy
  });
  const intentEvent = constructTimerIntentAdmittedEvent({ basis, timerIntent });
  const providerLocalOutcome = constructTimerOutcome({
    timerIntent,
    outcome: "timer_fired",
    providerReceiptRef: "provider-receipt://odd-sdlc/t129/local-only"
  });

  assert.deepEqual(TEMPORAL_CONSTRAINT_VECTOR_ATTR_KEYS, [
    "abg.temporal_constraint"
  ]);
  assert.deepEqual(TEMPORAL_CONSTRAINT_CONFIG_KEY_VALUES, [
    "constraint_ref",
    "operator",
    "not_before_ref",
    "deadline_ref",
    "schedule_policy_ref",
    "timer_provider_ref",
    "deadline_breach_action"
  ]);
  assert.equal(resolution.attrKey, "abg.temporal_constraint");
  assert.equal(resolution.source, "graph_vector");
  assert.equal(providerLocalOutcome.outcome, "timer_fired");
  assert.doesNotThrow(() => assertRuntimeEvent(intentEvent));

  const beforeAdmission = deriveTemporalProjection({
    basis,
    events: [...graphOpenedEvents(basis), intentEvent]
  });
  assert.deepEqual(beforeAdmission.pendingTimerIntentRefs, [
    timerIntent.timerIntentRef
  ]);
  assert.deepEqual(beforeAdmission.eligibleVectorIndexes, []);
  assert.equal(
    beforeAdmission.eventCalculus.holds.some(
      (fluent) => fluent.name === "temporal_timer_pending"
    ),
    true
  );

  const outcomeEvent = constructTimerOutcomeAdmittedEvent({
    basis,
    timerIntent,
    timerOutcome: providerLocalOutcome
  });
  assert.doesNotThrow(() => assertRuntimeEvent(outcomeEvent));
  const events = [...graphOpenedEvents(basis), intentEvent, outcomeEvent];
  const afterAdmission = deriveTemporalProjection({ basis, events });
  const aggregateAfter = deriveRuntimeAggregateProjection(basis, events);

  assert.deepEqual(afterAdmission.pendingTimerIntentRefs, []);
  assert.deepEqual(afterAdmission.eligibleVectorIndexes, [0]);
  assert.equal(
    temporalProjectionHoldsEligibility({
      projection: afterAdmission,
      basis,
      vectorIndex: 0,
      constraintRef: resolution.constraint.constraintRef,
      timerIntentRef: timerIntent.timerIntentRef,
      schedulePolicyRef: resolution.policy.schedulePolicyRef
    }),
    true
  );
  assert.equal(
    afterAdmission.eventCalculus.holds.some(
      (fluent) => fluent.name === "temporal_eligible"
    ),
    true
  );
  assert.deepEqual(aggregateAfter.closedVectorIndexes, []);
  assert.equal(aggregateAfter.nextVectorIndex, 0);
});

test("T-129 substrate boundary rejects provider receipts and non-temporal GTL as temporal authority", () => {
  const temporal = buildOddSdlcAbg36Basis({
    name: "provider_receipt_only",
    declarations: attrs([temporalHookEntry("provider-receipt-only")])
  });
  const resolution = deriveTemporalConstraintFromGtl({
    basis: temporal.basis,
    vectorIndex: 0,
    vector: temporal.vector
  });
  const timerIntent = constructTimerIntent({
    basis: temporal.basis,
    constraint: resolution.constraint,
    policy: resolution.policy
  });
  const providerLocalOutcome = constructTimerOutcome({
    timerIntent,
    outcome: "timer_fired",
    providerReceiptRef: "provider-receipt://odd-sdlc/t129/unadmitted"
  });
  assert.equal(providerLocalOutcome.providerRef, resolution.policy.timerProviderRef);

  const providerOnlyProjection = deriveTemporalProjection({
    basis: temporal.basis,
    events: [
      ...graphOpenedEvents(temporal.basis),
      constructTimerIntentAdmittedEvent({
        basis: temporal.basis,
        timerIntent
      })
    ]
  });
  assert.deepEqual(providerOnlyProjection.eligibleVectorIndexes, []);
  assert.deepEqual(providerOnlyProjection.firedTimerOutcomeRefs, []);

  const nonTemporal = buildOddSdlcAbg36Basis({
    name: "non_temporal",
    declarations: attrs()
  });
  assert.equal(
    tryDeriveTemporalConstraintFromGtl({
      basis: nonTemporal.basis,
      vectorIndex: 0,
      vector: nonTemporal.vector
    }),
    null
  );
  const nonTemporalProjection = deriveTemporalProjection({
    basis: nonTemporal.basis,
    events: graphOpenedEvents(nonTemporal.basis)
  });
  assert.deepEqual(nonTemporalProjection.eligibleVectorIndexes, []);
  assert.deepEqual(nonTemporalProjection.pendingTimerIntentRefs, []);
});

test("T-129 substrate boundary keeps scheduled continuation replay out of local iteration control", () => {
  const { basis, vector } = buildOddSdlcAbg36Basis({
    name: "scheduled_continuation",
    declarations: attrs([temporalHookEntry("scheduled-continuation")])
  });
  const resolution = deriveTemporalConstraintFromGtl({
    basis,
    vectorIndex: 0,
    vector
  });
  const timerIntent = constructTimerIntent({
    basis,
    constraint: resolution.constraint,
    policy: resolution.policy
  });
  const timerOutcome = constructTimerOutcome({
    timerIntent,
    outcome: "timer_fired",
    providerReceiptRef: "provider-receipt://odd-sdlc/t129/scheduled/fired"
  });
  const scheduledContinuation = constructScheduledContinuation({
    basis,
    timerIntent,
    timerOutcome
  });
  const events = [
    ...graphOpenedEvents(basis),
    constructTimerIntentAdmittedEvent({ basis, timerIntent }),
    constructTimerOutcomeAdmittedEvent({
      basis,
      timerIntent,
      timerOutcome
    }),
    constructScheduledContinuationReopenedEvent({
      basis,
      scheduledContinuation
    })
  ];
  assert.doesNotThrow(() => assertRuntimeEvent(events.at(-1)));

  const temporalProjection = deriveTemporalProjection({ basis, events });
  const aggregateProjection = deriveRuntimeAggregateProjection(basis, events);
  const homeostatic = deriveTemporalHomeostaticProjection({
    basis,
    temporalProjection,
    closedVectorIndexes: aggregateProjection.closedVectorIndexes,
    schedulePolicyRef: resolution.policy.schedulePolicyRef,
    schedulePolicy: resolution.policy
  });

  assert.deepEqual(temporalProjection.scheduledContinuationRefs, [
    scheduledContinuation.scheduledContinuationRef
  ]);
  assert.deepEqual(temporalProjection.eligibleVectorIndexes, [0]);
  assert.deepEqual(aggregateProjection.closedVectorIndexes, []);
  assert.equal(aggregateProjection.nextVectorIndex, 0);
  assert.equal(homeostatic.observations[0].reason, "eligible_not_closed");
  assert.equal(homeostatic.observations[0].requiredRegime, "F_H");
});

test("T-129 substrate boundary projects admitted deadline breach F_H pressure without caller-policy rewrite", () => {
  const { basis, vector } = buildOddSdlcAbg36Basis({
    name: "deadline_pressure",
    declarations: attrs([
      temporalHookEntry("deadline-pressure", {
        deadlineRef: "instant://2026-05-07T01:00:00Z",
        deadlineBreachAction: "human_gate"
      })
    ])
  });
  const resolution = deriveTemporalConstraintFromGtl({
    basis,
    vectorIndex: 0,
    vector
  });
  const deadlineBreach = constructDeadlineBreach({
    basis,
    constraint: resolution.constraint,
    policy: resolution.policy,
    providerReceiptRef: "provider-receipt://odd-sdlc/t129/deadline"
  });
  const breachEvent = constructDeadlineBreachAdmittedEvent({
    basis,
    deadlineBreach
  });
  assert.doesNotThrow(() => assertRuntimeEvent(breachEvent));

  const beforeAdmission = deriveTemporalProjection({
    basis,
    events: graphOpenedEvents(basis)
  });
  const temporalProjection = deriveTemporalProjection({
    basis,
    events: [...graphOpenedEvents(basis), breachEvent]
  });
  const aggregateProjection = deriveRuntimeAggregateProjection(basis, [
    ...graphOpenedEvents(basis),
    breachEvent
  ]);
  const callerPolicy = Object.freeze({
    ...resolution.policy,
    deadlineBreachAction: "reprice"
  });
  const homeostatic = deriveTemporalHomeostaticProjection({
    basis,
    temporalProjection,
    closedVectorIndexes: aggregateProjection.closedVectorIndexes,
    schedulePolicyRef: resolution.policy.schedulePolicyRef,
    schedulePolicy: callerPolicy
  });

  assert.deepEqual(beforeAdmission.deadlineBreachRefs, []);
  assert.deepEqual(temporalProjection.deadlineBreachRefs, [
    deadlineBreach.deadlineBreachRef
  ]);
  assert.deepEqual(temporalProjection.deadlineBreachedVectorIndexes, [0]);
  assert.equal(
    temporalProjection.deadlineBreachRows[0].deadlineBreachAction,
    "human_gate"
  );
  assert.equal(
    temporalProjection.eventCalculus.holds.some(
      (fluent) => fluent.name === "temporal_deadline_breached"
    ),
    true
  );
  assert.deepEqual(aggregateProjection.closedVectorIndexes, []);
  assert.equal(aggregateProjection.nextVectorIndex, 0);
  assert.equal(homeostatic.observations[0].reason, "deadline_breached");
  assert.equal(homeostatic.observations[0].deadlineBreachAction, "human_gate");
  assert.equal(homeostatic.observations[0].requiredRegime, "F_H");
});

test("T-129 substrate boundary fails closed without ABG temporal identity fields", () => {
  const { basis, vector } = buildOddSdlcAbg36Basis({
    name: "identity_rejection",
    declarations: attrs([
      temporalHookEntry("identity-rejection", {
        deadlineRef: "instant://2026-05-07T01:00:00Z",
        deadlineBreachAction: "block"
      })
    ])
  });
  const resolution = deriveTemporalConstraintFromGtl({
    basis,
    vectorIndex: 0,
    vector
  });
  const timerIntent = constructTimerIntent({
    basis,
    constraint: resolution.constraint,
    policy: resolution.policy
  });
  const timerOutcome = constructTimerOutcome({
    timerIntent,
    outcome: "timer_fired",
    providerReceiptRef: "provider-receipt://odd-sdlc/t129/identity"
  });
  const outcomeEvent = constructTimerOutcomeAdmittedEvent({
    basis,
    timerIntent,
    timerOutcome
  });
  const scheduledContinuation = constructScheduledContinuation({
    basis,
    timerIntent,
    timerOutcome
  });
  const continuationEvent = constructScheduledContinuationReopenedEvent({
    basis,
    scheduledContinuation
  });
  const deadlineBreach = constructDeadlineBreach({
    basis,
    constraint: resolution.constraint,
    policy: resolution.policy,
    providerReceiptRef: "provider-receipt://odd-sdlc/t129/identity-deadline"
  });
  const deadlineEvent = constructDeadlineBreachAdmittedEvent({
    basis,
    deadlineBreach
  });

  const { schedulePolicyRef: _outcomePolicy, ...outcomeWithoutPolicy } =
    outcomeEvent;
  assert.throws(
    () => assertRuntimeEvent(Object.freeze(outcomeWithoutPolicy)),
    /TimerOutcomeAdmittedEvent\.schedulePolicyRef/
  );
  const { providerRef: _outcomeProvider, ...outcomeWithoutProvider } =
    outcomeEvent;
  assert.throws(
    () => assertRuntimeEvent(Object.freeze(outcomeWithoutProvider)),
    /TimerOutcomeAdmittedEvent\.providerRef/
  );
  const {
    schedulePolicyRef: _continuationPolicy,
    ...continuationWithoutPolicy
  } = continuationEvent;
  assert.throws(
    () => assertRuntimeEvent(Object.freeze(continuationWithoutPolicy)),
    /ScheduledContinuationReopenedEvent\.schedulePolicyRef/
  );
  const { deadlineBreachAction: _deadlineAction, ...deadlineWithoutAction } =
    deadlineEvent;
  assert.throws(
    () => assertRuntimeEvent(Object.freeze(deadlineWithoutAction)),
    /DeadlineBreachAdmittedEvent\.deadlineBreachAction/
  );
});
