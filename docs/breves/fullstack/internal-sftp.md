---
title: 解决 SFTP 客户端冻结或报错 Received message too long
tags:
  - 全栈
  - SFTP
---

# 解决 SFTP 客户端冻结或报错 Received message too long

:::details 太长不看

修改 `/etc/ssh/sshd_config` 文件，找到 `Subsystem sftp /usr/lib/openssh/sftp-server` 这一行，将其修改为 `Subsystem sftp internal-sftp`，然后重启 sshd 服务

:::

昨天给服务器扩容了一下，结果不知怎么的重启服务器之后 SSH 客户端正常，VSCode 也能正常上传文件，但是第三方客户端比如 cyberduck 还有 NexShell 想要连接 SFTP 服务的时候就会直接卡在 authenticating 状态，然后就一直卡着不动了。我尝试了重启本地电脑和 SFTP 客户端，甚至重启远程服务器都不生效。大为迷惑之下，我尝试使用 `sftp remote` 命令手动连接，结果发现远程报了个错 `Received message too long`。

一般这个问题不是没权限就是 sftp 协议流中出现了奇怪的输出，一般是 `.bashrc` 被执行之后 `print` 或者 `echo` 向协议流里塞进了文本，而非 SFTP 客户端期望的 `SSH_FXP_INIT`。但是首先我这个 `.bashrc` 已经用了相当长一段时间了，要是有问题的话早报错了；其次，对于一次 SFTP 会话来说，`.bashrc` 就不应该被执行。

查询了一下，这个问题的原因应该是 `sshd` 进程在收到 sftp 请求时没有使用内部功能（应该是 2008 年左右就实装了）实现，而是新建了一个 shell 会话。那么有可能出于某种原因，我的 sftp subsystem 配置被覆盖掉了，检查一下。果然在 `/etc/ssh/sshd_config` 文件中找到了 `Subsystem sftp /usr/lib/openssh/sftp-server`，我记得我没动过啊……

总之把它改回了 `Subsystem sftp internal-sftp`，然后 `sudo service sshd restart` 重启之后，问题就消失了。
