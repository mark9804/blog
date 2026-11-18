---
title: 平滑缩放的前端实现
description: 在前端实现平滑的捏合缩放和滚轮缩放
tags:
  - 前端
  - 平滑缩放
ai_usage:
  used: true
  level: assist
  summary: 正文由作者撰写，AI 参与了高刷设备增量丢失勘误与 scale 几何命中检测后记的补充。
  llms:
    - name: "gemini"
      summary: "技术细节审校与踩坑补充章节整理"
---

# 平滑缩放的前端实现

对于一个图片预览组件而言，捏合缩放和滚轮缩放是 PC 端和移动端上使用频率都非常高的功能。但是许多大厂的组件库对这个功能的支持都不尽人意：

- [TDesign](https://tdesign.tencent.com/react/components/image-viewer)、 [Arco Design](https://arco.design/vue/component/image#component-preview) 和 [Element Plus](https://element-plus.org/zh-CN/component/image.html#图片预览) 的缩放都基于监听 `wheel` 事件触发固定缩放步进值，在触摸板上 `wheel` 事件会被高频触发，而用户手指的移动距离不可能是线性的，整体体验相当糟糕
- [Ant Design](https://ant-design.antgroup.com/components/image-cn) 支持了平滑缩放，但是使用双指扩张和捏合手势缩放内容时会把页面也连带着一起缩放，基本不可用
- [Naive UI](https://www.naiveui.com/zh-CN/os-theme/components/image) 原生不支持通过滚动事件缩放，只能使用工具栏按钮完成。

各位产品经理们卷 KPI 确实很辛苦，不过用户体验这种分内工作还是重视一下吧。

## 功能梳理

一个多端友好的图片预览组件应该要做到以下几点：

- 组件应该支持移动端和 PC 端，因此需要同时兼顾滚轮/触控板事件与触屏手势。
- 缩放手势可能会被浏览器识别为缩放整个页面或带动背景页面滚动，因此需要拦截默认行为。
- 应该区分单指点击（关闭预览）、单指拖拽（平移画面）与双指捏合（缩放画面），不能粗暴吃掉所有指针事件。
- 在高采样率触控设备上输入事件会被高频触发，需要合理合并或同步消费帧间增量。
- 缩放比例应该对用户操作幅度敏感，因此不能简单地在 `wheel` 事件上设置一个固定步长，应该获取事件中具体的滚动/移动距离。

## 实现

### 节流和更新缩放比例

缩放尺寸直接通过 CSS `transform: scale()` 在合成层完成即可，避免在高频手势期间反复修改宽高触发布局回流（Reflow）。

如果使用 `requestAnimationFrame` 对高频事件做帧级节流（Frame Coalescing），有一个非常容易踩的坑：**千万不要在 `rafId` 存在时直接 `return` 丢弃同帧的后续增量**。在 120Hz/240Hz 触屏或触控板上，一帧之内往往会连续触发多次 `touchmove` / `wheel`；如果外部每次事件都推进了上一帧的基准坐标，而 `updateScale` 把同帧第 2、3 次传入的相对 `delta` 直接丢掉，这部分手指位移就会被永久吞掉。

正确做法是先把帧内多次触发的 `delta` 累加起来，在下一帧回调里一次性消费并清零（在 Vue 3 中，响应式状态本身的 DOM 更新已经由框架微任务调度器自动批量合并，直接同步更新 `scale.value` 其实也完全够用）：

```vue
<script setup lang="ts">
const scale = ref(1);
const MIN_SCALE = 0.5;
const MAX_SCALE = 3;

let rafId: number | null = null;
let pendingDelta = 0; // 累加同帧内的相对增量，避免高刷设备吞位移

function updateScale(delta: number) {
  pendingDelta += delta;
  if (rafId !== null) return;

  rafId = requestAnimationFrame(() => {
    const newScale = scale.value + pendingDelta * 0.01;
    scale.value = Math.min(Math.max(newScale, MIN_SCALE), MAX_SCALE);
    pendingDelta = 0;
    rafId = null;
  });
}

// 极端情况下的请求释放
onUnmounted(() => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
  }
});
</script>

<template>
  <img :src="..." :style="{ transform: `scale(${scale})` }" />
</template>
```

### 事件监听与合成器手势接管

在 Vue 当中监听滚动和触摸事件，只要在全屏遮罩层上挂上事件监听器，并配合 CSS `touch-action: none` 即可：

```vue
<template>
  <div
    v-if="shouldShowPreview"
    class="fixed z-999 inset-0 bg-black/40 touch-none flex flex-col items-center justify-center gap-4"
    @wheel="handleScroll"
    @touchstart="handleTouch"
    @touchmove="handleTouch"
  >
    <!-- 图片 -->
  </div>
</template>
```

这里遮罩层上的 `touch-action: none`（对应 UnoCSS / Tailwind 的 `touch-none`）非常关键。移动端双指捏合时，两根手指几乎不可能在同一毫秒同时落屏——往往是第一根手指先触发单指 `touchstart`，几十毫秒后第二根手指才落下。如果不加 `touch-action: none`，浏览器合成器线程很可能在第一根手指移动时就已经抢先启动了原生页面滚动，等第二根手指落下再去 `touchmove` 里临时调 `event.preventDefault()`，浏览器会直接忽略并在控制台抛出 `[Intervention] Ignored attempt to cancel a touchmove event with cancelable=false`。用一行 CSS 直接在合成器层关掉遮罩内的原生滚动和页面缩放，比在事件回调里反复围追堵截干净得多。

### 意图过滤和默认事件拦截

全屏预览打开时，在 `wheel` 事件中调用 `event.preventDefault()` 可以阻止滚动链（Scroll Chaining）穿透到底层文章页面，同时拦截浏览器原生的页面级缩放。

在桌面端 Chromium 与 Firefox 浏览器中，触控板上的双指捏合和扩张会被映射成带有 `ctrlKey === true` 的特殊滚轮事件（<kbd>Ctrl</kbd> + <kbd>Wheel</kbd>），而普通双指滑动则不带 `ctrlKey`。因此我们可以据此分流「捏合缩放」与「双指平移」两种意图（注：macOS Safari 在部分场景下还会额外派发 WebKit 私有的 `GestureEvent`，配合前文的 `touch-action: none` 可以避免把整个网页连带放大）。

触摸事件则可以通过 `event.touches.length` 区分当前屏幕上有几根手指：单指交由点击或拖拽平移处理，双指才进入捏合缩放计算。

```ts
function handleScroll(event: WheelEvent) {
  // 阻止默认页面缩放及底层页面的 scroll chaining
  event.preventDefault();

  // 触摸板上的双指捏合手势会转换为 ctrl + wheel 事件
  if (event.ctrlKey) {
    // …处理缩放逻辑
  } else {
    // …处理平移（或鼠标滚轮缩放）逻辑
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

  // 区分触控板捏合缩放与双指滚动平移
  if (event.ctrlKey) {
    updateScale(-event.deltaY);
  } else {
    // 平移图片
  }
}
```

#### 触摸事件

触摸事件的类型分为 `touchstart`、`touchmove` 和 `touchend` 三种，只需要在双指刚落下（或前一次双指移动后）记录基准距离，在后续 `touchmove` 时计算当前两指距离与基准距离的差值即可。

触摸事件 `TouchEvent` 中的键 `touches` 是一个列表，记录了所有当前接触屏幕的触点，每个元素都含有屏幕横纵坐标 `clientX`、`clientY`。

两点之间的距离可以用勾股定理自行计算，这里介绍一种不太常见的方法：把两点之间的距离看作一个向量，使用 `Math.hypot()` 函数计算这个向量的模长。`Math.hypot()` 可以计算任意维度空间中某个向量的模长且模长恒为非负值，即

$$
||\vec V|| = \mathtt{\operatorname{Math.hypot}(v_1, v_2, \dots, v_n)} = \sqrt{v_1^2 + v_2^2 + \dots + v_n^2} = \sqrt{\sum_{i=1}^n v_i^2}
$$

这种方法本质上依然是勾股，但是不用自己重新造轮子，并且计算由浏览器原生提供的 `Math` 库完成，理论性能会更好一些（虽然不差这点性能），浏览器兼容性也比较完善。

![Math.hypot 浏览器兼容性](https://cdn.sa.net/2025/01/01/PxAFiLbNCYRr3qp.webp)

```ts
const lastTouchDistance = ref(0);

function handleTouch(event: TouchEvent) {
  // 处理单指事件（点击、平移等）
  if (event.touches.length === 1) {
    // TODO: 平移滚动时平移图片
    return;
  }

  // 过滤双指以外的触摸事件
  if (event.touches.length !== 2) return;

  const touch1 = event.touches[0];
  const touch2 = event.touches[1];

  // 计算两点间距离
  const distance = Math.hypot(
    touch2.clientX - touch1.clientX,
    touch2.clientY - touch1.clientY
  );

  if (event.type === "touchstart") {
    lastTouchDistance.value = distance;
    return;
  }

  // 计算帧间距离变化，超过微小阈值时更新缩放并推进基准距离
  const delta = distance - lastTouchDistance.value;
  if (Math.abs(delta) > 1) {
    updateScale(delta * 0.1);
    lastTouchDistance.value = distance;
  }
}
```

> 如果不想同时维护 `MouseEvent` 和 `TouchEvent` 两套拖拽/缩放状态，现代浏览器中更简洁的方案是直接改用 **Pointer Events**（`pointerdown` / `pointermove` / `pointerup` 配合 `setPointerCapture`），用一个 `Map<number, { x: number; y: number }>` 按 `pointerId` 追踪活动指针：集合长度为 `1` 时算单指/鼠标平移，长度为 `2` 时算双指距离捏合，逻辑会收敛很多。

## 踩坑补充：`transform: scale` 的两个衍生副作用

使用 `transform: scale()` 虽然避免了布局重排，但它**只改变合成层的视觉绘制尺寸，不会改变元素原本的 DOM 布局盒（Layout Box）**。后续完善组件时，我在这上面连踩了两个坑：

1. **`onClickOutside` 在图片缩小时点击空白处失灵**
   如果习惯性地在 `<img>` 外面套一层 VueUse 的 `<OnClickOutside>` 来做「点击空白关闭灯箱」，一旦把图片缩小到 `1.0x` 以下（比如 `scale(0.5)`），外层 `<OnClickOutside>` 生成的包装 `<div>` 依然占着 `1.0x` 的原始尺寸——点在图片缩回去让出的那圈空白里，`wrapper.contains(event.target)` 依然返回 `true`，导致预览关不掉。同理，如果给 `<img>` 写了 `w-full flex-1 object-contain`，横图上下、竖图左右的黑边留白其实也在 `<img>` 自身的盒模型内部，点在留白上一样会被吞掉。
   **解法**：这本质上是 **2D 屏幕几何命中问题**，不是 DOM 树包含问题。去掉 `<OnClickOutside>`，让 `<img>` 的宽高紧贴真实比例（`width: auto; height: auto; max-width: ...; max-height: ...`），并在指针抬起（非多指捏合且累计拖拽位移不超过 `4px`）时调用一次 `imgEl.getBoundingClientRect()`——浏览器返回的 `DOMRect` 会自动把当前的 `scale(...)` 和 `translate3d(...)` 变换矩阵算进去，只要点击坐标落在变换后的视觉矩形之外就关闭预览。

2. **`ResizeObserver` 不会响应 `scale()` 变化**
   如果想在「图片放大超出视口后」自动把普通滚轮意图从缩放切换为平移，不能依赖 `useElementBounding` 或 `ResizeObserver` 去监听 `<img>` 宽高，因为 CSS `transform` 根本不会触发 `ResizeObserver`。直接在图片 `@load` 时记下基准 `offsetWidth` / `offsetHeight`，后续用 `offsetWidth * scale` 纯算术对比视口尺寸即可，不仅准确，在滚轮和拖拽帧内也是零 DOM 读取。

## 完整实现

本站目前已经采用 Pointer Events + 几何命中检测重写了完整版图片预览组件，源码见 [GitHub - ElyImagePreview.vue](https://github.com/mark9804/blog/blob/master/docs/.vitepress/theme/components/ElysiumUI/ElyImagePreview.vue)。
