# LLM odd_sdlc Guide

**Status**: Active supporting documentation
**Audience**: LLM-first operator reference, human second
**Purpose**: Bootstrap and orient work on or through the active `odd_sdlc` software-domain package
**Keep Subordinate To**:
- `specification/INTENT.md`
- `specification/PRODUCT.md`
- `specification/requirements/10-odd-sdlc-software-domain-buildout.md`
- `specification/requirements/11-odd-sdlc-homeostatic-gap-triage-and-intent-renewal.md`
- `build_tenants/python/design/SOFTWARE_DOMAIN_BUILDOUT.md`
- `build_tenants/python/design/HOMEOSTATIC_GAP_TRIAGE_AND_INTENT_RENEWAL.md`
- `build_tenants/python/design/QUERY_PLUGIN_CONTRACT.md`
- `build_tenants/python/code/odd_sdlc/__main__.py`
- `build_tenants/python/code/odd_sdlc/app.py`
- `build_tenants/python/code/odd_sdlc/analysis.py`
- `build_tenants/python/code/odd_sdlc/project_profile.py`
- `build_tenants/python/code/odd_sdlc/query.py`
- `build_tenants/python/code/odd_sdlc/query_contract.py`
- `build_tenants/python/code/odd_sdlc/triage.py`
- `build_tenants/python/code/odd_sdlc/software_domain_catalog.py`
- `build_tenants/python/code/odd_sdlc/gtl_module.py`

## 1. Position

`odd_sdlc` is the first live software-domain package on the `odd_method` line.

Read it as a generic software-domain package expressed through GTL graph functions, executed through ABG runtime truth, and built to govern the full software worksite lifecycle across imported, stale, and already-partially-governed workspaces.

The old bootstrap-to-release slice still matters, but only as a bounded proving subset inside the larger software-domain package.

## 2. Hard Boundaries

Keep these boundaries explicit.

### Specification

`specification/` is the only authoritative `WHAT`.

It defines:

- intent
- product position
- goals
- requirements
- scenarios

### Realization

`build_tenants/` is `HOW`.

It carries:

- tenant-local design
- tenant-local code
- tenant-local proving surfaces
- reusable graph-function publications

### ABG

ABG owns runtime truth.

That includes:

- runs
- graph calls
- continuations
- raw event truth
- approval provenance
- causation and lineage

### odd_sdlc

`odd_sdlc` owns software-domain semantics layered over ABG, including:

- asset meaning
- edge contracts
- work-act semantics
- project-profile resolution
- analysis publication
- ambiguity and closure registers
- homeostatic observation, triage, route, and constitutional proposal semantics
- query-domain as a domain overlay

### odd_service

`odd_service` is the incubating orchestration plane. It is not runtime truth. If it exists in the picture, treat it as session, worker, and routing infrastructure above `odd_sdlc`, not as a rival domain constitution.

## 3. Core Mental Model

Treat the project as an active software worksite, not as a tree that becomes unmanaged after code appears.

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

The reverse path is equally first-class:

`observation -> triage -> route -> constitutional proposal -> renewed forward derivation`

This is the center of the current philosophy. `odd_sdlc` is not only about forward generation. It is about staying lawfully inside the same governed line when the workspace, runtime evidence, or closure picture says the current state is insufficient.

## 4. Read The Workspace Before Acting

Before you interpret any code root or try to start work, resolve the workspace shape.

The current workspace modes are:

- `source_domain_repo`
- `installed_target`
- `governed_workspace`
- `unclassified_workspace`

The important distinction is:

- `declared_output_dir` is what the workspace says should be governed
- `selected_output_dir` is what current profile resolution chose as the active governed root

Do not infer the active code root from:

- repository name
- sibling trees
- template lineage
- an old bootstrap guide

Use published workspace state and project profile resolution instead.

## 5. Current Runtime And Analysis Surfaces

An LLM should reason from the current published surfaces, not from ambient filesystem guesswork.

### Workspace State

`.ai-workspace/runtime/odd_sdlc-workspace-state.json`

Use it to answer:

- workspace mode
- readiness
- selected output root
- declared output root
- current project profile
- current analysis fingerprint

