# Typed Construction Algebra Requirements

**Family**: REQ-F-ODDSDLC-074..088
**Status**: Active
**Category**: Governance, Runtime, Verification
**Carries Forward From**:
- `.ai-workspace/tickets/completed/T-102-define-typed-fp-function-stages-and-abg-owned-admission-flow.md`
- `.ai-workspace/tickets/active/T-171-full-test35-parity-refactor-for-test72-execution-backed-closure.md`
- `.ai-workspace/tickets/active/T-172-realize-staged-disambiguation-graph-and-decomposition-admission.md`
- `specification/requirements/16-edge-gain-closure-contract.md`
- `specification/requirements/17-target-carrier-contracts.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/WRITING_GUIDE.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md`
**Authoring Design**:
- `build_tenants/typescript/design/ODD_SDLC_ABIOGENESIS_SUBSTRATE_CONTRACT.md`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_FP_EVALUATION_LEDGER_PURPOSE.md`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_ASSURANCE_INTEGRATION.md`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_INTENT_PACKAGE.md`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_EVALUATION_GRID_CONTRACT.md`

This family defines the construction algebra for typed `odd_sdlc.TS`
traversals. ABG owns runtime admission, event truth, projection, replay,
continuation, and fold mechanics. `odd_sdlc` owns SDLC domain meaning,
semantic evaluator rows, target-carrier interpretation, and product-specific
proof interpretation.

The workspace editor axiom is absolute: `F_P.transform` is the only `F_P`
process that may edit the workspace, and only within the active edge permission
class. Every other `F_P` process is read-only over workspace state. It returns
typed findings, parameters, or authority-function candidates to the installed
operator typed-carrier interface. The installed operator owns deterministic
carrier publication, ledger writes, runtime events, projection, fold, and
continuation.

The construction-depth axiom is also absolute: deterministic code and tests are
proof surfaces after semantic pressure has been mapped; they are not lawful
substitutes for unresolved upstream ambiguity and they do not create the
semantic obligation map. Every solution must reduce ambiguity through admitted
intermediate subsurfaces and selected `evaluate.C/F_P` semantic rows before
materialized source, materialized tests, execution evidence, or release closure
can claim product completeness. A trivial product is the degenerate case of
that same law, not an escape from it.

The graph-edge accounting axiom is equally binding: no edge remains in the
executive graph by inheritance, ceremony, or local precedent. Every retained
edge must account for the construction pressure it owns, the authority surface
it produces, the predecessor/successor pressure it preserves, and why that
pressure is not already owned by another retained edge. An edge that cannot
make that claim is deleted, merged into its owning edge, or reclassified as a
projection/no-close view.

The typed construction algebra is the `odd_sdlc` product expression of the
ABIogenesis compute epistemology:

```text
GTL edge / selected composition C
  -> transform.C
  -> candidate/evidence refs
  -> evaluate.C/F_P
  -> semantic rows / evaluation finding refs / pressure map
  -> ABG.admit
  -> ABG.events / payload ledgers / assurance projection / closure fold
  -> consequence.C
  -> admitted consequence projection
  -> ABG traversal transition / replay projection
  -> odd_sdlc pressure/query/read-model interpretation
  -> next_action or lawful continuation
```

ODD_SDLC remains the practical implementation of ODD methodology. ODD method
labels are interpreted through the current compute-stage notation, not as a new
runtime ontology:

| ODD authority function | current compute-stage spelling | admitted carrier family |
| --- | --- | --- |
| `synthesize_model` | `synthesize_model.C/F_P` as a selected `evaluate.C` rule when model meaning is ambiguous | `ProductAssetModel` |
| `eval_gap` | `eval_gap.C/F_P` as a selected `evaluate.C` rule over declared lineage-reachable ledger snapshots | `ObservationSnapshot` and `GapPressureRow` |
| `evaluate_action` | `evaluate_action.C/F_P` or disambiguated `F_D` policy inside the selected `evaluate.C` stage | `EdgeFulfillmentLedger` and `EdgeClosureDecision` |
| `evaluate_next` | `evaluate_next.C/F_D` or `F_P` policy over admitted closure truth | `NextActionProjection` over `ActionCatalog` |

`evaluate.C` is the post-transform compute-stage container. It is not a single
semantic authority carrier. Each evaluator rule declares which ODD authority
function it realizes or consumes, and its output admits into the corresponding
carrier family.

