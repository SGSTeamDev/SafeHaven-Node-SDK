const fs = require("node:fs");
const { execFileSync } = require("node:child_process");

const stagedFiles = execFileSync("git", ["diff", "--cached", "--name-only", "--diff-filter=ACMR"], {
  encoding: "utf8",
}).split("\n").filter(Boolean);
const repositoryFiles = execFileSync("git", ["ls-files"], { encoding: "utf8" })
  .split("\n")
  .filter(Boolean);
const filesToScan = stagedFiles.length ? stagedFiles : repositoryFiles;

const forbiddenFiles = /(^|\/)(\.env(?:\..*)?|\.npmrc|id_rsa(?:\..*)?)$/i;
const forbiddenContent = /(-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|npm_[A-Za-z0-9_-]{20,}|(?:ghp|github_pat)_[A-Za-z0-9_]{20,})/;

const invalidFile = filesToScan.find((file) => forbiddenFiles.test(file));
if (invalidFile) {
  throw new Error(`Refusing staged credential file: ${invalidFile}`);
}

const contentToScan = stagedFiles.length
  ? execFileSync("git", ["diff", "--cached", "--unified=0", "--diff-filter=ACMR"], { encoding: "utf8" })
      .split("\n")
      .filter((line) => line.startsWith("+") && !line.startsWith("+++"))
      .join("\n")
  : filesToScan.map((file) => fs.readFileSync(file, "utf8")).join("\n");
if (forbiddenContent.test(contentToScan)) {
  throw new Error("Refusing staged content that resembles a credential or private key");
}

process.stdout.write("Repository validation passed.\n");
