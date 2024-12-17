---
title: 在 Mac 上启动 PC 版绝区零
tags:
  - 游戏
  - 绝区零
  - Whisky
  - Parallels Desktop
---

# 在 Mac 上启动 PC 版绝区零

:::warning

标题说的是“启动”而不是“游玩”，是因为即使在我的中配 M3 Pro 上游戏依然不能保持一个稳定的帧数运行，掉到十几帧的时候比比皆是。这可能跟我把游戏安装在外接 SSD 上（使用雷电 3 连接线直连 Mac）有关，但是实际运行的时候游戏本身也吃满了 GPU，并且客观上讲 Mac 的内置存储也经不起这么浪费。此外，使用这种方式启动的绝区零在大版本更新时需要重新配置，工作量基本等于重装，因此就算抛开虚拟机成本不谈，**从实际性能表现和操作复杂度来讲这种操作并不可行**。

![用 Mac 打游戏还是精神病了一点](https://cdn.sa.net/2024/12/17/QsEBOSRzumtyNKZ.webp =200x)

:::

![效果展示](https://cdn.sa.net/2024/12/17/Azl6vot5ST8hFHM.webp)

因为回来过春节时 Windows 主机带不回来，我又把 iPad 转卖了，因此怎么在回家这段期间把雅小姐拿下就成了一个非常现实的问题。（手机能收微信就行，所以甚至还是 64G iPhone SE）

## 失败尝试：用 Whisky 转译启动器

因为 GPTK 2 目前已经相对比较成熟了，因此我的第一个想法是使用 [Whisky](https://getwhisky.app/) 转译一个 Windows 版本的程序。

然而很不幸的是绝区零并不能直接下载到游戏本体，需要通过米哈游启动器才能下到完整包，但是启动器本身是 CEF 程序，虽然可以用 Whisky 成功安装，但是启动时会疯狂报错最后显示一个白屏窗口，无法进行安装等操作。

## 失败尝试：用 Parallels Desktop 启动

既然不能直接启动，那就只能换个思路了，在虚拟机里面启动试试看。虽然性能损失会比转译来得更高，不过至少也是个办法。

（额外参考：[Parallels Desktop on External Drive? How?](https://forum.parallels.com/threads/parallels-desktop-on-external-drive-how.361570/)，这篇文章会教你怎么把虚拟机转移到外接硬盘上）

这次启动器是能安装了，但是启动游戏本体时会提示不允许使用虚拟机，因此这个方案也宣告失败。

![在虚拟机中启动，提示不允许使用虚拟机](https://cdn.sa.net/2024/12/17/QbzPVsU2gAi4Cxm.webp)

## 成功：用 PD 安装，换 Whisky 启动本体

这时候我们要发挥一下科研人的缝合精神，既然一个不能运行启动器，一个能运行启动器但是不能运行游戏本体，那要是用 PD 上的启动器安装好游戏然后把游戏单独拖出来用 Whisky 启动呢？

试试就逝世，先启动 PD 里的虚拟机文件共享功能，然后从网络存储上把游戏拖回本地。

![在 PD 设置中启用文件共享](https://cdn.sa.net/2024/12/17/J2y83bvGrAMgFu6.webp)

然后在 Whisky 中，选择右下角的 “Run” 按钮，选择 “ZenlessZoneZero.exe” 启动就能正常运行了。

### 性能测试

我用的是 14 核 18G 的中杯 M3 MacBook Pro，游戏安装在三星的 T7 1TB 外接 SSD 上，使用雷电 3 连接线直连 Mac，画质预设为中，窗口大小 1280x720 窗口化，测试场景选择光映广场。

在操作过程中拿起电脑的话，帧率会迅速讲到 12 帧左右；静置一段时间后会重新回到 58〜60 帧。此外如果正对光源的话，帧率会降到 27 帧左右，到人口密集区（抽象派雕塑的那一侧）帧率会掉到约 45 帧。按 <kbd>Esc</kbd> 进入设置界面后倒是可以稳定 58 帧上下。每个操作都不跟手，并且可能伴随帧数剧烈波动，从画面和帧数表现来看怎么也称不上“流畅”。再加上本身绝区零的操作频率就比较高，因此哪怕在 1280p 分辨率下实际游玩体验基本上处于不可玩的状态，更稳妥的做法还是用 PlayCover 装上砸完壳的 iPad 版绝区零。

### 限制

除了性能问题之外，游戏本身 42 天一个大版本的更新也会成为噩梦。虽然每个版本内的热更新可以通过重启游戏的方式自动安装并应用，但是游戏本体不能自己大更自己，只能使用启动器下载每个大版本的更新，完成后再用新的游戏资源目录覆盖掉虚拟机外的旧目录，这个过程通常要耗时半个小时甚至更长。如果使用 PlayCover 的方案，每个大更新过后需要等别人上传砸完壳的包，拖进 PlayCover 后就能运行。因为是 ipa 单文件的形式，所以理论上操作会简单很多，并且直接从 Arm 平台转译的性能损失远比从 x86 转译到 Arm 要小，iPad 端也原生做了优化（指阉割），理论上能达到全程高画质 60 帧或者中画质 120 帧的流畅体验。

## 总结

综上所述，在 Mac 上启动 PC 版绝区零的做法可行，但是仅限于“能启动”的水平，实际游玩体验非常糟糕。更稳妥的做法还是用 PlayCover 体验砸完壳的 iPad 版本，或者等云绝区零开放 Mac 端。