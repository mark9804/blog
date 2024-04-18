---
title: macOS 命令行调教
description: 一部分更改 macOS 行为的命令行
tags:
  - macOS
  - 命令行
---

# 用命令行调教 macOS 系统行为

在 macOS 上，大部分应用程序的属性都可以通过一个叫属性列表（property list, plist） 的文件控制。Plist 内部的属性使用 XML 键值对存放，通过 plist 当中记录的属性可以控制应用程序和 macOS 系统的部分行为。网上一些付费的调教工具，例如 MacPilot，主要就是通过命令行修改对应的 plist 文件达到自定义系统行为的方式的。

我曾经是 MacPilot 的用户（毕竟懒是第一生产力），但是它在 v12 更新到 v14 的过程中做了两件我不是很能接受的事：

- 一次性付费改成订阅制，并且不提供一次性付费选项；
- MacPilot 12 不提供兼容 High Sierra / Sonoma 的更新。

虽然我可以为这种行为找到商业上的解释——要恰饭的嘛，不过用户也可以选择用脚投票。在 GitHub 上可以找到很多脚本用于修改 plist 文件，[这里](https://macos-defaults.com/) 也可以找到一份相当全面的文档。不过并不是所有选项都有修改的必要，这里记录一些我自己使用的修改参数和解释。

## 修改 Dock 行为

### 修改 Dock 显示/隐藏延迟时间

macOS 允许在 Dock 的空白处（主要是分割线处，其他地方点不到）右键点击，选择是否隐藏 Dock。隐藏后的 Dock 会在鼠标移到 Dock 的位置时**经过一定时间延迟后**展示出来。默认的延迟时间是 0.2 秒。通常我会觉得这个延迟完全没有必要，因此可以调整成 0 秒。

需要注意的是，如果你和我一样使用 [DockView](https://noteifyapp.com/dockview/)，那么允许隐藏 Dock 栏将会导致 DockView 的绘图位置偏下甚至完全挡住图标。这点暂时没有解决方案，如果对这一点特别介意可以继续使用 [hyperdock](https://bahoom.com/hyperdock)。（我邮件反馈过了，包括 DockView 本身有内存泄漏的问题（最高漏了我 42G）。开发者说自己测不出来，加上他受战争影响不能稳定开发，然后就没有然后了。直到现在 DockView 依然存在改善了一些的内存泄漏问题，和根本没有改善的卡死问题）

接受参数类型：`float`

默认值：`0.2`

调整后：`0` （立即显示 Dock）

```bash
defaults write com.apple.dock autohide-delay -float 0 && killall Dock
```

注意在对 Dock 进行修改时，大部分命令执行后都需要重启 Dock 才能看到效果。可以通过 `killall Dock` 命令重启，下文不再赘述。

### 修改 Dock 隐藏/显示动画时长

默认状态下，Dock 隐藏（收回）和完全显示（弹出）的时间是 0.5 秒。如果你喜欢更快的动画，可以把这个时间调短。

接受参数类型：`float`

默认值：`0.5`

调整后：`0.15` （更快的隐藏和显示动画）

```bash
defaults write com.apple.dock autohide-time-modifier -float 0.15 && killall Dock
```

### 在已启动的应用程序上显示指示黑点

默认情况下，Dock 当中运行中的应用程序、未启动的应用程序和隐藏的应用程序在表现上没有任何区分。接下来的两个命令会分别在运行中的应用程序下方显示一个黑色指示点（官方叫 process indicator），以及用半透明图标显示已启动但被隐藏到后台的应用程序。

![从左到右：运行中的应用；隐藏的应用；未启动的应用](https://raw.githubusercontent.com/mark9804/typora-image-repo/master/uPic/image-20240417015632606.png)

首先是显示 process indicator，隐藏应用程序的命令在下一条。

接受参数类型：`bool`

默认值：`false`

调整后：`true`

```bash
defaults write com.apple.dock show-process-indicators -bool true && killall Dock
```

### 半透明显示隐藏的应用程序图标

接受参数类型：`bool`

默认值：`false`

调整后：`true`

```bash
defaults write com.apple.dock showhidden -bool true && killall Dock
```

## 修改 Finder 行为

### 显示/隐藏桌面图标

macOS 允许隐藏桌面上的图标——事实上我更推荐一个叫 [OneSwitch](https://fireball.studio/oneswitch/) 的应用，它可以在状态栏上显示一个图标，点击图标后允许你执行一件切换亮色/暗色模式、一键开关 true tone 之类的好用小功能，其中也包括隐藏桌面图标。不过如果你不想安装额外的应用，可以通过命令行来实现。

:::warning

1. 隐藏桌面图标后，你的桌面将是白茫茫一片真干净。除非你知道怎么打开 Finder，否则你将无法访问桌面上的文件。
2. 桌面小组件（widgets）不会被隐藏。

:::

接受参数类型：`bool`

默认值：`true`

调整后：`false`

```bash
defaults write com.apple.finder CreateDesktop -bool false && killall Finder
```

![隐藏后的效果](https://raw.githubusercontent.com/mark9804/typora-image-repo/master/uPic/Snipaste_2024-04-17_02-32-35.jpg)

### 更改文件扩展名时不再显示警告

在默认设置下，如果你更改了文件扩展名（`.txt` 之类的），macOS 会弹出一个对话框，询问你是否确定要更改。既然你都看到这了，那这个对话框对你来说可能就是多余的了——真正需要这个对话框的人是不会有心思折腾这些的。

接受参数类型：`bool`

默认值：`true`

调整后：`false`

```bash
defaults write com.apple.finder FXEnableExtensionChangeWarning -bool false && killall Finder
```

注意你需要重启 Finder 之后，这个设置才会生效。

### 允许在 QuickLook 预览中选择文本

macOS 提供了一个非常好用的空格预览功能（顺便强烈推荐 [Syntax Highlight](https://github.com/sbarex/SourceCodeSyntaxHighlight) 这个插件，可以让 QuickLook 预览代码时高亮显示），但是默认情况下你无法在 QuickLook 预览中选择文本。这行命令可以允许你在预览图片时选择其中的文本（可能要 Apple Silicon 芯片的 Mac 才有效，我没测试过 Intel 芯片的情况）

接受参数类型：`bool`

默认值：`false`

调整后：`true`

```bash
defaults write com.apple.finder QLEnableTextSelection -bool true && killall Finder
```

## 修改系统行为

### 阻止 macOS 在网络存储设备上创建 `.DS_Store`

macOS 文件管理系统被喷的最多的一个地方就是宛如牛皮癣一样的 `.DS_Store` 文件。这个文件是 Finder 用来存储文件夹的自定义属性的，但是在网络存储设备还有 USB 设备里这个文件会变得非常碍眼。毕竟不是人人都用苹果，而且有一部分文件遍历脚本会因为 `.DS_Store` 文件而出错。

虽然我们不能阻止 macOS 在本地磁盘上创建 `.DS_Store` 文件，但是我们可以阻止 macOS 在网络存储设备和 USB 存储设备上创建这个文件。

接受参数类型：`bool`

默认值：`false`

调整后：`true`

```bash
defaults write com.apple.desktopservices DSDontWriteNetworkStores -bool true
```

注意这个设置可能需要登出后重新登入才会生效。

### 阻止 macOS 在 USB 设备上创建 `.DS_Store`

同上，只是这次是针对 USB 设备。

接受参数类型：`bool`

默认值：`false`

调整后：`true`

```bash
defaults write com.apple.desktopservices DSDontWriteUSBStores -bool true
```

## 参考链接

- https://macos-defaults.com/
- https://github.com/jgamblin/MacOS-Config/blob/master/OSConfig.sh
- https://gist.github.com/xpepper/9537157
- https://gist.github.com/tsmith512/9e7f0144be6957a37f3b1d7ebcd8d9bc
- https://gist.github.com/sickcodes/912973b2153b0738ff97621cde4c2bb5
- https://gist.github.com/ChristopherA/98628f8cd00c94f11ee6035d53b0d3c6
