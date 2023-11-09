#!/usr/bin/env yavascript
const version = require("./package.json").version;

const rootDir = new Path(__dirname);

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

// makes dist/combined.js
exec(`npm run bundle`);

const quickjsInfoJson = $([
  "node",
  "-e",
  `
      const quickjs = require("@suchipi/quickjs");
      const data = { platform: quickjs.identifyCurrentPlatform(), platforms: quickjs.platforms };
      console.log(JSON.stringify(data, null, 2));
    `,
]).stdout.trim();
type QuickjsPlatform = {
  name: string;
  architectures: Array<string>;
  os: string;
  abi: string;
  programSuffix: string;
};

const { platform, platforms } = JSON.parse(quickjsInfoJson) as {
  platform: QuickjsPlatform;
  platforms: Array<QuickjsPlatform>;
};

const quickjsRun = rootDir.concat(
  "node_modules/@suchipi/quickjs/build",
  platform.name,
  "bin/quickjs-run"
);

const fileToBytecodeJs = rootDir.concat(
  "node_modules/@suchipi/quickjs/build",
  platform.name,
  "bin/file-to-bytecode.js"
);

const byteCodePath = rootDir.concat("dist/combined.bin");
exec([quickjsRun, fileToBytecodeJs, "dist/combined.js", byteCodePath]);

for (const targetPlatform of platforms) {
  const qjsbootstrapBytecode = rootDir.concat(
    "node_modules/@suchipi/quickjs/build",
    targetPlatform.name,
    "bin/qjsbootstrap-bytecode" + targetPlatform.programSuffix
  );

  const targetPath = rootDir.concat(
    "dist",
    targetPlatform.name,
    "hopic" + targetPlatform.programSuffix
  );

  ensureDir(dirname(targetPath));

  // TODO yavascript cat needs to handle this case properly
  exec([
    "bash",
    "-c",
    `
      cat ${quote(qjsbootstrapBytecode)} ${quote(byteCodePath)} > ${quote(
      targetPath
    )}
    `,
  ]);

  chmod(
    // @ts-ignore TODO looks like chmod is typed incorrectly; this should allow partial objects
    { ug: "rwx", o: "rx" },
    targetPath
  );
}

const root = pwd();
const tarGzsPath = rootDir.concat("dist");

for (const targetPlatform of platforms) {
  const dir = tarGzsPath.concat(targetPlatform.name);
  copy("dist/LICENSE_ALL", Path.join(dir, "LICENSE"));

  try {
    cd(dir);
    exec([
      "tar",
      "-czvf",
      `${tarGzsPath}/hopic-${version}-${targetPlatform.name}.tar.gz`,
      ".",
    ]);
  } finally {
    cd(root);
  }
}
