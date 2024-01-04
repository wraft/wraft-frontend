import React from 'react';

import { Box } from 'theme-ui';

import MarkdownEditor from './layout';

const WraftEditor = (props: any) => {
  return (
    <Box p={0} variant="layout.w100" mt={props?.mt ? props?.mt : 2}>
      <MarkdownEditor {...props} />
    </Box>
  );
};
export default WraftEditor;
