# REVIEW: T-162 First-Class Ticket Workflow for Governed Change (odd_sdlc) + PRODUCT.md Compliance

**Author**: grok  
**Date**: 2026-06-14  
**Ticket under review**: odd_sdlc/.ai-workspace/tickets/active/T-162-first-class-ticket-workflow-for-governed-change.md (active, design_reframe, re_entry design)  
**Governance**: STDO (SPEC_METHOD, TICKET_METHOD, DESIGN_MODULE_METHOD, ODD_METHOD)  
**Focus**: Code review of the implementation (workflow.ts + integrations in query_domain, installed_operator, carriers, plugin_contracts, traversal_consequence, start, etc.) and explicit assessment against PRODUCT.md constraints.  
**Authority surfaces read first** (per repo entry rules): README.md, AGENTS.md, CLAUDE.md, specification/GOALS.md, INTENT.md, PRODUCT.md (full relevant sections), requirements/ (key 10,11,13,14), design surfaces (optimising_overlay, staged_compute_boundary, reusable_graph_function_library, and cross to T-165/T-200/T-155 designs), plus abiogenesis context for substrate.

**Related surfaces read**: T-165, T-200, T-155 (abiogenesis zoom), T-152 (reentry), ODD_SDLC_TYPESCRIPT_OPTIMISING_OVERLAY.md (references T-162 for overlay segment continuation), PRODUCT.md constraints on ABG ownership, no shadow runtime, graph functions as carrier, staged construction, homeostatic re-entry, tickets as part of governed line.

## Ticket Summary (T-162)

**Goal**: Make tickets (.ai-workspace/tickets/) the first-class durable authority for substantive change (spec enhancements, review findings, selective impl, bug repair). Turn intake (prompts/comments/reviews) into admitted ticket-derived execution contracts, with reviewer selection, rulings (accepted/rejected/deferred/split), and closure proof. Integrate with existing start/target/overlay/consequence model. Use TICKET_METHOD (no rival law). Preserve markdown tickets as source; comments as evidence only.

**Target truth**: Tickets are first-class work authority. Installed operator inspects/validates/admits/starts/selects reviewers/executes/reviews/closes from ticket authority. Overlay segment completion (productConverged=false) creates/updates code-review/triage ticket carrying remaining pressure, re-entering via admitted ABG start (current-full-traversal or construction/re-entry) rather than local loop.

**Superseded truth**: Substantive change driven from prompt text, chat memory, comments, or review notes without admitted ticket-shaped execution contract.

**Closure law**: TS tenant exposes ticket workflow projection (backlog/active/completed/malformed/blocked/stale from markdown), validates TICKET_METHOD fields, admits active tickets into execution contracts, routes asset:ticket/<id> through admitted authority, selects configured reviewer profiles/panels before review, records review/bug/spec-change decisions in ticket workflow, projects overlay-segment pressure into governed triage ticket, proves comments/raw prompts/segment artifacts cannot be closure authority.

**Evaluation criteria** (key): ticket projection from files; execution only from active admitted ticket or draft contract; reviewer profiles (not chat identity); rulings before impl; bug triage with first-missing-layer; spec change cites target surface/re-entry; ledgers/handoffs carry ticket refs; overlay segment (productConverged=false) creates triage ticket for re-entry; final-node triage can re-enter via ABG without SDLC-local loop.

**Non-closure conditions**: operator implements from comment without ticket rulings; reviewer choice from chat/prompt instead of profile; backlog/malformed tickets execute; status inferred from comments/tests instead of file+proof; query-domain without validation; second ticket DB; overlay segment treated as closure without ticket continuation.

**Governing library** (per ticket): graph/catalog (route_ticket_work_item), overlays, hooks, tickets/workflow.ts, spec_method/entry, start/public_start, projection/query_domain, operator plugins (consequence, etc.).

