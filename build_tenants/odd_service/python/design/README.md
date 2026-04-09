# odd_service Design Root

This root holds tenant-local design for the `odd_service` incubation line.

Primary current design references:

- `/Users/jim/src/apps/odd_method/.ai-workspace/comments/claude/20260407T151904_STRATEGY_odd-sdlc-session-controller-design.md`
- `/Users/jim/src/apps/odd_method/.ai-workspace/comments/codex/20260408T023007Z_PROJECT_odd-service-carveout-and-odd-manager-client.md`
- [ODD_SERVICE_TRANSLATION.md](./ODD_SERVICE_TRANSLATION.md)

The design rule is:

- `odd_service` owns orchestration and worker-session authority
- ABG owns run, event, convergence, and provenance truth
- `odd_sdlc` remains domain substance
- `odd_manager` remains a client
