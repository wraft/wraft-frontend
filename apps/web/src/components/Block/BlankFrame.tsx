import React from 'react';
import { Box, Flex, Text } from '@wraft/ui';
import styled from '@emotion/styled';

export interface IPage {
  showFull?: boolean;
  children: any;
  id?: string;
  noSide?: boolean;
  inner?: any;
}

export interface IAlert {
  appearance?: any;
  children: any;
  inner?: any;
}

export const EditorContent = styled(Box)`
  .ProseMirror p {
    mb: '1',
    pb: '4',
  }
`;
export const Page = ({ children, inner }: IPage) => {
  return (
    <>
      <Flex flexDirection="column" minHeight="100vh">
        <Flex flex="1" flexDirection={['column', 'row']}>
          <EditorContent flex="1" bg="background-secondary" minWidth="0">
            {inner && <Box minHeight="100vh">{inner}</Box>}

            {children}
            <Flex pt="sm" position="absolute" bottom="0" w="100%">
              <Text fontSize="xs" p="4" color="text-primary">
                Wraft v0.3.0
              </Text>
              <Box ml="auto" flexDirection={['column', 'column']}></Box>
            </Flex>
          </EditorContent>
        </Flex>
      </Flex>
    </>
  );
};

export default Page;
