---
title: 在 Mac 上游玩 PC 版绝区零
tags:
  - 游戏
  - 绝区零
  - macOS
---

# 在 Mac 上游玩 PC 版绝区零

:::danger 2025-04-23: 寄咯

更新到 1.7 版本之后，启动总是黑屏报错，看日志是米魔改引擎的问题，应该一时半会解决不了了

:::details 完整日志

```text
Compressed File Name 2025-04-24T11-17-08.zip
Plugins: Failed to load 'C:/Program Files/miHoYo Launcher/games/ZenlessZoneZero Game/ZenlessZoneZero_Data/Plugins\x86_64/GfxPluginEOSSDK.dll' because one or more of its dependencies could not be loaded.
(Filename:  Line: 312)

@@@@ InitDevConfigWithPath:C:/Program Files/miHoYo Launcher/games/ZenlessZoneZero Game/ZenlessZoneZero_Data/../devconfig.txt

@@@@ InitDevConfigWithPath C:/Program Files/miHoYo Launcher/games/ZenlessZoneZero Game/ZenlessZoneZero_Data/../devconfig.txt not open!

Initialize engine version: 2019.4.40f1 (6a3d8287a)
[Subsystems] Discovering subsystems at path C:/Program Files/miHoYo Launcher/games/ZenlessZoneZero Game/ZenlessZoneZero_Data/UnitySubsystems
GfxDevice: creating device client; threaded=1
Direct3D:
    Version:  Direct3D 11.0 [level 11.1]
    Renderer: AMD Compatibility Mode (ID=0x66af)
    Vendor:
    VRAM:     12288 MB
    Driver:   31.0.14051.5006
WARNING: Shader Unsupported: 'Legacy Shaders/VertexLit' - All passes removed
WARNING: Shader Did you use #pragma only_renderers and omit this platform?
WARNING: Shader Unsupported: 'Legacy Shaders/Diffuse' - All passes removed
WARNING: Shader Did you use #pragma only_renderers and omit this platform?
ERROR: Shader Hidden/Universal Render Pipeline/RTXGI shader is not supported on this GPU (none of subshaders/fallbacks are suitable)
Dedicated video D3D11 device multithread protection failed (error: 0x80004002). Will use software video decoding.
Unity.Timeline OdinNewInitializer Success
miHoYoEmotion OdinNewInitializer Success
PipelineCamera OdinNewInitializer Success
Foundation OdinNewInitializer Success
Logic OdinNewInitializer Success
DynamicBone OdinNewInitializer Success
<RI> Initializing input.

New input system (experimental) initialized
<RI> Input initialized.

<RI> Initialized touch support.

UnloadTime: 6.851600 ms
currentCulture.Name:en-US
Odin Serializer ArchitectureInfo initialization with defaults (all unaligned read/writes disabled).
Odin Serializer detected whitelisted runtime platform WindowsPlayer and memory read test succeeded; enabling all unaligned memory read/writes.
WwiseUnity: Wwise(R) SDK Version 2019.2.15 Build 7667.
WwiseUnity: Setting Plugin DLL path to: C:/Program Files/miHoYo Launcher/games/ZenlessZoneZero Game/ZenlessZoneZero_Data\Plugins\x86_64
WwiseUnity: Sound engine initialized successfully.
Crash!!!
SymInit: Symbol-SearchPath: '.;C:\Program Files\miHoYo Launcher\games\ZenlessZoneZero Game;C:\Program Files\miHoYo Launcher\games\ZenlessZoneZero Game;C:\windows;C:\windows\system32;SRV*C:\websymbols*http://msdl.microsoft.com/download/symbols;', symOptions: 534, UserName: 'crossover'
OS-Version: 10.0.0
C:\Program Files\miHoYo Launcher\games\ZenlessZoneZero Game\ZenlessZoneZero.exe:ZenlessZoneZero.exe (0000000140000000), size: 10416128 (result: 0), SymType: '-deferred-', PDB: '', fileVersion: 2019.4.40.15746
C:\windows\system32\ntdll.dll:ntdll.dll (00006FFFFFF40000), size: 696320 (result: 0), SymType: '-deferred-', PDB: '', fileVersion: 6.1.7601.24059
C:\windows\system32\kernel32.dll:kernel32.dll (00006FFFFFEC0000), size: 401408 (result: 0), SymType: '-deferred-', PDB: '', fileVersion: 10.0.19043.1466
C:\windows\system32\kernelbase.dll:kernelbase.dll (00006FFFFFC10000), size: 2727936 (result: 0), SymType: '-deferred-', PDB: ''
C:\Program Files\miHoYo Launcher\games\ZenlessZoneZero Game\UnityPlayer.dll:UnityPlayer.dll (00006FFFEAFB0000), size: 37117952 (result: 0), SymType: '-deferred-', PDB: '', fileVersion: 2019.4.40.15746
C:\windows\system32\USER32.dll:USER32.dll (00006FFFFF5D0000), size: 1814528 (result: 0), SymType: '-deferred-', PDB: '', fileVersion: 5.1.2600.2180
C:\windows\system32\advapi32.dll:advapi32.dll (00006FFFFFBB0000), size: 270336 (result: 0), SymType: '-deferred-', PDB: '', fileVersion: 10.0.10240.16384
C:\windows\system32\msvcrt.dll:msvcrt.dll (00006FFFFFB00000), size: 638976 (result: 0), SymType: '-deferred-', PDB: '', fileVersion: 7.0.2600.2180
C:\windows\system32\sechost.dll:sechost.dll (00006FFFFFAD0000), size: 131072 (result: 0), SymType: '-deferred-', PDB: ''
C:\windows\system32\ucrtbase.dll:ucrtbase.dll (00006FFFFF9D0000), size: 966656 (result: 0), SymType: '-deferred-', PDB: '', fileVersion: 10.0.10137.0
C:\windows\system32\gdi32.dll:gdi32.dll (00006FFFFF530000), size: 528384 (result: 0), SymType: '-deferred-', PDB: '', fileVersion: 10.0.0.0
C:\windows\system32\win32u.dll:win32u.dll (00006FFFFF4E0000), size: 249856 (result: 0), SymType: '-deferred-', PDB: ''
C:\windows\system32\VERSION.dll:VERSION.dll (00006FFFFD2C0000), size: 57344 (result: 0), SymType: '-deferred-', PDB: '', fileVersion: 5.1.2600.2180
C:\windows\system32\ole32.dll:ole32.dll (00006FFFFE350000), size: 749568 (result: 0), SymType: '-deferred-', PDB: '', fileVersion: 10.0.0.0
C:\windows\system32\combase.dll:combase.dll (00006FFFFE2F0000), size: 319488 (result: 0), SymType: '-deferred-', PDB: ''
C:\windows\system32\rpcrt4.dll:rpcrt4.dll (00006FFFFF8F0000), size: 536576 (result: 0), SymType: '-deferred-', PDB: '', fileVersion: 5.1.2600.2180
C:\windows\system32\coml2.dll:coml2.dll (00006FFFFE2C0000), size: 118784 (result: 0), SymType: '-deferred-', PDB: ''
C:\windows\system32\SHLWAPI.dll:SHLWAPI.dll (00006FFFFE760000), size: 315392 (result: 0), SymType: '-deferred-', PDB: '', fileVersion: 6.0.2800.1692
C:\windows\system32\shcore.dll:shcore.dll (00006FFFFE730000), size: 94208 (result: 0), SymType: '-deferred-', PDB: ''
C:\windows\system32\SETUPAPI.dll:SETUPAPI.dll (00006FFFFF860000), size: 475136 (result: 0), SymType: '-deferred-', PDB: ''
C:\windows\system32\SHELL32.dll:SHELL32.dll (00006FFFFE7C0000), size: 9564160 (result: 0), SymType: '-deferred-', PDB: '', fileVersion: 6.0.2900.6242
C:\windows\system32\OPENGL32.dll:OPENGL32.dll (000000007BEE0000), size: 1110016 (result: 0), SymType: '-deferred-', PDB: '', fileVersion: 5.1.2600.2082
C:\windows\system32\WINMM.dll:WINMM.dll (00006FFFFE190000), size: 790528 (result: 0), SymType: '-deferred-', PDB: ''
C:\windows\system32\msacm32.dll:msacm32.dll (00006FFFFE150000), size: 135168 (result: 0), SymType: '-deferred-', PDB: ''
C:\windows\system32\OLEAUT32.dll:OLEAUT32.dll (00006FFFFDFE0000), size: 884736 (result: 0), SymType: '-deferred-', PDB: '', fileVersion: 10.0.19043.1466
C:\windows\system32\IMM32.dll:IMM32.dll (00006FFFFF4B0000), size: 126976 (result: 0), SymType: '-deferred-', PDB: '', fileVersion: 5.1.2600.2180
C:\windows\system32\WINHTTP.dll:WINHTTP.dll (00006FFFF1180000), size: 274432 (result: 0), SymType: '-deferred-', PDB: '', fileVersion: 5.1.2600.2180
C:\windows\system32\jsproxy.dll:jsproxy.dll (00006FFFF1150000), size: 126976 (result: 0), SymType: '-deferred-', PDB: ''
C:\windows\system32\ws2_32.dll:ws2_32.dll (00006FFFFF990000), size: 159744 (result: 0), SymType: '-deferred-', PDB: '', fileVersion: 5.1.2600.5512
C:\windows\system32\bcrypt.dll:bcrypt.dll (00006FFFFF0F0000), size: 102400 (result: 0), SymType: '-deferred-', PDB: '', fileVersion: 6.0.6000.16386
C:\windows\system32\HID.DLL:HID.DLL (00006FFFF1A00000), size: 69632 (result: 0), SymType: '-deferred-', PDB: '', fileVersion: 10.0.0.0
C:\windows\system32\CRYPT32.dll:CRYPT32.dll (00006FFFFF120000), size: 856064 (result: 0), SymType: '-deferred-', PDB: '', fileVersion: 5.131.2600.1243
c:\windows\system32\winemac.drv:winemac.drv (00006FFFFE130000), size: 61440 (result: 0), SymType: '-deferred-', PDB: '', fileVersion: 10.0.0.0
C:\windows\system32\uxtheme.dll:uxtheme.dll (00006FFFFE270000), size: 221184 (result: 0), SymType: '-deferred-', PDB: '', fileVersion: 10.0.0.0
C:\windows\system32\WINTRUST.DLL:WINTRUST.DLL (00006FFFFC420000), size: 163840 (result: 0), SymType: '-deferred-', PDB: '', fileVersion: 6.1.7601.23769
C:\windows\system32\imagehlp.dll:imagehlp.dll (00006FFFEAF80000), size: 73728 (result: 0), SymType: '-deferred-', PDB: ''
C:\windows\system32\dbghelp.dll:dbghelp.dll (00006FFFF1B60000), size: 479232 (result: 0), SymType: '-deferred-', PDB: '', fileVersion: 6.1.7601.17514
C:\windows\system32\rsaenh.dll:rsaenh.dll (00006FFFF0550000), size: 204800 (result: 0), SymType: '-deferred-', PDB: '', fileVersion: 5.1.2600.2180
C:\Program Files\miHoYo Launcher\games\ZenlessZoneZero Game\GameAssembly.dll:GameAssembly.dll (00006FFFCEBF0000), size: 473399296 (result: 0), SymType: '-deferred-', PDB: ''
C:\windows\system32\IPHLPAPI.DLL:IPHLPAPI.DLL (00006FFFFF400000), size: 176128 (result: 0), SymType: '-deferred-', PDB: '', fileVersion: 5.1.2600.2180
C:\windows\system32\dnsapi.dll:dnsapi.dll (00006FFFFF3D0000), size: 90112 (result: 0), SymType: '-deferred-', PDB: '', fileVersion: 5.2.3790.4318
C:\windows\system32\nsi.dll:nsi.dll (00006FFFFF3B0000), size: 57344 (result: 0), SymType: '-deferred-', PDB: ''
C:\windows\system32\WLDAP32.dll:WLDAP32.dll (00006FFFF05A0000), size: 569344 (result: 0), SymType: '-deferred-', PDB: ''
C:\windows\system32\secur32.dll:secur32.dll (00006FFFF1A50000), size: 131072 (result: 0), SymType: '-deferred-', PDB: ''
C:\windows\system32\MSV1_0.dll:MSV1_0.dll (00006FFFF0BA0000), size: 77824 (result: 0), SymType: '-deferred-', PDB: ''
C:\windows\system32\netapi32.dll:netapi32.dll (00006FFFFD280000), size: 151552 (result: 0), SymType: '-deferred-', PDB: ''
C:\windows\system32\netutils.dll:netutils.dll (00006FFFFD260000), size: 53248 (result: 0), SymType: '-deferred-', PDB: ''
C:\windows\system32\d3d11.dll:d3d11.dll (00006FFFFC4A0000), size: 114688 (result: 0), SymType: '-deferred-', PDB: ''
C:\windows\system32\dxgi.dll:dxgi.dll (00006FFFFC480000), size: 65536 (result: 0), SymType: '-deferred-', PDB: ''
C:\windows\system32\wbem\wbemprox.dll:wbemprox.dll (00006FFFEF780000), size: 245760 (result: 0), SymType: '-deferred-', PDB: ''
C:\windows\system32\winspool.drv:winspool.drv (00006FFFFE450000), size: 200704 (result: 0), SymType: '-deferred-', PDB: '', fileVersion: 5.1.2600.2180
C:\windows\system32\compstui.dll:compstui.dll (00006FFFFE420000), size: 122880 (result: 0), SymType: '-deferred-', PDB: ''
C:\windows\winsxs\amd64_microsoft.windows.common-controls_6595b64144ccf1df_6.0.2600.2982_none_deadbeef\comctl32.dll:comctl32.dll (00006FFFFE5C0000), size: 1298432 (result: 0), SymType: '-deferred-', PDB: '', fileVersion: 5.81.4704.1100
C:\windows\system32\xinput1_4.dll:xinput1_4.dll (00006FFFCEB90000), size: 77824 (result: 0), SymType: '-deferred-', PDB: '', fileVersion: 6.3.9600.16384
C:\windows\system32\xinput1_3.dll:xinput1_3.dll (00006FFFCEB60000), size: 73728 (result: 0), SymType: '-deferred-', PDB: '', fileVersion: 9.15.779.0
C:\Program Files\miHoYo Launcher\games\ZenlessZoneZero Game\ZenlessZoneZero_Data\Plugins\x86_64\AkSoundEngine.dll:AkSoundEngine.dll (00006FFFCE880000), size: 2932736 (result: 0), SymType: '-deferred-', PDB: ''
C:\windows\system32\mmdevapi.dll:mmdevapi.dll (00006FFFEF150000), size: 172032 (result: 0), SymType: '-deferred-', PDB: ''
C:\windows\system32\winecoreaudio.drv:winecoreaudio.drv (00006FFFEEA50000), size: 53248 (result: 0), SymType: '-deferred-', PDB: ''
C:\Program Files\miHoYo Launcher\games\ZenlessZoneZero Game\MHYPBase.dll:MHYPBase.dll (00006FFFCD220000), size: 23363584 (result: 0), SymType: '-deferred-', PDB: '', fileVersion: 1.0.1.1
C:\windows\system32\POWRPROF.dll:POWRPROF.dll (00006FFFEDA90000), size: 53248 (result: 0), SymType: '-deferred-', PDB: ''

========== OUTPUTTING STACK TRACE ==================

  ERROR: SymGetSymFromAddr64, GetLastError: 'Success.' (Address: 00006FFFCE733027)
0x00006FFFCE733027 (mhypbase) (function-name not available)
  ERROR: SymGetSymFromAddr64, GetLastError: 'Success.' (Address: 00006FFFCE7C1B3D)
0x00006FFFCE7C1B3D (mhypbase) (function-name not available)
  ERROR: SymGetSymFromAddr64, GetLastError: 'Success.' (Address: 00006FFFCE7C1B3D)
0x00006FFFCE7C1B3D (mhypbase) (function-name not available)
  ERROR: SymGetSymFromAddr64, GetLastError: 'Success.' (Address: 00006FFFCE7C1B3D)
0x00006FFFCE7C1B3D (mhypbase) (function-name not available)
  ERROR: SymGetSymFromAddr64, GetLastError: 'Success.' (Address: 00006FFFCE7C1B3D)
0x00006FFFCE7C1B3D (mhypbase) (function-name not available)
  ERROR: SymGetSymFromAddr64, GetLastError: 'Success.' (Address: 00006FFFCE7C1B3D)
0x00006FFFCE7C1B3D (mhypbase) (function-name not available)
  ERROR: SymGetSymFromAddr64, GetLastError: 'Success.' (Address: 00006FFFCE7C1B3D)
0x00006FFFCE7C1B3D (mhypbase) (function-name not available)
  ERROR: SymGetSymFromAddr64, GetLastError: 'Success.' (Address: 00006FFFCE7C1B3D)
0x00006FFFCE7C1B3D (mhypbase) (function-name not available)
  ERROR: SymGetSymFromAddr64, GetLastError: 'Success.' (Address: 00006FFFCE7C1B3D)
0x00006FFFCE7C1B3D (mhypbase) (function-name not available)
  ERROR: SymGetSymFromAddr64, GetLastError: 'Success.' (Address: 00006FFFCE7C1B3D)
0x00006FFFCE7C1B3D (mhypbase) (function-name not available)
  ERROR: SymGetSymFromAddr64, GetLastError: 'Success.' (Address: 00006FFFCE7C1B3D)
0x00006FFFCE7C1B3D (mhypbase) (function-name not available)
  ERROR: SymGetSymFromAddr64, GetLastError: 'Success.' (Address: 00006FFFCE7C1B3D)
0x00006FFFCE7C1B3D (mhypbase) (function-name not available)
  ERROR: SymGetSymFromAddr64, GetLastError: 'Success.' (Address: 00006FFFCE7C1B3D)
0x00006FFFCE7C1B3D (mhypbase) (function-name not available)
  ERROR: SymGetSymFromAddr64, GetLastError: 'Success.' (Address: 00006FFFCE7C1B3D)
0x00006FFFCE7C1B3D (mhypbase) (function-name not available)
  ERROR: SymGetSymFromAddr64, GetLastError: 'Success.' (Address: 00006FFFCE7C1B3D)
0x00006FFFCE7C1B3D (mhypbase) (function-name not available)
  ERROR: SymGetSymFromAddr64, GetLastError: 'Success.' (Address: 00006FFFCE7C1B3D)
0x00006FFFCE7C1B3D (mhypbase) (function-name not available)
  ERROR: SymGetSymFromAddr64, GetLastError: 'Success.' (Address: 00006FFFCE7C1B3D)
0x00006FFFCE7C1B3D (mhypbase) (function-name not available)
  ERROR: SymGetSymFromAddr64, GetLastError: 'Success.' (Address: 00006FFFCE7C1B3D)
0x00006FFFCE7C1B3D (mhypbase) (function-name not available)
  ERROR: SymGetSymFromAddr64, GetLastError: 'Success.' (Address: 00006FFFCE7C1B3D)
0x00006FFFCE7C1B3D (mhypbase) (function-name not available)
  ERROR: SymGetSymFromAddr64, GetLastError: 'Success.' (Address: 00006FFFCE7C1B3D)
0x00006FFFCE7C1B3D (mhypbase) (function-name not available)
  ERROR: SymGetSymFromAddr64, GetLastError: 'Success.' (Address: 00006FFFCE7C1B3D)
0x00006FFFCE7C1B3D (mhypbase) (function-name not available)
  ERROR: SymGetSymFromAddr64, GetLastError: 'Success.' (Address: 00006FFFCE7C1B3D)
0x00006FFFCE7C1B3D (mhypbase) (function-name not available)
  ERROR: SymGetSymFromAddr64, GetLastError: 'Success.' (Address: 00006FFFCE7C1B3D)
0x00006FFFCE7C1B3D (mhypbase) (function-name not available)
  ERROR: SymGetSymFromAddr64, GetLastError: 'Success.' (Address: 00006FFFCE7C1B3D)
0x00006FFFCE7C1B3D (mhypbase) (function-name not available)
  ERROR: SymGetSymFromAddr64, GetLastError: 'Success.' (Address: 00006FFFCE7C1B3D)
0x00006FFFCE7C1B3D (mhypbase) (function-name not available)
  ERROR: SymGetSymFromAddr64, GetLastError: 'Success.' (Address: 00006FFFCE7C1B3D)
0x00006FFFCE7C1B3D (mhypbase) (function-name not available)
  ERROR: SymGetSymFromAddr64, GetLastError: 'Success.' (Address: 00006FFFCE7C1B3D)
0x00006FFFCE7C1B3D (mhypbase) (function-name not available)
  ERROR: SymGetSymFromAddr64, GetLastError: 'Success.' (Address: 00006FFFCE7C1B3D)
0x00006FFFCE7C1B3D (mhypbase) (function-name not available)
  ERROR: SymGetSymFromAddr64, GetLastError: 'Success.' (Address: 00006FFFCE7C1B3D)
0x00006FFFCE7C1B3D (mhypbase) (function-name not available)
  ERROR: SymGetSymFromAddr64, GetLastError: 'Success.' (Address: 00006FFFCE7C1B3D)
0x00006FFFCE7C1B3D (mhypbase) (function-name not available)
  ERROR: SymGetSymFromAddr64, GetLastError: 'Success.' (Address: 00006FFFCE7C1B3D)
0x00006FFFCE7C1B3D (mhypbase) (function-name not available)
  ERROR: SymGetSymFromAddr64, GetLastError: 'Success.' (Address: 00006FFFCE7C1B3D)
0x00006FFFCE7C1B3D (mhypbase) (function-name not available)
  ERROR: SymGetSymFromAddr64, GetLastError: 'Success.' (Address: 00006FFFCE7C1B3D)
0x00006FFFCE7C1B3D (mhypbase) (function-name not available)
  ERROR: SymGetSymFromAddr64, GetLastError: 'Success.' (Address: 00006FFFCE7C1B3D)
0x00006FFFCE7C1B3D (mhypbase) (function-name not available)
  ERROR: SymGetSymFromAddr64, GetLastError: 'Success.' (Address: 00006FFFCE7C1B3D)
0x00006FFFCE7C1B3D (mhypbase) (function-name not available)
  ERROR: SymGetSymFromAddr64, GetLastError: 'Success.' (Address: 00006FFFCE7C1B3D)
0x00006FFFCE7C1B3D (mhypbase) (function-name not available)
  ERROR: SymGetSymFromAddr64, GetLastError: 'Success.' (Address: 00006FFFCE7C1B3D)
0x00006FFFCE7C1B3D (mhypbase) (function-name not available)
  ERROR: SymGetSymFromAddr64, GetLastError: 'Success.' (Address: 00006FFFCE7C1B3D)
0x00006FFFCE7C1B3D (mhypbase) (function-name not available)
  ERROR: SymGetSymFromAddr64, GetLastError: 'Success.' (Address: 00006FFFCD2FC1E4)
0x00006FFFCD2FC1E4 (mhypbase) (function-name not available)

========== END OF STACKTRACE ===========

A crash has been intercepted by the crash handler. For call stack and other details, see the latest crash report generated in:
 * C:/users/crossover/AppData/Local/Temp/miHoYo/绝区零/Crashes
```

