---
title: 使 Vercel 在部署时克隆完整仓库
description: Vercel 构建目录可能没有 Git remote 并浅克隆。显式指定仓库 URL 和当前 HEAD，用 git fetch --unshallow 补齐提交历史。
tags:
  - Vercel
  - 前端
  - DevOps
ai_usage:
  used: true
  level: assist
  summary: 原文由作者撰写，AI 协助复现浅克隆问题并整理本次更新。
  llms:
    - name: gpt-6.2-sol
      summary: 复现 Git 行为并补充构建配置示例
---

# 使 Vercel 在部署时克隆完整仓库

Vercel 在从 Git 部署时默认使用深度为 10 的浅克隆。我的首页时间轴会用文章在 Git 中最早的提交时间排序。历史截断后，一批旧文章会被当成在浅克隆的边界提交里同时新增，构建照常成功，首页顺序却乱了。[Vercel 构建文档](https://vercel.com/docs/builds/configure-a-build)

## 2026-11-19 更新：显式指定仓库 URL 和当前 HEAD

后来我把构建命令换成了 `git fetch --unshallow`，结果发现 Vercel 还能阴我一招：克隆下来的仓库有可能不带原始仓库地址。省略仓库地址时，Git 会找当前分支关联的远端，缺省用 `origin`。于是这条命令就可能什么都没拉，但是返回退出码 `0`。（[Git fetch 文档](https://git-scm.com/docs/git-fetch)、[Vercel 社区实测](https://github.com/vercel/vercel/discussions/5737#discussioncomment-7984929)）

我用这个仓库做了个深度为 10 的克隆，移除 `origin` 后重跑旧命令。命令执行成功，`git rev-parse --is-shallow-repository` 仍然输出 `true`，`git rev-list --count HEAD` 也仍然是 `10`。构建命令里的 `&&` 只看退出码，于是 VitePress 照常构建。线上有 78 篇文章的创建时间被算成了同一个边界提交的时间。

现在我在构建前判断仓库是否是浅克隆，再显式从 GitHub 补齐当前提交的历史。

```sh
if [ "$(git rev-parse --is-shallow-repository)" = true ]; then
  git fetch --unshallow --no-tags https://github.com/mark9804/blog.git "$(git rev-parse HEAD)"
fi
```

`$(git rev-parse HEAD)` 取的是 Vercel 正在构建的提交 SHA。`git fetch` 会补齐它的历史，当前 `HEAD` 保持原位。用到自己的项目时，换成对应的仓库 URL 即可。下面是本站 `vercel.json` 里的构建配置。

```json [vercel.json]
{
  "framework": "vitepress",
  "installCommand": "corepack pnpm install --frozen-lockfile",
  "buildCommand": "if [ \"$(git rev-parse --is-shallow-repository)\" = true ]; then git fetch --unshallow --no-tags https://github.com/mark9804/blog.git \"$(git rev-parse HEAD)\"; fi && PLATFORM=vercel corepack pnpm build --base /"
}
```

## 最初用 `git pull` 补齐历史

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

Vercel 的讨论帖里还有人提到 `VERCEL_DEEP_CLONE=true`。我当时试了一下，构建卡在克隆阶段，日志提示 `There was a permanent problem cloning the repo.`，就继续用了显式指定仓库地址和分支的 `git pull --unshallow`。[Vercel 讨论帖](https://github.com/vercel/vercel/discussions/5737)
