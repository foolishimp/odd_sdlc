---
id: T-091
title: Harden TypeScript traversal closure against lossy obligation carriers
type: bug
ticket_category: rc_blocker
status: active
goal: odd-sdlc-typescript-full-operational-rc
change_intent: Prevent the first SDLC induction traversal, and later prompt-bearing traversals, from closing when source authority or requirement pressure is collapsed into thin IDs and refs that lose the semantic payload needed to define or constrain the REQ set.
change_class: design_reframe
re_entry_point: design
affected_boundary: Fg_conform_project, all prompt-bearing graph edges, workspace source-input lineage, conform project report, imported requirement authority projection, traversal obligation context, prompt-bearing handoff manifests, assurance ledgers, postflight closure evaluators, installed data_mapper qualification lane
priority: critical
triaged_at: 2026-04-28T15:21:18Z
created_at: 2026-04-28T15:21:18Z
updated_at: 2026-05-02T14:07:30Z
reopened_at: 2026-05-02T14:07:30Z
prior_completed_at: 2026-04-28T15:16:56Z
review_status: reopened_for_first_traversal_requirement_authority_depth
dependencies:
  - T-087 active
  - T-096 active
  - T-088 completed
  - T-089 completed
  - ABG release cut `v3.4.0-rc.6` as traversal/runtime substrate
blocks:
  - T-041 active
  - T-102 active
  - T-109 active
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: data_mapper.test52.ts live installed run stopped after bootstrap review showed Fg_conform_project can close with only a thin 00-imported-sources.md marker ledger and downstream prompt edges receive generic requirement-ID obligations rather than full imported requirement pressure. This is a general traversal defect because the same lossy carrier pattern is used by every prompt-bearing edge.
active_requirement_refs:
  - specification/requirements/06-bootstrap-assets-and-recursive-edges.md#REQ-F-ASSET-001
  - specification/requirements/06-bootstrap-assets-and-recursive-edges.md#REQ-F-ASSET-003
  - specification/requirements/10-odd-sdlc-software-domain-buildout.md#REQ-F-ODDSDLC-032
  - specification/requirements/10-odd-sdlc-software-domain-buildout.md#REQ-F-ODDSDLC-033
active_design_refs:
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_REUSABLE_GRAPH_FUNCTION_LIBRARY.md#Fg_conform_project
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_INTENT_PACKAGE.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_WORKSPACE_INGRESS_SEAMS.md
test52_evidence:
  - /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test52.ts
  - /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test52.ts/.ai-workspace/runtime/odd_sdlc/operator-runs/20260428T051318024Z_pid24636/conform_project_report.json
  - /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test52.ts/specification/requirements/00-imported-sources.md
  - /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test52.ts/.ai-workspace/runtime/odd_sdlc/operator-runs/20260428T051442847Z_pid25331/traversal_intent_package.json
target_truth: The induction traversal closes only when its requirement authority carrier preserves the concrete source authority needed to define the initial REQ set: source refs, digests, markers, normalized markers, extracted text or bounded summaries, family allocation, ambiguity state, and evidence refs. Later prompt-bearing traversals inherit the same law for their own obligation carriers. A downstream prompt edge must receive enough concrete pressure to evaluate the target surface against the imported project and all prior graph state, not merely IDs sourced from referenced files.
superseded_truth: Creating `specification/requirements/00-imported-sources.md` with source refs and requirement markers, then requiring workers to assess every declared obligation ID, is sufficient traversal pressure for imported data_mapper-style workspaces.
closure_law: this reopened ticket closes for the current tranche only when first-traversal induction proves that lossy imported authority cannot define the initial REQ set, `Fg_conform_project` either writes deterministic requirement-family authority or emits typed induction gaps, all admitted bootstrap source refs are preserved in the conformance report, and downstream traversal remains closed until concrete REQ authority exists. The broader every-prompt-edge rule remains binding for later SDLC work, but this tranche does not progress beyond bootstrap induction.
evaluation_criteria:
  - `conform_project_report.json` lists the full admitted source set, not only the materialized topology files
  - imported requirement authority records source ref, digest, marker, normalized marker, extracted text or bounded summary, and family classification where deterministic
  - requirement marker normalization does not silently merge or drop distinct markers such as `REQ-LDM-01` and `REQ-LDM-001`
  - `specification/requirements/` contains separate requirement-family files when deterministic classification is possible, or a typed conformance gap when it is not
  - `00-imported-sources.md` remains a lineage/index ledger, not the only requirement authority surface for downstream prompt edges
  - downstream `traversal_intent_package` obligation summaries carry useful requirement content and evidence refs, not only generic ID stubs
  - induction closure fails or returns a blocking gap when requirement authority is too lossy to drive the next graph edge
  - `derive_intent_surface` and `derive_product_surface` are not allowed to close from a lossy imported marker ledger
  - every prompt-bearing edge receives a typed obligation dossier that includes source payload or bounded summaries for requirement, design, module, prior-gap, runtime, and source-asset obligations where those dimensions apply
  - postflight/assurance closure rejects fulfilled obligation assessments that cite evidence but do not map the declared obligation payload to concrete output coverage or a lawful carry-forward gap
