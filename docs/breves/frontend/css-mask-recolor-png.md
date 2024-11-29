---
title: 用 CSS 蒙版给任意带有透明通道的 PNG 图片重新着色
tags:
  - 前端
  - CSS
  - CSS 蒙版
createdAt: "2022-01-08 17:53"
---

# 用 CSS 蒙版给任意带有透明通道的 PNG 图片重新着色

## 需求分析

有一张主体部分为任意颜色，**其余位置透明**的 png 图标图片，现在希望将这张图片进行重新着色。网上有很多借助 `mix-blend-mode` 属性来实现图片重新着色的方案，但这些方案大多需要图片本身是纯黑或者纯白（亮度需要稳定地高于或者低于目标颜色），否则难以实现。

## 最终效果

![最终效果](https://cdn.sa.net/2024/11/27/PAvGy69dmoxHWSN.webp)

## 实现和解释

### CSS mask

mask 这个词应该接触过 Adobe 系列软件（或者喜欢在 PowerPoint 里面玩骚操作）的同学都接触过。它的概念很简单，如果在位于上层的图层当中挖一个或者若干个洞，下面的图层就会透过这些洞展示出来。

大部分现代浏览器（当然 IE 不支持）都支持 mask 声明。不同的是，在 Webkit 内核的浏览器（例如使用 Chromium 内核的浏览器）当中，需要显式指明 `-webkit-mask`，浏览器才会接受这些声明。在一些前端框架例如 [Vue.js](https://vuejs.org/) 当中，可以通过 `:src="{ maskImage：… }"` 让 Vue 自己决定是否应该加上 `-webkit` 前缀。

一张 png 图片能够被用作 mask 的前提条件是图片当中必须含有透明部分（主体颜色不限）。如果图片不透明，那么浏览器就会将图片所占的矩形区域作为 mask 整体来使用，在这种情况下还不如直接指定节点的宽度和高度。在这种情况下，应该使用复合背景并将 `background-blend-mode` 设置为 `lighten`（仅对主体颜色比目标颜色深的图片生效）。

在了解了这些过后，就可以使用 `mask-image` 来设置遮罩图像了。

### `mask-image`

```html
<div class="mask-test"></div>

<style>
  .mask-test {
    height: 128px;
    width: 128px;
    background: linear-gradient(
      rgba(238, 239, 169, 1) 0%,
      hsl(42deg 58% 76%) 45%,
      rgba(177, 152, 112, 1) 80%
    );
    -webkit-mask-image: url("https://example.com/image.png");
  }
</style>
```

![效果图](https://cdn.sa.net/2024/11/27/PYykuxCQ6bHgDBv.webp)

——不对啊，怎么图像只显示了四分之一？

——作为遮罩的图像不会根据元素大小进行适配，默认是图像的原本大小。就像指定其他图片元素的宽度和高度一样，也需要使用“(-webkit-)mask-size”来指定遮罩的大小。

——行，那给我来个64px的吧。

### `mask-size`

```css
.mask-test {
  height: 128px;
  width: 128px;
  background: linear-gradient(
    rgba(238, 239, 169, 1) 0%,
    hsl(42deg 58% 76%) 45%,
    rgba(177, 152, 112, 1) 80%
  );
  -webkit-mask-image: url("https://example.com/image.png");
  -webkit-mask-size: 64px;
}
```

![效果图](https://cdn.sa.net/2024/11/27/ab9qBS6vRuVgsxC.webp)

——不是，怎么变成影流之主了？

——如果遮罩尺寸小于元素尺寸，那么浏览器的默认行为将会是重复（repeat）这一遮罩。

如果要避免的话，可以使用 `no-repeat` 来防止这个行为。但是我个人不太推荐这个用法，因为这代表着设计者自己也不知道这个元素应该以多大尺寸展示，这是要扣工资的。

### `mask-repeat`

```css
.mask-test {
  height: 128px;
  width: 128px;
  background: linear-gradient(
    rgba(238, 239, 169, 1) 0%,
    hsl(42deg 58% 76%) 45%,
    rgba(177, 152, 112, 1) 80%
  );
  -webkit-mask-image: url("https://example.com/image.png");
  -webkit-mask-size: 64px;
  -webkit-mask-repeat: no-repeat;
}
```

![最终效果图](https://cdn.sa.net/2024/11/27/EwguOnrc7hIyCYT.webp)

诶，这下就对味了。

## 限制

就像一开始提到的使用 `mix-blend-mode` 的方案一样，使用 CSS 蒙版方案的限制在于遮罩图片必须含有透明通道。如果图片不含有透明通道，那么就只能使用 `mix-blend-mode` 或者使用 PS 大法了。~~或者找美术打一架~~

而如果需要在 `Canvas` 当中实现非透明图片重上色也是有办法的，这里先留个坑，我们以后再来说。
