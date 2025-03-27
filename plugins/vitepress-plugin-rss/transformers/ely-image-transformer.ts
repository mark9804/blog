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

export function elyImageGalleryTransformer(content: string): string {
  // 匹配 ElyImageGallery 组件的正则表达式
  const regex = /<ElyImageGallery name="(.*?)" :imgList="(\[.*?\])" \/>/g;

  return content.replace(regex, (match, name, imgListStr) => {
    try {
      // 将字符串转换为可解析的JSON格式
      const jsonStr = imgListStr.replace(/'/g, '"');
      const imgList = JSON.parse(jsonStr);

      // 生成图片标签集合
      const imgTags = imgList
        .map((img: { src: string; alt: string }) => {
          return `<img src="${img.src}" alt="${img.alt || name}" />`;
        })
        .join("\n");

      // 添加一个包装div，包含图集名称和所有图片
      return `<div class="image-gallery">
  ${!!name ? "<h4>" + name + "</h4>" : ""}
  ${imgTags}
</div>`;
    } catch (error) {
      console.error("Error parsing ElyImageGallery:", error);
      return match; // 如果解析失败，保留原始标签
    }
  });
}

// 组合转换器函数，按顺序应用所有转换器
export function applyAllImageTransformers(content: string): string {
  let transformedContent = content;
  transformedContent = elyImageTransformer(transformedContent);
  transformedContent = elyImageGalleryTransformer(transformedContent);
  return transformedContent;
}
