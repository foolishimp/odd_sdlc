# ADR-001 - Maximum Enforceable Python Typing For The odd_sdlc Tenant

**Status**: Active
**Date**: 2026-04-23
**Implements**: `REQ-F-ASSETMODEL-002`, `REQ-F-ASSETMODEL-003`, `REQ-F-ODDSDLC-038`
**Governed By**: `specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md`
**Derives From**: `build_tenants/python/design/SOFTWARE_DOMAIN_BUILDOUT.md`, `build_tenants/python/design/HOMEOSTATIC_GAP_TRIAGE_AND_INTENT_RENEWAL.md`, `build_tenants/python/design/REQUIREMENT_CLOSURE_CARRIER_AND_PROJECTION_BOUNDARY.md`, `build_tenants/python/design/EXECUTION_CONTRACT_SOURCE_CARRIER.md`, `build_tenants/python/design/QUERY_PLUGIN_CONTRACT.md`

## Context

`odd_sdlc` depends on typed carrier law, not on loose Python convenience.

The tenant publishes:

- typed assets and asset bindings
- graph-function carriers
- admitted execution-contract surfaces
- homeostatic observation, triage, route, and constitutional carriers
- query, dossier, and current-state projections

Those surfaces are easy to counterfeit in Python unless the tenant enforces the
strongest static checks it can actually own.

The rejected direction is:

- `Any` or open dict truth crossing the semantic center
- `follow_imports = skip` inside tenant code
- `cast(...)` used as shape creation instead of as post-proof narrowing
- typed envelopes over open payload truth
- package-local modules that are allowed to remain outside the strict lane by
  inertia

This ADR therefore records the strictest lawful typing posture the tenant is
allowed to claim, and it rejects softer tenant-local fallback patterns as
steady-state design.

## Decision

The `odd_sdlc` Python tenant adopts package-wide strict typing for all
tenant-owned modules.

That means:

- tenant modules are required to pass `mypy` under `strict = True`
- no `odd_sdlc.*` module may rely on `follow_imports = skip`
- no `odd_sdlc.*` module may rely on `ignore_missing_imports`
- dynamic ingress is parsed and narrowed at the boundary before semantic
  decisions are made
- downstream read models, query surfaces, and effect shells consume typed
  carriers rather than rebuilding truth from ambient dict payloads

The enforcement shape is:

- `[mypy-odd_sdlc.*] strict = True`
- no tenant-local per-module exemptions beneath that package rule
- external softening limited to foreign namespaces outside tenant authority

The current staged rollout shape is migration debt, not accepted steady state.

## Enforcement Shape

The tenant is only allowed to claim maximum enforceable typing when all
tenant-local modules participate in one package-wide strict lane.

Lawful enforcement means:

- `python -m mypy --config-file mypy.ini -p odd_sdlc` is the tenant proof
  command
- every tenant-owned module under `build_tenants/python/code/odd_sdlc/` is
  checked by that command
- newly added tenant modules enter the package-wide strict lane immediately
- tenant-local per-module whitelists are treated as transitional migration
  scaffolding only

The tenant softens only foreign imports it does not own. It does not soften its
own package and then describe the result as maximum enforcement.

## Semantic-Center Rule

Typing in this tenant is used to enforce a seam that has already been made
real.

Inside the semantic center, the following are design defects:

- `Any`
- `dict[str, Any]` or `Mapping[str, object]` used as authoritative carrier
- `cast(...)` used to create carrier shape
- `# type: ignore`
- progressive TypedDict construction by mutation as a substitute for one closed
  constructor
- helper-owned rescan or reconstruction after a typed carrier already exists

This rule applies to:

- carrier modules
- semantic kernel modules
- route/triage modules
- query and dossier projection boundaries
- operational command/result/current-state boundaries

## Lawful Exceptions

The only lawful soft points are:

- foreign ingress before parse/normalize
- external namespaces outside tenant authority that do not publish usable type
  surfaces yet
- post-validation narrowing where Python cannot infer a proved literal or union
  domain

For the current line, the remaining external carve-outs are limited to:

- `genesis.*`
- `gtl.*`

Those are external import boundaries, not tenant-local exemptions.

`odd_sdlc.release.*` remains tenant-local. It is not a lawful exemption class.

## Carrier Enforcement Rule

The tenant uses closed Python carriers where possible:

- `dataclass`
- `TypedDict`
- explicit union or literal domains
- typed helper carriers for summaries, candidates, and projections

Optionality must be modeled explicitly.

Dynamic input is parsed once at ingress and then carried inward in typed form.
Query, dossier, prompt, and event publication surfaces must consume those typed
carriers rather than reopening the payload into ad hoc dict truth.

## Current Line

The current line already enforces strict typing over much of the primary
carrier and projection boundary:

- public start and execution-contract carriers
- gap, dossier, query, and start-target projections
- homeostatic triage and span-analysis kernels
- project-profile, workspace-asset, traceability, and requirement-closure
  carriers

The package-wide proof command is green on the current line.

On 2026-04-23:

- `python -m mypy --config-file mypy.ini -p odd_sdlc` passed with
  `Success: no issues found in 48 source files`
- `mypy.ini` now enforces one package-wide `[mypy-odd_sdlc.*] strict = True`
  rule
- tenant-local softening is limited to foreign namespaces outside tenant
  authority:
  - `genesis.*`
  - `gtl.*`

This ADR therefore makes three things explicit:

1. that tenant-local strictness is no longer optional design polish
2. that the only lawful claim of "maximum enforceable typing" is package-wide
   strictness under `-p odd_sdlc`
3. that any future uncovered or nonconforming `odd_sdlc.*` module is a design
   regression, not a lawful permanent exception

## Consequences

- refactors must preserve typed producer/consumer seams across modules
- adding a new tenant module without strict typing is a design regression
- a green `mypy` lane is necessary but not sufficient; it remains subordinate
  to authority seam closure, essential carrier consolidation, and typed
  enforcement after proof
- future typing work must preserve the package-wide strict rule for
  `odd_sdlc.*`
- the tenant must not reopen per-module allowlist behavior or describe partial
  strict success as if it were the package-wide proof surface
