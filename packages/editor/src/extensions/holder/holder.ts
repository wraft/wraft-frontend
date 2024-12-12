import { union, type Union } from "@prosekit/core";
import type { HolderCommandsExtension } from "./holder-commands";
import { defineHolderCommands } from "./holder-commands";
import { defineHolderSpec, type HolderSpecExtension } from "./holder-spec";

/**
 * @internal
 */
export type HolderExtension = Union<
  [HolderSpecExtension, HolderCommandsExtension]
>;

/**
 * @public
 */
export function defineHolder() {
  return union(defineHolderSpec(), defineHolderCommands());
}
