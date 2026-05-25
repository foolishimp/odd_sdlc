# T-181 Pilot F_P Evaluator Populated Design-Depth Registers

- id: T-181
- title: Pilot F_P evaluator populated design-depth registers
- type: realization_refactor
- ticket_category: implementation_migration
- status: completed
- proof_status: superseded_by_T-183_not_independently_closed
- build_tenant: typescript
- goal: replace the implementation-design register population path with a tightly-scoped `evaluate.C/F_P` prompt while retaining deterministic admission, validation, ledgering, and closure guards
- change_intent: migrate implementation-design depth register source truth from deterministic ADR-derived synthesis to an evaluator-produced `evaluate.C/F_P` sidecar; F_P evaluator register truth is mandatory for default live execution
- change_class: design_reframe
- re_entry_point: runtime_governance
- first_missing_layer: SDLC evaluator plugin realization over ABG 3.9 RC3 evaluation-set stage
- triaged_at: 2026-05-24
- created_at: 2026-05-23
- updated_at: 2026-05-25
- migration_strategy: authoritative_evaluator_sidecar_no_legacy_bridge
- library_usage: consume
- governing_library: ABIogenesis 3.9 RC3 `evaluate.C` evaluation-set stage and GTL compute-notation carriers
- target_truth: admitted `design_depth_fp_evaluator_register.json` sidecar for implementation-design depth registers in default execution
- superseded_truth: deterministic ADR-to-register synthesis for implementation-design depth rows; removed from runtime/analyzer authority
- closure_law: closure requires the evaluator sidecar to be selected by explicit ABG predecessor truth, admitted by the shared design-depth register admission helper, propagated into evaluation evidence, and visible through analyzer admission without alternate live truth paths
- evaluation_criteria: deterministic semantic tests, focused T-181 tests, analyzer admission parity, strict malformed-sidecar rejection, evidence propagation, and at least one live sandbox proof before release closure
- non_closure_conditions: missing STDO fields, undocumented fallback authority, latest-mtime sidecar selection, Markdown sidecar admission, shallow sidecar acceptance, analyzer/runtime admission drift, missing IACS carrier treatment, or source-specific SDLC runtime code
- proof_surface: T-181 ticket, RC3 compute-stage design module, operator-run sidecar artifacts, `fp_evaluate_result.json`, postflight evidence, analyzer carrier loader output, focused T-181 tests, semantic test suite, and live sandbox archive
- depends_on:
  - T-180
- superseded_by:
  - T-183

## Closure Disposition

T-181 is closed as superseded and absorbed by T-183, not as independently
implemented or release-proven.

T-181 correctly established that implementation-design depth must come from
selected `evaluate.C/F_P` rather than deterministic ADR-derived synthesis. The
subsequent live-run review showed the same issue is broader than the
implementation-design sidecar: deterministic code still preserves or invents
semantic register meaning across design-depth, component-depth, test schedule,
repair schedule, review-grade, stale carrier, and requirement-pressure
surfaces.

T-183 is now the controlling execution contract. It keeps the T-181 insight but
widens the work to a deletion-first cleanup:

- F_P evaluator rules produce semantic row or ledger candidates.
- ABG/system F_D admits and writes ledgers.
- F_D does not invent semantic rows.
- One selected `evaluate.C/F_P` stage can fan out into multiple typed evaluator
  rules, all admitted through the same ABG/F_D ledger writer path.

Do not treat this completed ticket as proof that T-181's live closure criteria
were independently satisfied. Closure proof moves to T-183.

## Intake

The ABG 3.9 RC3 boundary exposes runner-consumed `evaluate.C` stage rules and a
scalar `fpEvaluator`. SDLC default live execution now treats
`evaluate.C/F_P` over the workspace as the source of semantic design-depth
register truth. Deterministic code admits, validates, ledgers, and blocks; it
does not synthesize implementation-design topology from ADR markdown.

This ticket pilots the intended split:

