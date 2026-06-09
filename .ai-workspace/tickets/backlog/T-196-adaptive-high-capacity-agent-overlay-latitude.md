---
id: T-196
title: Adaptive high-capacity agent overlay latitude
type: feature
ticket_category: ordinary
status: backlog
proof_status: not_started
goal: allow future high-capacity agent lanes to satisfy graph obligations with broader overlay inspection without weakening GTL/ABG authority
build_tenant: typescript
owner: odd_sdlc
change_intent: >-
  Define a future overlay family for agent lanes whose measured reliable
  transformation capacity is high enough to inspect broader graph-overlay
  context, choose lawful staged or fused execution inside an admitted attention
  budget, and call deterministic GTL/ABG admission or ledger read APIs directly
  while preserving ABG runtime truth, per-carrier admission, test execution, and
  evidence-bound closure.
change_class: design_reframe
re_entry_point: design
priority: medium
triaged_at: 2026-06-09
created_at: 2026-06-09
updated_at: 2026-06-09
governance_scope: STDO Method
source_documents:
  - specification/PRODUCT.md
  - specification/requirements/02-graph-functions.md
  - specification/requirements/03-runtime-governance.md
  - specification/requirements/16-edge-gain-closure-contract.md
  - specification/requirements/18-typed-construction-algebra.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_REUSABLE_GRAPH_FUNCTION_LIBRARY.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_OPTIMISING_OVERLAY.md
  - .ai-workspace/tickets/active/T-165-define-optimising-overlay-for-landscape-conditioned-fd-specialization.md
  - .ai-workspace/tickets/active/T-184-partition-handoff-into-compute-stage-boundary-modules.md
  - .ai-workspace/tickets/completed/T-185-agent-internal-subworkstreams-for-compute-stage-acceleration.md
  - .ai-workspace/tickets/completed/T-187-restore-fp-evaluator-prompt-boundary-and-proportionality.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md
related_tickets:
  - .ai-workspace/tickets/active/T-165-define-optimising-overlay-for-landscape-conditioned-fd-specialization.md
  - .ai-workspace/tickets/active/T-184-partition-handoff-into-compute-stage-boundary-modules.md
  - .ai-workspace/tickets/completed/T-185-agent-internal-subworkstreams-for-compute-stage-acceleration.md
  - .ai-workspace/tickets/completed/T-187-restore-fp-evaluator-prompt-boundary-and-proportionality.md
affected_boundary:
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_OPTIMISING_OVERLAY.md
  - build_tenants/typescript/design/ODD_SDLC_TYPESCRIPT_REUSABLE_GRAPH_FUNCTION_LIBRARY.md
  - build_tenants/typescript/code/src/graph/overlays.ts
  - build_tenants/typescript/code/src/graph/catalog.ts
  - build_tenants/typescript/code/src/operator/plugins/transform/
  - build_tenants/typescript/code/src/operator/plugins/evaluate/
  - build_tenants/typescript/code/src/operator/installed_operator.ts
  - build_tenants/typescript/test_env/tests/
excluded_boundary:
  - current lite-overlay repair or hello-world live-lane closure
  - weakening the base proportionality law for lower-capacity or ordinary agent lanes
  - F_P writing ABG events, ledgers, closure decisions, traversal transitions, or consequence projections
  - product-local runtime loops, hidden controllers, or non-ABG replay truth
  - treating a model name as authority without measured capacity evidence
  - prompt-only permission without an admitted overlay, budget, capability envelope, and proof lane
target_truth: >-
  Future high-capacity agent lanes may be given broader graph-overlay context
  and more execution latitude only through an admitted adaptive overlay. The
  overlay records the agent lane, measured reliable transformation capacity,
  allowed fused-output columns, allowed deterministic API reads/calls, required
  per-carrier admission, required test execution, escalation triggers, and
  fallback route. The agent may choose how to satisfy obligations inside that
  envelope, but GTL/ABG carriers, admission, ledgers, replay, traversal, and
  closure remain the only truth surfaces.
superseded_truth: >-
  Stronger future models are handled by informal prompt permission, larger
  monolithic prompts, ambient chat memory, local tool access convention, or
  hidden agent discretion without an admitted capacity envelope and deterministic
  proof that obligations still pass through GTL/ABG truth.
closure_law: >-
  This backlog closes only when odd_sdlc has a designed and tested adaptive
  high-capacity overlay contract that can grant broader graph inspection and
  deterministic GTL/ABG API use to qualified agent lanes while proving that
  every carrier output remains separately admitted, every required test
  obligation executes, every ledger or admission interaction is deterministic
  and replay-visible, and any capacity or obligation failure falls back to the
  conservative staged overlay.
