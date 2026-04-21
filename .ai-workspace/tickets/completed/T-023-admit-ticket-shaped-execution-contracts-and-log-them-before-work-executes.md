---
id: T-023
title: Admit ticket-shaped execution contracts and log them before odd_sdlc work executes
type: feature
ticket_category: implementation_migration
status: completed
goal: execution-contract-admission
change_intent: Replace prompt-only or operator-only work classification with one admitted execution-contract flow where work is categorized, ticketed, validated, logged, then executed under explicit criteria before normal proof and gap analysis continue
change_class: design_reframe
re_entry_point: design_surface
affected_boundary: odd_sdlc intake triage, work-item/ticket handling, runtime event truth, prompt assembly, closure checking, and gap-analysis handoff
priority: high
triaged_at: 2026-04-20
created_at: 2026-04-20
updated_at: 2026-04-21
dependencies: odd_sdlc T-021 completed
intake_source: operator requirement after ticket-method hardening — the system should follow 'here is the work, categorise it, ticket it, validate it, keep working according to admitted criteria'
target_truth: odd_sdlc admits one execution_contract_surface as the upstream source carrier for a run before work executes, and downstream prompt, dossier, closure, and proof surfaces consume that admitted carrier rather than raw operator or ticket phrasing
superseded_truth: work begins from raw operator phrasing, raw ticket markdown, route helpers, or ad hoc prompt framing without one admitted execution-contract source carrier shared across runtime, prompt, dossier, closure, and proof
closure_law: this upstream migration closes only when work no longer begins under unstated execution criteria, execution_contract_surface is admitted and logged before work executes, downstream consumers no longer reconstruct execution basis from raw phrasing, and mixed old/new execution-basis proofs do not count as closure evidence
evaluation_criteria:
  - execution_contract_surface exists as a published upstream source carrier with graph-function-owned derive/admit transitions
  - odd_sdlc drafts or loads the execution contract before prompt context or dispatch opens
  - runtime truth records draft/admit/reject or supersede transitions before work executes
  - prompt assembly, manifest provenance, closure checks, and downstream dossier consumption read the admitted contract rather than raw operator or raw ticket phrasing
non_closure_conditions:
  - work can still begin from raw operator phrasing, raw ticket markdown, or ad hoc prompt framing
  - app.start or any helper becomes the real owner of execution law instead of the execution_contract_surface carrier
  - StartIntent is widened into the execution contract
  - mixed old/new execution-basis proofs are still accepted as closure evidence
proof_surface:
  - source-line proof over published execution_contract_surface graph-function transitions
  - start-path proof that admission occurs before prompt-context publication or dispatch
  - downstream prompt, manifest, and dossier consumers proving they read the admitted contract
---

## Migration Declaration

- old_truth_path: work may still begin from raw operator intent, informal prompt framing, or pre-existing ticket text without one admitted execution-contract surface that runtime, prompt, dossier, and closure logic all share
- new_truth_path: odd_sdlc publishes and admits one execution_contract_surface as the authoritative current execution basis, then runtime, prompt, dossier, and closure consumers read from that admitted surface rather than from raw operator or ticket phrasing
- producers_old:
  - operator request text
  - existing ticket markdown
  - ad hoc prompt assembly and local execution assumptions
- producers_new:
  - execution_contract_surface draft/admission carrier
  - deterministic execution-contract validator/admitter
  - admitted execution-contract runtime/event surface
- consumers_old:
  - prompt assembly
  - local execution flow
  - closure claims
  - later operator review
- consumers_new:
  - prompt assembly
  - local execution flow
  - closure claims
  - later operator review
  - gap-analysis and repricing handoff
- derived_surfaces:
  - execution_contract_surface artifact
  - event log entries for draft/admit/reject/supersede
  - prompt provenance
  - gap-analysis dossier consumption basis
  - closure-check read model
