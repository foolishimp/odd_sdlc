# odd_method Build Tenants

`build_tenants/` is the project-owned realization root beneath the singleton
shared `specification/` surface.

Use [TENANT_REGISTRY.md](./TENANT_REGISTRY.md) as the canonical registry of
realization roots, tenant families, variants, and lifecycle status.

The current active tenant line is:

- shared realization law in `common/`
- the first live tenant package in `odd_sdlc/python/`
- the incubating service tenant in `odd_service/python/`

The generated `odd_method/python/` scaffold remains deferred bootstrap
reference only.
