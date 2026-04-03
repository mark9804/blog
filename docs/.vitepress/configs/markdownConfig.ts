import implicitFigures from "markdown-it-implicit-figures";
import { mark } from "@mdit/plugin-mark";
import { ruby } from "@mdit/plugin-ruby";
import { spoiler } from "@mdit/plugin-spoiler";
import { imgSize } from "@mdit/plugin-img-size";
import { sub } from "@mdit/plugin-sub";
import { sup } from "@mdit/plugin-sup";
import { generateImgComponent } from "../theme/utils/generateImgComponent";
import container from "markdown-it-container";
import * as MarkdownIt from "markdown-it";
import type { MarkdownOptions } from "vitepress";
import type { Token } from "../theme/types/Token";
import { footnote } from "../plugins/mdit-plugins-footnote";

interface MarkdownItRenderer {
  renderToken: (
    tokens: Token[],
    idx: number,
    options: MarkdownIt.Options
  ) => string;
}

export const markdownConfig: MarkdownOptions = {
  math: true,
  headers: {
    level: [2, 6],
  },
  image: {
    lazyLoading: true,
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
      .use(sup)
      .use(footnote);

    md.renderer.rules.heading_close = (
      tokens: Token[],
      idx: number,
      // @ts-ignore
      options: MarkdownIt.Options,
      env: Record<string, unknown>,
      self: MarkdownItRenderer
    ) => {
      let parsedResult = self.renderToken(tokens, idx, options);
      if (tokens[idx].tag === "h1") {
        parsedResult += `\n<ArticleInfo />\n`;
      }
      return parsedResult;
    };

    md.renderer.rules.image = (tokens: Token[], idx: number) => {
      return generateImgComponent(tokens[idx]);
    };

    // Gallery container
    md.use(container, "gallery", {
      render(tokens: Token[], idx: number) {
        if (tokens[idx].nesting === 1) {
          const name = tokens[idx].info.trim().slice("gallery".length).trim();
          return `<ElyImageGallery name="${name}">\n`;
        }
        return `</ElyImageGallery>\n`;
      },
    });

    // Inject data-formula attribute into mathjax output for click-to-copy
    const escapeAttr = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

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
