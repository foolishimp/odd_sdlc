// Implements: T-161

import type {
  SdlcFdRunAnalysisProfile,
  SdlcFdRunAnalysisProfileSpec,
  SdlcFdRunAnalysisThresholds
} from "./types.js";

const DEFAULT_HELLO_WORLD_THRESHOLDS: SdlcFdRunAnalysisThresholds = Object.freeze({
  heartbeatAgeStallMs: 120_000,
  noOutputGapStallMs: 90_000,
  archiveGrowthZeroToleranceMs: 120_000,
  promptContextBytesHigh: 250_000,
  handoffGrowthHighBytes: 150_000,
  eventSnapshotBytesHigh: 300_000,
  unattributedTimeHighRatio: 0.5,
  requirementFanoutSuspiciousRatio: 3,
  productLineageFanoutSuspiciousRatio: 2
});

const DEFAULT_DATA_MAPPER_THRESHOLDS: SdlcFdRunAnalysisThresholds = Object.freeze({
  heartbeatAgeStallMs: 240_000,
  noOutputGapStallMs: 180_000,
  archiveGrowthZeroToleranceMs: 240_000,
  promptContextBytesHigh: 600_000,
  handoffGrowthHighBytes: 600_000,
  eventSnapshotBytesHigh: 1_500_000,
  unattributedTimeHighRatio: 0.4,
  requirementFanoutSuspiciousRatio: 6,
  productLineageFanoutSuspiciousRatio: 4
});

const DEFAULT_GENERIC_THRESHOLDS: SdlcFdRunAnalysisThresholds = Object.freeze({
  heartbeatAgeStallMs: 300_000,
  noOutputGapStallMs: 240_000,
  archiveGrowthZeroToleranceMs: 300_000,
  promptContextBytesHigh: 1_000_000,
  handoffGrowthHighBytes: 1_000_000,
  eventSnapshotBytesHigh: 5_000_000,
  unattributedTimeHighRatio: 0.6,
  requirementFanoutSuspiciousRatio: 8,
  productLineageFanoutSuspiciousRatio: 8
});

const HELLO_WORLD_PROFILE: SdlcFdRunAnalysisProfileSpec = Object.freeze({
  policy: Object.freeze({
    profile: "hello_world" as const,
    profilePolicyRef: "policy://odd-sdlc/analysis/profile/hello_world/v1",
    thresholdPolicyRef: "policy://odd-sdlc/analysis/threshold/hello_world/v1",
    policyStatus: "informational" as const
  }),
  thresholds: DEFAULT_HELLO_WORLD_THRESHOLDS,
  expectedRetryFloor: 0,
  enforceCanonicalLineage: true,
  forbidRawDisplayIdRequirementTagsInProductFiles: true
});

const DATA_MAPPER_PROFILE: SdlcFdRunAnalysisProfileSpec = Object.freeze({
  policy: Object.freeze({
    profile: "data_mapper" as const,
    profilePolicyRef: "policy://odd-sdlc/analysis/profile/data_mapper/v1",
    thresholdPolicyRef: "policy://odd-sdlc/analysis/threshold/data_mapper/v1",
    policyStatus: "informational" as const
  }),
  thresholds: DEFAULT_DATA_MAPPER_THRESHOLDS,
  expectedRetryFloor: 1,
  enforceCanonicalLineage: true,
  forbidRawDisplayIdRequirementTagsInProductFiles: false
});

const GENERIC_PROFILE: SdlcFdRunAnalysisProfileSpec = Object.freeze({
  policy: Object.freeze({
    profile: "generic" as const,
    profilePolicyRef: "policy://odd-sdlc/analysis/profile/generic/v1",
    thresholdPolicyRef: "policy://odd-sdlc/analysis/threshold/generic/v1",
    policyStatus: "informational" as const
  }),
  thresholds: DEFAULT_GENERIC_THRESHOLDS,
  expectedRetryFloor: 0,
  enforceCanonicalLineage: false,
  forbidRawDisplayIdRequirementTagsInProductFiles: false
});

export function resolveSdlcFdRunAnalysisProfile(
  profile: SdlcFdRunAnalysisProfile
): SdlcFdRunAnalysisProfileSpec {
  switch (profile) {
    case "hello_world":
      return HELLO_WORLD_PROFILE;
    case "data_mapper":
      return DATA_MAPPER_PROFILE;
    case "generic":
      return GENERIC_PROFILE;
  }
}
