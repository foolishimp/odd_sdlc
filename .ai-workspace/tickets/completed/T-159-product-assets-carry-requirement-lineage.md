---
id: T-159
title: Product assets carry requirement lineage
type: defect
ticket_category: runtime_traceability_closure
status: completed
review_status: closed_live_hello_world_and_deterministic_regression
goal: post-t158-product-asset-lineage-hardening
build_tenant: typescript
owner: odd_sdlc
change_intent: Product files materialized by a governed traversal must carry requirement lineage in the asset row and, for text/code assets, in the asset content itself.
change_class: design_reframe
re_entry_point: design
priority: critical
triaged_at: 2026-05-12
created_at: 2026-05-12
completed_at: 2026-05-12
governance_scope: STDO Method
source_documents:
  - specification/GOALS.md
  - specification/PRODUCT.md
  - specification/requirements/02-graph-functions.md
  - specification/requirements/10-odd-sdlc-software-domain-buildout.md
  - specification/requirements/13-odd-sdlc-typescript-tenant.md
  - specification/requirements/14-odd-sdlc-installed-product-contract.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md
  - .ai-workspace/tickets/completed/B-059-make-generated-code-surface-carry-requirement-traceability.md
  - .ai-workspace/tickets/active/T-158-replay-product-materialization-manifest-across-repair-attempts.md
evidence_archive:
  hello_world_live_sanity: build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260511T173911536Z_pid83128
  product_materialization_run: build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260511T173911536Z_pid83128/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260511T174057991Z_pid83128
  product_file: build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260511T173911536Z_pid83128/workspace/build_tenants/hello_world_javascript/src/hello.js
  strict_order_missing_predecessor_hints: build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260511T235345526Z_pid52980
  missing_module_predecessor_handoff: build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260511T235345526Z_pid52980/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260512T000201295Z_pid52980
  exact_obligation_trace_false_negative: build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260512T001952227Z_pid86078
  feature_decomp_false_negative_archive: build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260512T001952227Z_pid86078/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260512T002126790Z_pid86078
  component_depth_path_basis_mismatch: build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260512T002639836Z_pid94917
  component_code_path_basis_handoff: build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260512T002639836Z_pid94917/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260512T004617986Z_pid94917
affected_boundary:
  - build_tenants/typescript/code/src/operator/carriers.ts
  - build_tenants/typescript/code/src/operator/handoff.ts
  - build_tenants/typescript/code/src/shared/blocking_reason.ts
  - build_tenants/typescript/test_env/tests/test_t066_product_materialization_contract.test.mjs
  - build_tenants/typescript/test_env/live/scenario_t132_hello_world_js_live.mjs
---

# T-159: Product Assets Carry Requirement Lineage

## Intake

The shaped JavaScript hello-world live sandbox created `src/hello.js` at the
right traversal:

```text
archive: build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260511T173911536Z_pid83128
operator run: build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260511T173911536Z_pid83128/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260511T174057991Z_pid83128
graph function: derive_component_code_surface
target asset: component_code_surface
product file: build_tenants/hello_world_javascript/src/hello.js
```

The file content is:

```javascript
console.log("Hello, world!");
```

The worker invocation package carried fifteen
`requirementTraceObligationIds`, and the worker result assessed those
requirements as fulfilled with `src/hello.js` as evidence. The admitted product
manifest row records materialization provenance but no requirement lineage:

```json
{
  "relativePath": "src/hello.js",
  "role": "source",
  "materializationSource": "current_attempt",
  "rolePolicyRef": "target-role-policy://odd-sdlc/product-source-tree"
}
```

This is a real closure defect. The graph-track fix in T-158 made the traversal
correct, but the product asset itself still does not carry the requirement
truth that the worker report claims.

## Exposure

- A product file can be admitted as satisfying requirement obligations even
  when the file contains no requirement tag, no requirement ref, and no
  file-local lineage carrier.
- The product materialization manifest cannot answer which requirements a
  specific product file claims to implement without re-reading the worker
  result report.
- Replay can carry forward the file and role policy, but cannot carry forward
  per-file requirement lineage because the carrier does not yet have it.
- This recreates the B-059 class of failure at the product-materialization
  boundary: proof appears in a report/read model while the generated source
  asset remains orphaned from requirement traceability.

## Root Cause

`SdlcMaterializedProductFile` carries role, path, digest, byte count, replay
provenance, and role policy, but it has no requirement-lineage field.

