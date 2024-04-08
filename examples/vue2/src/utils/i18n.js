// 创建文件vueIN.js
import Vue from "vue";
import VueI18n from "vue-i18n";
Vue.use(VueI18n);

// 引入各个语言配置文件
import zh from "../../locales/zh-CN.json";
import en from "../../locales/en-US.json";

// 创建vue-i18n实例i18n
const i18n = new VueI18n({
  // 设置默认语言
  locale: "en", // 语言标识
  // 添加多语言（每一个语言标示对应一个语言文件）
  messages: {
    zh,
    en,
  },
});
// 暴露i18n
export default i18n;

export const $t = (key, slot) => {
  return i18n.t(key, slot);
};