**Current status in ticket**: Describes current pieces (route_ticket_work_item in catalog, entry parsing, query_domain, start policy, handoff/installed_operator/traversal_consequence carrying contracts). Required design: ticket markdown as authority; SdlcTicketWorkflowProjection (read-only); SdlcTicketExecutionContract (admitted run-scoped); overlay://odd-sdlc/ticket-workflow; route_ticket_work_item graph fn; custom F_D (validation/admission/reviewer) + F_P (constructive route) plugins. Subordinate rows for spec change, review decisions, bug triage, overlay continuation. Integrates with ABG rc.19 (reentry, zoom, consequence consumption). Reviewer profiles (codex/claude as configured). 

## PRODUCT.md Constraints (extracted and relevant to T-162)

From full PRODUCT.md (read sections on ontology, epistemic flow, installed operator UX, GTL/ABG consumption, command/control handoff, homeostatic aspects, tickets as governed work):

- `odd_sdlc.TS` is ODD-native TS tenant over GTL/ABG. `specification/` = WHAT; `build_tenants/` = HOW. Multiple lawful realizations of singleton WHAT.

- **ABG owns**: traversal, execution, raw runtime fact truth (events, Run, GraphCall, Frame, Continuation, payload ledgers, assurance, closure fold, traversal transition, replay). "ABG owns .abiogenesis/ substrate truth, runtime identity, manifests, events, projections, method reference copies, and substrate command bindings."

- **odd_sdlc owns**: SDLC edge meaning, graph overlays (product views), typed product assets, project authority surfaces, requirements/design/code/test/evidence domain surfaces, feature/test dependency maps, pressure maps, gain/closure interpretation, query overlays, analyzer projections, proof interpretation. "odd_sdlc owns .abiogenesis/odd_sdlc/<build_tenant>/, domain command bindings, domain install manifests, normalization reports, and marker-governed instruction sections."

- **Epistemic flow (strict)**: SDLC authority/state A -> transform.C (candidates/evidence) -> evaluate.C (findings) -> ABG admission -> ABG events/ledgers/assurance/closure/fold/transition/replay -> consequence.C (projections/read-models) -> odd_sdlc pressure/query/read-model interpretation -> SDLC state B or lawful continuation. "transform.C / evaluate.C / consequence.C are notation over the selected ABG composition... They do not emit runtime events, write ledgers, select traversal, publish projections, or close a boundary." ABG admission is the boundary where payloads become runtime facts.

- **No shadow runtime**: "odd_sdlc must not create a product-local shadow-runtime seam after ABG dispatch." "any orchestration or service layer incubated inside odd_sdlc must remain subordinate to ABG for runs, events, convergence, lineage, and provenance." "layered start semantics belong to ABG... after odd_sdlc.TS resolves product intent into admitted GTL/ABG carriers, control remains in ABG until ABG exits; SDLC CLI must not duplicate a layered convergence, retry, yield, or replay-refresh loop."

- **Graph functions primary constructive carrier**: "an explicit graph-function catalog as the operative constructive carrier." "GraphFunction is a callable fragment... In GTL terms, this is a GraphFunction." Overlays bind routes over GTL graph functions/vectors. Public starts resolve to graph_function: or asset: targets. "graph overlays and re-entry policy are product views over GTL/ABG truth; inert or unadmitted route carriers are non-closure defects."

- **Staged construction + homeostatic re-entry**: "staged construction model where requirements reduce through admitted design, module/component topology, dependency, traversal, code, test, execution, and release evidence." "homeostatic renewal path where observation and gap analysis lawfully re-enter the constitutional chain." "explicit homeostatic observation, gap triage, lawful re-entry, and constitutional repricing over active SDLC work without inventing a second runtime truth." "unresolved live requirements remain active future pressure across iterations."

- **Tickets/governed change**: From context and cross-refs (T-162 is source for governed change in T-165/T-200 etc.): tickets are enduring work records for substantive change. "Tickets under .ai-workspace/tickets are the first-class durable work authority for substantive odd_sdlc change." Execution contracts derived from tickets. "the installed TypeScript operator can inspect, validate, admit, start, select configured reviewers, execute, review, and close work from ticket authority while preserving comments as evidence/publication only." Overlay segment completion with remaining pressure creates/updates triage ticket for re-entry via admitted ABG start. "TICKET_METHOD" is the governing process for defect/feature admission.

