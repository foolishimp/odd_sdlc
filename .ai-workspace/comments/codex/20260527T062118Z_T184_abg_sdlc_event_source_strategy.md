# T-184 ABG / odd_sdlc Event Source Strategy Inventory

Status: strategy commentary, not ratified specification or design.

This post captures the current event-source boundary question raised during
T-184. The governing concern is that ABG owns event sourcing, event calculus,
runtime truth, and replay visibility. odd_sdlc may use ABG interfaces and may
produce domain payloads or evidence, but it must not create a rival hidden event
authority.

## Evidence surfaces

- ABG runtime event contract:
  `/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/code/src/abg/m03/contracts/carriers.ts`
- ABG event interface:
  `/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/code/src/abg/m03/events/emit.ts`
- ABG public event ingress:
  `/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/code/src/app/m04/event_ingress/ingress.ts`
- ABG installed event stream sink:
  `.ai-workspace/events/events.jsonl`
- odd_sdlc installed event sink adapter:
  `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/code/src/operator/event_store.ts`
- odd_sdlc current producers:
  `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/code/src/install/installer.ts`
  and
  `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/code/src/operator/installed_operator.ts`

## Working boundary

`emit(events, sink)` is the ABG event interface contract. It validates each
`RuntimeEvent` and passes it to a supplied `RuntimeEventSink`.

`.ai-workspace/events/events.jsonl` is the installed canonical event stream
sink. The file path is not itself the violation. The violation is any
odd_sdlc path that treats local code as event authority instead of calling an
ABG public/app/runtime interface that emits legitimate ABG events.

The local odd_sdlc appender has now been tightened to call ABG `emit(...)`
before appending JSONL. That makes the appender a sink adapter. It does not
settle whether every event producer is lawful.

## odd_sdlc current event-log choices

| Producer surface | Event kinds | Current source | Reason and utility | Dependencies | Conformity read |
|---|---|---|---|---|---|
| `appendOddSdlcRuntimeEvents()` | Any `RuntimeEvent` passed to it | odd_sdlc sink adapter calling ABG `emit(...)` | Persists the installed ABG stream to `.ai-workspace/events/events.jsonl` | All replay, gaps, aggregate projection, event calculus, retry/frontier projections | Conforming as sink adapter only. Must not become an event factory. |
| `emitOddSdlcWorkspaceInstallationAdmitted()` | `workspace_installation_admitted` | odd_sdlc installer locally builds object and sends to sink | Records installed runtime identity and package/install provenance | Install provenance, runtime identity, initial gaps/start context | Needs ABG install/bootstrap or explicit ABG event ingress ownership. Local object construction is suspect. |
| `runEngineIterateAsync()` event sink | ABG engine traversal events | ABG engine runner | Records basis, graph call, frame, vector, plugin, FH, terminal transitions | Runtime aggregate projection, event calculus, gaps, live status, replay | Conforming when odd_sdlc only provides plugins and sink. |
| `invokeSupervisedProcessActor()` event sink | `actor_process_*`, interruption/probe events | ABG process actor | Makes worker lifecycle, stream, heartbeat, timeout, signal, and exit observable | Process evidence, liveness, timeout diagnosis, runtime activity projection | Conforming when canonical stream receives ABG actor events. Per-run process JSONL is evidence only. |
| `runtimeEventsForFpTransformResult()` | Payload/admission event set for transform result | ABG helper with odd_sdlc payload/evidence | Admits plugin transform output and supporting evidence into runtime truth | Payload ledger, closure input, evaluate/consequence decisions | Likely conforming if used as ABG helper, but needs per-event causation review. |
| `writeTraversalSelectionAudit()` | `fd_authority_outcome_admitted` | odd_sdlc writes audit artifact, then constructs ABG factory event | Publishes traversal-hop selection, pressure preservation, blocked/accepted F_D outcome | Construction pressure package, retry frontier, traversal selection, edge closure | Borderline. Should be an ABG F_D authority/admission interface, not arbitrary local emission. |
| `writeFrontDoorTraversalSelectionAudit()` | `fd_authority_outcome_admitted` | odd_sdlc front-door audit with ABG factory event | Admits first-vector target graph/overlay traversal choice | Front-door decomposition, selected graph function, first traversal hop | Borderline for the same reason. |
| `replayEventsWithGraphContinuationCursor()` | `vector_traversal_planned`, `vector_evaluated`, `vector_closed` | odd_sdlc synthetic replay cursor events | Marks skipped prior vectors as accepted/closed so replay resumes at a requested vector | Runtime aggregate projection, closed vector set, replay cursor | High risk. This is direct traversal-state authorship and should move behind ABG replay/cursor API. |
| `appendFdConformanceRuntimeEvents()` | `runtimeEventsForIterationDecision(...)`, `vector_evaluated`, `vector_closed` | odd_sdlc projection decision plus ABG factories | Closes managed `conform_project` traversal edge after F_D conformance | Iteration advance decision, runtime aggregate, managed traversal ledger | High risk. Vector acceptance/closure should be ABG runner transition. |
| `repairReentryGraphSpanRuntimeEvents()` | `graph_span_evaluation_scheduled`, `graph_span_assessed`, `graph_span_foldback_evaluated`, `graph_reentry_planned`, `graph_reentry_applied` | odd_sdlc computes repair span, uses ABG graph-span factories | Re-enters graph at the earlier repair point when component repair evidence shows dropped obligations | Graph reentry frontier, gap dossier, span foldback, repair planning | Borderline. Event shape is ABG, but ownership should be an ABG graph-span/reentry interface. |
| `postActionReentryGraphSpanRuntimeEvents()` | Same graph span/reentry set | odd_sdlc computes post-action span, uses ABG factories | Re-enters graph after consequence selects retry/repair/re-enter | Edge closure decision, next-action projection, graph reentry frontier | Borderline. Same required boundary as repair reentry. |
| `runEventedNativeSagaFrontier()` | `branch_*` saga frontier events | ABG saga frontier runner | Records branch leases, branch payloads, failures, releases, fan-in | Parallel materialization frontier, fan-in projection, branch write territory | Conforming when odd_sdlc supplies tasks/frontier declaration and ABG emits events. |
| Per-run `worker_process_events.jsonl` artifacts | Process-event mirror, not canonical event stream | odd_sdlc archive artifact | Forensic process evidence tied to an operator run | Worker report, system artifacts, postflight diagnosis | Must remain evidence only. If treated as runtime truth it violates ABG visibility. |