### Analysis Manifest

`.ai-workspace/runtime/odd_sdlc-analysis-manifest.json`

Use it to answer:

- which analysis artifacts are current
- which source inputs were fingerprinted
- which root the analysis was published against

### Normalization Report

`.ai-workspace/runtime/odd_sdlc-workspace-normalization.json`

Treat this as normalization/setup evidence, not as the current readiness or current-analysis authority surface.

### Requirement Closure Register

This is the machine-readable record of live requirements, planned realization, and current code or test evidence. It exists so unresolved requirements remain future pressure rather than disappearing after a bounded wave.

### Ambiguity Register

This is the governed register for major ambiguity. Do not invent a second ambiguity regime in prompts or local notes when current ambiguity truth already exists.

### Current Edge Triage

`.ai-workspace/runtime/triage/<edge>.json`

This is the current domain projection for one edge:

- observation
- triage
- route proposal
- route binding
- constitutional proposal when applicable

Historical causation still belongs to ABG events.

## 6. Published Query Surface

The stable domain query contract is `odd_sdlc.query-domain`.

It is a domain overlay, not a replacement runtime model.

`query-domain` is the stable read contract.

`observe` remains a transitional observer composition.

Use `query-domain` to inspect:

- `analysis_manifest`
- `asset_types`
- `asset_families`
- `assets`
- `ambiguity_register`
- `requirement_closure_register`
- `functions`
- `edge_contracts`
- `programs`
- `work_act_types`
- `graph_functions`
- `bindings`
- `gaps`

Do not use it to reconstruct:

- live run lifecycle
- continuation lifecycle
- raw event history
- approval lineage

That remains ABG-native.

Also keep this distinction:

- `query-domain` reads the current domain overlay without publishing new current-edge triage artifacts
- `gaps` computes and publishes the current edge-scoped observation, triage, route, and constitutional projection

## 7. Asset And Edge Model

The live software-domain model is broader than the old first-slice asset list.

Important active asset families and lanes include:

- worksite inputs
- solution design
- implementation branch
- qualification branch
- release readiness
- deployment records
- runtime evidence
- retrofit plans

Use `catalog --workspace .` or `query-domain --workspace .` for the full live function set.

Representative graph functions are enough for cold-start orientation:

- `derive_requirement_surface`
- `derive_design_surface`
- `derive_implementation_module_surface`
- `qualify_testcase_authority`
- `prepare_release_surface`
- `derive_runtime_observation_surface`

There are also retained reusable consensus publications:

- `review_design_consensus_round`
- `review_design_by_consensus`

Those are active GTL graph-function publications, not hidden engine paths. In the current tenant they are still design-scoped, but they remain published as reusable higher-order capability rather than special runtime behavior.

## 8. Current Evaluation Model

`odd_sdlc` is built around explicit edge contracts.

Each edge is expected to declare at least:

- source asset set
- target asset
- transform dependency or profile
- capability dependency where execution or side effects are implied
- preflight `F_D`
- configured `F_P`
- postflight `F_D`
- optional capability or operational `F_D`
- optional `F_H`
- work-report contract
- proof and closure expectations

### Configured F_P

For generic software-domain work, configured `F_P` is the normal constructive carrier.

It must:

- modify the governed target surfaces
- produce a machine-readable work report
- classify the work act it performed
- attach evidence

Assessment prose alone is not enough.

### Layered F_D

`F_D` stays layered:

- `core_fd`
- `capability_fd`
- `operational_fd`

This is how the system distinguishes structural integrity, capability-gated execution, and operational or returned evidence without collapsing them into one opaque check.

## 9. Traceability And Closure

Generated realization is only governed if it remains traceable.

The active minimum chain is:

1. live requirement authority
2. generated implementation or qualification planning surfaces
3. generated source with `Implements:` tags
4. generated tests with `Validates:` tags
5. requirement closure register summarizing what is realized, partial, planned, specified, or missing

Do not treat untagged generated code or tests as closure evidence.

Do not treat partial-wave completion as full closure.

## 10. Homeostatic Gap Model

The current reverse path is generic-first and totalized at the process boundary.

Meaning:

- triage first classifies a `framework_layer`
- then a `framework_condition`
- then refines to `gap_kind`, `reentry_layer`, and action state

Treat the classification as matrix-shaped:

- `framework_layer` is the affected domain or process layer
- `framework_condition` is the kind of pressure or incompleteness at that layer

Current layers in the active implementation include:

- `analysis`
- `capability`
- `ambiguity`
- `intent`
- `product`
- `goals`
- `requirements`
- `design`
- `code`
- `test`
- `execution`
- `routing`

Current conditions in the active implementation include:

- `stale`
- `blocked`
- `missing`
- `contradictory`
- `shallow`
- `insufficient`
- `unproven`
- `unroutable`
- `complete`

Do not collapse these next three names into one field:

- `gap_kind` names semantic mismatch, such as `dependency_gap`, `ambiguity_gap`, `<layer>_gap`, or `unclassified_gap`
- `process_outcome_kind` names the total process outcome
- `route_binding.state` names the routed or gated state now projected for the edge

The current closed `process_outcome_kind` set in code is:

- `converged`
- `advance_fixed_vector`
- `advance_dynamic_family`
- `blocked_stale_analysis`
- `blocked_missing_capability`
- `await_fh_resolution`
- `propose_constitutional_reprice`
- `no_lawful_route`

The important sink behavior is:

- `unclassified_gap` is the default semantic sink when the framework classification is real but no stronger domain-specific gap name is available
- `no_lawful_route` is the explicit tail state when triage cannot lawfully map into a declared next action
- `suppressed_by_mode` is a route state, not a process outcome; it appears when constitutional repricing is recommended but policy suppresses application

No meaningful mismatch should silently fall through into ambient retry or generic code repair.

### Re-entry Layers

The current canonical re-entry layers are:

- `intent`
- `product`
- `goals`
- `requirements`
- `design`
- `code`
- `test`

The key rule is simple:

Once re-entry is named, forward derivation resumes from that layer and flows downstream again. Do not skip the named upstream authority layer.

### Deepening Rule

If shallow realization already exists, the preferred route is usually to deepen that realization rather than expand laterally. This is one of the most important current operator rules.

In the current implementation this is not only a design slogan. Triage can scan governed code or test roots for shallow findings and attach concrete evidence such as:

- `path`
- `excerpt`
- `line_start`
- `line_end`
- finding kinds like `missing_implementation`, `trivial_passthrough`, or `hard_coded_success`

That evidence is what drives `deepen_realization` rather than vague operator intuition.

### Event Chain

The homeostatic layer is projected as current state, but it is emitted as an explicit event chain.

When `gaps` publishes a new current-edge result, the domain sequence is:

1. `observation_recorded`
2. `triage_produced`
3. `route_recorded`
4. `constitutional_proposal_recorded` when repricing is opened

These remain ABG events with explicit causation and correlation. The current-edge triage artifact is the current projection over that chain, not the canonical event history.

### Structured Basis

Each triage result carries two typed evidence bases:

- `authority_basis`: the authority-side reason for the appraisal, including edge, analysis fingerprint, failing evaluators, missing bindings, and re-entry layer
- `realized_basis`: the realized-side situation being judged, including delta, delta summary, environment readiness, work key, and selected output root

These exist so a later LLM or operator can reconstruct why triage happened without relying on prose memory alone.

### Divergence And Supersession

Later triage may supersede the current result for the same edge when the semantic reading changes materially.

The operational rule is:

- one clear current projection exists at `.ai-workspace/runtime/triage/<edge>.json`
- a materially different later result replaces that current projection
- prior meaning stays visible in ABG history
- divergence is surfaced explicitly through the `triage_divergence` event

This keeps the read model simple without pretending prior triage never happened.

## 11. Constitutional Repricing

Gaps that cannot be resolved lawfully beneath current Goals or Intent may open constitutional repricing.

That path is explicit and gated.

Current outcomes remain distinct:

- `approve`
- `approve_with_edits`
- `reject`
- `defer`
- `suppressed`

No semantic triage path may silently apply constitutional change.

## 12. Freshness Law

Published analysis is load-bearing.

If published analysis is stale against current authority or realization inputs:

- the workspace is not ready for `start`
- current route truth is blocked
- lawful re-entry is `refresh-analysis`

Current code fails closed here. `start` does not auto-refresh stale analysis; it requires explicit republishing first.

The current input fingerprint includes tracked specification and realization surfaces, not only one configuration file. Do not trust any current triage, closure, or ambiguity picture if analysis is stale.

## 13. How To Read An odd_sdlc Workspace

Recommended read order for an LLM:

1. `.ai-workspace/runtime/odd_sdlc-workspace-state.json` if present
2. `.ai-workspace/runtime/odd_sdlc-analysis-manifest.json` if present
3. `specification/INTENT.md`
4. `specification/PRODUCT.md`
5. relevant requirement families, especially `10-...` and `11-...`
6. tenant-local design under `build_tenants/python/design/`
7. `python -m odd_sdlc query-domain --workspace .`
8. `python -m odd_sdlc gaps --workspace .`
9. only then constructive or iterative actions such as `start`, `construct`, or `iterate`

If the workspace is imported or stale, treat normalization and analysis publication as part of lawful setup, not as optional housekeeping.

## 14. Current Commands

From an installed or already-available `odd_sdlc` environment:

```bash
python -m odd_sdlc install --target /path/to/workspace --project-slug project_slug --platform python
python -m odd_sdlc normalize-workspace --workspace .
python -m odd_sdlc refresh-analysis --workspace .
python -m odd_sdlc query-domain --workspace .
python -m odd_sdlc catalog --workspace .
python -m odd_sdlc gaps --workspace .
python -m odd_sdlc start --workspace . --auto
python -m odd_sdlc iterate --workspace .
python -m odd_sdlc observe --workspace .
python -m odd_sdlc self-test --workspace .
```

From the source checkout, ensure the source tenant code and `.genesis` are on `PYTHONPATH` before running the same commands.

Use the commands like this:

- `install`: install the released package surfaces into a target workspace
- `normalize-workspace`: install-owned normalization for imported or stale workspaces
- `refresh-analysis`: republish ambiguity, closure, prompt context, workspace state, and analysis manifest
- `query-domain`: inspect the current domain overlay
- `catalog`: inspect the published function, asset, and graph-function catalog
- `gaps`: publish current observation, triage, route, and proposal state
- `start`: enter the current executive proving chain after readiness is satisfied
- `iterate`: continue governed work on the current scope
- `observe`: emit the current observer view

## 15. LLM Operating Rules

When you are the active operator:

- start from published state, not from memory
- confirm workspace mode and selected output root before reading code
- prefer `query-domain` and `gaps` over ad hoc interpretation when current surfaces exist
- treat ambiguity, closure, and triage as governed truth surfaces, not as private scratchpad material
- keep project identity subordinate to imported authority and current specification
- treat runtime return, release, deployment, and retrofit as first-class domain stages
- use the named re-entry layer to decide what to edit next

Use scenario proof anchors when you need to know what is supposed to be real right now:

- `specification/scenarios/12-iterative-requirement-closure-and-generated-traceability.md`
- `specification/scenarios/13-homeostatic-gap-triage-and-intent-renewal.md`

Do not:

- treat `odd_sdlc` as only a bootstrap demo
- treat `query-domain` as runtime truth
- treat stale analysis as good enough
- collapse every mismatch into code repair
- silently rewrite goals or intent
- confuse template provenance with project identity
- certify placeholder or orphaned realization as closure

## 16. Anti-Patterns

Reject these mistakes immediately:

- inferring project identity from README, repo name, or template lineage when imported authority exists
- assuming the visible code tree is the governed code root without checking profile resolution
- serving stale analysis as if it were current domain truth
- treating ambiguity as a reason to invent hidden control flow
- treating `odd_service` or a UI as the runtime authority
- treating consensus harnesses as magic engine behavior instead of inspectable graph-function publications

## 17. Final Rule

If there is tension between imported project authority, `odd_sdlc` governance explanation, and runtime facts:

- imported project authority wins for project identity and project `WHAT`
- `odd_sdlc` wins for software-domain governance semantics
- ABG wins for runtime fact truth

That is the stable frame to keep.
