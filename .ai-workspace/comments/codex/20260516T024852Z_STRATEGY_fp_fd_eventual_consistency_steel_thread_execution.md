# Strategy: Authority Placement For F_P/F_D Completeness

**Created**: 2026-05-16T02:48:52Z  
**Author**: codex  
**Status**: Superseding strategy surface  
**Related Reference**:
`.ai-workspace/comments/codex/20260516T021725Z_MASTER_test35_attempts_failure_reference.md`
**Supersedes**:

- `.ai-workspace/tickets/completed/T-168-build-design-consumer-test-pipeline-for-co-affirming-implementation.md`
- `.ai-workspace/tickets/completed/T-169-implement-gtl-target-carrier-contracts-for-sdlc-vector-outputs.md`
**Implementation Ticket**:
`.ai-workspace/tickets/active/T-170-implement-authority-placement-strategy-and-repair-fd-overreach.md`

## Supersession

This strategy supersedes T-168 and T-169 as the controlling work surface.

Those tickets are not invalid because their problem statements were fake. They
are superseded because their mechanisms were too narrow and risked preserving
the same authority-placement error this strategy corrects.

Absorbed valid scope:

- T-168: tests and implementation must co-affirm design interpretation through
  admitted execution evidence;
- T-169: GTL target carrier contracts must preserve output identity, envelope
  law, worker-fillable boundaries, and replay evidence.

Rejected placement:

- test-pipeline conformance as product completeness;
- target-carrier admission as SDLC content closure;
- deterministic register shape as the main worker objective;
- overlay completion that clears pressure without execution or F_P/content
  evidence.

The replacement authority is this document's loop:

```text
F_D narrows and preserves.
F_P constructs and judges ambiguous content.
Execution returns product truth.
Iteration closes completeness.
```

Implementation must not continue T-168 or T-169 as independent active tickets.
Their usable content is carried here and must be applied through the corrected
authority model.

## Position

The correction is an authority adjustment, not a discard of the current
framework.

This is not anti-typing. It is a placement rule. Typing remains useful when it
reduces ambiguity, preserves identity, and lowers worker variance. It becomes
harmful only when type/register compliance becomes the product completeness
predicate.

The useful compression is:

```text
Intent sets direction.
Product defines broad shape.
Requirements and design constrain work.
F_D narrows variance.
F_P resolves ambiguity.
Execution exposes truth.
Iteration produces completeness.
```

The framework drifted when deterministic structure started occupying the
closure center. That produced two opposite symptoms:

```text
data_mapper T-164:
  too permissive on content
  closes with null execution evidence and stubs

current hello-world:
  too restrictive on internal register shape
  burns worker passes on carrier/register compliance
```

Both symptoms have the same root: `F_D` is doing work that belongs to the
probabilistic/constructive loop.

## Product Authority Basis

The product definition already states the intended boundary.

Generic SDLC gates expect `F_P` for constructive SDLC work:

```text
F_P interprets open-ended product authority, changes the governed workspace,
produces candidate assets, and returns worker evidence for admission.
```

`F_D` is the deterministic support layer around that constructive path:

```text
preflight bindings
reject malformed inputs
validate capability evidence
admit returned facts
fold ledger rows
compute deterministic diagnostics
route next action from admitted truth
```

It is not the generic constructor for open-ended SDLC work and it does not
replace configured `F_P` where product-changing judgment is required.

## Why F_P Exists

`F_P` exists because the product world is ambiguous.

Software construction contains:

- partial authority
- incomplete design
- multiple viable interpretations
- missing implementation detail
- tradeoffs
- probabilistic judgment
- evolving evidence
- repair after execution

Those are not defects in the model. They are the reason the model needs a
probabilistic constructive regime.

Trying to eliminate ambiguity before allowing construction creates a trap:

```text
more schema
-> more register constraints
-> more carrier repair
-> less product work
```

The current hello-world run demonstrates this trap. The product content was
simple, and real execution evidence eventually existed, but the framework spent
most of its effort on design-depth and component-depth register conformance.

## Why F_D Still Matters

`F_D` is still valuable.

It lowers variance and cost by making the work legible before and after F_P
acts.

Correct `F_D` uses:

- constrain worker input
- publish stable target bindings
- prevent ambient path drift
- validate protocol identity
- admit evidence records
- preserve file/digest/provenance facts
- fold ledger rows
- expose residual pressure
- route the next lawful action

Incorrect `F_D` uses:

- decide product meaning
- decide semantic fulfillment
- close generic constructive edges
- force all internal register shape to be perfect before progress
- treat carrier compliance as behavioral proof
- treat materialization as completeness

The adjustment is:

```text
F_D supports the loop.
F_D does not own completeness.
```

## Eventual Consistency

The product should not require every surface to be complete before progress.

It should require:

- admitted partial truth
- explicit residual pressure
- replayable evidence
- a lawful next action

That is eventual consistency.

Incomplete state is allowed. False closure is not allowed.

The system may advance with partial design, partial implementation, partial
test coverage, or partial evidence as long as the remaining pressure is visible
and cannot disappear behind a convergence projection.

The test35 lesson is that productive state does not need to be clean. It needs
to be alive:

```text
current workspace
+ prior evidence
+ gap pressure
+ failed proof
+ next F_P pass
-> deeper workspace
```

## Pressure Preservation Predicate

Eventual consistency needs a concrete pressure predicate, not only a principle.

Carrier:

Use the existing closure/consequence surfaces as the carrier of surviving
pressure. The per-edge source is the closure decision. Overlay and next-action
surfaces are projections over that source, not independent pressure truth:

```text
SdlcEdgeClosureDecision.requiredPressureRefs
SdlcEdgeClosureDecision.residualPressureRefs
SdlcEdgeFulfillmentLedger.downstreamPressureRefs
SdlcOverlaySegmentCompletion.remainingRequirementPressureRefs
SdlcNextActionProjection.remaining*PressureRefs
```

If those surfaces are not expressive enough, extend that single consequence
line. Do not create a second pressure truth.

Premature-clearing prevention:

```text
pressureRef p may be removed only when the close/evaluation record cites
admitted evidence that satisfies p under the edge's declared content/evidence
policy.
```

No edge, overlay, or traversal projection may set residual or remaining
pressure to `[]` unless every required or downstream pressure ref is paired with
one of:

- a clearing evidence ref;
- a lawful reprice/re-entry ref;
- an explicit no-close/projection-only policy that says the pressure is not
  owned by this edge.

Clearing evidence:

Evidence that may clear pressure:

- admitted execution evidence for declared execution pressure
- admitted F_P content judgment for ambiguous product meaning
- admitted materialization evidence for materialization-only pressure
- admitted target-carrier identity evidence for carrier-identity pressure
- explicit reprice/re-entry decision that moves the pressure to a new authority
  surface

Evidence that must not clear pressure by itself:

- worker prose
- worker percent complete
- requirement tag presence
- register shape admission
- materialization manifest existence
- overlay segment completion
- `status: passed`
- `product_converged`

Overlay completion must be a projection over edge closure decisions and
residual pressure. It must not reset remaining pressure to `[]` merely because a
local edge closed.

## Steel Thread

The steel thread is the antidote to both shallow breadth and schema overreach.

A steel thread is not a thin fake. It is a narrow executable product path.

For a hello-world product, the steel thread is:

```text
authority
-> source file
-> test file
-> execution command
-> execution evidence
-> residual pressure or close
```

For data_mapper, the steel thread is:

```text
requirement/design authority
-> one bounded behavior slice
-> product source
-> behavioral test source
-> sbt compile / sbt test
-> admitted execution evidence
-> repair/deepen/reprice
```

The graph can widen after the thread proves behavior. It should not fan out
into every design, qualification, repair, schedule, and closure surface before
the executable thread has carried actual content.

## Completeness Through Execution

Completeness is not declared by intent.

Completeness is not guaranteed by product shape.

Completeness is not achieved by design/register conformance.

Completeness is produced by execution and iteration.

The valid loop is:

```text
direction
-> product shape
-> bounded steel thread
-> F_P construction
-> execution
-> observed failure/success
-> repair/deepen/reprice
-> repeat
```

Execution is where product truth returns to the system.

For executable product work, closure requires execution evidence when the edge
declares execution. Without that evidence, the state may be pending, failed,
blocked, yielded, or repairable. It is not complete.

The runtime should attempt execution as soon as the artifact is minimally
runnable, not when the product is semantically complete.

Execution Attempt Threshold:

```text
1. the declared execution command resolves
2. the declared input/source/test files exist
3. the files pass the language's cheapest load/parse/import check when such a
   check is available
4. the worker did not terminate by crash, policy violation, or missing-output
   protocol failure
```

Those are F_D mechanics. They gate the execution attempt, not product closure.
Runtime or test failure is the real signal and should become pressure for the
next F_P pass.

## What This Changes

The current machinery remains useful:

- typed carriers
- target contracts
- materialization manifests
- execution evidence surfaces
- ledgers
- closure decisions
- next-action projections
- retry/yield/repair vocabulary
- test pipeline assets

The change is authority placement.

Current drift:

```text
typed/register admission
-> closure pressure clears
-> product convergence
```

Corrected model:

```text
typed/register admission
-> lower variance input/output
-> F_P construction/evaluation
-> execution evidence when declared
-> iteration pressure or close
```

## Currently Mispositioned Mechanisms

The immediate mechanism to audit is the target-carrier path introduced through
ABIogenesis T-133 and previously adopted by odd_sdlc through T-169.

