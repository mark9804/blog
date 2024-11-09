import { RSSOptions } from "vitepress-plugin-rss";
import { DOMAIN } from "../constants";

export const rssConfig: RSSOptions = {
  title: "今天没有早睡",
  baseUrl: DOMAIN,
  copyright: "Copyright (c) 2024-present, Mark Chen",
  description: "To trace the bright moonlight",
  language: "zh-cn",
  author: {
    name: "Mark Chen",
    email: "mark_chen@blue-archive.io",
    link: "https://github.com/mark9804",
  },
  icon: true,
  filename: "feed.rss",
  ignoreHome: true,
};
