import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const semanticRoot = "build/semantic";
const forbiddenSourceDirs = new Set(["cli", "spec_method"]);
const forbiddenSymbols = [
  "invokeOddSdlcSpecMethodCommand",
  "invokeOddSdlcSpecMethodCommandSync",
  "serializeOddSdlcSpecMethodResult",
  "projectOddSdlcWorkspaceStart",
  "commandPayload"
];

function walkFiles(root) {
  if (!existsSync(root)) {
    return [];
  }

  const out = [];
  const stack = [root];
  while (stack.length > 0) {
    const current = stack.pop();
    const stat = statSync(current);
    if (stat.isDirectory()) {
      for (const entry of readdirSync(current)) {
        stack.push(join(current, entry));
      }
      continue;
    }
    if (stat.isFile()) {
      out.push(current);
    }
  }
  return out.sort();
}

const files = walkFiles(semanticRoot);
const forbiddenPaths = files
  .map((file) => relative(process.cwd(), file))
  .filter((file) => {
    const parts = file.split(sep);
    return parts[0] === "build" &&
      parts[1] === "semantic" &&
      parts[2] === "code" &&
      parts[3] === "src" &&
      forbiddenSourceDirs.has(parts[4]);
  });

const forbiddenSymbolHits = [];
for (const file of files) {
  if (!file.endsWith(".js") && !file.endsWith(".d.ts")) {
    continue;
  }
  const text = readFileSync(file, "utf8");
  for (const symbol of forbiddenSymbols) {
    if (text.includes(symbol)) {
      forbiddenSymbolHits.push(`${relative(process.cwd(), file)}: ${symbol}`);
    }
  }
}

if (forbiddenPaths.length > 0 || forbiddenSymbolHits.length > 0) {
  console.error("Command-surface artifacts are not allowed in semantic build output.");
  for (const path of forbiddenPaths) {
    console.error(`forbidden path: ${path}`);
  }
  for (const hit of forbiddenSymbolHits) {
    console.error(`forbidden symbol: ${hit}`);
  }
  process.exit(1);
}

console.log("Pack guard passed: no retired command artifacts in semantic build output.");
