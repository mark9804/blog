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
