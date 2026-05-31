---
id: T-187
title: Restore F_P evaluator prompt boundary and proportional Min(F_P) dispatch
type: bug
ticket_category: implementation_migration
status: active
proof_status: pending
build_tenant: typescript
owner: odd_sdlc
goal: remove-prompt-template-authority-from-fp-evaluator-lanes-before-data-mapper
change_intent: Remove framework-authored semantic construction recipes from F_P evaluator prompts, preserve F_D as carrier/admission/write mechanics only, and project admitted proportionality/Min(F_P) facts into compact worker-facing briefs before any new data-mapper proof run.
change_class: design_reframe
re_entry_point: design
priority: critical
triaged_at: 2026-05-31
created_at: 2026-05-31
updated_at: 2026-05-31
governance_scope: STDO Method
source_documents:
  - specification/PRODUCT.md
  - specification/GOALS.md
  - specification/requirements/18-typed-construction-algebra.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_ABG_3_9_RC3_COMPUTE_STAGE_BOUNDARY.md
  - .ai-workspace/tickets/completed/T-181-pilot-fp-evaluator-populated-design-depth-registers.md
  - .ai-workspace/tickets/completed/T-183-delete-fd-semantic-registers-and-restore-bare-admission.md
  - .ai-workspace/tickets/active/T-184-partition-handoff-into-compute-stage-boundary-modules.md
related_tickets:
  - .ai-workspace/tickets/active/T-184-partition-handoff-into-compute-stage-boundary-modules.md
  - .ai-workspace/tickets/active/T-185-agent-internal-subworkstreams-for-compute-stage-acceleration.md
  - .ai-workspace/tickets/completed/T-181-pilot-fp-evaluator-populated-design-depth-registers.md
  - .ai-workspace/tickets/completed/T-183-delete-fd-semantic-registers-and-restore-bare-admission.md
affected_boundary:
  - build_tenants/typescript/code/src/operator/plugins/evaluate/prompts.ts
  - build_tenants/typescript/code/src/operator/plugins/transform/launch_contract.ts
  - build_tenants/typescript/code/src/operator/installed_operator.ts
  - build_tenants/typescript/code/src/operator/plugins/evaluate/content_register.ts
  - build_tenants/typescript/code/src/operator/plugins/evaluate/design_depth_register.ts
  - build_tenants/typescript/test_env/tests/test_t181_fp_evaluator_design_register.test.mjs
  - build_tenants/typescript/test_env/tests/test_t182_fp_review_grade_edge_fulfillment.test.mjs
excluded_boundary:
  - T-185 parent-agent subworkstream permission and observation-only manifest law
  - changing PRODUCT.md F_D/F_P/ABG authority law
  - letting F_P write ABG events, ledgers, closure decisions, traversal transitions, or consequence projections
  - restoring deterministic ADR-derived design-depth register synthesis
  - running a new data-mapper live or sandbox proof before this ticket is reviewed and accepted
