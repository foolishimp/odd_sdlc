// Validates: B-083
// Validates: sandbox-source-root-hygiene

import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import path, { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(TEST_DIR, "../..");
const REPO_ROOT = resolve(PACKAGE_ROOT, "../..");

function collectFiles(root, predicate) {
  const files = [];
  const stack = [root];
  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const child = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(child);
      } else if (predicate(child)) {
        files.push(path.relative(REPO_ROOT, child));
      }
    }
  }
  return files.sort();
}

test("B-083 keeps Python replay Scala sources out of source-root fixture trees", () => {
  const pythonFixtures = path.join(REPO_ROOT, "build_tenants/python/test_env/fixtures");
  const scalaFiles = collectFiles(pythonFixtures, (candidate) => candidate.endsWith(".scala"));
  assert.deepEqual(scalaFiles, []);
});