The worker prompt says to apply `requirementTraceObligationIds` to product
files, and it requires a `## Requirement Trace Register` in the output
artifact. It does not require text/code product files to contain parseable
requirement tags, and postflight does not fail closed when a materialized
source/test/doc file lacks those tags.

The result is a two-surface truth split:

- F_P report admission says the requirements are fulfilled.
- The product asset and materialized file row do not carry the requirement
  lineage needed for replay, audit, or downstream traversal.

## Additional Runtime Bug: Strict Edge Order Without Recursive Predecessor Authority

Archive:

```text
run: build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260511T235345526Z_pid52980
handoff: build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260511T235345526Z_pid52980/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260512T000201295Z_pid52980
edge: derive_implementation_module_surface
```

The graph traversal order was correct:

```text
Fg_conform_project_authority
derive_feature_decomp_surface
derive_design_surface
derive_scenario_surface
derive_implementation_design_surface
select_implementation_stack_profile
derive_implementation_module_surface
```

The module-surface handoff named
`implementation_design_surface` and `implementation_stack_profile` as source
asset types, but the compact retrieval hints omitted the admitted predecessor:

```text
build_tenants/hello_world_javascript/design/adrs/ADR-002-implementation-design-surface.md
```

The worker then searched the workspace with a filename pattern for
`implementation_design_surface`, missed the ADR, and proceeded without the
source asset it was supposed to derive from. This is not a graph-order defect;
it is a predecessor-authority surfacing defect. Strict order is necessary for
lineage, but the handoff must also carry the predecessor evidence for the next
edge.

Root cause:

- `markdownFilesIn()` only indexed top-level markdown files, so nested ADRs
  under `design/adrs/` never entered the authority index.
- Retrieval hints were category-only. A file that implements
  `implementation_design_surface` was not tagged as that asset type, so the
  tranche could not prioritize it as source-asset authority.
- The category match used substring matching, so `implementation_design_surface`
  accidentally marked every generic `design` file as targeted and crowded out
  the actual predecessor in the compact package.
- The same substring defect existed at the asset-tag level:
  `source_asset:implementation_design_surface` also matched the shorter
  `design_surface` tag, which made ADR-001 look like source authority for the
  stack-selection edge. Targeting must compare exact tranche tokens, not
  substrings.
- The compact invocation package took the first hints by raw order instead of
  ranking targeted source-asset authority ahead of unrelated design files.

Fix:

- Recursively index markdown authority under specification and tenant-local
  design/module folders.
- Tag tenant-local SDLC surface files with their asset type according to the
  published tenant-local surface path catalog.
- Rank targeted retrieval hints before generic available-authority hints in the
  compact worker invocation package.
- Match asset tags against exact tranche-key segments such as
  `source_asset:<asset_type>` and `target_asset:<asset_type>`, not substrings.

Regression:

- `test_t118_worker_invocation_package.test.mjs` now creates a nested
  `ADR-002-implementation-design-surface.md` predecessor plus enough unrelated
  design files to prove the compact handoff retains the targeted predecessor
  hints for `derive_implementation_module_surface`.
- The same regression includes `ADR-001-design-surface.md` and asserts it
  remains available authority, not targeted source authority, when the current
  tranche asks for `implementation_design_surface`.

## Additional Runtime Bug: Exact Obligation Trace False Negative

Archive:

```text
run: build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260512T001952227Z_pid86078
handoff: build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260512T001952227Z_pid86078/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260512T002126790Z_pid86078
edge: derive_feature_decomp_surface
```

The worker wrote `feature_decomp_surface.md` with exact obligation ids in its
`## Requirement Trace Register`, including:

```text
requirement:t132_hello_world_single_tenant.bootstrap.req_t132_002
requirement:t132_hello_world_single_tenant.readme.req_t132_002
requirement:t132_hello_world_single_tenant.stage_01_t132_requirements.req_t132_002
```

The framework-generated post-transform report still marked the matching
obligations blocked with
`requirement_trace_not_observed:<authority-ref>`, causing a same-edge retry.

Root cause:

- `postTransformObligationAssessments()` only used `observedRequirementIds()`,
  which scans display markers such as `REQ-T132-002`.
- The artifact carried the stronger structural authority id
  `requirement:<authority-ref>`, but the observer did not consult
  `contentCarriesRequirementObligation()` for output artifacts.
- Result: exact lineage was present, but the evaluator reported it absent.

