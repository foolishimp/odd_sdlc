---
id: T-052
title: Require ABG-populated installed workspaces for all TypeScript sandboxes
type: feature
ticket_category: rc_quality_gate
status: completed
goal: build-odd-sdlc-typescript-as-odd-native-app
change_intent: Reprice every odd_sdlc.TS sandbox lane so sandbox proof starts from a fresh workspace populated by the ABG TypeScript install surface, not from in-process harness construction alone.
change_class: design_reframe
re_entry_point: design
affected_boundary: TypeScript sandbox lanes, installed-workspace test harness, ABG TypeScript install dependency, sandbox archive evidence
priority: high
triaged_at: 2026-04-26
created_at: 2026-04-26
updated_at: 2026-04-26
completed_at: 2026-04-26
dependencies:
  - T-041
  - T-047
  - T-048
  - abiogenesis/.ai-workspace/tickets/completed/T-076-realize-typescript-abg-installer-for-downstream-sandbox-population.md
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: Operator ruling that all sandboxes must be populated by ABG install before sandbox tests can qualify product behavior.
target_truth: Every odd_sdlc.TS sandbox proves behavior from a fresh ABG-populated installed workspace, with package/install manifest evidence, installed command execution, replay/projection evidence, and archive evidence produced from that installed boundary.
superseded_truth: A harnessed in-process sandbox that archives composed carrier evidence is sufficient sandbox proof for TypeScript RC readiness.
closure_law: This ticket closes only when `npm run test:sandbox` provisions an installed workspace through the public ABG TypeScript install provider, runs the sandbox through installed package/CLI bindings, archives the install manifest plus runtime events, and rejects any sandbox lane that bypasses the installed boundary.
---

# T-052: ABG-Populated Installed Sandboxes

## Problem

Current `odd_sdlc.TS` sandbox tests are useful harnesses, but they are not
installed sandboxes.

The active `test:sandbox` lane builds the TypeScript package in place, creates
in-process ABG/GTL carriers, writes an archive, and proves composed traversal
or outcome-iteration behavior. It does not prove that a fresh target workspace
can be populated by ABG install and then operated through installed package or
CLI bindings.

That leaves a product-proof gap:

- the sandbox archive can pass while install is broken
- public command binding can drift from harness behavior
- `.abiogenesis` / installed runtime manifest truth is not required
- downstream products can accidentally qualify against source-local helpers

## Python Precedent

The Python sandbox line already enforced the stronger boundary.

`odd_sdlc` Python sandbox setup calls `install_kernel_sandbox(...)`, asserts the
installed Genesis runtime, seeds the odd_sdlc package into the sandbox, and then
runs commands through installed subprocess entry points:

- `build_tenants/python/test_env/tests/test_odd_sdlc_sandbox_usecase.py`
- `build_tenants/python/test_env/tests/sandbox_runtime.py`

That means the TypeScript sandbox is currently weaker than the Python proof
line it is intended to replace. This ticket restores that proof class rather
than adding a new optional convenience layer.

## Target Truth

All TypeScript sandbox proof must begin with ABG install.

An `odd_sdlc.TS` sandbox is qualified only when it:

1. creates a fresh target workspace
2. invokes the public ABG TypeScript install provider
3. records installed package, install manifest, runtime identity, and workspace
   root truth
4. runs the sandbox through installed public bindings rather than private
   source-local helper paths
5. archives expected and actual event/projection/lineage evidence from that
   installed boundary
6. fails closed if any sandbox path bypasses ABG install population

## Required ABG Dependency

ABG currently exposes bounded TypeScript install/bootstrap carriers, but the
needed downstream contract is broader and more specific:

- one public TypeScript sandbox install provider
- one reusable installed-workspace fixture/provisioner
- one archive-compatible manifest of what ABG installed
- one package or CLI binding suitable for downstream sandbox runners
- proof that downstream products can consume this without importing private ABG
  test helpers

That upstream work is tracked in:

- `/Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-076-realize-typescript-abg-installer-for-downstream-sandbox-population.md`

## Evaluation Criteria

- `test:sandbox` creates a fresh installed workspace for each sandbox family or
  one explicit reusable installed-workspace fixture with reset proof.
- T-047 pre-refactor sandbox runs from installed workspace truth.
- B-068/B-069 outcome-iteration sandbox runs from installed workspace truth.
- Sandbox archives include ABG install manifest evidence.
- The RC qualification report no longer lists installed-workspace sandbox as a
  non-claim once this ticket closes.
- Any harness-only sandbox is renamed as a harness test and cannot satisfy
  sandbox qualification language.

## Non-Closure Conditions

- `test:sandbox` still passes entirely in-process.
- sandbox code imports private ABG source/test helper paths.
- installed package identity is inferred from a local symlink without install
  manifest evidence.
- archive evidence omits the ABG install manifest and installed command path.
- installed-workspace proof is deferred back into T-041 without a narrower
  sandbox-specific closure.

## Completion Record

This ticket closes the installed-workspace proof gap for the current
`odd_sdlc.TS` sandbox lane.

Implemented surfaces:

- `build_tenants/typescript/test_env/sandbox/abg_installed_workspace.mjs`
- `build_tenants/typescript/test_env/sandbox/test_t047_pre_refactor_sandbox.test.mjs`
- `build_tenants/typescript/test_env/sandbox/test_b068_enterprise_core_outcome_iteration.test.mjs`
- `build_tenants/typescript/test_env/sandbox/test_t052_abg_installed_sandbox_contract.test.mjs`

The shared sandbox fixture now:

- invokes ABG TypeScript `installAbiogenesisTypescript(...)`
- creates a fresh installed ABG workspace under each sandbox archive
- verifies installed `genesis-ts install` command execution
- archives `abg_install/evidence.json`
- archives `abg_install/typescript-installer-manifest.json`
- archives `abg_install/install-manifest.json`
- archives `abg_install/runtime_identity.json`
- archives `abg_install/command_probe.json`
- archives `abg_install/events.jsonl`
- archives `abg_install/projection.json`

The T-052 registry test fails closed if a current TypeScript sandbox test file
does not call `provisionAbgInstalledSandbox(...)` and
`assertAbgInstalledSandboxEvidence(...)`.

Verification:

- `npm run test:sandbox` passed: 6 tests.

Remaining non-claim:

- T-041 still owns full operational Python replacement, live external F_P
  `data_mapper` generation, release-cut packaging, and full live archive
  comparison. This ticket only closes the ABG-populated installed-workspace
  precondition for TypeScript sandbox qualification.
