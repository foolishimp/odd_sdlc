# Codex Review: TypeScript System Collapse And Consolidation Findings

Date: 2026-05-10

Scope:

- Reviewed Claude's compressed system-collapse review against the current
  `odd_sdlc` TypeScript source tree.
- Confirmed the governing method text in:
  - `/Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md`
  - `/Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md`
  - `odd_sdlc/specification/PRODUCT.md`
  - `odd_sdlc/build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_SPEC_METHOD_ENTRYPOINT.md`
- This is a future-action review post. It does not close tickets and does not
  change code.

Worktree note:

The `odd_sdlc` checkout is currently dirty and contains unresolved conflicts in
non-TypeScript/specification surfaces. The TypeScript files referenced below
were readable and were checked directly, but this review should be treated as a
current-worktree consolidation assessment, not as a release-quality clean-tree
proof.

## Method Anchor

The method evidence supports the review frame:

- DMM Prime Law says new top-level realization units must be structurally prime,
  and specifically rejects mirrors, wrapper layers, and payload variation as
  prime reasons (`DESIGN_MODULE_METHOD.md:328-388`).
- DMM Promotion Test and Boundary Inflation require proof before subordinate
  payloads become top-level types (`DESIGN_MODULE_METHOD.md:437-503`).
- DMM No Semantic Center says no controller, runtime loop, or wrapper should be
  the place reviewers must read to discover closure, failure, next work, or
  current truth (`DESIGN_MODULE_METHOD.md:855-877`).
- DMM Coupling Rule prefers
  `carriers -> semantic kernels -> effect shells -> projections`, not
  controller-centered shape (`DESIGN_MODULE_METHOD.md:881-891`).
- DMM Interface Bleed prohibits one interface family from reconstructing another
  interface family's source truth (`DESIGN_MODULE_METHOD.md:1108-1126`).
- ODD A0/A4a/A11/A12/A14/A15 require one traversal consequence surface, explicit
  `synthesize_model` / `eval_gap` / `evaluate_next` / `evaluate_action`
  separation, graph-law re-entry, read-only public query views, recursive
  published refinement, and no module-local decision authority
  (`ODD_METHOD.md:730-1001`).
- `odd_sdlc` product law says Python is operational precedent, but TypeScript
  must translate it into graph functions, typed assets, ABG runtime truth, and
  installed product carriers, not copy Python service structure
  (`specification/PRODUCT.md:169-172`).

## High Findings

### H1. `operator/handoff.ts` is an unlawful semantic center risk

Status: confirmed.

Evidence:

- `build_tenants/typescript/code/src/operator/handoff.ts` is 5,357 lines with
  33 exported declarations.
- The file owns prompt assembly, target binding shaped strings, materialization
  observation, post-transform report handling, gap dossier construction,
  postflight assessment, and retry/gap action derivation.
- `constructPostflightGapDossier()` computes `retryEligible` and next lawful
  actions locally at `handoff.ts:5092-5154`.

Why it matters:

DMM does not ban large files by itself, but this file is not only large. It is
where a reviewer must read to understand multiple semantic boundaries: what the
worker is asked to do, what evidence is accepted, how gaps are rendered, and
what retry/re-entry pressure is produced. That hits DMM No Semantic Center and
Coupling Rule.

Future action:

Open a consolidation ticket to split by boundary, preserving behavior first:

- `operator/handoff/prompt_assembly.ts`
- `operator/handoff/materialization_observation.ts`
- `operator/handoff/post_transform_report.ts`
- `operator/handoff/requirement_assessment.ts`
- `operator/handoff/gap_dossier.ts`
- `operator/handoff/repair_schedule.ts` if repair/depth prompt contracts remain
  in this family

Each extracted module should expose one semantic kernel or one effect shell,
not a bridge surface.

### H2. `operator/installed_operator.ts` still mixes runner spine, effect shell, and summary/read-model work

Status: confirmed, with caveat.

Evidence:

- `build_tenants/typescript/code/src/operator/installed_operator.ts` is 3,527
  lines.
