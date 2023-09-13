import { defaultResolver } from "kame";

export const resolve = (id: string, fromFilePath: string) => {
  if (id.startsWith("quickjs:")) {
    return "external:" + id;
  }

  return defaultResolver.resolve(id, fromFilePath);
};
