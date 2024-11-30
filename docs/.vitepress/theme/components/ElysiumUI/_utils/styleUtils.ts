export function parseSize(size: string | number | undefined) {
  if (!size) return null;

  if (typeof size === "number") {
    return size + "px";
  }

  return /^(\d+\.?\d*)$/.test(size + "") ? size + "px" : size;
}

export function parseColor(color: string) {
  const validPrefixes = [
    "#",
    "rgb",
    "hsl",
    "linear-gradient",
    "conic-gradient",
    "radial-gradient",
    "repeating-linear-gradient",
    "repeating-conic-gradient",
    "repeating-radial-gradient",
    "var",
  ];

  return validPrefixes.some(prefix => color.startsWith(prefix))
    ? color
    : `var(${color.startsWith("--") ? color : `--${color}`})`;
}
