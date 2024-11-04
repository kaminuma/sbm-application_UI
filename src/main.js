import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // ルーターのインポート
import store from './store';
import vuetify from './plugins/vuetify'; // Vuetifyのインポート
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';

const app = createApp(App);
app.use(router); // ルーターをアプリに追加
app.use(vuetify);
app.use(store);
app.mount('#app');