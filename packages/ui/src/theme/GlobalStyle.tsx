import { createGlobalStyle } from "@xstyled/emotion";

export const GlobalStyle = createGlobalStyle`
  :root {
    font-family: Inter, sans-serif;
    font-feature-settings: 'liga' 1, 'calt' 1; /* fix for Chrome */
  }
  
  @supports (font-variation-settings: normal) {
    :root { 
      font-family: InterVariable, sans-serif; 
    }
  }
  
  body {
    color: var(--theme-ui-colors-text);
    font-family: Inter, sans-serif;
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

  .main-icon {
    color: var(--theme-ui-colors-icon);
  }
  
  #sidebars .menu-group:last-child .line {
    display: none; 
  }
`;