proof_surface:
  - updated design/module note for typed traversal obligation dossiers and imported requirement authority carriers
  - deterministic unit tests for bootstrap source coverage, requirement marker normalization, family file projection, lossy-ledger rejection, authority-payload admission, and induction coverage rejection
  - installed sandbox test over fresh `data_mapper.testNN.ts` proving bootstrap closure or lawful blocking before downstream edge
  - internal local-only live data_mapper induction sandbox proving source refs, source digests, `REQ-LDM-*` and `REQ-COV-*` family projection, and non-lossy requirement authority before downstream traversal
  - refreshed data_mapper postmortem comparing test52 failure evidence against the corrected run
non_closure_conditions:
  - downstream traversal opens from a single imported marker ledger while separate requirement-family files are absent and no gap is published
  - conformance report omits admitted bootstrap source documents
  - prompt-bearing handoff manifests carry only requirement IDs with generic summaries
  - any prompt-bearing handoff manifest carries only IDs/refs for a domain obligation that needs concrete source payload to constrain the edge
  - F_P worker output is accepted as satisfying imported requirements when the prompt did not include the concrete imported obligation pressure
---

## Reopen Finding - 2026-05-03

The prior closure is reopened for the first traversal because the initial REQ
set is the load-bearing product of induction.

`00-imported-sources.md` may be a lineage/index ledger. It cannot be the only
requirement authority when downstream SDLC work depends on concrete REQ
meaning.

For the current work tranche, this ticket is scoped to bootstrap induction:

```text
source documents + legacy constraints + imported markers
  -> imported requirement authority carrier
  -> requirement-family surfaces or typed induction gap
  -> ProjectConformance.status == passed only when REQ authority is concrete
```

If requirement text, family allocation, source lineage, or ambiguity state is
missing, induction must iterate or block as typed induction truth. It must not
close and allow later edges to infer requirements from thin IDs.

## Current Scope

In scope:

- preserving admitted source refs and digests in the induction report
- extracting or summarizing useful requirement text
- normalizing requirement markers without silent merge or loss
- allocating requirement families deterministically where possible
- publishing typed ambiguity/gap rows where allocation is not deterministic
- proving that lossy imported ledgers keep the traversal on induction
- proving the checked-in internal data_mapper fixture produces concrete
  requirement-family surfaces and not only `00-imported-sources.md`

Out of scope for this tranche:

- proving every later prompt-bearing edge
- implementing full T-109 edge-ledger parity
- claiming data_mapper lifecycle parity beyond the inducted REQ set

## STDO Triage

First missing layer: design.

The S layer already requires folderized requirement-family output:
`REQ-F-ASSET-001` and `REQ-F-ASSET-003` say the bootstrap requirement output is
rooted at `specification/requirements/` and carried as separate family files.
`REQ-F-ODDSDLC-032` requires conformant downstream spec-method topology.
`REQ-F-ODDSDLC-033` requires imported-project readback to be materially useful
on the first generated cut.

The current TypeScript design and implementation are narrower than that law.
`Fg_conform_project` projects a conformed profile, tenant/contracts, and a
conformance gap set, then materializes `00-imported-sources.md`. It does not
define a closed carrier for imported requirement authority rich enough to
drive downstream prompt edges.

## Test52 Evidence

Fresh workspace:

- `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test52.ts`

Install topology was correct:

- `.abiogenesis/odd_sdlc/typescript/install-manifest.json`
- `.abiogenesis/typescript-installer-manifest.json`
- `AGENTS.md`
- `CLAUDE.md`
- `node_modules/.bin/odd-sdlc-ts`
- `node_modules/.bin/abiogenesis-ts`

`gaps` selected the correct first edge:

- graph function: `Fg_conform_project`
- status: `open`

`start --target next --until blocked` ran the F_D edge and closed:

