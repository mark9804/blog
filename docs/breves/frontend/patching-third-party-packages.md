---
title: Patch npm 第三方包
description: 给 npm package 打补丁的几种方式
tags:
  - 前端
  - pnpm
  - 私库
---

# Patch npm 第三方包

在前一段时间的项目里，我需要给 [pixi-spine](https://github.com/pixijs/spine) 打补丁，以支持 4.2 版本的 spine 工程。

pixi-spine 有一个 [pixi.js v8 专用的版本](https://github.com/EsotericSoftware/spine-runtimes/tree/4.2/spine-ts/spine-pixi-v8) 叫 spine-pixi，这个版本原生（只）支持 spine 4.2。不过如果项目用的依然是 v7 甚至是 v6，那么就只能继续使用 pixi-spine。最让人感到绝望的是，pixi-spine 这个项目……很难说它是不是真的还活着。

![已经一年没动了](https://cdn.sa.net/2024/12/06/FquKUYoZywN5aLA.webp)

没关系，虽然上游库是不更新的，但是需求是客观存在的。总之，我们的需求从催上游更新变成了自己给第三方代码库打补丁。

这里介绍两种方式，`pnpm patch` 和私库。

## pnpm patch

pnpm 的 patch 功能可以让我们在安装第三方包的时候，自动将补丁应用到目标包上。它的原理是在安装目标包的时候，pnpm 会根据 `pnpm-lock.yaml` 文件中的记录，找到目标包的源码路径，然后将补丁文件应用到目标包上。比如这里我们需要修改 `pixi-spine` 包，那么命令就是：

```bash
pnpm patch pixi-spine@4.0.3
```

pnpm 会把对应包提取到一个临时文件夹，接着就可以修改对应文件夹中的代码了。这个文件夹基本不可能手打出来，不过没关系，pnpm 会在 CLI 中提示这个文件路径，在 VSCode 里直接 command(ctrl) + click 就可以打开。修改完成之后，再把命令行里提示的 `pnpm patch-commit` 命令执行一遍，pnpm 就会把修改后的代码替换回目标包，并生成一个 `patches` 文件夹和对应的 `package.json` 补丁字段。把对应文件提交到 git 之后，每次重新运行 `pnpm install` 时 pnpm 都会自动应用补丁。

## 李鬼战术：私库

GitHub 和 coding 都提供了私库功能，不过 GitHub 发布的库必须以组织名开头。而 coding 只要把 npm 源设置成私库地址之后就可以发布和源包同名的包。

![原来去年已经干过一次了](https://cdn.sa.net/2024/12/06/2rBdqxvNtiCeyM5.webp)

但是其实即使使用 GitHub 源，也可以使用 pnpm 的 alias 功能把李逵指向李鬼。

```bash
pnpm add pixi-spine@npm:@ba-archive/pixi-spine # 这个包实际上不存在，只是做个演示
```

alias 还有一个妙用，就是可以通过它来在同一个项目里引用不同的包版本。比如：

```bash
pnpm add pixi-spine-44@npm:@ba-archive/pixi-spine@4.0.4
pnpm add pixi-spine-43@npm:@ba-archive/pixi-spine@4.0.3
```

项目中就可以直接同时使用两个版本的包了。

```typescript
import { Spine as Spine44 } from "pixi-spine-44";
import { Spine as Spine43 } from "pixi-spine-43";
```
