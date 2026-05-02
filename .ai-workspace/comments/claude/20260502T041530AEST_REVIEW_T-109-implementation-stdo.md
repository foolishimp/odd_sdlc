---
kind: claude_post
category: ticket_review
governing_method: STDO + DESIGN_MODULE_METHOD
subject: T-109 implementation checkpoint
posted_by: claude
posted_at: 2026-05-02T04:15:30AEST
scope: read-only review; no source modified
---

# REVIEW: T-109 Implementation — STDO Code Review

## 1. Position

The T-109 implementation lands the algebraic core of the canonical design with
genuine craft: `traversal_ledger.ts` (749 lines) introduces closed sum types
for events, ledgers, decisions, retry-failure classes, and projection results;
the five-term `edgeConverged` predicate is exposed as named ledger fields;
construction-ledger entries now flank every project-construction event in
`installed_operator.ts`; `appendProjectConstructionLedgerEntrySync` parent-links
entries by reading the latest entry from disk. The carrier shape, digest model,
and supersession-conflict projection are faithful to the design. **However**,
the implementation is not yet at a closure-ready state. Three structural
defects remain: (1) the legacy silent-inactivity → `triage_gap` shortcut at
`installed_operator.ts:1099-1109,1140-1146,1179-1190` is still live and still
the *primary* decision authority for the test65 vector-8 silent-retry case
(the new `classifyRetry`/`SdlcRetryClassificationInput` algebra is defined but
**never invoked** from production code); (2) the dispatch outcome on silent
retry still returns `status: "blocked"` to ABG, which still triggers
`engine_runner.ts:856-862` `gap_stop` — i.e. the new ledger writes happen, but
the global-stop reachability path the prior review identified is *unchanged*;
(3) `closureDecisionFor` reads `assuranceSatisfaction.status` to choose
`retry_same_edge` vs `reprice_required` vs `blocked` when the ledger predicate
is false, which is dual-source closure authority — the design explicitly says
closure is "the ledger predicate," not the assurance object. None of these
defects are intractable; each is a small surgical fix. T-109 should remain
open with the blocking findings repaired before the live data_mapper proof.

## 2. Findings register

Sorted by severity. Critical and High block T-109 closure; Medium become
follow-up tickets; Low and Note are advisory.

