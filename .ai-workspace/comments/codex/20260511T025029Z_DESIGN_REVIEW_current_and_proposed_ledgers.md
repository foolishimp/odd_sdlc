---
title: Design Review - Current And Proposed Ledgers
agent: codex
created_at: 2026-05-11T02:50:29Z
scope:
  - current odd_sdlc TypeScript ledger and evaluator carriers
  - proposed T-145 through T-154 follow-on tickets
  - ODD_METHOD A1a/A1b workspace-ledger axiom
review_type: design_method_review
---

# Design Review: Current And Proposed Ledgers

## Verdict

The proposed work passes design review only if it is treated as an algebraic
refinement of the existing traversal consequence spine, not as a new parallel
ledger system.

The governing chain is already present:

```text
ConstructionIntent
-> WorksiteEvidence
-> EdgeFulfillmentLedger
-> EdgeClosureDecision
-> NextActionProjection
```

The new W/L/E/Ev axiom clarifies why this is the spine:

```text
W  = mutable workspace under construction
L  = immutable governed ledger of work over W
E  = immutable event log / replay spine
Ev = evaluator work over L
```

Closure-relevant workspace facts enter authority only through L/E. Evaluator
work is F_P over ledger state; its output must be admitted back into L/E before
it can route traversal.

Therefore the design ruling is:

- replace older rival authorities;
- evolve current ledger carriers where the carrier already exists;
- introduce new carriers only where there is no current typed authority surface.

Under spec method, replacement means deletion of the old authority-producing
code path. It is not enough to relabel the old path as lower priority or
read-only. There is one truth surface. A former surface may remain only as raw
evidence or as a projection generated from the single governing truth surface.

## Findings

### 1. Archive-derived closure must be replaced, not evolved

Current code can still read operator archives, discover a terminal closed graph
function, and rewrite the public gap projection/dossier to `converged`:

- `build_tenants/typescript/code/src/spec_method/entry.ts:816`
- `build_tenants/typescript/code/src/spec_method/entry.ts:864`
- `build_tenants/typescript/code/src/spec_method/entry.ts:886`
- `build_tenants/typescript/code/src/spec_method/entry.ts:1415`
- `build_tenants/typescript/code/src/spec_method/entry.ts:1446`

T-145 is correctly classified as replacement work. The archive-derived closure
code must be deleted as an authority path. Archive files may remain as raw
diagnostic evidence or import input, but no code path may interpret archive-only
state as gap or closure truth. The single replacement authority is
replay-visible ledger/decision/evaluator truth.

### 2. The traversal consequence chain evolves the current ledger model

The current TypeScript carriers already encode the target chain:

- `SdlcConstructionIntent` and predecessor refs:
  `build_tenants/typescript/code/src/operator/traversal_consequence.ts:40`
- `SdlcWorksiteEvidence`:
  `build_tenants/typescript/code/src/operator/traversal_consequence.ts:52`
- `SdlcEdgeFulfillmentLedger`:
  `build_tenants/typescript/code/src/operator/traversal_consequence.ts:103`
- `SdlcEdgeClosureDecision`:
  `build_tenants/typescript/code/src/operator/traversal_consequence.ts:138`
- `SdlcNextActionProjection`:
  `build_tenants/typescript/code/src/operator/traversal_consequence.ts:156`

The installed operator already constructs and archives these surfaces:

- `build_tenants/typescript/code/src/operator/installed_operator.ts:2470`
- `build_tenants/typescript/code/src/operator/installed_operator.ts:2522`
- `build_tenants/typescript/code/src/operator/installed_operator.ts:2552`
- `build_tenants/typescript/code/src/operator/installed_operator.ts:2578`
- `build_tenants/typescript/code/src/operator/installed_operator.ts:2657`

T-151 should therefore consolidate runner behavior onto this existing chain. It
should not introduce a second "runner evaluator ledger." The current remaining
risk is that outcome status/current-edge projection still has local terminal
state influence after the consequence is derived:

- `build_tenants/typescript/code/src/operator/installed_operator.ts:3727`
- `build_tenants/typescript/code/src/operator/installed_operator.ts:3741`
- `build_tenants/typescript/code/src/operator/installed_operator.ts:3762`

That should be resolved by making the consequence chain the sole route from
work output to next action and deleting the old local authority code. Summaries
may be regenerated from the consequence chain; they must not preserve an
independent truth calculation.

### 3. Gap dossier action authority must be deleted

The public gap dossier declares itself read-only and non-routing:

- `build_tenants/typescript/code/src/projection/query_domain.ts:228`
- `build_tenants/typescript/code/src/projection/query_domain.ts:234`
- `build_tenants/typescript/code/src/projection/query_domain.ts:235`
- `build_tenants/typescript/code/src/projection/query_domain.ts:254`

Postflight gap dossiers still carry `nextLawfulActions` strings:

- `build_tenants/typescript/code/src/operator/handoff.ts:5912`
- `build_tenants/typescript/code/src/operator/handoff.ts:5922`
- `build_tenants/typescript/code/src/operator/handoff.ts:5967`
- `build_tenants/typescript/code/src/operator/handoff.ts:6061`

