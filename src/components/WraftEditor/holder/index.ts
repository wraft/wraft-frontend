import {
  NodeExtension,
  NodeExtensionSpec,
} from '@remirror/core';

// import { getAttrs } from './image-utils';

export class HolderExtension extends NodeExtension {
  get name() {
    return 'holder' as const;
  }
  get schema(): NodeExtensionSpec {
    return {
      inline: true,
      attrs: {
        ...this.extraAttrs(null),
        name: { default: null },
        named: { default: null },
      },
      group: "inline",
      draggable: true,
      parseDOM: [
        {
          tag: 'em',
          getAttrs: _domNode => {
            const extras = { class : "holder"}
            return ["em", extras, 0]
          },          
        },
      ],
      toDOM(node) {
        const kclass = node.attrs.named ? 'holder' : 'no-holder'
        const extras = { class : kclass, ...node.attrs, holder: kclass}
        const value = node.attrs.named ? node.attrs.named : node.attrs.name
        return ['em', extras, value];
      },
    };
  }
}