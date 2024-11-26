---
title: 用纯 CSS 画一个圆角三角形
tags:
  - 前端
  - CSS
createdAt: "2022-07-01 14:28"
cover: https://cdn.sa.net/2024/11/26/VpvA6ne3E9L7cS2.webp
---

# 用纯 CSS 画一个圆角三角形

~~（以下纯属吃饱了撑的，不想折磨自己还得是 svg）~~

最近做了一个设计，需要在前端画圆角三角形。

![效果图](https://cdn.sa.net/2024/11/26/BGQdpKOWlVNnr65.webp =360x)

非圆角三角形其实反向利用 CSS border 的原理是很好实现的，网上也有很多文章，这里不再赘述。

```html
<div class="container">
  <div class="triangle" />
</div>

<style>
  .container {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .triangle {
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 10rem 10rem;
    border-color: transparent transparent #636363;
    transform: scaleX(0.707);
  }
</style>
```

![效果图](https://cdn.sa.net/2024/11/26/v64kWuUyEnPGrA7.webp)

但是假如想要实现圆角的需求，那么使用 border 骚操作是无能为力的。因此这里使用的思路是通过三个正方形进行二维变形并旋转后拼合。

![示意图](https://cdn.sa.net/2024/11/26/VpvA6ne3E9L7cS2.webp =360x)

## 实现步骤

### 绘制基础单元

```html
<div class="rectangle" />

<style>
  .rectangle {
    width: 10rem;
    height: 10rem;
    background-color: #636363;
    border-radius: 0 30% 0 0;
  }
</style>
```

![绘制基础正方形](https://cdn.sa.net/2024/11/26/wDe4jhTzOHqEYS7.webp =360x)

### 设置旋转角度

```html
<div class="rectangle rotate" />

<style>
  .rectangle {
    width: 10rem;
    height: 10rem;
    background-color: #636363;
    border-radius: 0 30% 0 0;
  }

  .rotate {
    transform: rotate(-60deg);
  }
</style>
```

![设置旋转角度](https://cdn.sa.net/2024/11/26/LegcSmuxPdBj27A.webp =360x)

### 通过 `skew` 变形得到单个尖角

接下来涉及到一点简单的几何学：剪切变形和相似三角形。

首先是剪切变形。

```html
<div class="rectangle rotate skew" />

<style>
  .skew {
    transform: rotate(-60deg) skewX(-30deg);
  }
</style>
```

![剪切变形](https://cdn.sa.net/2024/11/26/2VGSDAhsgRvB6nw.webp =360x)

需要注意的是在这一步当中各点的坐标没有发生改变，不过坐标系不再是平面直角坐标系了。换言之，**`skew` 旋转的是坐标轴，而不是图形本身。**

这里用一张示意图来解释：

![坐标系旋转](https://cdn.sa.net/2024/11/26/cL5flvVuNwYmhsi.webp =360x)

虽然各点的坐标没有发生改变，但是由于坐标轴发生了旋转，各边的长度不再相等。上图中可以看到左边的斜边明显是长于右边的。这会在在下一步中进行修正。

首先要知道这个长度的变形是怎么来的：在平面直角坐标系中存在的直角三角形，由于坐标轴进行了偏转，原来的直角边变成了斜边，但是长度不变。

通过辅助图形可以更加清晰的看到这个过程：

![变形过程](https://cdn.sa.net/2024/11/26/bxW7BkyDNAPJvId.webp =360x)

又因为旋转的角是 $30\degree$，因此作出两个角度分别为 $30\degree$，$60\degree$，$90\degree$ 的直角三角形。设变形后的斜边长度为 $1$，可知：

$$
x = \frac{\sin(\frac{\pi}{3})}{1}=\frac{\sqrt{2} }{3} \approx 0.866025
$$

因此得到最后一个修正变量，将原图形按 Y 轴缩放至 $0.866$ 倍。

```html
<div class="rectangle rotate skew scale"></div>

<style>
  .scale {
    transform: rotate(-60deg) skewX(-30deg) scaleY(0.866);
  }
</style>
```

![修正变形](https://cdn.sa.net/2024/11/26/9vEJzGDtukgsxyC.webp =360x)

这样三角形的一个部件就做出来了。

### 利用伪元素复制部件

最后一步就很简单了，根据相同的原理用 `:before` 和 `:after` 伪元素把部件复制两份再移动到相应的位置：

```html
<div class="triangle"></div>

<style>
  .triangle {
    background-color: orange;
  }

  .triangle:before,
  .triangle:after {
    content: "";
    position: absolute;
  }

  .triangle:before {
    background-color: #f2656a;
  }

  .triangle:after {
    background-color: #0280f0;
    mix-blend-mode: screen; /* 设置颜色混合模式为滤色，方便观察 */
  }

  .triangle,
  .triangle:before,
  .triangle:after {
    width: 10em;
    height: 10em;
    border-radius: 0 30% 0 0;
  }

  .triangle {
    /* 直角边为1 -> 斜边为1 相似三角形比例 = (√3/2)/1 ≈ 0.866025 */
    transform: rotate(-60deg) skewX(-30deg) scaleY(0.866);
  }

  .triangle:before {
    /* √2, (√2)/2 */
    transform: rotate(-135deg) skewX(-45deg) scale(1.414, 0.707)
      translateY(-50%);
  }

  .triangle:after {
    transform: rotate(135deg) skewY(-45deg) scale(0.707, 1.414) translateX(50%);
  }
</style>
```

![最终效果](https://cdn.sa.net/2024/11/26/IYvWngSuFH1AdjN.webp =360x)

至此，一个完整的绘制过程就完成了。

![完整过程](https://cdn.sa.net/2024/11/26/t7OnH5LjZkpFlio.webp)

我也把这段代码写成了一个 [Codepen 示例](https://codepen.io/markchen9804/pen/wvmBRWe)，有兴趣的可以参考。

其实使用 CSS 绘制的整个过程显然过于耗时，并且代码量和单个 SVG 体积相比也没有任何优势。与 SVG 相比，CSS 绘制最大的优势在于可以方便地利用变量进行主题定制，以及当需要绘制多个相同图形时，CSS 绘制只需要写一个 class 就复用先前的结果，不需要重复导入 SVG 文件。这篇文章的目的主要是为了了解一下 CSS 的变形和坐标系旋转的原理。从效率的角度考量，在实际的工程应用里还是推荐找美术同学爆一个 SVG 文件出来。