- archive:
  `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test52.ts/.ai-workspace/runtime/odd_sdlc/operator-runs/20260428T051318024Z_pid24636`
- event sequence:
  `graph_call_opened -> frame_opened -> vector_traversal_planned -> vector_evaluated -> vector_closed`
- report status: `passed`

The closed topology included:

- `specification/GOALS.md`
- `specification/PRODUCT.md`
- `specification/requirements/00-imported-sources.md`
- `.ai-workspace/context/project_bootstrap.md`
- `.ai-workspace/context/project_constraints.yml`
- `build_tenants/TENANT_REGISTRY.md`

The defect is that the requirement authority remained too thin:

- only one requirement file was created:
  `specification/requirements/00-imported-sources.md`
- imported requirement markers were listed, but requirement text, family
  structure, and source-local obligation meaning were not carried forward
- `conform_project_report.json` listed only four source refs:
  `project_constraints.yml`, `PRODUCT.md`, `GOALS.md`, and
  `00-imported-sources.md`, even though the imported ledger itself listed
  eleven admitted source documents
- downstream `derive_intent_surface` received 97 obligations, including 90
  requirements, but those requirements had generic summaries like
  `Fulfill live requirement REQ-LDM-004` with evidence pointing back to the
  single imported ledger

## Failure Mode

The graph no longer fails by missing the `requirements/` folder. It fails by
closing induction after creating the folder with a lossy imported-authority
ledger.

That is still a bootstrap failure. It means the next prompt edge can be live
and formally obligation-bearing while lacking the actual project pressure
needed to produce a materially useful first cut.

The same failure mode applies to every prompt-bearing traversal. The current
carrier admits an obligation as:

```text
{ obligationId, obligationKind, summary, evidenceRefs }
```

That shape can prove that an obligation name was passed through the operator.
It cannot prove that the obligation's content constrained the worker or that
the worker result covered the obligation. Requirement IDs, module names,
source-asset types, evaluator names, prior-gap reason codes, and runtime refs
all become lossy unless their typed payload is carried with the edge.

## Root Cause

The traversal algebra currently applies a lossy projection before the edge is
computed:

```text
SourceAuthority + PriorEdgeState + TargetContract
  -> obligation IDs + refs
  -> worker prompt
  -> worker says fulfilled
  -> postflight checks count/shape/evidence
```

The projection loses the information the evaluator needs:

- requirement text and acceptance criteria
- source digests and local source spans
- design/module contracts
- prior edge outputs and closure ledgers
- unresolved gaps and retry state as machine-consumable repair obligations
- target-specific expected deltas
- coverage mapping from obligation payload to output evidence

The closure gates then check structural participation, not semantic coverage.
`assertTraversalIntentPackagePressure` rejects missing refs/counts, but not
payload-free obligations. Postflight rejects missing assessments, extra
assessments, unassessed status, and blocked-without-evidence, but not
fulfilled-with-irrelevant-evidence or fulfilled-without-obligation-content.

The fix must therefore be global: replace ID-only obligation pressure with a
typed traversal obligation dossier and require worker reports to map each
declared obligation payload to concrete output coverage or a lawful
carry-forward gap.

## Required Correction

Design the traversal obligation dossier as the first-class carrier consumed by
every prompt-bearing edge.

For imported requirements, the carrier includes:

```text
ImportedRequirementAuthority {
  source_ref
  source_digest
  marker
  normalized_marker
  family
  extracted_text_or_summary
  ambiguity
  evidence_refs
}
```

For every traversal, the dossier includes the edge's total-function inputs:

```text
TraversalObligationDossier {
  edge_identity
  source_assets
  target_contract
  required_gain
  authority_obligations
  design_or_module_obligations
  prior_edge_obligations
  prior_gap_obligations
  evaluator_obligations
  runtime_context_obligations
  coverage_contract
}
```

Then make `Fg_conform_project` and every downstream prompt edge either:

1. materialize deterministic structured carriers such as requirement-family
   files, design/module dossiers, execution evidence, or coverage ledgers, or
2. publish a typed gap that blocks closure or carries forward under ABG retry
   truth.

For bootstrap specifically, `Fg_conform_project` must either:

1. materialize deterministic requirement-family files under
   `specification/requirements/`, or
2. publish a typed conformance gap that blocks downstream traversal until the
   authority can be structured.

The downstream traversal intent package must consume the dossier, not rescan
the workspace and not reduce obligations to marker IDs.

## Implementation Evidence

Implemented in the TypeScript tenant as an `odd_sdlc` domain-carrier and
postflight correction, not an ABG core change.

