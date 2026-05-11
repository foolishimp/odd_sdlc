import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

function fileRef(filePath) {
  return pathToFileURL(filePath).href;
}

function readTextIfExists(filePath) {
  if (!existsSync(filePath)) {
    return null;
  }
  return readFileSync(filePath, "utf8");
}

function containsAll(text, values) {
  return values.every((value) => typeof value === "string" && value.length > 0 && text.includes(value));
}

function containsOneOf(text, values) {
  return values.some((value) => typeof value === "string" && value.length > 0 && text.includes(value));
}

function row(input) {
  return {
    obligationId: input.obligationId,
    status: input.passed ? "fulfilled" : "open_gap",
    summary: input.summary,
    expected: input.expected ?? [],
    observed: input.observed ?? [],
    evidenceRefs: input.evidenceRefs ?? []
  };
}

function requirementFiles(workspace) {
  const requirementDir = path.join(workspace, "specification/requirements");
  if (!existsSync(requirementDir)) {
    return [];
  }
  return readdirSync(requirementDir)
    .filter((entry) => entry.endsWith(".md"))
    .sort()
    .map((entry) => path.join("specification/requirements", entry));
}

function authoritySurface(workspace) {
  const fixedAuthorityFiles = [
    ".ai-workspace/context/project_bootstrap.md",
    "specification/INTENT.md",
    "specification/PRODUCT.md",
    "specification/GOALS.md"
  ];
  const files = [...fixedAuthorityFiles, ...requirementFiles(workspace)];
  const texts = files.map((relativePath) => ({
    relativePath,
    absolutePath: path.join(workspace, relativePath),
    text: readTextIfExists(path.join(workspace, relativePath))
  }));
  return {
    fixedAuthorityFiles,
    files,
    texts,
    text: texts.map((entry) => entry.text ?? "").join("\n")
  };
}

export function evaluateHelloWorldAuthorityConformance(input) {
  const surface = authoritySurface(input.workspace);
  const productText =
    readTextIfExists(path.join(input.workspace, "specification/PRODUCT.md")) ?? "";
  const intentText =
    readTextIfExists(path.join(input.workspace, "specification/INTENT.md")) ?? "";
  const requirementFileRefs = requirementFiles(input.workspace).map((relativePath) =>
    fileRef(path.join(input.workspace, relativePath))
  );
  const authorityFileRefs = surface.files
    .filter((relativePath) => existsSync(path.join(input.workspace, relativePath)))
    .map((relativePath) => fileRef(path.join(input.workspace, relativePath)));
  const tenant = input.contract.tenant;
  const expectedRunTokens = [
    tenant.run.command,
    ...(tenant.run.args ?? []),
    tenant.run.cwd ?? null
  ].filter((value) => typeof value === "string" && value.length > 0);
  const expectedRequirementIds = input.expectedRequirementIds ?? [];
  const materializationAnchors =
    input.materializationAnchors ?? [
      "product edge",
      "downstream traversal",
      "downstream product traversal",
      "product materialization",
      "later materialize",
      "materialize one executable product file"
    ];
  const executionAnchors =
    input.executionAnchors ?? [
      "process execution",
      "execution proof",
      "execution evidence",
      "execution output evidence",
      "running the generated program",
      "executing the generated program"
    ];
  const exactIdentityValues = [
    input.contract.product.name,
    tenant.tenantName,
    tenant.selectedOutputRoot
  ];
  const expectedFileValues = input.contract.expectedFiles ?? [];
  const rows = [
    row({
      obligationId: `${input.scenarioId}:authority_surface_files`,
      passed:
        surface.fixedAuthorityFiles.every((relativePath) =>
          existsSync(path.join(input.workspace, relativePath))
        ) && requirementFileRefs.length > 0,
      summary: "Authority conformance materialized the required live authority files.",
      expected: [...surface.fixedAuthorityFiles, "specification/requirements/*.md"],
      observed: surface.files,
      evidenceRefs: authorityFileRefs
    }),
    row({
      obligationId: `${input.scenarioId}:intent_authority`,
      passed:
        containsAll(intentText, ["bootstrap", "document", "odd_sdlc"]) &&
        containsAll(intentText, input.languageAnchors ?? []),
      summary: "INTENT.md carries the bootstrap source and live tenant language authority.",
      expected: ["bootstrap", "document", "odd_sdlc", ...(input.languageAnchors ?? [])],
      observed: [intentText],
      evidenceRefs: [fileRef(path.join(input.workspace, "specification/INTENT.md"))]
    }),
    row({
      obligationId: `${input.scenarioId}:exact_product_and_tenant_identity`,
      passed: containsAll(surface.text, exactIdentityValues),
      summary: "The live authority names the exact scenario product, tenant, and output root.",
      expected: exactIdentityValues,
      observed: surface.files,
      evidenceRefs: authorityFileRefs
    }),
    row({
      obligationId: `${input.scenarioId}:product_surface_contract`,
      passed:
        containsAll(productText, [
          input.contract.product.name,
          tenant.tenantName,
          input.contract.expectedOutput
        ]) && containsAll(productText, expectedFileValues),
      summary: "PRODUCT.md carries the exact product identity, output contract, and product files.",
      expected: [
        input.contract.product.name,
        tenant.tenantName,
        input.contract.expectedOutput,
        ...expectedFileValues
      ],
      observed: [productText],
      evidenceRefs: [fileRef(path.join(input.workspace, "specification/PRODUCT.md"))]
    }),
    row({
      obligationId: `${input.scenarioId}:requirements_bind_product_contract`,
      passed:
        requirementFileRefs.length > 0 &&
        containsAll(surface.text, [
          tenant.tenantName,
          input.contract.expectedOutput,
          ...expectedFileValues,
          ...expectedRunTokens
        ]),
      summary: "Requirement authority binds the exact file, output, and command tokens.",
      expected: [
        tenant.tenantName,
        input.contract.expectedOutput,
        ...expectedFileValues,
        ...expectedRunTokens
      ],
      observed: surface.files,
      evidenceRefs: requirementFileRefs
    }),
    row({
      obligationId: `${input.scenarioId}:materialization_and_execution_pressure`,
      passed: containsOneOf(surface.text, materializationAnchors) && containsOneOf(surface.text, executionAnchors),
      summary: "Authority preserves downstream product materialization and execution proof pressure.",
      expected: [...materializationAnchors, ...executionAnchors],
      observed: surface.files,
      evidenceRefs: authorityFileRefs
    }),
    row({
      obligationId: `${input.scenarioId}:conformance_graph_function_lineage`,
      passed: containsAll(surface.text, [input.conformanceGraphFunction]),
      summary: "Conformed authority cites the graph function that produced it.",
      expected: [input.conformanceGraphFunction],
      observed: surface.files,
      evidenceRefs: authorityFileRefs
    })
  ];

  if (expectedRequirementIds.length > 0) {
    rows.push(
      row({
        obligationId: `${input.scenarioId}:expected_requirement_authorities`,
        passed: containsAll(surface.text, expectedRequirementIds),
        summary: "Generated requirement authority carries every scenario-declared requirement id.",
        expected: expectedRequirementIds,
        observed: surface.files,
        evidenceRefs: requirementFileRefs
      })
    );
  }

  const edgeConverged = rows.every((entry) => entry.status === "fulfilled");
  return {
    kind: "odd_sdlc_hello_world_live_authority_validation",
    validationVersion: "ts-live-hello-world-authority-v1",
    validationRegime: "live_generated_workspace_eval",
    scenarioId: input.scenarioId,
    workspace: input.workspace,
    evaluatorRef:
      "test_env/live/hello_world_live_validation.mjs#evaluateHelloWorldAuthorityConformance",
    verdict: edgeConverged ? "passed" : "failed",
    edgeConverged,
    lawfulNextAction: edgeConverged ? "close" : "retry_same_edge",
    rows
  };
}

