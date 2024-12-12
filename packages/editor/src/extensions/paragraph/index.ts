import { defineNodeSpec } from "prosekit/core";

/**
 * Return an extension that defines a paragraph type with custom styles.
 */
// export function defineFancyParagraph() {
//   return defineNodeSpec({
//     name: 'paragraph',
//     content: 'inline*',
//     group: 'block',
//     parseDOM: [{ tag: 'p' }],
//     toDOM() {
//       return ['p', { class: 'fancy-paragraph' }, 0]
//     },
//   })
// }

export function defineFancyParagraph() {
  return defineNodeSpec({
    name: "fancyparagraph",
    content: "inline*",
    group: "block",
    parseDOM: [
      {
        tag: "p",
        getAttrs: (node) => ({
          class:
            node instanceof HTMLElement ? node.getAttribute("class") : null,
          "data-id":
            node instanceof HTMLElement ? node.getAttribute("class") : null,
        }),
      },
    ],
    attrs: {
      class: { default: "fancy-paragraph my-class" },
      id: { default: null },
    },
    toDOM(node) {
      return [
        "p",
        { class: node.attrs.class, "data-id": node.attrs.class },
        [
          "p",
          { class: node.attrs.class },
          ["p", { class: node.attrs.class }, 0],
        ],
      ];
    },
  });
}
