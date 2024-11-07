import type { Token } from "../../../src/types/Token";
import { generateImgComponent } from "./generateImgComponent";

export function generateImgGallery(galleryToken: Token) {
  if (!galleryToken.children || galleryToken.children.length === 0) return "";
  const tokens = galleryToken.children;
  const galleryName = galleryToken.children[0].content
    .replace(/:::gallery\s?/, "")
    .trim();
  const imgTokens = tokens.filter(token => token.type === "image");

  return `\n<ArcoImageGallery name="${galleryName}">\n${imgTokens.map(generateImgComponent).join("")}\n</ArcoImageGallery>\n`;
}
