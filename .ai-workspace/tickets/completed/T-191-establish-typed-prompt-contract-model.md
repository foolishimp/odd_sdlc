---
id: T-191
title: Adopt the GTL typed asset interface for SDLC prompt construction
type: feature
ticket_category: ordinary
status: completed
proof_status: passed
priority: high
owner: odd_sdlc
created_at: 2026-06-05
updated_at: 2026-06-06
triaged_at: 2026-06-05
change_class: requirement_reprice
re_entry_point: prompt contract requirements and design
first_missing_layer: odd_sdlc prompt asset substrate needed to consume the GTL AssetSurface typed asset interface (T-150 / REQ-L-GTL3-ASSET-SURFACE) and retire the parallel SDLC prompt asset register/admission
governance_scope: odd_sdlc prompt asset substrate adoption over the released GTL typed asset interface, the SDLC authority-compression policy overlay, and the REQ-F-ODDSDLC-087 requirement cut
source_documents:
  - /Users/jim/src/apps/abiogenesis/specification/PRODUCT.md
  - specification/requirements/07-asset-typing-and-binding.md
  - specification/requirements/10-odd-sdlc-software-domain-buildout.md
  - specification/requirements/18-typed-construction-algebra.md
  - specification/PRODUCT.md
  - specification/requirements/
  - build_tenants/typescript/code/src/operator/plugins/transform/launch_contract.ts
  - build_tenants/typescript/code/src/operator/plugins/evaluate/prompts.ts
  - workspace://.abiogenesis/docs/standards/authority_compressions/
  - /Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/3.9.0-rc.12/release-snapshot-manifest.json
  - /Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/3.9.0-rc.12/abiogenesis-typescript-tenant-3.9.0-rc.12.tgz
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/active/T-150-promote-prompt-assets-into-gtl-typed-asset-interface.md
  - /Users/jim/src/apps/abiogenesis/specification/requirements/gtl/REQ-L-GTL3-ASSET-SURFACE.md
  - /Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/code/src/gtl/m01/contracts/carriers.ts
  - build_tenants/typescript/code/src/operator/prompt_assets.ts
  - .ai-workspace/tickets/backlog/T-192-factor-evaluation-contract-into-segment-dimension-grid.md
  - .ai-workspace/tickets/completed/T-188-force-fp-depth-through-iteration-and-prompt-control.md
  - .ai-workspace/tickets/backlog/T-190-consolidate-configurable-runtime-and-prompt-literals-into-config.md
related_tickets:
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/active/T-150-promote-prompt-assets-into-gtl-typed-asset-interface.md
  - .ai-workspace/tickets/backlog/T-192-factor-evaluation-contract-into-segment-dimension-grid.md
  - .ai-workspace/tickets/completed/T-188-force-fp-depth-through-iteration-and-prompt-control.md
  - .ai-workspace/tickets/backlog/T-190-consolidate-configurable-runtime-and-prompt-literals-into-config.md
  - .ai-workspace/tickets/completed/T-184-partition-handoff-into-compute-stage-boundary-modules.md
affected_boundary:
  requirements:
    - specification/requirements/18-typed-construction-algebra.md
    - specification/PRODUCT.md
  design:
    - build_tenants/typescript/design/
  realization:
    - build_tenants/typescript/package.json
    - build_tenants/typescript/package-lock.json
    - build_tenants/typescript/code/src/operator/prompt_assets.ts
    - build_tenants/typescript/test_env/tests/
