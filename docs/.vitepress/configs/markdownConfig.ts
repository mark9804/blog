import { imgSize } from "@mdit/plugin-img-size";
import { mark } from "@mdit/plugin-mark";
import { ruby } from "@mdit/plugin-ruby";
import { spoiler } from "@mdit/plugin-spoiler";
import { sub } from "@mdit/plugin-sub";
import { sup } from "@mdit/plugin-sup";
import type { Token } from "markdown-it";
import container from "markdown-it-container";
import implicitFigures from "markdown-it-implicit-figures";
import type { MarkdownOptions } from "vitepress";
import { generateImgComponent } from "../theme/utils/generateImgComponent.ts";

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export const markdownConfig: MarkdownOptions = {
  math: true,
  headers: {
    level: [2, 6],
  },
  image: {
    lazyLoad: true,
  },
  lineNumbers: true,
  config: md => {
    md.use(implicitFigures, {
      figcaption: true,
      copyAttrs: "^class$",
    })
      .use(mark)
      .use(ruby)
      .use(spoiler)
      .use(imgSize)
      .use(sub)
      .use(sup);

    // Customize VitePress 2's built-in footnote renderer for hover tooltips and BACK links
    const getFootnoteSubIdSuffix = (tokens: Token[], idx: number): string =>
      (tokens[idx].meta?.subId ?? 0) > 0 ? `:${tokens[idx].meta.subId}` : "";

    md.renderer.rules.footnote_ref = (tokens, idx, options, env, self) => {
      const id = self.rules.footnote_anchor_name!(
        tokens,
        idx,
        options,
        env,
        self
      );
      const caption = self.rules.footnote_caption!(
        tokens,
        idx,
        options,
        env,
        self
      );
      const suffix = getFootnoteSubIdSuffix(tokens, idx);
      return `<FootnoteRef id="${escapeAttr(id)}" caption="${escapeAttr(caption)}" suffix="${escapeAttr(suffix)}" />`;
    };

    md.renderer.rules.footnote_anchor = (tokens, idx, options, env, self) => {
      const id = self.rules.footnote_anchor_name!(
        tokens,
        idx,
        options,
        env,
        self
      );
      const suffix = getFootnoteSubIdSuffix(tokens, idx);
      return ` <a href="#footnote-ref${escapeAttr(id + suffix)}" class="footnote-backref"><sup>BACK</sup></a>`;
    };

    md.renderer.rules.heading_close = (tokens, idx, options, _env, self) => {
      let parsedResult = self.renderToken(tokens, idx, options);
      if (tokens[idx].tag === "h1") {
        parsedResult += `\n<ArticleInfo />\n`;
      }
      return parsedResult;
    };

    md.renderer.rules.image = (tokens, idx) => {
      return generateImgComponent(tokens[idx]);
    };

    // Gallery container
    container(md as unknown as Parameters<typeof container>[0], "gallery", {
      render(tokens: Token[], idx: number): string {
        if (tokens[idx].nesting === 1) {
          const name = tokens[idx].info.trim().slice("gallery".length).trim();
          return `<ElyImageGallery name="${escapeAttr(name)}">\n`;
        }
        return `</ElyImageGallery>\n`;
      },
    });

    // Inject data-formula attribute into mathjax output for click-to-copy
    const origInline = md.renderer.rules.math_inline!;
    md.renderer.rules.math_inline = function (...args) {
      const html = origInline.apply(this, args);
      const formula = escapeAttr(args[0][args[1]].content);
      return html.replace(
        /^<mjx-container /,
        `<mjx-container data-formula="${formula}" `
      );
    };

    const origBlock = md.renderer.rules.math_block!;
    md.renderer.rules.math_block = function (...args) {
      const html = origBlock.apply(this, args);
      const formula = escapeAttr(args[0][args[1]].content);
      return html.replace(
        /^<mjx-container /,
        `<mjx-container data-formula="${formula}" `
      );
    };
  },
};