export function evaluateHelloWorldProductExecution(input) {
  const expectedFiles = input.contract.expectedFiles ?? [];
  const presentFiles = input.terminalState.expectedFiles
    .filter((entry) => entry.exists)
    .map((entry) => entry.relativePath);
  const tenant = input.contract.tenant;
  const rows = [
    row({
      obligationId: `${input.scenarioId}:expected_product_files_present`,
      passed: input.terminalState.expectedFilesPresent === true,
      summary: "Live materialization produced every scenario-declared product file.",
      expected: expectedFiles,
      observed: presentFiles
    }),
    row({
      obligationId: `${input.scenarioId}:tenant_process_exits_zero`,
      passed: input.tenantProof.status === 0,
      summary: "The generated tenant command executed successfully.",
      expected: [tenant.run.command, ...(tenant.run.args ?? [])],
      observed: [String(input.tenantProof.status)]
    }),
    row({
      obligationId: `${input.scenarioId}:tenant_stdout_matches_contract`,
      passed: input.tenantProof.stdout === input.contract.expectedOutput,
      summary: "The generated tenant stdout matches the scenario contract exactly.",
      expected: [input.contract.expectedOutput],
      observed: [input.tenantProof.stdout]
    })
  ];
  const edgeConverged = rows.every((entry) => entry.status === "fulfilled");
  return {
    kind: "odd_sdlc_hello_world_live_product_execution_validation",
    validationVersion: "ts-live-hello-world-product-v1",
    validationRegime: "live_process_execution_eval",
    scenarioId: input.scenarioId,
    workspace: input.workspace,
    evaluatorRef:
      "test_env/live/hello_world_live_validation.mjs#evaluateHelloWorldProductExecution",
    verdict: edgeConverged ? "passed" : "failed",
    edgeConverged,
    lawfulNextAction: edgeConverged ? "close" : "retry_same_edge",
    rows
  };
}