Fix:

- Read the output artifact/materialized evidence contents once during
  post-transform assessment.
- Treat a requirement obligation as observed when any evidence content carries
  the exact obligation id, its authority ref, or its display id.

Regression:

- `test_t135_evaluator_owned_runner_spine.test.mjs` now writes a transform
  artifact that contains only the exact `requirement:<authority-ref>` id and
  asserts the framework-generated report marks the obligation fulfilled.

## Additional Review Finding: Lineage Gate Scoped to the Wrong Equality

The first T-159 lineage gate only ran when
`manifest.graphFunctionName === manifest.edgeName`.

That equality is not a lawful order or lineage predicate. In normal starts the
outer graph function can be `bootstrap_release_self_test` while the current
edge/vector is `derive_component_code_surface`. Scoping product-file lineage to
the equality let the normal live traversal bypass the gate.

Root cause:

- Product-materialization lineage was attached to a graph-function/edge-name
  coincidence instead of the product-materialization contract and current
  target asset type.
- Postflight only checked `file.requirementTraceObligationIds` that were
  already present. A row with no lineage ids produced an empty missing set and
  could pass if no other check caught it.

Fix:

- Require product-file lineage when product materialization is required, the
  current target asset type is a product source/test/code target, and the
  traversal obligation slice carries requirement obligations.
- Block applicable product files with empty or absent
  `requirementTraceObligationIds`.
- Keep the second check that every claimed id is locally carried in the text
  asset content.

Regression:

- `test_t066_product_materialization_contract.test.mjs` now covers the normal
  outer graph traversal shape (`bootstrap_release_self_test` executing
  `derive_component_code_surface`) and asserts a source row with no lineage ids
  blocks with `materialized_product_requirement_lineage_missing`.
- The same suite now asserts that a product row carrying unrelated requirement
  ids cannot satisfy the lineage gate when the current requirement obligations
  are proved only by the transform artifact/report.

## Additional Review Finding: Product Lineage Must Be Current Lineage

Review found that the first T-159 fix validated that product files carried the
ids they claimed, but not that those ids belonged to the current
requirement-obligation set.

Root cause:

- `materializedFileRequirementLineage()` copied row ids and file-evidence
  assessment ids onto materialized rows.
- `evaluateMaterializedProductFiles()` only checked that each claimed id was
  parseable in the file content.
- A file could carry an unrelated requirement id while the actual current
  requirements were proved only by the transform output/report.

Fix:

- Product-file lineage now fails closed when a row carries ids outside
  `requirementTraceObligationIdsForPrompt(manifest)`.
- The materialized product-file set must carry the current prompt-slice
  requirement obligation ids when lineage is required for the edge.
- Local text/content checks still verify that each claimed current id appears
  in the product file itself.

Regression:

- `T-159 product materialization blocks lineage outside current obligations`
- file:
  `build_tenants/typescript/test_env/tests/test_t066_product_materialization_contract.test.mjs`

## Additional Runtime Bug: Component-Depth Path Basis Mismatch

Archive:

```text
run: build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260512T002639836Z_pid94917
handoff: build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260512T002639836Z_pid94917/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260512T004617986Z_pid94917
edge: derive_component_code_surface
```

The source file first appeared at the correct edge and carried both inline
requirement tags and manifest row lineage:

```text
build_tenants/hello_world_javascript/src/hello.js
```

The product materialization manifest recorded the file as tenant-root relative:

```json
{
  "relativePath": "src/hello.js",
  "role": "source",
  "materializationSource": "current_attempt"
}
```

Component-depth assurance still emitted:

```text
component_declared_path_not_materialized:build_tenants/hello_world_javascript/src/hello.js
```

Root cause:

- `componentRealizationRows[].relativePath` may be workspace-relative because
  the component register describes the product workspace path.
- `materializedFiles[].relativePath` is tenant-root relative by contract
  (`relativePathBasis: tenant_root`).
- Assurance compared the strings directly, so a correctly materialized file
  was treated as missing and the live run retried the code edge.

Fix:

- Normalize component-depth materialized path lookup to admit both
  tenant-root-relative paths and selected-output-root-prefixed
  workspace-relative paths.
- When checking existing files, strip the selected output root before resolving
  under the tenant root.

Regression:

- `test_t066_product_materialization_contract.test.mjs` now asserts
  component-depth assurance admits a row declaring
  `build_tenants/<tenant>/src/cli.ts` when the materialization manifest row is
  `src/cli.ts`.

