import Vue from "vue";
import App from "./App.vue";
import ListPage from "./ListPage.vue";
import DetailPage from "./DetailPage.vue";
import VueRouter from "vue-router";
import BootstrapVue from "bootstrap-vue";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "./assets/style/style.less";

Vue.use(BootstrapVue);
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: ListPage
  },
  {
    path: "/detail/:req_no?",
    component: DetailPage
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
