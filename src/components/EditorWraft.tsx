import React from 'react';
import { Box } from 'rebass';
// import { WysiwygEditor } from '@remirror/react-wysiwyg';
import { MarkdownEditor } from './WraftEditor'

const EditorWraft = (props: any) => {
  return (
    <Box p={0} width={1} mt={4}>
      <MarkdownEditor {...props}/>
    </Box>
  );
};
export default EditorWraft;
