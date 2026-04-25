# odd_sdlc Realization Root

`odd_sdlc` is the project's primary software-domain realization.

Its `WHAT` is defined under `specification/`.

This root is the current `HOW` for that governed domain.

This root holds the executable asset/function slice:

- tenant-local code under `code/`
- tenant-local design under `design/`
- tenant-local proving surfaces under `test_env/`

Run the tenant from the repo root with:

```bash
PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code python -m odd_sdlc catalog --workspace .
PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code python -m odd_sdlc query-domain --workspace .
PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code python -m odd_sdlc gaps --scope workspace --workspace .
PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:build_tenants/python/code python -m odd_sdlc start --scope workspace --target next --until converged --fh-mode human-proxy --root-mode supervised --workspace .
```

The source repository does not depend on repo-root `.genesis/`. Installed
`.genesis/` payloads are produced only inside downstream or sandbox workspaces.

Public operator contract:

- `odd_sdlc gaps --scope ...` observes current graph/worksite truth
- when the operator says `start`, use the maximum-autonomy profile:
  `odd_sdlc start --scope workspace --target next --until converged --fh-mode human-proxy --root-mode supervised`
- `start --until converged` requires an admitted F_P worker attachment through
  `transport_contract`; without it the command returns
  `blocking_reason=fp_worker_unattached`
- `odd_sdlc start --scope ... --target next|graph_function:<published_handle>|asset:<published_handle> --until ...`
  remains available as the advanced override form for a specific published
  target contract
- `odd_sdlc query-domain` publishes the governing `start_target_catalog` and
  `asset_ownership_index` surfaces consumed by `graph_function:` and `asset:`
  target handles
- triaged ticket/work-item starts reuse the same `asset:` family as
  `asset:ticket/<ticket_id>` when that handle is published in
  `asset_ownership_index`
- typed sandbox/build/test/deployment commands remain separate operational
  surfaces rather than alternate graph-advancement verbs
