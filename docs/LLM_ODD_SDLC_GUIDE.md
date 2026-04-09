# LLM odd_sdlc Guide

**Status**: Active supporting documentation
**Audience**: LLM agents, operator-authors, and reviewers working on or through `odd_sdlc`
**Purpose**: Explain `odd_sdlc` as the live software-domain package on the `odd_method` line
**Derives From**: `specification/INTENT.md`, `specification/PRODUCT.md`, `specification/GOALS.md`, `specification/requirements/10-odd-sdlc-software-domain-buildout.md`, `build_tenants/common/design/ODD_SDLC_TRANSLATION.md`, `build_tenants/odd_sdlc/python/design/SOFTWARE_DOMAIN_BUILDOUT.md`

## 1. Position

`odd_sdlc` is the live software-domain package on the `odd_method` line.

It is not:

- a toy app
- a one-off bootstrap demo
- a language-specific scaffold
- a shadow runtime above ABG

It is:

- a software-domain package expressed through GTL graph functions
- executed through ABG runtime truth
- installed into real workspaces, including inherited and partially structured projects
- designed to govern the full software lifecycle rather than only specification generation

The current package still proves itself through a bounded executable subset, but the governing direction is the full software-domain model, not the old first-slice-only tenant.

## 2. Core Mental Model

Treat a governed software project as an active worksite.

Useful analogies:

- shipyard
- aircraft hangar
- precision instrument workshop

The project is not a generate-once tree that becomes external to the method after code appears.

The governed cycle is:

1. request
2. gate
3. specify
4. design
5. implement
6. qualify
7. release
8. deploy
9. observe
10. return
11. retrofit
12. relaunch

This means:

- release is a transition, not terminal completion
- runtime evidence returns to the same governed line
- repair and retrofit are first-class lawful work, not out-of-band maintenance

## 3. GTL / ABG / odd_sdlc Boundary

The boundary must stay clean.

### GTL

GTL provides:

- graph structure
- graph algebra
- graph functions
- lawful higher-order composition
- publication boundaries

### ABG

ABG provides:

- traversal execution
- event truth
- provenance and lineage
- dispatch and result ingest
- proof and closure execution
- replayable runtime facts

ABG owns runtime truth. `odd_sdlc` must not create a rival runtime.

### odd_sdlc

`odd_sdlc` provides:

- software-domain asset semantics
- software lifecycle edges
- install and normalization for imported workspaces
- configured `F_P` traversal policy for generic software work
- layered `F_D` around that traversal
- software work-act provenance
- software-domain query and catalog surfaces

Software semantics stay here, not in ABG.

## 4. What odd_sdlc Governs

`odd_sdlc` governs software-delivery work over explicit assets and graph edges.

Its subject includes:

- imported project authority
- requests and gates
- intent, product, goals, requirements, design, and scenarios
- implementation profiles and implementation assets
- test design, test modules, testcase authority, and run evidence
- release and deployment
- runtime observation and returned operational evidence
- retrofit and maintenance release

This is intentionally generic within the software domain.

Language-, framework-, and platform-specific behavior belongs in:

- profiles
- bindings
- specialized deterministic authorities

It does not belong in the core domain model as hard-coded branches.

## 5. Installed Workspace Interpretation

When `odd_sdlc` is installed into a workspace, interpret that workspace in this order:

1. imported project authority
2. project-owned normalized read models
3. installed `odd_sdlc` governance surfaces
4. GTL/ABG substrate surfaces

The installed guidance surfaces must keep identity and provenance separate.

For imported projects:

- `specification/INTENT.md` is primary project identity when present
- imported requirement and product documents describe what the project is
- README, template history, old bootstrap commands, and sibling-workspace context are provenance unless imported authority makes them project-defining

The package must not let an agent infer project identity from:

- template lineage
- old bootstrap instructions
- repository naming
- methodology examples

## 6. Asset Model

`odd_sdlc` governs URI-addressed, typed assets with provenance.

Important consequences:

- an asset is not only a file payload
- asset identity is durable
- the visible file tree is a projected checkpoint over constructive history
- mutable assets are allowed, but silent unattributed mutation is not

### Minimum asset-family groups

The active software-domain model includes these family groups:

