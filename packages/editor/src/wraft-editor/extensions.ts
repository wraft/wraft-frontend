import type { AnyExtension } from "remirror";
import { ExtensionPriority } from "remirror";
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
  HorizontalRuleExtension,
} from "remirror/extensions";
import { TableExtension } from "@remirror/extension-react-tables";
import { HolderAtomExtension } from "./extension-holder/holder-extension";
import { PageBreakExtension } from "./extension-pagebreak/pagebreak-extension";
import { SlashExtension } from "./extensions/slash";

// import { CountExtension } from '@remirror/extension-count';
/**
 * A list of allowed Remirror Extensions
 */
const extensions =
  (placeholder = "") =>
  (): AnyExtension[] => [
    new BoldExtension({}),
    new ItalicExtension(),
    new HeadingExtension({}),
    new CodeExtension(),
    // new CountExtension(),
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
        named: "",
        name: "",
        mentionTag: "holder",
      },
      matchers: [
        { name: "holder", char: "@", appendText: " ", matchOffset: 0 },
      ],
    }),
    new SlashExtension({
      extraAttributes: { type: "user" },
      matchers: [{ name: "slash", char: "/", appendText: " ", matchOffset: 0 }],
    }),

    new TableExtension({}),
    new HorizontalRuleExtension({}),
    new PageBreakExtension({}),
  ];

export default extensions;
