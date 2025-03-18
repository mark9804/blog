---
title: "fnc/pydash: 我们 Python 也要有自己的 Lodash"
tags:
  - 全栈
  - Python
---

# fnc/pydash: 我们 Python 也要有自己的 Lodash

有接触过前端开发的读者一定对 [Lodash](https://lodash.com/) 不陌生，它是一个 JavaScript 的实用工具库，提供了许多常用的函数，可以大大简化代码的编写。所以已经变成 lodash 形状的我在开始写 Python 的时候，第一个想法就是找一个和它类似的库。

还别说，真找到了，还是两个。

这两个库一个叫 [pydash](https://github.com/dgilland/pydash)，另一个就是今天这篇文章里的主角 [fnc](https://github.com/dgilland/fnc)，两个库都来自同一个作者 [Derrick Gilland](https://github.com/dgilland)。pydash 可以说是 fnc 的超集，注重于提供一个完整的工具集，而为大数据集而生的 fnc 则更专注于性能和资源消耗，但是功能上没有 pydash 那么全面（pydash 单 Array 工具集就比 fnc 整个库的工具集还多），并且已经有一年没看到新的 commit 了，反观 pydash 则一直在维护。

## 安装

```bash
pip install pydash
```

## 使用

工具库使用起来有多舒服，我就拿目前我觉得 python 最逆天的数组查找来举例好了。

例如想要在数组 `[{'b': 1}, {'a': 1, 'b': 2}, {'a': 1}]` 中找到 `b` 为 `2` 的元素，在 js 当中，我们可以用 `find` 方法：

```js
const result = [{ b: 1 }, { a: 1, b: 2 }, { a: 1 }].find(x => x.b === 2);
```

但是 python 原生没有 `find` 方法，因此正常情况下想要找到数组中的某一个元素，最差也需要用到 list comprehension：

```python
result = [x for x in [{'b': 1}, {'a': 1, 'b': 2}, {'a': 1}] if x['b'] == 2]

# 或者用 next() 来获取第一个满足条件的元素
result = next((x for x in [{'b': 1}, {'a': 1, 'b': 2}, {'a': 1}] if x['b'] == 2), None)
```

如果使用 fnc 的话，只需要一行：

```python
result = find({'b': 2}, [{'b': 1}, {'a': 1, 'b': 2}, {'a': 1}])
```

但是很可惜的是 pydash 把 `find` 方法给删了，只留下了 `find_index()` 和 `find_last_index()` 方法。但是无所谓，多一步而已。（以及上面提到的 pydash 和 fnc 传参顺序是反过来的）

```python
idx = find_index([{'b': 1}, {'a': 1, 'b': 2}, {'a': 1}], lambda x: x['b'] == 2)
result = idx is not None and list[idx] or None
```

这么一对比，应该能感觉到使用 pydash 和 fnc 明显更符合正常人的心智模型，用原生 python 还要做一套思维体操。其余例子就不赘述了，讲也讲不完，而且官方都有文档（[fnc](https://fnc.readthedocs.io/en/latest/api.html)，[pydash](https://pydash.readthedocs.io/en/latest/api.htm)），没有必要画蛇添足。

## 和 lodash 调用方式对比

### 方法命名

pydash 自己列出了一些方法命名上的差异，比如：

- 函数命名使用 `snake_case` 而不是 `camelCase`
- 和 lodash 的 `toArray` 对应的是 `to_list`
- 和 lodash 的 `functions` 对应的是 `callables`
- 和 lodash 的 `is_native` 对应的是 `is_builtin`，因为 Python 里没有 `native` 的概念，所以改名了
- 与 python 内置函数冲突的函数名增加的是 `_` 后缀而不是前缀

另外，fnc 和 pydash 在命名方式和参数传递顺序上也有差别。fnc 的函数名称是全小写不含下划线，例如 `findindex()`；同样的函数在 pydash 中是 `find_index()`。在传参上，fnc 喜欢把 iterable 放在前面，例如 `fnc.sequences.findindex(lambda x: x >= 3, [1, 2, 3, 4])`，而 pydash 使用的是 `pydash.arrays.find_index(lambda x: x >= 3, [1, 2, 3, 4])`。

### 回调函数

pydash 支持一种特殊的回调函数，形式为 `['some_property']`，比如 `pydash.map_([{'a.b': 1, 'a': {'b': 3}}, {'a.b': 2, 'a': {'b': 4}}], ['a.b'])` 会返回 `[1, 2]` 而不是 `[3, 4]`（如果是 `'a.b'` 的话会返回 `[3, 4]`）。

### 社区子集

pydash 还实现了 lodash 的一部分社区子集，比如 [lodash-contrib](https://github.com/node4good/lodash-contrib)、[lodash-deep](https://github.com/marklagendijk/lodash-deep)、[lodash.math](https://github.com/Delapouite/lodash.math) 以及 [underscore.string](https://github.com/epeli/underscore.string)。这块我在前端开发的时候都没用过这些库，这里就不展开了。
