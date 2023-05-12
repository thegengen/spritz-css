import type { Preset, PresetOptions, Variant, VariantContext } from "@unocss/core";
import layout from "./layout.css";

export interface PresetSpritzOptions extends PresetOptions {
  baseSize?: number;
}

interface Theme {
  breakpoints?: Record<string, string>;
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

export function breakpointVariants(): Variant {
  return (input: string, ctx: Readonly<VariantContext<Theme>>) => {
    let breakpoints = ctx?.theme?.breakpoints;

    if (input === undefined || breakpoints === undefined) return input;

    for (let name of Object.keys(breakpoints)) {
      if (input.startsWith(`${name}:`)) {
        return {
          matcher: input.slice(name.length + 1),
          handle: (input, next) =>
            next({
              ...input,
              parent: `${input.parent ? `${input.parent} $$ ` : ""}@media (min-width: ${breakpoints[name]})`,
            }),
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
      postfixVariant("odd", "active"),
      parentVariant("dark", "@media (prefers-color-scheme: dark)"),
      parentVariant("light", "@media (prefers-color-scheme: light)"),
      parentVariant("print", "@media print"),
      breakpointVariants(),
    ].flat(),
    rules: [
      // cusp for changing the switcher from horizontal to vertical
      [/^cusp-(\d+)$/, ([, n]) => ({ "--cusp": `${parseInt(n) * baseSize}px` })],

      // minimum item width for item grids
      [/^min-item-width-(\d+)$/, ([, n]) => ({ "--min-item-width": `${parseInt(n) * baseSize}px` })],

      // alignment
      ["align-start", { "align-items": "flex-start" }],
      ["align-end", { "align-items": "flex-end" }],
      ["align-stretch", { "align-items": "stretch" }],
      ["align-center", { "align-items": "center" }],
      ["align-baseline", { "align-items": "baseline" }],

      // justification
      ["justify-start", { "justify-content": "flex-start" }],
      ["justify-center", { "justify-content": "center" }],
      ["justify-end", { "justify-content": "flex-end" }],
      ["justify-around", { "justify-content": "space-around" }],
      ["justify-between", { "justify-content": "space-between" }],
      ["justify-evenly", { "justify-content": "space-evenly" }],

      // Flexbox controls
      [/^basis-(\d+)$/, ([, n]) => ({ "flex-basis": `${parseInt(n) * baseSize}px` })],
      [/^grow-(\d+)$/, ([, n]) => ({ "flex-grow": `${n}` })],
      ["grow-max", { "flex-grow": 999 }],
      [/^shrink-(\d+)$/, ([, n]) => ({ "flex-shrink": `${n}` })],

      // Box model
      ["box-content", { "box-sizing": "content-box" }],
      ["box-border", { "box-sizing": "border-box" }],

      // Positioning, hiding
      ["isolate", { isolation: "isolate" }],

      ["static", { position: "static" }],
      ["relative", { position: "relative" }],
      ["absolute", { position: "absolute" }],
      ["fixed", { position: "fixed" }],
      ["sticky", { position: "sticky" }],

      [/^top-(\d+)$/, ([, n]) => ({ top: `${parseInt(n) * baseSize}px` })],
      [/^bottom-(\d+)$/, ([, n]) => ({ bottom: `${parseInt(n) * baseSize}px` })],
      [/^left-(\d+)$/, ([, n]) => ({ left: `${parseInt(n) * baseSize}px` })],
      [/^right-(\d+)$/, ([, n]) => ({ right: `${parseInt(n) * baseSize}px` })],

      ["hidden", { display: "none" }],

      // Overflow
      ["overflow-visible", { overflow: "visible" }],
      ["overflow-hidden", { overflow: "hidden" }],
      ["overflow-clip", { overflow: "clip" }],
      ["overflow-scroll", { overflow: "scroll" }],
      ["overflow-auto", { overflow: "auto" }],

      // Gaps: small spaces use for gaps, paddings, etc.
      [/^gap-(\d+)$/, ([, n]) => ({ gap: `${parseInt(n) * baseSize}px` })],
      [/^gap-inline-(\d+)$/, ([, n]) => ({ "column-gap": `${parseInt(n) * baseSize}px` })],
      [/^gap-block-(\d+)$/, ([, n]) => ({ "row-gap": `${parseInt(n) * baseSize}px` })],

      [/^pad-(\d+)$/, ([, n]) => ({ padding: `${parseInt(n) * baseSize}px` })],
      [/^pad-inline-(\d+)$/, ([, n]) => ({ "padding-inline": `${parseInt(n) * baseSize}px` })],
      [/^pad-block-(\d+)$/, ([, n]) => ({ "padding-block": `${parseInt(n) * baseSize}px` })],

      [/^min-inline-(\d+)$/, ([, n]) => ({ "min-inline-size": `${parseInt(n) * baseSize}px` })],
      [/^max-inline-(\d+)$/, ([, n]) => ({ "max-inline-size": `min(${parseInt(n) * baseSize}px, 100%)` })],
      [/^inline-(\d+)$/, ([, n]) => ({ "inline-size": `${parseInt(n) * baseSize}px` })],
      ["min-inline-full", { "min-inline-size": "100%" }],
      ["max-inline-full", { "max-inline-size": "100%" }],
      ["inline-full", { "inline-size": "100%" }],

      [/^min-block-(\d+)$/, ([, n]) => ({ "min-block-size": `${parseInt(n) * baseSize}px` })],
      [/^max-block-(\d+)$/, ([, n]) => ({ "max-block-size": `${parseInt(n) * baseSize}px` })],
      [/^block-(\d+)$/, ([, n]) => ({ "block-size": `${parseInt(n) * baseSize}px` })],
      ["min-block-full", { "min-block-size": "100%" }],
      ["max-block-full", { "max-block-size": "100%" }],
      ["block-full", { "block-size": "100%" }],

      ["min-width-screen", { "min-width": "100vw" }],
      ["max-width-screen", { "max-width": "100vw" }],
      ["width-screen", { width: "100vw" }],

      ["min-height-screen", { "min-height": "100vh" }],
      ["max-height-screen", { "max-height": "100vh" }],
      ["height-screen", { height: "100vh" }],

      [/^nudge-([\d\.]+)$/, ([, n]) => ({ "margin-block-start": `${n}px` })],
      [/^push-(\d+)$/, ([, n]) => ({ "margin-block-end": `${parseInt(n) * baseSize}px` })],

      // TODO: do we want inset? will that get used a lot?

      ["aspect-square", { "aspect-ratio": "1/1" }],
      ["aspect-portrait", { "aspect-ratio": "3/4" }],
      ["aspect-landscape", { "aspect-ratio": "4/3" }],
      ["aspect-video", { "aspect-ratio": "16/9" }],

      ["float-left", { float: "left" }],
      ["float-right", { float: "right" }],
      ["float-none", { float: "none" }],

      ["italic", { "font-style": "italic" }],
      ["non-italic", { "font-style": "normal" }],
      [/^weight-(\d+)$/, ([, n]) => ({ "font-weight": `${n}` })],

      ["truncate", { overflow: "hidden", "text-overflow": "ellipsis", "white-space": "nowrap" }],
      [
        /^line-clamp-(\d+)$/,
        ([, n]) => ({
          overflow: "hidden",
          display: "-webkit-box",
          "-webkit-box-orient": "vertical",
          "-webkit-line-clamp": `${n}`,
        }),
      ],

      ["list-inside", { "list-style-position": "inside" }],
      ["list-outside", { "list-style-position": "outside" }],
      ["list-none", { "list-style-type": "none" }],
      ["list-disc", { "list-style-type": "disc" }],

      ["text-start", { "text-align": "start" }],
      ["text-end", { "text-align": "end" }],
      ["text-center", { "text-align": "center" }],

      ["underline", { "text-decoration-line": "underline" }],
      ["line-through", { "text-decoration-line": "line-through" }],
      ["no-line", { "text-decoration-line": "none" }],

      ["decoration-from-font", { "text-decoration-thickness": "from-font" }],
      [/^decoration-([\d\.]+)$/, ([, n]) => ({ "text-decoration-thickness": `${n}px` })],

      // TODO: icons, images
      // See https://antfu.me/posts/icons-in-pure-css
      [/^z-(\d+)$/, ([, n]) => ({ "z-index": `${n}` })],
      [/^order-(\d+)$/, ([, n]) => ({ order: `${n}` })],
      ["order-first", { order: "-999" }],
      ["order-last", { order: "999" }],

      [/^border-([\d\.]+)$/, ([, n]) => ({ "border-width": `${n}px` })],
      [/^outline-([\d\.]+)$/, ([, n]) => ({ "outline-width": `${n}px` })],
      [/^radius-(\d+)$/, ([, n]) => ({ "border-radius": `${parseInt(n) * baseSize}px` })],
      ["radius-full", { "border-radius": "9999px" }],

      [/^shadow-([\w\-]+)$/, ([, s]) => ({ "box-shadow": `var(--shadow-${s})` })],
      [/^blur-(\d+)$/, ([, n]) => ({ "backdrop-filter": `blur(${parseInt(n) * baseSize}px)` })],
      [/^opacity-(\d+)$/, ([, n]) => ({ opacity: `${parseFloat(n) / 100}` })],

      [/^fg-([\w\-]+)$/, ([, s]) => ({ color: `var(--color-${s})` })],
      [/^bg-([\w\-]+)$/, ([, s]) => ({ "background-color": `var(--color-${s})` })],
      [/^border-([a-zA-Z][\w\-]+)$/, ([, s]) => ({ "border-color": `var(--color-${s})` })],
      [/^outline-([a-zA-Z][\w\-]+)$/, ([, s]) => ({ "outline-color": `var(--color-${s})` })],
    ],
  };
}

export default presetSpritz;
