---
id: T-131
title: Create guided odd_chat CLI live build lane over deployed ODD/GTL/ABG domains
type: feature
ticket_category: live_proof_lane
status: active
review_status: corrected_to_bootstrap_only_live_build_candidate_pending_opt_in_execution
goal: typescript-rc-guided-live-proof
build_tenant: typescript
owner: odd_sdlc
change_intent: Add a smaller guided live proof lane where a bootstrap start document declares the odd_chat CLI product, build tenant, workspace create/open dialogue, default deployed ODD/GTL/ABG domain, graph-function selection dialogue, lawful action menu, and graph-function asset build plan, so odd_sdlc can prove it can build odd_chat without relying on an unconstrained long-running data_mapper agent lane.
change_class: design_reframe
re_entry_point: design
affected_boundary:
  - build_tenants/typescript/test_env/fixtures/t131_guided_odd_chat/
  - build_tenants/typescript/test_env/live/
  - build_tenants/typescript/package.json
  - T-041 bounded RC proof strategy
priority: high
triaged_at: 2026-05-09
created_at: 2026-05-09
updated_at: 2026-05-09
completed_at: null
governance_scope: STDO Method
dependencies:
  - T-041 active bounded RC data_mapper end-goal lane
  - T-129 completed ABG 3.7.1 evaluator and liveness substrate migration
  - T-120 completed typed retry-local repair prompt packaging
related_tickets:
  - T-041 remains open for data_mapper end-goal/stress proof
  - T-109 remains open for current-runtime full traversal or typed exhaustion proof
  - T-112 remains open for complete lifecycle release/closure proof
intake_source: The latest data_mapper live lane ran for about 134.6 minutes before the outer harness killed it at derive_component_test_surface. The operator asked for a simpler live proof that still shows the full lifecycle: bootstrap, sandbox setup, install odd_sdlc as builder, build odd_chat, locally install odd_chat, and test odd_chat. The intended product is a standalone CLI that can create/open an operator workspace, load deployed ODD/GTL/ABG domains into that workspace, then separately choose which domain graph function to operate. Its first/default domain is document_to_requirements, where a human evaluator chooses lawful actions over a graph that turns a source document into typed requirements.
target_truth: odd_sdlc has a compact canonical live-build candidate where one self-contained bootstrap document carries intent, product definition, build tenant, workspace create/open dialogue, default document_to_requirements domain, graph-function selection dialogue, lawful action menu, graph-function bindings, expected assets, sandbox/install/deploy/test commands, and acceptance criteria for building odd_chat. The harness creates a fresh sandbox from that bootstrap document, installs odd_sdlc into the sandbox as builder, runs the installed odd_sdlc command path, and treats generated odd_chat CLI implementation files as build evidence rather than fixture input. odd_chat itself is not an odd_sdlc runtime wrapper.
superseded_truth: The only meaningful live proof is the full data_mapper lane, or a short fixture may bypass bootstrap, GTL graph authority, lawful actions, graph-function asset construction, deploy, or test evidence by copying a prebuilt odd_chat implementation.
closure_law: This ticket closes only when the T-131 bootstrap document is the single scenario source of truth, the fixture does not carry prebuilt odd_chat implementation source, the harness validates all required lifecycle/action/asset/test/deploy details from the document, the package exposes a focused test command, and the opt-in live lane installs odd_sdlc into a fresh sandbox and builds odd_chat target files through the installed traversal. The generated odd_chat product must be a standalone CLI over workspaces and deployed ODD/GTL/ABG domains, with document_to_requirements as the default proof domain and graph-function selection as a separate step from workspace creation and action selection.
evaluation_criteria:
  - The bootstrap document declares product intent, product definition, build tenant, runtime/deploy target, acceptance criteria, and test expectations.
  - The bootstrap document declares odd_sdlc as builder only, not as odd_chat's runtime graph loader.
  - The bootstrap document declares workspace create/open as a first-class odd_chat dialogue.
  - The bootstrap document declares document_to_requirements as the default deployed ODD/GTL/ABG domain for odd_chat.
  - The bootstrap document declares graph-function listing and selection as a separate odd_chat dialogue.
  - The bootstrap document declares a builder lifecycle graph from start document through sandbox setup, odd_sdlc install, odd_chat build, local CLI deployment, test execution, and release-readiness projection.
  - Each graph node has a lawful action entry with action id, graph function, source asset refs, target asset ref, expected carrier, human evaluator decision, retry action, and done predicate.
