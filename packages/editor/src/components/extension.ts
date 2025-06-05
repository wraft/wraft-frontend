import type { BasicExtension } from "prosekit/basic";
import { defineBasicExtension } from "prosekit/basic";
import {
  union,
  type Extension,
  type PlainExtension,
  type Union,
} from "prosekit/core";
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
import { defineReadonly } from "prosekit/extensions/readonly";
import type { HolderExtension } from "@extensions/holder";
import { defineHolder } from "@extensions/holder";
import { defineFancyParagraph } from "@extensions/paragraph";
import { defineTextHighlight } from "@extensions/text-highlight";
import {
  defineListItem,
  defineOrderedList,
  defineBulletList,
} from "@extensions/list-item";
import { defineShiftEnterHardBreak } from "@extensions/hard-break";
import type { BlockExtension } from "@extensions/block";
import { defineBlock } from "@extensions/block";
import type { SignatureExtension } from "@extensions/signature";
import { defineSignature } from "@extensions/signature";
import type { PageBreakExtension } from "@extensions/page-break";
import { definePageBreak } from "@extensions/page-break";
import ImageView from "./image-view";
import SignatureView from "./signature-view";
import type { SignersConfig } from "./live-editor";

// import { defineImageFileHandlers } from "./upload-file";
export interface ExtensionProps {
  placeholder: string;
  doc: Y.Doc;
  awareness: Awareness;
  isReadonly: boolean;
  signersConfig?: SignersConfig;
}

export interface DefaultExtensionProps {
  placeholder: string;
  isReadonly: boolean;
  signersConfig?: SignersConfig;
}

export type BasicsExtension = Union<
  [
    BasicExtension,
    PlainExtension,
    HolderExtension,
    BlockExtension,
    SignatureExtension,
    PageBreakExtension,
  ]
>;

export function defineDefaultExtension({
  placeholder = "",
  isReadonly = false,
  signersConfig,
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
    defineShiftEnterHardBreak(),
    defineBlock(),
    defineSignature(),
    definePageBreak(),
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
  signersConfig,
}: ExtensionProps): BasicsExtension {
  return union(
    defineDefaultExtension({ placeholder, isReadonly, signersConfig }),
    defineYjs({ doc, awareness }),
  );
}

export type EditorExtension = ReturnType<typeof defineDefaultExtension>;
