# T-183 Delete F_D Semantic Registers And Restore Bare Admission

- id: T-183
- title: Delete F_D semantic registers and restore bare admission
- type: realization_refactor
- ticket_category: implementation_migration
- status: completed
- proof_status: closed_round_with_followup_t184
- build_tenant: typescript
- goal: gut deterministic semantic register population from the TypeScript SDLC operator, keep only bare deterministic admission/provenance/execution guards, and make selected post-transform `evaluate.C` authority-function rules the source of semantic register rows for ambiguous SDLC work
- change_intent: migrate register row meaning away from accumulated Python/Scala/Rust-oriented F_D heuristics and into selected F_P evaluator products, while preserving F_D shape checks, identity checks, freshness checks, selected-evaluation provenance, execution wrapping, and closure folding
- change_class: design_reframe
- re_entry_point: runtime_governance
- first_missing_layer: one clean boundary between F_P semantic register production and F_D admission
- triaged_at: 2026-05-25
- created_at: 2026-05-25
- updated_at: 2026-05-26
- migration_strategy: deletion_first_no_semantic_fd_register_bridge
- target_truth: ODD_SDLC remains the practical implementation of ODD methodology; current `transform.C`, `evaluate.C`, and `consequence.C` stages realize ODD authority functions, where `synthesize_model.C/F_P` produces `ProductAssetModel`, `eval_gap.C/F_P` produces `ObservationSnapshot` and `GapPressureRow`, `evaluate_action.C/F_P` produces the semantic judgment that becomes `EdgeFulfillmentLedger` and `EdgeClosureDecision`, and deterministic system/consequence code only admits, writes, projects, and transitions over selected F_P evaluation truth
- superseded_truth: deterministic code that infers register row meaning from ADR prose, file paths, build-tool conventions, stale archives, language-specific test output, or source-specific runtime heuristics
- closure_law: no requirement-bearing generated asset edge may close from a register, postflight status, materialized file row, tag, path, or diagnostic whose semantic meaning was synthesized or evaluated by F_D; closure requires selected authority-function output from a declared lineage-reachable ledger snapshot or explicit project-declared structured authority, with F_D limited to admission, fact writing, replay, and deterministic projection over that selected F_P evaluation truth
- evaluation_criteria: deterministic tests prove F_D semantic register synthesis paths are deleted or fail closed, F_P evaluator products are required for semantic register rows, analyzer/runtime admission use the same helpers, stale carrier fragments are rejected, and live JS hello world, Rust server hello world, and data mapper run without source-specific F_D compensations
- non_closure_conditions: source-specific parser or build-tool fixes in generic SDLC, deterministic ADR-to-depth synthesis, deterministic failure-to-repair semantic scheduling, deterministic postflight/materialization/obligation checks blocking or closing product work, path/tag/schema-only fulfillment, latest-mtime or archive-presence authority, alias/fenced/payload wrapper admission for evaluator sidecars, stale structured carrier blocks admitted beside fresh prose, fallback commands satisfying nontrivial test execution authority, evaluator authority rules reading ambient workspace/prose/logs/paths without declared lineage-reachable ledger snapshots, or a local evaluator surface collapsing ODD's distinct authority functions into one owner
- proof_surface: this ticket, T-181, T-182, RC3 compute-stage design module, focused T-183 tests, semantic suite, JS hello world live archive, and follow-up T-184 for handoff partition plus Rust/data-mapper live proof
- depends_on:
  - T-181
  - T-182
- absorbs:
  - T-181
  - T-182

## Intake

T-183 is the controlling execution contract for the F_P semantic-register
cleanup. T-181 and T-182 are closed as superseded into this ticket, not as
independently release-proven work.

Absorbed intent:

- T-181: implementation-design depth register truth comes from selected
  `evaluate.C/F_P`, with F_D limited to admission and consistency.
- T-182: review-grade asset adequacy is a selected `evaluate.C/F_P` judgment
  that feeds the existing edge fulfillment ledger rather than a separate review
  ledger.

T-183 generalizes both: every semantic register or ledger row for ambiguous
SDLC work must come from selected F_P evaluation or explicit project-declared
structured authority, then be admitted and written by ABG/system F_D.

ODD_SDLC remains the practical implementation of ODD methodology. The ODD
method terms are slightly stale against the current ABG/GTL compute notation,
but their functional authorities remain binding. This ticket is a terminology
bridge, not a new ontology and not a rename of the runtime:

| ODD authority function | current compute-stage spelling | admitted constitutional carrier |
| --- | --- | --- |
| `synthesize_model` | `synthesize_model.C/F_P` as a selected `evaluate.C` rule when model meaning is ambiguous | `ProductAssetModel` |
| `eval_gap` | `eval_gap.C/F_P` as a selected `evaluate.C` rule over declared lineage-reachable ledger snapshots | `ObservationSnapshot` and `GapPressureRow` |
| `evaluate_action` | `evaluate_action.C/F_P` inside the selected `evaluate.C` stage | semantic judgment projected into `EdgeFulfillmentLedger` and `EdgeClosureDecision` |
| `evaluate_next` | deterministic system policy or selected `F_P` policy after admitted evaluation truth | `NextActionProjection` over `ActionCatalog` |

`evaluate.C` is the post-transform compute-stage container. It is not a new
single semantic authority. Each evaluator rule must declare which ODD authority
function it realizes or consumes, and its output must admit into that
constitutional carrier family.

The design surfaces are the pressure chain. They are not inert documents and
not decorative assets. Their purpose is to preserve the active obligations a
human operator would carry into the next prompt. Downstream registers must be
formed from the selected upstream design surface plus dependency pressure by
`evaluate.C/F_P`; deterministic code may admit that result, but must not replace
it with path, log, language, or archive heuristics.

The current TypeScript operator has the right high-level architecture:

```text
transform.C/F_P -> candidate artifact
evaluate.C/F_P -> semantic register / findings / pressure map
F_D admission/fact writer -> shape, identity, provenance, freshness, consistency diagnostics
ABG/system -> events, ledgers, projection, replay over admitted evaluator truth
consequence.C/F_D -> deterministic continuation projection over selected F_P evaluation
```

The defect is that several F_D surfaces still populate or preserve semantic
register meaning. That made the system look good on the observed Python, Scala,
and Rust live lanes while accumulating non-general rules:

- build-tool command inference for npm, pnpm, yarn, sbt, maven, gradle, and
  node test discovery
- deterministic failure-to-repair schedule construction
- deterministic design-depth or component-depth row assembly from existing
  artifacts
- parser bridges that accept alias, wrapper, fenced, or stale carrier forms
- worker prompts that let prose be fresh while structured JSON carriers remain
  stale
- obligation pressure that workers rediscover by regex instead of receiving a
  typed requirement-pressure carrier

That is not a general-purpose SDLC. It is a partly generic SDLC with observed
project conventions encoded in deterministic helpers.

## Target Boundary

F_D remains necessary, but it must be bare. It is an information writer and
system effect mechanism, not a product evaluator.

Allowed F_D:

- exact carrier shape admission
- enum and schema checks
- selected composition, selected regime, actor, and run provenance checks
- freshness and stale-reference rejection
- deterministic evidence existence and digest checks
- execution wrapping of explicitly admitted commands
- replay-visible event and ledger writing
- deterministic projection over admitted F_P evaluation facts
- diagnostic facts for missing evidence, stale evidence, or invalid facts

Disallowed F_D:

- inferring design-depth semantics from ADR prose
- inferring module/component/test topology from filenames or directory names
- deciding repair cause or repair target from logs as closure truth
- constructing semantic repair schedules from execution output
- translating build-tool module names into runner-specific commands for
  nontrivial execution authority
- treating tags, paths, schema presence, archive presence, or latest mtime as
  fulfillment
- blocking, retrying, yielding, or closing generated product work from
  deterministic postflight/materialization/obligation checks
