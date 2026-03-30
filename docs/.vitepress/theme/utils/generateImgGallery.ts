import type { Token } from "../types/Token";
import { getImgInfo } from "./generateImgComponent";

interface GalleryInput {
  imageTokens: Token[];
  galleryName: string;
}

export function generateImgGallery({ imageTokens, galleryName }: GalleryInput) {
  if (imageTokens.length === 0) return "";

  const imgList = imageTokens.map(getImgInfo);

  return `\n<ElyImageGallery name="${galleryName}" :imgList="${JSON.stringify(
    imgList
  )
    // @ts-ignore
    .replaceAll('"', "'")}" />\n`;
}
