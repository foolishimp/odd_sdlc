# odd_sdlc RC Checkpoint 20260425T192604Z

## Identity

- checkpoint: `odd_sdlc-rc-checkpoint-20260425T192604Z`
- product: `odd_sdlc`
- source base before checkpoint: `015120e`
- scope: current `main` source state after the B-051 through B-067 data_mapper RC repair wave
- status: checkpointed RC candidate state, not a final `v1.0.0` release cut

## Closed Work Span

This checkpoint records the source state that completed:

- imported intent carry-forward before first-run triage
- sequence-shaped policy-bundle reference admission
- bare `gaps` and bare `start` operator contracts
- F_P worker attachment contract publication
- v3.2 project-constraints canonicalization
- data_mapper traversal, route admission, generated traceability, topology preservation, governed tests, operational build proof, deployment/runtime projection, and behavioral depth restoration
- ODD SDLC ABG boundary and module topology publication

The active ticket directory is intentionally empty for this wave; B-051 through
B-067 are filed under `.ai-workspace/tickets/completed/`.

## Checkpoint Proof

Source checks:

- `python -m py_compile build_tenants/python/code/odd_sdlc/constructor.py build_tenants/python/code/odd_sdlc/requirement_closure.py build_tenants/python/code/odd_sdlc/repair_frontier.py build_tenants/python/code/odd_sdlc/app.py build_tenants/python/code/odd_sdlc/gap_dossier.py build_tenants/python/code/odd_sdlc/public_start_contract.py build_tenants/python/code/odd_sdlc/operational_dispatch.py`
  - result: pass
- `git diff --check`
  - result: pass
- `PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_fd_evidence.py -q`
  - result: `29 passed in 0.58s`
- `PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_installation.py -q`
  - result: `41 passed, 2 skipped in 336.53s`
- `PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code:build_tenants/python/test_env/tests python -m pytest build_tenants/python/test_env/tests/test_odd_sdlc_sandbox_usecase.py -q -k 'external_spark_submit or dispatch_operational_runs_declared_local_bindings_end_to_end'`
  - result: `2 passed, 12 deselected in 252.60s`

Installed data_mapper proof:

- clean workspace: `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test45`
- installed `odd_sdlc` from the current source line
- `sbt clean assembly` completed through governed operational dispatch with exit code `0`
- `sbt test` completed through governed operational dispatch with exit code `0`
- JUnit parse observed `14` report files, `103` tests, `0` failures, `0` errors
- final `odd_sdlc gaps --scope workspace --format json` returned `converged: true`, `summary.gap_count: 0`, and `mixed_truth_classes: false`

## Evidence Boundary

This checkpoint accepts construction and local operational proof for the
data_mapper RC line.

Deployment and runtime return remain at governed pending-external-evidence
state because the declared substrate is `spark-submit`. That is not a false
closure; it is recorded as:

- deployment binding: `external_spark_submit`
- deployment result status: `pending_external_evidence`
- runtime completion state: `construction_complete_pending_execution`

External live-agent, OAuth-dependent, network-dependent, and real
Spark-cluster execution lanes are outside this offline checkpoint.

## Assertion Correction

The release check corrected one stale B-052 installation assertion. A fake F_P
worker may advance through policy-bundle admission and construct upstream
surfaces, but it must not close `derive_build_execution_result_surface` when a
declared build contract lacks successful operational dispatch evidence. The
expected stop is now a yielded proof failure with
`build_execution_evidence_missing`, not converged runtime/retrofit closure.
