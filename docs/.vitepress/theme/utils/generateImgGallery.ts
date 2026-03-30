import type { Token } from "../types/Token";
import { getImgInfo } from "./generateImgComponent";

export function generateImgGallery(galleryToken: Token) {
  const imageTokens: Token[] = galleryToken.meta?.imageTokens ?? [];
  if (imageTokens.length === 0) return "";

  const galleryName = galleryToken.content || "";
  const imgList = imageTokens.map(getImgInfo);

  return `\n<ElyImageGallery name="${galleryName}" :imgList="${JSON.stringify(
    imgList
  )
    // @ts-ignore
    .replaceAll('"', "'")}" />\n`;
}
