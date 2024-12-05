import { union, type Union } from "@prosekit/core";
import {
  defineListItemSpec,
  defineOrderedListSpec,
  defineBulletListSpec,
  type ListItemSpecExtension,
} from "./list-item-spec";

/**
 * @internal
 */
export type ListItemExtension = Union<[ListItemSpecExtension]>;

/**
 * @public
 */
export function defineListItem() {
  return union(defineListItemSpec());
}

export function defineOrderedList() {
  return union(defineOrderedListSpec());
}

export function defineBulletList() {
  return union(defineBulletListSpec());
}