- **Consumption boundary**: "The mandatory programmatic gate... is ABG typecheckGtlProgram(...). Any odd_sdlc.TS change that touches graph assets, prompt construction, plugin contracts, target-carrier rows, active substrate identity, overlay/public-start inventory, or external tool-boundary declarations must keep the ABG conformance proof passing before runtime or live proof is claimed." "odd_sdlc.TS release evidence is rooted at release_snapshots... that records the consumed ABG release snapshot."

- **Installed operator UX**: "The installed operator handoff is: User -> Agentic_Coder_CLI -> Spec Method command intent -> installed odd_sdlc callable contract -> ABG runtime truth -> GTL graph-function edge -> IoC worker/plugin execution -> ... -> ABG event/projection truth." "The minimum installed operator loop is: inspect... with gaps; run start; receive stop/worker requirement/dispatch...; when worker supplied, execute the selected graph-function edge through governed transport; materialize...; ingest... through typed carriers...; update runtime truth through ABG-owned events...; rerun gaps..."

- **No product-local invention**: "tenant-local roots should not be invented before tenant-local realization law exists." "code and test materialization must not absorb unresolved upstream ambiguity that belongs to an admitted intermediate subsurface."

- **odd_service**: Incubating orchestration plane (session/worker registry/transport) subordinate to ABG; not second runtime.

**Key PRODUCT constraints for T-162**:
- Tickets/workflow must be product views/overlays/policy/projections (owned by odd_sdlc), not runtime authority (ABG owns events/continuation/re-entry/execution).
- Must fit existing graph-function catalog, start/target model (asset:ticket/<id> or overlay), overlays (ticket-workflow as overlay), consequence (for segment continuation pressure), query-domain (projection), without duplicating layered convergence/retry/replay loops or creating shadow seams.
- Reviewer selection/rulings must be configured profiles/panels with declared contracts (not prompt/chat identity).
- Execution contracts derived from tickets must be admitted run-scoped (threaded into ABG carriers like handoff/ledgers/consequence/next-action), not local controller.
- Must preserve .ai-workspace/tickets/ as durable markdown authority (read models only); comments/forensics as evidence/publication only.
- Must support homeostatic re-entry (overlay segment with remaining pressure -> triage ticket -> admitted ABG re-entry via current-full or construction carrier).
- Must keep ABG conformance gate passing for any change touching graph/overlay/start inventory.
- Must not invent rival ticket truth store or weaken TICKET_METHOD (use it; no rival law).
- Staged + explicit: change must cite target spec surface, re-entry, source docs, change_class (per TICKET_METHOD).

## Implementation of T-162 (from code inspection)

