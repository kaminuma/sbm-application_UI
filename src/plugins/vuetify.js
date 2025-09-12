import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#00bfa5', // 元の色を保持
          secondary: '#00acc1',
          background: '#f0f4f8', // 元の背景色を保持
          surface: '#ffffff', // 元のカード背景色を保持
          'settings-bg': 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', // カスタムプロパティ
        }
      },
      dark: {
        dark: true,
        colors: {
          background: '#121212',
          surface: '#1e1e1e',
          'surface-variant': '#2d2d2d',
          'on-background': '#e0e0e0',
          'on-surface': '#e0e0e0',
          primary: '#4fc3f7',
          secondary: '#81c784',
          accent: '#64b5f6',
          error: '#f44336',
          info: '#2196f3',
          success: '#4caf50',
          warning: '#ff9800',
        }
      }
    }
  },
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
});

export default vuetify;