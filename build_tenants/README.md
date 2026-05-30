# odd_sdlc Build Tenants

`build_tenants/` is the project-owned realization root beneath the singleton
shared `specification/` surface.

`specification/` defines `WHAT`.

`build_tenants/` contains one or more instances of `HOW`.

Use [TENANT_REGISTRY.md](./TENANT_REGISTRY.md) as the canonical registry of
realization roots, tenant families, variants, and lifecycle status.

The current realization layout is:

- shared realization law in `common/`
- disabled legacy Python discovery/comparison evidence in `python/`
- the active ODD-native TypeScript realization line in `typescript/`
- the incubating service realization in `odd_service/python/`