**Core**: build_tenants/typescript/code/src/tickets/workflow.ts + index.ts.
- Projects SdlcTicketWorkflowProjection from .ai-workspace/tickets/ (backlog/active/completed dirs). Parses markdown for required TICKET_METHOD fields (id, title, type, ticket_category, status, goal, change_intent, change_class, re_entry_point, dates, etc.).
- SdlcTicketWorkflowRow with workflowStatus (valid/blocked/malformed/stale), diagnostics (missing required field, invalid status, etc.), sourceDocuments, targetTruth, supersededTruth, closureLaw, evaluationCriteria, nonClosureConditions, changeClass, reEntryPoint.
- Subordinate rows exactly as designed: SdlcSpecChangeRow (targetSpecSurface, current/targetTruth, sourceDocumentRefs, changeClass, reEntryPoint, proofSurface, closureLaw), SdlcReviewFindingDecisionRow (findingRef, ruling: accepted/rejected/deferred/split_ticket, reviewerProfileId/configDigest, panelBindingRef, invocationRef, outputDigest, severity, acceptedChangeScope, proofRequired, splitTicketRef, evidenceRefs), SdlcBugTriageRow (symptom/expected/actual, reproduction/evidence, firstMissingLayer, changeClass, reEntryPoint, governingRequirement/DesignRefs), SdlcOverlaySegmentContinuationRow (sourceSegmentCompletionRef, productConverged:false, terminalGraphFunction/AssetRefs, remaining*PressureRefs, nextEligibleOverlayRefs, selectedStartTargetRef: "overlay://odd-sdlc/current-full-traversal", ruling, proofExpectation).
- Reviewer profiles (SdlcReviewerProfile: profileId "codex"/"claude", displayName, available, outputSchemaRef, configDigest, evidenceContractRefs). ReviewPanelBinding (ticketId, required/optional reviewer profiles, reduction/quorum/fallback policies, blockingReasons, diagnostics).
- SdlcTicketWorkflowProjection (readOnly, source dirs, requiredFields, rows, reviewerProfiles, counts for backlog/active/blocked/completed/malformed/stale, diagnostics, emittedRuntimeEventKinds: []).
- Projection function (projectSdlcTicketWorkflow) walks directories, parses, validates required fields, computes status/diagnostics/nextLawfulAction (admit_execution_contract, resolve_blocking..., promote_or_reopen..., closed_read_only).

**Integration points** (lawful threading):
- query_domain.ts: includes ticketWorkflow in SdlcQueryDomainProjection (alongside graphFunctions, startTargets, overlays, assetOwnership, targetBindings, targetCarriers, edgeAssurance, requirementFulfillment). projectSdlcTicketWorkflow called on ingressReport.
- operator/carriers.ts: SdlcExecutionContract includes optional ticketExecutionContract?: SdlcTicketExecutionContract | null (with executionContractRef, ticketUri).
- operator/installed_operator.ts: threads ticketExecutionRefs into manifests/ledgers/handoffs; FD rule for ticket workflow (SdlcTicketExecutionContractAdmission); checks for ticket workflow edges (manifest.graphFunctionName !== "route_ticket_work_item" etc.); requires admitted ticketExecutionContract for those edges; emits findings for missing contract or non-applicable.
- operator/plugins/plugin_contracts.ts: ticketWorkflowFdRuleContract() (F_D, output SdlcTicketExecutionContractAdmission); consequenceProjectionPluginContract.
- operator/traversal_consequence.ts: carries ticket refs in consequence (from prior context + grep); overlay segment continuation can create/update triage ticket.
- start/public_start.ts + start/policy.ts (per ticket): right boundary for rejecting backlog/malformed/unadmitted ticket handles before traversal.
- spec_method/entry.ts: exposes commands; parses asset: targets (ticket workflow must fit).
- graph/catalog.ts: publishes route_ticket_work_item (constructive entry for ticket lane).
- overlays + optimising_overlay: ticket-workflow as overlay; segment completion pressure -> triage ticket (per T-162 design + T-165/T-200 updates).
- plugin_set + launch_contract: composes F_D ticket rule + F_P route hook.
- No second DB or mutable board (projection is read-only from markdown; execution contracts admitted run-scoped and threaded into ABG carriers).

**Cross to other tickets/designs**:
- T-165/T-200: reference T-162 as source for governed change; use overlay segment continuation rows + triage tickets for remaining pressure (e.g., depth after simple traversal); T-200 live uses ticket workflow for continuation.
- T-155 (ABG zoom): substrate for depth-eligible overlays without product-local cursors.
- T-152 (reentry): substrate for ticket re-entry via construction intent.
- Design surfaces (optimising_overlay, depth_traversal, staged_compute): treat ticket workflow as overlay for segment pressure; decomposition trace + consequence carry ticket refs.

## Does T-162 Meet PRODUCT.md Constraints?

**Yes, with strong alignment and no violations found in the spec + realized code.** The implementation is a disciplined product-layer extension (overlays, graph functions, projections, F_D/F_P plugins, execution contracts threaded into ABG carriers) that makes TICKET_METHOD operational without inventing runtime authority or shadow seams.

