---
title: 深度学习研究备忘录
tags:
  - 深度学习
  - 研究
  - 备忘录
---

# 深度学习研究备忘录

:::info
这里会记录一些我自己的笔记，一般都很短，无法成文，但是可能又对其他人有帮助。内容可能比较杂，但是主要还是围绕深度学习框架和 low-level vision 以及扩散模型的。
:::

## 工程实践

- `nvidia-pyindex` 这个包能不装就不装，会在 pip config 里面到处拉屎，最直接的影响就是缓存会被直接禁止。实际上在安装必要包时加上 `--extra-index-url https://pypi.ngc.nvidia.com` 也是一样的效果，比如：

```bash
pip install nvidia-tensorrt --extra-index-url https://pypi.ngc.nvidia.com
```

- 在国内的机器上安装 flash attention 很麻烦，可以直接下载官方编译好的包：[Releases](https://github.com/Dao-AILab/flash-attention/releases) 其中 `abiTRUE` 或者 `abiFALSE` 的选择可以这样判断：

```bash
python -c "import torch;print(torch._C._GLIBCXX_USE_CXX11_ABI)"
```

## 扩散模型

- 流匹配的定义里 `t = 0` 是纯噪声，`t = 1` 是清晰图像；但是 [Diffusers](https://github.com/huggingface/diffusers) 中用的是 DDPM 的祖宗之法，`t = 0` 是清晰图像，`t = 1` 才是纯噪声。这个在何凯明 JiT 的复现中很关键，不然模型在采样时只能训出纯黑图片。

## 模型微调

- [Huggingface PEFT](https://huggingface.co/docs/peft/index) 库中的 [LoRA](https://huggingface.co/docs/peft/package_reference/lora) 微调时，传入参数有 `target_modules` 和 `modules_to_save` 两个参数。其中 `target_modules` 是冻结原有的层，然后在旁路插入两个低秩矩阵（即 $W_A$ 和 $W_B$），通过计算 $W_A \times W_B$ 来实现对原有层参数的低秩近似；保存内容是 $W_A$ 和 $W_B$。而 `modules_to_save` 会解冻目标层并进行标准的 SGD 更新，并且在保存时，会保存该层的完整权重张量而不是 LoRA 的适配器权重。
