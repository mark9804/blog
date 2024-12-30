import type { Token } from "../types/Token";

export function getImgInfo(imgToken: Token) {
  const src = imgToken?.attrs?.find(attr => attr[0] === "src")?.[1];
  const alt = imgToken.content;
  const width = imgToken?.attrs?.find(attr => attr[0] === "width")?.[1];
  const height = imgToken?.attrs?.find(attr => attr[0] === "height")?.[1];
  return { src, alt, width, height };
}

export function generateImgComponent(imgToken: Token) {
  const { src, alt, width, height } = getImgInfo(imgToken);

  const widthProps = width ? ` width="${width}"` : "";
  const heightProps = height ? ` height="${height}"` : "";

  return `<ElyImage src="${src}" alt="${alt}"${widthProps}${heightProps} />`;
}
