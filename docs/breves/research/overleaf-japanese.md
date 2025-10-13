---
title: Overleaf 使用 pLaTeX/upLaTeX 模板
tags:
  - 研究
  - Overleaf
---

# Overleaf 使用 pLaTeX / upLaTeX 模板

最近投一个日本学会，他们难得提供了日语 Latex 模板，但是日本人懂得都懂，模板用的还是 pLaTeX， 直接导入进 Overleaf 肯定是不能编译的，也不能随便改动 `documentclass` 换成 LuaLaTeX 编译，别到时候放大到 1500% 说我文档边距不一样。（实际上学会够水，应该不至于）

Overleaf 提供的默认编译环境只有四种：pdfLaTeX, LuaLaTeX, XeLaTeX, BibTeX。并没有 pLaTeX 和 upLaTeX。但是可以使用根目录下的 `latexmkrc` 文件来定制编译环境。

先在 Overleaf -> File -> Settings -> Compiler -> Compiler 中选择 LaTex，然后在根目录下新建一个 `latexmkrc` 文件，内容如下：

```perl
$latex = 'uplatex';
$bibtex = 'pbibtex';
$dvipdf = 'dvipdfmx %O -o %D %S';
$makeindex = 'mendex -U %O -o %D %S';
$pdf_mode = 3;
```

接着重新编译，应该就能输出正确的 PDF 了。在这个文件中：

- `$latex = 'uplatex';` 表示使用 upLaTeX 编译，这是一个 pLaTex（专为日文排版设计的 LaTeX 引擎）的支持 UTF-8 的版本，但是 upLaTex 输出的结果是一个 DVI（Device Independent Format）文件，因此需要使用 `dvipdfmx` 将 DVI 文件转换为 PDF。
- `$bibtex = 'pbibtex';` 同理也使用了一个为日文排版设计的 BibTeX 引擎。
- `$dvipdf = 'dvipdfmx %O -o %D %S';` 表示使用 `dvipdfmx` 将 DVI 文件转换为 PDF。`%O`, `%D`, `%S` 都是占位符参数。
- `mendex` 也是一个日文增强的索引工具，参数解释如上。
- `$pdf_mode = 3;` 是明确指定使用 DVI 转换成 PDF 的方式生成文件这个工作流。
