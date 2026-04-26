# odd_sdlc TypeScript Test Surface Map

**Status**: Active
**Date**: 2026-04-26

This map records TypeScript tenant proof lanes.

## T-027 Scaffold Lane

Derives from:

- `specification/requirements/13-odd-sdlc-typescript-tenant.md`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TENANT_DERIVATION.md`
- `.ai-workspace/tickets/completed/T-027-scaffold-odd-sdlc-typescript-package-strict-lane-and-test-harness.md`

Canonical file:

- `test_env/tests/test_t027_scaffold.test.mjs`

The lane proves only package identity and scaffold status. It does not claim
domain behavior, graph publication, ABG binding, public start, projection,
constructor, or qualification parity.

## T-028 ABIogenesis Substrate Binding Lane

Derives from:

- `specification/requirements/13-odd-sdlc-typescript-tenant.md`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TENANT_DERIVATION.md`
- `build_tenants/typescript/design/ODD_SDLC_ABIOGENESIS_SUBSTRATE_CONTRACT.md`
- `.ai-workspace/tickets/completed/T-028-bind-odd-sdlc-typescript-to-abiogenesis-typescript-substrate-contract.md`

Canonical file:

- `test_env/tests/test_t028_abiogenesis_substrate_binding.test.mjs`

The lane proves that `odd_sdlc.TS` consumes ABIogenesis TypeScript through a
declared dependency, admits one substrate `ExecutionBasis`, and uses
ABI-derived replay projection for next-vector truth.

## T-029 Domain Carrier Lane

Derives from:

- `specification/requirements/10-odd-sdlc-software-domain-buildout.md`
- `specification/requirements/12-declarative-operational-state-transitions.md`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TENANT_FIRST_SLICE_IACS.md`
- `.ai-workspace/tickets/completed/T-029-realize-typescript-domain-asset-and-worksite-carriers.md`

Canonical file:

- `test_env/tests/test_t029_domain_carriers.test.mjs`

The lane proves closed immutable admission for asset, asset type, asset family,
asset binding, worksite, capability, work-act, operational command/result/state
projection, and runtime-return evidence carriers.

## T-030 Graph Catalog And Module Lane

Derives from:

- `specification/requirements/10-odd-sdlc-software-domain-buildout.md`
- `specification/requirements/12-declarative-operational-state-transitions.md`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TENANT_DERIVATION.md`
- `.ai-workspace/tickets/completed/T-030-publish-typescript-gtl-function-catalog-and-executive-programs.md`

Canonical file:

- `test_env/tests/test_t030_graph_catalog_module.test.mjs`

The lane proves that SDLC programs are published as ABIogenesis GTL graph
functions, that executive programs materialize through ABI carriers, and that
jobs cannot target unpublished graph functions.

## T-031 Workspace Ingress And Bootstrap Lineage Lane

Derives from:

- `specification/requirements/08-odd-sdlc-first-slice.md`
- `specification/requirements/10-odd-sdlc-software-domain-buildout.md`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TENANT_DERIVATION.md`
- `.ai-workspace/tickets/completed/T-031-realize-typescript-workspace-ingress-normalization-and-bootstrap-lineage.md`

Canonical file:

- `test_env/tests/test_t031_workspace_ingress.test.mjs`

The lane proves pure typed ingress over the real `data_mapper.template`
fixture: source-input digests, authority markers, project constraints admission,
imported requirement authority, and `InputSet -> Project`/requirement lineage.
The fixture root is supplied by `ODD_SDLC_DATA_MAPPER_TEMPLATE_ROOT` or the
documented local default, with a fail-closed diagnostic when the fixture is not
present.

## T-032 Query Domain And Gap Projection Lane

Derives from:

- `specification/requirements/10-odd-sdlc-software-domain-buildout.md`
- `build_tenants/python/design/GAP_ANALYSIS_DOSSIER.md`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TENANT_DERIVATION.md`
- `.ai-workspace/tickets/completed/T-032-realize-typescript-query-domain-gaps-and-gap-dossier-projections.md`

Canonical file:

- `test_env/tests/test_t032_query_gap_projection.test.mjs`

The lane proves read-only query-domain, gap, dossier, and span projections over
typed SDLC carriers, GTL publication, and ABI replay truth. It also proves that
query-domain fails closed when the admitted GTL module is stale against the
published SDLC function catalog.

## T-033 Public Start Lane

Derives from:

- `specification/requirements/08-odd-sdlc-first-slice.md`
- `build_tenants/python/design/FP_WORKER_ATTACHMENT_CONTRACT.md`
- `build_tenants/typescript/design/ODD_SDLC_ABIOGENESIS_SUBSTRATE_CONTRACT.md`
- `.ai-workspace/tickets/completed/T-033-realize-typescript-public-start-admission-execution-contract-and-worker-attachment.md`

Canonical file:

- `test_env/tests/test_t033_public_start.test.mjs`

The lane proves closed public-start admission, query-domain target resolution,
execution-contract construction, F_P worker attachment blocking, and one ABI
handoff projection without tenant-local iteration. It also proves stale
query-domain/module pairs return typed blocked outcomes instead of throwing
through ABI admission.

## T-034 Constructor And Evaluator Hook Lane

Derives from:

- `specification/requirements/10-odd-sdlc-software-domain-buildout.md`
- `specification/scenarios/09-odd-sdlc-software-domain-worksite-lifecycle.md`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TENANT_DERIVATION.md`
- `.ai-workspace/tickets/completed/T-034-realize-typescript-sdlc-constructor-and-evaluator-hook-set.md`

Canonical file:

- `test_env/tests/test_t034_hook_set.test.mjs`

The lane proves SDLC-owned hook contracts over the published edge classes,
separate F_D preflight/postflight evaluation around F_P work-report admission,
graph-function authority for generated assets, requested/returned operation
matching, generated-asset contract blocking, ambiguity candidate preservation,
wrong-kind rejection for serialized work reports, and no tenant-local runtime
event or next-traversal selection.