## Additional Review Finding: Stale Graph Boundary Diagnostics

Stale next-action archives that carried legacy or unknown graph-function/vector
refs could escape as generic command errors instead of typed blocking results.

Root cause:

- `admitSdlcGraphFunctionBoundaryRef()` and
  `admitSdlcGraphVectorBoundaryRef()` threw raw `TypeError`s for legacy or
  unknown boundary refs.
- `selectedNextGraphFunctionFromArchive()` only handled the missing vector
  diagnostic and did not convert boundary-ref admission failures into
  `OddSdlcSpecMethodBlockingPayload`.

Fix:

- Introduce typed graph-boundary diagnostic errors for legacy/unknown
  graph-function and graph-vector refs.
- Route those diagnostics through `specMethodBlockingPayload()` so `gaps`
  returns `status: ok` with a typed blocking payload rather than a generic
  command error.
- Register the four diagnostic codes in `blocking_reason.ts` metadata.

Regression:

- `test_t158_consequence_admission_regression.test.mjs` now covers legacy and
  unknown graph-function refs plus legacy and unknown graph-vector refs from a
  replayed next-action archive.

## Additional Runtime Bug: Imported-Source Ledger Lost Ordered Authority

Archive:

```text
run: build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260512T005858596Z_pid34365
first edge: build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260512T005858596Z_pid34365/workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260512T005903649Z_pid34365
failure: start command failed at step 2 with traversal obligation payload insufficient for stage_00_imported_sources.req_t132_005
```

The first conformance edge correctly wrote the ordered authority surfaces, but
it rewrote `specification/requirements/00-imported-sources.md` to use
`workspace://...` refs. The downstream requirement-obligation builder only
expanded imported-source ledgers that contained `file://...` refs, so it treated
the imported marker ledger itself as a fresh requirement authority. That
produced marker-only `stage_00_imported_sources` obligations and failed before
the next edge could start.

Root cause:

- Strict order existed in the graph, but the imported-source ledger expansion
  was not stable across the first conformance transform.
- `workspace://bootstrap.md` is a lawful current-workspace authority ref, but
  `importedSourceRefsFromLedger()` only expanded `file://` refs.
- The marker-only induction ledger therefore became rival requirement pressure
  instead of a pointer back to the bootstrap authority it records.

Fix:

- Expand `workspace://...` refs from `00-imported-sources.md` relative to the
  workspace root containing that ledger.
- Preserve the ledger as induction lineage while using the referenced source
  files to construct concrete downstream requirement obligations.

Regression:

- `test_t066_product_materialization_contract.test.mjs` now writes an
  imported-source ledger with `workspace://bootstrap.md` and marker-only
  imports, derives the next downstream handoff, and asserts no
  `stage_00_imported_sources` requirement obligation is emitted.

## Required Design Constraints

1. Keep the fix generic. Do not encode hello-world, JavaScript, data_mapper,
   Scala, SBT, or tenant-specific file names in `odd_sdlc` core.
2. Product materialization rows must carry admitted per-file requirement
   lineage. The row must make first-write, replay, and overwrite lineage
   inspectable without reading the worker report.
3. Text/code/document product files must carry parseable local requirement tags
   when requirement lineage is required for the edge.
4. Binary or non-text product files must carry requirement lineage through an
   admitted sidecar or manifest ref; absence of inline text tags must be
   explicit, not silent.
5. The deterministic check may lint syntax and presence of requirement tags.
   F_P remains responsible for semantic correctness of whether the file really
   implements the requirement.
6. A design artifact `Requirement Trace Register` is useful evidence but is not
   a substitute for product-asset lineage.
7. Replay must preserve the admitted per-file requirement lineage. A replayed
   row without requirement lineage cannot satisfy current closure when the edge
   requires product-file lineage.

## Proposed Runtime Shape

- Extend the admitted product materialization row with requirement-lineage
  fields, for example:
  `requirementLineageRefs`, `requirementTraceObligationIds`, or a typed
  `requirementLineage` carrier.
- Normalize worker-reported materialized files into admitted rows that always
  include `materializationSource: "current_attempt"` and the per-file
  requirement lineage applicable to that file.
- Add a typed blocking reason such as
  `materialized_product_requirement_lineage_missing`.
