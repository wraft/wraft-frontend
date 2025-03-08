import { union, type Union } from "@prosekit/core";
import {
  definePageBreakCommands,
  type PageBreakCommandsExtension,
} from "./page-break-commands";
import { definePageBreakInputRule } from "./page-break-input-rule";
import {
  definePageBreakSpec,
  type PageBreakSpecExtension,
} from "./page-break-spec";

export type PageBreakExtension = Union<
  [PageBreakSpecExtension, PageBreakCommandsExtension]
>;

/**
 * @public
 */
export function definePageBreak(): PageBreakExtension {
  return union(
    definePageBreakSpec(),
    definePageBreakInputRule(),
    definePageBreakCommands(),
  );
}