- closure_law: this upstream migration closes only when odd_sdlc work does not begin under unstated execution criteria, the admitted execution_contract_surface is logged before work executes, downstream prompt and dossier consumers no longer reconstruct execution basis from raw phrasing, closure plus gap-analysis read from the same admitted source, and mixed old/new execution-basis proofs do not count as closure evidence

## Migration Checklist

- [x] old truth path is named explicitly
- [x] new truth path is named explicitly
- [x] producer set for the new truth is listed
- [x] consumer set for the new truth is listed
- [x] projection/read-model surfaces are listed
- [x] old truth path is removed or explicitly demoted from authority
- [x] mixed-state behavior is no longer accepted as closure evidence
- [x] tests proving mixed old/new behavior are removed or repriced
- [x] ticket wording, product wording, and proof claims are reconciled before closure

## Interface Inventory

Best-guess migration surface based on a direct code walk. This is audit scope,
not closure evidence.

- upstream source carrier publication
  - `odd_sdlc.gtl_module`
  - published graph functions:
    - `derive_execution_contract_surface`
    - `admit_execution_contract_surface`
  - carrier asset:
    - `execution_contract_surface`
- operator start boundary
  - `odd_sdlc.app.start(...)`
  - current admission boundary:
    - after scope normalization and before ABG prompt context or dispatch opens
    - `app.start()` is the delivery binding that opens the internal
      source-carrier admission step
    - execution law lives in the admitted `execution_contract_surface`, not raw
      operator/target/ticket phrasing
- target and route resolution
  - `odd_sdlc.start_targeting.resolve_start_target(...)`
  - `odd_sdlc.start_targeting.published_start_target_catalog(...)`
  - `odd_sdlc.start_targeting.published_asset_ownership_index(...)`
  - `odd_sdlc.work_item_routing.work_item_route_contract_from_asset(...)`
  - `odd_sdlc.work_item_routing.triaged_work_item_assets(...)`
- ticket/work-item intake surface
  - `odd_sdlc.work_item_routing.load_work_item_ticket_surface(...)`
  - current requirement:
    - ticket frontmatter fields must be execution authority
    - raw ticket body sections are supporting evidence only
- execution-contract construction and validation
  - `odd_sdlc.execution_contract.derive_execution_contract_surface(...)`
  - `odd_sdlc.execution_contract.admit_execution_contract_surface(...)`
  - `odd_sdlc.execution_contract.bound_execution_start_from_contract(...)`
  - `odd_sdlc.execution_contract._validate_execution_contract(...)`
  - `odd_sdlc.execution_contract._render_execution_contract_context(...)`
  - current state:
    - ticket route truth is derived inside the carrier
    - admitted target/scope binding reads from the admitted carrier directly
    - ABG 3.2 prompt and manifest provenance consume the carrier through the
      declared `odd_sdlc_execution_contract_context`
- runtime truth and event surface
  - `odd_sdlc.runtime_effects.publish_runtime_event(...)`
  - execution-contract events:
    - drafted
    - admitted
    - rejected
    - later superseded
- prompt assembly consumers
  - ABG 3.2 `genesis.binding._assemble_prompt(...)`
  - ABG 3.2 `genesis.runtime_carrier.fp_dispatch_publication_plan(...)`
  - `odd_sdlc.gtl_module` declares `odd_sdlc_execution_contract_context`
  - current ABG manifest `contexts` entry:
    - `name: odd_sdlc_execution_contract_context`
    - `locator: workspace://.ai-workspace/runtime/odd_sdlc-execution-contract.md`
- manifest provenance consumers
  - ABG 3.2 `genesis.binding.bind_fp(...)`
  - ABG 3.2 `genesis.runtime_carrier.fp_dispatch_publication_plan(...)`
  - ABG 3.2 `genesis.interpret`
- downstream gap/dossier consumers
  - `odd_sdlc.app.gaps(...)`
  - `odd_sdlc.gap_dossier`
  - `odd_sdlc.query`
  - these are downstream consumers and do not close ahead of this ticket
