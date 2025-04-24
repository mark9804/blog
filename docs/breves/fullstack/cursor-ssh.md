---
title: 使用 Cursor 进行远程开发
description: 使用 open-remote-ssh 插件替换 remote-ssh 插件实现远程开发
tags:
  - Cursor
  - 全栈
---

# 使用 Cursor 进行远程开发

:::info 2025-04-24: 原版 Remote - SSH 插件已修复

Cursor 的 Remote - SSH 插件已经修复了这个问题，反而是 Open Remote 插件现在装不上了，所以现在可以直接使用原版插件远程开发

:::

:::details 太长了，不想看

卸载 Remote - SSH，下载 [Open Remote - SSH](https://github.com/jeanp413/open-remote-ssh)，装上 `.vsix` 扩展之后即可正常使用

:::

作为 VS Code 套壳的编辑器，理论上 Cursor 应该和 VS Code 一样支持 SSH 连接到远程服务器开发，但是实际上它会一直卡在 Downloading VS Code Server 这个状态上。

这个问题去年八月份的时候我群里就有小伙伴提到过了，不过当时我没有远程开发的需求，所以就没有太在意。直到现在炼丹要用到远程服务器，我才发现这个 bug 居然还没修……

最直接有效的方式当然是直接使用 VS Code，但是 Cursor 的代码智能实在是太舒服了，半年下来已经恶堕成眼里只有 Cursor 的废人了，因此我开始寻找解决方案。Cursor 的用户论坛上建议卸载 remote-ssh 插件然后重装，这样原先的插件会被替换成 Cursor 自己的插件；不过这么一番尝试之后还是没有效果。我还尝试了[直接下载 VSC Server](https://github.com/microsoft/vscode/issues/208117)，不过很显然 Cursor 的 Commit ID 和 VS Code 的并不匹配，直接找不到对应二进制文件。

最后找到了一个 Remote SSH 的替代品 [Open Remote - SSH](https://github.com/jeanp413/open-remote-ssh)，使用它替换掉 Remote - SSH 插件之后，Cursor 就可以正常进行远程开发了。不过这个插件没有上架插件商店，只能使用 vsix 安装。

## 使用 Open Remote - SSH 替换 Remote - SSH

VS Code 现在已经在 UI 层面上禁用了 Install from .vsix，不过好在通过命令行安装的途径还是有效的。（应该不会禁用，不然插件开发者要跳脚了）

因此我们首先在[项目 GitHub Release 页面](https://github.com/jeanp413/open-remote-ssh/releases)下载最新版本的 vsix 文件。

下载完成后，先在 Cursor 里把 Remote - SSH 插件卸载掉，退出 Cursor，然后打开终端输入：

```bash
cursor --install-extension path/to/open-remote-ssh-*.vsix
```

安装完成后重新启动 Cursor 再点击左下角的远程连接图标之后，理论上就能正常使用了。
