---
title: 解决 iOS 18.4 以下 Safari 的 Canvas 合成 bug
description: iOS 上的 Safari 一直有一个 Canvas 合成问题，表现为叠放在 Canvas 上的元素消失或闪烁。这个问题在 18.4 beta 版本中修复，之前的版本可以通过添加无限循环的 CSS 动画解决。
tags:
  - 前端
  - Safari
---

# 解决 iOS 18.4 以下 Safari 的 Canvas 合成 bug

这篇文章中的 bug 其实是两年前遇到的，最近发现之前的解决方案在极端情况下会出现问题，重新复现的时候发现 iOS 18.4 beta 版本已经修了。但是肯定不能强制用户全都去用测试版（苹果近几年的正式版系统都是依托史了，测试版只会更抽象），所以还是把之前的解决方案和改进后的解决方案记录一下。

## BUG、袭来

Safari 的版本号是跟系统版本号一致的，在 iOS / iPad OS 上更新 Safari 版本的唯一方式就是升级系统。因此下文会用 iOS 版本号来指代 Safari 版本号（macOS Safari 不存在这个问题）

这个 bug 最早我在 22 年的 iOS 16 上遇到过。由于 Canvas 对文本的支持并不好（主要是没有字体 fallback，显示中文要么全量打包字体要么等着看口口），于是我们在 WebGal 播放器上通过使用 Canvas 来绘制背景和人物 Spine，在 Canvas 上叠放文字 DOM 元素的方式的方式来解决这个问题。

功能完成准备上线测试时，用苹果全家桶的韭菜本菜发现在自己的 iPhone 上播放剧情时居然看不到文字和按钮（均使用 HTML 标签绘制），**只能看到一个跳动的 next 图标**。

震撼之下我和组员们排查了很久，发现在安卓的 Chrome 上无法复现，macOS 上模拟 iOS 布局也无法复现，只能在 iPhone 真机上复现，并且不管换成什么浏览器（因为都是基于 WebKit 内核的）都能稳定观察到这个 bug。使用 Inspector 和 Layers 面板观察均无异常，尝试设置 `z-index: 99999` 无效，给 Canvas 元素设置 `z-index: -1` 后能正常显示文字。（后来复盘时觉得应该是 `z-index` 设置为 `-1` 之后就不显示了，不会触发 compositing）

