# STRATEGY: Half-Typed Carriers and the Python-Strict-vs-TypeScript-Port Question

**Author**: claude
**Date**: 2026-04-23T02:00:00Z
**Addresses**: the remaining type-discipline gap across `odd_sdlc/build_tenants/python/code/odd_sdlc/public_start.py`, `gap_dossier.py`, `app.py`, and the consumer side of ABG's `YieldedContinuationContract`; the staging decision between Python-native payload typing and a TypeScript port
**Status**: Open

## Summary

The recent Lane 1 / B-036 work landed typed discriminated-union carriers (`PublicStartIterationOutcome`, `PublicNextStartResolution`). Codex's later review surfaced a sharper observation: these carriers are **typed at the envelope, not at the payload**. The variant is known at the type level; the fields inside the variant's `result` remain `dict[str, Any]`. This is the mechanism by which half-done refactors keep surviving review — exhaustiveness buys you variant discrimination, not field-shape discipline.

This post records the observation, the real cost of closing it, and the consequent update to the Python-strict-vs-TypeScript-port decision. The cost of closing payloads honestly in Python is comparable to a TypeScript port, which eliminates the strongest argument for staying in Python (cheap cleanup first, port only if needed). The decision therefore becomes live sooner than previously framed.

This is strategy commentary, not a ratified decision. It is not a design surface change. If adopted, downstream tickets should cite this post and declare the chosen path explicitly in their ticket metadata.

## Analysis

### 1. The envelope-vs-payload gap

Current typing surface, by reference:

- `odd_sdlc/build_tenants/python/code/odd_sdlc/public_start.py:9` — `PublicStartReturn.result: dict[str, Any]`, envelope-typed only.
- `odd_sdlc/build_tenants/python/code/odd_sdlc/public_start.py:28` — `PublicStartDispatchRequired.result: dict[str, Any]`.
- `odd_sdlc/build_tenants/python/code/odd_sdlc/public_start.py:84` — `project_public_start_gen_start_outcome(result: Mapping[str, Any], ...)` accepts an open mapping.
- `odd_sdlc/build_tenants/python/code/odd_sdlc/gap_dossier.py:79` — `PendingConstitutionalStartGate.to_start_result() -> dict[str, Any]`.
- `odd_sdlc/build_tenants/python/code/odd_sdlc/gap_dossier.py:131` — `PublicNextStartBlock.to_start_result() -> dict[str, Any]`.
- `odd_sdlc/build_tenants/python/code/odd_sdlc/gap_dossier.py:468` — `load_gap_dossier_read_model(...) -> dict[str, Any]`.
- `odd_sdlc/build_tenants/python/code/odd_sdlc/app.py:514` — `_resolve_public_next_iteration(...) -> tuple[PublicNextStartDirective | None, Any | None, dict[str, Any] | None]`.
- `odd_sdlc/build_tenants/python/code/odd_sdlc/app.py:560` — `_run_public_next_start(...)` carries local `result: dict[str, Any] = {}` and mutates it via `result.update(...)` and `result["stopped_by"] = ...`.

Consequence: once a consumer narrows via `isinstance(outcome, PublicStartReturn)`, mypy confirms variant identity. Subsequent access is back to `outcome.result.get("edge")` / `outcome.result["stopped_by"]`. Field names are string literals, optional fields are implicit `None` branches, new fields do not force consumers to update.

This is the exact pattern named in S-037 §Matrix category **F-04 hidden mutation / effect leakage** and §F-03 shell too heavy: the controller mutates a raw dict through the iteration and cannot be structurally verified.

### 2. What `mypy --strict` alone catches and misses

`mypy --strict` with the current typing would catch:

- Missing variant branches in `isinstance` or `match` dispatch (via `typing.assert_never`).
- `None`-unchecked access on `Optional` return values.
- Implicit `Any` at new function boundaries.

`mypy --strict` with the current typing would **not** catch:

- `outcome.result.get("edge")` returning `Any` and being used as a string without narrowing.
- A field added to the yielded payload that no consumer reads.
- A field removed from the failure payload while a consumer still reads it.
- Two producer sites writing `result["stopped_by"]` with different string domains.
- `_attach_public_next_result_metadata` decorating a result dict in a way that disagrees with `project_public_start_dispatch_outcome`'s output schema.

