import React from "react";

import { ThemeProvider } from "@xstyled/emotion";
import { theme, GlobalStyle } from "@wraft/ui";

import { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: [
          "Overview",
          "Foundation",
          "Colors",
          "Icons",
          "Spacing",
          ["Home", "Login", "Admin"],
          "Components",
          "Typography",
          "*",
          "WIP",
        ],
      },
    },
    // actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <>
        <GlobalStyle />
        <ThemeProvider theme={theme}>
          <Story />
        </ThemeProvider>
      </>
    ),
  ],
};

export default preview;
