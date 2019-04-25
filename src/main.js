import Vue from "vue";
import App from "./App.vue";
import ListPage from "./ListPage.vue";
import DetailPage from "./DetailPage.vue";
import VueRouter from "vue-router";
require("./style/style.less");

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
  el: "#app",
  router,
  render: h => h(App)
}).$mount("#app");
