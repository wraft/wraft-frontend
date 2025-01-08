import React from 'react';
import { Box, Flex } from 'theme-ui';

import Sidebar from './Sidebar';

export interface IPage {
  showFull?: boolean;
  children: any;
  id?: string;
  noSide?: boolean;
}

export interface IAlert {
  appearance?: any;
  children: any;
}

export const Page = ({ children, showFull = true, noSide = true }: IPage) => {
  const shouldShow: boolean = showFull ? true : false;
  // const fontName = 'Poppins';
  // const url = `https://fonts.googleapis.com/css2?family=${fontName}:wght@100;300;400;500&display=swap`;

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        minHeight: '100vh',
        // overflowY: 'scroll',
      }}>
      <Flex
        sx={{
          flex: 1,
          flexDirection: ['column', 'row'],
        }}>
        {noSide && (
          <Box
            sx={{
              flexBasis: ['auto', 245],
              minHeight: '100vh',
              borderRight: 'solid 1px',
              borderColor: 'border',
              bg: 'background-primary',
            }}>
            <Sidebar showFull={shouldShow} />
          </Box>
        )}
        <Box
          sx={{
            flex: 1,
            bg: 'background-primary',
            minWidth: 0,
          }}>
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Page;
