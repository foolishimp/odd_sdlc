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
PYTHONPATH=.genesis:build_tenants/python/code python -m odd_sdlc catalog --workspace .
PYTHONPATH=.genesis:build_tenants/python/code python -m odd_sdlc query-domain --workspace .
PYTHONPATH=.genesis:build_tenants/python/code python -m odd_sdlc gaps --workspace .
PYTHONPATH=.genesis:build_tenants/python/code python -m odd_sdlc start --workspace .
```