- The harness treats the bootstrap document as the only scenario contract and rejects missing lifecycle nodes, duplicate action ids, missing graph-function bindings, missing deploy/test commands, or missing expected output assets.
- The harness can run in deterministic contract mode without live workers and in opt-in live mode for sandbox install/gaps/start build proof.
- The opt-in live lane writes the installed runtime workspace under `build_tenants/typescript/test_env/test_runs/t131_guided_odd_chat_bootstrap_sandbox/<timestamp>_pid<pid>/workspace`, so `.ai-workspace/runtime/odd_sdlc` and per-edge event logs are inspectable from the same sandbox that was bootstrapped for the run.
- data_mapper remains the end-goal/stress lane under T-041; T-131 does not close T-041 by itself.
proof_surface:
  - build_tenants/typescript/test_env/fixtures/t131_guided_odd_chat/bootstrap.md
  - build_tenants/typescript/test_env/live/test_t131_guided_odd_chat_live_build.test.mjs
  - npm run test:t131
  - npm run test:t131:guided-odd-chat-live for opt-in live proof
non_closure_conditions:
  - The guided CLI or harness owns action selection outside the bootstrap/GTL projection.
  - odd_chat is built as an odd_sdlc-specific runtime wrapper instead of a standalone CLI over deployed ODD/GTL/ABG domains.
  - odd_chat collapses workspace creation, domain loading, graph-function selection, and action selection into one hidden step.
  - The fixture omits deploy or test execution evidence.
  - The fixture asks an AI worker to plan the whole SDLC rather than build one selected edge-local asset.
  - The harness hardcodes a second lifecycle plan instead of reading the bootstrap scenario contract.
  - The fixture contains generated odd_chat implementation source before the live build starts.
  - The ticket is used to close data_mapper T-041 without an explicit T-041 reprice.
---

# T-131: Guided odd_chat CLI Live Build Lane

## STDO Triage

First missing layer: design.

The current data_mapper live lane remains the end-goal and stress proof under
T-041, but it is too long and too complex to be the only rapid release proof.
The missing slice is a compact, inspectable live fixture that preserves the same
architecture:

```text
bootstrap start document
  -> GTL lifecycle graph
  -> lawful action menu
  -> human evaluator/intent selection
  -> edge-local graph function
  -> F_P asset construction
  -> F_D admission/test/deploy evidence
  -> next projection
```

The odd_chat product is an operator CLI, not a second controller. odd_sdlc is
only the builder used by this live proof. The built odd_chat CLI creates or
opens an operator workspace, loads deployed ODD/GTL/ABG domains into that
workspace, lists available graph functions, records the human-selected graph
function, and only then exposes lawful actions. The default proof domain is
document_to_requirements, whose graph turns a start document into typed
requirements through human evaluator choices and edge-local graph functions.

## Initial Implementation Slice - 2026-05-09

Added:

- `build_tenants/typescript/test_env/fixtures/t131_guided_odd_chat/bootstrap.md`
- `build_tenants/typescript/test_env/live/test_t131_guided_odd_chat_live_build.test.mjs`
- package scripts:
  - `npm run test:t131`
  - `npm run test:t131:guided-odd-chat-live`

Correction after review: the earlier prebuilt fixture shape was not the intended
proof. T-131 is a test-run candidate. Each run must build odd_chat from the
start document. The fixture therefore keeps only `bootstrap.md` as durable
scenario input. The harness may write derived sandbox files such as
`specification/requirements/00-start-document.md`, `gtl/graph.json`,
`domains/document_to_requirements/domain.json`, and
`.odd-chat/workspace-dialogue-contract.json`, but it must not copy
`build_tenants/typescript/src/*`, CLI tests, package scaffolding, or UI files as
fixture inputs.

Deterministic proof:

- `npm run test:t131` passed on 2026-05-09.
- The focused test:
  - validates `bootstrap.md` as the scenario source of truth;
  - creates a fresh non-live bootstrap fixture archive from the bootstrap
    document;
  - writes only derived authority/context surfaces;
  - validates workspace create/open and graph-function selection contract rows;
  - asserts that all expected odd_chat implementation files are absent before
    traversal.

