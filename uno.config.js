// uno.config.ts
import { defineConfig } from "unocss";

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
  return (input, ctx) => {
    if (input === undefined || !input.startsWith(`${name}:`)) return input;
    console.log(ctx && ctx.theme.breakpoints);

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
  variants: [
    postfixVariant("hover", "hover"),
    postfixVariant("focus", "focus-visible"),
    parentVariant("dark", "@media (prefers-color-scheme: dark)"),
    parentVariant("light", "@media (prefers-color-scheme: light)"),
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

    ["relative", { position: "relative" }],
    ["absolute", { position: "absolute" }],
    ["fixed", { position: "fixed" }],
    ["sticky", { position: "sticky" }],

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

    [/^nudge-(\d+)$/, ([, n]) => ({ "margin-block-start": `${n}px` })],
    [/^push-(\d+)$/, ([, n]) => ({ "margin-block-end": `${n * BASE_GAP}px` })],
  ],
});
