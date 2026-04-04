// https://vitepress.dev/guide/custom-theme
import Theme from "vitepress/theme";
import MainLayout from "./layouts/MainLayout.vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import ArticleInfo from "./components/ArticleInfo.vue";
import ElyImage from "./components/ElysiumUI/ElyImage.vue";
import ElyImageGallery from "./components/ElysiumUI/ElyImageGallery.vue";
import ElySpace from "./components/ElysiumUI/ElySpace.vue";
import FootnoteRef from "./components/FootnoteRef.vue";

import type { App } from "vue";

import "./styles/main.scss";
import "uno.css";

// 已经装了 unocss，不需要引入
// import "@nolebase/vitepress-plugin-git-changelog/client/style.css";

const pinia = createPinia();

export default {
  ...Theme,
  extends: Theme,

  Layout: MainLayout,

  enhanceApp({ app }: { app: App }) {
    if (!import.meta.env.SSR) {
      pinia.use(piniaPluginPersistedstate);
    }

    app.use(pinia);

    // register your custom global components
    app
      .component("ArticleInfo", ArticleInfo)
      .component("ElyImage", ElyImage)
      .component("ElyImageGallery", ElyImageGallery)
      .component("ElySpace", ElySpace)
      .component("FootnoteRef", FootnoteRef);
  },
};
