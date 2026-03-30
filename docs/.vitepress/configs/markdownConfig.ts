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

interface MarkdownItState {
  tokens: Token[];
  Token: new (type: string, tag: string, nesting: number) => Token;
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

    md.core.ruler.push("gallery", (state: MarkdownItState) => {
      const tokens = state.tokens;
      let i = 0;
      while (i < tokens.length) {
        if (
          tokens[i].type !== "inline" ||
          !tokens[i].content?.startsWith(":::gallery")
        ) {
          i++;
          continue;
        }

        // Skip if inside a fence block (code block)
        if (i > 0 && tokens[i - 1].type === "fence") {
          i++;
          continue;
        }

        // Extract gallery name from the first line only
        const firstLine = tokens[i].content.split("\n")[0];
        const galleryName = firstLine.replace(/:::gallery\s?/, "").trim();

        // Collect all image tokens between open and close markers
        const imageTokens: Token[] = [];

        // Gather images from the opening token itself
        if (tokens[i].children) {
          for (const child of tokens[i].children!) {
            if (child.type === "image") imageTokens.push(child);
          }
        }

        // Find the paragraph_open before this inline token
        const blockStart =
          i > 0 && tokens[i - 1].type === "paragraph_open" ? i - 1 : i;

        // Check if the closing ::: is within this same inline token
        // (happens when there are no blank lines between images)
        const contentLines = tokens[i].content.split("\n");
        const lastLine = contentLines[contentLines.length - 1].trim();
        let blockEnd: number;

        if (lastLine === ":::") {
          // Self-contained: open, images, and close all in one token
          blockEnd =
            i + 1 < tokens.length && tokens[i + 1].type === "paragraph_close"
              ? i + 1
              : i;
        } else {
          // Scan forward for the closing :::
          // Stop at container boundaries to avoid eating tokens from
          // an enclosing :::details or similar container.
          let j = i + 1;
          blockEnd = -1;
          while (j < tokens.length) {
            // Don't cross container close boundaries
            if (
              tokens[j].type.startsWith("container_") &&
              tokens[j].nesting === -1
            ) {
              break;
            }

            if (tokens[j].type === "inline") {
              const lines = tokens[j].content?.split("\n") ?? [];
              const last = lines[lines.length - 1]?.trim();

              // Collect images from this token regardless
              if (tokens[j].children) {
                for (const child of tokens[j].children!) {
                  if (child.type === "image") imageTokens.push(child);
                }
              }

              if (last === ":::") {
                // This token contains the closing marker
                blockEnd =
                  j + 1 < tokens.length &&
                  tokens[j + 1].type === "paragraph_close"
                    ? j + 1
                    : j;
                break;
              }
            }
            j++;
          }

          if (blockEnd === -1) {
            // No closing ::: found (e.g. nested inside a container).
            // Treat as self-contained: just use images from the opening token.
            if (imageTokens.length === 0) {
              i++;
              continue;
            }
            blockEnd =
              i + 1 < tokens.length && tokens[i + 1].type === "paragraph_close"
                ? i + 1
                : i;
          }
        }

        // Build a replacement gallery token
        const galleryToken = new state.Token("gallery", "", 0) as Token;
        galleryToken.content = galleryName;
        galleryToken.meta = { imageTokens };
        galleryToken.block = true;

        // Replace the range [blockStart, blockEnd] with the single gallery token
        tokens.splice(blockStart, blockEnd - blockStart + 1, galleryToken);
        i = blockStart + 1;
      }
      return true;
    });

    md.renderer.rules.gallery = (tokens: Token[], idx: number) => {
      return generateImgGallery(tokens[idx]);
    };
  },
};
