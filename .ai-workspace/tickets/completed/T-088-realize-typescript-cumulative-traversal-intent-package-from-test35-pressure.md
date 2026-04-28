---
id: T-088
title: Realize TypeScript cumulative traversal intent package from test35 pressure
type: feature
ticket_category: rc_blocker
status: completed
goal: odd-sdlc-typescript-full-operational-rc
change_intent: Strengthen TypeScript traversal intent construction so every F_P handoff receives one typed, replayable, cumulative intent package carrying source truth, graph edge intent, method authority, prior traversal history, obligation pressure, current asset state, output contract, and evaluator expectations.
change_class: requirement_reprice
re_entry_point: requirements
affected_boundary: worker handoff manifest, prompt derivation, source-input lineage, project induction output, traversal obligation context, prior-edge evidence refs, gap dossiers, repair frontier, assurance ledgers, installed data_mapper qualification lane
priority: critical
triaged_at: 2026-04-28T03:28:48Z
created_at: 2026-04-28T03:28:48Z
updated_at: 2026-04-28T00:00:00Z
completed_at: 2026-04-28T00:00:00Z
dependencies:
  - T-087 completed
  - T-076 completed
  - T-086 completed
blocks:
  - T-066 active
  - T-041 active
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: operator question on whether current TS depth and induction failures can be solved by strengthening intent construction, plus test35 evidence that cumulative context, prior manifests/results, obligation ledgers, and source snapshots created stronger realization pressure than current TS handoff manifests.
active_requirement_refs:
  - specification/requirements/06-bootstrap-assets-and-recursive-edges.md
  - specification/requirements/10-odd-sdlc-software-domain-buildout.md#REQ-F-ODDSDLC-013
  - specification/requirements/10-odd-sdlc-software-domain-buildout.md#REQ-F-ODDSDLC-014
  - specification/requirements/10-odd-sdlc-software-domain-buildout.md#REQ-F-ODDSDLC-029
  - specification/requirements/10-odd-sdlc-software-domain-buildout.md#REQ-F-ODDSDLC-031
  - specification/requirements/10-odd-sdlc-software-domain-buildout.md#REQ-F-ODDSDLC-032
  - specification/requirements/14-odd-sdlc-installed-product-contract.md#REQ-F-ODDSDLC-053
  - specification/requirements/14-odd-sdlc-installed-product-contract.md#REQ-F-ODDSDLC-055
active_design_refs:
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_WORKSPACE_INGRESS_SEAMS.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_REUSABLE_GRAPH_FUNCTION_LIBRARY.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_INSTALLED_OPERATOR_UX.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_RECURSIVE_REALIZATION_DEEPENING.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_ASSURANCE_INTEGRATION.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_DETERMINISTIC_TRAVERSAL_STATE_MACHINE.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_INTENT_PACKAGE.md
python_reference_surfaces:
  - .ai-workspace/tickets/completed/B-032-publish-deterministic-repair-frontier-for-stateful-builder-prompts.md
  - .ai-workspace/tickets/completed/B-041-fp-semantic-convergence-failures-on-realization-edges-cap-depth-at-first-dispatch.md
  - .ai-workspace/tickets/completed/T-021-publish-edge-execution-contract-for-constructive-f_p-prompt-assembly.md
  - .ai-workspace/tickets/completed/T-022-publish-gap-analysis-dossier-for-operator-review-and-prompt-consumption.md
  - /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test35/.ai-workspace/fp_manifests/
  - /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test35/.ai-workspace/fp_results/
target_truth: TypeScript constructs one cumulative traversal intent package for every prompt-bearing graph edge. The package is manifest authority, not prose. It states the user's A-to-B target, graph-function edge, source asset bindings, source snapshots or source refs, project induction lineage, method authority, current asset checkpoint, prior edge evidence, prior gap dossiers, repair frontier, traversal obligations, product materialization contract, evaluator expectations, and output/report schema. The worker prompt is a derived projection over this package.
superseded_truth: stronger prompt prose or a larger worker prompt is sufficient to restore test35-depth behavior.
closure_law: this ticket closes only when the TypeScript installed operator builds and archives a typed cumulative traversal intent package, proves prompt text is derived from that package, proves product-realization workers receive sufficient current source and prior-edge pressure to avoid blind regeneration, proves worker result reports assess the declared package obligations, and demonstrates in an installed data_mapper successor that the first downstream traversal consumes project induction lineage and cumulative obligation pressure rather than an empty or local-only handoff.
evaluation_criteria:
  - define the cumulative traversal intent package as a closed TypeScript carrier or a closed extension of `SdlcWorkerHandoffManifest`
  - include the explicit target statement: current source state, desired target asset, graph function, edge, regime, governance/method refs, and output contract
  - include source-input lineage from `T-087`, including imported document refs, digests, role classification, requirement authority extraction, and conformance gaps
  - include current asset checkpoint refs and stable digests for large current surfaces
  - include prior edge result refs, prior manifests/results, retry gap dossiers, and repair-frontier refs where present
  - include traversal obligation context and require one worker obligation assessment per declared obligation
  - include evaluator expectations for F_D, F_P, F_H, materialization, shallow realization, requirement fulfillment, ambiguity, capability, and execution evidence when applicable
  - preserve large authority surfaces by stable refs and digests, with compact summaries only for the current active delta
  - publish section or package digests so the archive proves the worker saw the intended pressure surface
  - prove a negative case where a handoff missing source lineage, prior-edge refs, or obligation context is rejected before closure
  - do not add framework-owned retry budgets, depth scores, turn counters, monotone-gain rules, or agent-judgment substitutes
  - do not make data_mapper-specific intent construction rules; data_mapper is only the independent proof workload
