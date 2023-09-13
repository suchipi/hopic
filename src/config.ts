import * as os from "quickjs:os";

export type RunResult = {
  status?: number | undefined;
  signal?: string | undefined;
  stdout: string;
  stderr: string;
};

export type Config = {
  files: Array<Path>;
  dryRun: boolean;
  shouldUpdateSnapshots: boolean;
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
    },
    argv
  );

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

  let shouldUpdateSnapshots = flags.update || flags.u;

  return {
    files: args.map((arg) => new Path(arg).resolve()),
    dryRun: flags.dryRun,
    shouldUpdateSnapshots,
    transformCmd,
    transformResult,
  };
}