T-151 is a replacement of those strings as routing authority. The code that
computes or consumes `nextLawfulActions` as an authority surface must be
deleted. If a dossier file remains for operator display, it must be a projection
from `SdlcEdgeClosureDecision` and `SdlcNextActionProjection`, not a second
action truth surface.

### 4. Assurance ledgers evolve; they are not replaced by the edge ledger

Current assurance ledgers carry dimensions, verdicts, reasons, evidence refs,
and carry-forward obligation refs:

- `build_tenants/typescript/code/src/assurance/carriers.ts:5`
- `build_tenants/typescript/code/src/assurance/carriers.ts:44`
- `build_tenants/typescript/code/src/assurance/carriers.ts:52`

They do not yet carry predecessor refs. T-146 correctly evolves the existing
assurance carriers with predecessor-chain authority and a closed F_D mechanics
class.

The fold currently emits status labels such as `retry_same_edge`,
`fp_escalation`, `blocked`, and `close_allowed`:

- `build_tenants/typescript/code/src/assurance/fold.ts:66`
- `build_tenants/typescript/code/src/assurance/fold.ts:92`

Those statuses can feed `SdlcEdgeClosureDecision`, but they must not become a
parallel action-selection authority.

### 5. Exact target binding evolves existing target/materialization carriers

Current target obligation binding is a read-only query-domain carrier:

- `build_tenants/typescript/code/src/projection/query_domain.ts:74`
- `build_tenants/typescript/code/src/projection/query_domain.ts:76`
- `build_tenants/typescript/code/src/projection/query_domain.ts:81`
- `build_tenants/typescript/code/src/projection/query_domain.ts:83`

Current product materialization has a contract and role list, but not exact
expected file targets bound through declared tenant/capability policy:

- `build_tenants/typescript/code/src/operator/carriers.ts:227`
- `build_tenants/typescript/code/src/operator/carriers.ts:238`

Current authority reconciliation still admits context-derived expected-file
targets beside product-authority targets:

- `build_tenants/typescript/code/src/operator/carriers.ts:985`
- `build_tenants/typescript/code/src/operator/carriers.ts:993`
- `build_tenants/typescript/code/src/operator/carriers.ts:997`
- `build_tenants/typescript/code/src/operator/carriers.ts:1000`

T-147 should evolve `SdlcTargetObligationBinding`,
`SdlcProductMaterializationContract`, and materialization authority
reconciliation. It should not create an independent materialization ledger that
rivals `SdlcEdgeFulfillmentLedger`.

### 6. Requirement lineage and closure evolve; identity authority must be fixed

Current lineage and closure use local `requirementId` values:

- `build_tenants/typescript/code/src/projection/requirement_closure.ts:52`
- `build_tenants/typescript/code/src/projection/requirement_closure.ts:57`
- `build_tenants/typescript/code/src/projection/requirement_closure.ts:88`
- `build_tenants/typescript/code/src/projection/requirement_closure.ts:90`

T-148 is an evolution of these carriers. It should separate display IDs from
stable authority refs. This is not a new closure ledger; it is an identity-law
repair inside the current lineage/closure register family.

### 7. Transformation-set partition already exists and should be proven, not forked

The current edge ledger model already distinguishes edge-local obligations from
downstream transformation-set pressure:

- `build_tenants/typescript/code/src/operator/traversal_consequence.ts:74`
- `build_tenants/typescript/code/src/operator/traversal_consequence.ts:84`
- `build_tenants/typescript/code/src/operator/traversal_consequence.ts:93`
- `build_tenants/typescript/code/src/operator/traversal_consequence.ts:103`
- `build_tenants/typescript/code/src/operator/traversal_consequence.ts:269`
- `build_tenants/typescript/code/src/operator/traversal_consequence.ts:334`
- `build_tenants/typescript/code/src/operator/traversal_consequence.ts:399`

T-152 is therefore proof/evolution work. It should prove the partition at
data_mapper scale and make target binding consume downstream pressure. It should
not create a new transformation-set ledger unless the existing edge ledger is
first shown to be insufficient.

### 8. Visible defaults are new, but they must feed the existing chain

T-150 introduces a real new carrier: an odd_sdlc domain-defaults carrier.
That carrier should be versioned, digested, replay-visible, and cited in
policy/evidence refs when it affects assurance, routing, closure, or
next-action selection.

It does not replace ABG substrate defaults. It prevents domain policy from
leaking into substrate `abg_defaults`, and it prevents hidden helper constants
from becoming undeclared attention surfaces.

### 9. Live non-close and no-harness proofs are proof obligations, not new ledgers

T-153 and T-154 are necessary proof work. They exercise the current chain under
non-close and data_mapper-scale conditions:

- T-153 proves `yield`, `retry`, `repair`, `re-enter`, `reprice`, and `block`
  from replay-visible closure/evaluator truth.
- T-154 proves source/specification-only data_mapper parity without a harness
  product target.

