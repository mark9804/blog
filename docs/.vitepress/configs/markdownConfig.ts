// @ts-ignore
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

export const markdownConfig = {
  math: true,
  headers: {
    level: [2, 6],
  },
  image: {
    lazyLoading: true,
  },
  config: (md: any) => {
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
      tokens: any,
      idx: any,
      options: any,
      env: any,
      self: any
    ) => {
      let parsedResult = self.renderToken(tokens, idx, options);
      if (tokens[idx].tag === "h1") {
        parsedResult += `\n<ClientOnly>\n<ArticleInfo />\n</ClientOnly>\n`;
      }
      return parsedResult;
    };

    md.renderer.rules.image = (tokens: any, idx: any) => {
      return generateImgComponent(tokens[idx]);
    };

    md.core.ruler.push("gallery", (state: any) => {
      state.tokens.forEach((token: any, idx: any) => {
        if (token?.content?.includes(":::gallery")) {
          if (state.tokens[idx].type === "fence") return true;
          state.tokens[idx].type = "gallery";
        }
      });
      return true;
    });

    md.renderer.rules.gallery = (tokens: any, idx: any) => {
      return generateImgGallery(tokens[idx]);
    };
  },
};
