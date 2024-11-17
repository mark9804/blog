export type TagProps = {
  id?: string;
  active?: boolean;
  clickable?: boolean;
  closable?: boolean;
  disabled?: boolean;
  size?: "mini" | "small" | "medium" | "large";

  // Colors
  primary?: boolean;
  secondary?: boolean;
};
