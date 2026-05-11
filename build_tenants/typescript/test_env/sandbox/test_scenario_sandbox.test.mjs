// Drives the generic scenario sandbox harness against registered descriptors.
//
// One test per scenario. Each test rebuilds the candidate app from its fixture
// into a fresh archive, exercising the same six-step recipe proven by the
// internal data_mapper induction lane:
//   provision ABG sandbox -> copy fixture -> install odd_sdlc -> gaps -> start
//
// Live multi-advance variants are opt-in through env vars.

import test from "node:test";
import { existsSync, statSync } from "node:fs";

import {
  assertScenarioExpectations,
  runScenarioSandbox
} from "./scenario_sandbox.mjs";
import { dataMapperInternalScenario } from "./scenarios/data_mapper_internal.scenario.mjs";
import {
  helloWorldRustMinimumInductionLiveScenario,
  helloWorldRustMinimumInductionScenario
} from "./scenarios/hello_world_rust_minimum_induction.scenario.mjs";
import {
  t131OddChatLiveScenario,
  t131OddChatScenario
} from "./scenarios/t131_odd_chat.scenario.mjs";
import {
  t132HelloWorldJsLiveScenario,
  t132HelloWorldJsScenario
} from "./scenarios/t132_hello_world_js.scenario.mjs";
import {
  t133HelloWorldRustLiveScenario,
  t133HelloWorldRustScenario
} from "./scenarios/t133_hello_world_rust.scenario.mjs";

function assertWorkspaceWasInstalled(result) {
  if (!existsSync(result.workspace) || !statSync(result.workspace).isDirectory()) {
    throw new Error(`workspace missing at ${result.workspace}`);
  }
  if (result.install.kind !== "installed") {
    throw new Error(`install did not complete: ${JSON.stringify(result.install)}`);
  }
}

test("scenario sandbox: data_mapper internal induction", async () => {
  const result = await runScenarioSandbox(dataMapperInternalScenario);
  assertWorkspaceWasInstalled(result);
  assertScenarioExpectations(result, dataMapperInternalScenario);
});

test("scenario sandbox: T-131 odd_chat bootstrap induction", async () => {
  const result = await runScenarioSandbox(t131OddChatScenario);
  assertWorkspaceWasInstalled(result);
  assertScenarioExpectations(result, t131OddChatScenario);
});

test("scenario sandbox: minimum Rust hello-world induction", async () => {
  const result = await runScenarioSandbox(helloWorldRustMinimumInductionScenario);
  assertWorkspaceWasInstalled(result);
  assertScenarioExpectations(result, helloWorldRustMinimumInductionScenario);
});

test("scenario sandbox: T-132 JavaScript hello-world bootstrap induction", async () => {
  const result = await runScenarioSandbox(t132HelloWorldJsScenario);
  assertWorkspaceWasInstalled(result);
  assertScenarioExpectations(result, t132HelloWorldJsScenario);
});

test("scenario sandbox: T-133 Rust hello-world bootstrap induction", async () => {
  const result = await runScenarioSandbox(t133HelloWorldRustScenario);
  assertWorkspaceWasInstalled(result);
  assertScenarioExpectations(result, t133HelloWorldRustScenario);
});

const T131_LIVE_ENABLED = process.env["ODD_SDLC_TS_T131_ODD_CHAT_SCENARIO_LIVE"] === "1";
const T131_LIVE_WORKER =
  process.env["ODD_SDLC_TS_T131_ODD_CHAT_SCENARIO_WORKER"] ?? "process://claude";
const T131_LIVE_MAX_ADVANCES = Number.parseInt(
  process.env["ODD_SDLC_TS_T131_ODD_CHAT_SCENARIO_MAX_ADVANCES"] ?? "12",
  10
);

test(
  "scenario sandbox: T-131 odd_chat live build loop (opt-in)",
  { skip: T131_LIVE_ENABLED ? false : "ODD_SDLC_TS_T131_ODD_CHAT_SCENARIO_LIVE=1 not set" },
  async () => {
    const scenario = t131OddChatLiveScenario({
      worker: T131_LIVE_WORKER,
      maxAdvances: T131_LIVE_MAX_ADVANCES
    });
    const result = await runScenarioSandbox(scenario);
    assertWorkspaceWasInstalled(result);
    assertScenarioExpectations(result, scenario);
  }
);

