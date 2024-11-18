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
import { defineFancyParagraph } from "../extensions/paragraph";
import { defineHolder } from "../extensions/holder";
// import { defineHolderSpec } from "../extensions/holder/holder-spec";
import ImageView from "./image-view";
import { defineImageFileHandlers } from "./upload-file";

export interface ExtensionProps {
  placeholder: string;
  doc: Y.Doc;
  awareness: Awareness;
}

export function defineExtension({
  placeholder = "",
  doc,
  awareness,
}: ExtensionProps) {
  return union(
    defineBasicExtension(),
    definePlaceholder({ placeholder }),
    defineMention(),
    defineHorizontalRule(),
    defineFancyParagraph(),
    defineHolder(),
    defineReactNodeView({
      name: "image",
      component: ImageView satisfies ReactNodeViewComponent,
    }),
    defineYjs({ doc, awareness }),
    defineImageFileHandlers(),
  );
}

export function schmeaExtension({ placeholder = "" }: ExtensionProps) {
  return union(
    defineBasicExtension(),
    definePlaceholder({ placeholder }),
    defineMention(),
    defineHorizontalRule(),
    defineFancyParagraph(),
    defineHolder(),
    defineReactNodeView({
      name: "image",
      component: ImageView satisfies ReactNodeViewComponent,
    }),
    defineImageFileHandlers(),
  );
}

export type EditorExtension = ReturnType<typeof defineExtension>;
