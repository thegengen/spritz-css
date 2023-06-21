# Spritz.CSS

## Writing clean classes

Spritz splits its functionality into five parts, each of which relies on utility classes that you add to your elements. Together with your own classes, that means you want to split up classes into six sections:

1. Selectors. These are your own classes that you use in order to target the element from CSS or JavaScript.
2. Layouts. These are utility classes that define how an element’s children should be laid out; this also includes classes for gaps and padding
3. Position. Relative or static positioning; reordering items; position on the z axis.
4. Dimensions. Width, height, aspect ratios, growing and shrinking
5. Boxes. Setting borders, colors, padding(?)
6. Typography. Use this for your own typographic classes and to customize those as needed.

Because Spritz encourages you not to be shy about wrapper elements, you will rarely use all six.

To make things easier for your readers it is recommended (but not required) that you use vertical bars to separate classes when written out on a single line:

```html
<div
  class="notice | row gap-8 | fixed block-start-4 inline-end-4 | min-block-100 | bg-white border-gray-300 shadow--sm | type-notice"
>
  ...
</div>
```

If lines get too long, you can also split classes up on different lines:

```html
<div
  class="
	notice
	row gap-8
	fixed block-start-4 inline-end-4
	min-block-100
	bg-white border-gray-300 shadow--sm
	type-notice"
>
  ...
</div>
```

Again, none of this is required to use Spritz, it’s just a suggestion to make your code easier to read.

## Media query modifiers

Out of the box, Spritz lets you write classes like `print:hidden` which tell it to generate CSS like this:

```css
@media print {
  .print\:hidden {
    display: none;
  }
}
```

The following media query prefixes are supported out of the box:

- `print` wraps classes in `@media print`
- `light` wraps them in `@media (prefers-color-scheme: light)`
- `dark` wraps them in `@media (prefers-color-scheme: dark)`

The powerful part though, is being able to write your own media queries. In your `uno.config.js` you can set it up like this.

```js
import { defineConfig } from "unocss";
import presetSpritz from "@spritz-css/uno-preset";

export default defineConfig({
  theme: {
    mediaQueries: {
      sm: "(min-width: 480px)",
    },
  },
});
```

This is similar to what you can do with Tailwind, but with Spritz media queries you have a lot more power.

A common thing to do is writing media queries that target viewports smaller than a certain size:

```
"below-sm": "(max-width: 480px)",
```

With this you can switch from Tailwilnd code like `<div class="hidden sm:block" />` to `<div class="below-sm:hidden">`.

## Postfix modifiers

You can write classes like `hover:weight-700` which Spritz convert into this:

```css
.hover\:weight-700:hover {
  font-weight: 700;
}
```

The following modifiers are supported:

