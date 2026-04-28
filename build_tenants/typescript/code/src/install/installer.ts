// Implements: REQ-F-ODDSDLC-040

import { installAbiogenesisTypescript } from "@abiogenesis/typescript-tenant/app/m04/install-bootstrap";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { admitOddSdlcTypescriptInstallRequest } from "./admission.js";
import type {
  OddSdlcTypescriptInstallManifest,
  OddSdlcTypescriptInstallOutcome,
  OddSdlcTypescriptInstallRequest,
  OddSdlcTypescriptRuntimeIdentity
} from "./carriers.js";
import {
  installPackedNodePackage,
  packNodePackage,
  readNodePackageIdentity
} from "../package_binding/index.js";
import { oddSdlcBootstrapGovernance, writeOddSdlcInstructionFiles } from "./instruction_files.js";
import {
  legacyBlockingReasonCode,
  makeSdlcBlockingReason
} from "../shared/blocking_reason.js";

export const ODD_SDLC_TYPESCRIPT_PRODUCT_INSTALL_ROOT_RELATIVE = Object.freeze([
  ".abiogenesis",
  "odd_sdlc",
  "typescript"
] as const);

export function oddSdlcTypescriptProductInstallRoot(targetRoot: string): string {
  return join(targetRoot, ...ODD_SDLC_TYPESCRIPT_PRODUCT_INSTALL_ROOT_RELATIVE);
}

function stableJson(payload: unknown): string {
  return `${JSON.stringify(payload, null, 2)}\n`;
}

async function writeTextFile(targetPath: string, content: string): Promise<void> {
  await mkdir(dirname(targetPath), { recursive: true });
  await writeFile(targetPath, content, "utf8");
}

function substrateRuntimeRef(abgOutcome: Awaited<ReturnType<typeof installAbiogenesisTypescript>>): string | null {
  if (abgOutcome.kind !== "installed") {
    return null;
  }
  return abgOutcome.runtimeIdentity.resolvedRuntimeRef;
}

function runtimeIdentityFor(
  packageName: string,
  packageVersion: string,
  abgOutcome: Awaited<ReturnType<typeof installAbiogenesisTypescript>>
): OddSdlcTypescriptRuntimeIdentity {
  return Object.freeze({
    kind: "odd_sdlc_typescript_runtime_identity",
    packageName,
    packageVersion,
    resolvedRuntimeRef: `package:${packageName}@${packageVersion}`,
    substrateRuntimeRef: substrateRuntimeRef(abgOutcome)
  });
}

function requireInstalledAbg(
  abgOutcome: Awaited<ReturnType<typeof installAbiogenesisTypescript>>
): Extract<typeof abgOutcome, { readonly kind: "installed" }> {
  if (abgOutcome.kind !== "installed") {
    throw new Error(`ABG TypeScript install rejected: ${abgOutcome.reason}`);
  }
  return abgOutcome;
}

