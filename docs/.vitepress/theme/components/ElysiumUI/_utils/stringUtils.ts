export function formalizeString(str: string | undefined) {
  if (!str) return "";
  const shouldDisposeChars = /`/g;
  // @ts-ignore: 消不掉 replaceAll 错误，但我觉得我没有错
  return str.replaceAll(shouldDisposeChars, "");
}
