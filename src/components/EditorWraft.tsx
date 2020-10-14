import React from 'react';
import { Box } from 'theme-ui';
// import { WysiwygEditor } from '@remirror/react-wysiwyg';
import { MarkdownEditor } from './WraftEditor'

const EditorWraft = (props: any) => {
  return (
    <Box p={0} sx={{ bg: 'blue' }} variant="w100" mt={props?.mt ? props?.mt: 5}>
      <MarkdownEditor {...props}/>
    </Box>
  );
};
export default EditorWraft;
