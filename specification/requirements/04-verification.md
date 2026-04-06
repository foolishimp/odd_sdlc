# Verification Requirements

**Family**: REQ-F-VERIFY-*
**Status**: Active
**Category**: Verification

This family defines the proving obligations for the new `odd_method` line.

### REQ-F-VERIFY-001 — Every live requirement has written testcase authority

No live `odd_method` requirement is fully proved by ambient confidence or unlabeled
tests alone.

**Acceptance Criteria**:
- AC-1: every live requirement maps to written testcase authority
- AC-2: testcase authority is inspectable without relying on chat history
- AC-3: missing testcase authority leaves the requirement open

### REQ-F-VERIFY-002 — Capability claims are proved through scenario bundles and significant paths

Capability claims require scenario bundles or equivalent ordered testcase sets
that declare and exercise the significant paths for the behavior being claimed.

**Acceptance Criteria**:
- AC-1: each capability claim identifies meaningful success, failure, boundary,
  and recovery or replay paths where relevant
- AC-2: scenario bundles name the expected outcomes at significant steps
- AC-3: undeclared or unexercised significant paths leave the claim unproved

### REQ-F-VERIFY-003 — Installed-dev proof is the decisive proving lane

Where `odd_method` has an installable or runnable development form, the decisive
proof runs against the installed development artifact through the same runtime
surfaces the real product uses.

**Acceptance Criteria**:
- AC-1: decisive proof prefers an isolated environment
- AC-2: proof runs through the declared entry, control, and runtime surfaces
- AC-3: direct source-level checks do not replace installed-dev proof
- AC-4: where a proving lane resets and reruns an installed sandbox, per-run
  post-mortem artifacts are retained for later comparison

### REQ-F-VERIFY-004 — The first proving lane exercises the first constructive edge under substrate fact truth

The first proving lane must demonstrate that the first constructive edge can
progress or fail while preserving complete substrate fact truth and lawful
next-step interpretation.

**Acceptance Criteria**:
- AC-1: the proving lane identifies the first constructive edge explicitly
- AC-2: success and failure both remain explainable from emitted substrate facts
- AC-3: downstream interpretation can distinguish system-failure pressure from
  unresolved outcome pressure
