---
title: 在境内服务器上使用 Antigravity
description: 使用 graftcp + clash 劫持 antigravity-server 流量
tags:
  - Antigravity
  - graftcp
---

# 在境内服务器上使用 Antigravity

:::details 太长不看

https://gist.github.com/mark9804/ccb37af14816747fc61ad404fc094694 ，或者 [其他开发者的脚本](https://github.com/ccpopy/antissh)

:::

众所周知 Antigravity 是谷歌的服务，所以跟没有被重点关照的 Cursor 不同，在大陆服务器上是没有办法直接访问的。最近因为弄了个 AI Ultra，就想着把编辑器从额度抠抠搜搜的 Cursor 换成带善人 Antigravity。但是我的主要开发工作都在服务器上完成，所以有必要在服务器上搞一个代理。

因为我本来就在国外上学，所以一开始我考虑的是使用编辑器的端口转发功能，把流量全都通过 SSH 隧道转发到本地来。但是测试下来发现三个问题：首先就是实际体验太区了，延迟和带宽都不能让人满意。其次就是一旦我用了这个功能，同账号下的所有同学都只能跟我设置同样的端口转发（并且似乎有时候 IDE 检测端口转发会延迟，不一定能稳定激活），否则服务器会断外网。为了解决这个问题我单开了一个名为 `antigravity` 的账号给自己用，但是随后发现运营商算力自由的数据盘是挂载在 `/root/gpufree-data` 目录下的，转移特别麻烦。最重要的事情是，Antigravity 的 Agent panel 依旧是不可用的，一直卡在 wait a moment。遂放弃了这个方案。

