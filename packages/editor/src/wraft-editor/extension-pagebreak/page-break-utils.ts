// import { ExtensionHorizontalRuleMessages as Messages } from '@remirror/messages';

export const insertPageBreakOptions: Remirror.CommandDecoratorOptions = {
  icon: 'separator',
  label: ({ t }) => t("Pandoc Pagebreak"),
  description: ({ t }) => t("Pandoc Compatiable Pagebreak"),
};