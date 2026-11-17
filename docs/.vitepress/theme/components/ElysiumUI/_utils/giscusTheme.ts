// Dynamically generates a self-contained Giscus theme data URI from live root CSS tokens.
// Because data URIs require zero network/CORS requests and read computed OKLCH variables,
// changing $accent in theme.scss automatically re-themes Giscus in both Light and Dark modes.

interface ResolvedGiscusTokens {
  paper: string;
  card: string;
  wash: string;
  pigment: string;
  ink: string;
  accent: string;
  text2: string;
  text3: string;
  code: string;
  border200: string;
  border300: string;
  border500: string;
}

function readRootTokens(isDark: boolean): ResolvedGiscusTokens {
  const style = getComputedStyle(document.documentElement);
  const pick = (name: string, fallback: string) =>
    style.getPropertyValue(name).trim() || fallback;

  return {
    paper: pick("--gouache-paper", isDark ? "#0c1218" : "#f9f8f6"),
    card: pick("--gouache-card", isDark ? "#192029" : "#e9ecee"),
    wash: pick("--gouache-wash", isDark ? "#242d39" : "#d7e3f1"),
    pigment: pick("--gouache-pigment", isDark ? "#657992" : "#7a91ae"),
    ink: pick("--gouache-ink", isDark ? "#ebeae8" : "#13181e"),
    accent: pick("--color-accent", isDark ? "#9eb3cd" : "#374c65"),
    text2: pick(
      "--color-accent-text-secondary",
      isDark ? "#b1b8c0" : "#414852"
    ),
    text3: pick("--color-accent-text-tertiary", isDark ? "#8a9097" : "#5f656e"),
    code: pick("--color-accent-code", isDark ? "#9bbee8" : "#20436d"),
    border200: pick(
      "--color-accent-border-200",
      isDark ? "rgba(158,179,205,0.2)" : "rgba(55,76,101,0.2)"
    ),
    border300: pick(
      "--color-accent-border-300",
      isDark ? "rgba(158,179,205,0.3)" : "rgba(55,76,101,0.3)"
    ),
    border500: pick(
      "--color-accent-border-500",
      isDark ? "rgba(158,179,205,0.5)" : "rgba(55,76,101,0.5)"
    ),
  };
}

