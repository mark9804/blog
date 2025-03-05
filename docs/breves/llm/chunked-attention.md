---
title: 使用分块注意力降低推理显存占用
tags:
  - 大模型
  - 分块注意力
---

# 使用分块注意力降低推理显存占用

复现其他人论文的时候发现代码自己租来的 4090 24GB 上会爆显存，查看代码中的 `forward` 函数定义后发现作者在计算注意力机制时没有考虑张量尺寸，导致文生图模型在处理长序列时会创建巨型注意力矩阵，直接把显存撑爆。

## 注意力计算

要解决这个问题，首先要知道注意力是怎么计算的。

假设输入的序列长度为 $n$，那么注意力计算的公式为

$$
\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^\top}{\sqrt{d}}\right)V
$$

其中 $Q$ 和 $K$ 是输入序列的查询和键，$V$ 是输入序列的值，$d$ 是查询和键的维度。但是注意分子中的 $QK^\top$ 是一个 $n \times n$ 的矩阵，这个矩阵的计算量和空间复杂度是 $O(n^2)$ 的，当 $n$ 很大的时候一张孱弱的 4090 根本顶不住。

## 分块注意力

要解决爆显存的问题，最简单的方式当然是加钱上更好的显卡了（）但是我这种穷鬼肯定是不可能加钱的，所以只能退而求其次给原作者的代码加上分块注意力。

分块注意力就是将一个序列分割成多个块，把每个块视作一个整体计算注意力后再把结果拼接起来。假设每个块的长度为 $b$，那么使用分块注意力后，我们无需一次性计算 $n \times n$ 的矩阵，只需要计算 $b \times b$ 的矩阵，其中 $b$ 是块的长度。

## 代码实现

```python
# ...
if (
        torch.cuda.is_available()
        and N > 1024
        and torch.cuda.get_device_properties(0).total_memory
        - torch.cuda.memory_allocated(0)
        < 2e9
):
    # 如果序列长度大于1024且可用内存小于2GB，分块计算注意力以节省内存
    chunk_size = 512  # 分成 512 个块
    out = torch.zeros_like(q)

    for i in range(0, N, chunk_size):
        end_i = min(i + chunk_size, N)
        q_chunk = q[:, i:end_i, :]

        # 计算当前块的注意力分数
        chunk_attn = torch.zeros(
            B * H, end_i - i, N, device=q.device, dtype=q.dtype
        )

        for j in range(0, N, chunk_size):
            end_j = min(j + chunk_size, N)
            k_chunk = k[:, j:end_j, :]

            # 计算当前块的注意力分数
            sim_chunk = (
                    torch.einsum("b i c, b j c -> b i j", q_chunk, k_chunk)
                    * self.scale
            )
            chunk_attn[:, :, j:end_j] = sim_chunk

        # 对完整的注意力分数进行softmax
        attn_chunk = chunk_attn.softmax(dim=-1)

        # 计算当前块的输出
        out_chunk = torch.zeros(
            B * H, end_i - i, C, device=v.device, dtype=v.dtype
        )

        for j in range(0, N, chunk_size):
            end_j = min(j + chunk_size, N)
            v_chunk = v[:, j:end_j, :]

            # 计算当前块的输出
            out_chunk += torch.einsum(
                "b i j, b j c -> b i c", attn_chunk[:, :, j:end_j], v_chunk
            )

        out[:, i:end_i, :] = out_chunk
else:
    # 原始计算方式
    sim = torch.einsum("b i c, b j c -> b i j", q, k) * self.scale  # (B*H)*N*N
    attn = sim.softmax(dim=-1)  # (B*H)*N*N
    out = torch.einsum("b i j, b j c -> b i c", attn, v)  # (B*H)*N*C

out = (
    out.view(B, H, N, C).permute(0, 2, 1, 3).reshape(B, N, (H * C))
)  # B*N*(H*C)

return self.to_out(out)
# ...
```

## 代码解释

解释的活就让 Claude 来吧！

---

上面的代码实现了一个动态切换策略，根据当前的计算环境和输入序列长度来决定是否使用分块注意力计算：

1. **条件判断逻辑**：

   ```python
   if (torch.cuda.is_available() and N > 1024 and
       torch.cuda.get_device_properties(0).total_memory - torch.cuda.memory_allocated(0) < 2e9):
   ```

   这个条件检查三点：是否使用GPU、序列长度是否超过1024、当前可用显存是否少于2GB。只有当这三个条件都满足时，才会启用分块注意力来节省内存。

2. **张量尺寸说明**：

   - `B`：批次大小(Batch size)
   - `H`：注意力头数(Number of heads)
   - `N`：序列长度(Sequence length)
   - `C`：每个头的特征维度(Channel dimension)

3. **分块计算流程**：
   - 设置块大小为512，这个值可以根据可用内存调整
   - 外层循环遍历查询(Q)的块
   - 内层循环遍历键(K)和值(V)的块
   - 对每一对Q和K的块计算部分注意力分数
   - 将这些部分分数组装成完整的注意力矩阵并进行softmax
   - 按块计算与值(V)的加权和并累加到最终结果

这种分块计算的核心优势在于：

- 将原本需要一次性计算的N×N注意力矩阵分解成多个较小的部分
- 将空间复杂度从O(N²)降低到O(N×chunk_size)
- 虽然计算的总量没有减少，但峰值内存使用大幅降低，使得在内存受限的环境中也能处理较长的序列

最后，不管是否使用分块计算，代码都会将输出结果重新排列成期望的形状，并通过`to_out`层进行最终的线性变换。

---

通过这种方式，我们就可以尽可能缩减显存占用，从而在 24GB 的显卡上顺利推理更长的序列（事实上确实也跑通了）。
