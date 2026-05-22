// Implements: REQ-F-RUNTIME-006
// Implements: REQ-F-ODDSDLC-084

import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";

export interface SdlcSelectedAbgFnCompositionIdentity {
  readonly kind: "sdlc_selected_abg_fn_composition_identity";
  readonly compositionRef: string;
  readonly compositionDigest: string;
  readonly compositionSelectionRef: string;
  readonly graphFunctionRef: string;
  readonly graphVectorRef: string;
}

function stableJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function digest(value: unknown): string {
  return createHash("sha256").update(stableJson(value)).digest("hex");
}

function segment(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new TypeError("composition identity segment must be non-empty");
  }
  return encodeURIComponent(trimmed);
}

export function sdlcRunRefSegmentFromArchiveRoot(archiveRoot: string): string {
  return segment(pathToFileURL(archiveRoot).href);
}

export function deriveSdlcSelectedAbgFnCompositionIdentity(input: {
  readonly graphFunctionRef: string;
  readonly graphVectorRef: string;
  readonly compositionSelectionScopeRef: string;
  readonly carrierContextRefs?: readonly string[];
  readonly assuranceContextRefs?: readonly string[];
}): SdlcSelectedAbgFnCompositionIdentity {
  const graphFunctionRef = input.graphFunctionRef.trim();
  const graphVectorRef = input.graphVectorRef.trim();
  const carrierContextRefs = [...(input.carrierContextRefs ?? [])].sort();
  const assuranceContextRefs = [...(input.assuranceContextRefs ?? [])].sort();
  const compositionRef = [
    "abg.fn_composition://odd-sdlc",
    segment(graphFunctionRef),
    segment(graphVectorRef)
  ].join("/");
  const compositionDigest = digest({
    graphFunctionRef,
    graphVectorRef,
    carrierContextRefs,
    assuranceContextRefs
  });
  return Object.freeze({
    kind: "sdlc_selected_abg_fn_composition_identity" as const,
    compositionRef,
    compositionDigest,
    compositionSelectionRef: [
      "abg.fn_composition_selection://odd-sdlc",
      segment(input.compositionSelectionScopeRef),
      segment(graphFunctionRef),
      segment(graphVectorRef)
    ].join("/"),
    graphFunctionRef,
    graphVectorRef
  });
}

export function deriveFallbackSdlcSelectedAbgFnCompositionIdentity(input: {
  readonly scopeRef: string;
}): SdlcSelectedAbgFnCompositionIdentity {
  return deriveSdlcSelectedAbgFnCompositionIdentity({
    graphFunctionRef: "unknown_graph_function",
    graphVectorRef: input.scopeRef,
    compositionSelectionScopeRef: input.scopeRef
  });
}