For generic prompt-bearing SDLC edges, the selected `transform.C` commonly
binds `F_P.transform`. For deterministic product contracts, the selected
composition may bind deterministic construction. In all cases, `C` is selected
composition notation over selected `abg.fn_composition`; it is not a new
product-local execution carrier.

Algorithmically, an SDLC graph node is:

```text
node(A, B):
  basis = admitted(A) + declared_lineage_reachable_ledger_snapshot(A)
    + admitted_dependencies(A)
  candidate = selected transform.C over basis
  authority_output = selected evaluate.C authority rule over basis + candidate
  admitted_pressure = ABG/system F_D admits authority_output by shape,
    identity, provenance, freshness, declared authority role, and evidence refs
  B = admitted target carrier plus admitted pressure ledgers
  next = consequence.C over admitted ABG state
```

For a chain `A -> B -> C -> D`, the semantic obligations for `D` are the
carried pressure of `(A, B, C)`. Each intermediate surface is both an admitted
product surface for its edge and a dependency-pressure source for the next edge.
The governing ledger rule is:

```text
evaluate.C authority rule -> constitutional carrier candidate
  -> ABG/system F_D ledger writer
```

F_D may index, package, admit, write, execute declared commands, and project
consequence. F_D shall not infer semantic register rows from filenames, logs,
language conventions, source-tree shape, archive shape, or deterministic tests.

### REQ-F-ODDSDLC-074 - construction stages remain typed and separated

Worker-backed graph traversal shall preserve separate typed stages for
construction, admission, evaluation, projection, closure, and continuation.

**Acceptance Criteria**:
- AC-1: `F_P.transform` constructs only within the current graph edge contract:
  declared output carrier, declared product materialization, or declared
  execution-repair scope
- AC-2: `ABG.admit` owns whether a transform result, file delta, process fact,
  execution observation, or carrier envelope enters runtime truth
- AC-3: `F_D` may reject malformed or impossible evidence, but must not replace
  requirement-by-requirement `F_P` semantic judgment
- AC-4: `evaluate.C/F_P` reads admitted evidence refs and declared
  lineage-reachable ledger snapshots, then returns authority-function candidates
  to the installed operator typed-carrier interface; the installed operator
  publishes `fp_evaluate_result.json`, and the worker may not close the edge by
  assertion
- AC-5: `ABG.project` derives fulfillment, materialization, gap, retry, and
  continuation pressure from admitted events and ledgers
- AC-6: `ABG.fold` alone decides `close`, `retry`, `repair`, `yield`, `block`,
  or `reprice`, and projects the next lawful action
- AC-7: every published worker-backed edge keeps evaluator payloads,
  postflight, closure, result-report, ledger, runtime-event, projection, and
  fold work out of the `F_P.transform` prompt and worker-facing construction
  obligations
- AC-8: the typed F_P stage carriers are the single governing runtime surface
  for the transform/evaluate boundary; any `worker_result_report.json` archive
  is a derived projection and must carry `projectionRole:
  typed_fp_stage_projection` plus `authoritativeStageResultRef` resolving to
  the published `fp_evaluate_result.json` for the same archive root
- AC-9: fulfillment ledgers shall carry the installed-operator-published
  `F_P.evaluate` result as the evaluation admission/predecessor fact;
  `F_P.transform` may carry transform output and runtime evidence, but must not
  stand in for the evaluation ledger fact
- AC-10: no `F_P` process other than `F_P.transform` may write workspace files;
  all non-transform `F_P` stages are read-only and pass typed values through the
  installed operator typed-carrier interface for deterministic write/admission

### REQ-F-ODDSDLC-075 - continuation follows fold disposition and vector relation

Continuation after an edge attempt shall be a typed fold over admitted
consequence carriers, not a worker report field, prompt convention,
installed-operator local boolean, or recomputation from the original CLI
target.

**Acceptance Criteria**:
- AC-1: `close` plus a same-vector projection is not same-edge continuation;
  the closed edge falls through to overlay continuation or terminal close
- AC-2: `repair` or `retry` plus a same-vector projection is same-edge
  continuation with the prior gap dossier and admitted repair context
- AC-3: `yield` preserves continuation pressure without pretending closure
- AC-4: `block` carries a lawful re-entry point and is not normalized into a
  generic worker failure or generic retry
- AC-5: `reprice` exits the local transform algebra and returns to the declared
  lawful re-entry layer
- AC-6: archive/crash re-entry under `--until converged` resumes the latest
  admitted same-overlay successor and does not restart the original graph target
  after that target has closed
