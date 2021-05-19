import Vue from "vue";
import VueRouter from "vue-router";
import MatrixCreator from "../views/MatrixCreator.vue";
import TrainPage from "../views/TrainPage.vue";
import ShortestPathPage from "../views/ShortestPathPage.vue";
import ChartReward from "../views/ChartReward.vue";

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
    path: "/shortest-path",
    name: "ShortestPathPage",
    component: ShortestPathPage,
  },
  {
    path: "/chart",
    name: "ChartReward",
    component: ChartReward,
    props: true,
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
