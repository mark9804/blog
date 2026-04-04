export interface TooltipProps {
  content?: string;
  position?: "top" | "right" | "bottom" | "left" | "tl" | "tr" | "bl" | "br";
  sideOffset?: number;
  defaultOpen?: boolean;
  open?: boolean;
  disableHoverableContent?: boolean;
  /** Allow delayed closing, default is 0 */
  closeDelay?: number;
}