- AC-7: live-loop continuation uses the just-admitted next-action consequence
  from the latest outcome before falling back to archive observation
- AC-8: worker/provider output-limit process facts remain typed retry or repair
  pressure inside the current edge; they must not collapse into generic process
  failure, target closure, or cross-edge continuation

### REQ-F-ODDSDLC-076 - evidence admission does not imply closure

Evidence admission shall preserve the distinction between admitted evidence,
structural carrier validity, semantic satisfaction, and closure.

**Acceptance Criteria**:
- AC-1: target carrier admission is evidence/envelope admission, not closure
- AC-2: `worker_result_report.json` is only a derived archive projection over
  typed F_P stage carriers, not a second compatibility authority and not closure
  authority; admission fails closed when its projection role is absent, wrong,
  or cites any evaluator file other than the same-archive
  `fp_evaluate_result.json`
- AC-3: output carrier admission, materialized file presence, worker assertion,
  postflight success, register conformance, and execution observation are
  evidence dimensions; none is product/content closure by itself
- AC-4: closure decisions cite admitted evidence refs, evaluator rows, edge
  assurance contract identity, and residual-pressure state
- AC-5: replay evidence may seed lineage and retry context, but current observed
  product bytes and digests supersede stale replay manifest bytes during live
  repair or materialization admission

### REQ-F-ODDSDLC-077 - execution evidence stays on execution-result edges

Test execution evidence shall be owned by execution-result edges. Archive,
release-depth, and release surfaces consume admitted execution truth; they do
not re-run tests or emit fresh execution evidence.

**Acceptance Criteria**:
- AC-1: test execution evidence is admitted only on execution-result edges
- AC-2: test-run archive and release surfaces consume admitted execution truth
  and do not emit fresh execution evidence
- AC-3: compile, discovery, and test non-zero exits belong to the
  execution-result edge; `F_P.transform` may perform bounded tenant
  source/test/build repair under the edge's execution-repair permission class,
  while evaluators remain read-only over workspace state
- AC-4: the installed operator runs the declared execution shards after
  `F_P.transform` returns and owns publication of the execution evidence
  carrier; transform-local test runs are repair checks, not admitted evidence
- AC-5: non-execution, non-materialization edges must not write product files
- AC-6: shard evidence identity is copied from the schedule-declared shard
  register; ad hoc shard ids are inadmissible

### REQ-F-ODDSDLC-078 - edge permission constrains construction scope

Each edge shall declare and enforce its construction permission class.

**Acceptance Criteria**:
- AC-1: surface-only edges may write only their target carrier/surface and
  framework archive artifacts
- AC-2: materialization-required edges may write declared product file targets
  and must admit the resulting materialization evidence
- AC-3: repair scoped workspace edits may write tenant product source, test, or
  build files only when the active edge is an `F_P.transform` edge carrying an
  explicit execution-repair permission class
- AC-4: postflight rejects product-file writes outside the effective permission
  class with typed non-close diagnostics
- AC-5: worker prompts and handoff manifests expose the active permission class
  without giving the worker closure, evaluator-payload, or installed-operator
  carrier-publication authority
- AC-6: product-materialization lineage is role-sensitive: required source and
  test product files carry requirement lineage, while auxiliary build or tool
  config files may be admitted when they are within the declared build/execution
  scope and are not represented as independent content closure

### REQ-F-ODDSDLC-079 - construction algebra is proven by an axiomatic sweep

The TypeScript runtime shall carry deterministic proof over the construction
algebra, not only computational coverage from successful live runs.

**Acceptance Criteria**:
- AC-1: the sweep enumerates disposition values `close`, `repair`, `retry`,
  `yield`, `block`, and `reprice`
- AC-2: the sweep enumerates vector relations same vector, next overlay vector,
  and no vector
- AC-3: the sweep enumerates target kinds explicit `graph_function`, `next`,
  overlay continuation, and archive/crash re-entry
- AC-4: the sweep enumerates evidence classes target carrier, materialization,
  execution evidence, and assurance/gap evidence
- AC-5: the sweep enumerates edge permission classes surface-only,
  materialization-required, and execution-repair scoped
- AC-6: each reachable combination asserts lawful admission boundary and next
  action
- AC-7: the sweep includes regressions for closed-edge replay, same-edge repair
  loss, archive restart after closure, execution failure escape, shard identity
  drift, and product-file writes from surface-only edges
