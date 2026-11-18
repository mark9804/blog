export interface TooltipProps {
  content?: string;
  position?: "top" | "right" | "bottom" | "left" | "tl" | "tr" | "bl" | "br";
  sideOffset?: number;
  disableHoverableContent?: boolean;
  /** Allow delayed closing in ms, default is 0 */
  closeDelay?: number;
}