- accepting stale structured carrier JSON because surrounding prose was updated
- accepting alias wrappers or fenced Markdown for evaluator sidecar truth

The rule is:

```text
F_P evaluates ambiguity and produces semantic row / ledger candidates.
ABG/system F_D admits and writes the ledgers.
F_D does not invent semantic rows.
```

The concrete implementation target is F_P-generated content ledgers:

```text
selected evaluate.C rule
  -> sdlc_evaluate_content_ledger
  -> F_D admission of selected composition / regime / actor / shape / evidence
  -> exact projection to legacy register carrier only where a downstream
     consumer still requires that register shape
```

The legacy `*_register.json` files are therefore projection carriers during the
migration. They are not semantic source truth. If a register file exists without
the selected F_P content ledger that produced it, closure must block.

## Algorithmic Definitions

The generic SDLC node algorithm is:

```text
node(A, B):
  basis = admitted A + declared lineage-reachable ledger snapshot
    + admitted dependency pressure for A
  transform_candidate = selected transform.C(basis)
  authority_output = selected evaluate.C authority rule over basis
    + transform_candidate
  admitted_pressure = ABG/system F_D admits authority_output by shape,
    selected composition, selected regime, actor/run provenance, freshness,
    evidence refs, and carrier contract
  B = admitted target carrier + admitted pressure ledgers
  next_action = consequence.C(admitted ABG state)
```

For a chain:

```text
A -> B -> C -> D
```

the delivery of `D` is constrained by the obligation ledger created by
`(A, B, C)`. Each upstream admitted surface becomes dependency pressure for the
next selected evaluator. The downstream evaluator does not rediscover that
pressure by regex, filesystem shape, or language convention. It receives it as
typed input and produces typed semantic candidates.

The evaluator-ledger algorithm is:

```text
evaluate.C authority rule
  -> ProductAssetModel | ObservationSnapshot + GapPressureRow
     | EdgeFulfillmentLedger + EdgeClosureDecision
     | NextActionProjection over ActionCatalog
  -> ABG/system F_D admission
  -> ABG/system F_D ledger writer
  -> admitted ledger
```

## Existing Requirement-To-Function Fulfillment Chain

File creation, file role classification, requirement tags, output existence, and
materialized product-file deltas are evidence observations. They are not product
requirement fulfillment. This is not new architecture. It is the product and
requirements law that T-183 must restore after implementation drift reduced
fulfillment to boundary/file/postflight tracking.

The existing closure chain to enforce is:

```text
Requirement
  -> product requirement row
  -> design requirement / design obligation row
  -> component or module responsibility
  -> declared product target
  -> code symbol, callable function, exported API, route, CLI, or executable entrypoint
  -> test function, test case, execution evidence, or review-grade evaluator finding
  -> EdgeFulfillmentLedger
  -> EdgeClosureDecision
```

The purpose of every semantic evaluator in this chain is lineage-preserving
depth assessment. Each evaluator takes the accumulated upstream requirements and
design pressure as input, subdivides or checks it at its stage boundary, and
emits rows that preserve the path from requirement to design to module to
function. The terminal code-stage proof is not `file exists`; it is
`fn() == test.fn()` or the equivalent public/executable behavior matched to its
test or execution evidence.

The selected evaluator must make that chain explicit. For coded fulfillment, a
row is not fulfilled because a file exists or cites a requirement id. It is
fulfilled only when selected `evaluate_action.C/F_P` binds the requirement to
the product/design obligation, then to the
actual coded function surface that realizes it, and then to the test function,
test case, execution evidence, or review-grade finding that holds it to account.

Failed tests are first-class negative fulfillment evidence in the same chain.
They must produce admitted evaluator pressure against the exact requirement,
design obligation, function/entrypoint, and test function they falsified. That
pressure forces `EdgeClosureDecision` to repair/retry/block and
`NextActionProjection` to loop back through the published graph action. It must
not be handled as an untyped local retry flag or as proof that the whole edge
failed without lineage.

The minimum generic fulfillment unit for generated code is therefore:

```text
{
  requirementRef,
  productRequirementRef,
  designObligationRef,
  componentRef,
  productTargetRef,
  codeSurfaceRef,
  functionOrEntrypointRef,
  realizationEvidenceRefs,
  testOrExecutionEvidenceRefs,
  evaluatorFindingRef
}
```

`functionOrEntrypointRef` is a semantic binding produced by selected evaluation
or explicit project authority. It is not inferred by deterministic path scanning
or by assuming that a new/changed file realizes every obligation assigned to it.

This is the governing delete criterion for the operator folder. Any helper in
`operator/*` that reads files, logs, historical archives, test output, directory
names, build manifests, or language conventions and converts them into
semantic rows is not a harmless optimization. It is a second truth surface and
must be removed or demoted to non-authoritative diagnostics.

Requirement ambiguity deleted by this ticket:

- `specification/requirements/18-typed-construction-algebra.md` no longer
  states that deterministic code and deterministic tests are the highest
  disambiguation surfaces for generic SDLC product meaning.
- `REQ-F-ODDSDLC-080` now assigns semantic disambiguation to selected
  `evaluate.C/F_P` rows and admitted pressure maps; code, tests, and execution
  evidence are proof surfaces after upstream pressure has been mapped.
- `REQ-F-ODDSDLC-015` now limits layered F_D to admission, evidence, fold, and
  operational truth. It explicitly forbids hidden semantic row construction for
  generic SDLC edges.

## Source-Of-Truth Migration

Old truth path:

```text
workspace / docs / logs / paths
  -> F_D helper infers semantic register rows
  -> postflight / analyzer / closure consume inferred rows
```

New truth path:

```text
workspace observations / docs / logs / paths
  -> admitted evidence or declared lineage-reachable ledger snapshot
  -> selected evaluate.C authority rule
  -> constitutional carrier candidate or finding set
  -> F_D admission
  -> ABG/system events and ledgers
  -> consequence.C projection
```

There is no compatibility bridge for default live execution. Existing tests
that depended on deterministic semantic synthesis must either be rewritten to
provide an admitted F_P product or become negative tests proving F_D no longer
provides that product.

## Design Module Method Refactor Ledger

This refactor is governed by Design Module Method seam-closure law. Each
change must reduce truth surfaces. No row may be closed by moving old behavior
behind a new name, by adding a parser fallback, by duplicating an analyzer
admission path, or by keeping a helper that reconstructs semantic meaning after
the selected carrier is absent.

## Handoff Decomposition Architecture

`operator/handoff.ts` is not an architectural home. It is a temporary adapter
being deleted by slices. Its former responsibilities must move to the one
surface that owns the truth they manipulate:

| responsibility | architectural home | ownership rule |
| --- | --- | --- |
| worker launch package, prompt source carrier, transform request/result refs | `operator/plugins/transform/*` | `transform.C` may construct candidate work packages and candidate evidence refs only |
| design-depth evaluator sidecar admission and selected F_P provenance checks | `operator/plugins/evaluate/*` | `evaluate.C/F_P` owns semantic register candidates; F_D admits selected evaluator provenance only |
| review-grade obligation assessment admission | `operator/plugins/evaluate/*` | review-grade findings are evaluator candidates feeding the existing fulfillment ledger, not a separate ledger |
| postflight materialization and execution checks | `postflight/*` or `operator/plugins/evaluate/postflight.ts` | deterministic checks are evidence guards feeding evaluation, not semantic row producers |
| product materialization snapshot/delta and artifact archive writes | `effects/*`, `postflight/*`, and catalog-backed archive helpers | effect code writes files/archives from admitted plans; it does not invent product semantics |
| ABG/system ledger write candidates and gap dossiers | `operator/ledgers/*` or existing `assurance_gate.ts`/`traversal_consequence.ts` until split | ABG/system F_D writes ledgers and folds closure over admitted facts only |
| deterministic consequence projection | `operator/plugins/consequence/*` and `traversal_consequence.ts` | `consequence.C` projects admitted state; it does not evaluate transform quality |