The odd_sdlc install/start smoke path is still opt-in through
`npm run test:t131:guided-odd-chat-live` because it may invoke a live worker.
That script sets `ODD_SDLC_TS_T131_GUIDED_ODD_CHAT_LIVE=1`, installs odd_sdlc
into the fresh sandbox, runs the installed `odd-sdlc-ts` command, and fails
unless the expected odd_chat target files are produced by traversal.

Archive-root correction on 2026-05-09:

- The non-live bootstrap fixture archive uses
  `t131_guided_odd_chat_bootstrap_fixture`.
- The opt-in installed live archive uses
  `t131_guided_odd_chat_bootstrap_sandbox`.
- The opt-in installed live lane must invoke the public source CLI install
  surface (`odd-sdlc-ts install` via the built CLI entrypoint) and archive
  `install.process.json`, `install.stdout.json`, `install.stderr.log`, and
  `install_result.json`; it must not call `installOddSdlcTypescript` directly
  as the live proof of install.
- The harness resolves archive/workspace paths to absolute paths before passing
  `--workspace` to installed `odd-sdlc-ts`; installed commands must not receive a
  workspace-relative test archive path that can be resolved twice.
- The live archive is the one expected to contain
  `workspace/.ai-workspace/runtime/odd_sdlc`, operator-run event files,
  `worker_process_events.jsonl`, PTY trace files, assets, ledgers, and runtime
  projections.
- Harness archive-root env vars such as `ODD_SDLC_TS_TEST_RUN_ROOT` and
  `ODD_SDLC_TS_LIVE_TEST_RUN_ROOT` must not be passed into the installed
  `odd-sdlc-ts` process. They are harness concerns, not installed-product
  runtime inputs.
- Older already-running live invocations that started before this correction may
  still archive under the previous temp `t131_guided_odd_chat_live_build` root;
  those are stale path evidence, not the configured target for new runs.

## Closure Boundary

T-131 can close the guided odd_chat live-lane setup. It does not close the
data_mapper end-goal or the bounded RC envelope.

## Sandbox Input Assets — 2026-05-11

The fixture under `build_tenants/typescript/test_env/fixtures/t131_guided_odd_chat/`
now carries the input assets the sandbox needs to build and exercise
`odd_chat`. These are declaration data the build consumes; they are not
`odd_chat` implementation source and they are not in the contract's
`expectedFiles` list.

Added:

- `domains/document_to_requirements/domain.json` — the deployed
  ODD/GTL/ABG domain package `odd_chat` loads as its default proof domain.
  Re-publishes the same data the bootstrap contract declares under
  `scenario_contract.defaultDomain`, as a standalone loadable package with
  graph nodes, vectors, lawful actions, graph functions, carrier schemas,
  and non-closure conditions.
- `domains/document_to_requirements/README.md` — provenance pointer to
  `bootstrap.md` as the single scenario source of truth.
- `examples/start_document.md` — a short mixed-clarity sample document the
  `testOddChat` smoke commands feed into the loaded domain so
  `observe_document → derive_requirement_candidates → accept_requirements`
  has real input.

Closure-law impact:

- `bootstrap.md` remains the single scenario source of truth; the new files
  are addressable forms of data the contract already declares plus a
  worked example. No `odd_chat` source code (no `src/cli.ts`,
  `src/commands/*.ts`, `src/app/*.ts`, `src/domain/*.ts`,
  `src/render.ts`, `src/types.ts`, `test/odd_chat.test.ts`, `package.json`,
  or `tsconfig.json`) is provided by the fixture; those remain
  build-output of the installed traversal.
- The existing
  `test_env/live/test_t131_guided_odd_chat_live_build.test.mjs`
  contract-validation test now reads the loadable domain package from the
  fixture, verifies that its core graph topology matches
  `scenario_contract.defaultDomain`, verifies that it exposes the default
  `document_to_requirements` aggregate graph function, and copies that fixture
  package into the sandbox. The "bootstrap-only sandbox has no prebuilt
  odd_chat implementation" assertion still holds because that assertion is over
  the derived workspace and the contract's `expectedFiles`, not over the fixture
  directory listing.