```text
transform.C/F_P -> ADR candidate
evaluate.C/F_P -> design-depth register candidate
ABG/system admission -> evaluation ledgers
F_D -> parse/admit/validate the evaluator-produced register
consequence.C/F_D -> deterministic projection over admitted state
```

## Execution Contract Admission

This ticket is an `implementation_migration` contract because it changes the
implementation-design register source of truth. The migration is admissible only
when the source, bridge, consumers, projections, and negative proof are explicit.

- `target_truth`: for the pilot path, the implementation-design depth register
  is the admitted `design_depth_fp_evaluator_register.json` sidecar produced by
  `evaluate.C/F_P` and admitted through `admitDesignDepthRegisterFromArtifact`
  with `requireSourceFileTargets=true`.
- `superseded_truth`: deterministic ADR-derived register synthesis is removed
  from implementation-design runtime and analyzer authority. Markdown ADR
  tables are transform output only until the selected evaluator produces the
  sidecar.
- `closure_law`: no implementation-design edge may close through the pilot path
  unless the sidecar is selected from explicit ABG predecessor/archive truth,
  admitted by the shared runtime/analyzer loader, propagated into postflight and
  F_P evaluation authority refs, and consumed by consequence projection through
  admitted ABG state.
- `evaluation_criteria`: closure proof must cover mandatory sidecar use, strict
  JSON admission, source-file target completeness, placeholder-boundary
  rejection, explicit predecessor lookup, analyzer admission parity, F_P
  evaluation evidence propagation, evaluator-rule registration, absence of
  feature flags/legacy derivation hooks, and live sandbox execution without an
  evaluator-register feature flag.
- `non_closure_conditions`: the ticket is not closeable if runtime or analyzer
  can admit Markdown sidecars, infer the latest sidecar by mtime, accept shallow
  evaluator rows, hide source-specific behavior in generic SDLC runtime code,
  close without sidecar evidence in F_P findings, or leave the promoted carrier
  undocumented in the RC3 design/IACS surface.
- `proof_surface`: the proof surface is the ticket, the RC3 compute-stage design
  module, the evaluator sidecar artifacts, `fp_evaluate_result.json`, postflight
  evidence, analyzer carrier loader output, deterministic T-181 tests, semantic
  test suite, and a live sandbox archive.

## Implementation Migration Contract

- `old_truth_path`: transform produces the ADR; deterministic code parses the
  ADR/table content into design-depth rows; runtime postflight and analyzer
  projections consume the derived rows. This path is removed as an authority
  path for implementation-design registers.
- `new_truth_path`: transform produces the ADR; `evaluate.C/F_P` reads the ADR,
  construction brief, invocation package, and manifest; the evaluator writes the
  JSON register sidecar; ABG/system admission validates the sidecar and writes
  evaluation evidence; consequence.C consumes admitted state.
- `producers`: implementation-design transform worker, SDLC evaluate.C/F_P
  design-depth register rule, deterministic register admission helper, ABG
  evaluation-set runner.
- `consumers`: F_P semantic evaluator, implementation-design postflight,
  handoff dispatch state, target-carrier evidence, analyzer carrier loaders,
  runtime gap/report projections, and consequence.C/F_D projection.
- `projection_surfaces`: operator-run artifact catalog, admitted design-depth
  register carrier, postflight evidence, `fp_evaluate_result.json`, evaluation
  finding authority refs, analyzer artifact state, and staged audit carriers.
- `bridge_policy`: no live bridge. Existing deterministic fixture coverage was
  repriced to either use admitted F_P sidecars or assert that old markdown
  derivation artifacts are not produced.
- `negative_proof`: malformed JSON sidecars, Markdown sidecars, shallow register
  rows, missing source file targets, placeholder public boundaries, missing
  predecessor archive refs, and analyzer/runtime admission drift must fail
  closed.

## Design Module Reconciliation