Public imports from `operator/handoff.ts` are tech debt unless they are the
thin worker-launch bridge named by an open deletion row. That bridge is not an
accepted final adapter. New imports must target the owning module above. Tests
must assert this direction when they touch the moved interfaces. T-183 cannot
close while `handoff.ts` owns prompt semantics, evaluator semantics, ledger
semantics, consequence selection, product topology, stack policy, or closure
authority.

The ledger below is the work queue for this refactor. A code change is not
admissible unless it maps to a row or adds a new row first. Each row must state:

- the single authoritative truth surface after the refactor
- the interface to delete, demote, or adjust
- the graph or stage edge that must still validate
- the proof that the old duplicate surface cannot satisfy authority

Status values: `planned`, `in_progress`, `implemented_pending_proof`,
`blocked`, `closed`, or `repriced_to_ticket`.

| ledger id | surface | current duplicate or bleed | single truth after refactor | interface adjustment | graph validation | proof | status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R-001 | Refactor work control | prose cleanup can drift into ad hoc patches | this T-183 ledger is the execution work queue | every discovered interface drift is added here before patching | every row names its owning graph/stage surface | ticket diff shows row added before code change; closure requires all rows closed or repriced | closed |
| R-010 | Design-depth register admission | `design_depth_register.ts` can preserve bridge shapes and local quality checks beside selected evaluator truth | selected `evaluate.C/F_P` design-depth sidecar plus F_D structural admission | delete alias, wrapper, fenced Markdown, and semantic-quality admission as authority | `derive_implementation_design_surface` feeds downstream component/test/code edges through admitted evaluator rows | malformed/alias/fenced/stale sidecars fail closed; T-181 tests rewritten as selected F_P proof | closed |
| R-020 | Component-depth and repair carriers | `component_depth_register.ts` and post-transform output can carry stale structured blocks under fresh prose | exact selected component-depth / repair carrier from F_P or explicit project authority | reject stale carrier refs; remove wrapper/bridge shapes that satisfy authority | component design, repair schedule, and repair continuation edges consume admitted carriers only | stale JSON under fresh prose fails; data mapper repair schedule replay proves no stale row is consumed | repriced_to_ticket:T-184 |
| R-030 | Handoff semantic constructors | `handoff.ts` can construct depth, test, repair, and release semantic rows from docs/logs/paths | F_P/project produces row meaning; F_D only admits, packages, writes diagnostics, and projects admitted evaluator truth | delete/demote `baseComponentDepthRegister(...)`, `repairScheduleForFailures(...)`, and post-transform semantic row assembly | all generated asset edges still have target carriers and closure paths without F_D semantic synthesis | negative tests prove missing selected F_P rows prevent closure through evaluator requirements, not through F_D postflight | closed |
| R-040 | Test schedule and execution commands | build-tool heuristics can translate directories into nontrivial commands | admitted F_P/project test schedule rows own nontrivial test command truth | demote `executionShardCommand(...)` to declared full-suite fallback only; wrap admitted rows in `testExecutionPreparationRowsForManifest(...)` | `derive_test_design_surface`, `derive_test_execution_surface`, and result qualification edges remain connected | T-066/T-115 tests prove sbt/npm/etc heuristics cannot satisfy schedule authority | closed |
| R-050 | Requirement pressure to workers | workers rediscover obligations by regex from prose briefs or ids-only construction briefs | typed obligation pressure rows on the canonical `worker_construction_brief.json`; `worker_invocation_package.json` remains an archive/audit projection | add `obligations.inlineObligations[]` and `obligations.inlineRequirementPressureRows[]` to the construction brief; prompts name those rows as the work queue | every asset-producing edge receives incoming obligation pressure as a typed carrier on its canonical prompt source | prompt/package fixture proves the canonical brief carries typed rows and no regex-only fallback is required | closed |
| R-060 | Evaluate.C authority decomposition | evaluator rows can become one local semantic owner that collapses ODD authority functions | one selected post-transform `evaluate.C` stage contains authority-declared rules mapped to ODD carriers and emitted as `sdlc_evaluate_content_ledger` artifacts | each rule declares `synthesize_model`, `eval_gap`, `evaluate_action`, or `evaluate_next`, and carries selected composition, regime, actor, run, lineage snapshot, and candidate refs | design-depth, review-grade, repair disposition, and next-action policy rules admit through their constitutional carriers, not local register ownership | focused T-183 test proves mixed authority rules write only through the common ABG/F_D ledger writer and cannot omit declared authority role | repriced_to_ticket:T-184 |
| R-061 | Model synthesis authority | design-depth/component-depth rows can look like standalone register truth | ambiguous model meaning admits as `ProductAssetModel` output from `synthesize_model.C/F_P` in an F_P content ledger | map design-depth and component-depth evaluator outputs to model carrier refs before downstream use; legacy register files are exact projections only | downstream register construction cites model carrier refs and dependency pressure | tests fail when design-depth/component-depth rows are consumed without model carrier authority | repriced_to_ticket:T-184 |
| R-062 | Gap pressure authority | gap rows can be inferred from workspace/log/prose observation | `eval_gap.C/F_P` reads declared lineage-reachable ledger snapshots and emits `ObservationSnapshot` + `GapPressureRow` | require evaluator input refs to cite admitted snapshot/evidence, not ambient workspace files | gap dossiers and retry pressure consume admitted gap rows only | fixture proves direct archive/file presence cannot become gap pressure | repriced_to_ticket:T-184 |
| R-063 | Action evaluation authority | review-grade, asset adequacy, and repair cause can drift into path/schema/postflight truth | `evaluate_action.C/F_P` produces the judgment projected into `EdgeFulfillmentLedger` + `EdgeClosureDecision` | route review-grade assessments and asset adequacy into the existing fulfillment/closure carriers | closure projects only over admitted action-evaluation carriers | tests fail when tags, paths, schemas, or generic postflight close or block without action-evaluation rows | repriced_to_ticket:T-184 |
| R-064 | Next-action authority | repair schedules and continuation can become separate semantic registers | `evaluate_next.C/F_D` or `F_P` policy produces `NextActionProjection` over `ActionCatalog` | demote standalone repair-schedule rows to candidate inputs; selected next action is only the projection over published actions | repair/retry/yield/block/reprice transitions cite closure truth plus `ActionCatalog` authority | tests fail when a repair schedule register selects continuation outside `NextActionProjection` | repriced_to_ticket:T-184 |
| R-070 | Edge fulfillment / review-grade closure | fulfillment can be satisfied by path, tag, schema, local status, or generic postflight | selected F_P obligation assessment feeds the existing `SdlcEdgeFulfillmentLedger` | closure consumers require selected semantic evidence or explicit project authority | worker-dispatched generated-asset edges close only from admitted edge fulfillment ledger rows | T-182 tests prove path/tag/schema-only fulfillment fails closed | closed |
| R-071 | Consequence timing after required evaluators | `fpDispatch` can publish consequence before required review-grade `evaluate.C/F_P` artifacts are admitted, producing false missing-review retry pressure | consequence projection runs after required evaluator rules for every review-grade-required generated-asset edge | extend `shouldDeferDispatchConsequenceToFpEvaluator(...)` beyond implementation design to every manifest requiring review-grade assessment | component-code JS/Rust live edges close from admitted review-grade evidence, not pre-evaluator missing-evidence projection | T-183 source proof checks review-grade-required deferral; live JS/Rust must run without retry caused by missing review-grade evidence | repriced_to_ticket:T-184 |
| R-072 | F_D postflight diagnostic-only boundary | `evaluateSdlcComputeStage` or `deriveSdlcOperatorAssuranceGate` can convert deterministic materialization, digest, path, execution, obligation, or register-admission checks into `postflight_failed`, `retry_same_edge`, block, or close pressure before selected `evaluate.C/F_P` can judge completeness | `runSdlcPostTransformDiagnosticFlow(...)` is the single post-transform diagnostic bind; inside it `evaluateSdlcComputeStage` and deterministic assurance ledgers are diagnostic writers only, and selected F_P evaluator decides incompleteness, trace gaps, semantic adequacy, and retry pressure | all transform/no-dispatch/evaluator-refresh paths call `runSdlcPostTransformDiagnosticFlow(...)`; postflight status cannot derive from deterministic diagnostic count; `SdlcInstalledOperatorStatus` no longer exposes `postflight_failed`; hook/postflight/assurance diagnostics cannot publish closure pressure; `SdlcAssuranceLedger.required` is forced false before folding | generated-asset edges continue to review-grade `evaluate.C/F_P` even when deterministic diagnostics exist | T-183 test proves only one installed-operator call site for postflight, F_P evaluation projection, and assurance diagnostic fold; postflight returns `passed` with empty blockingReasons while diagnostics remain available; deterministic assurance ledgers fold with no required dimensions; source grep shows no live `postflight_failed` operator branch; T-182 prompt test proves `trace_missing` is F_P responsibility | closed |
| R-080 | Runtime/analyzer parity | analyzer loaders can re-admit files through parallel checks | runtime and analyzer consume the same admission helpers and carrier contracts | remove analyzer-only bridge admission in `carrier_loaders.ts`; report origin as F_P/project/invalid F_D fallback | analyzer projections mirror runtime graph truth and cannot create closure authority | fixture tests prove analyzer rejects what runtime rejects | closed |
| R-090 | Product graph and artifact catalog | required artifacts can be optional or inferred outside graph truth | catalog rows define required selected evaluator artifacts and ledger outputs for each edge | update graph/artifact catalog rows when interface authority changes | graph validation covers required artifacts for all generated-asset edges | graph/catalog tests fail when required F_P evaluator artifacts are missing | closed |
| R-100 | Prompt and governance references | prompts can carry policy prose without carrier-level work queues | one work-category governance reference per category plus typed ledger/work-order rows | compact governance docs; worker prompts consume structured work queues and replace whole target carriers on retry | each graph edge maps to one work category and one governance reference | prompt tests and live CLI evidence show bounded status output and structured carrier replacement | closed |
| R-110 | Live release proof | live lanes can pass through source-specific F_D compensations | clean live JS, Rust, and data mapper archives prove generic F_P/F_D boundary | no sandbox-specific or source-specific runtime patch is allowed | live graph traversal validates target edges and closure ledgers | JS hello world, Rust server hello world, and data mapper run clean with expected CLI/evaluator surfaces | repriced_to_ticket:T-184 |
| R-120 | Handoff monolith removal | `handoff.ts` accumulates prompt, evaluator, ledger, effect, replay, and consequence logic, allowing drift back to the wrong gain model | each block lives in its owning `.C`, ledger, postflight, admission, or effect module | move public imports away from `handoff.ts`, delete moved implementations, and allow only a named temporary worker-launch bridge with no semantic authority | all generated-asset edges still traverse through selected transform/evaluate/consequence stages | build fails if moved evaluator admission is imported from `handoff.ts`; tests prove new homes; T-183 cannot close while handoff owns prompt/evaluator/ledger/consequence/topology/stack semantics | repriced_to_ticket:T-184 |
| R-121 | Design-depth evaluator admission home | design-depth F_P sidecar admission lived inside `handoff.ts` and was re-exported as handoff logic | `operator/plugins/evaluate/design_depth_register.ts` is the single admission/provenance surface for selected design-depth evaluator sidecars | move `designDepthFpEvaluatorRegisterPath`, runtime/manifest/candidate admission, and predecessor-register lookup into evaluate plugin; update runtime/analyzer/tests imports | `derive_implementation_design_surface` and downstream component/test/code edges consume admitted evaluator rows through evaluate.C surface | `npm run build:semantic`; `npm run test:t183`; no analyzer import from handoff | closed |
| R-122 | Tenant stack authority and effective runtime | core prompts can compensate with language/build-tool-specific compatibility rules, while tenant specs can omit runtime/module-system facts needed by workers/evaluators | tenant stack authority under the selected build tenant plus effective workspace runtime context is the single stack truth; transform/evaluate prompts only enforce that authority generically | remove source-specific prompt branches; seed live fixtures with explicit `TECH_STACK.json`; require review-grade F_P to execute local declared contracts when safe | JS/Rust/data mapper live edges consume stack authority rather than SDLC core language branches | no `node/javascript` or `sbt` prompt branch remains in core; JS live fails unless emitted files match seeded stack authority and runnable evidence | repriced_to_ticket:T-184 |
| R-123 | SDLC node architecture | operator files treat nodes as imperative handoff/control helpers, obscuring that most SDLC work is selected F_P traversal over dependency pressure | each SDLC node is `A -> dependencies(A) -> selected F_P traversal/evaluation -> admitted B`; F_D only indexes, packages, admits, writes, executes declared commands, and projects consequence | add `operator/nodes/*` as the graph-node/dependency-pressure home; move node-specific prompt/evaluator semantics out of `handoff.ts` and `installed_operator.ts`; keep generic F_D guards in admission/effects/ledgers | every generated-asset graph edge declares source asset, target asset, dependency pressure, selected transform/evaluate/consequence composition, and carrier contract | structural tests fail if a node-specific semantic rule is added to handoff/installed operator instead of a node/plugin module | repriced_to_ticket:T-184 |
| R-124 | Design surface pressure chain | design surfaces can be generated as meaningless artifacts while downstream registers are rebuilt from F_D heuristics or stale archive shape | every downstream semantic register cites and consumes the selected upstream design surface plus dependency pressure as its source basis | add explicit pressure-basis carriers to node/plugin inputs; delete register paths that can close without the selected upstream design surface; make evaluator prompts treat design surfaces as active work orders | implementation-design -> design-depth register, component-code -> review-grade fulfillment, test-design -> test register, repair/release surfaces all preserve pressure lineage | tests fail when a register is admitted without selected design-surface refs and dependency-pressure refs | repriced_to_ticket:T-184 |
| R-125 | Requirement ambiguity deletion | requirements/design could be read to mean deterministic code/tests, layered F_D, or assurance ledgers are the highest generic semantic authority | requirements define selected `evaluate.C/F_P` semantic rows and admitted pressure maps as generic SDLC disambiguation authority; F_D is admission/evidence/fold/effects only | update `REQ-F-ODDSDLC-015`, `REQ-F-ODDSDLC-074`, `REQ-F-ODDSDLC-080`, RC3 compute-stage design, and deterministic traversal-state design; remove wording that lets F_D derive semantic row meaning | construction graph closure depends on evaluator pressure, not code/test existence alone | requirement/design diff shows deterministic-code-as-highest-disambiguation text deleted and assurance ledgers framed as projections over selected evaluator facts; tests that depended on F_D semantic synthesis are rewritten or fail closed | closed |
| R-126 | Requirement-to-function fulfillment | product/materialization tracking can treat created files, file roles, or requirement tags as fulfillment without binding the requirement through design to a coded function surface | selected `evaluate_action.C/F_P` or explicit project authority produces requirement-to-function fulfillment bindings consumed by `SdlcEdgeFulfillmentLedger` | demote `postTransformObligationAssessments(...)` to evidence/report shape only; add/admit fulfillment rows that bind requirement -> product requirement -> design obligation -> component/product target -> function/API/route/CLI/entrypoint -> evidence | component-code, test, qualification, and code-rollup edges close only when coded fulfillment rows cite function/entrypoint refs and realization evidence | negative tests fail when new files or requirement tags close an obligation without a selected requirement-to-function binding | repriced_to_ticket:T-184 |
| R-127 | ABG loop plugin-to-ledger audit | dead code and hidden deterministic evaluation paths can survive because the operator folder is too large to inspect linearly | audit from the core ABG loop outward: every semantic generated-asset path must be `runEngineIterateAsync -> plugin.evaluate.C/F_P rule -> F_D admission -> ABG/system ledger writer -> consequence.C`; deterministic postflight may only write evidence/shape diagnostics | build a trace matrix for every SDLC plugin supplied to ABG, listing contract computeMeans, effect kind, produced carrier, admission helper, ledger writer, and closure consumer; delete or demote any path that reaches `SdlcEdgeFulfillmentLedger` without selected `F_P` evaluator evidence | all transform/evaluate/consequence plugin paths preserve selected composition/regime identity and the `F_P` evaluator output appears before edge ledger construction | focused audit test fails if generated-asset edge closure is reachable through F_D postflight/materializedFiles/obligationAssessments without an admitted `evaluate.C/F_P` rule outcome | repriced_to_ticket:T-184 |
| R-128 | Ledger suspicion audit | every extra ledger/register can become a hidden source of semantic truth beside selected evaluator output | all non-ABG/non-edge-fulfillment ledgers are suspect until classified as one of: ABG/system runtime ledger, selected `evaluate.C/F_P` content ledger, exact projection over admitted evaluator truth, read-model projection, or diagnostic-only artifact | inventory every `*ledger*` and `*register*` carrier/artifact; for each, record producer, compute means, admission helper, selected-composition evidence, consumed-by surfaces, and whether it can affect closure/retry/next action | only `SdlcEdgeFulfillmentLedger` plus ABG/system ledgers can drive closure, and they must derive from selected `evaluate.C/F_P` or explicit project authority | negative tests fail if lineage, assurance, managed traversal, requirement-closure, co-affirmation, DAG/frontier, or register artifacts can close/retry/select next work without selected evaluator or ABG admission lineage | repriced_to_ticket:T-184 |
| R-129 | System artifact write authority | `.ai-workspace` prompts, ledgers, reports, evaluator projections, manifests, and gap dossiers can be written through scattered module-local filesystem calls | one ABG/system artifact writer owns every `.ai-workspace` system artifact write; the only other legitimate writer is the selected transformer/evaluator process writing its contracted work output or product work surface | add `operator/system_artifacts.ts`; route operator archive artifacts, evaluator prompts/results, content-ledger projections, product-materialization manifests, and gap dossiers through it; leave product work-surface materialization to transformer only | every transform/evaluate/consequence stage still writes required archive artifacts and product artifacts, but system artifacts cite the single writer path | source test fails when evaluator/system modules call raw `writeFileSync` for `.ai-workspace` artifacts instead of the ABG/system artifact writer; live JS/Rust archives still materialize expected prompts/logs/ledgers | repriced_to_ticket:T-184 |

