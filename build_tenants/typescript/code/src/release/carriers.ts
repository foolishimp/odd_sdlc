// Implements: REQ-F-ODDSDLC-040

import type { NodePackageIdentity, PackedNodePackage } from "../package_binding/index.js";

export interface OddSdlcTypescriptReleaseCutRequest {
  readonly kind: "odd_sdlc_typescript_release_cut_request";
  readonly packageSourceRoot: string;
  readonly archiveRoot: string;
}

export interface OddSdlcTypescriptReleaseCutManifest {
  readonly kind: "odd_sdlc_typescript_release_cut_manifest";
  readonly packageName: string;
  readonly packageVersion: string;
  readonly packageSourceRoot: string;
  readonly archiveRoot: string;
  readonly tarballPath: string;
  readonly releaseManifestPath: string;
  readonly binaryBinding: {
    readonly commandName: "odd-sdlc-ts";
    readonly relativePackageCommandPath: string;
    readonly sourceCommandPath: string;
  };
  readonly packageIdentity: NodePackageIdentity;
}

export interface OddSdlcTypescriptReleaseCutOutcome {
  readonly kind: "odd_sdlc_typescript_release_cut";
  readonly request: OddSdlcTypescriptReleaseCutRequest;
  readonly packedPackage: PackedNodePackage;
  readonly manifest: OddSdlcTypescriptReleaseCutManifest;
  readonly releaseManifestPath: string;
  readonly postmortemPath: string;
}
