# T-180 Migrate SDLC To ABG 3.8.0-rc.5 Compute-Stage Boundary

- id: T-180
- title: Migrate SDLC to ABG 3.8.0-rc.5 compute-stage boundary
- type: downstream_alignment
- ticket_category: specification_compliance
- status: active
- proof_status: planned
- build_tenant: typescript
- goal: migrate ODD SDLC runtime, installed product, evaluator, consequence, analyzer, and proof surfaces to ABIogenesis `3.8.0-rc.5` without preserving a second SDLC-owned execution authority
- change_class: requirement_reprice
- re_entry_point: runtime_governance
- first_missing_layer: SDLC runtime realization over ABG RC5 compute-stage categories
- created_at: 2026-05-23
- updated_at: 2026-05-23
- governance_scope: STDO Method / SPEC_METHOD / ODD Method / Design Module Method / TypeScript tenant
- upstream_authority:
  - `/Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/3.8.0-rc.5/`
  - `/Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-144-align-abg-gtl-event-sourced-monad-and-sdlc-plugin-boundaries.md`
  - `/Users/jim/src/apps/abiogenesis/specification/requirements/gtl/REQ-L-GTL3-COMPUTE-NOTATION.md`
  - `/Users/jim/src/apps/abiogenesis/specification/requirements/abg/REQ-R-ABG3-FN-COMPOSITION.md`
  - `/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/design/M03_ABG_PROBABILISTIC_MONAD_PLUGIN_BOUNDARY_DERIVATION.md`
- downstream_authority:
  - `specification/GOALS.md`
  - `specification/PRODUCT.md`
  - `specification/requirements/03-runtime-governance.md`
  - `specification/requirements/18-typed-construction-algebra.md`
  - `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_EDGE_GAIN_CLOSURE_CONTRACT.md`
- depends_on:
  - T-174
  - T-175
  - T-179

## STDO Intake

Smallest lawful re-entry point: `requirement_reprice`.

Reason: SDLC currently states the ABG/GTL compute epistemology in product and
requirement surfaces, but the runtime still depends on an ABG `3.8.0-rc.3`
installed package and bundles transform, evaluation, consequence derivation,
ledger writing, closure, and traversal continuation inside SDLC-local adapter
paths. The defect is not a small realization cleanup. It changes the required
runtime boundary and therefore enters through runtime-governance requirements,
then design, then code.

No code path may be patched as a compatibility bridge that keeps the old local
execution authority alive. Temporary readers may exist only to admit or migrate
old artifacts; they must be deletion-scheduled and must not become public
imports, carriers, closure paths, or replay truth.

## Target Truth

SDLC is a downstream ODD product over ABIogenesis. SDLC owns product semantics:
software-domain graph meaning, pressure maps, gain interpretation, proof
interpretation, read-model overlays, target carrier meaning, analyzer views,
and product plugin code. SDLC does not own ABG side effects.

The SDLC execution boundary shall align to this ABG event-sourced bind chain:

```text
ABG.start(fn<A, B>.C)
  .bind(system.openGraphCall)
  .bind(system.openFrame)
  .bind(plugin.transform.C)
  .bind(system.admitTransform)
  .bind(system.writeTransformEventsAndLedgers)
  .bind(plugin.evaluate.C)
  .bind(system.admitEvaluation)
  .bind(system.writeEvaluationLedgers)
  .bind(system.assuranceFold)
  .bind(plugin.consequence.C)
  .bind(system.admitConsequenceProjection)
  .bind(system.traversalTransition)
  .bind(system.replayContinuation)
```

`C`, `transform.C`, `evaluate.C`, and `consequence.C` are notation over selected
`abg.fn_composition` and ABG-admitted runtime truth. They are not a product-local
compute carrier, ledger writer, controller, traversal selector, replay engine,
or closure path.

`F_H` is external to the system. SDLC may surface a human callout through a
future human-facing system, but ABG must admit the callout boundary and response
carrier before a human result affects runtime truth.

## One Surface Truth

There shall be one truth surface for each boundary:

- ABG release truth: the TypeScript package dependency, lockfile, substrate
  contract, installer adapter, release tests, and installed package evidence all
  name ABIogenesis `3.8.0-rc.5`.
- selected composition truth: selected `abg.fn_composition` identity is consumed
  from ABG selected composition fields on `EnginePluginInput` and related RC5
  carriers. SDLC shall not synthesize selected composition identity from archive
  paths, graph-function names, edge names, or local context refs.
