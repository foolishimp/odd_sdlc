# Typed Construction Algebra Requirements

**Family**: REQ-F-ODDSDLC-074..079
**Status**: Active
**Category**: Governance, Runtime, Verification
**Carries Forward From**:
- `.ai-workspace/tickets/active/T-102-define-typed-fp-function-stages-and-abg-owned-admission-flow.md`
- `.ai-workspace/tickets/active/T-171-full-test35-parity-refactor-for-test72-execution-backed-closure.md`
- `specification/requirements/16-edge-gain-closure-contract.md`
- `specification/requirements/17-target-carrier-contracts.md`
**Authoring Design**:
- `build_tenants/typescript/design/ODD_SDLC_ABIOGENESIS_SUBSTRATE_CONTRACT.md`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_FP_EVALUATION_LEDGER_PURPOSE.md`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_ASSURANCE_INTEGRATION.md`

This family defines the construction algebra for typed `odd_sdlc.TS`
traversals. ABG owns runtime admission, event truth, projection, replay,
continuation, and fold mechanics. `odd_sdlc` owns SDLC domain meaning,
semantic evaluator rows, target-carrier interpretation, and product-specific
proof interpretation.

The algebra is:

```text
GTL.edge
  -> F_P.transform
  -> ABG.admit
  -> ABG.events
  -> F_P/F_D.evaluate
  -> ABG.project
  -> ABG.fold
  -> next_action
```

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
- AC-4: `F_P.evaluate` produces semantic rows over admitted evidence refs,
  publishes `fp_evaluate_result.json`, and does not allow the worker to close
  the edge by assertion
- AC-5: `ABG.project` derives fulfillment, materialization, gap, retry, and
  continuation pressure from admitted events and ledgers
- AC-6: `ABG.fold` alone decides `close`, `retry`, `repair`, `yield`, `block`,
  or `reprice`, and projects the next lawful action
- AC-7: every published worker-backed edge keeps evaluator, postflight,
  closure, result-report, ledger, and runtime-event work out of the
  `F_P.transform` prompt and worker-facing construction obligations
- AC-8: the typed F_P stage carriers are the single governing runtime surface
  for the transform/evaluate boundary; any `worker_result_report.json` archive
  is a derived projection and must carry `projectionRole:
  typed_fp_stage_projection` plus `authoritativeStageResultRef` resolving to
  the published `fp_evaluate_result.json` for the same archive root
- AC-9: fulfillment ledgers shall carry the `F_P.evaluate` result as the
  evaluation admission/predecessor fact; `F_P.transform` may carry transform
  output and runtime evidence, but must not stand in for the evaluation ledger
  fact

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
- AC-3: compile, discovery, and test non-zero exits inside an execution-result
  edge are execution-repair pressure inside that edge until success or a hard
  external blocker
- AC-4: execution-repair scoped edits may touch tenant product source, test, or
  build files only to make the declared test execution contract compile and
  pass
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
- AC-3: execution-repair scoped edges may write tenant product source, test, or
  build files only when the target asset admits execution evidence and the write
  is needed to make the declared execution contract pass
- AC-4: postflight rejects product-file writes outside the effective permission
  class with typed non-close diagnostics
- AC-5: worker prompts and handoff manifests expose the active permission class
  without giving the worker closure authority
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
