# SCOPE: T-018 and T-019 Python Seam Tickets

**Status**: Backlog, Python line only.

T-018 and T-019 are real tickets, but they target the Python tenant:

- T-018 targets `build_tenants/python/code/odd_sdlc/triage.py`
- T-019 targets `build_tenants/python/code/odd_sdlc/workspace_assets.py`

The current instruction keeps the Python tenant separate and makes this agent
the TypeScript developer. Under that scope, these tickets are not executable
without reopening Python maintenance.

The TypeScript wave did absorb the lesson:

- T-036 split triage observation, classification, route binding, repricing
  proposal, ticket route, and retirement into explicit TS seams.
- T-031/T-032 split source input, constraints, bootstrap lineage, domain
  carriers, and query projections instead of copying `workspace_assets.py`.

The tickets remain backlog so Python debt is not erased, but they should not
block the bounded TypeScript RC.