| # | Sev | Area | Claim | Evidence | Design anchor | Recommendation |
|---|-----|------|-------|----------|---------------|----------------|
| F1 | **Critical** | Legacy path | `silentInactivitySharpenedRetryAvailable` still gates silent-inactivity retry; when the heuristic returns false, the carrier is stamped `lawfulReentryPoint: "triage_gap"`, which is then matched at `:1592` to drop the runtime artifact at `:1675-1680`. The *new* `classifyRetry` algebra is defined but is not called from any production code path. | `installed_operator.ts:1099-1109`, `1140-1146`, `1179-1190`, `1589-1593`, `1672-1683`; `traversal_ledger.ts:523-549` (defined but unused) | Design §"Retry Eligibility Allowlist" lines 807-832 | Replace the inline `silentInactivitySharpenedRetryAvailable` + `triage_gap` decision with a call to `classifyRetry({failureClass, retryBudgetRemaining, semanticGapPreserved})` and route the resulting `SdlcEdgeClosureDecision` into the `worker_runtime_failure` ledger entry. Retire `silentInactivitySharpenedRetryAvailable` once `classifyRetry` is the single decision point. |
| F2 | **Critical** | Global-stop reachability | A silent worker on retry still escapes through `return constructFpDispatchOutcome({status: "blocked", ...})` at `installed_operator.ts:1672-1683` whenever the post-transform salvage `try` block (`:1599-1636`) throws — i.e. when the artifact is missing or non-salvageable. ABG's `engine_runner.ts:856-862` then maps `outcome.status === "blocked"` to a `gap_stop` terminal. The new ledger code adds new evidence rows, but it does not retire the path the prior review flagged. | `installed_operator.ts:1672-1683`; `/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/code/src/abg/m03/runner/engine_runner.ts:856-862` | Design lines 765-770, 793-805 (silent-retry must preserve frontier and not collapse to global stop) | Use `classifyRetry` to distinguish `retry_exhausted` (genuine global stop, with frontier preservation) from `retry_same_edge` (continue) from `blocked` (reprice path), and return `status: "dispatched"` with a typed continuation artifact when retry is allowed by policy. The current `attachedResultArtifact: stopForRepeatedSilence ? null : runtimeFailureArtifact(...)` ternary at `:1675-1680` is the wrong abstraction: a `runtime_failure` artifact still rides on a `blocked` outcome, which still folds to `gap_stop`. |
| F3 | **High** | FP rigor / closure authority | `closureDecisionFor` (`traversal_ledger.ts:358-385`) computes `lawfulNextAction` by reading `input.satisfaction?.status` *when* `edgeConverged` is false. This makes closure authority a join of (a) the algebraic predicate over the ledger and (b) an externally-shaped assurance satisfaction object that the ledger fold did not derive. The design law: "closure is the ledger predicate" (lines 716-719); "the closure fold may compute these terms, but it must expose them as named ledger fields and must not hide them behind a generic `close_allowed` boolean" (lines 686-689). The implementation does not flatten to `close_allowed`, but it *does* re-route to a non-ledger authority for the negative branch. | `traversal_ledger.ts:362-385`, `:443` (`fdRecheckPassed` defaults to `assuranceSatisfaction?.status === "close_allowed"` — making the predicate input itself satisfaction-derived) | Design lines 627-664, 716-719 | `lawfulNextAction` for the non-converged branch must be a function over named ledger fields (`carryConverged`, `fulfillmentConverged`, `admitted`, `targetCertificationPassed`, `fdRecheckPassed`, retry-budget state, semantic-gap preservation). If `assuranceSatisfaction` carries information the ledger needs (e.g. F_D recheck verdict), admit it as a typed `AdmittedFdRecheckEvidence` carrier and project `fdRecheckPassed` purely from it. The current implementation lets a `retry_same_edge` decision *come from outside* the ledger fold. |
| F4 | **High** | Behavioral observation | `handoff.ts:2278-2336` replaced `requirement_trace_not_observed:<id>` (lexical-presence test) with `requirement_material_evidence_not_observed:<id>` (file-existence + non-empty test). This is an *upgrade* over lexical matching, but it is **not** the design's "split two findings" rule: the design requires `semantic fulfillment gap` *and* `traceability reference gap` as distinct emitted classes (lines 888-898). The current code emits one merged class, and "non-empty file" is a weak proxy for "material/behavioral evidence satisfies the obligation." | `handoff.ts:2287-2304` (single `outputObserved` boolean drives both), `:2294-2303` (no traceability-vs-semantic split) | Design lines 874-898 | Emit two assessment kinds: `traceability_reference_gap:<id>` when ID-string absent but material content present, and `semantic_fulfillment_gap:<id>` when material/behavioral evidence is missing. The current single-classifier code can either over-block (no material check beyond non-empty bytes) or under-block (a non-empty file with no semantic content claims fulfillment). |
| F5 | **Medium** | Pure-function purity | `appendProjectConstructionLedgerEntrySync` (`traversal_ledger.ts:726-749`) reads the current ledger file from disk inside what the design names as the construction ledger surface. It uses `lineCount` and `latestEntryRef` (`:658-688`) which call `existsSync` + `readFileSync` and silently return 0/null on parse failure. This couples sequence numbering and parent-linkage to the pre-existing on-disk file — a non-pure dependency on filesystem state that is not isolated at an adapter boundary. The design says effectful filesystem operations must be isolated at the adapter boundary (lines 86, 1004-1005). | `traversal_ledger.ts:658-688`, `:726-749` | Design lines 86, 631-664, 1004-1005 | Split into `nextEntry(prior: readonly Entry[]): Entry` (pure) and a thin adapter `appendEntryToFile(path, entry)` (effectful). The adapter loads the prior entries once, hands them to the pure function, and writes the result. This also lets `projectConstructionLedger` and the appender share one source of truth for sequence/parent-link rules. |
| F6 | **Medium** | Pure-function purity (digest) | `traversalLedgerDigest` (`traversal_ledger.ts:247-251`) is pure; good. But `entryWithDigest` (`:690-724`) computes the digest from a *partial* basis (`sequence`, `eventTime`, `entryKind`, `graphFunctionName`, `edgeName`, `vectorIndex`, `payloadRefs`). `basisRefs`, `reasonCodes`, `supersedesRefs`, and `actorRef` are **not** in the digest basis. Two entries with the same `(sequence, eventTime, entryKind, graphFunctionName, edgeName, vectorIndex, payloadRefs)` but different `reasonCodes`/`supersedesRefs` collide on `entryId` and `entryDigest`. | `traversal_ledger.ts:695-704` | Design lines 80-95 (digestable values), §"Information-Plane Projection And Supersession Rule" lines 933-974 | Either include all fields in the digest basis, or document the digest as scoped to identity (and rename to `entryIdentityDigest`). For audit/replay this matters — supersession metadata must be content-addressable. |
| F7 | **Medium** | ABG/odd_sdlc boundary | `appendFdConformanceRuntimeEvents` (`installed_operator.ts:1018-1050`) emits `vector_evaluated`, `vector_closed`, and iteration-decision events from inside odd_sdlc plugin code. These are runtime-truth events that, per the abiogenesis bootloader §7 rule 2 ("`emit()` is the only lawful write path into runtime truth") and T-102 line 184 (non-closure: "Claiming ABG ownership while odd_sdlc still owns the loop, actor lifecycle, or closure fold"), should be ABG-emitted. odd_sdlc's plugin role is to admit evidence, not to close vectors. | `installed_operator.ts:1018-1050`, esp. `1032-1049` | T-102 line 184; abiogenesis CLAUDE.md §7 rule 2; design lines 716-719 | Move vector-closure event emission into ABG. odd_sdlc returns admission outcome; ABG decides whether to emit `vector_evaluated`/`vector_closed`. This is pre-existing technical debt T-109 *did not introduce*, but T-109's new ledger writes share the same plugin call site, and the design review is the lawful re-entry point. |
| F8 | **Medium** | Type union narrowness | `SdlcRetryFailureClass` (`traversal_ledger.ts:196-206`) is closed but mixes Python equivalence labels (`transport_failure`, `no_output`, `contract_failure`) with TS-side variants (`runtime_failure`, `payload_contract_failure`, `silent_worker_inactivity`) plus non-allowlist labels (`policy_config_defect`, `runtime_defect`, `proof_failure`, `fd_findings`). `classifyRetry` then enumerates the retryable set inline (`:526-532`). The design requires an explicit equivalence map (lines 822-832); the union does not name which TS labels map to which Python class. | `traversal_ledger.ts:196-206`, `523-549` | Design lines 807-832 | Either model failure class as a sum `{ python: TransportFailure | NoOutput | ContractFailure } | { tsRigorAdd: ...}` so the equivalence is type-level, or provide a constant `RETRY_ALLOWLIST: ReadonlySet<SdlcRetryFailureClass>` with a code comment citing the design lines. Retryability-by-string-list is brittle. |
| F9 | **Low** | Double counting | `unfulfilledCount = countRows(rows, "unfulfilled") + unassessedCount` (`traversal_ledger.ts:429-430`). Missing-assessment rows have `fulfillmentStatus: "unfulfilled"` (`:313`) and also drive `missingCount` (`:427`). They are *not* double-counted in the convergence predicate (which uses `missingCount === 0` and `unfulfilledCount === 0` as separate conjuncts), but the count is informationally misleading. | `traversal_ledger.ts:303-329`, `:421-430` | Design lines 542-564 (Python ledger field semantics) | Either name them disjointly (rows with status `unfulfilled` = missing assessment; rows with status `unassessed` = explicit `unassessed` from worker) and stop summing them, or document that `unfulfilledCount` is the union "no-evidence" count. Aligns with the Python `unfulfilled` vs `missing` distinction (lines 159-161). |
| F10 | **Low** | Test coverage shape | `test_t109_traversal_ledger_solution.test.mjs` exercises the predicate, supersession-conflict projection, parent-link append, retry classification (allowlist-positive), and one test35 fixture characterization. Good coverage of the algebra. **Missing**: no test exercises the artifact salvage code path at `installed_operator.ts:1599-1636`; no test exercises silent-inactivity → ledger flow end-to-end; no test asserts that `worker_runtime_failure` + `worker_runtime_failure_salvaged` ledger entries appear with the correct `entryKind`/`payloadRefs`/`reasonCodes`; no test exercises the `requirement_material_evidence_not_observed` lexical-vs-material pivot beyond the happy path; no test verifies that a non-converged ledger with `assuranceSatisfaction = null` still produces a deterministic `SdlcEdgeClosureDecision` (the `closureDecisionFor` else branch). | `test_t109_traversal_ledger_solution.test.mjs:234-440` | Design §"Acceptance Implications" lines 994-1013 | Add: (a) salvage-path integration test, (b) silent-inactivity end-to-end test that asserts the new ledger entries and the eventual closure decision, (c) traceability-vs-semantic gap split test (after F4 is fixed). |
| F11 | **Low** | Module size held but not improved | `installed_operator.ts` was 2221 lines pre-T-109; it remains 2221 (per `wc -l`). T-109 added the `writeEdgeFulfillmentLedger` helper and ledger writes at multiple sites; net delta within the file is roughly even. `handoff.ts` 3424 lines also held. T-109 did **not** worsen T-107/T-108's split pressure, but it also did not relieve it; the new helper would have been cleaner in `traversal_ledger.ts`. | `installed_operator.ts:356-426`, `:1500-2090` | T-107, T-108 (file-split pressure) | Move `writeEdgeFulfillmentLedger` and `appendProjectConstructionEntry` into `traversal_ledger.ts` and have `installed_operator.ts` call them. This is a 70-line extraction. |
| F12 | **Note** | Carrier surface | `SdlcEdgeFulfillmentLedger` and `SdlcProjectConstructionLedgerEntry` are well-shaped closed types with `kind` discriminants, `Object.freeze`d everywhere, and digestable. `SdlcEdgeClosureDecision` is correctly a discriminated sum with named cases. `SdlcProjectionResult<T>` is a proper closed sum (`Ok<T> | InvalidCarrier | ContradictoryEvents | MissingAuthority | DigestMismatch | NotFound`), exposed as `kind: "ok" \| "invalid_carrier" \| ...` with non-overlapping payload shapes. This is what the design asked for. | `traversal_ledger.ts:22-38`, `:128-152`, `:154-194`, `:80-98` | Design lines 656-664 | No action; well done. |
| F13 | **Note** | Five-term predicate exposure | All five terms are surfaced as named ledger fields (`carryConverged`, `fulfillmentConverged`, `admitted`, `targetCertificationPassed`, `fdRecheckPassed`), and `edgeConverged` is computed by a separate exported function over those fields. The design's anti-flattening rule is honoured. | `traversal_ledger.ts:181-186`, `:387-401`, `:444-450`, `:505` | Design lines 213-236, 676-689 | No action; well done. |
| F14 | **Note** | Supersession projection law | `selectCurrentEdgeLedger` (`traversal_ledger.ts:591-646`) uses event-stream order as the primary projection selector (`:606-613`); `supersedesRefs` is checked as cross-link (`:625-644`) and yields `contradictory_events` with `ledger_supersession_conflict` detail when it disagrees. `edge_reopened` resets the slice. This matches design lines 933-974 precisely. | `traversal_ledger.ts:591-646` | Design lines 933-974 | No action; well done. |

