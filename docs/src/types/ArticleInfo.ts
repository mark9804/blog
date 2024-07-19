export interface ArticleInfo {
  frontmatter: {
    title?: string;
    description?: string;
    tags?: string[];
    cover?: string;
    meta?: {
      hidden?: boolean;
    };
  };
  lastUpdated?: number | string;
  readingTime: number;
  wordsCount: number;
  url: string;
}
