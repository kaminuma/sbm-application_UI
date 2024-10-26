import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // ルーターのインポート
import store from './store';
import vuetify from './plugins/vuetify'; // Vuetifyのインポート

const app = createApp(App);
app.use(router); // ルーターをアプリに追加
app.use(vuetify);
app.use(store);
app.mount('#app');