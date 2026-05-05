# ADR-009 - Agentic CLI Worker Progress Observation Boundary

**Status**: Active
**Date**: 2026-05-04
**Implements**: REQ-F-ODDSDLC-052, REQ-F-ODDSDLC-053
**Owner Ticket**: `.ai-workspace/tickets/active/T-110-migrate-typescript-to-abg-3-5-traced-agent-callout-substrate.md`

## Context

`odd_sdlc` uses agentic coder CLIs as live `F_P` workers through process
transports such as `process://claude` and `process://codex`.

B-071 moved process execution onto the ABG supervised process actor. That gave
the installed operator replayable runtime truth for:

- child process start
- stdout/stderr stream chunks
- heartbeats
- timeout and signal sequence
- child process exit

The test66 live Claude run exposed a missing design rule. Claude's text output
mode may buffer stdout until final response. In that mode a healthy worker can
read the prompt, call the remote model, write the target artifact, and exit
successfully while ABG sees no stream progress until the final stdout chunk.

That makes stdout silence ambiguous:

- the worker may be stuck;
- the worker may be doing long private reasoning;
- the CLI may be buffering final text output;
- the worker may be writing files that are not watched by the process stream
  observer.

Increasing the timeout does not resolve the ambiguity. It only extends the
period where the runtime lacks admitted progress evidence.

## Decision

Agentic CLI worker progress is a multi-plane observation problem.

The ratified progress planes are:

1. **process/protocol progress**: stdout/stderr stream chunks or structured
   protocol events emitted by the worker process;
2. **artifact progress**: changes to declared refs such as output, report, plan,
   progress, stdout, stderr, or archive files;
3. **closure progress**: admitted result report, postflight, ledgers, and graph
   closure projection.

Only closure progress can close an SDLC graph edge.

Process/protocol progress and artifact progress are liveness and diagnostic
truth. They may prevent false silent-worker classification, sharpen retry
policy, and improve operator diagnostics. They do not replace F_P semantic
judgment, F_D deterministic checks, or ledger admission.

A timed-out worker that preserved declared output or product artifacts is not a
silent worker. The preserved artifacts must either be admitted through the
normal postflight/ledger path, or rejected with a typed
artifact-progress-without-report blocker that cites the preserved refs.

For Claude Code, the default process transport must consume the ABG 3.5 traced
agent callout contract instead of defining local odd_sdlc transport law.
Realtime structured output is preferred over buffered final text output:

```text
claude -p --output-format stream-json --verbose ...
```

`--include-partial-messages` is not part of the odd_sdlc transport contract.
ABG owns the concrete Claude argv shape, stream-json parser, api-retry
observation, tool-call observation, final-output extraction, PTY transcript
capture, and typed process outcome classification.

If a CLI transport cannot emit realtime protocol progress, ABG may observe
declared artifact refs generically as process-progress evidence. Such
observation remains substrate-level file progress, not domain closure.

## Boundary

ABG owns:

- child process lifecycle;
- stdout/stderr stream observation;
- Claude stream-json parser ownership;
- local-spawn and pty-terminal executor profiles;
- PTY terminal transcript capture;
- api-retry, tool-call, and structured parse-failure observation;
- generic process/protocol progress events;
- heartbeat, timeout, signal, and exit events;
- typed process outcomes, including hard timeout, inactivity timeout,
  executor unavailable, launch/process error, and lost terminal;
- generic artifact-progress observation when declared refs are supplied.

`odd_sdlc` owns:

- admission of the worker transport binding for each agentic CLI;
- lowering that admitted binding plus SDLC handoff truth into the ABG callout
  request;
- the handoff manifest refs for prompt, output, report, and archive files;
- the domain interpretation of generated artifacts;
- F_P/F_D boundary enforcement;
- postflight, ledger, and edge-closure interpretation.

ABG must not infer SDLC semantic closure from file mtime or byte changes.
`odd_sdlc` must not bypass ABG with a private process polling loop.

## Consequences

- `process://claude` default text output is no longer an adequate live
  supervision contract.
- `process://claude` lowers to the ABG-owned stream-json/PTY callout contract;
  odd_sdlc does not own Claude parser or argv law.
- Heartbeats remain actor-wrapper liveness, not productive worker evidence.
- A silent stdout/stderr window is not automatically a stuck worker when the
  transport is known to buffer output.
- Inactivity policy must reason over declared progress evidence, not process
  streams alone.
- ABG typed outcomes outrank legacy scalar summaries when projecting
  odd_sdlc blocking reasons.
- Live proof must preserve enough archive truth to distinguish buffered CLI
  output from a genuinely stalled worker.
- `silent_worker_inactivity` is reserved for runs with no process/protocol
  progress, no declared artifact progress, and no more specific ABG typed
  outcome such as `hard_timeout`.

## Non-Decisions

This ADR does not make artifact existence a closure rule.

This ADR does not require every worker CLI to use the same output protocol.
Each transport may provide its own best realtime protocol, but the runtime
archive must preserve the chosen progress evidence.
