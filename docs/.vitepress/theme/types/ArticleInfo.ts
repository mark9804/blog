export type ArticleInfo = {
  frontmatter: {
    title?: string;
    description?: string;
    tags?: string[];
    cover?: string;
    meta?: {
      hidden?: boolean;
    };
    timeAmp?: number; // 阅读时间倍率
  };
  createdAt?: number;
  lastUpdated?: number | string;
  readingTime: number;
  wordsCount: number;
  imgCount?: number;
  url: string;
};
