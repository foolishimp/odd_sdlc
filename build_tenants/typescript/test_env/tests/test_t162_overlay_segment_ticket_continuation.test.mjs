// Validates: T-162

import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

import {
  admitSdlcTicketExecutionContract,
  assertTraversalIntentPackagePressure,
  conformProjectProfileFromConstraintsText,
  deriveWorkerHandoffManifest,
  hookContractByEdgeName,
  projectSdlcTicketWorkflow
} from "../../build/semantic/code/src/index.js";

function workspace() {
  const root = mkdtempSync(join(tmpdir(), "odd-sdlc-t162-overlay-"));
  mkdirSync(join(root, ".ai-workspace", "tickets", "active"), {
    recursive: true
  });
  return root;
}

function conformedProject(root) {
  return conformProjectProfileFromConstraintsText({
    workspaceRoot: root,
    constraintsText: [
      "project:",
      "  name: t162",
      "  selected_output_root: build_tenants/typescript",
      "  ambiguity_risk_appetite: medium",
      "build_tenants:",
      "  typescript:",
      "    output_dir: build_tenants/typescript",
      "    capability_contracts:",
      "      - transport_contract"
    ].join("\n")
  });
}

test("T-162 overlay segment residual pressure admits as ticket continuation and handoff context", () => {
  const root = workspace();
  writeFileSync(
    join(root, ".ai-workspace", "tickets", "active", "T-162.md"),
    `---
id: T-162
title: Overlay continuation ticket
type: feature
ticket_category: implementation
status: active
goal: governed-work
change_intent: preserve overlay residual pressure
change_class: design_reframe
re_entry_point: design
triaged_at: 2026-06-14
created_at: 2026-06-14
updated_at: 2026-06-14
target_truth: overlay residual pressure becomes ticket intake
closure_law: continuation must be ruled before product convergence
evaluation_criteria:
  - continuation proof
non_closure_conditions:
  - productConverged false without ticket row
source_documents:
  - specification/PRODUCT.md
source_overlay_segment_completion_ref: sdlc-overlay-segment-completion://run/final
terminal_graph_function_refs:
  - graph-function://odd-sdlc/final_code_review
terminal_asset_refs:
  - asset://odd-sdlc/review-report
remaining_graph_pressure_refs:
  - pressure://graph/current-full-traversal
remaining_requirement_pressure_refs:
  - pressure://requirement/T-162
remaining_asset_pressure_refs:
  - pressure://asset/review
next_eligible_overlay_refs:
  - overlay://odd-sdlc/current-full-traversal
overlay_continuation_ruling: depth_traversal
overlay_continuation_proof_expectation: route through ticket start
---

# T-162
`,
    "utf8"
  );

  const contract = admitSdlcTicketExecutionContract({
    workflow: projectSdlcTicketWorkflow({ workspaceRoot: root }),
    ticketId: "T-162"
  });
  const continuation = contract.overlayContinuationRows[0];
  assert.equal(continuation.productConverged, false);
  assert.equal(
    continuation.selectedStartTargetRef,
    "overlay://odd-sdlc/current-full-traversal"
  );
  assert.deepStrictEqual(continuation.remainingGraphPressureRefs, [
    "pressure://graph/current-full-traversal"
  ]);
  assert.deepStrictEqual(contract.overlayContinuationRefs, [
    continuation.continuationRef
  ]);

  const manifest = deriveWorkerHandoffManifest({
    workspaceRoot: root,
    ticketExecutionContract: contract,
    graphFunctionName: "route_ticket_work_item",
    edgeName: "route_ticket_work_item",
    vectorIndex: 0,
    contract: hookContractByEdgeName("route_ticket_work_item"),
    conformedProject: conformedProject(root),
    runId: "t162-ticket-handoff"
  });
  assert.equal(manifest.ticketExecutionContract?.ticketId, "T-162");
  assert.equal(
    manifest.traversalIntentPackage.ticketExecutionContract?.executionContractRef,
    contract.executionContractRef
  );
  assertTraversalIntentPackagePressure(manifest);
});

test("T-162 overlay continuation blocks when remaining pressure is unruled", () => {
  const root = workspace();
  writeFileSync(
    join(root, ".ai-workspace", "tickets", "active", "T-300.md"),
    `---
id: T-300
title: Unruled overlay continuation
type: feature
ticket_category: implementation
status: active
goal: governed-work
change_intent: preserve overlay residual pressure
change_class: design_reframe
re_entry_point: design
triaged_at: 2026-06-14
created_at: 2026-06-14
updated_at: 2026-06-14
target_truth: overlay residual pressure becomes ticket intake
closure_law: continuation must be ruled before product convergence
evaluation_criteria:
  - continuation proof
non_closure_conditions:
  - productConverged false without ticket row
source_documents:
  - specification/PRODUCT.md
source_overlay_segment_completion_ref: sdlc-overlay-segment-completion://run/final
remaining_graph_pressure_refs:
  - pressure://graph/current-full-traversal
next_eligible_overlay_refs:
  - overlay://odd-sdlc/current-full-traversal
---

# T-300
`,
    "utf8"
  );
  assert.throws(
    () =>
      admitSdlcTicketExecutionContract({
        workflow: projectSdlcTicketWorkflow({ workspaceRoot: root }),
        ticketId: "T-300"
      }),
    /unadmitted/
  );
});
