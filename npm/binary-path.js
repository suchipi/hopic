var path = require("path");

var distDir = path.resolve(__dirname, "..", "dist");

function getBinaryPath(platformAndArch) {
  switch (platformAndArch) {
    case "darwin-arm64": {
      return path.join(distDir, "aarch64-apple-darwin", "hopic");
    }
    case "darwin-x64": {
      return path.join(distDir, "x86_64-apple-darwin", "hopic");
    }
    case "linux-arm64": {
      return path.join(distDir, "aarch64-unknown-linux-static", "hopic");
    }
    case "linux-x64": {
      return path.join(distDir, "x86_64-unknown-linux-static", "hopic");
    }
    case "win32-x64": {
      return path.join(distDir, "x86_64-pc-windows-static", "hopic.exe");
    }
    default: {
      throw new Error("Unsupported platform: " + platformAndArch);
    }
  }
}

var binaryPath = getBinaryPath(process.platform + "-" + process.arch);

module.exports = {
  getBinaryPath: getBinaryPath,
  binaryPath: binaryPath,
};
