export type SpaceProps = {
  align?: "start" | "end" | "center" | "baseline" | "stretch";
  justify?: "start" | "end" | "center" | "between";
  direction?: "horizontal" | "vertical";
  vertical?: boolean;
  size?: "mini" | "small" | "medium" | "large" | number;
  wrap?: boolean;
  wide?: boolean;
  divider?: string;
};
