import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { isRecord } from "../admission/codecs.js";

export interface SdlcOperatorRuntimePolicy {
  readonly kind: "odd_sdlc_operator_runtime_policy";
  readonly policyRef: "config://odd-sdlc/operator-runtime-policy/v1";
  readonly version: number;
  readonly minimumOperatorTimeoutMs: number;
  readonly workerTimeoutMs: number;
  readonly workerInactivityTimeoutMs: number;
  readonly workerHeartbeatMs: number;
  readonly workerTerminationGraceMs: number;
  readonly designDepthFpEvaluatorTimeoutMs: number;
  readonly designDepthFpEvaluatorInactivityTimeoutMs: number;
  readonly designDepthFpEvaluatorCheckpointTimeoutMs: number;
  readonly designDepthFpEvaluatorMaxEffort: SdlcOperatorRuntimeEffort;
  readonly designDepthFpEvaluatorStdoutBudgetBytes: number;
  readonly reviewGradeEdgeFulfillmentEvaluatorTimeoutMs: number;
  readonly reviewGradeEdgeFulfillmentEvaluatorInactivityTimeoutMs: number;
  readonly reviewGradeEdgeFulfillmentEvaluatorMaxEffort: SdlcOperatorRuntimeEffort;
  readonly reviewGradeEdgeFulfillmentEvaluatorStdoutBudgetBytes: number;
  readonly executionShardTimeoutMs: number;
  readonly executionShardInactivityTimeoutMs: number;
  readonly installedOperatorShardTimeoutCapMs: number | null;
  readonly liveHarnessCommandTimeoutMs: number;
  readonly liveHarnessFullCapabilityCommandTimeoutMs: number;
  readonly liveHarnessLifecycleCommandTimeoutMs: number;
}

export type SdlcOperatorRuntimeEffort =
  | "low"
  | "medium"
  | "high"
  | "xhigh"
  | "max";

interface SdlcOperatorRuntimePolicyConfig {
  readonly kind: "odd_sdlc_operator_runtime_policy";
  readonly policyRef: "config://odd-sdlc/operator-runtime-policy/v1";
  readonly version: number;
  readonly minimumOperatorTimeoutMs: number;
  readonly worker: {
    readonly timeoutMs: number;
    readonly inactivityTimeoutMs: number;
    readonly heartbeatMs: number;
    readonly terminationGraceMs: number;
  };
  readonly designDepthFpEvaluator: {
    readonly timeoutMs: number;
    readonly inactivityTimeoutMs: number;
    readonly checkpointTimeoutMs: number;
    readonly maxEffort: SdlcOperatorRuntimeEffort;
    readonly stdoutBudgetBytes: number;
  };
  readonly reviewGradeEdgeFulfillmentEvaluator: {
    readonly timeoutMs: number;
    readonly inactivityTimeoutMs: number;
    readonly maxEffort: SdlcOperatorRuntimeEffort;
    readonly stdoutBudgetBytes: number;
  };
  readonly executionShard: {
    readonly timeoutMs: number;
    readonly inactivityTimeoutMs: number;
  };
  readonly liveHarness: {
    readonly commandTimeoutMs: number;
    readonly fullCapabilityCommandTimeoutMs: number;
    readonly lifecycleCommandTimeoutMs: number;
  };
}

let cachedConfig: SdlcOperatorRuntimePolicyConfig | null = null;

function recordField(
  record: Record<string, unknown>,
  key: string,
  label: string
): Record<string, unknown> {
  const value = record[key];
  if (!isRecord(value)) {
    throw new TypeError(`${label}.${key}: expected object`);
  }
  return value;
}

function positiveIntegerField(
  record: Record<string, unknown>,
  key: string,
  label: string
): number {
  const value = record[key];
  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
    throw new TypeError(`${label}.${key}: expected positive integer`);
  }
  return value;
}

function effortField(
  record: Record<string, unknown>,
  key: string,
  label: string
): SdlcOperatorRuntimeEffort {
  const value = record[key];
  if (
    value === "low" ||
    value === "medium" ||
    value === "high" ||
    value === "xhigh" ||
    value === "max"
  ) {
    return value;
  }
  throw new TypeError(`${label}.${key}: expected low, medium, high, xhigh, or max`);
}

