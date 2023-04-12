// uno.config.ts
import { defineConfig } from "unocss";
import { readFileSync } from "fs";

const BASE_GAP = 4;
const BASE_SPACE = 40;

export function breakpointVariants() {
  return (input, ctx) => {
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

export function parentVariant(name, parent) {
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

function postfixVariant(label, postfix) {
  return (input) => {
    if (input === undefined || !input.startsWith(`${label}:`)) return input;

    return {
      // slice `hover:` prefix and passed to the next variants and rules
      matcher: input.slice(label.length + 1),
      selector: (s) => `${s}:${postfix}`,
    };
  };
}

export default defineConfig({
  theme: {
    breakpoints: {
      sm: "320px",
      md: "640px",
    },
  },
  preflights: [{ getCSS: () => readFileSync("./src/reset.css") }, { getCSS: () => readFileSync("./src/layout.css") }],
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
    [/^cusp-(\d+)$/, ([, n]) => ({ "--cusp": `${n * BASE_SPACE}px` })],

    // minimum item width for item grids
    [/^min-item-width-(\d+)$/, ([, n]) => ({ "--min-item-width": `${n * BASE_SPACE}px` })],

    // alignment
    ["align-start", { "align-items": "flex-start" }],
    ["align-end", { "align-items": "flex-end" }],
    ["align-stretch", { "align-items": "stretch" }],
    ["align-center", { "align-items": "center" }],
    ["align-baseline", { "align-items": "baseline" }],

    // justify
    ["justify-start", { "justify-content": "flex-start" }],
    ["justify-center", { "justify-content": "center" }],
    ["justify-end", { "justify-content": "flex-end" }],
    ["justify-around", { "justify-content": "space-around" }],
    ["justify-between", { "justify-content": "space-between" }],
    ["justify-evenly", { "justify-content": "space-evenly" }],

    [/^basis-(\d+)$/, ([, n]) => ({ "flex-basis": `${n * BASE_SPACE}px` })],
    [/^grow-(\d+)$/, ([, n]) => ({ "flex-grow": `${n}` })],
    ["grow-max", { "flex-grow": 999 }],
    [/^shrink-(\d+)$/, ([, n]) => ({ "flex-shrink": `${n}` })],

    ["isolate", { isolation: "isolate" }],

    ["static", { position: "static" }],
    ["relative", { position: "relative" }],
    ["absolute", { position: "absolute" }],
    ["fixed", { position: "fixed" }],
    ["sticky", { position: "sticky" }],

    ["hidden", { display: "none" }],

    // Gaps: small spaces use for gaps, paddings, etc.
    [/^gap-(\d+)$/, ([, n]) => ({ gap: `${n * BASE_GAP}px` })],
    [/^gap-inline-(\d+)$/, ([, n]) => ({ "column-gap": `${n * BASE_GAP}px` })],
    [/^gap-block-(\d+)$/, ([, n]) => ({ "row-gap": `${n * BASE_GAP}px` })],

    [/^pad-(\d+)$/, ([, n]) => ({ padding: `${n * BASE_GAP}px` })],
    [/^pad-inline-(\d+)$/, ([, n]) => ({ "padding-inline": `${n * BASE_GAP}px` })],
    [/^pad-block-(\d+)$/, ([, n]) => ({ "padding-block": `${n * BASE_GAP}px` })],

    [/^min-inline-(\d+)$/, ([, n]) => ({ "min-inline-size": `${n * BASE_SPACE}px` })],
    [/^max-inline-(\d+)$/, ([, n]) => ({ "max-inline-size": `min(${n * BASE_SPACE}px, 100%)` })],
    [/^inline-(\d+)$/, ([, n]) => ({ "inline-size": `${n * BASE_SPACE}px` })],

    [/^min-block-(\d+)$/, ([, n]) => ({ "min-block-size": `${n * BASE_GAP}px` })],
    [/^max-block-(\d+)$/, ([, n]) => ({ "max-block-size": `${n * BASE_GAP}px` })],
    [/^block-(\d+)$/, ([, n]) => ({ "block-size": `${n * BASE_GAP}px` })],

    [/^nudge-([\d\.]+)$/, ([, n]) => ({ "margin-block-start": `${n}px` })],
    [/^push-(\d+)$/, ([, n]) => ({ "margin-block-end": `${n * BASE_GAP}px` })],

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
    [/^radius-(\d+)$/, ([, n]) => ({ "border-radius": `${n * BASE_GAP}px` })],
    ["radius-full", { "border-radius": "9999px" }],

    [/^shadow-([\w\-]+)$/, ([, s]) => ({ "box-shadow": `var(--shadow-${s})` })],
    [/^blur-(\d+)$/, ([, n]) => ({ "backdrop-filter": `blur(${n * BASE_GAP}px)` })],

    [/^fg-([\w\-]+)$/, ([, s]) => ({ "text-color": `var(--color-${s})` })],
    [/^bg-([\w\-]+)$/, ([, s]) => ({ "background-color": `var(--color-${s})` })],
    [/^border-([a-zA-Z][\w\-]+)$/, ([, s]) => ({ "border-color": `var(--color-${s})` })],
    [/^outline-([a-zA-Z][\w\-]+)$/, ([, s]) => ({ "outline-color": `var(--color-${s})` })],
  ],
});