Wiring:

- The parameterised scenario sandbox descriptor at
  `test_env/sandbox/scenarios/t131_odd_chat.scenario.mjs` lists the new
  files in `T131_ODD_CHAT_SOURCE_FILES`, so the generic harness asserts
  their presence before copy and they ride into every sandboxed workspace.
- `npm run test:scenario-sandbox` remains green on 2026-05-11 with the
  expanded fixture; `npm run test:t131` remains green.

Still outstanding for full closure:

- A live opt-in run that installs `odd_sdlc` into a fresh sandbox and has
  the installed traversal produce the `odd_chat` target files declared in
  the contract's `expectedFiles`. The new input assets unblock the build
  side; the closure-law clause about the live build itself is unchanged.

## MindForge Domain Enablement on This Lane

This section records a sibling deployed-domain target for the same T-131 lane.
`document_to_requirements` remains the default proof domain. `mindforge_ai_use_case`
is a second deployed domain that exercises the same bootstrap-document and lawful-action
contract against a financial-services AI-governance lifecycle. Adding it is in scope for
T-131 because it stresses the same operator UX, the same deployed-domain loader, and the
same odd_sdlc-as-builder path without enlarging the data_mapper lane or pulling
financial-services semantics into GTL/ABG core.

### Layer Ownership

- **abiogenesis (GTL + ABG)** owns substrate: graph algebra, traversal, admission, payload
  ledger, projection, provenance, selection application, evaluator regimes (F_D / F_P / F_H),
  closure-fold, replay. Owns how work is executed and proved, not what counts as risk.
- **odd_sdlc** owns software-delivery worksite governance: request → gate → specify → design →
  implement → qualify → release → deploy → observe → return → retrofit. Engages only when the
  MindForge use case is also in-house software being built.
- **mindforge_overlay** owns FS AI-governance semantics: risk taxonomy and tier labels,
  assessment instruments (AIRAQ, materiality rubrics) as versioned replayable carriers, AI
  inventory schema, AI Card / third-party disclosure schema, foundation-model pre-approval
  certificate shape, KRI catalog, recertification cadence policy, committee/escalation
  taxonomy (RDU / RAIC / AIWG / LSRC / GSRC / CAB), regulatory exclusion-screen catalog (EU AI
  Act, MAS Guidelines), and the mapping from MindForge Considerations to admitted ABG evidence.

The overlay rides ABG; nothing in this section adds financial-services carriers to GTL or ABG
core.

### Overlay Assets (admitted as ABG payloads)

| Asset | Purpose |
|---|---|
| `AiUseCaseIntake` | Initial business case, sponsor, owner, intended scope |
| `RegulatoryExclusionScreen` | Result of upstream prohibited-use check |
| `AIRAQ` | Assessment instrument itself (versioned, criteria graph) |
| `AssessmentResponse` | One instrument run; cites instrument version + responses |
| `RiskRating` | Phase-1 (initial) and Phase-2 (post-assessment) tier ratings, each discrete |
| `AiUseCaseInventoryEntry` | Read model over admitted intake + ratings + lifecycle facts |
| `FoundationModelCertificate` | Pre-approved model registration with scope and refresh cadence |
| `ThirdPartyDisclosure` | AI Card / vendor disclosure payload, schema-versioned |
| `ControlSelection` | Bound guardrails + retrieval policy + monitoring plan |
| `ResidualRiskAssessment` | After-controls rating with rationale |
| `KriDefinition` | Named metric with formula, threshold, sampling cadence |
| `KriReading` | Admitted measurement; ABG facts feed it |
| `RecertificationProfile` | Cadence + scope rule keyed to tier |
| `EscalationPath` | Declared committee chain; ABG applies, doesn't author |
| `ConsiderationTraceMatrix` | Maps MindForge Considerations to admitted L/E refs |

### Overlay Roles (GTL `Role`, FI-bound by overlay policy)

- `usecase_sponsor`, `usecase_owner`, `model_risk_officer`, `mrm_pre_approver`
- `aiwg_reviewer`, `aiwg_voter` (with quorum policy)
- `lsrc_reviewer`, `gsrc_reviewer`, `cab_approver`
- `sme_evaluator` (the F_P semantic judge)
- `tppRS_reviewer`, `infosec_reviewer`, `legal_reviewer`, `bcm_reviewer`, `orm_reviewer`, `esg_reviewer`

