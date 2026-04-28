# REVIEW: T-041 Full Operational Python-Replacement RC — Code Review

**Author**: Claude
**Date**: 2026-04-28T18:00:00Z
**Scope**: T-041 active envelope and the closed prerequisites it consolidates (T-053, T-058, T-059, T-060, T-066, T-076, T-086, T-087, T-088, T-089).
**Code surfaces examined**:
- `build_tenants/typescript/code/src/{cli,install,operator,release,workspace}` (production code paths)
- `build_tenants/typescript/code/src/operator/handoff.ts` (T-089 obligation enforcement)
- `build_tenants/typescript/test_env/test_runs/t053_live_data_mapper/20260428T042026358Z_pid46962/` (latest live F_P archive)
- `ai_sdlc_examples/local_projects/data_mapper/data_mapper.test48.ts/build_tenants/scala_spark/` (smoke materialization archive)
- `build_tenants/typescript/qualification/{ODD_SDLC_TYPESCRIPT_LIVE_PYTHON_ARCHIVE_COMPARISON,ODD_SDLC_TYPESCRIPT_PYTHON_PARITY_RC_BLOCKER_MAP}.md`
**Posture**: Commentary, not law. Reviewer-only.
**Anchoring**: STDO scope letters S/T/D/O.

## Headline

Five of T-041's six evaluation criteria are now backed by code and archive. The pressure-enforcement gap that drove the test35-vs-test51 pressure-loss diagnosis (and that the prior T-088 review flagged as Rec-1 and Rec-2) was correctly closed by T-089: every prompt-bearing edge now carries `target`, `evaluator`, `requirement`, and `prior_gap` obligations, and postflight rejects missing/unassessed/extra/unevidenced assessments through typed blocking reasons. T-086 made those reasons closed-coded carriers. **Codex executed the prior review's recommendations precisely.**

The sixth evaluation criterion ("recursive-deepening evidence" inside the historical comparator) cannot be met under T-041's current scope. Three concrete reasons:

1. **The live F_P run uses a different report contract than the production operator** (`kind: "odd_sdlc.fp_worker.work_report"` with 4 fields vs `kind: "odd_sdlc.worker_result_report"` with 10+ fields including `obligationAssessments`). T-089's pressure mechanism is *not* exercised by the run that closes eval criterion #3.
2. **The smoke-materialization archive (test48.ts) contains placeholder Scala** (5-line case class, 2 files total). Test35's archive contained 1,178 files. Whether the deepening-style pressure that produced those files is reachable under the current state machine has been explicitly closed off by the rejection of T-090.
3. **The deepening transition is out of scope** by methodological decision (T-041 line 113–114, T-090 rejection note). But eval criterion #6 names "recursive-deepening evidence" as required output. Without the transition, this criterion cannot be satisfied through new TypeScript runs — only through repricing product/requirement authority first.

The ticket's body acknowledges this as a go/no-go choice (T-041 lines 219–229). My read: the evidence currently supports closing T-041 *as bounded-RC-sufficient* but does not support closing it as *full operational Python replacement*. The semantic difference is load-bearing for downstream qualification claims.

## Per-Criterion Verdict

### EC-1 [O,T]: "CLI command grammar exposes the shared install/start/gaps/release operator surface without bypassing graph-function and ABG authority"

**Verdict**: ✅ met.

**Evidence**: `build_tenants/typescript/code/src/cli/command.ts:48-90`. Seven typed commands: `catalog`, `query-domain`, `gaps`, `start`, `install`, `release-cut`, `rc-report`. Each maps to a typed `OddSdlcCli{Traversal,Install,ReleaseCut}Request` discriminated union. `start` delegates to `executeInstalledOperatorStart` (`operator/installed_operator.ts`). `gaps` delegates to `projectSdlcGapsFromReplay`. No CLI-local traversal logic.

**Concern (low [O])**: I did not verify that the CLI never decides traversal outside ABG. Spot-checked the imports — `start` calls `publicStartOnce` then `executeInstalledOperatorStart`, both of which are ABG-projection-driven. No private state machine in the CLI. This matches T-041's `non_closure_conditions` line 65 ("CLI commands decide internal traversal outside ABG").

### EC-2 [O,D]: "install and normalize prepare an imported target workspace while preserving project-owned authority, substrate-owned surfaces, and installer-owned domain surfaces"

**Verdict**: ✅ met.

