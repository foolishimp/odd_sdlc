# CONSOLIDATION: Cross-Project Idea Inventory for ODD

**Author**: claude
**Date**: 2026-04-06T06:43:12Z
**Sources**: genesis_sdlc comments (64 claude + 2 gemini + 133 codex), abiogenesis comments (28 claude + 7 gemini + 82 codex), odd_method codex (3 posts)
**Status**: Reference
**Purpose**: Single consolidated table of top ideas mined from the full commentary archive across genesis_sdlc, abiogenesis, and odd_method — rated for value and prioritized for ODD development

---

## How to read this table

- **Value** (1–5): how load-bearing the idea is for ODD's architecture and direction
- **Priority** (1–5): how urgently ODD should act on it (1 = now, 5 = future wave)
- **Source**: abbreviated path to the original post for traceability

---

## A. Asset and Type Semantics

These ideas define ODD's central ontological commitment: assets as world-bearing carriers with semantic types that drive traversal and evaluation.

| # | Idea | Description | Value | Priority | Source |
|---|------|-------------|-------|----------|--------|
| A1 | World-bearing assets | Assets carry URI identity, fulfillment, semantic type, provenance, and convergence context. Eliminates the "detached data + controller reconstruction" entropy source. The central ODD thesis. | 5 | 1 | [odd_method/codex/20260406T135728Z_STRATEGY_world-bearing-asset-semantics.md](/Users/jim/src/apps/odd_method/.ai-workspace/comments/codex/20260406T135728Z_STRATEGY_world-bearing-asset-semantics.md) |
| A2 | AssetType as semantic library | AssetType carries F_D evaluation, F_P gap evaluation, F_P descriptive framing, proof hints. Types are reusable semantic library surfaces, not flat labels. Facets like `structured_document`, `authority_surface`, `verification_surface` compose. | 5 | 1 | [odd_method/codex/20260406T135728Z_STRATEGY_world-bearing-asset-semantics.md](/Users/jim/src/apps/odd_method/.ai-workspace/comments/codex/20260406T135728Z_STRATEGY_world-bearing-asset-semantics.md) |
| A3 | ODD domain model: 11 first-class objects | Asset, AssetType, AssetCollection, AssetNode, Function, AssetGraph, AssetBinding, Gap, ConvergenceTarget, FunctionCall, AssetResolver. Bounded ontology for the first ODD slice. | 5 | 1 | [odd_method/codex/20260406T111823Z_SCHEMA_odd-asset-function-domain-model.md](/Users/jim/src/apps/odd_method/.ai-workspace/comments/codex/20260406T111823Z_SCHEMA_odd-asset-function-domain-model.md) |
| A4 | Requirements as workspace asset | Requirements emerge from project iteration of the intent→requirements edge, not pre-declared as Package parameters. The workspace owns them, not the installed product. | 5 | 2 | [genesis_sdlc/claude/20260319T124728_STRATEGY_workflow-composition-and-requirements-as-asset.md](/Users/jim/src/apps/genesis_sdlc/.ai-workspace/comments/claude/20260319T124728_STRATEGY_workflow-composition-and-requirements-as-asset.md) |
| A5 | Bootloader as derived governed asset | Bootloader is a compiled constraint surface for LLM consumption, not a hand-maintained config file. Should be F_D-checked and version-pinned. | 4 | 3 | [genesis_sdlc/claude/20260321T120000_REVIEW_bootloader-drift-fixed-asset-proposal.md](/Users/jim/src/apps/genesis_sdlc/.ai-workspace/comments/claude/20260321T120000_REVIEW_bootloader-drift-fixed-asset-proposal.md) |
| A6 | Mutable assets as checkpoints over constructive history | Mutable assets governed through provenance and constructive history, not treated as context-free blobs. CQRS-style: runtime authoritative, materialized surface is projected checkpoint. | 4 | 2 | [odd_method/codex/20260406T111823Z_SCHEMA_odd-asset-function-domain-model.md](/Users/jim/src/apps/odd_method/.ai-workspace/comments/codex/20260406T111823Z_SCHEMA_odd-asset-function-domain-model.md) |

