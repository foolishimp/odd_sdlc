# odd_sdlc.TS RC Backlog Closeout And Go/No-Go Review

**Status**: review note
**Date**: 2026-04-26T18:36:28Z
**Scope**: TypeScript RC backlog after T-058/T-060

## Executive Finding

The TypeScript tenant is now supportable as a bounded ODD-native RC package.

It is not yet proven as a full Python operational replacement if the release
bar includes Python's historical multi-edge `data_mapper` qualification depth.

`data_mapper` is not part of the `odd_sdlc` product. It is an independent
real-world qualification workload used to judge whether the SDLC is
sufficiently functional.

That is the remaining decision under T-041.

## Closed In This Pass

- T-059: package-backed install/normalize and release-cut adapters
- T-060: TypeScript live versus Python archive comparison postmortem
- T-048: odd_sdlc-side ABG M05 archive dependency handed upstream to
  ABIogenesis T-077 with a local non-consumption decision for this RC wave

## New/Updated Surfaces

- `build_tenants/typescript/code/src/package_binding/`
- `build_tenants/typescript/code/src/install/`
- `build_tenants/typescript/code/src/release/`
- `build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_INSTALL_RELEASE_ADAPTERS.md`
- `build_tenants/typescript/qualification/ODD_SDLC_TYPESCRIPT_LIVE_PYTHON_ARCHIVE_COMPARISON.md`
- `abiogenesis/.ai-workspace/tickets/backlog/T-077-export-typescript-m05-sandbox-archive-framework-as-public-downstream-api.md`

## What Is Now Proven

- `odd-sdlc-ts install --target <workspace>` installs
  `@odd-sdlc/typescript-tenant` into a target workspace.
- The same install invokes the public ABG TypeScript installer.
- Installed workspaces get `odd-sdlc-ts`, `genesis-ts`, and `abiogenesis-ts`
  command bindings.
- The install writes an odd_sdlc TypeScript install manifest, normalization
  projection, and bootstrap command guide.
- `odd-sdlc-ts release-cut --archive-root <dir>` writes package artifact,
  release manifest, postmortem, and binary-binding proof.
- Current TS live `data_mapper` qualification run passes against
  `20260426T183216072Z_pid7194` in `149909.146459ms`.

## Verification

- `npm run test:t038`: passed, 4 tests
- `npm run test:t059`: passed, 4 tests
- `npm run test:semantic`: passed, 73 tests
- `npm run test:sandbox`: passed, 6 tests
- `npm run lint:semantic`: passed
- `ODD_SDLC_TS_LIVE_FP=1 npm run test:live`: passed, 1 test,
  `149909.146459ms`
- `git diff --check`: passed

## Remaining Backlog

The remaining backlog is not homogeneous:

- `T-041` is the real RC go/no-go envelope.
- `T-018` and `T-019` are Python-tenant refactor debt and are not current
  TypeScript RC blockers.
- `B-004` is odd_service orchestration-plane debt and is not current
  TypeScript RC scope.

## T-041 Decision

If the release bar is bounded TypeScript RC with install, release-cut, sandbox,
and one current live `data_mapper` qualification edge, the evidence is present.

If the release bar is full replacement of Python's historical multi-edge
`data_mapper` qualification depth, the evidence is not present. The current TS line proves
one live `derive_code_surface` edge. Python's richer `data_mapper` yield-chain
archive proves broader multi-edge depth with continuation/yield and triage
behavior.

The next lawful action is to choose that bar explicitly, then either close
T-041 as bounded-RC-sufficient or carve a focused multi-edge `data_mapper`
qualification-convergence ticket from T-041.
