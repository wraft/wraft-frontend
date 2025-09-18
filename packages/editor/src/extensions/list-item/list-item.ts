import { union, type Union } from "@prosekit/core";
import {
  defineListItemSpec,
  type ListItemSpecExtension,
} from "./list-item-spec";
import { defineListItemKeymap } from "./list-item-keymap";
import {
  defineListItemCommands,
  type ListItemCommandsExtension,
} from "./list-item-commands";

/**
 * @internal
 */
export type ListItemExtension = Union<
  [ListItemSpecExtension, ListItemCommandsExtension]
>;

/**
 * @public
 */
export function defineList(): ListItemExtension {
  return union(
    defineListItemSpec(),
    defineListItemKeymap(),
    defineListItemCommands(),
  );
}
