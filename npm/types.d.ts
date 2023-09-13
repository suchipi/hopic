export type RunResult = {
  status?: number | undefined;
  signal?: string | undefined;
  stdout: string;
  stderr: string;
};

export type TransformCmdFunction = (cmdline: string) => Array<string>;
export type TransformResultFunction = (result: RunResult) => any;

export function getBinaryPath(): string;
export const binaryPath: string;
export const version: string;
