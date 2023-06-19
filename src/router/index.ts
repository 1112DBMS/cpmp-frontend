// Composables
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("../layout/Default.vue"),
    children: [
      {
        path: "",
        name: "Home",
        component: () =>
          import(/* webpackChunkName: "home" */ "../page/Index.vue"),
      },
      {
        path: "search",
        name: "Search",
        component: () =>
          import(/* webpackChunkName: "search" */ "../page/Search.vue"),
      },
      {
        path: "like",
        name: "LikeList",
        component: () =>
          import(/* webpackChunkName: "search" */ "../page/LikeList.vue"),
      }
    ],
  },
  {
    path: "/oauthCallback",
    name: "OauthCallback",
    component: () =>
      import(/* webpackChunkName: "home" */ "../page/OauthCallback.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
