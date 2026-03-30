import implicitFigures from "markdown-it-implicit-figures";
import { mark } from "@mdit/plugin-mark";
import { ruby } from "@mdit/plugin-ruby";
import { spoiler } from "@mdit/plugin-spoiler";
import { imgSize } from "@mdit/plugin-img-size";
import { sub } from "@mdit/plugin-sub";
import { sup } from "@mdit/plugin-sup";
// import { footnote } from "@mdit/plugin-footnote";
import { generateImgComponent } from "../theme/utils/generateImgComponent";
import { generateImgGallery } from "../theme/utils/generateImgGallery";
// @ts-ignore no type definitions
import container from "markdown-it-container";
import type MarkdownIt from "markdown-it";
import type { Token } from "../theme/types/Token";
import { footnote } from "../../../plugins/mdit-plugins-footnote";

interface MarkdownItRenderer {
  renderToken: (
    tokens: Token[],
    idx: number,
    // @ts-ignore
    options: MarkdownIt.Options
  ) => string;
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

    // Register gallery as a proper container block.
    // markdown-it-container handles :::gallery ... ::: pairing at the
    // block level, so nesting inside :::details etc. works correctly.
    md.use(container, "gallery", {
      render(tokens: Token[], idx: number) {
        const token = tokens[idx];
        if (token.nesting !== 1) return "";

        // Extract gallery name from info string
        const galleryName = token.info.trim().slice("gallery".length).trim();

        // Collect all image tokens between open and close
        const imageTokens: Token[] = [];
        for (
          let j = idx + 1;
          j < tokens.length &&
          !(
            tokens[j].nesting === -1 &&
            tokens[j].type === "container_gallery_close"
          );
          j++
        ) {
          if (tokens[j].type === "inline" && tokens[j].children) {
            for (const child of tokens[j].children!) {
              if (child.type === "image") imageTokens.push(child);
            }
          }
        }

        return generateImgGallery({ imageTokens, galleryName });
      },
    });
  },
};
