const fs = require("node:fs");

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
const packageLock = JSON.parse(fs.readFileSync("package-lock.json", "utf8"));
const changelog = fs.readFileSync("CHANGELOG.md", "utf8");
const { execFileSync } = require("node:child_process");

if (execFileSync("git", ["status", "--porcelain"], { encoding: "utf8" }).trim()) {
  throw new Error("Release validation requires a clean working tree");
}

if (!packageJson.version || packageLock.version !== packageJson.version || packageLock.packages?.[""]?.version !== packageJson.version) {
  throw new Error("package.json and package-lock.json must contain the same version");
}

const escapedVersion = packageJson.version.replaceAll(".", "\\.");
const releaseHeading = new RegExp(`^## \\[?${escapedVersion}\\]? - \\d{4}-\\d{2}-\\d{2}$`, "m");
if (!releaseHeading.test(changelog)) {
  throw new Error(`CHANGELOG.md must contain a dated heading for ${packageJson.version}`);
}

for (const file of ["README.md", "CHANGELOG.md"]) {
  if (!fs.existsSync(file)) {
    throw new Error(`Required release document is missing: ${file}`);
  }
}

if (process.env.GITHUB_REF_NAME?.startsWith("v") && process.env.GITHUB_REF_NAME.slice(1) !== packageJson.version) {
  throw new Error(`GitHub release tag ${process.env.GITHUB_REF_NAME} does not match package version ${packageJson.version}`);
}

process.stdout.write(`Release validation passed for ${packageJson.name}@${packageJson.version}.\n`);