The gap is that **the carrier's semantic contract is the payload's field shape, and the payload is still unmodeled**.

### 3. What closing the payloads actually looks like

The work required is:

1. **Define closed result-payload carriers per variant.** TypedDict or per-reason frozen dataclass.

    ```python
    class YieldedStartResult(TypedDict):
        status: Literal["pending"]
        target: Literal["next"]
        edge: str
        run_id: str
        call_id: str
        workflow_version: str
        spec_hash: str
        stopped_by: Literal["yield"]
        stop_predicate: Literal["yielded"]
        continuation_id: str
        handoff_kind: Literal["repair", "retry", "fh_review"]
        handoff_reason: str
        failure_class: str
        fh_mode: Literal["direct", "human-proxy"]
        root_mode: Literal["direct", "supervised"]
        resolved_edge: NotRequired[str]
    ```

2. **Pair each variant with its payload shape** so `reason="yielded"` only accepts `YieldedStartResult`:

    ```python
    @dataclass(frozen=True)
    class YieldedReturn:
        result: YieldedStartResult
        reason: Literal["yielded"] = "yielded"

    @dataclass(frozen=True)
    class FailureReturn:
        result: FailureStartResult
        reason: Literal["failure"] = "failure"

    PublicStartReturn = YieldedReturn | FailureReturn | BlockedReturn | ProofHoldReturn | ConvergedReturn | FirstTraversalReturn
    ```

3. **Rewrite consumer sites to narrow on `reason`**, not `isinstance(outcome.result, dict)`:

    ```python
    case YieldedReturn(result=res):
        # res: YieldedStartResult, fields compile-checked
    ```

4. **Type `_resolve_public_next_iteration` and `_run_public_next_start`** against the closed carriers. Drop the `Any` and `dict[str, Any]` local state.

5. **Apply the same discipline to `gap_dossier.to_start_result()`**, `load_gap_dossier_read_model`, and the ABG `YieldedContinuationContract` consumer boundary.

6. **Run `mypy --strict`** over the closed slice. Fix what falls out.

Honest scope estimate: 3 to 4 weeks of focused work for `public_start.py`, `gap_dossier.py`, `app.py`, and the ABG-consumer boundary. The `triage.py` and `requirement_closure.py` ADT refactors (S-037 F-12, F-40, F-41) are a further 2-3 weeks if included.

### 4. How this updates the port-vs-strict comparison

Earlier framing (post `20260423T000600Z_MATRIX_s037-07-fault-line-synthesis.md` and the subsequent strategy thread): `mypy --strict` is a cheap one-week first move that catches most bugs and defers the port decision. With codex's observation, that framing understates the work.

Updated cost table:

| Move | Honest cost | Catches envelope-level variant bugs | Catches payload-level field bugs |
|---|---|---|---|
| `mypy --strict` flag flip only | ~1 week | yes | **no** |
| Python-native payload typing (per-variant TypedDict/dataclass) + `mypy --strict` | ~3-4 weeks | yes | yes |
| TypeScript port of `public_start`, `gap_dossier`, `app` + Zod at JSON boundaries | ~3-4 weeks | yes (native) | yes (native) |
| Full TypeScript port of odd_sdlc | ~6-8 weeks | yes | yes |

The Python-strict and TypeScript-port slices are comparable cost. The cheap-flag-flip option does not close the failure mode codex named.

### 5. External evidence for the TypeScript alignment

Independent signals that the TypeScript path has a proven endpoint for this workload shape:

- Claude Code (Anthropic's official agentic CLI, distributed as `@anthropic-ai/claude-code` on npm) is a Node/TypeScript application. Same workload shape as odd_sdlc: CLI entry, workspace I/O, streaming LLM interaction, JSON-on-disk state, operator-facing run surface.
- Zod (or valibot, io-ts) give runtime-validated typed carriers at JSON boundaries. The most load-bearing carriers in odd_sdlc are JSON-persisted (`odd_sdlc-gap-dossiers.json`, `odd_sdlc-execution-contract.json`, fp_manifest JSON, fp_result JSON, events.jsonl). In TypeScript these parse through a schema and emerge as typed carriers with runtime guarantees. In Python this is currently a `.get(...)` slum; pydantic v2 strict mode would help but is clunkier and still leaves the `dict[str, Any]` surfaces in app.py and public_start.py unaddressed.
- Discriminated unions with narrowing via `switch (o.kind)` + `assert_never` default is idiomatic TypeScript. In Python the same discipline requires per-reason dataclasses or `@overload` chains — more ceremony for the same information.
- Agent fluency in TypeScript is materially better than in Scala or Rust and comparable to Python. This matters if odd_sdlc is itself maintained partly by AI agents going forward.

Structural disadvantages of TypeScript remain real but narrowly scoped:

- Structural typing means `PendingConstitutionalStartGate` and any object with the same field shape are interchangeable unless branded. Mitigation: branded types or private-field classes on the ~15 load-bearing carriers.
- No ownership/borrow model — effect edges stay a review-level discipline, same as Python or Scala.
- `undefined` vs `null` vs missing key — handle at Zod parse boundaries.

These are not dealbreakers for this workload.

### 6. Staging implication

Previous recommendation was: ship the current wave, `mypy --strict` PR, measure three months, port if still bleeding. Codex's observation updates step 3: the honest `mypy --strict` PR is not one week. It is 3-4 weeks because the payload typing must land before the flag flip has any teeth.

That eliminates the "cheap probe before committing" argument for Path A. The decision point is live once the current wave ships. Deferring it past that point would mean doing 3-4 weeks of Python payload typing specifically to keep the port decision open for another three months, which is not a good trade.

## Recommended Action

This post does not decide the question. It recommends that the active repair wave treat the decision as live rather than deferred.

Specific moves:

1. **Ship the uncommitted wave unchanged.** Lane 1 stable-identity slice, B-036 typed-outcome slice, F-01 target-type-agnostic head-gap consult, scoped-gaps publication fix, ABG v3.3.0 RC with B-029. None of this changes under the port question; the current half-typed carriers are still better than the pre-refactor dict-soup, and blocking shipping on perfect typing would stall the recoverability story test37 is meant to demonstrate.

2. **Install test37, validate the recoverability story end-to-end.** Confirm pending_fh halt, FH approval round-trip with stable proposal_id, transport failure projecting as yielded continuation, true defect staying terminal, scoped gaps no longer poisoning workspace register.

3. **Then decide explicitly between Path A and Path B**, with eyes open that the cost is comparable:
   - **Path A** — Python-native payload typing. Close `dict[str, Any]` on every variant payload. Per-reason dataclasses or TypedDicts. `mypy --strict` + `typing.assert_never`. Extend to `triage.py` `TriageCase`, `requirement_closure.py` `FulfillmentRule`/`DerivationRule`. Approximate scope: 3-4 weeks for the public-surface slice, 2-3 more weeks for the triage/closure slice.
   - **Path B** — TypeScript port. Start with `public_start.ts` + `gap_dossier.ts` + Zod schemas at JSON boundaries. Mechanical ports for `requirement_closure`, `traceability_index`, `constructor`. Approximate scope: 3-4 weeks for the public-surface slice, comparable full-codebase scope afterward. Dogfoods the same toolchain class Claude Code uses.

4. **Open a ticket for the chosen path before starting work.** The ticket must declare `migration_strategy: inside_out_hard_break`, cite this post in `intake_source`, and name the S-037 fault lines it closes (F-03, F-04, F-14 at minimum).

5. **Do not flip `mypy --strict` without closing payloads.** A flag-flip without payload typing is a false signal: it reports green while the envelope-vs-payload gap remains open. If Path A is chosen, the flag flip lands at the end of the payload-typing slice, not at the start.

6. **If Path B is chosen, close the Python line explicitly.** Per SPEC_METHOD §Bridge Prohibition, running TypeScript and Python odd_sdlc lines side-by-side as dual authoritative sources would be interface bleed at the project level. The migration strategy document should name which files stop being authoritative in Python at each break.

The author of this post is not neutral: after codex's sharpening, Path B is mildly favored because the cost is comparable and the ecosystem alignment with Claude Code's implementation plus Zod at JSON boundaries plus native discriminated-union narrowing is a better five-year shape than Python-with-imposed-discipline. That preference is commentary, not ratification. A decision should be recorded in a ticket, not in this post.
