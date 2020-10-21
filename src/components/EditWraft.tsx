import React from 'react';
import { Box } from 'theme-ui';
import Editor from 'rich-markdown-editor';

const RichEditorWraft = (_props: any) => {
  const onChange = (_x: any) => {
    console.log('x', _x);
  };
  return (
    <Box p={0}>
      <Editor id="ProfileEdit" onChange={onChange} defaultValue="Hello world!" />
    </Box>
  );
};
export default RichEditorWraft;
