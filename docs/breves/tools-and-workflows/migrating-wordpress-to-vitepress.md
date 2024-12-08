---
title: VitePress 从迁移到部署
description: 我迁移到 VitePress 的经过。
tags:
  - VitePress
  - Vercel
---

# VitePress 从迁移到部署

## 从自托管到静态页面托管服务

从我的上一个博客过来的朋友可能知道我以前有一个自己的域名和 VPS，而且是用 [WordPress](https://wordpress.org/) 作为博客框架的。准确点说，我当时用的是 LAMP（Linux、Apache、MySQL、PHP）架构，再加上独立服务器，一看就是天生 WordPress 圣体。

> 叠甲：以下论点仅针对单人维护的静态博客，如果你的网站是面向多人共同维护的博客或者干脆是动态网站，以下的情况你不一定会遇到，这些内容可能也不一定适合你。

自托管博客的好处是随时随地都能登录后台写上两行，并且可以自由控制需不需要游客登录后才能评论（我不太喜欢 giscus 的一点就是它强制评论的用户拥有 GitHub 账号，但不是所有人都愿意注册 GitHub 的）。当然，除了需要自己续费域名和服务器外，WordPress 还有一个最大的缺点：对于一个单人维护的静态博客来说，WordPress 过于笨重了。

作为一个 CMS，WordPress 自带了旧版和 Gutenberg 两套编辑器，自带了一套完整的 RBAC 权限控制系统，自带了一套在运行时渲染的插件系统，你甚至可以用它来做一个完善的商业购物网站。然而对于静态博客来说，作者撰写文章不需要登录甚至不需要后台，读者不需要拥有账号（真的关注内容的读者会通过 RSS 订阅，不关注内容更新的读者只会把文章更新的邮件直接扔进垃圾箱），博主也不需要针对不同的用户设置不同的内容可见性，更不需要一个完善的商城系统。

WordPress 的笨重不仅体现在管理后台，还体现在前端页面上。WordPress 每获取一篇文章内容都需要从数据库中查询相应的文章数据并动态渲染成 HTML 页面。但是不管是谁来访问、什么时候访问，文章的内容都不会发生改变，那为什么用户的每次访问都还要从数据库中查询数据呢？

也有开发者注意到了这个问题，开发出了备受欢迎的 WP Super Cache 或者 Memcached 等插件来缓存页面，然而算法在不优化的情况下无非是时间换空间或者空间换时间，缓存会大量占用服务器的 RAM 资源（并且还会 miss），对服务器本身的配置要求又要上一个台阶。我的上一台 512MB 内存的 VPS 就经常因为内存不足导致数据库挂掉。又由于渲染文章详情页面需要查表，所以 Cloudflare Always-On 也并不能有效缓存下文章详情页面，一旦数据库爆炸谁都别想访问。

于是随后就出现了专门针对仅单人维护的静态博客的场景，仅在构建时生成 HTML 页面并推送至服务器的框架，例如宣称自己就是一个“快速、简洁且高效的博客框架”的 [Hexo](https://hexo.io/)。Hexo 的路由是基于 Markdown 文档的传统多页面路由（据我所知，可能现在改了），能够在构建时生成静态 HTML MPA 页面——由于它是静态的，所以它甚至能支持 GitHub Pages 这类静态页面托管服务。只需要在 GitHub 上创建一个特定名称的仓库（曾经是这样的），在每次写完之后在本地构建一下然后把构建好的页面推送到 GitHub 上，就可以让自己的文章暴露到互联网上了。这些框架也极其轻量，不需要折腾半天 bash 命令来安装 LNMP 全家桶，也不需要配半天 WordPress 配置文件（最后大概率还忘了数据库用户名密码），也获得了相当一部分的拥趸。

那么说回 VitePress 或者 VuePress，它们有提出了哪些改进呢？（前方语言的艺术大量出没）

比起 Hexo 之类的框架，VuePress 和 VitePress 更像是一个防御型产品，React 没有的我们可以没有，React 有的我们也得在我们的生态里整一个定位类似或者相同的替代品出来。VuePress 好就好在它用了 Vue，VitePress 好就好在它用了 Vue 和 Vite。不过当然，我认为 VuePress 和 VitePress 的产品战略是完全正确的，他们确实获得了相当多 Vue 开发者的青睐，而这些青睐和自发宣传也会让更多人愿意了解和使用 VitePress。

所以我迁移到 VitePress 的原因其实说白了也很简单，我现在没有时间和精力来维护自己的域名和服务器了，因此我需要一个主打静态页面生成的博客框架；正好我是 Vue 开发者，因此我选择了 VuePress 的继任者 VitePress。最后，因为我希望我的博客能从国内访问~~测试了一下 Vercel 好像不能~~，所以我基本上只能在 Vercel、Netlify 和 Cloudflare Pages 之间选择。Cloudflare 是众所周知的国内减速器，Netlify 的免费构建时间又比 Vercel 缩水了整整 100 倍，因此经历了两天思考之后我最终选择了 ~~Vercel~~ Netlify。不过没关系，我可以用 GitHub Pages 首页来做跳板，之后想跳到哪就跳到哪。

## 从 WordPress 到 VitePress

VitePress 使用的是基于文件的路由系统，每一篇文章都是一个以 `.md` 结尾的 Markdown 纯文本文件，而 WordPress 的所有文章都存储在数据库中。因此我们需要先把数据库中的文章导出成 Markdown 文件。

很不幸的是 WordPress 没有直接提供导出文章为 Markdown 文件的功能，因此我们需要曲线救国，先在后台把数据库导出成 xml 文件，再使用 [wordpress-export-to-markdown](https://github.com/lonekorean/wordpress-export-to-markdown) 将 xml 文件转换成 Markdown 文件。转换后的图片根据会单独存放进一个文件夹并被 Markdown 文件以一个相对路径引用，因此还需要根据自己的图床设置或者图片路径设置重新调整一遍图片链接。

VitePress 的使用官方已经描述得相当清晰，网上也有大量教程，此处不再赘述。需要提醒的是，VitePress 官方的脚手架命令 `pnpx vitepress init` 现在默认把当前的工作目录作为根目录，并且不会提供完整的 `package.json` 文件。如果你打算把 VitePress 作为一个单独的项目部署，则在跑完官方脚手架命令之后还需要手动安装 `vitepress` 依赖。一个最小可用的 `package.json` 文件应该是这样的：

:::code-group

```json [package.json]
{
  "scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs"
  },
  "dependencies": {
    "vitepress": "^1.5.0"
  }
}
```

:::

## 从本地到云端

如果你使用的是 Vercel/Netlify/Cloudflare Pages 这类自托管服务，只需要在对应的后台导入对应的 GitHub 仓库即可，Vercel 会自动识别前端仓库框架并使用对应的默认配置。之后只需要在本地写完文章后 git push 到 GitHub 上，Vercel/Netlify/Cloudflare Pages 就会自动按照预设的部署工作流更新构建。网上分析各个托管服务优劣的文章也很多，这里就不赘述了。

如果你使用的是 Vercel，特别需要注意的是 Vercel 默认的 git clone 操作是 shallow clone，如果你的 VitePress 应用需要使用 git 子模块或者需要调取完整的 git 历史记录，可以参考[这篇文章](../frontend/vercel-deep-clone)获取完整克隆。

不过如果使用的是 GitHub Pages 的话，则需要用户手动在 GitHub 后台设置 Pages 的来源为 GitHub Actions，并添加对应的 Actions 工作流文件（可以参考[我的这个 workflow 文件](https://github.com/mark9804/blog/blob/713bf77fe6b0f3f245db37d1a2741bbce6cc6963/.github/workflows/deploy.yml)）。并且通过 Actions 构建的文件只会被托管在对应的 `https://username.github.io/仓库名/` 目录下，因此还需要在主站配置文件中调整对应的 base 路径。如果希望自己的博客被部署在自己的 Pages 主页上，则需要自己手动构建并且只 push 构建好的文件到 `username.github.io` 仓库中。

当一切都准备就绪后，你只需要在本地对应的位置新建好空白的 Markdown 文件并开始写作，写完之后把仓库 push 到 GitHub 上，剩下的事情就可以不用管了，Ops 流水线会接管剩下的工作。这也是 VitePress 对我而言吸引力最大的地方：由于日常琐事繁忙，我希望自己能够专注于写作本身，而不是折腾各种部署和托管服务。
