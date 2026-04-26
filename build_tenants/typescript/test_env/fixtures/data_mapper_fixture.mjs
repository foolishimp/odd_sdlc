import { existsSync } from "node:fs";

const DATA_MAPPER_TEMPLATE_ROOT_ENV = "ODD_SDLC_DATA_MAPPER_TEMPLATE_ROOT";

export function canonicalDataMapperFixtureRoot() {
  const root = process.env[DATA_MAPPER_TEMPLATE_ROOT_ENV];
  if (root === undefined || root.length === 0) {
    throw new Error(
      [
        "Missing external data_mapper.template fixture root.",
        "Lane: optional local reference comparison, not semantic closure.",
        `Set ${DATA_MAPPER_TEMPLATE_ROOT_ENV} to run this reference lane.`
      ].join(" ")
    );
  }
  if (!existsSync(root)) {
    throw new Error(
      [
        "Missing external data_mapper.template fixture.",
        "Lane: optional local reference comparison, not semantic closure.",
        `Checked: ${root}`,
        `Set ${DATA_MAPPER_TEMPLATE_ROOT_ENV} to the fixture root.`
      ].join(" ")
    );
  }
  return root;
}
