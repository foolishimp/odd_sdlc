# odd_sdlc TypeScript Install And Release Adapters

**Status**: Active
**Owner Ticket**: `.ai-workspace/tickets/completed/T-059-realize-typescript-install-normalize-and-release-cut-adapters.md`
**Implements**: `REQ-F-ODDSDLC-040`, `REQ-F-ODDSDLC-043`

## Position

This design owns the bounded side-effect adapters required before
`odd_sdlc.TS` can be evaluated as a full operational RC candidate.

The adapters do not own graph traversal.

They prepare a workspace or a package evidence archive so the published graph,
start, gap, hook, and ABG runtime surfaces can be used from an installed
operator boundary.

## Structural Diagram

```text
operator
  -> odd-sdlc-ts install --target <workspace>
    -> install adapter
      -> package binding: pack/extract @odd-sdlc/typescript-tenant
      -> command binding: odd-sdlc-ts
      -> ABG TypeScript public installer
      -> manifests + bootstrap guide + normalization projection

operator
  -> odd-sdlc-ts release-cut --archive-root <dir>
    -> release adapter
      -> package binding: npm pack
      -> binary-binding proof
      -> release manifest + postmortem

operator
  -> odd-sdlc-ts start/gaps/query-domain
    -> existing public graph/query/start adapters
    -> GTL/ABG traversal authority
```

## Module Responsibilities

### `package_binding`

Owns Node package mechanics:

- read package identity
- run `npm pack`
- extract a package tarball into `node_modules`
- link package dependencies from the source package context
- bind package binaries into `node_modules/.bin`

This module is an effect boundary. It has no SDLC domain semantics and no graph
traversal authority.

### `install`

Owns the `odd_sdlc.TS` install request:

- admit target root, package source, ABG package source, and installed package
  name
- install the TypeScript tenant package into the target workspace
- invoke the public ABIogenesis TypeScript installer
- write the TypeScript install manifest
- write a normalization projection
- write bootstrap command guidance
- inject marker-governed `AGENTS.md` and `CLAUDE.md` instruction sections for
  cold-agent `gaps` and `start` operation
- embed STDO bootstrap provenance for cold-agent ticket execution, including
  accepted aliases, method expansion, STDO-UX UI/operator-surface application,
  and first-missing-layer triage

It does not overwrite project-owned specification truth.

It does not select next traversal, retry work, or close gaps.

### `release`

Owns package release-cut evidence:

- pack the TypeScript tenant package
- prove that `odd-sdlc-ts` is declared and materialized
- write a release-cut manifest and postmortem

It does not claim live worker proof or installed-workspace convergence.

### `cli`

Owns command adaptation only.

`install` and `release-cut` are async side-effect commands. Existing
`catalog`, `query-domain`, `gaps`, `start`, and `rc-report` remain bounded
read/start adapters.

## IACS

### Input

- `InstallTargetRoot`: absolute or cwd-resolved target workspace path
- `PackageSourceRoot`: absolute or cwd-resolved `odd_sdlc.TS` package root
- `AbgPackageSourceRoot`: absolute or cwd-resolved ABIogenesis TypeScript
  package root
- `ReleaseArchiveRoot`: absolute or cwd-resolved archive path

### Authority

- `odd_sdlc.TS` owns package install, bootstrap guidance, and domain command
  binding.
- ABIogenesis owns runtime installation, runtime identity, command bootstrap,
  and substrate events.
- Project specification remains project-owned `WHAT`.
- GTL/ABG remains traversal and continuation authority.
- STDO bootstrap provenance is installed-product guidance over the shared
  method stack. It does not replace upstream method law, but it must be present
  in generated cold-agent surfaces so session memory is not required.

### Carrier

- `OddSdlcTypescriptInstallRequest`
- `OddSdlcTypescriptInstallManifest`
- `OddSdlcInstructionFileWrite`
- `OddSdlcBootstrapGovernance`
- `OddSdlcTypescriptReleaseCutManifest`
- `NodePackageIdentity`
- `InstalledNodePackage`

### Storage

The install adapter writes:

- `.abiogenesis/odd_sdlc/typescript/install-manifest.json`
- `.abiogenesis/odd_sdlc/typescript/package-pack/`
- `.abiogenesis/odd_sdlc/typescript/package-extract/`
- `.ai-workspace/runtime/odd_sdlc-typescript-installation.json`
- `.ai-workspace/context/odd_sdlc_typescript_bootstrap.md`
- `AGENTS.md`
- `CLAUDE.md`

The installed payload follows `.abiogenesis/<product>/<build_tenant>/...`.
`odd_sdlc.TS` therefore uses `.abiogenesis/odd_sdlc/typescript/...` and does
not create a peer `.odd_sdlc/` root.

The release adapter writes:

- `release-cut-manifest.json`
- `release-cut-postmortem.md`
- package tarball under the archive root

## Design Module Review

- Authority seam closure: package/install/release effects are isolated from
  graph traversal and ABG runtime truth.
- Projection-source coherence: install and release projections derive from
  package identity, materialized command paths, and ABG public installer output.
- Prime module shape: package mechanics are separated from SDLC install meaning
  and from release evidence.
- ODD alignment: side-effect adapters publish installation and release
  evidence; they do not become graph programs or continuation controllers.
- Cold-agent operation: install is complete only when target-root instruction
  files tell a fresh agent that `gaps` and `start` map to installed
  `odd-sdlc-ts` commands, that STDO aliases expand to the four governing
  methods, and that ticket execution starts with first-missing-layer triage.
- STDO-UX: when the active ticket is about UI/operator experience, the
  installer bootstrap must preserve the agentic-coder CLI as an operator UI
  binding over installed product truth, not as a rival runtime or hidden worker
  controller.
