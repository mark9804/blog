import type { Token } from "../types/Token";
import type { ImageBase } from "../components/ElysiumUI/types/ImageBase";

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

  const image: ImageBase = {
    src,
    alt,
    width: widthProps,
    height: heightProps,
  };

  return `<ElyImage :image="${JSON.stringify(image).replaceAll('"', "'")}" />`;
}