The RC3 compute-stage design module must carry the promoted
`SdlcDesignDepthRegister` evaluator-rule boundary as an IACS/structural carrier.
The carrier is not a product design surface and not a runtime ledger writer. It
is a product-owned register candidate produced by SDLC evaluate.C/F_P and
admitted by ABG/system code before any ledger, postflight, analyzer, or
consequence projection can treat it as truth.

## Target Truth

- The implementation-design worker writes the ADR as transform output.
- The design-depth register is populated by an evaluator prompt in
  `evaluate.C/F_P`, not by the transform worker and not by deterministic ADR
  table synthesis.
- Depth is the first-class probabilistic review surface for this pilot. If only
  one product concern receives F_P review, it is depth: decomposition
  proportionality, component pressure density, source/test ownership, public
  boundary specificity, residual pressure visibility, and whether valid-looking
  artifacts are substantively thin.
- Selected `evaluate.C/F_P` over the workspace is the highest
  semantic/product judgment truth for the pilot register content. F_D
  admission does not replace that judgment; it proves shape, identity,
  completeness, selected-evaluation provenance, and fail-closed consistency.
- A consumed evaluator sidecar must be visibly and uniquely linked to the
  selected F_P evaluation outcome. Filesystem presence, archive path matching,
  or latest-mtime lookup is never sufficient authority.
- Deterministic code remains the closed admission guard for register shape,
  target identity, target paths, dependency-map derivation, and closure.
- The evaluator prompt writes a separate register sidecar under the operator
  run archive. It does not modify product/design surfaces.
- The evaluator register sidecar must be referenced by evaluation rule outcome,
  F_P evaluation findings, postflight evidence, target-carrier evidence, and
  staged audit carriers.
- Implementation-design edges cannot close by feature flag disablement, current
  archive sidecar aliases on consumer edges, Markdown parser fallback, latest
  sidecar mtime lookup, or filesystem presence without F_P evaluation evidence.

## Implementation Plan

1. Add a design-depth evaluator sidecar path and admission helper that requires
   the evaluator sidecar for implementation-design authority.
2. Add an ABG evaluation rule plugin for `implementation_design_surface` with
   `computeMeans=F_P`, `ruleRole=semantic_judgment`, and output carrier
   `SdlcDesignDepthRegister`.
3. Materialize a tight evaluator prompt under the operator archive. The prompt
   reads the ADR, construction brief, invocation package, and manifest, then
   writes pure JSON to the evaluator register sidecar.
4. In `fpEvaluator`, run the design-depth evaluator rule before final semantic
   judgment, recompute postflight from the evaluator-produced register, and
   update dispatch state only through admitted results.
5. Keep F_D register admission as a hard guard. Bad evaluator JSON blocks with
   evidence instead of being normalized into closure.
6. Add deterministic tests proving:
   - the F_P evaluator prompt exists and targets a sidecar, not the ADR
   - sidecar admission is required and F_D markdown derivation is absent
   - current prompt no longer says deterministic framework derivation is the
     primary population path
   - ABG plugin set includes the evaluation rule and required rule ref
7. Run focused semantic tests, then run the hello-world live sandbox after the
   deterministic proof passes.

## One-Truth Enforcement Checklist

These items close the review finding that filesystem sidecar presence could
still satisfy authority without proving selected `evaluate.C/F_P` provenance.

- [x] Split raw sidecar candidate validation from admitted register
  consumption. `admitImplementationDesignRegisterCandidateForManifest()` is
  only for the evaluator rule before an F_P outcome exists.
- [x] Remove the public `requireFpEvaluatorAdmissionEvidence=false` bypass from
  `admitImplementationDesignRegisterForManifest()`. Public/default admission
  now requires selected `fp_evaluate_result.json` proof.
- [x] Replace string-presence evidence with structured F_P proof:
  `fp_evaluate_result.json` must be `stage="F_P.evaluate"`,
  `computeNotationStage="evaluate.C"`,
  `stageAuthority="typed_fp_stage_carriers"`, `postflightStatus="passed"`,
  non-blocked, composition-consistent, and must contain a matching finding whose
  authority/evidence refs include the sidecar.
