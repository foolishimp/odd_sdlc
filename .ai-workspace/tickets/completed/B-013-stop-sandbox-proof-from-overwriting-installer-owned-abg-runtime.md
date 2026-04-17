# B-013 Stop Sandbox Proof From Overwriting Installer-Owned ABG Runtime

- id: B-013
- title: Make odd_sdlc sandbox proof use installer-owned ABG runtime as the sole lawful runtime surface
- type: bug
- status: completed
- goal: verification-and-installed-dev-proof
- priority: high
- created_at: 2026-04-17
- updated_at: 2026-04-17
- dependencies: B-005, B-007, B-008, B-009, B-010, B-011

## Triage

- intake: installed-dev proof review / sandbox authority violation / latest-ABG pickup defect
- lawful_change_class: realization_refactor
- affected_boundary: odd_sdlc sandbox and live qualification harnesses, installed-dev proof semantics, and ABG runtime authority inside test workspaces
- lawful_re_entry: sandbox runtime helper topology and regression proof over installed workspace preparation
- downstream_proof_span: targeted sandbox regression plus replay of the odd_sdlc sandbox suite

## Why This Ticket Exists

The odd_sdlc sandbox harness installed a fresh kernel/runtime into the target
workspace and then overwrote `.genesis/genesis` and `.genesis/gtl` from the
repo-root `odd_sdlc/.genesis` copy.

That made the sandbox proof unlawful for the intended question:

- "does existing odd_sdlc pick up the latest ABG via install?"

Instead of proving installer-owned ABG, the harness partially reverted the
workspace back to the repo-local vendored runtime.

This is a tier-1 verification defect because it corrupts the meaning of
installed-dev proof and can mask or reintroduce ABG runtime drift.

There must be one lawful runtime surface in the sandbox:

- the installer-provided `.genesis` owned by ABIogenesis/ABG

## Intended Direction

The sandbox harness must:

- install the runtime via the ABIogenesis installer
- assert that the installed `.genesis` runtime is present
- seed only odd_sdlc-local package and specification surfaces
- never overwrite the installed `.genesis` runtime with repo-local copies

Regression proof must confirm that sandbox preparation leaves the installed
runtime intact and still aligned with the ABIogenesis installer source.

## Task List

- [x] Remove the sandbox helper that copied repo-root `.genesis` runtime content
  into installed workspaces.
- [x] Replace that behavior with an explicit assertion that installer-owned
  `.genesis/genesis` and `.genesis/gtl` are present.
- [x] Update the odd_sdlc sandbox and live-codex preparation paths to rely on
  the installed runtime instead of repo-root vendoring.
- [x] Add a regression test that proves sandbox preparation preserves the
  installer-owned ABG runtime and does not drift from the ABIogenesis installer
  source.

## Acceptance

- sandbox preparation no longer copies runtime files from `odd_sdlc/.genesis`
- installed workspace `.genesis` remains the sole lawful runtime surface in
  sandbox proof
- odd_sdlc package/design seeding still works without overwriting ABG
- regression proof fails if sandbox preparation mutates installed
  `.genesis/genesis/transport.py`

## Completion Notes

- removed `seed_local_genesis_runtime(...)` and the repo-root `.genesis`
  runtime copy path from `sandbox_runtime.py`
- replaced it with `assert_installed_genesis_runtime(...)`
- updated both `test_odd_sdlc_sandbox_usecase.py` and
  `test_odd_sdlc_live_codex.py` to rely on the installer-owned runtime
- added a regression asserting that sandbox preparation preserves the installed
  runtime and that the resulting `transport.py` still matches the ABIogenesis
  installer source
