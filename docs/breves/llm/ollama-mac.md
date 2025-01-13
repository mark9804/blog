---
title: 使用 Ollama 在 Mac 上部署端侧 LLM 模型
tags:
  - LLM
---

# 使用 Ollama 在 Mac 上部署端侧 LLM 模型

最近出于个人需要和成本原因，我需要在 MacBook M3 Pro 上部署一个端侧 LLM 模型，用于自己笔记库的本地化问答。没有怎么犹豫就选择了使用 Ollama 作为部署工具，因为它实在是太方便了：一行命令就可以部署和启动，并且支持通过 API 调用本地的不同模型，属实是工业明灯。

在 Mac 上可以使用 Homebrew 很方便地安装和管理 Ollama：

```bash
brew install ollama
```

如果在国内的话，可能需要提前准备好 [Homebrew 镜像源](../../quavers/homebrew-tuna-mirror.md)。

安装完成后，使用 `ollama serve` 就可以启动 ollama 服务了。

## 模型选择

Ollama 维护了一个[模型列表](https://ollama.com/library)，可以在这里面选择自己需要的模型，然后使用 `ollama pull <model-name>` 下载模型。如果需要下载下来之后直接运行，也可以直接使用 `ollama run <model-name>` 命令。

不知道为什么，我的模型下载到最后 5% 左右的时候速度就会特别慢甚至直接报网络错误，需要多试几次。这个应该跟网络环境有关，好在一般重试一次就能解决。

我的配置是 18GB 统一内存的 MacBook Pro，根据经验可以比较流畅地运行参数大小在 8B 左右的模型。一开始我没有经验，想挑战一下内存的极限 ~~8>16，18>36~~，于是选择了微软的 Phi-4 14B 模型。

Phi-4 14B 对中文的原生支持已经不错了，唯一的问题是它很容易把我的内存跑炸……因此还是只能用 8B 左右的模型。

说到 8B 模型那当然不得不提国产之光 Qwen 2.5 了。它的模型尺寸从 0.5B 到 72B 都有，并且支持 128K 的超长上下文。最重要的是，作为阿里巴巴出品的模型，它原生就支持中文，比起通过 SFT 获得中文支持的 [llama3-chinese-8b-instruct-v3](https://ollama.com/kingzeus/llama-3-chinese-8b-instruct-v3) 而言，Qwen 2.5 在本地化问答上有着天然的优势。（当然也不是说后者不好，各有各的闪光点！）

我主要使用的是 [Qwen 2.5 7B](https://ollama.com/library/qwen2.5) 版本。通过一定的提示词工程后，它已经可以结合 Obsidian 的 [Smart Connections 插件](https://github.com/brianpetro/obsidian-smart-connections)根据笔记内容进行比较搭边的本地化问答了（虽然 RAG 效果比较一般，大部分时候还是靠模型本身的知识库，但是胜在免费）。

如果直接运行 `ollama pull qwen2.5` 的话，下载下来的模型默认就是 7B 版本。如果你需要参数更多的版本，可以在模型名称后面加上参数数量，比如：

```bash
ollama pull qwen2.5:32b
```

就会拉取 32B 的模型。

## 模型运行

直接运行 `ollama run <model-name>` 就可以启动模型。不过我主要与 Smart Connections 插件配合使用，因此只要保持 Ollama 在后台运行即可，不需要手动启用。如果需要手动运行模型（例如 Qwen 2.5 7B），可以运行以下命令：

```bash
ollama run qwen2.5
```

接着就可以在命令行中与模型对话了。

![14B 的回答细节会更多一些，7B 更简洁，更注重全局](https://cdn.sa.net/2025/01/13/CspO5kHeuZQ2rx8.webp)
