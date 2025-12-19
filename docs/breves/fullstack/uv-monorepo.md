---
title: 使用 UV 构建和管理 Monorepo
tags:
  - python
  - uv
  - monorepo
---

# 使用 UV 构建和管理 Monorepo

:::warning 观前提醒

1. 如果需要大量使用 CUDA 库的话不推荐使用，因为 uv 管理 CUDA 库太困难了，推荐古法 conda
2. 本文只讨论 python 项目的 monorepo 构建和管理，不考虑混合语言项目

:::

:::details 太长不看

[使用 uv workspaces 构建 monorepo](#使用-uv-workspaces-构建-monorepo)

:::

Monorepo 这个概念在前后端中都越来越常见，它可以将多个项目整合在一个仓库中，通过一个命令来安装所有依赖，并且项目之间可以方便地互相引用。因为我现在做的其中一个是方向是 low-level vision，不像 high-level vision 或者 AIGC 方向那样动不动就要装一堆 CUDA 库，因此可以用 uv 轻松安装和管理依赖（CUDA 库管理 UV 是真不擅长，有一部分原因是 nvidia 几个库的安装脚本都写得比较神人，UV 管理起来很吃力）。

## 你这代码保熟吗？科研代码中的复用难题

low-level vision 领域的工作当中会用到大量重复的代码，例如有特定版式要求的绘图代码，读取数据的代码（数据集就那么几个），以及每个研究室手上多多少少都捏着一些祖传妙妙小工具。

由于追求快速开发，科研代码总是给人一种混乱、能跑就行的印象（确实，而且直接 clone 下来能跑就已经超过 99% 的人了）。师兄传下来的代码往往是根据特定项目定制的，其主要特点就是“大部分能用，但是需要改几行再用”。这种“随改随用”的使用方式使得通过发布 pypi 包来复用代码的方式很难发挥作用，因为其对修改相对封闭，所以修改的话要么需要自己改本地包代码（上游版本更新后失效），要么需要大量的 wrapper 代码来实现自己想要的功能。那样的话发了包就和没发一样了，搞不好自己手动适配的工作量还更大。但是不发包吧，好像有时候每次又只要改几个参数或者一小段内容就可以，其他部分照样还是可以无脑复制粘贴的。

那么如果建一个纯代码的工具集合库，打包成压缩文件在研究室内共享，或者用 `git submodule` 引入到项目中，要用的时候自己改，是不是就可以解决这个问题了呢？

是也不是，这么做的主要问题就是你不能保证你的科研代码和工具代码使用的库版本一致，而两个 python 库哪怕只差了一个小版本内部实现就完全不一致导致结果无法复现的情况可太常见了。当然有人会说可以使用 `requirements.txt` 来解决这个问题，但是首先我相信应该不会有人用过之后还能忍住不开喷这个神人版本管理方式的，其次就算将库版本写入 `requirements.txt`，同一个项目内也不允许同时安装多个版本的 pypi 包。你的代码很好用，但是使用的是 numpy 1.26，当我拿出主仓库的 numpy 2.1 你又该如何应对？

因此为了解决这个问题，我们可以参考前端的 monorepo 管理方式：一个大仓库中允许共存多个子项目，每个子项目有自己的依赖环境，但是子项目之间又可以交叉引用。这样一来，我们既可以在各个科研代码中引入工具项目的函数而无需担心依赖版本冲突，又可以在需要修改工具函数的时候直接修改源码后调用，不必重新发布新包。当然如果工具库足够成熟，单独的依赖环境也提供了在包管理器上发布/更新包体的能力，这样就可以在需要的时候直接 pip install 引入，干净又卫生。

## monorepo 的基础：workspaces

在 monorepo 当中，workspaces（工作区）是一个约定俗成的概念，代表一个可以独立运行的项目。pip 肯定是不支持这个玩意的（anaconda 还真不清楚，好像是不行），原生支持 workspaces 的 python 包管理器有 uv、pants（不用主要是因为太复杂） 和 pixi。因为后两者劣势大于优势（点名批评 pixi，谁教你把 raw.githubusercontent.com 硬编码到源码里的？），因此这里主要介绍 uv 的 workspaces 功能。

关于 workspaces 的详细介绍可以参考 [官方文档](https://docs.astral.sh/uv/concepts/projects/workspaces/)，本文主要介绍我自己的配置。

## 使用 uv workspaces 构建 monorepo

### 目录结构

首先展示一下我的部分目录结构（省略与本文无关的目录）。其中 `sub-module` 就是我的工具包库，`dataset` 和 `models` 是科研代码中用到的数据集和模型。你会注意到主仓库和子仓库都有 `pyproject.toml` 和 `uv.lock` 文件，这是 uv 的 workspaces 功能所必需的。

特别注意子仓库中没有 `.python-version` 文件，按我测试的情况，所有工作区必须共享同一个 python 版本，否则会很麻烦。

```text
.
├── dataset
├── models
├── src
├── sub-module
│   ├── sub-module
│   │   ├── __init__.py
│   │   └── utils.py
│   ├── pyproject.toml
│   └── uv.lock
├── .python-version
├── pyproject.toml
└── uv.lock
```

### 主仓库配置

主仓库的 `pyproject.toml` 配置如下：

:::code-group

```toml [pyproject.toml (project-name)]
[project]
name = "project-name"
version = "0.1.0"
description = "Add your description here"
readme = "README.md"
requires-python = ">=3.12"
dependencies = [
    # ... 其他依赖
    "numpy>=2.0.0",
    "sub-module", # 工具包库名称，需要和工作区中的 `pyproject.toml` 中的 `[project]` 中的 `name` 一致
]

[tool.uv.workspace]
members = ["sub-module"] # 子工作区的相对路径列表，支持通配符 `*`，例如 "packages/*"

[tool.uv.sources]
sub-module = { workspace = true } # 声明工作区
```

:::

#### 让 pylance/pyright 正确工作

如果仅仅按照上面的配置，pylance/basedpyright 是无法正确识别工作区中的包的，会报 `reportMissingImports`。要让它能够正常识别到包内函数类型，需要添加一些额外的配置：

:::code-group

```toml [pyproject.toml (project-name)]
[tool.uv]
config-settings-package = {"sub-module" = { editable_mode = "compat" }}
```

:::

然后重新运行一次 `uv sync`，重启编辑器即可。

### 子工作区配置

子工作区的 `pyproject.toml` 配置如下：

:::code-group

```toml [pyproject.toml (sub-module)]
[project]
name = "sub-module"
version = "0.1.0"
description = "Add your description here"
readme = "README.md"
requires-python = ">=3.12"
dependencies = [
    "matplotlib>=3.9.4",
    "numpy>=2.0.2",
    "rich>=14.2.0",
]
```

:::

特别注意子仓库的 project name 必须和主仓库中的 `[tool.uv.workspace]` 中的成员名称一致，uv 是根据这个名称来识别工作区的，不是根据文件夹名称。

其实到这里所有的基础设置就已经完成了，接下来就是**在主仓库的根目录下运行**

```bash
uv sync
```

这样所有依赖就都安装好了。

### 调用子工作区函数

在主仓库中调用子工作区函数的方式和普通项目一样，直接导入即可。如果报错，检查一下导入路径是不是有问题，或者是不是被 `__init__.py` 干扰了。例如 `sub-module/sub-module/utils.py` 中有一个 `plot_image` 函数，可以在主仓库中这样调用：

```python
from sub_module.utils import plot_image
```

这样就可以调用子工作区中的函数了。

### 子工作区更新

子工作区内的文件更新后，需要在主仓库的根目录下运行 `uv sync` 来重新更新一次依赖。

```bash
uv sync
```

### 如果真的发生了依赖冲突

之前我们都是把子工作区当做一个正常的文件夹使用的，没有考虑过依赖冲突这个我们花了大量笔墨讨论的问题。事实上 uv 支持在不同工作区中使用不同的依赖版本（[文档](https://docs.astral.sh/uv/concepts/projects/config/#conflicting-dependencies)），你需要在主仓库中的 `pyproject.toml` 中添加一个声明：

:::code-group

```toml [pyproject.toml (project-name)]
[tool.uv]
conflicts = [
    [
      { extra = "extra1" },
      { extra = "extra2" },
    ],
]
```

:::

理论上就可以解决冲突问题。因为我自己也没有实际遇到过冲突，之后如果遇到了会补充过来。如果有人遇到这种情况并且解决了也欢迎在评论区留言。

### 构建包

如果想要构建和发布包的话，只需要在对应的子工作区下运行 `uv build` 即可。[官方文档](https://docs.astral.sh/uv/guides/package/)

## 参考

- [uv 官方文档](https://docs.astral.sh/uv/concepts/projects/workspaces/)
- [Cracking the Python Monorepo Build Pipelines with UV](https://www.reddit.com/r/Python/comments/1iy4h5k/cracking_the_python_monorepo_build_pipelines_with/) | [中文翻译](https://www.reddit.com/r/Python/comments/1iy4h5k/cracking_the_python_monorepo_build_pipelines_with/?tl=zh-hans)
- [uv-monorepo](https://github.com/JasperHG90/uv-monorepo)
- [exp-monorepo-python-uv](https://github.com/Gatsby-Lee/exp-monorepo-python-uv)
- [pyright - Editable installs](https://microsoft.github.io/pyright/#/import-resolution?id=editable-installs)
