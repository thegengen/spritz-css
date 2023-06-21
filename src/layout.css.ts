/*
  The layout stuff is my own reimplementation of Every Layout by Heydon Pickering.
  It's meant to be minimal and rely on atomic CSS for configuring items.

  It also has a couple of additions (center-contents, row).
*/

export default `
.stack {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.stack.split-first > :first-child {
  margin-block-end: auto;
}

.stack.split-last > :last-child {
  margin-block-start: auto;
}

.row {
  display: flex;
  align-items: center;
}

.row.split-first > :first-child {
  margin-inline-end: auto;
}

.row.split-last > :last-child {
  margin-inline-start: auto;
}

.center {
  box-sizing: content-box;
  margin-inline: auto;
}

.cluster {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}

.cluster.split-first > :first-child {
  margin-inline-end: auto;
}

.cluster.split-last > :last-child {
  margin-inline-start: auto;
}

.center-contents {
  display: flex;
  align-items: center;
  justify-content: center;
}

.with-sidebar {
  display: flex;
  flex-wrap: wrap;
}

.with-sidebar > .sidebar {
  flex-grow: 1;
}

.with-sidebar > :not(.sidebar) {
  flex-basis: 0;
  flex-grow: 999;
}

.switcher {
  display: flex;
  flex-wrap: wrap;
}

.switcher > * {
  flex-grow: 1;
  flex-basis: calc((var(--spritz--threshold) - 100%) * 999);
}

.cover {
  display: grid;
  grid-template-rows: 1fr auto 1fr;
}

.cover > :nth-child(2) {
  display: grid;
  align-content: center;
}

.item-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(var(--spritz--item-width), 100%), 1fr));
}

.frame {
  aspect-ratio: var(16 / 9);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.frame > img,
.frame > video {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}

.superimpose {
  position: relative;
}

.superimposed {
  position: absolute;
  background-color: inherit;
  inset-block-start: 50%;
  inset-inline-start: 50%;
  transform: translate(-50%, -50%);
}

.with-icon {
  display: inline-flex;
  align-items: center;
  line-height: 1;
}

.divider {
  align-self: stretch;
  flex-grow: 0;
}

.divider:last-child {
  display: none;
}

.boundary {
  position: relative;
}

.visually-hidden:not(.except-on-focus),
.visually-hidden.except-on-focus:not(:focus-within) {
  position: absolute;
  overflow: hidden;
  clip: rect(0 0 0 0);
  height: 1px;
  width: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
}
`;
