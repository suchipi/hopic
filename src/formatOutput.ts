import { CMD_MARKER } from "./cmdMarker";

export function formatOutput(filename: Path, printedResult: string): string {
  return (
    blue(
      "----- " +
        filename.relativeTo(pwd(), { noLeadingDot: true }).toString() +
        " -----"
    ) +
    "\n" +
    printedResult
      .split("\n")
      .map((line) => {
        if (line.startsWith(CMD_MARKER)) {
          return grey(line);
        }

        if (line.startsWith("status: ")) {
          return magenta("status: ") + line.slice("status: ".length);
        }

        if (line.startsWith("signal: ")) {
          return magenta("signal: ") + line.slice("signal: ".length);
        }

        if (line.startsWith("stdout: ")) {
          return magenta("stdout: ") + line.slice("stdout: ".length);
        }

        if (line.startsWith("stderr: ")) {
          return magenta("stderr: ") + line.slice("stderr: ".length);
        }

        return line;
      })
      .join("\n") +
    blue("----------")
  );
}
