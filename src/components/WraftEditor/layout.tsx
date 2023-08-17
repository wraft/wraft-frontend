import React, { FC, useCallback, useState, useEffect, useMemo } from 'react';
import { RemirrorJSON } from 'remirror';
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

// import { CountExtension } from '@remirror/extension-count';

import { css } from '@emotion/css';

import { isBoolean, Cast } from '@remirror/core';

import { ResolvedPos } from 'prosemirror-model';

// import { ArrowsAngleContract } from '@styled-icons/bootstrap/ArrowsAngleContract';
// import { ArrowsAngleExpand } from '@styled-icons/bootstrap/ArrowsAngleExpand';
import { ArrowMinimize as ArrowsAngleContract } from '@styled-icons/fluentui-system-filled/ArrowMinimize';
import { ArrowMaximize as ArrowsAngleExpand } from '@styled-icons/fluentui-system-filled/ArrowMaximize';
// import { ListOl } from '@styled-icons/boxicons-regular/ListOl';
import { Close as CloseIcon } from '@styled-icons/evil/Close';
import { TaskListLtr } from '@styled-icons/fluentui-system-filled/TaskListLtr';

import {
  BulletListExtension,
  ListItemExtension,
  OrderedListExtension,
} from '@remirror/extension-list';

import 'remirror/styles/all.css';
// import { AllStyledComponent } from '@remirror/styles/emotion';
import { HolderAtomExtension } from './holder/holder-atom';

// import { IdentifierSchemaAttributes } from 'remirror';

import { HolderAtomPopupComponent } from './holder/holder-popover';

import {
  EditorComponent,
  Remirror,
  ThemeProvider,
  useRemirror,
} from '@remirror/react';

import { Box, Button } from 'theme-ui';

// const WordsCounter = () => {
//   const { getWordCount } = useHelpers(true);
//   const count = getWordCount();

//   return (
//     <div
//       sx={{
//         mr: 0,
//         ml: 'auto',
//         textAlign: 'right',
//         '.remirror-theme h3': {
//           fontSize: 1,
//           m: 0,
//           color: 'red.3',
//           margin: '0 !important',
//         },
//       }}>
//       <Text
//         as="span"
//         sx={{
//           fontWeight: 100,
//           letterSpacing: '0.2px',
//           fontSize: '12px',
//           padding: `0 important!`,
//           m: 0,
//           mr: 2,
//         }}>
//         Words
//       </Text>
//       <Text
//         as="span"
//         sx={{
//           fontWeight: 400,
//           fontSize: '16px',
//           lineHeight: 1,
//           // pb: 2,
//           padding: `0 important!`,
//           m: 0,
//         }}>
//         {count}
//       </Text>
//     </Div>
//   );
// };
// import { HolderExtension } from "./holder";

// import toolbarItems from './toolbar';
import { MentionAtomExtension } from 'remirror/extensions';
// import { HolderPopupComponent  } from "./holder/holderPopup";

// eslint-disable-next-line @typescript-eslint/ban-types
const hasCursor = <T extends object>(
  arg: T,
): arg is T & { $cursor: ResolvedPos } => {
  return isBoolean(Cast(arg).$cursor);
};

interface EditorProps {
  starter?: any;
  // eslint-disable-next-line @typescript-eslint/ban-types
  onFetch?: Function;
  // eslint-disable-next-line @typescript-eslint/ban-types
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

interface outlineP {
  type?: string;
  body?: string;
  vista?: any;
  onGo?: any;
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
  const [viewPortal, setViewPortal] = useState<boolean>(false);

  const [fieldtokens, setFieldtokens] = useState<any>([]);
  const [outline, setOutline] = useState<Array<outlineP>>([]);
  const [showoutline, setShowOutline] = useState<boolean>(false);

  const getSummary = () => {
    const res = Array.from(
      document
        .querySelector('.ProseMirror')
        ?.querySelectorAll<HTMLElement>('h1,h2,h3,h4,h5') || [],
      (section: any) => ({
        type: section.tagName.toLowerCase(),
        body: section.textContent,
        vista: scrollY + innerHeight >= section.offsetTop,
        onGo: () => scrollTo({ top: section.offsetTop - 74 }),
      }),
    );

    console.log('ProseMirror', res);
    setOutline(res);
  };

  useEffect(() => {
    console.log('[docState]', docState);
  }, [docState]);

  /**
   * Document variables
   */
  useEffect(() => {
    if (searchables?.fields) {
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
  const createExtensions: any = useCallback(() => {
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
      // new CountExtension({}),
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
    ({ state }: any) => {
      const ctx = getContext();
      const md = ctx?.helpers.getMarkdown();
      const obj = {
        md,
        body: state.toJSON().doc,
      };

      onUpdate(obj);

      getSummary();
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

  const toggleView = () => {
    console.log('viewPortal A', viewPortal);
    setViewPortal(!viewPortal);
    console.log('viewPortal B', viewPortal);
  };

  return (
    <Box
      variant="styles.editorBody2"
      sx={{
        position: 'relative',
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
      <div>{showToolbar}</div>
      <div>
        <div>
          <div>
            <div>
              {/* <Text variant="labelcaps">Outline</Text> */}
              <Button
                type="button"
                variant="btnSecondary"
                sx={{
                  py: 0,
                  mr: 1,
                  ml: 'auto',
                  border: 'solid 1px',
                  borderColor: 'gray.3',
                  // color: 'gray.6',
                }}
                onClick={() => setShowOutline(!showoutline)}>
                <CloseIcon width={12} />
              </Button>
            </div>

            {outline &&
              outline.length > 0 &&
              outline.map((o: outlineP, index: any) => (
                <div key={index}>
                  <Box onClick={o.onGo}>{o.body}</Box>
                </div>
              ))}
          </div>
        </div>
        <ThemeProvider>
          <Remirror
            manager={manager}
            onChange={handleChange}
            editable={editable}
            classNames={[
              css`
              &.ProseMirror { 
                width: 100%;
                
                padding: 100px;
                box-shadow: none !important;
                .remirror-role {
                  background: #000 !important;
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
                  
                }
                h1,
                h2 {
                  
                }
              }
            `,
            ]}>
            {/* {showToolbar ? (
              <Toolbar items={toolbarItems} refocusEditor label="Top Toolbar" />
            ) : (
              ''
            )} */}
            <div>
              <div>
                <button
                  type="button"
                  // variant="btnSecondary"
                  // sx={{
                  //   py: 0,
                  //   mr: 1,
                  //   px: 2,
                  //   border: 'solid 1px',
                  //   borderColor: 'gray.3',
                  //   // color: 'gray.6',
                  // }}
                  onClick={() => setShowOutline(!showoutline)}>
                  <TaskListLtr width={16} />
                </button>
                <button
                  type="button"
                  // variant="btnSecondary"
                  // sx={{
                  //   py: 0,
                  //   mr: 1,
                  //   ml: 'auto',
                  //   border: 'solid 1px',
                  //   borderColor: 'gray.3',
                  //   // color: 'gray.6',
                  // }}
                  // sx={{ py: 0 }}
                  onClick={() => toggleView()}>
                  {viewPortal ? (
                    <ArrowsAngleExpand width={12} />
                  ) : (
                    <ArrowsAngleContract width={12} />
                  )}
                </button>
              </div>
              <div>{/* <WordsCounter /> */}</div>
            </div>
            <div>
              <EditorComponent />
            </div>

            <HolderSuggestComponent tokens={fieldtokens} />
          </Remirror>
        </ThemeProvider>
      </div>
    </Box>
  );
};

export default EditorWraft;
