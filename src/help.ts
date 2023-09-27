const helpText = `
hopic - snapshot testing for CLI app output

usage: hopic [options] <files...>

Where <files...> is one or more .yml files with lines beginning with "#> ".

options:
  --dry-run (boolean): Don't update any files
  --config-file (path): Config file (see below)
  --update, -u (boolean): Overwrite existing snapshots
  --ci (boolean): Don't write new snapshots
  --help, -h (boolean): Show usage text

all boolean options default to false.

config files are optional js/ts files, which may export two functions:
  transformCmd: transform input command string into argv array
  transformResult: transform/sanitize output run result

transformResult is usually used to remove machine-specific information from
stdout/stderr, such as absolute paths or usernames.

Here's a starting point for a config file:

----------------
/// <reference types="yavascript" />

export function transformCmd(cmdline: string): Array<string> {
  return ['bash', '-c', cmdline];
}

type RunResult = {
  status?: number | undefined;
  signal?: string | undefined;
  stdout: string;
  stderr: string;
};

export function transformResult(result: RunResult): any {
  return result;
}

----------------
`.trim();

export function help() {
  console.log(helpText);
}
