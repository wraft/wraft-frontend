// import styled from "@emotion/styled";
import styled from "@xstyled/emotion";

export const EditorContainer = styled.divBox<{ type?: string }>`
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

  &[type="editerdiffview"] {
    border: none;
    box-shadow: none;
    border-radius: 0;

    .prosekit-commit-addition {
      background-color: #aadec7;
    }
    .prosekit-commit-deletion {
      background-color: #fcac9f;
    }
  }
`;

export const EditorWrapper = styled.divBox`
  .toolbar {
    position: sticky;
    top: 0;
    z-index: 1;
  }
`;

export const EditorContent = styled.divBox`
  position: relative;
  width: 100%;
  flex: 1;
  box-sizing: border-box;
  overflow-y: auto;
  .ProseMirror {
    color: var(--theme-ui-colors-gray-1200);
  }
  .ProseMirror p {
    line-height: 1.6;
    font-size: 15px;
    margin: 12px 0px;
  }

  .ProseMirror td p {
    line-height: normal;
  }

  .ProseMirror td p strong {
    font-weight: 600;
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
  .ProseMirror > .ProseMirror-yjs-cursor:first-of-type {
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

  /* Smart Table Wrapper Styles */
  .ProseMirror div[data-smart-table-wrapper] {
    margin: 1rem 0;
    background: #f8fafc;
  }

  .ProseMirror div[data-smart-table-wrapper]::before {
    content: "Smart Table: " attr(data-table-name);
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    border: 1px solid var(--theme-ui-colors-border);
    border-bottom: none;
    font-size: 14px;
    // color: #1e40af;
    padding: 14px;
    background: var(--theme-ui-colors-background-secondary);
    border-radius: 6px 6px 0 0;
  }

  .ProseMirror div[data-smart-table-wrapper] table {
    background: white;
    margin: 0;
  }

  .ProseMirror td,
  .ProseMirror th {
    vertical-align: top;
    box-sizing: border-box;
    position: relative;
    border-width: 1px;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    border: 1px solid;
    border-color: var(--theme-ui-colors-border);
  }

  /* Header row styling - first row in all tables */
  .ProseMirror table tr:first-child td {
    // background-color: #f3f4f6;
  }

  /* Smart table specific styling */
  .ProseMirror table[data-smart-table="true"] {
    border: 2px solid #3b82f6;
  }

  .ProseMirror table[data-smart-table="true"] tr:first-child td {
    background-color: #dbeafe;
    font-weight: 600;
  }

  /* Footer row styling */
  .ProseMirror td[data-footer="true"] {
    background-color: #f9fafb;
    font-weight: 500;
    border-top: 2px solid #9ca3af;
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

const _EditorDiffContainer = styled.divBox`
  min-height: 200px;
  max-height: 600px;
  width: 100%;
  overflow-y: auto;
  font-size: 0.875rem;
  line-height: 1.6;

  /* Table styling for diff viewer */
  .ProseMirror table {
    border-collapse: collapse;
    margin: 0;
    overflow: hidden;
    table-layout: fixed;
    width: 100%;
  }

  .ProseMirror table td,
  .ProseMirror table th {
    border: 1px solid #d1d5db;
    box-sizing: border-box;
    min-width: 1em;
    padding: 8px;
    position: relative;
    vertical-align: top;
  }

  .ProseMirror table th {
    background-color: #f9fafb;
    font-weight: 600;
  }

  .ProseMirror .tableWrapper {
    margin: 1em 0;
    overflow-x: auto;
  }

  .ProseMirror table .selectedCell:after {
    background: rgba(200, 200, 255, 0.4);
    content: "";
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    pointer-events: none;
    position: absolute;
    z-index: 2;
  }

  /* Diff-specific styling */
  .ProseMirror .commit-addition {
    background-color: #dcfce7;
    border-left: 3px solid #16a34a;
  }

  .ProseMirror .commit-deletion {
    background-color: #fef2f2;
    border-left: 3px solid #dc2626;
    text-decoration: line-through;
  }

  /* Table cells in diff context */
  .ProseMirror table .commit-addition td,
  .ProseMirror table .commit-addition th {
    background-color: #dcfce7;
    border-color: #16a34a;
  }

  .ProseMirror table .commit-deletion td,
  .ProseMirror table .commit-deletion th {
    background-color: #fef2f2;
    border-color: #dc2626;
    text-decoration: line-through;
  }

  /* Ensure table structure is always visible */
  .ProseMirror table td:empty::before,
  .ProseMirror table th:empty::before {
    content: " ";
    display: inline-block;
    width: 1px;
    height: 1px;
  }

  /* Make sure borders are visible even with commit styling */
  .ProseMirror .commit-insertion table,
  .ProseMirror .commit-deletion table {
    border-collapse: separate !important;
    border-spacing: 0;
  }

  .ProseMirror .commit-insertion table td,
  .ProseMirror .commit-insertion table th,
  .ProseMirror .commit-deletion table td,
  .ProseMirror .commit-deletion table th {
    border: 1px solid #d1d5db !important;
  }

  /* Force table visibility in diff context */
  .ProseMirror table {
    display: table !important;
  }

  .ProseMirror table tr {
    display: table-row !important;
  }

  .ProseMirror table td,
  .ProseMirror table th {
    display: table-cell !important;
    border-style: solid !important;
    border-width: 1px !important;
  }
`;