### Overlay Policies (overlay-owned, ABG-applied)

- `risk_tier_policy` — maps AIRAQ score → tier label
- `recertification_cadence_policy` — tier → months between recerts
- `kri_threshold_policy` — per-KRI breach → routing
- `exclusion_screen_policy` — categories that hard-block at the gate
- `escalation_policy` — tier + change_class → committee chain
- `foundation_model_reuse_policy` — when a pre-approved model exempts a use case from re-evaluating which assessment dimensions

### Substitution onto the T-131 Lane

T-131's default proof domain is `document_to_requirements`. The MindForge variant
substitutes `mindforge_ai_use_case` as the deployed domain. The bootstrap-document contract,
graph-function selection dialogue, and lawful action menu shape are unchanged.

```text
odd_chat
  -> create/open workspace
  -> load deployed ODD/GTL/ABG domain  (mindforge_ai_use_case)
  -> list & select graph function       (e.g. onboard_new_ai_use_case)
  -> walk lawful action menu            (intake -> screen -> rate -> ... -> recertify)
  -> emit ABG events + admit overlay payloads
  -> next projection
```

odd_sdlc re-engages only when a lawful action opens a child build worksite. For procurement
paths the lane runs purely on ABG + overlay.

### Deployed Domain Package Layout

```
deployed/mindforge_ai_use_case/
├── domain.json                          # GTL module manifest
├── bootstrap.md                         # T-131-style scenario contract
├── gtl/
│   ├── graph.json                       # lifecycle graph
│   ├── graph_functions/                 # published GFs
│   └── candidate_families/              # escalation_path family, exclusion_screen family
├── policies/                            # overlay policy surfaces
├── instruments/
│   ├── airaq.v1.json                    # questionnaire as a versioned asset
│   └── materiality_rubric.v1.json
├── schemas/                             # admitted-payload schemas
├── roles/
│   └── role_bindings.json               # FI persona bindings
└── projections/
    ├── ai_inventory.projection.json
    └── consideration_trace_matrix.projection.json
```

Everything in `policies/`, `instruments/`, `schemas/`, and `projections/` is overlay-owned.

### Bootstrap Document Shape (mirrors T-131 contract)

```markdown
# mindforge_ai_use_case bootstrap

product:        odd_chat
build_tenant:   typescript
deployed_domain: mindforge_ai_use_case
default_graph_function: onboard_new_ai_use_case

## Lifecycle Graph

nodes:
  intake
  exclusion_screen
  phase1_risk_rating
  build_or_procure          # CandidateFamily
  foundation_model_binding
  control_selection
  phase2_risk_rating
  aiwg_review               # F_H gate
  sub_committee_chain       # F_H chain
  deployment                # phased
  runtime_operation         # KRI stream + incidents
  recertification_loop
  retirement

## Lawful Actions

- id: A-01
  node: intake
  graph_function: admit_ai_use_case_intake
  source_assets: [operator_prompt, sponsor_record]
  target_asset: asset:AiUseCaseIntake
  expected_carrier: SdlcPayloadAdmission
  human_decision: confirm scope, sponsor, owner
  retry_action: amend_intake_fields
  done_predicate: intake_admitted

- id: A-02
  node: exclusion_screen
  graph_function: run_regulatory_exclusion_screen
  source_assets: [asset:AiUseCaseIntake, policy:exclusion_screen_policy]
  target_asset: asset:RegulatoryExclusionScreen
  expected_carrier: F_D admission with categories matched
  human_decision: review borderline classifications
  retry_action: refine_intake_scope
  done_predicate: screen_passed OR screen_blocked

- id: A-03
  node: phase1_risk_rating
  graph_function: derive_phase1_risk_rating
  source_assets: [asset:AiUseCaseIntake, instrument:airaq.v1]
  target_asset: asset:RiskRating(phase=1)
  expected_carrier: AssessmentResponse + RiskRating
  human_decision: rater confirms business-process inputs
  retry_action: re-rate_with_updated_inputs
  done_predicate: phase1_tier_admitted

- id: A-04
  node: build_or_procure
  graph_function: select_build_path
  candidate_family: [in_house, third_party]
  human_decision: sponsor selects path
  done_predicate: path_admitted

- id: A-04a (in_house branch)
  open_subtraversal: odd_sdlc.worksite
  expected_carrier: SdlcEdgeFulfillmentLedger from odd_sdlc
  done_predicate: implementation_qualified

- id: A-04b (third_party branch)
  graph_function: run_tppRS_intake
  target_asset: asset:ThirdPartyDisclosure
  done_predicate: vendor_disclosure_admitted

# A-05 foundation_model_binding (reuse_certificate | open_mrm_preapproval)
# A-06 control_selection (F_P over policy + admitted threats)
# A-07 phase2_risk_rating (final tier)
# A-08 aiwg_review (F_H with quorum)
# A-09 sub_committee_chain (LSRC -> GSRC -> CAB)
# A-10 deployment (phased rollout + kill-switch operator)
# A-11 runtime_operation (KRI sampling jobs + incident routing)
# A-12 recertification_loop (cadence trigger -> fresh phase2)
# A-13 retirement

## Acceptance Criteria

- Every lifecycle node admitted at least once for the worked use case.
- ConsiderationTraceMatrix projection covers every MindForge Consideration with admitted L/E refs.
- Two named KRIs (Faithfulness, Context Precision/Recall) wired with thresholds.
- Recertification re-entry fires at policy cadence and produces a fresh Phase-2 RiskRating row.

## Test Expectations

- npm run test:t131:mindforge          # deterministic contract validation
- npm run test:t131:mindforge:live     # opt-in live walk over the lifecycle
```