- AC-8: the sweep walks every published hook contract and asserts that transform
  prompts and construction obligations exclude evaluator work while evaluator
  expectations remain bound to the post-transform evaluation contract
- AC-9: the sweep includes the live-run regressions for stale replay digest
  versus current product bytes, auxiliary build config without requirement
  lineage, and output-limit process-fact classification

### REQ-F-ODDSDLC-080 - solution construction admits staged disambiguation before materialization

Solution construction shall reduce ambiguity through admitted intermediate
subsurfaces before broad source, test, execution, or release materialization can
claim product completeness.

**Acceptance Criteria**:
- AC-1: the generic construction order is requirements, design commitments,
  admitted tenant technology-stack description, module/component topology,
  dependency map, evaluator-selected traversal, bounded source/test/build
  materialization, execution evidence, and release qualification
- AC-2: selected post-transform `evaluate.C` authority-function outputs and
  admitted intermediate pressure maps are the highest disambiguation surfaces
  for generic SDLC product meaning; deterministic code, deterministic tests,
  and execution evidence are proof surfaces and may close product content only
  after upstream ambiguity has been reduced into admitted intermediate surfaces
  or preserved as explicit residual pressure
- AC-3: implementation materialization requires admitted implementation
  topology and decomposition summary evidence before component code closure
- AC-3a: F_P implementation-design workers produce the candidate design
  artifact only; selected post-transform `evaluate.C` authority rules produce
  the design-depth model candidate, decomposition summary candidate, dependency
  map candidate, and gap/action pressure candidates from the artifact, admitted
  source authority, product file targets, requirement lineage, upstream design
  surfaces, dependency pressure, and post-transform evidence. Runtime F_D
  admits, rejects, writes, and projects those candidates; it does not derive
  their semantic row meaning.
- AC-4: test materialization requires admitted testcase authority, test
  topology, test stack/profile evidence, and decomposition summary evidence
  before component test closure
- AC-5: every solution, including trivial products, publishes admitted
  decomposition evidence; a product profile may declare a trivial product
  class, but that class is admitted only as a degenerate
  one-design/one-module/one-component decomposition with bounded upstream
  product requirement refs, not as a bypass, an exact one-requirement fiction,
  or fan-out into execution-detail obligations
- AC-6: decomposition summaries measure input obligation count, output row
  count, upstream-per-downstream compression ratio, downstream-per-upstream
  expansion ratio, max owned inputs per output, max downstream rows per input,
  residual refs per output, public boundary count, and substantive downstream
  responsibility count
- AC-7: product profiles or edge assurance contracts own the decomposition
  thresholds; prompt text and worker-local judgment do not supply the governing
  thresholds
- AC-8: evaluator admission rejects high-density downstream rows, downstream
  explosion from one upstream input, downstream rows without upstream basis,
  invalid reference values, facade rows, under-decomposed parents, residual
  refs carried outside the owning subsurface, and missing trivial-product
  decomposition
- AC-9: steel-thread and parallel build are evaluator-selected traversal
  methods over admitted dependency maps; they are not target carrier surfaces
  and not prompt-only strategy labels
- AC-10: bootstrap derives per-tenant technology-stack descriptions as
  authority surfaces when the initial document names or implies stack-specific
  construction pressure; these surfaces declare language/runtime, build tool,
  required build/config targets, source/test roots, build/test/proof commands,
  tool install/use assumptions, evidence expectations, and byproduct cleanup
  rules
- AC-10a: every minimum tenant technology-stack description carries an explicit
  testing technology-stack section. The section declares test language/runtime
  when different from implementation, test framework or runner, test source
  roots, fixture/data strategy, test build/config targets, proof commands,
  execution environment assumptions, evidence formats, and cleanup rules
- AC-11: tenant technology-stack sufficiency is evaluator-admitted before
  materialization. `undefined` or contradictory stack descriptions block or
  zoom back to the owning bootstrap/design surface; sufficiently defined stack
  descriptions allow `F_P.transform` to make bounded implementation
  assumptions inside the declared tenant surface and preserve those assumptions
  in the emitted artifact/evidence
- AC-12: TypeScript handoff consumes admitted tenant technology-stack
  descriptions generically. Ecosystem file names or grammars such as SBT,
  Cargo, Maven, Gradle, Node, or Python build manifests are tenant-spec data,
  not hidden SDLC core law