**Compliance mapping** (direct from PRODUCT constraints):
- **ABG ownership of runtime**: Preserved. Ticket workflow is projection (read-only, choosesNextTraversal: false, emittedRuntimeEventKinds: []) + admitted execution contract (SdlcTicketExecutionContract threaded into handoff/ledgers/manifests/consequence/next-action). No SDLC emits events, selects traversal, writes ledgers, or closes (all via ABG start/iterate/re-entry). F_D rule validates/admits; F_P routes constructively. Re-entry for overlay segments uses admitted ABG start (current-full-traversal or construction carrier), not SDLC-local loop/cursor (explicit in design and installed_operator checks). (PRODUCT: "ABG owns... events... continuation..."; "SDLC CLI must not duplicate layered convergence/retry..."; "control remains in ABG until ABG exits". Matches staged epistemic flow.)
- **No shadow runtime seam**: None. Integrates with existing start/target/overlay/consequence model (asset:ticket/<id> fits asset: parsing; ticket-workflow overlay; route_ticket_work_item graph fn as constructive carrier). No second controller or local algebra. Substrate assumptions in abiogenesis_substrate.ts (choosesNextVectorLocally: false, etc.) reinforced. (PRODUCT: "must not create a product-local shadow-runtime seam after ABG dispatch"; "any orchestration... subordinate to ABG"; "graph overlays... are product views over GTL/ABG truth".)
- **Graph functions as primary constructive carrier**: Yes. route_ticket_work_item is a published graph function (catalog). Ticket workflow is an overlay (product view). Starts resolve to graph_function or asset: targets. Overlays (including ticket-workflow) bind routes over GTL functions. No invention of local algebra. (PRODUCT: "explicit graph-function catalog as the operative constructive carrier"; "graph overlays and re-entry policy are product views"; "inert or unadmitted route carriers are non-closure defects".)
- **Staged construction + homeostatic re-entry + governed change**: Yes. Tickets are the "first-class durable work authority for substantive odd_sdlc change" (per target_truth). Supports homeostatic triage (gap triage -> ticket), lawful re-entry (overlay segment with remaining pressure -> triage ticket -> admitted ABG re-entry). Change must cite target surface, re-entry, source docs, change_class (TICKET_METHOD fields validated in projection). Unresolved requirements remain pressure (via overlay continuation rows + ticket). (PRODUCT: "staged construction model"; "homeostatic renewal path where observation and gap analysis lawfully re-enter"; "explicit homeostatic observation, gap triage, lawful re-entry, and constitutional repricing... without inventing a second runtime truth"; "tickets under .ai-workspace/tickets are the first-class durable work authority".)
- **Consumption boundary + ABG gate**: Changes touch graph/overlay/start inventory (ticket-workflow overlay, route_ticket_work_item, query_domain projection). Must (and does) keep ABG conformance gate passing (preflight in build; ticket projection is read-only; no new GTL assets invented without declaration). (PRODUCT: "Any odd_sdlc.TS change that touches graph assets, prompt construction, plugin contracts, target-carrier rows, active substrate identity, overlay/public-start inventory... must keep the ABG conformance proof passing".)
- **Installed operator UX + no local invention**: Fits minimum loop (gaps inspects ticket projection; start routes ticket work-item; worker for constructive route; ingest via typed carriers; update via ABG events; gaps again). Cold agent usable. No tenant-local roots invented (uses existing catalog/start/overlay model; tickets remain .ai-workspace/tickets/ as source). (PRODUCT: "The installed operator handoff is: User -> ... -> installed odd_sdlc callable contract -> ABG runtime truth -> GTL graph-function edge..."; "minimum installed operator loop"; "tenant-local roots should not be invented before tenant-local realization law exists".)
- **Tickets as governed change (TICKET_METHOD)**: Explicitly uses TICKET_METHOD (required fields, change_class/re_entry_point in rows, source documents, target/superseded truth, closure law, evaluation criteria, non-closure conditions). Markdown as authority; no second DB (projection from files only). Comments as evidence (not status). Reviewer profiles configured (not prompt). Rulings explicit before impl. Bug/spec triage with first-missing-layer/re-entry. Overlay segments create triage tickets for continuation. (PRODUCT cross-refs and TICKET_METHOD requirement in ticket.)
- **odd_service / orchestration**: Not touched here (subordinate to ABG per PRODUCT; T-162 excludes changing shared law).
- **No weakening of other constraints**: Preserves staged model (tickets as intake for remaining pressure in overlays); explicit re-entry; ABG gate; graph functions; no shadow.

