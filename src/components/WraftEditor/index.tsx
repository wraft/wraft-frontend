/** @jsx jsx */

import { jsx } from '@emotion/core';
import { FC, Fragment, useEffect, useMemo, useState } from 'react';
import bash from 'refractor/lang/bash';
import markdown from 'refractor/lang/markdown';
import tsx from 'refractor/lang/tsx';
import typescript from 'refractor/lang/typescript';

import {
  EditorState,
  ExtensionManager,
  ExtensionsFromManager,
  ProsemirrorNode,
  RemirrorContentType,
  SchemaFromExtensions,
  SchemaParams,
  createDocumentNode,
  isObjectNode,
  isProsemirrorNode,
  isString,
  Cast,
  bool,
} from '@remirror/core';
import {
  BlockquoteExtension,
  BoldExtension,
  BulletListExtension,
  CodeExtension,
  HardBreakExtension,
  HeadingExtension,
  HorizontalRuleExtension,
  ItalicExtension,
  LinkExtension,
  ListItemExtension,
  OrderedListExtension,
  PlaceholderExtension,
  baseExtensions,
} from '@remirror/core-extensions';
import { CodeBlockExtension } from '@remirror/extension-code-block';
import { ImageExtension } from '@remirror/extension-image';

import {
  TableExtension,
  TableRowExtension,
  TableCellExtension,
} from '@remirror/extension-tables';

import {
  RemirrorProvider,
  RemirrorProviderProps,
  RemirrorStateListenerParams,
} from '@remirror/react';

import { fromMarkdown } from './from-markdown';
import { toMarkdown } from './to-markdown';

import { HolderExtension } from './holder';
import { BlockrExtension } from './blockr';

import { ResolvedPos } from 'prosemirror-model';

/**
 * The props which are passed to the internal RemirrorProvider
 */
export type InternalEditorProps = Omit<
  RemirrorProviderProps,
  'childAsRoot' | 'children'
>;

const hasCursor = <T extends object>(
  arg: T,
): arg is T & { $cursor: ResolvedPos } => {
  return bool(Cast(arg).$cursor);
};

const useWysiwygManager = () => {
  return useMemo(
    () =>
      ExtensionManager.create([
        ...baseExtensions,
        new CodeBlockExtension({
          supportedLanguages: [markdown, bash, tsx, typescript],
        }),
        new PlaceholderExtension(),
        new LinkExtension(),
        new BoldExtension(),
        new ItalicExtension(),
        new HeadingExtension(),
        new BlockquoteExtension(),
        new ImageExtension(),
        new BulletListExtension(),
        new ListItemExtension(),
        new OrderedListExtension(),
        new HorizontalRuleExtension(),
        new HardBreakExtension(),
        new CodeExtension(),

        new TableExtension(),
        new TableRowExtension(),
        new TableCellExtension(),
        // extention
        new HolderExtension(),
        new BlockrExtension(),
      ]),
    [],
  );
};

const WysiwygEditor: FC<InternalEditorProps> = ({ children, ...props }) => {
  return (
    <RemirrorProvider {...props} childAsRoot={true}>
      <div>{children}</div>
    </RemirrorProvider>
  );
};

interface CreateInitialContentParams extends SchemaParams {
  /** The content to render */
  content: RemirrorContentType;
}

/**
 * Allows the initial content passed down to the editor to be flexible. It can
 * receive the initial content as a string (markdown) or the wysiwyg content as a ProsemirrorNode / ObjectNode
 * - markdown string
 * - prosemirror node
 * - object node (json)
 */
const createInitialContent = ({
  content,
  schema,
}: CreateInitialContentParams): Content => {
  if (isString(content)) {
    return {
      markdown: content,
      wysiwyg: fromMarkdown(content, schema),
    };
  }

  if (isProsemirrorNode(content)) {
    return {
      markdown: toMarkdown(content),
      wysiwyg: content,
    };
  }

  if (!isObjectNode(content)) {
    throw new Error('Invalid content passed into the editor');
  }

  const pmNode = createDocumentNode({ content, schema });

  return {
    markdown: toMarkdown(pmNode),
    wysiwyg: pmNode,
  };
};

interface MarkdownEditorProps {
  initialValue?: RemirrorContentType;
  editor: EditorDisplay;
  value?: string;
  onUpdate: any;
  token?: any;
  insertable?: any;
  editable?: boolean;
  cleanInsert?: Boolean;
}

export type EditorDisplay = 'markdown' | 'wysiwyg';

interface Content {
  markdown: string;
  wysiwyg: ProsemirrorNode;
}

export const MarkdownEditor: FC<MarkdownEditorProps> = ({
  initialValue = '',
  onUpdate,
  token,
  children,
  insertable,
  cleanInsert = false,
  editable = false,
}) => {
  const wysiwygManager = useWysiwygManager();

  type WysiwygExtensions = ExtensionsFromManager<typeof wysiwygManager>;
  type WysiwygSchema = SchemaFromExtensions<WysiwygExtensions>;

  const initialContent = createInitialContent({
    content: initialValue,
    schema: wysiwygManager.schema,
  });

  const [wysiwygEditorState, setWysiwygEditorState] = useState<
    EditorState<WysiwygSchema>
  >();

  const onWysiwygStateChange = ({
    newState,
    tr,
  }: RemirrorStateListenerParams<WysiwygExtensions>) => {
    setWysiwygEditorState(newState);

    if (tr && tr.docChanged) {
      // temporary state
      const md: any = toMarkdown(newState.doc);
      console.debug('md', md);
      const contentBody = { md, serialized: JSON.stringify(newState.doc) };
      onUpdate(contentBody);
      return;
    }
  };

  const updateBody = (body: any) => {
    const state = wysiwygManager.createState({
      content: body,
    });
    setWysiwygEditorState(state);
  };

  /** if value is changed */
  useEffect(() => {
    if (token) {
      console.log('TOKEN', token);
      const attrs = { class: 'x', data: token };

      //
      const wview = wysiwygManager.view;
      const wstate = wview.state;

      // ----
      const node = wstate.schema.nodeFromJSON(attrs && attrs.data);
      const { selection } = wstate;
      const position = hasCursor(selection)
        ? selection.$cursor.pos
        : selection.$to.pos;

      if (wview.dispatch) {
        wview.dispatch(wstate.tr.insert(position, node));
      }
    }
  }, [token]);

  /**
   * Insert to a position or end of Doc
   */

  useEffect(() => {
    if (insertable) {
      const wview = wysiwygManager.view;
      const wstate = wview.state;
      const node = wstate.schema.nodeFromJSON(insertable);
      const { selection } = wstate;
      const position = hasCursor(selection)
        ? selection.$cursor.pos
        : selection.$to.pos;

      if (cleanInsert) {
        updateBody(insertable);
      } else {
        if (wview.dispatch) {
          wview.dispatch(wstate.tr.insert(position, node));
        }
      }
    }
  }, [insertable]);

  return (
    <Fragment>
      <div>
        <WysiwygEditor
          manager={wysiwygManager}
          initialContent={initialContent.wysiwyg}
          value={wysiwygEditorState}
          editable={editable}
          onStateChange={onWysiwygStateChange}>
          {children}
        </WysiwygEditor>
      </div>
    </Fragment>
  );
};
