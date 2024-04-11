const fs = require("fs");
const inquirer = require("inquirer");
const vueOptions = require("../utils/vueOptions");
const prettier = require("prettier");
const FileConf = require("../conf/FileConf");
const glob = require("glob");
const path = require("path");

function getLocaleFiles({ path, exclude }) {
  return glob.sync(`${path}/**/*.json`, {
    ignore: (exclude || []).map((e) => `${path}/${e}`),
  });
}

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
  const localePath = answers.localePath || "locales";
  const firstI18n = answers.firstI18n;

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

  let createTasks = [];
  const confService = new FileConf(options.localeConf.folder);

  if (firstI18n) {
    createTasks = options.supportedLocales.map((key) => {
      const value = {};
      return confService.createConf(value, key);
    });
  } else {
    // 非首次国际化，本地代码中已有国际化资源
    const locales = getLocaleFiles({ path: localePath });
    // 读取国际化资源
    const data = locales.map((element) => {
      // TODO: 支持国际化资源为 js 文件的情况，目前只支持为 json 文件。
      const json = fs.readFileSync(element, {
        encoding: "utf-8",
      });

      // 使用现有文件名为语言 key
      const key = path.parse(element).name;

      return {
        key,
        value: JSON.parse(json),
        confName: key,
      };
    });

    createTasks = data.map(({ value, key }) => {
      let commentValue = {};
      if (key !== options.primaryLocale) {
        commentValue = data.find((d) => d.key === options.primaryLocale).value;
      }
      return confService.createConf(value, key);
    });
  }

  const createTaskRes = await Promise.all(createTasks);
  console.log(createTaskRes);
};
