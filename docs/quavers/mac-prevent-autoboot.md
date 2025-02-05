---
title: 关闭 Mac 自动启动
tags:
  - macOS
---

# 关闭 Mac 自动启动

:::tip

按下键盘任意键还是会自启，这个好像还关不掉

:::

Apple 前几天终于放出了关闭开盖和接电就自动启动的教程，但是还没有中文。

相关配置由 `nvram` 的 `BootPreference` （注意大小写）配置参数管理，可以使用 `nvram -p` 查看当前的所有参数。

Apple 提供了三种选项：仅关闭开盖自启，仅关闭接电自启，两者都关闭。

仅关闭开盖自启：

```bash
sudo nvram BootPreference=%01
```

仅关闭接电自启：

```bash
sudo nvram BootPreference=%02
```

两者都关闭：

```bash
sudo nvram BootPreference=%00
```

如果想要恢复默认，可以使用 `sudo nvram -d BootPreference` 删除该参数。

## 参考

- [Prevent a Mac laptop from turning on when opening its lid or connecting to power](https://support.apple.com/en-us/120622)
