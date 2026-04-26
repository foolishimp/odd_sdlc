---
id: T-041
title: Realize TypeScript full operational Python-replacement RC lane
type: feature
ticket_category: build_wave_followup
status: backlog
goal: future-full-python-replacement-rc
change_intent: Extend the bounded odd_sdlc.TS RC package into a full operational replacement claim for the Python tenant.
change_class: product_reprice
re_entry_point: product_definition
affected_boundary: TypeScript CLI/install adapter, installed workspace normalization, live F_P data_mapper traversal, release-cut packaging, run archive comparison
priority: medium
triaged_at: 2026-04-26
created_at: 2026-04-26
updated_at: 2026-04-26
dependencies:
  - T-038 completed
governance_scope: STDO Method
governance_scope_expansion:
  - S: SPEC_METHOD.md
  - T: TICKET_METHOD.md
  - D: DESIGN_MODULE_METHOD.md
  - O: ODD_METHOD.md
intake_source: T-038 RC qualification report bounded the TypeScript release claim and identified the remaining full Python-replacement surfaces.
target_truth: odd_sdlc.TS can be evaluated as a full operational replacement candidate for Python, with side-effecting workspace install/normalize, public CLI, live F_P data_mapper traversal, release-cut packaging, and postmortem archive comparison.
superseded_truth: bounded TypeScript package RC qualification is equivalent to full Python operational parity.
closure_law: this ticket closes only when TypeScript proves the full operational claim through unit, harnessed sandbox, live F_P, installed-workspace, release-cut, and Python comparison evidence.
evaluation_criteria:
  - CLI command grammar exposes the shared install/start/gaps/release operator surface without bypassing graph-function and ABG authority
  - install and normalize prepare an imported target workspace while preserving project-owned authority, substrate-owned surfaces, and installer-owned domain surfaces
  - live data_mapper traversal uses an external F_P worker and records the postmortem archive
  - release-cut packaging and binary binding are produced by declared TypeScript surfaces rather than inferred from local dev commands
  - Python comparison states behavioral parity, intentional difference, and remaining gaps with evidence
proof_surface:
  - TypeScript CLI/install design
  - installed-workspace sandbox archive
  - live F_P run archive
  - release-cut artifact evidence
  - Python parity postmortem
non_closure_conditions:
  - live F_P behavior is claimed without live worker evidence
  - workspace mutation happens outside an adapter that preserves ODD authority boundaries
  - CLI commands decide internal traversal outside ABG
  - release evidence is inferred from semantic tests alone
---

## STDO Reading

T-038 proves a bounded TypeScript package RC. This ticket is the future wider
operational claim.

It must not translate Python file boundaries directly. It must extract the
Python-observed behavior into graph-function programs, typed carriers, ABG
runtime truth, public adapters, and qualification archives.
