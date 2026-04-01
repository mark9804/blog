export const navConfig = [
  { text: "首页", link: "/" },
  { text: "关于", link: "/about" },
  {
    text: "友链",
    items: [
      {
        text: "碧蓝档案剧情站",
        items: [
          { text: "首页", link: "https://blue-archive.io" },
          { text: "Bilibili", link: "https://space.bilibili.com/1413213021" },
        ],
      },
      {
        text: "友站（按首字母排序）",
        items: [
          {
            text: "Arona Bot",
            link: "https://doc.arona.diyigemt.com/",
          },
          {
            text: "BA OST Index",
            link: "https://ba.cnfast.top/",
          },
          {
            text: "Armstrong-一位视障学生的日志",
            link: "https://armstrong.viyf.org/",
          },
          {
            text: "妄想叛逆Project",
            link: "https://space.bilibili.com/1989131372",
          },
          {
            text: "AstralSympathy",
            link: "https://space.bilibili.com/3690992320383242",
          },
        ].sort((a, b) => a.text.localeCompare(b.text)),
      },
    ],
  },
];
