---
title: 我的 VitePress 博客写作流程
description: 我使用 VitePress 写文章使用的工具、插件和流程。
tags:
  - 工作流
  - VitePress
  - VSCode
  - Markdown
  - Watermarkly
---

# 我的 VitePress 博客写作流程

之前提到过“VitePress的设计用途是用于存放技术文档”，因此理论上它并不是非常适合博客这种需要频繁更新内容的场景。不过好在 VitePress (Vite) 和 VSCode 的扩展足够强大和灵活，能够弥补 VitePress 在这一方面的先天不足。

不管博客的页面做得多么花里胡哨，一个网站能吸引和留住用户的核心依然是内容。为了将博客的维护专注在“内容输出”这个核心步骤上，我需要尽可能地减少写作之外的干扰。因此我需要尽可能地简化写作流程，并尽可能地自动化写作之外的工作。这篇文章就分享一下我使用 VitePress 写博客的流程。

## 开始之前：自动更新侧边栏

技术文档类型的静态网站通常有一个内容固定的侧边栏，基本只有在大版本更新的时候才需要进行调整。然而博客的侧边栏作为文章导航，需要经常进行更新来反映文章增删。要是每写一篇新文章都需要手动更新一次侧边栏，那真的还不如用回 Hexo 或者 WordPress 这种专门为内容型网站设计的 CMS 框架。

