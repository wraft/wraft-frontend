import React, { FC, useCallback, useState, useEffect, useMemo } from 'react';
import { RemirrorJSON, getTheme } from 'remirror';
import { BlockquoteExtension } from '@remirror/extension-blockquote';
import { BoldExtension } from '@remirror/extension-bold';
import { ItalicExtension } from '@remirror/extension-italic';
import { ParagraphExtension } from '@remirror/extension-paragraph';
import { StrikeExtension } from '@remirror/extension-strike';
import { UnderlineExtension } from '@remirror/extension-underline';
import { HeadingExtension } from '@remirror/extension-heading';
import { HardBreakExtension } from '@remirror/extension-hard-break';
import { TableExtension } from '@remirror/extension-tables';
import { ImageExtension } from '@remirror/extension-image';
import { MarkdownExtension } from '@remirror/extension-markdown';

import { css } from '@emotion/css';

import { isBoolean, Cast } from '@remirror/core';

import { ResolvedPos } from 'prosemirror-model';

import {
  BulletListExtension,
  ListItemExtension,
  OrderedListExtension,
} from '@remirror/extension-list';
import 'remirror/styles/all.css';
import { AllStyledComponent } from '@remirror/styles/emotion';
import { HolderAtomExtension } from './holder/holder-atom';

// import { IdentifierSchemaAttributes } from 'remirror';

import {
  // MentionAtomPopupComponent,
  Toolbar,
  // useCommands,
} from '@remirror/react';

import { HolderAtomPopupComponent } from './holder/holder-popover';

import {
  EditorComponent,
  Remirror,
  ThemeProvider,
  useRemirror,
} from '@remirror/react';

import { Box } from 'theme-ui';

// import { HolderExtension } from "./holder";

import toolbarItems from './toolbar';
import { MentionAtomExtension } from 'remirror/extensions';
// import { HolderPopupComponent  } from "./holder/holderPopup";

const hasCursor = <T extends object>(
  arg: T,
): arg is T & { $cursor: ResolvedPos } => {
  return isBoolean(Cast(arg).$cursor);
};

interface EditorProps {
  starter?: any;
  onFetch?: Function;
  onSave?: Function;
  initialValue?: any;
  insertable?: any;
  token?: any;
  onUpdate?: any;
  editable?: boolean;
  ready?: boolean;
  variables?: any;
  cleanInsert?: boolean;
  showToolbar?: boolean;
  searchables?: any;
}

/**
 *
 * @param tokens All insertable tokens listed
 * @returns
 */
function HolderSuggestComponent({ tokens }: any) {
  const [mentionState, setMentionState] = useState<any>();
  // const commands = useCommands();

  const items = useMemo(() => {
    const allItems = tokens;

    if (!allItems) {
      return [];
    }

    const query = mentionState?.query?.full.toLowerCase() ?? '';
    return allItems
      .filter((item: any) => item.label.toLowerCase().includes(query))
      .sort();
  }, [mentionState, tokens]);

  return <HolderAtomPopupComponent onChange={setMentionState} items={items} />;
}

/**
 * Generic Editor built for Wraft
 * @param param0
 * @returns
 */

