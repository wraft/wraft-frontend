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


`;