Correct position:

```text
target carrier admission
-> output identity / envelope evidence admitted
-> pressure or diagnostic rows available to closure/evaluation
```

Wrong position:

```text
target carrier admission
-> product/content closure precondition
-> worker optimizes for envelope/register shape
```

The target-carrier contract should stay mandatory as an output-shape and
identity contract. It should not evaluate SDLC content quality, design
completeness, implementation correctness, or test adequacy.

Adjustment map:

| Mechanism | Current risk | Corrected position |
| --- | --- | --- |
| Target carrier admission | Missing/rejected carrier becomes the main closure obstacle even when content can still be constructed or executed. | Admit/reject output envelope identity; rejected protocol identity blocks evidence admission, incomplete content routes to F_P/content pressure. |
| Design-depth register admission | Register field mismatch becomes same-edge repair work even when downstream content can continue. | Classify by downstream-read graph: consumed fields may block; unconsumed diagnostic fields record pressure only. |
| Component-depth register admission | Worker repairs envelope rows instead of product/test behavior. | Use as admitted content/evidence shape; do not let row compliance stand in for behavior. |
| Postflight closure blocking | Postflight shape or carrier status becomes a substitute close predicate. | Postflight admits facts and emits pressure; close still requires F_P/content judgment and execution evidence when declared. |
| Gap dossier consumption | Gap prose and retry actions can become rival closure/routing authority. | Gaps remain read models over closure decision + residual pressure. |
| Overlay segment completion | Local close can clear remaining pressure and project `product_converged`. | Overlay completion copies surviving pressure from edge/consequence truth and cannot improve it. |

## Test35 Recovery Rule

A future "back to test35" claim must prove this chain:

```text
1. Minimal product authority is admitted.
2. The steel-thread behavior is selected.
3. F_P may start construction from that minimal authority.
4. F_D constrains input/output in parallel or between attempts to reduce
   variance; it is not a waterfall precondition for the first F_P act.
5. F_P constructs or repairs product content.
6. Tests are created or repaired from the same authority.
7. The declared execution command runs once the artifact is minimally runnable.
8. Execution evidence is admitted.
9. F_P/content judgment evaluates whether behavior satisfies authority.
10. F_D records and folds admitted facts without rejudging product meaning.
11. Remaining pressure survives into the next action, or the edge closes.
```

If a proposal only adds stricter schema, stronger registers, more carrier
fields, or richer projections, it is not test35 recovery by itself.

If a proposal makes execution and iteration easier while preserving residual
pressure, it is aligned.

## Practical Consequences

### 1. Input Typing Should Be Templates, Not Tripwires

Typed input should reduce ambiguity for the worker.

It should not turn every shape variation into a blocking register repair unless
the malformed shape prevents F_P from understanding the task or prevents the
system from admitting evidence.

### 2. F_D Failures Need Severity

Not every deterministic mismatch is closure-blocking.

Useful classes:

```text
protocol_invalid:
  cannot admit evidence or preserve identity
  blocks

construction_context_invalid:
  F_P cannot understand or safely act
  blocks or asks for re-entry

diagnostic_shape_invalid:
  internal register is imperfect but product work can continue
  records residual pressure

content_unproven:
  product behavior not yet proven
  routes to F_P/execution/iteration
```

The boundary is decided by the downstream-read graph, not operator taste.

```text
If a malformed field is read by evidence admission, routing, closure, or
execution command construction:
  construction_context_invalid or protocol_invalid

If a malformed field is not read by any downstream routing/closure/evidence
consumer:
  diagnostic_shape_invalid
```

Worked examples:

| Class | Example | Old behavior | Correct behavior |
| --- | --- | --- | --- |
| `protocol_invalid` | target carrier contract ref/digest missing for an output that must be admitted | TypeError or generic block | block admission with typed protocol diagnostic |
| `construction_context_invalid` | execution command cannot resolve or declared source file is missing | worker loops or archive prose | block or re-enter before execution attempt |
| `diagnostic_shape_invalid` | design-depth register contains an extra unconsumed `stimulus` field | same-edge retry to repair register shape | admit product work, record residual diagnostic pressure |
| `content_unproven` | code exists but tests are missing/not executed | materialization close or carrier repair | route to F_P/test/execution pressure |

Current blocking-reason mapping examples:

| Current code/detail | Severity class | Corrected behavior |
| --- | --- | --- |
| `worker_report_admission_failed` | `protocol_invalid` | returned report cannot be admitted; block evidence admission with typed diagnostic |
| `output_file_missing` | `construction_context_invalid` | declared output is absent; re-enter construction before execution attempt |
| `worker_authority_read_outside_workspace` | `construction_context_invalid` | authority boundary is unsafe; block and re-enter policy/context |
| `test_execution_evidence_missing` | `content_unproven` | do not close; route to execution attempt or evidence ingestion |
| `test_execution_failures_present` | `content_unproven` | preserve failure as F_P repair pressure, not schema repair |
| `test_execution_zero_tests_observed` | `content_unproven` | tests did not prove behavior; route to test/content repair |
| `obligation_fulfilled_without_output_coverage` | `content_unproven` | worker assertion is not coverage; preserve obligation pressure |
| `obligation_payload_insufficient` | `construction_context_invalid` | evaluator lacks the minimum payload needed to route or judge; re-enter context construction |
| `assurance_ledger_reason` carrying an unconsumed register-field mismatch | `diagnostic_shape_invalid` | record diagnostic pressure only when the downstream-read graph proves no routing/closure/evidence consumer reads that field |
| `target_carrier_admission_missing` analyzer diagnostic | `protocol_invalid` for envelope identity only | block evidence admission for the missing envelope; do not treat it as content failure |

### 3. Execution Evidence Is The Completeness Lever

For executable work, the runtime should bias toward running the declared
execution command as soon as a coherent steel-thread artifact exists.

Early execution is useful even when it fails.

Failure is not waste. It is the highest-quality pressure for the next F_P pass.

### 4. Closure Must Preserve Pressure

A closed segment cannot erase downstream pressure.

If code exists but tests are missing, pressure remains.

If tests exist but are not run, pressure remains.

If execution fails, pressure remains.

If stubs remain in executable code, pressure remains.

If the edge is intentionally only a scaffold, the contract must say that.

### 5. Small Products Need Small Graphs

Hello-world should not exercise the full data_mapper component-depth apparatus.

The framework needs a narrow steel-thread overlay for small products:

```text
conform authority
-> source
-> test
-> execution
-> close or residual pressure
```

The heavier design/testing lifecycle should attach when the product, risk, or
declared overlay requires it.

Overlay selection should come from an admitted profile binding or explicit
operator selection, not implicit graph size guessing:

```text
project profile overlay binding:
  overlayRef
  overlayStrategy

overlayStrategy:
  thread
  breadth
  full_lifecycle
```

Default rule:

- explicit `overlay:<ref>` or equivalent operator target wins
- otherwise the conformed project profile selects the overlay strategy
- `hello_world` profile selects `thread`
- `data_mapper` profile selects `breadth` or `full_lifecycle` according to the
  declared proof goal
- absent profile signal defaults to conservative breadth, but must preserve
  pressure and execution evidence requirements

## Why This Is An Adjustment, Not A Rewrite

The current system has most of the right mechanical parts.

The problem is not that carriers, ledgers, target contracts, or F_D checks are
wrong. The problem is that they have been promoted too high in the authority
stack.

The refactor should demote deterministic structure from completeness authority
to variance-reduction and evidence-preservation support.

The resulting model is closer to the existing product definition than the
current implementation drift:

```text
F_D narrows and preserves.
F_P constructs and judges ambiguous content.
Execution returns product truth.
Iteration closes completeness.
```

## Measurement

The correction must be measurable on preserved run archives. The read-only
T-161 analyzer is the right home for these views because it does not create
closure or routing authority.

Minimum metrics:

| Metric | Why it matters |
| --- | --- |
| convergence rate per edge | Attempts to first close-on-execution; detects whether execution-backed closure is becoming reachable. |
| execution coverage of admitted obligations at close | `execution_backed_close_relevant_obligations / close_relevant_obligations`; proves closure is backed by execution where execution is declared. |
| F_D failure mix | `count_by_fd_failure_severity / total_fd_failures`; if everything remains `construction_context_invalid`, severity placement did not land. |
| worker-briefs-to-executed-test ratio | Detects hello-world style framework bloat. |
| residual-pressure survival | Counts pressure refs present before and after edge/overlay close; flags pressure disappearing without clearing evidence. |
| attempts-to-first-execution | Measures whether the steel thread is reaching execution sooner. |

Target trend:

```text
small product:
  fewer worker briefs before execution
  earlier test execution
  no pressure disappearance
  diagnostic F_D failures recorded without dominating work

large product:
  more execution-backed obligation closure
  pressure preserved across partial closes
  failed execution routes to F_P repair/deepening
```

## Decision Test For Next Work

Before opening or implementing the next ticket, ask:

1. Does this make the steel thread execute sooner?
2. Does this preserve residual pressure when execution is missing or failing?
3. Does this keep `F_P` as the content judgment authority?
4. Does this keep `F_D` in admission/folding/routing support?
5. Does this reduce worker ambiguity without making register compliance the
   worker's main job?
6. Does this prove completeness through execution and iteration rather than
   through upstream declaration?

If the answer is no, the work may still be useful platform hygiene, but it is
not the correction needed to recover test35 behavior.
