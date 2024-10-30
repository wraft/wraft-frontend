import { defineBasicExtension } from "prosekit/basic";
import { union } from "prosekit/core";
import {
  defineCodeBlock,
  defineCodeBlockShiki,
} from "prosekit/extensions/code-block";
import { defineHorizontalRule } from "prosekit/extensions/horizontal-rule";
import { defineMention } from "prosekit/extensions/mention";
import { definePlaceholder } from "prosekit/extensions/placeholder";
import {
  defineReactNodeView,
  type ReactNodeViewComponent,
} from "prosekit/react";
import { defineFancyParagraph } from "../extensions/paragraph";
import ImageView from "./image-view";
import { defineImageFileHandlers } from "./upload-file";

export function defineExtension({ placeholder }: any) {
  return union(
    defineBasicExtension(),
    definePlaceholder({ placeholder }),
    defineMention(),
    defineCodeBlock(),
    defineCodeBlockShiki(),
    defineHorizontalRule(),
    defineFancyParagraph(),
    defineReactNodeView({
      name: "image",
      component: ImageView satisfies ReactNodeViewComponent,
    }),
    defineImageFileHandlers(),
  );
}

export type EditorExtension = ReturnType<typeof defineExtension>;
