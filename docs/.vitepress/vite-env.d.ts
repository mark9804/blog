/// <reference types="vite/client" />

declare module "markdown-it-implicit-figures";

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elem: string]: any;
  }
}
