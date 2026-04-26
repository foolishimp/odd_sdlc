# odd_sdlc Build Tenants

`build_tenants/` is the project-owned realization root beneath the singleton
shared `specification/` surface.

`specification/` defines `WHAT`.

`build_tenants/` contains one or more instances of `HOW`.

Use [TENANT_REGISTRY.md](./TENANT_REGISTRY.md) as the canonical registry of
realization roots, tenant families, variants, and lifecycle status.

The current active realization line is:

- shared realization law in `common/`
- the first live software-domain realization in `odd_sdlc/python/`
- the active ODD-native TypeScript build line in `typescript/`
- the incubating service realization in `odd_service/python/`