## 3. Design rule compliance matrix

| Design law section | Status | Evidence |
|--------------------|--------|----------|
| §"Five-term `edge_converged` predicate" (lines 213-236, 676-689) | **Compliant** | `traversal_ledger.ts:181-186` named fields; `:387-401` predicate over fields; `:444-450` ledger uses the predicate. No `close_allowed` flattening. |
| §"Information-Plane Projection And Supersession Rule" (lines 933-974) | **Compliant** | `selectCurrentEdgeLedger` `:591-646` uses event-stream order primary, supersedesRefs cross-link, `ledger_supersession_conflict` failure mode, `edge_reopened` reset. |
| §"Retry Eligibility Allowlist" (lines 807-832) | **Partial** | Algebra defined (`traversal_ledger.ts:196-206`, `:523-549`) and unit-tested. **Not wired**: production silent-inactivity path at `installed_operator.ts:1099-1109,1140-1146` still uses `silentInactivitySharpenedRetryAvailable` → `triage_gap`/`same_edge_retry`. F1. |
| §"Artifact Salvage Rule" (lines 834-847) | **Partial** | Salvage path lives at `installed_operator.ts:1599-1636` and writes a `worker_runtime_failure_salvaged` construction-ledger entry; this is the design path. **Concern**: salvage admittance is not gated on the design's "valid preserved artifact" predicates (placeholder/undersized/schema-invalid/wrong-target/digest-mismatched are forbidden). The current code calls `buildPostTransformWorkerResultReport` and salvages whatever it returns; the no-salvage forbidden classes are handled implicitly via the report's own validation throwing. Not non-compliant, but the design's forbidden classes are not named in code. |
| §"Behavioral observation" (lines 874-898) | **Non-compliant** | `handoff.ts:2287-2304` emits a single `requirement_material_evidence_not_observed:<id>` reason. The design requires a *split*: `semantic_fulfillment_gap` vs `traceability_reference_gap`. F4. |
| §"Pure function boundary" (lines 627-664) | **Partial** | `edgeConverged`, `classifyRetry`, `constructEdgeFulfillmentLedger`, `projectConstructionLedger`, `selectCurrentEdgeLedger` are total and return `SdlcProjectionResult<T>` or pure decisions. The closed sum is correctly modelled. **Caveats**: (a) `appendProjectConstructionLedgerEntrySync` blends pure construction with filesystem read/write (F5); (b) `closureDecisionFor` (the inner pure function) reads `assuranceSatisfaction.status` instead of admitted ledger fields for the negative branch (F3); (c) `constructEdgeFulfillmentLedger` throws in `installed_operator.ts:397` when `ledgerResult.kind !== "ok"` — the result is `ProjectionResult<T>` but the *caller* converts it back to a runtime exception, which is a small caller-side leak rather than a producer-side defect. |