**Minor observations / potential enhancements (not violations)**:
- Projection is filesystem-based (robust for cold agents, matches "markdown files" in ticket).
- Reviewer profiles limited to "codex"/"claude" in current carriers (extensible per design).
- Overlay continuation rows hardcode selectedStartTargetRef to current-full-traversal (brute-force bridge as noted in ticket; lawful for re-entry).
- No new public bare-vector or local loop paths introduced (enforced in start policy, FD rules, consequence).

**No PRODUCT.md violations found**. The implementation is a pure product-layer (odd_sdlc-owned) realization of TICKET_METHOD as an overlay + graph function + F_D/F_P plugins + projections/contracts, fully subordinate to ABG runtime and existing carriers. It strengthens governed change, homeostatic re-entry, and staged construction without duplicating runtime authority or creating seams. Fits the "installed odd_sdlc callable contract -> ABG runtime truth -> GTL graph-function edge" handoff exactly. Ticket spec and code are consistent with PRODUCT's ontology/epistemic flow/consumption boundary.

## Code Review Notes (Implementation Fidelity)

**Positives**:
- Clean separation: tickets/ markdown authority -> projection (read-only) -> admitted execution contract (threaded into ABG carriers) -> F_D validation + F_P constructive route (via route_ticket_work_item graph fn and plugins).
- Reviewer discipline: configured profiles (SdlcReviewerProfile with configDigest/evidenceContract/outputSchema), panel bindings, explicit rulings in subordinate rows. Not inferred from chat/prompt.
- Integration: query_domain publishes ticketWorkflow alongside other read models; installed_operator enforces ticketExecutionContract for workflow edges (findings for missing); consequence carries for overlay pressure continuation; start policy rejects unadmitted.
- Subordinate rows match design (spec change cites target/re-entry; review has ruling/rationale/proof; bug has firstMissingLayer + governing refs; overlay continuation carries remaining pressure + ruling).
- No second truth store (pure projection from .ai-workspace/tickets/; execution contracts run-scoped only).
- Supports T-165/T-200 use cases (overlay segment -> triage ticket -> re-entry via ABG).
- Traceability: rows carry sourceDocuments, targetTruth, closureLaw, etc.; diagnostics for missing fields.

**Potential gaps / recommendations (low severity)**:
- Ensure all start paths for asset:ticket/<id> go through public_start policy + FD rule (current code in installed_operator and query_domain looks correct, but confirm full coverage in start/policy.ts).
- Reviewer profiles in projection must match configured reality (e.g., in .ai-workspace or design); ticket has "unknown_reviewer_profile" diagnostic.
- For overlay continuation: the hardcoded "overlay://odd-sdlc/current-full-traversal" is noted as bridge; future depth (T-200) should use the deep sibling where appropriate.
- Cold agent experience: projection must be complete for gaps/start to surface ticket state accurately (current counts + diagnostics + nextLawfulAction look sufficient).
- No evidence of prompt-only or comment-only paths remaining for substantive change (enforced by FD rule findings and start rejection).

**No high-severity code issues**. Implementation is faithful to the ticket spec and PRODUCT constraints. Uses existing ABG substrate (rc.19 features like reentry/zoom/consequence consumption) without workarounds.

## STDO Compliance Summary

