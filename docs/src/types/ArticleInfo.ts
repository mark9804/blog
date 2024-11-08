export type ArticleInfo = {
  frontmatter: {
    title?: string;
    description?: string;
    tags?: string[];
    cover?: string;
    meta?: {
      hidden?: boolean;
    };
  };
  createdAt?: number;
  lastUpdated?: number | string;
  readingTime: number;
  wordsCount: number;
  imgCount?: number;
  url: string;
};