（PS：后来在上线 Unity WebGL游戏的时候遇到了这个问题的另一种表现形式，我们的游戏加载动画（下载 Unity WASM 资源的时候展示，此时 Canvas 已经初始化完成并挂载）使用了 3D 翻转来展示，加载效果见 [https://games.blue-archive.io/koharu-dream/](https://games.blue-archive.io/koharu-dream/)。这个 bug 导致 loading 图片每次翻面的时候半个画面都会被一闪而过的黑色覆盖，而另外半面则正常显示，整体效果非常像黑色闪光弹，抽象的一匹）

## 不动的、元素

在挠了两天头，尝试过了各种 debug 方案之后，我终于注意到了一开始被忽略的小细节：文字和 next 图标是被包裹在同一个 `div` 里面的，要么两个就一起显示要么一起不显示，为什么图标正常但是文字会消失？

又挠了十分钟头，排除了 relative 定位，z-index，width，height 等等各种可能的影响之后，我终于把目光聚焦到我认为最不可能是问题的地方：为了跳动效果给 next 图标加上的无限往复 CSS 动画。

```scss {6,13-25}
.next-image-btn {
  $size: 10px;
  position: absolute;
  right: 0;
  bottom: 1rem;
  animation: next-btn 0.6s linear alternate infinite; // [!code focus]
  background: url("./assets/text-next.webp");
  background-size: $size $size;
  width: 10px;
  height: 10px;
}
// prettier-ignore
@keyframes next-btn { // [!code focus:13]
  0% {
    transform: translateY(0);
  }

  40% {
    transform: translateY(10%);
  }

  100% {
    transform: translateY(50%);
  }
}
```

福尔摩斯曾经说过，当你排除了所有不可能的情况，剩下的不管多么难以置信一定就是真相。排查到这一步，其实基本上能确定是 Safari 的重绘或者合成引擎出问题了，可能是因为极致的苹果美学，苹果工程师们根本不屑于在 Canvas 上面叠放任何静止（使用了 `position: fixed`）的 DOM 元素。又因为极致的能耗追求，他们选择在重绘时抛弃 Canvas 上的所有静态 DOM 元素。那么我们的解决方案就是让原本被渲染引擎忽略的元素动起来，让渲染引擎强制重绘。

## 陌生的、解决方案

由于元素原本应当是静止的，动起来会显得很奇怪，所以应该添加一个几乎察觉不到的动画。最好也不要调用会被 GPU 加速的动画，否则不好说还会出现什么奇怪的问题。因此最后我选择了常见的 `translate` 动画，并且设置位移为 `1px`（最好是一个整数，Safari 的合成引擎会把小数砍掉，所以不要想着用 `0.5px` 来糊弄），动画周期尽可能给长，`999999s` 足够了。最后再加上一个 `linear alternate infinite` 让它自己动。

```scss
.text-container,
.button {
  animation: fuck-safari 999999s alternate infinite;
}

@keyframes fuck-safari {
  to {
    transform: translateX(1px);
  }
}
```

再上手测试，这下文字和按钮都能展示了，完美。

……吗？

## BUG、再临

上面我提到过

> 文字**和按钮**都能展示了，完美。

但是又过了一年，我发现更新到 iOS 17 之后，出现了一个新问题：我按钮呢，我**按钮怎么点不动了**？一年前我测试的时候明明是可以的呀？

因为去年种种原因，我并没有及时照顾占我们手机访问用户 1/10 的 iOS 用户（因为整个解决方案的应用场景是 iPhone 上的 Safari 它居然没有全屏 API，只能使用 `position: fixed` 把元素撑满视口假装全屏，iPad 上没有这个问题），昨天终于把这个问题重新捡起来了。

因为过了两年，我的第一反应是可能某个 DOM 元素覆盖在了按钮上方，导致按钮无法点击。但是又在一番 Inspector 和 Layers 大法之后发现没有任何异常。最后怀抱着死马（指苹果工程师的🐴）当活马医的心态，我把上面那行 fuck safari 的代码注释掉之后，发现按钮居然又能点了。

……怎么的你们苹果工程师自己设计的一坨狗屎还不让人骂了。

## 决战、第 3 新 Safari

总之新问题算是找到原因了，Safari 会忽略正在播放动画的元素上绑定的点击事件。但是本来就是因为静止的元素会导致重绘 bug 才加上动画的，现在又因为动画导致点击事件失效，这是不是有点。

于是无奈之下，现在的解决方案变成了这样：

```scss
.text-container {
  animation: fuck-safari 999999s alternate infinite;
}

// iOS Safari version 18.3-：
// 在 Canvas 上层的元素会触发 Composition engine bug，
// 表现为元素不能正常显示，添加任意动画触发 repaint 即可显示
// 但是添加动画后，元素会无法点击导致按钮无法使用
// Safari 18.4 beta 已修复该问题，
// 但是暂时想不到兼容方案，也没有更低版本的测试设备，就先这样吧
.button {
  visibility: visible !important;
  will-change: transform;
}

@keyframes fuck-safari {
  to {
    transform: translateX(1px);
  }
}
```

可喜可贺，可喜可贺。

## 后记

就像我一开始提到的，Safari 的重排 bug 在我现在的 iOS 18.4 beta 上已经修复了（注释掉动画，刷新页面之后也没有出现问题）。但是按照苹果用户的粘性，等用户全升级到 iOS 18.4 估计苹果都把自己作死了。

因为这个 bug 实在是太过诡异，所以也只能哪痛医哪，先这样吧。