- request and gate assets
- specification and design assets
- implementation profile and implementation assets
- build and packaging artifacts
- qualification design, testcase authority, run, and report assets
- release and deployment assets
- runtime observation and incident or gap assets
- retrofit and maintenance-release assets

Representative live families include:

- `request_surface`
- `gate_decision_surface`
- `intent_surface`
- `product_surface`
- `goal_surface`
- `requirement_surface`
- `design_surface`
- `implementation_profile_surface`
- `implementation_module_surface`
- `implementation_asset_surface`
- `build_artifact_surface`
- `test_design_surface`
- `test_module_surface`
- `test_run_surface`
- `test_report_surface`
- `testcase_authority_surface`
- `release_surface`
- `deployment_surface`
- `runtime_observation_surface`
- `incident_or_gap_surface`
- `retrofit_plan_surface`
- `maintenance_release_surface`

## 7. Work Acts And Provenance

`odd_sdlc` treats software work as explicit provenance-bearing acts.

The first lawful work-act classes are:

- `generated`
- `adopted`
- `imported`
- `repaired`
- `retrofitted`
- `validated`
- `released`
- `deployed`
- `observed`
- `returned`

The package must distinguish these acts.

It must not silently treat these as equivalent:

- freshly generated implementation
- imported implementation
- adopted implementation
- repaired implementation

They may converge to the same governed target role, but they do not have the same constructive history.

## 8. Edge Contract Model

Each `odd_sdlc` edge is an explicit traversal contract.

The minimum contract surface is:

- source asset set
- target asset
- transform dependency or transform profile
- preflight `F_D`
- configured `F_P`
- postflight `F_D`
- optional `Capability F_D`
- optional `F_H`
- work-report contract
- proof policy
- closure policy

This is the center of the software-domain model.

It keeps traversal explicit while allowing generic software work to remain constructive rather than pretending determinism is always available.

## 9. Evaluator Regime In odd_sdlc

### Configured F_P

For generic software-domain work, configured `F_P` is the normal supervisory transform.

It is expected to:

- interpret the edge contract
- update the actual governed target artifacts
- resolve bounded local build or structure problems inside the declared edge scope
- emit a machine-readable work report
- classify the work act it performed
- attach produced evidence

`F_P` must not reduce to assessment prose alone.

### Layered F_D

`F_D` is stratified.

#### Core F_D

Universal deterministic checks over:

- target binding
- asset identity
- provenance shape
- work-report shape
- evidence existence
- cross-surface consistency

#### Capability F_D

Optional specialized deterministic authorities for a stack or subsystem.

Examples:

- schema compilers
- lineage analyzers
- migration planners
- packaging validators

#### Postflight F_D

Required deterministic validation of what `F_P` claims to have produced, adopted, imported, repaired, or retrofitted.

This ties proof to target truth rather than to assessment prose alone.

#### Operational F_D

Deterministic validation over returned runtime, release, qualification, and maintenance evidence.

### F_H

Human escalation is for unresolved judgment or policy conflict.

It is not the ordinary path for routine structure checks.

## 10. Work-Report Boundary

Every `F_P`-supervised edge is expected to produce a machine-readable work report.

The minimum work-report shape is:

- target asset id
- target binding or path
- work-act classification
- input identity or digest summary
- output identity or digest summary
- evidence references
- claimed contract satisfaction

This report is a domain contract.

It is not a second runtime. ABG remains authoritative for:

- dispatch truth
- ingest truth
- run facts
- proof and closure facts
- continuation truth
- event projection

## 11. Imported Workspace Law

`odd_sdlc` is designed to work over imported and stale workspaces, not only clean scaffolds.

The install-and-normalize path must:

- preserve imported authority
- prepare the workspace for lawful operation
- separate project-owned, install-owned, and substrate-owned surfaces
- avoid rewriting imported truth into false generated truth

Examples of correct behavior:

- keep imported intent as project identity
- bind to a declared implementation root like `imp_scala_spark/`
- adopt or import existing implementation honestly
- treat old bootstrap instructions as provenance only

Examples of incorrect behavior:

- overwrite imported project identity with `odd_sdlc` proving language
- collapse a real project into `odd_sdlc_proving_impl`
- certify placeholder release or test archive surfaces while real implementation truth lives elsewhere

## 12. Current Executive Proving Chain

The current executable proving chain remains important.

