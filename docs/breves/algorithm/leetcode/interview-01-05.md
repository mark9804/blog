---
title: LeetCode 面试题 01.05. 一次编辑
tags:
  - 面试算法
  - LeetCode
  - LeetCode-Medium
  - TS/JS
  - 字符串操作
---

# LeetCode 面试题 01.05. 一次编辑

时间比较少，之后只记重点思路，就不写长篇了

:::info 题干
字符串有三种编辑操作: 插入一个字符、删除一个字符或者替换一个字符。 给定两个字符串，编写一个函数判定它们是否只需要一次(或者零次)编辑。

**示例 1**：

输入：

```typescript
first = "pale";
second = "ple";
```

输出：`True`

**示例 2**：

输入：

```typescript
first = "pales";
second = "pal";
```

输出：`False`
:::

## 题解：最长公共序列

注意到这题的要求比较特殊，只需要一次编辑。就像题目说的那样，一次编辑有增、删、改三种可能性，但是无论如何改动前后的字符串长度差异最多为 1（增：1，删：1，改：0）。因此分别从前往后和从后往前遍历，分别找到前缀和后缀的最大公共部分，然后校验前缀 + 后缀的长度是否大等于`较长字符串的长度 - 1` 即可。时间复杂度 $O(n)$，空间复杂度 $O(1)$。

**注意空字符串导致指针越界的 corner case**。

:::details 挂掉的几个测试用例

```
"horse"
"ros"
"intention"
"execution"
""
"a"
"a"
"b"
"islander"
"slander"
"teacher"
"beacher"
"teacher"
"bleacher"
```

:::

:::code-group

```typescript [TypeScript]
function oneEditAway(first: string, second: string) {
  if (first == second) return true;

  const length1 = first.length;
  const length2 = second.length;
  const [minLength, lenDiff, maxLength] =
    length1 > length2
      ? [length2, length1 - length2, length1]
      : [length1, length2 - length1, length2];

  if (lenDiff >= 2) return false;
  if (lenDiff <= 1 && minLength <= 1) return true; // 空字符串或者一步编辑

  let shorterPtr = 0;
  let longerPtr = 0;

  // 找到前缀的最大公共部分
  while (shorterPtr < minLength && first[shorterPtr] === second[shorterPtr]) {
    shorterPtr++;
  }

  // 找到后缀的最大公共部分
  while (
    shorterPtr + longerPtr < minLength &&
    first[length1 - longerPtr - 1] === second[length2 - longerPtr - 1]
  ) {
    longerPtr++;
  }

  // 校验：前缀 + 后缀 是否覆盖了较长字符串的长度
  return maxLength - shorterPtr - longerPtr <= 1;
}
```

:::

## 题解：动态规划

类似于 Levenstein Distance 的思路，但是这题要求比较特殊，只需要一次编辑，因此可以简化很多。具体代码之后补充。

## 题解：双指针

最常规的思路，LC 上有一个清楚的题解。

:::code-group

```typescript [TypeScript]
function oneEditAway(first: string, second: string): boolean {
  const l1 = first.length;
  const l2 = second.length;
  if (Math.abs(l1 - l2) > 1) {
    return false;
  }
  const length = Math.max(l1, l2);
  let number = 0;
  for (let i = 0, j = 0; i < length && j < length; i++, j++) {
    if (first[i] !== second[j]) {
      if (l1 < l2) {
        i--;
      } else if (l1 > l2) {
        j--;
      }
      number++;
    }
  }
  return number < 2;
}
```

:::

## 总结

这道题最优题解巧妙的地方在于利用了“一次编辑”的特殊性，使用双指针分别从前向后和从后向前比较，最后判断没有被比较到的字符串长度是否小于等于 1。不过需要考虑空字符串的 corner case。
