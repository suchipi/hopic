export type RunResult = {
  status?: number | undefined;
  signal?: string | undefined;
  stdout: string;
  stderr: string;
};

export type TransformCmdFunction = (cmdline: string) => Array<string>;
export type TransformResultFunction = (result: RunResult) => any;
