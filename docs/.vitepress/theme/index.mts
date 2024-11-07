// https://vitepress.dev/guide/custom-theme
import { Message } from "@arco-design/web-vue";
import Theme from "vitepress/theme";
import ApperanceTransitionLayout from "./ApperanceTransitionLayout.vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import ArticleInfo from "./ArticleInfo.vue";
import { Image } from "@arco-design/web-vue";
import ImageGallery from "./ImageGallery.vue";
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'

import "@arco-design/web-vue/es/image/style/css.js"
import "@arco-design/web-vue/es/tooltip/style/css.js"
import "./style.scss";
import "uno.css";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export default {
  ...Theme,
  extends: Theme,
  setup() {},
  Layout: ApperanceTransitionLayout,
  enhanceApp({ app, router, siteData }) {
    // ...
    app.use(pinia).use(autoAnimatePlugin);
    Message._context = app._context;

    // register your custom global components
    app.component("ArticleInfo", ArticleInfo);
    app.component("ArcoImage", Image);
    app.component("ArcoImageGallery", ImageGallery);
  },
};
