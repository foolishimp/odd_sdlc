# STRATEGY: job-bound materialization boundary gap

**Author**: Codex
**Date**: 2026-04-21T09:32:33Z
**Addresses**: `odd_sdlc` T-020, yield sandbox traversal, constructor materialization, GTL job authority
**Status**: Draft commentary, not backlog law

## Summary

Current failure:

- The yield sandbox times out while advancing through the odd_sdlc graph.
- The timeout is not primarily a worker-latency problem.
- The traversal re-enters an already-produced upstream surface because a later
  constructor step deletes the tenant root that contains that surface.

Concrete root cause:

- `derive_code_surface` lawfully runs as a GTL/ABG job for `code_surface`.
- In the yield sandbox, `code_surface` resolves to the tenant root:
  `build_tenants/scala_spark/`.
- The constructor treats that target as an owned generated directory and
  deletes it before writing code.
- That tenant root also contains governance surfaces owned by other graph
  functions, especially `build_tenants/scala_spark/design/`.
- The design surface disappears, ABG sees the graph is no longer converged, and
  the supervisor lawfully calls the upstream worker again.

Operational analogy:

- ABG is the supervisor and immutable governance ledger.
- SDLC is the construction process.
- The filesystem workspace is a mutable building site.
- GTL jobs are work orders.
- The defect is that a worker with a code job currently has a tool that behaves
  like it has a site-wide demolition permit.

## Why This Is Not An ABG Core Bug

ABG does not delete the design surface. ABG records events and derives current
truth from events and projections.

The deletion happens in the odd_sdlc constructor effect shell, which mutates the
filesystem projection after a job has been selected. The immutable event stream
can record what happened, but it does not by itself prevent a destructive
filesystem write.

The failure is therefore at this boundary:

```text
GTL job authority
-> asset materialization contract
-> constructor write/delete plan
-> filesystem effect
-> work report / event evidence
```

The GTL job is necessary but insufficient. It says which graph function may
advance which target asset. It does not yet fully constrain which concrete
paths the constructor may create, overwrite, or delete while realizing that
asset.

## Forensic Evidence From The Yield Sandbox

The timeout archive showed a repeated traversal sequence rather than a single
blocked worker.

Observed opened and closed edges included:

- `derive_intent_surface`
- `derive_product_surface`
- `derive_goal_surface`
- `derive_requirement_surface`
- `derive_feature_decomp_surface`
- `derive_uat_testcases_surface`
- `derive_design_surface`
- `derive_scenario_surface`
- `derive_implementation_design_surface`
- `select_implementation_stack_profile`
- `derive_implementation_module_surface`
- `derive_code_surface`
- `derive_feature_decomp_surface` again

The key symptom is the second `derive_feature_decomp_surface` after
`derive_code_surface`.

That is not normal slow progress. It means the graph saw an upstream surface as
missing again after the code construction step.

The concrete archive under review was:

```text
build_tenants/python/test_runs/yield_handoff_canned_chain/20260421T091059_test_data_mapper_yield_chain_surfaces_asset_event_and_result_truth
```

The archive was enough to identify the destructive re-entry, but the operator
surface was still too weak. The outer failure appeared as a timeout rather than
as a structured no-progress or out-of-bound-materialization violation.

## Direct Release Workaround

For this version, the direct bug fix should be narrow.

Required behavior:

- `code_surface` construction must not delete the tenant root when that root
  also contains governance surfaces.
- The constructor may write or overwrite planned generated code members.
- The constructor must not delete existing entries as part of this release
  workaround; stale generated files are a known deferred cleanup gap.
- The constructor must preserve sibling governance roots such as `design/`,
  `test_env/`, `.ai-workspace/`, `.genesis/`, `specification/`, and `docs/`.
- The constructor work report should expose what was written, what was removed,
  and what was preserved.

This is a release-safe workaround because it prevents the destructive loop
without pretending the full job-bound write model is already complete.

The minimum proof should be:

- Seed a tenant root with an existing `design/20-generated-feature-decomp.md`.
- Run `construct_manifest(...)` for `target_asset = "code_surface"`.
- Assert the design file still exists after construction.
- Assert the code surface still satisfies its generated asset contract.
- Assert the work report records a no-delete policy, no removed entries, and
  preserved existing entries.

## Deferred Gap

The deeper gap should be considered for backlog after review.

Candidate gap statement:

```text
GAP: GTL job authority is not yet projected into a path-level
materialization boundary.

Current mitigation: code_surface construction protects known governance roots
and records materialization evidence.

Target closure: every traversal job emits or references a typed materialization
plan with owned write paths, allowed delete paths, protected sibling assets,
and failure behavior for out-of-bound mutation. The effect shell refuses to
execute a plan that exceeds the job boundary.
```

## Proposed Future Architecture

The full solution should introduce a first-class materialization plan, not more
ad hoc path exceptions.

The plan should include:

- `job_id`, `edge`, `target_asset`, and `graph_function_id`.
- Owned write roots.
- Owned delete roots.
- Explicit protected roots.
- Planned writes.
- Planned deletes.
- Preflight checkpoint of protected roots.
- Postflight checkpoint of protected roots.
- Failure classification when a planned effect crosses authority.

The effect shell should run in this order:

1. Build the materialization plan without touching disk.
2. Validate the plan against the GTL job and asset materialization contract.
3. Reject out-of-bound deletes before mutation.
4. Execute writes and deletes.
5. Re-check protected roots.
6. Emit the work report and runtime event.

The important rule is that path authority must be derived from the job plus the
asset contract, not from whatever directory happens to contain the target.

## Review Questions Before Backlog

Questions to resolve before creating a ticket:

- Is `code_surface` allowed to be the tenant root for planned output trees, or
  should generated code always have a narrower owned subtree?
- Should governance roots be protected by name, by asset registry membership,
  or by a typed workspace ownership map?
- Should out-of-bound mutation become an ABG event, an odd_sdlc constructor
  error, or both?
- Should no-progress traversal detection be an ABG runtime responsibility or an
  odd_sdlc live-test harness responsibility?
- Should the first architectural ticket be about materialization plans, or
  about making `asset_path(...)` distinguish asset root from owned write root?

## Non-Goals For The Immediate Fix

The immediate fix should not:

- redesign GTL jobs
- redesign ABG traversal
- claim filesystem assets are immutable
- add a timeout workaround
- hide the repeated traversal by accepting stale convergence
- convert the tenant root into one monolithic owned asset

The immediate fix should only stop one worker from deleting another worker's
surface.

## Backlog Candidate

Possible future ticket title:

```text
Publish job-bound materialization plans for odd_sdlc constructor effects
```

Likely change class:

```text
design_reframe
```

Likely re-entry point:

```text
design_surface
```

Reason:

- Requirements can remain stable: graph jobs advance assets and evidence must
  remain attributable.
- The realization structure changes: constructor effects become planned and
  job-bound before filesystem mutation.

Closure law for the future ticket:

```text
No graph job may create, overwrite, or delete a filesystem path outside the
materialization boundary admitted for its target asset. A worker damaging a
sibling asset is a construction violation, not a new SDLC gap.
```

## Current Recommendation

Do the narrow constructor fix now. Capture the full job-bound materialization
model as a reviewed gap before adding it to backlog.

The release should not ship with `derive_code_surface` able to delete
`design/`. The release also does not need the full typed materialization-plan
architecture if the workaround is explicit, tested, and tracked as a known
design gap.
