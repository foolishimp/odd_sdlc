# odd_sdlc TypeScript Workspace Ingress Seams

**Status**: Active
**Date**: 2026-04-26
**Implements**: REQ-F-ODDSDLC-007, REQ-F-ODDSDLC-012, REQ-F-ODDSDLC-016, REQ-F-ODDSDLC-022, REQ-F-ODDSDLC-032
**Derives From**: `ODD_SDLC_TYPESCRIPT_TENANT_DERIVATION.md`, `build_tenants/python/design/REQUIREMENT_CLOSURE_CARRIER_AND_PROJECTION_BOUNDARY.md`, `.ai-workspace/tickets/backlog/T-019-split-workspace-assets-filesystem-model-and-projection-seams.md`

## Position

Workspace ingress is a typed admission boundary, not an installer and not a
filesystem controller.

The TypeScript tenant separates the ingress surface into these seams:

| Seam | File | Owns |
| --- | --- | --- |
| carrier vocabulary | `workspace/carriers.ts` | source input, project constraints, imported requirement authority, bootstrap lineage, and ingress report types |
| source input derivation | `workspace/source_input.ts` | digest, role detection, authority-marker extraction, ambiguity classification, source-input admission |
| project constraints | `workspace/project_constraints.ts` | closed project-profile admission and project slug parsing |
| bootstrap lineage | `workspace/bootstrap_lineage.ts` | imported requirement seed authority and `InputSet -> Project` lineage projection |
| compatibility barrel | `workspace/ingress.ts` | export continuity only |

## Authority Rule

Ingress may admit raw workspace snapshots and project constraints into typed
truth. It may not mutate the workspace, choose a graph traversal, publish ABG
runtime facts, or infer semantic authority from path names alone.

## T-019 Lesson

The Python `workspace_assets.py` seam-split ticket remains a Python
realization chore. The TypeScript tenant still adopts its design lesson now:
filesystem/path discovery, model vocabulary, and projection assembly must not
collapse into one mixed-concern module.

This is not a like-for-like split of Python files. The split follows ODD roles:
admitted input carrier, project constraint carrier, imported authority
projection, and bootstrap lineage projection.

Local optimization is the explicit module split. Global optimization is that
later requirement closure consumes the lineage carrier instead of rescanning
the workspace.

## Closure Check

T-031 remains closed only while:

- raw source input admission is separate from project-constraint admission
- imported requirement authority is projected from admitted source inputs
- bootstrap lineage is a projection over admitted carriers
- downstream requirement closure consumes typed lineage rather than rescanning
  the fixture as a hidden recovery engine