- transform truth: `plugin.transform.C` returns candidate/product/evidence refs.
  It does not evaluate, write ledgers, emit runtime events, close, select
  traversal, or replay continuation.
- evaluation truth: `plugin.evaluate.C` returns evaluation findings, metrics,
  residual pressure, diagnostics, evidence refs, authority refs, continuation
  refs, proposed dispositions, selected composition refs, and selected regime
  binding refs. It does not write ledgers, emit runtime events, close, select
  traversal, or replay continuation.
- consequence truth: `plugin.consequence.C` returns product read-model /
  consequence projection refs over ABG-admitted facts. It may be `F_D` because it
  is a deterministic projection over admitted runtime truth.
- side-effect truth: only ABG emits runtime events, admits transform/evaluation
  payloads, derives ledgers, folds assurance, derives traversal transition,
  closes, continues, corrects, and replays.
- analyzer truth: analyzer/loaders admit and render the same selected
  composition, stage, ledger, assurance, consequence, and traversal refs; raw
  artifact inspection must not be the only proof surface.

## Design Module Method

Design module: `ODD_SDLC_TYPESCRIPT_ABG_RC5_COMPUTE_STAGE_BOUNDARY`.

The design module must be materialized before implementation closure as:

- design surface: `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_ABG_RC5_COMPUTE_STAGE_BOUNDARY.md`
- IACS: listed in that design and mirrored here only as ticket checklist
- structural carrier diagram: selected composition, transform payload,
  transform admission, evaluation findings, evaluation admission, assurance
  fold, consequence projection, traversal transition, replay continuation
- implementation plan: file/module ownership, deletion-scheduled migration
  readers, tests, and live proof
- design review: explicit confirmation that no hidden surface preserves the old
  bundled `fpDispatch` authority

### IACS

1. `AbgRc5SubstratePin`
   - source: `build_tenants/typescript/package.json`, lockfile,
     `runtime/abiogenesis_substrate.ts`, install release adapter, T-059 tests
   - authority: released ABG `3.8.0-rc.5`
   - defect if: any installed or source path still claims `3.8.0-rc.3`

2. `SdlcSelectedCompositionConsumption`
   - source: ABG RC5 selected composition fields and compute-stage binding on
     plugin invocation
   - authority: selected `abg.fn_composition`
   - defect if: SDLC calls a helper that invents `compositionRef`,
     `compositionDigest`, or `compositionSelectionRef`

3. `SdlcTransformPluginAdapter`
   - source: current worker invocation machinery and product materialization
     target contracts
   - output: candidate/product/evidence refs and transform result refs
   - non-authority: no evaluation, ledger writing, closure, traversal, replay

4. `SdlcEvaluatePluginAdapter`
   - source: ABG-admitted transform refs plus current deterministic evidence
     registers
   - output: `GtlEvaluationFindingRef[]`, `GtlEvaluation`, residual pressure
     refs, metrics, authority refs, continuation refs, proposed disposition,
     selected composition identity, and selected regime binding refs
   - compute role: `evaluate.C`
   - compute means: `F_P` for the general ambiguous SDLC case
   - optimization: `F_D` evaluation may be retained only as an explicit
     disambiguated optimization and only when it is not the final ambiguous
     SDLC evaluation truth

5. `SdlcConsequenceProjectionPluginAdapter`
   - source: ABG-admitted transform/evaluation facts, ABG evaluation ledgers,
     assurance fold result, traversal transition refs, and SDLC read-model
     policy
   - output: product read-model/consequence projection refs
   - compute means: `F_D` unless a future product policy proves ambiguity at
     this projection boundary

6. `SdlcAnalyzerStageTruth`
   - source: admitted ABG/runtime artifacts and SDLC product projections
   - output: analyzer markdown/json showing selected composition, transform,
     evaluation, ledgers, assurance fold, consequence, traversal transition,
     replay continuation, parallel branch refs, fan-in rows, worker refs, and
     conflict sets

7. `HelloWorldRc5ProofHarness`
   - source: deterministic semantic tests followed by the live hello-world run
   - output: proof that the installed hello-world lane follows the RC5 staged
     boundary, not a bundled legacy adapter path

## F_P Evaluation Disambiguation

Current SDLC "evaluate" paths include deterministic postflight checks,
target-carrier admission, report parsing, edge-gain measurement, residual
pressure derivation, closure decision derivation, next-action projection, and
archive writers. Under this ticket those paths must be split:

- retained F_D evidence registers:
  - worker process result and liveness observations
  - worker result report shape/admission
  - product materialization manifest and file/materialization refs
  - deterministic postflight summaries
  - target-carrier contract admission summaries
  - edge-gain input rows and target binding evidence
  - feature/test dependency maps and T-174 frontier graph truth
- final general SDLC evaluation:
  - `plugin.evaluate.C` is F_P-formed for the ambiguous SDLC case
  - it consumes the admitted transform refs and the retained F_D evidence
    registers as evidence, not as closure authority
  - it emits evaluation findings and proposed dispositions for ABG admission
  - ABG writes evaluation ledgers and performs assurance fold after admission
- optimized deterministic evaluation:
  - allowed only when the graph function/edge declares a disambiguated F_D
    evaluation contract
  - must still pass through the ABG `evaluate.C` category and ABG admission
  - must not bypass the same analyzer/proof surface

If the full evidence bundle is too heavy for F_P evaluation, reduce the F_P input
to a minimal `SdlcEvaluationContext`:

1. selected composition ref/digest/selection ref and selected regime binding ref
2. transform request/result refs and worker result report ref
3. materialized file refs and product materialization manifest ref
4. deterministic postflight status, blocking reason carrier refs, and evidence refs
5. target-carrier admission status/ref and edge assurance contract ref/digest
6. T-174 dependency/frontier refs when the edge is parallel-frontier eligible
7. ABG runtime projection refs needed for causality and replay

The minimal context is an input projection, not a new source of truth.

## Current Code Paths To Refactor

- `build_tenants/typescript/package.json`
  - update `@abiogenesis/typescript-tenant` from `3.8.0-rc.3` to `3.8.0-rc.5`
- `build_tenants/typescript/package-lock.json`
  - regenerate the RC5 dependency pin
- `build_tenants/typescript/code/src/runtime/abiogenesis_substrate.ts`
  - update package version, source assumptions, and exposed substrate contract
- `build_tenants/typescript/test_env/tests/test_t059_install_release_adapter.test.mjs`
  - update ABG release version/source ref/source commit/tarball digest/snapshot
    assertions
- `build_tenants/typescript/code/src/operator/installed_operator.ts`
  - replace `plugins: { fpDispatch }` as the only live plugin surface with RC5
    compute-stage plugin wiring
  - split transform, evaluate, consequence, ABG admission, ledger writing,
    assurance fold, traversal transition, and replay continuation into the RC5
    ownership model
  - remove local post-ABG traversal consequence writing as execution authority
- `build_tenants/typescript/code/src/operator/handoff.ts`
  - keep worker prompt as `transform.C`
  - move `constructFpEvaluateResult` / `writeFpEvaluateResult` behind the RC5
    `evaluate.C` plugin boundary or delete if replaced
  - ensure prompt/response hygiene proves transform cannot see evaluation or
    ledger writer obligations
- `build_tenants/typescript/code/src/operator/composition_identity.ts`
  - delete or demote to migration-only reader after all live carriers consume
    ABG selected composition identity
- `build_tenants/typescript/code/src/start/public_start.ts`
  - stop synthesizing composition identity for initial selection; consume or
    carry ABG selection refs
- `build_tenants/typescript/code/src/operator/traversal_consequence.ts`
  - keep SDLC consequence as product read-model projection only
  - remove any independent closure/traversal authority
- `build_tenants/typescript/code/src/analysis/*`
  - admit and render RC5 stage truth; fail closed when required stage fields are
    missing or locally synthesized
- `build_tenants/typescript/test_env/sandbox/scenario_sandbox.mjs`
  - add staged-boundary assertions before accepting hello-world live closure
- `build_tenants/typescript/test_env/tests/test_t179_epistemology_compliance.test.mjs`
  - strengthen from notation/string checks to RC5 carrier and payload checks
- `build_tenants/typescript/test_env/tests/test_t174_feature_dependency_dag_frontier.test.mjs`
  - ensure T-174 frontier graph truth feeds ABG stage inputs and analyzer proof

## Implementation Plan

1. Requirements and product law
   - update `specification/PRODUCT.md`, `specification/GOALS.md`,
     `specification/requirements/03-runtime-governance.md`, and
     `specification/requirements/18-typed-construction-algebra.md`
   - state RC5 selected composition and compute-stage category boundaries in
     present tense
   - remove legacy wording that lets SDLC "evaluate" imply local closure truth