好在这个问题可以通过 [VitePress Sidebar](https://vitepress-sidebar.jooy2.com) 插件解决。不过因为我使用了“长文章+短动态”的文章存储结构，直接使用插件提供的 `withSidebar` 函数会导致侧边栏的链接无法正常高亮。因此我的做法是先使用插件生成侧边栏数据，接着手动递归处理子元素。你可以[在这里看到我的修改](https://github.com/mark9804/blog/blob/4edd1cec2fc6eae41c73a918927502221a54f502/docs/.vitepress/config.ts#L14-L25)，以及[我的详细侧边栏配置](https://github.com/mark9804/blog/blob/4edd1cec2fc6eae41c73a918927502221a54f502/docs/.vitepress/configs/sidebarConfig.ts)。

## 使用 VSCode 写作

### 使用 Markdown Image 插入图片外链

在曾经一段时间里我是使用 [Typora](https://typora.io/) 写作的，因为我需要使用它插入图片后即可自动上传到图床的功能。但是 Typora 主打的 WYSIWYG（所见即所得）编辑器对我而言有时候是个负面优化，所以我经常在使用它的源代码编辑模式撰写文章，直到我发现了 [Markdown Image](https://marketplace.visualstudio.com/items?itemName=hancel.markdown-image) 这个超神的 VSCode 扩展。

Markdown Image 支持自动上传图片到图床后获取图片链接并插入，并且可以自定义图床服务商，完全替代了 Typora + PicGo 的组合。我把它的快捷键设置成了 <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>V</kbd>，并把上传后自动生成的图片名改成了 `SHA256`。我使用 `SHA256` 的原因是因为它中间没有空格，想要修改的时候直接双击一下图片名就能选中整个字符串了（就是 SHA256 确实太长了点）。我给插件提了两个 Issue，一个是使用更短的 `xxhash.h32` 生成唯一图片名称，第二个是支持批量插入图片。

VitePress 本身是没有显示图片描述的功能的，我通过 [markdown-it-implicit-figures](https://github.com/arve0/markdown-it-implicit-figures) 插件将图片名称作为描述插入到 Token 中的 `content` 属性中，然后修改 Markdown It 的 `img` 规则集（[实现在这里](https://github.com/mark9804/blog/blob/4edd1cec2fc6eae41c73a918927502221a54f502/docs/.vitepress/configs/markdownConfig.ts#L47-L49)），把图片全部渲染成了支持点击放大的组件（[实现在这里](https://github.com/mark9804/blog/blob/4edd1cec2fc6eae41c73a918927502221a54f502/docs/.vitepress/theme/utils/generateImgComponent.ts)），并能够在图片下方显示 `<figcaption>` 元素（[实现在这里](https://github.com/mark9804/blog/blob/4edd1cec2fc6eae41c73a918927502221a54f502/docs/.vitepress/theme/components/ElysiumUI/ElyImageGallery.vue#L35-L41)）。要是上游仓库之后做了生成图片名称的逻辑修改，我打算看看实现然后提个 PR 让它支持从 CLIP 生成图片描述。对于一些想不出描述的图片我就可以让 AI 代劳。比起完全留空 caption，使用 CLIP 生成一个描述图中大致内容的 caption 也对视障人群要友好得多。

### 使用快捷键和快捷操作提升效率

VSCode 的 Markdown 快捷键不够丰富，当编辑富文本的时候经常需要手动输入特殊字符。加上中文大部分时候都在用全角字符，输入半角还需要切换一下，因此效率不是很高。我之前在 [这篇文章](./customize-vscode-markdown-shortcuts) 中介绍过我使用 `snippet` 定制的 VSCode 快捷键配置，包括了加粗、斜体、删除、下划线和上下角标，感兴趣的可以看看。

VSCode 针对 Markdown 还有一些特殊优化，比如当选中文字并按下粘贴后，假如粘贴的内容是一个链接，VSCode 会自动帮你插入一个 `[Link Text](Link URL)` 的 Markdown 链接模板。

## 使用 Watermarkly 模糊照片中的敏感信息

我有空的时候喜欢旅游和拍照，因此也积累下了不少照片。不过众所周知游客照没有游客是不完整的，而没有取得对方授权的情况下把对方照片发到网上是侵犯肖像权的。因此在把照片传上图床之前我需要把图片中的人物面部和车牌信息给模糊掉，避免可能产生的纠纷。

一张照片里可能有几十上百个人，一个个用 PS 手动处理肯定是不现实的。网上有很多号称 AI 照片处理的工具，但是实际测下来效果都不尽人意，要付费就算了，还不提供买断。试用一圈下来，效果最好的还是 [Watermarkly](https://watermarkly.com/blur-face/) 还有老牌的 [iloveimg.com](https://www.iloveimg.com/)（ilove 这家公司有点良心过头了）。其中最牛皮的是 Watermarkly，完全是在本地运算的，保存成本地应用后断网也能用，支持批量转换，就是 UI 和交互体验有些抽象。iloveimg 是免费的，不过效果远远不如 Watermarkly，并且只能打方形马赛克。我给 Watermarkly 充了个永久会员，打算以后就用它了。

## 使用 macOS Workflow 批量转换图片格式

众所周知图床是有使用空间上线的，而大部分图片的格式都是 JPEG 或者 PNG，占用体积不小。因此在上传之前我通常都会把图片用 [cwebp](https://developers.google.com/speed/webp/docs/cwebp) 转换成 WebP 格式。

cwebp 是一个 CLI 工具，不支持批量处理。会熟练使用 bash `for loop` 的用户可以把需要转换的文件统一放到一个文件夹中再使用 `for` 循环批量转换，不过我用的是 mac，自带一个 Automator 可以批量接收输入。因此我写了[一个 Quick Action](https://github.com/mark9804/macos-scripts/tree/master/Quick%20Actions/) 来批量转换选中的文件（[真的是自己写的，没删开源作者](https://www.zhihu.com/question/4389622860)），并把这个快捷操作绑定给了 <kbd>Cmd</kbd> + <kbd>E</kbd>。这样只要我选中图片之后再按下快捷键，脚本就会批量把图片转换好。（没有删除源文件的原因是我要比对转换后的图片和源文件相差大不大，以及如果默认参数转坏了可以手动转）

## 最后：Commit 和自动构建

我在 [这篇文章](./migrating-wordpress-to-vitepress#从本地到云端) 中提到过我使用的是 Vercel 的自动构建和托管服务。关于是手动构建还是 push 源代码然后云端自动构建，我的建议是后者，自动构建只要用过一次之后就再也不会想回去了。此外，自动构建的另一个好处是可以在云端留下原始的 Markdown 文件，避免某天电脑报废或者其他特殊原因导致文章源码和备份全灭，这对于任何内容创作者而言都很难接受。

## 最后的最后：学会使用 VSCode 预览插件，慎用 `vitepress dev`

我不知道是这个版本 VitePress 的问题亦或是我添加过自定义组件的问题，在我写文章使用 `vitepress dev` 预览的时候，写着写着浏览器会变得异常的卡，甚至整个预览页面都可能会崩溃。一看性能监视器，发现 VitePress 热更新文章的时候会留下一百多甚至两百多万个 DOM 节点，单页面占用内存最高能干到 4GB 以上。

![在写这篇文章时截的，截完图没多久页面就崩了 =360x](https://cdn.sa.net/2024/12/05/5WoXZLyvugqBtec.webp)

如果你是用的是原生没有怎么修改过的 VitePress，并且只关注自己的语法有没有闭合、有没有明显的格式错误，那么 VSCode 预览插件的体验会比 `vitepress dev` 好得多。除非有什么特殊需求，否则我建议在写文章的时候只使用 VSCode 的 Markdown 预览插件，尽量少用 `vitepress dev` 预览，直到这个问题以某种方式解决为止。
