import * as os from "quickjs:os";

export type RunResult = {
  status?: number | undefined;
  signal?: string | undefined;
  stdout: string;
  stderr: string;
};

export type Config =
  | { target: "help" }
  | {
      target: "run";
      files: Array<Path>;
      dryRun: boolean;
      shouldUpdateSnapshots: boolean;
      isCi: boolean;
      transformCmd: (cmdline: string) => Array<string>;
      transformResult: (result: RunResult) => any;
    };

export function parseArgv(): Config {
  let sliceOffset: number;
  if (os.execPath().endsWith("yavascript")) {
    sliceOffset = 2;
  } else {
    sliceOffset = 1;
  }

  const argv = scriptArgs.slice(sliceOffset);
  const { args, flags } = parseScriptArgs(
    {
      dryRun: boolean,
      configFile: Path,
      u: boolean,
      update: boolean,
      ci: boolean,
      help: boolean,
      h: boolean,
    },
    argv
  );

  if (flags.h || flags.help) {
    return { target: "help" };
  }

  const files = args.map((arg) => new Path(arg).resolve());
  if (files.length === 0) {
    return { target: "help" };
  }

  let configMod: any = {};
  if (flags.configFile) {
    configMod = require(flags.configFile);
  }

  let transformCmd = (cmdline: string) => ["bash", "-c", cmdline];
  if (configMod.transformCmd) {
    if (typeof configMod.transformCmd === "function") {
      transformCmd = configMod.transformCmd;
    } else {
      throw new Error(
        `Provided config file (${
          flags.configFile
        }) had a 'transformCmd' export, but it wasn't a function. It was: ${inspect(
          configMod.transformCmd
        )}`
      );
    }
  }

  let transformResult = (result: RunResult) => result;
  if (configMod.transformResult) {
    if (typeof configMod.transformResult === "function") {
      transformResult = configMod.transformResult;
    } else {
      throw new Error(
        `Provided config file (${
          flags.configFile
        }) had a 'transformResult' export, but it wasn't a function. It was: ${inspect(
          configMod.transformResult
        )}`
      );
    }
  }

  const shouldUpdateSnapshots = flags.update || flags.u || false;
  const isCi = Object.hasOwn(flags, "ci")
    ? flags.ci
    : env.CI === "true" || env.CI === "1";

  return {
    target: "run",
    files,
    dryRun: flags.dryRun,
    shouldUpdateSnapshots,
    isCi,
    transformCmd,
    transformResult,
  };
}