proof_surface:
  - TypeScript design note or update naming the cumulative traversal intent package
  - IACS/carrier note covering producer, consumer, identity, digest, persistence, and closure role
  - unit tests for package construction from induction, graph edge, obligation, and retry inputs
  - installed operator tests proving prompt derivation and archive digests
  - negative tests for missing source lineage, missing prior-gap refs, and missing obligation assessments
  - installed data_mapper successor archive showing the package on the first realization edge and on a same-edge re-entry
non_closure_conditions:
  - closure is claimed from prompt wording alone
  - closure is claimed from package fields that are not archived or replayable
  - worker prompts contain authority not present in the package
  - generated source closes while the package has empty source lineage or empty obligation pressure
  - prior edge failures are carried only as human-readable strings
  - the package duplicates ABG runtime truth instead of referencing ABG projection/event truth
---

## Direct Answer

Strengthening intent construction solves a large part of the current failure,
but not all of it by itself.

The main TypeScript failures seen in `test50` and `test51` have an intent
construction component:

- project induction did not turn imported documents into governed source truth
- early handoffs could carry little or no obligation pressure
- downstream workers could receive a local edge target without the full
  requirement/design/module/prior-edge chain
- prior failures could be visible in an archive without being strong enough as
  machine-consumable re-entry pressure

Those are intent-package failures, not only evaluator failures.

However, a stronger intent package is only one side of the total function. The
other side remains deterministic admission, typed gap reasons, assurance
folding, ABG-compatible retry events, and lawful same-edge re-entry. Stronger
intent without those checks becomes prompt tuning. Stronger checks without
intent pressure becomes premature convergence.

The required pattern is:

```text
typed cumulative traversal intent
  -> F_P worker output
  -> worker obligation assessments
  -> F_D postflight and assurance ledgers
  -> close | retry_same_edge | blocked | reprice_required
```

## Consolidation

This ticket consolidates the intent-construction slice across existing work.

`T-087` owns the first input source:

- `{ loose documents } -> Fg_ingress_project -> Fg_conform_project`
- project conformance topology
- source-input lineage
- imported requirement authority
- induction gaps

`T-066` owns the downstream realization consumer:

- product materialization
- worker report admission
- assurance ledgers
- generated source/test inventories
- execution evidence

`T-086` now owns the typed failure vocabulary needed when package pressure
becomes gap/retry/reprice truth:

- no string-only blocking reasons at the semantic center
- no substring classification for gap dossiers

The Python-era completed tickets are precedent, not architecture authority.
They identify the useful gold to translate:

- `B-032`: repair frontier as bounded iterative pressure
- `B-041`: prior manifest/result continuity and deepening-eligible realization
  failures
- `T-021`: prompt structure/provenance
- `T-022`: gap dossier as one reviewable pressure surface

## Design Module Method Guard

The package must be Prime.

Do not create separate ad hoc context builders for bootstrap, code, tests,
release, and data_mapper. Define one carrier family with local variations by
typed fields:

- graph edge identity
- source truth
- target truth
- authority truth
- prior traversal truth
- obligation truth
- output contract
- evaluator contract
- archive/provenance truth

The package is a domain carrier inside `odd_sdlc`. ABG remains the owner of
runtime events, projection, replay basis, and continuation mechanics.

## 2026-04-28 Implementation

Implemented the first typed package slice:

- added `SdlcTraversalIntentPackage`
- embedded it in `SdlcWorkerHandoffManifest`
- archived it as `traversal_intent_package.json`
- added package digest proof over the typed package basis
- made worker prompt text explicitly subordinate to manifest package truth
- carried graph function, edge, vector, source asset types, target asset type,
  method refs, authority refs, runtime refs, prior edge refs, retry refs,
  obligation ids, obligation delta summary, materialization contract, result
  schema, evaluator expectations, output file, and report file
- induction now writes imported requirement markers into
  `specification/requirements/00-imported-sources.md`, so realization handoff
  obligations can carry imported requirement pressure after T-087

Verification:

- `npm run test:t088` passed
- `npm run test:t087` passed
- `npm run test:t066` passed
- `npm run test:t076` passed
- `npm run test:semantic` passed, 121 tests

Additional closure proof:

- `assertTraversalIntentPackagePressure` rejects missing induction lineage,
  missing obligation pressure, package identity drift, package digest drift, and
  missing prior-gap refs before worker files are written.
- `T-076` now proves same-edge re-entry handoff carries prior gap dossier refs
  and prior-gap obligations inside `traversalIntentPackage`.
- `T-066` installed data_mapper successor continues to materialize source and
  behavioral test inventory with the package guard active.
- `T-086` completed closed typed blocking-reason carriers, so retry pressure is
  no longer string-only at the semantic center.

Remaining RC closure belongs to `T-066` and `T-041`.
