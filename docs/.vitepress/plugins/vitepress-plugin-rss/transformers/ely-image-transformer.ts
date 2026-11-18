import { decodeHTML } from "entities";
import type { ImageBase } from "../../../theme/components/ElysiumUI/types/ImageBase.ts";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeHtmlAttr(value: string): string {
  return escapeHtml(value).replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function extractAttr(attrs: string, name: string): string | undefined {
  const doubleQuoted = new RegExp(`(?:^|\\s)${name}="([^"]*)"`).exec(attrs);
  if (doubleQuoted) return decodeHTML(doubleQuoted[1]);

  const singleQuoted = new RegExp(`(?:^|\\s)${name}='([^']*)'`).exec(attrs);
  if (singleQuoted) return decodeHTML(singleQuoted[1]);

  return undefined;
}

function parseElyImagePayload(rawAttr: string): ImageBase | null {
  try {
    return JSON.parse(rawAttr) as ImageBase;
  } catch {
    try {
      return JSON.parse(rawAttr.replace(/'/g, '"')) as ImageBase;
    } catch {
      return null;
    }
  }
}

export function stripArticleInfoTransformer(content: string): string {
  return content.replace(
    /<ArticleInfo\b[^>]*?(?:\/>|>[\s\S]*?<\/ArticleInfo>)/g,
    ""
  );
}

export function footnoteRefTransformer(content: string): string {
  return content.replace(
    /<FootnoteRef\b([^>]*?)\/>/g,
    (match, attrs: string) => {
      const id = extractAttr(attrs, "id");
      if (!id) return match;

      const caption = extractAttr(attrs, "caption") ?? id;
      const suffix = extractAttr(attrs, "suffix") ?? "";
      const label = caption.startsWith("[")
        ? escapeHtml(caption)
        : `[${escapeHtml(caption)}]`;
      const anchorId = escapeHtmlAttr(`footnote-ref${id}${suffix}`);
      const href = escapeHtmlAttr(`#footnote${id}`);

      return `<sup class="footnote-ref"><a id="${anchorId}" href="${href}">${label}</a></sup>`;
    }
  );
}

export function elyImageTransformer(content: string): string {
  return content.replace(/<ElyImage\b([^>]*?)\/?>/g, (match, attrs: string) => {
    const rawImage = extractAttr(attrs, ":image");
    if (!rawImage) return match;

    const image = parseElyImagePayload(rawImage);
    if (!image?.src) return match;

    const srcAttr = ` src="${escapeHtmlAttr(image.src)}"`;
    const altAttr = ` alt="${escapeHtmlAttr(image.alt ?? "")}"`;
    const widthAttr = image.width
      ? ` width="${escapeHtmlAttr(String(image.width))}"`
      : "";
    const heightAttr = image.height
      ? ` height="${escapeHtmlAttr(String(image.height))}"`
      : "";

    return `<img${srcAttr}${altAttr}${widthAttr}${heightAttr} />`;
  });
}

export function elyImageGalleryTransformer(content: string): string {
  return content.replace(
    /<ElyImageGallery\b([^>]*)>([\s\S]*?)<\/ElyImageGallery>/g,
    (_, attrs: string, innerHtml: string) => {
      const name = extractAttr(attrs, "name")?.trim() ?? "";
      const body = innerHtml.trim();
      const captionHtml = name
        ? `\n  <figcaption>${escapeHtml(name)}</figcaption>`
        : "";
      return `<figure class="image-gallery">\n  ${body}${captionHtml}\n</figure>`;
    }
  );
}

export function applyAllImageTransformers(content: string): string {
  let transformed = content;
  transformed = stripArticleInfoTransformer(transformed);
  transformed = footnoteRefTransformer(transformed);
  transformed = elyImageTransformer(transformed);
  transformed = elyImageGalleryTransformer(transformed);
  return transformed;
}
