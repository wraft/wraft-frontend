import { defineBasicExtension } from "prosekit/basic";
import { union } from "prosekit/core";
import { defineHorizontalRule } from "prosekit/extensions/horizontal-rule";
import { defineMention } from "prosekit/extensions/mention";
import { definePlaceholder } from "prosekit/extensions/placeholder";
import {
  defineReactNodeView,
  type ReactNodeViewComponent,
} from "prosekit/react";
import { defineYjs } from "prosekit/extensions/yjs";
import type { Awareness } from "y-protocols/awareness";
import type * as Y from "yjs";
import { defineHolder } from "@extensions/holder";
import { defineFancyParagraph } from "@extensions/paragraph";
// import { defineHolderSpec } from "@extensions/holder/holder-spec";
import { defineTextHighlight } from "@extensions/text-highlight";
import {
  defineListItem,
  defineOrderedList,
  defineBulletList,
} from "@extensions/list-item";
import { defineHardBreak } from "@extensions/hard-break";
import ImageView from "./image-view";
import { defineImageFileHandlers } from "./upload-file";

export interface ExtensionProps {
  placeholder: string;
  doc: Y.Doc;
  awareness: Awareness;
}

export interface DefaultExtensionProps {
  placeholder: string;
}

export function defineDefaultExtension({
  placeholder = "",
}: DefaultExtensionProps) {
  return union(
    defineBasicExtension(),
    definePlaceholder({ placeholder }),
    defineMention(),
    defineHorizontalRule(),
    defineFancyParagraph(),
    defineHolder(),
    defineTextHighlight(),
    defineListItem(),
    defineOrderedList(),
    defineBulletList(),
    defineHardBreak(),
    defineReactNodeView({
      name: "image",
      component: ImageView satisfies ReactNodeViewComponent,
    }),
    defineImageFileHandlers(),
  );
}

export function defineCollaborativeExtension({
  placeholder = "",
  doc,
  awareness,
}: ExtensionProps) {
  return union(
    defineDefaultExtension({ placeholder }),
    defineYjs({ doc, awareness }),
  );
}

// export type EditorExtension = ReturnType<typeof defineExtension>;
