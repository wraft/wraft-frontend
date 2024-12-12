import { union, type Union } from "@prosekit/core";
import {
  defineTextHighlightSpec,
  type TextHighlightSpec,
} from "./text-highlight-spec";

/**
 * @internal
 */
export type TextHighlightExtension = Union<[TextHighlightSpec]>;

/**
 * @public
 */
export function defineTextHighlight() {
  return union(defineTextHighlightSpec());
}
