import Vue from "vue";
import VueRouter from "vue-router";
import MatrixCreator from "../views/MatrixCreator.vue";
import TrainPage from "../views/TrainPage.vue";
import ShortestPathPage from "../views/ShortestPathPage.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Matrix Creator",
    component: MatrixCreator,
  },
  {
    path: "/train-page",
    name: "TrainPage",
    component: TrainPage,
  },
  {
    path: "/shotest-path",
    name: "ShortestPathPage",
    component: ShortestPathPage,
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