Neither should introduce new ledger classes. They should produce test/live
evidence that the existing W/L/E/Ev chain is sovereign.

## Classification

| Surface | Ruling | Reason |
| --- | --- | --- |
| `SdlcEdgeFulfillmentLedger` | evolves old | Existing T-109/T-136/T-138 chain is the governing L surface; proposed work tightens admission, lineage, and proof. |
| `SdlcEdgeClosureDecision` | evolves old | Existing closure decision is the right closure authority; old branch/status authority code must be deleted or converted into admitted evidence that feeds the decision. |
| `SdlcNextActionProjection` | evolves old | Existing Ev output carrier selects next work; T-151 makes it sovereign in the runner. |
| `SdlcConstructionIntent` | evolves old | Existing intent carrier anchors selected F_P callout and predecessor refs. |
| `SdlcWorksiteEvidence` | evolves old | Existing admitted worksite carrier is the W-to-L admission point. |
| `SdlcAssuranceLedger` | evolves old | Existing dimension ledgers remain; T-146 adds predecessor refs and closed F_D limits. |
| `SdlcTargetObligationBinding` | evolves old | Existing target binding remains; T-147 strengthens exact file/role/policy binding. |
| `SdlcProductMaterializationContract` | evolves old | Current contract remains; exact target and policy authority should be added into it or its immediate contract family. |
| `SdlcProductMaterializationAuthorityReconciliation` | evolves old | Keep reconciliation only when it is derived from target/capability policy; delete context-scanning authority paths. |
| `SdlcLineageLedger` | evolves old | Existing lineage ledger remains; T-148 repairs authority identity. |
| `SdlcRequirementClosureRegister` | evolves old | Existing closure register remains; it must key closure by stable authority refs, not local display IDs alone. |
| `downstream_transformation_set` partition | evolves old | Already represented in edge fulfillment assessment and counts; T-152 proves it at scale. |
| Gap dossier `nextLawfulActions` | new replaces old | Delete as an authority-producing/authority-consuming path; any displayed action list must be projected from the consequence chain. |
| Postflight report / run summary / compact output action strings | new replaces old | Delete as traversal authority; summaries may only display truth derived from the consequence chain. |
| Archive-derived terminal closure | new replaces old | Delete archive-derived closure authority; archive-only closure can be raw diagnostic/import input only. |
| `worker_result_report.json` prose | new replaces old | Delete prose-as-authority consumers; worker reports may be raw evidence only until admitted into typed evidence. |
| Context expected-file scanning as materialization authority | new replaces old | Delete as authority; target/capability policy must govern exact materialization targets. |
| Harness product target argument | new replaces old | Delete as product-pressure authority; product pressure derives from conformed workspace/requirements truth. |
| odd_sdlc domain-defaults carrier | new is new | No current typed domain-policy defaults carrier exists; it must be replay-visible and cited. |
| Closed F_D mechanics class | new is new | This is a new design-law class constraining assurance semantics, not a ledger. |
| ODD A1a/A1b W/L/E/Ev axiom | new is new | Constitutional refinement that explains the ledger/evaluator relation. |

## Execution Order

Axiomatic-setting tickets execute first. Proof tickets execute only after the
truth surfaces they prove are lawful.

| Order | Ticket | Phase | Value |
| --- | --- | --- | --- |
| 1 | `T-145` | axiomatic_setting | Delete rival closure/report authority and establish one truth surface. |
| 2 | `T-151` | axiomatic_setting | Make the installed runner consume the single consequence truth surface. |
| 3 | `T-150` | axiomatic_setting | Make defaults and catalog lookup replay-visible, not hidden evaluator attention. |
| 4 | `T-148` | axiomatic_setting | Stabilize requirement authority identity before downstream pressure proof. |
| 5 | `T-147` | axiomatic_setting | Establish exact target and product-materialization authority. |
| 6 | `T-146` | axiomatic_setting | Establish assurance predecessor attention and closed F_D law. |
| 7 | `T-149` | classifier_cleanup | Clean assurance re-entry outliers after assurance law is set. |
| 8 | `T-152` | scale_proof | Prove data_mapper-scale transformation-set partition after identity and target authority are lawful. |
| 9 | `T-153` | non_close_proof | Prove non-close dispositions after runner sovereignty and classifier cleanup. |
| 10 | `T-154` | final_integration_proof | Prove no-harness data_mapper parity after the axioms and intermediate proofs hold. |

## Design Rule For Implementation

Every implementation ticket should state which authority surface it changes.
The rule is:

```text
If the surface already participates in the consequence chain, evolve it.
If the surface can currently route, close, block, retry, or repair outside the
chain, delete that authority path and replace it with the consequence chain.
If no typed carrier exists for a policy input that affects the chain, add a new
carrier and require replay-visible citation.
```

The acceptance bar for the follow-on wave is not another rendered gap view. It
is one replayable loop:

```text
W observed
-> L admits typed evidence
-> E orders ledger/event facts with predecessor refs
-> Ev evaluates declared L snapshot
-> Ev output is admitted to L/E
-> the next F_P action in W is constrained by admitted L/E truth
```
