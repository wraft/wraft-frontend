import React from 'react';
import { Box } from 'rebass';
// import { WysiwygEditor } from '@remirror/react-wysiwyg';
import WraftEditor from './WraftEditor'

const EditorWraft = () => {
  return (
    <Box p={0} width={1} mt={4}>
      <WraftEditor/>
    </Box>
  );
};
export default EditorWraft;
