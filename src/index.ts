import type { Preset, PresetOptions } from "@unocss/core";
import layout from "./layout.css";

export interface PresetSpritzOptions extends PresetOptions {
  baseGap?: number;
  baseSize?: number;
}

interface Theme {}

export function presetSpritz(options: PresetSpritzOptions = {}): Preset<Theme> {
  let baseGap = options.baseGap || 4;
  let baseSpace = options.baseSpace || 40;

  return {
    name: "@spritz-css/uno-preset",
    preflights: [{ getCSS: () => layout }],
    // variants: variants(options),
    options,
    rules: [
      // cusp for changing the switcher from horizontal to vertical
      [/^cusp-(\d+)$/, ([, n]) => ({ "--cusp": `${parseInt(n) * baseSpace}px` })],

      // minimum item width for item grids
      [/^min-item-width-(\d+)$/, ([, n]) => ({ "--min-item-width": `${parseInt(n) * baseSpace}px` })],

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
      [/^basis-(\d+)$/, ([, n]) => ({ "flex-basis": `${parseInt(n) * baseSpace}px` })],
      [/^grow-(\d+)$/, ([, n]) => ({ "flex-grow": `${n}` })],
      ["grow-max", { "flex-grow": 999 }],
      [/^shrink-(\d+)$/, ([, n]) => ({ "flex-shrink": `${n}` })],

      // Gaps: small spaces use for gaps, paddings, etc.
      [/^gap-(\d+)$/, ([, n]) => ({ gap: `${parseInt(n) * baseGap}px` })],
      [/^gap-inline-(\d+)$/, ([, n]) => ({ "column-gap": `${parseInt(n) * baseGap}px` })],
      [/^gap-block-(\d+)$/, ([, n]) => ({ "row-gap": `${parseInt(n) * baseGap}px` })],

      [/^pad-(\d+)$/, ([, n]) => ({ padding: `${parseInt(n) * baseGap}px` })],
      [/^pad-inline-(\d+)$/, ([, n]) => ({ "padding-inline": `${parseInt(n) * baseGap}px` })],
      [/^pad-block-(\d+)$/, ([, n]) => ({ "padding-block": `${parseInt(n) * baseGap}px` })],

      [/^min-inline-(\d+)$/, ([, n]) => ({ "min-inline-size": `${parseInt(n) * baseSpace}px` })],
      [/^max-inline-(\d+)$/, ([, n]) => ({ "max-inline-size": `min(${parseInt(n) * baseSpace}px, 100%)` })],
      [/^inline-(\d+)$/, ([, n]) => ({ "inline-size": `${parseInt(n) * baseSpace}px` })],

      [/^min-block-(\d+)$/, ([, n]) => ({ "min-block-size": `${parseInt(n) * baseGap}px` })],
      [/^max-block-(\d+)$/, ([, n]) => ({ "max-block-size": `${parseInt(n) * baseGap}px` })],
      [/^block-(\d+)$/, ([, n]) => ({ "block-size": `${parseInt(n) * baseGap}px` })],

      [/^nudge-([\d\.]+)$/, ([, n]) => ({ "margin-block-start": `${n}px` })],
      [/^push-(\d+)$/, ([, n]) => ({ "margin-block-end": `${parseInt(n) * baseGap}px` })],

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
    ],
  };
}

export default presetSpritz;