- [x] Add a runtime-only selected evaluation-rule proof artifact,
  `design_depth_fp_evaluator_rule_outcome.json`, so postflight can admit the
  evaluator sidecar between ABG evaluation-rule execution and final
  `fp_evaluate_result.json` publication without accepting arbitrary explicit
  refs.
- [x] Align analyzer admission with runtime admission through
  `admitDesignDepthFpEvaluatorRegisterArtifact()` instead of a parallel
  `fp_evaluate_result.json` string scan.
- [x] Tighten evaluator sidecar parsing: source-file authoritative sidecars
  must be whole-file JSON with top-level
  `kind="sdlc_design_depth_register"`. Alias wrappers, payload wrappers, and
  Markdown fenced JSON cannot satisfy the evaluator sidecar surface.
- [x] Extend T-181 tests so weak explicit refs no longer prove admission; tests
  use the evaluation-rule proof artifact for runtime admission and full
  `fp_evaluate_result.json` findings for public/predecessor admission.
- [x] Remove stale graph proof lists from live closure checks. T-164 now derives
  the required full graph directly from
  `OPTIMIZED_FULL_TRAVERSAL_EXECUTIVE_STEPS`, T-109 rejects required live edges
  that are absent from the same catalog, and T-030 prevents retired split-edge
  graph names from re-entering the optimized release executive.

## Target Refactor Goal: `.C` Plugin Structure

The durable realization target is not another prompt patch inside
`handoff.ts`. The SDLC operator must be structured around the ABG/GTL
`.C` plugin boundary:

```text
code/src/operator/
  installed_operator.ts              # thin ABG runner bootstrap only
  plugins/
    index.ts                         # createSdlcAbgPluginSet()

    shared/
      compute_context.ts             # ABG input -> SDLC compute context
      selected_composition.ts        # selected abg.fn_composition identity
      stage_refs.ts                  # archive refs, evidence refs, source refs
      worker_transport.ts            # process/codex/worker invocation wrapper

    transform/
      index.ts                       # transform.C plugin export
      adapter.ts                     # ABG fpDispatch/fd transform adapter
      prompt.ts                      # transform prompt construction
      worker_report.ts               # transform result extraction
      admission_candidate.ts         # candidate transform result only
      rules/
        fp_workspace_transform.ts
        fd_static_transform.ts

    evaluate/
      index.ts                       # evaluate.C plugin export
      adapter.ts                     # ABG fpEvaluator + evaluationRules adapter
      context.ts                     # read-only workspace/ledger/evidence view
      prompt.ts                      # generic eval.F_P prompt construction
      findings.ts                    # SdlcFpEvaluateResult / GTL finding refs
      admission_candidate.ts         # candidate eval result only
      rules/
        fd/
          filesystem_integrity.ts    # path/existence/digest/shape only
          carrier_shape.ts
          execution_evidence_shape.ts
          materialized_file_facts.ts
        fp/
          workspace_semantic_eval.ts # generic eval.F_P over workspace + ledgers
          design_depth_register.ts   # current design-depth register rule
          product_pressure_map.ts    # product/materialization semantic pressure

    consequence/
      index.ts                       # consequence.C plugin export
      adapter.ts                     # ABG consequenceProjection adapter
      projection.ts                  # consequence projection carrier
      rules/
        fd_closure_projection.ts
        retry_projection.ts
        traversal_projection.ts

  system_projection/
    transform_events.ts              # ABG-owned event payload builders
    evaluation_ledgers.ts            # ledger payload builders, no authority
    assurance_inputs.ts              # fold input builders
    replay_refs.ts                   # continuation/replay refs

  handoff/
    manifest.ts                      # derive handoff manifest
    invocation_package.ts            # worker package only
    construction_brief.ts            # prompt carrier only
    prompt_frame.ts                  # common prompt envelope
    archive_refs.ts                  # file/ref utilities

  pressure/
    authority_index.ts               # read-only authority facts
    design_depth_pressure.ts
    materialization_pressure.ts
    requirement_pressure.ts
    target_carrier_pressure.ts

  admission/
    transform_admission.ts           # F_D shape/identity guard
    evaluation_admission.ts          # F_D shape/identity guard
    consequence_admission.ts         # F_D shape/identity guard
```

