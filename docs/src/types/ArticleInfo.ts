export interface ArticleInfo {
  frontmatter: {
    title?: string;
    description?: string;
    tags?: string[];
    meta?: {
      hidden?: boolean;
    };
  };
  url: string;
}
