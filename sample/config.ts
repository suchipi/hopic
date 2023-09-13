type RunResult = {
  status?: number | undefined;
  signal?: string | undefined;
  stdout: string;
  stderr: string;
};

const rootDir = GitRepo.findRoot(pwd()).toString();

function cleanStr(str: string): string {
  const rootDirCleaned = str.replaceAll(rootDir, "<rootDir>");
  if (env.HOME) {
    return rootDirCleaned.replaceAll(env.HOME, "<$HOME>");
  } else {
    return rootDirCleaned;
  }
}

export const transformResult = (result: RunResult) => {
  return {
    ...result,
    stdout: cleanStr(result.stdout),
    stderr: cleanStr(result.stderr),
  };
};

export const transformCmd = (cmdline: string) => ["sh", "-c", cmdline];
