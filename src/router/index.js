import { createRouter, createWebHistory } from 'vue-router';
import ScheduleView from '../components/ScheduleView.vue';
import UploadView from '../components/UploadView.vue';
import Auth from '../components/Auth.vue';
import store from '../store';  // Vuexストアをインポート

const routes = [
  {
    path: '/auth',
    name: 'Auth', // デフォルトで表示されるコンポーネント
    component: Auth, // ログインコンポーネントを表示
  },
  {
    path: '/schedule',
    name: 'ScheduleView',
    component: ScheduleView, // デフォルトで表示されるコンポーネント
    meta: { requiresAuth: true },
  },
  {
    path: '/upload',
    name: 'UploadView',
    component: UploadView, // 一括アップロード画面
    meta: { requiresAuth: true },
  },
  {
    path: '/',
    redirect: '/auth', // デフォルトでログインページにリダイレクト
  },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL), // process.env.BASE_URLをimport.meta.env.BASE_URLに変更
    routes,
  });

  router.beforeEach((to, from, next) => {
    const isAuthenticated = store.state.isAuthenticated;
    if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
      next('/auth'); // 認証が必要なページにアクセスする場合、未認証ならログインページへ遷移
    } else {
      next(); // 認証済みならそのまま遷移
    }
  });

export default router;