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

The lane proves pure typed ingress over checked-in portable source snapshots:
source-input digests, authority markers, project constraints admission, imported
requirement authority, and `InputSet -> Project`/requirement lineage. It does
not depend on local filesystem fixtures.

The full external `data_mapper.template` fixture is retained as optional local
reference comparison through `npm run test:reference:data-mapper` and
`test_env/fixtures/data_mapper_reference_manifest.md`.

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
query-domain fails closed when the admitted GTL module is missing catalog
functions.

## T-039 Query-Domain Structural Coherence Lane

Derives from:

- `specification/requirements/10-odd-sdlc-software-domain-buildout.md`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TENANT_DERIVATION.md`
- `.ai-workspace/tickets/completed/T-039-close-typescript-query-domain-structural-drift-over-admitted-gtl-module.md`

Canonical file:

- `test_env/tests/test_t039_query_domain_structural_drift.test.mjs`

The lane proves query-domain does not treat graph-function name equality as
structural equivalence. Same-name output drift, vector drift, and start-target
drift fail closed before catalog-derived ownership, program, or target read
models are published.

## T-040 Fixture Portability And Test-Lane Authority

Derives from:

- `specification_methodology/specification/standards/SPEC_METHOD.md`
- `build_tenants/typescript/test_env/fixtures/data_mapper_reference_manifest.md`
- `.ai-workspace/tickets/completed/T-040-govern-typescript-data-mapper-fixture-proof-portability-and-test-lane-authority.md`

Canonical file:

- `test_env/tests/test_t040_fixture_portability.test.mjs`

The lane proves required semantic closure excludes external reference fixtures.
The `data_mapper.template` reference proof is explicitly classified as optional
local reference comparison and is run through `npm run test:reference:data-mapper`
when `ODD_SDLC_DATA_MAPPER_TEMPLATE_ROOT` is provided.

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

## T-035 Traceability And Requirement Closure Lane

Derives from:

- `specification/requirements/10-odd-sdlc-software-domain-buildout.md`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TRACEABILITY_REQUIREMENT_CLOSURE.md`
- `.ai-workspace/tickets/completed/T-035-realize-typescript-traceability-lineage-and-requirement-closure.md`

Canonical file:

- `test_env/tests/test_t035_traceability_requirement_closure.test.mjs`

The lane proves lineage over admitted source, graph-function work reports,
generated asset authority, explicit proof claims, requirement closure register,
and repair frontier. Trace tags alone remain partial evidence and unresolved
requirements are carried forward.

## T-036 Gap Triage Homeostatic Route Lane

Derives from:

- `specification/requirements/11-odd-sdlc-homeostatic-gap-triage-and-intent-renewal.md`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_GAP_TRIAGE_HOMEOSTATIC_LOOP.md`
- `.ai-workspace/tickets/completed/T-036-realize-typescript-gap-triage-homeostatic-loop-and-ticket-routing.md`

Canonical file:

- `test_env/tests/test_t036_gap_triage_homeostatic_route.test.mjs`

The lane proves observation, classification, route binding, constitutional
repricing proposal, ticket work-item route, and loopback retirement as separate
typed carriers. It also proves the triage workflow is published as GTL graph
functions and remains downstream of ABG gap truth and TICKET_METHOD ticket
authority.

## T-037 Operational Transition And Runtime Return Lane

Derives from:

- `specification/requirements/12-declarative-operational-state-transitions.md`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_OPERATIONAL_TRANSITION_RUNTIME_RETURN.md`
- `.ai-workspace/tickets/completed/T-037-realize-typescript-operational-transition-and-runtime-return-surfaces.md`

Canonical file:

- `test_env/tests/test_t037_operational_transition_runtime_return.test.mjs`

The lane proves operational command/result/projection separation, capability
gating, pending external evidence, admitted returned result projection, one-step
cooperative advance, and runtime-return evidence feeding observation and retrofit
graph functions.

## T-038 RC Qualification Lane

Derives from:

- `specification/requirements/13-odd-sdlc-typescript-tenant.md`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_TENANT_DERIVATION.md`
- `build_tenants/typescript/qualification/ODD_SDLC_TYPESCRIPT_RC_QUALIFICATION_REPORT.md`
- `.ai-workspace/tickets/completed/T-038-qualify-odd-sdlc-typescript-rc-against-python-functionality-and-odd-scenarios.md`

Canonical file:

- `test_env/tests/test_t038_rc_qualification.test.mjs`

The lane proves the bounded TypeScript RC claim through a composed harnessed
sandbox that walks ingress, query/start, hook evidence, requirement closure,
triage routing, operational build result admission, and runtime-return
observation. It also proves that remaining full Python-replacement gaps are
not part of the bounded RC claim and are tracked by follow-up ticket authority.