requirement_home: specification/requirements/18-typed-construction-algebra.md#REQ-F-ODDSDLC-087
target_truth: odd_sdlc prompt invocation assets consume the GTL typed asset interface - a Node carrying the extended AssetSurface released in @abiogenesis/typescript-tenant@3.9.0-rc.12 (authority slots, constructor/renderer/section/clause/proof refs) constructed through the GTL m01 constructors and admitted by GTL admitAssetSurface (T-150 / REQ-L-GTL3-ASSET-SURFACE). odd_sdlc owns the SDLC authority-compression policy values as product overlay data filling GTL's opaque slots. The local SDLC prompt asset register and its parallel admission are retired. Clause-first prompt-family decomposition is not owned here after the T-192 boundary cut.
superseded_truth: odd_sdlc carries a parallel SDLC-local prompt asset typed register and admission (SDLC_PROMPT_ASSET_TYPED_REGISTER, admitSdlcPromptInvocationAsset) that re-implements typed-asset structure GTL now owns.
closure_law: This ticket closes when odd_sdlc pins @abiogenesis/typescript-tenant@3.9.0-rc.12 or newer, imports and uses the released GTL AssetSurface constructors/admission in `prompt_assets.ts`, retires the parallel SDLC_PROMPT_ASSET_TYPED_REGISTER and admitSdlcPromptInvocationAsset, keeps the SDLC authority-kind vocabulary and normal/bounded/forbidden assignment as product overlay data rather than GTL language law, and amends REQ-F-ODDSDLC-087 to project the GTL REQ-L-GTL3-ASSET-SURFACE structure while retaining odd_sdlc authority policy.
non_closure_conditions:
  - odd_sdlc still pins an abiogenesis package release that does not expose the T-150 GTL AssetSurface interface
  - odd_sdlc retains a parallel prompt asset register or admission after the GTL AssetSurface interface (T-150) is available
  - prompt assets are constructed as SDLC-local typed objects instead of GTL Node/AssetSurface carriers
  - the SDLC authority-kind vocabulary or normal/bounded/forbidden assignment leaks into GTL instead of staying a product overlay
  - REQ-F-ODDSDLC-087 still claims SDLC ownership of the typed-asset structure after GTL owns it (REQ-L-GTL3-ASSET-SURFACE)
  - prompt invocation assets become a second structural truth surface that drifts from the GTL AssetSurface contract, requirements, or design
review_gate: closed for substrate adoption; T-192 owns prompt-family clause-first realization and live prompt slimming proof
---

# T-191: Adopt The GTL Typed Asset Interface For SDLC Prompt Construction

## Intake

Smallest lawful re-entry point: `requirement_reprice`.

Reason: T-150 landed and released the GTL AssetSurface typed asset interface in
`@abiogenesis/typescript-tenant@3.9.0-rc.12` - a Node-borne AssetSurface with
authority slots (an opaque `authorityKindRef`, a generic
`normal | bounded_fallback | forbidden_routine` disposition, and fallback
precondition refs), constructor/renderer/section/clause/proof refs,
declaration-shape admission, and serialization round-trip; codified in
`REQ-L-GTL3-ASSET-SURFACE` and reviewed clean. The durable home for typed prompt
assets now lives in the released GTL package. T-191 therefore re-scopes from
owning an SDLC prompt asset register to consuming the GTL interface: construct
prompts as GTL Node/AssetSurface carriers, retire the parallel SDLC register and
admission, and keep only the SDLC authority-compression policy as a product
overlay over GTL-admitted assets.

The remaining prompt-family realization defects the T-191 code review found are
not closed here: evaluator sections can still be reverse-derived from rendered
Markdown on the production path, and transform/evaluate prompt bodies can still
be represented as broad all-normal sections. Those defects are moved to T-192,
which owns the segment x dimension evaluation-grid realization and the
clause-first rewrite of `plugins/evaluate/prompts.ts` and
`plugins/transform/launch_contract.ts`.

## Target Model

Prompts are rendered views of GTL typed assets. The GTL AssetSurface interface
(T-150 / `REQ-L-GTL3-ASSET-SURFACE`) is the primitive; odd_sdlc consumes it and
does not define a parallel register.

GTL owns, upstream in abiogenesis m01:

```text
Node
  assetSurface: AssetSurface
    kind, requiredContexts, standardsRefs, outputContractRefs
    authoritySlots[]:
      authorityKindRef          (opaque string - GTL never enumerates it)
      disposition               normal | bounded_fallback | forbidden_routine
      fallbackPreconditionRefs[]
    constructorRefs[], inputAssetKinds[]
    rendererRefs[], renderedViewDigestPolicyRef
    sectionKindRefs[], clauseKindRefs[]
    proofObligationRefs[]
  GTL m01 constructors build the AssetSurface; admitAssetSurface validates
  declaration shape (disposition membership; bounded_fallback requires >=1
  precondition ref) and is fail-closed; serialization round-trips every field.
```

odd_sdlc owns, downstream here, as the product overlay:

```text
SDLC authority-compression policy
  the authority-kind vocabulary (product_definition, requirements,
  admitted_design, typed_obligations, worker_report_evidence,
  materialization_evidence, method_compression, bootstrap_provenance,
  intent_fallback, runtime_forensics, sibling_workspace_history, ...)
  the per-family normal / bounded_fallback / forbidden_routine assignment,
  applied as an overlay over GTL-admitted assets - never descended into GTL
```

