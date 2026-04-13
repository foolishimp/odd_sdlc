# STRATEGY: Preserve Builder Direction, Separate Runtime Boundaries

**Author**: codex
**Date**: 2026-04-13T02:37:50Z
**Addresses**: Architectural instability introduced while landing `T-002`, `T-003`, and preparing `T-004`
**Status**: Draft

## Executive Summary

The current instability does not mean the new `odd_sdlc` direction is wrong.

The stateful-iterator framing is the right correction.

The realization-deepening rule is the right correction.

The realized-test-source obligation is the right correction.

The planned homeostatic gap-triage direction in `T-004` is also the right correction.

What is going wrong is the architectural embedding.

Too much of the system is currently coupled through one path:

- module construction
- workspace mutation
- runtime-context publication
- ambiguity refresh
- requirement-closure refresh
- topology recovery
- source-workspace and installed-workspace adaptation

That coupling is what makes small design changes feel system-wide and unstable.

So the right move is not to abandon the builder-control redesign.

The right move is to preserve the semantic direction and refactor the operational boundaries.

## Position

`odd_sdlc` is on the right track semantically and on the wrong track architecturally.

In short:

- keep the builder-law redesign
- stop embedding analysis, mutation, and recovery logic inside runtime module construction
- stop asking one resolver to serve both source-repo migration and installed-workspace execution
- make workspace root selection and workspace mode explicit, not heuristic at runtime

## What Is Working

The design documents under `build_tenants/odd_sdlc/python/design/fp/` are coherent and mutually reinforcing.

### 1. Stateful Iterator Control Is Correct

`STATEFUL_ITERATOR_CONTROL_FRAME.md` correctly rejects the older one-shot pure-function framing.

The builder should operate over the evolving workspace asset, not a giant serialized input object.

That is the correct abstraction for real project work.

### 2. Realization Deepening Is Correct

`REALIZATION_DEEPENING_CONTROL_FRAME.md` correctly identifies the main failure mode of agentic build systems:

- lateral expansion without deepening shallow existing realization

Treating existing files as obligations rather than proof is the right operating law.

### 3. Realized Test Source Obligation Is Correct

`REALIZED_TEST_SOURCE_OBLIGATION.md` is also correct.

Archive claims without realized test source are not genuine closure.

That is a healthy correction to paper-only completion.

### 4. Homeostatic Gap Triage Is Correct

`T-004` is aiming at the right missing capability.

The system does need a first-class triage product that can distinguish:

- implementation gaps
- test gaps
- design gaps
- requirement gaps
- constitutional insufficiency

So the design intent is not the problem.

## Where The Architecture Went Wrong

The instability comes from mixing four different responsibilities into one runtime seam.

### 1. Module Construction Is Doing Too Much

`build_tenants/odd_sdlc/python/code/odd_sdlc/gtl_module.py` currently makes module construction impure.

`_build_module()` does not just build a `Module`.

It also:

- writes runtime builder contexts
- refreshes the requirement-closure register
- refreshes ambiguity state
- configures graph functions based on the current mutable workspace

That means the act of obtaining the runtime module is also a workspace mutation and analysis pass.

This is the main architectural smell.

`Module` construction should be a pure projection from already-known domain/runtime state.

It should not be the place where the workspace is repaired, analyzed, or republished.

### 2. Runtime Execution And Workspace Publication Are Coupled

Today the runtime path and the publication path are effectively the same path.

The runtime wants a stable executable module.

The publication path wants to:

- inspect the workspace
- publish context files
- refresh registers
- record ambiguity

Those are both legitimate responsibilities, but they should not happen through the same entrypoint.

When they are coupled, every runtime touch becomes an implicit rebuild of workspace truth.

That is why imports, test collection, install verification, and topology review can all destabilize one another.

### 3. Topology Recovery Is Serving Two Masters

`project_profile.py` is trying to solve both of these problems:

- normal runtime resolution for an already-governed workspace
- migration/recovery when a workspace has drifted or still carries legacy structure

Those are not the same job.

Heuristic candidate scoring and root recovery are acceptable in:

- install
- normalize
- explicit migration or recovery tooling

They are much less acceptable as the default runtime rule for selecting the active realization root.

Runtime should primarily consume an explicit authoritative selection.

Migration logic may suggest or repair a selection.

Those are different phases.

### 4. Source Workspace And Installed Workspace Are Being Treated As One Kind Of Thing

This is the other major instability source.

The `odd_method` source repo is not the same kind of workspace as an installed target project.

The source repo contains:

- the evolving governance package itself
- its own tests
- its own design assets
- migration-era topology debt

An installed target workspace contains:

- a governed target project
- an embedded `odd_sdlc` package
- published runtime and analysis artifacts

Trying to make one profile-resolution path and one module-build path cleanly span both has produced too much complexity and too much hidden coupling.

## Core Thesis

The semantic control frame should remain stateful and ontology-first.

The runtime architecture should become phase-separated and explicit.

That means four distinct layers.

### Layer 1. Domain Law

This is the builder law.

Examples:

- stateful iterator control
- realization deepening
- realized-test-source obligation
- gap-triage taxonomy

This layer defines how work should be reasoned about.

It should be stable, explicit, and mostly independent of installation or topology migration mechanics.

### Layer 2. Workspace Analysis

This layer inspects a workspace and produces durable analysis artifacts.

