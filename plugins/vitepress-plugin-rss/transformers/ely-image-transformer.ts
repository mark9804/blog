export function elyImageTransformer(content: string): string {
  // 匹配 ElyImage 组件的正则表达式，width 和 height 为可选属性
  const regex =
    /<ElyImage :image="\{\'src\':\'(.*?)\',\'alt\':\'(.*?)\'(?:,\'width\':\'(\d+px)\')?(?:,\'height\':\'(\d+px)\')?\}" lazy \/>/g;

  // 替换为标准 img 标签，如果存在 width 和 height 则添加这些属性
  return content.replace(regex, (_, src, alt, width, height) => {
    const widthAttr = width ? ` width="${width}"` : "";
    const heightAttr = height ? ` height="${height}"` : "";
    return `<img src="${src}" alt="${alt}"${widthAttr}${heightAttr} />`;
  });
}
