import { union, type Union } from "@prosekit/core";
import {
  defineHardBreakSpec,
  type HardBreakSpecExtension,
} from "./hard-break-spec";

/**
 * @internal
 */
export type HardBreakExtension = Union<[HardBreakSpecExtension]>;

/**
 * @public
 */
export function defineHardBreak() {
  return union(defineHardBreakSpec());
}
