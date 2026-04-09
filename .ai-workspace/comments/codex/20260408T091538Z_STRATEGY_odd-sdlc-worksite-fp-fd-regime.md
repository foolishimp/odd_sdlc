# STRATEGY: odd_sdlc Worksite FP/F_D Regime

**Author**: codex
**Date**: 2026-04-08T09:15:38Z
**Addresses**: odd_sdlc methodology direction after the `data_mapper.test19` postmortem; worksite model; supervisory `F_P`; layered `F_D`; generic software-domain asset graph
**Status**: Draft

## Summary

This post describes both current reality and target direction.

Current reality:

- `odd_sdlc` currently models the implementation branch too statically
- it over-relies on placeholder asset bindings under `build_tenants/odd_method/python/...`
- its `F_D` checks in `build_tenants/odd_sdlc/python/code/odd_sdlc/fd_checks.py` are mostly cheap marker and presence checks
- its `F_P` proof path is treated as authoritative once an assessment payload is ingested through `.genesis/genesis/result_ingest.py`
- the method therefore permits a workspace to converge on a false implementation story

Target direction:

- `odd_method` should treat an ODD project as an active worksite, not a static generated tree
- `F_P` should be the configured builder-supervisor for edge traversal in the generic software domain
- `F_D` should be layered: universal core checks, optional specialized deterministic authorities, and mandatory postflight validation over the result of `F_P`
- `odd_sdlc` should remain a general-purpose SDLC asset graph over the software domain, with stronger configured `F_P` and progressively richer deterministic authority as the domain becomes more specific

The `data_mapper.test19` postmortem at `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper.test19/docs/POSTMORTEM_test19_odd_method_process_violation.md` is important because it shows the exact failure that occurs when these principles are not implemented.

## Analysis

### 1. The postmortem shows the current failure mode

The postmortem and forensic trace show that `odd_sdlc` converged on placeholder implementation assets while the real implementation existed elsewhere:

- placeholder `code_surface` binding in `build_tenants/odd_sdlc/python/code/odd_sdlc/workspace_assets.py`
- placeholder code construction in `build_tenants/odd_sdlc/python/code/odd_sdlc/constructor.py`
- placeholder release construction in `build_tenants/odd_sdlc/python/code/odd_sdlc/constructor.py`
- placeholder archive construction in `build_tenants/odd_sdlc/python/code/odd_sdlc/constructor.py`
- marker-oriented deterministic checks in `build_tenants/odd_sdlc/python/code/odd_sdlc/fd_checks.py`

The incident was not simply "bad generation."

It was a methodological break:

- the governed graph converged on the wrong implementation branch
- the method allowed release and evidence surfaces to describe a different reality from the real workspace
- proof passed without deterministic postflight validation over the actual target implementation

That failure matches the absence of the strategy proposed in this post.

### 2. odd_method should treat a project as an active worksite

The correct governing picture is not "generate a few surfaces and declare closure."

The project is an active worksite:

- a shipyard
- a hangar
- a precision-instrument workshop

Work does not end at one generation pass.
The project builds, qualifies, launches, returns with evidence, retrofits, and relaunches.

This matters methodologically because the governed system must model:

- build acts
- adoption acts
- repair acts
- test acts
- runtime-return acts
- retrofit acts

The current `odd_sdlc` branch does not model those strongly enough. It still behaves too much like a surface generator that emits documentary artifacts about work instead of a worksite that governs the work itself.

### 3. F_P should be the builder, supervisor, and problem solver

For the generic software domain, deterministic authority is necessarily incomplete.

That means `F_P` should not be treated as a narrow semantic evaluator only.
It should be treated as the configured supervisory transform on an edge traversal.

In the generic software domain, `F_P` should:

- interpret the edge contract
- update the workspace artifact(s)
- choose among lawful implementation moves
- solve local problems encountered during traversal
- emit a structured work report describing what it actually changed
- explain whether the act was generated, adopted, imported, repaired, or retrofitted

This is consistent with the prompt contract already visible in `.genesis/genesis/binding.py`, which tells the probabilistic worker to update the workspace artifacts and clear deterministic failures before treating work as done.

