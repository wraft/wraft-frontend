import { forwardRef } from 'react';
import dynamic from 'next/dynamic';
// import { Editor } from '@wraft/editor';
import { Box } from 'theme-ui';

const Editor = dynamic(() => import('./WrappedEditor'), {
  ssr: false,
});

export interface EditorWrapperProps {
  children: React.ReactNode;
}

type EditorProps = {
  defaultValue: any;
  onUpdate: any;
  tokens: any;
  editable: boolean;
  insertable: any;
  onceInserted: any;
};

const NoEditorWrapper = forwardRef(
  (
    {
      editable,
      defaultValue,
      onUpdate,
      insertable,
      onceInserted,
      tokens,
    }: EditorProps,
    ref,
  ) => {
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
          fontSize: 3,
          m: 0,
          px: 1,
          '.remirror-toolbar': {
            bg: 'gray.0',
          },
          '.remirror-role': {
            bg: 'gray.0',
            color: 'gray.9',
          },
          '&.remirror-editor': {
            bg: 'blue',
            p: 0,
          },
          '.remirror-editor': {
            p: 0,
            bg: 'red.2',
          },
          '.hidden': {
            display: 'none',
          },
          '.holder': {
            bg: '#9df5e366',
            padding: '2px 4px',
            borderBottom: 'solid 2px #70d4bf',
            borderRadius: '3px',
            color: '#0b2e27',
          },
          '.no-holder': {
            padding: '2px 4px',
            borderBottom: 'solid 2px #70d4bf',
            borderRadius: '3px',
            bg: '#f3781261',
            color: '#5f3614e6',
          },
          '.remirror-mention-atom-popup-wrapper': {
            boxShadow: '2px 3px 14px 0px rgba(0, 0, 0, 0.16)',
            border: 'solid 1px',
            borderColor: 'gray.100',
            bg: 'gray.200',
          },
          '.remirror-mention-atom-popup-highlight': {
            bg: 'white',
          },
        }}>
        <Editor
          editable={editable}
          defaultValue={defaultValue}
          onUpdate={onUpdate}
          tokens={tokens}
          insertable={insertable}
          onInserted={onceInserted}
          editorRef={ref}
        />
      </Box>
    );
  },
);

NoEditorWrapper.displayName = 'EditorWrapper';

export default NoEditorWrapper;