Changed surfaces:

- `build_tenants/typescript/code/src/operator/carriers.ts`
- `build_tenants/typescript/code/src/operator/handoff.ts`
- `build_tenants/typescript/code/src/shared/blocking_reason.ts`
- `build_tenants/typescript/code/src/workspace/project_profile.ts`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRAVERSAL_INTENT_PACKAGE.md`
- `build_tenants/typescript/test_env/tests/test_t091_traversal_obligation_payload.test.mjs`
- `build_tenants/typescript/test_env/tests/test_t066_product_materialization_contract.test.mjs`
- `build_tenants/typescript/test_env/tests/test_t076_deterministic_traversal_state_machine.test.mjs`
- `build_tenants/typescript/test_env/test_surface_map.md`

Implemented behavior:

- `SdlcTraversalObligation` now carries a typed payload with status,
  source refs, source digests, bounded snippets, and coverage expectation.
- Requirement obligations expand `00-imported-sources.md` back to imported
  source documents and derive payload from concrete source text where present.
- `Fg_conform_project` writes deterministic requirement-family files under
  `specification/requirements/NN-<family>-requirements.md` when concrete
  requirement lines are present in bootstrap source documents.
- Marker-only requirement obligations are rejected before worker handoff.
- The conformed project report preserves admitted imported source refs instead
  of only listing the materialized topology files.
- Postflight rejects fulfilled requirement assessments that cite only input
  authority and do not cite generated output, materialized product files, or
  execution evidence.
- T-066 and T-076 scripted workers now cite the generated output surface as
  coverage evidence, so the existing installed data_mapper successor and
  retry-state-machine lanes conform to the stricter carrier contract.

Verification run:

- `npm run test:t091`: 3 passing tests.
- `npm run test:t087`: 1 passing test.
- `npm run test:t088`: 2 passing tests.
- `npm run test:t089`: 3 passing tests.
- `npm run test:t066`: 7 passing tests.
- `npm run test:t076`: 2 passing tests.
- `npm run lint:semantic`: passed with zero warnings.
- `npm run test:semantic`: 127 passing tests.

Boundary conclusion:

This was not an ABG runtime-state defect. ABG retained retry/event/projection
authority. The defect was a lossy `odd_sdlc` projection from source authority
and prior graph pressure into thin obligation IDs/refs before prompt-bearing
worker handoff and postflight evaluation.

## Closure Evidence

Fresh external successor evidence exists in:

- `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test55.ts`

Bootstrap now materializes deterministic requirement-family files under
`specification/requirements/`:

- `00-imported-sources.md`
- `01-acc-requirements.md`
- `02-adj-requirements.md`
- `03-ai-requirements.md`
- `04-bt-requirements.md`
- `05-cov-requirements.md`
- `06-ctx-requirements.md`
- `07-dq-requirements.md`
- `08-eng-requirements.md`
- `09-error-requirements.md`
- `10-general-requirements.md`
- `11-int-requirements.md`
- `12-ldm-requirements.md`
- `13-pdm-requirements.md`
- `14-shf-requirements.md`
- `15-trv-requirements.md`
- `16-typ-requirements.md`

The conformance report preserves the admitted source set:

- archive:
  `.ai-workspace/runtime/odd_sdlc/operator-runs/20260428T132140789Z_pid36703`
- `conform_project_report.json` source ref count: 29

Downstream prompt-bearing edges receive concrete requirement pressure in the
handoff manifest. Example:

- archive:
  `.ai-workspace/runtime/odd_sdlc/operator-runs/20260428T132140836Z_pid36703`
- obligation: `requirement:REQ-LDM-001`
- payload status: `concrete`
- payload source refs include:
  - `specification/REQUIREMENTS.md`
  - `specification/mapper_requirements.md`
  - `specification/requirements/00-imported-sources.md`
  - `specification/requirements/12-ldm-requirements.md`
- payload source snippets include the requirement heading and related imported
  source lines
- coverage expectation requires output evidence or typed gap carry-forward

The test archive retry also proved prior gap pressure is retained and can be
closed:

- prior gap:
  `worker_report_admission_failed:SdlcWorkerResultReport.executionEvidence.lane`
- retry archive:
  `.ai-workspace/runtime/odd_sdlc/operator-runs/20260428T150145425Z_pid89422`
- obligation assessment: fulfilled

The remaining live gap is no longer lossy obligation carriage. It is concrete
test evidence: no governed tests are being observed by `sbt test`.
