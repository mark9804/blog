import type { ProfileProps } from "../theme/components/ElysiumUI/types/ProfileProps";
import { BASE_URL } from "../constants";

export const userProfile: ProfileProps = {
  name: {
    "zh-CN": "今天早睡了吗",
    "en-US": "Mark Chen",
  },
  email: "mark_chen@blue-archive.io",
  avatar: "https://avatars.githubusercontent.com/u/9006264?v=4",
  bio: "Per aspera ad astra",
  social: [
    {
      alias: "GitHub",
      link: "https://github.com/mark9804",
    },
    {
      alias: "RSS",
      link: `feed.rss`,
    },
    {
      alias: "Team",
      link: "https://github.com/ba-archive",
    },
    {
      alias: "Projects",
      link: "projects",
    },
    {
      alias: "About",
      link: "about",
    },
  ],
};
