# T-132 Hello-World Five-Tenant Bootstrap

This start document is the single scenario contract for the hello-world
five-tenant live proof lane.

The product intent is intentionally small: prove that odd_sdlc can start from a
bootstrap document, create a multi-tenant product shape, and produce execution
evidence. The product being built is a hello-world suite containing five
independent build tenants. Each tenant owns one programming language and must
carry its own design, ADR, module, source, and output proof surfaces.

Each generated program must emit the same exact line:

```text
Hello, world!
```

The fixture must not include prebuilt hello-world source, tenant design files,
ADRs, or module files. Each live proof run creates a fresh sandbox from this
document, installs odd_sdlc as the builder, generates the tenant surfaces
through installed traversal, and then executes each generated program.

## Bootstrap Contract

```json scenario_contract
{
  "schemaVersion": "t132.hello_world_five_tenant_suite.v1",
  "scenarioId": "t132_hello_world_five_tenant_suite",
  "product": {
    "name": "hello_world_suite",
    "intent": "Create a minimal multi-tenant generated suite that proves odd_sdlc can build and test executable product artifacts from a bootstrap document.",
    "definition": "hello_world_suite contains five generated build tenants: hello_world_javascript, hello_world_python, hello_world_ruby, hello_world_bash, and hello_world_java. Each tenant owns its own design, ADR, module, source, and execution proof surfaces. Each program writes exactly `Hello, world!` to standard output. The proof is execution evidence, not worker prose.",
    "nonGoals": [
      "framework setup",
      "web service deployment",
      "data_mapper parity",
      "odd_chat operator workflow",
      "multi-hour traversal",
      "prebuilt source files in the fixture",
      "a single flat build_tenants/hello_world_suite tenant"
    ]
  },
  "builderHarness": {
    "builder": "odd_sdlc",
    "purpose": "Build the multi-tenant hello_world_suite from this bootstrap document as a compact live proof.",
    "notRuntimeDependency": true
  },
  "suite": {
    "expectedOutput": "Hello, world!",
    "outputPolicy": "Every generated program must emit the exact expected output after trimming trailing whitespace.",
    "tenantPolicy": "Each language is a separate build tenant. The lane fails if all languages are collapsed into one tenant root.",
    "tenants": [
      {
        "id": "javascript",
        "tenantName": "hello_world_javascript",
        "displayName": "JavaScript",
        "runtime": "node",
        "selectedOutputRoot": "build_tenants/hello_world_javascript",
        "sourceFile": "build_tenants/hello_world_javascript/src/hello.js",
        "moduleDesignFile": "build_tenants/hello_world_javascript/design/modules/hello_world_javascript_module.md",
        "adrFile": "build_tenants/hello_world_javascript/design/adrs/ADR-001-runtime-and-output-contract.md",
        "run": {
          "command": "node",
          "args": ["build_tenants/hello_world_javascript/src/hello.js"]
        }
      },
      {
        "id": "python",
        "tenantName": "hello_world_python",
        "displayName": "Python",
        "runtime": "python3",
        "selectedOutputRoot": "build_tenants/hello_world_python",
        "sourceFile": "build_tenants/hello_world_python/src/hello.py",
        "moduleDesignFile": "build_tenants/hello_world_python/design/modules/hello_world_python_module.md",
        "adrFile": "build_tenants/hello_world_python/design/adrs/ADR-001-runtime-and-output-contract.md",
        "run": {
          "command": "python3",
          "args": ["build_tenants/hello_world_python/src/hello.py"]
        }
      },
      {
        "id": "ruby",
        "tenantName": "hello_world_ruby",
        "displayName": "Ruby",
        "runtime": "ruby",
        "selectedOutputRoot": "build_tenants/hello_world_ruby",
        "sourceFile": "build_tenants/hello_world_ruby/src/hello.rb",
        "moduleDesignFile": "build_tenants/hello_world_ruby/design/modules/hello_world_ruby_module.md",
        "adrFile": "build_tenants/hello_world_ruby/design/adrs/ADR-001-runtime-and-output-contract.md",
        "run": {
          "command": "ruby",
          "args": ["build_tenants/hello_world_ruby/src/hello.rb"]
        }
      },
      {
        "id": "bash",
        "tenantName": "hello_world_bash",
        "displayName": "Bash",
        "runtime": "bash",
        "selectedOutputRoot": "build_tenants/hello_world_bash",
        "sourceFile": "build_tenants/hello_world_bash/src/hello.sh",
        "moduleDesignFile": "build_tenants/hello_world_bash/design/modules/hello_world_bash_module.md",
        "adrFile": "build_tenants/hello_world_bash/design/adrs/ADR-001-runtime-and-output-contract.md",
        "run": {
          "command": "bash",
          "args": ["build_tenants/hello_world_bash/src/hello.sh"]
        }
      },
      {
        "id": "java",
        "tenantName": "hello_world_java",
        "displayName": "Java",
        "runtime": "java",
        "compiler": "javac",
        "selectedOutputRoot": "build_tenants/hello_world_java",
        "sourceFile": "build_tenants/hello_world_java/src/HelloWorld.java",
        "moduleDesignFile": "build_tenants/hello_world_java/design/modules/hello_world_java_module.md",
        "adrFile": "build_tenants/hello_world_java/design/adrs/ADR-001-runtime-and-output-contract.md",
        "run": {
          "compileCommand": "javac",
          "compileArgs": ["HelloWorld.java"],
          "compileCwd": "build_tenants/hello_world_java/src",
          "command": "java",
          "args": ["HelloWorld"],
          "cwd": "build_tenants/hello_world_java/src"
        }
      }
    ]
  },
  "sandbox": {
    "workspaceSlug": "t132_hello_world_five_tenants_workspace",
    "installOddSdlc": true,
    "requiresCleanWorkspace": true,
    "expectedBootstrapPath": ".ai-workspace/context/project_bootstrap.md",
    "expectedRuntimeRoot": ".ai-workspace/runtime/odd_sdlc",
    "expectedTransformAssetRoot": ".ai-workspace/runtime/odd_sdlc/assets",
    "expectedOperatorRunRoot": ".ai-workspace/runtime/odd_sdlc/operator-runs",
    "runtimeAssetPolicy": "SDLC transform artifacts are admitted under expectedTransformAssetRoot by default. Product realization files are materialized under each tenant selectedOutputRoot only when the traversal reaches product materialization."
  },
  "lifecycleGraph": {
    "role": "odd_sdlc_builder_test_graph",
    "moduleName": "hello_world_five_tenant_lifecycle",
    "graphFunction": "build_hello_world_five_tenant_suite",
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
        "id": "asset:suite_contract",
        "assetType": "requirements_surface",
        "description": "Five-tenant hello-world suite requirements, tenant roots, and expected output contract."
      },
      {
        "id": "asset:tenant_designs",
        "assetType": "design_surface",
        "description": "Per-tenant design, ADR, and module surfaces."
      },
      {
        "id": "asset:implementation",
        "assetType": "implementation_surface",
        "description": "Generated source files for all five tenants."
      },
      {
        "id": "asset:test_execution",
        "assetType": "test_execution_surface",
        "description": "Process execution evidence for all generated tenant programs."
      },
      {
        "id": "asset:release_readiness",
        "assetType": "release_readiness_surface",
        "description": "Projection over admitted tenant design, implementation, and output evidence."
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
        "id": "vector:derive_suite_contract",
        "name": "derive_hello_world_suite_contract",
        "source": ["asset:start_document", "asset:installed_odd_sdlc"],
        "target": "asset:suite_contract"
      },
      {
        "id": "vector:derive_tenant_designs",
        "name": "derive_hello_world_tenant_designs",
        "source": ["asset:suite_contract"],
        "target": "asset:tenant_designs"
      },
      {
        "id": "vector:build_implementation",
        "name": "build_hello_world_five_tenant_suite",
        "source": ["asset:tenant_designs"],
        "target": "asset:implementation"
      },
      {
        "id": "vector:execute_suite",
        "name": "execute_hello_world_five_tenant_suite",
        "source": ["asset:implementation"],
        "target": "asset:test_execution"
      },
      {
        "id": "vector:project_release",
        "name": "project_hello_world_release_readiness",
        "source": ["asset:test_execution"],
        "target": "asset:release_readiness"
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
      "id": "action:derive_suite_contract",
      "vector": "vector:derive_suite_contract",
      "graphFunction": "derive_hello_world_suite_contract",
      "humanDecision": "continue",
      "expectedCarrier": "schema://odd_sdlc/requirements_surface",
      "donePredicate": "suite contract names five build tenants, exact expected output, and source/design/ADR file paths",
      "retryAction": "action:repair_suite_contract"
    },
    {
      "id": "action:derive_tenant_designs",
      "vector": "vector:derive_tenant_designs",
      "graphFunction": "derive_hello_world_tenant_designs",
      "humanDecision": "continue",
      "expectedCarrier": "schema://odd_sdlc/design_surface",
      "donePredicate": "each tenant has a design module file and ADR file",
      "retryAction": "action:repair_tenant_designs"
    },
    {
      "id": "action:build_implementation",
      "vector": "vector:build_implementation",
      "graphFunction": "build_hello_world_five_tenant_suite",
      "humanDecision": "continue",
      "expectedCarrier": "schema://odd_sdlc/implementation_surface",
      "donePredicate": "all five tenant source files exist under separate build_tenants roots",
      "retryAction": "action:repair_implementation"
    },
    {
      "id": "action:execute_suite",
      "vector": "vector:execute_suite",
      "graphFunction": "execute_hello_world_five_tenant_suite",
      "humanDecision": "continue",
      "expectedCarrier": "schema://odd_sdlc/test_execution_surface",
      "donePredicate": "JavaScript, Python, Ruby, Bash, and Java executions all emit Hello, world!",
      "retryAction": "action:repair_test_execution"
    },
    {
      "id": "action:project_release",
      "vector": "vector:project_release",
      "graphFunction": "project_hello_world_release_readiness",
      "humanDecision": "review",
      "expectedCarrier": "schema://odd_sdlc/release_readiness_surface",
      "donePredicate": "release readiness references per-tenant design files, ADRs, generated files, and execution output evidence",
      "retryAction": "action:repair_release_projection"
    }
  ],
  "expectedFiles": [
    "build_tenants/hello_world_javascript/design/modules/hello_world_javascript_module.md",
    "build_tenants/hello_world_javascript/design/adrs/ADR-001-runtime-and-output-contract.md",
    "build_tenants/hello_world_javascript/src/hello.js",
    "build_tenants/hello_world_python/design/modules/hello_world_python_module.md",
    "build_tenants/hello_world_python/design/adrs/ADR-001-runtime-and-output-contract.md",
    "build_tenants/hello_world_python/src/hello.py",
    "build_tenants/hello_world_ruby/design/modules/hello_world_ruby_module.md",
    "build_tenants/hello_world_ruby/design/adrs/ADR-001-runtime-and-output-contract.md",
    "build_tenants/hello_world_ruby/src/hello.rb",
    "build_tenants/hello_world_bash/design/modules/hello_world_bash_module.md",
    "build_tenants/hello_world_bash/design/adrs/ADR-001-runtime-and-output-contract.md",
    "build_tenants/hello_world_bash/src/hello.sh",
    "build_tenants/hello_world_java/design/modules/hello_world_java_module.md",
    "build_tenants/hello_world_java/design/adrs/ADR-001-runtime-and-output-contract.md",
    "build_tenants/hello_world_java/src/HelloWorld.java"
  ],
  "commands": {
    "installOddSdlc": [
      "odd-sdlc-ts install --target <workspace> --package-source <odd_sdlc_source>"
    ],
    "buildSuite": [
      "odd-sdlc-ts gaps --workspace <workspace>",
      "odd-sdlc-ts start --workspace <workspace> --target graph_function:bootstrap_release_self_test --until first_traversal"
    ],
    "testSuite": [
      "node build_tenants/hello_world_javascript/src/hello.js",
      "python3 build_tenants/hello_world_python/src/hello.py",
      "ruby build_tenants/hello_world_ruby/src/hello.rb",
      "bash build_tenants/hello_world_bash/src/hello.sh",
      "cd build_tenants/hello_world_java/src && javac HelloWorld.java && java HelloWorld"
    ]
  },
  "acceptanceCriteria": [
    "The sandbox workspace is created from this start document.",
    "odd_sdlc is installed into the sandbox workspace.",
    "The generated suite contains exactly five build tenant roots.",
    "Each build tenant contains its own design module file and ADR file.",
    "Each build tenant contains one generated language source file.",
    "Each generated source file is executable by its declared runtime or compiler/runtime pair.",
    "Each execution emits exactly `Hello, world!` after trimming trailing whitespace.",
    "The test archive contains process records and stdout/stderr captures for every language.",
    "Release-readiness projection is based on per-tenant design, ADR, generated source, and process output evidence, not worker narrative."
  ]
}
```
