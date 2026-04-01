---
title: 在不支持 systemctl 的服务器上部署 Ollama
tags:
  - LLM
---

# 在不支持 systemctl 的服务器上部署 Ollama

昨天把刚用了一天的 AutoDL 换成了[算力自由](https://www.gpufree.cn/home)上的 L40S，原因无他，主要是因为算力自由太便宜了，L40S 比 AutoDL 的 L20 每小时还要再便宜将近一块钱。但是代价就是我失去了 AutoDL 的代理，所以我需要用到本地 LLM 的一个研究就只能自己想办法跑起来了。

综合 API 调用便利程度和价格&ZeroWidthSpace;~~其实就是穷~~&ZeroWidthSpace;等多个因素考虑，最后我打算重操老本行在服务器上部署一个 Ollama 实例，走 Ollama API。因为在境内的服务器有墙，直接下 ollama 的二进制包是下不动的，所以我是按照[官方文档](https://github.com/ollama/ollama/blob/main/docs/linux.md)的说明用浏览器手动下载二进制包，然后上传到服务器的。

不过很快就出现了问题，官方建议使用 `systemctl` 来管理 Ollama 进程：

```bash
sudo systemctl daemon-reload
sudo systemctl enable ollama
```

但是在算力自由的服务器上运行之后会报错：

```text
System has not been booted with systemd as init system (PID 1). Can't operate.
Failed to connect to bus: Host is down
```

看起来算力自由的服务器并没有使用 `systemd` 作为 init 系统，所以无法使用 `systemctl` 来管理进程。而且算力自由的文档里[明确提到了](https://www.gpufree.cn/docs/guide/container/qa.html)他们使用 Docker 部署，所以既不能用 `systemd`，也反手 ban 了 `docker`。所以就只能自己写控制脚本来使用 `service` 来管理进程了。

先在 `/etc/init.d` 目录下创建一个脚本（容器默认分配的用户是 `root` 用户，从安全的角度来说肯定不行，但是应该也不会有人把这种服务器暴露给外部或者用于生产环境的，所以这里就先不考虑了，所有命令都以 `root` 用户执行，不加 `sudo`）：

```bash
touch /etc/init.d/ollama
nano /etc/init.d/ollama
```

然后在文本编辑器中输入以下内容：

```shell
#!/bin/sh
### BEGIN INIT INFO
# Provides:          ollama
# Required-Start:    $remote_fs $network
# Required-Stop:     $remote_fs $network
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Start ollama daemon
# Description:       Ollama Service
### END INIT INFO

# 使用 start-stop-daemon，这是 Debian/Ubuntu 的标准方式
DAEMON=/usr/bin/ollama
DAEMON_ARGS="serve"
USER=ollama
PIDFILE=/var/run/ollama.pid

. /lib/lsb/init-functions

case "$1" in
    start)
        log_daemon_msg "Starting Ollama Service" "ollama"
        start-stop-daemon --start --quiet --pidfile $PIDFILE --make-pidfile \
            --chuid $USER --background --exec $DAEMON -- $DAEMON_ARGS
        log_end_msg $?
        ;;
    stop)
        log_daemon_msg "Stopping Ollama Service" "ollama"
        start-stop-daemon --stop --quiet --pidfile $PIDFILE
        log_end_msg $?
        rm -f $PIDFILE
        ;;
    restart)
        $0 stop
        sleep 1
        $0 start
        ;;
    status)
        status_of_proc -p $PIDFILE "$DAEMON" "ollama" && exit 0 || exit $?
        ;;
    *)
        echo "Usage: /etc/init.d/ollama {start|stop|restart|status}"
        exit 1
        ;;
esac

exit 0
```

保存退出，赋予执行权限：

```bash
chmod +x /etc/init.d/ollama
```

将脚本添加到系统服务中：

```bash
update-rc.d ollama defaults
```

接着就可以用 `service` 来管理进程了：

```bash
service ollama start
service ollama stop
service ollama restart
service ollama status
```

测试 Ollama 是否正常运行：

```bash
ollama -v

>>> ollama version is 0.9.6
```
