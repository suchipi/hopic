#!/usr/bin/env yavascript

remove("dist");

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
}

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
