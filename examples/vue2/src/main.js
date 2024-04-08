import Vue from "vue";
import App from "./App.vue";
import i18n from "./utils/i18n.js";

Vue.config.productionTip = false;

new Vue({
  render: function (h) {
    return h(App);
  },
  i18n,
}).$mount("#app");
