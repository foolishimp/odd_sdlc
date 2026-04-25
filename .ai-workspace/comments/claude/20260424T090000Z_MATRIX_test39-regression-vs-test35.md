# MATRIX: data_mapper.test39 regression vs data_mapper.test35

**Author**: claude
**Date**: 2026-04-24
**Addresses**: live from-bootstrap wave after `B-037 / B-048 / B-049` joint closure
**Prior related post**: `20260424T070000Z_REVIEW_b037-b048-b049-joint-closure.md`
**Status**: Analysis — identifies gap work to restore test35-level execution under the new carrier topology

## Headline

The B-037 / B-048 / B-049 closure wave landed at the source-level surface and
was explicitly declared **live from-bootstrap out of closure** (joint-closure
review, §Sequencing Note). `data_mapper.test39` is the first from-bootstrap
wave under the new `abiogenesis.standard@3.2.0` kernel plus the three new
admitted carriers. It is a near-complete traversal failure:

- `0 / 27` edges converged
- `1` F_P manifest dispatched, `0` F_P results returned
- halted at the very first authority edge (`derive_intent_surface`) on an F_H
  gate that is itself unable to clear
- the `--fh-mode human-proxy` escape hatch crashes inside one of the three new
  carriers before it can act

`data_mapper.test35` — the last wave I can reliably identify as "truly
successful" — traversed the full generative pipeline to a release surface and
a test run archive under `abiogenesis.standard@3.1.0` with a live multi-worker
runtime loop. The regression is not subtle. Below is what differs, why, and
the concrete work required to get test39 back to test35-level execution.

## Execution-Volume Matrix

Direct comparison of the two workspaces' events + artifacts:

| Dimension | test35 (v3.1.0) | test39 (v3.2.0) | Delta |
|---|---:|---:|---|
| `events.jsonl` lines | 4,662 | 176 | 26× fewer events |
| `edge_converged` events | 79 | 0 | no edges closed |
| `run_completed` events | 79 | 0 | no runs closed |
| `run_bound` / `run_started` events | 86 / 86 | 1 / 1 | 86× fewer runs attempted |
| `fp_dispatched` events | 57 | 1 | 57× fewer dispatches |
| `worker_turn_started` / `worker_turn_progress` | 85 / 209 | 0 / 0 | no worker loop |
| `worker_turn_salvaged` / `worker_turn_salvage_candidate` | 83 / 82 | 0 / 0 | no salvage activity |
| `assessed` | 3,152 | 0 | evaluator never ran against real output |
| `fp_manifests/` files | 82 | 1 | manifest dispatched once |
| `fp_results/` files | 81 | 0 | **nothing ever returned a result** |
| `fp_ledgers/` | 80 | (dir absent) | no ledger formation at all |
| `build_tenants/scala_spark/` generated files | 14 (build.sbt, impl-design, modules, stack, test-design, test-stack, run-archive, release-surface, feature-decomp, odd-design, project/build.properties, …) | 0 (only TENANT_REGISTRY.md) | no realization output |
| `build_tenants/python/` generated files | 2 (feature-decomp, odd-design) | (dir absent) | secondary tenant missing |
| `specification/scenarios/` generated files | 3 (scenarios, uat-testcases, testcase-authority) | (dir absent) | no scenario surface |
| `specification/requirements/10-generated-bootstrap.md` | present | absent | no bootstrap requirement surface |

test35 got end-to-end through `derive_release_surface` and
`derive_test_run_archive_surface`. test39 got zero edges past
`derive_intent_surface`.

## Runtime-Loop Matrix

The second-order story — what was *actually running* when each workspace ran:

| Surface | test35 | test39 |
|---|---|---|
| Workflow version | `abiogenesis.standard@3.1.0` | `abiogenesis.standard@3.2.0` |
| `.genesis/genesis/*.py` engine files | 30 | 32 (+`proof_hold.py`, +`runtime_carrier.py`) |
| Worker/chat runtime | `oddchat_workers/` (7 codex worker session logs + `workers.json`), `oddchat_bootstrap/` (13 worker/reviewer bootstrap scripts spanning three rooms over three days), `oddchat_participants/`, `oddterm/`, `oddboard/`, `conversation_history/` | none |
| `genesis.yml` `worker:` directive | commented out (identical to test39) | commented out |
| Generative agent presence | 3 chat rooms, multiple codex sessions, reviewer + worker pairs | none running |