## ABG RuntimeEvent inventory

The ABG `RuntimeEvent` union currently contains 93 event kinds. The table below
lists each event, the source that should own it, the reason and utility, and the
main dependency surface that currently makes the event useful.

| Event | Source owner | Reason and utility | Dependencies |
|---|---|---|---|
| `basis_admitted` | ABG engine admission | Opens a runtime basis for a graph function, policy bundle, job, run, and work key. | Runtime aggregate, replay, gaps/live status, event calculus. |
| `fd_advance_ready` | ABG engine F_D | Declares the front-door advance gate ready for a basis. | Iteration advance decision, traversal transition, aggregate projection. |
| `fp_dispatch_requested` | ABG engine F_P | Requests plugin dispatch for the selected F_P edge. | Actor invocation, dispatch ref, payload/admission events. |
| `actor_invocation_started` | ABG engine actor invocation | Opens an actor invocation with attempt, dispatch, and result identity. | Actor result observation, retry, process evidence correlation. |
| `actor_result_artifact_observed` | ABG engine actor invocation | Links an actor result artifact into runtime evidence. | Payload/evidence admission, postflight, closure. |
| `actor_invocation_closed` | ABG engine actor invocation | Closes actor invocation as completed or blocked. | Vector evaluation, retry, consequence, terminal state. |
| `actor_process_started` | ABG process actor | Records command, cwd, pid/session, timeout, stdout/stderr refs. | Liveness, process transcript evidence, timeout/retry diagnosis. |
| `actor_process_start_failed` | ABG process actor | Records failure to launch a worker process. | Worker failure classification, blocked dispatch, retry/escalation. |
| `actor_process_stream_observed` | ABG process actor | Observes stdout/stderr stream chunks without making transcript files hidden authority. | Runtime activity projection, forensic artifact refs, progress diagnosis. |
| `actor_process_heartbeat` | ABG process actor | Proves long-running worker activity. | PTY/event timer reset, liveness, timeout avoidance. |
| `actor_process_timeout` | ABG process actor | Records timeout breach for a process actor. | Signal/exit events, interruption diagnosis, retry/escalation. |
| `actor_process_signal_sent` | ABG process actor | Records termination signal sent to process actor. | Timeout cleanup, process lifecycle, evidence trail. |
| `actor_process_exited` | ABG process actor | Records status, signal, elapsed time, timeout flag, and error. | Actor closure, postflight, retry/escalation. |
| `runtime_activity_probe_observed` | ABG observer/transport | Records visible activity probes from PTY, streams, tool calls, append/write operations, or lifecycle. | Liveness projection, long-run supervision, hidden-work detection. |
| `runtime_external_interruption_observed` | ABG observer/transport | Records host, harness, operator, executor, OS, or unknown interruption. | Crash recovery, orphan detection, replay explanation. |
| `plugin_traversal_prompt_materialized` | ABG plugin traversal observer | Records materialized traversal prompt, source projection, hook, and binding source. | Prompt provenance, plugin traversal audit, evaluate/consequence review. |
| `fh_escalated` | ABG F_H gate | Escalates to human review/intent when policy requires it. | Approval ingress, gate projection, traversal block/unblock. |
| `terminal_reached` | ABG engine terminal | Declares terminal runtime state and reason. | Run closure, gaps, terminal disposition, replay stop. |
| `graph_call_opened` | ABG engine graph-call | Opens a graph call inside the basis. | Frame lineage, recursive graph calls, aggregate projection. |
| `frame_opened` | ABG engine frame | Opens a frame for vector traversal. | Continuation, vector planning, lineage, retry. |
| `vector_traversal_planned` | ABG traversal planner | Plans traversal for a vector/edge. | Vector evaluation/closure, edge policy, event calculus. |
| `vector_evaluated` | ABG traversal evaluator | Records accepted/blocked/other vector evaluation status. | Iteration advance, retry, graph span, gaps. |
| `vector_closed` | ABG traversal closer | Closes vector with closure kind. | Closed-vector set, replay cursor, terminal/reentry decisions. |
| `retry_repair_planned` | ABG retry frontier | Plans retry repair with regenerated prompt/manifest and attempt identity. | Retry attempt lifecycle, continuation repair, stationary retry detection. |
| `retry_attempt_opened` | ABG retry frontier | Opens a retry attempt. | Retry budget, progress recording, attempt closure. |
| `retry_attempt_stopped` | ABG retry frontier | Stops retry after budget exhaustion or stationary retry. | Escalation, terminal/reentry, failure explanation. |
| `retry_attempt_escalated` | ABG retry frontier | Escalates retry failure to a human/policy gate. | F_H approval, gate projection, closure. |
| `retry_progress_recorded` | ABG retry frontier | Records whether retry produced progress signals. | Stationary classification, retry continuation policy. |
| `continuation_terminated` | ABG continuation/retry | Terminates a continuation due to retry repair. | Continuation repair, replay lineage, reopened continuation. |
| `continuation_reopened` | ABG continuation/retry | Reopens a continuation after repair. | Same-edge retry, frame lineage, replay. |
| `leaf_task_opened` | ABG leaf task runner | Opens a leaf task with input/output schema and worker. | Leaf result, worker routing, task failure handling. |
| `leaf_task_completed` | ABG leaf task runner | Records completed leaf task output and payload refs. | Payload admission, downstream vector evaluation. |
| `leaf_task_failed` | ABG leaf task runner | Records leaf task failure class and evidence. | Retry/escalation, failure projection, gaps. |
| `approved` | ABG public event ingress/control | Admits human or human-proxy approval for F_H review or intent. | Gate release, control projection, replay-visible authorization. |
| `revoked` | ABG public event ingress/control | Revokes prior approval. | Gate closure, reset/replay semantics, control projection. |
| `reset` | ABG public event ingress/control | Admits workspace, work-key, or edge reset. | Downstream reset followups, projection invalidation, replay boundary. |
| `assessed` | ABG result assessment | Records an F_P assessment and published ledger ref. | Result assessment CLI/app, obligation ledger, closure. |
| `payload_observed` | ABG payload admission | Observes a produced payload with digest, schema, contract, producer, authority, and input digest. | Payload ledger, validation, closure input, evaluate stage. |
| `payload_validated` | ABG payload admission | Validates payload against schema/contract evidence. | Closure capability, evidence, consequence selection. |
| `payload_rejected` | ABG payload admission | Rejects payload with class, reason, schema/contract refs. | Retry/repair pressure, gap dossier, blocked closure. |
| `authority_snapshot_admitted` | ABG authority admission | Admits authority/input snapshot for edge closure. | Authority digest, closure capability, contradiction/defer detection. |
| `evidence_admitted` | ABG evidence admission | Admits evidence for payload/authority completeness and contradiction flags. | Assurance projection, payload ledger, closure input. |
| `ambiguity_observation_admitted` | ABG ambiguity admission | Admits ambiguity status and reason against authority/evidence/payload. | Ambiguity pressure, human review, repair/reprice. |
| `closure_input_published` | ABG closure publication | Publishes closure input projection and decision rows. | Evaluate/consequence, vector evaluation, postflight closure. |
| `observed_state_admitted` | ABG observed-state admission | Admits observed external/workspace state with freshness and derivation basis. | Construction observations, state projections, stale-input detection. |
| `fd_authority_outcome_admitted` | ABG F_D authority admission | Admits F_D status, routing decision, pressure, diagnostics, and evidence. | Construction pressure package, retry frontier, traversal selection. |
| `overlay_frame_declared` | ABG overlay runtime | Declares overlay frame scope, predicates, authority, and source projection. | Overlay frame projection, predicate evaluation, pressure package. |
| `overlay_frame_evaluated` | ABG overlay runtime | Evaluates overlay predicates and foldback outcome. | Overlay projection, traversal/evaluation constraints. |
| `output_instance_allocated` | ABG output registry | Allocates output instance and write territory. | Branch lease conflict detection, output binding/materialization. |
| `output_binding_admitted` | ABG output registry | Admits binding between output allocation, carrier, and artifact target. | Materialization, fan-in, proof of write ownership. |
| `output_materialization_observed` | ABG output registry | Observes materialized output artifact and digest. | Product target proof, postflight, closure. |
| `workspace_obligation_ledger_admitted` | ABG workspace obligation runtime | Admits workspace obligation ledger ref. | Zoom/schedule derivation, obligation projection. |
| `workspace_obligation_schedule_derived` | ABG workspace obligation runtime | Derives a schedule from admitted obligation ledger. | Scheduled slices, zoom foldback, progress tracking. |
| `zoom_frame_opened` | ABG zoom runtime | Opens a zoom frame over workspace obligations. | Scheduled slice dispatch/assessment, foldback. |
| `scheduled_slice_dispatched` | ABG zoom scheduler | Dispatches a scheduled obligation slice. | Slice assessment, obligation progress. |
| `scheduled_slice_assessed` | ABG zoom scheduler | Assesses dispatched scheduled slice. | Zoom foldback, gaps, next schedule. |
| `zoom_foldback_evaluated` | ABG zoom runtime | Folds scheduled slice assessments back into public state. | Workspace progress projection, next traversal. |
| `traversal_modulation_resolved` | ABG traversal modulation | Resolves modulation decision for current traversal. | Attempt envelope, forced review, same-edge continuation. |
| `traversal_attempt_envelope_derived` | ABG traversal modulation | Derives envelope of schedule/action rows for an attempt. | Attempt dispatch/progress/non-progress. |
| `traversal_attempt_dispatched` | ABG traversal modulation | Dispatches traversal attempt schedule rows. | Progress observation, review gates, remaining work. |
| `traversal_attempt_progress_observed` | ABG traversal modulation | Observes fulfilled/partial/blocked/not-attempted rows. | Non-progress classification, continuation planning, forced review. |
| `traversal_attempt_non_progress_classified` | ABG traversal modulation | Classifies non-progress from source carrier/action projection. | Retry, reentry, forced review. |
| `traversal_forced_review_projected` | ABG traversal modulation | Projects forced review and blocks private continuation. | Human gate, public action projection, evidence refs. |
| `traversal_same_edge_continuation_planned` | ABG traversal modulation | Plans same-edge continuation for remaining work. | Continuation, retry, schedule carry-forward. |
| `traversal_modulation_exhausted` | ABG traversal modulation | Declares modulation exhausted with reason and evidence. | Escalation, terminal/reentry, gap reporting. |
| `graph_span_evaluation_scheduled` | ABG graph-span/reentry | Schedules span evaluation for a terminal edge. | Span assessment, foldback, reentry frontier. |
| `graph_span_assessed` | ABG graph-span/reentry | Assesses a graph span, obligations, carry observations, and constitutional reentry payloads. | Foldback, reentry plan, repair/reprice decision. |
| `graph_span_foldback_evaluated` | ABG graph-span/reentry | Folds span assessments into close/retry/reenter/reprice/block decision. | Graph reentry frontier, earliest reentry vector, terminal disposition. |
| `graph_reentry_planned` | ABG graph-span/reentry | Plans reentry target and route contracts. | Applied reentry, shadowed vectors, replay transition. |
| `graph_reentry_applied` | ABG graph-span/reentry | Applies reentry plan to runtime frontier. | Replay cursor, next traversal, aggregate projection. |
| `timer_intent_admitted` | ABG temporal scheduler | Admits timer intent and not-before/schedule policy. | Timer outcome, scheduled continuation, deadline logic. |
| `timer_outcome_admitted` | ABG temporal scheduler | Admits fired/cancelled/missed timer outcome. | Continuation reopen, deadline breach, temporal projection. |
| `deadline_breach_admitted` | ABG temporal scheduler | Admits deadline breach and prescribed action. | Block/retry/human/reprice policy, gaps. |
| `scheduled_continuation_reopened` | ABG temporal scheduler | Reopens continuation after timer outcome. | Frontier, branch attempt, replay transition. |
| `branch_lease_acquired` | ABG saga frontier | Acquires branch write/output lease. | Parallel materialization, conflict prevention, branch lifecycle. |
| `branch_lease_released` | ABG saga frontier | Releases branch lease. | Frontier progress, cleanup, fan-in readiness. |
| `branch_lease_superseded` | ABG saga frontier | Supersedes one branch lease with another. | Retry/replacement branch ownership. |
| `branch_task_failed` | ABG saga frontier | Records branch task failure, disposition, and evidence preservation. | Retry/fan-in policy, failure projection. |
| `branch_payload_admitted` | ABG saga frontier | Admits branch payload digest and evidence. | Fan-in projection, payload ordering, idempotency. |
| `branch_fan_in_projected` | ABG saga frontier | Projects ordered fan-in over branch payloads. | Parallel frontier closure, output integration. |
| `construction_episode_started` | ABG construction runner | Starts a construction episode with projection ref. | Construction projection, observation loop. |
| `construction_observation_snapshot_materialized` | ABG construction runner | Materializes observed state and authority snapshot. | Action catalog, priority selection, pressure package. |
| `construction_action_catalog_projected` | ABG construction runner | Projects available construction actions and hook resolution. | Evaluator invocation, fallback/action selection. |
| `construction_evaluator_invoked` | ABG construction runner | Invokes evaluator plugin over observation and catalog. | Candidate return, intent admission/rejection. |
| `construction_intent_candidate_returned` | ABG construction runner | Records candidate intents returned by evaluator. | Candidate admission/rejection, selection. |
| `construction_intent_candidate_admitted` | ABG construction runner | Admits a candidate intent against authority. | Intent selection, graph action invocation. |
| `construction_intent_candidate_rejected` | ABG construction runner | Rejects candidate intent with authority/reason refs. | Evaluator feedback, terminal/retry/reprice pressure. |
| `construction_intent_selected` | ABG construction runner | Selects admitted intent/action/binding by policy. | Graph action invocation, pressure package. |
| `construction_graph_action_invoked` | ABG construction runner | Invokes selected graph action with graph call/frame/continuation. | Runtime events, construction delta. |
| `construction_pressure_package_materialized` | ABG construction runner | Materializes pressure package from runtime/construction/overlay projections. | F_D outcome refs, target state refs, obligation policies. |
| `construction_delta_observed` | ABG construction runner | Observes before/after projection, artifacts, runtime event refs, and closure flags. | Construction loop, terminal disposition. |
| `construction_terminal_disposition_projected` | ABG construction runner | Projects construction terminal public state and route/review refs. | Public state, ticket/reprice/review handoff. |
| `workspace_installation_admitted` | ABG install/bootstrap or explicit installed-product event ingress | Admits installed workspace runtime identity and package/install provenance. | Initial replay stream, installed runtime binding, gaps/start. |