- It contains runner consequence derivation, ABG replay event append,
  process/worker execution, archive writes, liveness projection writes, retry
  context derivation, public terminal outcome construction, and loop summary
  construction.
- The evaluator-owned chain is present: `deriveOddSdlcEvaluateNextReport()` feeds
  `constructSdlcNextActionProjection()` at `installed_operator.ts:2224-2290`.

Why it matters:

T-135/T-140 did move selection onto `SdlcNextActionProjection`, so this is not a
"runner still bypasses evaluate_next" defect. The remaining issue is DMM
coupling: the ABG boundary file is both semantic runner spine and filesystem /
process effect shell.

Future action:

Split without changing authority:

- `runner_spine.ts`: pure carrier consumption and consequence routing
- `runner_effects.ts`: process invocation, event append, archive writes
- `runner_summary.ts`: operator-facing summaries and terminal outcome formatting

The test goal is a runner-spine unit lane that does not touch filesystem or
spawn processes.

### H3. `operator/carriers.ts` needs an IACS / Promotion Test audit

Status: confirmed.

Evidence:

- `build_tenants/typescript/code/src/operator/carriers.ts` is 1,139 lines with
  98 exported declarations.
- It combines installed operator status/summary, loop attempts, worker
  transport, worker results, process summaries, handoff manifest, postflight
  gap dossier, retry context, traversal intent package, and more.

Why it matters:

This is exactly the kind of surface DMM Prime Law and Boundary Inflation are
meant to audit. The file may contain real prime carriers, but the current
aggregate makes it impossible to see which types are authoritative carriers,
which are public projections, and which are subordinate payloads.

Future action:

Open a carrier-set audit ticket. Do not start with a mechanical split. First
declare the irreducible carrier families, then demote or relocate subordinate
payloads. Likely families:

- installed operator request/outcome/summary
- worker transport/process result
- handoff manifest/effect shell payload
- postflight assessment and gap dossier
- retry context
- traversal consequence bridge

### H4. Retry/re-entry derived predicates are still scattered

Status: confirmed, but narrower than Claude stated.

Evidence:

- T-140 corrected the runner retry context to use
  `deriveSdlcWorkerRetryContextFromTraversalConsequence()`, and that now records
  `priorAuthorityRef` from `SdlcEdgeClosureDecision` at
  `installed_operator.ts:261-320`.
- But retry eligibility and lawful re-entry labels still appear in several
  surfaces:
  - `SdlcInstalledOperatorStartLoopAttempt.retryEligible` in
    `operator/carriers.ts:55-64`
  - `SdlcPostflightGapDossier.retryEligible` in `operator/carriers.ts:836-854`
  - gap-dossier retry derivation in `handoff.ts:5092-5154`
  - summary propagation in `installed_operator.ts:224-238` and
    `installed_operator.ts:424-440`
  - blocking reason metadata maps reason codes to `lawfulReentryPoint` in
    `shared/blocking_reason.ts:164-354`

Why it matters:

ODD A11 says repair and re-entry are graph actions selected by `evaluate_next`,
not local retry branches over strings. The current runner context is closer to
that law, but public/legacy gap surfaces still carry retry-derived booleans and
action labels. Those should become read-only projections from the consequence
chain, not independently derived facts.

Future action:

Create one derived-predicate module or consequence projection for:

- retry eligible
- repair eligible
- re-enter eligible
- block/reprice disposition family
- public legacy rendering of those facts

Then make handoff/gaps/summary consume it. This should be a behavior-preserving
consolidation ticket with regression tests proving no gap dossier string can
select traversal.

### H5. Component-depth and design-depth register/assurance pairs are a real consolidation candidate

Status: confirmed as future consolidation, not safe to collapse casually.

Evidence:

- `operator/component_depth_register.ts`: 1,122 lines
- `operator/design_depth_register.ts`: 1,582 lines
- `assurance/component_depth.ts`: 771 lines
- `assurance/design_completeness.ts`: 822 lines
- Total: 4,297 lines.
- Both patterns are `worker artifact -> register admission -> assurance ledger`.

Why it matters:

There is a visible two-axis duplication: component depth and design depth each
have a register admission module plus an assurance fold. That is a strong DMM
Boundary Inflation smell.

