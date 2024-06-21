import { AnyExtension, ExtensionPriority } from 'remirror';
import {
  BlockquoteExtension,
  BoldExtension,
  BulletListExtension,
  CodeExtension,
  HardBreakExtension,
  HeadingExtension,
  ItalicExtension,
  LinkExtension,
  ListItemExtension,
  MarkdownExtension,
  OrderedListExtension,
  PlaceholderExtension,
  StrikeExtension,
  TextHighlightExtension,
  TrailingNodeExtension,
  TableExtension,
  HorizontalRuleExtension
} from 'remirror/extensions';

import { HolderAtomExtension } from './extension-holder/holder-extension';
import { PageBreakExtension } from './extension-pagebreak/pagebreak-extension';
/**
 * A list of allowed Remirror Extensions
 */
const extensions =
  (placeholder: string = '') =>
  (): Array<AnyExtension> => [
    new BoldExtension({}),
    new ItalicExtension(),
    new HeadingExtension({}),
    new CodeExtension(),
    new BlockquoteExtension(),
    new LinkExtension({ autoLink: true }),
    new StrikeExtension(),
    new BulletListExtension({ enableSpine: true }),
    new OrderedListExtension(),
    new ListItemExtension({
      priority: ExtensionPriority.High,
      enableCollapsible: true,
    }),
    new TrailingNodeExtension({}),
    new MarkdownExtension({
      copyAsMarkdown: false,
    }),
    new HardBreakExtension(),
    new TextHighlightExtension({}),
    new PlaceholderExtension({
      placeholder,
    }),
    new HolderAtomExtension({
      extraAttributes: {
        named: '',
        name: '',
        mentionTag: 'holder',
      },
      matchers: [
        { name: 'holder', char: '@', appendText: ' ', matchOffset: 0 },
      ],
    }),
    new TableExtension({}),
    new HorizontalRuleExtension({}),
    new PageBreakExtension({}),
  ];

export default extensions;
