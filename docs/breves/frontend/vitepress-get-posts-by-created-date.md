---
title: 获取 VitePress 文章的最早创建日期
description: 使用 Content Loader 和 git 获取 markdown 文件的创建日期
tags:
  - 前端
  - VitePress
ai_usage: false
---

# 获取 VitePress 文章的最早创建日期

最近在博客主页的时间线中遇到了需要获取某篇文章最早创建时间的需求，于是在[获取文章列表](./vitepress-article-list.md)的基础上尝试实现这一需求。

由于我的部署工作流使用 GitHub Actions，所以肯定不能使用读取文件本地修改时间的方式来实现。因此想到了利用 Git 的初次提交记录来实现这一功能。

我们之前已经通过惊人的注意力注意到了 [createContentLoader](https://vitepress.dev/guide/data-loading#createcontentloader) 这个函数，其返回的一个参数就有 `url` 属性，通过这个属性就可以获取文件的路径（以 `.md` 结尾）。

```ts
function transformUrlToPath(url: string) {
  const siteConfig = globalThis.VITEPRESS_CONFIG;

  let file = url.replace(/(^|\/)$/, "$1index").replace(/(\.html)?$/, ".md");
  file = siteConfig.rewrites.inv[file] || file;
  return join(siteConfig.srcDir, file);
}
```

获取文件路径后，就可以用 `git log` 命令来获取文件的提交记录。一开始我是用的是 `git log --reverse -1`，但是发现这样获取到的其实是最后一条提交（我还以为 reverse 之后应该是从头开始……）。于是在 ChatGPT 的指导下知道了还有 `--diff-filter=A` 这个只显示添加操作的参数。于是就有了以下完整命令：

```bash
git log --diff-filter=A --follow --format=%ai -1 <file>
```

其中 `--follow` 参数可以跟踪文件移动，`--format=%ai` 参数可以获取提交的时间。有了这行命令之后，我们就可以在 `transform` 函数中使用它来获取文件的创建时间了。

```ts
const loader = createContentLoader("**/*.md", {
  async transform(rawData) {
    return await pMap(
      rawData,
      async item => {
        const file = transformUrlToPath(item.url);
        const frontmatter = item.frontmatter;
        const content = readFileSync(file, "utf-8");

        const createdAt =
          item.frontmatter?.createdAt ??
          ((await getCreatedAt(item.url)) as unknown as number);

        return {
          ...item,
          createdAt,
        };
      },
      { concurrency: 64 }
    );
  },
});
```

这里我使用了 [p-map](https://github.com/sindresorhus/p-map) 库来并行处理 Promise。`p-map` 相较 `Promise.all` 来说的两个亮点在于错误控制（如果一个 `Promise` 出错，`Promise.all` 会继续执行剩下的 `Promise`，而 `p-map` 会立即停止）和并发控制（`p-map` 可以通过 `concurrency` 参数来控制并发数）。我实在是想象不到什么情况下 `contentLoader` 居然会报错，不过如果之后文章越囤越多导致 `Promise.all` 把内存撑爆了（真的会有那么高产🐴）， `p-map` 的并发控制就派上用场了。

写入的数据会在打包时被序列化成一段 JSON 字符串，因此如果你需要读取特定文章的创建时间的话，需要自己封装一个函数：

```ts
import { data as usePosts } from "../loaders/posts.data";

export type Post = {
  url: string;
  createdAt: number;
  readingTime: number;
  wordsCount: number;
  imgCount: number;
  src: string;
  html: string;
  frontmatter: Record<string, any>;
  excerpt: string;
};

export const postData = {
  async getCreatedAt(currentPathWithoutBase: string) {
    const posts = (await usePosts) as Post[];
    return posts.find(el => el.url === currentPathWithoutBase)?.createdAt;
  },
};
```

完整的实现可以参考 [这里](https://github.com/mark9804/blog/blob/master/docs/.vitepress/theme/loaders/posts.data.ts)。这个实现中不仅有获取创建时间的函数，还有获取文章字数、图片数和根据两者计算阅读时间的功能具体实现。
