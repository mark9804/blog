# mark9804 的个人博客

## Feature

- Markdown 语法增强：mark、ruby、spoiler、图像尺寸、上下角标、图像标题
- 基于 `contentLoader` 的纯前端字数和图片张数统计，以及阅读时间计算
- 基于 `contentLoader` 和 `git log` 的最后编辑时间获取
- 按标签搜索
- 自制主题
- 支持评论
- 自动侧边栏
- 正文图像默认懒加载
- 正文图像可点击放大

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
