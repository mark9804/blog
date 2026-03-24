---
title: "VSCode 中压制 Vue SFC 'Unknown at rule' 警告"
tags:
  - 前端
  - Vue
---

# VSCode 中压制 Vue SFC 'Unknown at rule' 警告

如果使用 Vue SFC 并且在 `<style lang="scss">` 标签中使用 UnoCSS 的 `@apply` 指令的话，VSCode 会报 'Unknown at rule' 警告。虽然这不会影响实际的 CSS 生成和编译运行，但是编辑器误报标红还是比较影响开发体验的。

由于 Vue SFC 最终会将 `<style>` 代码块看作 `css` 来处理，但是 VSCode 默认并不认识 `@apply` 这种 CSS 语法，开发者也无法为具体的语言指定解析器（可以为特定文件扩展名指定和为特定语言指定还是有区别的），因此只能通过其他方式来压制警告。如果使用的是 tailwind 工具链，尚且可以通过安装 [Tailwind CSS Intellisense](https://open-vsx.org/extension/bradlc/vscode-tailwindcss) 插件来解决问题，但是 UnoCSS 插件并没有完善这部分生态。

网上主流的做法是将 `css.lint.unknownAtRules` 设置为 `ignore`，但是这么做会把所有未知的 `@` 语法都忽略掉，要是不小心把 `@apply` 打成 `@aply` 编辑器也不会报错，这就不是我们想要的结果了。

为此，我们可以利用 VSCode 的 [Custom Data Extension](https://code.visualstudio.com/api/extension-guides/custom-data-extension) 来显式声明需要的 at rules。在项目根目录下的 `.vscode` 文件夹中创建一个任意名称的 json 文件（例如 `css-data.json`）并写入：

```json
{
  "atDirectives": [
    {
      "name": "@apply",
      "description": "Use the @apply directive to inline any existing utility classes into your own custom CSS.",
      "references": [
        {
          "name": "UnoCSS docs",
          "url": "https://unocss.dev/transformers/directives#apply"
        }
      ]
    }
  ]
}
```

然后，在 `.vscode/settings.json` 中添加：

```json
{
  "css.customData": [".vscode/css-data.json"]
}
```

关掉当前的 VSCode 窗口重新打开（或者在 command palette 里执行 Developer: Restart Extension Host）后即可生效，效果如图所示，不仅能够消除警告，在光标悬浮时也能显示对应的描述信息和文档链接。

![](https://i.see.you/2026/03/24/0xnB/pic_1774361862452.jpg)
