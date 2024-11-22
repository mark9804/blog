---
title: 帮微软实现一个真・Fluent 2 风格的 Input 组件
description: 本文介绍了如何使用 Vue 3 和 UnoCSS 创建一个 Fluent 2 风格的输入组件。
tags:
  - Vue
  - Fluent 2
---

# 帮微软实现一个真・Fluent 2 风格的 Input 组件

:::info

虽然在这篇文章中我写的是如何实现一个风格化 UI 组件，但是我认为“没必要为重新发明轮子而重新发明轮子”。UI 诚然是直接服务于 VIS 的重要部分，每个项目在某种意义上都会有自己的设计语言和风格，九个项目里面会包含十种不同的设计变体；不过换句话说，一个风格化 UI 库在设计出来的时候，就已经和某个项目或者某个设计语言绑定在一起了。换言之，当设计师不满意这个组件库绑定的设计语言时，想要继续使用这个库的设计和前端团队就不得不重新设计或者修改这个组件库，轻则修改颜色和布局，重则需要侵入组件源码或者重写一个符合需求的组件。我觉得这是 headless UI 还有 shadcn/ui 流行的根本原因，因为它们在设计之初就不和某种设计语言绑定，因此可以变形成任何项目的基础库。而希望通过发布风格化 UI 库来提升自身或者项目知名度的想法在我看来不是独立开发者应该做的事情。

:::

最近这段时间在用 Nuxt 3 重构剧情站，新 UI 设计基本上是在 Fluent 2 的基础上进行风格化的，但是微软自己的 Fluent 只有 React 和 Web Components 的实现，并且对于 SSR 的支持也只能说基本没有，直接上 element-plus 又太重量级了，所以作为项目中台打算自己基于 Vue 实现一个精简版（没有 Error 和 Readonly 状态）。

首先来看一下微软官方的设计稿，有 Rest，Hover，Pressed，Focus 四种状态。其中需要注意的设计细节是 Input 底部的横线边缘是被 mask 掉一角的，直接用 `border-radius` 实现不了这种效果。

![Fluent 2 设计稿](https://cdn.sa.net/2024/09/13/uJQ2qALR7BC4V6w.png)

一开始想偷懒，抱着拿来主义的态度想看看微软自己是怎么实现的，结果发现微软的阿三外包前端疑似工作量有点过于不饱和，居然直接用 `border-radius` 糊弄过去了。这种情况下边缘会有一个难看的翘起弧度，组件越大越明显。

![工资小偷😡](https://cdn.sa.net/2024/09/13/hXQGi2kZMFog5AE.png)

而后开始尝试第二种思路，通过控制 `border-bottom` 来实现，
但是效果不是很好。如果把 `border-bottom` 设置成 `none`，在 `hover` 状态时边框宽度就会导致 layout shift；而如果一开始把 `border-bottom` 设置成 `2px solid transparent`，那么其他两边在默认状态下就断裂，也不好看。

<div class="w-full flex justify-center">
  <div id="border-bottom-input" class="w-full h-[32px] rounded-md flex items-center justify-center p-4">
  Hover me
  </div>

  <style lang="scss">
    #border-bottom-input {
      border-left: 2px solid var(--color-border-4);
      border-right: 2px solid var(--color-border-4);
      border-top: 2px solid var(--color-border-4);
      border-bottom: none;
      transition: all 0.3s ease-in-out;
    }
    #border-bottom-input:hover {
      border-left-color: var(--color-border-4);
      border-right-color: var(--color-border-4);
      border-top-color: var(--color-border-4);
      border-bottom: 2px solid var(--arona-blue-6);
    }
  </style>
</div>

接着尝试第三种方案，在外层套一个 `div`，设置 `overflow: clip` 来实现，发现外层 `div` 也有 `border-width` 变化导致 layout shift 的问题；而如果一开始就设置 `border-color: transparent`，那么就会出现毛刺。

![注意看底部两边的红框部分，点击图片可放大](https://cdn.sa.net/2024/09/13/b2FzXLAOlGHre9f.png)

因此最终想到了 inset box shadow + 伪元素 的方案，通过把 `box-shadow` 的 spread 控制成 1px，类型设置为 inset 来模拟边框，并且通过伪元素来实现底部的横线。最后在外层套一个 `overflow: clip` 来实现边缘的 mask 效果。

<script setup>
  import FluentInputExample from "@/components/FluentInputExample.vue";
</script>

<div class="flex w-full justify-center p-4 border-1 border-solid border-[var(--arona-blue-6)] rounded-md">
  <FluentInputExample class="w-full h-[32px]"/>
</div>

```vue{28-45}
<template>
  <span
    class="eden-ui eden-ui__input eden-ui__input--wrapper rounded flex gap-1 overflow-clip"
  >
    <input
      type="text"
      class="eden-ui eden-ui__input--input flex flex-1 items-end"
      placeholder="测试输入框"
    />
  </span>
</template>

<style scoped lang="scss">
@use "@style/color-variable.scss" as *;
.eden-ui__input {
  $border-width: 1px;

  &--wrapper {
    will-change: background-color, box-shadow;
    border-bottom: none;
    padding-left: 10px;
    padding-right: 10px;
    font-size: 14px;
    line-height: 22px;
    box-shadow: inset 0 0 0 1px transparent;
    position: relative; // stacking context

    &::before,
    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0px;
      width: 100%;
      height: $border-width;
      background: var(--color-border-3);
      transition: all 0.3s ease-in-out;
    }

    &::after {
      will-change: transform;
      height: 2 * $border-width;
      background: var(--arona-blue-6);
      transform: rotate3d(0, 1, 0, 90deg);
    }

    &:hover,
    &:focus,
    &:focus-within {
      transition: box-shadow 0.3s ease-in-out;
      box-shadow: inset 0 0 0 1px var(--color-border-3);
    }

    &:focus,
    &:focus-within {
      background-color: var(--color-fill-base);

      &::after {
        transform: rotate3d(0, 1, 0, 0deg);
      }
    }
  }
}
</style>
```
