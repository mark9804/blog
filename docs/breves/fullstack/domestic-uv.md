---
title: 在国内环境中使用 UV
tags:
  - python
  - uv
---

# 在国内环境中使用 UV

## 背景

最近我基本上都用 uv 来做 python 的包管理，因为比起 conda pip 来说，uv 的包管理更加简单，而且更加灵活。比如上传论文代码的时候一般要带上 package list，如果用 conda 的话，就需要这样生成：

```bash
conda env export > environment.yml
pip freeze > requirements.txt
```

如果用 uv 并且平时用 `uv add` 来添加依赖的话，代码发布的时候什么都不用做，只要把 `pyproject.toml` 和 `uv.lock` 一起打包就可以了。并且在恢复环境的速度上，uv 也远比 anaconda 来得快。

## 问题

因为学校的服务器卡比较旧，所以我自己在国内租了个服务器（能报销）。但是众所周知国内的网络环境有各种各样的问题，因此 `uv` 也没办法直接使用。比如说：

1. 无法使用官网脚本安装
2. `uv python install` 速度很慢或者直接失败
3. `uv add` 速度很慢

这几个问题都是网络环境导致的，需要配置镜像或者代理解决。

## 解决方案

先说镜像源/代理源，网上很多教程会推荐使用同步及时并且没有商业公司干涉的清华源，但是清华源的主要问题是 1）用的人太多了，拉取速度有时候会特别慢；2）有时候大学校园网会封闭，整个源都无法使用。因此我其实更建议使用阿里的源，速度比较快。设置可以这么设置，后面会用到。

```bash
pip config set global.index-url https://mirrors.aliyun.com/pypi/simple/
```

### 安装

uv 官网的脚本中其实是能够读取本地环境变量的：

```bash
export UV_INSTALLER_GHE_BASE_URL=https://ghfast.top/https://github.com; curl -LsSf https://astral.sh/uv/install.sh | sh
```

但是后续更新的时候还是需要重新设置，所以其实我不推荐这么做，不如使用 pip 安装。

使用 pip 安装的优点在于我们一般已经设置过镜像源了，之后的更新会由 pip 接管，所以也不需要多去操心。坏处就是系统要有基础的 python 环境（这个一般都有），uv 的更新也会麻烦一些，不能使用 `uv self update` 了。

安装：

```bash
pip install uv
```

更新：

```bash
pip install uv --upgrade
```

### 设置 python 下载地址

如果在新项目里初次使用 `uv sync` 或者 `uv add`，uv 会自动配置好 venv 环境并且下载对应的 python 版本。但是很不幸，uv 是从 github 下载 python 的，就出现了 `uv sync` 或者 `uv add` 执行了但是半天没有输出，或者等了很久直接报错的情况。检视错误信息，会发现错误是由于 uv 尝试从 `https://github.com/astral-sh/python-build-standalone/releases/download` 下载文件导致的。

这个下载地址可以通过配置环境变量 `UV_PYTHON_INSTALL_MIRROR=https://ghfast.top/https://github.com/astral-sh/python-build-standalone/releases/download` 解决，我使用的是 ghfast.top 的镜像。虽然这个镜像有时候速度没那么快，不过我一时也不知道其他的稳定镜像，所以暂时先用着。

```bash
export UV_PYTHON_INSTALL_MIRROR=https://ghfast.top/https://github.com/astral-sh/python-build-standalone/releases/download
```

你也可以一劳永逸地把这行命令写到 `~/.bashrc` 里。

```bash
echo "export UV_PYTHON_INSTALL_MIRROR=https://ghfast.top/https://github.com/astral-sh/python-build-standalone/releases/download" >> ~/.bashrc
```

### 设置 pip 镜像

虽然我们在第一步设置过了 pip 镜像，但是 uv 的包管理走的是自己的配置，所以需要额外设置。

uv 有两个半层级的配置：系统全局/用户（用户算半个吧）级和项目级。全局文件在 `/etc/uv/uv.toml`（Windows： `%SYSTEMDRIVE%\ProgramData\uv\uv.toml`），用户配置文件在 `~/.config/uv/uv.toml` 下（Windows： `%APPDATA%\uv\uv.toml`）。而项目配置就是很熟悉的 `pyproject.toml` 了。不过注意这两个键的名称不一样，设置的时候需要额外留心。

:::code-group

```toml [uv.toml]
[[index]]
url = "https://mirrors.aliyun.com/pypi/simple"
default = true
```

```toml [pyproject.toml]
[[tool.uv.index]]
url = "https://mirrors.aliyun.com/pypi/simple/"
```

:::

这样设置过后应该就能够正常使用 uv 了。