The refactor law is:

- `installed_operator.ts` calls one exported `createSdlcAbgPluginSet()` and
  remains a runner bootstrap, not a hidden SDLC evaluation host.
- `handoff.ts` is split into `handoff/*` and loses semantic evaluation
  authority. It may construct manifests, prompt frames, worker invocation
  packages, construction briefs, and archive refs only.
- `evaluate.C` is the single SDLC evaluation surface. No runner path may call a
  local postflight helper that can independently decide semantic closure.
- `evaluate/rules/fd/*` may report malformed facts only: unsafe paths, missing
  files, parse failures, digest mismatch, schema mismatch, invalid carrier
  shape, or execution-evidence shape errors.
- `evaluate/rules/fp/*` owns semantic judgment over workspace plus admitted
  transform evidence, ledgers, target-carrier pressure, materialization
  pressure, design-depth pressure, and requirement pressure.
- Tenant-stack authority, product topology, design-depth pressure, and
  materialization sufficiency are evaluation inputs. They are not hidden
  deterministic stop reasons unless the artifact is malformed, unsafe, or
  identity-inconsistent.
- F_D admission remains the side-effect and shape guard. It admits or rejects
  candidates; it does not replace `evaluate.C/F_P` semantic judgment.

This section is the target design for removing the current `handoff.ts` drift.
The immediate bug class in the JS hello-world live run came from the old split:
the transform prompt required `spec/TECH_STACK.json` as tenant-stack authority,
but deterministic postflight then rejected the same support file as
`materialized_product_file_unbound_to_declared_target`. That contradiction must
be removed by moving semantic pressure into `evaluate.C`, not by tuning the
worker around F_D drift.

## Non-Goals

- Do not move all registers in this slice. This ticket pilots
  `implementation_design_surface` first.
- Do not let F_P own closure. F_P produces findings/register candidates; ABG and
  deterministic admission own side effects and guardrails.
- Do not keep compatibility bridges that can satisfy implementation-design
  authority. Old deterministic tests must either use an admitted F_P sidecar or
  prove the old derived artifact is absent.

## Rust Service Sandbox Iteration

The Rust hello-world service sandbox exposed the first real tuning need for the
F_P evaluator register:

- The initial evaluator pass could close with shallow rows such as
  `publicBoundary: "module-root"` and duplicate behavioral file target roles
  such as `runtime_binding`.
- A later pass improved the boundary but over-compressed file targets and
  omitted the materialized `src/main.rs` source target.
- A multi-edge Rust run exposed a registration bug: the evaluator rule was
  scoped from the initial transition, so a later `implementation_design_surface`
  vector could miss the required evaluator rule and retry on
  `design_depth_register_missing`.

The pilot now treats the evaluator prompt as a tighter register-construction
contract:

- `fileTargetRows` are limited to materialized product file roles:
  `source`, `test`, `build_config`, `design`, `documentation`, or `other`.
- Deferred source rows are still emitted as `source` file targets.
- Every component topology and realization `relativePath` must have a matching
  `fileTargetRows` entry with role `source` for evaluator sidecars.
- Behavioral concepts such as routes, runtime binding, response behavior,
  smoke proof, and execution proof are carried on component requirement lineage
  or public boundary text, not as duplicate file-target identities.
- Placeholder public boundaries such as `module-root`, `implementation-core`,
  `component`, and `target` are rejected by admission.
- Empty component topology, empty component realization, and evaluator sidecars
  without any `source` file target are rejected before closure.
- The evaluator rule is installed unconditionally and returns an accepted no-op
  for non-design or no-transform-state vectors.

The stricter source-target completeness check is intentionally applied only to
the F_P evaluator sidecar path. Legacy ADR-derived register admission is not a
runtime/analyzer authority path.

