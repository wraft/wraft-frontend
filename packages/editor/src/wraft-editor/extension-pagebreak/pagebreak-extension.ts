import type {
  ApplySchemaAttributes,
  CommandFunction,
  InputRule,
  NodeExtensionSpec,
  NodeSpecOverride,
  Transaction,
} from "@remirror/core";
import {
  command,
  ErrorConstant,
  extension,
  ExtensionTag,
  invariant,
  NodeExtension,
  nodeInputRule,
} from "@remirror/core";
import { TextSelection } from "@remirror/pm/state";

export interface PageBreakOptions {
  insertionNode?: string | false;
  pageBreakClass?: string;
}

@extension<PageBreakOptions>({
  defaultOptions: {
    insertionNode: "paragraph",
    pageBreakClass: "page-break-block",
  },
})
export class PageBreakExtension extends NodeExtension<PageBreakOptions> {
  get name() {
    return "pagebreak" as const;
  }

  createTags() {
    return [ExtensionTag.Block];
  }

  createNodeSpec(
    extra: ApplySchemaAttributes,
    override: NodeSpecOverride,
  ): NodeExtensionSpec {
    return {
      ...override,
      attrs: extra.defaults(),
      parseDOM: [
        {
          tag: "div",
          getAttrs: extra.parse,
        },
        ...(override.parseDOM ?? []),
      ],
      toDOM: (node) => {
        const attrs = extra.dom(node);
        attrs.class =
          `${attrs.class || ""} ${this.options.pageBreakClass}`.trim();
        return ["div", attrs, ["span", { class: "page-break" }, "page-break"]];
      },
    };
  }

  @command()
  insertNewpage(): CommandFunction {
    return ({ tr, dispatch }) => {
      const { selection } = tr;
      const { $to } = selection;

      if ($to.parent.type.name === "doc") {
        return false;
      }

      if (!dispatch) {
        return true;
      }

      const pos = $to.end();

      tr.insert(pos, this.type.create());

      const newPos = pos + 1;
      tr.setSelection(TextSelection.near(tr.doc.resolve(newPos)));

      this.insertNodeAfterPageBreak(tr, newPos);

      dispatch(tr.scrollIntoView());

      return true;
    };
  }

  createInputRules(): InputRule[] {
    return [
      nodeInputRule({
        regexp: /\\pagebreak$/,
        type: this.type,
        beforeDispatch: ({ tr }) => {
          const pos = tr.selection.$to.pos;
          this.insertNodeAfterPageBreak(tr, pos);
        },
      }),
    ];
  }

  private insertNodeAfterPageBreak(tr: Transaction, pos: number): void {
    const { insertionNode } = this.options;

    if (!insertionNode) {
      return;
    }

    const type = this.store.schema.nodes[insertionNode];

    invariant(type, {
      code: ErrorConstant.EXTENSION,
      message: `'${insertionNode}' node provided as the insertionNode to the '${this.constructorName}' does not exist.`,
    });

    const node = type.create();
    tr.insert(pos, node);

    tr.setSelection(TextSelection.near(tr.doc.resolve(pos + 1)));
  }
}

declare global {
  namespace Remirror {
    interface AllExtensions {
      newpage: PageBreakExtension;
    }
  }
}
