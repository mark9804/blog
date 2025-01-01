---
title: 平滑缩放的前端实现
description: 在前端实现平滑的捏合缩放和滚轮缩放
tags:
  - 前端
  - 平滑缩放
---

# 平滑缩放的前端实现

对于一个图片预览组件而言，捏合缩放和滚轮缩放是 PC 端和移动端上使用频率都非常高的功能。但是许多大厂的组件库对这个功能的支持都不尽人意：

- [TDesign](https://tdesign.tencent.com/react/components/image-viewer)、 [Arco Design](https://arco.design/vue/component/image#component-preview) 和 [Element Plus](https://element-plus.org/zh-CN/component/image.html#图片预览) 的缩放都基于监听 `wheel` 事件触发固定缩放步进值，在触摸板上 `wheel` 事件会被高频触发，而用户手指的移动距离不可能是线性的，整体体验相当糟糕
- [Ant Design](https://ant-design.antgroup.com/components/image-cn) 支持了平滑缩放，但是使用双指扩张和捏合手势缩放内容时会把页面也连带着一起缩放，基本不可用
- [Naive UI](https://www.naiveui.com/zh-CN/os-theme/components/image) 原生不支持通过滚动事件缩放，只能使用工具栏按钮完成。

各位产品经理们卷 KPI 确实很辛苦，不过用户体验这种分内工作还是重视一下吧。

## 功能梳理

一个多端友好的图片预览组件应该要做到以下几点：

- 组件应该支持移动端和 PC 端，因此需要同时监听滚动事件和触摸事件。
- 缩放手势可能会被浏览器识别为缩放整个页面，因此需要拦截默认事件。
- 应该只阻止缩放手势的默认事件，不能粗暴阻止所有默认滚动/点击事件。
- 在触摸交互设备上滚动事件会被高频触发，因此需要对滚动事件设置节流。
- 缩放比例应该对用户操作幅度敏感，因此不能简单地在 `wheel` 事件上设置一个固定步长，应该获取滚动事件中具体的滚动/移动距离。

## 实现

### 节流和更新缩放比例

因为缩放频率最终只会影响显示效果，不需要参与逻辑计算，因此只需要使用不精确的 `requestAnimationFrame` 函数进行防抖即可。至于这个函数的触发频率是每秒 30 还是 60，甚至是 240 或者 1 次都无所谓。

缩放尺寸直接调用 `transform: scale` 进行设置，如果想自己捕获然后硬算也不是不行。

```vue
<script setup lang="ts">
const scale = ref(1);
const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const lastTouchDistance = ref(0);

let rafId: number | null = null; // 节流用

function updateScale(delta: number) {
  if (!!rafId) return;

  rafId = requestAnimationFrame(() => {
    const newScale = scale.value + delta * 0.01;
    scale.value = Math.min(Math.max(newScale, MIN_SCALE), MAX_SCALE);
    rafId = null;
  });
}

// 极端情况下的请求释放
onUnmounted(() => {
  if (rafId) {
    cancelAnimationFrame(rafId);
  }
});
</script>

<template>
  <img :src="..." :style="{ transform: `scale(${scale})` }" />
</template>
```

### 事件监听

在 Vue 当中监听滚动和触摸事件，只要在对应 DOM 上挂上事件监听器即可。

```vue
<template>
  <div
    v-if="shouldShowPreview"
    class="z-999 top-0 left-0 w-full h-full bg-black/40 flex flex-col items-center justify-center gap-4"
    @wheel="handleScroll"
    @touchstart="handleTouch"
    @touchmove="handleTouch"
  >
    <!-- 图片 -->
  </div>
</template>
```

### 意图过滤和默认事件拦截

调用 `event.preventDefault()` 即可拦截默认事件。不过触摸事件有一点特殊，正常情况下单指交互包含了点击（点击关闭按钮/点击空白处退出）、拖动（拖动图片查看其他位置），而双指事件才代表缩放。因此需要放过单指事件（或者至少应该使用额外逻辑处理），只针对双指交互计算缩放。

可以使用 `event.touches` 来获取所有的触摸事件元素，`event.touches.length` 的长度就代表有几根手指在触摸。

在 PC 端上，双指捏合和扩张会被识别成一个特殊的滚轮事件（<kbd>Ctrl</kbd> + <kbd>Wheel</kbd>），因此只需要拦截带有 <kbd>Ctrl</kbd> 键的滚轮事件即可。这样顺带也放过了滚轮的默认事件，不会影响图片的正常滚动。

```ts
function handleScroll(event: WheelEvent) {
  // 阻止默认滚动行为，避免 scroll chaining
  event.preventDefault();

  // 只处理 pinch zoom 手势（触摸板上的捏合手势会转换为 ctrl + wheel 事件）
  if (event.ctrlKey) {
    // …处理缩放逻辑
  } else {
    // …处理滚动逻辑
  }
}

function handleTouch(event: TouchEvent) {
  if (event.touches.length === 1) {
    // …平移图片
    return; // Early return 看个人习惯，学校考试的时候记得写就行
  }

  // 过滤双指以外的触摸事件
  if (event.touches.length !== 2) return;

  // …双指缩放逻辑
}
```

### 计算缩放

#### 滚轮事件

滚轮事件 `WheelEvent` 当中含有 X、Y、Z 三个方向的滚动距离（Z 轴是什么操作…）`deltaX`、`deltaY` 和 `deltaZ` 供我们使用。上文已经提到过，PC 端的捏合事件其实也是一个滚轮事件，本质上与鼠标的 Y 轴滚动事件相同。因此计算滚动距离时，只需要使用 `event.deltaY` 即可。

```ts
function handleScroll(event: WheelEvent) {
  // 阻止默认滚动行为，避免 scroll chaining
  event.preventDefault();

  // 只处理 pinch zoom 手势
  //（触摸板上的捏合手势会转换为 ctrl + wheel 事件）
  if (event.ctrlKey) {
    updateScale(-event.deltaY);
  } else {
    // 平移图片
  }
}
```

#### 触摸事件

触摸事件的类型分为 `touchstart`、`touchmove` 和 `touchend` 三种，其中 `touchend` 事件不需要关心，只需要在 `touchstart` 时记录初始距离，在 `touchmove` 时计算当前距离与初始距离的变化即可。

触摸事件 `TouchEvent` 中的键 `touches` 是一个 Array，记录了所有检测到的触摸点。每个 `touches` 中的元素都含有自身横纵坐标 `clientX`，`clientY`。

两点之间的距离可以用勾股定理自行计算，这里介绍一种不太常见的方法：把两点之间的距离看作一个向量，使用 `Math.hypot()` 函数计算这个向量的模长。`Math.hypot()` 可以计算任意维度空间中某个向量的模长且模长恒为非负值，即

$$
||\vec V|| = \mathtt{\operatorname{Math.hypot}(v_1, v_2, \dots, v_n)} = \sqrt{v_1^2 + v_2^2 + \dots + v_n^2} = \sqrt{\sum_{i=1}^n v_i^2}
$$

这种方法本质上依然是勾股，但是不用自己重新造轮子，并且计算由浏览器原生提供的 `Math` 库完成，理论性能会更好一些（虽然不差这点性能），浏览器兼容性也比较完善。

![Math.hypot 浏览器兼容性](https://cdn.sa.net/2025/01/01/PxAFiLbNCYRr3qp.webp)

```ts
function handleTouch(event: TouchEvent) {
  // 处理单指事件（点击等）
  if (event.touches.length === 1) {
    // TODO: 平移滚动时平移图片
    return;
  }

  // 过滤双指以外的触摸事件
  if (event.touches.length !== 2) return;

  // 获取触摸点
  const touch1 = event.touches[0];
  const touch2 = event.touches[1];

  // 计算两点间距离
  const distance = Math.hypot(
    touch2.clientX - touch1.clientX,
    touch2.clientY - touch1.clientY
  );

  if (event.type === "touchstart") {
    event.preventDefault(); // 仅在开始缩放时阻止默认行为
    lastTouchDistance.value = distance;
    return;
  }

  // 计算距离变化，只有在变化超过阈值时才认为是缩放
  const delta = distance - lastTouchDistance.value;
  if (Math.abs(delta) > 1) {
    // 添加一个小阈值，避免误触
    event.preventDefault();
    updateScale(delta * 0.1);
    lastTouchDistance.value = distance;
  }
}
```

## 完整实现

[GitHub](https://github.com/mark9804/blog/blob/a17930e5fa3ebc79d653fab905c3d2052534ad01/docs/.vitepress/theme/components/ElysiumUI/ElyImagePreview.vue)