- During product-materialization postflight, for text/code/doc roles, verify
  each admitted product file contains parseable requirement tags for the
  lineage it claims. For non-text assets, require an admitted sidecar/manifest
  carrier.
- Thread requirement lineage through replay and overwrite provenance, so a
  repair attempt does not erase the linkage.

## Regression Requirements

Deterministic:

- Reproduce the live hello-world shape: `derive_component_code_surface`
  materializes a text source file, the worker report claims requirement
  fulfillment, and the file contains no requirement tag.
- Postflight must fail closed with
  `materialized_product_requirement_lineage_missing`.
- When the file contains parseable requirement tags and the materialized row
  carries matching lineage, postflight passes the lineage gate.
- Replay of a predecessor materialized row must preserve the requirement
  lineage. Replay without lineage must fail closed on an edge that requires it.

Live:

- A fresh shaped hello-world run must produce `src/hello.js` with requirement
  lineage visible in the file and in the admitted materialization manifest row.
- The full `data_mapper` run must not depend on tenant-specific traceability
  rules.

## Non-Closure Conditions

- Closure is claimed from the worker result report alone.
- The design artifact has a `Requirement Trace Register`, but product files do
  not carry requirement lineage.
- Only hello-world or data_mapper templates are patched.
- Requirement lineage is added to a projection/read model but not to the
  admitted product materialization row.
- The fix makes every call substantially larger by inlining full requirement
  bodies into every file instead of carrying compact refs plus local tags.

## Live Finding: Component Schedule Prompt Omitted Admitted Row Schema

Run:
`build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260512T012243124Z_pid63256`

Observed issue:

- `derive_component_realization_schedule_surface` produced a
  `component_depth_register` whose `componentRealizationRows` omitted
  `sourceAssetRefs`.
- The deterministic parser rejected the carrier with
  `component_depth_register_invalid:component_depth_register.componentRealizationRows[0].sourceAssetRefs: expected array`.
- The schema authority was already present in
  `componentDepthFieldSetForTarget()`, but the first-attempt worker directive
  only said to emit rows "ordered by dependency reason" and did not publish the
  admitted row field contract.

Root cause:

- Prompt/schema drift in the SDLC handoff package, not an overtuned validator.
  The validator correctly requires provenance on realization rows; F_P failed
  to give the live worker that required field list before retry.

Fix:

- The first-attempt directive for `component_realization_schedule_surface` now
  names the admitted row fields, including `sourceAssetRefs`.
- The sibling `component_code_surface` and
  `component_realization_qualification_surface` directives share the same
  realization-row field language to avoid a second drift.
- Regression added: the worker invocation package prompt for
  `derive_component_realization_schedule_surface` must publish
  `componentRealizationRows` with `kind=sdlc_component_realization_row` and
  `sourceAssetRefs`.

## Live Finding: Declared Product File Section Parsed Prose As Target

Run:
`build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260512T014828323Z_pid94732`

Observed issue:

- `worker_invocation_package.outputContract.declaredProductFileTargets` carried
  both `build_tenants/hello_world_javascript/src/hello.js` and the malformed
  value `build_tenants/hello_world_javascript/src/hello.js` plus the trailing
  prose from the markdown bullet.
- The source authority was `specification/PRODUCT.md` under `## Declared
  Product Files`, where the bullet used an inline code span followed by
  descriptive prose.

Root cause:

- `targetsFromProductAuthoritySection()` added inline code-span targets, then
  also attempted to normalize the whole bullet line. The whole bullet still
  began with the selected output root, so it was admitted as a second bogus
  product target.

Fix:

- For non-fenced declared-product-file section bullets, a code-span target is
  authoritative. The full bullet prose fallback now runs only when the line has
  no code span.
- Regression added: a `Declared Product Files` section bullet of the form
  ``- `build_tenants/.../hello.js` — prose`` yields exactly the code-span path
  and never admits the prose suffix.

## Live Finding: Aggregate Domain Model Retried For Downstream-Owned Flow

Run:
`build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260512T015646964Z_pid5740`

Observed issue:

- `derive_aggregate_domain_model_surface` passed postflight and produced an
  admitted aggregate model.
- Gap evaluation opened
  `design_completeness_flow_partial` because the worker-authored flow verdict
  said the sunny-day sequence projection was owned by downstream
  `derive_aggregate_sunny_day_sequence_surface`.
- The installed loop then re-entered `derive_aggregate_domain_model_surface`
  instead of letting the graph advance to the sunny-day sequence edge.

