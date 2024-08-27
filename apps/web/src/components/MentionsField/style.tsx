import { createGlobalStyle } from '@xstyled/emotion';

export const GlobalStyle = createGlobalStyle`
  .rc-mentions {
  display: inline-block;
  position: relative;
  white-space: pre-wrap;
  width: 100%;
  display: flex;


  // ================= Input Area =================
  > textarea,
  &-measure {
    font: inherit;
    padding: 0;
    margin: 0;
    line-height: inherit;
    vertical-align: top;
    word-break: inherit;
    word-wrap: break-word;
    overflow-x: initial;
    overflow-y: auto;
    text-align: inherit;
    letter-spacing: inherit;
    tab-size: inherit;
    direction: inherit;
  }

  > textarea {
    border: none;
    width: 100%;
    outline: none;
    resize: none;
    background-color: transparent;
  }

  &-measure {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    pointer-events: none;
    color: transparent;
    z-index: -1;
  }

  // ================== Dropdown ==================
  &-dropdown {
    position: absolute;
    border: 1px solid #E4E9EF;
    border-radius: 3px;
    background: #fff;

    &-menu {
      list-style: none;
      margin: 0;
      padding: 0;
      background-color: blue;
      font-size: 14px;
      min-width: 100px;

      &-item {
        padding: 4px 8px;
        color: red;
        cursor: pointer;

        &-active {
          background: #d2f2e3;
        }

        &-disabled {
          opacity: 0.5;
        }
      }
    }
  }
} 
`;
