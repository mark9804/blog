---
title: 淘天面试题：翻转子串
tags:
  - 面试算法
  - 阿里
  - 淘天
  - 动态规划
  - 子数组问题
  - Kadane
  - Python
  - TS/JS
---

# 淘天面试题：翻转子串

## 题目描述

:::info 题干

小红拿到了一个 `01` 串，她可以进行最多一次操作：选择一个连续子串，将它们所有字符取反（`0` 变 `1`，`1` 变 `0`）。小红想知道，最终 `1` 字符数量的最大值是多少？

**输入描述**

> 一个仅由 `0` 和 `1` 组成的字符串，长度不超过 `200000`。

**输出描述**

> 一个整数，代表 `1` 数量的最大值。

:::details 示例 {open}

> 输入
>
> ```
> 101001001
> ```

> 输出
>
> ```
> 7
> ```

:::

## 题目分析

这道题目可以看作[最大子数组和](https://leetcode.cn/problems/maximum-subarray/description/)问题的变种。

首先理解一下例子里的 `7` 是怎么来的，由于我们只能将 `0` 翻转成 `1` 或者将 `1` 翻转成 `0`，并且只有一次机会，因此我们需要在原始字符串中抽取出包含最多 `0` 和最少 `1` 的子序列进行翻转，使得这次翻转会增加最多的数字 `1`。样例当中包含最多个 `0` 的子序列是 `00100`，翻转得到 `11011` 。此时完整字符串 `101110111` 包含的字符 `1` 最多，数量为 `7`。

这种题一般用 Kadane 算法来解决。Kadane 算法是 DP 的一种，需要遍历一次数组，在遍历过程中维护两个变量：

1. 全局最大子数组和
2. 当前最大子数组和

遍历过程中不断对比当前最大和全局最大，然后选择更新全局最大值或者不更新。因为是 DP，所以时间复杂度总是 $O(n)$，空间复杂度总是 $O(1)$。

虽然这题不是标准的 Kadane，但是我们可以通过重新赋值的方式把它变成一个标准的只含有 `1, -1` 的 Kadane 数组。

## 题解：Kadane 算法

:::code-group

```python [Python]
def max_ones(s: str) -> int:
    # 用 list comprehension 将字符串转换为只包含 1 和 -1 的数组
    nums = [1 if c == '1' else -1 for c in s]

    max_sum = nums[0]
    current_sum = nums[0]

    for i in range(1, len(nums)):
        current_sum = max(nums[i], current_sum + nums[i])
        max_sum = max(max_sum, current_sum)

    return max_sum
```

```ts [TypeScript]
function maxOnes(s: string): number {
  const nums = s.split("").map(c => (c === "1" ? 1 : -1));

  let maxSum = nums[0];
  let currentSum = nums[0];

  nums.slice(1).forEach(el => {
    currentSum = Math.max(el, currentSum + el);
    maxSum = Math.max(maxSum, currentSum);
  });

  return maxSum;
}
```

:::

这样就做完了，挺简单的。

## 复盘

Kadane 就完事了