target_truth: F_D may seed nonprojectable carrier scaffolding, expose compact authority refs, validate/admit F_P artifacts, write system evidence, and project admitted fragments. F_P transform/evaluate workers receive compact work intent, schema constraints, admitted authority refs, and an admitted proportionality budget/profile; they produce candidate assets or findings. ABG/system writes runtime events, ledgers, closure, replay, and traversal truth.
superseded_truth: F_P evaluator prompts carry kilobytes of exact Node.js that prescribe semantic extraction from ADR tables, tests bless those prompt snippets as proof, and prompt-template text acts as a separate constitution for how semantic design-depth rows must be built.
closure_law: This ticket closes only when prompt-bearing evaluator lanes no longer embed framework-authored semantic construction scripts, mechanical JSON/carrier update behavior is either implemented as F_D helper/admission mechanics or exposed as a named authority-neutral tool contract, admitted Min(F_P)/proportionality facts are projected into compact worker briefs, and deterministic plus hello-world live proof show the proportional path without reintroducing F_D semantic evaluation.
evaluation_criteria:
  - design-depth evaluator prompt contains no exact Node.js block that parses ADR tables or constructs semantic stack/module/component/file-target rows
  - any draft-to-fragment conversion is treated as carrier mechanics, not semantic evaluation, and is either done outside F_P or exposed as a named helper/capability with no semantic row derivation
  - F_P evaluator prompt still states the required carrier schema and admission constraints, but not an implementation recipe for deriving semantic rows
  - admitted proportionality/Min(F_P) selection is visible in the construction/evaluation brief as a bounded profile, budget, or outcome-class graph variant
  - trivial/framework-smoke lanes get a degenerate one-requirement / one-design / one-module / one-component / one-function profile instead of full data-mapper-scale prompt work
  - tests assert authority boundaries and carrier/admission behavior, not exact prompt scripts
  - T-185 prompt permission remains permission-only and is not blamed for or coupled to this repair
  - JS hello-world live proof is accepted only if it is proportional, converges without terminal/tool retry loops, and still carries selected transform/evaluate/admission/consequence evidence
non_closure_conditions:
  - exact semantic Node extraction scripts remain in `evaluate/prompts.ts`
  - tests continue to require `Exact first update command pattern`, `Exact second update command pattern`, or equivalent prompt recipe text as proof
  - F_D code parses ADR tables into semantic design-depth rows for generic SDLC edges
  - F_P prompt text instructs workers to write ledgers, events, closure decisions, consequence projections, or traversal state
  - proportionality is only prose in a prompt and not an admitted product fact or selected graph/hop carrier
  - data-mapper is rerun and cited as gate proof before this ticket is reviewed and its boundary decision is accepted
---

# T-187: Restore F_P Evaluator Prompt Boundary And Proportional Min(F_P) Dispatch

## Intake

The immediate review question was why an F_P evaluator receives kilobytes of
Node.js. The answer is that the design-depth evaluator prompt was turned into a
behavioral control surface after live evaluator runs failed to write visible
content-register progress. That was a tactical reliability patch, not a lawful
settled design.

The Product boundary is already clear:

```text
F_P produces candidates/findings
  -> ABG/system admits and records runtime truth
  -> F_D validates, admits, folds, projects, and routes from admitted truth
```

`F_D` cannot perform semantic product evaluation or block a required F_P
evaluation by deciding product meaning itself. `F_P` cannot write runtime
events, ledgers, closure decisions, consequence projections, or traversal truth.

Prompt-bearing edges are not a separate prompt-template constitution. They must
carry admitted refs, intent, target contract, tenant stack, local pressure, and
bounded write/read roots. They must not become a framework-authored semantic
recipe.

## Current Defect

`build_tenants/typescript/code/src/operator/plugins/evaluate/prompts.ts` carries
exact Node.js command blocks for design-depth evaluator progress:

- first update: mechanically converts draft content-register rows into
  non-draft fragment rows
- second update: reads the ADR, parses named markdown sections/tables, and
  writes `stackProfileRows`, `implementationModuleRows`,
  `componentTopologyRows`, and `fileTargetRows`

The first update may be lawful if it is treated purely as carrier mechanics.
The second update is the boundary violation: framework-authored deterministic
prompt text tells the evaluator how to derive semantic design-depth rows from
ADR tables. That reintroduces the old ADR-derived semantic synthesis path that
T-181/T-183 removed, but now through a prompt recipe instead of direct F_D code.

The focused tests currently reinforce this by asserting exact prompt snippets
instead of asserting the authority boundary and resulting carrier behavior.

## Out Of Scope Clarification

T-185 did not introduce this defect. T-185 added permission for parent-agent
internal subworkstreams and observation-only manifests. The Node.js evaluator
recipe predates the T-185 implementation and belongs to the T-181/T-183/T-184
design-depth evaluator path.

