#!/usr/bin/env yavascript
import * as std from "quickjs:std";
import { parseArgv } from "./config";
import { run } from "./run";

const config = parseArgv();
let failed = false;
for (const file of config.files) {
  const status = run(file, config);
  if (status === "fail") {
    failed = true;
  }
}

if (failed) {
  std.exit(1);
}
