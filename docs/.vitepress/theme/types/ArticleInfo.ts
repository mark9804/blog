export type ArticleInfo = {
  frontmatter: {
    title?: string;
    description?: string;
    tags?: string[];
    cover?: string;
    meta?: {
      hidden?: boolean;
      timeAmp?: number; // 阅读时间倍率
      hideArticleInfo?: boolean; // 是否显示文章信息
      hideEditTime?: boolean; // 是否隐藏编辑时间
      hideReadingTime?: boolean; // 是否隐藏阅读时间
    };
  };
  createdAt?: number;
  lastUpdated?: number | string;
  readingTime: number;
  wordsCount: number;
  imgCount?: number;
  url: string;
};