2. Design module
   - create the RC5 compute-stage design surface
   - record IACS, structural carrier diagram, one-truth rules, and migration
     deletion schedule
   - include the F_P evaluation disambiguation and minimal evaluation context

3. Release pin
   - move the TypeScript tenant to ABG `3.8.0-rc.5`
   - update install/release snapshot adapter evidence
   - prove install still carries the ABG package dependency and installed
     package evidence

4. Runtime split
   - wire RC5 plugin stages from installed operator
   - make transform produce candidate/evidence refs only
   - make evaluate produce findings/proposed disposition only
   - make consequence produce read-model/consequence projection refs only
   - ensure ABG owns admission, events, ledgers, assurance fold, traversal,
     continuation, correction, and replay

5. Selected composition cleanup
   - replace local composition synthesis with ABG-selected identity consumption
   - fail closed when selected composition identity is absent, stale, mismatched,
     or locally synthesized on live runtime surfaces

6. F_D register preservation
   - retain current deterministic checks as evidence registers/processes
   - ensure they feed `plugin.evaluate.C` and do not directly close or traverse
   - reduce to minimal evaluation context only if full evidence payload creates
     prompt or latency risk

7. Analyzer and installed guidance
   - update carrier loaders and markdown rendering so RC5 stage truth is visible
   - update cold-agent installed instructions so workers understand
     transform/evaluate/consequence boundaries

8. Tests
   - add deterministic carrier tests for selected composition consumption
   - add negative tests for local composition synthesis and missing RC5 stage refs
   - add prompt/response hygiene tests for transform/evaluate/consequence
   - add analyzer admission tests for RC5 stage truth
   - add synthetic multilane hello-world test that lints the full prompt and
     response payloads

9. Proof sequence
   - run `npm run build:semantic`
   - run `npm run lint:semantic`
   - run focused RC5/T-180 semantic tests
   - run `npm run test:t174` if touched frontier/parallellane surfaces changed
   - only after semantic tests pass, run the live hello-world proof

## Closure Checklist

- [ ] ABG TypeScript package pin is `3.8.0-rc.5` in package, lockfile,
      substrate contract, release adapter tests, and installed package evidence.
- [ ] Design module exists and passes design-method review.
- [ ] Runtime calls RC5 compute-stage plugins rather than a single bundled
      `fpDispatch` adapter path.
- [ ] `plugin.transform.C` cannot evaluate, write ledgers, close, select
      traversal, or replay.
- [ ] `plugin.evaluate.C` is F_P-formed for the general SDLC ambiguity case and
      produces findings/proposed dispositions only.
- [ ] Current F_D postflight/register processes are preserved as evidence inputs,
      not final closure authority.
- [ ] `plugin.consequence.C` is a deterministic product read-model projection
      over ABG-admitted facts.
- [ ] ABG owns transform admission, transform ledgers, evaluation admission,
      evaluation ledgers, assurance fold, traversal transition, replay
      continuation, correction, and closure.
- [ ] SDLC no longer synthesizes selected `abg.fn_composition` identity on live
      runtime surfaces.
- [ ] Analyzer admission fails closed on missing RC5 selected composition,
      stage, ledger, assurance, consequence, traversal, or replay refs.
- [ ] Installed cold-agent guidance names the three plugin stages and ABG system
      side-effect boundary.
- [ ] T-174 frontier truth feeds ABG stage input and analyzer proof for
      parallel hello-world.
- [ ] Deterministic semantic tests pass.
- [ ] Live hello-world proof passes after semantic tests.

## Proof Commands

Run in `build_tenants/typescript` after implementation:

```bash
npm run build:semantic
npm run lint:semantic
npm run test:t179
npm run test:t174
npm run test:scenario:t132-hello-world-js-live
```

If the implementation changes the intended closure proof to the four-lane
parallel hello-world lane, run this after the same semantic tests:

```bash
npm run test:scenario:t174-four-lane-hello-world-js-live
```

## Closure Law

T-180 closes only when SDLC has one execution authority: ABG. SDLC plugins
compute product values or product read-model refs. ABG admits those values,
writes runtime events and ledgers, folds assurance, selects traversal, continues,
corrects, closes, and replays. Passing hello-world output is not sufficient; the
proof must show the RC5 bind chain and fail closed if the old bundled SDLC
adapter path is restored.
