import Vue from "vue";
import VueRouter from "vue-router";
import MatrixCreator from "../views/MatrixCreator.vue";
import TrainPage from "../views/TrainPage.vue";

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
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: TrainPage,
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
