export function formalizeString(str: string) {
  const shouldDisposeChars = /`/g;
  // @ts-ignore: 消不掉 replaceAll 错误，但我觉得我没有错
  return str.replaceAll(shouldDisposeChars, "");
}