Caveat:

These files expose only a small number of exported functions, and each register
has domain-specific schema detail. A generic `<DepthKind>` collapse may be right,
but it must pass the Promotion Test and preserve domain-specific validation
messages and fixture compatibility.

Future action:

Start with a shared admission/fold kernel extraction, not a wholesale schema
merge:

- common fenced-artifact extraction
- common candidate evidence write path
- common admission result shape
- common assurance-ledger fold shape
- per-kind schema and target-policy modules remain separate until proven
  reducible

## Medium Findings

### M1. Fulfillment counts are partly consolidated, but the relationship should be made explicit

Status: confirmed, severity reduced.

Evidence:

- `SdlcEdgeFulfillmentCounts` is canonical in
  `operator/traversal_consequence.ts:64-72`.
- `SdlcRequirementFulfillmentPublicCounts` already extends a `Pick` of that type
  in `projection/query_domain.ts:93-102`.

Why this is not a high duplicate anymore:

The current code is not a totally parallel type. It already anchors six shared
fields to the edge counts carrier.

Remaining issue:

`total`, `planned`, `carriedForward`, and `unresolved` are public projection
additions. The type should state that these are projection-only derived fields,
or use a nested shape like `{ edge: SdlcEdgeFulfillmentCounts, public: ... }` if
future drift appears.

### M2. Fulfillment statuses still have parallel vocabularies

Status: confirmed.

Evidence:

- `SdlcEdgeFulfillmentAssessmentStatus`:
  `operator/traversal_consequence.ts:78-82`
- `SdlcRequirementFulfillmentStatus`:
  `projection/requirement_closure.ts:75`
- `SdlcRequirementFulfillmentPublicStatus`:
  `projection/query_domain.ts:118-125`
- Inline fulfillment literal in `installed_operator.ts:1670-1679`.

Why it matters:

The statuses are not identical, so a blind alias would be wrong. But the
conversion functions in `query_domain.ts:624-652` are evidence that this is one
concept family with several projection states.

Future action:

Define one owning status algebra and explicit projection adapters:

- action assessment status
- closure register status
- public rendered status

Eliminate inline literals from installed operator code.

### M3. Public requirement fulfillment has two entry functions, but one canonical path

Status: Claude finding mostly stale.

Evidence:

- `projectSdlcRequirementFulfillmentPublicViewFromPriorProjection()` currently
  calls `projectSdlcRequirementFulfillmentPublicViewFromAssessments()` after
  deriving a closure register from the prior projection
  (`query_domain.ts:801-824`).

Why it matters:

This is not currently two independent semantic centers. It is two public
entrypoints over one canonical constructor/fold path. Leave it unless tests show
drift.

Future action:

Optional: rename the functions to make wrapper/canonical roles explicit.

### M4. `shared/blocking_reason.ts` is not 244 reason codes, but it is still centralizing too much meaning

Status: Claude count inaccurate; structural smell remains.

Evidence:

- The code list has 64 blocking reason codes at `shared/blocking_reason.ts:8-72`,
  not 244.
- The file maps reason code -> reason class -> lawful re-entry point in
  `shared/blocking_reason.ts:164-354`.
- It is 613 lines.

Why it matters:

This file is already better than a raw string bag: codes are typed, classes are
typed, and lawful re-entry points are typed. The problem is that disposition
meaning is still flattened through a blocking-reason metadata mapper instead of
being grouped under closure disposition families.

Future action:

Do not replace it wholesale. Add a migration layer:

```text
SdlcBlockingReason -> ClosureDispositionReasonFamily
```

where the family is one of `yield`, `retry`, `repair`, `re-enter`, `reprice`,
or `block`. Keep legacy codes as details during the migration.

### M5. `spec_method/entry.ts`, `projection/query_domain.ts`, and `workspace/project_profile.ts` deserve audits, not immediate rewrites

Status: confirmed as audit candidates only.

Evidence:

- `spec_method/entry.ts`: 1,369 lines
- `projection/query_domain.ts`: 1,306 lines with 32 exports
- `workspace/project_profile.ts`: 1,511 lines
- The Spec Method design explicitly says `spec_method/entry.ts` owns method
  intent admission and dispatch, but not retry/reentry, closure, or graph truth
  (`ODD_SDLC_TYPESCRIPT_SPEC_METHOD_ENTRYPOINT.md:54-116`).

Future action:

Audit each file against its design non-ownership list. Do not use line count
alone as a refactor trigger.

## Low / Stale Findings

### L1. `priorManifestId` retry-context bleed is fixed

Status: stale.

Evidence:

- `SdlcWorkerRetryContext.retryAttemptRefs[]` now has `manifestId` plus
  `priorAuthorityRef` in `operator/carriers.ts:857-868`.
- The derivation sets `priorAuthorityRef` from
  `consequence.edgeClosureDecision.decisionRef` in
  `installed_operator.ts:295-310`.
- `SdlcPostflightGapDossier.priorManifestId` still exists in
  `operator/carriers.ts:836-854`, but that field is still a gap-dossier manifest
  reference, not the fixed retry-context authority ref.

No new work needed for that specific defect.

### L2. A4a attribution on requirement fulfillment projection is fixed

Status: stale.

Evidence:

- `SdlcRequirementFulfillmentPublicProjection` now declares:
  - `gapEvaluationFunction: null`
  - `nextActionEvaluationFunction: "evaluate_next" | null`
  - `actionClosureEvaluationFunction: "evaluate_action"`
  at `query_domain.ts:152-158`.
- The constructor sets them explicitly at `query_domain.ts:544-550`.

No new work needed for that specific defect.

### L3. `EvaluatorProjection` naming is mostly stale, but old docs/tickets still contain it

Status: partially stale.

Evidence:

- Current code uses `SdlcNextActionProjection`.
- Current shared ODD method uses `NextActionProjection` in the object table and
  one-surface equation (`ODD_METHOD.md:730-740`, `ODD_METHOD.md:769-785`).
- Stale references to `EvaluatorProjection` remain in older odd_sdlc design and
  completed-ticket text, including
  `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_LEDGER_SOLUTION.md`
  and completed T-109/T-140 ticket text.

Future action:

Low-priority doc hygiene: replace stale historical references only where they
are still treated as active design authority. Do not churn completed-ticket
history unless it actively misleads current work.

### L4. Hard carrier/export-count caps should not become constitutional law

Status: adjust Claude recommendation.

DMM explicitly says Prime Law is not about minimizing line count
(`DESIGN_MODULE_METHOD.md:388-391`). A "30 exports" rule can be a review trigger,
but not a constitutional failure by itself. The lawful test is whether each type
passes IACS / Promotion Test and whether the file creates a semantic center.

## Confirmed Non-Findings

- `traversal_consequence.ts` is large at 1,112 lines and has 26 exports, but it
  carries the T-109/T-135 consequence chain:
  `ConstructionIntent -> WorksiteEvidence -> EdgeFulfillmentLedger ->
  EdgeClosureDecision -> SdlcNextActionProjection`. Its size is not currently a
  collapse finding by itself.
- `graph/library.ts`, `graph/catalog.ts`, and `graph/module.ts` are the
  published graph catalog surface required by ODD A3. Their size is not a smell
  on the same basis as controller/effect files.
- `install/installer.ts` is focused at 294 lines. No consolidation action
  needed from this review.

## Recommended Future Tickets

1. Handoff module split under DMM semantic-center law.
2. Operator carrier IACS audit and subordinate payload demotion.
3. Runner spine/effect/summary split for `installed_operator.ts`.
4. Single derived predicate surface for retry/repair/re-enter/block/reprice
   eligibility, consumed by gap dossier, summaries, and runner.
5. Depth register and assurance shared-kernel extraction.
6. Fulfillment status/count algebra consolidation.
7. Blocking reason disposition-family adapter.
8. Stale `EvaluatorProjection` wording cleanup in active design authority only.

The first three are the highest leverage. The retry predicate work is the
highest correctness leverage for the main loop because it protects A0/A11 from
reappearing through public gap or legacy dossier surfaces.
