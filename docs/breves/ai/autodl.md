---
title: AutoDL 的网络调教
tags:
  - 深度学习
---

# AutoDL 的网络调教

最近研究室显卡资源告急（说告急其实也不是完全没卡用，只是空出来的卡最高只有 24G 显存，对于 FLUX 这种大玩具来说不够用），于是就自己去 AutoDL 上面租了张卡。（题外话：现在的老板说租卡的费用可以找她报销，她真的，我哭死）不过作为国内的提供商，AutoDL 必然会在访问 github 和 huggingface 的时候遇到一些网络问题，需要启用 AutoDL 内建代理和重定向 huggingface 端点的方式来达到一个勉强能看的速度。

## 使用内建代理

AutoDL 提供了一个内建代理，官方的说法是可以加速 GitHub 系列网站和 huggingface 的访问速度，但是我实际测试下来速度不是很理想。GitHub 这种通常来说下载量不大的还好，huggingface 动辄几十 GB 的模型，要是用内建代理得下载到房子都给 AutoDL 收走了。

AutoDL 在制作镜像的时候已经写好了启用脚本，我们可以用 `source /etc/network_turbo` 来启用代理。但是代理默认也会分流 huggingface 的流量，所以我们可以看一下它是怎么工作的：

```bash
$ cat /etc/network_turbo

export no_proxy=localhost,127.0.0.1,modelscope.com,aliyuncs.com,tencentyun.com,wisemodel.cn
export http_proxy=http://172.31.1.128:12798 && export https_proxy=http://172.31.1.128:12798
export REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt
export SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt
echo 设置成功
echo 注意：仅限于学术用途，不承诺稳定性保证
```

可以看到脚本实际上是把流量代理到了 12798 端口上，通过 `no_proxy` 变量来设置不走代理的白名单。这样我们可以使用 nano 或者 vim 编辑文件，把清华源（我比较喜欢）和 hf-mirror.com 也添加到白名单中，这样启用代理的时候就不会代理这两个额外网站了。

```shell
export no_proxy=localhost,127.0.0.1,modelscope.com,aliyuncs.com,tencentyun.com,wisemodel.cn,hf-mirror.com,pypi.tuna.tsinghua.edu.cn,mirrors.tuna.tsinghua.edu.cn
export http_proxy=http://172.31.1.128:12798 && export https_proxy=http://172.31.1.128:12798
export REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt
export SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt
echo 设置成功
echo 注意：仅限于学术用途，不承诺稳定性保证
```

## 重定向 huggingface 端点

上面我们已经把 hf-mirror.com 添加到了白名单中，但是如果不做任何设置的话 huggingface 依然会通过 https://huggingface.co 执行操作。因此我们还需要重定向 huggingface 的端点。定向命令在 hf-mirror.com 的文档中也有写。

```bash
export HF_ENDPOINT=https://hf-mirror.com
```

> 题外话：也可以重定向 huggingface 默认的下载路径到 AutoDL 的数据盘上，毕竟系统盘也很小
>
> ```bash
> export HF_HOME=/root/autodl-tmp/cache/
> ```

## 保存为个性化设置

上面的这些通过环境变量完成的更改是临时的，都不用说关机，一旦会话结束，这些设置就会全部消失。为了让每次登陆的时候不用麻烦地重新设置，我们可以把设置保存到 `~/.bashrc` 中。这是 bash 的个性化设置文件，每次登陆的时候都会自动执行。（所以不要手贱尝试在 `~/.bashrc` 中写 `source ~/.bashrc` 这种东西，会无限递归）

:::details 如果你已经试了……

你到底是抱着什么心态去试的……算了。

如果你不是 root 用户，那么你还可以登陆 root 账户然后改掉对应用户的 `.bashrc` 文件。但如果你就是写在了 root 用户的 `.bashrc` 文件中，也没有其他用户账号，那你可以在登陆进去的一瞬间狂按 Ctrl+C，说不定还有救，再不行就只能删档重来了

:::

打开 `~/.bashrc` 文件，将下面的内容复制到文件末尾，然后保存退出即可。下一次登陆的时候这些设置就会自动生效。

```bash
source /etc/network_turbo
export HF_HOME=/root/autodl-tmp/cache/ # 可选，如果需要把 huggingface 的缓存目录重定向到数据盘上
export HF_ENDPOINT=https://hf-mirror.com
```

或者如果你懒得打开文件，也可以直接在终端中执行下面的命令，效果是一样的。

```bash
echo "source /etc/network_turbo" >> ~/.bashrc
echo "export HF_HOME=/root/autodl-tmp/cache/" >> ~/.bashrc # 可选，如果需要把 huggingface 的缓存目录重定向到数据盘上
echo "export HF_ENDPOINT=https://hf-mirror.com" >> ~/.bashrc
```
