import { toggleMark } from 'prosemirror-commands';

import {
  CommandMarkTypeParams,
  ExtensionManagerMarkTypeParams,
  KeyBindings,
  MarkExtension,
  MarkExtensionSpec,
  MarkGroup,
  convertCommand,
  markInputRule,
  markPasteRule,
} from '@remirror/core';
import { createVaryExtensionPlugin } from './vary-plugin';

export class VaryExtension extends MarkExtension {
  get name() {
    return 'vary' as const;
  }

  get schema(): MarkExtensionSpec {
    const extras = { class: 'vary', "vary-type": "basic"}
    return {
      attrs: {
        name: { default: 'x' },
        named: { default: 'x' },
      },
      group: MarkGroup.FontStyle,
      parseDOM: [{ tag: 'i' }, { tag: 'em' }, { tag: 'em[vary-type]' }],      
      toDOM: () => ['em', extras],
    };
  }

  public keys({ type }: ExtensionManagerMarkTypeParams): KeyBindings {
    return {
      'Mod-m': convertCommand(toggleMark(type)),
    };
  }

  public commands({ type }: CommandMarkTypeParams) {
    return { 
      vary: () => toggleMark(type),
    };
  }

  public inputRules({ type }: ExtensionManagerMarkTypeParams) {
    return [markInputRule({ regexp: /(?:^|[^*_])(?:\*|_)([^*_]+)(?:\*|_)$/, type })];
  }

  public pasteRules({ type }: ExtensionManagerMarkTypeParams) {      
    return [markPasteRule({ regexp: /(?:^|[^*_])(?:\*|_)([^*_]+)(?:\*|_)/g, type })];
  }

  public plugin() {
    return createVaryExtensionPlugin();
  }
}
