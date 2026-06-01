import { existsSync, readFileSync } from "node:fs";
import path, { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DATA_MAPPER_TEMPLATE_ROOT_ENV = "ODD_SDLC_DATA_MAPPER_TEMPLATE_ROOT";
const FIXTURE_DIR = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(FIXTURE_DIR, "../..");
const FIXTURE_CONFIG_PATH = resolve(
  PACKAGE_ROOT,
  "config/data_mapper_reference_fixture.json"
);
const FIXTURE_CONFIG = JSON.parse(readFileSync(FIXTURE_CONFIG_PATH, "utf8"));
const REPO_LOCAL_DATA_MAPPER_TEMPLATE_ROOT = resolve(
  PACKAGE_ROOT,
  FIXTURE_CONFIG.templateRoot
);

export {
  DATA_MAPPER_TEMPLATE_ROOT_ENV,
  REPO_LOCAL_DATA_MAPPER_TEMPLATE_ROOT
};

export function canonicalDataMapperFixtureRoot() {
  const requestedRoot = process.env[DATA_MAPPER_TEMPLATE_ROOT_ENV];
  const root =
    requestedRoot === undefined || requestedRoot.length === 0
      ? REPO_LOCAL_DATA_MAPPER_TEMPLATE_ROOT
      : path.resolve(requestedRoot);
  if (!existsSync(root)) {
    throw new Error(
      [
        "Missing data_mapper.template fixture.",
        "Lane: optional local reference comparison, not semantic closure.",
        `Checked: ${root}`,
        `Default: ${REPO_LOCAL_DATA_MAPPER_TEMPLATE_ROOT}`,
        `Override with ${DATA_MAPPER_TEMPLATE_ROOT_ENV} only when intentionally testing an alternate fixture.`
      ].join(" ")
    );
  }
  return root;
}
