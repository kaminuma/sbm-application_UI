import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // ルーターのインポート
import vuetify from './plugins/vuetify'; // Vuetifyのインポート

const app = createApp(App);
app.use(router); // ルーターをアプリに追加
app.use(vuetify).mount("#app");