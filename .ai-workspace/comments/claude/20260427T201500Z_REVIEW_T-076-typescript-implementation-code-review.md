# REVIEW: T-076 TypeScript Implementation — Code Review

**Author**: Claude
**Date**: 2026-04-27T20:15:00Z
**Scope**: Working-tree changes implementing T-076 in the TypeScript tenant. Focus on the operator slice that was T-076's load-bearing diagnostic (postflight failure escaping event calculus).
**Posture**: Commentary, not law. Reviewer-only; no code edits.
**Anchoring**: STDO scope letters S/T/D/O annotate each finding.

## Files Read

In-flight (uncommitted) changes:

- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_DETERMINISTIC_TRAVERSAL_STATE_MACHINE.md` (174 lines, new)
- `build_tenants/typescript/code/src/operator/carriers.ts` (190 lines, new)
- `build_tenants/typescript/code/src/operator/event_store.ts` (75 lines, new)
- `build_tenants/typescript/code/src/operator/handoff.ts` (802 lines)
- `build_tenants/typescript/code/src/operator/installed_operator.ts` (692 lines)
- `build_tenants/typescript/code/src/operator/transport.ts` (160 lines)
- `build_tenants/typescript/code/src/operator/index.ts` (5 lines, barrel)
- `build_tenants/typescript/test_env/tests/test_t076_deterministic_traversal_state_machine.test.mjs` (242 lines, new)

Cross-checked against ABG substrate at:

- `abiogenesis/.../abg/m03/contracts/retry_repair.ts:90-207`
- `abiogenesis/.../abg/m03/contracts/projection.ts:177-200`

Note for context: this review examines the intent of the slice as described in the design surface and as exercised by the new test, and flags semantic and ownership concerns — not type-checked or test-run validation. The user reports tests are currently running.

## Summary

The slice closes T-076's primary diagnostic: failed worker postflight now produces typed `SdlcPostflightGapDossier` and emits `vector_evaluated(blocked) → retry_repair_planned → retry_attempt_opened → continuation_terminated → continuation_reopened`, which the next `start` invocation projects into a retry-context-bearing handoff. `installed_operator.ts:531-573` is no longer the archive-only terminal it was when T-076 was triaged.

That said, the slice has three classes of issue:

1. **Authority-split inconsistencies**: the same algebraic break the ticket identifies still exists at adjacent boundaries (hook-postflight, worker_failed, worker_report_rejected). The fix is local to one path.
2. **Semantic overloading at the ABG seam**: `retryAttemptRefs[].manifestId` is being used to carry a gap-dossier ref, not a handoff-manifest ref. It works because of the `candidateManifestId` field's permissive contract, but it conflates two distinct identities and creates a fragile round-trip.
3. **Hardcoded policy and string-substring classification** that the ticket explicitly warned against ("no transition depends on implicit operator interpretation").

None contradict the slice's core position; all are tightening within the same algebra.

## Agreement With Implementation

What the implementation gets right and the review reinforces:

- **`relativePathBasis: "tenant_root"` is now an explicit constant** (`carriers.ts:69`) and the worker prompt states the rule unambiguously (`handoff.ts:241`: "materializedFiles.relativePath MUST be relative to the tenant root, not the workspace root"). The path-basis contract defect named in T-076 line 1075–1077 is closed *and* the closure is enforced both in the prompt and in the postflight checker (`handoff.ts:449-451`).
- **Postflight failure now emits ABG runtime events** (`installed_operator.ts:537-543, 283-330`). The `appendPostflightFailureRuntimeEvents` function is the algebra-closing transition. The event sequence in `appendPostflightFailureRuntimeEvents` lines 316–324 (`vector_evaluated(blocked) + retry_repair_planned + retry_attempt_opened + continuation_terminated + continuation_reopened`) is the typed event truth T-076 line 56 required.
- **Retry context is replay-derived, not local** (`installed_operator.ts:148-172`). `retryContextFromProjection` reads `projection.retryAttemptRefs` and resolves prior gap dossiers from the file URL refs. This satisfies T-076 line 64's "inadmissible: local attempt counter" non-closure condition.
- **Gap dossier is a typed, admissible surface** (`carriers.ts:100-118`, `handoff.ts:575-702`). It has a closed shape, a typed `reasonClass`, evidence refs, retry eligibility, and a roundtrip `admit*` validator. `readPostflightGapDossierRef` makes it durable across operator runs. This satisfies T-076 line 53–54 ("graph-function result surfaces are explicitly modeled as typed product/result/gap surfaces, not only as files").
- **Test exercises the algebra correctly** (`test_t076_deterministic_traversal_state_machine.test.mjs:166-242`). The first attempt fails with `materialized_product_relative_path_mismatch`, the test asserts the *exact* event sequence including `retry_repair_planned`, the second attempt observes `priorGapDossiers.length === 1` and produces a tenant-relative path, and `projectSdlcGapsFromReplay` confirms the edge moves from open to closed only after the second run. This is the evidence T-076 line 47 demanded ("a failed `derive_code_surface` postflight becomes an admitted gap/continuation surface rather than a terminal archive-only stop").
- **Design doc demotes operator summary to read-model only** (`ODD_SDLC_TYPESCRIPT_DETERMINISTIC_TRAVERSAL_STATE_MACHINE.md:70` — "operator projection — read model over state and archive — inadmissible: next action as transition authority"). Matches T-076 line 243 and Finding 6 of the prior T-076 review.
- **Authority Split** (design line 33–57) is articulated cleanly. ABG owns retry projection and event truth; odd_sdlc owns gap dossier content and postflight classification. This is an upgrade over the prior installed_operator.ts which mixed the two.

## Findings

### 1. High [O,D]: hook-postflight failure recreates the original archive-only defect

`installed_operator.ts:594-617` handles the case where `hookOutcome.postflight?.status !== "passed"`:

```ts
if (hookOutcome.postflight?.status !== "passed") {
  const outcome = terminalOutcome({
    ...
    status: "postflight_failed",
    ...
    emittedRuntimeEventKinds: Object.freeze([]),
    ...
    nextLawfulAction: "repair_hook_result",
    ...
  });
  writeRunArchive({ manifest, outcome });
  return outcome;
}
```

This is the *same archive-only terminal* T-076 was filed to eliminate, just at the hook-postflight boundary instead of the worker-postflight boundary. `emittedRuntimeEventKinds` is empty, no gap dossier is built, no retry events are appended, and `repair_hook_result` is prose. Worker-postflight failure correctly emits typed events (lines 537–543); hook-postflight failure does not.

If a hook evaluator legitimately rejects a constructor result (e.g., generated-asset contract `satisfied: false`), the same algebraic break the ticket diagnoses re-emerges: failure observed, classification possible, but transition stays in archive prose.

**Recommendation**: route hook-postflight failure through the same path. Build a `SdlcPostflightGapDossier` from the hook outcome (the hook contract already names what was checked; a separate `hook_postflight` reason class may be warranted in `SdlcPostflightGapReasonClass`), and call `appendPostflightFailureRuntimeEvents`.

This is the single most material correctness gap relative to T-076's stated closure law (line 47): "implements the missing deterministic transitions or opens substrate tickets where ABG lacks generic authority". The transition is reachable in TS today; it just isn't wired.

### 2. High [O,D]: `worker_failed` and `worker_report_rejected` paths remain archive-only

`installed_operator.ts:473-495` (worker process exited non-zero) and `497-522` (result report missing or unparseable) both return with `emittedRuntimeEventKinds: Object.freeze([])` and `nextLawfulAction` prose ("inspect_worker_archive", "repair_worker_report"). No gap dossier, no retry algebra.

T-076's required state machine maps these to S08 → S16 GapDossierOpened (worker_dispatch_failed) and S09 → S16 (worker_failed) at lines 696, 699. The current slice does not implement those edges.

The design doc explicitly scopes the slice (line 74: "The first T-076 implementation slice governs the failed-postflight path"). That is a legitimate scope choice — Finding 1 of the prior T-076 review recommended exactly this kind of split. But the design surface should mark these unimplemented edges *explicitly* and either:

- (a) declare them out-of-scope of T-076 with a successor ticket file path stub (e.g., `T-076a-route-worker-and-report-failures-into-gap-algebra`), or
- (b) leave a `TODO(T-076a)` annotation at `installed_operator.ts:473` and `:501` so a future maintainer doesn't read the silent archive-only branch as intentional final design.

Today neither is in place. A reader of `installed_operator.ts` cannot distinguish "this branch is the final law" from "this branch is the prior defect, awaiting follow-up." That is the same ambiguity T-076 is trying to remove.

### 3. High [O]: `manifestId` is being used to carry a gap-dossier ref — semantic overloading at the ABG seam

`installed_operator.ts:298-315`:

```ts
const retryDecision = deriveRetryRepairDecision({
  ...
  priorManifestId: input.gapDossier.priorManifestId,           // = handoff manifest URL
  candidateManifestId: input.gapDossier.currentGapDossierRef,  // = gap dossier URL
  ...
});
```

Tracing through ABG (`retry_repair.ts:168` then `:201`), `attempt.manifestId = input.candidateManifestId`, so the `retry_repair_planned` event ends up with `manifestId = <gap dossier URL>`. The projection puts this into `retryAttemptRefs[].manifestId` (`projection.ts:181-189`). On the next operator invocation, `retryContextFromProjection` reads it via `readPostflightGapDossierRef(ref.manifestId)` (`installed_operator.ts:168`), which JSON-parses the URL contents and validates them as a gap dossier.

This works *only* because we passed the gap-dossier URL into a field named `candidateManifestId`. The chain is correct in behavior but wrong in identity:

- ABG's contract is "this is the retry's candidate **manifest**" (a handoff manifest under the substrate's normal usage).
- odd_sdlc is using it as "this is the retry's candidate **gap dossier** ref" because the handoff manifest doesn't exist yet at the moment the retry is planned.

The two surfaces are different. The handoff manifest of the *next* retry isn't constructed until `start` is re-invoked. So today the `candidateManifestId` slot is borrowed for an unrelated identity (the gap dossier of the *failing* run).

Three concerns:

1. The next maintainer reasonably reads `retryAttemptRefs[].manifestId` as "the failed run's handoff manifest" and writes a consumer that fetches `handoff_manifest.json` from the path. They get a gap dossier, validation fails silently (`readPostflightGapDossierRef` swallows errors at line 714), and the retry context appears empty.
2. ABG's `assertNonEmptyString(input.priorManifestId)` and `assertNonEmptyString(input.candidateManifestId)` (`retry_repair.ts:97-98`) treat both as strings without semantic typing. The ABG event admission rule for `retry_repair_planned` (`event_admission.ts:185`) presumably also accepts any non-empty string.
3. The existing `priorManifestId` on the gap dossier (`carriers.ts:109`) **does** point at the handoff manifest. So we're storing both identities — but ABG's event projection only retains `manifestId`, not the gap dossier ref. The current code recovers the gap dossier from `manifestId` because it arranged the field that way, not because the substrate guarantees it.

**Recommendations**, in order of preference:

- (a) **Open an abiogenesis ticket** to add a typed `gapDossierRef` field to `RetryRepairPlannedEvent` and to `retryAttemptRefs`, separate from `manifestId`. Then odd_sdlc passes both. This matches T-076 line 1097–1099 ("If ABG lacks a generic event or continuation hook required for this state machine, open a linked abiogenesis ticket").
- (b) **Resolve the gap dossier by adjacency convention**, not by ref. Both `handoff_manifest.json` and `gap_dossier.json` live in the same archive root. `readPostflightGapDossierRef` could take the manifest URL, strip the filename, and append `gap_dossier.json`. Then `manifestId` semantically means "manifest" again, and the gap dossier is co-located by deterministic convention.
- (c) **At minimum**, document the seam at `installed_operator.ts:298-315` and `:148-172` with one comment line: this `manifestId` carries a gap-dossier ref by the operator's choice of `candidateManifestId`, and `readPostflightGapDossierRef` is the matching consumer.

(c) is the smallest change; (a) is the principled fix and is exactly the cross-substrate gap T-076 anticipated.

### 4. Medium [O]: continuation IDs do not chain across multiple retry attempts

`installed_operator.ts:307-313`:

```ts
continuationRepair: {
  terminatedContinuationId: `continuation:${encodeURIComponent(input.gapDossier.priorManifestId)}`,
  reopenedContinuationId: `continuation:${encodeURIComponent(input.gapDossier.currentGapDossierRef)}`,
}
```

On the *first* failure-then-retry, this is correct: there is no prior continuation to terminate, but the substrate tolerates the absence. On a *second* failure (retry produces another failed postflight), the continuation chain semantics require `terminatedContinuationId` of attempt N+1 to equal `reopenedContinuationId` of attempt N. The current code computes both from *this attempt's* dossier, so:

- Attempt 1 emits `terminated=continuation:M1`, `reopened=continuation:G1`.
- Attempt 2 emits `terminated=continuation:M2`, `reopened=continuation:G2`.

There is no link from G1 → M2. The continuation reopened by attempt 1 is never explicitly terminated.

The current test (`test_t076_deterministic_traversal_state_machine.test.mjs:166-242`) only exercises one failure cycle (first fails, second succeeds), so this defect is not caught.

**Recommendation**: derive `terminatedContinuationId` from the prior attempt's `reopenedContinuationId` when one exists. The simplest route: `priorGapDossiers[priorGapDossiers.length - 1]?.currentGapDossierRef` from the retry context, falling back to `gapDossier.priorManifestId` when no prior dossier exists. Add a test that fails twice consecutively and asserts the continuation chain is contiguous.

### 5. Medium [D,T]: `maxAttempts: 3` is hardcoded inside `appendPostflightFailureRuntimeEvents`

`installed_operator.ts:304`:

```ts
const retryDecision = deriveRetryRepairDecision({
  ...
  maxAttempts: 3,
  ...
});
```

`SdlcPostflightGapDossier.retryEligible: true` is also hardcoded (`handoff.ts:604`).

Per T-076 frontmatter line 52 ("no transition depends on implicit operator interpretation") and line 64 ("inadmissible: local attempt counter"), retry budget is policy and must be admitted from a policy carrier, not a literal in a transition function. The slice substituted ABG-projection-derived attempt *count* for a local counter (good), but the ceiling is still local.

**Recommendation**: introduce `SdlcRetryPolicy` as a typed carrier on `SdlcConformProjectProfile` or `SdlcProjectConstraints` (the constraints file already carries `ambiguity_risk_appetite`; a `retry_max_attempts` field is the same shape). Plumb it through `executeInstalledOperatorStart`. This is a small change that closes the policy-leakage door before the ABG continuation truth becomes a proxy for the local literal.

### 6. Medium [O]: `classifyPostflightGapReason` is substring matching with order-sensitive overlap

`handoff.ts:541-567`:

```ts
function classifyPostflightGapReason(reason: string): SdlcPostflightGapReasonClass {
  if (reason.includes("relative_path") || reason.includes("manifest_mismatch") || ...) {
    return "contract_violation";
  }
  if (reason.includes("unresolved_reasons")) { return "worker_unresolved"; }
  if (reason.includes("missing") || reason.includes("empty")) { return "missing_evidence"; }
  if (reason.includes("test")) { return "code_to_test"; }
  if (reason.includes("source") || reason.includes("materialized_product")) { return "authority_to_code"; }
  return "unknown";
}
```

Order-sensitive overlap: a hypothetical reason `materialized_product_test_missing` matches "missing" first and classifies as `missing_evidence` rather than `code_to_test` or `authority_to_code`. Today the closed reason set in `evaluateMaterializedProductFiles` (`handoff.ts:419-472`) and `evaluateWorkerResultPostflight` (`:474-520`) does not include such a reason, so the bug is latent.

But this is exactly the class of "implicit operator interpretation" T-076 line 52 forbids. Substring rules are not a deterministic classifier — they are a heuristic that happens to work on the current alphabet.

**Recommendation**: emit blocking reasons as typed values (e.g., a `SdlcPostflightBlockingReason` discriminated union) and ship a closed `Record<BlockingReasonKind, ReasonClass>` map. Today's `blockingReasons: string[]` is a string carrier; promoting it to a typed sum aligns with the design doc's FP-shape guidance (lines 125–149) and the ticket's `Functional Programming Shape` section.

### 7. Low [D]: design doc claim "the failed path does not close the vector" deserves an inline note pinning this to ABG behavior

`ODD_SDLC_TYPESCRIPT_DETERMINISTIC_TRAVERSAL_STATE_MACHINE.md:96-98`:

> The failed path does not close the vector. Replay keeps the same current edge open, records retry attempt truth, and allows the next handoff to carry the prior gap dossier.

This is correct *because* ABG's projection treats `vector_evaluated(blocked)` as recording an evaluation but not closing the vector (`projection.ts` handles `vector_closed` separately via the `closedBy` mechanism — confirmed at lines 170–176). The design doc reads as if odd_sdlc owns this rule, but the rule is actually ABG's. The `Authority Split` table (line 33–57) lists "execution basis ... event truth ... replay projection" under ABG, but a reader could miss that "vector closure semantics on blocked evaluation" sits under "replay projection".

**Recommendation**: add one sentence to the design doc stating that the open-on-blocked invariant is ABG's projection contract and citing the abiogenesis projection module. This protects the design from drifting if a future ABG change closed vectors on `vector_evaluated(blocked)`.

### 8. Low [O]: `nextLawfulAction` is now derived from emitted events, but the relationship is not isolated as a projection function

`installed_operator.ts:560-563`:

```ts
nextLawfulAction:
  emitted.some((event) => event.kind === "retry_repair_planned")
    ? "retry_same_edge_with_gap_dossier"
    : "triage_gap",
