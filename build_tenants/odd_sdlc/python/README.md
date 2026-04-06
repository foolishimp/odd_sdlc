# odd_sdlc Tenant Root

`odd_sdlc` is the first live tenant package on the `odd_method` line.

This root holds the first executable asset/function slice:

- tenant-local code under `code/`
- tenant-local design under `design/`
- tenant-local proving surfaces under `test_env/`

Run the tenant from the repo root with:

```bash
PYTHONPATH=.genesis:build_tenants/odd_sdlc/python/code python -m odd_sdlc catalog --workspace .
PYTHONPATH=.genesis:build_tenants/odd_sdlc/python/code python -m odd_sdlc query-domain --workspace .
PYTHONPATH=.genesis:build_tenants/odd_sdlc/python/code python -m odd_sdlc gaps --workspace .
PYTHONPATH=.genesis:build_tenants/odd_sdlc/python/code python -m odd_sdlc start --workspace .
```
