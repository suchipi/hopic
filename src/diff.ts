import * as Diff from "diff";

export function diff(a: string, b: string): string {
  const diff = Diff.diffLines(a, b);

  return diff
    .map((part) => {
      // green for additions, red for deletions
      // grey for common parts
      const colorFn = part.added
        ? (str: string) => bold(green("+ " + str))
        : part.removed
        ? (str: string) => bold(red("- " + str))
        : (str: string) =>
            grey(
              str
                .split("\n")
                .map((line, index, all) => {
                  if (index === all.length - 1 && line.trim().length === 0) {
                    return line;
                  } else {
                    return "  " + line;
                  }
                })
                .join("\n")
            );

      return colorFn(part.value);
    })
    .join("");
}
