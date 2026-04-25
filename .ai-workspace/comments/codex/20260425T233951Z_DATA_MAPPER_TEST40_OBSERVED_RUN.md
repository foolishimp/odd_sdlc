# data_mapper.test40 Observed Run

## Scope

- workspace: `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test40`
- seed: `/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.template`
- odd_sdlc source: `/Users/jim/src/apps/odd_sdlc`
- platform: `spark_scala`
- project slug supplied to installer: `data_mapper_test40`

## Result

The clean install, first traversal, converged traversal with attached local worker,
post-run gap analysis, domain query, and declared Scala test contract all completed.
The declared Scala build contract did not.

Final gap state:

- `status`: `converged`
- `gap_count`: `0`
- `graph_edge_gap_count`: `0`
- `declared_obligation_gap_count`: `0`
- `mixed_truth_classes`: `false`

Declared execution proof:

- command: `sbt test`
- working directory: `build_tenants/scala_spark`
- result: success
- generated Scala modules compiled: 7
- generated Scala module/test suites passed under the multi-module `sbt` build

Declared build proof:

- command: `sbt clean assembly`
- working directory: `build_tenants/scala_spark`
- result: failure
- failure: `assembly` is not a valid SBT task because the generated build does
  not include the `sbt-assembly` plugin

## Observed Stops

1. `start --until first_traversal` with `--fh-mode human-proxy --root-mode supervised`
   failed with `ValueError: fh_mode is only lawful when until='converged'`.
   This was operator command shape, not a traversal defect. The `gaps` next-step
   guidance omitted those flags and was correct.

2. `start --until converged` before worker attachment returned the intended
   `blocking_reason=fp_worker_unattached` projection. The installed runtime
   contract contained `worker_attachment_contract: transport_contract` but no
   `transport_contract`, so this was lawful B-055 behavior.

3. After adding the local deterministic test worker transport, `start` failed
   once with stale analysis and required `refresh-analysis`. This was the correct
   analysis-fingerprint guard after runtime contract mutation.

After `refresh-analysis`, `start --until converged --fh-mode human-proxy
--root-mode supervised` completed with `status=converged`.

4. The declared build contract failed after convergence:

   ```text
   [error] Not a valid command: assembly
   [error] Not a valid project ID: assembly
   [error] Expected ':'
   [error] Not a valid key: assembly
   [error] assembly
   ```

   This is a real RC blocker. `build_execution_result_surface` reached generated
   surface closure while carrying `status: pending_external_evidence`,
   `dispatch_binding: none`, no artifact roots, and no executed build evidence.
   Final `gaps` still reported zero gaps.

## Evidence Commands

```bash
cp -R /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.template \
  /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test40

PYTHONPATH=/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/python/code:/Users/jim/src/apps/odd_sdlc/build_tenants/python/code \
  python -m odd_sdlc.release.install \
  --target /Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.test40 \
  --project-slug data_mapper_test40 \
  --platform spark_scala

PYTHONPATH=.genesis:.genesis/odd_sdlc/python/code \
  python -m odd_sdlc gaps --scope workspace --workspace .

PYTHONPATH=.genesis:.genesis/odd_sdlc/python/code \
  python -m odd_sdlc start --scope workspace --target next --until first_traversal --workspace .

PYTHONPATH=.genesis:.genesis/odd_sdlc/python/code \
  python -m odd_sdlc refresh-analysis --workspace .

PYTHONPATH=.genesis:.genesis/odd_sdlc/python/code \
  python -m odd_sdlc start --scope workspace --target next --until converged \
  --fh-mode human-proxy --root-mode supervised --workspace .

PYTHONPATH=.genesis:.genesis/odd_sdlc/python/code \
  python -m odd_sdlc gaps --scope workspace --workspace .

sbt test

sbt clean assembly

PYTHONPATH=.genesis:.genesis/odd_sdlc/python/code \
  python -m odd_sdlc query-domain --workspace .
```

## Interpretation

The governance path is much healthier than test39: install, route admission,
worker dispatch, convergence, domain projection, and the declared test contract
all passed.

The run did expose one RC-blocking framework bug:

- operational build convergence is not closed against the declared build
  execution contract
- the generated Scala tenant does not materialize `sbt-assembly` even though
  the admitted contract is `sbt clean assembly`
- final `gaps` can report zero while declared build execution fails

The non-blocking observed stops were:

- command-shape enforcement for `fh_mode`
- expected missing worker attachment before adding `transport_contract`
- expected stale-analysis guard after mutating the installed runtime contract

The remaining caveat is that the converged run used the deterministic local
constructor worker from the release test harness, not a live Codex/Claude
transport. The produced branch still passed the declared Scala execution
contract with `sbt test`, but it failed the declared build contract with
`sbt clean assembly`.

Opened follow-up ticket:

- `.ai-workspace/tickets/active/B-065-close-operational-build-proof-against-the-declared-build-contract.md`

## Prior-Run Comparison Added After Review

The 39 prior workspaces change the interpretation:

- `data_mapper.test35` remains the strongest single-shot realization baseline:
  `sbt test` still passes locally, with substantial Scala implementation and
  governed execution evidence. It also fails `sbt clean assembly` because
  `assembly` is not a valid SBT task.
- `data_mapper.test38` generated `project/plugins.sbt` with `sbt-assembly`.
  There `assembly` is a valid task, but `sbt clean assembly` still fails on
  duplicate `META-INF/versions/9/module-info.class` entries from
  `bcprov-jdk18on` and `snakeyaml`, so the missing precedent is a generated
  merge strategy.
- `data_mapper.test40` is the first observed run where the modern operational
  build-result edge family can close and final gaps can reach zero while the
  declared build command fails.

So the B-065 target is not just "add sbt-assembly". The target is:

- keep test35's real source/test execution discipline
- recover test38's build-tool materialization
- add the missing assembly merge strategy
- prevent `build_execution_result_surface` from converging without executed
  build evidence or an explicit blocked result