Ledger closure rule: if a row changes an interface, the implementation must
delete or demote the old authority path before adding the replacement consumer.
If deletion breaks tests, the repair must consume the single selected carrier or
be repriced. A green test produced by a duplicate path is non-closure.

## Evaluate.C Authority Fan-Out Target

The cleanup target is not a single monolithic evaluator and not a new semantic
authority. The target is one selected post-transform `evaluate.C` stage that can
contain an evaluation set. Each rule declares the ODD authority function it
realizes, and each admitted result is written through ABG/system F_D:

```text
evaluate.C {
  synthesize_model.C/F_P -> ProductAssetModel candidate
    -> ABG.ledger_writer.F_D -> admitted model ledger
  eval_gap.C/F_P -> ObservationSnapshot + GapPressureRow candidate
    -> ABG.ledger_writer.F_D -> admitted gap ledger
  evaluate_action.C/F_P -> EdgeFulfillmentLedger + EdgeClosureDecision candidate
    -> ABG.ledger_writer.F_D -> admitted closure ledger
  evaluate_next.C/F_D or F_P policy -> NextActionProjection candidate
    -> ABG.ledger_writer.F_D -> admitted next-action projection
}
```

The F_P evaluator rule owns semantic judgment for ambiguous row sets. It may
produce a design-depth pressure map, a gap-pressure map, an action adequacy
assessment, or a next-action policy proposal through the carrier family above.
Repair is not a standalone schedule authority: repair appears as
`EdgeClosureDecision.disposition=repair` plus `NextActionProjection` over
published repair actions. The evaluator does not write runtime truth.

