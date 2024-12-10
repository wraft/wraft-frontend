'use client';
import { Box } from 'theme-ui';

import ImporterWrapper from './ImporterWrapper';

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

// { children, inner }: IPage
export const ImporterPage = () => {
  return (
    <Box>
      <Box variant="section">
        <ImporterWrapper />
      </Box>
    </Box>
  );
};

export default ImporterPage;