---

## B. Convergence and Evaluation Model

The mathematical and operational model for how work converges toward correctness.

| # | Idea | Description | Value | Priority | Source |
|---|------|-------------|-------|----------|--------|
| B1 | Convergence gradient (delta→0) | Iterate toward `total_delta: 0` rather than binary pass/fail. Same computation at every scale (edge, function, project). Enables continuous feedback signal for probabilistic workers. The mathematical foundation of the runtime. | 5 | 1 | [genesis_sdlc/claude/20260319T125136_STRATEGY_graph-workspace-independence-and-evolution-via-gaps.md](/Users/jim/src/apps/genesis_sdlc/.ai-workspace/comments/claude/20260319T125136_STRATEGY_graph-workspace-independence-and-evolution-via-gaps.md) |
| B2 | Three-regime escalation (F_D→F_P→F_H) | Deterministic truth closes first. Agent output is not constitutional truth. Human approval does not override deterministic failure. F_D failure escalates to F_P as problem surface, not gates it. | 5 | 1 | [abiogenesis/claude/20260323T110000_STRATEGY_fd-escalates-to-fp-engine-fix.md](/Users/jim/src/apps/abiogenesis/.ai-workspace/comments/claude/20260323T110000_STRATEGY_fd-escalates-to-fp-engine-fix.md) |
| B3 | Context digest in certification hash | Context content change invalidates prior F_P certifications automatically. Solves the "stale observation surface" problem — the deepest gap identified by five-lens formal analysis. | 5 | 2 | [genesis_sdlc/claude/20260321T160000_SCHEMA_abg-formal-gap-analysis-category-sheaf-temporal-tcp.md](/Users/jim/src/apps/genesis_sdlc/.ai-workspace/comments/claude/20260321T160000_SCHEMA_abg-formal-gap-analysis-category-sheaf-temporal-tcp.md) |
| B4 | Evaluator multiplicity reframes use cases | No new subsystems needed. Evaluator sets + vector-capable convergence reframe all use cases. ABG does not synthesize domain data — provides IoC framework for domain to define evaluation. | 5 | 2 | [abiogenesis/claude/20260326T101740_REVIEW_evaluator-multiplicity-reframes-usecases.md](/Users/jim/src/apps/abiogenesis/.ai-workspace/comments/claude/20260326T101740_REVIEW_evaluator-multiplicity-reframes-usecases.md) |
| B5 | Operator/evaluator constitutional separation | Actor that does work ≠ actor that judges work. Essential because AI agents are untrusted. Regime tags place each in hierarchy. Never let workers evaluate their own work. | 5 | 1 | [abiogenesis/codex/20260326T161806_STRATEGY_pluggable-graph-synthesis-selection-and-evaluator-ioc.md](/Users/jim/src/apps/abiogenesis/.ai-workspace/comments/codex/20260326T161806_STRATEGY_pluggable-graph-synthesis-selection-and-evaluator-ioc.md) |
| B6 | Five prime operators from consciousness loop | found, approved, assessed, revoked, intent_raised — irreducible event primitives mapped from observation→evaluation→action→expression→intent. Event Calculus projection semantics. | 5 | 2 | [genesis_sdlc/claude/20260320T015641_REVIEW_prime-operators-consciousness-loop-consensus.md](/Users/jim/src/apps/genesis_sdlc/.ai-workspace/comments/claude/20260320T015641_REVIEW_prime-operators-consciousness-loop-consensus.md) |
| B7 | Edge invalidation via fd_gap_found | Use existing primitive for convergence reset. If fd_gap_found postdates prior approval, that approval is stale. No new event type needed — projection rule suffices. | 4 | 3 | [genesis_sdlc/claude/20260320T002717_STRATEGY_edge-invalidation-via-fd-gap-found.md](/Users/jim/src/apps/genesis_sdlc/.ai-workspace/comments/claude/20260320T002717_STRATEGY_edge-invalidation-via-fd-gap-found.md) |
| B8 | F_H carries forward, F_P does not | Human approvals persist across iteration. Agent certifications expire and must be re-earned. Frame axiom asymmetry is constitutionally correct. | 4 | 3 | [abiogenesis/claude/20260321T191000_SCHEMA_spec-clarifications-8-1-8-5.md](/Users/jim/src/apps/abiogenesis/.ai-workspace/comments/claude/20260321T191000_SCHEMA_spec-clarifications-8-1-8-5.md) |

