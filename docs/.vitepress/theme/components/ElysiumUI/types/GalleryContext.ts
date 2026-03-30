import type { InjectionKey } from "vue";
import type { ImageBase } from "./ImageBase";

export interface GalleryContext {
  images: ImageBase[];
  registerImage: (image: ImageBase) => number;
}

export const GALLERY_INJECTION_KEY: InjectionKey<GalleryContext> =
  Symbol("gallery-context");
