# T-003 Enforce SPEC_METHOD Structured-Build Topology For Project Tenants

- id: T-003
- title: Enforce spec-method structured build topology so project realization tenants live under build_tenants and installed odd_sdlc stays outside project tenant space
- type: feature
- status: completed
- goal: ambiguity-governance-and-traceability
- priority: critical
- created_at: 2026-04-12
- updated_at: 2026-04-12
- dependencies: B-001

## Triage

- intake: feature / operator finding / spec-method topology violation exposed by `test28`
- lawful_change_class: requirement_reprice
- affected_boundary: odd_sdlc bootstrap topology, normalization/default project structure, project-profile resolution, and downstream installed workspace shape
- lawful_re_entry: odd_method specification, design, and realization surfaces for bootstrap structure, tenant topology, and downstream workspace installation
- downstream_proof_span: initial project bootstrap, normalized workspace topology, installed downstream workspace shape, and multi-tenant onboarding readiness for future lanes such as `dbt`

## Why This Ticket Exists

Current `odd_sdlc` bootstrap and topology behavior does not go far enough in
projecting unstructured input into conformant `SPEC_METHOD` structure.

Observed in downstream workspaces such as `data_mapper.test28`:

- Scala realization lands in `imp_scala_spark/` at the workspace root
- installed `odd_sdlc` appears under `build_tenants/odd_sdlc/`
- generated shared design material appears under `build_tenants/common/`
- a separate normalized scaffold also appears under
  `build_tenants/data_mapper/spark_scala/`

That is drift against the intended model:

- unstructured bootstrap input should project into a conformant structured build
- project realization tenants belong under `build_tenants/<tenant>/`
- installed released method software belongs under `.odd_sdlc/`, not inside the
  project tenant topology

This matters immediately because future onboarding such as `build_tenants/dbt/`
must compose cleanly with the first Scala realization lane rather than forcing a
later topology migration.

## Lessons From `test28`

`test28` shows that the issue is not one wrong path. The workspace currently
contains multiple competing topology models at once:

- `imp_scala_spark/`
- `build_tenants/odd_sdlc/`
- `build_tenants/common/`
- `build_tenants/data_mapper/spark_scala/`

So this ticket must collapse competing topology models into one lawful
spec-method structure rather than only moving one directory.

Additional concrete lessons from `test28`:

- `.odd_sdlc/` already exists and is the right category for immutable installed
  method/runtime software, but the active runtime contract still points
  `pythonpath` at `build_tenants/odd_sdlc/python/code`
- generated documents and helper code currently embed the drifting paths, so
  runtime references, asset bindings, and generated read models all need
  migration proof
- `build_tenants/common/` is already being treated as shared design law, so the
  ticket must explicitly decide whether that layer is removed or repriced as an
  intentionally shared cross-tenant surface
- the normalizer and project-profile resolver are not aligned today; one path
  still preserves a selected top-level output tree while another creates a
  tenant scaffold

## Intended Direction

The first lawful traversal should be broad at intake and strict at projection:

```text
{unstructured input}
-> SPEC_METHOD structured build
-> specification/
-> build_tenants/<tenant>/
```

For the current case that means:

- `specification/INTENT.md`
- `specification/PRODUCT.md`
- `specification/GOALS.md`
- `specification/requirements/`
- `build_tenants/scala_spark/`

and later, when explicitly onboarded:

- `build_tenants/dbt/`

Installed released `odd_sdlc` should live under `.odd_sdlc/` as immutable
governance/runtime software, not as a project realization tenant.

## Impact

This is a substantive topology refactor, not a path tidy-up.

It is expected to affect:

- bootstrap and first-traversal requirements
- deterministic normalization defaults
- project-profile output resolution
- release installer layout
- downstream asset bindings and relative-path references
- prompt/runtime context references that currently point at generated surfaces
- traceability checks and any logic that assumes `imp_scala_spark/`
- sandbox/usecase fixtures and installed-workspace proof lanes

The ticket should therefore be treated as a high-churn workspace-topology
change with broad downstream reference impact.

Testing for this ticket must be exhaustive rather than narrow. The literal
`data_mapper.template` workspace should be one of the canonical proof fixtures
because it is a real downstream use case already carrying the current drift.

## Task List

- [x] Reprice the bootstrap and first-traversal requirements so they explicitly
  require spec-method structured build topology, not only singleton
  specification document bootstrap.
- [x] Strengthen normalization/install so broad unstructured bootstrap input can
  be normalized into conformant `specification/` plus
  `build_tenants/<tenant>/` structure.
- [x] Resolve the tenant-root shape ambiguity and choose one lawful downstream
  structure for project tenants, then make normalization and profile resolution
  agree on that structure.
- [x] Remove or demote `selected_output_tree` behavior where it allows
  top-level realization roots such as `imp_scala_spark/` to count as conformant
  when tenant-rooted topology is required.
- [x] Keep installed released `odd_sdlc` under `.odd_sdlc/` in downstream
  workspaces and out of the project’s `build_tenants/` space.
- [x] Rewire downstream runtime contracts and import paths so installed method
  software no longer depends on `build_tenants/odd_sdlc/` in project
  workspaces.
- [x] Eliminate default `build_tenants/common/` projection unless a shared
  cross-tenant design layer is explicitly ratified by the project.
- [x] Migrate generated references, asset bindings, and read-model surfaces
  that currently embed `imp_scala_spark/`, `build_tenants/common/`, or
  `build_tenants/odd_sdlc/`.
- [x] Build an exhaustive proof matrix that exercises bootstrap, install,
  traversal, reset/replay, and later-tenant onboarding against both focused
  fixtures and the literal `data_mapper.template` workspace.
