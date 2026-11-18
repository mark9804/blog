export interface ScholarConfig {
  orcid?: string;
  openAlexAuthorIds?: string[];
}

export type ProfileProps = {
  name: {
    "zh-CN": string;
    [key: string]: string;
  };
  avatar: string;
  bio: string;
  email: string;
  social?: {
    alias: string;
    link: string;
    openInNewTab?: boolean;
  }[];
  scholar?: ScholarConfig;
};
