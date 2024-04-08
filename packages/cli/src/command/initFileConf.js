const fs = require("fs");
const inquirer = require("inquirer");

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
  console.log(answers, "zlzzl answers");
};
