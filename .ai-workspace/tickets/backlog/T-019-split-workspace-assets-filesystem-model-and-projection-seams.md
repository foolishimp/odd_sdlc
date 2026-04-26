---
id: T-019
title: Split workspace asset filesystem IO, asset model, and projection assembly into explicit seams
type: chore
ticket_category: ordinary
status: backlog
goal: keep odd_sdlc asset publication and certification readable without one mixed-concern workspace_assets module
change_intent: Replace the current mixed `workspace_assets.py` surface with clearer filesystem, model, and projection seams while preserving one published asset contract
change_class: realization_refactor
re_entry_point: design_surface
affected_boundary: odd_sdlc asset publication, generated-asset contract publication, filesystem scanning, and projection assembly cohesion
priority: medium
triaged_at: 2026-04-20
created_at: 2026-04-20
updated_at: 2026-04-26T06:00:00Z
dependencies:
intake_source: split from completed T-011 umbrella after stale review-cleanup items were reconciled
---

## Why This Ticket Exists

`build_tenants/python/code/odd_sdlc/workspace_assets.py` still mixes:

- filesystem scanning and path resolution
- asset-model and contract definitions
- projection assembly for query and diagnostics

That makes review and isolated proof harder than it should be.

## Required Direction

1. Separate filesystem/path discovery from asset-model definitions.
2. Separate projection assembly from low-level asset inspection.
3. Preserve one published asset/query truth while splitting the realization
   seams underneath it.

## Acceptance

- filesystem IO, asset model, and projection assembly are explicit seams
- current published asset/query truth remains singular through the split

## Scope Note

This is a Python-tenant refactor ticket.

The current TypeScript build wave did not port `workspace_assets.py`. It
realized the TypeScript side as separate ODD-native surfaces:

- `workspace/source_input.ts` for source-input admission
- `workspace/project_constraints.ts` for project constraint admission
- `workspace/bootstrap_lineage.ts` for ingress lineage
- `domain/` for asset and worksite carriers
- `projection/query_domain.ts` for read/query and ownership projections

The Python tenant remains separate. This ticket should not be treated as
current TypeScript work and should be opened only if the Python maintenance line
is explicitly resumed.
