# odd_service Tenant Root

`odd_service` is the incubating service tenant on the `odd_method` line.

This tenant exists to keep the enduring orchestration-plane work separate from:

- `odd_sdlc` as domain substance
- ABG as runtime truth
- `odd_manager` as browser client UX

It is not a second runtime.

Its target responsibility is:

- session lifecycle
- worker registry
- dispatch routing
- local and remote transport orchestration
- client-facing MCP and HTTP/SSE surfaces

Its non-goals are:

- replacing GTL or ABG
- redefining convergence or provenance truth
- owning browser or terminal UI

This root currently holds:

- tenant-local code under `code/`
- tenant-local design under `design/`

The project carve-out is described in:

- `/Users/jim/src/apps/odd_method/.ai-workspace/comments/codex/20260408T023007Z_PROJECT_odd-service-carveout-and-odd-manager-client.md`
