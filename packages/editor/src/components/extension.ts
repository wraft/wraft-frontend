import type { BasicExtension } from "prosekit/basic";
import { defineBasicExtension } from "prosekit/basic";
import type { Extension, PlainExtension, Union } from "prosekit/core";
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
import type { HolderExtension } from "@extensions/holder";
import { defineHolder } from "@extensions/holder";
import { defineFancyParagraph } from "@extensions/paragraph";
import { defineTextHighlight } from "@extensions/text-highlight";
import {
  defineListItem,
  defineOrderedList,
  defineBulletList,
} from "@extensions/list-item";
import { defineHardBreak } from "@extensions/hard-break";
import type { BlockExtension } from "@extensions/block";
import { defineBlock } from "@extensions/block";
import { defineReadonly } from "prosekit/extensions/readonly";
import type { SignatureExtension } from "@extensions/signature";
import { defineSignature } from "@extensions/signature";
import ImageView from "./image-view";
import SignatureView from "./signature-view";

// import { defineImageFileHandlers } from "./upload-file";
export interface ExtensionProps {
  placeholder: string;
  doc: Y.Doc;
  awareness: Awareness;
  isReadonly: boolean;
}

export interface DefaultExtensionProps {
  placeholder: string;
  isReadonly: boolean;
}

export type BasicsExtension = Union<
  [
    BasicExtension,
    PlainExtension,
    HolderExtension,
    BlockExtension,
    SignatureExtension,
  ]
>;

export function defineDefaultExtension({
  placeholder = "",
  isReadonly = false,
}: DefaultExtensionProps): BasicsExtension {
  const extensions = [
    defineBasicExtension(),
    isReadonly ? undefined : definePlaceholder({ placeholder }),
    defineMention(),
    defineHorizontalRule(),
    defineFancyParagraph(),
    defineHolder(),
    defineTextHighlight(),
    defineListItem(),
    defineOrderedList(),
    defineBulletList(),
    defineHardBreak(),
    defineBlock(),
    defineSignature(),
    isReadonly ? defineReadonly() : undefined,
    defineReactNodeView({
      name: "image",
      component: ImageView satisfies ReactNodeViewComponent,
    }),
    defineReactNodeView({
      name: "signature",
      component: SignatureView satisfies ReactNodeViewComponent,
    }),
  ].filter(Boolean) as Extension[];

  return union(...extensions);
}

export function defineCollaborativeExtension({
  placeholder = "",
  doc,
  awareness,
  isReadonly,
}: ExtensionProps): BasicsExtension {
  return union(
    defineDefaultExtension({ placeholder, isReadonly }),
    defineYjs({ doc, awareness }),
  );
}

export type EditorExtension = ReturnType<typeof defineDefaultExtension>;
