---
id: T-186
title: Clean up TS tenant dead code, barrel leaks, and leaf-helper duplication
type: chore
ticket_category: ordinary
status: completed
build_tenant: typescript
owner: odd_sdlc
goal: reduce-realization-entropy-without-changing-product-or-runtime-authority
change_intent: Delete verified-dead internal exports, narrow blanket `export *` barrels that leak test-only or monolith-internal symbols onto the package public surface, and consolidate byte-identical leaf helpers into one tenant-local home. All behavior-preserving; no change to product truth, runtime authority, module ownership, or public semantic carriers.
change_class: realization_refactor
re_entry_point: realization
library_usage: extend
governing_library: build_tenants/typescript/code/src/shared/ (and admission/codecs.ts for the canonical isRecord guard)
library_rationale: leaf helpers are byte-identical, authority-neutral utilities; tenant-local commonization (DESIGN_MODULE §11C step 2). Cross-unit/substrate templates (parseClosedRecord, catalog rule-of-four) are explicitly out of scope and deferred to a separate design re-entry.
priority: medium
triaged_at: 2026-05-30
created_at: 2026-05-30
updated_at: 2026-05-30
governance_scope: STDO Method
source_documents:
  - .ai-workspace/comments/claude/20260530T034546Z_ts_tenant_cleanup_audit.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/DESIGN_MODULE_METHOD.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/TICKET_METHOD.md
related_tickets:
  - .ai-workspace/tickets/active/T-184-partition-handoff-into-compute-stage-boundary-modules.md
depends_on:
  - T-184
affected_boundary:
  - build_tenants/typescript/code/src/analysis/archive_reader.ts
  - build_tenants/typescript/code/src/analysis/diagnostics.ts
  - build_tenants/typescript/code/src/operator/traversal_strategy.ts
  - build_tenants/typescript/code/src/shared/
  - build_tenants/typescript/code/src/admission/codecs.ts
  - build_tenants/typescript/code/src/operator/index.ts
  - build_tenants/typescript/code/src/qualification/index.ts
  - build_tenants/typescript/code/src/operator/product_materialization/index.ts
  - per-file leaf-helper copies named in CN-01..CN-06 of the audit log
excluded_boundary:
  - any export that may have an out-of-workspace consumer (DC-03 -> product_reprice, separate ticket)
  - monolith decomposition, behavioral-F_D, and effect-edge seam extraction (TD-01/02/03/06 -> T-184 / design_reframe)
  - removal of the assurance/ subsystem (-> design_reframe coordinated with T-184 LD-016/LD-019)
  - substrate-level template commonization: parseClosedRecord (~17x), contracts catalog rule-of-four, per-register rule-of-four (CN-10..CN-16 -> specification_methodology design re-entry)
  - relocating ~1,800 lines of test-only fixtures off the public barrel (DC-02 -> needs test/product decision)
target_truth: The TS tenant carries no dead internal exports, publishes only consumed symbols on its barrels, and defines each leaf utility once. Realization entropy drops with zero change to runtime authority, product semantics, or the F_P/F_D boundary.
superseded_truth: 522/1310 exports referenced in no other src file; byte-identical leaf helpers (uniqueSorted x23, parseArray x4+, isRecord x10, sha256 x6, pathIsInside x2) re-implemented per file; blanket `export *` republishing dead and test-only symbols onto the package public surface.
closure_law: T-186 closes only when the DC-01 dead exports are deleted, the CN-01..CN-06 leaf helpers exist exactly once and every byte-identical copy is removed and redirected, the DC-04 barrels re-export only consumed symbols, `npm run build:semantic` and `npm run test:semantic` pass, and no deleted or narrowed symbol has any surviving consumer. No design_reframe item may be folded into this chore.
evaluation_criteria:
  - each DC-01 symbol is deleted and grep-proven to have zero remaining reference in code/src and test_env/{tests,live}
  - each CN-01..CN-06 helper has exactly one definition consumed by all former copy sites; no byte-identical private copy remains; behavior equivalence is shown (identical body or a passing equivalence test)
  - each DC-04 barrel lists explicit named re-exports; every removed name has zero consumer in code/src + test_env/{tests,live} and is not reachable from a package.json export root
  - the refuted-live symbols stay exported (installed_operator 27 symbols, feature_scope 2 fns, feature_dependency_dag deriveSdlcFeatureDependencyDag) — no per-symbol de-export inside those files
  - build:semantic and test:semantic are green after the change