T-185 must remain coupled only by exclusion: its prompts must stay permission
only, and this ticket must not weaken the T-185 no-events/no-ledgers/no-closure
subworkstream boundary.

## Work Ledger

| id | task | closure proof | status |
| --- | --- | --- | --- |
| A-010 | Classify every embedded script or recipe in `evaluate/prompts.ts` as carrier mechanics, semantic recipe, validation helper, or bounded diagnostic. | source review table in this ticket; no unclassified prompt recipe remains | done (see Prompt Content Classification) |
| A-020 | Remove the exact ADR-table semantic extraction script from the design-depth evaluator prompt. | grep proves no exact second-update script or ADR table parser in prompt; tests prove evaluator can still produce/admit semantic rows | done: second-update ADR-table parser deleted; `node --input-type`/`tableRows`/`sectionText`/`command pattern` grep-count 0 |
| A-030 | Move lawful first-update mechanics out of prose recipe form. Either F_D performs draft-to-fragment carrier initialization before F_P, or the prompt cites a named helper/capability whose contract is authority-neutral and emits no semantic rows. | prompt contains compact helper ref, not KB of Node; helper/admission tests cover atomicity and selected-composition preservation | partial (codex F2): the KB-of-Node first-update recipe is deleted and F_D already seeds the draft scaffolding (`writeDesignDepthFpEvaluatorDraftContentRegister`), so promotion is a WHAT contract not a script. Not yet the full closure proof: the mechanics are still described in prompt prose rather than relocated to a named authority-neutral helper/capability with atomicity tests. Deferred to a follow slice |
| A-040 | Preserve evaluator schema/admission constraints without prescribing semantic derivation method. | prompt still names carrier shape, evidence refs, and admission rules, but does not tell the worker how to parse product meaning | done: full carrier schema/admission/self-check sections retained; only the HOW recipes removed |
| A-050 | Project admitted proportionality/Min(F_P) facts into construction/evaluation briefs as a concrete budget/profile. | framework-smoke/trivial runs carry a compact profile; data-mapper-scale runs carry a broader profile; neither relies on generic prompt prose alone | done: `SdlcComputeProportionalityProfile` (a read-model projection of the admitted `SdlcTraversalHopSelection`, **not** a new authority carrier) flows dispatch → `deriveWorkerHandoffManifest` → manifest → `constructWorkerConstructionBrief` → `stagePressure.proportionalityProfile`; single_hop→degenerate (1 module/1 component), dual_hop→compact (2/2), staged→broad (≤32); a **null/absent** front-door selection (domain_product / data-mapper-scale, where the front door deliberately returns null) now yields a **broad unreduced** budget rather than no profile (codex F1 fix); both evaluator and transform prompts cite it; covered by `test_t187` |
| A-060 | Update tests to assert authority boundaries and carrier outcomes instead of exact prompt recipes. | tests fail on embedded semantic scripts and pass on helper/budget/contract behavior | done: `test_t181`/`test_t184` now assert the recipe is absent and the F_D/F_P boundary statement is present |
| A-070 | Review currently uncommitted prompt/tool changes that are not T-185 scope, including the framework-smoke component-code test-execution directive and the review-grade tool-loop guard. | each is either accepted under this ticket as proportional prompt-boundary work or split into its own ticket before commit | planned |
| A-080 | Run focused semantic proof and a JS hello-world live proof after review acceptance. | build/focused tests pass; hello-world is proportional and converged; no data-mapper run occurs before this evidence is accepted | partial: focused proof rerun after live-scale prompt patches = 57/57; JS hello-world live still pending. A data-mapper scale probe was started on 2026-05-31 and intentionally stopped after exposing prompt proportionality/tool-contract defects; it is not closure proof |

## Prompt Content Classification (A-010)

