// https://vitepress.dev/guide/custom-theme
import { Message } from "@arco-design/web-vue";
import Theme from "vitepress/theme";
import MainLayout from "./layouts/MainLayout.vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import ArticleInfo from "./components/ArticleInfo.vue";
import { Image } from "@arco-design/web-vue";
import ElyImageGallery from "./components/ElysiumUI/ElyImageGallery.vue";
import ElySpace from "./components/ElysiumUI/ElySpace.vue";
import giscusTalk from "vitepress-plugin-comment-with-giscus";
import { useData, useRoute } from "vitepress";
import type { App } from "vue";

import "@arco-design/web-vue/es/image/style/css.js";
import "@arco-design/web-vue/es/tooltip/style/css.js";
import "./styles/main.scss";
import "uno.css";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export default {
  ...Theme,
  extends: Theme,
  setup() {
    const { frontmatter } = useData();
    const route = useRoute();

    // Giscus configuration
    giscusTalk(
      {
        repo: "mark9804/blog",
        repoId: "R_kgDOLo2yWA",
        category: "Announcements",
        categoryId: "DIC_kwDOLo2yWM4CknAK",
        mapping: "title",
        inputPosition: "top",
        lang: "zh-CN",
        loading: "lazy",
        reactionsEnabled: "1",
        emitMetadata: "0",
        theme: "preferred_color_scheme",
      },
      {
        frontmatter,
        route,
      },
      true // 默认在所有页面启用评论
    );
  },
  Layout: MainLayout,

  enhanceApp({ app }: { app: App }) {
    app.use(pinia);
    Message._context = app._context;

    // register your custom global components
    app
      .component("ArticleInfo", ArticleInfo)
      .component("ArcoImage", Image)
      .component("ElyImageGallery", ElyImageGallery)
      .component("ElySpace", ElySpace);
  },
};
