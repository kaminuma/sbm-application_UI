import { createRouter, createWebHistory } from "vue-router";
import store from "../store";
import ScheduleView from "../components/ScheduleView.vue";
import UploadView from "../components/UploadView.vue";
import Auth from "../components/Auth.vue";

const routes = [
  {
    path: "/auth",
    name: "Auth",
    component: Auth,
  },
  {
    path: "/schedule",
    name: "ScheduleView",
    component: ScheduleView,
    meta: { requiresAuth: true },
  },
  {
    path: "/upload",
    name: "UploadView",
    component: UploadView,
    meta: { requiresAuth: true },
  },
  {
    path: "/",
    redirect: "/auth",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated;

  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !isAuthenticated
  ) {
    next("/auth"); // 未認証の場合はログインページへ
  } else {
    next(); // 認証済みならそのまま遷移
  }
});

export default router;