const EditorWraft: FC<EditorProps> = ({
  cleanInsert,
  // variables,
  starter,
  // insertable,
  token,
  onUpdate,
  editable,
  // ready,
  showToolbar = false,
  searchables,
}) => {
  const [docState, setDocState] = useState<RemirrorJSON>();
  const [loaded, setLoaded] = useState<boolean>(false);

  const [fieldtokens, setFieldtokens] = useState<any>([]);
  // const [search, setSearch] = useState('');

  useEffect(() => {
    console.log('🎃🎃 searchables', docState);
  }, [docState]);

  /**
   * Document variables
   */
  useEffect(() => {
    if (searchables?.fields) {
      // console.log('🎃🎃 searchables', searchables);
      const { fields } = searchables;

      if (fields.length > 0) {
        const results = fields.map((sr: any) => {
          return {
            id: `${sr.id}`,
            label: `${sr.name}`,
            name: `${sr.name}`,
          };
        });
        setFieldtokens(results);
      }
    }
  }, [searchables]);

  // const { mentionAtomExtension } = getMentionExtension();
  const createExtensions = useCallback(() => {
    return [
      new BoldExtension({}),
      new HeadingExtension({ levels: [1, 2, 3, 4, 5, 6] }),
      new ItalicExtension(),
      new UnderlineExtension(),
      new StrikeExtension(),
      new ParagraphExtension(),
      new BlockquoteExtension(),
      new HardBreakExtension(),
      new ListItemExtension({}),
      new BulletListExtension({}),
      new OrderedListExtension(),
      new TableExtension(),
      new MarkdownExtension({}),
      new ImageExtension(),
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
      // new MentionAtomExtension({ extraAttributes: {} }),

      new MentionAtomExtension({
        disableDecorations: false,
        matchers: [
          {
            name: 'mentionAtom',
            char: '@',
            matchOffset: 0,
            mentionClassName: 'mention-class-name',
            suggestClassName: 'sugget-class-name',
          },
        ],
      }),
    ];
  }, []);

  const { manager, getContext } = useRemirror({
    extensions: createExtensions,
  });

  const handleChange = useCallback(
    ({ state }) => {
      const ctx = getContext();
      const md = ctx?.helpers.getMarkdown();
      const obj = {
        md,
        body: state.toJSON().doc,
      };

      onUpdate(obj);
    },
    [setDocState],
  );

  /**
   * Document variables
   */
  useEffect(() => {
    if (!loaded && starter) {
      console.log('🎃🎃', starter, starter?.content?.length);
    }
  }, [starter]);

  /**
   * [Insertable] Tokens
   */
  useEffect(() => {
    setLoaded(false);

    if (token && cleanInsert) {
      console.log('🧶 [content] [useEff] TOKEN', token);

      let mxt;
      if (!token?.type) {
        mxt = JSON.parse(token.data) || token.data;
      } else {
        mxt = token;
      }
      const wview = manager.view;
      const wstate = wview.state;

      if (mxt) {
        console.log('mxt', mxt);
        const node = wstate?.schema?.nodeFromJSON(mxt);
        const { selection } = wstate;
        const position = hasCursor(selection)
          ? selection.$cursor.pos
          : selection.$to.pos;

        if (wview.dispatch) {
          wview.dispatch(wstate.tr.insert(position, node));
        }
        setLoaded(true);
      }
    }

    if (!cleanInsert && token) {
      console.log('🧶 🧶 [content] C', token);
      getContext()?.setContent(token);
      setLoaded(true);
    }
  }, [token]);

  return (
    <Box
      variant="styles.editorBody2"
      sx={{
        mx: 'auto',
        whiteSpace: 'pre-wrap',
        boxShadow: 'none',
        mt: 0,
        lineHeight: 1.5,
        fontSize: 2,
        m: 0,
        px: 4,
        '.remirror-toolbar': {
          bg: 'gray.0',
        },
        '.remirror-role': {
          bg: 'gray.0',
          color: 'gray.9',
        },
        '&.remirror-editor': {
          bg: 'blue',
          p: 5,
        },
        '.remirror-editor': {
          p: 5,
          bg: 'blue',
        },
      }}>
      <AllStyledComponent>
        <ThemeProvider>
          <Remirror
            manager={manager}
            onChange={handleChange}
            editable={editable}
            classNames={[
              css`
              .remirror-theme .ProseMirror {
                background: red !important;
              }
              &.ProseMirror { 
                width: 100%;
                
                padding: 100px;
                box-shadow: none !important;
                .remirror-role {
                  background: #000 !important;
                } 

                p:hover {
                  color: #000;
                }

                .holder {
                  border-bottom:solid 2px #39bf3f;
                  // background-color: #f1f7d498;
                  font-style: normal;
                  color: #022203;  
                  font-weight: 900;
                  margin-right: 4px;
                  margin-left: 4px;
                }
                
                .no-holder {
                  border-bottom:solid 2px #926666;
                  margin-right: 6px; */
                  // background-color: #f1f7d4;
                  font-style: normal;
                  color: #9e0909;  
                }
                p,
                h3,
                h4 {
                  margin-top: ${getTheme((t) => t.space[2])};
                  margin-bottom: ${getTheme((t) => t.space[2])};
                }
                h1,
                h2 {
                  margin-bottom: ${getTheme((t) => t.space[3])};
                  margin-top: ${getTheme((t) => t.space[3])};
                }
              }
            `,
            ]}>
            {showToolbar ? (
              <Toolbar items={toolbarItems} refocusEditor label="Top Toolbar" />
            ) : (
              ''
            )}
            <EditorComponent />
            <HolderSuggestComponent tokens={fieldtokens} />
          </Remirror>
        </ThemeProvider>
      </AllStyledComponent>
    </Box>
  );
};

export default EditorWraft;