**Evidence**: `install/installer.ts:69-200`. Side-effecting npm pack + install (`packNodePackage`, `installPackedNodePackage`), ABG substrate install (`installAbiogenesisTypescript`), instruction-file writing (`writeOddSdlcInstructionFiles`), normalization output (`odd_sdlc-typescript-installation.json`), install manifest persistence. `T-087` adds project induction as `Fg_conform_project` writing `specification/requirements/00-imported-sources.md`.

**Concern (low [O])**: The install rejection path still uses stringly-typed `reason: string` (`installer.ts:198`). My prior review's CC-2 was partly addressed by T-086 inside the operator, but install rejection wasn't included in the typed blocking-reason promotion. Not a closure blocker; T-086 successor candidate.

### EC-3 [O,T]: "live data_mapper qualification traversal uses an external F_P worker and records the postmortem archive"

**Verdict**: ⚠️ met at the surface; **bypasses the load-bearing pressure mechanism**.

**Evidence**: `test_env/test_runs/t053_live_data_mapper/20260428T042026358Z_pid46962/`. Real Codex dispatch, 361.595s elapsed, verdict passed, postmortem at `postmortem.md`, event sequence `abg_installed_workspace -> public_start_projected -> external_fp_worker_dispatched -> worker_result_file_observed -> constructor_result_admitted -> hook_turn_closed`.

**Major concern (high [O,T])**: the live worker_report has `kind: "odd_sdlc.fp_worker.work_report"` and **only four fields**: `graphFunctionName`, `targetAssetType`, `generatedFile`, `summary`. The production operator's report (`evaluateWorkerResultPostflight` at `handoff.ts:1189`) requires `kind: "odd_sdlc.worker_result_report"` with `digest`, `summary`, `unresolvedReasons`, `materializedFiles`, `executionEvidence`, **`obligationAssessments`**. The live test uses a separate, simpler harness that bypasses postflight obligation enforcement entirely.

**What this means for T-041**: T-089's central improvement (declared obligations + postflight enforcement) is not exercised by the run that satisfies EC-3. The live run proves *external worker dispatch and ABG event admission*. It does not prove *typed obligation pressure on a real probabilistic worker*.

**Recommendation**: file a successor live test that uses the production operator path. The production `executeInstalledOperatorStart` is what test48.ts and test51.ts exercise; that is what should be exercised under live F_P for eval criterion #3 to be load-bearing for the operator-pressure claim. Today there are two parallel live paths and only the simpler one is being qualified.

### EC-4 [O]: "release-cut packaging and binary binding are produced by declared TypeScript surfaces rather than inferred from local dev commands"

**Verdict**: ✅ met.

**Evidence**: `release/release_cut.ts:75-121`. Calls `packNodePackage` from `package_binding/`, asserts the bin path exists in `package.json`, persists `release-cut-manifest.json` and `release-cut-postmortem.md`. The postmortem text at `release_cut.ts:70` is honest: "This release-cut proof is package evidence only. It does not claim graph traversal, live F_P execution, or installed-workspace convergence by itself." Matches T-041's `non_closure_conditions` line 66 ("release evidence is inferred from semantic tests alone") — it is not.

### EC-5 [S,O]: "Python comparison states behavioral parity, intentional difference, and remaining gaps with evidence"

**Verdict**: ⚠️ surface exists; parity claim is honestly negative.

**Evidence**: `qualification/ODD_SDLC_TYPESCRIPT_LIVE_PYTHON_ARCHIVE_COMPARISON.md` and `ODD_SDLC_TYPESCRIPT_PYTHON_PARITY_RC_BLOCKER_MAP.md` exist. The comparator's verdict (line 30): "It is not yet evidence-equivalent to Python's historical multi-edge `data_mapper` qualification depth." This satisfies the *form* of the criterion (states gaps with evidence) but not the *content* of full parity.

**Concern (medium [T])**: EC-5's wording is structural — it asks the comparison to *state* parity, intentional difference, and gaps. The comparator does state these. But T-041's `closure_law` line 47 reads "TypeScript proves the full operational claim through... a governed comparator applied to admitted Python and TypeScript data_mapper evidence." The current comparator is a *qualitative* surface (markdown narrative). It is not a *governed comparator* in the sense of producing a typed structured comparison artifact that downstream tickets can consume.