function parsePositiveIntegerFromEnv(name: string): number | null {
  const raw = process.env[name];
  if (raw === undefined) {
    return null;
  }
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function parseEffortFromEnv(name: string): SdlcOperatorRuntimeEffort | null {
  const raw = process.env[name];
  if (raw === undefined || raw.trim().length === 0) {
    return null;
  }
  if (
    raw === "low" ||
    raw === "medium" ||
    raw === "high" ||
    raw === "xhigh" ||
    raw === "max"
  ) {
    return raw;
  }
  return null;
}

function configuredPositiveInteger(
  envName: string,
  configuredValue: number
): number {
  return parsePositiveIntegerFromEnv(envName) ?? configuredValue;
}

function configuredEffort(
  envName: string,
  configuredValue: SdlcOperatorRuntimeEffort
): SdlcOperatorRuntimeEffort {
  return parseEffortFromEnv(envName) ?? configuredValue;
}

function configuredTimeoutMs(
  envName: string,
  configuredValue: number,
  minimumTimeoutMs: number
): number {
  return Math.max(
    minimumTimeoutMs,
    configuredPositiveInteger(envName, configuredValue)
  );
}

export function sdlcOperatorRuntimePolicyConfigRef(): "config://odd-sdlc/operator-runtime-policy/v1" {
  return "config://odd-sdlc/operator-runtime-policy/v1";
}

export function sdlcOperatorRuntimePolicyConfigPath(): string {
  return join(
    resolve(dirname(fileURLToPath(import.meta.url)), "../../../../.."),
    "config",
    "operator-runtime-policy.json"
  );
}

function readSdlcOperatorRuntimePolicyConfig(): SdlcOperatorRuntimePolicyConfig {
  if (cachedConfig !== null) {
    return cachedConfig;
  }
  const raw: unknown = JSON.parse(
    readFileSync(sdlcOperatorRuntimePolicyConfigPath(), "utf8")
  );
  if (!isRecord(raw)) {
    throw new TypeError("operator-runtime-policy.json: expected object");
  }
  if (raw["kind"] !== "odd_sdlc_operator_runtime_policy") {
    throw new TypeError("operator-runtime-policy.json.kind: unexpected value");
  }
  if (raw["policyRef"] !== sdlcOperatorRuntimePolicyConfigRef()) {
    throw new TypeError("operator-runtime-policy.json.policyRef: unexpected value");
  }
  const worker = recordField(raw, "worker", "operator-runtime-policy.json");
  const designDepthFpEvaluator = recordField(
    raw,
    "designDepthFpEvaluator",
    "operator-runtime-policy.json"
  );
  const reviewGradeEdgeFulfillmentEvaluator = recordField(
    raw,
    "reviewGradeEdgeFulfillmentEvaluator",
    "operator-runtime-policy.json"
  );
  const executionShard = recordField(
    raw,
    "executionShard",
    "operator-runtime-policy.json"
  );
  const liveHarness = recordField(raw, "liveHarness", "operator-runtime-policy.json");
  cachedConfig = Object.freeze({
    kind: "odd_sdlc_operator_runtime_policy",
    policyRef: sdlcOperatorRuntimePolicyConfigRef(),
    version: positiveIntegerField(raw, "version", "operator-runtime-policy.json"),
    minimumOperatorTimeoutMs: positiveIntegerField(
      raw,
      "minimumOperatorTimeoutMs",
      "operator-runtime-policy.json"
    ),
    worker: Object.freeze({
      timeoutMs: positiveIntegerField(
        worker,
        "timeoutMs",
        "operator-runtime-policy.json.worker"
      ),
      inactivityTimeoutMs: positiveIntegerField(
        worker,
        "inactivityTimeoutMs",
        "operator-runtime-policy.json.worker"
      ),
      heartbeatMs: positiveIntegerField(
        worker,
        "heartbeatMs",
        "operator-runtime-policy.json.worker"
      ),
      terminationGraceMs: positiveIntegerField(
        worker,
        "terminationGraceMs",
        "operator-runtime-policy.json.worker"
      )
    }),
    designDepthFpEvaluator: Object.freeze({
      timeoutMs: positiveIntegerField(
        designDepthFpEvaluator,
        "timeoutMs",
        "operator-runtime-policy.json.designDepthFpEvaluator"
      ),
      inactivityTimeoutMs: positiveIntegerField(
        designDepthFpEvaluator,
        "inactivityTimeoutMs",
        "operator-runtime-policy.json.designDepthFpEvaluator"
      ),
      checkpointTimeoutMs: positiveIntegerField(
        designDepthFpEvaluator,
        "checkpointTimeoutMs",
        "operator-runtime-policy.json.designDepthFpEvaluator"
      ),
      maxEffort: effortField(
        designDepthFpEvaluator,
        "maxEffort",
        "operator-runtime-policy.json.designDepthFpEvaluator"
      ),
      stdoutBudgetBytes: positiveIntegerField(
        designDepthFpEvaluator,
        "stdoutBudgetBytes",
        "operator-runtime-policy.json.designDepthFpEvaluator"
      )
    }),
    reviewGradeEdgeFulfillmentEvaluator: Object.freeze({
      timeoutMs: positiveIntegerField(
        reviewGradeEdgeFulfillmentEvaluator,
        "timeoutMs",
        "operator-runtime-policy.json.reviewGradeEdgeFulfillmentEvaluator"
      ),
      inactivityTimeoutMs: positiveIntegerField(
        reviewGradeEdgeFulfillmentEvaluator,
        "inactivityTimeoutMs",
        "operator-runtime-policy.json.reviewGradeEdgeFulfillmentEvaluator"
      ),
      maxEffort: effortField(
        reviewGradeEdgeFulfillmentEvaluator,
        "maxEffort",
        "operator-runtime-policy.json.reviewGradeEdgeFulfillmentEvaluator"
      ),
      stdoutBudgetBytes: positiveIntegerField(
        reviewGradeEdgeFulfillmentEvaluator,
        "stdoutBudgetBytes",
        "operator-runtime-policy.json.reviewGradeEdgeFulfillmentEvaluator"
      )
    }),
    executionShard: Object.freeze({
      timeoutMs: positiveIntegerField(
        executionShard,
        "timeoutMs",
        "operator-runtime-policy.json.executionShard"
      ),
      inactivityTimeoutMs: positiveIntegerField(
        executionShard,
        "inactivityTimeoutMs",
        "operator-runtime-policy.json.executionShard"
      )
    }),
    liveHarness: Object.freeze({
      commandTimeoutMs: positiveIntegerField(
        liveHarness,
        "commandTimeoutMs",
        "operator-runtime-policy.json.liveHarness"
      ),
      fullCapabilityCommandTimeoutMs: positiveIntegerField(
        liveHarness,
        "fullCapabilityCommandTimeoutMs",
        "operator-runtime-policy.json.liveHarness"
      ),
      lifecycleCommandTimeoutMs: positiveIntegerField(
        liveHarness,
        "lifecycleCommandTimeoutMs",
        "operator-runtime-policy.json.liveHarness"
      )
    })
  });
  return cachedConfig;
}

export function sdlcOperatorRuntimePolicy(): SdlcOperatorRuntimePolicy {
  const config = readSdlcOperatorRuntimePolicyConfig();
  const minimumOperatorTimeoutMs = configuredPositiveInteger(
    "ODD_SDLC_TEST_ONLY_MINIMUM_OPERATOR_TIMEOUT_MS",
    config.minimumOperatorTimeoutMs
  );
  const installedOperatorShardTimeoutCapMs = parsePositiveIntegerFromEnv(
    "ODD_SDLC_INSTALLED_OPERATOR_SHARD_TIMEOUT_MS"
  );
  return Object.freeze({
    kind: config.kind,
    policyRef: config.policyRef,
    version: config.version,
    minimumOperatorTimeoutMs,
    workerTimeoutMs: configuredTimeoutMs(
      "ODD_SDLC_WORKER_TIMEOUT_MS",
      config.worker.timeoutMs,
      minimumOperatorTimeoutMs
    ),
    workerInactivityTimeoutMs: configuredTimeoutMs(
      "ODD_SDLC_WORKER_INACTIVITY_TIMEOUT_MS",
      config.worker.inactivityTimeoutMs,
      minimumOperatorTimeoutMs
    ),
    workerHeartbeatMs: configuredPositiveInteger(
      "ODD_SDLC_WORKER_HEARTBEAT_MS",
      config.worker.heartbeatMs
    ),
    workerTerminationGraceMs: configuredPositiveInteger(
      "ODD_SDLC_WORKER_TERMINATION_GRACE_MS",
      config.worker.terminationGraceMs
    ),
    designDepthFpEvaluatorTimeoutMs: configuredPositiveInteger(
      "ODD_SDLC_DESIGN_DEPTH_FP_EVALUATOR_TIMEOUT_MS",
      config.designDepthFpEvaluator.timeoutMs
    ),
    designDepthFpEvaluatorInactivityTimeoutMs: configuredPositiveInteger(
      "ODD_SDLC_DESIGN_DEPTH_FP_EVALUATOR_INACTIVITY_TIMEOUT_MS",
      config.designDepthFpEvaluator.inactivityTimeoutMs
    ),
    designDepthFpEvaluatorCheckpointTimeoutMs: configuredPositiveInteger(
      "ODD_SDLC_DESIGN_DEPTH_FP_EVALUATOR_CHECKPOINT_TIMEOUT_MS",
      config.designDepthFpEvaluator.checkpointTimeoutMs
    ),
    designDepthFpEvaluatorMaxEffort: configuredEffort(
      "ODD_SDLC_DESIGN_DEPTH_FP_EVALUATOR_MAX_EFFORT",
      config.designDepthFpEvaluator.maxEffort
    ),
    designDepthFpEvaluatorStdoutBudgetBytes: configuredPositiveInteger(
      "ODD_SDLC_DESIGN_DEPTH_FP_EVALUATOR_STDOUT_BUDGET_BYTES",
      config.designDepthFpEvaluator.stdoutBudgetBytes
    ),
    reviewGradeEdgeFulfillmentEvaluatorTimeoutMs: configuredPositiveInteger(
      "ODD_SDLC_REVIEW_GRADE_EDGE_FULFILLMENT_EVALUATOR_TIMEOUT_MS",
      config.reviewGradeEdgeFulfillmentEvaluator.timeoutMs
    ),
    reviewGradeEdgeFulfillmentEvaluatorInactivityTimeoutMs: configuredPositiveInteger(
      "ODD_SDLC_REVIEW_GRADE_EDGE_FULFILLMENT_EVALUATOR_INACTIVITY_TIMEOUT_MS",
      config.reviewGradeEdgeFulfillmentEvaluator.inactivityTimeoutMs
    ),
    reviewGradeEdgeFulfillmentEvaluatorMaxEffort: configuredEffort(
      "ODD_SDLC_REVIEW_GRADE_EDGE_FULFILLMENT_EVALUATOR_MAX_EFFORT",
      config.reviewGradeEdgeFulfillmentEvaluator.maxEffort
    ),
    reviewGradeEdgeFulfillmentEvaluatorStdoutBudgetBytes: configuredPositiveInteger(
      "ODD_SDLC_REVIEW_GRADE_EDGE_FULFILLMENT_EVALUATOR_STDOUT_BUDGET_BYTES",
      config.reviewGradeEdgeFulfillmentEvaluator.stdoutBudgetBytes
    ),
    executionShardTimeoutMs: configuredTimeoutMs(
      "ODD_SDLC_EXECUTION_SHARD_TIMEOUT_MS",
      config.executionShard.timeoutMs,
      minimumOperatorTimeoutMs
    ),
    executionShardInactivityTimeoutMs: configuredTimeoutMs(
      "ODD_SDLC_EXECUTION_SHARD_INACTIVITY_TIMEOUT_MS",
      config.executionShard.inactivityTimeoutMs,
      minimumOperatorTimeoutMs
    ),
    installedOperatorShardTimeoutCapMs:
      installedOperatorShardTimeoutCapMs === null
        ? null
        : Math.max(minimumOperatorTimeoutMs, installedOperatorShardTimeoutCapMs),
    liveHarnessCommandTimeoutMs: configuredTimeoutMs(
      "ODD_SDLC_TS_LIVE_COMMAND_TIMEOUT_MS",
      config.liveHarness.commandTimeoutMs,
      minimumOperatorTimeoutMs
    ),
    liveHarnessFullCapabilityCommandTimeoutMs: configuredTimeoutMs(
      "ODD_SDLC_TS_LIVE_FULL_CAPABILITY_COMMAND_TIMEOUT_MS",
      config.liveHarness.fullCapabilityCommandTimeoutMs,
      minimumOperatorTimeoutMs
    ),
    liveHarnessLifecycleCommandTimeoutMs: configuredTimeoutMs(
      "ODD_SDLC_TS_LIVE_LIFECYCLE_COMMAND_TIMEOUT_MS",
      config.liveHarness.lifecycleCommandTimeoutMs,
      minimumOperatorTimeoutMs
    )
  });
}