The problem is that the current proof path does not fully enforce that model. Once an assessment payload is ingested through `.genesis/genesis/result_ingest.py`, `proof_passed` is emitted from the payload result itself. The default proof policy name in `.genesis/genesis/policy_defaults.py` says `rerun_after_fp`, but current runtime behavior does not yet perform the full postflight deterministic recheck implied by that name.

So the current system names the right shape, but does not yet implement it strongly enough.

### 4. F_D should be layered, not weakened

This post does not argue for shrinking `F_D`.

It argues for stratifying `F_D`.

There should be at least four useful layers:

- `Core F_D`: universal checks over bindings, provenance, asset identity, report shape, evidence existence, and cross-surface consistency
- `Capability F_D`: specialized deterministic authorities for a stack, domain, subsystem, or toolchain
- `Postflight F_D`: deterministic validation of what `F_P` claims to have produced or adopted
- `Operational F_D`: deterministic checks over returned runtime evidence, regression evidence, telemetry, and maintenance surfaces

This preserves generality while allowing high-determinism domains to become much stricter than generic software.

Examples of specialized deterministic authority that should remain lawful:

- schema compilers
- lineage analyzers
- migration planners
- data-pipeline validators
- release evidence validators

The method should not lose this flexibility.
It should become better at composing it.

### 5. odd_sdlc should be a general SDLC asset graph over the software domain

GTL/ABG is the substrate.
`odd_sdlc` is one domain graph built on that substrate.

For the generic software domain:

- the asset graph should stay explicit
- the edge contracts should stay explicit
- the transform hook should be configurable per edge
- the evaluator hook should be configurable per edge
- configured `F_P` should do most of the active supervisory work

As the domain becomes more specific:

- the asset graph can become tighter
- the evaluator suite can become more deterministic
- specialized `F_D` can carry more of the proving burden

So the strategic rule is:

- generic software domain: strong graph, strong contracts, strong configured `F_P`, lighter `F_D`
- specialized domain: stronger graph, richer deterministic authorities, narrower `F_P`

This is the right interpretation of "built for all." It does not mean one fixed evaluator model for every domain. It means one regime model that can carry both sparse and rich deterministic authority without changing its constitution.

### 6. The edge should carry both transform dependency and evaluator dependency

The existing model already has the beginnings of this shape.

The strategic next step is to make it first-class and explicit.

Each edge in `odd_sdlc` should declare:

- source asset set
- target asset
- transform dependency or transform profile
- preflight `F_D`
- configured `F_P`
- postflight `F_D`
- optional specialized `F_D`
- output/work-report contract
- proof policy
- closure policy

That gives the SDLC graph a real traversal contract.

It also prevents the system from quietly substituting one implementation branch for another, because the transform report and postflight deterministic checks can validate the exact target that was traversed.

### 7. test19 failed because these principles were missing in practice

The `data_mapper.test19` postmortem is not just an isolated bug report.
It demonstrates what happens when the above regime is not implemented:

- no active worksite model for build, adopt, and retrofit
- no strongly configured `F_P` reporting its real work against the selected tenant
- no postflight `F_D` that rechecks the real implementation and evidence branch
- no domain-lawful distinction between generated code and adopted code
- no deterministic truth check that the release surface matches the actual governed implementation surface

Instead, the system accepted:

- placeholder code
- placeholder archive
- placeholder release narrative

That is precisely the failure this strategy is intended to prevent.

## Recommended Action

1. Reframe `odd_sdlc` design around the active-worksite model and record that direction in supporting strategy before any ratification work.
2. Change the SDLC edge model so transform dependency and evaluator dependency are explicit first-class edge properties.
3. Make configured `F_P` the normal supervisory traversal authority for the generic software domain.
4. Require every `F_P` traversal to emit a structured work report that names:
   - target asset
   - target path or binding
   - operation type
   - input digests
   - output digests
   - evidence refs
   - claimed contracts satisfied
5. Split `F_D` into preflight and postflight responsibilities, and require postflight deterministic validation before `proof_passed`.
6. Preserve and expand specialized deterministic authorities rather than collapsing `F_D` to trivial file checks.
7. Treat adoption, import, retrofit, and production-return evidence as lawful first-class acts in the asset graph.
8. Use the `data_mapper.test19` postmortem as a regression boundary: no future `odd_sdlc` line should be allowed to converge if the real implementation lives outside the governed branch or if release/test evidence diverges from runtime truth.