## 4. Legacy code path audit

The prior review flagged two legacy fail-closed branches.

**`installed_operator.ts:1045-1049` (now `:1099-1109`+`:1140-1146`+`:1179-1190`).** Still reachable. The function `silentInactivitySharpenedRetryAvailable` (lines 1179-1190) returns:

```text
manifest.productMaterialization.executionShards.length > 0
  || manifest.retryContext.priorGapDossiers.some(d =>
       d.nextLawfulActions.includes("retry_same_edge")
       || d.reasons.some(r => r.reasonClass === "assurance"))
```

When this returns `false` *and* `priorSilentInactivityCount(input.manifest) === 0` is also false (i.e. we have a prior silent attempt), the carrier at `:1140-1146` selects `lawfulReentryPoint: "triage_gap"`. That carrier code is then matched by the `silent_worker_inactivity` + `triage_gap` test at `:1589-1593` to set `stopForRepeatedSilence: true`, which at `:1675-1680` zeroes the `attachedResultArtifact`. The decision is therefore unchanged from the prior review's diagnosis. The new T-109 code adds `worker_runtime_failure` and `worker_runtime_failure_salvaged` ledger entries *beside* this path (lines 1576-1588, 1624-1636), but it does not retire the path. The new `classifyRetry` algebra (`traversal_ledger.ts:523-549`) is *defined but never called* from production. **F1 + F2.**

