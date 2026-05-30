# odd_sdlc Disabled Python Realization Root

This Python realization is disabled.

Its `WHAT` is defined under `specification/`.

This root is retained only as legacy discovery and comparison evidence. It is
not the active operator, install, gap, start, or qualification surface for
current `odd_sdlc` work.

This root holds the executable asset/function slice:

- tenant-local code under `code/`
- tenant-local design under `design/`
- tenant-local proving surfaces under `test_env/`

Do not run this tenant as current project truth. Historical commands from this
root are legacy references only:

```bash
PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code python -m odd_sdlc catalog --workspace .
PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code python -m odd_sdlc query-domain --workspace .
PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code python -m odd_sdlc gaps --scope workspace --workspace .
PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code python -m odd_sdlc start --scope workspace --target next --until converged --fh-mode human-proxy --root-mode supervised --workspace .
```

The source repository does not depend on repo-root `.genesis/`. Installed
`.genesis/` payloads are produced only inside downstream or sandbox workspaces.

Legacy operator notes:

- `odd_sdlc gaps --scope ...` historically observed graph/worksite truth
- the former maximum-autonomy profile was:
  `odd_sdlc start --scope workspace --target next --until converged --fh-mode human-proxy --root-mode supervised`
- `start --until converged` required an admitted F_P worker attachment through
  `transport_contract`; without it the command returns
  `blocking_reason=fp_worker_unattached`
- `odd_sdlc start --scope ... --target next|graph_function:<published_handle>|asset:<published_handle> --until ...`
  was the advanced override form for a specific published
  target contract
- `odd_sdlc query-domain` published the governing `start_target_catalog` and
  `asset_ownership_index` surfaces consumed by `graph_function:` and `asset:`
  target handles
- triaged ticket/work-item starts reused the same `asset:` family as
  `asset:ticket/<ticket_id>` when that handle is published in
  `asset_ownership_index`
- typed sandbox/build/test/deployment commands remained separate operational
  surfaces rather than alternate graph-advancement verbs
