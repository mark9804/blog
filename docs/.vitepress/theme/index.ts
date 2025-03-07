// https://vitepress.dev/guide/custom-theme
import { Message } from "@arco-design/web-vue";
import Theme from "vitepress/theme";
import MainLayout from "./layouts/MainLayout.vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import ArticleInfo from "./components/ArticleInfo.vue";
import ElyImage from "./components/ElysiumUI/ElyImage.vue";
import ElyImageGallery from "./components/ElysiumUI/ElyImageGallery.vue";
import ElySpace from "./components/ElysiumUI/ElySpace.vue";
import giscusTalk from "vitepress-plugin-comment-with-giscus";
import { useData, useRoute } from "vitepress";
import type { App } from "vue";
import { NolebaseGitChangelogPlugin } from "@nolebase/vitepress-plugin-git-changelog/client";

import "@arco-design/web-vue/es/tooltip/style/css.js";
import "./styles/main.scss";
import "uno.css";

import { giscusConfig } from "../configs/giscusConfig";

// 已经装了 unocss，不需要引入
// import "@nolebase/vitepress-plugin-git-changelog/client/style.css";

const pinia = createPinia();

export default {
  ...Theme,
  extends: Theme,
  setup() {
    const { frontmatter } = useData();
    const route = useRoute();

    // Giscus configuration
    giscusTalk(giscusConfig, { frontmatter, route }, true);
  },
  Layout: MainLayout,

  enhanceApp({ app }: { app: App }) {
    if (!import.meta.env.SSR) {
      pinia.use(piniaPluginPersistedstate);
    }

    app.use(pinia);
    Message._context = app._context;

    // register your custom global components
    app
      .component("ArticleInfo", ArticleInfo)
      .component("ElyImage", ElyImage)
      .component("ElyImageGallery", ElyImageGallery)
      .component("ElySpace", ElySpace)
      .use(NolebaseGitChangelogPlugin, {
        displayAuthorsInsideCommitLine: true,
      });
  },
};
