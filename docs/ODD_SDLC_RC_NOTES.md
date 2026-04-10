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

from:

- `python -m pytest build_tenants/odd_sdlc/python/test_env/tests -q`
