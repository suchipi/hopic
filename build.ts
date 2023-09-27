#!/usr/bin/env yavascript
const version = require("./package.json").version;

if (exists("dist")) {
  remove("dist");
}
ensureDir("dist");

const ysLicenseText = $([os.execPath(), "--license"]).stdout.trim();
const diffLicenseText =
  `-------------- diff (npm package) --------------` +
  "\n\n" +
  readFile("node_modules/diff/LICENSE");
const hopicLicenseText =
  `-------------- hopic --------------` + "\n\n" + readFile("LICENSE");

writeFile(
  "dist/LICENSE_ALL",
  [ysLicenseText, diffLicenseText, hopicLicenseText].join("\n\n")
);
echo("./dist/LICENSE_ALL");

exec(`npm run bundle`);

exec([
  "deps/qjsbundle/qjsbundle",
  "dist/combined.js",
  "dist/[PLATFORM]/hopic",
  "--mode",
  "release",
]);

const root = pwd();
const tarGzsPath = Path.resolve("dist");

for (const dir of ls("dist").filter((path) => isDir(path))) {
  const target = basename(dir);

  copy("dist/LICENSE_ALL", Path.join(dir, "LICENSE"));

  try {
    cd(dir);
    exec([
      "tar",
      "-czvf",
      `${tarGzsPath}/hopic-${version}-${target}.tar.gz`,
      ".",
    ]);
  } finally {
    cd(root);
  }
}