The cut is exactly T-150's: GTL owns the typed-asset structure and shape
admission; odd_sdlc owns the policy values and F_P semantic judgment. No SDLC
authority vocabulary descends into GTL. T-192 owns the per-family prompt
construction rewrite that will fill these slots clause-first.

GTL does not admit SDLC prompt-clause semantics. GTL admits the generic
declaration shape: Node, AssetSurface, opaque authority-kind refs, generic
disposition labels, constructor/renderer/section/clause/proof refs, and
round-trip serialization. odd_sdlc owns the product-specific prompt clause rows,
text, provenance, expected outcome, authority-kind vocabulary, and family policy
validation that fill those GTL slots. The SDLC overlay validates SDLC policy over
GTL-bound assets; it is not a second GTL ontology and not a Markdown parser. The
remaining constructor-first production path is the T-192 realization.

## Requirement Home

`REQ-F-ODDSDLC-087` (`specification/requirements/18-typed-construction-algebra.md`)
remains the odd_sdlc home, amended so prompt assets PROJECT the GTL structure law
`REQ-L-GTL3-ASSET-SURFACE` rather than declare an SDLC-owned register. The
typed-asset structure lives upstream in GTL; `REQ-F-ODDSDLC-087` governs the
odd_sdlc authority-compression policy overlay and continues to compose with the
prompt-bearing handoff law `REQ-F-ODDSDLC-083`. T-192 owns the follow-on
per-family construction law and realization.

## Consume The GTL Typed Asset Interface (Retire The SDLC Register)

The reuse structure now lives in GTL, not in an SDLC register. T-150 extended
`AssetSurface` and added `AssetSurfaceAuthoritySlot`, declaration-shape
admission, and round-trip in
`abiogenesis/build_tenants/abiogenesis/typescript/code/src/gtl/m01/`. odd_sdlc
consumes that interface.

The first implementation gate is release consumption, not source peeking:
`build_tenants/typescript/package.json` and `package-lock.json` must pin
`@abiogenesis/typescript-tenant@3.9.0-rc.12` or newer before any GTL prompt
surface proof is credited. Active abiogenesis source paths may be cited as
design history, but the downstream implementation consumes the released package
and its exported GTL m01 surface.

Retire (delete from
`build_tenants/typescript/code/src/operator/prompt_assets.ts`):

- `SDLC_PROMPT_ASSET_TYPED_REGISTER` and its row families
- `admitSdlcPromptInvocationAsset` - the parallel admission; GTL
  `admitAssetSurface` now does declaration-shape admission
- the SDLC-local `Sdlc*` asset/section/clause object types that duplicate the
  GTL typed-asset structure

Keep, as the odd_sdlc product overlay:

- the SDLC authority-kind vocabulary and the per-family
  normal/bounded/forbidden assignment, applied as a policy check over
  GTL-admitted assets

Authority scope has one source of truth: the SDLC family authority-compression
policy. A clause carries an `authorityKindRef` (opaque to GTL); the SDLC overlay
classifies it normal/bounded/forbidden for the family. GTL enforces only the
declaration shape (disposition membership; `bounded_fallback` requires a
precondition ref). The SDLC overlay must not descend its vocabulary into GTL.

## Moved Constructor-First Work

The constructor-first prompt-family rewrite is no longer a T-191 closure gate.
It is moved to T-192 because it is the same realization as the segment x
dimension evaluation-grid contract:

- review-grade evaluator prompt sections must stop being derived from rendered
  `indexOf` slices
- design-depth evaluator sections must become clause-first over the grid
  contract
- transform launch prompts must stop emitting the whole-prompt all-normal body
  blob
- production-path negative tests must reject routine raw-bootstrap / forbidden
  authority through the real constructor path

T-191 records the substrate and requirement cut. T-192 owns the production
prompt-family realization and live proof.

## Method Authority Compression Attachments

Shared method-compression assets are source-maintained by the shared methodology
distribution and installed into governed workspaces under:

`workspace://.abiogenesis/docs/standards/authority_compressions/`

odd_sdlc consumes installed copies from the shared-method distribution. If an
installed workspace carries local copies, those copies are installed read models,
not odd_sdlc-owned source truth.

Initial attachments:

- `stdo_compressed.md`
- `spec_method.compressed.md`
- `design_module_method.compressed.md`
- `odd_method.compressed.md`
- `ticket_method.compressed.md`
- `ux_method.compressed.md`

