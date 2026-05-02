# odd_sdlc TypeScript Public CLI Adapter

**Status**: Accepted
**Date**: 2026-04-27
**Owner Ticket**: `.ai-workspace/tickets/completed/T-058-realize-typescript-public-cli-adapter-over-graph-query-start-surfaces.md`
**Reconciled By**: `.ai-workspace/tickets/active/T-105-migrate-start-until-converged-to-abg-owned-whole-graph-iteration.md`
**Implements**: REQ-F-ODDSDLC-040, REQ-F-ODDSDLC-041, REQ-F-ODDSDLC-043
**Derives From**: `ODD_SDLC_TYPESCRIPT_TENANT_DERIVATION.md`, `ODD_SDLC_TYPESCRIPT_POLICY_SURFACES.md`

## Purpose

Define the bounded TypeScript public CLI adapter.

The CLI is not an executor. It binds operator command grammar to the existing
graph catalog, workspace ingress, query-domain, gap, start, and qualification
report carriers.

After T-105, attached `start` is still a CLI adapter path, but it is no longer
only a read-only public-start projection. The CLI admits command grammar and
dispatches to the installed-operator shell. The installed operator supplies the
odd_sdlc graph program and F_P plugin, then delegates graph iteration to ABG.
The CLI still owns no vector advancement, retry budget, or closure fold.

## IACS

| Carrier | Owner | Notes |
| --- | --- | --- |
| `OddSdlcCliRequest` | `cli/command.ts` | admitted operator command and options |
| `OddSdlcCliResult` | `cli/command.ts` | closed JSON command result |
| workspace source snapshots | `cli/command.ts` | read-only filesystem adapter into `deriveSdlcSourceInput` |
| project constraints fallback | `cli/command.ts` | adapter default when imported workspace has no project constraints file |
| graph catalog | `graph/` | CLI reads only |
| query-domain projection | `projection/` | CLI reads only |
| public start outcome | `start/` | CLI reads only |
| installed operator start shell | `operator/installed_operator.ts` | attached worker execution adapter; ABG owns iteration |
| RC qualification report | `qualification/` | CLI reads only |

## Structural Carrier Diagram

```text
operator argv
  -> cli/command.ts
      -> workspace source snapshots
      -> workspace/deriveSdlcWorkspaceIngressReport
      -> graph/constructSdlcGtlModule
      -> projection/projectSdlcQueryDomain
      -> start/publicStartOnce
      -> operator/executeInstalledOperatorStart
      -> projection/deriveSdlcGapDossier
      -> qualification/describeOddSdlcTypescriptRcQualification
  -> OddSdlcCliResult JSON
```

## Module Shape

| Module | Classification | Owns | Does Not Own |
| --- | --- | --- | --- |
| `cli/command.ts` | Public adapter module | argument admission, read-only workspace source discovery, command dispatch to existing carriers and installed-operator start shell | graph truth, vector advancement, retry budget, closure fold, install, release packaging |
| `cli/main.ts` | Binary entry point | process argv/stdout/stderr/exit binding | domain semantics |
| `cli/index.ts` | Export boundary | stable CLI exports | command behavior |

## Commands

`catalog` returns the declared TypeScript graph-function catalog.

`query-domain` reads workspace authority surfaces, derives ingress, constructs
the TypeScript GTL module, and projects the query domain.

`gaps` derives a read-only gap dossier from a public start execution contract
with no runtime events.

`start` always admits the public start contract first. If no `--worker`
transport is provided for `F_P`, the command returns the typed
worker-unattached block. If a worker is attached, the command dispatches to the
installed-operator start shell, which invokes ABG whole-graph iteration for the
selected graph function and writes operator archives from ABG runtime/effect
truth.

`rc-report` returns the current TypeScript qualification report.

## Non-Ownership

The CLI must not:

- write installed workspace state
- select next vectors directly
- own ABG iteration, retry budget, vector advancement, or closure fold
- retry worker output
- synthesize graph catalog truth
- claim full Python operational replacement

## Design-Module Review

The adapter is prime because its only reason to change is command grammar and
process binding. It is locally optimized by reusing existing
graph/query/start/operator modules and globally optimized by preventing a new
imperative application controller from forming around the TypeScript tenant.

Design-method reconciliation: attached start may call the installed-operator
adapter, but that adapter must delegate iteration to ABG and must not move
traversal policy back into CLI code.

Install/normalize and release-cut packaging remain outside this module and
inside T-041 follow-up scope.

## Accepted Proof

- `npm run test:t058`: passed, 6 tests
- package binary: `odd-sdlc-ts`
- package export: `./cli`
