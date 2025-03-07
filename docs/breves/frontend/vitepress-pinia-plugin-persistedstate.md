---
title: 在 VitePress 中正确使用 pinia-plugin-persistedstate
tags:
  - 前端
  - VitePress
  - Pinia
---

# 在 VitePress 中正确使用 pinia-plugin-persistedstate

[pinia-plugin-persistedstate](https://github.com/prazdevs/pinia-plugin-persistedstate) 是 Vue 全家桶开发中非常实用的状态管理插件，可以帮我们零配置实现状态的轻量化存储（不超过 localStorage 5MB 存储限制的前提下）。他提供了 CSR 以及 Nuxt 两个包体，能够满足不同情况下的需求——当然是大部分情况，不然就没有这篇文章了。

VitePress 虽然是一个 SSR（SSG）框架，但是它和 Nuxt 的架构可以说是天差地别，因此在使用 persistedstate 插件的时候不能使用 Nuxt 的插件。如果按照传统 CSR 开发模式直接挂载到 `App` 上面呢？我们来试试看：

:::code-group

```ts [.vitepress/theme/index.ts]
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export default {
  // ...
  enhanceApp({ app }: { app: App }) {
    app.use(pinia);
  },
};
```

:::

这么一通操作过后，我们会发现插件确实能够正常读写 localStorage，并且状态也能持久化保存，控制台也很干净。不过一旦我们开始构建页面，就会发现一个 `ReferenceError: window is not defined` 报错：

:::details 完整报错信息

```bash
- rendering pages...
ReferenceError: window is not defined
    at file:///home/runner/work/blog/blog/node_modules/.pnpm/pinia-plugin-persistedstate@4.2.0_pinia@3.0.1_typescript@5.7.3_vue@3.5.13_typescript@5.7.3___rollup@4.34.8/node_modules/pinia-plugin-persistedstate/dist/index.js:94:50
    at Array.map (<anonymous>)
    at createPersistence (file:///home/runner/work/blog/blog/node_modules/.pnpm/pinia-plugin-persistedstate@4.2.0_pinia@3.0.1_typescript@5.7.3_vue@3.5.13_typescript@5.7.3___rollup@4.34.8/node_modules/pinia-plugin-persistedstate/dist/index.js:62:43)
    at file:///home/runner/work/blog/blog/node_modules/.pnpm/pinia-plugin-persistedstate@4.2.0_pinia@3.0.1_typescript@5.7.3_vue@3.5.13_typescript@5.7.3___rollup@4.34.8/node_modules/pinia-plugin-persistedstate/dist/index.js:85:5
    at file:///home/runner/work/blog/blog/node_modules/.pnpm/pinia@3.0.1_typescript@5.7.3_vue@3.5.13_typescript@5.7.3_/node_modules/pinia/dist/pinia.mjs:1639:43
    at EffectScope.run (/home/runner/work/blog/blog/node_modules/.pnpm/@vue+reactivity@3.5.13/node_modules/@vue/reactivity/dist/reactivity.cjs.prod.js:77:16)
    at file:///home/runner/work/blog/blog/node_modules/.pnpm/pinia@3.0.1_typescript@5.7.3_vue@3.5.13_typescript@5.7.3_/node_modules/pinia/dist/pinia.mjs:1639:33
    at Array.forEach (<anonymous>)
    at createSetupStore (file:///home/runner/work/blog/blog/node_modules/.pnpm/pinia@3.0.1_typescript@5.7.3_vue@3.5.13_typescript@5.7.3_/node_modules/pinia/dist/pinia.mjs:1626:14)
    at useStore (file:///home/runner/work/blog/blog/node_modules/.pnpm/pinia@3.0.1_typescript@5.7.3_vue@3.5.13_typescript@5.7.3_/node_modules/pinia/dist/pinia.mjs:1693:17)
    at setup (file:///home/runner/work/blog/blog/docs/.vitepress/.temp/app.js:5497:19)
    at _sfc_main$5.setup (file:///home/runner/work/blog/blog/docs/.vitepress/.temp/app.js:5618:25)
    at callWithErrorHandling (/home/runner/work/blog/blog/node_modules/.pnpm/@vue+runtime-core@3.5.13/node_modules/@vue/runtime-core/dist/runtime-core.cjs.prod.js:86:19)
    at setupStatefulComponent (/home/runner/work/blog/blog/node_modules/.pnpm/@vue+runtime-core@3.5.13/node_modules/@vue/runtime-core/dist/runtime-core.cjs.prod.js:6292:25)
    at setupComponent (/home/runner/work/blog/blog/node_modules/.pnpm/@vue+runtime-core@3.5.13/node_modules/@vue/runtime-core/dist/runtime-core.cjs.prod.js:6279:36)
    at renderComponentVNode (/home/runner/work/blog/blog/node_modules/.pnpm/@vue+server-renderer@3.5.13_vue@3.5.13_typescript@5.7.3_/node_modules/@vue/server-renderer/dist/server-renderer.cjs.prod.js:376:15)
    at renderVNode (/home/runner/work/blog/blog/node_modules/.pnpm/@vue+server-renderer@3.5.13_vue@3.5.13_typescript@5.7.3_/node_modules/@vue/server-renderer/dist/server-renderer.cjs.prod.js:507:14)
    at renderComponentSubTree (/home/runner/work/blog/blog/node_modules/.pnpm/@vue+server-renderer@3.5.13_vue@3.5.13_typescript@5.7.3_/node_modules/@vue/server-renderer/dist/server-renderer.cjs.prod.js:459:7)
    at renderComponentVNode (/home/runner/work/blog/blog/node_modules/.pnpm/@vue+server-renderer@3.5.13_vue@3.5.13_typescript@5.7.3_/node_modules/@vue/server-renderer/dist/server-renderer.cjs.prod.js:394:12)
    at renderToString (/home/runner/work/blog/blog/node_modules/.pnpm/@vue+server-renderer@3.5.13_vue@3.5.13_typescript@5.7.3_/node_modules/@vue/server-renderer/dist/server-renderer.cjs.prod.js:674:24)
    at render (file:///home/runner/work/blog/blog/docs/.vitepress/.temp/app.js:46290:23)
    at async renderPage (file:///home/runner/work/blog/blog/node_modules/.pnpm/vitepress@1.6.3_@algolia+client-search@5.15.0_@types+node@22.13.5_async-validator@4.2.5_73047115cd463be043da7398d51dd987/node_modules/vitepress/dist/node/chunk-Zsoi3j4v.js:49377:19)
    at async pMap.concurrency (file:///home/runner/work/blog/blog/node_modules/.pnpm/vitepress@1.6.3_@algolia+client-search@5.15.0_@types+node@22.13.5_async-validator@4.2.5_73047115cd463be043da7398d51dd987/node_modules/vitepress/dist/node/chunk-Zsoi3j4v.js:49624:11)
    at async file:///home/runner/work/blog/blog/node_modules/.pnpm/vitepress@1.6.3_@algolia+client-search@5.15.0_@types+node@22.13.5_async-validator@4.2.5_73047115cd463be043da7398d51dd987/node_modules/vitepress/dist/node/chunk-Zsoi3j4v.js:4505:20
✓ rendering pages...
```

:::

这是因为在构建的时候，VitePress 会在 Node.js 环境中将 Vue 组件预渲染成 HTML 字符串模板，用户在访问页面的时候，Vue 会先获取字符串模板展示给用户，在展示的过程中再激活 (hydrate) 页面中能与用户交互的组件。而 persistedstate 插件的问题就出在预渲染阶段。因为整个预渲染过程都在 Node.js 环境中进行，而 windows 对象只存在于浏览器环境中，所以就报错了。而在开发环境下 VitePress 会在浏览器中激活对应的组件，因此不会出现这个问题。

## 解决方案

如果需要访问 windows 对象的代码处于一个 Vue 组件中，我们姑且还可以使用 `<ClientOnly>` 代码块来包裹，这会指示 VitePress 在预渲染阶段跳过这部分被包裹的内容。然而 persistedstate 插件代码是在 Vue 的挂载阶段被执行的，执行顺序远远早于模板解析，因此这个方案是不可行的。因此我们需要自己立一个 flag 来在 SSR 阶段跳过 persistedstate 插件的挂载。（因为挂载了也没用）

在所有使用 Vite 作为构建工具的 Vue 项目中，我们都可以通过 [`import.meta.env`](https://vite.dev/guide/env-and-mode.html#built-in-constants) 来判断当前的环境。在这里我们使用 `import.meta.env.SSR` 来判断当前是否在进行 SSR 预渲染，如果是的话就跳过挂载。

:::code-group

```ts [.vitepress/theme/index.ts]
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export default {
  // ...
  enhanceApp({ app }: { app: App }) {
    if (!import.meta.env.SSR) {
      pinia.use(piniaPluginPersistedstate);
    }

    app.use(pinia);
  },
};
```

:::

这样我们就可以选择只在客户端环境下才将 pinia-plugin-persistedstate 插件挂载到 pinia 实例上，从而在避免 SSR 阶段报错的同时又能正常在浏览器中运行。
