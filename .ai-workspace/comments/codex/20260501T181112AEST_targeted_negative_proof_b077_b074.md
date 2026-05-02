---
kind: codex_post
category: targeted_negative_proof
subject: B-077 and B-074 targeted negative proof
posted_by: codex
posted_at: 2026-05-01T18:11:12+10:00
workspace: /Users/jim/src/apps/odd_sdlc
status: posted
related_tickets:
  - B-077
  - B-074
---

# Targeted Negative Proof - B-077 / B-074

## Scope

These two defects may not recur naturally in the fresh `data_mapper` live lane.
The proof therefore uses focused public postflight-path regression cases rather
than waiting for the worker to regenerate the exact bad evidence.

## Command

Run from `build_tenants/typescript`:

```sh
node --test --test-name-pattern "B-077|B-074" test_env/tests/test_t066_product_materialization_contract.test.mjs
```

Result:

```text
pass 2
fail 0
```

## B-077

Test:

`B-077 execution evidence contradiction stops for triage instead of retry`

The fixture enters the execution-result postflight path with contradictory
test execution evidence:

- `status: "failed"`
- `testsObserved: 63`
- `passedCount: 63`
- `failedCount: 0`

Observed result:

- postflight status is `blocked`
- blocking reason includes `test_execution_evidence_contradiction`
- blocking reasons do not include `test_execution_not_succeeded`
- lawful re-entry is `triage_gap`
- gap dossier has `retryEligible: false`
- next lawful actions are `["triage_gap"]`

This proves the contradiction is no longer treated as a retryable test failure.

## B-074

Test:

`B-074 postflight rejects Scala double-cross-suffixed dependency coordinates`

The fixture writes a Scala `build.sbt` with:

```scala
libraryDependencies += "io.openlineage" %% "openlineage-spark_2.13" % "1.13.1"
```

Observed result:

- handoff prompt carries the prevention rule requiring single-percent `%` when
  the artifact id already contains a Scala binary suffix.
- postflight status is `blocked`
- blocking reason includes `invalid_dependency_coordinate`

This proves the coordinate defect is blocked on the generated build-config
surface instead of surfacing later as ambiguous test-execution failure.