These attachments are derived read models. Their source authority remains the
corresponding installed shared-method documents under
`workspace://.abiogenesis/docs/standards/`.

Prompt constructors consume current installed compression attachments before
raw method documents. A raw method document may be read only when the
compression is missing, stale by source digest, or insufficient for a named
unresolved method question. Any fallback read must cite the unresolved question
and source lines used.

SDLC prompt families remaining for T-192 clause-first realization, each to be
declared on the GTL AssetSurface interface rather than an SDLC register:

- transform worker prompt
- design-depth evaluator prompt
- review-grade evaluator prompt

Per-family constructor inputs for T-192 - each must construct a GTL AssetSurface
view, filling the authority slots with the SDLC vocabulary and the family
policy:

- transform launch constructor:
  `edge contract + construction brief + invocation package + obligation rows +
  target carrier + tenant tool policy -> transform worker prompt AssetSurface`
- design-depth evaluator constructor:
  `edge contract + construction brief + draft content register + worker report
  summary + selected composition + tenant tool policy -> design-depth evaluator
  prompt AssetSurface`
- review-grade evaluator constructor:
  `edge contract + construction brief + invocation package + worker report +
  materialization evidence + accepted design-depth refs + tenant tool policy ->
  review-grade evaluator prompt AssetSurface`

## Steel Thread

The T-191 steel thread is substrate adoption only:

1. Adopt the GTL AssetSurface interface in `prompt_assets.ts` - import the GTL
   m01 constructors/admission; delete `SDLC_PROMPT_ASSET_TYPED_REGISTER` and
   `admitSdlcPromptInvocationAsset`.
2. Keep the SDLC authority-compression vocabulary as product overlay data,
   never GTL language law.
3. Amend `REQ-F-ODDSDLC-087` so odd_sdlc projects the GTL structure rather than
   declaring a local prompt-asset register.

The review-grade/design-depth/transform clause-first steel thread moved to
T-192, because that work is the evaluation-grid realization over the same prompt
files.

## Authority Compression Rule

For every edge after conformance/import induction, the normal prompt authority
packet is the most compressed current authority that can decide the edge:

- Product definition
- requirements and typed obligations
- admitted design/depth rows
- target-carrier refs
- tenant stack authority
- worker report and materialization evidence
- admitted execution/proof evidence when the edge calls for it

Raw bootstrap surfaces are provenance/import sources. They are not normal
evaluator or transformer input once Product, requirements, design, and typed
obligation surfaces exist.

`specification/INTENT.md` is only a bounded fallback for unresolved scope or
intent context. It is not a requirement surface and must not substitute for
requirement rows.

If raw bootstrap or intent fallback is used, the prompt must make the fallback
condition explicit: name the unresolved obligation or provenance dispute first,
read a bounded range, and keep the source use local to that finding/section.

## Current Prompt Stack

This is the current production prompt stack for T-192 to migrate. It is intentionally
listed from the installed operator path, not from historical run archives.

### 1. Transform Worker Prompt

- rendered artifact: `worker_prompt.md`
- current builder:
  `build_tenants/typescript/code/src/operator/plugins/transform/launch_contract.ts`
  `promptForHandoff(...)`
- current writer:
  `writeHandoffFiles(...)`
- current stage/recipient: `transform.C` / F_P transformer
- current transport path: `installed_operator.ts` writes the handoff files and
  passes `handoffFiles.promptPath` to the worker transport
- primary support carriers written beside the prompt:
  - `worker_construction_brief.json`
  - `worker_invocation_package.json`
  - `worker_brief.json`
  - `traversal_intent_package.json`
  - `handoff_manifest.json`
  - `compute_subworkstreams.json`
- prompt-source policy currently named in the construction brief:
  `policy://odd-sdlc/worker-prompt-source/worker-construction-brief/v1`
- current sections visible in the rendered prompt:
  - launch contract header and outcome summary
  - primary transform intent
  - read order
  - terse axioms
  - tenant/tool/IO discipline
  - outcome directives
  - construction brief fields
  - worker package fields
  - current evaluated gaps
  - product materialization directive
- current typed surfaces already feeding this prompt:
  - `SdlcWorkerConstructionBrief`
  - `SdlcWorkerInvocationPackage`
  - `SdlcWorkerTargetCarrierPromptProjection`
  - `SdlcProductMaterializationAuthorityReconciliation`
  - `SdlcTenantToolEnvironmentProjection`
  - inline obligations and requirement pressure rows
