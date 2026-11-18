---
title: 在 VitePress 中集成图册
description: 使用 Markdown 自定义容器，在 VitePress 中实现图册功能
tags:
  - VitePress
  - Vue
  - 自定义
ai_usage: false
---

# 在 VitePress 中加入图册功能

VitePress 的设计用途是技术文档，博客功能没有 WordPress 等 CMS 强大，对于图片也没有做过多特别处理，没有常用的放大和相册功能。

之前的放大功能我是用 [medium-zoom](https://medium-zoom.francoischalifour.com/) 实现的，因为其是为完全静态的网站设计的，只能作用于当前页面，所以采取了一些[比较脏的手段](https://github.com/mark9804/blog/blob/c89a394d946145d775559db5457b0f8da10e68f7/docs/.vitepress/theme/index.mts#L23-L44)让它在路由切换时也能正常工作。

但是随着我开始记录游记，问题就出现了。我本身是一个摄影爱好者，每次出远门后经过粗筛的照片一天下来有可能达到将近 200 张，如果写文章时每张图都单独开一段的话文章内容会显得非常割裂，尺寸占比过大的图片也很影响阅读体验。因此我需要添加一个图库功能，让主题相同的图片集中在一起方便阅读。

![今年夏天出国的时候拍的，张数个位数的天数基本是因为是那天要参加学会 =128x](https://cdn.sa.net/2024/11/09/lYRAJeTcD5bzXaF.jpg)

### 效果展示

:::gallery 炼金术博物馆内部
![](https://cdn.sa.net/2024/11/08/B6tznhbCkDWgsAE.webp)
![](https://cdn.sa.net/2024/11/08/C5XZL4M3NeUkWuA.webp)
![](https://cdn.sa.net/2024/11/08/Pzk5Y7hjS3NJ1E6.webp)
![](https://cdn.sa.net/2024/11/08/rz4AOiBUWJTFxfl.webp)
![](https://cdn.sa.net/2024/11/08/neQrdAT7BJ9DpkW.webp)
:::

[这篇文章](../life/view-finder-europe-prague-1) 中也大量使用了图册功能。

## 实现

### 添加图库语法

我很喜欢 VitePress 提供的[自定义容器](https://vitepress.dev/zh/guide/markdown#custom-containers)功能，因此我选择了一个相似的语法作为图库语法：

```markdown
:::gallery 图册名称
![图片描述](图片链接)
![图片描述](图片链接)
![图片描述](图片链接)
:::
```

### 捕获语法

接下来需要在 VitePress 的解析阶段捕获并处理这个语法，并生成对应的 HTML 模板。VitePress 会进一步将这个模板渲染为 Vue 组件。

首先看捕获。VitePress 使用 [markdown-it](https://github.com/markdown-it/markdown-it) 作为 Markdown 解析器，因此只需要按照 API 文档添加一个自定义规则即可。

:::code-group

```ts [.vitepress/config.ts]
export default defineConfig({
  // ...
  markdown: {
    // ...
    config: md => {
      // ...
      md.core.ruler.push("gallery", state => {
        state.tokens.forEach((token, idx) => {
          if (token?.content?.includes(":::gallery")) {
            if (state.tokens[idx].type === "fence") return; // 不解析在代码块中的图册语法
            state.tokens[idx].type = "gallery";
          }
        });
        return true;
      });
    },
  },
});
```

```ts [捕获 Token 样例]
{
  type: 'inline',
  tag: '',
  attrs: null,
  map: [ 7, 10 ],
  nesting: 0,
  level: 1,
  children: [
    {
      type: 'text',
      tag: '',
      attrs: null,
      map: null,
      nesting: 0,
      level: 0,
      children: null,
      content: ':::gallery 大猪肘子',
      markup: '',
      info: '',
      meta: null,
      block: false,
      hidden: false
    },
    {
      type: 'softbreak',
      tag: 'br',
      attrs: null,
      map: null,
      nesting: 0,
      level: 0,
      children: null,
      content: '',
      markup: '',
      info: '',
      meta: null,
      block: false,
      hidden: false
    },
    {
      type: 'image',
      tag: 'img',
      attrs: [['src', 'https://example.com/image.jpg'], ['alt', '大猪肘🥰🥰🥰香香的软软的🥰🥰🥰嘿嘿🥰🥰🥰已经除了大猪肘以外什么都不会想了呢🥰🥰🥰']],
      map: null,
      nesting: 0,
      level: 0,
      children: [],
      content: '大猪肘🥰🥰🥰香香的软软的🥰🥰🥰嘿嘿🥰🥰🥰已经除了大猪肘以外什么都不会想了呢🥰🥰🥰',
      markup: '',
      info: '',
      meta: null,
      block: false,
      hidden: false
    },
    {
      type: 'softbreak',
      tag: 'br',
      attrs: null,
      map: null,
      nesting: 0,
      level: 0,
      children: null,
      content: '',
      markup: '',
      info: '',
      meta: null,
      block: false,
      hidden: false
    },
    {
      type: 'text',
      tag: '',
      attrs: null,
      map: null,
      nesting: 0,
      level: 0,
      children: null,
      content: ':::',
      markup: '',
      info: '',
      meta: null,
      block: false,
      hidden: false
    }
  ],
  content: ':::gallery 大猪肘子\n' +
    '![大猪肘🥰🥰🥰香香的软软的🥰🥰🥰嘿嘿🥰🥰🥰已经除了大猪肘以外什么都不会想了呢🥰🥰🥰](https://example.com/image.jpg)\n' +
    ':::',
  markup: '',
  info: '',
  meta: null,
  block: true,
  hidden: false
}
```

:::

### 生成 HTML 模板

接下来就是就是设置规则触发函数。由于刚刚已经加入了 `gallery` 类型，因此只需要在渲染阶段根据类型调用处理函数即可。在 `generateImgGallery` 以及 `generateImgComponent` 中，为了让模板字符串能够被正确解析，我使用了 `JSON.stringify` 将对象转换为字符串，并使用 `replaceAll` 将双引号替换为单引号。具体原因可以参考 [这篇文章](./vitepress-markdown-use-object-param)。

:::code-group

```ts [config.ts] {20-22}
// ...
import { generateImgGallery } from "./utils/generateImgGallery";

export default defineConfig({
  // ...
  markdown: {
    // ...
    config: md => {
      // ...
      md.core.ruler.push("gallery", state => {
        state.tokens.forEach((token, idx) => {
          if (token?.content?.includes(":::gallery")) {
            if (state.tokens[idx].type === "fence") return; // 不解析在代码块中的图册语法
            state.tokens[idx].type = "gallery";
          }
        });
        return true;
      });

      md.renderer.rules.gallery = (tokens, idx) => {
        return generateImgGallery(tokens[idx]);
      };
    },
  },
});
// ...
```

```ts [./utils/generateImgGallery.ts]
import type { Token } from "../types/Token";
import { getImgInfo } from "./generateImgComponent";

export function generateImgGallery(galleryToken: Token) {
  if (!galleryToken.children || galleryToken.children.length === 0) return "";
  const tokens = galleryToken.children;
  const galleryName = galleryToken.children[0].content
    .replace(/:::gallery\s?/, "")
    .trim();
  const imgList = tokens
    .filter(token => token.type === "image")
    .map(getImgInfo);

  return `\n<ElyImageGallery name="${galleryName}" :imgList="${JSON.stringify(
    imgList
  ).replaceAll('"', "'")}" />\n`;
}
```

```ts [./utils/generateImgComponent.ts]
import type { Token } from "../types/Token";
import type { ImageBase } from "../components/ElysiumUI/types/ImageBase";

export function getImgInfo(imgToken: Token) {
  const src = imgToken?.attrs?.find(attr => attr[0] === "src")?.[1];
  const alt = imgToken.content;
  const width = imgToken?.attrs?.find(attr => attr[0] === "width")?.[1];
  const height = imgToken?.attrs?.find(attr => attr[0] === "height")?.[1];
  return { src, alt, width, height };
}

export function generateImgComponent(imgToken: Token) {
  const { src, alt, width, height } = getImgInfo(imgToken);

  const image: ImageBase = { src, alt, width, height };

  return `<ElyImage :image="${JSON.stringify(image).replaceAll('"', "'")}" />`;
}
```

```ts [ImageBase.ts]
export type ImageBase = {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
};
```

:::

### 新建 Vue 组件

最后一步就是新建 Vue 组件，并在下一步中把它注册为全局组件。

:::code-group

```vue [ImageGallery.vue]
<script setup lang="ts">
import type { ImageProps } from "./types/ImageProps";
import { parseSize } from "./_utils/styleUtils";
import { computed } from "vue";

const props = defineProps<ImageProps>();

const store = useImageStore();

const imageSrc = computed(() => {
  if (Array.isArray(props.image)) {
    return props.image[(props.index ?? 0) % props.image.length];
  }
  return props.image;
});
</script>

<template>
  <img
    class="elysium-ui elysium-ui__image cursor-pointer w-full max-w-screen-md object-contain flex-1 block"
    :src="imageSrc.src"
    :alt="imageSrc.alt"
    :style="{
      width: parseSize(imageSrc.width) ?? '100%',
      height: parseSize(imageSrc.height) ?? 'auto',
    }"
  />
</template>

<style scoped lang="scss">
img.elysium-ui__image {
  display: block;
  min-width: 0;
  max-width: 100%;
  object-fit: cover;
}
</style>
```

```ts [ImageProps.ts]
import type { ImageBase } from "./ImageBase";

export type ImageProps = {
  image: ImageBase[] | ImageBase;
  index?: number;
};
```

:::

### 注册全局组件

完成图库组件后，由于图库组件在编译前的依赖分析阶段没有明确的调用，因此需要手动将其注册为全局组件以便运行时能够正确解析组件。

:::code-group

```ts [index.ts]
// ...
import ElyImageGallery from "./components/ElysiumUI/ElyImageGallery.vue";
// ...

export default {
  // ...
  enhanceApp({ app }) {
    app.component("ElyImageGallery", ElyImageGallery);
  },
};
```

:::

## 一些尚待解决的小问题

至此图库组件基本上就可以使用了。不过在实际使用过程中我发现了一个会稍微恶心到我的小问题，就是它不能接受连续换行。这个需要连续解析后文来解决，但是目前已经足够我正常使用了，所以暂时就不打算修复。

```markdown
:::gallery 像这样带连续换行的语法是识别不了的

![图片描述](图片链接)

![图片描述](图片链接)

![图片描述](图片链接)
:::

:::gallery 这样是能识别的
![图片描述](图片链接)
![图片描述](图片链接)
:::
```
