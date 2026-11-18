import type { ProfileProps } from "../theme/components/ElysiumUI/types/ProfileProps.ts";

export const userProfile: ProfileProps = {
  name: {
    "zh-CN": "今天早睡了吗",
    "en-US": "Mark Chen",
  },
  email: "mark.zhaolu.chen@rikkyo.ac.jp",
  avatar: "https://avatars.githubusercontent.com/u/9006264?v=4",
  bio: "Per aspera ad astra.",
  social: [
    {
      alias: "GitHub",
      link: "https://github.com/mark9804",
      openInNewTab: true,
    },
    // {
    //   alias: "LinkedIn",
    //   link: "https://www.linkedin.com/in/zhaolu-chen/",
    //   openInNewTab: true,
    // },
    {
      alias: "Publications",
      link: "/publications",
      openInNewTab: true,
    },
    {
      alias: "Team",
      link: "https://github.com/ba-archive",
      openInNewTab: true,
    },
    {
      alias: "Projects",
      link: "/projects",
    },
    {
      alias: "About",
      link: "/about",
    },
  ],
  scholar: {
    orcid: "0009-0007-2054-6886",
    openAlexAuthorIds: ["A5140871077", "A5057983756"],
  },
};
