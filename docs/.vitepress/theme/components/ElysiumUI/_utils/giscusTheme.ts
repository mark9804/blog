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
  const tabHoverBg = `color-mix(in srgb,${t.paper} 55%,${washSoft})`;
  const plateWash = `color-mix(in srgb,${t.pigment} 36%,${t.wash})`;

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
    // Punch active Write/Preview tab down to paper (exclude .gsc-toolbar-item on the right)
    `.gsc-comment-box-tabs button:not(.gsc-toolbar-item):not(.border-transparent){position:relative;background-color:${t.paper}!important;border-color:${t.border200}!important;color:${t.ink}!important;font-weight:600;box-shadow:none!important}`,
    `.gsc-comment-box-tabs button:not(.gsc-toolbar-item):not(.border-transparent)::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:2px;background-color:${t.paper};pointer-events:none}`,
    `.gsc-comment-box-tabs button:not(.gsc-toolbar-item).border-transparent{color:${t.text3}!important;transition:background-color .2s ease,color .2s ease}`,
    `.gsc-comment-box-tabs button:not(.gsc-toolbar-item).border-transparent:hover{background-color:${tabHoverBg}!important;color:${t.ink}!important}`,
    // Replace cryptic "Aa" icon with left "等宽字体" label + right-aligned square switch matching textarea edge (.5rem)
    `.gsc-comment-box-md-toolbar{margin:0 .5rem!important;display:inline-flex;align-items:center}`,
    `.gsc-toolbar-item{display:inline-flex!important;align-items:center;gap:6px;padding:4px 0 4px 6px!important;background:transparent!important;border:0!important;box-shadow:none!important;cursor:pointer;user-select:none}`,
    `.gsc-toolbar-item svg{display:none!important}`,
    `.gsc-toolbar-item::before{content:"等宽字体";font-size:12px;font-weight:500;line-height:1;color:${t.text3};transition:color .2s ease}`,
    `.gsc-toolbar-item:hover::before,.gsc-comment-box:has(.gsc-is-fixed-width) .gsc-toolbar-item::before{color:${t.ink}}`,
    `.gsc-toolbar-item::after{content:"";display:inline-block;box-sizing:border-box;width:26px;height:14px;border:1px solid ${t.border300};background-color:${t.paper};background-image:linear-gradient(${t.text3},${t.text3});background-repeat:no-repeat;background-size:8px 8px;background-position:2px 2px;transition:background-position .2s cubic-bezier(.22,1,.36,1),background-color .2s ease,border-color .2s ease}`,
    `.gsc-toolbar-item:hover::after{border-color:${t.border500}}`,
    `.gsc-comment-box:has(.gsc-is-fixed-width) .gsc-toolbar-item::after{background-color:${t.accent};border-color:${t.accent};background-image:linear-gradient(${t.paper},${t.paper});background-position:14px 2px}`,
    `.gsc-comment-box-textarea.gsc-is-fixed-width{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace!important}`,
    `.gsc-comment-box-textarea:focus{border-color:${t.border500}!important;box-shadow:none!important;outline:none!important}`,
    // Replace internal Giscus spinner with our exact off-register alternating block loader
    `main .gsc-loading{padding:24px 0;gap:12px}`,
    `main .gsc-loading-text{font-size:12px;letter-spacing:.08em;color:${t.text3}!important}`,
    `main .gsc-loading-image{position:relative;width:40px!important;height:40px!important;background-color:transparent!important;background-image:linear-gradient(${t.border300},${t.border300}),linear-gradient(${t.border300},${t.border300}),linear-gradient(${t.border300},${t.border300}),linear-gradient(${t.border300},${t.border300})!important;background-repeat:no-repeat!important;background-position:0 6px,6px 0,18px 33px,33px 18px!important;background-size:34px 1px,1px 34px,22px 1px,1px 22px!important}`,
    `main .gsc-loading-image::before{content:"";position:absolute;inset:9px;background-color:${plateWash};animation:gsc-plate-wash 2.4s cubic-bezier(.65,0,.35,1) infinite}`,
    `main .gsc-loading-image::after{content:"";position:absolute;inset:9px;border:1px solid ${t.accent};background:linear-gradient(${t.ink},${t.ink}) 3px 3px/8px 8px no-repeat;animation:gsc-plate-ink 2.4s cubic-bezier(.65,0,.35,1) infinite}`,
    `@keyframes gsc-plate-wash{0%,100%{transform:translate3d(5px,5px,0)}25%{transform:translate3d(-5px,5px,0)}50%{transform:translate3d(-5px,-5px,0)}75%,82%{transform:translate3d(0,0,0)}}`,
    `@keyframes gsc-plate-ink{0%,100%{transform:translate3d(-3px,-3px,0)}25%{transform:translate3d(3px,-3px,0)}50%{transform:translate3d(3px,3px,0)}75%,82%{transform:translate3d(0,0,0)}}`,
    `@media (prefers-reduced-motion:reduce){main .gsc-loading-image::before{animation:none!important;transform:translate3d(3px,3px,0)!important}main .gsc-loading-image::after{animation:none!important;transform:none!important}}`,
  ].join("");

  return `data:text/css;charset=utf-8,${encodeURIComponent(css)}`;
}