- T-192 migration target: the Markdown prompt becomes a rendered view of a GTL-bound
  `AssetSurface`; the current support carriers become
  constructor inputs, not prose-discovered side channels.

### 2. Design-Depth Evaluator Prompt

- rendered artifact: `design_depth_fp_evaluator_prompt.md`
- current builder:
  `build_tenants/typescript/code/src/operator/plugins/evaluate/prompts.ts`
  `designDepthFpEvaluatorPrompt(...)`
- current writer:
  `installed_operator.ts`
  `materializeDesignDepthRegisterWithFpEvaluator(...)`
- current stage/recipient: `evaluate.C` / F_P design-depth evaluator
- current durable output:
  `design_depth_fp_evaluator_content_register.json`
- current projected output:
  `design_depth_fp_evaluator_register.json`
- primary support carriers/inputs:
  - work-category governance document
  - `worker_construction_brief.json`
  - draft content register
  - compact worker result report summary
  - admitted transform artifact, after first evaluator update
  - selected composition/regime identity
  - `compute_subworkstreams.json`
- current sections visible in the rendered prompt:
  - purpose
  - tenant tool boundary
  - authority compression
  - read order
  - precomputed worker result report summary
  - hard pre-register limits
  - first register materialization rule
  - agentic F_P work loop
  - content register shape
  - embedded ProductAssetModel payload shape
  - required literals and self-checks
- T-192 migration target: the content-register contract remains an output-carrier
  obligation, but prompt clauses become typed clause assets rather than a long
  evaluator string body. F_D may seed/admit/project carriers, but must not
  prescribe F_P semantic extraction recipes.

### 3. Review-Grade Edge Fulfillment Prompt

- rendered artifact: `review_grade_edge_fulfillment_prompt.md`
- current builder:
  `build_tenants/typescript/code/src/operator/plugins/evaluate/prompts.ts`
  `reviewGradeEdgeFulfillmentPrompt(...)`
- current writer:
  `installed_operator.ts`
  `materializeReviewGradeEdgeFulfillmentWithFpEvaluator(...)`
- current stage/recipient: `evaluate.C` / F_P review-grade evaluator
- current durable output:
  `review_grade_edge_fulfillment_assessment.json`
- primary support carriers/inputs:
  - work-category governance document
  - `worker_construction_brief.json`
  - `worker_invocation_package.json`
  - `worker_result_report.json`
  - generated assets from `worker_result_report.materializedFiles`
  - `product_materialization_manifest.json`
  - accepted design-depth register refs
  - selected read-only input snapshot used to detect evaluator mutation
  - `compute_subworkstreams.json`
- current sections visible in the rendered prompt:
  - purpose
  - tenant tool boundary
  - authority compression
  - read order
  - reading discipline
  - durable assessment artifact contract
  - required assessment JSON shape
  - finding shape
  - fulfillment binding shape
  - review rules
  - final self-check
- T-192 migration target: the assessment contract remains the output-carrier
  obligation, while authority selection, fallback reads, and every review rule
  become typed clause assets with provenance and expected outcome.

### Fixture And Legacy Prompt Surfaces

These are not production prompt-stack authority, but they must be audited so
tests do not preserve a rival prompt model:

- live fixture helpers under `build_tenants/typescript/test_env/live/*` that
  create local `worker_prompt.md` files for narrow proving lanes
- source-string prompt assertions in `test_env/tests/*` that pin prose instead
  of typed prompt asset behavior
- analyzer/read-model surfaces that report prompt refs, prompt byte counts, or
  `promptSourcePolicyRef`

T-191 migration must either move those surfaces to typed prompt asset proof or
mark them fixture-only. They must not become a second prompt authority.

## Work Ledger