Examples:

- ambiguity register
- requirement-closure register
- topology summary
- selected-root report
- future gap-triage report

This layer may write files, but it should do so explicitly through refresh/query commands, not through runtime module construction.

### Layer 3. Workspace Normalization And Migration

This layer is allowed to repair or canonicalize workspace shape.

Examples:

- installation
- normalization
- tenant-root migration
- workspace bootstrap publication

This is where heuristic topology recovery belongs.

It should not silently remain active as a default runtime behavior forever.

### Layer 4. Runtime Execution

This layer should be boring.

It should:

- read the chosen workspace mode and selected root
- read published analysis artifacts
- construct a stable `Module`
- execute traversal

It should not be discovering reality from scratch every time.

## Recommended Architectural Shift

### 1. Make `Module` Construction Pure

`gtl_module._build_module()` should stop writing files and stop refreshing registers.

Instead:

- `refresh_requirement_closure_register()` should be called by explicit refresh/query flows
- ambiguity refresh should be called by explicit refresh/query flows
- runtime builder context publication should happen during install/normalize or explicit refresh

The runtime may read those artifacts.

It should not republish them on import or scope construction.

### 2. Introduce An Explicit Workspace State Surface

The runtime needs a single durable surface that says, at minimum:

- workspace mode: `source_domain_repo` or `installed_target_workspace`
- selected realization root
- declared realization root
- resolution reason
- migration status

This should be a published artifact, not an emergent conclusion recomputed opportunistically at runtime.

Runtime can refuse or warn when the workspace is stale relative to that artifact.

But runtime should not be constantly renegotiating authority.

### 3. Restrict Heuristic Root Recovery To Migration Phases

`project_profile.load_project_profile()` should prefer explicit selected state.

If topology recovery is needed, it should happen under one of these conditions:

- install
- normalize
- explicit `repair-topology`
- explicit `refresh-analysis --allow-recovery`

That keeps recovery available without making it the ambient runtime rule.

### 4. Separate Source-Repo Rules From Installed-Workspace Rules

The source repo should have its own explicit operating mode.

That mode can admit transitional topology and sibling realization trees because the repository is developing the domain package itself.

Installed workspaces should be much stricter.

They should have:

- one authoritative selected tenant root
- one runtime contract
- published context surfaces
- no migration heuristics needed during ordinary execution

Trying to keep both under one undifferentiated runtime policy has caused much of the recent instability.

### 5. Let `gaps()` Consume Triage, Not Invent It Inside The Runtime Path

`T-004` should land after the boundary cleanup, not before it.

The right implementation shape is:

1. explicit analysis pass produces local mismatch/triage artifacts
2. runtime `gaps()` reads those artifacts and presents the governed result
3. traversal/routing uses the triage output to choose the next lawful vector

That is better than pushing more semantic interpretation into the current module-build path.

## Concrete Near-Term Plan

### Phase 1. Stabilize The Runtime Boundary

Goal:

- runtime no longer mutates the workspace during module construction

Actions:

- remove file writes from `gtl_module._build_module()`
- remove register refresh from `gtl_module._build_module()`
- keep `module(workspace_root)` as a pure runtime projection

Success signal:

- importing `odd_sdlc.app` or constructing `OddSdlcApp.scope()` does not rewrite workspace artifacts

### Phase 2. Publish Explicit Workspace-State Artifacts

Goal:

- runtime reads an authoritative workspace-state record

Actions:

- add a durable workspace-state artifact under `.ai-workspace/runtime/`
- record selected root, declared root, workspace mode, and resolution reason
- make `query-domain` expose that state directly

Success signal:

- root selection is explainable from a single published source of truth

### Phase 3. Move Topology Recovery To Explicit Operations

Goal:

- runtime resolution becomes deterministic and boring

Actions:

- keep candidate scoring only in normalization/repair commands
- make runtime refuse or warn on unresolved topology ambiguity rather than silently switching roots

Success signal:

- a runtime invocation cannot silently rebind the code root due to incidental sibling trees

### Phase 4. Re-land T-004 On Clean Boundaries

Goal:

- homeostatic gap triage lands on top of stable analysis surfaces

Actions:

- produce per-edge triage artifacts from explicit analysis
- route `gaps()` through those artifacts
- keep ABG as substrate and keep triage semantics in `odd_sdlc`

Success signal:

- gap output distinguishes code/test/design/requirement/constitutional insufficiency without destabilizing runtime execution

## Decision Rule

The design should not be rolled back.

But it should be recontained.

If the next implementation wave continues to push:

- workspace mutation
- topology recovery
- analysis publication
- and semantic routing

deeper into module construction and runtime import paths, instability will continue.

If instead the next wave preserves the builder-law design while separating:

- domain law
- analysis publication
- normalization/migration
- runtime execution

then the current direction should converge.

## Final Recommendation

Stay with the new builder-control direction.

Change the architectural approach.

The right strategic statement is:

`odd_sdlc` should be a stateful governed builder at the semantic layer, and a boring explicit runtime at the execution layer.

That means:

- no ambient topology recovery during ordinary runtime execution
- no import-time or module-build-time workspace mutation
- no hidden renegotiation of the active realization root
- explicit workspace-state publication
- explicit analysis refresh
- explicit migration/normalization phases

This preserves the important conceptual gains of `T-002` and prepares a much safer foundation for `T-004`.
