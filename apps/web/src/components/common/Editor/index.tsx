import { Editor } from '@wraft/editor';
import dynamic from 'next/dynamic';
import { Box } from 'theme-ui';

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

const NoEditorWrapper = ({
  editable,
  defaultValue,
  onUpdate,
  insertable,
  onceInserted,
  tokens,
}: EditorProps) => {
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
          bg: 'blue.3',
        },
        '.no-holder': {
          bg: 'green',
        },
      }}>
      <Editor
        editable={editable}
        defaultValue={defaultValue}
        onUpdate={onUpdate}
        tokens={tokens}
        insertable={insertable}
        onInserted={onceInserted}
      />
    </Box>
  );
};

NoEditorWrapper.displayName = 'EditorWrapper';

// export it with SSR disabled
const EditorWrapper = dynamic(() => Promise.resolve(NoEditorWrapper), {
  ssr: false,
});

export default EditorWrapper;
