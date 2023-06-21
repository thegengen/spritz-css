import type { Preset, PresetOptions, Variant, VariantContext, Rule } from "@unocss/core";
import layout from "./layout.css";

export interface PresetSpritzOptions extends PresetOptions {
  baseSize?: number;
}

interface Theme {
  mediaQueries?: Record<string, string>;
}

export function parentVariant(name: string, parent: string): Variant {
  return (input) => {
    if (input === undefined || !input.startsWith(`${name}:`)) return input;

    return {
      matcher: input.slice(name.length + 1),
      handle: (input, next) =>
        next({
          ...input,
          parent: `${input.parent ? `${input.parent} $$ ` : ""}${parent}`,
        }),
    };
  };
}

export function mediaVariants(): Variant {
  return (input: string, ctx: Readonly<VariantContext<Theme>>) => {
    let themeQueries = ctx?.theme?.mediaQueries || {};
    let mediaQueries = {
      print: "print",
      dark: "(prefers-color-scheme: dark)",
      light: "(prefers-color-scheme: light)",
      ...themeQueries,
    };

    if (input === undefined || mediaQueries === undefined) return input;

    for (let name of Object.keys(mediaQueries)) {
      if (input.startsWith(`${name}:`)) {
        return {
          matcher: input.slice(name.length + 1),
          handle: (input, next) => {
            return next({
              ...input,
              parent: `@media ${mediaQueries[name]}`,
              parentOrder: Object.keys(mediaQueries).indexOf(name) + 1,
            });
          },
        };
      }
    }

    return input;
  };
}

function postfixVariant(label: string, postfix: string): Variant {
  return (input) => {
    if (input === undefined || !input.startsWith(`${label}:`)) return input;

    return {
      // slice `hover:` prefix and passed to the next variants and rules
      matcher: input.slice(label.length + 1),
      selector: (s) => `${s}:${postfix}`,
    };
  };
}