evaluation_criteria:
  - the design defines reliable transformation capacity as an admitted budget over input ambiguity, output carrier count, cross-carrier coupling, proof depth, domain novelty, code blast radius, context budget, tool access, effort, and allowed parallelism
  - adaptive overlay selection is a typed overlay binding, not a public-start branch or prompt convention
  - a qualified agent may inspect broader graph-overlay context only inside the admitted overlay envelope
  - deterministic GTL/ABG API calls are limited to declared read/admission/ledger interaction surfaces and cannot create runtime truth outside ABG
  - fused execution must preserve per-output-carrier admission, separable failure reasons, redispatch or escalation, and evidence-bound closure
  - lower-capacity lanes keep the conservative staged graph and are not penalized by the adaptive overlay
  - stronger lanes may use fewer hops or more internal/parallel work only when the admitted capacity budget proves the fusion is proportionate
  - capacity failure, malformed carrier output, omitted test execution, stale graph context, or unadmitted API interaction forces fallback to the conservative overlay
proof_surface:
  - design module for adaptive high-capacity overlay contract and capacity envelope
  - deterministic tests for qualified and unqualified lane selection
  - deterministic tests for lawful broader graph inspection and forbidden hidden controller behavior
  - deterministic tests for allowed deterministic GTL/ABG API calls and rejected runtime-truth writes
  - deterministic tests for fused-output per-carrier admission and partial-column failure
  - deterministic tests proving fallback to the conservative staged overlay when capacity, context, or proof obligations are not met
  - live proof only after the conservative proportional overlay is already closing cleanly
non_closure_conditions:
  - adaptive latitude is used to fix current hello-world, lite-overlay, or T-165 proportionality defects before the base overlay is lawful
  - the overlay grants authority by model name alone without measured capacity evidence
  - the agent may satisfy obligations through prompt assertions instead of admitted carriers and deterministic proof
  - API calls write ledgers, closure, traversal, or replay truth outside ABG-owned surfaces
  - fused hops hide which output carrier failed admission
  - failed capacity proof retries indefinitely instead of falling back to staged graph execution
  - tests prove only prompt text or mocked success rather than real overlay binding, admission, and fallback behavior
---

# T-196: Adaptive High-Capacity Agent Overlay Latitude

## STDO Triage

First missing layer: design.

The current proportionality repair must remain conservative. Lite and full
overlays must preserve the same graph law: bounded transformation pressure,
typed carrier outputs, F_D admission, mandatory test execution, and
evidence-bound closure.

This backlog records the separate future line for stronger agentic coders. It
does not change the base overlay law and does not authorize a larger prompt as
a substitute for graph decomposition.

## Motivation

The product needs a way to account for improving agent capability without
turning every overlay into the lowest-common-denominator graph.

A small model may need:

```text
4 x 1
```

four staged hops with one bounded transformation each.

A stronger lane may lawfully execute:

```text
1 x 4
```

one fused hop with four separately admitted output columns.

The fused form is valid only if it preserves the same carrier set, same
per-carrier admission, same test obligation, same failure visibility, and same
closure law.

## Future Design Claim

Adaptive latitude is a typed overlay contract, not worker discretion.

The overlay should admit a capacity envelope such as:

```text
agent_lane
model_generation
effort_class
context_budget
tool_access
allowed_parallelism
max_fused_output_columns
max_distinct_carrier_families
max_dependency_depth
allowed_deterministic_api_refs
required_admission_per_column
required_test_execution
fallback_overlay_ref
```

The agent may choose staged, fused, or internally parallel execution only inside
that envelope. The graph still owns the obligations. ABG still owns runtime
truth.

## Out Of Scope For Current Work

This ticket must not be used to patch the current lite-overlay failure. If the
current graph overloads one F_P call, the current graph must be decomposed or
escalated. Future high-capacity latitude can only build on a base overlay that
already closes lawfully.

## Open Design Questions

- How should reliable transformation capacity be measured across models,
  effort levels, tool access, and context windows?
- Which deterministic GTL/ABG functions may an agent call directly without
  becoming a runtime authority?
- Does API use remain read/admission-only, or can a future ABG-owned call
  expose ledger writes through a strictly admitted system interface?
- What replay evidence records graph context inspected by the agent?
- What minimum fixture pack calibrates `4 x 1`, `2 x 2`, and `1 x 4`
  transformation reliability?
