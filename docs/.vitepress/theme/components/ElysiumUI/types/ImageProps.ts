import type { ImageBase } from "./ImageBase";

export type ImageProps = {
  image: ImageBase;
  lazy?: boolean;
  previewable?: boolean;
  galleryIndex?: number;
};