Not listed as runtime events: `graph_constitutional_reentry` is payload inside
graph-span events, and projection records such as `run_projection`,
`graph_call_projection`, `frame_projection`, `continuation_projection`, and
`runtime_aggregate_projection` are read models.

## Strategy decisions to ratify

| Decision | Reason | Required work |
|---|---|---|
| Keep `.ai-workspace/events/events.jsonl` as the canonical installed ABG event stream. | ABG install/start/gaps already use it as replay-visible event stream. | Preserve path, but forbid direct bypass of ABG event interfaces. |
| Keep odd_sdlc `appendOddSdlcRuntimeEvents()` as a sink adapter only. | Persistence is a sink concern; event legitimacy belongs to ABG. | Add tests that it calls `emit(...)`; disallow local event normalization authority. |
| Move local traversal/reentry event creation behind explicit ABG public/app interfaces. | ABG owns event calculus and legitimate event emission. The main risk is SDLC-authored runtime transition state, not install provenance. | Wrap F_D authority outcome, graph-span/reentry, replay cursor closure, and vector closure behind ABG APIs or new ABG contracts. Installer admission can remain lower-priority change-tracking until ABG install-bootstrap exposes a clearer hook. |
| Treat process JSONL archives as evidence artifacts, not event streams. | Hidden logs violate ABG visibility if they become authoritative. | Link archives through canonical ABG events or artifact refs; never use them as replay truth. |
| Classify plugin outputs as payload/evidence, not runtime truth. | Plugins transform/evaluate/consequence produce payloads and decisions that ABG admits. | Ensure all compute-stage writes are admitted through ABG register/event interfaces. |
| Express edge conformity as observed ABG events plus ledger refs. | The target edge law is `SDLC EdgePolicy -> ABG selected composition -> plugin.transform.C -> system admission/write -> plugin.evaluate.C -> system admission/write -> plugin.consequence.C -> traversal transition`. | Build per-edge audit rows that point to ABG events and SDLC ledger artifacts without creating a parallel event log. |

