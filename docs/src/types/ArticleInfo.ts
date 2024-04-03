export interface ArticleInfo {
  frontmatter: {
    title?: string;
    description?: string;
    series?: Array<{ name: string; part: number }>;
    tags?: string[];
    meta?: {
      hidden?: boolean;
    };
  };
  url: string;
}
