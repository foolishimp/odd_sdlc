# Typed Construction Algebra Requirements

**Family**: REQ-F-ODDSDLC-074..084
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

This family defines the construction algebra for typed `odd_sdlc.TS`
traversals. ABG owns runtime admission, event truth, projection, replay,
continuation, and fold mechanics. `odd_sdlc` owns SDLC domain meaning,
semantic evaluator rows, target-carrier interpretation, and product-specific
proof interpretation.

The workspace editor axiom is absolute: `F_P.transform` is the only `F_P`
process that may edit the workspace, and only within the active edge permission
class. Every other `F_P` process is read-only over workspace state. It returns
typed findings, parameters, or semantic rows to the installed operator
typed-carrier interface. The installed operator owns deterministic carrier
publication, ledger writes, runtime events, projection, fold, and continuation.

The construction-depth axiom is also absolute: deterministic code and tests are
not lawful substitutes for unresolved upstream ambiguity. Every solution must
reduce ambiguity through admitted intermediate subsurfaces before materialized
source, materialized tests, execution evidence, or release closure can claim
product completeness. A trivial product is the degenerate case of that same
law, not an escape from it.

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
  -> evaluate.C
  -> evaluation finding refs
  -> ABG.admit
  -> ABG.events / payload ledgers / assurance projection / closure fold
  -> ABG traversal transition / replay projection
  -> consequence.C
  -> odd_sdlc pressure/query/read-model interpretation
  -> next_action or lawful continuation
```

For generic prompt-bearing SDLC edges, the selected `transform.C` commonly
binds `F_P.transform`. For deterministic product contracts, the selected
composition may bind deterministic construction. In all cases, `C` is selected
composition notation over selected `abg.fn_composition`; it is not a new
product-local execution carrier.

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
- AC-4: `F_P.evaluate` reads admitted evidence refs and returns semantic rows
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
- AC-2: deterministic code and deterministic tests are the highest
  disambiguation surfaces; they may close product content only after upstream
  ambiguity has been reduced into admitted intermediate surfaces or preserved
  as explicit residual pressure
- AC-3: implementation materialization requires admitted implementation
  topology and decomposition summary evidence before component code closure
- AC-3a: F_P implementation-design workers produce the candidate design
  artifact only; evaluator/runtime code derives and publishes the
  design-depth register, decomposition summary, dependency map, and admission
  truth from the artifact, source authority, product file targets, requirement
  lineage, and post-transform evidence
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
  They cite those surfaces by ref/digest when enforceable detail is needed.
- AC-9: runtime replay and worker-facing state projection use compact identity
  indexes, bounded summaries, refs, and digests on hot paths. Full manifests,
  liveness activity streams, event archives, and forensic package payloads remain
  archive truth for explicit diagnosis, not default worker input or replay scan
  input.

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
- AC-3: evaluator stages can be explained as `evaluate.C`; they produce typed
  findings and semantic rows for deterministic admission, not closure truth by
  assertion
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
