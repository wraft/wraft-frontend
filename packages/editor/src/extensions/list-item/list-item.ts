import { union, type Union } from "@prosekit/core";
import {
  defineListItemSpec,
  // defineOrderedListSpec,
  // defineBulletListSpec,
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
// export type ListItemExtension = Union<[ListItemSpecExtension]>;

/**
 * @public
 */
// export function defineListItem() {
//   return union(defineListItemSpec());
// }

// export function defineOrderedList() {
//   return union(defineOrderedListSpec());
// }

// export function defineBulletList() {
//   return union(defineBulletListSpec());
// }

// export function defineListItemKeymap() {
//   return union(defineListItemKeymap());
// }

/**
 * @internal
 */
// export type ListExtension = Union<[ListSpecExtension, ListCommandsExtension]>

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
    // defineOrderedListSpec(),
    // defineBulletListSpec(),
    defineListItemKeymap(),
    defineListItemCommands(),
  );
}