non_closure_conditions:
  - a "dead" symbol is deleted while any consumer (including a public-barrel re-export reachable from a package.json export) still resolves it
  - a near-identical-but-not-identical helper is collapsed without proving behavior equivalence
  - barrel narrowing removes a genuinely-public export without a product_reprice
  - any design_reframe item (monolith split, effect-edge, behavioral-F_D, assurance removal, substrate template) is folded into this chore
  - a per-symbol export-keyword demotion is applied inside installed_operator / feature_scope / feature_dependency_dag (refuted as live)
  - tests are edited to pass instead of proving the consolidation is behavior-preserving
---

# T-186: Clean up TS tenant dead code, barrel leaks, and leaf-helper duplication

## STDO Triage

First missing layer: realization. The governing requirements and design already
say these symbols/utilities should not be duplicated or dead — the code drifted.
Per the `TICKET_METHOD` upward-propagation check this is `realization_refactor`,
not a requirement or design change. Several rows finish deletions an existing
design already decided (e.g. `deriveLegacyReplayOnly...`, the assurance purge),
so the design authority is upstream and intact.

Evidence basis: the file-by-file audit log in `source_documents[0]`
(deterministic export/import scan -> 32 per-module agents -> adversarial
refutation of every removal claim -> synthesis; 63 agents). Each work-ledger row
cites a `DC-`/`CN-` id there. The adversarial pass is load-bearing: it overturned
the largest raw candidates (27 `installed_operator` symbols, `feature_scope`,
`feature_dependency_dag`) as live spine-reachable code, so they are explicitly
preserved.

## Sequencing vs T-184

Non-operator work (the dead exports in `analysis/`, and the leaf-helper dedup
across `analysis`/`release`/`start`/`install`/`workspace`/`graph`) was
independent. The operator-touching rows (`operator/index.ts` barrel,
leaf-helper copies inside operator files) were completed after the T-184
checkpoint commit `0d1ea89`, preserving the active T-184 code state instead of
running a new `data_mapper` lane.

## Work Ledger (this ticket's closure scope only)

| id | task | audit ref | closure proof | seq | status |
| --- | --- | --- | --- | --- | --- |
| C-01 | Delete dead exported helpers `operatorRunRootsOldestFirst` (analysis/archive_reader.ts), `hasFailingDiagnostic` (analysis/diagnostics.ts). | DC-01 | grep: 0 references in src + real tests; build/test green | now | completed |
| C-02 | Delete dead `assessmentStatusToClosureRegisterStatus`, `OddSdlcTraversalStrategyProfile`, and the dead `shared/fd_admission` B-086 `admitDeclaredAlias`/`SdlcFdFieldClass`. | DC-01 | grep 0-ref; build/test green | now | completed |
| C-03 | Remove the dead `operator/product_materialization/index.ts` barrel (0 importers; launch_contract imports the unit modules directly). | DC-01 | grep proves no importer; build green | after T-184 checkpoint | completed |
| C-04 | Consolidate `isRecord`/`isPlainRecord`/`isStringRecord` to the canonical `admission/codecs.ts` guard; redirect the ~10 copies. | CN-04 | one definition; copies import it; identical body; test green | now | completed |
| C-05 | Lift `uniqueSorted`/`sortedStrings` into `shared/`; delete the ~23 per-file copies and redirect. | CN-01 | one definition in shared/; 0 private copies; test green | after T-184 checkpoint | completed |
| C-06 | Lift `parseArray<T>` (4 byte-identical register copies + hooks/admission) into `shared/`; redirect. | CN-02 | one definition; byte-identical bodies removed; test green | after T-184 checkpoint | completed |
| C-07 | Lift `sha256Text`/`sha256Digest` (6 sites) and `pathIsInside`/containment guard (byte-identical) into `shared/`; redirect. | CN-03, CN-06 | one definition each; copies removed; test green | after T-184 checkpoint | completed |
| C-08 | Narrow blanket `export *` to explicit named re-exports on the barrels that leak only test-only / monolith-internal symbols: `qualification/index.ts` (~30 test-only incl. sandbox_proof/enterprise_core), `operator/index.ts` (monolith internals). Preserve every spine-reachable and genuinely-public export. | DC-04, TD-04 | each removed name: 0 consumer in src + real tests, not reachable from a package.json export root; build/test green | after T-184 checkpoint | completed |

