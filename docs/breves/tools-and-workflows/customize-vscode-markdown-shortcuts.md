---
title: 定制 Visual Studio Code 的 Markdown 快捷键
description: 在 VSCode 设置中加入一些常用的 Markdown 快捷键，提高 Markdown 文档的编辑效率。
tags:
  - VSCode
  - Markdown
---

# 定制 Visual Studio Code 的 Markdown 快捷键

虽然 VSCode 在前后端开发中已经相当常见，也足够胜任基于 Markdown 的文档编辑工作，不过在 VSCode 的开箱配置中并没有针对 Markdown 进行特别优化，缺失了一些常用的加粗、斜体、下划线、删除线和上下角标等快捷键。我会在这篇文章中介绍我自己使用的针对 Markdown 文档编辑的 VSCode 快捷键配置，以及如何配置它们。

## VSCode 的快捷键配置

可能已经有很多人试过了使用 VSCode 的 GUI 界面绑定或者重新绑定快捷键，不过由于 Markdown 的快捷键涉及到插入模板字符串，因此使用 VSCode 的 `keybindings.json` 文件进行配置会更加方便。这个文件可以在命令面板中搜索 `Preferences: Open Keyboard Shortcuts (JSON)` 打开。

### `keybindings.json` 文件结构

VSCode 的配置文件基本上都是基于 JSON 格式的（基于 VSCode 的 Cursor 当然也一样）。`keybindings.json` 当中，每个 keymap 基本上存在以下键值对：

- `key`：快捷键，例如 `cmd+shift+u`
- `command`：绑定的命令，在这次配置中主要使用代表在特定位置插入字符串模板的 `editor.action.insertSnippet` 命令。
- `when`：触发命令的条件。例如我们不希望在编辑其他语言的文件时触发命令，就应该使用 `editorTextFocus && editorLangId == 'markdown'` 条件来过滤（代表严格相等的 `===` 也是可以使用的，不过没有这个必要，设置文件讲究一个兼容）。这个条件代表“当前光标聚焦在编辑器中，并且当前编辑器的语言是 Markdown”。
- `args`：传递给命令的参数。例如 `{ "snippet": "^$TM_SELECTED_TEXT^$0" }` 就是将当前选中的文本两端加入 `^` 符号后插入到光标位置，然后在插入位置后方跟上原本就有的文本。

## 配置示例

理解了这些之后，就可以开始插入配置了。我把我自己的配置放在下面，有需要的直接全部复制然后粘贴进 `keybindings.json` 文件中就可以了。

### 加粗

- 快捷键：<kbd>cmd</kbd>+<kbd>b</kbd>

```json
{
  "key": "cmd+b",
  "command": "editor.action.insertSnippet",
  "when": "editorTextFocus && editorLangId == 'markdown'",
  "args": {
    "snippet": "**$TM_SELECTED_TEXT**$0"
  }
},
```

### 斜体

- 快捷键：<kbd>cmd</kbd>+<kbd>i</kbd>

```json
{
  "key": "cmd+i",
  "command": "editor.action.insertSnippet",
  "when": "editorTextFocus && editorLangId == 'markdown'",
  "args": {
    "snippet": "*$TM_SELECTED_TEXT*$0"
  }
},
```

### 删除线

- 快捷键：<kbd>cmd</kbd>+<kbd>shift</kbd>+<kbd>x</kbd>

```json
{
  "key": "cmd+shift+x",
  "command": "editor.action.insertSnippet",
  "when": "editorTextFocus && editorLangId == 'markdown'",
  "args": {
    "snippet": "~~$TM_SELECTED_TEXT~~$0"
  }
},
```

### 下划线

- 快捷键：<kbd>cmd</kbd>+<kbd>u</kbd>

```json
{
  "key": "cmd+u",
  "command": "editor.action.insertSnippet",
  "when": "editorTextFocus && editorLangId == 'markdown'",
  "args": {
    "snippet": "<u>$TM_SELECTED_TEXT</u>$0"
  }
},
```

### 下角标

- 快捷键：<kbd>cmd</kbd>+<kbd>shift</kbd>+<kbd>-</kbd>

```json
{
  "key": "cmd+shift+-",
  "command": "editor.action.insertSnippet",
  "when": "editorTextFocus && editorLangId == 'markdown'",
  "args": {
    "snippet": "~$TM_SELECTED_TEXT~$0"
  }
},
```

### 上角标

- 快捷键：<kbd>cmd</kbd>+<kbd>shift</kbd>+<kbd>+</kbd>

```json
{
  "key": "cmd+shift+=",
  "command": "editor.action.insertSnippet",
  "when": "editorTextFocus && editorLangId == 'markdown'",
  "args": {
    "snippet": "^$TM_SELECTED_TEXT^$0"
  }
},
```