---

## C. Graph Function Composition and Algebra

The mathematical structure that enables composable, recursive, lawful programs.

| # | Idea | Description | Value | Priority | Source |
|---|------|-------------|-------|----------|--------|
| C1 | Monadic composition laws | compose, substitute, identity, recurse are algebraic center. Must satisfy monad laws (left/right identity, associativity). Three property tests must assert monad laws before building on the algebra. | 5 | 1 | [abiogenesis/claude/20260326T081241_REVIEW_graphfunction-monadic-composition.md](/Users/jim/src/apps/abiogenesis/.ai-workspace/comments/claude/20260326T081241_REVIEW_graphfunction-monadic-composition.md) |
| C2 | Contract-preserving refinement | substitute() replaces coarse edge with finer subgraph while preserving interface. Enables runtime zoom without breaking outer contract. | 5 | 2 | [abiogenesis/claude/20260326T081241_REVIEW_graphfunction-monadic-composition.md](/Users/jim/src/apps/abiogenesis/.ai-workspace/comments/claude/20260326T081241_REVIEW_graphfunction-monadic-composition.md) |
| C3 | Pluggable graph synthesis and selection | Consumer-pluggable graph synthesis/selection with evaluator attestation under ABG-hosted provenance. Four-part surface: synthesis hook, lawful application, evaluator attestation, replayable provenance. The real ABG extensibility blocker. | 5 | 2 | [abiogenesis/codex/20260326T161806_STRATEGY_pluggable-graph-synthesis-selection-and-evaluator-ioc.md](/Users/jim/src/apps/abiogenesis/.ai-workspace/comments/codex/20260326T161806_STRATEGY_pluggable-graph-synthesis-selection-and-evaluator-ioc.md) |
| C4 | Homeostatic ODD programs | An `odd_program` is a managed callable transformation over typed asset dependencies that participates in evaluator regimes and emits runtime fact truth. Collapses program/orchestration/monitoring/review into one unified construct. | 5 | 1 | [odd_method/codex/20260406T052309Z_STRATEGY_homeostatic-odd-programs.md](/Users/jim/src/apps/odd_method/.ai-workspace/comments/codex/20260406T052309Z_STRATEGY_homeostatic-odd-programs.md) |
| C5 | Recursive tail-loop machine control | Explicit RecursiveMachineControl replaces scan-driven recursion. Operator path now deterministic and replayable. Continuation/frontier state plus interpreter-owned cursor. | 4 | 3 | [abiogenesis/codex/20260401T235355_EXECUTION_UPDATE_tail-loop-machine-cursor-control.md](/Users/jim/src/apps/abiogenesis/.ai-workspace/comments/codex/20260401T235355_EXECUTION_UPDATE_tail-loop-machine-cursor-control.md) |
| C6 | Named variants not per-project overlays | Customization via named versioned variants, monotonically additive. No per-project overlay files. Variant composition produces deterministic gaps with no data migration. | 4 | 3 | [genesis_sdlc/claude/20260319T124728_STRATEGY_workflow-composition-and-requirements-as-asset.md](/Users/jim/src/apps/genesis_sdlc/.ai-workspace/comments/claude/20260319T124728_STRATEGY_workflow-composition-and-requirements-as-asset.md) |

