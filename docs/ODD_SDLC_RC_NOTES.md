# odd_sdlc RC Notes

This note records release-candidate caveats that are understood and accepted
for the current `odd_sdlc` wave.

## Accepted Framework Behavior

### Construction-First, Governed-Evidence Admission

The current `odd_sdlc` release candidate intentionally permits constructive
SDLC progress before execution capability is declared.

That means:

- constructive test and archive surfaces may converge without a declared
  `test_execution_contract`
- observed execution artifacts without a declared execution contract remain
  visible, but are not admitted as governed execution truth
- release and qualification surfaces stay at `pending_evidence` /
  `construction_complete_pending_execution` until declared capability and
  governed returned evidence exist

This is intentional framework policy for the current RC. It preserves
iteration-friendly construction while preventing false closure from ambient
execution artifacts.

### Synthetic Topology Regression Repricing

The synthetic `data_mapper_test19_topology_regression` proving lane is now
aligned to the same policy.

It proves:

- governed realization-root binding
- topology guard application
- traceability-aware adoption of imported implementation assets

It does not claim governed executed-test truth unless the synthetic fixture
declares test-execution capability.

### Requirement Authority Carry-Forward on Installed Workspaces

The current RC now binds the live requirement-closure register into
`derive_requirement_surface` prompt construction and refreshes that register at
module-build time.

This closes the installed-workspace regression where imported authority IDs
could be semantically covered but omitted literally from
`specification/requirements/10-generated-bootstrap.md`, causing
`requirement_scope_complete` to fail closed.

The fix preserves deterministic requirement-ID carry-forward for clean
installed runs without weakening the deterministic F_D gate.

### Installed ABG Boundary Is Now Consumed Through Installer Composition

The current RC consumes the released ABG runtime boundary through
`odd_method`'s installer path rather than through source-runtime mirroring.

That means:

- downstream `.genesis` truth is refreshed only by installer execution
- the `odd_sdlc` proof lanes now run against the released ABG provenance-ready
  runtime boundary
- unresolved non-blocking deterministic findings that remain after a
  constructive continuation now surface as yielded observer fact truth rather
  than as generic runtime failure or a synthetic hard-stop `fd_gap`

### Installed Proof Lanes Now Expect Yielded Observer Handoff For Non-Blocking Post-F_P Findings

The current RC now accepts the repriced ABG handoff envelope.

That means:

- non-blocking deterministic findings that remain after constructive
  continuation may emit `found(kind=fd_findings)`
- the graph call may still lawfully close
- the enclosing run may yield rather than complete when handoff to the next
  observer/routing layer is required
- declared hard-stop policy, safety/config/runtime defects, and explicit
  blocker-class conditions still fail closed

This is now the correct installed-workspace proof shape for non-blocking
post-`F_P` deterministic findings.

### Public Test Branch Shape Is Preserved While Realized Test Traceability Moves Inside Archive Construction

The current RC keeps the published developer-test branch shape stable:

- `derive_test_module_surface`
- `derive_test_run_archive_surface`
- `qualify_testcase_authority`

while moving realized governed developer-test source generation behind the
archive boundary.

That means:

- planned developer-test traceability is still checked at test-module stage
- realized developer-test traceability is checked at archive stage
- empty generated orphan test files are no longer created just to satisfy the
  internal realized-test branch
- the release-record first-slice, synthetic regression, and installed sandbox
  lanes stay aligned to the published graph

## Current Known Limitations

### Traceability Path Resolution Is Still Self-Hosting-Oriented

The current generated traceability and closure logic in
[`traceability.py`](/Users/jim/src/apps/odd_method/build_tenants/odd_sdlc/python/code/odd_sdlc/traceability.py)
still resolves some design and test trace surfaces through fixed
`build_tenants/odd_sdlc/python/...` paths.

That matches the currently published proving subset and the asset contract
surfaces, so the current `odd_sdlc` self-hosting lane is internally
consistent.

It is not yet the fully generalized tenant-profile model.

### Follow-up Direction

The follow-up change should resolve generated trace path discovery through the
active tenant profile:

- `tenant_name`
- `output_dir`
- selected realization/test roots from `ProjectProfile`

That work is a generalization step, not a blocker for the current RC.

## Current Verification Footer

The current release-candidate proving footer is:

- `36 passed`
- `4 skipped`
- `542.71s`

from:

- `python -m pytest build_tenants/odd_sdlc/python/test_env/tests -q`