## Immediate T-184 explain and consolidation targets

| Target | Priority read | Explain required | Consolidation solution |
|---|---|---|---|
| Installer `workspace_installation_admitted` | Low concern. It is probably fair change tracking for installed runtime provenance. | Explain that install admission is not deciding graph traversal, closure, reentry, or event calculus state. | Keep as tracked provenance for now; later move to ABG install-bootstrap/event-ingress if ABG exposes an install admission surface. |
| Replay cursor vector closures | High concern. This writes accepted/closed vector state for resume. | Explain why resume currently needs synthetic prior-vector closure and which projection consumes it. | Consolidate into an ABG replay/cursor API that derives or emits cursor advancement as an ABG transition. |
| F_D conformance closure | High concern. This closes vector state from an odd_sdlc projection decision. | Explain why managed `conform_project` currently bypasses the normal ABG runner transition and what proof it is preserving. | Consolidate into an ABG iteration/traversal transition API; odd_sdlc supplies conformance evidence, ABG emits vector evaluation/closure. |
| F_D traversal audit events | Medium/high concern. Event shape is useful, but source authority is local. | Explain which SDLC evidence makes a traversal-hop selection an F_D authority outcome and which projections depend on it. | Consolidate into an ABG F_D authority/admission interface that accepts SDLC evidence refs and emits `fd_authority_outcome_admitted`. |
| Graph-span repair/post-action reentry | High concern. Factories are ABG, but the event sequence is assembled locally. | Explain the repair and post-action reentry calculus: source span, terminal span, evidence refs, foldback decision, and applied target. | Consolidate into an ABG graph-span/reentry interface that accepts SDLC span evidence and owns schedule, assessment, foldback, plan, and apply events. |
| Worker process archive event mirrors | Medium concern. Useful evidence, dangerous only if treated as canonical runtime truth. | Explain that archive JSONL is forensic evidence and which canonical ABG events reference or summarize it. | Keep archives as evidence artifacts; canonical event stream remains ABG events, with archive refs attached to process/activity events. |

The consolidation shape should not be six bespoke odd_sdlc fixes. It should
collapse the runtime-transition cases into one ABG-owned pattern: odd_sdlc
publishes product evidence and selected ledger refs; ABG admits that evidence
through a public/app interface; ABG emits the runtime events that affect
projection, replay, event calculus, traversal, closure, or reentry.