- workspace asset/query surfaces
  - `odd_sdlc.workspace_assets`
  - `odd_sdlc.software_domain_catalog`
  - `odd_sdlc.query-domain`
- remaining legacy interfaces to break first
  - none for the T-023 source-carrier boundary
  - downstream dossier/query consumption remains owned by `T-022`
- proof surfaces to reprice
  - source-line:
    - `test_odd_sdlc_first_slice.py`
  - installed line:
    - `test_odd_sdlc_installation.py`
  - broader sandbox/usecase lanes are downstream proof surfaces and must not
    reintroduce raw execution-basis authority
- design/product wording surfaces
  - `build_tenants/python/design/EXECUTION_CONTRACT_SOURCE_CARRIER.md`
  - `build_tenants/python/design/PROMPT_CONTEXT_CARRIAGE.md`
  - `build_tenants/python/design/README.md`
  - `specification/PRODUCT.md`

## Functional Review Criteria

Review this ticket as an implementation migration, not as a prompt or test
patch.

Every implementation and review pass must ask:

1. Did the slice replace raw operator/ticket/prompt phrasing with the admitted
   `execution_contract_surface` as the source of execution truth?
2. Did it reduce a semantic center, or only move execution law into
   `app.start(...)`, helper functions, manifest glue, or prompt assembly?
3. Is execution basis expressed as a closed admitted contract with explicit
   status, criteria, non-closure conditions, proof surface, and carrier graph
   functions rather than an open dict assembled differently per consumer?
4. Is `app.start(...)` a thin binding over the admitted carrier, or does it
   still decide execution law procedurally?
5. Are effects limited to lawful edges:
   - execution-contract runtime events
   - execution-contract register/context publication
   - ABG traversal/manifest publication
   rather than mixed into contract interpretation?
6. Do prompt assembly, manifest provenance, closure checks, and gap/dossier
   consumers read the admitted contract, or do they reconstruct execution basis
   from target strings, ticket body text, route helpers, or fallback runtime
   state?
7. Are events and the execution-contract register authoritative, with prompt and
   dossier surfaces downstream of that truth?
8. Does deterministic admission reject invalid execution contracts without
   allowing fallback execution from raw operator input?

Passing start-path tests do not satisfy this section by themselves. A slice that
keeps raw operator phrasing, route helper output, or prompt-local execution law
alive as a normal authority path fails review even if traversal still works.

## Required Break Order

This ticket is the upstream source-carrier ticket for the current odd_sdlc
execution wave. The required order is:

1. publish `execution_contract_surface` and its derive/admit graph functions
2. draft and admit the execution contract before prompt context or dispatch
   opens
3. emit draft/admit/reject/supersede runtime truth before work executes
4. bind public start to the admitted contract without widening `StartIntent`
5. make prompt assembly and manifest provenance consume the admitted contract
6. make closure checks and gap/dossier handoff consume the same admitted
   contract
7. reprice tests and wording that still prove raw operator/ticket execution
   basis

Downstream dossier, prompt, and projection cleanup is non-closure evidence until
the admitted execution-contract carrier is authoritative.

## Break-To-Closure Map

- Breaks 1-3 close the source-carrier clause:
  - execution truth exists before work executes and is logged as runtime truth
- Break 4 closes the public-start clause:
  - `app.start(...)` is a binding over the carrier, not execution-law owner
- Breaks 5-6 close the downstream-consumer clause:
  - prompt, manifest, closure, and dossier consumers read one admitted basis
- Break 7 closes the proof clause:
  - mixed raw/new execution-basis proof no longer counts as closure evidence

## Mixed-State Negative Proof

Closure requires proof that removing or corrupting the admitted
`execution_contract_surface` prevents prompt/manifest/closure consumption from
claiming a valid execution basis. A test that passes by falling back to raw
operator text, target strings, ticket body text, or route-helper output is
evidence that this ticket is still open.

## Closure Evidence

- `odd_sdlc.gtl_module` publishes `derive_execution_contract_surface` and
  `admit_execution_contract_surface` as internal source-carrier graph functions.