## Current Proof Notes

- `20260525T052710717Z_pid33956` JS hello-world live run exposed the intended
  stack-authority behavior: the worker first emitted a test file that violated
  the effective ESM runtime, executed the declared test command, observed the
  runtime failure, repaired the test to conform to the seeded tenant
  `TECH_STACK.json`, reran the test, and closed through review-grade
  evaluation.
- This is evidence for R-122 and for the T-183 round close. Full Rust server
  and data mapper live proof is repriced to T-184 because it depends on the
  remaining handoff partition and side-effect cleanup.

ABG/system F_D owns:

- accepting or rejecting each evaluator result
- checking selected composition/regime/actor/run identity
- checking schema, freshness, references, and required evidence
- writing admitted ledger rows
- preserving replay-visible provenance

This gives SDLC multiple overlapping evaluators without adding multiple hidden
truth surfaces. There is one selected post-transform `evaluate.C` stage, many
typed authority-declared rules inside it, and one deterministic ABG write path.

## ABG Loop Audit Strategy

The audit walks from the core ABG loop outward, not from `operator/` file order.
For each plugin supplied to ABG, record this trace:

```text
ABG runner effect
  -> selected plugin contract
  -> computeMeans
  -> plugin output carrier
  -> ABG/system admission helper
  -> SDLC carrier projection
  -> ledger writer
  -> closure/consequence consumer
```

Generated-asset semantic closure must have this shape:

```text
runEngineIterateAsync
  -> plugin.evaluate.C/F_P rule
  -> EvaluationRuleOutcome admitted by ABG
  -> selected evaluator sidecar/content ledger admitted by F_D
  -> SdlcEdgeFulfillmentLedger
  -> EdgeClosureDecision
  -> consequence.C/F_D projection
```

The audit fails if the chain is:

```text
file delta / requirement tag / postflight / F_D obligation assessment
  -> SdlcEdgeFulfillmentLedger
```

without an admitted selected `evaluate.C/F_P` rule outcome in between.

Core trace anchors:

- ABG plugin set contract: `EngineRunnerPluginSet`
- ABG loop: `runEngineIterateAsync`
- ABG evaluation-set admission: `constructEvaluationSetPlan`,
  `constructEvaluationSetAdmission`, and `constructEvaluationSetProjection`
- SDLC plugin registration: `executeInstalledOperatorStart` plugin set passed to
  `runEngineIterateAsync`
- SDLC F_P evaluator rules: design-depth and review-grade evaluation rules
- SDLC ledger writer: `deriveInstalledTraversalConsequence` and
  `writeTraversalConsequenceArchive`

## Finite ABG Plugin Trace Ledger

The plugin audit is finite. T-183 traces every `EngineRunnerPluginSet` slot and
every concrete SDLC rule supplied to `runEngineIterateAsync`. No generated-asset
closure path is allowed outside this ledger.

Current ABG plugin slots:

```text
fdEvaluator
fpEvaluator
fpDispatch
fhAdmission
consequenceProjection
transformTasks[]
evaluationRules[]
consequenceTasks[]
requiredTransformTaskRefs[]
requiredEvaluationRuleRefs[]
requiredConsequenceTaskRefs[]
```

Current SDLC installation supplies `fpDispatch`, `fpEvaluator`,
`consequenceProjection`, two required `evaluationRules`, and no
`transformTasks` or `consequenceTasks`.

