// https://vitepress.dev/guide/custom-theme
import { Message } from "@arco-design/web-vue";
import Theme from "vitepress/theme";
import ApperanceTransitionLayout from "./ApperanceTransitionLayout.vue";
import "./style.scss";

export default {
  ...Theme,
  extends: Theme,
  Layout: ApperanceTransitionLayout,
  enhanceApp({ app, router, siteData }) {
    // ...
    Message._context = app._context;
  },
};
