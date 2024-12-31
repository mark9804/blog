---
title: 在 VitePress Markdown 转换器中传入对象参数
description: 让 VitePress Markdown 转换器正确解析以对象形式传入的参数
tags:
  - VitePress
  - Markdown
---

# 在 VitePress Markdown 转换器中传入对象参数

:::details 太长不看

用单引号替换双引号

```ts
return `\n<SomeComponent :props="${JSON.stringify(Object).replaceAll('"', "'")}" />\n`;
```

:::

在 [之前一篇文章](./vitepress-image-gallery) 中，我使用自定义的规则解析器解析了图库语法。然而如果要给图库组件加上一个 `ImagePreview` 组件的话，这个组件就必须知道一个图库包含哪些图片，也就是要想办法给它传入一个图片列表。

我们都知道正常情况下，要给一个 Vue 组件传入非字符串的对象参数只需要使用 `:propName="Object"` 即可。然而如果在 markdown-it 转换器中直接使用这种方式（例如下面这种写法），则会报错 `Error parsing JavaScript expression: Unexpected token`。

```tsx
export function generateImgGallery(galleryToken: Token) {
  if (!galleryToken.children || galleryToken.children.length === 0) return "";
  const tokens = galleryToken.children;
  const galleryName = galleryToken.children[0].content
    .replace(/:::gallery\s?/, "")
    .trim();
  const imgList = tokens
    .filter(token => token.type === "image")
    .map(getImgInfo); // { src: string, alt: string, width: number, height: number }

  return `\n<ElyImageGallery name="${galleryName}" :imgList="${imgList}" />\n`;
}
```

如果就此认为“可能是 Markdown 转换器不允许插入 non-string Object”，那么就大错特错了，因为如果继续尝试构造可以被接受对象的话，我们会惊讶地发现形如 `[]`、`{}` 甚至是 `[123, undefined, {width: undefined}]` 这种只包含假值的对象都可以被正确解析。然而只要稍微修改一下，变成诸如以下形式：

```tsx
const test = { a: 1 };

return `\n<SomeComponent name="${galleryName}" :test="${test}" />\n`;
```

马上熟悉的 `Unexpected token` 错误就回来了。

那么到底是什么 Token 会导致这个问题呢？这就要从VitePress 模板字符串中特殊的传参过程开始说起了。

不管是 Vue 还是 React，在解析组件传参时，都会尝试获取 DOM 上游离的 `attr` 属性。而在检测到对应的 `attr` 属性后，会尝试将 `attr` 的值转换为对应的类型。而在 Markdown 转换过程中，由于我们的解析器返回的是模板字符串，再由 Markdown-it 拼接成完整的 HTML 字符串，所以 `attr` 的值会以字符串的形式传递。我们看一下一个狭义的 Object 在 JSON 中是如何表示的：

```json
{ "a": 1 }
```

注意这个双引号，它就是导致我们无法正确解析 Object 的罪魁祸首。当我们直接传入这个 Object 的时候，它会被解析成：

```ts
return `\n<SomeComponent :test="{"a":1}" />\n`;
                                 ^ ^
```

提前被关闭的双引号导致了接下来的 Token 模式匹配失效，于是就出现了 `Unexpected token` 错误。

于是解决方式也就呼之欲出了，在 JSON 格式中，单引号和双引号都是合法的，因此我们只需要将 Object 转换为 JSON 字符串，然后将双引号替换为单引号即可。

```ts
return `\n<SomeComponent :test="${JSON.stringify(Object).replaceAll('"', "'")}" />\n`;
```
