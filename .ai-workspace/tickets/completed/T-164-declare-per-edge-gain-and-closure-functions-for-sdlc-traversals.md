---
id: T-164
title: Declare per-edge gain and closure functions for SDLC traversals
type: feature
ticket_category: edge_gain_closure_contract
status: completed
goal: failed-closure-tickets-collapse-into-edge-assurance-proof-contract
build_tenant: typescript
owner: odd_sdlc
change_intent: Make each close-capable SDLC graph edge declare its gain function, metric/evidence policy, closure function, residual-pressure function, and compound traversal composition role so failed closure cannot hide behind artifacts, manifests, worker assertions, summaries, or generic traversal success.
change_class: requirement_reprice
re_entry_point: requirements
priority: critical
triaged_at: 2026-05-13
created_at: 2026-05-13
updated_at: 2026-05-15
activated_at: 2026-05-13
governance_scope: STDO Method
intake_source: Operator consolidated the data_mapper/test35 vs TypeScript closure analysis into a generic SDLC work formulation: every edge and compound traversal needs a declared gain function and close function, with ledgers as measuring tools and closure derived only from admitted evidence.
source_documents:
  - specification/GOALS.md
  - specification/INTENT.md
  - specification/PRODUCT.md
  - specification/requirements/02-graph-functions.md
  - specification/requirements/03-runtime-governance.md
  - specification/requirements/10-odd-sdlc-software-domain-buildout.md
  - specification/requirements/13-odd-sdlc-typescript-tenant.md
  - specification/requirements/14-odd-sdlc-installed-product-contract.md
  - specification/requirements/16-edge-gain-closure-contract.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_EDGE_GAIN_CLOSURE_CONTRACT.md
  - user-supplied Claude DMM/ODD review, 2026-05-14
  - /Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md
  - /Users/jim/src/apps/odd_sdlc/.ai-workspace/comments/codex/20260513T035126Z_data_mapper_test35_vs_ts_followup.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-130-define-recorded-hook-action-typing-model-for-fp-evals.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-131-declare-gtl-edge-assurance-contract-for-fp-gain-and-close.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-132-prove-installed-gtl-edge-assurance-with-three-chain-live-sandbox.md
consolidates:
  - .ai-workspace/tickets/completed/T-158-replay-product-materialization-manifest-across-repair-attempts.md
  - .ai-workspace/tickets/completed/T-103-evaluate-historical-data-mapper-depth-and-python-parity.md
  - .ai-workspace/tickets/completed/T-130-widen-design-depth-from-steel-thread-to-full-breadth.md
  - .ai-workspace/tickets/completed/T-142-add-multi-tenant-product-materialization-fanout-live-lane.md
related_tickets:
  - .ai-workspace/tickets/completed/T-145-replay-visible-closure-and-worker-report-authority-deletion.md
  - .ai-workspace/tickets/completed/T-151-one-closed-computational-loop-and-runner-evaluator-sovereignty.md
  - .ai-workspace/tickets/completed/T-152-data-mapper-scale-transformation-set-partition-proof.md
  - .ai-workspace/tickets/completed/T-153-live-non-close-disposition-parity-proof.md
  - .ai-workspace/tickets/completed/T-154-no-harness-target-data-mapper-parity-proof.md
  - .ai-workspace/tickets/completed/T-155-structural-requirement-authority-refs-and-proof-claim-admission.md
  - .ai-workspace/tickets/completed/T-157-first-pass-live-product-materialization-closure-contract.md
  - .ai-workspace/tickets/completed/T-159-product-assets-carry-requirement-lineage.md
  - .ai-workspace/tickets/completed/T-160-first-class-traversal-overlays-for-guided-graph-passes.md
  - .ai-workspace/tickets/backlog/T-119-add-compact-gaps-projection-for-live-harness-control.md
  - .ai-workspace/tickets/backlog/T-161-read-only-fd-run-analysis-linter.md
affected_boundary:
  - specification/requirements/02-graph-functions.md
  - specification/requirements/03-runtime-governance.md
  - specification/requirements/10-odd-sdlc-software-domain-buildout.md
  - specification/requirements/13-odd-sdlc-typescript-tenant.md
  - specification/requirements/14-odd-sdlc-installed-product-contract.md
  - build_tenants/typescript/code/src/graph/catalog.ts
  - build_tenants/typescript/code/src/graph/module.ts
  - build_tenants/typescript/code/src/graph/overlays.ts
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_EDGE_GAIN_CLOSURE_CONTRACT.md
  - build_tenants/typescript/code/src/hooks/catalog.ts
  - build_tenants/typescript/code/src/operator/carriers.ts
  - build_tenants/typescript/code/src/operator/handoff.ts
  - build_tenants/typescript/code/src/operator/installed_operator.ts
  - build_tenants/typescript/code/src/operator/traversal_consequence.ts
  - build_tenants/typescript/code/src/projection/query_domain.ts
  - build_tenants/typescript/code/src/start/public_start.ts
  - build_tenants/typescript/test_env/tests/
  - build_tenants/typescript/test_env/sandbox/scenarios/
excluded_boundary:
  - ABG core graph-call, frame, continuation, event, projection, and traversal truth
  - a second odd_sdlc runtime, controller loop, event store, replay authority, or product-local GTL meta-contract
  - treating worker percent-complete, worker assessment text, artifact existence, manifest shape, postflight success, or F_P status as closure authority
  - product-specific business semantics in generic ABG
  - F_D as the generic constructive mechanism for open-ended SDLC work; for the generic SDLC path, F_D is deterministic optimization, admission, validation, folding, and routing support around configured F_P
target_truth: Every close-capable odd_sdlc TypeScript graph edge and traversal overlay declares a product-owned gain function, evidence policy, metric function, threshold, ledger input set, closure function, residual-pressure function, and compound-traversal composition role. ABG supplies traversal and assurance substrate; odd_sdlc supplies SDLC meaning and closure interpretation. Closure is derived from admitted ledger/evidence truth, not from artifacts, worker prose, manifests, summaries, or generic traversal success.
superseded_truth: Closure bugs can be handled as independent symptom tickets where each local fix invents its own closure rule, or where artifact presence, materialization manifests, worker assertions, component tags, postflight success, or scenario expected-file lists can close an edge without a declared edge-level gain and closure contract.
closure_law: This ticket closes only when the TypeScript tenant publishes an inspectable edge assurance matrix for all close-capable SDLC graph edges, the matrix is design-method complete, the matrix is bound into execution/ledger/closure/query surfaces, missing gain or closure contracts fail closed, compound traversals compose edge gains without losing residual pressure, exactly one execution authority owns the installed close fold, and the absorbed T-158/T-103/T-130/T-142 scenarios pass as explicit proof obligations under the same contract model.
evaluation_criteria:
  - every published close-capable graph edge has a declared gain function, metric function, evidence policy, threshold, closure function, residual-pressure function, and composition role
  - every traversal overlay names the edge gain/closure rows it requires and cannot close a segment as product/worksite convergence without the relevant closure decisions
  - ledgers are the measuring toolset: metric functions consume admitted evidence and ledger rows, not worker assertions or harness-local expected-file lists
  - missing, duplicate, ambiguous, or unregistered gain/closure declarations produce typed non-close diagnostics visible through `gaps`, query-domain, archive evidence, and tests
  - compound traversal close preserves bottlenecks: every required intermediate edge closure must hold, final target closure must hold, and no required residual pressure may remain
  - full-graph live proof includes the test lifecycle after component code: test design, test stack, test module, test topology, component test materialization, test schedule, test execution preparation, test execution result admission, component test qualification, repair schedule/archive, release-depth parity, and release readiness
  - same-edge repair replay may reuse predecessor evidence only when the edge gain function admits that evidence and the close function proves no required product-materialization pressure remains
  - data_mapper/test35 parity is evaluated as preservation of declared closure semantics for the same edge contract, not as a file-count or tag-count comparison
  - design-depth full-breadth closure is a declared design-edge gain/closure row, not a hidden traversal strategy default
  - multi-tenant materialization fan-out closes only when every declared tenant target has admitted edge-local evidence or a typed batch close row covering every target
  - deterministic tests cover the matrix, missing-contract failure, ambiguous-contract failure, each absorbed scenario, and at least one three-edge compound traversal
  - opt-in live proof runs one installed sandbox traversal with at least three chained SDLC edges and assurance evidence archived under the normal test-run surface
