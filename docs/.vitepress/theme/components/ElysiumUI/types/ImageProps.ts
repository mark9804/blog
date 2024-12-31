import type { ImageBase } from "./ImageBase";

export type ImageProps = {
  image: ImageBase[] | ImageBase;
  index?: number;
  lazy?: boolean;
};
