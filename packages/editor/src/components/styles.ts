// import styled from "@emotion/styled";
import styled from "@xstyled/emotion";

export const EditorContainer = styled.divBox`
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  min-height: 40rem;
  overflow: hidden;
  border-radius: 0.375rem;
  border: 1px solid;
  border-color: gray.300;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  display: flex;
  flex-direction: column;
  background-color: white;
  color: black;

  .ProseMirror [data-node-view-root="true"] {
    display: inline-block;
  }
`;

export const EditorContent = styled.divBox`
  position: relative;
  width: 100%;
  flex: 1;
  box-sizing: border-box;
  overflow-y: scroll;
  .ProseMirror {
    color: var(--theme-ui-colors-gray-1200);
  }
  .ProseMirror .ProseMirror-yjs-cursor {
    position: absolute;
    border-left: black;
    border-left-style: solid;
    border-left-width: 2px;
    border-color: orange;
    height: 1em;
    word-break: normal;
    pointer-events: none;
  }

  .ProseMirror .ProseMirror-yjs-cursor > div {
    position: relative;
    top: -1.05em;
    font-size: 13px;
    background-color: rgb(250, 129, 0);
    font-family: serif;
    font-style: normal;
    font-weight: normal;
    line-height: normal;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    color: white;
    padding-left: 2px;
    padding-right: 2px;
  }
  .ProseMirror > .ProseMirror-yjs-cursor:first-child {
    margin-top: 16px;
  }

  .ProseMirror .tableWrapper {
    overflow-x: auto;
  }
  .ProseMirror table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    overflow: hidden;
    border-color: gray;
  }
  .ProseMirror td,
  .ProseMirror th {
    vertical-align: top;
    box-sizing: border-box;
    position: relative;
    border-width: 1px;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    border: 1px solid #ccc;
  }
  .ProseMirror .column-resize-handle {
    position: absolute;
    right: -2px;
    top: 0;
    bottom: 0;
    width: 4px;
    z-index: 20;
    background-color: HighlightText;
    pointer-events: none;
  }
  .ProseMirror.resize-cursor {
    cursor: ew-resize;
    cursor: col-resize;
  }
  .ProseMirror .selectedCell {
    --color: 210, 100%, 56%;
    background-color: hsla(var(--color), 20%);
    border: 1px double hsl(var(--color));
  }
`;

export const EditorContentInput = styled.divBox`
  box-sizing: border-box;
  min-height: 100%;
  padding: 2rem calc(max(4rem, 50% - 20rem));
  outline: none;

  & span[data-mention="user"] {
    color: #3b82f6;
  }

  & span[data-mention="tag"] {
    color: #8b5cf6;
  }

  & pre {
    color: white;
    background-color: #27272a;
  }
`;