| prompt region | classification | disposition |
| --- | --- | --- |
| Purpose, read-order, carrier schema, fragment payload shape, nested closed-object contract, examples, final self-check | WHAT / schema + admission constraints | keep (A-040) |
| visibility contract (first update is judgment; no hidden full-register synthesis; one section per iteration) | governance/gate expectation | keep |
| T-185 subagent permission lines | permission (T-185) | keep, unchanged |
| F_D-seeded nonprojectable draft scaffolding | F_D carrier mechanics (outside the prompt) | keep |
| "Exact first update command pattern" Node block | first-update HOW recipe | removed (A-030); promotion restated as a WHAT contract |
| "Exact second update command pattern" ADR-table parser | framework-authored semantic construction recipe (the boundary violation) | deleted (A-020); no lawful inlined form |
| generic prose size budgets (row counts, trivial override) | proportionality-as-prose | retained as fallback ceilings; now anchored to the admitted `stagePressure.proportionalityProfile` (A-050) which both prompts cite as the authoritative budget |

## Implementation Update 2026-05-31

Boundary restoration landed (A-010/020/030/040/060). F_D/F_P lawfulness checked against PRODUCT.md §Ontology (147-157) and §Generic Computation Regime Boundary (290-314):

- **F_P boundary:** the framework-authored semantic construction recipes are deleted from `evaluate/prompts.ts` (478 → 368 lines; 113 recipe lines removed). The prompt carries authority refs, target/carrier schema, admission constraints, read/write roots, and the content-register visibility contract — not a prompt-template constitution or row-construction template (§290-303). The semantic row values are the worker's evaluation.
- **F_D boundary:** unchanged and not used as a constructor. The deleted ADR-table parser was **not** relocated into F_D (that would be the inverse violation T-181/T-183 already deleted). F_D still only seeds the nonprojectable draft scaffolding (`writeDesignDepthFpEvaluatorDraftContentRegister`) and admits/projects fragment rows. New prompt line states it: "F_D seeds the draft scaffolding and admits/projects fragment rows; F_D does not construct semantic register rows for you."
- **Observability preserved:** the visibility contract (first update is your judgment; no hidden full-register synthesis; one section per iteration) is retained, so removing the recipe does not reintroduce the LD-031 hidden-construction failure.

Verification: `npm run build:semantic` passes; focused `test_t181`/`test_t184`/`test_t182` = 50/50; full `test:semantic` = 813/814. The single failure is pre-existing **T-110** (ABG worker-process callout projection), unrelated to this change — confirmed by stashing the T-187 edits and reproducing the failure on the prior tree.

### A-050 proportionality projection (2026-05-31)

Landed lawfully as an F_D read-model projection (not a new authority carrier, per Review Question 2 / §5C): the admitted `SdlcTraversalHopSelection` (already derived at dispatch, `installed_operator.ts` ~2498) is projected by `proportionalityProfileFromHopSelection(...)` into `manifest.proportionalityProfile` and surfaced in `construction_brief.stagePressure.proportionalityProfile`. Both the design-depth evaluator prompt and the ADR transform prompt now cite it as the admitted size budget, anchoring (not replacing) the prior prose ceilings. Budget by hop class: single_hop→degenerate (1/1), dual_hop→compact (2/2), staged/zoom/blocked→broad (≤32). Verification: `build:semantic` clean; `test_t187` (6 tests) + focused `t181/t184/t182` = 56/56; full `test:semantic` = 819/820 (only the pre-existing, unrelated T-110 fails). No new carrier; F_D stays a projector/admitter, not a constructor.

Remaining before closure: A-030 finish (relocate first-update mechanics to a named authority-neutral helper/capability with atomicity tests — codex F2), A-070 final disposition, and A-080 JS hello-world live proof.

## Codex Review Response (2026-05-31)