| id | task | closure proof | status |
| --- | --- | --- | --- |
| P-000 | Consume the released GTL prompt AssetSurface substrate. | `build_tenants/typescript/package.json` and `package-lock.json` pin `@abiogenesis/typescript-tenant@3.9.0-rc.12` or newer, and imports resolve `AssetSurface`, `constructAssetSurface`, `constructNode`, and `admitAssetSurface` from the package rather than abiogenesis source paths. | done |
| P-010 | `REQ-F-ODDSDLC-087` exists as the odd_sdlc prompt-asset requirement. | named requirement exists in `18-typed-construction-algebra.md` | done |
| P-011 | Amend `REQ-F-ODDSDLC-087` to project the GTL `REQ-L-GTL3-ASSET-SURFACE` structure and scope odd_sdlc to authority policy. This is the first requirement gate after P-000; implementation must not close while the live requirement still names the SDLC typed register as the structural authority. | requirement defers typed-asset structure to GTL and no longer declares an SDLC-owned register | done |
| P-015 | Materialize shared-method authority compression attachments as installed standards read models. | `workspace://.abiogenesis/docs/standards/authority_compressions/` carries digest-bound compressed assets for STDO core, SPEC_METHOD, DESIGN_MODULE_METHOD, ODD_METHOD, TICKET_METHOD, and UX_METHOD; raw method docs are fallback-only | done |
| P-020 | SDLC prompt asset register design. | retired by the GTL descent (T-150); the register is no longer the structural home | superseded |
| P-030 | Inventory current transform/evaluate prompts by section and classify each line. | inventory maps every existing prompt line to keep/remove/merge with provenance and expected outcome | done |
| P-040 | Adopt the GTL AssetSurface interface in `prompt_assets.ts`; retire `SDLC_PROMPT_ASSET_TYPED_REGISTER`, `admitSdlcPromptInvocationAsset`, and the SDLC-local asset/section/clause types. | prompt construction imports the GTL m01 constructors + `admitAssetSurface`; no parallel SDLC register or admission remains. (The SDLC constructor-first source landed under the retired register; it is superseded by the GTL adoption.) | done |
| P-050 | Re-point the review-grade evaluator family at the GTL interface as the steel thread, constructing real per-clause authority slots. | review-grade prompt is a GTL AssetSurface view built clause-first - no `indexOf`-slice, no uniform all-normal blob - and the SDLC overlay rejects routine raw-bootstrap on the production path | moved to T-192 |
| P-060 | Re-point the design-depth evaluator family at the GTL interface. | design-depth prompt preserves the content-register contract; sections built clause-first, not sliced from rendered Markdown | moved to T-192 |
| P-070 | Re-point the transform launch family at the GTL interface. | transform prompt is constructed clause-first from the launch-contract inputs; the whole-prompt body blob is removed | moved to T-192 |
| P-080 | Structural tests: prompts are GTL Node/AssetSurface views; no SDLC register; no rendered-Markdown section parser. | tests fail if a prompt is built as an SDLC-local asset, if a register/admission remains, or if a section is reverse-derived from rendered text. | substrate portion done; prompt-family reverse-derive guard moved to T-192 |
| P-090 | SDLC authority-overlay regression tests on the production path. | tests prove Product/requirements/design/obligations are normal and bootstrap/intent are bounded-fallback-only, and a real constructor that routine-includes raw bootstrap is rejected | moved to T-192 |
| P-100 | Run JS hello-world and Rust hello-service live lanes on the GTL interface. | live archives show prompts rendered from GTL typed assets with no routine raw-bootstrap read | moved to T-192 as live proof for the clause-first/grid contract |

## Implementation Proof Log

2026-06-06 T-191/T-192 boundary cut:

- T-191 closes for GTL substrate adoption only. It does not claim closure of
  clause-first prompt-family construction or live prompt slimming.
- Verified current code:
  - `prompt_assets.ts` imports GTL m01 constructors and calls
    `admitAssetSurface`; the retired SDLC register and
    `admitSdlcPromptInvocationAsset` no longer appear.
  - `plugins/evaluate/prompts.ts` still computes an
    `EVALUATE_AUTHORITY_COMPRESSION_BOUNDARY` index over rendered
    `promptLines`, slices the rendered prompt, and fills GTL prompt section
    slots from those slices.
  - `plugins/evaluate/prompts.ts` still emits `role: "prompt_body"` with
    `SDLC_PROMPT_NORMAL_AUTHORITY_KIND_REFS`.
  - `plugins/transform/launch_contract.ts` still emits a transform
    `prompt_body` section with all-normal authority refs.
- Therefore P-040 and P-011 close this ticket. The remaining production prompt
  defects are not waived; they are moved to T-192, which owns
  `plugins/evaluate/prompts.ts` and `plugins/transform/launch_contract.ts`.
- Live Rust/JS passing under the current implementation is useful runtime
  evidence, but it is not T-191 closure proof because T-191 is no longer the
  clause-first prompt-family ticket.

2026-06-06 GTL AssetSurface substrate implementation and live evidence:

- odd_sdlc now consumes
  `@abiogenesis/typescript-tenant@3.9.0-rc.12` from the released abiogenesis
  snapshot in `build_tenants/typescript/package.json` and
  `package-lock.json`.
