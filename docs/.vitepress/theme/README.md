# Elysium UI

Elysium UI 是一个以个人博客为主要使用场景，为 VitePress 设计的主题。Elysium 取自古希腊神话中的“乐园”之意，希望博客能够成为志同道合者交流思想、分享知识的净土。

Elysium 主题对视觉障碍者友好，支持暗色模式，晕动症患者友好。

## 构成

Elysium 主题在 VitePress 基础上新增或修改了以下组件或视图：

- 首页
- 标签搜索页
- 文章详情组件
- (首页)用户档案组件
- (首页)开屏动态背景组件
- 图片组件（支持点击查看大图）
- 图库组件（支持点击查看大图和翻页）
- 图片预览组件（支持点击查看大图）
- 评论系统组件（基于 Giscus）
- 按钮组件
- 空间（Space）组件

此外，Elysium 整合了侧边栏自动生成功能，并且会根据文章类型自动切换侧边栏内容（详情见下文）。

### 长文章和短文章

Elysium 将文章分类为长文章和短文章两种类型。

**长文章 (Breve：二全音符)**

长文章储存在 `breves` 文件夹中。一篇长文章通常会围绕一个（或者一系列）相对完整的主题展开，在博客内容中占比应当较高。

**短文章 (Quaver：四分音符)**

短文章储存在 `quavers` 文件夹中。短文章通常结构较为松散，没有明确的主题，适合记录一些零碎的想法和状态。

长文章和短文章各自拥有独立的侧边栏（目录），这些目录在构建时会自动生成。目录的排序顺序为按文件名升序排序。

### 侧边栏分栏

详情请参考 [vitepress-sidebar](https://vitepress-sidebar.cdget.com/)。

## 主题色

Elysium 只有一个主题色变量 `accent`，代表亮色状态下的主色（例：主页的 Contact 按钮背景色）。

主题带有颜色自动生成功能，层级色板、暗色色板会根据主题色 `accent` 自动计算产生，不需要人工干预。

### 修改主题色

修改 `docs/.vitepress/configs/theme.scss` 中的 `$accent` 变量值即可。

`theme.scss` 变量说明：

- `$accent`：亮色状态下的主色（例：主页的 Contact 按钮背景色）
- `$base-opacity`：半透明显示的组件会应用此变量值作为透明度
- `$code-brightness-tune`：行内代码块中文字颜色的差分亮度。亮色模式下，行内代码文字会降低对应亮度；暗色模式下会增加对应亮度
- `$code-saturation-tune`：行内代码块中背景颜色的差分饱和度。亮色模式下，行内代码背景会降低对应饱和度；暗色模式下会增加对应饱和度
- `$disabled-opacity`：禁用状态下（例如按钮禁用）的透明度

## 使用

本主题暂无发布主题包计划，请自行下载源码并清空 `breves` 和 `quavers` 文件夹。绝大部分个性化内容都可以在 `docs/.vitepress/configs` 文件夹中找到和修改。

### 更改首页用户信息

修改 `docs/.vitepress/configs/userProfile.ts` 中的内容即可。

`userProfile.ts` 变量说明：

- `name`：用户名，支持多语言
- `email`：用户邮箱
- `avatar`：用户头像
- `bio`：用户简介
- `social`：用户社交链接。链接应当是一个数组，数组中每个元素是一个包含 `alias` 和 `link` 的对象。

### 修改主题色

参见 [修改主题色](#修改主题色)。

### 修改评论系统指向

Elysium 整合了 [Giscus](https://giscus.app/) 作为评论系统。相关配置可以在 `docs/.vitepress/configs/giscusConfig.ts` 中找到。你可以在 [Giscus 官网](https://giscus.app/) 生成适合自己的配置信息。

### 导航栏

导航栏的相关配置可以在 `docs/.vitepress/configs/navConfig.ts` 中找到。

### HTML 头部配置

HTML 头部配置可以在 `docs/.vitepress/configs/headConfig.ts` 中找到。

### 图库语法

Elysium 新增图库语法，支持一次性在文章中插入多张图片并批量展示。

语法如下：

```md
:::gallery <图库描述>
![](图片链接)
![](图片链接)
:::
```

### RSS 订阅

Elysium 整合了 [vitepress-plugin-rss](https://github.com/ATQQ/sugar-blog/tree/master/packages/vitepress-plugin-rss) 的 RSS 订阅功能，支持在首页和导航栏中显示 RSS 订阅源。RSS 文件在构建时会自动生成。

一般情况下你无需更改任何配置，不过如果你希望修改 RSS 订阅源的配置，可以在 `docs/.vitepress/configs/rssConfig.ts` 中修改。