proof_surface:
  - build_tenants/typescript/test_env/tests/test_t164_edge_gain_closure_contract.test.mjs
  - build_tenants/typescript/test_env/sandbox/scenarios/t164_rust_hello_service_lite.scenario.mjs
  - build_tenants/typescript/test_env/test_runs/scenario_t164_rust_hello_service_lite_live/*
  - build_tenants/typescript/test_env/sandbox/scenarios/data_mapper_internal.scenario.mjs
  - build_tenants/typescript/test_env/test_runs/scenario_data_mapper_internal/*
  - "absorbed proof: full internal data_mapper run covering T-158/T-103/T-130/T-142 closure semantics"
non_closure_conditions:
  - any close-capable edge in the published catalog lacks a gain or closure row
  - a generic materialization edge closes a product obligation by artifact existence, manifest presence, worker report text, F_P status, or postflight success alone
  - requirement tags plus worker assessment are treated as requirement-authority closure
  - worker percent-complete or scalar confidence is treated as the metric authority
  - compact gaps, run analysis, comments, summaries, or scenario expected-file lists become closure truth
  - a traversal overlay closes from overlay segment completion without the relevant edge closure decisions and residual-pressure checks
  - compound traversal close drops unresolved pressure from an intermediate edge
  - same-edge repair replay admits predecessor materialization evidence without matching workspace, graph edge, target binding, evidence policy, and contract digest
  - multi-tenant fan-out state lives in harness-local arrays instead of target binding, ledger, closure, and evaluator projection truth
  - implementation changes ABG core or creates an odd_sdlc-local traversal runtime to compensate for missing SDLC edge semantics
  - a claimed full-graph live proof stops at `component_code_surface` without generating tests, executing or admitting test evidence, archiving the test run, and deriving release readiness
---

# T-164: Per-Edge Gain And Closure Functions For SDLC Traversals

## STDO Triage

First missing layer: design.

The TypeScript line now has graph functions, ledgers, closure decisions,
scenario sandboxes, and traversal overlays. The remaining failed-closure class
is not a lack of carriers. It is that the product-level computation is still
underdeclared for each edge:

```text
what counts as gain
what evidence may measure that gain
what ledger rows record the measurement
what predicate closes the edge
what residual pressure remains when it does not close
how this edge contributes to a compound traversal
```

ABG now supplies the substrate shape for edge assurance. `odd_sdlc` still owns
the SDLC domain meaning. This ticket binds those two layers without moving SDLC
closure law into ABG and without creating a local meta-runtime.

Product regime law: current generic constructive gates expect configured
`F_P`. For the generic SDLC path, `F_D` is deterministic optimization,
admission, validation, folding, and routing support around that constructive
path. A close-capable generic edge may not use `F_D` success as a replacement
for missing `F_P` construction unless the edge contract explicitly declares the
edge deterministic, projection-only, or no-close. Optimized domains may rely on
`F_D` for performance and cost only through their own product-owned
deterministic contract; that is not the generic use case T-164 is fulfilling.

### STDO Re-Triage - 2026-05-14

Re-entry remains `design_reframe`.

The first implementation slice proved that a matrix can be declared and tested,
but the next execution work must be governed by explicit requirement and design
surfaces rather than by the ticket ledger alone. The controlling surfaces added
for this re-triage are:

- `specification/requirements/02-graph-functions.md`
  `REQ-F-GFUNC-006`, which states that graph overlays compose typed vector
  traversal contracts and do not own a second closure law.
- `specification/requirements/16-edge-gain-closure-contract.md`
  `REQ-F-ODDSDLC-063..067`, which defines the edge assurance matrix, per-edge
  gain/close semantics, compound traversal close, runtime contract carriage,
  and three-edge proof obligation.
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_EDGE_GAIN_CLOSURE_CONTRACT.md`,
  which is the TypeScript design module for the carrier set, functional
  kernels, module boundaries, runtime carriage, failure modes, and proof plan.

No further runtime execution work is closed by this re-triage. The current
implementation at that point was a first matrix slice under the new design.
The later runtime-kernel slice closes L3a and L11; L6-L10 and L12 remain
open until the archive/replay fixture, runtime close-gate binding,
projection surfacing, and deterministic three-edge proof exist. The later live
proof repricing collapses the separate L13/L15 live rows into L14.

### STDO Re-Triage - 2026-05-14 DMM/ODD Review

Re-entry changes from `design_reframe` to `requirement_reprice`.

The runtime-kernel checkpoint is useful but not design-method closed. The
review exposed missing constitutional and design obligations that must be
ratified before additional implementation/test cleanup is treated as lawful
closure work.

The ordered re-entry ladder is:

| Order | Re-entry point | Governing update | Work allowed after update |
| ---: | --- | --- | --- |
| 1 | `requirement_reprice` | Extend `specification/requirements/16-edge-gain-closure-contract.md` to require declared source-set policy, DMM/ODD design closure, recurrence decision, evaluate-action naming, execution-authority audit, and proof trace alignment. | Design module can be updated against ratified requirements. |
| 2 | `design_reframe` | Extend `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_EDGE_GAIN_CLOSURE_CONTRACT.md` with structural carrier diagram, source asset policy, recurrence/commonization decision, ODD function binding, and execution-authority status. | Implementation can be adjusted to the declared design. |
| 3 | `realization_refactor` | Make code follow the declared row fields and carrier ownership: data-driven source-set enforcement, explicit closure classification, trace alignment, naming cleanup, and subordinate-carrier folding or justification. | Deterministic tests can be updated. |
| 4 | `verification` | Re-run deterministic proof and resume full-capability live proof after the implementation reflects the updated design. | Closure evidence can be admitted. |

No new implementation work should be claimed under T-164 until the first two
steps are committed.

#### Review Finding Disposition

| Finding | Disposition | Lawful re-entry | Required action |
| --- | --- | --- | --- |
| F1 DMM §5E structural carrier diagram absent | Accepted, closure-blocking | `design_reframe` after requirement update | Add complete Mermaid `classDiagram` to the design module. |
| F2 DMM §11C recurrence/commonization decision absent | Accepted | `design_reframe` | Record do-not-commonize decision for ABG substrate carriers versus odd_sdlc domain carriers; allow only pure digest utility commonization. |
| F3 IACS declares fewer carriers than code exports | Accepted as design cleanup | `design_reframe` then `realization_refactor` | Either justify promoted subordinate carriers in the structural diagram/IACS or fold them into parent carriers. |
| F4 test trace comments cite old requirement family | Accepted | `realization_refactor` after design | Align proof comments to `REQ-F-ODDSDLC-063..068`. |
| F5 matrix file is large | Deferred | `realization_refactor` later | Split category rows only when next edits make review cost material. |
| F6 `closureClassification` default hides row intent | Accepted | `realization_refactor` | Require explicit classification in every contract row. |
| F7 source-set carve-out lives as imperative omission | Accepted, high priority | `requirement_reprice` then `design_reframe` then `realization_refactor` | Declare `source_asset_policy` on the contract row and enforce handoff source matching from data. |
| F8 kernel does not name ODD §11.5D function | Accepted | `design_reframe` then `realization_refactor` | Bind the kernel to `evaluate_action` in design and code header. |
| F9 two close-readiness authorities before L8 | Accepted as known-open L8 gate | `design_reframe` then runtime authority slice | Run execution-authority audit before generic close fold becomes installed close authority. |
| F10 projection residual-pressure merge may invent authority | Accepted for later review | `design_reframe` if touched | Decide whether projection observes closure refs only or admits extra refs explicitly. |
| F11 `SdlcEdgeGain.closeReady` is a partial close verdict | Accepted | `realization_refactor` | Rename to partial measurement wording or compute only inside close decision. |
| F12 category defaults lack edge override path | Deferred | `requirement_reprice` if needed | Add override requirements only when an edge requires specialization beyond category. |
| F13 synthetic obligation refs hide missing caller truth | Accepted | `realization_refactor` | Require obligation refs or make synthetic defaults explicit. |
| F14 `SdlcEdgeGainClosureFunctionPack` top-level promotion weak | Accepted as design cleanup | `design_reframe` then `realization_refactor` | Justify as category-template field grouping or inline. |
| F15 binary `score: 0 | 1` forecloses graded metrics | Deferred but recorded | `requirement_reprice` if graded metrics land | Keep binary slice unless graded metrics are introduced in active requirements. |
| F16 contract ref identity includes target asset type | Deferred | `realization_refactor` if touching identity | Reassess identity/digest surfaces after source policy and explicit classification land. |

#### Current State After Re-Triage

The pushed checkpoint proves useful runtime behavior but does not close T-164.
It showed the installed `start --until converged` loop can perform same-edge
repair inside the framework, but it also confirmed the design-method review is
now the controlling blocker.

Current accepted state:

- `specification/requirements/16-edge-gain-closure-contract.md` now owns
  `REQ-F-ODDSDLC-068` for method-auditable edge assurance design closure.
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_EDGE_GAIN_CLOSURE_CONTRACT.md`
  now owns the structural diagram, source asset policy, recurrence decision,
  ODD function binding, and execution-authority status.

Next legal implementation slice:

```text
source_asset_policy row field
  -> handoff source-set enforcement from contract row
  -> explicit closureClassification on every row
  -> evaluate_action trace header and test requirement trace alignment
  -> closeReady naming cleanup / synthetic obligation default cleanup
  -> deterministic tests
```

## Contract Shape

Each close-capable edge needs a declared row with this shape:

```text
SdlcEdgeGainClosureContract =
  edge_ref
  source_asset_set
  target_outcome
  authority_basis
  obligation_derivation
  evidence_policy
  metric_function
  threshold_policy
  ledger_inputs
  closure_function
  residual_pressure_function
  composition_role
  proof_lane
```

The core computation is:

```text
O_e = derive_obligations(authority_basis, edge_policy)
E_e = admit_evidence(candidate_outputs, runtime_events, tests, ledgers)
m_e(o) = metric_function(o, E_e)

gain_e = {
  obligation_scores,
  fulfilled_count,
  expected_count,
  residual_pressure,
  evidence_refs
}

close_e iff
  forall o in O_e: m_e(o) >= threshold_e(o)
  and required_evidence_present(e)
  and no_unresolved_required_pressure(e)
```

For compound traversal:

```text
Gain(A -> Z) = compose_gain(gain_e1, gain_e2, ..., gain_en)

close(A -> Z) iff
  all required intermediate closures hold
  and final target closure holds
  and no required residual pressure remains
```

This makes worker assessments admissible evidence only when a declared evidence
policy admits them. They are not the metric authority.

## Deterministic Edge Traversal Checklist

This is the review checklist for every GTL/SDLC edge traversal. It is used in
two places:

```text
edge authoring time:
  declare the contract row before the edge can be considered defined

runtime traversal time:
  execute the same checklist against admitted evidence before close/yield/retry/
  repair/re-enter/reprice/block can be selected
```

An edge traversal is underdeclared if any checklist row is unanswered.

### GTL Edge Definition Checklist

| Check | Contract question | Required declaration | Non-close if missing or ambiguous |
| --- | --- | --- | --- |
| 1 | What edge is this? | `edge_ref`, `graph_function_ref`, vector index, source asset set, target outcome, edge category, close capability. | `edge_contract_identity_missing` or `edge_not_close_capable`. |
| 2 | What authority may this edge read? | Authority basis refs: source docs, requirement surfaces, design/module surfaces, product definition, target bindings, prior ledgers, and allowed predecessor refs. | `edge_authority_basis_missing` or `edge_authority_ambiguous`. |
| 3 | What obligations does the edge derive? | `obligation_derivation` from authority into edge-local obligations plus downstream-carried obligations. Must define canonical requirement alias rules. | `edge_obligation_derivation_missing`, duplicate authority drift, or hidden residual pressure. |
| 4 | What transformation category is this edge? | One category template: `document`, `conformance`, `synthesis`, `formalisation`, `encoding`, `qualification`, or `projection`, with edge-specific overrides. | Generic closure cannot infer the gain template. |
| 5 | What is the gain function? | `metric_function_ref` and gain row shape: per-obligation scores, fulfilled/expected counts, evidence refs, residual pressure, and bottleneck refs. | Worker percent-complete, prose, or artifact existence may be mistaken for gain. |
| 6 | What evidence may count? | Evidence policy: admitted file types, product files, runtime events, execution results, ledgers, replay evidence, worker assessments, and explicit rejected evidence. | Unadmitted evidence cannot close; missing evidence policy fails closed. |
| 7 | What ledgers measure the gain? | Ledger inputs and required ledger rows: obligation ledger, materialization ledger, assurance ledger, closure decision, liveness/projection refs, target-binding refs. | Edge cannot prove gain from read models or summaries. |
| 8 | What threshold closes each obligation? | Threshold policy for every obligation class: binary, typed predicate, coverage set, execution result, structural parse, or explicit downstream carry. | Scalar confidence or `% complete` is not a metric authority. |
| 9 | What is the close function? | `closure_function`: close iff all edge-local obligations meet threshold, required evidence is present, contract diagnostics are clear, and no required residual pressure remains. | Edge cannot close from F_P status, postflight status, manifest shape, or worker assertion alone. |
| 10 | What residual pressure remains? | `residual_pressure_function`: missing, partial, blocked, deferred, carried-forward, reprice, replay, and proof-lane pressure refs. | Compound traversal may drop bottlenecks. |
| 11 | What action follows non-close? | Disposition mapping for `yield`, `retry`, `repair`, `re-enter`, `reprice`, and `block`, with lawful re-entry point and next-action basis refs. | Operator loops without a typed reason or retries the wrong edge. |
| 12 | How does replay work? | Replay policy: matching workspace, edge, target binding, evidence policy, contract digest, lineage refs, supersession rules, and corruption diagnostics. | Prior evidence may be over-admitted or stale diagnostics may poison closure. |
| 13 | How does the edge compose? | Composition role in compound traversal: prerequisite, intermediate, terminal, proof edge, projection edge, or residual-pressure carrier. | Path close may ignore an intermediate edge. |
| 14 | What proof lane validates it? | Deterministic test, live scenario, archive artifact, query/gaps projection, and absorbed-ticket proof refs. | Row remains design intent, not accepted implementation. |

### Runtime Traversal Attempt Checklist

For each traversal attempt, the operator must evaluate the same contract in this
order:

| Step | Runtime computation | Output carrier |
| --- | --- | --- |
| 1 | Resolve edge contract row by graph function, edge, overlay binding, and target asset. | Contract ref + digest in handoff, ledger, closure, projection, archive. |
| 2 | Load authority basis and predecessor refs declared by the row. | Authority-context refs and source digests. |
| 3 | Derive `O_e`, the edge obligation set, including canonical aliases and downstream-carried obligations. | Traversal obligation context. |
| 4 | Run `F_P.transform` or the declared transform mechanism under the edge contract. | Candidate output artifact, worker report, product files, runtime/test evidence. |
| 5 | Admit evidence under the evidence policy. | Admitted evidence refs plus rejected/diagnostic evidence refs. |
| 6 | Populate measuring ledgers from admitted evidence only. | Obligation, materialization, assurance, execution, liveness, and target-binding rows. |
| 7 | Compute `gain_e` with the metric function. | Per-obligation score rows, fulfilled/expected counts, evidence refs, bottlenecks. |
| 8 | Compute residual pressure. | Missing/partial/blocked/deferred/reprice/replay pressure refs. |
| 9 | Evaluate close function. | Edge closure decision: `close`, `yield`, `retry`, `repair`, `re-enter`, `reprice`, or `block`. |
| 10 | Project next action without changing closure truth. | Next-action projection, query/gaps read model, overlay segment completion if applicable. |
| 11 | Compose path gain when the traversal is compound. | Compound gain/close row preserving every intermediate bottleneck. |

The important constraint is that the checklist is deterministic. The worker may
produce candidate evidence, but the system closes only through the declared
edge contract:

```text
contract row + admitted evidence + ledger measurements -> gain -> close
```

### Minimum Review Questions

For any GTL edge row, a reviewer must be able to answer these questions from
the ticket/code without chat memory:

```text
What category of transformation is this edge?
What authority does it read?
What obligations does it derive?
What exact evidence can satisfy those obligations?
What ledgers measure that evidence?
What is the gain metric?
What threshold closes it?
What residual pressure is carried when it does not close?
What action is legal after non-close?
How does this edge compose into a larger path?
What deterministic and live proof shows the row works?
```

If the implementation cannot answer those questions, the edge is not a
complete GTL traversal definition.

## Generic Function Placement

The post at
`.ai-workspace/comments/codex/20260513T035126Z_data_mapper_test35_vs_ts_followup.md`
is the controlling formulation for this point:

```text
workspace change
  -> admitted evidence
  -> ledger measurement rows
  -> gain function
  -> close function
```

In T-164, `gain function` and `close function` do not mean one bespoke
handwritten closure routine per edge. They mean a generic SDLC function family
that drives closure for every close-capable edge, parameterized by the edge's
declared contract row.

The edge declares:

```text
authority_basis
obligation_set or obligation_derivation
evidence_policy
metric_function_ref
threshold_policy
ledger_inputs
residual_pressure_policy
composition_role
```

The generic implementation computes:

```text
derive_edge_obligations(contract, authority_context)
admit_edge_evidence(contract, candidate_outputs, runtime_events, tests, ledgers)
measure_edge_gain(contract, admitted_evidence, ledger_rows)
derive_residual_pressure(contract, edge_gain)
derive_edge_close(contract, edge_gain, residual_pressure)
compose_path_gain(path_contract, edge_gains)
```

So the placement is split:

```text
graph/edge_gain_closure_contracts.ts
  declares contract rows and registry/matrix

operator/edge_gain_closure.ts
  runs the generic gain, residual-pressure, close, and compose functions

operator/traversal_consequence.ts
  records the resulting ledger and closure decision
```

The graph still matters because it addresses the contract. The generic
functions still matter because they drive closure. The edge row supplies the
declared meaning for that generic computation.

## Edge Categories And Templates

The edge contract should also carry an edge category. The category is not the
same thing as the asset type, and it is not a second graph. It is the reusable
semantic class that selects the default gain/close template for an edge.

Candidate categories:

| Category | Typical transition | Default gain question | Default close question |
| --- | --- | --- | --- |
| `document` | raw source -> admitted source surface | Did we preserve and normalize the source with provenance, identity, and scope? | Is the document admitted, addressable, digest-stable, and scoped without inventing meaning? |
| `conformance` | broad or partial workspace/source -> canonical structure/profile | Did we canonicalize the structure while preserving provenance, ambiguity, and gaps? | Is the canonical structure present, typed, and usable by downstream edges, with nonconformance carried as residual pressure? |
| `synthesis` | source/authority -> synthesized semantic surface | Did we extract, organize, and trace the relevant meaning from authority? | Are the required authority points represented with traceability and explicit ambiguity/residual pressure? |
| `formalisation` | synthesized semantics -> typed/logical formulation | Did we remove ambiguity enough to make obligations testable, comparable, or mechanically checkable? | Is the formulation parseable/typed, internally consistent, and linked back to authority without unresolved required ambiguity? |
| `encoding` | formal/design authority -> implementation artifact | Did we realize the declared behavior in executable or durable product form? | Does admitted behavioral/execution evidence satisfy the declared obligations with no required residual pressure? |
| `qualification` | implementation artifact -> evaluated evidence | Did we execute or inspect the artifact against the declared contract? | Are declared checks executed, admitted, passing, and sufficient for the edge's evidence policy? |
| `projection` | admitted truth -> read model | Did we render useful operator visibility without changing authority? | Projection edges usually do not close product work; they close only their own read-model consistency, if close-capable at all. |

This lets T-164 avoid both extremes:

- no bespoke closure function for every edge;
- no one-size generic closure predicate that ignores the kind of work being
  performed.

The shape becomes:

```text
edge_category
  -> gain_template_ref
  -> close_template_ref
  -> edge contract parameters
  -> generic gain/close execution
```

Example:

```text
derive_requirement_surface
  category: synthesis
  gain template: authority coverage + traceability + ambiguity carry
  close template: required authority represented, no hidden ambiguity loss

derive_implementation_design_surface
  category: formalisation
  gain template: typed design obligations + consistency + testability
  close template: parseable/typed design contract with unresolved pressure
                 carried forward explicitly

derive_component_code_surface
  category: encoding
  gain template: behavioral fulfillment + product files + execution evidence
  close template: admitted code/test evidence satisfies declared obligations
```

The category supplies a reusable default. The edge still names its specific
authority basis, evidence policy, threshold policy, ledger inputs, and proof
lane.

This is the practical payoff: most SDLC traversals are not arbitrary work. They
belong to a categorical transformation class. A document edge, a synthesis
edge, a formalisation edge, an encoding edge, and a qualification edge all have
different default questions for gain and different default closure risks.

The category lets assessment and closure criteria inherit useful structure:

```text
category
  -> default obligation shape
  -> default admissible evidence shape
  -> default metric family
  -> default residual-pressure shape
  -> default close/yield/retry/reprice risks
```

The edge contract then specializes that category:

```text
edge = category template + concrete authority + concrete evidence policy
     + concrete threshold + concrete proof lane
```

So category is not a loose label. It is the reusable typed transformation
family that gives the generic gain/close functions enough semantics to assess
work correctly without writing a separate closure algorithm for every edge.

## Full Graph Test Lifecycle Law

`current_full_traversal` is not proven by reaching component code. Component
code is only the implementation half of the graph. A full graph run must carry
the generated product through the test lifecycle and release-readiness edges.

For this ticket, a full-graph live proof must test the framework's own ability
to iterate. The harness may provision a sandbox and install `odd_sdlc`, but it
must not drive graph progress with an external `gaps -> start --until
first_traversal` loop. After installation, graph execution must be one installed
start call:

```text
odd-sdlc-ts install ...
odd-sdlc-ts start --workspace . --target next --until converged --worker process://claude
```

or the same installed command binding with another declared live worker. The
CLI word is `converged`; `complete` is not a valid `--until` value. A
harness-mediated loop over individual traversals is useful debugging evidence,
but it is not full-graph proof.

The proof must include this lifecycle after implementation code exists:

```text
derive_test_design_surface
select_test_stack_profile
derive_test_module_surface
derive_test_component_topology_surface
derive_component_test_surface
derive_test_schedule_surface
prepare_test_execution_surface
derive_test_execution_result_surface
qualify_component_test_execution_surface
derive_component_repair_schedule_surface
derive_test_run_archive_surface
derive_release_depth_parity_surface
prepare_release_surface
```

The run may also include prerequisite implementation edges such as
`derive_component_code_surface`, `qualify_component_realization_surface`, and
`derive_code_surface`; those are necessary but not sufficient. A live proof that
stops after `derive_component_code_surface` proves only the implementation
model path. It does not prove the full graph.

Closure requires archive evidence for generated tests, admitted test execution
truth, component test qualification, test-run archive, release-depth parity,
and release readiness. A process check such as `node hello.js` or `curl /` is
useful behavioral evidence, but it is not a substitute for the graph-owned test
lifecycle.

## Published Graph Inventory Snapshot

Count basis: `constructSdlcGtlModule()` after `npm run build:semantic`,
materialized through ABG `materializeGraphFunction(...)`.

The current TypeScript graph publishes:

```text
68 graph functions
  13 reusable library functions
  49 product-specialized leaf functions
   6 executive graph functions

62 unique graph vectors by published vector name
114 materialized vector occurrences when executive compositions are expanded
  5 traversal overlays
```

Use `62` as the full graph inventory review count. Do not use `114` as the
contract row count: that number double-counts vectors when executive graph
functions inline existing leaf vectors.

### Graph Surface Crosswalk

For T-164, graph overlays and graph leaves should not become separate review
ledgers. Once every vector traversal has a full checklist, a long graph
function or overlay cannot hide missing closure law; it can only compose
declared vector traversals.

The useful contract unit is the typed vector traversal:

```text
typed source node set -> typed target node
```

The stack should be read in this order:

```text
1. node surface definitions
2. typed vector traversals
3. graph functions as named compositions of vector traversals
4. overlays as traversal selections/profiles over named graph functions
```

Node definitions declare a surface: a named typed asset position with schema,
surface kind, output contract refs, and semantic role. In the current GTL/ABG
carrier model, a node is not itself a graph function. A node can represent a
surface that contains graph-function selection data, catalog data, or a
graph-function-shaped document, but executable graph-function identity lives in
the `GraphFunction` carrier.

Typed vector traversals declare the source node set, target node, category,
authority, obligations, evidence, metric, close, residual pressure, replay, and
composition role. A graph function is then a named callable graph over one or
more vector traversals. In the current `odd_sdlc` graph, leaf graph functions
are one-vector graph functions and executive graph functions are named chains
over leaf vectors. More generally, a graph function may be a composition graph,
not only a linear chain.

The overlay provides traversal grouping, start target, stop policy, terminal
asset, and operator-facing selection context. It does not need an independent
closure checklist when the vectors it selects already carry the full checklist.

So the distinction is implementation identity, not separate closure authority.
T-164 should review one matrix of edge rows and include overlay membership as
columns on that row.

| Surface | Current count | Code carrier | Meaning | T-164 interpretation |
| --- | ---: | --- | --- | --- |
| Node surface definition | many | `nodeFor(...)` asset nodes | Named typed surface such as `requirement_surface`, `component_code_surface`, or `release_surface`. | Defines source/target surface type, schema, output contract refs, and semantic role. It may describe graph-function-related data, but it is not the executable graph function. |
| Typed vector traversal | 62 unique | ABG materialized `GraphVector` | The concrete typed source-node-set -> typed target-node traversal. | The gain/close contract identity and checklist row. |
| Leaf graph function | 49 | `SDLC_FUNCTION_CATALOG` entries tagged `leaf_graph_function` or `overlay_only_leaf` | Single-hop product-specialized callable that usually materializes one vector. | A named graph function over one typed vector traversal. |
| Reusable graph function | 13 | `REUSABLE_GRAPH_FUNCTION_CATALOG` | Shared library/product function such as `Fg_conform_project` or assurance-ledger folds. | Either an edge row, a library-only row, or a measuring-tool row depending on role. |
| Executive graph function | 6 | `constructExecutive(...)` | Callable compound path made from leaf vectors. | A named chain/composition over typed vector traversal rows. |
| Traversal overlay | 5 | `SdlcTraversalOverlay` in `graph/overlays.ts` | Traversal grouping, start-target, terminal-asset, and operator selection profile over graph functions/vectors. | Selection/profile columns over vector rows, not independent closure authority. |

So the clean mental model is:

```text
node surface definition = typed asset surface
typed vector traversal = typed source nodes -> typed target node + checklist
leaf graph function = named one-vector graph function
executive graph function = named chain/composition of vector traversals
overlay = traversal selection/profile over graph functions and vectors
```

The work product is one vector traversal matrix. Overlay membership is only a
grouping and public-start context column on that matrix.

### Overlay To Function/Leaf Crosswalk

| Overlay | Public starts | Overlay graph-function refs | Expanded unique vectors | Terminal asset | What it really selects |
| --- | --- | ---: | ---: | --- | --- |
| `current_full_traversal` | `Fg_conform_project_authority`, `bootstrap_release_self_test`, `release_operational_cycle` | 44 | 42 | `release_surface`, `retrofit_plan_surface` | `Fg_conform_project`, `Fg_conform_project_authority`, the bootstrap/release executive, the operational executive, and their leaf vectors. This overlay intentionally double-publishes executives and direct leaves, so count unique vectors for contracts. |
| `bootstrap_requirements` | `bootstrap_requirements` | 2 | 5 | `requirement_surface` | `Fg_conform_project` plus the `bootstrap_requirements` executive, expanding to intent/product/goals/requirements leaf vectors. |
| `solution_architecture` | `solution_architecture` | 1 | 4 | `implementation_design_surface` | The `solution_architecture` executive, expanding to feature decomposition, design, scenario, and implementation-design leaf vectors. |
| `uat_test_cases` | `uat_test_cases` | 1 | 1 | `uat_testcases_surface` | The `uat_test_cases` executive, expanding to `derive_uat_testcases_surface`. |
| `lite_design_module_implementation` | `lite_design_module_implementation` | 4 | 3 | `component_code_surface` | The lite executive plus three overlay-only leaf vectors: design/ADR, module, component code. |

### Executive Graph Functions

| Executive graph function | Leaf steps | Output |
| --- | ---: | --- |
| `bootstrap_release_self_test` | 33 | `release_surface` |
| `release_operational_cycle` | 7 | `retrofit_plan_surface` |
| `bootstrap_requirements` | 4 | `requirement_surface` |
| `solution_architecture` | 4 | `implementation_design_surface` |
| `lite_design_module_implementation` | 3 | `component_code_surface` |
| `uat_test_cases` | 1 | `uat_testcases_surface` |

Use this split for T-164 execution:

| Review band | Edge count | Primary categories | Review action |
| --- | ---: | --- | --- |
| Reusable library/substrate functions | 13 | library template, document, conformance, synthesis, encoding, assurance | Classify each as `library_only`, shared close-capable product traversal, or measuring tool. `Fg_conform_project`, `Fg_conform_project_authority`, `Fg_ingress_project`, and `Fg_materialize_declared_product_asset` are reusable but still product-relevant traversal rows. |
| Bootstrap requirements executive leaves | 4 | synthesis | Declare authority-coverage gain/close for intent, product, goals, and requirements. |
| Solution architecture leaves | 4 | formalisation | Declare requirements-to-feature/design/scenario/implementation-design gain and residual-pressure behavior. |
| UAT testcase branch | 1 | synthesis + qualification | Declare testcase-authority gain from requirements and admitted architecture. |
| Implementation build-out leaves | 10 | formalisation, encoding, qualification | Declare design-depth, module/domain/topology/schedule, component-code, component-realization, realization-schedule, and code-surface gain/close. |
| Test and release qualification leaves | 14 | formalisation, encoding, qualification | Declare test design/module/topology/test-code/schedule/execution/result/archive/testcase/release-parity/release-surface gain/close. |
| Lite implementation overlay leaves | 3 | synthesis, formalisation, encoding | Declare overlay-only rows so lite traversal cannot bypass full edge semantics. |
| Operational continuation leaves | 7 | transition, qualification, projection | Declare build/deploy/runtime/retrofit gain and distinguish pending side-effect state from product closure. |
| Triage and repricing leaves | 6 | projection, governance | Classify as projection-only or no-product-close unless a specific read-model consistency close is declared. |

Overlay coverage:

| Overlay | Unique vectors | Terminal asset |
| --- | ---: | --- |
| `current_full_traversal` | 42 | `release_surface`, `retrofit_plan_surface` |
| `bootstrap_requirements` | 5 | `requirement_surface` |
| `solution_architecture` | 4 | `implementation_design_surface` |
| `uat_test_cases` | 1 | `uat_testcases_surface` |
| `lite_design_module_implementation` | 3 | `component_code_surface` |

The overlay union covers `45` unique graph vectors. The remaining `17` published
vectors are outside traversal overlays today: `6` triage/governance projection
edges plus `11` reusable library/support edges. The first implementation slice
classifies all `62` published vectors so missing closure cannot hide outside the
main overlays:

```text
47 close_capable
 9 library_only
 6 projection_only
```

The deterministic T-164 inventory test now validates this count against the
materialized ABG graph vector boundaries and rejects gaps or duplicates.

### Overlay Execution Order And Test Gap

Work through the five existing traversal overlays before widening to open-ended
catalog hardening.

The first pass should be `current_full_traversal`. It is the closest thing to
the complete SDLC overlay and should define the canonical vector contract
matrix for the ordinary path. Count unique vectors, not materialized occurrences
inside executive graph functions.

After the complete overlay is declared, review the other overlays as
recompositions of that matrix:

1. `bootstrap_requirements` should mostly select the initial conformance and
   authority-synthesis portion of the complete route.
2. `solution_architecture` should mostly select the requirements-to-design /
   implementation-design portion of the complete route.
3. `uat_test_cases` should mostly select the UAT testcase derivation row over
   requirements plus admitted solution architecture authority.
4. `lite_design_module_implementation` is the important exception. It currently
   publishes a lite direct implementation vector:

   ```text
   implementation_design_surface
   + implementation_module_surface
   -> component_code_surface
   ```

   That vector bypasses the fuller implementation topology, realization
   schedule, stack-profile, and component-depth intermediates. It must therefore
   receive its own gain, close, residual-pressure, and proof row. Its close
   function must state what the lite route proves and what pressure it
   deliberately leaves for the complete overlay.

Current first-slice test surfaces exist, but they do not yet close the full
runtime-depth ticket. Existing T-160 tests prove the five overlay declarations,
overlay binding, lite direct terminal vector shape, segment completion, replay
identity, and the separation between overlay segment completion and product
convergence. `test_t164_edge_gain_closure_contract.test.mjs` now proves the
edge contract matrix, category templates, overlay-selected vector coverage,
lite residual-pressure specialization, and fail-closed diagnostics. The
T-164 Rust hello-service sandbox proves the initial conformance bootstrap seed.
The separate three-edge edge-assurance scenario is formally repriced out of the
proof surface. T-164 now treats the L14 Rust service live run as the single live
gate: that archive must prove the installed trigger, at least three chained
edge-assurance closures, and the service output.

### Current Full Traversal First-Pass Function Categories

This is the first pass over the `current_full_traversal` overlay. It classifies
the `42` unique vector traversals into function categories. It is not yet the
accepted matrix implementation; it is the review scaffold for L1-L5.

Every close-capable category needs the same function pack shape:

```text
derive_<category>_obligations(...)
admit_<category>_evidence(...)
measure_<category>_gain(...)
close_<category>_edge(...)
derive_<category>_residual_pressure(...)
compose_<category>_path_gain(...) when the category appears in a compound path
```

First-pass category table:

| Category | Count | Current-full vectors | Needed function pack | Closure pressure to preserve |
| --- | ---: | --- | --- | --- |
| `conformance` | 1 | `Fg_conform_project` | `derive_conformance_obligations`, `admit_conformance_evidence`, `measure_conformance_coverage`, `close_conformance_edge`, `derive_conformance_residual_pressure` | Missing/invalid workspace topology, selected tenant, output root, module inventory, capability contracts, execution contracts, or managed traversal phase gaps. |
| `authority_synthesis` | 5 | `Fg_conform_project_authority`, `derive_intent_surface`, `derive_product_surface`, `derive_goal_surface`, `derive_requirement_surface` | `derive_authority_obligations`, `admit_authority_surface_evidence`, `measure_authority_coverage`, `close_authority_synthesis_edge`, `derive_authority_residual_pressure` | Missing or unsupported project bootstrap, intent, product, goals, requirement families, imported-source trace, target binding, or deferred requirement-generation pressure. |
| `solution_formalisation` | 4 | `derive_feature_decomp_surface`, `derive_design_surface`, `derive_scenario_surface`, `derive_implementation_design_surface` | `derive_formalisation_obligations`, `admit_design_evidence`, `measure_design_depth_gain`, `close_design_formalisation_edge`, `derive_design_residual_pressure` | Steel-thread or partial design must remain residual pressure when full-breadth module schema, state, aggregate model, scenario, or implementation-design obligations remain open. |
| `testcase_synthesis_and_authority` | 2 | `derive_uat_testcases_surface`, `qualify_testcase_authority` | `derive_testcase_obligations`, `admit_testcase_evidence`, `measure_testcase_authority_gain`, `close_testcase_authority_edge`, `derive_testcase_residual_pressure` | Requirements without UAT coverage, scenario mismatch, unsupported acceptance criteria, or unqualified testcase authority. |
| `implementation_formalisation_and_planning` | 7 | `select_implementation_stack_profile`, `derive_implementation_module_surface`, `derive_aggregate_domain_model_surface`, `derive_implementation_component_topology_surface`, `derive_aggregate_sunny_day_sequence_surface`, `derive_component_realization_schedule_surface`, `derive_realization_schedule_surface` | `derive_implementation_planning_obligations`, `admit_implementation_design_evidence`, `measure_implementation_planning_gain`, `close_implementation_planning_edge`, `derive_implementation_planning_residual_pressure` | Missing stack authority, module allocation, schema/state depth, component topology, sunny-day sequence, schedule coverage, or target-binding support. |
| `implementation_encoding` | 2 | `derive_component_code_surface`, `derive_code_surface` | `derive_encoding_obligations`, `admit_code_evidence`, `measure_behavioral_encoding_gain`, `close_code_encoding_edge`, `derive_encoding_residual_pressure` | Artifact existence or worker prose is not enough; unresolved behavioral obligations, missing declared product files, failed postflight, or unadmitted predecessor evidence remain open. |
| `implementation_qualification` | 1 | `qualify_component_realization_surface` | `derive_component_qualification_obligations`, `admit_component_qualification_evidence`, `measure_component_qualification_gain`, `close_component_qualification_edge`, `derive_component_qualification_residual_pressure` | Component code must be qualified against topology and admitted evidence; shallow realization or unsupported component depth remains residual pressure. |
| `test_formalisation_and_planning` | 5 | `derive_test_design_surface`, `select_test_stack_profile`, `derive_test_module_surface`, `derive_test_component_topology_surface`, `derive_test_schedule_surface` | `derive_test_planning_obligations`, `admit_test_design_evidence`, `measure_test_planning_gain`, `close_test_planning_edge`, `derive_test_planning_residual_pressure` | Missing test stack, module/test topology, testcase allocation, executable schedule, or design-to-test trace remains open. |
| `test_encoding_and_execution` | 4 | `derive_component_test_surface`, `prepare_test_execution_surface`, `derive_test_execution_result_surface`, `qualify_component_test_execution_surface` | `derive_test_execution_obligations`, `admit_test_execution_evidence`, `measure_test_execution_gain`, `close_test_execution_edge`, `derive_test_execution_residual_pressure` | Test file presence, command intent, or archive prose cannot close without admitted execution result, pass/fail evidence, and qualification against test topology. |
| `repair_archive_release_qualification` | 4 | `derive_component_repair_schedule_surface`, `derive_test_run_archive_surface`, `derive_release_depth_parity_surface`, `prepare_release_surface` | `derive_release_readiness_obligations`, `admit_release_evidence`, `measure_release_readiness_gain`, `close_release_readiness_edge`, `derive_release_residual_pressure` | Failed tests, repair schedule pressure, missing archive truth, release-depth mismatch, or absent requirement/design/code/test evidence blocks release close. |
| `operational_transition_and_return` | 7 | `prepare_build_execution_surface`, `derive_build_execution_result_surface`, `prepare_deployment_surface`, `derive_deployment_result_surface`, `derive_deployed_environment_surface`, `derive_runtime_observation_surface`, `derive_retrofit_plan_surface` | `derive_operational_transition_obligations`, `admit_operational_evidence`, `measure_operational_gain`, `close_operational_edge`, `derive_operational_residual_pressure` | Pending side effects, missing build/deploy/runtime evidence, unresolved deployment state, runtime observation gaps, or retrofit pressure must not be treated as product convergence. |

Cross-cutting deterministic optimizations may attach to these categories only
through declared edge contracts. Examples: schema parsing for authority
surfaces, manifest replay for encoding, compiler/linter/test execution for
implementation and test edges, archive completeness checks for release, and
probe validation for operational return. These `F_D` functions optimize or
reject evidence; they do not replace required generic `F_P` construction unless
the edge is declared deterministic, projection-only, or no-close.

## Bootstrap Edge-By-Edge Ledger

Start T-164 with bootstrap conformance. The first concrete implementation slice
should define these rows before widening to the full catalog.

| Done | Row | Edge | Category | Transition | Gain template | Close predicate | Residual pressure |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [ ] | B1 | `Fg_conform_project` | `conformance` | unordered source set + project constraints -> `ConformProjectProfile` + `constitutional_bootstrap` | Structure conformance coverage: source refs, active tenant, selected output root, runtime layout, module inventory, capability contracts, execution contracts, realization mode, and expected topology refs. | Close iff `SdlcConformProjectReport.status = passed`, `conformanceGaps = []`, managed traversal phase verdicts are satisfied, selected output root policy holds, and expected bootstrap/topology files are present as admitted refs. | `project_constraints_missing`, `intent_surface_missing`, `product_surface_missing`, `goals_surface_missing`, `requirements_family_missing`, `imported_sources_requirement_missing`, `project_bootstrap_missing`, `tenant_registry_missing`, `selected_output_root_outside_build_tenants`, plus any managed traversal phase gaps. |
| [ ] | B2 | `Fg_conform_project_authority` | `synthesis` over conformed structure | `ConformProjectProfile` + conformance report + authority input + target bindings -> project authority surfaces + next-action projection | Authority synthesis coverage: project bootstrap, intent, product, goals, requirements README support rows, admitted authority input, target-binding or next-action projection, and explicit deferred requirement-generation pressure. | Close iff conformed project status is passed, authority input is admitted or not required, authority surface rows are `supportable` or lawfully `deferred`, materialization report records created/updated/skipped authority files, no blocked next-action row remains, and it does not construct release graph or product files. | `project_authority_requires_defined_conformed_workspace`, authority input block reasons, `project_authority_not_observed`, `target_binding_required_before_next_action`, and `requirement_generation_deferred_to_evaluator`. |

### Bootstrap Contract Notes

`Fg_conform_project` is the structural bootstrap edge. Its category is
`conformance`, not `encoding`: the target is a canonical project profile and
workspace topology that later SDLC graph functions can trust.

`Fg_conform_project_authority` is the follow-on authority synthesis edge. It
uses the conformed structure as its prerequisite and turns source/bootstrap
pressure into initial SDLC authority surfaces and next-action pressure. It must
not be allowed to close product realization or release construction.

The first implementation pass should make B1 executable through the generic
gain/close functions, then add B2 once B1's conformance result is available as a
declared input to authority synthesis.

## Consolidated Proof Obligations

| Consolidated ticket | Closure failure class | T-164 proof obligation |
| --- | --- | --- |
| T-158 | Same-edge repair replay could lose product-materialization evidence or require the worker to rewrite every product file. | Product materialization gain admits predecessor evidence only when workspace, graph edge, target binding, evidence policy, and contract digest match; closure still rejects unresolved product-file pressure. |
| T-103 | Historical data_mapper/test35 parity was a narrative comparison rather than a declared closure-semantics preservation proof. | A data_mapper/test35-shaped edge/path comparison proves the TypeScript contract preserves the same gain and close semantics for the same declared outcome. |
| T-130 | Full-breadth design depth could be hidden behind traversal strategy or steel-thread closure. | Design-depth edges declare full-breadth gain, metric, evidence, and close rows for module schema, state, aggregate model, and sunny-day sequence coverage. |
| T-142 | Multi-tenant fan-out could let one generated tenant or harness-local expected-file loop stand in for product closure. | Multi-tenant materialization declares per-target or typed batch gain rows, records target-specific ledgers, and closes only when every declared target has admitted evidence. |

## Non-Consolidated Tickets

The following active or backlog tickets stay open because T-164 does not deliver
their product behavior:

- T-131 guided odd_chat live lane: proof lane capability, not the generic edge
  gain/closure contract.
- T-163 MindForge scenario family: presentation scenario proof, not the generic
  contract.
- T-119 compact gaps projection: useful consumer of missing-contract state, but
  still a projection/performance ticket.
- T-161 read-only F_D run analysis linter: useful diagnostic support, but not
  closure authority.
- T-162 ticket workflow: governed ticket execution workflow, not edge closure
  semantics.
- T-117 sticky-session executor adoption: live-run optimization and retry
  robustness, not closure law.
- T-107, T-108, B-076, T-018, and T-019: module-boundary or helper refactors.

## Implementation Direction

Prefer extending the existing TypeScript graph/catalog/operator/projection
surfaces over adding a new runtime path.

The implementation should make the edge assurance matrix visible enough that a
reviewer can ask, for any edge:

```text
What is this edge's gain function?
What is this edge's close function?
What ledgers does it measure from?
What happens when the edge does not close?
How does this edge compose into the selected traversal?
```

If the system cannot answer those questions for a close-capable edge, that edge
must not close.

## Execution Work Ledger

This ledger is the check-off surface for T-164 execution. A row is complete only
when the implementation surface exists and the proof column has a concrete test,
archive, or review artifact recorded. Do not mark a row complete from design
intent alone.

### Contract And Inventory

| Done | Row | Work item | Target surface | Proof required |
| --- | --- | --- | --- | --- |
| [x] | L1 | Inventory all published TypeScript graph edges and classify them as `close_capable`, `library_only`, `projection_only`, or `no_close`. | `build_tenants/typescript/code/src/graph/catalog.ts`, `module.ts`, `overlays.ts` | Deterministic inventory test rejects an unclassified published edge. |
| [x] | L2 | Define the SDLC edge gain/closure contract carrier: edge ref, edge category, target outcome, authority basis, obligation derivation, evidence policy, metric-function ref, threshold policy, ledger inputs, residual-pressure policy, composition role, proof lane. | `graph/edge_gain_closure_contracts.ts` or equivalent declaration module | Type-level or runtime validation test covers required fields and rejects malformed rows. |
| [x] | L3 | Add reusable category templates for document, synthesis, formalisation, encoding, qualification, and projection edges. | `graph/edge_gain_closure_contracts.ts` or adjacent template registry | Tests prove category templates supply defaults but edge rows can specialize authority, evidence, threshold, and proof lane. |
| [x] | L3a | Add the generic closure-driving functions over those contract rows: derive obligations, admit evidence, measure gain, derive residual pressure, derive close disposition, compose path gain. | `operator/edge_gain_closure.ts` or equivalent execution module | Unit tests prove the same generic functions drive at least two different edge contracts without bespoke edge-local closure logic. |
| [x] | L3b | Add a canonical edge assurance matrix registry for all close-capable SDLC edges. | graph/catalog or adjacent contract registry | Deterministic test proves every close-capable edge has exactly one matrix row. |
| [x] | L4 | Bind traversal overlays to the matrix rows they require. | `graph/overlays.ts`, overlay binding carriers | Overlay test rejects an overlay whose close-capable edge lacks a gain/closure row. |
| [x] | L5 | Add duplicate, missing, ambiguous, and unregistered contract diagnostics. | shared blocking reason / validation surface | Negative tests cover all four diagnostic classes. |

### Runtime Binding

| Done | Row | Work item | Target surface | Proof required |
| --- | --- | --- | --- | --- |
| [x] | L6 | Carry edge gain/closure contract refs and digests into execution contracts, handoff manifests, ledger artifacts, closure decisions, next-action projections, and archives. | `operator/handoff.ts`, `installed_operator.ts`, `traversal_consequence.ts`, carriers | `test_t164_edge_gain_closure_contract.test.mjs` proves handoff/invocation/brief identity; `test_t064_installed_operator_ux.test.mjs` reads installed archive JSON for gain, residual pressure, ledger, closure decision, and next-action projection identity. |
| [x] | L7 | Make the generic `measure_edge_gain(...)` function consume admitted evidence and ledger rows, not worker assessment text, worker percent-complete, artifact existence, or harness-local expected files. | operator assurance/closure path | `test_t164_edge_gain_closure_contract.test.mjs` rejects worker percent-complete and artifact presence alone; missing measuring ledgers produce a generic edge-assurance `block`. |
| [x] | L8 | Refactor closure decision derivation so close/yield/retry/repair/re-enter/reprice/block is derived from the generic `derive_edge_close(...)` and `derive_residual_pressure(...)` functions over the declared contract. | `installed_operator.ts`, `traversal_consequence.ts`, closure decision construction | Installed traversal consequence now derives `SdlcEdgeAssuranceCloseDecision` from generic gain/residual pressure and passes it into `deriveSdlcEdgeClosureDecision`; focused tests cover close, retry, yield, repair, re-enter, reprice, and block. |
| [x] | L9 | Preserve ABG ownership: use ABG assurance substrate where available, but keep SDLC gain/closure meaning in odd_sdlc carriers. | ABG adapter and SDLC operator boundary | Review note: this slice changes only odd_sdlc graph/operator/projection/test surfaces; it introduces no ABG core change, no local traversal runtime, and no local event store. ABG remains the replay/traversal substrate. |
| [x] | L10 | Expose missing-contract and residual-pressure state through `gaps` and query-domain as read models. | `projection/query_domain.ts`, gaps projection | `test_t164_edge_gain_closure_contract.test.mjs` proves query-domain edge-assurance rows, missing-contract diagnostics, proof-lane refs, residual-pressure refs, and gap/dossier fields while preserving `choosesNextTraversal: false` and no action-closure authority. |

### Compound Traversal

| Done | Row | Work item | Target surface | Proof required |
| --- | --- | --- | --- | --- |
| [x] | L11 | Implement `compose_path_gain(...)` for a path as a typed fold over edge gains, preserving bottlenecks and intermediate residual pressure. | graph/operator composition helper | Unit test proves compound close fails when an intermediate edge has residual pressure. |
| [x] | L12 | Add a deterministic three-edge SDLC chain proof: `requirements synthesis -> formal requirement syntax -> design encoding`. | `test_t164_edge_gain_closure_contract.test.mjs` or scenario fixture | `T-164 deterministic requirement-to-design chain closes by per-edge gain` proves `derive_requirement_surface -> derive_feature_decomp_surface -> derive_design_surface` exposes gain, close decision, residual pressure, and compound composition rows. |
| [x] | L13 | Collapse the separate installed three-edge live proof into the L14 full live Rust service run. | `test_env/sandbox/scenarios/t164_rust_hello_service_lite.scenario.mjs` | No separate `t164_three_chain_edge_assurance` scenario is required; the L14 live archive must expose at least three chained installed edges with handoff, ledger, closure, next-action, gain, and residual-pressure evidence. |
| [x] | L14 | Add and run the conformance-bootstrap Rust service proof as the single T-164 live gate. | `test_env/fixtures/t164_rust_hello_service_lite/bootstrap.md`, `test_env/sandbox/scenarios/t164_rust_hello_service_lite.scenario.mjs` | Deterministic proof starts from only `bootstrap.md` plus project constraints and closes `Fg_conform_project`; the opt-in live run invokes the installed product trigger, archives the collapsed L13 three-edge evidence, materializes a Rust HTTP API, and proves `curl /` returns `helloworld`. |
| [x] | L15 | Collapse the full-graph live trigger row into L14. | `test_env/sandbox/scenarios/t164_rust_hello_service_lite.scenario.mjs` | The installed trigger is the execution mode for the L14 live run, not a second live proof surface. |

### Absorbed Proof Rows

| Done | Row | Work item | Target surface | Proof required |
| --- | --- | --- | --- | --- |
| [x] | P1-P4 | Run the full internal `data_mapper` proof as the combined absorbed-ticket gate. | `test_env/live/test_t164_data_mapper_full_capability_live.test.mjs`, `test_env/test_runs/t164_data_mapper_full_capability_live/20260514T105715480Z_pid16615/` | The run proves same-edge replay admission, data_mapper closure-semantics preservation, full-breadth design depth, and multi-target materialization/fan-out closure under the T-164 edge contract model. |
| [x] | P1 | Collapse T-158 same-edge materialization replay into the full internal `data_mapper` run. | product materialization edge contract and tests | The P1-P4 run must prove prior manifest evidence is admitted only when workspace, graph edge, target binding, evidence policy, and digest match; unresolved pressure blocks close. |
| [x] | P2 | Collapse T-103 data_mapper/test35 parity into the full internal `data_mapper` run. | data_mapper comparison proof | The P1-P4 run must prove closure-semantics preservation, not file-count parity. |
| [x] | P3 | Collapse T-130 full-breadth design depth into the full internal `data_mapper` run. | design completeness assurance | The P1-P4 run must prove full-breadth module schema, state, aggregate model, and sunny-day evidence; steel-thread deferral remains residual pressure when selected. |
| [x] | P4 | Collapse T-142 multi-tenant materialization fan-out into the full internal `data_mapper` run. | multi-target materialization contract | The P1-P4 run must prove one generated tenant cannot close the compound product; every declared tenant target has admitted evidence or a typed batch close row. |

### Hardening And Closure

| Done | Row | Work item | Target surface | Proof required |
| --- | --- | --- | --- | --- |
| [x] | H1 | Add package scripts for focused deterministic and opt-in live T-164 proof. | `build_tenants/typescript/package.json` | `npm run test:t164` and live-gated script names are present and documented. |
| [x] | H2 | Run focused deterministic proof. | TypeScript tenant test suite | Command result recorded in this ticket with pass count. |
| [x] | H3 | Run regression suite covering touched graph/operator/projection paths. | existing semantic tests | Command result recorded in this ticket with pass count. |
| [x] | H4 | Collapse opt-in live three-edge proof into L14. | installed sandbox archive | L14 is the live proof gate and must record the archive path or typed blocker for the three-edge subset. |
| [x] | H6 | Collapse the full-graph trigger proof into L14. | installed sandbox archive | L14 owns the installed trigger command and archive path; no separate H6 gate remains. |
| [x] | H5 | Update this ticket with implementation evidence, changed files, proof commands, archive refs, and remaining non-closure conditions. | T-164 body | Ticket can be reviewed without chat memory. |

### Initial Execution Order

1. Build the canonical matrix from `current_full_traversal` first. The full
   overlay gives the widest ordinary SDLC route and prevents the smaller
   overlays from defining rival edge semantics.
2. Reconcile `bootstrap_requirements`, `solution_architecture`, and
   `uat_test_cases` as recompositions/subsets of the canonical matrix. They may
   add overlay membership, public-start, terminal-asset, and stop-policy data,
   but should not invent separate closure law for an already-declared vector.
3. Treat `lite_design_module_implementation` as both a recomposition and a
   specialization. Its direct design/module-to-component-code vector is a real
   lite vector and needs its own row, proof, and residual-pressure statement.
4. Complete L1-L5 after that overlay review. The matrix must exist before
   runtime code depends on it.
5. Complete L6-L10 next. Runtime artifacts must carry the selected contract
   before closure behavior changes.
6. Complete L14 as the single live proof gate. L14 carries the installed
   trigger, the collapsed three-edge proof, and the Rust service output proof.
7. Complete the full internal `data_mapper` run to retire P1-P4 under the same
   contract.
8. Complete hardening rows for closure packaging.

## Implementation Evidence - First Slice

Implemented on 2026-05-14:

- `build_tenants/typescript/code/src/graph/edge_gain_closure_contracts.ts`
  declares the first SDLC edge gain/closure contract carrier, reusable category
  templates, full published-vector matrix rows, and fail-closed diagnostics for
  missing, duplicate, ambiguous, and unregistered rows.
- `build_tenants/typescript/code/src/graph/overlays.ts` binds traversal overlay
  construction to the edge gain/closure matrix. An overlay-selected vector now
  fails closed during catalog construction if its row is missing or invalid.
- `build_tenants/typescript/code/src/graph/index.ts` exports the matrix and
  validation API.
- `build_tenants/typescript/test_env/tests/test_t164_edge_gain_closure_contract.test.mjs`
  proves current-full matrix coverage, full `62`-vector published inventory
  classification, source/target boundary parity against materialized ABG graph
  vectors, overlay union coverage, lite residual-pressure specialization,
  diagnostic failures, and category function-pack shape.
- `build_tenants/typescript/package.json` exposes `test:t164`,
  `test:t164:edge-contract`, `test:t164:rust-service`, and the existing
  live-gated Rust service script.

Proof commands:

```text
cd /Users/jim/src/apps/odd_sdlc/build_tenants/typescript
npm run test:t164
```

Result:

```text
edge-contract proof: 7 tests, 7 pass
rust-service conformance sandbox: 1 test, 1 pass
```

Regression command:

```text
cd /Users/jim/src/apps/odd_sdlc/build_tenants/typescript
npm run test:t160
```

Result:

```text
overlay regression proof: 17 tests, 17 pass
```

Remaining non-closure conditions after this slice:

- L6-L10 are not complete. Runtime contract carriage is implemented, but L6
  still needs a focused archive/replay fixture, L7-L8 still need the installed
  close gate to use generic gain/residual/close as authority, and L10 still
  needs explicit gaps/query projection.
- L12 is complete in the later slice. L13 and L15 are no longer independent
  live proof rows; both collapse into L14.
- L14 is not complete. The current live hello-world evidence was
  harness-mediated over `first_traversal` steps and stopped at component code;
  it does not yet prove the L14 installed-trigger live gate.
- P1-P4 are not complete in this first-slice snapshot. Later proof repricing
  collapses them into one full internal `data_mapper` run.
- H4 and H6 collapse into L14 in the later proof repricing.

## Live Test Audit - 2026-05-14

Current live test inventory does not contain a full-capability odd_sdlc proof
under the T-164 standard.

Audit result:

```text
0 live tests currently prove full graph capability by installing odd_sdlc and
  invoking one installed start --target next --until converged --worker ...
  command.

8 scenario-sandbox opt-in live tests use runScenarioSandbox(...), which
  provisions/installs and then lets the harness drive one or more
  gaps -> start steps. These are useful scenario proofs, but they are not
  framework-owned full-graph iteration proofs.

4 installed-operator live tests use the installed odd-sdlc-ts command but still
  drive bounded edges manually with gaps, start --until blocked, or
  start --until first_traversal:
    test_t109_live_installed_data_mapper_pty.test.mjs
    test_t110_live_agent_pty_installed_operator.test.mjs
    test_t115_live_installed_data_mapper_repair_flow.test.mjs
    test_t131_guided_odd_chat_live_build.test.mjs

1 live data_mapper sandbox script also manually loops gaps/start:
    run_full_external_data_mapper_sandbox.mjs

2 live tests are lower-level or substrate proofs, not full odd_sdlc graph
  capability proofs:
    test_t053_live_fp_data_mapper.test.mjs
    test_t102_t109_abg37_live_semantic_ledger.test.mjs
```

Interpretation:

```text
scenario live proof != full capability proof
edge/worker live proof != full capability proof
ABG substrate converged proof != odd_sdlc full graph proof
```

The missing proof is a new live lane that installs odd_sdlc into a fresh
workspace, calls the installed command once with `start --until converged`, and
then validates that the framework-owned run traversed implementation,
test-lifecycle, archive, release-depth parity, and release readiness surfaces.

## Implementation Evidence - Runtime Kernel And Carrier Slice

Implemented on 2026-05-14:

- `build_tenants/typescript/code/src/operator/edge_gain_closure.ts` adds the
  generic SDLC edge assurance function family:
  `resolveSdlcEdgeGainClosureContract`,
  `deriveSdlcEdgeObligations`, `admitSdlcEdgeEvidence`,
  `measureSdlcEdgeGain`, `deriveSdlcEdgeResidualPressure`,
  `deriveSdlcEdgeAssuranceCloseDecision`, and `composeSdlcPathGain`.
- `build_tenants/typescript/code/src/operator/carriers.ts`,
  `handoff.ts`, `installed_operator.ts`, and `traversal_consequence.ts` now
  carry edge assurance contract refs/digests into traversal obligation context,
  traversal intent, worker handoff manifest, invocation package, worker brief,
  edge fulfillment ledger, closure decision, next-action projection, and the
  installed traversal consequence archive payloads.
- `build_tenants/typescript/code/src/start/public_start.ts` preserves replay
  closure compatibility by setting the new edge-assurance fields to `null` for
  old replay closure literals.
- `build_tenants/typescript/test_env/tests/test_t164_edge_gain_closure_contract.test.mjs`
  now proves the missing computation explicitly:
  worker percent-complete is rejected as metric authority, artifact presence
  alone is rejected as behavioral closure evidence, generic gain/close functions
  run across different edge contracts, a three-vector compound path preserves
  the unfinished edge as the bottleneck, and carrier constructors retain
  contract/gain/residual-pressure identity. The DMM/ODD review follow-up adds
  explicit `closureClassification`, `sourceAssetPolicy`, required caller
  obligation refs, `evaluate_action` trace alignment, and handoff source-set
  enforcement from the selected contract row.
- `build_tenants/typescript/test_env/tests/test_t066_product_materialization_contract.test.mjs`
  now keeps the lite product-materialization regression on the lite edge
  contract, so Product Files admission is tested without bypassing the
  T-164 source-set policy.
- `build_tenants/typescript/test_env/live/test_t164_data_mapper_full_capability_live.test.mjs`
  adds the missing full-capability data_mapper live lane. It provisions a fresh
  external data_mapper workspace, installs the current odd_sdlc TypeScript
  package into that workspace, invokes exactly one installed
  `start --workspace . --target next --until converged --worker ...` command,
  and fails unless the framework-owned traversal reaches implementation, test
  lifecycle, test archive, release-depth parity, and release-readiness edges.
- `build_tenants/typescript/package.json` exposes
  `test:t164:data-mapper-full-capability-live` as the opt-in live proof script
  for the lane above.

Proof commands:

```text
cd /Users/jim/src/apps/odd_sdlc/build_tenants/typescript
npm run test:t164
npm run build:semantic && node --test test_env/tests/test_t032_query_gap_projection.test.mjs
npm run test:t088
npm run build:semantic && node --test test_env/tests/test_t118_worker_invocation_package.test.mjs
npm run test:t160
npm run test:t064
npm run test:t066
npm run lint:semantic
node --test --test-name-pattern "hello-world live descriptors|edge assurance archive sequence" test_env/sandbox/test_scenario_sandbox.test.mjs
npm run test:t164:rust-service-live
git diff --check
```

Results:

```text
test:t164: edge-contract proof 18/18 pass; rust-service conformance sandbox 1/1 pass
test_t032_query_gap_projection: 4/4 pass
test:t088: traversal intent package 3/3 pass
test_t118_worker_invocation_package: 7/7 pass
test:t160: traversal overlays 17/17 pass
test:t064: installed operator UX 11/11 pass
test:t066: product materialization contract 67/67 pass
lint:semantic: pass
focused L14 descriptor/archive assertions: 2/2 pass
test:t164:rust-service-live: T-164 Rust hello service live build loop 1/1 pass
git diff --check: pass
```

Current ledger state after this slice:

- L3a is complete: the generic derive/admit/measure/residual/close/compose
  function family exists and has deterministic proof across multiple edge
  contracts.
- L11 is complete: compound path gain is a typed fold over edge gains and the
  deterministic test proves an intermediate residual pressure keeps the path
  open.
- The DMM/ODD review realization cleanup is complete for the currently scoped
  slice: source-set policy is declared by row data, strict/subset source
  matching is enforced in handoff construction, every row explicitly declares
  its closure classification, `SdlcEdgeGain.closeReady` is replaced with
  `obligationsAndLedgersComplete`, and synthetic obligation defaults now fail
  closed unless the caller supplies explicit obligation refs.
- L6 is complete: focused archive proof now reads the installed archive payloads
  and proves contract/gain/residual-pressure identity across edge gain,
  residual pressure, fulfillment ledger, closure decision, and next-action
  projection.
- L7 is complete: the generic measurement kernel consumes admitted evidence and
  ledger inputs, rejects worker percent-complete and artifact-presence closure,
  and hard-blocks when measuring ledgers are missing.
- L8 is complete: installed closure now derives the edge-assurance close
  decision from generic gain/residual pressure and passes that decision into the
  generic closure fold. The installed re-entry guard also stops worker-process
  failures when the dossier says retry is not eligible.
- L9 is complete as a boundary review note: this work stays inside odd_sdlc
  graph/operator/projection/test surfaces and introduces no ABG core change,
  local traversal runtime, or local event store.
- L10 is complete: query-domain and public gap/dossier projections expose
  edge-assurance contract refs, digests, proof-lane refs, residual-pressure
  refs, and missing-contract diagnostics as read-only data.
- L12 is complete: deterministic proof now covers the three-edge
  requirement-to-design chain through per-edge gain, close decision, residual
  pressure, and compound composition.
- L13 is collapsed into L14: the L14 live archive must prove the installed
  three-edge subset instead of using a separate scenario file.
- L14 is complete: the opt-in live run passed under the installed trigger and
  archived the collapsed edge-assurance chain at
  `build_tenants/typescript/test_env/test_runs/scenario_t164_rust_hello_service_lite_live/20260514T071812801Z_pid416/`.
  The closed handoff sequence is `derive_intent_surface ->
  derive_lite_design_adr_surface -> derive_lite_module_surface ->
  derive_lite_component_code_surface`; each selected archive carries handoff,
  gain, residual-pressure, fulfillment-ledger, closure-decision, and
  next-action evidence. The run materialized
  `build_tenants/hello_world_rust_service/Cargo.toml` and `src/main.rs`, and
  the harness process check proved `curl /` returns `helloworld`.
- L15 is collapsed into L14: the installed trigger is the execution mode for
  the L14 live proof, not a separate proof lane.
- P1-P4 remains open as one full internal `data_mapper` proof gate. Some
  underlying regression coverage exists, but the ticket still needs that run to
  admit the absorbed closure-semantics evidence as one combined artifact.

### P1-P4 Full `data_mapper` Attempt - 2026-05-14

Command:

```text
cd /Users/jim/src/apps/odd_sdlc/build_tenants/typescript
npm run test:t164:data-mapper-full-capability-live
```

Archive:

```text
build_tenants/typescript/test_env/test_runs/t164_data_mapper_full_capability_live/20260514T075544658Z_pid39360/
```

Result: failed. The harness used one installed command:

```text
start --workspace . --target next --until converged --worker process://claude?model=sonnet&effort=xhigh
```

The installed loop made three internal attempts and returned
`startStatus: converged`, but the observed edge sequence contained only
`Fg_conform_project_authority`. The `Fg_conform_project_authority` run produced
`fp_evaluate_result.status: admitted_with_open_obligations`,
`sdlc_edge_closure_decision.disposition: retry`, and residual pressure for
authority/requirement obligations. No downstream full-graph or test-lifecycle
edges were reached, so `missingFullGraphEdges` still contains every required
edge after `Fg_conform_project_authority`, including the full test lifecycle and
release-readiness edges. This is a valid P1-P4 non-closure result, not a harness
push loop.

### Closure Evidence - 2026-05-15

P1-P4 is complete as a full internal `data_mapper` proof gate.

Controlling preserved sandbox:

```text
build_tenants/typescript/test_env/test_runs/t164_data_mapper_full_capability_live/20260514T105715480Z_pid16615/
```

Final resume command:

```text
ODD_SDLC_TS_T164_DATA_MAPPER_FULL_CAPABILITY_RESUME_ARCHIVE_ROOT=/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/t164_data_mapper_full_capability_live/20260514T105715480Z_pid16615 npm run test:t164:data-mapper-full-capability-live:resume
```

Final result:

```text
startStatus: converged
currentEdge: null
blockingReason: null
workerTimeoutMs: 43200000
workerInactivityTimeoutMs: 1800000
edgeNames:
  Fg_conform_project_authority
  derive_feature_decomp_surface
  derive_design_surface
  derive_scenario_surface
  derive_implementation_design_surface
  select_implementation_stack_profile
  derive_implementation_module_surface
  derive_aggregate_domain_model_surface
  derive_implementation_component_topology_surface
  derive_aggregate_sunny_day_sequence_surface
  derive_component_realization_schedule_surface
  derive_component_code_surface
```

The run was used as the intended STDO bug-finding substrate. Platform defects
found and fixed while preserving the same sandbox:

- Retry prompts now include the current evaluated gap dossier, blocked
  requirements, evidence refs, and evaluator reasons instead of relying on
  stale retry prose.
- Same-session executor tool-result metadata is filtered generically from
  worker read-boundary checks; real outside-workspace reads still fail closed.
- Post-action and runtime gap registers now preserve the latest current gap
  dossier across restart/re-entry instead of reverting to stale retry refs.
- Retry gap compaction preserves distinct same-code evaluator blockers by
  detail, so four concrete lineage failures are not collapsed into one prompt
  reason.
- Diagnostic redaction no longer rewrites workspace-relative paths such as
  `cdme-executor/src/...` into `outside-workspace-path`.
- Product-lineage validation checks `unrelated` tags against the full canonical
  lineage set while keeping prompt-sized current required closure pressure,
  so valid full-run repair tags beyond the prompt slice are admitted without
  expanding every edge into a full-repo product-file obligation.
- Product-materialization prompt text now names `requirementTraceObligationIds`
  as the prompt-visible required tag set and explicitly admits current
  evaluated gap ids as retry repair tags.

Verification commands:

```text
cd /Users/jim/src/apps/odd_sdlc/build_tenants/typescript
npm run build:semantic
node --test test_env/tests/test_t120_retry_local_repair_prompt.test.mjs test_env/tests/test_t140_no_local_forced_iteration_authority.test.mjs
node --test test_env/tests/test_t066_product_materialization_contract.test.mjs test_env/tests/test_t164_edge_gain_closure_contract.test.mjs
npm run lint:semantic
git diff --check
```

Results:

```text
build:semantic: pass
T-120/T-140 focused retry tests: 23/23 pass
T-066/T-164 product-materialization and edge-closure tests: 89/89 pass
lint:semantic: pass
git diff --check: pass
full L14/P1-P4 data_mapper resume: converged
```

Release-cut evidence:

```text
cd /Users/jim/src/apps/odd_sdlc/build_tenants/typescript
npm run test:semantic
npm run lint:semantic
node build/semantic/code/src/cli/main.js rc-report
node build/semantic/code/src/cli/main.js release-cut --archive-root /Users/jim/src/apps/odd_sdlc/.ai-workspace/release-cuts/typescript/20260515T001126Z
git diff --check
```

Results:

```text
test:semantic: 567/567 pass
lint:semantic: pass
rc-report: ok
release-cut: ok
release manifest: .ai-workspace/release-cuts/typescript/20260515T001126Z/release-cut-manifest.json
release postmortem: .ai-workspace/release-cuts/typescript/20260515T001126Z/release-cut-postmortem.md
release tarball: .ai-workspace/release-cuts/typescript/20260515T001126Z/package/pack-cDSCun/odd-sdlc-typescript-tenant-0.0.0-dev.tgz
git diff --check: pass
```