- `prompt_assets.ts` imports GTL m01 constructors and `admitAssetSurface`;
  `SDLC_PROMPT_ASSET_TYPED_REGISTER` and `admitSdlcPromptInvocationAsset` are
  retired from the production exports.
- prompt invocation sidecars remain
  `kind=sdlc_prompt_invocation_asset`, but their structural carrier is now a
  GTL `Node` carrying an admitted `AssetSurface` with 15 authority slots,
  constructor refs, renderer refs, standards refs, output refs, and proof refs.
- the SDLC authority-compression overlay remains product-local data:
  Product/requirements/design/obligations/target-carrier/tool-policy/evidence
  are normal authority, bootstrap/intent/runtime-forensics are bounded fallback
  with explicit precondition refs, and sibling workspace history is forbidden
  routine authority.
- focused source proof passed:
  `npm run build:semantic`, `test_t191_typed_prompt_assets`, and the focused
  T-181/T-182/T-184/T-187/T-188/T-191 prompt and closure pack.
- Rust hello-service live proof passed with no intervention and remains runtime
  evidence for GTL substrate consumption, not prompt-family decomposition:
  `build_tenants/typescript/test_env/test_runs/scenario_t164_rust_hello_service_lite_live/20260606T070300445Z_pid18708`.
  The scenario passed, the ABG runtime ref was
  `package:@abiogenesis/typescript-tenant@3.9.0-rc.12`, the archive converged,
  the final code edge closed, and the generated Rust service was exercised by
  the scenario harness.
- JS hello-world live proof passed with no intervention and remains runtime
  evidence for GTL substrate consumption, not prompt-family decomposition:
  `build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260606T074055272Z_pid66587`.
  The scenario passed, the ABG runtime ref was
  `package:@abiogenesis/typescript-tenant@3.9.0-rc.12`, the archive converged,
  the final code edge closed with `obligationReview` 4/4, and all five live
  prompt sidecars were GTL-backed `sdlc_prompt_invocation_asset` projections.
- post-live self-review found a prompt-family realization defect: the evaluator
  prompt builders still split typed sections by scanning rendered prompt lines.
  A source marker was introduced, but the production path still uses
  `promptLines.indexOf(...)` and slice-based section construction, so this
  finding is moved to T-192.

2026-06-06 re-scoped to GTL consumer:

- T-150 landed the GTL AssetSurface typed asset interface (authority slots,
  declaration-shape admission, round-trip; `REQ-L-GTL3-ASSET-SURFACE`), reviewed
  clean. The durable home for typed prompt assets is now GTL.
- T-191 re-scopes from owning the SDLC prompt asset register to consuming the
  GTL interface; the SDLC register and admission are retired, and the SDLC
  authority-compression policy becomes product overlay data over GTL-admitted
  assets.
- the prior SDLC constructor-first source (below) stands as the proving-domain
  bridge that established the shape; it is superseded by the GTL adoption, not
  extended into a second ontology.
- the two live defects (reverse-derive `indexOf`-slice; uniform all-normal body
  blob) are not fixed in production callers yet. They are T-192 blockers, not
  T-191 substrate blockers.

2026-06-06 constructor-first reconcile finding:

- runtime behavior is green because the prompt renderer currently preserves the
  existing prompt body and adds typed prompt metadata/sidecars
- the typed contract is not yet enforceable because production clauses may be
  reverse-derived from rendered Markdown and stamped with the same authority
  kinds
- prompt-family constructors still need to author typed clause rows before
  rendering and reject routine fallback/forbidden authority on real production
  constructor paths; this work moved to T-192
- the fix must not move semantic interpretation into F_D; F_D validates
  declared constructor-slot metadata only

2026-06-06 SDLC source constructor-first implementation:

- `SdlcPromptInvocationProjectionInput` now accepts typed
  `promptSections` rather than a primary `bodyText` prompt blob
- prompt sections and clauses are constructed before rendering; the Markdown
  prompt remains a view over the prompt invocation asset
- review-grade and design-depth evaluator prompts declare the
  `Authority compression` section as bounded fallback authority with an explicit
  fallback precondition; routine body/output sections carry normal authority
  only
- transform launch prompts are routed through typed prompt sections without
  evaluator-only fallback authority
- admission now rejects bounded fallback authority in routine sections and
  rejects forbidden routine authority
- focused source proof:
  `npm run build:semantic` and
  `node --test test_env/tests/test_t191_typed_prompt_assets.test.mjs` passed
