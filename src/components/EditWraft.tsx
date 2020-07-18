import React from 'react';
import { Box } from 'rebass';
// import { WysiwygEditor } from '@remirror/react-wysiwyg';
import Editor from 'rich-markdown-editor';

const RichEditorWraft = (_props: any) => {
  const onChange = (x: any) => {
    console.log('x', x);
  };
  return (
    <Box p={0} width={1} mt={4}>
      <Editor onChange={onChange} defaultValue="Hello world!" />
    </Box>
  );
};
export default RichEditorWraft;