- AC-13: admitted module and test dependency maps compile into an SDLC feature
  dependency DAG with `start_nodes[]`, predecessor/successor rows, read refs,
  write territories, output allocations, and fan-in rows before branch
  dispatch. ABG owns the frontier execution over that DAG.
- AC-14: test materialization may run from admitted testcase authority,
  test topology, and test stack/profile evidence when those surfaces are
  sufficient to construct tests. Completed component source is consumed by
  downstream fan-in, qualification, or repair adaptation rather than acting as
  a blanket precondition for every test branch.

### REQ-F-ODDSDLC-081 - executive graph edges are retained only by accounted construction pressure

Every edge in an executive graph shall be accounted as required, conditional,
projection/no-close, merged, replaced, or deleted. Unaccounted edges are active
non-closure pressure.

**Acceptance Criteria**:
- AC-1: the TypeScript full traversal graph publishes an edge-accounting
  register covering every selected executive edge
- AC-2: each retained close-capable edge cites the construction pressure it
  owns, its target authority surface, predecessor edge pressure, successor edge
  pressure, closure evidence, and why no other retained edge already owns that
  pressure
- AC-3: an edge that cannot account for unique construction pressure is removed
  from the selected executive graph, merged into the owning edge, replaced by a
  staged authority edge, or reclassified as projection/no-close
- AC-4: projection and rollup edges may remain only when their inputs are
  admitted carriers/events and the edge does not dispatch an `F_P.transform`
  worker for fresh product judgment
- AC-5: conditional operational edges may remain outside the selected full
  construction graph only when they cite their capability gate and are reported
  separately from required construction closure
- AC-6: analyzer output reports missing edge-accounting rows, extra accounting
  rows, delete/merge candidates, projection-only edges, and conditional edges
- AC-7: T-172 closure is blocked while any selected executive edge is
  unaccounted, while any unneeded edge remains close-capable, or while an edge
  is retained only because a previous graph version contained it

### REQ-F-ODDSDLC-082 - traversal depth is selected from admitted complexity evidence

The TypeScript construction evaluator shall select the smallest lawful
construction traversal only after admitted complexity evidence proves that
closure pressure remains owned, visible, and replayable.

**Acceptance Criteria**:
- AC-1: traversal selection records outcome class, hop class, selected graph
  variant, zoom disposition, pressure-preservation mechanism, rejected
  alternatives, blocking reasons, and evidence refs
- AC-2: hop class values are `single_hop`, `dual_hop`, `staged`,
  `zoom_required`, and `blocked`
- AC-3: outcome class defaults to `domain_product`; `framework_smoke` and
  `tutorial_example` require admitted pressure-preservation evidence before
  selecting a smaller traversal
- AC-4: Min(F_P) pressure may be preserved only by typed-template direct
  materialization, replay-visible projection, bundled F_P output, or an
  outcome-class graph variant
- AC-5: projection-only rollups may skip F_P dispatch only when admitted
  carrier/event refs preserve the skipped edge pressure; analyzer labels alone
  cannot authorize the skip
- AC-6: low-complexity products may select `single_hop` or `dual_hop` only
  when admitted decomposition evidence is within the selected profile limits
  and residual ambiguity is not carried outside the owning surface
- AC-7: substantive products select staged traversal unless admitted
  complexity evidence proves a smaller path lawful without pressure loss
- AC-8: overloaded or disproportionate admitted metrics select
  `zoom_required`; missing or ambiguous pressure ownership selects `blocked`
- AC-9: analyzer output reports traversal selection as a read-only projection
  and blocks when no admitted complexity evidence or pressure-preservation
  evidence exists
- AC-10: proportionality summaries and traversal-hop selections are archived
  as replay-visible operator-run carriers and cited by a typed runtime event;
  analyzer output must consume those archived carriers before deriving any
  fallback projection

### REQ-F-ODDSDLC-083 - prompt-bearing handoffs project admitted work law

TypeScript worker prompts shall project admitted work law for the current edge.
They shall not become independent policy, admission, closure, or historical
failure surfaces.

**Acceptance Criteria**:
- AC-1: every prompt-bearing handoff derives from one traversal intent package,
  selected edge contract, target carrier or artifact contract, admitted
  authority refs, current obligation pressure, tenant stack when applicable,
  and declared read/write roots
- AC-2: prompt prose is a projection over that typed basis and not an
  independent authority surface
- AC-3: prompt directives state the current work surface, local
  disambiguation, boundary, evidence expectation, and artifact contract in
  positive terms wherever possible
