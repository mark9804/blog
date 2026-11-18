// https://vitepress.dev/guide/custom-theme
import Theme from "vitepress/theme-without-fonts";
import { createPinia } from "pinia";
import type { App } from "vue";
import MainLayout from "./layouts/MainLayout.vue";

import "./styles/main.scss";
import "uno.css";
import "vue-sonner/style.css";

export default {
  extends: Theme,

  Layout: MainLayout,

  enhanceApp({ app }: { app: App }) {
    const pinia = createPinia();
    app.use(pinia);
  },
};
