import { createGlobalStyle } from "@xstyled/emotion";

export const GlobalStyle = createGlobalStyle`
  @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap");

  // html {
  //   font-size: 15px;
  // }
  body {
    color: var(--theme-ui-colors-text);
    font-family: inter;
    -webkit-font-smoothing: antialiased;
  }

  a{
    text-decoration: none;
    color: var(--theme-ui-colors-text);
    &:hover {
      color: var(--theme-ui-colors-primary);
    }
  }
  
  
`;