**Recommendation**: if T-041 is to close as full-operational-RC, EC-5 likely needs upgrading from the current narrative document to a typed `OddSdlcDataMapperComparator` carrier emitted as a TypeScript pipeline artifact. The current document is sufficient for bounded-RC-with-explicit-gaps but not for full-RC closure under the strict reading.

### EC-6 [O,D]: "historical data_mapper qualification comparator reports baseline metrics, required functional families, recursive-deepening evidence, authority-to-code gaps, code-to-test gaps, execution reports, and explicit repricing for intentional differences"

**Verdict**: ❌ **cannot be met under current TypeScript scope**.

This is the load-bearing finding of this review. Take the criterion's seven required outputs:

| Required Output | Status | Reason |
|---|---|---|
| baseline metrics | ✅ partial | the markdown comparator lists test35 event counts, file counts, manifest counts |
| required functional families | ✅ partial | the comparator references the cdme-* module families from test35 |
| **recursive-deepening evidence** | ❌ **not obtainable** | TypeScript state machine has no deepening transition (LP-5 from prior pressure-loss review). T-090 was rejected as the wrong way to add it. Same-edge re-entry remains retry-only. The 15× `derive_code_surface` invocations that built test35's 1,178 files are not representable in current TS. |
| authority-to-code gaps | ✅ partial | T-080 requirement-fulfillment ledger covers this; T-066 wires the ledger fold; T-089 enforces obligation coverage. The closure of authority-to-code is *now possible at single-edge granularity*. |
| code-to-test gaps | ✅ partial | T-073 (consolidated into T-066) and the shallow_realization ledger cover this at single-edge granularity. |
| execution reports | ✅ partial | `executionEvidence` field added to `SdlcWorkerResultReport` (`handoff.ts:1078-1118`); `derive_test_run_archive_surface` postflight enforces it. |
| explicit repricing for intentional differences | ⚠️ documentation only | The comparator markdown lists Python-only behaviors as intentional differences. No TypeScript ticket has been filed to *reprice* product or requirement authority around the deepening difference; T-090 was rejected without an alternative. |

**The criterion can be partially answered for single-edge runs but cannot be answered for multi-edge productive deepening.** Per the prior `20260428T040000Z_REVIEW_test35-vs-test51-pressure-loss-under-odd-method.md`, the deepening transition is the single largest semantic gap between Python and TypeScript. T-041's body acknowledges this as a go/no-go question (lines 219–229). A clean closure of EC-6 requires either:

(a) the deepening transition is added (a ticket, not yet filed) and demonstrated on a fresh `data_mapper.test*` workspace, *or*
(b) EC-6 is repriced to read "single-edge equivalence with explicit repricing of multi-edge productive deepening as out-of-scope".

Today neither has happened. T-041 sits on the boundary: criterion #6 is *not strictly met*, but the gap is *honestly documented* in the comparator surface. This is a methodological choice the operator must make.

## Verification Of Prior-Review Recommendations Closed By T-089

This section records that Codex correctly executed Rec-1 and Rec-2 from `20260428T140000Z_REVIEW_T-087-T-088-intent-construction-claim-vs-pressure-loss.md`.

### Rec-1: lift obligation derivation out of `materialization.required`

**Closed.** `handoff.ts:323-376`. `deriveTraversalObligationContext` now always pushes:

- `target_asset:<targetAssetType>` (line 341–348)
- `evaluator:<each evaluator>` from `contract.transformProfile` (line 300–321; called at 349)
- `requirement:<each REQ-id>` from `specification/requirements/*.md` (called at 350–353)
- `prior_gap:<each>` from retry context (line 377–388)

`source_asset` and `module:<>` obligations correctly remain gated on `materialization.required` (line 355–376). This matches Rec-1 exactly.

**Empirical effect**: a re-run on `derive_intent_surface` would now produce `obligationIds` ≈ 5–10 entries (1 target + 3–4 evaluators + N requirements + 0 prior gaps) instead of the empty array test51.ts archived.

### Rec-2: enforce `obligationAssessments` coverage in postflight

**Closed.** `handoff.ts:1120-1187`, `evaluateObligationAssessments`. Three checks:

1. Every declared obligation has an assessment (else `obligation_unassessed:<id>`).
2. Every assessment matches a declared obligation (else `obligation_assessment_extra:<id>`).
3. No assessment may have `fulfillmentStatus: "unassessed"` (else `obligation_status_unassessed:<id>`).
4. Blocked assessments must cite evidence (else `obligation_blocked_without_evidence:<id>`).

