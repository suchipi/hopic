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

const targetDirs = glob("node_modules/yavascript/bin/*");
for (const targetDir of targetDirs) {
  const target = targetDir.segments.at(-1);

  const dotExe = target.match(/windows/) ? ".exe" : "";
  const outfile = new Path("./dist", target, "hopic" + dotExe);
  ensureDir(dirname(outfile));

  const bootstrapBin = targetDir
    .concat("yavascript-bootstrap" + dotExe)
    .toString();

  exec([
    "bash",
    "-c",
    `cat ${quote(bootstrapBin)} dist/index.js > ${quote(outfile.toString())}`,
  ]);

  chmod({ a: "rx", u: "rwx" }, outfile);

  echo(outfile.toString());

  const tarGzPath = Path.resolve("dist");

  copy("dist/LICENSE_ALL", Path.join(dirname(outfile), "LICENSE"));
  const dirBefore = pwd();
  try {
    cd(dirname(outfile));
    exec([
      "tar",
      "-czvf",
      `${tarGzPath}/hopic-${version}-${target}.tar.gz`,
      ".",
    ]);
  } finally {
    cd(dirBefore);
  }
}