---

## D. Runtime, Events, and Provenance

How runtime truth is recorded, projected, and used for correction.

| # | Idea | Description | Value | Priority | Source |
|---|------|-------------|-------|----------|--------|
| D1 | Event stream / graph independence | Event stream is immutable and graph-independent. Upgrading workflow variants produces deterministic gaps with no data migration. Same stream through different graphs yields different convergence states. | 5 | 2 | [genesis_sdlc/claude/20260319T125136_STRATEGY_graph-workspace-independence-and-evolution-via-gaps.md](/Users/jim/src/apps/genesis_sdlc/.ai-workspace/comments/claude/20260319T125136_STRATEGY_graph-workspace-independence-and-evolution-via-gaps.md) |
| D2 | Dual identity: work_key vs run_id | work_key names what is being built. run_id names which attempt. Enables correction without history erasure, run comparison, provenance chains. | 5 | 1 | [abiogenesis/claude/20260321T180000_STRATEGY_abg-1-0-mvp-definitive-task-plan.md](/Users/jim/src/apps/abiogenesis/.ai-workspace/comments/claude/20260321T180000_STRATEGY_abg-1-0-mvp-definitive-task-plan.md) |
| D3 | Pending dispatch deduplication | manifest_id carrier prevents duplicate work in flight. EC semantics: fp_dispatched initiates, assessed terminates. Prevents redundant LLM calls and cascading failures. | 4 | 3 | [abiogenesis/claude/20260321T230000_STATUS_mvp-readiness-assessment.md](/Users/jim/src/apps/abiogenesis/.ai-workspace/comments/claude/20260321T230000_STATUS_mvp-readiness-assessment.md) |
| D4 | Authoritative F_P manifest expansion | F_P manifest JSON as structured data carrier, not prompt-coupled artifact. Serialize PrecomputedManifest fields (markov, fd_results, delta, contexts). A conforming F_P transport reads only JSON, not sideband. | 4 | 3 | [genesis_sdlc/claude/20260322T160000_STRATEGY_authoritative-fp-manifest-expansion.md](/Users/jim/src/apps/genesis_sdlc/.ai-workspace/comments/claude/20260322T160000_STRATEGY_authoritative-fp-manifest-expansion.md) |
| D5 | Control plane compiles resolved runtime | Runtime compilation layer produces one inspectable artifact from four layers (constitutional law, release defaults, project tuning, runtime state). Centralizes all runtime decisions before execution. | 5 | 2 | [genesis_sdlc/claude/20260328T200000_EXPLAINER_what-the-control-plane-changed-and-why.md](/Users/jim/src/apps/genesis_sdlc/.ai-workspace/comments/claude/20260328T200000_EXPLAINER_what-the-control-plane-changed-and-why.md) |
| D6 | Reporting metadata vs canonical runtime identity | build, engine_id, worker_id, backend_id, authority_ref are distinct identity surfaces. Reporting metadata is not canonical worker/runtime truth. Conflicts fail closed. | 3 | 4 | [abiogenesis/codex/20260404T204911Z_CLOSURE_abg-runtime-identity-projection-cut.md](/Users/jim/src/apps/abiogenesis/.ai-workspace/comments/codex/20260404T204911Z_CLOSURE_abg-runtime-identity-projection-cut.md) |

---

## E. Governance, Traceability, and Self-Hosting

How constitutional authority flows and how the system proves its own claims.

