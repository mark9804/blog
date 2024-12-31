import type { ImageBase } from "../components/ElysiumUI/types/ImageBase";
export interface ImagePreviewConfig {
  show: boolean;
  image: ImageBase[] | ImageBase;
  index?: number;
}
