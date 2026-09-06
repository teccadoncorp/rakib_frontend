const { execSync } = require("child_process");

if (process.env.OPENNEXT) {
  process.exit(0);
}

const onCloudflare =
  Boolean(process.env.WORKERS_CI) ||
  Boolean(process.env.CF_PAGES) ||
  /\/opt\/buildhome\//.test(process.cwd());

if (!onCloudflare) {
  process.exit(0);
}

execSync("npx opennextjs-cloudflare build", {
  stdio: "inherit",
  env: { ...process.env, OPENNEXT: "1" },
});