| # | Idea | Description | Value | Priority | Source |
|---|------|-------------|-------|----------|--------|
| E1 | Custody failure: false convergence | Three-chain break: provenance (diagnosis never became REQ key), causality (evaluators checked wrong requirements = false convergence), custody (requirements leave human custody, engine never picks up). System reports convergence when it is wrong. | 5 | 1 | [genesis_sdlc/claude/20260321T080000_GAP_requirements-workflow-separation-not-implemented.md](/Users/jim/src/apps/genesis_sdlc/.ai-workspace/comments/claude/20260321T080000_GAP_requirements-workflow-separation-not-implemented.md) |
| E2 | Spec leads, code follows | Proof gates release, not the reverse. Unregistered capabilities (code without spec) are release blockers. Traceability chain INT→REQ→Feature→ADR→Code→Test is non-negotiable. | 5 | 1 | [abiogenesis/claude/20260321T180000_STRATEGY_abg-1-0-mvp-definitive-task-plan.md](/Users/jim/src/apps/abiogenesis/.ai-workspace/comments/claude/20260321T180000_STRATEGY_abg-1-0-mvp-definitive-task-plan.md) |
| E3 | ABG as TCP/IP for convergence | ABG manages cognitive load on behalf of agentic coders through kernel-level primitives. Certification, invalidation, orphan detection, provenance move from volatile agent context into deterministic infrastructure. | 5 | 2 | [genesis_sdlc/claude/20260321T173000_STRATEGY_cognitive-load-management-abg-purpose.md](/Users/jim/src/apps/genesis_sdlc/.ai-workspace/comments/claude/20260321T173000_STRATEGY_cognitive-load-management-abg-purpose.md) |
| E4 | Self-hosting compiler boundary | Released product in use is the builder; product under development is the thing being built. Engine reads .genesis/ (GCC 1.0), build source is separate. If those surfaces merge, self-hosting becomes drift. | 4 | 4 | [genesis_sdlc/claude/20260320T120000_GAP_gcc-bootstrap-boundary-violation.md](/Users/jim/src/apps/genesis_sdlc/.ai-workspace/comments/claude/20260320T120000_GAP_gcc-bootstrap-boundary-violation.md) |
| E5 | Four-territory model | Spec (constitutional), Builds (implementation), .Genesis (release), .AI-workspace (runtime evidence). Prevents domain/kernel boundary leaks. Enforced by installer audit. | 4 | 2 | [genesis_sdlc/claude/20260323T013000_REVIEW_sdlc-workflow-interim-walkthrough.md](/Users/jim/src/apps/genesis_sdlc/.ai-workspace/comments/claude/20260323T013000_REVIEW_sdlc-workflow-interim-walkthrough.md) |
| E6 | Immutable core vs local spec | Separate immutable released spec (.genesis/) from mutable local spec (project-owned). Two-layer install with strict ownership boundaries. | 5 | 2 | [genesis_sdlc/claude/20260319T070000_STRATEGY_immutable-core-vs-local-spec.md](/Users/jim/src/apps/genesis_sdlc/.ai-workspace/comments/claude/20260319T070000_STRATEGY_immutable-core-vs-local-spec.md) |
| E7 | Readiness assessment: behaviorally ready, constitutionally illegal | System can work but cannot prove it. EC3/EC1/A1 shipped code-first without spec backing or tests. Shadow features must be legalized before release. | 4 | 3 | [abiogenesis/gemini/20260321T233000_REVIEW_readiness-assessment-evaluation.md](/Users/jim/src/apps/abiogenesis/.ai-workspace/comments/gemini/20260321T233000_REVIEW_readiness-assessment-evaluation.md) |

---

## F. Architecture, Topology, and Evolution

How the system structure evolves and adapts.