Root cause:

- Prompt/evaluator drift at the design-depth boundary. The graph already owns
  sunny-day sequence as a separate downstream asset, but the aggregate-domain
  model prompt did not state that downstream ownership is not current-edge
  nonclosure. The assurance evaluator then treated the worker's downstream
  deferral note as F_P escalation pressure for the current edge.

Fix:

- The aggregate-domain-model prompt now states that flow is satisfied when the
  aggregate model declares the in-scope operations, and that
  `aggregateSunnyDaySequence:null` / downstream sunny-day sequence ownership is
  not a flow partial for this edge.
- The design-completeness evaluator suppresses only the specific
  `aggregate_domain_model_surface` flow-partial verdict whose reasons all name
  downstream sunny-day sequence ownership. Other partial/blocked flow verdicts
  remain assurance pressure.
- Regression added: aggregate-domain-model admission with a downstream-owned
  sunny-day flow note yields a satisfied design-completeness ledger instead of
  `design_completeness_flow_partial`.

## Live Finding: Declared Source File Field Did Not Seed Product Target

Run:
`build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260512T021103021Z_pid23043`

Observed issue:

- The conformance worker produced `specification/PRODUCT.md` with
  `- declared source file: build_tenants/hello_world_javascript/src/hello.js`
  rather than a `Declared Product Files` section.
- `derive_feature_decomp_surface` then received
  `declaredProductFileTargets: []`, even though the product authority carried
  a selected-root source path.

Root cause:

- `targetsFromProductAuthorityFields()` recognized `declared product file(s)`
  labels, but not `declared source file`. The path itself was valid and under
  the selected output root; the label vocabulary was too narrow.

Fix:

- Product authority field extraction now accepts `source file(s)` and
  `test file(s)` labels as file-target authority when the normalized path is
  under the selected output root.
- Regression added: `- declared source file: .../src/hello.js` yields the
  single declared product target.

## Live Finding: Worker Read-Boundary Scanner Treated Executor Metadata As Authority

Run:
`build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260512T021520669Z_pid28599`

Observed issue:

- `derive_component_code_surface` wrote the expected traced product file at
  `build_tenants/hello_world_javascript/src/hello.js`.
- The file was created after design/module/topology/schedule surfaces and
  carried all requirement trace comment lines.
- Postflight still blocked with `worker_authority_read_outside_workspace`.
- The cited outside path was
  `worker_stdout.log:7.tool_use_result.persistedOutputPath=/Users/jim/.claude/...`.

Root cause:

- The worker read-boundary scanner treated any key ending in `Path` as an
  authority-bearing filesystem reference. That is correct for worker tool
  inputs such as `file_path`, and for result payloads such as `file.filePath`
  or `filenames`, but `persistedOutputPath` is executor bookkeeping: it records
  where the Claude runtime persisted streamed tool output. It is not a worker
  read, cited source, or product authority.

Fix:

- The scanner now excludes the known runtime metadata key
  `persistedOutputPath` while preserving the existing block for real outside
  tool inputs/results.
- Regression added: a worker log containing an outside
  `tool_use_result.persistedOutputPath` no longer blocks postflight, while the
  existing outside `Read` regression still blocks.

## Live Finding: Component Topology Prompt Allowed Non-String Public Boundary

Run:
`build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260512T025640582Z_pid87090`

Observed issue:

- `derive_implementation_component_topology_surface` produced a structurally
  plausible component topology row, but used `"publicBoundary": []`.
- The component-depth parser requires `componentTopologyRows[].publicBoundary`
  to be a string, so postflight blocked with
  `component_depth_register_invalid`.
- This was an avoidable same-edge retry on a typed carrier shape that the
  prompt should have made explicit.

Root cause:

- The topology outcome directive named `publicBoundary` but did not state its
  scalar type. A live worker inferred an array for a script with no exported
  API.

Fix:

- The implementation-component-topology directive now states that
  `publicBoundary` must be a string and gives the entry-script fallback form
  `node-entry-script:<relativePath>`.
- Regression added: the T-120 worker package/prompt test asserts the topology
  directive carries the string rule and entry-script fallback.

## Live Finding: Product Files Flattened Duplicate Requirement Authorities

Run:
`build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260512T021520669Z_pid28599`

Observed issue:

- `build_tenants/hello_world_javascript/src/hello.js` carried 15 requirement
  trace comments for 5 logical requirements.