The bootstrap document is the single scenario source of truth. The harness rejects missing
lifecycle nodes, duplicate action ids, missing graph-function bindings, missing deploy/test
commands, or missing expected output assets — the same rule that already governs the
`document_to_requirements` variant.

### Worked Example — PRUShield-class Chatbot

| Step | Operator UX | Behind the scenes |
|---|---|---|
| 1 | `odd-chat new workspace prushield` | Workspace created; lane harness writes scaffolding |
| 2 | `odd-chat load-domain mindforge_ai_use_case` | Deployed domain registered; policies/instruments/schemas loaded |
| 3 | `odd-chat select-function onboard_new_ai_use_case` | Graph-function bound for this workspace |
| 4 | Lawful action menu, top entry A-01 intake | F_P prompt to operator for sponsor/owner/scope |
| 5 | Operator confirms; `asset:AiUseCaseIntake` admitted | ABG emits `payload_admitted`; provenance carrier records role + worker |
| 6 | A-02 exclusion_screen | F_D check against `exclusion_screen_policy`; passes; `RegulatoryExclusionScreen` admitted |
| 7 | A-03 phase1 rating | AIRAQ presented; SME enters responses; rating derived via `risk_tier_policy`; `RiskRating(phase=1)` admitted as Moderate-candidate |
| 8 | A-04 build_or_procure | Operator selects `in_house`; lane opens odd_sdlc child traversal |
| 9 | odd_sdlc worksite runs: requirement → design → implement → qualify → release | Standard SDLC carriers admitted; odd_chat shows progress projection without rehosting odd_sdlc UX |
| 10 | A-05 foundation_model_binding | `FoundationModelCertificate` lookup; certified model bound via `same_object` |
| 11 | A-06 control_selection | F_P call produces `ControlSelection` (PII mask, jailbreak filter, citation enforcement, retrieval-index pin, Faithfulness + Context P/R sampling) |
| 12 | A-07 phase2_risk_rating | Final AIWG inputs admitted; `RiskRating(phase=2)` = Moderate |
| 13 | A-08 aiwg_review | F_H edge; quorum-aware; AIWG votes admitted as `AssessmentResponse` |
| 14 | A-09 sub_committee_chain | LSRC → GSRC → CAB sign-offs admitted per `escalation_policy` |
| 15 | A-10 deployment | Phased rollout gates; kill-switch operator published; rollback admitted as typed operator |
| 16 | A-11 runtime_operation | KRI sampling jobs emit `KriReading` events; thresholds wired to re-entry routes |
| 17 | KRI breach (Faithfulness < 0.95) | `kri_threshold_policy` routes back to A-07 with `change_class = quality_regression` |
| 18 | A-12 recertification_loop | Cadence policy fires annually; opens fresh A-07 with `change_class = scheduled_recertification` |
| 19 | At any point: `odd-chat project consideration_trace_matrix` | Projection emits MindForge Consideration → admitted L/E refs view from event log |

