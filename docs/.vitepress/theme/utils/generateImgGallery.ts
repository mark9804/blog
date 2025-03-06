import type { Token } from "../types/Token";
import { getImgInfo } from "./generateImgComponent";

export function generateImgGallery(galleryToken: Token) {
  if (!galleryToken.children || galleryToken.children.length === 0) return "";
  const tokens = galleryToken.children;
  const galleryName = galleryToken.children[0].content
    .replace(/:::gallery\s?/, "")
    .trim();
  const imgList = tokens
    .filter(token => token.type === "image")
    .map(getImgInfo);

  return `\n<ElyImageGallery name="${galleryName}" :imgList="${JSON.stringify(
    imgList
  )
    // @ts-ignore
    .replaceAll('"', "'")}" />\n`;
}
