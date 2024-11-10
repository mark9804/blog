---
title: 在 VitePress 中获取全部文章列表
description:
tags:
  - 前端
  - VitePress
---

# 在 VitePress 中获取全部文章列表

对于个人博客来说，在首页展示文章列表是很常用的一个功能。但是 VitePress 是面向产品设计的，所以并没有提供个人博客需要的列表功能，因此我们需要借助 [createContentLoader](https://vitepress.dev/guide/data-loading#createcontentloader) 这个 helper 函数来获取全文列表。

:::warning

- VitePress 版本必须大等于 1.0.0-alpha.53 (2023-03-13) 才可以使用这个函数。
- 请务必注意这个函数只能在文件名为 `*.data.{js,ts}` 的文件中使用，否则 VitePress 会告诉你没有这个函数。
  :::

:::tip
如果你喜欢折腾，也可以用 `createContentLoader` 自己实现一个自动侧边栏功能（如果你需要在 `config.{js,ts,mts}` 中使用，应该异步调用 `createContentLoader`）；

如果你和我一样喜欢偷懒，可以使用 [现成的插件](https://vitepress-sidebar.jooy2.com/getting-started)。
:::

## 使用方法

在任意位置新建一个 `xxx.data.ts` 文件，然后在文件中使用 `createContentLoader` 函数：

:::code-group

```ts [posts.data.ts]
import { createContentLoader } from "vitepress";

export default createContentLoader("**/*.md" /* options */);
// "**/*.md": 匹配 docs 文件夹（包含子文件夹）内的所有 md 文件
```

```vue [TableOfContents.vue]
<script setup lang="ts">
import { data as usePosts } from "../helper/posts.data";
import TableOfContent from "./TableOfContent.vue";
const useContents = usePosts;
</script>

<template>
  <ul class="toc">
    <li v-for="content in useContents" :key="content.url">
      <table-of-content :content="content"></table-of-content>
    </li>
  </ul>
</template>
```

:::