The operator never leaves odd_chat; the lane never leaves ABG; nothing in this walk requires
adding a carrier to GTL or ABG core.

### Where odd_sdlc Engages

odd_sdlc is the builder in two senses:

1. **At T-131 setup time** — odd_sdlc builds odd_chat and builds the `mindforge_ai_use_case`
   deployed-domain package. The bootstrap document for that build sits in
   `build_tenants/typescript/test_env/fixtures/t131_guided_odd_chat_mindforge/bootstrap.md`,
   mirroring T-131 conventions.
2. **At runtime, inside the A-04a branch** — when the onboarded AI use case is itself an
   in-house build, the MindForge lifecycle opens a child odd_sdlc worksite. The worksite
   emits ordinary SDLC evidence; MindForge consumes the qualification carriers as inputs to
   `control_selection` and `phase2_risk_rating`.

For procurement paths (A-04b), odd_sdlc is silent; only the overlay and ABG carry the run.

### F_P / F_D / F_H Assignment

| Edge | Regime | Worker |
|---|---|---|
| admit_ai_use_case_intake | F_D admission | system |
| run_regulatory_exclusion_screen | F_D policy lookup | system |
| derive_phase1_risk_rating | F_P (AIRAQ + rater) | sme_evaluator role |
| select_build_path | F_H | usecase_sponsor role |
| bind_foundation_model | F_D lookup or F_P pre-approval | system / model_risk_officer |
| control_selection | F_P | architect role + sme_evaluator |
| derive_phase2_risk_rating | F_P | aiwg_reviewer roles |
| aiwg_review (vote) | F_H with quorum | aiwg_voter role |
| sub_committee_chain | F_H | lsrc/gsrc/cab roles |
| deployment phased gates | F_D | system |
| kill_switch_engaged | F_D operator | runtime |
| kri_sampling jobs | F_D measurement + F_P judge for semantic KRIs | system + sme_evaluator |
| recertification cadence trigger | F_D schedule | runtime |
| recertification outcome | F_P → F_H | aiwg / committees |

Behavioral F_D smell to watch for: `derive_phase1_risk_rating` and `control_selection` must
not drift into F_D just because they have deterministic-looking lookups underneath. Their
semantic judgment is F_P; only the underlying policy lookup is F_D.

### What This Ships

- MindForge ships as a deployable artifact, not a code patch. The same odd_chat that runs
  `document_to_requirements` runs `mindforge_ai_use_case` by loading a different domain.
- odd_sdlc proves it can build both odd_chat and the MindForge domain pack through one
  T-131-shaped lane. That is a release-readiness signal without the data_mapper-scale runtime.
- The compliance projection is derivable, not authored. `ConsiderationTraceMatrix` is
  replayable from admitted events.
- The boundary holds. Nothing in this walk adds a financial-services carrier to GTL or ABG.

### First Concrete Cuts for the MindForge Variant

1. Fork the T-131 bootstrap template into
   `build_tenants/typescript/test_env/fixtures/t131_guided_odd_chat_mindforge/bootstrap.md`.
2. Define `mindforge_ai_use_case` `domain.json` and the lifecycle graph.
3. Stand up AIRAQ v1 as a versioned instrument carrier with the Phase-1 / Phase-2 admission
   shape.
4. Wire two KRIs (Faithfulness, Context Precision/Recall) with policies and re-entry routes.
5. Build `ConsiderationTraceMatrix` projection.
6. Add `npm run test:t131:mindforge` (deterministic) and `npm run test:t131:mindforge:live`
   (opt-in).

One worked PRUShield-class walk through that lane exercises every overlay surface against a
real audit narrative without touching abiogenesis core or odd_sdlc internals.

### Boundary Note

This section adds a sibling deployed-domain target to T-131. It does not change the existing
`document_to_requirements` default, the existing fixture archive roots, the existing closure
law, or the existing non-closure conditions. The MindForge variant fixture lives under its
own `t131_guided_odd_chat_mindforge_*` archive roots and is independently invokable.
