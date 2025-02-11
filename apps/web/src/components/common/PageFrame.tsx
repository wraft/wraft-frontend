import React from 'react';
import { Box, Grid } from '@wraft/ui';

import Sidebar from 'components/Sidebar';

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

  return (
    <Grid
      templateColumns="minmax(200px, 245px) 1fr"
      h="100vh"
      bg="background-secondary">
      {noSide && <Sidebar showFull={shouldShow} />}
      <Box overflow="auto">{children}</Box>
    </Grid>
  );
};

export default Page;
