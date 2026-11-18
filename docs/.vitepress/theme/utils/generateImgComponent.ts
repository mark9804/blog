import type { Token } from "markdown-it";
import type { ImageBase } from "../components/ElysiumUI/types/ImageBase.ts";

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function getImgInfo(imgToken: Token): ImageBase {
  return {
    src: imgToken.attrGet("src") ?? "",
    alt: imgToken.content ?? "",
    width: imgToken.attrGet("width") ?? undefined,
    height: imgToken.attrGet("height") ?? undefined,
  };
}

export function generateImgComponent(imgToken: Token): string {
  const image = getImgInfo(imgToken);
  return `<ElyImage :image="${escapeHtmlAttr(JSON.stringify(image))}" lazy />`;
}