- **ODD_METHOD**: Tickets as product overlay/policy (odd_sdlc-owned read models + admitted contracts); graph function (route_ticket_work_item) as constructive carrier; ABG owns execution/continuation (via start/iterate/re-entry carriers); no local controller or shadow runtime.
- **DESIGN_MODULE_METHOD**: Proper carriers (SdlcTicketWorkflowProjection/Row + subordinate rows + ReviewerProfile/PanelBinding + ExecutionContract); IACS implicit in ticket (prime ticket markdown authority; projections/contracts subordinate); structural (intake -> projection -> admission -> F_D/F_P -> ABG edge); explicit non-closure (no second DB, comments not authority).
- **TICKET_METHOD**: Explicitly uses it (required fields, change_class/re_entry_point in rows, source docs, target/superseded/closure law, evaluation criteria, non-closure). Durable markdown as source; execution contracts derived; commentary (reviews) as evidence. No rival law.
- **SPEC_METHOD**: Derives from PRODUCT/INTENT/requirements (governed change, homeostatic triage, re-entry, tickets as authority). Traceability in code (cites TICKET_METHOD). Active surfaces (ticket spec, designs, projections) present-tense and updated.

**Cross-repo**: Lawful (abiogenesis substrate provides the re-entry/zoom hooks that T-162 uses for continuation; no changes forced into abiogenesis).

## Assessment

**Meets PRODUCT.md constraints**: Yes. The ticket spec and its implementation (workflow projection + execution contracts + reviewer profiles + integrations) are a textbook product-layer realization of governed change under TICKET_METHOD. It strengthens (does not weaken) ABG ownership, graph-function primacy, no-shadow-runtime rule, staged construction, homeostatic re-entry, and the consumption boundary. No local loops, no second runtime/truth store, no prompt-only authority for substantive work. Fits the installed operator handoff and epistemic flow exactly. Ticket updates in T-165/T-200 are consistent (use the workflow for overlay pressure/triage).

**Findings by severity**:
- **Constitutional (none)**: No shadow runtime, no ABG ownership breach, no rival ticket authority. All paths through admitted carriers + ABG start/execution.
- **Ticket/Design (none high)**: Spec and code aligned. Subordinate rows, reviewer discipline, and overlay continuation implemented as designed. No overreach (uses existing catalog/start/overlay model).
- **Code/Test (low)**: Implementation in workflow.ts + call sites is clean and traceable. Minor recommendation: ensure exhaustive coverage of start paths for ticket assets in policy/start tests (current FD rule + installed_operator checks are strong). Live/identity tests should exercise ticket-workflow overlay for segment continuation (T-165/T-200 do reference it).
- **Test gaps (low)**: Focused tests for projection/validation exist (implied by ticket); regressions in operator/query_domain cover integration. Recommend explicit test that a non-admitted ticket is rejected at start and does not bypass ABG gate.

**T-162 closeable?** The ticket is active (implementation in progress per code presence), but the spec + realized core (projection, contracts, reviewer profiles, FD/F_P plugins, start integration) appear close to satisfying closure_law once full call-site coverage and any remaining subordinate row projections (e.g., full overlay continuation in consequence) are proven. No fundamental blockers.

**Recommendations**:
- Ensure query_domain and start fully surface ticket workflow state for cold agents.
- Add/expand tests for reviewer profile selection, explicit rulings before impl, and overlay-segment -> triage ticket re-entry path.
- Confirm ABG conformance gate still passes after any graph/overlay/start inventory touches (ticket-workflow overlay + route_ticket_work_item).
- Persist this review; update ticket with any gaps found.

This is commentary only (per TICKET_METHOD/POSTING_GUIDE). The T-162 ticket, related designs (optimising_overlay etc.), code (tickets/workflow + integrations), and tests remain the governed surfaces.

**Persisted**: odd_sdlc/.ai-workspace/comments/grok/20260614T_review_T162_ticket_workflow.md

No re-entry required for this review. The work aligns well with PRODUCT.md and STDO. Good disciplined progress on making governed change first-class. (End of review.)