---
title: 尝试解决 CursorUIViewService 的内存泄漏
tags:
  - macOS
---

# 尝试解决 CursorUIViewService 的内存泄漏

Cursor 的 UIViewService 在 macOS 上存在内存泄漏的问题，目前尝试通过禁用新功能来解决。

![上次 20 天没关机，和 WindowServer 两个好兄弟总共漏了将近 16G 左右](https://cdn.sa.net/2025/02/28/2U1umX5R7W6e3cs.webp)

```bash
sudo defaults write /Library/Preferences/FeatureFlags/Domain/UIKit.plist redesigned_text_cursor -dict-add Enabled -bool NO
```

之后登出系统后再重新登入，或者直接在任务管理器里杀掉 `CursorUIViewService` 进程即可。

经过测试，这个做法实际上不会解决内存泄漏的问题，但是似乎可以稍微缓解一下；而另一个主要作用是，不关闭新功能之前，如果在任务管理器里强制终止 `CursorUIViewService` 进程的话，WindowServer 会直接崩溃导致卡死大概 30 秒之后被弹出到登录界面，而关闭新功能之后可以放心大胆地杀掉进程，WindowServer 不会崩溃，只会小卡个五秒左右，然后就能正常使用了。如果还是不喜欢的话，可以设置一个每天凌晨五点钟自动杀一遍进程的 cronjob，这样就不怎么需要担心了。不过这个 bug 印象里少说已经存在三四个大版本了，苹果工程师是不是阿三浓度太高了。
