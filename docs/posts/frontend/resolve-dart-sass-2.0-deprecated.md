---
title: 解决 Dart Sass 警告 `Legacy JS API deprecated`
tags:
  - 前端
  - Sass
---

# 解决 Dart Sass 警告 `Legacy JS API deprecated`

随着 Dart Sass 开始为 2.0 甚至 3.0 版本做准备，新版 Sass 会在使用 `legacy API` 时发出警告：

```
DEPRECATION WARNING: The legacy JS API is deprecated and will be removed in Dart Sass 2.0.0.

More info: https://sass-lang.com/d/legacy-js-api
```

根据 [Vite 配置文档](https://vite.dev/config/shared-options#css-preprocessoroptions) 的描述，Vite 默认使用的是 Sass API 类型是 `legacy`。所以只要将传入 Sass 的选项 `css.preprocessorOptions.api` 设置为 `"modern"` 或者 `"modern-compiler"` 即可（两个等价）。

完整配置如下：

```ts
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
});
```
