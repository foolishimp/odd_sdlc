// Implements: REQ-F-ODDSDLC-024
// Implements: REQ-F-ODDSDLC-040
// Implements: REQ-F-ODDSDLC-041
// Implements: REQ-F-ODDSDLC-043

export const ODD_SDLC_TYPESCRIPT_RC_QUALIFICATION_REPORT = Object.freeze({
  kind: "odd_sdlc_typescript_rc_qualification_report",
  reportId: "odd-sdlc-ts-rc-qualification-20260426",
  releaseClaim: "bounded_odd_native_typescript_rc",
  verdict: "bounded_rc_ready",
  verdictScope:
    "The TypeScript tenant is RC-qualified for the bounded ODD-native package surface: strict build, graph publication, pure ingress, read/query projections, public ABG handoff, hook contracts, traceability closure, triage routing, operational command/result projection, and harnessed scenario proof.",
  nonClaimedScope: Object.freeze([
    "side-effecting installed-workspace CLI replacement for the Python tenant",
    "live probabilistic data_mapper generation with an external F_P worker",
    "release-cut packaging and public binary distribution"
  ]),
  gates: Object.freeze([
    Object.freeze({
      name: "semantic unit and module-derived proof",
      category: "unit",
      command: "npm run test:semantic",
      status: "passed",
      evidenceRef: "build_tenants/typescript/test_env/test_surface_map.md"
    }),
    Object.freeze({
      name: "T-038 composed harnessed sandbox",
      category: "harnessed_sandbox",
      command: "npm run test:t038",
      status: "passed",
      evidenceRef:
        "build_tenants/typescript/test_env/tests/test_t038_rc_qualification.test.mjs"
    }),
    Object.freeze({
      name: "data_mapper reference comparison",
      category: "reference",
      command:
        "ODD_SDLC_DATA_MAPPER_TEMPLATE_ROOT=/Users/jim/src/apps/ai_sdlc_examples/local_projects/data_mapper/data_mapper.template npm run test:reference:data-mapper",
      status: "optional_passed",
      evidenceRef:
        "build_tenants/typescript/test_env/fixtures/data_mapper_reference_manifest.md"
    }),
    Object.freeze({
      name: "live F_P worker traversal",
      category: "live",
      command: null,
      status: "not_claimed",
      evidenceRef:
        ".ai-workspace/tickets/backlog/T-041-realize-typescript-full-operational-python-replacement-rc-lane.md"
    })
  ]),
  pythonParity: Object.freeze([
    Object.freeze({
      area: "install and normalize",
      pythonEvidence: "normalization.py and installation tests mutate target workspaces.",
      typescriptEvidence:
        "workspace ingress admits source inputs, project constraints, imported requirement authority, and bootstrap lineage as pure carriers.",
      status: "partial_intentional_difference",
      gapTicket:
        ".ai-workspace/tickets/backlog/T-041-realize-typescript-full-operational-python-replacement-rc-lane.md"
    }),
    Object.freeze({
      area: "start",
      pythonEvidence: "public_start.py exposes operator start against installed workspaces.",
      typescriptEvidence:
        "start/public_start.ts admits a public boundary, resolves graph-function targets, constructs an ABG ExecutionBasis, and refuses tenant-local continuation.",
      status: "bounded_parity",
      gapTicket: null
    }),
    Object.freeze({
      area: "gaps and query",
      pythonEvidence: "query.py, gap_dossier.py, and span_analysis.py publish domain read models.",
      typescriptEvidence:
        "projection/query_domain.ts publishes read-only query, gap, dossier, span, start-target, and ownership surfaces over admitted module truth.",
      status: "bounded_parity",
      gapTicket: null
    }),
    Object.freeze({
      area: "triage",
      pythonEvidence: "triage.py and homeostatic_loop.py classify gaps and route follow-up work.",
      typescriptEvidence:
        "triage/ splits observation, classification, route binding, repricing proposal, ticket work-item route, and loopback retirement without mutating ticket state.",
      status: "bounded_parity",
      gapTicket: null
    }),
    Object.freeze({
      area: "constructors and evaluators",
      pythonEvidence: "constructor.py and fd_checks.py construct assets and evaluate closure.",
      typescriptEvidence:
        "hooks/ declares per-edge contracts, preflight/postflight F_D, F_P work-report admission, generated-asset authority, and ambiguity preservation.",
      status: "bounded_parity",
      gapTicket:
        ".ai-workspace/tickets/backlog/T-041-realize-typescript-full-operational-python-replacement-rc-lane.md"
    }),
    Object.freeze({
      area: "traceability",
      pythonEvidence:
        "traceability.py, traceability_index.py, traceability_report.py, and requirement_closure.py publish closure evidence.",
      typescriptEvidence:
        "projection/requirement_closure.ts publishes lineage ledger, closure register, and repair frontier while keeping trace-only proof partial.",
      status: "bounded_parity",
      gapTicket: null
    }),
    Object.freeze({
      area: "operational return",
      pythonEvidence: "operational_dispatch.py handles cooperative operational return.",
      typescriptEvidence:
        "operational/ prepares capability-gated command surfaces, admits returned results, projects state, and feeds runtime-return observations back into graph functions.",
      status: "bounded_parity",
      gapTicket: null
    }),
    Object.freeze({
      area: "release",
      pythonEvidence:
        "Python can produce operational release/run evidence inside installed workspaces.",
      typescriptEvidence:
        "graph catalog publishes prepare_release_surface and operational graph functions; package release-cut/binary distribution is not claimed.",
      status: "partial_intentional_difference",
      gapTicket:
        ".ai-workspace/tickets/backlog/T-041-realize-typescript-full-operational-python-replacement-rc-lane.md"
    })
  ])
} as const);

export type OddSdlcTypescriptRcQualificationReport =
  typeof ODD_SDLC_TYPESCRIPT_RC_QUALIFICATION_REPORT;

export type OddSdlcTypescriptPythonParityEntry =
  OddSdlcTypescriptRcQualificationReport["pythonParity"][number];

export function describeOddSdlcTypescriptRcQualification():
  OddSdlcTypescriptRcQualificationReport {
  return ODD_SDLC_TYPESCRIPT_RC_QUALIFICATION_REPORT;
}

export function remainingOddSdlcTypescriptRcGaps():
  readonly OddSdlcTypescriptPythonParityEntry[] {
  return Object.freeze(
    ODD_SDLC_TYPESCRIPT_RC_QUALIFICATION_REPORT.pythonParity.filter(
      (entry) => entry.gapTicket !== null
    )
  );
}
