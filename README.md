# mark9804 的个人博客

## Feature

- 基于 [Arco Design Vue](https://arco.design/vue/) 定制的主题
  - 自定义图库语法 `:::gallery 图库名称`
  - 图片可点击放大
  - 图片 lazyload 与 loading 效果
  - 与 [@mdit/plugin-img-size](https://mdit-plugins.github.io/zh/img-size.html) 混合使用的图像尺寸自定义功能
  - 文章信息展示自定义
- Markdown 语法增强
  - `mark`
  - `ruby`
  - `spoiler`
  - 上标和下标
  - 图像 caption
  - 支持 [LaTeX 语法](https://www.latex-project.org/)
- 基于 `contentLoader` 的纯前端字数和图片张数统计，以及阅读时间计算
- 基于 `contentLoader` 和 `git log` 的最后编辑时间获取
- 按标签搜索
- 支持评论
- 自动侧边栏目录生成
- 开发者友好
  - commit hook 自动格式化
  - 自动导入

## 技术栈

- 基础框架：[VitePress](https://vitepress.vuejs.org/)（自动跟随上游版本号） + `husky@v9` + `lint-staged` + `prettier` + `eslint@v9`
- CSS 框架：[UnoCss](https://unocss.dev/)
- DX/CI/CD：
  - 自动导入：[unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import#readme)
  - 自动构建和部署：GitHub Actions + GitHub Pages
  - 自动更新依赖：[Mend Renovate](https://www.mend.io/renovate-free/)
  - 自动侧边栏：[Vitepress Sidebar](https://vitepress-sidebar.jooy2.com)
- 组件库：[Arco Design Vue](https://arco.design/vue/)
- 评论系统：[Disqus](https://disqus.com/)
- 状态管理：[Pinia](https://pinia.vuejs.org/)
- Icon：[IconPark](https://iconpark.bytedance.com/) / [Arco](https://arco.design/vue/component/icon)
- 工具库：[VueUse](https://vueuse.org/), [Radash](https://radash-docs.vercel.app/docs/getting-started)
