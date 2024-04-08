const program = require("./src");
const initFileConf = require("./src/command/initFileConf");

program
  .command("init")
  .alias("i")
  .description("初始化本地配置")
  .option("--vue2", "初始化vue2项目")
  .action((options) => {
    initFileConf(options.vue2);
  })
  .on("--help", function () {
    console.log("  Examples:");
    console.log();
    console.log("    $ roninz-i18n-cli init -c ./config/prod.config.js");
    console.log();
  });

program.command("*").action((cmd) => {
  console.log('unknown command "%s"', cmd);
});

program.parse(process.argv);
