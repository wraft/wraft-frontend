import React, { useCallback } from 'react';
import { BoldExtension } from 'remirror/extension/bold';
import { RemirrorProvider, useManager, useRemirror } from 'remirror/react';
import { Box, Button } from 'theme-ui';

import { Bold } from '@styled-icons/boxicons-regular'

const Editor = () => {
  const { getRootProps, commands } = useRemirror();

  const toggleBold = useCallback(() => {
    commands.toggleBold();
  }, [commands]);

  return (
    <Box>
      <Button
        type="button"
        bg="#000"
        onClick={toggleBold}
        style={{ fontWeight: false ? 'bold' : undefined }}>
        <Bold width={16} height={16}/>
      </Button>
      <Box {...getRootProps()} />
    </Box>
  );
};

const EditorWrapper = () => {
  const manager = useManager([new BoldExtension()]);
  
  const onChange = (data: any) => {
    console.log('data', data)
  }
  
  return (
    <Box>
      <RemirrorProvider manager={manager} onChange={onChange}>
        <Editor />
      </RemirrorProvider>
    </Box>
  );
};

export default EditorWrapper;