- AC-4: evaluator-owned admission, carrier publication, ledger, closure,
  decomposition, dependency, and traversal-selection truth is enforced by
  evaluator/runtime code and typed proof, then projected into the prompt only
  as ownership context for the worker
- AC-5: prompt text shall not carry prior-failure negations unless the
  restriction is still necessary to define the current edge's read/write,
  safety, tenant-execution, or artifact boundary
- AC-6: if a prior-failure phrase is removed from a prompt, the owning
  requirement, design, evaluator, runtime, or deterministic test must enforce
  the systemic fix or the missing enforcement remains open pressure
- AC-7: prompt tests assert the selected typed basis, authority refs, target
  contract, and positive local work shape; they do not derive expected behavior
  from broad negation phrases or prior-run scars
- AC-8: `worker_construction_brief.json` is the canonical prompt-source carrier.
  Worker-facing prompts and briefs shall not inline expanded forensic runtime
  packages, full handoff manifests, target-carrier construction templates, row
  templates, ledgers, closure carriers, or evaluator-owned publication truth.
  They cite those surfaces by ref/digest when enforceable detail is needed. The
  construction brief itself carries compact typed obligation-pressure rows for
  the current edge; requirement ids/counts alone are not an admissible prompt
  work queue.
- AC-9: runtime replay and worker-facing state projection use compact identity
  indexes, bounded summaries, refs, and digests on hot paths. Full manifests,
  liveness activity streams, event archives, and forensic package payloads remain
  archive truth for explicit diagnosis, not default worker input or replay scan
  input.
- AC-10: generated prompt artifacts are contract code and must remain directly
  inspectable as proof surfaces. A prompt-bearing edge that requires human review
  of the raw prompt must expose a compact, sectioned prompt whose governing
  contract, authority refs, local disambiguation, and self-checks can be audited
  without reading expanded packages or forensic payloads. If the prompt becomes
  too large to inspect, the excess must move to typed referenced carriers,
  bounded summaries, or reusable prompt law before closure.

### REQ-F-ODDSDLC-084 - construction algebra preserves selected composition epistemology

TypeScript traversal code, worker handoffs, evaluator carriers, ledgers,
analyzer output, and operator documentation shall interpret `transform.C`,
`evaluate.C`, and `consequence.C` as epistemic stages over the selected
`abg.fn_composition` and ABG-admitted runtime truth.

**Acceptance Criteria**:
- AC-1: every prompt-bearing transform boundary can be explained as
  `transform.C` under selected composition, edge permission class, target
  carrier or artifact contract, admitted authority refs, and current obligation
  pressure
- AC-2: transform workers may return candidates, product deltas, process facts,
  and evidence; they must not receive ledger-writing, event-emission,
  evaluator-publication, traversal-selection, projection-publication, or
  closure authority
- AC-3: evaluator stages can be explained as post-transform `evaluate.C`; each
  evaluator rule declares the ODD authority function it realizes or consumes and
  produces typed carrier candidates for deterministic admission, not closure
  truth by assertion
- AC-4: ledger rows, events, projections, closure decisions, continuation, and
  replay truth are produced only at or after ABG admission or ABG-compatible
  runtime ingestion, never by plugin prose or worker self-certification
- AC-5: `consequence.C` is rendered as a projection reference over admitted
  ABG state plus `odd_sdlc` read-model refs; it must not become a separate
  action authority or controller surface
- AC-6: product pressure maps, gain interpretation, analyzer reports, and query
  overlays remain `odd_sdlc` domain projections over ABG-admitted facts
- AC-7: deterministic tests assert the documentation boundary and the worker
  handoff boundary so future edits cannot reintroduce hidden ledger,
  evaluator, projection, or closure surfaces into `F_P.transform`
- AC-8: evaluator rules may not read ambient workspace prose, logs, paths, or
  archives as authority input unless those observations have first entered the
  declared lineage-reachable ledger snapshot as admitted evidence or
  `ObservationSnapshot` rows
- AC-9: repair and continuation are not standalone evaluator register
  authorities; repair is represented by `EdgeClosureDecision.disposition` and
  selected continuation is represented by `NextActionProjection` over
  `ActionCatalog`

### REQ-F-ODDSDLC-085 - tenant-stack ambiguity is resolved by generic F_P reconciliation protocol

Prompt-bearing `F_P.transform` workers shall resolve tenant-stack ambiguity
through a generic reconciliation procedure over admitted tenant/worksite
authority, not through SDLC-core ecosystem semantics or hidden defaults.

