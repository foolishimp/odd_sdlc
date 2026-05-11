# T-132 Hello-World Single-Tenant Bootstrap

This start document is the single scenario contract for the current
hello-world live proof lane.

The product intent is intentionally small: prove that odd_sdlc can start from a
bootstrap document, create one build tenant, materialize one executable product
file through installed traversal, and prove it by running the generated program.

The previous five-tenant suite exposed a real fan-out gap: the current
materialization action is selected for one output root at a time. Multi-tenant
fan-out is therefore a separate backlog feature. This T-132 lane is the current
single-tenant executable proof.

The generated program must emit the same exact line:

```text
Hello, world!
```

The fixture must not include prebuilt hello-world source. Each live proof run
creates a fresh sandbox from this document, installs odd_sdlc as the builder,
generates the tenant source through installed traversal, and executes it.

## Bootstrap Contract

```json scenario_contract
{
  "schemaVersion": "t132.hello_world_single_tenant.v1",
  "scenarioId": "t132_hello_world_single_tenant",
  "product": {
    "name": "hello_world_javascript_single_tenant",
    "intent": "Create one minimal generated JavaScript build tenant that proves odd_sdlc can materialize and test an executable product artifact from a bootstrap document.",
    "definition": "hello_world_javascript_single_tenant contains one generated build tenant: hello_world_javascript. The tenant owns one source file at build_tenants/hello_world_javascript/src/hello.js. The program writes exactly `Hello, world!` to standard output. The proof is execution evidence, not worker prose.",
    "nonGoals": [
      "multi-tenant fan-out",
      "framework setup",
      "web service deployment",
      "data_mapper parity",
      "odd_chat operator workflow",
      "multi-hour traversal",
      "prebuilt source files in the fixture",
      "per-tenant design and ADR proof"
    ]
  },
  "builderHarness": {
    "builder": "odd_sdlc",
    "purpose": "Build the single-tenant hello-world product from this bootstrap document as the current compact live proof.",
    "notRuntimeDependency": true
  },
  "authorityInput": {
    "kind": "source_file",
    "path": "bootstrap.md",
    "graphFunction": "Fg_conform_project_authority"
  },
  "expectedOutput": "Hello, world!",
  "tenant": {
    "id": "javascript",
    "tenantName": "hello_world_javascript",
    "displayName": "JavaScript",
    "runtime": "node",
    "selectedOutputRoot": "build_tenants/hello_world_javascript",
    "sourceFile": "build_tenants/hello_world_javascript/src/hello.js",
    "run": {
      "command": "node",
      "args": ["build_tenants/hello_world_javascript/src/hello.js"]
    }
  },
  "sandbox": {
    "workspaceSlug": "t132_hello_world_single_tenant_workspace",
    "installOddSdlc": true,
    "requiresCleanWorkspace": true,
    "expectedBootstrapPath": ".ai-workspace/context/project_bootstrap.md",
    "expectedRuntimeRoot": ".ai-workspace/runtime/odd_sdlc",
    "expectedTransformAssetRoot": ".ai-workspace/runtime/odd_sdlc/assets",
    "expectedOperatorRunRoot": ".ai-workspace/runtime/odd_sdlc/operator-runs",
    "runtimeAssetPolicy": "SDLC transform artifacts are admitted under expectedTransformAssetRoot by default. Product realization files are materialized under the selected tenant output root only when traversal reaches product materialization."
  },
  "lifecycleGraph": {
    "role": "odd_sdlc_builder_test_graph",
    "moduleName": "hello_world_single_tenant_lifecycle",
    "graphFunction": "build_hello_world_javascript_single_tenant",
    "nodes": [
      {
        "id": "asset:start_document",
        "assetType": "start_document_surface",
        "description": "This bootstrap document."
      },
      {
        "id": "asset:sandbox_workspace",
        "assetType": "sandbox_workspace_surface",
        "description": "Fresh workspace prepared from the bootstrap document."
      },
      {
        "id": "asset:installed_odd_sdlc",
        "assetType": "installed_odd_sdlc_surface",
        "description": "Installed odd_sdlc command path inside the sandbox."
      },
      {
        "id": "asset:product_contract",
        "assetType": "requirements_surface",
        "description": "Single-tenant hello-world requirement, tenant root, and expected output contract."
      },
      {
        "id": "asset:implementation",
        "assetType": "implementation_surface",
        "description": "Generated JavaScript source file."
      },
      {
        "id": "asset:test_execution",
        "assetType": "test_execution_surface",
        "description": "Process execution evidence for the generated program."
      }
    ],
    "vectors": [
      {
        "id": "vector:setup_sandbox",
        "name": "setup_hello_world_sandbox",
        "source": ["asset:start_document"],
        "target": "asset:sandbox_workspace"
      },
      {
        "id": "vector:install_odd_sdlc",
        "name": "install_odd_sdlc_runtime",
        "source": ["asset:sandbox_workspace"],
        "target": "asset:installed_odd_sdlc"
      },
      {
        "id": "vector:derive_product_contract",
        "name": "derive_hello_world_product_contract",
        "source": ["asset:start_document", "asset:installed_odd_sdlc"],
        "target": "asset:product_contract"
      },
      {
        "id": "vector:build_implementation",
        "name": "build_hello_world_javascript_single_tenant",
        "source": ["asset:product_contract"],
        "target": "asset:implementation"
      },
      {
        "id": "vector:execute_product",
        "name": "execute_hello_world_javascript_single_tenant",
        "source": ["asset:implementation"],
        "target": "asset:test_execution"
      }
    ]
  },
  "lawfulActions": [
    {
      "id": "action:setup_sandbox",
      "vector": "vector:setup_sandbox",
      "graphFunction": "setup_hello_world_sandbox",
      "humanDecision": "continue",
      "expectedCarrier": "schema://odd_sdlc/t132/sandbox_workspace_surface",
      "donePredicate": "sandbox workspace exists and contains this bootstrap as authority",
      "retryAction": "action:repair_sandbox_setup"
    },
    {
      "id": "action:install_odd_sdlc",
      "vector": "vector:install_odd_sdlc",
      "graphFunction": "install_odd_sdlc_runtime",
      "humanDecision": "continue",
      "expectedCarrier": "schema://odd_sdlc/t132/installed_odd_sdlc_surface",
      "donePredicate": "node_modules/.bin/odd-sdlc-ts exists and gaps can run",
      "retryAction": "action:repair_odd_sdlc_install"
    },
    {
      "id": "action:derive_product_contract",
      "vector": "vector:derive_product_contract",
      "graphFunction": "derive_hello_world_product_contract",
      "humanDecision": "continue",
      "expectedCarrier": "schema://odd_sdlc/requirements_surface",
      "donePredicate": "contract names one build tenant, exact expected output, and source file path",
      "retryAction": "action:repair_product_contract"
    },
    {
      "id": "action:build_implementation",
      "vector": "vector:build_implementation",
      "graphFunction": "build_hello_world_javascript_single_tenant",
      "humanDecision": "continue",
      "expectedCarrier": "schema://odd_sdlc/implementation_surface",
      "donePredicate": "the tenant source file exists under the selected build_tenants root",
      "retryAction": "action:repair_implementation"
    },
    {
      "id": "action:execute_product",
      "vector": "vector:execute_product",
      "graphFunction": "execute_hello_world_javascript_single_tenant",
      "humanDecision": "continue",
      "expectedCarrier": "schema://odd_sdlc/test_execution_surface",
      "donePredicate": "JavaScript execution emits Hello, world!",
      "retryAction": "action:repair_test_execution"
    }
  ],
  "expectedFiles": [
    "build_tenants/hello_world_javascript/src/hello.js"
  ],
  "expectedRequirementIds": [
    "REQ-T132-001",
    "REQ-T132-002",
    "REQ-T132-003",
    "REQ-T132-004",
    "REQ-T132-005"
  ],
  "requirements": [
    {
      "id": "REQ-T132-001",
      "title": "Single JavaScript product tenant",
      "text": "hello_world_javascript_single_tenant contains exactly one generated product tenant for this proof lane."
    },
    {
      "id": "REQ-T132-002",
      "title": "Node runtime tenant",
      "text": "The generated tenant is named hello_world_javascript, uses the Node runtime, and is rooted at build_tenants/hello_world_javascript."
    },
    {
      "id": "REQ-T132-003",
      "title": "Declared JavaScript source file",
      "text": "Product materialization writes the declared source file build_tenants/hello_world_javascript/src/hello.js and does not use a prebuilt fixture source file."
    },
    {
      "id": "REQ-T132-004",
      "title": "Exact stdout contract",
      "text": "Running the generated JavaScript program emits exactly Hello, world! after trimming trailing whitespace."
    },
    {
      "id": "REQ-T132-005",
      "title": "Declared execution command",
      "text": "The product proof runs node build_tenants/hello_world_javascript/src/hello.js and records process evidence for that command."
    }
  ],
  "commands": {
    "installOddSdlc": [
      "odd-sdlc-ts install --target <workspace> --package-source <odd_sdlc_source>"
    ],
    "conformProjectAuthority": [
      "odd-sdlc-ts start --workspace <workspace> --target graph_function:Fg_conform_project_authority --until first_traversal"
    ],
    "buildProduct": [
      "odd-sdlc-ts gaps --workspace <workspace>",
      "odd-sdlc-ts start --workspace <workspace> --target asset:component_code_surface --until first_traversal"
    ],
    "testProduct": [
      "node build_tenants/hello_world_javascript/src/hello.js"
    ]
  },
  "acceptanceCriteria": [
    "The sandbox workspace is created from this start document.",
    "odd_sdlc is installed into the sandbox workspace.",
    "The generated product contains exactly one build tenant root.",
    "The build tenant contains one generated JavaScript source file.",
    "The generated source file is executable by its declared runtime.",
    "The execution emits exactly `Hello, world!` after trimming trailing whitespace.",
    "Generated requirement authority preserves every keyed requirement identifier declared by this bootstrap.",
    "The test archive contains process records and stdout/stderr captures.",
    "Completion is based on the selected tenant source file and execution output evidence, not worker narrative."
  ]
}
```
