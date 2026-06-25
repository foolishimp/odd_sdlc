# STRATEGY: F_P Pressure, Obligation Ledgers, And Anti-F_D Drift

**Author**: codex
**Date**: 2026-06-25T16:54:49Z
**Addresses**: `.ai-workspace/tickets/active/T-204-decommission-odd-sdlc-cli-orchestration-surface.md`
**Status**: Open

## Summary

This post is commentary, not ratified specification or design.

The repeated failure pattern is not that `odd_sdlc` lacks vocabulary for
pressure. The closed tickets already named obligation carry, assurance ledgers,
F_P stage carriers, selected evaluation residual pressure, retry/yield/re-entry
dispositions, and ABG-owned continuation. The failure is that pressure keeps
getting converted into deterministic semantic reconstruction when a live proof
does not make F_P progress visible fast enough.

That conversion is the drift into F_D.

The strategy is to stop treating a deterministic compiler over unknown product
syntax as the missing release gate. The missing gate is an F_P pressure and
attenuation gate: every prompt-bearing retry must carry the prior admitted
pressure into the next F_P attempt, and the next attempt must narrow, clear, or
lawfully reroute that pressure. An identical retry with no new evidence or
narrower scope is a framework bug or reprice/block pressure, not hidden
convergence.

## Authority Read

Current product law already says recovery first attenuates the failure surface,
then iterates from that attenuated state, carrying prior evidence, residual
pressure, lawful re-entry reason, and open obligation state through ABG-owned
continuation truth. Identical retries with no narrower pressure become
blocked/reprice pressure, not convergence:

- `specification/PRODUCT.md:967-987`

Runtime governance already says the generic constructive stance favors F_P.
F_D is optimization, admission, validation, folding, and routing around
configured F_P work. A generic F_P edge cannot close from F_D success alone
unless the product contract explicitly declares deterministic authority:

- `specification/requirements/03-runtime-governance.md:36-55`

The typed construction algebra is also explicit:

- `F_P.transform` is the only workspace-editing F_P process; other F_P processes
  return typed findings, parameters, or authority-function candidates.
- deterministic code and tests are proof surfaces after semantic pressure has
  been mapped; they do not create the semantic obligation map.
- the path is transform candidate -> evaluate.C/F_P semantic rows/pressure ->
  ABG admit/events/ledgers/fold -> consequence projection -> ABG continuation.
- F_D may index, package, admit, write, execute declared commands, and project
  consequence. It must not infer semantic register rows from filenames, logs,
  language conventions, source-tree shape, archive shape, or deterministic
  tests.

References:

- `specification/requirements/18-typed-construction-algebra.md:29-42`
- `specification/requirements/18-typed-construction-algebra.md:58-120`
- `specification/requirements/18-typed-construction-algebra.md:128-142`

## Past Attempts

### 1. Assurance Ledger Wave

T-079 and T-084 were directionally correct. T-079 made obligation carry an input
dimension to the transition function and required same-edge re-entry to receive
prior state and prior gap pressure as typed data. T-084 then folded graph-owned
assurance ledgers into deterministic close/retry/block/reprice decisions.

References:

- `.ai-workspace/tickets/completed/T-079-implement-obligation-carry-assurance-ledger.md:43-85`
- `.ai-workspace/tickets/completed/T-084-compose-assurance-ledgers-into-traversal-satisfaction-tests.md:52-107`

Why it drifted:

The ledger fold became easier to reason about than the semantic pressure that
must feed it. T-085 had to reopen the wave because completed ticket claims
exceeded executable proof. That was the first repeat of the pattern: a typed
ledger exists, but the deeper evaluator dimension is under-proven, so closure
claims outrun live proof.

Reference:

- `.ai-workspace/tickets/completed/T-085-harden-assurance-ledger-validation-and-ticket-closure-claims.md:43-70`

### 2. Typed F_P Stage Wave

T-102 correctly identified the older defect: TypeScript had collapsed
F_P.transform, admission, evaluation, event emission, ledger projection, and
closure into a worker-report convention. It split typed F_P stage carriers and
made `fp_evaluate_result.json` the evaluation fact admitted into the edge
fulfillment ledger.

T-114 then demoted `worker_result_report.json` to compatibility/read-model
status. It explicitly says that the worker report must not be the carrier that
makes obligations pass.

References:

- `.ai-workspace/tickets/completed/T-102-define-typed-fp-function-stages-and-abg-owned-admission-flow.md:28-45`
- `.ai-workspace/tickets/completed/T-102-define-typed-fp-function-stages-and-abg-owned-admission-flow.md:74-101`
- `.ai-workspace/tickets/completed/T-102-define-typed-fp-function-stages-and-abg-owned-admission-flow.md:185-211`
- `.ai-workspace/tickets/completed/T-114-demote-worker-result-report-from-closure-authority.md:24-32`
- `.ai-workspace/tickets/completed/T-114-demote-worker-result-report-from-closure-authority.md:106-126`

Why it drifted:

The report was demoted, but pressure still needed a visible work surface. When
the report stopped being closure truth, the system reached for other deterministic
surfaces to make progress observable: schema-shaped sidecars, exact prompt
recipes, and later semantic row extraction helpers.

### 3. Local Loop Retirement Wave

T-140 and T-151 removed the idea that local loops, prompt-pressure action prose,
CLI retry controllers, or gap-dossier action strings can own iteration. The
target loop is observe -> bind gap to exact obligations -> choose lawful graph
action -> invoke -> admit evidence -> publish edge ledger -> project
close/yield/retry/repair/re-enter/reprice/block.

References:

- `.ai-workspace/tickets/completed/T-140-retire-local-forced-iteration-tech-debt.md:42-66`
- `.ai-workspace/tickets/completed/T-140-retire-local-forced-iteration-tech-debt.md:80-90`
- `.ai-workspace/tickets/completed/T-140-retire-local-forced-iteration-tech-debt.md:206-224`
- `.ai-workspace/tickets/completed/T-151-one-closed-computational-loop-and-runner-evaluator-sovereignty.md:52-66`

Why it drifted:

Removing the local retry owner did not automatically make the next F_P attempt
consume pressure well. When ABG-owned retry happens but the retry prompt does
not receive an attenuated pressure packet, the system retries the same vague
work. Operators then try to compensate with local prompt heuristics or
deterministic reconstruction. That is local-loop drift reappearing as prompt or
compiler drift.

### 4. F_D Semantic Deletion Wave

T-183 is the clearest anti-drift ticket. It required removal of in-run F_D
register synthesis, required missing F_P evaluator output to block instead of
falling back to F_D semantics, and required tests that prove deterministic
semantic register rows are deleted, rewritten to supply F_P/project authority, or
converted into negative tests. Its closure note says deterministic assurance
ledgers became diagnostic-only and could not publish `retry_same_edge`.

References:

- `.ai-workspace/tickets/completed/T-183-delete-fd-semantic-registers-and-restore-bare-admission.md:740-846`
- `.ai-workspace/tickets/completed/T-183-delete-fd-semantic-registers-and-restore-bare-admission.md:878-918`
- `.ai-workspace/tickets/completed/T-183-delete-fd-semantic-registers-and-restore-bare-admission.md:934-952`

T-187 repeated the same correction after the drift came back as prompt text:
framework-authored Node.js recipes in F_P evaluator prompts were prescribing how
to derive semantic rows from ADR tables. T-187 deleted the recipe and kept F_D as
scaffolding, helper, admission, and projection only.

References:

- `.ai-workspace/tickets/completed/T-187-restore-fp-evaluator-prompt-boundary-and-proportionality.md:40-64`
- `.ai-workspace/tickets/completed/T-187-restore-fp-evaluator-prompt-boundary-and-proportionality.md:72-94`
- `.ai-workspace/tickets/completed/T-187-restore-fp-evaluator-prompt-boundary-and-proportionality.md:107-110`
- `.ai-workspace/tickets/completed/T-187-restore-fp-evaluator-prompt-boundary-and-proportionality.md:153-156`

Why it drifted:

F_P liveness and observability were treated as reasons to prescribe semantic
method. The lawful pressure requirement is "show a durable first semantic
update, then iterate." The unlawful shortcut is "give the evaluator a
deterministic table parser or row-construction recipe so it cannot fail to
produce rows." That shortcut makes F_D the hidden semantic evaluator.

### 5. Data Mapper Live-Run Bug Wave

T-184 records the practical form of the problem. Data Mapper runs exposed
selected F_P pressure being dropped or misfolded, current gap dossiers being
lost, first-update visibility being confused with semantic depth, and prompt
recipes being used as reliability patches.

Examples:

- LD-031: first update visibility is required, but F_D cannot prescribe semantic
  evaluator work through prompt-template recipes.
- LD-033: selected evaluate.C/F_P residual pressure must prevent consequence
  close even when edge-local measured gain looks close-ready.
- LD-036: retry context must prefer the current admitted gap dossier; residual
  pressure is a bounded cause/evidence summary, not hundreds of reconstructed
  instructions.
- LD-038: first-write visibility was insufficient because later semantic
  progress remained hidden; the exact second-update command was not accepted as a
  final fix.
- LD-042: prompt-bearing generic edges carry refs, scope, schema, and pressure;
  they do not own a separate prompt-template constitution.

References:

- `.ai-workspace/tickets/completed/T-184-partition-handoff-into-compute-stage-boundary-modules.md:340-352`
- `.ai-workspace/tickets/completed/T-184-partition-handoff-into-compute-stage-boundary-modules.md:358-378`
- `.ai-workspace/tickets/completed/T-184-partition-handoff-into-compute-stage-boundary-modules.md:550-568`
- `.ai-workspace/tickets/completed/T-184-partition-handoff-into-compute-stage-boundary-modules.md:683-727`

Why it drifted:

Data Mapper is large enough that vague retry does not naturally attenuate. When
the retry pressure is not explicit, the system compensates by adding more
deterministic summary, more prompt recipe, or more target-specific branch logic.
That increases apparent liveness while weakening product law.

### 6. ABG Boundary Cleanup Wave

T-197 fixed several boundary leaks: ABG owns runtime events, admission, payload
ledgers, assurance fold, traversal transition, continuation, replay, and
frontier scheduling. odd_sdlc owns SDLC edge meaning, overlays, gain/closure
interpretation, product assets, analyzer projections, prompt policy overlays,
and installed Spec Method entry.

The E6 result is important: product incompleteness can remain an F_D finding, but
nonlocal repair-surface rows now produce typed upstream re-entry/yield basis for
ABG instead of default same-edge retry.

References:

- `.ai-workspace/tickets/completed/T-197-reconcile-product-boundary-and-remove-authority-leakage.md:318-326`
- `.ai-workspace/tickets/completed/T-197-reconcile-product-boundary-and-remove-authority-leakage.md:382-392`
- `.ai-workspace/tickets/completed/T-197-reconcile-product-boundary-and-remove-authority-leakage.md:468-500`
- `.ai-workspace/tickets/completed/T-197-reconcile-product-boundary-and-remove-authority-leakage.md:690-700`

Why it drifted:

The ownership split is correct, but a blocked/gap_stop can still be diagnosed
too late as terminal failure or patched with local prompt/schema work. The
pressure criterion has to be earlier: did ABG receive a typed retry/yield/reentry
fact, and did the next F_P attempt consume the exact prior pressure?

## Why We Keep Failing

1. **We mistake observability for semantics.**
   A content register, ledger row, sidecar, or checkpoint makes progress visible.
   It does not by itself prove semantic judgment happened.

2. **We let F_D become a comfort layer when F_P is slow.**
   F_D is reliable, inspectable, and testable, so it is tempting to move semantic
   interpretation there when live proof runs stall. That violates the generic
   F_P stance.

3. **We close tickets on shape before depth.**
   Several waves built the right carrier shape, then needed follow-up tickets
   because validation bullets or live proof depth lagged the closure claim.

4. **We treat retry as repetition instead of attenuation.**
   Retry is lawful only if the next attempt carries a smaller, sharper, or
   rerouted pressure packet. Repeating the same broad prompt with the same
   missing semantics is not iteration.

5. **We solve unknown syntax with accidental compilers.**
   ADR tables, source trees, filenames, language conventions, and archive shapes
   can provide structural context. They cannot be parsed by generic SDLC F_D into
   product semantic rows unless a product-owned deterministic contract declares
   that authority.

6. **We blur current product pressure and upstream runtime ownership.**
   Some fixes belong in ABG because they are continuation/replay/runtime truth.
   Some fixes belong in odd_sdlc because they are product pressure maps and prompt
   policy. When that split is unclear, local SDLC code starts acting as a
   runtime substrate.

## Strategy

### Define The Pressure Surface Before More Gates

For the current T-204 line, the controlled surface is not product syntax. It is
the admitted pressure packet around an F_P attempt:

- selected graph/vector/edge/composition identity
- selected target carrier and authority refs
- prior admitted evidence refs
- prior gap dossier or residual-pressure carrier refs
- open obligation rows and missing semantic floor
- lawful re-entry point
- retry/yield/re-entry basis supplied through ABG continuation truth
- checkpoint status and whether the checkpoint is non-closeable
- next required semantic update, expressed as pressure, not as a parsing recipe

F_D can validate this packet's shape, identity, provenance, freshness, selected
composition, target-carrier contract, and closure non-admission rules. F_D cannot
derive the semantic rows that satisfy the packet unless a product-specific
deterministic contract explicitly makes that edge deterministic.

### Make Attenuation The Release Gate

For prompt-bearing retries, release proof should compare attempt N to attempt
N+1:

```text
attempt N pressure:
  missing obligations / semantic floor / evidence refs / re-entry reason

attempt N+1 must:
  clear some pressure, or
  refine pressure into a narrower/lower lawful surface, or
  reroute through typed yield/re-entry/reprice/block, or
  fail as non-attenuating retry
```

The failing case is:

```text
same selected edge
same missing semantic floor
same absent or empty checkpoint semantics
same retry route
no new evidence
```

That is not lawful recovery. It is hidden churn.

### Keep F_D Bounded To Carrier Mechanics

Allowed F_D work:

- structural schema validation
- exact selected-carrier admission
- provenance/freshness/identity checks
- non-closeable checkpoint admission
- atomic helper mechanics for moving F_P-supplied values into selected carrier
  envelopes
- residual-pressure packaging and fold
- deterministic comparison of pressure deltas across attempts
- fail-closed detection when required selected F_P artifacts are absent

Forbidden F_D work:

- parse ADR/source/product syntax into semantic design-depth rows
- infer requirement fulfillment from filenames, logs, language conventions, or
  archive shape
- synthesize product entities, operations, state machines, or obligation maps for
  generic SDLC edges
- convert an empty or first-only checkpoint into closure evidence
- introduce target-specific JS/Rust/Scala/Python/Data Mapper branches into the
  generic SDLC runtime
- replace F_P semantic judgment with a deterministic "compiler" over unknown
  product syntax

### Use F_P As The Review Gate, Not A Local Compiler

The compiler/review lane for T-204 should be ABG-based and dogfooded as an F_P
graph function over the release package. odd_sdlc may publish the product review
package and consume the admitted result. odd_sdlc should not create a local
compiler graph function or second deterministic product-syntax compiler to
produce release truth.

The deterministic part of the gate checks whether the release package contains
the required admitted carriers, pressure packets, and continuation facts. The
semantic part is F_P review over those admitted facts.

### Data Mapper Closure Implication

Data Mapper should not be fixed by changing Data Mapper source for this class of
failure. It should pressure-test odd_sdlc/ABG.

A clean Data Mapper close requires more than "eventually produced files." It
requires evidence that:

- the first blocked/gap_stop or review-grade block emitted a typed pressure
  packet;
- the retry prompt/package carried that exact pressure into the next F_P attempt;
- the next F_P attempt narrowed, cleared, or lawfully rerouted the pressure;
- selected evaluate.C/F_P residual pressure prevented premature consequence
  close;
- no deterministic ADR/source parser or target-specific runtime branch supplied
  the missing semantic rows.

## Immediate Checklist For T-204

1. Treat current compiler gaps as pressure-gate gaps, not as an invitation to
   build a deterministic semantic compiler.
2. Add or verify the ABG-owned review lane can consume a release package that
   includes pressure packets, gap dossiers, target-carrier refs, and continuation
   facts.
3. Add a non-attenuation regression: two same-edge attempts with identical
   missing semantic floor and no new evidence fail as blocked/reprice pressure.
4. Keep first semantic checkpoints non-closeable. They prove liveness only.
5. Keep deterministic helpers authority-neutral. They may move F_P-supplied
   values into envelopes; they may not derive semantic values.
6. Require hello-world default live proofs to pass without scenario continuation
   through blocked facts before using them as release proof.
7. Require Data Mapper proof to show attenuation across retries, not just final
   artifact materialization.

## Non-Negotiable Boundary

F_P pressure is the only lawful alternative to a fully disambiguated deterministic
total function over the product input language. Since generic odd_sdlc does not
own a fully disambiguated total function for arbitrary product syntax, the
release gate must force F_P pressure, observation, and attenuation.

Anything else is F_D drift.