**Acceptance Criteria**:
- AC-1: when tenant stack authority is missing, contradictory, invalid, or
  underdefined for the current materialization edge, the worker-facing
  construction brief or prompt states a generic stack-reconciliation protocol
  before product-file edits or tenant-stack repairs
- AC-2: the protocol instructs the worker to inspect the tenant stack authority
  surfaces, accepted bootstrap/design/ADR refs that mention stack/runtime/file
  targets/execution, declared product file targets and roles, declared
  build/test/proof commands, and current worksite execution-context files that
  affect how those declared commands run
- AC-3: the protocol requires a compact stack reconciliation decision in the
  returned artifact or evidence: declared stack, relevant product targets,
  declared command, observed conflict or underdefinition, chosen repair surface
  as tenant authority, product files, both, or blocked/re-entry, and proof
  command or bounded probe result when executable
- AC-4: the worker shall not repair tenant-stack authority from an untested
  local assumption when the declared command can be run or probed; it first
  executes the declared command or bounded probe, or records why execution is
  unavailable
- AC-5: the worker shall not create undeclared build/config files merely to make
  an inferred ecosystem default true. If a config/build file is required, the
  worker repairs the tenant authority surface when the edge permits that write,
  or reports blocked/re-entry pressure
- AC-6: SDLC core may carry the generic protocol, refs, digests, declared
  targets, declared commands, read/write roots, and prior evaluator finding
  classes. It shall not encode ecosystem-specific conclusions such as how a
  particular manifest file changes module semantics, cache behavior, compiler
  behavior, package resolution, or test execution semantics
- AC-7: `evaluate.C` verifies consistency among tenant stack authority, emitted
  product syntax/files, declared product targets, declared execution commands,
  and returned execution evidence. It does not repair generated product files or
  mutate tenant-stack authority
- AC-8: if the stack remains unresolved after the worker's reconciliation
  attempt, closure carries explicit residual pressure to the owning
  bootstrap/design/tenant-authority surface rather than treating deterministic
  execution failure, missing config, or worker prose as closure truth

### REQ-F-ODDSDLC-086 - continuation is a total typed state transition

Continuation after a worker-backed edge attempt shall be selected by one
deterministic total state machine over typed admitted facts. It shall not be
selected by scattered string heuristics, narrative pressure refs, worker prose,
or ABG terminal status alone when typed SDLC blocking carriers exist.

**Acceptance Criteria**:
- AC-1: the state machine consumes typed inputs only: edge attempt status,
  admitted blocking-reason carriers, admitted postflight/evaluator carriers,
  edge assurance close decision, retry frontier, target-carrier admission,
  downstream ownership refs, and declared runtime policy
- AC-2: every admitted `SdlcBlockingReasonLawfulReentryPoint` maps to exactly
  one transition bucket: `close`, `yield`, `reprice`, `repair`, `re-enter`,
  `retry`, or `block`; unhandled or unsupported re-entry points fail closed as
  `block`
- AC-3: typed `triage_gap`, `operator_blocked`, runtime/process failure, or
  evaluator-process failure facts shall not be normalized into same-edge
  product transform retry by later residual-pressure or ABG terminal fallback
  logic
- AC-4: residual-pressure refs, reason refs, file refs, and terminal reason
  strings are evidence for the selected transition; they are not the authority
  that chooses the transition class when typed carriers are present
- AC-5: ABG terminal retry pressure may request retry only when no typed
  higher-priority block, triage, reprice, repair, re-enter, or yield basis is
  present for the same edge attempt
- AC-6: the realization exposes the transition state machine as a distinct
  module with deterministic unit tests over the full transition table and at
  least one integrated installed-operator regression for evaluator-process
  failure
- AC-7: live/sandbox proof of a prompt-bearing edge must show the selected
  next action is derivable from the archived typed state-machine input, not
  from replaying string matching over pressure refs

### REQ-F-ODDSDLC-087 - prompt assets project GTL typed asset surfaces

Worker-facing prompts shall be rendered views over GTL typed asset surfaces.
Prompt text is contract code, but the structural authority surface is the GTL
Node-borne AssetSurface declared by `REQ-L-GTL3-ASSET-SURFACE`, with odd_sdlc
authority-compression policy and prompt-family construction applied as product
overlay data.

