import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import { THEME_CONFIG, generateVuetifyThemes } from "../config/theme";

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: THEME_CONFIG.DEFAULT_THEME,
    themes: generateVuetifyThemes()
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