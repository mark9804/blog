export function isExternalUrl(url: string): boolean {
  if (!url) return false;

  // 绝对路径、相对路径、锚点
  if (url.startsWith("/") || url.startsWith(".") || url.startsWith("#")) {
    return false;
  }

  // 协议相对路径、绝对路径
  if (
    url.startsWith("//") ||
    url.startsWith("http://") ||
    url.startsWith("https://")
  ) {
    try {
      const urlStr = url.startsWith("//") ? `https:${url}` : url;
      const urlObj = new URL(urlStr);

      // SSR 环境无法验证域名，默认是外部链接
      if (typeof window !== "undefined") {
        const currentHost = window.location.hostname;
        return urlObj.hostname !== currentHost;
      }
      return true;
    } catch {
      return false;
    }
  }

  if (/^[a-z]+:/.test(url)) {
    return true;
  }

  const fileExtensions =
    /\.(md|html|png|jpg|jpeg|gif|svg|webp|vue|js|ts|css|json|pdf|xml|rss|txt)$/i;

  if (fileExtensions.test(url)) {
    return false;
  }

  if (url.includes(".") && !url.includes(" ")) {
    return true;
  }

  return false;
}
