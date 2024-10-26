import { createRouter, createWebHistory } from 'vue-router';
import ScheduleView from '../components/ScheduleView.vue';
import UploadView from '../components/UploadView.vue';
import Auth from '../components/Auth.vue';

const routes = [
  {
    path: '/',
    name: 'Auth', // デフォルトで表示されるコンポーネント
    component: Auth, // ログインコンポーネントを表示
  },
  {
    path: '/schedule',
    name: 'ScheduleView',
    component: ScheduleView, // デフォルトで表示されるコンポーネント
  },
  {
    path: '/upload',
    name: 'UploadView',
    component: UploadView, // 一括アップロード画面
  },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL), // process.env.BASE_URLをimport.meta.env.BASE_URLに変更
    routes,
  });

export default router;