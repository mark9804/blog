import type { ComputedRef, InjectionKey } from "vue";
import type { ImageBase } from "./ImageBase";

export interface GalleryContext {
  images: ComputedRef<ImageBase[]>;
}

export const GALLERY_INJECTION_KEY: InjectionKey<GalleryContext> =
  Symbol("gallery-context");