## One-Truth Interface Checklist

- [x] Feature flag removed:
  `ODD_SDLC_TS_FP_EVALUATOR_DESIGN_REGISTERS` and the
  `designDepthFpEvaluatorRegistersEnabled()` predicate are not source authority.
- [x] Runtime admission removed the `allowLegacyDerivation` bridge.
  `admitImplementationDesignRegisterForManifest()` now returns
  `design_depth_fp_evaluator_register_missing` when no admitted evaluator
  sidecar is available.
- [x] Shared design-depth admission removed `allowMarkdownDerivation` and the
  ADR/table parser fallback. `requireSourceFileTargets=true` requires whole-file
  JSON sidecar input.
- [x] Component-code and other consumer edges cannot satisfy implementation
  design authority from a sidecar in their current archive. They may consume the
  register only from explicit predecessor archive refs.
- [x] Analyzer admission for
  `operator-run-artifact://design-depth-fp-evaluator-register` uses the same
  runtime admission helper and requires `fp_evaluate_result.json` evidence.
- [x] Operator-run and product-graph catalogs make the evaluator register
  required for `implementation_design_surface` edge context.
- [x] T-172 staged-contract tests no longer prove markdown-derived topology.
  They either use an admitted F_P sidecar or assert that the old derived
  artifact is absent.
- [x] T-181 tests assert absence of the feature flag predicate, legacy
  derivation parameters, Markdown derivation parameter, latest-mtime lookup,
  and malformed sidecar admission.

## Current Proof

- `npm run test:t181` passes 11 tests, including STDO ticket migration
  admission, design/IACS carrier authority, sidecar preference, strict
  JSON sidecar admission, missing source-target rejection,
  placeholder-boundary rejection, explicit predecessor lookup, analyzer
  admission parity, evidence propagation into `fp_evaluate_result.json`, and
  evaluator-rule registration.
- `npm run test:t172:staged-contracts` passes 27 tests after removing the
  deterministic ADR-derived implementation-design authority path from the
  staged-contract proof lane.
- `npm run test:t175` passes 17 tests after updating the product-materialization
  gap fixture to the RC3-required staged carrier baseline.
- `npm run test:t180` passes 8 tests against the ABG 3.9 RC3 staged boundary.
- `npm run lint:semantic` passes.
- `git diff --check` passes.
- `npm run test:semantic` is not yet a closure proof after the 2026-05-24
  one-truth cleanup. It now fails in older synthetic/fixture lanes that still
  assume implementation-design authority can be satisfied without an admitted
  F_P evaluator sidecar or without an attached F_P evaluator worker. Those
  fixtures must be migrated rather than reintroducing a runtime compatibility
  bridge.
- Live Rust service sandbox using the F_P evaluator register path passed at:
  `build_tenants/typescript/test_env/test_runs/scenario_t164_rust_hello_service_lite_live/20260523T113422797Z_pid18282`.
  The clean pass used `process://codex?model=gpt-5.3-codex` because Spark was
  quota-capped during the rerun.

The admitted evaluator register for that run contains one Rust service
component, a meaningful HTTP public boundary, `Cargo.toml` as `build_config`,
`src/main.rs` as `source`, and satisfied design completeness axes.

## Remaining Non-Closure Gate

The source interfaces listed above are closed, but the ticket must remain
active until the full semantic suite is migrated to the same one-truth rule.
The remaining failing fixtures are compatibility assumptions in tests and
synthetic installed runs, not permission to restore deterministic
ADR-to-register synthesis.

## Tech Debt Removed On 2026-05-23

- The evaluator sidecar path no longer falls through to Markdown/ADR-derived
  register synthesis. `requireSourceFileTargets=true` now means admitted JSON
  register or fail closed.
- Analyzer loading for
  `operator-run-artifact://design-depth-fp-evaluator-register` now calls the
  same design-depth admission function as runtime instead of accepting any JSON
  record with `kind: "sdlc_design_depth_register"`.
