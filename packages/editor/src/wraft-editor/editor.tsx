import { useState, useMemo } from 'react';

import {
  EditorComponent,
  Remirror,
  ReactExtensions,
  UseRemirrorReturn,
  ThemeProvider,
} from '@remirror/react';
import { AllStyledComponent } from '@remirror/styles/emotion';
import { AnyExtension, RemirrorEventListener } from 'remirror';
import { Box } from 'theme-ui';

import { HolderAtomPopupComponent } from './extension-holder/holder-popover';
import { Toolbar } from './toolbar';
import { TableComponents } from '@remirror/extension-react-tables';

export interface ContentState {
  readonly doc?: string;
  readonly content?: any;
}
/**
 * Suggetion Component for Holder
 * @param tokens All insertable tokens listed
 * @returns
 */
const HolderSuggestComponent = ({ tokens }: any) => {
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
};

/**
 * Content Editor Component
 * @param param0
 * @returns
 */
export function ContentEditor({
  editor: { manager, state, getContext },
  onChange,
  editable,
  tokens,
}: {
  editor: UseRemirrorReturn<ReactExtensions<AnyExtension>>;
  onChange: RemirrorEventListener<AnyExtension>;
  editable: boolean;
  tokens: any;
}) {
  const theme = {
    fontFamily: {
      default: 'Georgia,serif',
    },
  };

  return (
    <Box
      sx={{
        '.remirror-editor-wrapper': {
          pt: 1,
        },
        '.remirror-theme .ProseMirror': {
          borderRadius: '0 0 6px 6px',
        },
        '.remirror-theme .ProseMirror:focus': {
          boxShadow: 'var(--theme-ui-colors-blue-100) 0px 0px 1px 0.2em',
        },
        '.remirror-theme': {
          borderRadius: '6px',
          padding: 0,
          border: 'solid 1px',
          borderColor: 'var(--theme-ui-colors-gray-700)'
        },
        'hr.pagebreak-': {
          color: 'blue',
          background: '#d3ead3',
          height: '0.5rem',
          border: 0,
          marginTop: '1rem',
          marginBottom: '1rem',
        },
        '.remirror-editor table': {
          my: 2,
        },
        
        '.remirror-editor th': {
          textAlign: 'left',          
          paddingTop: '0px',
          margin: 0,
          background: 'var(--theme-ui-colors-gray-300)'
        },

        '.remirror-editor tr td': {
          textAlign: 'left',
          paddingLeft: '15px',
          paddingTop: '0px',
          margin: 0,
        },
        '.remirror-table-tbody-with-controllers>tr:nth-of-type(n + 2) th': {
          paddingLeft: '15px',
        },
        '.remirror-table-tbody-with-controllers th.remirror-table-controller': {

        }
      }}>
      <AllStyledComponent theme={theme}>
        <ThemeProvider
          theme={{
            color: {
              // outline: 'soli',
              // border: 'solid 1px #eee',
              text: 'none',
              primary: '#999',
            },
            boxShadow: {
              1: 'none',
              2: 'none',
              3: 'none',
            },
            space: {
              1: '1rem',
              2: '16px',
              3: '2rem',
            },
          }}>
          <Remirror
            manager={manager}
            state={state}
            onChange={onChange}
            editable={editable}>
            {editable && <Toolbar />}
            <EditorComponent />
            <HolderSuggestComponent tokens={tokens} />
            <TableComponents/>
          </Remirror>
        </ThemeProvider>
      </AllStyledComponent>
    </Box>
  );
}
