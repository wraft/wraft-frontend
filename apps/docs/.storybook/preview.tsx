import React from 'react';

import { defaultTheme, ThemeProvider, Preflight } from '@xstyled/emotion';
import { theme } from '@wraft/ui';

import { Preview } from '@storybook/react';


const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
 
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
     
    ),
  ],
};

export default preview;