- Cross-edge reuse of the evaluator register no longer scans operator runs by
  newest mtime. Component edges may consume the register only from explicit
  predecessor archive refs carried by `traversalObligationContext.priorEdgeRefs`,
  with ambiguity failing closed.
- The admitted evaluator register sidecar is carried into postflight evidence,
  `fp_evaluate_result.json`, and the F_P evaluation finding authority refs.
- The replay selection path preserves `target next` basis identity when the
  archive was started as `next`, but falls back to the archived graph-function
  basis when that is the replay-visible identity. This fixes stale `gaps`
  projections without collapsing target identity.
- Synthetic analyzer fixtures now emit the RC3 composition/admitted-state/
  consequence carrier baseline, so T-161 tests exercise current stage truth
  rather than legacy malformed carriers.

## Tech Debt Removed On 2026-05-24

- Removed the evaluator-register feature flag surface from source code and
  tests. F_P evaluator register truth is the default path.
- Removed the implementation-design `allowLegacyDerivation` and postflight
  compatibility parameters.
- Removed the design-depth Markdown/ADR-derived register synthesis code and its
  `design_depth_evaluator_derived_register.json` producer.
- Tightened F_P sidecar admission so evaluator sidecars with required source
  targets must be whole-file JSON, not Markdown/fenced parser output.
- Tightened consumer-edge admission so component-code edges cannot satisfy
  implementation-design authority from a sidecar in their own archive.
- Repriced T-172 staged-contract tests away from deterministic ADR parser truth
  and into admitted F_P sidecar truth plus negative no-derived-artifact checks.
- Began the inside-out `.C` plugin refactor by adding
  `build_tenants/typescript/code/src/operator/plugins/evaluate/index.ts` as the
  public SDLC `evaluate.C` surface and moving `installed_operator.ts` to call
  `evaluateSdlcComputeStage()` / `writeSdlcFpEvaluateResult()` instead of
  importing evaluation directly from `handoff.ts`.
- Removed `export * from "./handoff.js"` from the operator barrel so new
  public evaluation imports resolve through the `.C` plugin surface, not the
  legacy handoff file.
- Deleted the deterministic
  `materialized_product_file_unbound_to_declared_target` closure blocker from
  runtime emission and from the canonical blocking-reason enum. Undeclared but
  well-formed materialized files are now evaluate.C semantic pressure, not an
  F_D stop reason.
- Repriced T-147 around the new rule: F_D still proves declared role policy for
  declared targets, but known ecosystem/support files no longer satisfy or
  fail product semantics by deterministic unbound-file authority.
- Gutted the old named evaluation stage bodies out of
  `build_tenants/typescript/code/src/operator/handoff.ts`. The functions
  `evaluateWorkerResultPostflight`, `constructFpEvaluateResult`, and
  `writeFpEvaluateResult` are no longer implemented or exported by handoff.
- Moved the evaluation-stage implementation into
  `build_tenants/typescript/code/src/operator/plugins/evaluate/postflight.ts`,
  with `operator/plugins/evaluate/index.ts` as the public `.C` plugin surface.
  Existing public imports are repaired through the plugin barrel; direct handoff
  evaluation imports are intentionally broken.
- Removed the old compatibility aliases from `operator/plugins/evaluate/index.ts`.
  Downstream code must import `evaluateSdlcComputeStage`,
  `constructSdlcFpEvaluateResult`, and `writeSdlcFpEvaluateResult`; the
  `evaluateWorkerResultPostflight` / `constructFpEvaluateResult` /
  `writeFpEvaluateResult` names are no longer a public API.
- Added T-181 assertions that the evaluate.C stage bodies live under the plugin
  surface and that the old handoff function names are absent from `handoff.ts`.
- Remaining cleanup target: the plugin still calls internal handoff helper
  residue for low-level postflight guards. Those helpers must be either moved
  under `operator/plugins/evaluate/shared/` or split into explicit
  product-materialization and execution-evidence admission modules; they must
  not become a second semantic evaluation surface.
