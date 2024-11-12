import type { Token } from "../types/Token";
import { generateImgGroups } from "./generateImgGroups";

export function generateImgGallery(galleryToken: Token) {
  if (!galleryToken.children || galleryToken.children.length === 0) return "";
  const tokens = galleryToken.children;
  const galleryName = galleryToken.children[0].content
    .replace(/:::gallery\s?/, "")
    .trim();
  const imgTokens = tokens.filter(token => token.type === "image");

  return `\n<ArcoImageGallery name="${galleryName}" :length="${imgTokens.length}">\n${generateImgGroups(imgTokens)}\n</ArcoImageGallery>\n`;
}
