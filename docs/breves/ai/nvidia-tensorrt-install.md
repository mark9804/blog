---
title: nvidia-tensorrt 安装时报错解决
tags:
  - python
  - 深度学习
---

# nvidia-tensorrt 安装时报错解决

:::details 太长不看

```bash
pip install nvidia-cuda-runtime-cu13==0.0.0a0
```

:::

nvidia-tensorrt 是一个用来加速深度学习推理的库，很多论文当中都会用到。但是最近遇到一个比较诡异的问题，两个仓库都依赖了 nvidia-tensorrt，但是其中一个能正常跑完 `pip install`，另一个却会报错：

```plain
× Building wheel for nvidia-cuda-runtime-cu13 (pyproject.toml) did not run successfully.
│ exit code: 1
╰─> [10 lines of output]
      ⚠️ THIS PROJECT 'nvidia-cuda-runtime-cu13' IS DEPRECATED.
      Please use 'nvidia-cuda-runtime' instead.

      To install the correct package, use:

          pip install nvidia-cuda-runtime
```

虽然报错信息提示的很直接，`tensorrt_cu13_libs` 错误地依赖一个已被废弃的包 `nvidia-cuda-runtime-cu13`，但是直接装 `nvidia-cuda-runtime` 还是会报同样的错。就在大为恼火的时候，想起来隔壁的环境好像就能成功安装，拉一下隔壁的环境看一看。

```bash
$ conda list | grep nvidia-
nvidia-cublas-cu12          12.8.4.1         pypi_0              pypi
nvidia-cuda-cupti-cu12      12.8.90          pypi_0              pypi
nvidia-cuda-nvrtc-cu12      12.8.93          pypi_0              pypi
nvidia-cuda-runtime-cu12    12.8.90          pypi_0              pypi
nvidia-cuda-runtime-cu13    0.0.0a0          pypi_0              pypi
nvidia-cudnn-cu12           9.10.2.21        pypi_0              pypi
nvidia-cufft-cu12           11.3.3.83        pypi_0              pypi
nvidia-cufile-cu12          1.13.1.3         pypi_0              pypi
nvidia-curand-cu12          10.3.9.90        pypi_0              pypi
nvidia-cusolver-cu12        11.7.3.90        pypi_0              pypi
nvidia-cusparse-cu12        12.5.8.93        pypi_0              pypi
nvidia-cusparselt-cu12      0.7.1            pypi_0              pypi
nvidia-nccl-cu12            2.27.3           pypi_0              pypi
nvidia-nvjitlink-cu12       12.8.93          pypi_0              pypi
nvidia-nvtx-cu12            12.8.90          pypi_0              pypi
nvidia-pyindex              1.0.9            pypi_0              pypi
nvidia-tensorrt             99.0.0           pypi_0              pypi
```

原来是装了个 `nvidia-cuda-runtime-cu13==0.0.0a0` 的幽灵依赖，那就好说了，照猫画虎即可：

```bash
pip install nvidia-cuda-runtime-cu13==0.0.0a0
```

之后再正常地运行 `pip install` 即可。
