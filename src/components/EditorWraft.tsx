import React from 'react';
import { Box } from 'theme-ui';
// import { WysiwygEditor } from '@remirror/react-wysiwyg';
import { MarkdownEditor } from './WraftEditor'

const EditorWraft = (props: any) => {
  return (
    <Box p={0} variant="layout.w100" bg="gray.0" mt={props?.mt ? props?.mt : 2}>
      <MarkdownEditor {...props} />
    </Box>
  );
};
export default EditorWraft;
