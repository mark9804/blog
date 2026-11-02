export type ProfileProps = {
  accent?: string;
  background?: string;
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
  meta?: {
    name: unknown;
    value: unknown;
  }[];
};
