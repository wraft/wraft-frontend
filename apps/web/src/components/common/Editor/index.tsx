import { forwardRef } from 'react';
import { Editor } from '@wraft/editor-v3';
import type { NodeJSON } from '@wraft/editor-v3';
import '@wraft/editor-v3/style.css';

type EditorProps = {
  defaultContent?: NodeJSON;
  isReadonly?: boolean;
  tokens?: any;
};

const EditorWrapper = forwardRef(
  ({ isReadonly, defaultContent, ...rest }: EditorProps, ref) => {
    return (
      <Editor
        defaultContent={defaultContent}
        isReadonly={isReadonly}
        {...rest}
        ref={ref}
      />
    );
  },
);

EditorWrapper.displayName = 'EditorWrapper';

export default EditorWrapper;
