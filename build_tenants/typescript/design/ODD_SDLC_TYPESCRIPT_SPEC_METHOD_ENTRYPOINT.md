# odd_sdlc TypeScript Product API And ABG Operator Boundary

**Status**: Active
**Date**: 2026-05-07
**Owner Tickets**: `.ai-workspace/tickets/completed/T-058-realize-typescript-public-cli-adapter-over-graph-query-start-surfaces.md`, `.ai-workspace/tickets/active/T-120-realize-retry-local-repair-prompts-from-typed-gap-dossiers.md`, `.ai-workspace/tickets/active/T-194-migrate-typescript-tenant-to-abg-4-0-0-rc-1.md`, `.ai-workspace/tickets/active/T-204-decommission-odd-sdlc-cli-orchestration-surface.md`
**Supersedes**: `ODD_SDLC_TYPESCRIPT_PUBLIC_CLI_ADAPTER.md`
**Implements**: REQ-F-ODDSDLC-040, REQ-F-ODDSDLC-041, REQ-F-ODDSDLC-043, REQ-F-ODDSDLC-051
**Derives From**: `ODD_SDLC_TYPESCRIPT_TENANT_DERIVATION.md`, `ODD_SDLC_TYPESCRIPT_POLICY_SURFACES.md`, `ODD_SDLC_TYPESCRIPT_DETERMINISTIC_TRAVERSAL_STATE_MACHINE.md`

## Purpose

Define the TypeScript product API boundary after T-204.

ABG CLI is the only operator command/control surface for installed `gaps` and
`start`. `odd_sdlc.TS` exposes typed product APIs, policy overlays, package
install/release APIs, and read-model projections consumed by ABG and tests. It
does not publish an SDLC command dispatcher, argv admission surface, serializer,
retry controller, traversal controller, or compatibility facade.

The historical `spec_method/entry.ts` command dispatcher has been deleted.
`workspace_api/entry.ts` hosts commandless workspace product projections; it is
not package law as a command module and is not an operator surface.

## IACS

| Carrier | Owner | Notes |
| --- | --- | --- |
| ABG operator command intent | ABG CLI / installed ABG binding | only command/control ingress for installed `gaps` and `start` |
| `OddSdlcWorkspaceTraversalInput` | `workspace_api/` | typed package API input for product start/gap projections; no command discriminant |
| workspace ticket APIs | `workspace_api/`, `tickets/` | typed ticket projection/admission APIs |
| gaps evaluator priority edge | product policy projection | domain-policy input projected through ABG construction priority carriers, not a command option authority |
| workspace source snapshots | product projection API | read-only filesystem admission into `deriveSdlcSourceInput` |
| project constraints fallback | product projection API | admission default when imported workspace has no project constraints file |
| graph catalog | `graph/` | entrypoint reads only |
| query-domain projection | `projection/` | entrypoint reads only |
| public start outcome | `start/` | entrypoint reads only |
| installed operator start | `operator/installed_operator.ts` | ABG-owned traversal and retry/reentry boundary |
| RC qualification report | `qualification/` | entrypoint reads only |

## Structural Carrier Diagram

```text
operator intent
  -> ABG CLI / installed ABG command binding
      -> ABG runtime command/control, replay, continuation, and traversal truth
      -> odd_sdlc product policy and projection APIs
          -> workspace/deriveSdlcWorkspaceIngressReport
          -> graph/constructSdlcGtlModule
          -> projection/projectSdlcQueryDomain
          -> start/publicStartOnce
          -> operator/executeInstalledOperatorStart
          -> projection/deriveSdlcGapDossier
          -> runtime/deriveOddSdlcConstructionEvaluatorReport
          -> qualification/describeOddSdlcTypescriptRcQualification
  -> ABG-owned runtime/archive truth plus odd_sdlc read models
```

The package does not publish an `odd-sdlc-ts` shell binary. Operator command
and control flows through installed ABG command bindings after `odd_sdlc`
resolves product policy, plugins, runtime binding, and read-model projection.

## Module Shape

| Module | Classification | Owns | Does Not Own |
| --- | --- | --- | --- |
| `workspace_api/` | Typed product API | commandless workspace start/gap/ticket package APIs over admitted product carriers | argv admission, process exit, command serialization, retry/reentry control |
| `workspace_api/entry.ts` | Workspace API implementation host | commandless typed workspace projection realization behind `workspace_api/` | argv admission, command dispatch, package law, operator command/control |
| `cli/main.ts` | Retired process launcher | nothing; file is absent under T-204 | command semantics, retry/reentry, traversal law |
| `operator/installed_operator.ts` | Installed ABG boundary | installed start execution, ABG plugin dispatch, typed retry/reentry projection, archives | user-interface grammar |

## Product API Surfaces

`graph/` returns the declared TypeScript graph-function catalog.

`projection/` reads workspace authority surfaces, derives ingress, constructs
the TypeScript GTL module, and projects the query domain.

`workspace_api/projectOddSdlcWorkspaceGaps` derives a read-only gap dossier from
ABG replay/start truth. Domain priority customization is typed product policy
that is converted into ABG construction priority carriers. It does not choose or
dispatch traversal.

`workspace_api/projectOddSdlcWorkspaceStart` admits commandless start projection
input and reads replay-visible next-action truth. It returns a projected start
carrier only; installed operator command/control must enter through ABG CLI.

Dispatching workspace starts are not exported as package API. Source tests that
exercise installed-operator internals may compose the projection with
`executeInstalledOperatorStart` through `test_env/workspace_start_harness.mjs`;
live proof paths must enter through ABG CLI.

`install`, `release-cut`, `release-snapshot`, and `rc-report` remain typed
package/projection APIs. They do not own traversal or retry policy and must not
reintroduce a product-local shell command.

## Non-Ownership

The workspace API implementation host must not:

- select next vectors directly
- rank candidate actions locally
- own ABG iteration, retry budget, vector advancement, or closure fold
- synthesize retry context
- retry worker output
- treat `repair_worker_output` as prose without a typed repair/reentry plan
- export a second CLI command module
- export a spec-method command dispatcher or argv parser as package API
- claim full Python operational replacement
- publish or require `odd-sdlc-ts`

## Accepted Proof

The prior T-058 proof is no longer sufficient as closure evidence where it
describes a public CLI adapter as the command authority. Current closure must
prove:

- `cli/command.ts` is absent
- `cli/main.ts` is absent
- `package.json` publishes no product-local command binding
- `package.json` does not export `./spec-method`
- root package exports do not re-export `spec_method/entry.ts`
- root package exports do not export a dispatching `startOddSdlcWorkspace`
  workspace API
- typed workspace APIs do not construct the retired spec-method request carrier
  or carry a `command` discriminator
- `workspace_api/entry.ts` contains no retry loop or retry context synthesis
- product gap priority policy is admitted as product policy and ranked by ABG
  construction priority projection
- invalid, duplicate, unknown, and already-closed priority selectors fail closed
- installed retry/reentry control is owned by `operator/installed_operator.ts`
- focused tests run and remain available for operator review before ticket
  closure