既然邪道不行，那就只能老样子在服务器上挂一个全局代理了。我手上正好有一个 clash 代理地址，所以找了个 [一键脚本](https://github.com/nelvko/clash-for-linux-install) 部署了一下。但是随后发现尽管在变量中设置了 `http_proxy`、`https_proxy` 和 `all_proxy`，并且使用 `curl` 测试连接 google 也能通，Agent 依旧加载不出来，补全功能也不生效。

经过搜索后找到了 [这个帖子](https://blog.jiang.in/archives/019b8767-57ed-71ca-9f96-fe0bb2b19090)，其中提到了 Antigravity 的特殊性：核心服务 `language_server_linux_x64` 使用 Go 编写，不遵从系统变量中的代理设置直接发起网络请求，因此给出的建议是使用 [graftcp](https://github.com/hmgle/graftcp) 劫持流量或者使用代理软件的 TUN 模式。本来我是想用 TUN 的，然后发现托管商的 docker 镜像不允许这么做，就只能麻烦点使用 `graftcp` 了。

坏就坏在这篇帖子虽然分析了原因也提到了解决方案，但是没有任何技术细节，因此我自己尝试出了一个完整的方案并记录在这里，理论上这个方案在 antigravity-server 更新后依旧能自动适用（模拟测试能用，实际更新过会怎么样还不清楚）。

## 编译并安装 graftcp

首先是下载并编译 [graftcp](https://github.com/hmgle/graftcp)，它需要系统装有 `go>=1.23` 的环境，如果环境要求不满足的话（比如 ubuntu 22.04 默认的 go1.18）需要先去[go 官网](https://go.dev/doc/install) 安装新版本，安装完成后按照 graftcp 的说明编译并安装即可。

## 确定劫持对象

因为 `graftcp` 不能自动劫持所有流量，因此我们需要指定劫持对象。

如果你大致了解过 Antigravity 的实现方式，会知道它的主要功能是通过一个同名插件 `Antigravity` 提供的。查看其目录如下：

```bash
tree ~/.antigravity-server/bin -I 'data|node_modules|out|dist|assets|LICENSE*|eslint*|package.json|postcss*|schemas|tailwind*|webview*'
/root/.antigravity-server/bin
└── 1.16.5-1504c8cc4b34dbfbb4a97ebe954b3da2b5634516
    ├── bin
    │   ├── antigravity-server
    │   ├── helpers
    │   │   ├── browser.sh
    │   │   └── check-requirements.sh
    │   └── remote-cli
    │       ├── agy
    │       └── antigravity
    ├── extensions
    │   ├── antigravity
    │   │   ├── auth-success-jetski.html
    │   │   ├── bin
    │   │   │   ├── fd
    │   │   │   ├── fd.LICENSE
    │   │   │   ├── language_server_linux_x64
    │   │   │   ├── sandbox-wrapper.LICENSE
    │   │   │   └── sandbox-wrapper.sh
    │   │   ├── cascade-panel.html
    │   │   └── customEditor
    │   │       ├── media
    │   │       │   ├── ruleEditor
    │   │       │   │   ├── ruleEditor.css
    │   │       │   │   └── ruleEditor.js
    │   │       │   └── workflowEditor
    │   │       │       ├── workflowEditor.css
    │   │       │       └── workflowEditor.js
    │   │       └── utils.js
...
```

会发现 antigravity-server 是用哈希值来区分版本的，虽然我们已经看到了需要劫持的 `language_server_linux_x64`，但是每次 Antigravity 更新之后 server hash 都会变，文件夹名也会随之改变，所以所以我们希望找到一种更稳定的方式来实现我们的目标，那就是：

> 直接把 Antigravity 的 node 进程给劫了

反正 Antigravity 用谷歌服务的地方多了去了，直接劫持 node 进程一劳永逸。查看 `bin/antigravity-server` 文件类型，发现是一个脚本，内容如下

```shell
#!/usr/bin/env sh
#
# Copyright (c) Microsoft Corporation. All rights reserved.
#

case "$1" in
 --inspect*) INSPECT="$1"; shift;;
esac

ROOT="$(dirname "$(dirname "$(readlink -f "$0")")")"

# Set rpath before changing the interpreter path
# Refs https://github.com/NixOS/patchelf/issues/524
if [ -n "$VSCODE_SERVER_CUSTOM_GLIBC_LINKER" ] && [ -n "$VSCODE_SERVER_CUSTOM_GLIBC_PATH" ] && [ -n "$VSCODE_SERVER_PATCHELF_PATH" ]; then
 echo "Patching glibc from $VSCODE_SERVER_CUSTOM_GLIBC_PATH with $VSCODE_SERVER_PATCHELF_PATH..."
 "$VSCODE_SERVER_PATCHELF_PATH" --set-rpath "$VSCODE_SERVER_CUSTOM_GLIBC_PATH" "$ROOT/node"
 echo "Patching linker from $VSCODE_SERVER_CUSTOM_GLIBC_LINKER with $VSCODE_SERVER_PATCHELF_PATH..."
 "$VSCODE_SERVER_PATCHELF_PATH" --set-interpreter "$VSCODE_SERVER_CUSTOM_GLIBC_LINKER" "$ROOT/node"
 echo "Patching complete."
fi

"$ROOT/node" ${INSPECT:-} "$ROOT/out/server-main.js" "$@"
```

理论上，只要把最后一行使用 `graftcp` 包装一下，变成 `exec graftcp "$ROOT/node" ${INSPECT:-} "$ROOT/out/server-main.js" "$@"` 就能实现劫持。但是实际操作之后会发现这么做会让 Antigravity 的文件完整性校验失败从而触发服务端自动重装，导致改了也是白改，因此需要往更上游的地方劫持。

由于 Antigravity（VSCode）启动时必须调用 `node`，而它很难自己检查自己的 checksum（或者说检查会比较宽松），所以我们直接劫持 `bin` 目录下的 `node` 二进制文件，将它替换成一个 shell 脚本，通过脚本调用 `graftcp` 包装并启动真正的 `node` 进程。

首先进入对应的目录（例如 `~/.antigravity-server/bin/1.16.5-1504c8cc4b34dbfbb4a97ebe954b3da2b5634516/bin`），然后把原本的 `node` 文件重命名成例如 `node.original`，然后创建一个名为 `node` 的 plain text 文件，内容如下

```shell
exec /usr/local/bin/graftcp "$(dirname "$0")/node.original" "$@"
```

然后通过 `chmod +x node` 给脚本添加执行权限，这样 Antigravity 就会使用这个脚本启动 node 进程了。这时候关闭 Antigravity 并且重新连接服务器，理论上就能看到正常工作的 Agent panel，并且自动补全也能够正常工作了。

## 自动化脚本

但是这么做依然存在一个问题，就是万一 Antigravity 版本更新了，服务端通常也会随之更新，需要我们重新再走一遍劫持流程。这样很麻烦，所以我找 AI 写了一个脚本把整个过程自动化。脚本内容如下

:::code-group

```bash [antigravity-patcher.sh]
#!/bin/bash

# --- 配置区域 ---
TARGET_DIR="$HOME/.antigravity-server"
CHECK_INTERVAL=10  # 每10秒检查一次
LOG_FILE="$HOME/.antigravity_patcher.log"
# 自动寻找 graftcp 路径，找不到则报错
GRAFTCP_BIN=$(which graftcp)

if [ -z "$GRAFTCP_BIN" ]; then
    echo "$(date): [Error] graftcp not found in PATH!" >> "$LOG_FILE"
    exit 1
fi

# --- 单例模式检查 (防止运行多个守护进程) ---
LOCK_FILE="/tmp/antigravity_patcher.lock"
exec 200>"$LOCK_FILE"
flock -n 200 || { echo "Script is already running. Exiting."; exit 1; }

echo "$(date): [Info] Watchdog started. Monitoring $TARGET_DIR..." >> "$LOG_FILE"

# --- 主循环 ---
while true; do
    # 查找目标目录下名为 node 的文件
    if [ -d "$TARGET_DIR" ]; then
        find "$TARGET_DIR" -type f -name "node" 2>/dev/null | while read -r node_path; do
            # 检查文件类型
            file_info=$(file "$node_path")

            # 如果是 ELF 二进制文件 (说明是原厂文件，需要劫持)
            if echo "$file_info" | grep -q "ELF"; then
                echo "$(date): [Patching] Found clean binary at $node_path" >> "$LOG_FILE"

                # 1. 备份原文件
                mv "$node_path" "${node_path}.original"

                # 2. 写入劫持脚本
                # 注意：这里我们写入绝对路径的 wrapper
                cat << EOF > "$node_path"
#!/bin/bash
# Auto-patched by antigravity-patcher.sh
exec $GRAFTCP_BIN "\$(dirname "\$0")/node.original" "\$@"
EOF

                # 3. 赋予执行权限
                chmod +x "$node_path"

                echo "$(date): [Success] Patched $node_path" >> "$LOG_FILE"
            fi
        done
    fi

    # 休息一下
    sleep $CHECK_INTERVAL
done
```

:::

然后将脚本加入 `~/.bashrc` 中，这样每次登录的时候都会自动开始以 10s 为间隔检查 `node` 的文件变更，如果发现 `node` 的类型是 ELF 二进制文件，就会自动劫持成我们的 ASCII text executable：

:::code-group

```bash [~/.bashrc]

# ...
# clashctl END

nohup graftcp-local -socks5 127.0.0.1:7890 ~/.graftcp.log 2>&1 &
nohup nohup ~/antigravity-patcher.sh > /dev/null 2>&1 &
```

:::

至此，如果启动时 Antigravity 更新了服务端，脚本就会自动劫持更新后的 `node` 文件。不过当下载完成的时候服务端 node 通常已经启动了，所以需要手动重启一次 Antigravity 才能使劫持生效。不过比起每次更新都要手动 patch，现在的复杂度已经降低到能接受的范围了。
