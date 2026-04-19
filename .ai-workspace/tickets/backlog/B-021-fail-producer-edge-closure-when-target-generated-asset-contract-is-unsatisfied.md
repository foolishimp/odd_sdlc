# B-021 Fail Producer Edge Closure When Target Generated Asset Contract Is Unsatisfied

- id: B-021
- title: Fail producer-edge closure when the produced generated asset does not satisfy its declared contract
- type: bug
- status: backlog
- goal: homeostatic-gap-triage
- change_intent: Make odd_sdlc producer edges certify their own target generated-surface contract so a producing edge cannot converge while its output is structurally invalid and only fail one edge later.
- change_class: design_reframe
- re_entry_point: design
- priority: critical
- severity: sev-1
- intake_source: `data_mapper.test35` forensic run 2026-04-19
- dependencies: related substrate fix in abiogenesis B-017; this domain fix should proceed independently
- affected_boundary: generated asset contracts, F_D evaluator contracts, graph-function edge closure semantics, constructor/live parity for generated software-domain surfaces
- triaged_at: 2026-04-19
- created_at: 2026-04-19
- updated_at: 2026-04-19

## Context

`odd_sdlc` currently evaluates producer edges such as:

- `derive_feature_decomp_surface`
- `derive_uat_testcases_surface`
- `derive_design_surface`

using deterministic checks that validate only the upstream generated
dependencies, not the generated contract of the target surface just produced by
that edge.

In the `data_mapper.test35` regression workspace this produced a false
convergence chain:

1. `derive_uat_testcases_surface` published `edge_converged = true`
2. `derive_design_surface` published `edge_converged = true`
3. the actual generated files still failed
   `assess_generated_asset_contract(...)`
4. the next downstream edge (`derive_scenario_surface`) became the first place
   where deterministic failure surfaced

That is the wrong boundary. The producer edge itself must remain open when its
own target artifact is invalid.

## Evidence

### Current Producer-Edge Check Table

[fd_checks.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/fd_checks.py:43)
currently declares:

- `feature-decomp-dependency-surfaces-present` requires only
  `requirement_surface`
- `uat-testcases-dependency-surfaces-present` requires only
  `requirement_surface`
- `design-dependency-surfaces-present` requires
  `requirement_surface` and `feature_decomp_surface`

The produced target asset is not part of the deterministic closure contract for
the producing edge.

### Constructor Path Already Has The Correct Law

[constructor.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/constructor.py:2179)
already calls
`assess_generated_asset_contract(workspace, target_asset)` and raises when the
constructed asset fails its contract.

So the source line already contains the intended fail-closed behavior. The
drift exists in the live graph/evaluator closure path.

### Reproducer Workspace

The `data_mapper.test35` workspace shows the defect directly:

- [20-generated-uat-testcases.md](/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test35/specification/scenarios/20-generated-uat-testcases.md:1)
  is still not a valid `uat_testcases_surface`
- [30-generated-odd-design.md](/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test35/build_tenants/scala_spark/design/30-generated-odd-design.md:1)
  is still not a valid `design_surface`
- yet `gaps` reports both producer edges with `delta = 0`

The current contract failures come from
[workspace_assets.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/workspace_assets.py:726):

- `uat_testcases_surface`: heading mismatch and marker missing
- `design_surface`: marker missing

## Bug Statement

`odd_sdlc` lets a producer edge converge on the basis of:

- upstream dependency surfaces passing `F_D`
- the worker returning a `fulfilled` F_P assessment

but it does not deterministically require the produced target asset to satisfy
its own generated-surface contract before the edge closes.

This creates two bad outcomes:

1. `gaps` lies at the producing edge and reports closure where the current
   produced surface is not materially admissible
2. downstream edges become the first detector of the producer's bad output,
   which shifts blame and makes triage later and noisier than it should be

This is not a prompt-quality issue. It is a domain evaluator design defect.

## Why This Matters

The current odd_sdlc wave explicitly centers on:

- homeostatic gap triage
- lawful re-entry
- truthful closure pressure over imported workspaces

If a generated surface can be locally invalid while the producer edge still
reports `delta = 0`, the homeostatic loop is reading the wrong truth.

That breaks:

- accurate operator gap analysis
- lawful downstream dispatch gating
- parity between constructor and live runtime behavior
- `data_mapper.*` as the standing regression corpus for inherited-workspace
  qualification

## Required Direction

Producer edges that generate governed surfaces must fail closed on their own
target contract.

The lawful direction is:

1. keep upstream dependency checks
2. add a deterministic producer-side target-contract gate for the generated
   surface being produced
3. ensure `gaps` reflects that failure at the producing edge, not first at the
   downstream consumer edge
4. preserve constructor/live parity so both paths enforce the same generated
   asset contract law

The target-contract gate may be expressed either as:

- explicit target-generated-asset inclusion in the edge's deterministic closure
  contract

or:

- an equivalent post-produce deterministic certification step that is part of
  the producer edge's closure semantics

The important law is the same: no producer edge closes while its current target
surface fails `assess_generated_asset_contract(...)`.

## Acceptance

- `derive_feature_decomp_surface`, `derive_uat_testcases_surface`,
  `derive_design_surface`, and the same producer pattern for later generated
  surfaces do not report `delta = 0` when their current target surface fails
  its generated asset contract
- a fresh `data_mapper.template -> odd_sdlc install -> genesis start --auto`
  reproducer keeps the failing producer edge open when the generated file is
  missing its required heading or marker text
- downstream edges are not dispatched from an invalid generated upstream asset
- constructor and live runtime paths enforce the same fail-closed generated
  asset contract law

## Links

- contract source:
  [workspace_assets.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/workspace_assets.py:274)
- deterministic check table:
  [fd_checks.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/fd_checks.py:43)
- constructor fail-closed behavior:
  [constructor.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/constructor.py:2179)
- regression workspace:
  [data_mapper.test35](/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test35/AGENTS.md:1)
