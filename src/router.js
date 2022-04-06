import { createWebHistory, createRouter } from "vue-router";

const routes =  [
  {
    path: "/",
    alias: "/trendingSoon",
    name: "trendingSoon",
    component: () => import("./components/TrendingSoon")
  },
  {
    path: "/add",
    name: "add",
    component: () => import("./components/AddTutorial")
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;