async function installAdmittedOddSdlcTypescript(
  request: OddSdlcTypescriptInstallRequest
): Promise<OddSdlcTypescriptInstallOutcome> {
  try {
    const identity = await readNodePackageIdentity(request.packageSourceRoot);
    const productInstallRoot = oddSdlcTypescriptProductInstallRoot(request.targetRoot);
    const packed = await packNodePackage({
      packageSourceRoot: request.packageSourceRoot,
      packDestinationRoot: join(productInstallRoot, "package-pack"),
      npmCacheRoot: join(request.targetRoot, ".npm-cache")
    });
    const installedPackage = await installPackedNodePackage({
      targetRoot: request.targetRoot,
      packageSourceRoot: request.packageSourceRoot,
      packageExtractRoot: join(productInstallRoot, "package-extract"),
      identity,
      tarballPath: packed.tarballPath,
      commandNames: ["odd-sdlc-ts"]
    });
    const abgOutcome = requireInstalledAbg(
      await installAbiogenesisTypescript({
        targetRoot: {
          rootPath: request.targetRoot
        },
        packageSourceRoot: request.abgPackageSourceRoot,
        installedPackageName: `${request.installedPackageName}-abg`
      })
    );
    const oddSdlcCommandPath = installedPackage.commandBindings[0]?.commandPath;
    if (oddSdlcCommandPath === undefined) {
      throw new Error("odd-sdlc-ts command binding was not created");
    }
    const genesisCommandPath =
      abgOutcome.commandPaths.find((candidate) => candidate.endsWith("/genesis-ts")) ??
      null;
    const abiogenesisCommandPath =
      abgOutcome.commandPaths.find((candidate) => candidate.endsWith("/abiogenesis-ts")) ??
      null;
    const bootstrapGuidePath = join(
      request.targetRoot,
      ".ai-workspace",
      "context",
      "odd_sdlc_typescript_bootstrap.md"
    );
    const normalizationPath = join(
      request.targetRoot,
      ".ai-workspace",
      "runtime",
      "odd_sdlc-typescript-installation.json"
    );
    const installManifestPath = join(productInstallRoot, "install-manifest.json");
    const instructionFiles = await writeOddSdlcInstructionFiles({
      targetRoot: request.targetRoot,
      productInstallRoot,
      oddSdlcCommandPath,
      genesisCommandPath,
      abiogenesisCommandPath,
      bootstrapGuidePath,
      normalizationPath,
      installManifestPath,
      abgInstallManifestPath: abgOutcome.installManifestPath
    });
    const runtimeIdentity = runtimeIdentityFor(
      installedPackage.packageName,
      installedPackage.packageVersion,
      abgOutcome
    );
    const bootstrapGovernance = oddSdlcBootstrapGovernance();
    const manifest: OddSdlcTypescriptInstallManifest = Object.freeze({
      kind: "odd_sdlc_typescript_install_manifest",
      targetRoot: request.targetRoot,
      productInstallRoot,
      installedPackageName: request.installedPackageName,
      packageName: installedPackage.packageName,
      packageVersion: installedPackage.packageVersion,
      packageSourceRoot: request.packageSourceRoot,
      packageRoot: installedPackage.packageRoot,
      tarballPath: installedPackage.tarballPath,
      commandBindings: installedPackage.commandBindings,
      abgCommandPaths: abgOutcome.commandPaths,
      abgInstallManifestPath: abgOutcome.installManifestPath,
      abgInstallerManifestPath: abgOutcome.installerManifestPath,
      bootstrapGuidePath,
      instructionFiles,
      bootstrapGovernance,
      normalizationPath,
      installManifestPath,
      runtimeIdentity
    });

    await writeTextFile(installManifestPath, stableJson(manifest));
    await writeTextFile(
      normalizationPath,
      stableJson({
        kind: "odd_sdlc_typescript_installation_projection",
        targetRoot: request.targetRoot,
        productInstallRoot,
        commandPaths: [
          ...installedPackage.commandBindings.map((binding) => binding.commandPath),
          ...abgOutcome.commandPaths
        ],
        runtimeIdentity,
        installManifestPath,
        bootstrapGuidePath,
        instructionFiles,
        bootstrapGovernance,
        abgInstallManifestPath: abgOutcome.installManifestPath
      })
    );
    return Object.freeze({
      kind: "installed",
      request,
      productInstallRoot,
      installedPackage,
      abgOutcome,
      manifest,
      commandPaths: Object.freeze([
        ...installedPackage.commandBindings.map((binding) => binding.commandPath),
        ...abgOutcome.commandPaths
      ]),
      bootstrapGuidePath,
      instructionFiles,
      normalizationPath,
      installManifestPath
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "odd_sdlc TypeScript install failed";
    const blockingReason = makeSdlcBlockingReason({
      code: message.startsWith("ABG TypeScript install rejected:")
        ? "abg_install_rejected"
        : message.includes("command binding")
          ? "command_binding_missing"
          : "install_failed",
      detail: message,
      evidenceRefs: [request.targetRoot]
    });
    return Object.freeze({
      kind: "rejected",
      request,
      reason: legacyBlockingReasonCode(blockingReason),
      blockingReason
    });
  }
}

export async function installOddSdlcTypescript(
  input: unknown
): Promise<OddSdlcTypescriptInstallOutcome> {
  return installAdmittedOddSdlcTypescript(
    admitOddSdlcTypescriptInstallRequest(input)
  );
}
