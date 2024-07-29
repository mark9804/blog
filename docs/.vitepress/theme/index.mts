// https://vitepress.dev/guide/custom-theme
import { Message } from "@arco-design/web-vue";
import Theme from "vitepress/theme";
import ApperanceTransitionLayout from "./ApperanceTransitionLayout.vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import mediumZoom from "medium-zoom";
import { onMounted, watch, nextTick } from "vue";
import { useData } from "vitepress";

import "./style.scss";
import "uno.css";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export default {
  ...Theme,
  extends: Theme,
  setup() {
    const data = useData();
    function initZoom() {
      return mediumZoom(".main img", {
        background: "rgba(29, 33, 41, .6)",
      });
    }
    onMounted(() => {
      const zoomInstance = initZoom();
      zoomInstance.on("close", () => {
        zoomInstance.getZoomedImage().style.filter = "brightness(80%)";
      });
      zoomInstance.on("open", e => {
        const target = e.target as HTMLElement;
        const figCaption = (target.parentNode?.lastChild as HTMLElement)
          ?.innerHTML;
        const zoomedImage = zoomInstance.getZoomedImage();
        zoomedImage.title = figCaption || "";
      });
    });
    watch(
      () => data.page.value,
      () => nextTick(() => initZoom())
    );
  },
  Layout: ApperanceTransitionLayout,
  enhanceApp({ app, router, siteData }) {
    // ...
    app.use(pinia);
    Message._context = app._context;
  },
};
