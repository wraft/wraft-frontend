import { getNodeType, union, type PlainExtension } from "@prosekit/core";
import {
  defineMarkInputRule,
  defineInputRule,
  defineTextBlockInputRule,
} from "prosekit/extensions/input-rule";
import { InputRule, textblockTypeInputRule } from "@prosekit/pm/inputrules";

export function defineHolderInputRule() {
  return defineInputRule(
    new InputRule(/\[([^\]]+)\]$/, (state, match, from) => {
      console.log("Match:", match);
      // console.log("Start:", start, "End:", end);
      const href = match[1];
      if (!href) return null;

      const mark = state.schema.marks.link.create({ href });
      return state.tr.addMark(from, from + href.length, mark).insertText(" ");
    }),
  );
}

// export function defineHolderInputRule() {
//   return defineTextBlockInputRule({
//     regex: /\[([^\]]+)\]$/,
//     type: "holder",
//     attrs: {
//       named: "ee",
//       name: "eewew",
//       mentionTag: "ee",
//       id: "333e",
//       label: "dd",
//     },
//   });
// }

// export function defineHolderInputRule() {
//   return defineInputRule(
//     new InputRule(/\[([^\]]+)\]$/, (state, match, start, end) => {
//       if (!match) return null;

//       const { tr, schema } = state;
//       console.log("schema", schema);
//       return tr;
//     })
//   );
// }