```

Good: `nextLawfulAction` is computed *from* admitted event truth, not from operator memory. Bad: the computation is inline and reusable elsewhere only by accident.

The prior T-076 review (Finding 6) recommended "operator summary surfaces persisted on the start-resumption read path" as a non-closure condition. The current implementation does not violate this — `start` resumes by reading `events.jsonl`, not the operator summary archive. But isolating the projection makes the property machine-checkable.

**Recommendation**: extract `projectNextLawfulAction(events: readonly RuntimeEvent[]): string` as a pure function in `installed_operator.ts` or `event_store.ts`. The function takes only the emitted event slice and returns the action prose. A unit test asserts `projectNextLawfulAction(events).includes(retry_repair_planned events) ⇔ "retry_same_edge_with_gap_dossier"`. This makes "summary is a read model over events" enforceable rather than aspirational.

### 9. Low [D,T]: design doc IACS row for `RuntimeEvent[]` does not enumerate which events the slice may emit

`ODD_SDLC_TYPESCRIPT_DETERMINISTIC_TRAVERSAL_STATE_MACHINE.md:69`:

| `RuntimeEvent[]` | traversal truth | ABG event calculus | `vector_evaluated`, `retry_repair_planned`, `retry_attempt_opened`, optional continuation events, or `assessed` | archive-only status |

The actual emission is broader: per `installed_operator.ts:316-324` and the test assertion at line 196–205, the *full* failed-path sequence is `graph_call_opened, frame_opened, vector_traversal_planned, vector_evaluated, retry_repair_planned, retry_attempt_opened, continuation_terminated, continuation_reopened`. The first three come from `runtimeEventsForIterationDecision(decision)` at `:317`. The IACS row's enumeration ("`vector_evaluated`, `retry_repair_planned`, ...") is incomplete.

**Recommendation**: extend the IACS row or add a sub-table listing the ordered event sequence the slice emits on (a) pass path and (b) fail-with-retry path. The test already encodes this oracle (`test_t076_deterministic_traversal_state_machine.test.mjs:196-205`); promoting it to the design doc closes the documentation/test loop.

### 10. Low [T]: test asserts `nextLawfulAction === "retry_same_edge_with_gap_dossier"` but doesn't assert the second run's retry-attempt-count from ABG's projection

`test_t076_deterministic_traversal_state_machine.test.mjs:225` checks `priorGapDossiers.length === 1`. It does not check that `manifest.retryContext.retryAttemptRefs.length === 1` or that `retryAttemptRefs[0].attemptIndex === 1`. The latter is the ABG-side invariant — that the projection counts one attempt before the retry is dispatched.

**Recommendation**: add `assert.equal(second.manifest.retryContext.retryAttemptRefs.length, 1)` and assert `attemptIndex` at minimum. This pins the ABG-side contract independently of the gap-dossier round-trip.

## Items For Cross-Referencing

The following observations don't require code changes but are worth recording:

- **Slice scope alignment with prior review Finding 1**: this implementation lands the postflight-failed transition *only*, and the design doc explicitly defers full data_mapper RC parity (line 171–174). That matches the recommended split (T-076 closure narrowed; T-076a successor for worker_failed/report_rejected; T-076b for path-basis contract — already absorbed into this slice; T-076c for installed proof — pending). The split was implicitly applied even if the ticket frontmatter was not formally split.
- **Authority Split is per-concern, not per-state**, which is what the prior review's Finding 3 recommended. Cleaner than annotating the 22-state catalog row-by-row.
- **`evaluateWorkerResultPostflight` and `deriveWorkerHandoffManifest` co-located in `handoff.ts`** is a modularity smell — handoff (pre-) and postflight (post-) are different lifecycle phases sharing only the manifest carrier. Splitting `handoff.ts` into `handoff_manifest.ts` + `postflight.ts` would track the design doc's "Functional Shape" pipeline (line 129–135) more directly. Not a closure blocker; flag for cleanup pass.

## Closing

The slice's central act — promoting failed worker postflight from archive prose into typed gap dossier + ABG retry/continuation events with replay-derived re-entry — is correct and matches T-076's algebraic prescription. The closure law's primary deliverable (line 47: "a failed `derive_code_surface` postflight becomes an admitted gap/continuation surface rather than a terminal archive-only stop") is met for the worker-postflight path.

The *same* algebraic break still exists at three adjacent boundaries (Finding 1: hook-postflight; Finding 2: worker_failed and worker_report_rejected). The fix is local to the worker-postflight path. Closing those is the remaining work to prevent T-076 from becoming a precedent for "fix one transition and call the algebra closed."

Findings 3 (manifestId/gapDossier overloading) and 5 (hardcoded maxAttempts) are the items most worth resolving before the slice is taken as load-bearing for downstream work, because both are exactly the patterns the ticket's `non_closure_conditions` warned against — implicit interpretation and local policy bleeding into deterministic transitions.
