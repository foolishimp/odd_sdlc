# odd_sdlc v2.0.0-rc.2 Release Note

## RC Identity

- product: `odd_sdlc`
- candidate: `v2.0.0-rc.2`
- RC branch: `rc/2.0.0`
- predecessor: `v2.0.0-rc.1`
- release state: second published release candidate for the `2.0.0` line

## Position

`v2.0.0-rc.2` advances the TypeScript line from the first multi-tenant
constitutional release candidate to a data_mapper-authority repair candidate.

The main addition over RC1 is that product materialization no longer depends on
fixture `expectedFiles` as the only target source. The TypeScript tenant can
derive product materialization targets from conformed `PRODUCT.md` authority,
invoke materialization with a non-empty typed target contract, observe generated
product files under the declared tenant root, and fail closed when executable
materialization evidence is invalid.

## What Shipped Since RC1

### T-143 Conformed Authority Product Targets

- T-143 is closed and moved to `.ai-workspace/tickets/completed/`.
- The authoritative closure lane is the internal controlled data_mapper
  duplicate under `build_tenants/typescript/test_env/fixtures/data_mapper_induction`.
- The fresh installed live run is archived at:

```text
build_tenants/typescript/test_env/test_runs/internal_data_mapper_t143_repair_live/20260511T034123994Z_pid43155
```

- The materialization attempt archive is:

```text
workspace/.ai-workspace/runtime/odd_sdlc/operator-runs/20260511T034543101Z_pid78309
```

- The worker package carried:

```text
productMaterializationAuthority.status = passed
contextExpectedFileTargets = []
productAuthorityTargets = 10
declaredProductFileTargets = 10
sourceRefs = workspace://specification/PRODUCT.md
materializationRequired = true
selectedOutputRoot = build_tenants/scala_spark
buildExecutionContract = sbt compile
testExecutionContract = sbt test
```

- The product materialization manifest observed:

```text
fileCount = 25
sourceCount = 23
buildConfigCount = 1
selectedOutputRoot = build_tenants/scala_spark
```

### Executable Product Evidence Gate

- executable product materialization now blocks when execution evidence is
  missing or structurally invalid
- the fresh data_mapper lane blocked on:

```text
test_execution_evidence_invalid:transformArtifact.executionEvidence.command: expected string
```

- this is the intended non-close result for the T-143 repair: file observation
  alone is no longer enough to admit executable product closure

### T-144 Assurance And Tenant Grammar Boundary

- the immediate F_D overreach and tenant grammar boundary repair is completed
- component-depth, semantic-convergence, materialization, and fold assurance
  surfaces now distinguish repairable worker output from hard F_D rejection
- tenant-local grammar is treated as worker context unless it is the exact
  postflight contract being admitted

### Post-T143 Work Queue

The fresh data_mapper live archive also exposed a runner-continuation bug: after
the first non-close postflight, the same installed
`start --target next --until first_traversal` invocation continued into same-edge
repair/reentry attempts.

That regression is parked under T-151 with the archive references attached. It
is not part of T-143 closure after the internal-lane reprice.

## Qualification Bundle

Focused RC2 qualification:

- `npm run lint:semantic` - passed
- `npm run test:t143` - 15/15 passed
- `npm run test:t058` - 11/11 passed
- `npm run test:t066` - 33/33 passed
- `git diff --check` - passed

Live proof:

- `internal_data_mapper_t143_repair_live/20260511T034123994Z_pid43155`
  proves installed downstream workspace execution over the authoritative
  internal controlled data_mapper duplicate
- the run derives a non-empty product target contract from conformed
  `PRODUCT.md`, materializes Scala/SBT product files, and blocks invalid
  execution evidence instead of closing shallowly

Full historical non-live suite status:

- `npm run test:semantic` was attempted during RC2 preparation and is not the
  RC2 green gate
- failures remain in legacy/stale assertions around T-064, T-069, T-076, T-088,
  T-120, and T-137
- these failures are consistent with the post-T143 goals work already queued
  under T-145 through T-154, especially T-151 runner sovereignty and T-153
  non-close disposition parity

## Known Limitations

- T-151 must repair installed-runner continuation so `first_traversal` returns
  after admitted non-close consequence truth instead of re-entering from local
  branch/gap-dossier pressure
- T-153 must prove live or live-equivalent non-close disposition parity over
  replay-visible closure/evaluator truth
- T-145 must delete remaining rival closure/report authority and worker-report
  prose authority paths
- full data_mapper parity beyond the internal controlled duplicate remains a
  later parity wave, not a T-143 closure condition

## RC Boundary

- RC branch: `rc/2.0.0`
- RC tag: `v2.0.0-rc.2`

This RC tag is immutable. Subsequent RC work in the `2.0.0` window will publish
new RC tags (`v2.0.0-rc.3`, ...) without mutating this cut.

The final tap will be `release/2.0.0` / `v2.0.0` after RC qualification and
operator review accept the `2.0.0` candidate scope.