## Completion Evidence - 2026-05-30

- `npm run build:semantic` passed.
- `npm run test:semantic` passed: 808 tests, 808 pass, 0 fail.
- Focused T-186/T-184/T-181/T-147/T-059 affected suites passed:
  dead-export, helper consolidation, explicit-barrel, tenant tech-stack, and
  release-adapter guards.
- Grep proof found the deleted DC-01 symbols absent from `code/src` and found
  one canonical definition for each consolidated helper family:
  `admission/codecs.ts` for record guards, `shared/collections.ts` for sorted
  string helpers, `shared/validation.ts` for `parseArray`, `shared/digest.ts`
  for SHA-256 helpers, and `shared/path.ts` for containment checks.
- `operator/index.ts` and `qualification/index.ts` use explicit named exports;
  no blanket `export *` remains on those narrowed barrels.
- No `data_mapper` live run was started as part of this closure.

## Out Of Scope (flagged follow-ups, different change class — do NOT fold in)

- **DC-02** — relocate ~1,800 lines of test-only fixtures off the public barrel
  into `test_env` (qualification `sandbox_proof`/`enterprise_core` 1,304 ln,
  `operator/test_pipeline` 406 ln). Needs a test/product decision; some carry
  unsupported REQ claims. Open a separate ticket.
- **DC-03** — ~484 lines of public-surface / steel-thread-ahead-of-wiring
  (incl. the 340-line lineage/repair frontier). `product_reprice` / circle-back;
  do not delete blind.
- **TD-01 / TD-03 / TD-06** — decompose the `No Semantic Center` monoliths
  (`launch_contract.ts` 12.5k, `installed_operator.ts` 9.3k) and move F_P
  `evaluate*` logic out of the F_D transform module. `design_reframe` — this is
  **T-184's** domain; coordinate, do not duplicate.
- **TD-02** — Effect-Edge seam extraction (consequence.C spawning subprocesses;
  59 write sites in `installed_operator`). `design_reframe`.
- **assurance/ subsystem** (13 files / 3,177 ln) — reachable only via the public
  barrel, the no-op `assurance_gate.ts` (still threaded through dispatch +
  persisted as an authority artifact), and one live type import. `design_reframe`
  coordinated with T-184 LD-016/LD-019.
- **CN-10..CN-16** — substrate-level templates (`parseClosedRecord` ~17x,
  contracts catalog rule-of-four, per-register rule-of-four). Ratify a shared
  admit helper in `specification_methodology` first; do not normalize by
  repetition.

## Non-Goals

- Do not change product truth, runtime/ABG authority, or the F_P/F_D boundary.
- Do not de-export spine-reachable symbols (the refuted `installed_operator` /
  `feature_scope` / `feature_dependency_dag` symbols stay exported).
- Do not touch `operator/event_store.ts` — it is append-only (correct); the
  earlier full-rewrite concern was already reverted.
- Do not commonize across the tenant/substrate boundary inside this chore.