- **F1 (High) — fixed.** Codex correctly found A-050 only covered framework-smoke: `frontDoorTraversalSelection` returns null for `domain_product` (`public_start.ts:375`), so `executionContract.traversalHopSelection` was null at dispatch and the brief profile was null for the data-mapper gate. Fix: `proportionalityProfileFromHopSelection(null)` now returns a **broad unreduced** profile (`profileClass: "broad"`, `maxComponents: 32`, `maxModules: null`) — the honest projection of "no Min(F_P) reduction selected → full budget" — instead of null. `test_t187` updated to assert this. domain_product/data-mapper now carries a broad profile; framework-smoke still carries degenerate/compact. Live end-to-end validation remains A-080 (gated); data-mapper still not to be run yet.
- **F2 (Medium) — accepted; A-030 reclassified `partial`.** The fatal KB-of-Node recipe is gone, but the first-update mechanics are still WHAT-prose rather than a named helper/capability with atomicity tests. Claim corrected from done to partial; helper extraction deferred to a follow slice.
- **F3 (Low/Med) — fixed.** The line-99 "read the ADR silently with Node, extract the table/heading range" method prescription is softened to "read only the authority a section needs and do not print it… the framework prescribes the carrier schema and the visibility contract, not the extraction method." Classified under A-010.
- **F4 (Process) — confirmed.** A-070 stays planned; the review-grade tool guard (`installed_operator.ts`) and framework-smoke test-execution directive (`launch_contract.ts`) remain uncommitted and must be accepted-here or split before commit.

Re-verification after fixes: `build:semantic` clean; `test_t187` 6/6; full `test:semantic` 819/820 (only the pre-existing, unrelated T-110).

## Data-Mapper Scale Probe (2026-05-31)

Run attempted as a scale probe, not gate proof:

- archive: `build_tenants/typescript/test_env/test_runs/t164_data_mapper_full_capability_live/20260530T193405015Z_pid39089`
- worker: `process://codex?model=gpt-5.5&effort=high`
- executor: PTY (`ODD_SDLC_TS_AGENT_EXECUTOR_PROFILE=pty-terminal`, `ABG_TS_AGENT_EXECUTOR_PROFILE=pty-terminal`)
- first handoff: `derive_intent_surface`, `intent_surface`, `profileClass=broad`, `hopClass=staged`, `outcomeClass=domain_product`

Observed defects:

- Transform prompt proportionality defect: the worker wrote long exact obligation-id tables into `specification/INTENT.md` because prompt text still pushed exact requirement trace registers into broad Markdown surfaces. Source fix: exact ids stay in carriers/result reports; Markdown product/design surfaces now group broad obligation pressure by source/domain and cite counts plus representative ids unless the target is a trace/register surface or an outcome directive explicitly requires exact rows.
- Review-grade executor-contract defect: the prompt told non-executable review workers to use Read/Write-only tools, but Codex PTY exposes shell-style file access. Source fix: review-grade now prefers file tools when present and, for shell-only executors, permits one bounded local script that reads silently, writes the durable assessment JSON, and prints compact counts only.

The probe was stopped after the first transform and review-grade evaluator exposed these defects. Cleanup verified no run-local Codex/PTY/process group remained. Re-verification after patches: `build:semantic` plus `test_t187`/`test_t182`/`test_t181`/`test_t184` = 57/57.

## Review Questions

- Should draft-to-fragment conversion happen before F_P as F_D carrier
  scaffolding, or remain a named authority-neutral helper the F_P worker may
  invoke?
- Should Min(F_P) proportionality be carried as a new typed profile carrier, a
  selected traversal-hop field, or a compact projection from the existing
  decomposition/hop-selection carriers?
- Should the review-grade tool-loop guard stay in this ticket as part of
  prompt-boundary proportionality, or split into a smaller operational bug
  ticket?

## Data Mapper Gate

No new data-mapper live or sandbox run is legitimate gate proof while this
ticket is unresolved. A data-mapper run may still be useful as a scale probe
after source prompt patches are verified, but closure still requires the
accepted prompt-boundary decision and JS hello-world proof first.