- `hover` will add `:hover` to the class
- `focus` will add `:focus-visible` which, unlike `:focus`, is [what you want](https://css-tricks.com/almanac/selectors/f/focus-visible/) for customizing appearance
- `active` will add `:active`
- `odd` will add `:nth-of-type(odd)` which is [more robust](https://css-tricks.com/the-difference-between-nth-child-and-nth-of-type/) than `:nth-child`.
- `even` will add `:nth-of-type(even)`
- `first` will add `:first-of-type`
- `last` will add `:last-of-type`
- `not-first` will add `:not(:first-of-type)`
- `not-last` will add `:not(:last-of-type)`

Support for adding custom modifiers will be added in a future release.

## Utility classes

Like Tailwind, Spritz lets you write utility classes with numbers describing sizes. For instance, you can write `pad-4` and Spritz will generate a class with `padding: 16px`. But unlike Tailwind there is no predetermined catalogue of values. You can write `pad-23` and Spritz will happily generate a class with `padding: 92px`. It’s your party!

You can also use media query prefixes to tweak sizes based on the browser’s viewport like `pad-4 lg:pad-6`. This is great for prototyping and is good enough for 95% of all your designs.

But every now and then you end up with classes like `pad-4 sm:pad-6 md:pad-8 lg:pad-10` getting repeated in five different and unrelated components.`

Spritz lets you write a class like `pad--box` which will generate `padding: var(--pad--box);` (notice the two dashes which are there to avoid naming collisions with your existing CSS code). Now all that’s left to do is define that CSS variable somewhere.

Even better, due to the magic of CSS variables, you can override what `--pad--box` means inside one individual element by changing that variable only within that one element.

## Inline and block

Spritz doesn’t use terms like top or bottom, left or right, x or y, column or row. Instead it relies on the words **inline** and **block** as used in [CSS logical properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values). If you’re trying to remember which is which, a good rule of thumb is to think of how spans flow using `display: inline` and divs flow using `display: block`.

Spritz also doesn’t have numeric utility classes for individual directions. There’s nothing that will set `padding-inline-start` or `padding-left`. Instead we rely on `pad-inline-` classes to set inline padding in both directions.

In the 1% of cases where this doesn’t work for you, you can use logical properties instead. Add a class like `pad-inline--custom` and set `--pad-inline--custom: 16px 0` which is equivalent to setting `pad-inline-start`.

## No margins for spacing.

Spritz does not have classes like `mt-4` `ml-2` or `mx-8` which are used heavily in Tailwind to control spacing between elements. Instead, we rely on Flexbox and CSS grid and use gaps. When we find ourselves needing to customize the spacing between two elements, we wrap them.

This can make sense because needing to customize the spacing can be a sign that there is a certain relationship between these two elements, that they “belong together” somehow.

## Layouts

Layouts describe how an element’s children should be displayed on the page.

They describe how children should be laid out across all viewport sizes. They are based on the book [Every Layout](https://every-layout.dev) by Heydon Pickering and Andy Bell. Unless otherwise stated, they’re implemented using Flexbox.

The following layouts are supported (visual examples to be added soon)

- `stack` will stack children on the block axis regardless of screen size. By default children are justified to the start and do not stretch to fill the stack’s width.
  - adding a `split-first` class to a stack that has, say, a minimum height of `100vh` will leave split off the first element from all the others.
  - adding a `split-last` class to a stack will split off the last element.
- `row` will place children in a single row which will not wrap. By default children are center aligned.
  - rows also support the `split-first` and `split-last` classes; they work the same but on the other axis.
- `center-contents` will place children in the vertical and horizontal center of the current element. It’s implemented using Flexbox.
- `cluster` will place things in a row but wrap to multiple rows if they don’t all fit.
- `with-sidebar` is useful for creating layouts where one element is a fixed size and the other one grows to take up all remaining space. It its child has a class of `sidebar` it will be fixed in width, otherwise it grow.
- `switcher` will put things on a row when the parent element is wider than a certain size. You specify the threshold below which children should stack using a `threshold-` class. For example, adding `switcher threshold-120` to the classes will stack children when the element is narrower than 480px and put them in a row otherwise.
- `cover` stacks three children such that the first and last one take up a fixed width and the center one expands to fit the available vertical space. It’s implemented using CSS grid to ensure equal sizes of the first and last children.
- `item-grid` will place children in a grid of equally sized boxes which wrap. It is implemented using CSS Grid. That means that unlike `row`, there is no risk that an orphaned element will take up an entire row. You control the size of the children with an `item-width-` class like `item-grid item-width-40` which would create a grid of items 160 pixels wide.
- `frame` is a parent for images or videos. When smaller, they will be centered within the frame but they will never exceed its bounds. By default frames have an aspect ratio of `16/9` but you can customize this with `aspect--` classes.
- `superimpose` puts a child with the `superimposed` class on top of all other children, in the center of the parent. This can be useful for certain kinds of modals, log in prompts for paywalls and other questionable activities.
- `with-icon` TODO ensure this is implemented correctly and document it.
- `divider` can be used to set up a visual line between elements in a stack or row. TODO make this consistent and document it better.
- `boundary` indicates that children using the `bound` class will be positioned relative to this parent using classes like `block-start-0 inline-start-0`. These are semantic names for `position: relative` and `position: absolute`
- `visually-hidden` hides items but allows screen readers to read them. The `except-on-focus` will show the item when the user has navigated inside it using the keyboard which is handy for skip [navigation links](https://webaim.org/techniques/skipnav/).

One thing to note about these layout classes is they do not work with prefixes. That’s because they are meant to work on all viewport sizes. However, you can always hide them like this:

```
<div class="row below-sm:hidden" />
```

## Layout options

Separate from the layout classes themselves, there’s a set of attributes that let you tweak the layouts to fit your needs.

Gap classes let you specify gaps between the children of a class:

- Numeric classes like `gap-4` or semantic ones like `gap--section` let you specify gaps in both block and inline directions.
- Classes like `gap-inline-4` or `gap-inline--section` specify gaps in the inline direction only.
- Classes like `gap-block-4` or `gap-block--section` specify gaps in the block direction only.

Padding also supports both numeric and semantic clases. For example:

- `pad-8` would set `padding: 32px`
- `pad-inline-8` would set `padding-inline: 32px`
- `pad-block-8` would set `padding-block: 32px`
- `pad--button` would set `padding: var(--pad--button)`
- `pad-inline--button` would set `padding-inline: var(--pad-inline--button)`
- `pad-block--button` would set `padding-block: var(--pad-block--button)`

Alignment classes specify how items are laid out on the block axis. It works by setting the [`align-items`](https://developer.mozilla.org/en-US/docs/Web/CSS/align-items) property.

- `align-start` aligns all children to the start of the block
- `align-end` aligns all children to the end of the block
- `align-center` aligns all children to the center of the block
- `align-stretch` stretches all children so they take up the entire block
- `align-baseline` aligns all children to the text baseline.

Justify classes specify how items are laid out on the inline axis. It works by setting the [`justify-content`](https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content) property.

- `justify-start` justifies all children to the inline start of the element
- `justify-end` justifies all children to the inline end
- `justify-center` justifies all children to the inline center.
- `justify-between` sets the `space-between` value which means there’s equal spacing between children but they sit flush with the edges.
- `justify-around` sets the `space-around` value which means there’s equal spacing between children and half of that spacing is used at the edges.
- `justify-evenly` sets the `space-evenly` value which means that there’s equal spacing between the elements and the same spacing is used at the edges.

Hiding is acomplished with the `hidden` class which sets `display: none`.

Isolation with the `isolate` class creates a context in which all children’s `z-index` properties are evaluated against each other. If, like most of us human beings, you are confused by how z-index works, [this article by Josh Comeau](https://www.joshwcomeau.com/css/stacking-contexts/) is a great resource.

Overflow classes control what happens when an element’s children don’t all fit within the element.

- `overflow-visible` lets the children break outside the bounds
- `overflow-hidden` hides the parts outside the bounds
- `overflow-scroll` always creates scrollbars for the element
- `overflow-auto` only creates scrollbars when the content overflows.

## Dimensions

Dimension classes refer to the size of an element, either on its own or in relation to its siblings.

Inline size classes refer to the inline size of an element. They support both numeric and semantic classes.

- Classes like `min-inline-4` or `min-inline--button` control the minimum inline size of an element.
- Classes like `max-inline-200` or `max-inline--main` control the maximum inline size of an element
- Classes like `inline-100` or `inline--illustration` control the size of the element without letting it grow beyond that point.

One thing to note is numeric classes will constrain the size of an element so that it can’t be wider than the parent element. That is, a class like `min-inline-40` will generate `min-inline-size: min(160px, 100%)`

This prevents creating components that cause your page to scroll horizontally on mobile devices.

Block size classes refer to the inline size of an element. They support both numeric and semantic classes.

- Classes like `min-block-4` or `min-block--button` control the minimum block size of an element.
- Classes like `max-block-200` or `max-block--main` control the maximum block size of an element
- Classes like `block-100` or `block--illustration` control the size of the element without letting it grow beyond that point.

Aspect ratios can be set using predefined and semantic classes:

- `aspect-square` sets a square aspect ratio
- `aspect-video` sets a 16:9 aspect ratio
- `aspect--portrait` would set `aspect-ratio: var(--aspect--portrait);

Since a lot of layout classes use Flexbox under the hood, Spritz defines some classes to help with Flexbox-based layouts. For example:

- `basis-10` would set `flex-basis: 40px`
- `grow-5` would set `flex-grow: 5`
- `grow-max` would set `flex-grow: 9999`
- `shrink-0` would set `flex-shrink: 0`

You can also control the way the dimensions of a box are calculated based on the selected box model:

- `box-content` will set `box-sizing: content-box`
- `box-border` will set `box-sizing: border-box`

## Position

The following classes describe how an element should be positioned:

- `bound` means the element will be positioned relative to a parent `boundary` – it’s a semantic class that sets `position: absolute`
- `static` is the default static positioning
- `relative` sets `position: relative` placing an element relative to where it would have normally been placed
- `fixed` sets `position: fixed`
- `sticky` sets `position: sticky`

These must be used together with classes which describe the actual coordinates. Spritz doesn’t use classes like `top`, `bottom`, `left` or `right`. It opts for [logical properties](https://css-tricks.com/css-logical-properties-and-values/#aa-positioning) instead. For example:

- `block-start-2` would set `inset-block-start: 8px`
- `block-end-2` would set `inset-block-end: 8px`
- `inline-start-2` would set `inset-inline-start: 8px`
- `inline-end-2` would set `inset-inline-end: 8px`
- `block-start--tooltip` would set `inset-block-start: var(--block-start--tooltip)`
- `block-end--tooltip` would set `inset-block-end: var(--block-end--tooltip)`
- `inline-start--tooltip` would set `inset-inline-start: var(--inline-start--tooltip)`
- `inline-end--tooltip` would set `inset-inline-end: var(--inline-end--tooltip)`

Z-index is set with `z-` classes. For example `z-10` will set `z-index: 10`

Order classes determine how elements will be visually ordered:

- `order-2` will set `order: 2`
- `order-first` will make the element first by setting `order: -999`; you should only use this once within a set of siblings
- `order-first` will make the element last by setting `order: 999`; you should only use this once within a set of siblings

## Boxes

Box classes define the visual boxes in which content is displayed. This can apply to buttons, cards, modals or anything with a visible background or borders.

Foreground and background colors are always semantic but they rely on a `--color-` prefix. For example:

- `fg-gray-500` will set `color: var(--color-gray-500)`
- `bg-gray-500` will set `background-color: var(--color-gray-500)`

Opacity is set numerically, as a percentage value. So `opacity-99` would set `opacity: 0.99`

Blur can be set with to pixel value. The greater the value, the blurrier the result. So `blur-1` will set `backdrop-filter: blur(4px)`.

Borders are set with the same color semantic classes used for foreground and background colors. But they can then be customized:

- `border-gray-500` will set `border: solid 1px var(--color-gray-500)`
- `border-2.5` will set `border-width: 2.5px` (this works for anything purely numerical with no letters after `border-`)
- `border-none` will hide the border
- `border-solid` will set a solid border
- `border-dotted` will set a dotted border
- `border-dashed` will set a dashed border
- `border-transparent` will set a transparent border (this can be handy when borders are shown on hover)

The same options are available for outlines by changing `border-` with `outline-`

Shadows are set in a similar way to color. Adding a class of `shadow--sm` will set `box-shadow: var(--shadow--sm)`

## Typography

Spritz does not include a lot of the classes you will find in Tailwind. This is because those classes encouraging thinking of typography in ways that lead to unsatisfying designs. Rather than attempt to poke at pre-determined size and line height classes until something “looks right” you should create your type classes that semantically describe how type should be used. For example:

```css
.type-examples-caption {
  font-weight: 430;
  font-size: 0.875rem;
  line-height: 1.375rem;
  font-feature-settings: "ss02" on, "ss03" on;

  @media (min-width: 30rem) {
    font-size: 1rem;
    line-height: 1.375rem;
  }

  @media (min-width: 60rem) {
    font-weight: 450;
    font-size: 1.125rem;
    line-height: 1.3125rem;
  }
}
```

Notice how in this example:

- Sizes are set in `rem` units as [you should](https://www.joshwcomeau.com/css/surprising-truth-about-pixels-and-accessibility/)
- The font weight is slightly adjusted based on the viewport size. for a variable font in this case
- OpenType font features are set.

By doing all of this in one go, users of this class don’t have to worry about getting 10 things right in tandem.

That said, there are a few knobs you can tweak on the go.

- `weight-700` will set `font-weight: 700` ; useful for the occasional active link or hover variant
- `italic` will set the font style to italic
- `non-italic` will set the font style to normal
- `underline` will decorate the text with an underline
- `line-through` will strike the text through
- `no-line` will not decorate with any line
- `decoration-1.5` will set a `1.5px` line
- `decoration-from-font` will use font data to decide how thick the line should be

There are a few helpers related to wrapping and truncation:

- `no-wrap` will force text not to wrap (should be avoided, but handy when Flexbox is wrapping something against your will)
- `truncate` will truncate text so it doesn’t wrap; best avoided if you can
- `line-clamp-2` will only display the first two lines of your text, truncating afterwards

You can also control the justification of the text:

- `text-start` will justify to the start (which means left for LTR languages and vice-versa)
- `text-end` will justify to the end
- `text-center` will center the text
- `text-justify` will justify along both edges

There are a few options for controlling how list decorations are displayed:

- `list-inside` will set `list-style-position: inside`
- `list-inside` will set `list-style-position: outside`
- `list-none` will set `list-style-type: none`
- `list-disc` will set `list-style-type: disc`
- more to come soon
