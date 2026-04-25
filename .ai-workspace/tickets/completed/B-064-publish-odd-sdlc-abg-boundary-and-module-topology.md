---
id: B-064
title: Publish odd_sdlc ABG boundary and module topology
type: design
ticket_category: ordinary
status: completed
goal: make-odd-sdlc-framework-boundary-legible-before-further-cleanup
change_intent: The current odd_sdlc framework has too much surrounding code around ABG without one clean design surface explaining which modules are SDLC scaffold, which surfaces belong to ABG, which declarations belong to GTL, and which bodies are SDLC-owned IoC hooks. The architecture must be readable as SDLC(ABG(Iterate(SDLC.Graph, ioc(SDLC hooks)))) before further cleanup can be governed.
change_class: design_reframe
re_entry_point: design
affected_boundary: odd_sdlc module topology, ABG continuation boundary, GTL graph-function carrier, SDLC IoC hook ownership, future consolidation review
priority: high
triaged_at: 2026-04-25
created_at: 2026-04-25
updated_at: 2026-04-25
completed_at: 2026-04-25
dependencies:
  - B-063 active
intake_source: operator architecture review after odd_sdlc/ODD_METHOD orientation
target_truth: odd_sdlc has one clean design document that states SDLC as the surrounding scaffold, ABG as traversal engine, GTL as graph-function program language, and SDLC traversal/evaluation/governance hooks as IoC bodies invoked at declared vector boundaries.
superseded_truth: module responsibilities are inferable only by reading many code files and design fragments, making it unclear whether odd_sdlc is a domain scaffold over ABG or an accumulating runtime framework around ABG.
closure_law: this ticket closes when a ratified design surface exists, is indexed by the tenant design README, and can be used as the review lens for later code compression.
evaluation_criteria:
  - the design states the governing call shape explicitly
  - ABG, GTL, SDLC scaffold, and SDLC IoC hook responsibilities are separated
  - current Python modules are grouped by responsibility without turning projections into runtime authority
  - future cleanup has a compression test for deciding whether a module belongs in SDLC, ABG, GTL, or an IoC hook
proof_surface:
  - `build_tenants/python/design/ODD_SDLC_ABG_BOUNDARY_AND_MODULE_TOPOLOGY.md`
  - `build_tenants/python/design/README.md`
non_closure_conditions:
  - the document invents a new runtime layer
  - the document moves domain HOW into ABG or GTL
  - the document blesses tenant-local continuation loops as lawful
---

## Closure Note

Published the boundary design and indexed it from the tenant design README.

Changed:

- `build_tenants/python/design/ODD_SDLC_ABG_BOUNDARY_AND_MODULE_TOPOLOGY.md`
- `build_tenants/python/design/README.md`

No code behavior changed.
