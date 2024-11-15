// https://vitepress.dev/guide/custom-theme
import { Message } from "@arco-design/web-vue";
import Theme from "vitepress/theme";
import MainLayout from "./layouts/MainLayout.vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import ArticleInfo from "./components/deprecated/ArticleInfo.vue";
import { Image } from "@arco-design/web-vue";
import ImageGallery from "./components/deprecated/ImageGallery.vue";
import { autoAnimatePlugin } from "@formkit/auto-animate/vue";

import "@arco-design/web-vue/es/image/style/css.js";
import "@arco-design/web-vue/es/tooltip/style/css.js";
import "./styles/main.scss";
import "uno.css";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export default {
  ...Theme,
  extends: Theme,
  setup() {},
  Layout: MainLayout,
  enhanceApp({ app, router, siteData }) {
    app.use(pinia).use(autoAnimatePlugin);
    Message._context = app._context;

    // register your custom global components
    // Space 组件已经在 ArcoImageGallery 中使用了，会自动导入
    app
      .component("ArticleInfo", ArticleInfo)
      .component("ArcoImage", Image)
      .component("ArcoImageGallery", ImageGallery);
  },
};
