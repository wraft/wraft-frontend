import { defineNodeSpec, type Extension } from "@prosekit/core";

/**
 * @public
 */
export interface SignatureAttrs {
  src?: string | null;
  width?: number | null;
  height?: number | null;
  placeholder?: boolean | null;
  counterparty?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

/**
 * @internal
 */
export type SignatureSpecExtension = Extension<{
  Nodes: {
    signature: SignatureAttrs;
  };
}>;

/**
 * @internal
 */
export function defineSignatureSpec(): SignatureSpecExtension {
  return defineNodeSpec({
    name: "signature",
    attrs: {
      src: { default: null },
      width: { default: null },
      height: { default: null },
      placeholder: { default: null },
      counterparty: { default: null },
    },
    group: "block",
    defining: true,
    draggable: true,
    parseDOM: [
      {
        tag: "img[src]",
        getAttrs: (element): SignatureAttrs => {
          if (typeof element === "string") {
            return { src: null };
          }

          const src = element.getAttribute("src") || null;

          let width: number | null = null;
          let height: number | null = null;

          const rect = element.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            width = rect.width;
            height = rect.height;
          } else if (
            element instanceof HTMLImageElement &&
            element.naturalWidth > 0 &&
            element.naturalHeight > 0
          ) {
            width = element.naturalWidth;
            height = element.naturalHeight;
          }
          return { src, width, height };
        },
      },
    ],
    toDOM(node) {
      const attrs = node.attrs as SignatureAttrs;
      return ["img", { ...attrs, class: "signature-form" }];
    },
  });
}
