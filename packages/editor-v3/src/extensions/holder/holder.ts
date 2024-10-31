import { union, type Union } from "@prosekit/core";
import { defineHolderCommands } from "./holder-commands";
import { defineHolderInputRule } from "./holder-input-rule";
// import { defineHolderKeymap } from "./holder-keymap";
import { defineHolderSpec, type HolderSpecExtension } from "./holder-spec";

/**
 * @internal
 */
export type HolderExtension = Union<[HolderSpecExtension]>;

/**
 * @public
 */
export function defineHolder() {
  return union(
    defineHolderSpec(),
    defineHolderCommands(),
    defineHolderInputRule(),
  );
  // return union(
  //   defineHolderSpec()
  //   // defineHolderCommands(),
  //   // defineHolderKeymap(),
  //   // defineHolderInputRule()
  // );
}
