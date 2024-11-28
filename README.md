# mark9804 的个人博客

基于 VitePress，定制 [Elysium](./docs/.vitepress/theme/components/ElysiumUI) 主题，使用少量 [Arco Design](https://arco.design/vue/) 组件库和图标。~~现在还很多，会慢慢变少的~~

视障人群友好（已和朋友测试过，感谢他抽出自己休息时间给我提了许多建议！），晕动症患者友好（大概）。

无制作主题包计划，但有一定程度的抽象，喜欢的请 fork 后自行修改样式文件。或者不修改直接把文章换成自己的也行。

## Feature

- ~~正在~~定制 [Elysium](./docs/.vitepress/theme/components/ElysiumUI) 主题，配色灵感来自黄金庭园。
- Markdown 语法增强：
  - 相册语法 `:::gallery 相册名称`；
  - 图片增强：
    - 图片可点击放大；
    - 图片支持 lazyload，加入 loading 效果；
    - 可控制图像尺寸；
  - 重点标记 `mark`；
  - 注音 `ruby`；
  - 剧透 `spoiler`；
  - 上标和下标；
  - 图片 caption；
  - 支持 [LaTeX 语法](https://www.latex-project.org/)。
- 在构建时，基于 `contentLoader` 统计字数和图片张数。
- 在构建时，基于字数和图片数量计算阅读时间。
- 在构建时，基于 `contentLoader` 和 `git` 获取最后编辑时间。
- 支持按标签过滤文章。
- 支持评论。
- 自动生成侧边栏目录。
- 开发者友好：
  - 提交时自动格式化；
  - 配置自动导入 Arco Design 组件/图标库和 Elysium UI 组件。

## TODO

- [ ] 轻量化文章 （a.k.a 朋友圈） `quavers` （八分音符）
- [ ] 首页 NavBar
- [ ] 逐渐替换掉 Arco Design 组件库
- [x] 首页文章搜索框

## 技术栈

- 基础框架：[VitePress](https://vitepress.vuejs.org/)（自动跟随上游版本号） + `husky@v9` + `lint-staged` + `prettier` + `eslint@v9`
- CSS 框架：[UnoCss](https://unocss.dev/)
- DX/CI/CD：
  - 自动导入：[unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import#readme)
  - 自动构建和部署：GitHub Actions + GitHub Pages
  - 自动更新依赖：[Mend Renovate](https://www.mend.io/renovate-free/)
  - 自动侧边栏：[VitePress Sidebar](https://vitepress-sidebar.jooy2.com)
- 组件库：[Elysium UI](./docs/.vitepress/theme/components/ElysiumUI)，[Arco Design Vue](https://arco.design/vue/)
- 评论系统：[Disqus](https://disqus.com/)
- 状态管理：[Pinia](https://pinia.vuejs.org/)
- Icon：[IconPark](https://iconpark.bytedance.com/) / [Arco](https://arco.design/vue/component/icon)
- 工具库：[VueUse](https://vueuse.org/), [Radash](https://radash-docs.vercel.app/docs/getting-started)
