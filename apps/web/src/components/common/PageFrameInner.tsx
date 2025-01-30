import React from 'react';
import { Flex } from '@wraft/ui';

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

export const PageFrameInner = ({ children }: IPage) => {
  return (
    <>
      <Flex direction="column" h="100vh">
        {children}
      </Flex>
    </>
  );
};

export default PageFrameInner;