It is the first published carrier over the software-domain package, not the whole ontology.

The current chain traverses:

1. `derive_intent_surface`
2. `derive_product_surface`
3. `derive_goal_surface`
4. `derive_requirement_surface`
5. `derive_feature_decomp_surface`
6. `derive_uat_testcases_surface`
7. `derive_design_surface`
8. `derive_scenario_surface`
9. `derive_implementation_design_surface`
10. `select_implementation_stack_profile`
11. `derive_implementation_module_surface`
12. `derive_code_surface`
13. `derive_test_design_surface`
14. `select_test_stack_profile`
15. `derive_test_module_surface`
16. `derive_test_run_archive_surface`
17. `qualify_testcase_authority`
18. `prepare_release_surface`
19. `prepare_deployment_surface`
20. `derive_runtime_observation_surface`
21. `derive_retrofit_plan_surface`

This chain proves that the worksite lifecycle is now represented through the executive carrier, including deployment, observation, and retrofit.

## 13. Query, Catalog, And Runtime Boundary

`odd_sdlc` publishes a machine-readable read model through its catalog and query surfaces.

That read model should expose:

- assets and asset-family descriptors
- work-act descriptors
- edge-contract descriptors
- functions and graph functions
- gap and projection views aligned with ABG

It should not redefine ABG runtime truth.

ABG remains the authority for:

- runs
- calls
- continuations
- event streams
- runtime-derived projections

## 14. Qualification And Forensics

`odd_sdlc` is expected to prove itself through installed-workspace qualification, not only through unit assertions.

The important proving lanes include:

- canonical sandbox qualification
- inherited-workspace install and convergence qualification
- topology regression for imported/foreign realization trees
- live transport qualification lanes
- persistent run archives for significant end-to-end and live lanes

The `data_mapper` inherited-project lane is a core qualification corpus because it exercises:

- real imported authority
- mixed provenance
- first-edge `F_P` dispatch
- tenant-selected realization
- release, deployment, runtime-observation, and retrofit traversal

For significant lanes, the preferred evidence surface is a persistent run archive containing:

- summary
- event log
- manifests
- results
- stdout/stderr
- copied workspace artifacts
- final runtime snapshot

## 15. Anti-Patterns

When reasoning about `odd_sdlc`, reject these anti-patterns:

- treating the package as only a toy bootstrap tenant
- treating release as project completion
- using template provenance as project identity
- certifying placeholder code, test, or release surfaces as if they were real governed truth
- letting `F_P` emit prose while no governed target changes occur
- shrinking `F_D` into trivial marker checks
- pushing software-domain semantics down into ABG runtime defaults
- creating a service or UI layer that becomes a shadow runtime

## 16. Operator Read Order

For an LLM entering an installed imported workspace, the recommended order is:

1. installed workspace governance surface in `CLAUDE.md` or `AGENTS.md`
2. `.ai-workspace/context/project_bootstrap.md`
3. `specification/INTENT.md`
4. `specification/requirements/00-imported-sources.md`
5. imported authority named there
6. normalized `PRODUCT.md` and `GOALS.md`
7. current gaps via `PYTHONPATH=.genesis python -m genesis gaps --workspace .`
8. only then full traversal via `PYTHONPATH=.genesis python -m genesis start --auto --human-proxy --workspace .`

Use README and old bootstrap history later and only as provenance/context.

## 17. Current Commands

Common commands in an installed workspace:

```bash
PYTHONPATH=.genesis python -m genesis gaps --workspace .
PYTHONPATH=.genesis python -m genesis start --auto --human-proxy --workspace .
PYTHONPATH=.genesis python -m odd_sdlc catalog --workspace .
PYTHONPATH=.genesis python -m odd_sdlc query-domain --workspace .
PYTHONPATH=.genesis python -m odd_sdlc observe --workspace .
```

For installation from source:

```bash
PYTHONPATH=/path/to/odd_method/build_tenants/odd_sdlc/python/code:/path/to/odd_method/.genesis \
python -m odd_sdlc install --target /path/to/workspace --project-slug project_slug --platform platform
```

## 18. Final Rule

If there is tension between:

- substrate explanation
- `odd_sdlc` governance explanation
- imported project authority

then imported project authority wins for project identity, `odd_sdlc` wins for software-domain governance, and ABG wins for runtime fact truth.
