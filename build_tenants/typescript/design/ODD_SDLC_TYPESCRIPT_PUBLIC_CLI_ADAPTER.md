# odd_sdlc TypeScript Public CLI Adapter

**Status**: Accepted
**Date**: 2026-04-27
**Owner Ticket**: `.ai-workspace/tickets/completed/T-058-realize-typescript-public-cli-adapter-over-graph-query-start-surfaces.md`
**Implements**: REQ-F-ODDSDLC-040, REQ-F-ODDSDLC-041, REQ-F-ODDSDLC-043
**Derives From**: `ODD_SDLC_TYPESCRIPT_TENANT_DERIVATION.md`, `ODD_SDLC_TYPESCRIPT_POLICY_SURFACES.md`

## Purpose

Define the bounded TypeScript public CLI adapter.

The CLI is not an executor. It binds operator command grammar to the existing
graph catalog, workspace ingress, query-domain, gap, start, and qualification
report carriers.

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
      -> projection/deriveSdlcGapDossier
      -> qualification/describeOddSdlcTypescriptRcQualification
  -> OddSdlcCliResult JSON
```

## Module Shape

| Module | Classification | Owns | Does Not Own |
| --- | --- | --- | --- |
| `cli/command.ts` | Public adapter module | argument admission, read-only workspace source discovery, command dispatch to existing carriers | graph truth, traversal, worker execution, install, release packaging |
| `cli/main.ts` | Binary entry point | process argv/stdout/stderr/exit binding | domain semantics |
| `cli/index.ts` | Export boundary | stable CLI exports | command behavior |

## Commands

`catalog` returns the declared TypeScript graph-function catalog.

`query-domain` reads workspace authority surfaces, derives ingress, constructs
the TypeScript GTL module, and projects the query domain.

`gaps` derives a read-only gap dossier from a public start execution contract
with no runtime events.

`start` projects one public start outcome. If no `--worker` transport is
provided for `F_P`, the command returns the typed worker-unattached block.

`rc-report` returns the current TypeScript qualification report.

## Non-Ownership

The CLI must not:

- write installed workspace state
- select next vectors directly
- call ABG iteration privately
- retry worker output
- synthesize graph catalog truth
- claim full Python operational replacement

## Design-Module Review

The adapter is prime because its only reason to change is command grammar and
process binding. It is locally optimized by reusing existing graph/query/start
modules and globally optimized by preventing a new imperative application
controller from forming around the TypeScript tenant.

Install/normalize and release-cut packaging remain outside this module and
inside T-041 follow-up scope.

## Accepted Proof

- `npm run test:t058`: passed, 6 tests
- package binary: `odd-sdlc-ts`
- package export: `./cli`
