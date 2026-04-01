import implicitFigures from "markdown-it-implicit-figures";
import { mark } from "@mdit/plugin-mark";
import { ruby } from "@mdit/plugin-ruby";
import { spoiler } from "@mdit/plugin-spoiler";
import { imgSize } from "@mdit/plugin-img-size";
import { sub } from "@mdit/plugin-sub";
import { sup } from "@mdit/plugin-sup";
// import { footnote } from "@mdit/plugin-footnote";
import { generateImgComponent } from "../theme/utils/generateImgComponent";
// @ts-ignore no type definitions
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

    // Gallery container: just output open/close Vue component tags.
    // Inner images render normally as <ElyImage> via the image rule above.
    // Vue's slot mechanism handles the composition.
    md.use(container, "gallery", {
      render(tokens: Token[], idx: number) {
        if (tokens[idx].nesting === 1) {
          const name = tokens[idx].info.trim().slice("gallery".length).trim();
          return `<ElyImageGallery name="${name}">\n`;
        }
        return `</ElyImageGallery>\n`;
      },
    });
  },
};