- this is intentionally the SDLC-facing shape only; the next layer should fold
  the prompt asset interface into GTL typed asset surfaces instead of expanding
  the SDLC register into a second ontology

2026-06-06 superseded SDLC-register Rust hello-service live proof:

- active sandbox:
  `build_tenants/typescript/test_env/test_runs/scenario_t164_rust_hello_service_lite_live/20260605T173811390Z_pid11797/workspace`
- final operator run:
  `.ai-workspace/runtime/odd_sdlc/operator-runs/20260605T185202395Z_pid6027`
- final status:
  `status=converged`, `closureDisposition=close`, review grade `7/7`
  fulfilled, postflight `passed`, no blocking reasons
- prompt proof:
  `worker_prompt_asset.json` and
  `review_grade_edge_fulfillment_prompt_asset.json` are
  `sdlc_prompt_invocation_asset` projections with installed
  `workspace://.abiogenesis/docs/standards/authority_compressions/*` method
  refs, no `.intent.` requirement aliases, and no routine raw-bootstrap input
  path
- completion proof:
  `sdlc_overlay_segment_completion.json` exists in the final operator run and
  `sdlc_next_action_projection.json` carries its
  `overlaySegmentCompletionRef`
- server proof:
  a bounded manual probe started the generated Rust service under
  `HELLO_SERVICE_PORT` and verified `GET /` returned exactly `helloworld`
- system fixes made during proof:
  - tenant stack authority declares Cargo byproducts (`Cargo.lock`, `target/`)
    in the Rust fixture instead of hardcoding stack facts in SDLC core
  - requirement minting no longer creates duplicate `.intent.` aliases from
    raw INTENT/GOALS provenance
  - test/proof design surfaces remain allowed to carry requirement authority
    while implementation/module lineage prose does not mint requirements
  - re-entered close now derives overlay completion from the normalized
    post-close vector decision, so a same-vector re-entry close writes the
    completion artifact

This proof remains useful as proving-domain evidence for authority compression,
prompt-asset sidecars, and live-lane behavior, but it is superseded for T-191
closure by the post-T-150 GTL substrate proof above. It exercised the SDLC-local
prompt asset register and `sdlc_prompt_invocation_asset` sidecars that P-040 now
retires.

The fresh JS hello-world and Rust hello-service live lanes were rerun after the
GTL substrate adoption. They remain evidence that the substrate migration did
not break live lanes; the prompt-family decomposition proof moved to T-192.

## Proof Requirements

- Static proof: prompt invocation asset kinds bind through GTL typed asset nodes
  and asset_surface declarations rather than through a separate prompt model.
- Static proof: method authority compression assets carry source refs and
  digests, and prompt constructors prefer current compression refs over raw
  method documents.
- Static proof: prompts are constructed and admitted through the GTL
  AssetSurface interface (`admitAssetSurface`), with no SDLC-local register or
  parallel admission remaining.
- Static proof: the SDLC authority-compression vocabulary remains product
  overlay data and does not descend into GTL.
- Requirement proof: `REQ-F-ODDSDLC-087` projects the GTL
  `REQ-L-GTL3-ASSET-SURFACE` structure rather than declaring an SDLC-owned
  prompt asset register.
- Boundary proof: live JS hello-world and Rust hello-service lanes still run
  after substrate adoption. Prompt-family slimming and clause-first behavioral
  proof moved to T-192.

## Relationship To T-190

T-190 owns tunable values and config migration.

T-191 owns the prompt asset substrate adoption and authority-compression overlay
boundary. Prompt read cap values and runtime budgets belong to T-190. The
prompt-family constructor/rendering rewrite moved to T-192.

## Relationship To T-188

T-188 established that F_P depth must be forced through iteration and prompt
control. T-191 makes the typed-asset substrate available. T-192 owns the
concrete prompt contract that turns those controls into bounded evaluation
cells.

## Relationship To T-150

T-150 (abiogenesis) owns the GTL typed asset interface - the AssetSurface
structure, authority slots, declaration-shape admission, and round-trip,
codified in `REQ-L-GTL3-ASSET-SURFACE`. T-191 (odd_sdlc) is its downstream
consumer. The cut: GTL owns the typed-asset structure and shape admission;
odd_sdlc owns the authority-kind vocabulary and per-family
normal/bounded/forbidden policy, and never descends that vocabulary into GTL.
T-192 owns per-family prompt construction.
