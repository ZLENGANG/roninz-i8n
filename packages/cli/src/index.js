const program = require("commander");
const options = require("../package.json");
const collect = require("./command/collect");

program
  .version(options.version)
  .option("-c, --config", "设置配置文件路径，默认是./roninz-i18n.config.js");

program
  .command("sync")
  .alias("s")
  .description("提取中文并同步配置文件")
  .action(() => {
    collect();
  })
  .on("--help", () => {
    console.log("  Examples:");
    console.log("");
    console.log("    $ roninz-i18n sync");
  });

module.exports = program;
