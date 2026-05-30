# Tenant Registry

`build_tenants/` is the project-owned realization root beneath the project
specification.

This file is the canonical registry surface for realization roots and their
activity state.

The constitutional `specification/` surface is singleton project truth.

`specification/` defines `WHAT`.

`build_tenants/` records the `HOW` that realizes that truth.

## Structure

- `common/` holds shared realization/design law adopted across realizations.
- `python/` is disabled and retained only as legacy discovery/comparison
  evidence.
- `typescript/` is the active ODD-native TypeScript build line for
  `odd_sdlc`.
- additional tenant-local roots may be added alongside when a realization needs
  law that should not remain common.

## Registry

| Entry | Kind | Path | Status | Notes |
| --- | --- | --- | --- | --- |
| `common` | shared root | `build_tenants/common/` | Active | Shared realization root |
| `python` | disabled legacy realization | `build_tenants/python/` | Disabled | Retained as legacy discovery/comparison evidence only; not an active operator, install, gap, start, or qualification surface |
| `typescript` | tenant realization | `build_tenants/typescript/` | Active | ODD-native TypeScript line over the singleton specification; Python is discovery evidence, not architecture authority |
| `odd_service` | service realization | `build_tenants/odd_service/python/` | Incubating | Proposed enduring orchestration plane above `odd_sdlc`, still subordinate to ABG runtime truth |

## Active Focus

`python/` is disabled. It remains in the repository as legacy discovery and
comparison evidence, but current work must not treat Python commands, installer
paths, gap/start behavior, or merge-conflicted Python source as the active
operator surface.

`typescript/` is the active realization line for the ODD-native TypeScript
tenant.

`common/` is the shared realization root.

`odd_service/` is the current incubating service line.
