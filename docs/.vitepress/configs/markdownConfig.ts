import implicitFigures from "markdown-it-implicit-figures";
import { mark } from "@mdit/plugin-mark";
import { ruby } from "@mdit/plugin-ruby";
import { spoiler } from "@mdit/plugin-spoiler";
import { imgSize } from "@mdit/plugin-img-size";
import { sub } from "@mdit/plugin-sub";
import { sup } from "@mdit/plugin-sup";
import { footnote } from "@mdit/plugin-footnote";
import { generateImgComponent } from "../theme/utils/generateImgComponent";
import { generateImgGallery } from "../theme/utils/generateImgGallery";
import type MarkdownIt from "markdown-it";
import type { Token } from "../theme/types/Token";

interface MarkdownItRenderer {
  renderToken: (
    tokens: Token[],
    idx: number,
    options: MarkdownIt.Options
  ) => string;
}

interface MarkdownItState {
  tokens: Token[];
}

export const markdownConfig = {
  math: true,
  headers: {
    level: [2, 6],
  },
  image: {
    lazyLoading: true,
  },
  lineNumbers: true,
  config: (md: MarkdownIt) => {
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

    md.core.ruler.push("gallery", (state: MarkdownItState) => {
      state.tokens.forEach((token: Token, idx: number) => {
        if (token?.content?.includes(":::gallery")) {
          if (state.tokens[idx].type === "fence") return true;
          state.tokens[idx].type = "gallery";
        }
      });
      return true;
    });

    md.renderer.rules.gallery = (tokens: Token[], idx: number) => {
      return generateImgGallery(tokens[idx]);
    };
  },
};
