# odd_sdlc Realization Root

`odd_sdlc` is the first live software-domain realization on the `odd_method`
line.

Its `WHAT` is defined under `specification/`.

This root is one current `HOW` for that governed domain.

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