- The handoff package exposed all three authority surfaces for each display id:
  bootstrap source, requirements README/index, and the conformed
  `01-t132-requirements.md` requirement-family file.
- The product materialization manifest then copied all 15 ids onto the single
  source row.

Root cause:

- `requirementTraceObligationIdsForPrompt()` used the raw traversal obligation
  list. That list is correct for ledger/projection authority, but it is too
  broad for product-file lineage.
- `materializedFileRequirementLineage()` then merged every fulfilled
  requirement assessment that cited the product file, so duplicate authority
  surfaces were flattened into the product row.

Fix:

- Product-file lineage now uses one canonical requirement obligation per
  logical display id. It prefers conformed requirement-family files under
  `specification/requirements/`, then root requirement surfaces, then imported
  source/bootstrap authority, and leaves README/index surfaces last.
- The full traversal obligation context remains unchanged; only the worker
  invocation trace list and emitted product-file lineage are canonicalized.
- Regression added: a duplicate bootstrap + README + conformed requirement
  surface yields a single product-file lineage id for `REQ-T066-001`, and
  duplicate fulfilled assessments are collapsed to that canonical id in the
  materialization manifest.

Follow-on live observation:

- The next JS hello-world run proved duplicate surfaces were collapsed, but
  also exposed a sibling extraction bug: prose such as `REQ-T132-00x` was
  admitted as a synthetic family marker `REQ-T132`.
- That marker is not a real requirement obligation in the T132 lane; it is a
  range/wildcard notation describing the five concrete keyed requirements.

Additional fix:

- Requirement marker scanners now reject a partial prefix match when the next
  source character is `-`, so `REQ-T132-00x` cannot admit `REQ-T132`.
- Regression extended: wildcard family prose in `PRODUCT.md` does not create
  a `.product.req_t066` obligation, while the concrete
  `REQ-T066-001` conformed requirement still becomes the product-file lineage
  id.

## Live Review Finding: Post-Transform Requirement Evidence Flattened Across Files

Observed issue:

- `postTransformObligationAssessments()` used the same `baseEvidenceRefs`
  (`outputFile` plus every materialized product file) for every requirement
  assessment.
- On a multi-file product, that makes each fulfilled requirement appear to be
  evidenced by every product file, even when only one file carries the marker.
- `materializedFileRequirementLineage()` consumes those assessment evidence
  refs, so the downstream materialization manifest can flatten all requirement
  ids onto all files.

Root cause:

- The framework-generated post-transform report treated the whole observed
  artifact set as requirement evidence. That is acceptable for target/source
  structural obligations, but wrong for requirement lineage: requirement
  evidence must be the specific file(s) whose content carries the requirement
  marker or admitted authority id.

Fix:

- Requirement assessments now compute evidence refs per obligation by scanning
  the transform output and materialized files for that requirement id/display
  id.
- Product-file lineage therefore receives only the requirement ids evidenced by
  that file, while feature/design trace registers remain free to map many
  requirements explicitly.
- Regression added: two generated source files carrying different requirement
  ids produce a materialization manifest where each row carries only its own
  requirement lineage, not the other file's id.

Boundary clarification:

- Requirement-to-feature and requirement-to-design mapping surfaces may
  deliberately flatten the current requirement set into an admitted trace table
  when that table is the product's declared planning or design authority.
- Product file rows and product file comments are narrower: they carry the
  canonical immediate requirements the file claims to implement or validate.
- Runtime traversal packages may preserve the full obligation graph by
  reference for audit/replay, but product-file lineage must not copy that graph
  transitively.

## Live Review Finding: Conformance Assessments Added Raw Display-ID Duplicates

Observed issue:

- `Fg_conform_project_authority` post-transform reports added
  `requirement:REQ-T132-001` style assessments even when the manifest already
  carried canonical obligations for the same display ids.
- The later worker package canonicalization masked this from the next prompt,
  but the admitted report still carried unnecessary duplicate requirement
  assessments.

Root cause:

- The conformance post-transform backfill compared observed `REQ-*` markers
  only to raw obligation authority refs. Conformed requirement obligations use
  structural refs such as
  `requirement:<project>.<family>.req_t132_001`, so the display-id match was
  missed.

Fix:

- The conformance backfill now builds the existing requirement set from both
  raw obligation refs and each requirement obligation's display id.
