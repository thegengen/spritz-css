import type { Preset, PresetOptions } from "@unocss/core";
import layout from "./layout.css";

export interface PresetSpritzOptions extends PresetOptions {
  baseGap?: number;
  baseSize?: number;
}

interface Theme {}

export function presetSpritz(options: PresetSpritzOptions = {}): Preset<Theme> {
  options.baseGap ??= 4;
  options.baseSize ??= 40;

  return {
    name: "@spritz-css/uno-preset",
    preflights: [{ getCSS: () => layout }],
    // variants: variants(options),
    options,
  };
}

export default presetSpritz;