- `odd_sdlc start` admits the execution contract before ABG 3.2 F_P dispatch
  opens.
- all constructive graph functions declare
  `odd_sdlc_execution_contract_context`, so ABG 3.2 manifests carry the admitted
  contract through their `contexts` array and the rendered prompt includes the
  same context.
- the old `dispatch_provenance.constructive_prompt_template` path is removed
  from active code/design/test authority and replaced by
  `PROMPT_CONTEXT_CARRIAGE.md`.
- negative proof now verifies raw `gen_start` without an admitted execution
  contract fails closed on missing `odd_sdlc_execution_contract_context`.

Targeted proof run:

- `test_module_publishes_first_asset_function_catalog`
- `test_ticket_asset_start_carries_ticket_execution_context_into_manifest_prompt`
- `test_raw_gen_start_without_admitted_execution_contract_fails_closed`
- `test_new_execution_contract_supersedes_previous_admitted_contract`
- `test_install_start_routes_ticket_asset_without_manual_upstream_edit`
- `test_default_claude_manifest_declares_domain_dispatch_timeout`

Result: `6 passed`.

## Why This Ticket Exists

The recent odd_sdlc wave improved materially once ticket structure became a
hard evaluation surface instead of loose commentary.

That behavior should not depend on the operator manually enforcing it.

The system should follow this loop explicitly:

1. here is the work
2. categorize it
3. ticket it
4. validate the ticket/execution contract
5. keep working according to the admitted criteria
6. send the result through proof, gap analysis, and repricing as usual

This ticket turns that manual discipline into runtime law.

Under inside-out migration discipline, this is the upstream source-carrier
ticket for the current prompt/dossier execution wave. Downstream consumer
tickets such as gap-dossier prompt consumption do not close ahead of this
surface.

## Required Direction

1. Introduce one execution_contract_surface as the current admitted work
   carrier.
2. Make the draft carry, at minimum:
   - type
   - ticket_category
   - change_class
   - re_entry_point
   - affected_boundary
   - target_truth
   - superseded_truth when relevant
   - closure_law
   - evaluation_criteria
   - non_closure_conditions
   - proof_surface
3. Add a deterministic admission step that marks the contract as drafted,
   admitted, rejected, or superseded.
4. Emit events for:
   - execution contract drafted
   - execution contract admitted
   - execution contract rejected
   - execution contract superseded
5. Keep `StartIntent` small; do not widen it into the execution contract.
6. Keep `app.start()` thin: it binds operator input to the admitted
   execution_contract_surface and must not become the owner of execution law.
7. Make prompt assembly consume the admitted contract rather than raw work
   text.
8. Make closure checking and later gap-analysis handoff read from the same
   admitted contract.

## Acceptance

- odd_sdlc can draft or load a ticket-shaped execution contract before work
  executes
- the contract is validated and admitted or rejected explicitly
- the admitted contract is logged in runtime/event truth before execution work
  opens
- the admitted contract exists as the authoritative source carrier for the run
- prompt assembly consumes the admitted contract
- closure checks read from the admitted contract
- proof and gap analysis still occur after execution and can supersede or
  reopen the contract lawfully

## Post-Closure ODD_METHOD Review - 2026-04-21

Review recorded in:

- `.ai-workspace/comments/codex/20260421T212949Z_REVIEW_completed-active-wave-tickets-odd-method-graph-requirements.md`

Verdict:

- ODD_METHOD graph requirements are satisfied for the execution-contract
  source-carrier migration.
- `derive_execution_contract_surface` and `admit_execution_contract_surface`
  are the internal source-carrier graph functions.
- Public `odd_sdlc start` remains a delivery binding over the admitted carrier,
  not the owner of execution law.

Residual review risk:

- The admitted asset surface is validated and graph-owned, but the Python
  implementation still represents the payload as dictionaries. Future work must
  not treat arbitrary dict expansion as permission to add new execution
  semantics outside the admitted carrier.
