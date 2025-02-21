import * as cheerio from "cheerio";

function styleAspectRatio(style, width, height) {
  if (style && !/aspect-ratio/i.test(style)) {
    if (!/;\s*$/.test(style)) {
      style += "; ";
    }
    style += `aspect-ratio:${width}/${height};`;
  } else {
    style = `aspect-ratio:${width}/${height};`;
  }
  return style;
}

function fitHtmlElements(md, fitOptions) {
  const blockRenderer = md.renderer.rules.html_block;
  const elementRenderer = function (tokens, idx, options, env, self) {
    try {
      const token = tokens[idx];
      const $ = cheerio.load(token.content);
      const elements = $(fitOptions.fitSelector);

      if (elements.length) {
        elements.each(function () {
          const width = parseInt(Number($(this).attr("width")));
          const height = parseInt(Number($(this).attr("height")));
          let style = $(this).attr("style");
          const hasAspectRatio = style && /aspect-ratio/i.test(style);

          if ((width > 0 && height > 0) || hasAspectRatio) {
            if (!hasAspectRatio) {
              style = styleAspectRatio(style, width, height);
            }
            if (!fitOptions.minimalStyle || !fitOptions.applyClass) {
              style += " max-width:100%; height:auto;";
            }
            if (fitOptions.applyClass) {
              $(this).addClass(fitOptions.applyClass);
            }
            if (fitOptions.applyStyle) {
              style += fitOptions.applyStyle;
            }
            $(this).attr("style", style);
          }
        });
        return $("body").html();
      }
    } catch (err) {
      console.error(`Failure when fitting media element ${err}`);
    }
  };

  md.renderer.rules.html_block = function (tokens, idx, options, env, self) {
    const html = elementRenderer(tokens, idx, options, env, self);
    if (html) {
      return html;
    } else {
      return blockRenderer(tokens, idx, options, env, self);
    }
  };
}

export default function (md, fitOptions) {
  fitOptions = Object.assign(
    {
      fitSelector: "iframe,video",
      applyStyle: "",
      applyClass: "",
      minimalStyle: false,
    },
    fitOptions,
  );
  fitHtmlElements(md, fitOptions);
}
