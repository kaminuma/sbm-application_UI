import { createRouter, createWebHistory } from "vue-router";
import store from "../store";
import ScheduleView from "../components/ScheduleView.vue";
import UploadView from "../components/UploadView.vue";
import Auth from "../components/Auth.vue";
import AnalyzeView from "../components/AnalyzeView.vue";
import MoodView from "../components/MoodView.vue";
import TermsOfService from "../components/TermsOfService.vue";
import PrivacyPolicy from "../components/PrivacyPolicy.vue";
import PasswordChange from "../components/PasswordChange.vue";
import LoginCallback from "../components/LoginCallback.vue";

const routes = [
  {
    path: "/auth",
    name: "Auth",
    component: Auth,
    meta: { requiresGuest: true },
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
    path: "/analyze",
    name: "AnalyzeView",
    component: AnalyzeView,
    meta: { requiresAuth: true },
  },
  {
    path: "/mood",
    name: "MoodView",
    component: MoodView,
    meta: { requiresAuth: true },
  },
  {
    path: "/",
    name: "LandingPage",
    component: () => import("../components/LandingPage.vue"),
    meta: { requiresGuest: true }
  },
  {
    path: "/terms",
    name: "TermsOfService",
    component: TermsOfService
  },
  {
    path: "/privacy",
    name: "PrivacyPolicy",
    component: PrivacyPolicy
  },
  {
    path: "/password-change",
    name: "PasswordChange",
    component: PasswordChange,
    meta: { requiresAuth: true },
  },
  {
    path: "/login/callback",
    name: "LoginCallback",
    component: LoginCallback
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // すべてのページ遷移でスクロール位置をリセット
    return { top: 0 }
  }
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated;
  console.log(`[Router Guard] Navigating to: ${to.path}, Auth state: ${isAuthenticated}`);

  // ルートパスへのアクセス時は常に認証状態に関わらずLandingPageコンポーネントを表示
  if (to.path === '/') {
    console.log('[Router Guard] Always allowing access to landing page');
    next();
    return;
  }

  // 認証が必要なルートに未認証でアクセス
  if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
    console.log(`[Router Guard] Unauthenticated access to protected route: ${to.path}, redirecting to landing page`);
    next({ path: "/", query: { redirect: to.fullPath } }); // ランディングページへリダイレクト（リダイレクト先を保存）
    return;
  }
  
  // ゲスト専用ルート（ランディングページ、認証ページなど）に認証済みでアクセス
  if (to.matched.some((record) => record.meta.requiresGuest) && isAuthenticated) {
    console.log(`[Router Guard] Authenticated user accessing guest-only route: ${to.path}, redirecting to schedule`);
    next("/schedule"); // 認証済みならスケジュールページへ
    return;
  }
  
  // それ以外はそのまま遷移
  console.log(`[Router Guard] Navigation allowed to: ${to.path}`);
  next();
});

export default router;
