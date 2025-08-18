import { forwardRef } from 'react';
import { Editor } from '@wraft/editor';
import type { NodeJSON } from '@wraft/editor';

import '@wraft/editor/style.css';
import { envConfig } from 'utils/env';

type EditorProps = {
  defaultContent?: NodeJSON;
  isReadonly?: boolean;
  tokens?: any;
  collabData?: any;
  isCollaborative?: boolean;
};

const EditorWrapper = forwardRef<any, EditorProps>(
  ({ isReadonly, defaultContent, ...rest }: EditorProps, ref) => {
    return (
      <Editor
        defaultContent={defaultContent}
        isReadonly={isReadonly}
        apiHost={envConfig.API_HOST}
        {...rest}
        ref={ref}
      />
    );
  },
);

EditorWrapper.displayName = 'EditorWrapper';

export default EditorWrapper;