test35's `genesis.yml` is byte-identical to test39's apart from the
`v3.1.0` → `v3.2.0` header line. **test35 did not get its worker loop from
`genesis.yml`.** It got it from an external operator who stood up
`oddchat_bootstrap/*.sh` scripts and attached codex workers to the chat-driven
dispatch surface. In test39 no such loop was attached — the dispatcher wrote
one manifest to disk and has been waiting for a response that is not coming
because there is nothing on the other end.

## What test39 Actually Did

Complete trace, reconstructed from `events.jsonl`:

1. `genesis_installed` × 1 at workflow version 3.2.0
2. 54 cycles of `observation_recorded` → `triage_produced` → `route_recorded`
   — gap scans over every edge in the graph. Because no edges ever advance,
   the scanner re-discovers the same gaps repeatedly and the counts match
   (54/54/54).
3. 2× `constitutional_proposal_recorded` + 2× `fh_gate_pending` — the system
   classifies `derive_intent_surface` as constitutional reprice and raises an
   F_H gate against `specification/INTENT.md`. Same proposal id
   (`const_72d132dfd284be39`) both times.
4. 1× `constitutional_proposal_approved_with_edits` + 1× `proposal_applied` —
   something (an earlier human-proxy run) **did** approve the proposal with
   edits. Proposal state moved to `approve_with_edits`, resolution event
   recorded.
5. 1× `execution_contract_drafted` + 1× `execution_contract_admitted` — the
   admitted execution contract lands in `odd_sdlc-execution-contract.json`.
6. 1× `run_bound` → `run_started` → `graph_call_opened` → `vector_started`
   → `fp_dispatched` for `derive_intent_surface`.
7. End of stream.

The F_P manifest at `fp_manifests/derive_intent_surface_20260423T182050234263Z.json`
(41 KB) was written. `fp_results/` is **empty**. No worker wrote a response.

## Three Compounding Defects

### Defect 1 — No F_P Worker Loop Was Attached (environment-level)

test39 has no `oddchat_*` or `oddterm` runtime directories, no
`oddchat_bootstrap/*.sh`, no workers in `.ai-workspace/agents/`, and no running
codex sessions. The kernel dispatches F_P via the fp_manifests/fp_results
directory pair — a pull-style queue. No puller was running. test35's 81
results came from an external operator who brought up the chat-driven worker
surface by hand.

This is not an odd_sdlc source bug. It is a **missing bootstrap story**: the
workspace was started with `python -m odd_sdlc start ...` and nothing else.
Under v3.1.0 that was apparently enough because someone was driving
`oddchat_bootstrap/*.sh` on the side. Under v3.2.0 the situation is the same,
but no one attached the external loop this time.

### Defect 2 — F_P Intent Convergence Evaluator Emits Empty `{}` Evidence (odd_sdlc-side)

Even ignoring defect 1, the F_P evaluator
`intent_surface_semantically_converged` is producing:

```
delta = 1 — 1 evaluator(s) failing: intent_surface_semantically_converged (F_P): {}
```

That empty `{}` evidence body appears verbatim in:

- observation (`event_id: f517b1a3a594410a9cba2543c5dab8c8`)
- triage (`event_id: a7414c37cf91479c8b1262885764f1ba`)
- the constitutional proposal's evidence roll-up

The evaluator names a target but reports nothing about why it failed. The
triage sees that as a constitutional reprice candidate and raises an F_H
gate. When an operator approves the proposal (`approve_with_edits` at events
85–86), the approval lands, but the *next* gap scan re-discovers the same
empty-delta failure and files a new proposal. Result: **an F_P evaluator with
an empty evidence surface drives a reprice loop that cannot converge**. Even
if a worker were attached, the worker would write a response, and the
evaluator would still report `{}` with `delta=1`.

Contrast test35: `intent_surface_semantically_converged` does not appear in
test35's first-20 event window at all — either the evaluator was shaped
differently, or the edge closed on a non-F_P evaluator before F_P dispatch
was needed. The v3.2.0 evaluator family tied to this edge is a regression
surface.

### Defect 3 — `--fh-mode human-proxy` Crashes Inside a B-048 Carrier (odd_sdlc-side, reproduced)

Filed as `B-005 public_start resolved_policy.bundle_refs crash under
--fh-mode human-proxy` in the odd_sdlc backlog. Exact failure:

- `genesis/policy.py:53` — `ResolvedPolicy.to_dict()` emits
  `"bundle_refs": tuple(self.bundle_refs)` (tuple)
- `odd_sdlc/public_start_subcarriers.py:26-28` — `_string_list` requires
  `isinstance(value, list)` and raises on anything else, including tuple.

`public_start_subcarriers.py` is the carrier B-048 introduced. The
`--fh-mode direct` path never hits `resolve_public_start_result_policy`, which
is why only the human-proxy path reproduces. In other words: the escape hatch
the joint-closure review relied on ("operators can still proxy past gates") is
broken on the very first from-bootstrap attempt under the new carrier.

This is the direct, literal expression of the joint-closure review's own
caveat that "live from-bootstrap" was out of closure scope.

## Structural Drift Between test35 and test39

Beyond the three defects above, test39 is authored against a different
structural shape than test35:

### `project_constraints.yml`

test35 form:

```yaml
project: { name: "data_mapper.test35", ... }
active_tenant: "scala_spark"
secondary_tenant: "dbt"
secondary_tenant_mode: "best_effort"
build_tenants:
  scala_spark:
    execution_tier: "spark_dataframe"
    output_dir: "build_tenants/scala_spark/"
    capability_contracts: { spark_session: true, dataframe_reads: true, ... }
    frameworks: ["Apache Spark 3.5.0", "ScalaTest 3.2.17", "cats-core 2.10.0", ...]
    build_execution_contract: ""
    test_execution_contract: "derive_test_run_archive_surface"
    deployment_contract: ""
    runtime_observation_contract: ""
  dbt: { ... }
constraints:
  deployment_target: { ... }
  security_model: { ... }
  data_governance: { regulations: ["BCBS 239", "FRTB", "GDPR/CCPA", "EU AI Act Art.14/15"] }
  observability: { logging: "OpenLineage API", metrics: "ledger.json per run", ... }
ambiguity_risk_appetite: "medium"
```

test39 form:

```yaml
project: { name: "data_mapper.test39", language: "Scala + Apache Spark", tool: "sbt", ... }
structure:
  design_tenants:
    - name: "scala_spark"
      output_dir: "build_tenants/scala_spark/"
      build_execution_contract: "sbt clean assembly produces build_tenants/scala_spark/..."
      test_execution_contract: "sbt test runs ScalaTest 3.2.17 suites..."
      deployment_contract: "spark-submit --class cdme.engine.CdmeEngineRunner ..."
      runtime_observation_contract: "OpenLineage facets emitted per morphism execution..."
  root_code_policy: reject
constraints: {}
ambiguity_risk_appetite: "low"
```

Differences that matter for the pipeline:

- test35 declares two build tenants (`scala_spark` primary, `dbt` best-effort
  secondary). test39 declares one.
- test35 uses `build_tenants.<name>.capability_contracts` (an explicit truth
  declaration about what the tenant supports). test39 has no
  `capability_contracts` at all.
- test35 populates `constraints.deployment_target`,
  `constraints.security_model`, `constraints.data_governance`,
  `constraints.observability`, `constraints.error_handling`. test39 has
  `constraints: {}`.
