// Implements: REQ-F-ODDSDLC-003
// Implements: REQ-F-ODDSDLC-021

import type { SdlcPublicStartTargetKind } from "./public_start.js";

export type SdlcPublicStartTargetResolver =
  | "first_start_target"
  | "named_graph_function"
  | "asset_producer_executive";

export interface SdlcPublicStartTargetPolicyEntry {
  readonly kind: "sdlc_public_start_target_policy_entry";
  readonly targetKind: SdlcPublicStartTargetKind;
  readonly resolver: SdlcPublicStartTargetResolver;
}

export const SDLC_PUBLIC_START_TARGET_POLICY = Object.freeze([
  Object.freeze({
    kind: "sdlc_public_start_target_policy_entry",
    targetKind: "next",
    resolver: "first_start_target"
  }),
  Object.freeze({
    kind: "sdlc_public_start_target_policy_entry",
    targetKind: "graph_function",
    resolver: "named_graph_function"
  }),
  Object.freeze({
    kind: "sdlc_public_start_target_policy_entry",
    targetKind: "asset",
    resolver: "asset_producer_executive"
  })
] as const satisfies readonly SdlcPublicStartTargetPolicyEntry[]);

export function publicStartTargetPolicyFor(
  targetKind: SdlcPublicStartTargetKind
): SdlcPublicStartTargetPolicyEntry {
  const matched = SDLC_PUBLIC_START_TARGET_POLICY.find(
    (entry) => entry.targetKind === targetKind
  );
  if (matched === undefined) {
    throw new TypeError(`SdlcPublicStartPolicy: missing policy for ${targetKind}`);
  }
  return matched;
}
