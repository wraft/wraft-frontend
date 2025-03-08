import { getNodeType, union, type PlainExtension } from "@prosekit/core";
import { InputRule } from "@prosekit/pm/inputrules";
import { defineInputRule } from "prosekit/extensions/input-rule";

/**
 * @public
 */
export function definePageBreakInputRule(): PlainExtension {
  return union(
    defineInputRule(
      new InputRule(/^---$/, (state, match, start, end) => {
        const { schema } = state;
        const { tr } = state;
        const type = getNodeType(schema, "pageBreak");
        const node = type.createChecked();
        tr.delete(start, end).insert(start - 1, node);
        return tr.scrollIntoView();
      }),
    ),
  );
}