| plugin row | ABG slot / effect | current SDLC plugin or rule | stage / means | output carrier | T-183 trace requirement | status |
| --- | --- | --- | --- | --- | --- | --- |
| P-001 | `fdEvaluator` / `fd_evaluate` | ABG default unless explicitly supplied | `evaluate` / `F_D` | `FdEvaluationOutcome` | prove this cannot produce semantic register rows, obligation fulfillment, repair scheduling, next action, or closure for generic generated assets; it may only guard/admit/fold declared deterministic evidence | closed |
| P-002 | `fpDispatch` / `fp_dispatch` | `plugin://odd-sdlc/typescript/installed-operator/fp-dispatch` | `transform` / `F_P` | `FpDispatchOutcome` plus worker report/artifacts | prove transform output is candidate/evidence only and cannot close without selected `evaluate.C/F_P` rows; worker report obligation assessments are evidence until reviewed/admitted | repriced_to_ticket:T-184 |
| P-003 | `fpEvaluator` / `fp_evaluate` | `plugin://odd-sdlc/typescript/installed-operator/fp-evaluator` | `evaluate` / `F_P` | `FpEvaluationOutcome` | prove scalar evaluation consumes admitted evaluation-rule evidence and selected design-depth/review-grade state; it must not synthesize semantic truth from F_D postflight, files, tags, or stale archives | repriced_to_ticket:T-184 |
| P-004 | `evaluationRules[]` / `evaluation_rule_evaluate` or `evaluation_rule_batch_evaluate` | `evaluation-rule://odd-sdlc/design-depth-register/fp` | `evaluate` / `F_P` | `SdlcDesignDepthRegister` projected from `sdlc_evaluate_content_ledger` | prove design-depth/model rows are produced by selected F_P content ledger with selected composition/regime identity; legacy register file is exact projection only | repriced_to_ticket:T-184 |
| P-005 | `evaluationRules[]` / `evaluation_rule_evaluate` or `evaluation_rule_batch_evaluate` | `evaluation-rule://odd-sdlc/review-grade-edge-fulfillment/fp` | `evaluate` / `F_P` | `SdlcReviewGradeEdgeFulfillmentAssessment` | prove every close-capable generated asset receives review-grade requirement-to-function assessment and failed tests become lineage-bound pressure, not local retry flags | repriced_to_ticket:T-184 |
| P-006 | `consequenceProjection` / `consequence_project` | `plugin://odd-sdlc/typescript/installed-operator/consequence-projection` | `consequence` / `F_D` | `ConsequenceProjectionOutcome` | prove consequence only projects from admitted ABG/evaluator state into `SdlcEdgeFulfillmentLedger`, `EdgeClosureDecision`, and `NextActionProjection`; it must not create semantic closure from raw evidence | repriced_to_ticket:T-184 |
| P-007 | `fhAdmission` / `fh_admit` | ABG default unless explicitly supplied | external human callout | `FhAdmissionOutcome` | prove human work is external response evidence only; no hidden F_H adapter may write closure or semantic registers outside ABG admission | closed |
| P-008 | `transformTasks[]` / `composed_stage_task_batch_run` with `stageRole=transform` | none currently supplied | none currently active | `ComposedStageTaskOutcome` if added later | prove absence in current SDLC install; if added, each task must be traced as `transform.C` candidate/evidence only and must not bypass F_P evaluation | closed |
| P-009 | `consequenceTasks[]` / `composed_stage_task_batch_run` with `stageRole=consequence` | none currently supplied | none currently active | `ComposedStageTaskOutcome` if added later | prove absence in current SDLC install; if added, each task must remain deterministic projection/effect work over admitted state only | closed |
| P-010 | required plugin refs | `requiredEvaluationRuleRefs = [design-depth, review-grade]`; required transform/consequence task refs empty | ABG admission gate | required-rule/blocking state | prove generated-asset closure blocks when either required F_P evaluation rule is missing, stale, malformed, mismatched to selected composition/regime, or not applicable without declared no-close authority | repriced_to_ticket:T-184 |

Trace anchors for this ledger:

- ABG slot type: `build_tenants/typescript/node_modules/@abiogenesis/typescript-tenant/build/semantic/code/src/abg/m03/contracts/plugins.d.ts`
- SDLC plugin contracts: `build_tenants/typescript/code/src/operator/installed_operator.ts`
- SDLC plugin registration: `plugins` object passed to `runEngineIterateAsync`
- ABG effect admission: `resolveAsyncEnginePluginEffect` and
  `resolveSyncEnginePluginEffect`

Trace update:

- 2026-05-26: P-005/P-006 first enforcement slice implemented. Edge assurance
  now distinguishes raw worker self-assessment evidence from selected
  review-grade F_P evidence by adding `review_grade_assessment` as a required
  evidence source for review-grade-required generated assets. Consequence
  projection can still admit worker assessments as evidence, but generated-asset
  closure now carries residual pressure unless admitted evidence includes the
  selected review-grade source kind. Focused proof:
  `npm run build:semantic`, `npm run test:t182`, `npm run test:t183`, and
  `git diff --check`.
- 2026-05-26: P-004/P-010 closed-carrier admission slice implemented for
  `sdlc_evaluate_content_ledger`. Admission now rejects extra top-level keys and
  extra row keys, so bridge-shaped evaluator ledgers cannot carry hidden
  semantic surfaces beside the selected content row. Focused proof:
  `npm run build:semantic`, `npm run test:t181`, `npm run test:t182`,
  `npm run test:t183`, and `git diff --check`.
- 2026-05-26: P-003/P-005 scalar-evaluation pressure slice implemented. Open
  selected review-grade F_P findings now produce
  `pressure://odd-sdlc/review-grade/...` refs that the scalar `fpEvaluator`
  carries into `FpEvaluationOutcome`, forcing `no_close` instead of allowing
  deterministic postflight diagnostics to stand in for unresolved semantic pressure. Focused
  proof: `npm run build:semantic`, `npm run test:t182`, `npm run test:t183`,
  and `git diff --check`.
- 2026-05-26: P-001 traced closed. The installed operator handles
  `fd_advance` before entering the ABG attached runner and only permits
  `Fg_conform_project` as managed project-conformance induction. Every other
  F_D transition returns `unsupported_fd_transition`; no generic generated-asset
  edge reaches ABG default `fdEvaluator` as a closure authority.
- 2026-05-26: P-007/P-008/P-009 traced closed and locked by
  `test_t183_plugin_trace_ledger.test.mjs`. The installed SDLC plugin set
  supplies no `fhAdmission`, `transformTasks`, or `consequenceTasks`; generated
  assets run through `fpDispatch`, the required F_P evaluation rules, scalar
  `fpEvaluator`, and deterministic `consequenceProjection`.
- 2026-05-26: R-126/P-005 first requirement-to-function enforcement slice
  implemented. `SdlcReviewGradeObligationFinding` now carries a
  `fulfillmentBinding`; fulfilled `component_code_surface` findings must bind
  requirement -> product requirement -> design obligation -> component/product
  target -> code surface -> function or entrypoint -> evidence. Missing
  bindings fail review-grade admission. Focused proof:
  `npm run build:semantic`, `npm run test:t182`, `npm run test:t183`, and
  `git diff --check`.
- 2026-05-26: R-072/R-129 system-artifact authority slice implemented.
  Deterministic assurance ledgers are forced to diagnostic-only before folding,
  so an invalid F_D register-admission diagnostic cannot publish
  `retry_same_edge`. Operator archive artifacts, evaluator prompts,
  F_P evaluation results, design-depth projection writes, design-depth
  candidate evidence, handoff package files, product-materialization manifests,
  and postflight gap dossiers now route through `writeSdlcSystemArtifact(...)`
  or the `writeOperatorArchiveFile(...)` wrapper. Remaining raw operator writes
  are explicitly suspect until classified as transformer/product-surface writes
  or moved behind the same system artifact writer. Focused proof:
  `npm run test:t183`, `npm run lint:semantic`, and `git diff --check`.

## Ledger Suspicion Rule

Every ledger or register outside the ABG runtime spine is suspect until proven.
The name `ledger` does not make it authoritative, and the name `register` does
not make it safe. Each surface must be classified:

