A markdown-it plugin to make iframes and videos responsive. The original idea goes back to [FitVids.js](http://fitvidsjs.com) and the [evolutionary improvements](https://daverupert.com/2023/10/fitvids-has-a-web-component-now/) that are possible because web browsers are capable of more now.

## Fitting media

Videos and iframes are not automatically responsive or fluid. They come with a fixed setting for width and height. To make them responsive, while keeping aspect-ratio, markdown-it-fitvids will expand the `style` attribute of these elements with the `aspect-ratio` property, based on the given `width` and `height` attributes. Also added to the `style` attribute will be the settings `max-width:100%; height:auto;`. These settings will allow the video to shrink, but not to expand above its initial size. To let the video grow above its initial size, the options of markdown-it-fitvids can be adjusted to add `width: 100%;` to the `style` attribute.

> [!IMPORTANT]
> The above described fitting of media can only be performed for elements that have the html attributes `width` and `height` set, *or* that do already have `aspect-ratio` set in the `style` attribute!

For example, the following iframe

```html
<iframe
  src="https://player.vimeo.com/video/304626830"
  width="600"
  height="338"
></iframe>
```

after processed by markdown-it-fitvids will become

```html
<iframe
  src="https://player.vimeo.com/video/304626830"
  style="aspect-ratio:600/338; max-width:100%; height:auto;"
  width="600"
  height="338"
>
</iframe>
```

## Options

markdown-it-fitvids has the following default options:

```json
{
  fitSelector: "iframe,video",
  applyStyle: "",
  applyClass: "",
  minimalStyle: false
}
```

- `fitSelector`: Identify the html elements that should be processed by markdown-it-fitvids
- `applyStyle`: For every processed element the here provided string is added to the `style` attribute. E.g, to let processed elements grow above their initial size, add the string `width:100%;`. Defautl is `""`
- `applyClass`: For every processed element the here provided CSS classe are added to the `class` attribute. This is a string with space separated CSS class names. You are responsible to maintain the CSS classes within your stylesheet. Default is `""`
- `minimalStyle`: By default every processed element will get the setting `max-width:100%; height:auto;` assigned to the `style` attribute. If you do not want to set the `style` attribute, and instead do the styling through CSS classes, set this option to `true`. Default is `false`. When setting this to `true`, you are then responsible to provide the suitable CSS classes within your stylesheet and to mention those classes in `applyClass` option.

## Usage

```js
import markdownIt from "markdown-it";
import markdownItFitVids from "markdown-it-fitvids";

markdownIt({
  html: true,
}).use(markdownItFitVids, { //default options, you can omit these
});
```
