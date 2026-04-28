#!/usr/bin/env node
// Implements: REQ-F-ODDSDLC-040

import {
  runOddSdlcCliAsync,
  serializeOddSdlcCliResult
} from "./command.js";

const result = await runOddSdlcCliAsync(process.argv.slice(2));
const output = serializeOddSdlcCliResult(result);
if (result.status === "error") {
  process.stderr.write(output);
} else {
  process.stdout.write(output);
}
process.exitCode = result.exitCode;