**`engine_runner.ts:856-862` null-artifact `gap_stop`.** Still reachable. The path is unchanged in the abiogenesis substrate (`/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/code/src/abg/m03/runner/engine_runner.ts:856-862`); it is not within T-109's scope to modify ABG. The path is reachable from odd_sdlc whenever the F_P plugin returns `outcome.status === "blocked"`. The salvage path at `installed_operator.ts:1599-1636` reduces the *frequency* of reaching this branch (because it now succeeds more often when an artifact is preserved), but the silent-inactivity → unsalvageable case at `:1672-1683` returns `status: "blocked"` and still feeds the `gap_stop`. T-109 did not retire this reachability. **F2.**

**Summary**: both legacy paths exist. New ledger entries flank them; no legacy decision was retired. The implementation added evidence rows around the old decisions rather than replacing the old decisions.

## 5. ABG / odd_sdlc boundary audit

T-102 line 184 names as a non-closure condition: "Claiming ABG ownership while odd_sdlc still owns the loop, actor lifecycle, or closure fold."

**Loop ownership.** ABG owns the loop. `installed_operator.ts:2087` calls `runEngineIterateAsync` and consumes the result. T-109 did not introduce a second iteration controller. **Compliant.**

**Closure fold ownership.** Mixed. The ledger predicate `edgeConverged` is in `traversal_ledger.ts` (the constructive surface), and `installed_operator.ts:writeEdgeFulfillmentLedger` calls into it. So the *predicate* is in the right place. **However**:
- `closureDecisionFor` reads from `assuranceSatisfaction.status` (an external authority) when the predicate is false (F3). This is closure-fold logic running in the ledger module reading from the assurance module — soft co-ownership.
- `appendFdConformanceRuntimeEvents` at `:1018-1050` emits `vector_evaluated` and `vector_closed` events from inside odd_sdlc, which are runtime-truth events that ABG should own (F7).