| class | allowed role | closure authority |
| --- | --- | --- |
| ABG/system runtime ledger | runtime/admission/replay/event truth | yes, only through ABG fold |
| selected `evaluate.C/F_P` content ledger | semantic evaluator candidate truth after F_D admission | yes, only after projection into the owning constitutional carrier |
| `SdlcEdgeFulfillmentLedger` | edge fulfillment fold over admitted evaluator/project truth | yes |
| exact projection register | compatibility/read model over admitted evaluator truth | no direct closure authority |
| query/read-model ledger/register | analyzer or public query projection | no direct closure authority |
| diagnostic ledger/register | debugging, forensics, or gap explanation | no direct closure authority |
| F_D-derived semantic ledger/register | duplicate authority surface | delete or demote |

Initial surfaces requiring audit include:

- `sdlc_evaluate_content_ledger`
- `sdlc_edge_fulfillment_ledger`
- `sdlc_assurance_ledger`
- `sdlc_lineage_ledger`
- `sdlc_requirement_closure_register`
- `sdlc_managed_traversal_ledger`
- `sdlc_co_affirmation_ledger`
- `sdlc_design_depth_register`
- `sdlc_component_depth_register`
- `sdlc_test_design_register`
- `sdlc_test_execution_surface_register`
- DAG/frontier `ledgerRefs`
- target-carrier payload ledger bindings

For each surface, the audit question is:

```text
Can this surface affect close, retry, repair, re-entry, reprice, next action,
or public gap truth?
```

If yes, it must cite selected `evaluate.C/F_P` output or explicit project
authority plus ABG/system F_D admission. Otherwise it is not allowed to be in
the closure path.

## Bad Register Elimination Strategy

The purpose of this ticket is to eliminate false assurance registers. A bad
register is any register, ledger, sidecar, parser result, archive artifact, or
read model that can make the system believe an obligation is satisfied without
selected F_P semantic evaluation or explicit project-declared authority.

The audit walks every candidate surface through this trace:

```text
producer
  -> compute means
  -> selected composition / regime evidence
  -> admission helper
  -> consumed-by surfaces
  -> closure, retry, repair, next-action, analyzer, or gap effect
```

Classification rules:

- If the producer is deterministic parsing, filesystem shape, requirement tag
  matching, archive replay, postflight success, or language/build-tool
  convention, the surface is not semantic authority.
- If the surface is needed for diagnostics, keep it as diagnostic-only and make
  it impossible to affect close, retry, repair, re-entry, reprice, next action,
  or public gap truth.
- If the surface is needed as a compatibility artifact, it must be an exact
  projection of an admitted selected F_P output and must carry the selected
  composition/regime/evaluator evidence that produced it.
- If the surface is product authority, it must be declared as explicit project
  authority, not inferred by the operator.
- If the surface is semantic and generic, it must be funneled through selected
  `evaluate.C/F_P`.

The funnel is:

```text
transform.C output / admitted evidence / lineage snapshot
  -> selected evaluate.C/F_P authority rule
  -> content ledger or typed evaluator finding
  -> F_D admission guard
  -> ABG/system ledger writer
  -> EdgeFulfillmentLedger / EdgeClosureDecision / NextActionProjection
```

The accepted authority functions inside the funnel are:

- `synthesize_model.C/F_P -> ProductAssetModel`
- `eval_gap.C/F_P -> ObservationSnapshot + GapPressureRow`
- `evaluate_action.C/F_P`
  `-> EdgeFulfillmentLedger + EdgeClosureDecision`
- `evaluate_next.C/F_D` or selected `F_P` policy
  `-> NextActionProjection over ActionCatalog`

The deletion test is simple:

```text
Can this register produce assurance if the selected F_P evaluator output is
missing, stale, malformed, mismatched to selected composition, or not applicable?
```

If yes, it is a false-assurance surface and must be deleted, demoted, or
rewired through the funnel before T-183 can close.

During migration, `sdlc_evaluate_content_ledger` is the concrete carrier for
F_P-produced semantic content. A rule may embed a legacy-shaped payload when a
consumer has not yet been refactored, but the embedded payload remains
subordinate to the content ledger. Projection into a legacy register path is an
F_D copy/admission action, not semantic construction.

## Interfaces To Gut Or Demote

These are the first-pass concrete surfaces to inspect and delete or demote.
Inspection may discover more; add them here before closing.

### Register Population And Admission

- `build_tenants/typescript/code/src/operator/design_depth_register.ts`
  - keep exact JSON structural admission for evaluator sidecars
  - remove alias, wrapper, and fenced Markdown admission for evaluator sidecar
    truth
  - demote `designDepthRegisterQualityErrors()` to structural consistency only;
    no semantic depth judgment in F_D
- `build_tenants/typescript/code/src/operator/component_depth_register.ts`
  - keep exact target-carrier structural admission
  - remove alias/wrapper bridge shapes where they can satisfy authority
  - reject stale structured carrier blocks when evidence refs do not match the
    selected current source evidence
- `build_tenants/typescript/code/src/operator/test_design_register.ts`
  - keep schema admission only
  - ensure test schedules are accepted from project/F_P truth, not inferred by
    runner heuristics
- `build_tenants/typescript/code/src/operator/test_execution_surface_register.ts`
  - keep execution preparation as an admitted-command wrapper
  - do not create semantic test schedules from build-tool conventions

### Handoff And Runtime Projection

- `build_tenants/typescript/code/src/operator/handoff.ts`
  - delete deterministic semantic register population paths:
    - `baseComponentDepthRegister(...)` use as a semantic constructor
    - `repairScheduleForFailures(...)` as an authoritative semantic schedule
    - component/test/repair/release register assembly in post-transform output
      when rows were not produced by selected F_P or explicit project authority
  - demote `executionShardCommand(...)` to a bare emergency fallback for
    declared full-suite commands only; nontrivial per-module test commands must
    come from admitted F_P/project test schedule rows
  - keep `testExecutionPreparationRowsForManifest(...)` only as a wrapper over
    admitted schedule rows; fail closed when nontrivial schedule authority is
    absent
  - make worker prompts require whole-carrier structured block replacement on
    retry so stale JSON cannot sit under fresh prose
  - publish typed requirement-pressure rows in the construction brief so
    workers do not rediscover requirement ids by regex
  - ensure `readAdmittedImplementationDesign(...)`,
    `readAdmittedTestDesign(...)`, and `readAdmittedComponentDepthSurface(...)`
    never select semantic truth from filesystem existence alone
- `build_tenants/typescript/code/src/operator/installed_operator.ts`
  - keep F_P evaluator rule execution and review-grade evaluation
  - remove any in-run F_D register synthesis used as substitute semantic input
  - ensure the design-depth and review-grade F_P rules produce the rows consumed
    by postflight and closure
  - ensure missing F_P evaluator output blocks instead of falling back to F_D
    semantics

### Closure And Analysis

- `build_tenants/typescript/code/src/operator/traversal_consequence.ts`
  - keep ledger fold
  - reject closure if required semantic rows lack selected F_P evidence or
    explicit project-declared authority
- `build_tenants/typescript/code/src/operator/assurance_gate.ts`
  - ensure fulfilled rows without selected semantic evidence fail closed
- `build_tenants/typescript/code/src/analysis/carrier_loaders.ts`
  - use the same admission helpers as runtime
  - reject analyzer-only bridge shapes
- `build_tenants/typescript/code/src/analysis/edge_attempts.ts`
  and `build_tenants/typescript/code/src/analysis/retry_forensics.ts`
  - report whether semantic pressure came from F_P, explicit project authority,
    or invalid F_D fallback

### Tests To Rewrite

- `build_tenants/typescript/test_env/tests/test_t181_fp_evaluator_design_register.test.mjs`
- `build_tenants/typescript/test_env/tests/test_t182_fp_review_grade_edge_fulfillment.test.mjs`
- `build_tenants/typescript/test_env/tests/test_t066_product_materialization_contract.test.mjs`
- `build_tenants/typescript/test_env/tests/test_t115_component_execution_failure_repair_flow.test.mjs`
- `build_tenants/typescript/test_env/tests/test_t120_retry_local_repair_prompt.test.mjs`
- `build_tenants/typescript/test_env/tests/test_t140_no_local_forced_iteration_authority.test.mjs`
- `build_tenants/typescript/test_env/tests/test_b086_fd_disambiguation_sweep.test.mjs`

