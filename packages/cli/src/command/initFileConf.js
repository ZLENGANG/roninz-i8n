const fs = require("fs");
const inquirer = require("inquirer");
const vueOptions = require("../utils/vueOptions");
const prettier = require("prettier");

async function doInquire() {
  let isConfigFileExist = true;
  try {
    fs.accessSync("./roninz-i18n.config.js");
  } catch (error) {
    isConfigFileExist = false;
  }

  // 配置文件是否已存在
  if (isConfigFileExist) {
    const ans = await inquirer.prompt([
      {
        name: "overwrite",
        type: "confirm",
        message: "配置文件roninz-i18n.cofig.js已存在，是否覆盖？",
      },
    ]);

    if (!ans.overwrite) process.exit(0);
  }

  // 是否第一次国际化
  let ans = await inquirer.prompt([
    {
      name: "firstI18n",
      type: "confirm",
      message: "是否初次国际化？",
    },
    {
      name: "localePath",
      type: "input",
      message: "请输入现有国际化资源路径：",
      when(answers) {
        return !answers.firstI18n;
      },
    },
  ]);

  return ans;
}

module.exports = async function initFileConf(isVue) {
  const answers = await doInquire();
  const { localePath = "locals", firstI18n } = answers;
  const defaultOpts = vueOptions;
  const options = {
    ...defaultOpts,
    localeConf: { type: "file", folder: localePath },
  };

  // 创建配置文件
  fs.writeFileSync(
    "./roninz-i18n.config.js",
    prettier.format("module.exports = " + JSON.stringify(options), {
      parser: "babel",
      singleQuote: true,
      trailingComma: "es5",
    }),
    "utf8"
  );
};
