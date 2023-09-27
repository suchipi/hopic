#!/usr/bin/env yavascript
import * as std from "quickjs:std";
import { parseArgv } from "./config";
import { run } from "./run";
import { help } from "./help";
import { version } from "./version";

const config = parseArgv();

if (config.target === "help") {
  help();
} else if (config.target === "version") {
  version();
} else {
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
}
