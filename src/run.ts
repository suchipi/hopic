import type { Config } from "./config";
import { CMD_MARKER } from "./cmdMarker";
import { formatOutput } from "./formatOutput";
import { diff } from "./diff";

export function run(filename: Path, config: Config): "pass" | "fail" {
  const inputContent = readFile(filename);
  const lines = inputContent.split("\n");

  const commandLines = lines.filter((line) => line.startsWith(CMD_MARKER));
  const nonCommandLines = lines.filter((line) => !line.startsWith(CMD_MARKER));
  const results = commandLines.map((line) => {
    const cmd = line.slice(CMD_MARKER.length);
    const { status, signal, stdout, stderr } = exec(config.transformCmd(cmd), {
      captureOutput: true,
      failOnNonZeroStatus: false,
    }) as any as {
      status: number | undefined;
      signal: string | undefined;
      stdout: string;
      stderr: string;
    };

    const result = config.transformResult({
      status,
      signal,
      stdout,
      stderr,
    });

    return line + "\n" + YAML.stringify(result, null, 2);
  });

  const outputContent = results.join("\n");

  console.log(formatOutput(filename, outputContent));

  const shouldUpdate =
    config.shouldUpdateSnapshots ||
    (nonCommandLines.join("\n").trim() === "" && !config.isCi);

  if (shouldUpdate) {
    if (!config.dryRun) {
      writeFile(filename, outputContent);
    }
  } else {
    if (inputContent !== outputContent) {
      console.error(
        bold(
          red(
            filename.relativeTo(pwd(), { noLeadingDot: true }).toString() +
              ": Output differed from snapshot:\n"
          )
        ) + diff(inputContent, outputContent)
      );
      return "fail";
    }
  }

  return "pass";
}