These match Rec-2 exactly. Each blocking reason is a typed `SdlcBlockingReason` carrier with `code`, `detail`, `evidenceRefs` (per T-086), not a string.

**Empirical effect**: a worker that submits `obligationAssessments: []` against a manifest with declared obligations now blocks postflight with one `obligation_unassessed:<id>` per declared obligation, all flowing into the T-076 retry algebra.

### Rec-3: same-edge re-entry for productive deepening

**Not closed; explicitly deferred** (T-089 body: "The review's productive deepening recommendation is larger than this ticket. It requires a transition-design update and should be tracked separately before full T-041 RC closure."). T-090 was filed as the deepening ticket and rejected (T-041 line 113–114). **No active ticket owns this transition today.** This is the load-bearing reason EC-6 cannot strictly close (above).

## Code-Level Concerns Surfaced By This Review

### CR-1 [O,T,D]: live F_P harness uses a different report contract from the production operator

**Severity**: high.
**Location**: `build_tenants/typescript/test_env/test_runs/t053_live_data_mapper/*/worker_report.json` vs `build_tenants/typescript/code/src/operator/handoff.ts:842-870` (admitWorkerResultReport).

The T-053 live test's `worker_report.json` has shape `{kind: "odd_sdlc.fp_worker.work_report", graphFunctionName, targetAssetType, generatedFile, summary}` — 4 fields. The production operator validates `{kind: "odd_sdlc.worker_result_report", graphFunctionName, edgeName, targetAssetType, outputFile, digest, summary, unresolvedReasons, materializedFiles, executionEvidence, obligationAssessments}` — 11 fields including the obligation pressure surface.

**Why this matters for T-041 closure**: EC-3 ("live data_mapper qualification traversal uses an external F_P worker and records the postmortem archive") is the only criterion that exercises a real probabilistic worker. The simpler test harness can pass while the production pressure path remains untested *under live conditions*. We have one path proven (live + simple contract) and another path proven (production contract + smoke worker). We don't have *one* path proven (live + production contract).

**Recommendation**: extend or replace `test_t053_live_fp_data_mapper.test.mjs` to dispatch through `executeInstalledOperatorStart` rather than the standalone live harness. The dispatch is already wired into the CLI's `start` command. This is the path test48.ts and test51.ts already use; making the live test go through it gives EC-3 + T-089 enforcement evidence on the same axis.

### CR-2 [O,D]: smoke materialization archive shows placeholder code; shallow-realization ledger does not visibly fire

**Severity**: medium.
**Location**: `data_mapper.test48.ts/build_tenants/scala_spark/src/main/scala/generated/DataMapper.scala`.

The materialized Scala in test48.ts is:

```scala
package generated
final case class DataMapper(value: String)
object DataMapper {
  def normalize(value: String): DataMapper = DataMapper(value.trim)
}
```

Five lines. This matches the *exact* pattern T-083's shallow-realization ledger is designed to reject (`shallow_realization.ts:56-88`: placeholder/identity-only/trace-only patterns). The test48.ts run was driven by a "manifest-driven local worker" — not a real F_P. So the shallow-realization rejection question for *real* probabilistic output remains untested.

**Closure question**: when a live Codex worker produces materialization that *is* shallow (which test35 shows happens routinely on first pass), does the assurance fold reject it and route to retry? Today this is asserted by unit test (`test_t083`) but not by an installed-workspace live run with the production operator. **The single most useful new evidence for T-041 closure would be a live F_P run on `derive_code_surface` that intentionally tests both fulfillment-detail-rich worker output (passes) and shallow worker output (rejects to retry).**

### CR-3 [O,T]: install rejection still uses stringly-typed `reason`

**Severity**: low.
**Location**: `install/installer.ts:194-200`.

The install path catches every error and returns `{kind: "rejected", reason: error.message}`. T-086 promoted operator-side blocking reasons to typed carriers but did not extend that to install. This is the same finding from my prior `20260427T230000Z_REVIEW_active-tickets-and-assurance-ledger-wave.md` (CC-2). Not a T-041 blocker; a hygiene cleanup for after T-041 closes.

### CR-4 [D]: comparator surface is markdown narrative, not typed artifact

**Severity**: low-medium (depends on T-041 closure threshold).
**Location**: `qualification/ODD_SDLC_TYPESCRIPT_LIVE_PYTHON_ARCHIVE_COMPARISON.md`.