Any test that proves a deterministic semantic register row is produced by the
operator should be deleted, rewritten to supply F_P/project authority, or
converted into a negative test.

## Implementation Plan

1. Keep the refactor ledger current; every new drift found during inspection is
   added as a row before patching.
2. Add focused T-183 negative tests that fail on the current drift:
   - deterministic repair schedule synthesis cannot satisfy authority
   - per-module test command inference cannot satisfy nontrivial schedule truth
   - stale structured JSON carrier under fresh prose is rejected
   - evaluator sidecar alias/wrapper/fenced forms cannot satisfy authority
   - missing typed requirement-pressure carrier is visible as a prompt/package
     defect
   - created files, file roles, and requirement tags cannot close coded
     fulfillment without requirement-to-function bindings
3. Delete/demote F_D semantic constructors in `handoff.ts`.
4. Tighten register admissions to exact selected carrier forms.
5. Realize the selected post-transform `evaluate.C` stage as an evaluation set
   whose rules declare their ODD authority function and produce typed
   constitutional carrier candidates, with ABG/F_D as the only ledger writer.
6. Add or expose typed requirement-pressure rows in worker packages.
7. Rewire consumers to require selected F_P semantic rows or explicit
   project-declared structured authority.
8. Run focused T-181/T-182/T-183 tests and `npm run build:semantic`.
9. Run semantic suite.
10. Run live JS hello world.
11. Run live Rust server hello world.
12. Run live data mapper.

## Closure Checklist

- [x] Ticket records every F_D semantic register population path found during
  inspection.
- [x] Refactor ledger rows are all `closed` or explicitly `repriced_to_ticket`.
- [x] Every interface change names one authoritative truth surface and deletes
  or demotes duplicate authority.
- [x] Graph validation is complete for every ledger row that changes an
  interface, carrier, artifact, or catalog requirement.
- [x] Deterministic design-depth row synthesis is deleted or fails closed.
- [x] Deterministic component-depth semantic row synthesis is deleted or fails
  closed.
- [x] Deterministic repair schedule construction is deleted or demoted to
  non-authoritative diagnostic projection.
- [x] Per-module test execution commands come from admitted F_P/project
  schedule rows; build-tool heuristics cannot satisfy nontrivial authority.
- [x] Evaluator sidecars admit only exact selected JSON carrier forms required
  for their stage.
- [x] Alias, wrapper, fenced Markdown, latest-mtime, and archive-presence
  bridges cannot satisfy semantic authority.
- [x] Runtime and analyzer use the same admission helpers.
- [x] One selected post-transform `evaluate.C` stage can run multiple typed
  authority-declared evaluator rules and fan their admitted candidates through
  the same ABG/F_D ledger writer.
- [x] No evaluator rule writes runtime ledger truth directly.
- [x] Consequence projection is deferred until required review-grade
  `evaluate.C/F_P` artifacts are admitted for generated-asset edges.
- [x] Worker construction briefs contain typed requirement-pressure rows, not
  only string-searchable requirement refs.
- [x] Retry prompts require whole structured carrier replacement when a
  target-carrier block already exists.
- [x] Fresh prose with stale structured carrier JSON fails admission.
- [x] Missing selected F_P semantic rows prevent closure through required evaluator admission.
- [x] Existing `SdlcEdgeFulfillmentLedger` remains the only fulfillment closure
  ledger.
- [x] Generated code fulfillment requires admitted requirement-to-function
  bindings, not file delta or tag evidence alone.
- [x] Focused T-183 tests pass.
- [x] T-181 and T-182 tests pass after rewrite.
- [x] `npm run build:semantic` passes.
- [x] Semantic suite passes or any remaining failures are added to this ticket.
- [x] JS hello world live run is clean.
- [x] Rust server hello world live run is repriced to T-184 with handoff partition proof.
- [x] Data mapper live run is repriced to T-184 with handoff partition proof.

## Proof Update 2026-05-25

Semantic proof is complete for the deletion/refactor slice:

- `npm run test:semantic` passed 821/821.
- `npm run test:t183` passed 47/47.
- `npm run lint:semantic` passed.
- `git diff --check` passed.

The remaining live breadth proof is repriced to T-184 because handoff
partitioning and side-effect cleanup are now the controlling next refactor:

- JS hello world live archive
- Rust server hello world live archive
- data mapper live archive

R-060 and R-110 no longer hold T-183 open. They are explicit T-184 work items
where they intersect with the `handoff.ts` partition and live proof.

## Closure Update 2026-05-26

T-183 is closed as the F_D semantic-register deletion and authority-boundary
round. The closure is not a claim that `operator/handoff.ts` is architecturally
clean. That remaining work is repriced to T-184:

- T-183 proved deterministic semantic register population was removed or
  demoted from the close path.
- T-183 added `operator/system_artifacts.ts` and routed the major system
  artifact writes through the common writer.
- T-183 made deterministic assurance ledgers diagnostic-only, so F_D register
  admission diagnostics cannot publish `retry_same_edge`.
- T-183 verified JS hello-world live closes cleanly: 2 operator runs, final
  close, no retry/block, and deterministic assurance satisfaction
  `not_applicable` with no blocking reasons.
- T-184 owns the remaining `handoff.ts` partition, remaining raw writer
  classification, and the next Rust/data-mapper live proof.

Round-close proof:

- `npm run build:semantic`
- `npm run test:t181`
- `npm run test:t182`
- `npm run test:t183`
- `npm run lint:semantic`
- `git diff --check`
- `ODD_SDLC_TS_T132_HELLO_WORLD_JS_SCENARIO_WORKER='process://claude?model=sonnet&effort=xhigh' npm run test:scenario:t132-hello-world-js-live:pty`

## Proof Update 2026-05-25 Seed Script Removal

The architecture-review blocker is fixed:

- Deleted `designDepthFpEvaluatorSeedScript(...)` and the
  `design_depth_fp_evaluator_seed_register.cjs` write path.
- Removed framework-authored parsing of ADR tables into semantic design-depth
  rows, including the hardcoded `cdme-*`, Scala source-root, sbt stack, and
  CDME model/sequence values.
- The design-depth evaluator prompt now requires the selected `evaluate.C/F_P`
  worker to write the register as its own semantic pressure map. Bounded Node
  snippets are allowed only for summarization or JSON validation, not semantic
  row construction.
- `worker_construction_brief.json` now carries compact typed obligation
  pressure rows at `obligations.inlineObligations[]` and
  `obligations.inlineRequirementPressureRows[]`; ids/counts remain lineage
  indexes, not the work queue.

Proof run:

- `npm run build:semantic`
- `node --test test_env/tests/test_t118_worker_invocation_package.test.mjs`
- `npm run test:t181`
- `npm run test:t183`
- `npm run lint:semantic`
- `git diff --check`

## Non-Goals

- Do not delete register carrier types.
- Do not delete F_D admission.
- Do not delete ABG/system event, ledger, replay, or closure machinery.
- Do not add source-specific Scala, Python, Rust, JS, or data-mapper code to the
  generic SDLC runtime.
- Do not hide compatibility paths behind feature flags.
- Do not create a second review ledger.

## Current Live Evidence

The data mapper live run interrupted on 2026-05-25 showed the defect directly:

- the worker updated repair-schedule prose to current evidence
- the fenced JSON carrier still contained stale repair rows
- the worker had to regex requirement ids out of the construction brief because
  there was no typed requirement-pressure row surface
- the attempted build-tool fix was correctly rejected as F_D source-specific
  compensation; admitted schedule commands should come from F_P/project truth

This ticket exists to make those bugs structurally impossible instead of
patching each observed project convention.