export function presetSpritz(options: PresetSpritzOptions = {}): Preset<Theme> {
  let baseSize = options.baseSize || 4;

  return {
    name: "@spritz-css/uno-preset",
    preflights: [{ getCSS: () => layout }],
    options,
    variants: [
      postfixVariant("hover", "hover"),
      postfixVariant("focus", "focus-visible"),
      postfixVariant("active", "active"),
      postfixVariant("even", ":nth-of-type(even)"),
      postfixVariant("odd", ":nth-of-type(odd)"),
      postfixVariant("first", "first-of-type"),
      postfixVariant("last", "last-of-type"),
      postfixVariant("not-first", "not(:first-of-type)"),
      postfixVariant("not-last", "not(:last-of-type)"),
      mediaVariants(),
    ].flat(),
    rules: [
      // SLCBT = SELECTOR + LAYOUT + CONTAINER + BOX + TYPOGRAPHY (pronounced "slick bit")
      // or SPCBT = SELECTOR+PARENT+CHILD+BOX+TYPOGRAPHY

      // SELECTORS: user-specified classes that can be used to select the element from CSS or JS, as needed
      // Could be a good idea to prefix them, e.g js-sidebar

      // LAYOUTS: layouts from Every Layout (details coming soon)
      // These typically control the layout of children elements
      // TODO: maybe move center below since it doesn't behave that way.

      // Where the switcher switches from horizontal to vertical layout
      [/^threshold-(\d+)$/, ([, n]) => ({ "--spritz--threshold": `${parseInt(n) * baseSize}px` })],
      // Minimum item width for item grids
      [/^item-width-(\d+)$/, ([, n]) => ({ "--spritz--item-width": `${parseInt(n) * baseSize}px` })],

      // Gaps control the spacing between children.
      [/^gap-(\d+)$/, ([, n]) => ({ gap: `${parseInt(n) * baseSize}px` })],
      [/^gap--(\w+)$/, ([, s]) => ({ gap: `var(--gap--${s})` })],
      [/^gap-inline-(\d+)$/, ([, n]) => ({ "column-gap": `${parseInt(n) * baseSize}px` })],
      [/^gap-inline--(\w+)$/, ([, s]) => ({ "column-gap": `var(--gap-inline--${s})` })],
      [/^gap-block-(\d+)$/, ([, n]) => ({ "row-gap": `${parseInt(n) * baseSize}px` })],
      [/^gap-block--(\w+)$/, ([, s]) => ({ "row-gap": `var(--gap-block--${s})` })],
      // Alignment
      ["align-start", { "align-items": "flex-start" }],
      ["align-end", { "align-items": "flex-end" }],
      ["align-stretch", { "align-items": "stretch" }],
      ["align-center", { "align-items": "center" }],
      ["align-baseline", { "align-items": "baseline" }],
      // Justification
      ["justify-start", { "justify-content": "flex-start" }],
      ["justify-center", { "justify-content": "center" }],
      ["justify-end", { "justify-content": "flex-end" }],
      ["justify-around", { "justify-content": "space-around" }],
      ["justify-between", { "justify-content": "space-between" }],
      ["justify-evenly", { "justify-content": "space-evenly" }],
      // Hiding lives here to allow for things like hidden sm:stack
      ["hidden", { display: "none" }],
      // Isolation: create a stacking context for children's z-indexes
      ["isolate", { isolation: "isolate" }],

      // Overflow: control what happens when the children don't fit in this container
      ["overflow-visible", { overflow: "visible" }],
      ["overflow-hidden", { overflow: "hidden" }],
      ["overflow-clip", { overflow: "clip" }],
      ["overflow-scroll", { overflow: "scroll" }],
      ["overflow-auto", { overflow: "auto" }],

      // CONTAINER: describes an element's position and/or dimensions (exact or flexible)
      //
      // Inline dimensions (minimum, maximum, and set size) -- these are clipped to 100% of the parent to avoid
      // any overflow scenarios
      [/^min-inline-(\d+)$/, ([, n]) => ({ "min-inline-size": `min(${parseInt(n) * baseSize}px, 100%)` })],
      [/^min-inline--(\w+)$/, ([, s]) => ({ "min-inline-size": `var(--min-inline--${s})` })],
      ["min-inline-full", { "min-inline-size": "100%" }],
      [/^max-inline-(\d+)$/, ([, n]) => ({ "max-inline-size": `min(${parseInt(n) * baseSize}px, 100%)` })],
      [/^max-inline--(\w+)$/, ([, s]) => ({ "max-inline-size": `var(--max-inline--${s})` })],
      ["max-inline-full", { "max-inline-size": "100%" }],
      [/^inline-(\d+)$/, ([, n]) => ({ "inline-size": `min(${parseInt(n) * baseSize}px, 100%)` })],
      [/^inline--(\w+)$/, ([, s]) => ({ "inline-size": `var(--inline--${s})` })],
      ["inline-full", { "inline-size": "100%" }],
      // Block dimensions (similar to above)
      [/^min-block-(\d+)$/, ([, n]) => ({ "min-block-size": `${parseInt(n) * baseSize}px` })],
      [/^min-block--(\w+)$/, ([, s]) => ({ "min-block-size": `var(--min-block--${s})` })],
      ["min-block-full", { "min-block-size": "100%" }],
      [/^max-block-(\d+)$/, ([, n]) => ({ "max-block-size": `${parseInt(n) * baseSize}px` })],
      [/^max-block--(\w+)$/, ([, s]) => ({ "max-block-size": `var(--max-block--${s})` })],
      ["max-block-full", { "max-block-size": "100%" }],
      [/^block-(\d+)$/, ([, n]) => ({ "block-size": `${parseInt(n) * baseSize}px` })],
      [/^block--(\w+)$/, ([, s]) => ({ "block-size": `var(--block--${s})` })],
      ["block-full", { "block-size": "100%" }],
      // These are not semantic because vb,vi are too new to be supported in the browser.
      ["min-width-screen", { "min-width": "100vw" }],
      ["max-width-screen", { "max-width": "100vw" }],
      ["width-screen", { width: "100vw" }],
      ["min-height-screen", { "min-height": "100vh" }],
      ["max-height-screen", { "max-height": "100vh" }],
      ["height-screen", { height: "100vh" }],
      // Aspect-ratios
      [/^aspect-([a-zA-Z][\w\-]*)$/, ([, s]) => ({ "aspect-ratio": `var(--aspect-${s})` })],
      ["aspect-square", { "aspect-ratio": "1/1" }],
      ["aspect-video", { "aspect-ratio": "16/9" }],
      // Flexbox controls
      [/^basis-(\d+)$/, ([, n]) => ({ "flex-basis": `${parseInt(n) * baseSize}px` })],
      [/^grow-(\d+)$/, ([, n]) => ({ "flex-grow": `${n}` })],
      ["grow-max", { "flex-grow": 9999 }],
      [/^shrink-(\d+)$/, ([, n]) => ({ "flex-shrink": `${n}` })],
      // Box model: control how the dimensions of this element are calculated
      ["box-content", { "box-sizing": "content-box" }],
      ["box-border", { "box-sizing": "border-box" }],

      // Positioning: control the position of this element
      ["bound", { position: "absolute" }],
      ["static", { position: "static" }],
      ["relative", { position: "relative" }],
      ["absolute", { position: "absolute" }],
      ["fixed", { position: "fixed" }],
      ["sticky", { position: "sticky" }],
      [/^block-start-(\d+)$/, ([, n]) => ({ "inset-block-start": `${parseInt(n) * baseSize}px` })],
      [/^block-start--(\w+)$/, ([, s]) => ({ "inset-block-start": `var(--block-start--${s})` })],
      [/^block-end-(\d+)$/, ([, n]) => ({ "inset-block-end": `${parseInt(n) * baseSize}px` })],
      [/^block-end--(\w+)$/, ([, s]) => ({ "inset-block-end": `var(--block-end--${s})` })],
      [/^inline-start-(\d+)$/, ([, n]) => ({ "inset-inline-start": `${parseInt(n) * baseSize}px` })],
      [/^inline-start--(\w+)$/, ([, s]) => ({ "inset-inline-start": `var(--inline-start--${s})` })],
      [/^inline-end-(\d+)$/, ([, n]) => ({ "inset-inline-end": `${parseInt(n) * baseSize}px` })],
      [/^inline-end--(\w+)$/, ([, s]) => ({ "inset-inline-end": `var(--inline-end--${s})` })],

      // TODO: I so want this to exist on boxes, not sure if that makes sense.
      [/^pad-(\d+)$/, ([, n]) => ({ padding: `${parseInt(n) * baseSize}px` })],
      [/^pad--(\w+)$/, ([, s]) => ({ padding: `var(--pad--${s})` })],
      [/^pad-inline-(\d+)$/, ([, n]) => ({ "padding-inline": `${parseInt(n) * baseSize}px` })],
      [/^pad-inline--(\w+)$/, ([, s]) => ({ "padding-inline": `var(--pad-inline--${s})` })],
      [/^pad-block-(\d+)$/, ([, n]) => ({ "padding-block": `${parseInt(n) * baseSize}px` })],
      [/^pad-block--(\w+)$/, ([, s]) => ({ "padding-block": `var(--pad-block--${s})` })],
      // Z-Index
      [/^z-(\d+)$/, ([, n]) => ({ "z-index": `${n}` })],

      // Ordering
      [/^order-(\d+)$/, ([, n]) => ({ order: `${n}` })],
      ["order-first", { order: "-999" }],
      ["order-last", { order: "999" }],
      // Small adjustments
      [/^nudge-([\d\.]+)$/, ([, n]) => ({ "margin-block-start": `${n}px` })],
      [/^push-(\d+)$/, ([, n]) => ({ "margin-block-end": `${parseInt(n) * baseSize}px` })],
      // TODO: pull/indent/unindent

      // BOXES: While almost everything is a box in HTML & CSS, these classes refer to boxes that can be
      // seen with the naked eye. They have colors, background colors, borders etc.
      //
      // Foreground and background colors
      // fg-gray-500 .fg-gray-500 { color: var(--color-gray-500); }
      [/^fg-([a-zA-Z][\w\-]*)$/, ([, s]) => ({ color: `var(--color-${s})` })],
      [/^bg-([a-zA-Z][\w\-]*)$/, ([, s]) => ({ "background-color": `var(--color-${s})` })],
      // Opacity
      [/^opacity-(\d+)$/, ([, n]) => ({ opacity: `${parseFloat(n) / 100}` })],
      // Blur
      [/^blur-(\d+)$/, ([, n]) => ({ "backdrop-filter": `blur(${parseInt(n) * baseSize}px)` })],
      // Corner radii
      [/^radius-(\d+)$/, ([, n]) => ({ "border-radius": `${parseInt(n) * baseSize}px` })],
      ["radius-full", { "border-radius": "9999px" }],
      // Borders
      [/^border-([a-zA-Z][\w\-]*)$/, ([, s]) => ({ border: `solid 1px var(--color-${s})` })],
      ["border-none", { "border-style": "none" }],
      ["border-solid", { "border-style": "solid" }],
      ["border-dotted", { "border-style": "dotted" }],
      ["border-dashed", { "border-style": "dashed" }],
      ["border-transparent", { "border-color": "transparent" }],
      [/^border-([\d\.]+)$/, ([, n]) => ({ "border-width": `${n}px` })],
      // Outlines
      [/^outline-([a-zA-Z][\w\-]*)$/, ([, s]) => ({ outline: `solid 1px var(--color-${s})` })],
      ["outline-none", { "outline-style": "none" }],
      ["outline-solid", { "outline-style": "solid" }],
      ["outline-dotted", { "outline-style": "dotted" }],
      ["outline-dashed", { "outline-style": "dashed" }],
      ["outline-transparent", { "outline-color": "transparent" }],
      [/^outline-([\d\.]+)$/, ([, n]) => ({ "outline-width": `${n}px` })],

      // TYPOGRAPHY: Most of the typography should be defined in self-contained classes like
      // .type-body, .type-heading, .type-subheading. Most of this is just for tweaking such
      // default styles.
      //
      // Font weight
      [/^weight-(\d+)$/, ([, n]) => ({ "font-weight": `${n}` })],
      // Styling and decoration.
      ["italic", { "font-style": "italic" }],
      ["non-italic", { "font-style": "normal" }],
      ["underline", { "text-decoration-line": "underline" }],
      ["line-through", { "text-decoration-line": "line-through" }],
      ["no-line", { "text-decoration-line": "none" }],
      ["decoration-from-font", { "text-decoration-thickness": "from-font" }],
      [/^decoration-([\d\.]+)$/, ([, n]) => ({ "text-decoration-thickness": `${n}px` })],
      // Wrapping, truncation
      ["no-wrap", { "white-space": "nowrap" }],
      ["truncate", { overflow: "hidden", "text-overflow": "ellipsis", "white-space": "nowrap" }],
      [
        /^line-clamp-(\d+)$/,
        ([, n]) => ({
          overflow: "hidden",
          display: "-webkit-box",
          "-webkit-box-orient": "block-axis",
          "-webkit-line-clamp": `${n}`,
        }),
      ],
      // Alignment
      ["text-start", { "text-align": "start" }],
      ["text-end", { "text-align": "end" }],
      ["text-center", { "text-align": "center" }],
      ["text-justify", { "text-align": "justify" }],
      // List styles; putting them here is a bit random perhaps, but what can you do? ¯\_(ツ)_/¯
      ["list-inside", { "list-style-position": "inside" }],
      ["list-outside", { "list-style-position": "outside" }],
      ["list-none", { "list-style-type": "none" }],
      ["list-disc", { "list-style-type": "disc" }],
    ],
  };
}

export default presetSpritz;
