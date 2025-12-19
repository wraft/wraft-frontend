import { union, type Union } from "@prosekit/core";
import {
  defineConditionalBlockCommands,
  type ConditionalBlockCommandsExtension,
} from "./conditional-block-commands";
import {
  defineConditionalBlockSpec,
  type ConditionalBlockSpecExtension,
} from "./conditional-block-spec";

export type ConditionalBlockExtension = Union<
  [ConditionalBlockSpecExtension, ConditionalBlockCommandsExtension]
>;

/**
 * @public
 */
export function defineConditionalBlock(): ConditionalBlockExtension {
  return union(defineConditionalBlockSpec(), defineConditionalBlockCommands());
}