- test35's execution contracts are empty strings (pipeline-resolved). test39
  writes sentence-length English into those fields ("sbt clean assembly
  produces …"). These are consumed by downstream evaluators as
  `execution_contract` inputs; prose vs empty can change which evaluator
  paths trip.
- test35 `ambiguity_risk_appetite: medium`. test39 `low`. Under
  `ambiguity_risk_appetite: low`, more unresolved ambiguity escalates to F_H
  instead of being carried by F_P. That is consistent with test39 filing
  `intent_reprice` so aggressively where test35 advanced.

Because the two configs have different *shapes*, not just different values,
downstream evaluators that look up `build_tenants.*.capability_contracts` or
`constraints.observability` will see missing keys in test39. Whether that
contributes to Defect 2 is suggestive but not yet proven.

### Specification surface provenance

- test35 `specification/requirements/10-generated-bootstrap.md` exists —
  evidence that `derive_requirement_surface` ran and produced a generated
  bootstrap against the `00-starter.md` seed.
- test39 has only `00-starter.md`, `00-imported-sources.md`, and `README.md`
  under `specification/requirements/`. No generated file. That is consistent
  with no edges converging.

### Realization surface provenance

- test35 has `build_tenants/scala_spark/design/` with 6 generated files,
  `build_tenants/scala_spark/test_env/` with 2 files,
  `build_tenants/scala_spark/release/` with 1 file, plus
  `build_tenants/python/design/` with 2 files. And `build.sbt` and
  `project/build.properties`. Generated code artifacts went beyond design —
  into a build substrate.
- test39 has nothing under `build_tenants/scala_spark/`. The scala_spark
  tenant directory does not even exist yet.

## Runtime carrier introspection

test39 runtime directory:

```
.ai-workspace/runtime/
  odd_sdlc-analysis-manifest.json
  odd_sdlc-ambiguity-register.json
  odd_sdlc-gap-dossiers.{json,md}            ← new carrier surface (v3.2.0)
  odd_sdlc-repair-frontier.{json,md}         ← new carrier surface (v3.2.0)
  odd_sdlc-execution-contract.{json,md}      ← new carrier surface (v3.2.0)
  odd_sdlc-test-lane-completeness.md         ← B-037 artifact (new)
  odd_sdlc-realization-iteration-digest.md
  odd_sdlc-requirement-closure.{json,md}
  odd_sdlc-stateful-builder-control-frame.md
  odd_sdlc-workspace-normalization.json
  odd_sdlc-workspace-state.json
  triage/derive_intent_surface.json
```

test35 runtime directory:

```
.ai-workspace/runtime/
  odd_sdlc-analysis-manifest.json
  odd_sdlc-ambiguity-register.json
  odd_sdlc-realization-deepening-control-frame.md   ← B-037 retired this family
  odd_sdlc-realized-test-source-obligation.md        ← B-037 retired this carrier
  odd_sdlc-requirement-closure.{json,md}
  odd_sdlc-stateful-builder-control-frame.md
  odd_sdlc-workspace-normalization.json
  odd_sdlc-workspace-state.json
  oddchat_workers/                                   ← live worker surface
  oddchat_bootstrap/                                 ← worker bootstrap scripts
  oddchat_participants/
  oddterm/
  oddboard/
  conversation_history/
```

The retirement of `realized-test-source-obligation` (B-037) and the
introduction of `repair-frontier`, `gap-dossiers`,
`execution-contract`, and `test-lane-completeness` are real and visible in
test39's runtime. The question is whether the *evaluator logic keyed to those
new carriers* is complete for a from-bootstrap path, or only for the
primed-source paths the joint-closure proved.

## Gap Work To Bring test39 To test35-Level Execution

Ordered by unblock power (top items enable the next):

### Tier 1 — Direct unblocks so the kernel can run at all

1. **Fix B-005** — `public_start_subcarriers._string_list` (or
   `ResolvedPolicy.to_dict()`) so tuple/list mismatch does not crash. Without
   this the escape hatch (`--fh-mode human-proxy`) is unavailable on the
   first F_H gate.
2. **Fix F_P evaluator `intent_surface_semantically_converged`** so it emits
   real evidence and can converge when the target surface is well-formed, or
   escalates lawfully when it is not. The empty `{}` evidence body is the
   signature of either (a) evaluator not connected to its real backing, or
   (b) evaluator trivially failing on any input, or (c) evaluator returning
   without an F_P worker round actually running. Pick which and close it.
   This is the defect that converts first-edge attempts into a reprice loop
   even after human approval.
3. **Stand up a worker loop for this workspace**. Either:
   - Re-bring the `oddchat_bootstrap/*.sh` surface that worked in test35 and
     point it at test39, adapting room topics to the new carrier surface, or
   - Declare a clean-room from-bootstrap worker story in the kernel that
     does not require a separate chat-room bootstrap. In particular,
     `genesis.yml`'s `worker:` directive is commented out in every installed
     workspace I checked. If the new intended shape is "operator-attaches
     external worker" it should be written down; if the new intended shape
     is "kernel boots its own worker" it should work.
4. **Align `project_constraints.yml` shape**. The v3.2.0 kernel appears to
   expect `structure.design_tenants[]` and is consuming English prose in
   the execution-contract fields. test35's shape
   (`build_tenants.<name>.capability_contracts`, `constraints.observability`,
   etc.) is richer and appears to have been what the v3.1.0 evaluators
   grounded against. Either:
   - Declare the v3.2.0 config shape canonically and migrate all
     downstream evaluator lookups to it, with a clear migration note, or
   - Revert the shape change and keep the test35-style constraint surface.
   The current state — ambiguous which shape the evaluator family expects
   — is itself a defect.

### Tier 2 — Second-order gaps visible in the carrier surface

5. **Re-verify every from-bootstrap edge under the new carrier topology**,
   not just edges closable on primed-source installs. The joint-closure
   review's own §Sequencing Note declared live from-bootstrap out of scope;
   this forensic confirms that deferral was real, not aspirational. Concrete
   scope: each of the 27 edges in test39's `combined_delta` should traverse
   to at least `fp_dispatched` with a consuming worker present, and the
   ambiguity_risk_appetite policy should be explicitly testable against both
   `low` and `medium`.
6. **`intent` → `product` → `goal` → `requirement` surface derivation path
   proof.** None of these four edges produced a single file in test39. The
   joint-closure review proves the *typed carriers* that run the path, not
   that the path reaches any output surface from a bare workspace.
7. **Execution-contract surface wiring.** test39's
   `odd_sdlc-execution-contract.json` has an `execution_contract_surface` key
   which was `None` in the gaps dump. Under v3.1.0 test35 got to
   `derive_build_execution_surface` and `derive_test_execution_surface` as
   normal traversable edges. Under v3.2.0 the execution-contract carrier is
   present but empty. Either the carrier was drafted but the filler logic is
   incomplete, or the filler logic is gated on something the bootstrap path
   does not satisfy.

### Tier 3 — Observation-only recommendations

8. `start_auto_20260424T040432.log` shows `--auto` is not a valid odd_sdlc
   CLI flag — but historical muscle memory and the `genesis` CLI do accept
   `--auto`. Either make odd_sdlc accept the alias or document the
   difference prominently in the workspace CLAUDE.md. (Not a regression; a
   usability cliff specific to operators who came off genesis-CLI runs.)
9. The repair-frontier and gap-dossiers markdown files are operator-facing
   surfaces but each contain extensive machine-generated context. They read
   well but none of them surface *"here is the worker you need to attach to
   make this progress"* — the most important missing piece for a bare
   from-bootstrap. A single "bootstrap next step" line on the repair
   frontier would have prevented the confusion in this run.

## Contrast To B-037 / B-048 / B-049 Closure Review

The joint-closure review (`20260424T070000Z`) was correct in what it claimed:

- Source-level boundary proof reproduces. `mypy --strict` 51/51 files. Ingress
  collapse rule holds. Retirement probe clean. No overclaim.
- It also correctly identified that live from-bootstrap was out of scope:
  *"live tests and the broader from-bootstrap data_mapper.test39 wave are
  deferred until the active-ticket set is cleared. Those deferred validations
  are not being used as closure evidence for this ticket."*

This forensic is the deferred validation the review flagged. It confirms the
three tickets close at the source-level surface and it reports that the
live from-bootstrap wave is not currently traversable. The joint-closure
review also predicted one specific operational hazard:

> "If the '20 retries yield on `derive_code_surface`' recurs on the next
> from-bootstrap wave, triage as ABG transport-salvage per memory
> `feedback_abg_production_bar.md`. It is not a B-041 regression and not a
> B-037 scope item."

The current wave does not even reach `derive_code_surface` — it halts eleven
edges upstream at `derive_intent_surface`. The transport-salvage hazard is
therefore not yet observable. It will become testable only after Tier 1 items
above are closed and the pipeline can progress into the realization edges.

## Summary Verdict

`data_mapper.test39` is a genuine regression relative to `data_mapper.test35`,
but it is a regression of a different kind than the joint-closure review
closed. Joint closure fixed *typed authority seams at the source surface*. It
did not and could not fix:

- **operational bootstrap** — no worker loop was attached; test35 had one.
- **evaluator body completeness** — `intent_surface_semantically_converged`
  emits empty `{}` evidence and drives a reprice loop.
- **escape-hatch integrity** — the human-proxy path crashes inside one of the
  B-048 admitted carriers on the very first F_H gate.
- **config shape migration** — `project_constraints.yml` shape drifted
  between workspaces with no explicit migration note.

These are four distinct defects. Fixing all of them — in the order above — is
the gap work required to bring test39 to test35 level of execution. The
forensic does not recommend reopening or invalidating B-037 / B-048 / B-049;
those closures stand on source-level proof. It recommends that the *next*
ticket wave explicitly target the live from-bootstrap gap, with B-005 as the
immediate prerequisite and the empty-evidence evaluator as the bug most
likely to turn "fix and rerun" into "fix and converge."
