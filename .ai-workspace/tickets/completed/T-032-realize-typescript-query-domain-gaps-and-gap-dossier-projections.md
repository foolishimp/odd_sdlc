---
id: T-032
title: Realize TypeScript query-domain gaps and gap-dossier projections
type: feature
ticket_category: build_wave
status: completed
goal: build-odd-sdlc-typescript-as-odd-native-app
change_intent: Implement read-only TypeScript projections for query-domain, gaps, current edge dossiers, span analysis, catalogs, start targets, asset ownership, ambiguity, and requirement closure.
change_class: realization_refactor
re_entry_point: realization
affected_boundary: projection/query layer, public observation, gap dossier, start-target catalog, asset ownership index
priority: high
triaged_at: 2026-04-26
created_at: 2026-04-26
updated_at: 2026-04-26
completed_at: 2026-04-26
dependencies:
  - T-031 completed
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: Python `query.py`, `query_contract.py`, `gap_dossier.py`, `span_analysis.py`, ABIogenesis TypeScript public `gaps` projection proof
target_truth: SDLC.TS exposes query and gap surfaces as read models over GTL publication, admitted SDLC carriers, and ABG replay truth, not as source authority.
superseded_truth: Query/gaps reconstruct runtime and domain truth from filesystem state or mutate surfaces while observing.
closure_law: this ticket closes when query-domain and gaps commands return stable typed projections and tests prove they do not emit runtime events, start traversal, or write workspace state.
evaluation_criteria:
  - query-domain publishes graph-function typed surfaces, programs, asset families, start targets, asset ownership, capabilities, execution contract surface, and current dossier refs
  - gaps publishes open/partial/converged work from replay truth
  - gap dossier preserves current edge, evidence, triage input, and next lawful actions
  - span analysis supports bounded from-edge/to-edge/zoom selectors
  - tests prove projections remain read-only
proof_surface:
  - projection contract code
  - CLI/API projection tests
  - negative read-only tests
  - sandbox dossier fixture
non_closure_conditions:
  - projection files are treated as authority over graph publication
  - query command writes runtime events
  - gap dossier chooses hidden next traversal
---

## STDO Reading

This is the visibility layer. It is not execution.

## Closure Evidence

Completed on 2026-04-26.

Changed realization and proof surfaces:

- `build_tenants/typescript/code/src/projection/query_domain.ts`
- `build_tenants/typescript/code/src/projection/index.ts`
- `build_tenants/typescript/code/src/index.ts`
- `build_tenants/typescript/package.json`
- `build_tenants/typescript/test_env/test_surface_map.md`
- `build_tenants/typescript/test_env/tests/test_t032_query_gap_projection.test.mjs`

Result:

The TypeScript tenant now exposes read-only query-domain, gap, dossier, and
span projections over SDLC carriers, GTL module publication, and ABI replay
truth. The projections emit no runtime events, do not write workspace state, and
do not choose hidden next traversal.

Correction update: query-domain now compares the admitted GTL module against the
canonical SDLC function catalog and fails closed when graph-function publication
is stale or missing, so functions, programs, asset ownership, graph functions,
and start targets cannot silently drift apart.

Verification:

```text
npm run test:t032
npm run test:semantic
npm run lint:semantic
git diff --check
```

STDO review:

- `S`: projection surfaces derive from active query/gap requirements without
  replacing source authority.
- `T`: closure includes positive projection proof, negative invalid-span proof,
  and stale-module fail-closed proof.
- `D`: query/gap surfaces remain a read-model layer over module/carrier truth.
- `O`: ABG replay projection provides current edge truth; SDLC only interprets
  it into domain-facing visibility.
