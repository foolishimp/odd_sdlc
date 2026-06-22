#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import path from "node:path";

const packageRoot = process.cwd();
const testsRoot = path.join(packageRoot, "test_env", "tests");
const requested = process.argv.slice(2);
const testFiles =
  requested.length === 0
    ? readdirSync(testsRoot)
        .filter((entry) => entry.endsWith(".test.mjs"))
        .map((entry) => path.join("test_env", "tests", entry))
        .sort((left, right) => left.localeCompare(right))
    : requested;

const failed = [];
const startedAt = Date.now();
for (const [index, file] of testFiles.entries()) {
  const fileStartedAt = Date.now();
  console.error(
    `semantic test ${index + 1}/${testFiles.length}: ${file}`
  );
  const run = spawnSync(process.execPath, ["--test", file], {
    cwd: packageRoot,
    env: process.env,
    stdio: "inherit"
  });
  const elapsedSeconds = ((Date.now() - fileStartedAt) / 1000).toFixed(1);
  console.error(
    `semantic test ${index + 1}/${testFiles.length}: ${file} ` +
      `${run.status === 0 ? "passed" : "failed"} in ${elapsedSeconds}s`
  );
  if (run.status !== 0) {
    failed.push({ file, status: run.status, signal: run.signal });
  }
}

const totalSeconds = ((Date.now() - startedAt) / 1000).toFixed(1);

if (failed.length > 0) {
  console.error(`\nsemantic test failures after ${totalSeconds}s:`);
  for (const failure of failed) {
    console.error(
      `- ${failure.file}: ${failure.status === null ? failure.signal ?? "unknown" : failure.status}`
    );
  }
  process.exit(1);
}

console.error(
  `semantic test suite passed ${testFiles.length}/${testFiles.length} files in ${totalSeconds}s`
);
