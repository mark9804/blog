---
title: 设置和重置 Homebrew 镜像源
tags:
  - Homebrew
---

# 设置和重置 Homebrew 镜像源

回国之后发现 Homebrew 的默认源速度很慢，因此需要设置镜像源。

## 设置镜像源

参考[清华大学镜像源的教程](https://mirrors.tuna.tsinghua.edu.cn/help/homebrew/)，设置如下：

```bash
export HOMEBREW_CORE_GIT_REMOTE="https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-core.git"
echo 'export HOMEBREW_API_DOMAIN="https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/api"' >> ~/.zprofile
echo 'export HOMEBREW_BOTTLE_DOMAIN="https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles"' >> ~/.zprofile
export HOMEBREW_API_DOMAIN="https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/api"
export HOMEBREW_BOTTLE_DOMAIN="https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles"
```

## 重置镜像源

重置的第一步，一定一定一定要检查 `~/.zprofile` 文件中是否存在 `HOMEBREW_CORE_GIT_REMOTE` 和 `HOMEBREW_API_DOMAIN` 和 `HOMEBREW_BOTTLE_DOMAIN` 的设置。我之前漏了这处地方结果折腾了好久。

然后还是按照 [清华镜像源官方步骤](https://mirrors.tuna.tsinghua.edu.cn/help/homebrew/)，执行下面的命令：

```bash
# brew 程序本身，Homebrew / Linuxbrew 相同
unset HOMEBREW_API_DOMAIN
unset HOMEBREW_BREW_GIT_REMOTE
git -C "$(brew --repo)" remote set-url origin https://github.com/Homebrew/brew

# 以下针对 macOS 系统上的 Homebrew
unset HOMEBREW_CORE_GIT_REMOTE
BREW_TAPS="$(BREW_TAPS="$(brew tap 2>/dev/null)"; echo -n "${BREW_TAPS//$'\n'/:}")"
for tap in core cask command-not-found; do
    if [[ ":${BREW_TAPS}:" == *":homebrew/${tap}:"* ]]; then  # 只复原已安装的 Tap
        brew tap --custom-remote "homebrew/${tap}" "https://github.com/Homebrew/homebrew-${tap}"
    fi
done

# 重新拉取远程
brew update
```
