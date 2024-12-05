import { union, type Union } from "@prosekit/core";
import {
  defineBlockCommands,
  type BlockCommandsExtension,
} from "./block-commands";

/**
 * @internal
 */
export type BlockExtension = Union<[BlockCommandsExtension]>;

/**
 * @public
 */
export function defineBlock() {
  return union(defineBlockCommands());
}
