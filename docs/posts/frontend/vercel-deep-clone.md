---
title: 使 Vercel 在部署时克隆完整仓库
description: Vercel 部署时默认浅克隆，导致一些依赖完整 Git 克隆的工具无法正常工作。我们来解决这个问题。
tags:
  - Vercel
  - 前端
  - DevOps
---

# 使 Vercel 在部署时克隆完整仓库

根据 [Vercel 文档](https://vercel.com/docs/deployments/configure-a-build#configuring-a-build)，Vercel 在部署时默认只克隆最近的 10 次提交记录。

> When you make a deployment..., Vercel performs a "shallow clone" on your Git repository using the command `git clone --depth=10 (...)` and fetches ten levels of git commit history. This means that **only the latest ten commits are pulled** and not the entire repository history.

我的首页时间轴工具是基于 Git 的完整提交历史来实现的，浅克隆虽然不会报错，但是会让文章的展示顺序变得非常混乱。因此最后我使用 `git pull --unshallow <仓库地址> master` 深克隆了整个仓库，解决了这个问题。

（只想知道解决方案的可以退出了，这就是解决方案）

## 使用完整 git 记录覆盖 shallow clone

有时一个有点年头或者积极开发的仓库可能会有成千上万条提交记录，但是通常在部署时只需要拉取最后一次提交就足够了。

在使用 [git](https://git-scm.com/) 时，可以通过控制 [clone depth](https://git-scm.com/docs/git-clone#Documentation/git-clone.txt-code--depthcodeemltdepthgtem) 来控制克隆的深度。Vercel 就使用了 `--depth=10` 的参数。因此我的第一想法就是添加一条 `git pull --unshallow` 来克隆完整仓库：

```bash
[xx:xx:xx.xxx] There is no tracking information for the current branch.
[xx:xx:xx.xxx] Please specify which branch you want to merge with.
[xx:xx:xx.xxx] See git-pull(1) for details.
[xx:xx:xx.xxx]
[xx:xx:xx.xxx]     git pull <remote> <branch>
[xx:xx:xx.xxx]
[xx:xx:xx.xxx] If you wish to set tracking information for this branch you can do so with:
[xx:xx:xx.xxx]
[xx:xx:xx.xxx]     git branch --set-upstream-to=<remote>/<branch> master
```

怪了，正常情况下仓库文件夹里应该有 git 记录的，怎么连当前分支记录都没有。后来经过尝试，又加上了 `仓库地址` 和 `分支` 两个必需参数才成功。但是经过这么修改之后的 `vercel.json` 文件就不能视为模板直接粘贴到新项目里了，有没有更好的模板化解决方案呢？

## Vercel 环境变量？

随后我在网上搜索了一下，在 Vercel 的 [这个 Discussion](https://github.com/vercel/vercel/discussions/5737) 中找到了类似的解决方案。另外也有人给出了使用 Vercel 环境变量 `VERCEL_DEEP_CLONE=true` 的解决方案。但是测试后发现**这个环境变量会让构建卡死**，log 提示 `There was a permanent problem cloning the repo.`。而 Vercel 的免费构建时间是有每月上限的（6000 小时 = 4 天 4 小时），因此要是一不注意这个月就别想构建了。

因此目前来看，使用 `git pull --unshallow` 虽然不能满足模板化需求，但是至少可以正常工作。

我的完整 `vercel.json` 文件如下：

:::code-group

```json [vercel.json]
{
  "github": {
    "silent": true
  },
  "framework": "vitepress",
  "installCommand": "git pull --unshallow https://github.com/mark9804/blog master && pnpm install",
  "buildCommand": "vitepress build docs --base /"
}
```

:::
