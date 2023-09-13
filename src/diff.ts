import * as Diff from "diff";

export function diff(a: string, b: string): string {
  const diff = Diff.diffChars(a, b);

  return diff
    .map((part) => {
      // green for additions, red for deletions
      // grey for common parts
      const colorFn = part.added
        ? (s: string) => bold(green(s))
        : part.removed
        ? (s: string) => bold(red(s))
        : grey;

      return colorFn(part.value);
    })
    .join("");
}