export function buildGiscusThemeDataUri(isDark: boolean): string {
  if (typeof document === "undefined") {
    return isDark ? "transparent_dark" : "light";
  }

  const t = readRootTokens(isDark);
  const washPlane = `color-mix(in srgb,${t.wash} 72%,${t.paper})`;
  const washSoft = `color-mix(in srgb,${t.wash} 42%,${t.paper})`;

  const syntax = isDark
    ? `--color-prettylights-syntax-comment:${t.text3};--color-prettylights-syntax-constant:${t.code};--color-prettylights-syntax-entity:#c5b4e3;--color-prettylights-syntax-storage-modifier-import:${t.ink};--color-prettylights-syntax-entity-tag:#8fc7a3;--color-prettylights-syntax-keyword:#e58b88;--color-prettylights-syntax-string:${t.code};--color-prettylights-syntax-variable:#e2a97e;`
    : `--color-prettylights-syntax-comment:${t.text3};--color-prettylights-syntax-constant:${t.code};--color-prettylights-syntax-entity:#5b4b8a;--color-prettylights-syntax-storage-modifier-import:${t.ink};--color-prettylights-syntax-entity-tag:#256347;--color-prettylights-syntax-keyword:#9e3333;--color-prettylights-syntax-string:${t.code};--color-prettylights-syntax-variable:#8a4f24;`;

  const css = [
    `@import url("https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,500..600&family=Noto+Serif+SC:wght@500;600&display=swap");`,
    `main{`,
    syntax,
    `--color-btn-text:${t.ink};`,
    `--color-btn-bg:${washSoft};`,
    `--color-btn-border:${t.border200};`,
    `--color-btn-shadow:0 0 transparent;`,
    `--color-btn-inset-shadow:0 0 transparent;`,
    `--color-btn-hover-bg:${t.wash};`,
    `--color-btn-hover-border:${t.border500};`,
    `--color-btn-active-bg:${t.wash};`,
    `--color-btn-active-border:${t.border500};`,
    `--color-btn-selected-bg:${t.wash};`,
    `--color-btn-primary-text:${t.paper};`,
    `--color-btn-primary-bg:${t.ink};`,
    `--color-btn-primary-border:${t.ink};`,
    `--color-btn-primary-shadow:0 0 transparent;`,
    `--color-btn-primary-inset-shadow:0 0 transparent;`,
    `--color-btn-primary-hover-bg:${t.accent};`,
    `--color-btn-primary-hover-border:${t.accent};`,
    `--color-btn-primary-selected-bg:${t.accent};`,
    `--color-btn-primary-disabled-text:${t.text3};`,
    `--color-btn-primary-disabled-bg:${washSoft};`,
    `--color-btn-primary-disabled-border:${t.border200};`,
    `--color-action-list-item-default-hover-bg:${t.wash};`,
    `--color-segmented-control-bg:${washSoft};`,
    `--color-segmented-control-button-bg:${t.paper};`,
    `--color-segmented-control-button-selected-border:${t.border300};`,
    `--color-fg-default:${t.ink};`,
    `--color-fg-muted:${t.text2};`,
    `--color-fg-subtle:${t.text3};`,
    `--color-canvas-default:transparent;`,
    `--color-canvas-overlay:${t.paper};`,
    `--color-canvas-inset:${t.paper};`,
    `--color-canvas-subtle:${washSoft};`,
    `--color-border-default:${t.border200};`,
    `--color-border-muted:${t.border200};`,
    `--color-neutral-muted:${washSoft};`,
    `--color-accent-fg:${t.accent};`,
    `--color-accent-emphasis:${t.accent};`,
    `--color-accent-muted:${t.border300};`,
    `--color-accent-subtle:${washSoft};`,
    `--color-success-fg:${t.accent};`,
    `--color-attention-fg:#9a6700;`,
    `--color-danger-fg:#c44343;`,
    `--color-primer-shadow-inset:0 0 transparent;`,
    `--color-social-reaction-bg-hover:${t.wash};`,
    `--color-social-reaction-bg-reacted-hover:${t.wash};`,
    `font-family:"Wix Madefor","HarmonyOS Sans SC","PingFang SC",-apple-system,system-ui,sans-serif;`,
    `color-scheme:${isDark ? "dark" : "light"};`,
    `}`,
    // Reserve right/bottom margin inside iframe so (4px, 4px) off-register planes are never clipped
    `.gsc-main{padding:2px 6px 8px 0}`,
    // Enforce crisp 0px architectural geometry across every element inside Giscus
    `main *,main *::before,main *::after{border-radius:0!important}`,
    // Frame comment composer, comment cards & popovers with 1px line + (4px, 4px) off-register gouache plane
    `.gsc-comment-box,.gsc-comment>:first-child{background-color:${t.paper}!important;border:1px solid ${t.border200}!important;box-shadow:4px 4px 0 0 ${washPlane}!important}`,
    `.gsc-reactions-popover{background-color:${t.paper}!important;border:1px solid ${t.border300}!important;box-shadow:4px 4px 0 0 ${t.wash}!important}`,
    `.gsc-replies{background-color:${washSoft}!important;border-top:1px solid ${t.border200}!important}`,
    `.gsc-comment-author-avatar img,.gsc-reply-author-avatar img{border:1px solid ${t.border300}}`,
    // Editorial Serif count heading & clean reaction chips
    `.gsc-comments-count{font-family:"Newsreader","Noto Serif SC",Georgia,serif;font-weight:600;letter-spacing:0.02em}`,
    `.gsc-social-reaction-summary-item,.gsc-reactions-button,.gsc-direct-reaction-button{background-color:${washSoft};border-color:${t.border200};padding:0 8px;transition:background-color .2s ease,border-color .2s ease}`,
    `.gsc-social-reaction-summary-item.has-reacted{background-color:${t.wash};border-color:${t.accent};color:${t.accent}}`,
    `.gsc-comment-box-textarea:focus{border-color:${t.border500}!important;box-shadow:none!important;outline:none!important}`,
    // Replace GitHub cartoon octocat loader with a crisp circular ring (override 0px radius)
    `main .gsc-loading-image{background-image:none!important;width:24px;height:24px;border-radius:50%!important;border:1.5px solid ${t.border200};border-top-color:${t.accent};animation:gsc-spin .85s linear infinite}`,
    `@keyframes gsc-spin{to{transform:rotate(360deg)}}`,
  ].join("");

  return `data:text/css;base64,${btoa(css)}`;
}
