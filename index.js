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
      let token = tokens[idx];
      let $ = cheerio.load(token.content);
      let elements = $(fitOptions.fitSelector);

      if (elements.length) {
        elements.each(function () {
          let width = parseInt($(this).attr("width"));
          let height = parseInt($(this).attr("height"));
          if (width > 0 && height > 0) {
            let style = $(this).attr("style");
            style = styleAspectRatio(style, width, height);
            style += " max-width:100%; height:auto;";
            if (fitOptions.style) {
              style += fitOptions.style;
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
    let html = elementRenderer(tokens, idx, options, env, self);
    if (html) {
      return html;
    } else {
      return blockRenderer(tokens, idx, options, env, self);
    }
  };
}

export default function (md, fitOptions) {
  fitOptions = Object.assign(
    { fitSelector: "iframe,video", applyStyle: "" },
    fitOptions,
  );
  fitHtmlElements(md, fitOptions);
}
