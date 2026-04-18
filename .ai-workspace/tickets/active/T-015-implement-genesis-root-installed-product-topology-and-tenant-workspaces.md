# T-015 Implement `.genesis`-Root Installed Product Topology And Tenant `workspaces/`

- id: T-015
- title: Move installed odd_sdlc payload from `.odd_sdlc/` to `.genesis/odd_sdlc/` and implement the repriced tenant-workspace topology
- type: feature
- status: active
- goal: topology-and-installed-runtime-governance
- priority: high
- created_at: 2026-04-18
- updated_at: 2026-04-18
- dependencies: T-013, abiogenesis B-013

## Current Authority

`T-015` is now the active implementation wave for the topology law repriced in
`T-013`.

This ticket no longer asks whether installed odd products *should* live under
`.genesis/<odd_product>`. That is already decided.

The active work is:

- finish migrating installed/runtime code and proof surfaces from `.odd_sdlc/`
  to `.genesis/odd_sdlc/`
- prove that the installed topology is live on current runtime paths
- decide the minimum lawful tenant `workspaces/` mechanics actually required by
  the active proof lanes, instead of leaving that layer vague

## Triage

- intake: follow-on implementation after topology reprice
- change_intent: make the current install/runtime/code surfaces conform to the repriced `.genesis`-root installed topology and the tenant-local `workspaces/` instance model
- lawful_change_class: realization_refactor
- affected_boundary: odd_sdlc installer layout, runtime contract paths, normalization, analysis, sandbox helpers, self-test, installed proof lanes, and any active path assumptions about `.odd_sdlc/`
- lawful_re_entry: product/requirement topology is already repriced in `T-013`; re-enter at install/runtime design and implementation surfaces, then prove on installed workspaces
- downstream_proof_span: fresh downstream install, installed runtime calls, sandbox/workspace proof, and one tenant-workspace flow using the new topology

## Why This Ticket Exists

`T-013` repriced the authoritative topology law:

- `.genesis/` is the immutable installed root
- installed odd products live under `.genesis/<odd_product>/`
- `build_tenants/<tenant>/workspaces/<name>/` is the mutable instance layer

The current implementation originally did not match that law.

This ticket owns the concrete migration from the old installed shape:

- `.odd_sdlc/`
- `.odd_sdlc/release/genesis.yml`
- `.odd_sdlc/python/code`

to the new installed shape:

- `.genesis/odd_sdlc/`
- `.genesis/odd_sdlc/release/genesis.yml`
- `.genesis/odd_sdlc/python/code`

## Delivered In This Wave

The following active implementation surfaces are now migrated:

1. installed odd_sdlc package/design/runtime payload is written under
   `.genesis/odd_sdlc/`
2. generated runtime contract publication uses
   `.genesis/odd_sdlc/release/genesis.yml`
3. installed Python-path publication now includes:
   - `.genesis`
   - `.genesis/odd_sdlc/python/code`
4. install/runtime helper code was repriced to the new installed root:
   - installer
   - analysis
   - project-profile detection
   - self-test
   - sandbox lifecycle
   - fake installed FP agent harnesses
5. authoritative local bootloader surfaces now point at the new installed
   runtime contract
6. focused installed proof slices are green against the new topology

## Remaining Active Defect Set

1. **Tenant `workspaces/` are still only repriced, not yet explicitly
   implemented as a named-instance runtime mechanic**
   - current installed proof lanes operate directly on installed workspaces
   - the topology law now names `build_tenants/<tenant>/workspaces/<name>/`
     as the mutable instance layer
   - the minimum active implementation required by current proof lanes still
     needs to be stated and, if needed, codified

2. **End-to-end proving is only partially replayed**
   - focused installation slices are green
   - focused sandbox preparation is green
   - some longer end-to-end scenarios remain slow/stalled and were not used as
     closure proof for this wave

3. **A few legacy `.odd_sdlc` compatibility references remain outside the
   installed-runtime-critical path**
   - ignore sets and imported-workspace cleanup still mention `.odd_sdlc`
   - these do not currently drive installed runtime behavior
   - they should either be removed or explicitly re-authorized as legacy
     normalization support before closeout

## Candidate Change Surfaces

- [install_topology.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/install_topology.py)
- [release/install.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/release/install.py)
- [sandbox_lifecycle.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/sandbox_lifecycle.py)
- [project_profile.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/project_profile.py)
- [analysis.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/analysis.py)
- [self_test.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/self_test.py)
- [normalization.py](/Users/jim/src/apps/odd_sdlc/build_tenants/python/code/odd_sdlc/normalization.py)
- installed proof lanes under
  `/Users/jim/src/apps/odd_sdlc/build_tenants/python/test_env/tests/`

## Proof Checkpoint

Focused proof already established:

- `test_odd_sdlc_installation.py`
  - `test_install_deploys_runtime_contract_and_enables_genesis_gaps`
  - `test_installed_normalize_workspace_without_platform_preserves_existing_active_tenant`
  - `test_install_release_keeps_downstream_common_out_of_default_project_topology`
  - plus the remaining topology-sensitive install/profile slices
- `test_odd_sdlc_sandbox_usecase.py`
  - `test_sandbox_preparation_preserves_installer_owned_abg_runtime`

The long end-to-end install/sandbox scenarios were not accepted as closure
proof in this wave because they stalled under manual replay and were not needed
to verify the concrete installed-path migration.

## Task List

- [x] Move installed odd_sdlc package/design/runtime payload under
  `.genesis/odd_sdlc/`.
- [x] Reprice the installed runtime contract path accordingly.
- [x] Rewire generated instructions, normalization, and analysis surfaces to
  the new installed topology.
- [x] Rewire sandbox lifecycle and self-test helpers off `.odd_sdlc/`
  assumptions.
- [ ] Decide and implement the minimum lawful tenant `workspaces/` mechanics
  needed by installed proving lanes.
- [x] Reprice installed tests and proving helpers to the new topology.
- [ ] Prove one fresh downstream install and one tenant-workspace flow using the
  new law.

## Acceptance

- installed odd_sdlc payload lives under `.genesis/odd_sdlc/`
- no active installed-runtime-critical path still depends on `.odd_sdlc/`
- runtime-contract and Python-path publication use the new installed root
- installed proving lanes run against the new topology
- tenant-local `workspaces/` are implemented where required by the active proof
  lanes
- source-vs-installed-vs-instance law from `T-013` is reflected in the
  implementation rather than only in the specification

## Links

- topology reprice:
  `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/completed/T-013-reprice-installed-topology-around-genesis-root-and-tenant-workspaces.md`
- self-induction follow-on:
  `/Users/jim/src/apps/odd_sdlc/.ai-workspace/tickets/backlog/T-014-induct-odd-sdlc-source-development-as-an-odd-sdlc-governed-project.md`
