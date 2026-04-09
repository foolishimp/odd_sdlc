# odd_service Code Root

This root holds the incubating `odd_service` implementation.

The service should wrap the existing local GTL/ABG + `odd_sdlc` execution path.
It must not introduce a rival runtime substrate.

Current phase-1 package shape:

- `odd_service.service` for the top-level service entry
- `odd_service.state` for service-local session and worker persistence
- `odd_service.workers` for worker registry
- `odd_service.runtime_adapter` for the local `odd_sdlc` + ABG wrapper
- `odd_service.models` for service-local records
- `odd_service.__main__` for the local CLI surface

Current implemented commands:

- `python -m odd_service status --workspace .`
- `python -m odd_service workers --workspace .`
- `python -m odd_service attach --workspace . --worker-name builder --agent claude`
- `python -m odd_service start --workspace . --worker-name builder`
- `python -m odd_service run --workspace . --worker-name builder --human-proxy`
- `python -m odd_service observe --workspace . --run-id <run_id>`
- `python -m odd_service approve --workspace . --run-id <run_id> --actor human-proxy`
- `python -m odd_service reject --workspace . --run-id <run_id> --reason "..." `

Deferred package shape:

- `odd_service.routing` for richer contract-driven worker selection
- `odd_service.transport.*` for explicit local/remote transport plugins
- `odd_service.mcp_server` for CLI-agent access
- `odd_service.http_api` and `odd_service.sse` for browser clients
