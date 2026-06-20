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
| workspace projection inputs | `workspace_api/` | typed package API input for query-domain, read-only gaps, and ticket read models; no start command discriminant |
| workspace ticket APIs | `workspace_api/`, `tickets/` | typed ticket projection/admission APIs; no traversal dispatch |
| gaps evaluator priority edge | product policy projection | domain-policy input projected through ABG construction priority carriers, not a command option authority |
| workspace source snapshots | product projection API | read-only filesystem admission into `deriveSdlcSourceInput` |
| project constraints fallback | product projection API | admission default when imported workspace has no project constraints file |
| graph catalog | `graph/` | entrypoint reads only |
| query-domain projection | `projection/` | entrypoint reads only |
| ABG runtime binding plugins | `operator/abg_runtime_binding.ts` | product plugin factory consumed by ABG runtime; no public start/gaps API |
| public start execution-contract projection | `start/` | internal plugin-support adapter under T-204 survival audit; not exported as package command/control |
| installed operator plugin session | `operator/installed_operator.ts` | internal plugin session support under T-204 survival audit; generic control code must move to ABG or carry survival proof |
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
          -> operator/createOddSdlcAbgRuntimeBindingPlugins
              -> start/publicStartOnce (internal execution-contract adapter)
              -> operator/createSdlcInstalledOperatorAbgPluginSession
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
| `workspace_api/` | Typed product API | commandless query-domain, read-only gaps, and ticket package APIs over admitted product carriers | start dispatch, gaps dispatch, argv admission, process exit, command serialization, retry/reentry control |
| `workspace_api/entry.ts` | Workspace API implementation host | commandless typed workspace read-model realization behind `workspace_api/` | argv admission, command dispatch, package law, operator command/control |
| `cli/main.ts` | Retired process launcher | nothing; file is absent under T-204 | command semantics, retry/reentry, traversal law |
| `operator/abg_runtime_binding.ts` | ABG plugin binding | construct product plugin set for ABG-owned runtime execution | loop, retry budget, terminal command status, CLI grammar |
| `operator/installed_operator.ts` | Internal plugin/session support under audit | product worker dispatch, prompt/policy projection, archive carriers required by plugins | public command/control surface; generic traversal loop or replay controller without survival proof |

## Product API Surfaces

`graph/` returns the declared TypeScript graph-function catalog.

`projection/` reads workspace authority surfaces, derives ingress, constructs
the TypeScript GTL module, and projects the query domain.

`workspace_api/projectOddSdlcWorkspaceQueryDomain` derives the product query
domain from admitted workspace source, GTL declarations, project conformance,
and project constraints. It does not read replay, dispatch traversal, or choose
next actions.

`workspace_api/projectOddSdlcWorkspaceGaps` derives a read-only gap dossier and
requirement-fulfillment projection from workspace authority plus archived
consequence evidence. It does not call `publicStartOnce`, construct a traversal
request, dispatch workers, or choose next actions.

`workspace_api/projectOddSdlcWorkspaceTickets` and
`workspace_api/admitOddSdlcWorkspaceTicket` expose product ticket projection and
admission helpers. They do not own installed start/gaps behavior.

Dispatching workspace starts and gaps are not exported as package API. Source
tests that prove operator command/control must enter through ABG CLI or ABG
runtime binding probes; product tests may import internal product modules only
to prove product carriers, prompts, projections, and plugins. A test harness
must not recreate dispatching `start` or `gaps` as an odd_sdlc package surface.

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
- typed workspace APIs do not export start functions, dispatch gaps, construct
  the retired spec-method request carrier, or carry a `command` discriminator
- `workspace_api/entry.ts` contains no retry loop or retry context synthesis
- product gap priority policy is admitted as product policy and ranked by ABG
  construction priority projection
- invalid, duplicate, unknown, and already-closed priority selectors fail closed
- internal `start/` and `operator/installed_operator.ts` code is classified as
  plugin support, moved to ABG, or rejected as product-local control debt before
  T-204 closes
- focused tests run and remain available for operator review before ticket
  closure
