/** @jsx jsx */

import { jsx } from '@emotion/core';
import { FC, Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import bash from 'refractor/lang/bash';
import markdown from 'refractor/lang/markdown';
import tsx from 'refractor/lang/tsx';
import typescript from 'refractor/lang/typescript';

import {
  DocExtension,
  EditorState,
  ExtensionManager,
  ExtensionsFromManager,
  ProsemirrorNode,
  RemirrorContentType,
  SchemaFromExtensions,
  SchemaParams,
  StringHandlerParams,
  TextExtension,
  createDocumentNode,
  isObjectNode,
  isProsemirrorNode,
  isString,
  Cast,
  bool,
} from '@remirror/core';
import {
  BaseKeymapExtension,
  BlockquoteExtension,
  BoldExtension,
  BulletListExtension,
  CodeExtension,
  CompositionExtension,
  GapCursorExtension,
  HardBreakExtension,
  HeadingExtension,
  HistoryExtension,
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
// import { MenuBar } from './menu';

/**
 * The props which are passed to the internal RemirrorProvider
 */
export type InternalEditorProps = Omit<
  RemirrorProviderProps,
  'childAsRoot' | 'children'
>;

const useMarkdownManager = () => {
  return useMemo(
    () =>
      ExtensionManager.create([
        { priority: 1, extension: new DocExtension({ content: 'block' }) },
        {
          priority: 1,
          extension: new CodeBlockExtension({
            defaultLanguage: 'markdown',
            toggleType: 'codeBlock',
          }),
        },
        { priority: 1, extension: new TextExtension() },
        { extension: new CompositionExtension(), priority: 3 },
        { extension: new HistoryExtension(), priority: 3 },
        { extension: new GapCursorExtension(), priority: 10 },
        { extension: new BaseKeymapExtension(), priority: 10 },
        { extension: new TableExtension() },
        { extension: new TableRowExtension() },
        { extension: new TableCellExtension() },
      ]),
    [],
  );
};

const InternalMarkdownEditor: FC<InternalEditorProps> = props => {
  return (
    <RemirrorProvider {...props} childAsRoot={true}>
      <div />
    </RemirrorProvider>
  );
};

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

// const Loading = () => <p>Loading...</p>

interface Content {
  markdown: string;
  wysiwyg: ProsemirrorNode;
}

/**
 * Transform a markdown content string into a Prosemirror node within a codeBlock editor instance
 */
const markdownStringHandler: StringHandlerParams['stringHandler'] = ({
  content: markdownContent,
  schema,
}) => {
  return schema.nodes.doc.create(
    {},
    schema.nodes.codeBlock.create(
      { language: 'markdown' },
      markdownContent ? schema.text(markdownContent) : undefined,
    ),
  );
};

const useDebounce = (fn: () => any, ms: number = 0, args: any[] = []) => {
  useEffect(() => {
    const handle = setTimeout(fn.bind(null, args), ms);

    return () => {
      // if args change then clear timeout
      clearTimeout(handle);
    };
  }, [args, fn, ms]);
};

export const MarkdownEditor: FC<MarkdownEditorProps> = ({
  value = '',
  initialValue = '',
  onUpdate,
  editor,
  token,
  children,
  insertable,
  cleanInsert = false,
  editable = false,
}) => {
  const wysiwygManager = useWysiwygManager();
  const markdownManager = useMarkdownManager();

  type WysiwygExtensions = ExtensionsFromManager<typeof wysiwygManager>;
  type WysiwygSchema = SchemaFromExtensions<WysiwygExtensions>;
  type MarkdownExtensions = ExtensionsFromManager<typeof markdownManager>;
  type MarkdownSchema = SchemaFromExtensions<MarkdownExtensions>;

  const initialContent = createInitialContent({
    content: initialValue,
    schema: wysiwygManager.schema,
  });
  const [markdownEditorState, setMarkdownEditorState] = useState<
    EditorState<MarkdownSchema>
  >();
  const [markdownParams, setMarkdownParams] = useState<
    Pick<RemirrorStateListenerParams<MarkdownExtensions>, 'getText' | 'tr'>
  >({ getText: () => initialContent.markdown });
  const [wysiwygEditorState, setWysiwygEditorState] = useState<
    EditorState<WysiwygSchema>
  >();

  const updateWysiwygFromMarkdown = useCallback(
    (md: string) => {
      const state = wysiwygManager.createState({
        content: fromMarkdown(md, wysiwygManager.schema),
      });
      setWysiwygEditorState(state);
    },
    [wysiwygManager],
  );

  const updateMarkdownFromWysiwyg = useCallback(
    (doc: ProsemirrorNode) =>
      setMarkdownEditorState(
        markdownManager.createState({
          content: toMarkdown(doc),
          stringHandler: markdownStringHandler,
        }),
      ),
    [markdownManager],
  );

  useDebounce(
    () => {
      const { tr, getText } = markdownParams;
      if (tr && tr.docChanged) {
        updateWysiwygFromMarkdown(getText());
        return;
      }
    },
    500,
    [markdownParams.getText, markdownParams.tr],
  );

  const onMarkdownStateChange = ({
    newState,
    getText,
    tr,
  }: RemirrorStateListenerParams<MarkdownExtensions>) => {
    setMarkdownParams({ getText, tr });
    setMarkdownEditorState(newState);
  };

  const onWysiwygStateChange = ({
    newState,
    tr,
  }: RemirrorStateListenerParams<WysiwygExtensions>) => {
    setWysiwygEditorState(newState);

    if (tr && tr.docChanged) {
      updateMarkdownFromWysiwyg(newState.doc);

      // temporary state
      const md: any = toMarkdown(newState.doc);
      const contentBody = { md, serialized: JSON.stringify(newState.doc) };
      onUpdate(contentBody);
      return;
    }
  };

  useEffect(() => {
    if (editor === 'markdown') {
      markdownManager.view.focus();
    }

    if (editor === 'wysiwyg') {
      wysiwygManager.view.focus();
    }
  }, [editor, markdownManager.view, wysiwygManager.view]);

  const updateBody = (body: any) => {
    // console.log('updating body', body);
    const state = wysiwygManager.createState({
      content: body,
    });
    setWysiwygEditorState(state);
  };

  /** if value is changed */
  useEffect(() => {
    // updateBody(value);
    // console.log('LOG_BODY', value);
  }, [value]);

  // useEffect(() => {
  //   if(editable === false) {
  //     const newState = wysiwygManager.view
  //     newState.editable = false;
  //     console.log('not editable')
  //   }
  // }, [editable]);

  /** if value is changed */
  useEffect(() => {
    if (token) {
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

  useEffect(() => {
    if (insertable) {
      const wview = wysiwygManager.view;
      const wstate = wview.state;

      // ----
      const node = wstate.schema.nodeFromJSON(insertable);
      const { selection } = wstate;
      const position = hasCursor(selection)
        ? selection.$cursor.pos
        : selection.$to.pos;

      // if not clean insert
      console.log('cleanInsert', cleanInsert);
      
      if (cleanInsert) {
        updateBody(insertable);
      } else {
        if (wview.dispatch) {
          wview.dispatch(wstate.tr.insert(position, node));
        }
      }
    }
  }, [insertable]);

  // const [activateLink] = useState<any>(false);

  // const activateImage = () => {

  // }

  return (
    <Fragment>
      <div style={{ display: editor === 'markdown' ? 'block' : 'none' }}>
        <InternalMarkdownEditor
          manager={markdownManager}
          initialContent={initialContent.markdown}
          stringHandler={markdownStringHandler}
          value={markdownEditorState}
          onStateChange={onMarkdownStateChange}
          editable={editable}
        />
      </div>
      <div style={{ display: editor === 'wysiwyg' ? 'block' : 'none' }}>
        <WysiwygEditor
          manager={wysiwygManager}
          initialContent={initialContent.wysiwyg}
          value={wysiwygEditorState}
          editable={editable}
          onStateChange={onWysiwygStateChange}>
          {/* {editable && <MenuBar activateLink={activateLink} />} */}
          {children}
        </WysiwygEditor>
      </div>
    </Fragment>
  );
};
