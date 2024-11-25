---
title: briss + Acrobat 搭建日语书籍 OCR 工作流
createdAt: 1602911960000
tags:
  - 工作流
  - briss
  - Acrobat
  - OCR
---

# briss + Acrobat 搭建日语书籍屏幕阅读工作流

> 这篇是从我的 B 站账号搬运过来的，所以如果在 B 站上看到[一模一样的文章](https://www.bilibili.com/read/cv7985646/)，不是非授权转载，是我自己授权我自己。

这篇文章涉及到基础的命令行操作。

## ABBYY / Acrobat 单软件 OCR 工作流存在的问题

起因是这样的，我们教授要搞读书会，书籍通过扫描件的方式分享给参加的人。既然是扫描件，自然是不包含任何文字信息的，所有页面都以图片的方式存储。但是当时的我日语词汇量还不能支持专业性太强的书籍，因此需要先提前阅读一遍书籍，把不会读的汉字给查出来。如果提前过一遍 OCR 的话，那么查询的效率会高很多。因此在开始阅读之前，我会先使用 Acrobat 预先处理一遍。

但是 Acrobat 对于日语的识别经常不是很精确，所以我转向了被许多人吹爆（MarginNote 本身也集成了）的 ABBYY Reader，不过实际试用下来效果非常差，对比之下 Acrobat 的识别效果反而好了太多。

![ABBYY Finereader Pro for Mac 与 Acrobat DC Pro OCR 效果横向对比，Finereader 有很多处识别不出来](https://cdn.sa.net/2024/11/25/XrKduxL3zZjBH4l.webp)

但是我很喜欢 ABBYY “在 OCR 的过程中自动把整张页面分成两个部分”的功能。分成两页之后，文档在 iPad 上的排版就可以变成纵向流式排版，不再需要因为文字太小需要左右滑动或者频繁缩放。然而 Acrobat 并没有这个功能。

![ABBYY 在进行 OCR 操作时会自动完成页面切割](https://cdn.sa.net/2024/11/25/QH3LflP8xepiXSG.webp)

然后我搜索了一下有没有什么奇怪脚本可以实现这个功能——在 Adobe 社区里面找到了一个第三方写的脚本，$40。

![这个脚本能实现居中切割，40刀](https://cdn.sa.net/2024/11/25/EuLCUHOInyNzTxb.webp)

不是哥们，你还不如去抢银行呢。

那么，有没有一个工作流既能够享受到分割单页带来的阅读上的方便，又能够利用 Acrobat 更加准确的 OCR 结果呢？

## 使用 briss 分割页面

briss 是一个 Java 应用，需要 Java 环境才能运行。

briss 唯一的功能就是分割页面。载入文件之后，briss 会分析页面排版，然后提取出重叠最多的部分形成切割矩形。可以通过左上角和右下角的手柄调节矩形大小和位置，也可以直接在页面上拖动新建范围。（**briss 不会修正倾斜页面**）

![briss 的页面分割界面，可以手动调整切割范围](https://cdn.sa.net/2024/11/25/kIOuzZKvcRqUWAS.webp)

在 macOS 上使用 briss 有两种方式：第一种是从 [SourceForge](https://sourceforge.net/projects/briss/) 上下载 jar，然后通过终端的 `java -jar [briss.jar路径] [pdf文件路径]` 运行；另一种方式是通过 homebrew 安装 briss Formula，然后直接使用 `briss [pdf文件路径]` 运行。

在 Windows 上只能先安装 Java SRE/JDK，下载 briss，然后运行 jar 文件。

虽然briss有启动后再选择文件的功能，但是那个选择界面实在是太低效了，我个人更推荐命令行方式。

![选择菜单栏 Action → Crop PDF 选项就可以得到一份单页 PDF 文件](https://cdn.sa.net/2024/11/25/1dHO5MScVgB8XCm.webp)

导出之后，得到了单页 PDF 文件，接着可以再使用 Acrobat 打开进行正常 OCR 操作。

## 工作流梳理

1. 使用 briss 分割页面；
2. 使用 Acrobat 打开单页 PDF 文件进行 OCR；
3. 导入到常用的阅读工具中阅读。