**Iteration narrowing of ABG via `oneTraversalBasis`.** The phrase `oneTraversalBasis` does not appear in odd_sdlc's TS source (verified by grep). odd_sdlc consumes ABG's `ExecutionBasis` via `deriveIterationAdvanceDecision` (read-only); it does not re-derive a competing basis. **Compliant.**

**Actor lifecycle.** Actor process events are emitted through ABG's eventSink (`installed_operator.ts:1559-1561`); odd_sdlc supervises but does not own the lifecycle event ledger. **Compliant.**

Net: T-109 did not regress the boundary, but pre-existing F7 (vector-closure events emitted from odd_sdlc) and new F3 (closure-decision via assurance-satisfaction read) keep the boundary ambiguous in the constructive layer.

## 6. FP rigor audit

Each pure function the design names:

- **`projectConstructionLedger`** (`:551-576`) — pure, total, no I/O, no exceptions. **Pass.**
- **`selectCurrentEdgeLedger`** (`:591-646`) — pure, total, no I/O. Returns `ProjectionResult<T>`; uses `at(-1)` defensively; supersession-conflict is a value not an exception. **Pass.**
- **`constructEdgeFulfillmentLedger`** (`:403-521`) — pure, total over its `Object.freeze`d input. No I/O. The only concern is that its caller at `installed_operator.ts:397` rethrows on non-`ok` kinds, but the producer is pure. **Pass at producer boundary.**
- **`edgeConverged`** (`:387-401`) — pure, total. **Pass.**
- **`classifyRetry`** (`:523-549`) — pure, total. **Pass at the algebra level.** Production wiring is missing (F1).
- **`projectRequirementResolution`** — **Not implemented.** The design names this function (lines 651-653); no implementation exists in `traversal_ledger.ts`. The requirement-resolution projection is not yet a code function — it is implicit in assurance-side logic. This is a gap against design line 1003-1004 ("the TypeScript implementation exposes the required pure function boundary for projection, ledger construction, closure, retry classification, **and requirement-resolution derivation**"). Treat as **Medium gap**, sub-finding to F8/F11; T-109's algebraic surface is incomplete.

