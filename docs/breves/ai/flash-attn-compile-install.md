---
title: 在国内机器上编译 Flash Attention 并安装
tags:
  - python
  - 深度学习
---

# 在国内机器上编译 Flash Attention 并安装

如果直接安装 `flash-attn` 的话，它会尝试从 github 上下载可用的预编译版本，在国内的机器上基本上都不可能成功。一种可用的方式是直接自己下载完编译好的 `whl` 上传手动安装，但是有可能遇到本地机器上的运行库和编译环境不一样导致跑不起来的问题，因此比较稳妥（但是很耗时）的方式是自己编译。不过 Flash Attention 库当中有几个子模块，直接 git clone 的话也下不下来。

我预先写好了一个脚本，可以直接执行。如果还不成功，大概率是本地的编译库（比如 nvcc ）太旧，更新一下应该就可以。

下面的代码也可以在我的 [gist](https://gist.github.com/mark9804/544472ef56ca17ddaea7e4915b3732de) 上找到。

```bash
# export PATH=/usr/local/cuda/bin:$PATH
# export LD_LIBRARY_PATH=/usr/local/cuda/lib64:$LD_LIBRARY_PATH
# export CC=/usr/bin/gcc
# export CXX=/usr/bin/g++

python -m pip install ninja
git clone https://ghfast.top/https://github.com/Dao-AILab/flash-attention.git
cd flash-attention

# rewrite all submodule url to use ghfast proxy
sed -i 's|https://github.com/|https://ghfast.top/https://github.com/|g' .gitmodules

# in flash-attention -> setup.py, rewrite
# BASE_WHEEL_URL = "https://github.com/Dao-AILab/flash-attention/releases/download/{tag_name}/{wheel_name}"
# to
# BASE_WHEEL_URL = "https://ghfast.top/https://github.com/Dao-AILab/flash-attention/releases/download/{tag_name}/{wheel_name}"
sed -i 's|BASE_WHEEL_URL = "https://github.com/Dao-AILab/flash-attention/releases/download/{tag_name}/{wheel_name}"|BASE_WHEEL_URL = "https://ghfast.top/https://github.com/Dao-AILab/flash-attention/releases/download/{tag_name}/{wheel_name}"|g' setup.py

git submodule update --init --recursive
python -m pip install wheel==0.41.3 -i https://pypi.tuna.tsinghua.edu.cn/simple
python setup.py install
```
