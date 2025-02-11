import { createGlobalStyle } from "@xstyled/emotion";

export const GlobalStyle = createGlobalStyle`
  @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap");
  html {
    font-size: 16px !important;
  }

  body {
    color: var(--theme-ui-colors-text);
    font-family: inter;
    -webkit-font-smoothing: antialiased;
    font-synthesis-weight: none;
    text-rendering: optimizeLegibility;
    background-color: var(--theme-ui-colors-background-primary);
  }

  details > summary {
    list-style: none;
    cursor: pointer;
  }

  details > summary::-webkit-details-marker {
    display: none;
  }

  details > summary::marker {
    display: none;
  }

  details > summary::-moz-list-bullet {
    list-style-type: none;
  }

  a{
    text-decoration: none;
    color: var(--theme-ui-colors-text);
    &:hover {
      color: var(--theme-ui-colors-primary);
    }
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background-color: var(--theme-ui-colors-background-scrollbar-track);
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: var(--theme-ui-colors-background-scrollbar-thumb);
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: var(--theme-ui-colors-background-scrollbar-thumb-hover);
  }
`;
