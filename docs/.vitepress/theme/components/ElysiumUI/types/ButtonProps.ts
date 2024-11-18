export type ButtonProps = {
  as?: "link" | "button";
  active?: boolean;
  disabled?: boolean;
  size?: "mini" | "small" | "medium" | "large";
  bordered?: boolean;
  wide?: boolean;
  loading?: boolean;
  /* 按钮类型 */
  primary?: boolean;
  secondary?: boolean;
  text?: boolean;
  href?: string;
};
