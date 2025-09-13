import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // ルーターのインポート
import store from './store';
import vuetify from './plugins/vuetify'; // Vuetifyのインポート
import i18n from './i18n'
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const app = createApp(App);
app.use(router); // ルーターをアプリに追加
app.use(vuetify);
app.use(i18n);
app.use(store);
app.mount('#app');
app.component('VueDatePicker', VueDatePicker);