:::

:::info 2024-12-27 更新

已经在转译模式下打完了第五章和莫里厄斯空洞，不得不说画面设置好了之后流畅度还是远超预期，战斗中也能稳定保持 50 帧以上的水平。不过在大世界中响应键盘单击事件会比较迟钝，时常需要按两下按键才能激活对应功能或者对话选项。在战斗和跑图过程中因为大部分操作都是连点或者按住，所以这个问题在战斗中不是很明显，除非真的想折磨自己在 mac 上爬无限塔。

我的设置和文章末尾相比基本没有变动，1080p 全屏中画质关闭动态模糊，风格化滤镜强度 6，其他地方不用调节也有不错的效果。全程 GPU 调用很积极，基本能吃满，画质上不去的性能瓶颈应该还是出在 GPU 上面。（可以在 [这里](#画面配置表) 看到我的详细画面配置）

但是如果连续运行超过两个小时左右的话会出现一次特别大的卡顿，卡顿过后画面流畅但是音频基本不可用，一卡一卡的，有很严重的延迟，需要重启 Whisky 甚至重启系统才能恢复，猜测可能是爆内存了。

最后雅小姐可爱捏。

:::

![](https://cdn.sa.net/2024/12/18/3SfZvKRtqe2A9Ga.webp)

因为回来过春节时 Windows 主机带不回来，我又把 iPad 转卖了，因此怎么在回家这段期间把雅小姐拿下就成了一个非常现实的问题。（手机能收微信就行，所以甚至还是 64G iPhone SE）

## 失败尝试：用 Whisky 转译启动器

因为 GPTK 2 目前已经相对比较成熟了，因此我的第一个想法是使用 [Whisky](https://getwhisky.app/) 转译一个 Windows 版本的程序。

然而很不幸的是绝区零并不能直接下载到游戏本体，需要通过米哈游启动器才能下到完整包，但是启动器本身是 CEF 程序，虽然可以用 Whisky 成功安装，但是启动时会疯狂报错最后显示一个白屏窗口，无法进行安装等操作。

## 失败尝试：用 Parallels Desktop 启动

既然不能直接启动，那就只能换个思路了，在虚拟机里面启动试试看。虽然性能损失会比转译来得更高，不过至少也是个办法。我使用的是 [Parallels Desktop](https://www.parallels.com/cn/products/desktop/)，理论上用前段时间宣布转社区维护版免费的 [VirtualBox](https://www.virtualbox.org/) 也能达到类似的效果。

（额外参考：[Parallels Desktop on External Drive? How?](https://forum.parallels.com/threads/parallels-desktop-on-external-drive-how.361570/)，这篇文章会教你怎么把 PD 虚拟机转移到外接硬盘上）

这次启动器是能安装了，但是启动游戏本体时会提示不允许使用虚拟机，因此这个方案也宣告失败。

![](https://cdn.sa.net/2024/12/17/QbzPVsU2gAi4Cxm.webp)

## 成功：用 PD 安装，换 Whisky 启动本体

这时候我们要发挥一下科研人的缝合精神，既然一个不能运行启动器，一个能运行启动器但是不能运行游戏本体，那要是用 PD 上的启动器安装好游戏然后把游戏单独拖出来用 Whisky 启动呢？

试试就逝世，先启动 PD 里的虚拟机文件共享功能，然后从网络存储上把游戏拖回本地。

![](https://cdn.sa.net/2024/12/17/J2y83bvGrAMgFu6.webp)

然后在 Whisky 中，选择右下角的 “Run” 按钮，选择 “ZenlessZoneZero.exe” 启动就能正常运行了。

### 性能测试

我用的是 14 核 18G 的中杯 M3 MacBook Pro，游戏安装在三星的 T7 1TB 外接 SSD 上，使用雷电 3 连接线直连 Mac，画质预设为中，窗口大小 ~~1280x720 窗口化~~ 1980x1080 全屏（**全屏比窗口化流畅很多**），测试场景选择光映广场，并且使用转译环境打完了包括战斗在内的第五章剧情。

刚刚进入光映广场时帧数会掉到 30 帧左右后迅速回升，跑图基本维持在 53 帧，静置一段时间后会重新回到 56-60 帧，未见卡死和崩溃。如果正对光源的话，帧率会降到 ~~30~~40 帧左右，到人口密集区（抽象派雕塑的那一侧）帧率会掉到约 45 帧。设置主界面、大世界对话界面可以稳定在 57 帧左右，剧情对话下基本全程能维持在 59.95 帧一条直线。比较特殊的是如果移动电脑本身帧数会暴跌到十几帧，静置一段时间之后迅速恢复，原因未知，所以尽量不要碰电脑（应该也不会有人放在大腿上玩吧）

在光映广场跑图过程中迅速移动视角有大概率会卡顿一小下，应该是 JIT 编译的问题，不是很影响体验。其他地图的卡顿感基本没有或者影响很轻微，可以正常游玩甚至战斗，在第五章的战斗过程中没有感觉到明显延迟或者卡顿。整个过程中 GPU 基本跑满，整机功耗（包含屏幕）在 45-53W 之间，双边风扇是跟平时正常负载一样的 2500 转，基本没有感知。

如果你甚至愿意为了画质牺牲帧率，可以在 Whisky 里开启 Retina 之后把游戏分辨率调到 4k。此时帧率会下降到 33 帧左右，并且可能玩着玩着显存就溢出了。由于 Mac 使用统一内存，严重情况下甚至会导致 kernel panic，直接无预兆的黑屏重启。

我的详细画面配置如下，如果你的配置跟我不一样，建议在大地图压力最大的光映广场调整你的画面设置，尽量保持 GPU time 在 12ms 或者以下。GPU time（pre 下面的那行）代表 GPU 渲染每一帧所用的时间，如果超过了 16.67ms 的话必然不可能以 60 帧运行；余下的 4ms 是预留给 CPU 的计算时间以及冗余。

#### 画面配置表

| 项目           | 设置           |
| -------------- | -------------- |
| 显示模式       | 1920x1080 全屏 |
| 画质档位       | 自定义         |
| 帧率           | 60             |
| 垂直同步       | 开启           |
| 渲染精度       | 1.0            |
| 抗锯齿         | TAA            |
| 全局光照       | 高             |
| 阴影精度       | 高             |
| 特效质量       | 高             |
| 着色质量       | 高             |
| 角色质量       | 高             |
| 角色动态高精度 | 开启           |
| 场景质量       | 高             |
| 镜面反射       | 中             |
| 体积雾         | 中             |
| 高光溢出       | 开启           |
| 运动模糊       | 关闭           |
| 扭曲           | 关闭           |
| 调色滤镜强度   | 6              |

### 限制

在两天的实际体验过程中，虽然游戏本身没有出现过崩溃，但是我被迫重启了两次游戏：第一次是因为把 AirPods 拿下来充电之后游戏音频怎么也连不回去了（12-28 补充：几乎 100% 复现，应该是不支持音频设备重定向），只能用默认扬声器播放声音，并且重新启动游戏和 Whisky 均无效只能重启 Mac；第二次是在过悠真个人剧情的时候突然无征兆卡顿了长达五分钟，之后虽然画面恢复了正常帧率，但是音频一直处于卡顿状态，最后杀了游戏重启后恢复。

除了会遇到音频问题之外，游戏本身 42 天一个大版本的更新也比较噩梦。虽然每个版本内的热更新可以通过重启游戏的方式自动安装并应用，但是游戏本体不能自己大更自己，只能使用启动器下载每个大版本的更新，完成后再用新的游戏资源目录覆盖掉虚拟机外的旧目录，这个过程依硬盘性能而定通常要耗时将近 20 分钟甚至更长。如果使用 PlayCover 的方案，每个大更新过后需要等别人上传砸完壳的包，拖进 PlayCover 后就能运行。因为是 ipa 单文件的形式，所以理论上操作会简单很多，并且直接从 Arm 平台转译的性能损失远比从 x86 转译到 Arm 要小，iPad 端也原生做了优化（指阉割），理论上能达到全程高画质 60 帧或者中画质 120 帧的流畅体验。

## 总结

综上所述，在 Mac 上启动 PC 版绝区零的做法可行，并且实际游戏体验也比想象中的好不少，甚至与敌人进行战斗也不会有太大问题。实际游戏过程中遇到严重卡顿的频率非常低（虽然一出问题就得重启大法），主要的适配问题出在音频上，因此游玩过程中尽量不要切换音频设备并使用有线音频连接，否则可能会出现意想不到的问题。性能瓶颈主要出现在 GPU 上，想要流畅游玩的话建议使用 1920x1080 全屏中画质，并且关闭动态模糊。这样能在大部分场景获得一个 50 帧以上的流畅体验。