- Regression added: when a conformance output observes `REQ-T066-001` and the
  manifest already carries a canonical obligation for that display id, the
  post-transform report does not add `requirement:REQ-T066-001`.

## Prompt Bloat Guard: Traversal Intent Is Audit Context

Observed issue:

- Worker prompt text still said to apply `requirementTraceObligationIds` as the
  inline slice and `traversal_intent_package` as the "complete transformation
  set for product files."
- That wording is misleading after lineage canonicalization. It invites the
  worker to re-expand product-file tags from the full traversal obligation
  graph.

Fix:

- The prompt now states that `requirementTraceObligationIds` is the complete
  product-file requirement tag set for the edge.
- `traversal_intent_package` remains audit context for the broader graph, not
  extra tag pressure for generated source files.
- Regression added: worker package prompt must mention audit context and must
  not include the old "complete transformation set for product files" wording.

## Live Finding: Implementation Module Prompt Flattened Trivial Product Semantics

Run:
`build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260512T044815391Z_pid44464`

Observed issue:

- `derive_implementation_module_surface` took about 119 seconds on the live
  worker for a one-line JavaScript hello-world product.
- The prompt required non-empty module schema fragments and non-empty module
  state diagram fragments, but did not bound their semantic scope.
- The worker expanded five requirements into five domain entities, five
  operations, process/archive/assertion entities, and one stateless diagram row
  per entity.

Root cause:

- The design-depth carrier requirement was applied as an unconditional deep
  modeling prompt rather than an immediate implementation-module prompt.
- Requirement lineage, runtime proof, process archive evidence, and downstream
  audit facts were flattened into the module model instead of staying as refs
  on the relevant implementation entity/operation.
- This is the same bloat class as product-file lineage flattening, but on the
  design-depth side: a graph of evidence was copied into the current carrier.

Fix:

- The implementation-module directive now requires proportionality:
  model only the modules, implementation entities, and operations needed to
  materialize the declared product surface from current source assets.
- The directive explicitly forbids flattening requirement obligations, runtime
  execution proof, process archives, test assertions, downstream evidence, or
  audit lineage into separate module entities unless the source design declares
  them as implementation modules or product data.
- For single-file/script products, the prompt now states that one module row,
  one primary source/program entity, one materialization/invocation operation
  when needed, and one stateless diagram row are sufficient.

Regression:

- `test_t118_worker_invocation_package.test.mjs` asserts the
  implementation-module prompt carries the proportionality guard and the
  "do not create one entity or stateless diagram row per requirement" rule.

## Fresh Live Closure Evidence

Run:
`build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260512T050346719Z_pid65805`

Command:
`npm run test:scenario:t132-hello-world-js-live`

Result:

- Node test passed in `1197087.015334ms` (about 19m 57s).
- No same-edge retry occurred.
- Every edge carried exactly five canonical requirement obligations.
- Every edge closed with `fp_evaluate_result.status: passed`,
  `postflightStatus: passed`, and closure disposition `close`.
- Final product file:
  `workspace/build_tenants/hello_world_javascript/src/hello.js`.
- Direct execution from the live workspace prints `Hello, world!`.
- Final product materialization manifest row for `src/hello.js` carries
  `materializationSource: current_attempt`, role `source`,
  `rolePolicyRef: target-role-policy://odd-sdlc/product-source-tree`, and five
  `requirementTraceObligationIds`.
- The file content carries the same five canonical requirement tags, one
  native JavaScript comment per line, before `console.log("Hello, world!");`.
- The implementation module surface carries one module, one
  `HelloProgram` entity, one operation, and one stateless diagram row; runtime
  proof/archive/assertion surfaces were not flattened into sibling entities.

Closure assessment:

The T-159 lineage correctness defect is closed on the fresh T-132 live lane.
The remaining proportionality concern is broader than this ticket: the
full-breadth graph still spends about 20 minutes and twelve prompted edges to
produce a one-line program. That is now recorded in the forensic comment as a
guided-traversal/minimal-proof-lane design issue, not a product-file lineage
or module-flattening correctness failure.

Deterministic closure verification:

```bash
npm run test:t066
```

Observed result on 2026-05-12:

- `build:semantic`: passed
- `test_t066_product_materialization_contract.test.mjs`: 57/57 passed
- T-159 lineage regressions passed, including missing lineage, empty row
  lineage, unrelated requirement lineage, admitted source lineage, duplicate
  canonicalization, imported-source expansion, and non-flattened product-file
  lineage.