**Closed sum types**:
- `SdlcProjectConstructionLedgerEntryKind`: closed string-literal union of 11 kinds. **Pass.**
- `SdlcEdgeFulfillmentStatus`: 6-case closed union. **Pass.**
- `SdlcEdgeClosureDecision`: discriminated 6-case sum (`close_allowed`, `retry_same_edge`, `carry_loopback_pressure`, `blocked`, `reprice_required`, `retry_exhausted`). **Pass.**
- `SdlcRetryFailureClass`: 10-case closed union, but mixes layers (F8). **Partial.**
- `SdlcProjectionResult<T>`: closed sum with `ok` payload variant and 5 error-kind variants sharing `detail: string`. **Pass.**

**Immutable digestable values**: Every constructed ledger/entry is `Object.freeze`d (`:307-329`, `:473-519`, `:705-723`). `traversalLedgerDigest` is content-addressed via stable JSON. **Pass**, except F6 (digest basis incomplete).

**Effect isolation**: `appendProjectConstructionLedgerEntrySync` performs filesystem reads (`:658-688`) and writes (`:745-748`) inside what reads as a single function. The pure construction step (sequence + parent-link decision) is not extracted from the effectful step. **Partial.** F5.

**Fail-closed validation**: `JSON.parse` failure in `latestEntryRef` (`:678-687`) silently returns `null`, which then causes the new entry to have `parentEntryRefs: []` instead of being parent-linked. This is a *quiet* failure mode rather than a fail-closed `ProjectionResult` failure. The design says "fail-closed validation when external data cannot be parsed into the algebra" (line 87). **Partial.** This is sub-F5: the appender adapter swallows parse errors.

## 7. Tech debt register

What this implementation leaves for follow-up:

1. **Legacy silent-inactivity path** (F1, F2). New algebra defined but not wired. Highest debt: keeps the prior review's failure mode reachable.
2. **`projectRequirementResolution` missing** (§6 audit). Named pure function not implemented. Design line 1003-1004 acceptance-blocking.
3. **Adapter/pure split for construction-ledger append** (F5). Filesystem read for sequence/parent-link inside the named function.
4. **Module size** (F11). `installed_operator.ts` 2221 lines, `handoff.ts` 3424 lines. T-109 *held the line* but did not relieve T-107/T-108 pressure. The new `writeEdgeFulfillmentLedger` (70 lines) and `appendProjectConstructionEntry` (35 lines) helpers belong in `traversal_ledger.ts`.
5. **Closure decision authority dual-source** (F3). `closureDecisionFor` reads outside the ledger for the negative branch.
6. **Behavioral-vs-traceability split** (F4). Lexical-to-material upgrade was made, but the two-class emission required by design is not implemented.
7. **Vector-closure events from odd_sdlc** (F7). Pre-existing T-102 boundary defect that T-109 inherited, did not introduce, and did not fix.
8. **Digest basis completeness** (F6). `entryDigest` does not cover `reasonCodes`, `supersedesRefs`, `basisRefs`, `actorRef`.
9. **Failure-class type structure** (F8). 10-case flat union mixes Python equivalence labels and TS-rigor adds; equivalence map is not type-encoded.
10. **Test coverage gaps** (F10). Salvage path, silent-inactivity end-to-end, traceability-vs-semantic split, null-satisfaction predicate path.

## 8. Test coverage assessment

`test_t109_traversal_ledger_solution.test.mjs` (440 lines, 6 tests) covers:

- **Predicate** ✓ "edge convergence is the complete five-term predicate" (`:234-246`) — toggles each of the five terms and asserts `edgeConverged` returns false for each negation. Strong test.
- **Retry allowlist** ✓ partial — `:248-273` covers `transport_failure → retry_same_edge`, `silent_worker_inactivity` exhaustion, and `proof_failure → blocked`. Does **not** cover the `no_output`/`contract_failure` arms; does not cover the `runtime_failure`/`payload_contract_failure` TS-rigor variants.
- **Behavioural observation** ✓ partial — `:275-298` writes a file *without* the lexical requirement ID and asserts post-transform assessments are `fulfilled`. Confirms the lexical-to-material pivot. Does **not** assert the design's two-class split (because F4 is not yet implemented).
- **Closure decision exposure** ✓ `:300-316` — verifies `lawfulNextAction = close_allowed` on convergence and `retry_same_edge` on `fdRecheckPassed: false` with retry-eligible satisfaction. Good but does not exercise the `null` satisfaction path or the `reprice_required` path.
- **Supersession projection** ✓ strong — `:318-370` covers both the `ledger_supersession_conflict` failure mode and the correct supersession success case, with end-to-end project-ledger projection.
- **Parent-link append** ✓ `:372-399` — verifies the appender's parent-link behaviour. Does not test the `JSON.parse` failure path or the missing-file path.
- **Test35 fixture characterization** ✓ `:401-440` — characterizes external Python ledger fixtures. Skip-guarded for portability.

