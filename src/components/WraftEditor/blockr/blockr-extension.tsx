import { ResolvedPos } from "prosemirror-model";

import {
  Attrs,
  Cast,
  CommandNodeTypeParams,
  NodeExtension,
  NodeExtensionSpec,
  ProsemirrorCommandFunction,
  bool,
  isElementDOMNode,
} from "@remirror/core";

import { createBlockrExtensionPlugin } from "./blockr-plugin";
import { getAttrs } from "./blockr-utils";

const hasCursor = <T extends object>(
  arg: T
): arg is T & { $cursor: ResolvedPos } => {
  return bool(Cast(arg).$cursor);
};

export class BlockrExtension extends NodeExtension {
  get name() {
    return "blockr" as const;
  }

  get schema(): NodeExtensionSpec {
    return {
      inline: true,
      attrs: {
        ...this.extraAttrs(null),
        align: { default: null },
        alt: { default: "" },
        crop: { default: null },
        height: { default: null },
        width: { default: null },
        rotate: { default: null },
        src: { default: null },
        title: { default: "" },
      },
      group: "inline",
      draggable: true,
      parseDOM: [
        {
          tag: "img[src]",
          getAttrs: (domNode) =>
            isElementDOMNode(domNode)
              ? getAttrs(this.getExtraAttrs(domNode))
              : {},
        },
      ],
      toDOM: (node) => {
        const klass = { ...node.attrs, class: "img-blockr" };
        return ["img", klass];
      },
    };
  }

  public commands({ type }: CommandNodeTypeParams) {
    return {
      insertBlockr: (attrs?: Attrs): ProsemirrorCommandFunction => (
        state,
        dispatch
      ) => {
        const n = type.create(attrs);
        const { selection } = state;
        const position = hasCursor(selection)
          ? selection.$cursor.pos
          : selection.$to.pos;

        if (dispatch) {
          dispatch(state.tr.insert(position, n));
        }
        return true;
      },
      insertBlock: (attrs?: Attrs): ProsemirrorCommandFunction => (
        state,
        dispatch
      ) => {
        const node = state.schema.nodeFromJSON(attrs && attrs.data);
        const { selection } = state;
        const position = hasCursor(selection)
          ? selection.$cursor.pos
          : selection.$to.pos;

        if (dispatch) {
          dispatch(state.tr.insert(position, node));
        }

        return true;
      },
    };
  }

  public plugin() {
    return createBlockrExtensionPlugin();
  }
}
