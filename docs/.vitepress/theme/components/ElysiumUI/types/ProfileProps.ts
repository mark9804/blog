export type ProfileProps = {
  accent?: string;
  background?: string;
  name: string;
  avatar: string;
  bio: string;
  email: string;
  social?: {
    alias: string;
    link: string;
  }[];
};