const RUST_MIN_LIVE_ENABLED =
  process.env["ODD_SDLC_TS_HELLO_WORLD_RUST_MINIMUM_INDUCTION_SCENARIO_LIVE"] === "1";
const RUST_MIN_LIVE_WORKER =
  process.env["ODD_SDLC_TS_HELLO_WORLD_RUST_MINIMUM_INDUCTION_SCENARIO_WORKER"] ??
  "process://claude";
const RUST_MIN_LIVE_MAX_ADVANCES = Number.parseInt(
  process.env["ODD_SDLC_TS_HELLO_WORLD_RUST_MINIMUM_INDUCTION_SCENARIO_MAX_ADVANCES"] ?? "6",
  10
);

test(
  "scenario sandbox: minimum Rust hello-world live build loop (opt-in)",
  {
    skip: RUST_MIN_LIVE_ENABLED
      ? false
      : "ODD_SDLC_TS_HELLO_WORLD_RUST_MINIMUM_INDUCTION_SCENARIO_LIVE=1 not set"
  },
  async () => {
    const scenario = helloWorldRustMinimumInductionLiveScenario({
      worker: RUST_MIN_LIVE_WORKER,
      maxAdvances: RUST_MIN_LIVE_MAX_ADVANCES
    });
    const result = await runScenarioSandbox(scenario);
    assertWorkspaceWasInstalled(result);
    assertScenarioExpectations(result, scenario);
  }
);

const T132_LIVE_ENABLED = process.env["ODD_SDLC_TS_T132_HELLO_WORLD_JS_SCENARIO_LIVE"] === "1";
const T132_LIVE_WORKER =
  process.env["ODD_SDLC_TS_T132_HELLO_WORLD_JS_SCENARIO_WORKER"] ?? "process://claude";
const T132_LIVE_MAX_ADVANCES = Number.parseInt(
  process.env["ODD_SDLC_TS_T132_HELLO_WORLD_JS_SCENARIO_MAX_ADVANCES"] ?? "6",
  10
);

test(
  "scenario sandbox: T-132 JavaScript hello-world live build loop (opt-in)",
  { skip: T132_LIVE_ENABLED ? false : "ODD_SDLC_TS_T132_HELLO_WORLD_JS_SCENARIO_LIVE=1 not set" },
  async () => {
    const scenario = t132HelloWorldJsLiveScenario({
      worker: T132_LIVE_WORKER,
      maxAdvances: T132_LIVE_MAX_ADVANCES
    });
    const result = await runScenarioSandbox(scenario);
    assertWorkspaceWasInstalled(result);
    assertScenarioExpectations(result, scenario);
  }
);

const T133_LIVE_ENABLED = process.env["ODD_SDLC_TS_T133_HELLO_WORLD_RUST_SCENARIO_LIVE"] === "1";
const T133_LIVE_WORKER =
  process.env["ODD_SDLC_TS_T133_HELLO_WORLD_RUST_SCENARIO_WORKER"] ?? "process://claude";
const T133_LIVE_MAX_ADVANCES = Number.parseInt(
  process.env["ODD_SDLC_TS_T133_HELLO_WORLD_RUST_SCENARIO_MAX_ADVANCES"] ?? "6",
  10
);

test(
  "scenario sandbox: T-133 Rust hello-world live build loop (opt-in)",
  { skip: T133_LIVE_ENABLED ? false : "ODD_SDLC_TS_T133_HELLO_WORLD_RUST_SCENARIO_LIVE=1 not set" },
  async () => {
    const scenario = t133HelloWorldRustLiveScenario({
      worker: T133_LIVE_WORKER,
      maxAdvances: T133_LIVE_MAX_ADVANCES
    });
    const result = await runScenarioSandbox(scenario);
    assertWorkspaceWasInstalled(result);
    assertScenarioExpectations(result, scenario);
  }
);
