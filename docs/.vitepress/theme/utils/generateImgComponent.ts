import type { Token } from "../../../src/types/Token";

export function generateImgComponent(imgToken: Token) {
  const src = imgToken.attrs.find(attr => attr[0] === "src")?.[1];
  const alt = imgToken.content;
  const width = imgToken.attrs.find(attr => attr[0] === "width")?.[1];
  const height = imgToken.attrs.find(attr => attr[0] === "height")?.[1];

  const widthProps = width ? ` width="${width}"` : "";
  const heightProps = height ? ` height="${height}"` : "";

  return `\n<ArcoImage src="${src}" alt="${alt}"${widthProps}${heightProps} show-loader />\n`;
}
