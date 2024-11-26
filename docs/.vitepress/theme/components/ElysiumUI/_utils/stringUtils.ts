export function formalizeString(str: string) {
  const shouldDisposeChars = /[\`]/g;
  return str.replaceAll(shouldDisposeChars, "");
}
