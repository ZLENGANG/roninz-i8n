const path = require("path");
const fs = require("fs");
const cwdPath = process.cwd();
const BaseConf = require("./BaseConf");

module.exports = class FileConf extends BaseConf {
  constructor(folder) {
    super();
    this.localesDir = folder;
  }

  /**
   * 创建一个配置
   * @param {object} values    KV值
   * @param {string} key       locales标识
   */
  createConf(values, key) {
    const folder = this.localesDir.startsWith("/")
      ? this.localesDir
      : path.join(cwdPath, this.localesDir);

    try {
      fs.accessSync(folder);
    } catch (error) {
      fs.mkdirSync(folder);
    }

    const configFilePath = path.join(folder, `${key}.json`);
    return new Promise((resolve, reject) => {
      fs.writeFile(configFilePath, JSON.stringify(values, null, 2), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(configFilePath);
        }
      });
    });
  }
};
