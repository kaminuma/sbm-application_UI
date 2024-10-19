import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  define: {
    'process.env': {
      BASE_URL: process.env.VITE_BASE_URL, // 環境変数を定義
    },
  },
});