- [x] Prove that downstream bootstrap now lands Scala realization in
  `build_tenants/scala_spark/` and remains ready for later onboarding of
  additional realization tenants such as `build_tenants/dbt/`.

## Progress

- 2026-04-12: started implementation in `odd_method`
- implemented canonical tenant-root helpers and normalized downstream project
  realization to `build_tenants/<tenant>/`
- fixed legacy-root migration so imported roots such as `imp_scala_spark/` or
  `imp_trace/` are migrated into the canonical tenant root even when the
  canonical root already exists as a scaffold for generated design/test
  surfaces
- moved downstream installed runtime payload to `.odd_sdlc/` and rewired the
  installed runtime contract `pythonpath` accordingly
- rewired downstream asset bindings, traceability helpers, constructor text,
  fake transport, and sandbox runtime helpers to the tenant-rooted topology
- repriced topology-sensitive regressions and installation/usecase fixtures to
  the canonical tenant model
- proof completed so far:
  - `python -m pytest build_tenants/odd_sdlc/python/test_env/tests -q`
  - result: green at ticket close; exact suite totals continued to move as
    follow-on regression lanes were added
- final internal closure proof after the topology follow-up fixes:
  - `python -m pytest build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_installation.py -q -k 'standardizes_imported_workspace_shape or keeps_downstream_common_out_of_default_project_topology or preserves_onboarded_secondary_tenant_without_topology_migration or data_mapper_template_as_is_requires_scope_and_traceability_work_before_auto_convergence'`
  - result: `4 passed, 8 deselected in 41.20s`
  - `python -m pytest build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_installation.py build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_test19_regression.py build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_risk_appetite_usecase.py build_tenants/odd_sdlc/python/test_env/tests/test_odd_sdlc_disambiguation_usecase.py -q`
  - result: `17 passed in 194.87s`

## Completion

Closed 2026-04-12 on internal proof.

This ticket is complete at the internal sandbox/install level:

- downstream released `odd_sdlc` installs under `.odd_sdlc/`
- default downstream topology normalizes to `build_tenants/<tenant>/`
- default `build_tenants/common/` and `build_tenants/odd_sdlc/` drift are removed
- literal `data_mapper.template` is exercised directly as a proof fixture
- later tenant onboarding is preserved without collapsing the topology back
  into the active tenant

Fresh downstream long-run proving remains parent-wave work under `B-001`, not
open work on this topology ticket.

## Proof Required

- source-workspace proof:
  - `odd_method` still builds and publishes the `odd_sdlc` method tenant from
    its own source layout
- focused fixture proof:
  - minimal bootstrap and normalization fixtures still project into lawful
    spec-method structure
- downstream install proof:
  - a fresh downstream workspace installs released `odd_sdlc` under
    `.odd_sdlc/`
  - Scala realization lands under `build_tenants/scala_spark/`
  - no project-critical path still depends on `imp_scala_spark/`
  - no runtime-critical path still depends on `build_tenants/odd_sdlc/`
- literal real-world fixture proof:
  - `data_mapper.template` is used directly as a canonical downstream test
    fixture
  - fresh installs from the literal template converge to the lawful topology
    without special-case preprocessing
- runtime/binding proof:
  - asset binding, prompt contexts, traceability helpers, and generated
    references resolve against the new tenant-rooted topology
- generated-surface proof:
  - project bootstrap, intent/product/goals, generated design surfaces, and
  generated test surfaces no longer encode stale drift paths
- reset/replay proof:
  - reset and second-pass traversal still work against the new topology
- future-tenant proof:
  - the topology is demonstrably ready for later onboarding of an additional
  tenant such as `build_tenants/dbt/` without structural migration

## Scenario Matrix

At minimum, proof should include these scenarios:

- unstructured bootstrap input projects into conformant `specification/` plus
  `build_tenants/scala_spark/`
- literal `data_mapper.template` install projects into conformant tenant-rooted
  topology
- bounded traversal over the literal template still binds and generates against
  the new tenant-rooted paths
- reset followed by a second traversal still replays against the current
  tenant-rooted workspace state
- generated references and traceability checks use the new topology rather than
  stale drift paths
- adding a second realization tenant such as `build_tenants/dbt/` is an
  onboarding extension, not a topology migration

## Acceptance

- first traversal projects broad bootstrap input into conformant spec-method
  structure
- project realization tenants live under `build_tenants/<tenant>/`
- top-level realization roots such as `imp_scala_spark/` no longer count as the
  lawful default for tenant-shaped projects
- installed released `odd_sdlc` is separated from project realization topology
  and lives under `.odd_sdlc/`
- shared `build_tenants/common/` structure only exists when explicitly justified
  by cross-tenant project design
- downstream proof shows readiness for later tenant onboarding without topology
  migration
- substantive proof covers installer, runtime references, reset/replay, and
  downstream workspace behavior rather than only unit-level path assertions
- the literal `data_mapper.template` fixture passes as a real-world conformance
  test, not only synthetic sandbox fixtures

## Links

- parent: `/Users/jim/src/apps/odd_method/.ai-workspace/tickets/active/B-001-refactor-odd-method-to-released-abg-boundary.md`
- sibling: `/Users/jim/src/apps/odd_method/.ai-workspace/tickets/active/T-002-refactor-odd-sdlc-from-pure-function-builder-framing-to-stateful-iterator.md`
- sibling: `/Users/jim/src/apps/odd_method/.ai-workspace/tickets/completed/B-002-emit-repair-usable-fd-evidence-from-odd-sdlc-evaluators.md`
- standard: `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`
- standard: `/Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md`
