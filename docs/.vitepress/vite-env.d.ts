/// <reference types="vite/client" />

interface ViewTransition {
  finished: Promise<void>;
  ready: Promise<void>;
  updateCallbackDone: Promise<void>;
}

declare global {
  interface Document {
    startViewTransition(callback: () => Promise<void> | void): {
      ready: Promise<void>;
    };
  }
}

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
