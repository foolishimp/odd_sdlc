// Validates: T-184

import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const PACKAGE_ROOT = process.cwd();
const REPO_ROOT = path.resolve(PACKAGE_ROOT, "../..");

function readRepoFile(relativePath) {
  return readFileSync(path.join(REPO_ROOT, relativePath), "utf8");
}

function walkTsFiles(root) {
  const files = [];
  for (const entry of readdirSync(root)) {
    const absolutePath = path.join(root, entry);
    const stat = statSync(absolutePath);
    if (stat.isDirectory()) {
      files.push(...walkTsFiles(absolutePath));
      continue;
    }
    if (absolutePath.endsWith(".ts")) {
      files.push(absolutePath);
    }
  }
  return files;
}

test("T-184 removes handoff.ts as a public operator surface", () => {
  assert.equal(
    existsSync(path.join(REPO_ROOT, "build_tenants/typescript/code/src/operator/handoff.ts")),
    false,
    "handoff.ts must not remain as an owning module"
  );

  const operatorSourceRoot = path.join(
    REPO_ROOT,
    "build_tenants/typescript/code/src/operator"
  );
  for (const filePath of walkTsFiles(operatorSourceRoot)) {
    const source = readFileSync(filePath, "utf8");
    assert.doesNotMatch(source, /from "\.\/handoff\.js"/u, filePath);
    assert.doesNotMatch(source, /from "\.\.\/handoff\.js"/u, filePath);
    assert.doesNotMatch(source, /writeOperatorArchiveFile/u, filePath);
    assert.doesNotMatch(source, /\bwriteFileSync\b/u, filePath);
    assert.doesNotMatch(source, /\bappendFileSync\b/u, filePath);
    assert.doesNotMatch(source, /\bcreateWriteStream\b/u, filePath);
  }

  const operatorIndex = readRepoFile(
    "build_tenants/typescript/code/src/operator/index.ts"
  );
  assert.match(operatorIndex, /from "\.\/plugins\/transform\/launch_contract\.js"/u);
  assert.match(operatorIndex, /export \* from "\.\/system_artifacts\.js"/u);
  assert.doesNotMatch(operatorIndex, /handoff\.js/u);
});

test("T-184 ticket carries the partition inventory and deletion gates", () => {
  const ticket = readRepoFile(
    ".ai-workspace/tickets/active/T-184-partition-handoff-into-compute-stage-boundary-modules.md"
  );
  for (const row of ["H-001", "H-030", "H-060", "H-090", "H-100", "H-120", "H-130"]) {
    assert.match(ticket, new RegExp(`\\| ${row} \\|`, "u"), `${row} is tracked`);
  }
  assert.match(ticket, /operator\/plugins\/transform\/launch_contract\.ts/u);
  assert.match(ticket, /operator\/system_artifacts\.ts/u);
  assert.match(ticket, /No framework helper writes a transform output/u);
});
