import React from 'react';
// import Head from 'next/head';
import { Flex } from 'theme-ui';
// import Container from './Container';
// import { Close } from 'theme-ui';

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

export const PageFrameInner = ({
  children,
}: // showFull = true,
// noSide = true,
IPage) => {
  // const shouldShow: boolean = showFull ? true : false;
  // const fontName = 'Poppins';
  // const url = `https://fonts.googleapis.com/css2?family=${fontName}:wght@100;300;400;500&display=swap`;

  return (
    <>
      <Flex
        sx={{
          flexDirection: 'column',
          minHeight: '100%',
        }}>
        {children}
      </Flex>
    </>
  );
};

export default PageFrameInner;