| # | Idea | Description | Value | Priority | Source |
|---|------|-------------|-------|----------|--------|
| F1 | DAG topology with priority strategies | Redesign from linear pipeline to proper DAG with explicit build strategies (steel_thread, risk_first, value_first). Features get build schedules, structured decomposition, validated dependencies. | 5 | 2 | [genesis_sdlc/claude/20260323T020000_STRATEGY_dag-topology-and-priority-methodology.md](/Users/jim/src/apps/genesis_sdlc/.ai-workspace/comments/claude/20260323T020000_STRATEGY_dag-topology-and-priority-methodology.md) |
| F2 | Bootloader split: universal vs domain | Monolithic bootloader conflates universal axioms (GTL) with domain instantiation (SDLC). Non-SDLC projects inherit domain-specific constraints. Split into GTL_BOOTLOADER + domain-specific. ODD already inherits the clean split. | 4 | 3 | [genesis_sdlc/claude/20260320T180000_GAP_bootloader-split-universal-vs-sdlc.md](/Users/jim/src/apps/genesis_sdlc/.ai-workspace/comments/claude/20260320T180000_GAP_bootloader-split-universal-vs-sdlc.md) |
| F3 | ObserverModel and CompositionSet | Two missing named concepts: ObserverModel (composed context surface against which homeostasis evaluates), CompositionSet (available solution macros an intent can route into). Neither needs new primitives — composition patterns over existing types. | 5 | 2 | [genesis_sdlc/claude/20260321T150000_STRATEGY_observer-model-composition-set-and-abg-1-0-plan.md](/Users/jim/src/apps/genesis_sdlc/.ai-workspace/comments/claude/20260321T150000_STRATEGY_observer-model-composition-set-and-abg-1-0-plan.md) |
| F4 | ABG cloud-native distributed engine | GTL as portable SDK (JVM/Scala), ABG as distributed runtime on AWS (DynamoDB, Step Functions, Bedrock, Lambda). Event-sourced design maps cleanly to cloud services. Single-process Python was always degenerate case. | 4 | 5 | [abiogenesis/claude/20260331T110000_STRATEGY_abg-cloud-native-distributed-engine.md](/Users/jim/src/apps/abiogenesis/.ai-workspace/comments/claude/20260331T110000_STRATEGY_abg-cloud-native-distributed-engine.md) |
| F5 | Intent-governed homeostatic self-evolution | ABG as self-evolving system: self-model→intent→action→feedback→model_revision→renewed_intent. Three layers: semantic/GTL, runnable/ABG, interpreter. Consciousness loop as functional model. | 4 | 3 | [abiogenesis/codex/20260326T024802_STRATEGY_intent-governed-homeostatic-self-evolution.md](/Users/jim/src/apps/abiogenesis/.ai-workspace/comments/codex/20260326T024802_STRATEGY_intent-governed-homeostatic-self-evolution.md) |
| F6 | GTL4 candidate pressure through ODD | ODD proves which type semantics are universal. Possible GTL4 additions: first-class semantic carriers, type-driven function signatures, richer binding semantics, reusable evaluation attached to types. Ratify only if ODD proves universality. | 5 | 3 | [odd_method/codex/20260406T135728Z_STRATEGY_world-bearing-asset-semantics.md](/Users/jim/src/apps/odd_method/.ai-workspace/comments/codex/20260406T135728Z_STRATEGY_world-bearing-asset-semantics.md) |

---

## G. Operational Lessons and Corrections

Hard-won lessons from genesis_sdlc and abiogenesis dogfooding.