**Acceptance Criteria**:
- AC-1: every production prompt-bearing transform/evaluate worker invocation
  writes a prompt invocation sidecar with a stable kind/version, prompt-family,
  stage, a GTL Node carrying an AssetSurface, constructor refs,
  method-compression refs, authority packet refs, tool/effect policy refs,
  output carrier refs, proof obligation refs, and section/clause provenance
- AC-2: rendered prompt text remains directly inspectable, but every rendered
  section is traceable to a prompt clause asset with declared intent,
  provenance refs, authority basis refs, recipient, mode, expected outcome, and
  failure mode addressed
- AC-3: authority compression has one source of truth: the odd_sdlc
  prompt-family authority policy overlay. Clause rows may cite authority kinds,
  but they do not independently classify those kinds as normal, fallback, or
  forbidden, and those SDLC policy values do not descend into GTL
- AC-4: raw bootstrap and raw intent documents are bounded fallback authority,
  not routine evaluator inputs, once Product, requirements, admitted design,
  target carrier, obligation, worker report, materialization, or method
  compression authority is available
- AC-5: shared method guidance is prompt input through installed,
  digest-bound authority-compression assets such as
  `workspace://.abiogenesis/docs/standards/authority_compressions/*`; prompt
  constructors shall not routinely inline raw shared-method documents
- AC-6: deterministic prompt constructors may assemble authority packets,
  register rows, section/clause provenance, refs, digests, and renderer views.
  They shall not prescribe a semantic extraction recipe that substitutes for
  `F_P.transform` or `evaluate.C/F_P` judgment
- AC-7: prompt asset construction reuses the GTL AssetSurface constructors and
  declaration-shape admission from `@abiogenesis/typescript-tenant`, while
  odd_sdlc validates only product overlay policy: exact kind/version literals,
  closed prompt-family rows, deterministic projection, fail-closed authority
  policy errors, and structural tests proving no SDLC-local prompt asset
  register or parallel admission remains

### REQ-F-ODDSDLC-088 - evaluation contract is a typed segment-dimension grid

Prompt-bearing evaluation shall be decomposable and scalable. The logical
evaluation contract is declared over transform segments crossed with evaluation
dimensions, even when a small product physically fuses the work into one worker
turn. `F_P` performs bounded semantic judgment over local cells and declared
relation checks. `F_D` and GTL construct typed carriers, structural refs,
rendered prompt views, and structural coverage checks without comprehending
product content. ABG admits evaluation findings and folds findings plus runtime
facts through the single runtime continuation truth surface.

**Acceptance Criteria**:
- AC-1: every production prompt-bearing evaluator invocation carries a typed
  evaluation-grid contract with declared transform-unit refs, evaluation
  dimension refs, scoped disambiguation-carrier refs, expected finding refs,
  physical-execution metadata, and the ABG outcome-fold ref
- AC-2: evaluation shape derives from admitted transform decomposition,
  traversal-hop, and complexity/proportionality evidence. Prompt text and the
  evaluator process shall not invent the segmentation or the dimension set at
  runtime
- AC-3: evaluation dimensions are explicitly classified as `cell`, `fold`, or
  `relation`. Local depth, local authority/stage conformance, and intra-slice
  realization may be cell dimensions only when decidable from the segment and
  scoped carrier. Coverage is a structural ref-set fold, not a semantic F_P
  question. Cross-segment trace is a declared relation over typed refs, not a
  requirement to load the full graph into every cell
- AC-4: the disambiguation carrier is a bounded replay-derived projection over
  admitted events, authority snapshots, prior findings, and lineage refs needed
  by the cell or relation. It is not accumulated history, a raw replay dump, or
  a writable second truth surface
- AC-5: physical prompt fusion is allowed only as an optimization over a small
  logical grid. A fused prompt still exposes transform-unit refs, dimension
  refs, carrier refs, expected finding refs, and fold inputs in the prompt
  invocation asset
- AC-6: evaluator cells shall not routine-read raw bootstrap, raw intent, sibling
  workspace history, or historical run surfaces when admitted product,
  requirement, design, target-carrier, obligation, materialization, execution,
  or scoped-carrier authority is sufficient
- AC-7: ABG owns admission, replay, continuation, and fold over typed findings
  plus runtime facts. odd_sdlc shall not create a second local retry/block/close
  outcome decider to compensate for missing ABG substrate
- AC-8: localized redispatch is expressed through existing ABG re-entry
  primitives when they can carry the failed segment/dimension target. If those
  primitives are insufficient, the missing substrate is an abiogenesis
  dependency before odd_sdlc closure, not an odd_sdlc-local ABG clone
