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

  console.log('[tokens]', tokens);

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
  editor: { manager, state },
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

  console.log('[ContentEditor]', tokens);

  return (
    <Box>
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
            <EditorComponent />
            <HolderSuggestComponent tokens={tokens} />
          </Remirror>
        </ThemeProvider>
      </AllStyledComponent>
    </Box>
  );
}
