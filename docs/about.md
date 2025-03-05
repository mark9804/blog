---
publish: false
comment: false
gitChangelog: false
---

# 关于

<!-- [English](./about.en.md) | [日本語](./about.ja.md) -->

## 关于我

:::tip
如果对**我的项目**感兴趣，可以点击 [这里](./projects) 查看！
:::

- 管理学学士，心理学硕士，2025 年 4 月计算机研究生入学预定 ~~和 Hinton 的轨迹好相似，我是不是要得诺奖了~~
- [碧蓝档案剧情站](https://blue-archive.io/)及其附属项目发起人
- 前端技术/平面设计爱好者，追求吸睛的设计、优秀的用户体验和简洁高效的代码
- 计算机视觉研究生在读中
- 喜欢外设，喜欢折腾、研究和分享
- 玩游戏，也~~压榨组员~~开发游戏
- 喜欢摄影和旅游
- 不吃香菜

## 关于本站

本站基于 [VitePress](https://vitepress.dev/) 搭建，托管于 [Vercel](https://vercel.com/)。

网站主题为自行设计并开发的 Elysium。Elysium 取自古希腊神话中“乐园”之意。如今独立的中文博客已然为数甚少，颇有成为信息孤岛之势，但我希望这里能够成为一片志同道合者交流思想、分享知识的净土，也希望有更多人能将这片净土分享和延续下去。

主题名称、文章分类（长文章：{二全音符:breve}；短文章：{四分音符:quaver}）和默认配色灵感来自概念“永世乐土”以及“黄金庭园”。主题对视觉障碍者友好（感谢 [Armstrong](https://armstrong.viyf.org/) 在百忙之中抽出时间来帮助我测试这个主题）。

网站全部内容均开源，文章内容使用 [CC-BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh) 协议发布。代码使用 [AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.html) 协议发布。

如果你希望了解更多技术细节，可以访问该网站的 [GitHub 仓库](https://github.com/mark9804/blog)。

### 部署和使用

#### 使用主题

本主题短期内没有发布主题包的计划，如果需要使用，请 fork 本仓库并自行修改。详情请参考 [Elysium UI README](https://github.com/mark9804/blog/tree/master/docs/.vitepress/theme/README.md)。

#### 撰写文章

本主题将文章分为“长文章”和“短文章”。长文章存储在 `breves` 文件夹中，短文章存储在 `quavers` 文件夹中。

长文章通常描述一个（或者一个系列）相对完整的主题，是博客的主要内容。

短文章类似于“朋友圈动态”，信息含量较低，适合记录一些零碎的想法和状态。

长文章和短文章拥有独立的侧边栏，在进入对应文章列表时会自动切换显示。

#### 修改主题色

修改 `docs/.vitepress/configs/theme.scss` 中的 `$accent` 变量值即可，色板中的其余颜色会自动生成（包括暗色色板）。

注意：由于技术水平限制（不能监听 CSS 变量，实际生产中也没必要监听，徒增功耗），首页的动态背景不支持热更新，构建或刷新页面之后更改才会生效。