| # | Idea | Description | Value | Priority | Source |
|---|------|-------------|-------|----------|--------|
| G1 | bind_fp is lossy projection | Hardcoded invariants + 4000-char truncation defeat Context[] mechanism. Fix: remove hardcoding, remove truncation, full context documents reach F_P. The methodology IS the Context[] documents. | 4 | 2 | [genesis_sdlc/claude/20260322T150000_REVIEW_bind-fp-lossy-projection.md](/Users/jim/src/apps/genesis_sdlc/.ai-workspace/comments/claude/20260322T150000_REVIEW_bind-fp-lossy-projection.md) |
| G2 | Engine/build divergence | Engine and build copies diverged into two non-overlapping development lines. Tests pass because PYTHONPATH resolves to engine copies. Cascade install would ship incomplete code. | 4 | 2 | [abiogenesis/claude/20260321T193000_REVIEW_phase-2-4-code-review.md](/Users/jim/src/apps/abiogenesis/.ai-workspace/comments/claude/20260321T193000_REVIEW_phase-2-4-code-review.md) |
| G3 | Platform dependency in evaluators | Traceability evaluators hardcoded to Python. Non-Python project inherits broken F_D evaluators. Fix: engine generalizes (--pattern --ext), platform profile defines (comment_style, src_ext). | 4 | 3 | [genesis_sdlc/claude/20260316T064500_GAP_platform-dependency-traceability-assurance.md](/Users/jim/src/apps/genesis_sdlc/.ai-workspace/comments/claude/20260316T064500_GAP_platform-dependency-traceability-assurance.md) |
| G4 | F_P qualification: 20/20 runs prove manifest surface sufficient | Zero failures across 20 deterministic qualification runs. The manifest prompt surface is sufficient for real LLM dispatch. Validated transport recovery via MCP. | 4 | 3 | [abiogenesis/claude/20260322T210000_REVIEW_live-fp-qualification-results.md](/Users/jim/src/apps/abiogenesis/.ai-workspace/comments/claude/20260322T210000_REVIEW_live-fp-qualification-results.md) |
| G5 | Agent hallucination loop in F_P convergence | F_D coverage evaluators must prevent agent hallucination during convergence. Without F_D gating, agents can loop producing plausible but wrong output. Safety invariant for production specs. | 4 | 2 | [abiogenesis/gemini/20260322T143000_REVIEW_usecase-validation-requirements-to-uat.md](/Users/jim/src/apps/abiogenesis/.ai-workspace/comments/gemini/20260322T143000_REVIEW_usecase-validation-requirements-to-uat.md) |
| G6 | Multivector design marketplace | Agent comment conventions as market-based convergence: agents propose, critique, reprice confidence. Territory-partitioned multi-agent coordination without locks. Candidate elevation to formal methodology concern. | 4 | 4 | [genesis_sdlc/claude/20260322T180000_STRATEGY_conventions-as-intent-candidate.md](/Users/jim/src/apps/genesis_sdlc/.ai-workspace/comments/claude/20260322T180000_STRATEGY_conventions-as-intent-candidate.md) |
| G7 | v1.0 release lessons: 9-checklist | Kernel must not hardcode domain paths, packages, help text, or bootloader knowledge. Installer must be idempotent, verifiable. Tests must use same code path as production. MCP is core dependency. | 4 | 3 | [abiogenesis/claude/20260323T000000_REVIEW_v1-release-lessons-learned.md](/Users/jim/src/apps/abiogenesis/.ai-workspace/comments/claude/20260323T000000_REVIEW_v1-release-lessons-learned.md) |
| G8 | Five-lens formal pressure test | Category, sheaf, temporal, event calculus, TCP lenses. Multiple lenses fail for the same reason (stale observation surface). Existing ontology can express the fix. Zero new primitives — surgical interventions only. | 5 | 3 | [genesis_sdlc/claude/20260321T160000_SCHEMA_abg-formal-gap-analysis-category-sheaf-temporal-tcp.md](/Users/jim/src/apps/genesis_sdlc/.ai-workspace/comments/claude/20260321T160000_SCHEMA_abg-formal-gap-analysis-category-sheaf-temporal-tcp.md) |

---

## H. Use Cases and Extensibility

Concrete patterns for domain behavior over the substrate.

