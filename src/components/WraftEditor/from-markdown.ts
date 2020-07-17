import md from 'markdown-it';
import { MarkdownParser } from 'prosemirror-markdown';

import { EditorSchema } from '@remirror/core';

const getOrder = (tok:any) => {
  const m = tok.attrGet('order');
  return parseInt(m)
}

const getTitle = (tok:any) => {
  return tok.attrGet('title') ? tok.attrGet('title'): null;
}

// const findAlt = (tok:any) => {
//   return tok.children[0] && tok.children[0].content || null
// }

/**
 * Parses markdown content into a ProsemirrorNode compatible with the provided schema.
 */
export const fromMarkdown = (markdown: string, schema: EditorSchema) =>
  new MarkdownParser(schema, md('commonmark'), {
    blockquote: { block: 'blockquote' },
    paragraph: { block: 'paragraph' },
    list_item: { block: 'listItem' },
    bullet_list: { block: 'bulletList' },
    ordered_list: {
      block: 'orderedList',      
      // @ts-ignore
      getAttrs: tok => ({ order: getOrder(tok) }),
    },
    heading: { block: 'heading', getAttrs: tok => ({ level: +tok.tag.slice(1) }) },
    code_block: { block: 'codeBlock' },
    fence: { block: 'codeBlock', getAttrs: tok => ({ language: tok.info }) },
    hr: { node: 'horizontalRule' },
    image: {
      node: 'blockr',
      getAttrs: tok => ({
        src: tok.attrGet('src'),
        title: tok.attrGet('title') ? tok.attrGet('title') : null,
        alt: tok.children[0] && tok.children[0].content || null,
      }),
    },
    hardbreak: { node: 'hardBreak' },
    holder: {
      node: 'holder',
      getAttrs: tok => ({
        m: console.log('tok', tok),
        named: tok.attrGet('named'),
        name: tok.attrGet('name'),
      }),
    },
    table: { node: 'table' },
    tableRow: { node: 'tableRow' },
    tableCell: { node: 'tableCell' },
    em: { mark: 'italic' },
    strong: { mark: 'bold' },
    link: {
      mark: 'link',
      getAttrs: tok => ({
        href: tok.attrGet('href'),
        title: getTitle(tok),
      }),
    },
    code_inline: { mark: 'code' },
  }).parse(markdown);
