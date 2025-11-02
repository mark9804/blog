---
title: pycuda 安装时报错解决
tags:
  - python
  - 深度学习
---

# pycuda 安装时报错解决

最近尝试某个论文代码的时候发现一直安装不上 pycuda，报错信息如下：

```plain
In file included from src/cpp/cuda.cpp:4:
src/cpp/cuda.hpp:14:10: fatal error: cuda.h: No such file or directory
14 | #include <cuda.h>
   | ^~~~~~~~
compilation terminated.
error: command ‘/usr/bin/g++’ failed with exit code 1

ERROR: Failed building wheel for pycuda
Failed to build pycuda
```

搜索后发现是这台机器有点怪异，安装了 cuda 但是检测不到（`nvcc` 和 `locate cuda` 都找不到，但是 `nvidia-smi` 没有问题），因此需要在环境变量中手动添加 cuda 路径。

找到 cuda 路径在 `/usr/local/cuda` 中之后，修改 `~/.bashrc` 文件，添加如下内容：

```bash
export CUDA_HOME=/usr/local/cuda
export PATH=$CUDA_HOME/bin:$PATH
export LD_LIBRARY_PATH=$CUDA_HOME/lib64:$LD_LIBRARY_PATH
```

然后保存退出，重新加载 `~/.bashrc` 文件：

```bash
source ~/.bashrc
```

然后重新运行 `pip install pycuda` 即可。