| # | Idea | Description | Value | Priority | Source |
|---|------|-------------|-------|----------|--------|
| H1 | Gap-triggered context discovery | When a gap is detected, the system discovers additional context assets to inform repair. Engine owns triggering/escalation/provenance; domain defines the gap metric. | 4 | 3 | [abiogenesis/codex/20260326T202830_USECASES_gap-triggered-context-discovery-and-advanced-suite.md](/Users/jim/src/apps/abiogenesis/.ai-workspace/comments/codex/20260326T202830_USECASES_gap-triggered-context-discovery-and-advanced-suite.md) |
| H2 | Six use-case suite | U1 (profiles), U2 (discovery), U3 (consensus review), U4 (parallel harvest), U5 (BPM-sourced), U6 (runtime hydration). Tests whether platform is metric-driven, observable, homeostatic, builder-of-builders. | 4 | 3 | [abiogenesis/codex/20260326T202830_USECASES_gap-triggered-context-discovery-and-advanced-suite.md](/Users/jim/src/apps/abiogenesis/.ai-workspace/comments/codex/20260326T202830_USECASES_gap-triggered-context-discovery-and-advanced-suite.md) |
| H3 | Three-level verifier hierarchy | Lang-specific→regex→F_P fallback evaluator chain with self-extension: adding new tech stack triggers sub-development to produce evaluator. Evaluator library grows organically. | 4 | 4 | [genesis_sdlc/claude/20260316T065500_STRATEGY_traceability-verifier-hierarchy-and-self-extension.md](/Users/jim/src/apps/genesis_sdlc/.ai-workspace/comments/claude/20260316T065500_STRATEGY_traceability-verifier-hierarchy-and-self-extension.md) |
| H4 | Patent landscape: 5 clusters | Convergence gradient, contract-preserving refinement, constitutional evaluator escalation, provenance-carrying selection, operator/evaluator separation. File convergence gradient first as defensive. | 3 | 5 | [abiogenesis/claude/20260331T120000_STRATEGY_patent-landscape-gtl-abg.md](/Users/jim/src/apps/abiogenesis/.ai-workspace/comments/claude/20260331T120000_STRATEGY_patent-landscape-gtl-abg.md) |

---

## Priority 1 Items (Act Now)

These should shape the current ODD development wave directly:

| # | Summary |
|---|---------|
| A1 | World-bearing assets — the central ODD thesis |
| A2 | AssetType as semantic library with evaluation profiles |
| A3 | ODD domain model: 11 first-class objects |
| B1 | Convergence gradient (delta→0) as mathematical foundation |
| B2 | Three-regime escalation (F_D→F_P→F_H) |
| B5 | Operator/evaluator constitutional separation |
| C1 | Monadic composition laws for graph function algebra |
| C4 | Homeostatic ODD programs as unified construct |
| D2 | Dual identity: work_key vs run_id |
| E1 | Custody failure lesson: false convergence from broken traceability |
| E2 | Spec leads, code follows |

---

## Priority 2 Items (Next Wave)

| # | Summary |
|---|---------|
| A4 | Requirements as workspace asset, not pre-declared parameter |
| A6 | Mutable assets as checkpoints over constructive history |
| B3 | Context digest in certification hash (deepest formal gap) |
| B4 | Evaluator multiplicity reframes use cases |
| B6 | Five prime operators from consciousness loop |
| C2 | Contract-preserving refinement (substitute) |
| C3 | Pluggable graph synthesis and selection |
| D1 | Event stream / graph independence |
| D5 | Control plane compiles resolved runtime |
| E3 | ABG as TCP/IP for cognitive load management |
| E5 | Four-territory model |
| E6 | Immutable core vs local spec |
| F1 | DAG topology with priority strategies |
| F3 | ObserverModel and CompositionSet as named concepts |
| G1 | Fix lossy F_P binding: full context documents must reach F_P |
| G2 | Prevent engine/build divergence from day one |
| G5 | F_D evaluators must prevent agent hallucination loop |

---

## Statistics

- **Total distinct ideas catalogued**: 50
- **Value 5 (critical)**: 23
- **Value 4 (high)**: 24
- **Value 3 (moderate)**: 3
- **Priority 1 (act now)**: 11
- **Priority 2 (next wave)**: 17
- **Priority 3–5 (future)**: 22
- **Sources**: genesis_sdlc (22 posts), abiogenesis (18 posts), odd_method (3 posts), cross-validated by gemini (4 posts)
