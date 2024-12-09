---
title: 设置 Homebrew 镜像源
tags:
  - Homebrew
---

# 设置 Homebrew 镜像源

回国之后发现 Homebrew 的默认源速度很慢，因此需要设置镜像源。

参考[清华大学镜像源的教程](https://mirrors.tuna.tsinghua.edu.cn/help/homebrew/)，设置如下：

```bash
export HOMEBREW_CORE_GIT_REMOTE="https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-core.git"
echo 'export HOMEBREW_API_DOMAIN="https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/api"' >> ~/.zprofile
echo 'export HOMEBREW_BOTTLE_DOMAIN="https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles"' >> ~/.zprofile
export HOMEBREW_API_DOMAIN="https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/api"
export HOMEBREW_BOTTLE_DOMAIN="https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles"
```