T-041 `closure_law` line 47 calls for "a governed comparator applied to admitted Python and TypeScript data_mapper evidence". The current comparator is a markdown document hand-written from observed counts. It is not produced by code from admitted artifacts. A "governed" comparator under DESIGN_MODULE_METHOD typically implies a typed carrier with admit + derive + projection.

**Recommendation if T-041 is to close as full-RC**: add a `qualification/data_mapper_comparator.ts` that reads admitted Python event-log + run archives and admitted TypeScript event-log + run archives, computes the metrics structurally, and emits a typed `OddSdlcDataMapperComparatorReport`. The markdown document then becomes a projection over that typed report.

**Recommendation if T-041 is to close as bounded-RC-explicitly-not-full-RC**: leave the markdown as-is and update T-041's wording to admit that the bounded close is the lawful close.

## Closure-Path Options For T-041

Given the verdict above, T-041 has three lawful closure paths:

### Path A: bounded-RC-sufficient close

Update T-041 to:
- Recognize EC-1 through EC-4 as fully met.
- Recognize EC-5 as met *for bounded RC* (gaps stated; no parity claim).
- Reprice EC-6 to "single-edge equivalence with explicit deferral of multi-edge deepening to a successor ticket".
- File a successor ticket `T-09X-realize-typescript-productive-deepening-transition` for the deepening work.
- Close T-041 as bounded-RC + RC-blocker-map produced.

This is the path the body of T-041 already entertains (line 219–229) and is consistent with the comparator's honest "not yet evidence-equivalent" verdict.

### Path B: full-operational-RC close (current scope)

Requires:
- CR-1 fixed: live F_P run goes through `executeInstalledOperatorStart`.
- CR-2 evidence: a live F_P run shows shallow output rejected and retry-deepened.
- CR-4 fixed: typed comparator artifact produced.
- File and complete the deepening-transition successor (because EC-6 requires "recursive-deepening evidence").
- Re-run `data_mapper.test*` to multi-edge depth comparable to test35.

This is the strict reading and is roughly 5–10 days of focused work plus the live-run evidence that emerges.

### Path C: do not close T-041; fold into a successor envelope

If neither bounded-RC nor full-operational-RC is the right framing, file a new envelope ticket that names the actual scope and supersedes T-041. The current ticket is well-trafficked but its evaluation criteria mix bounded and full claims; a clean restart could resolve this without dragging the closure history.

## Summary For The Operator

| Concern | Status | Required for closure under which path? |
|---|---|---|
| CLI grammar (EC-1) | ✅ met | A/B |
| Install/normalize (EC-2) | ✅ met | A/B |
| Live F_P run exists (EC-3 surface) | ✅ met | A/B |
| Live F_P run exercises production pressure path (CR-1) | ❌ not met | B only |
| Release-cut packaging (EC-4) | ✅ met | A/B |
| Python comparison surface exists (EC-5 surface) | ✅ met | A/B |
| Typed governed comparator artifact (EC-5/CR-4) | ❌ not met | B only |
| Comparator reports baseline / authority-to-code / code-to-test / execution / repricing (EC-6 partial) | ✅ partial | A |
| Recursive-deepening evidence (EC-6 strict) | ❌ not met; deferred | B only (requires successor ticket) |
| T-089 obligation enforcement (Rec-1, Rec-2) | ✅ closed | A/B |
| Live evidence that obligation enforcement rejects shallow F_P output (CR-2) | ❌ not yet | B only |
| Stringly-typed install rejection (CR-3) | ⚠️ minor | hygiene, neither path blocker |

**My read**: Path A (bounded-RC-sufficient close + successor for deepening) is the cleaner choice given the rejection of T-090 and the load-bearing distinction the comparator already documents. Path B is technically reachable but requires the deepening-transition work that the wave decided not to do today. The risk in Path B is doing the deepening work without first repricing product/requirement authority — which T-041 line 113–114 correctly flags as the wrong order.

**Smallest evidence-producing action under either path**: implement CR-1 (live F_P through `executeInstalledOperatorStart`). This produces the missing piece — *real probabilistic worker output evaluated against T-089 obligation pressure* — that is needed to know whether the current pressure mechanism is sufficient at all under live conditions. Without this evidence, the choice between Path A and Path B is partly a guess.
