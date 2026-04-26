import { existsSync } from "node:fs";

const DEFAULT_DATA_MAPPER_TEMPLATE_ROOT =
  "/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.template";

export function canonicalDataMapperFixtureRoot() {
  const root =
    process.env.ODD_SDLC_DATA_MAPPER_TEMPLATE_ROOT ??
    DEFAULT_DATA_MAPPER_TEMPLATE_ROOT;
  if (!existsSync(root)) {
    throw new Error(
      [
        "Missing canonical data_mapper.template fixture.",
        `Checked: ${root}`,
        "Set ODD_SDLC_DATA_MAPPER_TEMPLATE_ROOT to the fixture root for portable runs."
      ].join(" ")
    );
  }
  return root;
}
