// https://vitepress.dev/guide/custom-theme
import { Message } from "@arco-design/web-vue";
import Theme from "vitepress/theme";
import ApperanceTransitionLayout from "./ApperanceTransitionLayout.vue";
import "./style.scss";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
import "uno.css";

export default {
  ...Theme,
  extends: Theme,
  Layout: ApperanceTransitionLayout,
  enhanceApp({ app, router, siteData }) {
    // ...
    app.use(pinia);
    Message._context = app._context;
  },
};