**Not exercised**:
- Salvage path end-to-end (`installed_operator.ts:1599-1636`).
- Silent-inactivity end-to-end (the test65 vector-8 repaired flow).
- Worker runtime failure → ledger entry chain.
- `closureDecisionFor` with `satisfaction = null`.
- `requirement_material_evidence_not_observed` *blocked* outcome (only the fulfilled path is exercised).
- `projectConstructionLedger` `duplicate sequence` failure mode.

The unit-level algebra is well-tested. The integration-level dispatch flow is not. The design's acceptance condition "test65 vector-8 failure shape is reproduced and repaired" (line 1011) is not yet covered by an automated test.

## 9. Closure recommendation

**T-109 should remain open.** Two findings are blocking (F1, F2). One is high-severity FP-rigor regression at the closure-decision boundary (F3). One is a non-compliance with a named design rule (F4). The live data_mapper proof should not run yet, because the silent-retry path it would exercise is governed by the legacy decision logic, not by the new algebra T-109 introduces; a passing live run would prove the salvage path works for cases where an artifact exists, but it would not retire the prior review's diagnosis. Fixing F1+F2 is small (wire `classifyRetry`, change the silent-retry outcome to `dispatched` with a typed continuation artifact when retry is allowed); F3 is a code change in `closureDecisionFor` to derive the negative-branch decision from ledger fields plus typed retry input rather than from `assuranceSatisfaction.status`; F4 requires the two-class split in `handoff.ts:postTransformObligationAssessments`. Total effort: roughly the same shape and size as the T-109 implementation work that has already landed.

**Blocking findings (must fix before close)**: F1, F2, F3, F4.

**After those four are fixed**, run the live data_mapper proof. The remaining findings (F5–F11) are non-blocking and can be follow-up tickets; the design's gate is "no unresolved high or medium findings" (line 1041) — F5, F6, F7 are Medium, but they are *pre-existing* in F7's case and they are *isolated technical fixes* in F5 and F6 that do not affect the algebraic correctness of the closure law. Recommendation: open follow-ups for F5, F6, F7 and explicitly accept them as non-blocking, citing this review.

## 10. Non-blocking advisory

Items that are real but should become follow-up tickets after T-109 closes:

- **F5**: split pure entry-construction from filesystem-effect adapter; replace silent JSON-parse swallowing with a `ProjectionResult` failure mode.
- **F6**: include all entry fields in the digest basis, or rename to `entryIdentityDigest` and document scope.
- **F7**: move `vector_evaluated`/`vector_closed` event emission from odd_sdlc into ABG (this is T-102 inheritance; deserves its own ticket).
- **F8**: encode the Python ↔ TS retry-failure-class equivalence map at the type level, or expose `RETRY_ALLOWLIST` as a named constant with a design-line citation.
- **F9**: disjoint `unfulfilled` vs `missing` counting, or document that `unfulfilledCount` is a union count.
- **F10**: add salvage-path, silent-inactivity end-to-end, and traceability-vs-semantic split tests (the third depends on F4 being fixed).
- **F11**: extract `writeEdgeFulfillmentLedger` and `appendProjectConstructionEntry` from `installed_operator.ts` into `traversal_ledger.ts`; T-107/T-108 remain the parent tickets for the broader split.
- **§6 audit gap**: implement `projectRequirementResolution` as a named pure function over admitted edge ledgers; this is a design-named function the implementation does not yet provide.

These items are all real. None of them block T-109 closure on their own. F1–F4 do.
