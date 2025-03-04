/** @jsxImportSource @emotion/react */
import { useEditor } from "prosekit/react";
import styled from "@emotion/styled";
import {
  TableHandleColumnRoot,
  TableHandleColumnTrigger,
  TableHandlePopoverContent,
  TableHandlePopoverItem,
  TableHandleRoot,
  TableHandleRowRoot,
  TableHandleRowTrigger,
} from "prosekit/react/table-handle";
import { DotsSix, DotsSixVertical } from "@phosphor-icons/react";
import type { EditorExtension } from "./extension";

const StyledTableHandleRoot = styled(TableHandleRoot)`
  display: contents;
`;

const StyledTableHandleColumnRoot = styled(TableHandleColumnRoot)`
  display: flex;
  align-items: center;
  justify-content: center;
  // height: 1.2em;
  // width: 1.5em;
  background-color: white;
  border: solid 1px;
  border-color: #d1d5db;
  border-radius: 4px;
  color: rgba(113, 113, 113, 0.5);

  &:hover {
    background-color: #f5f5f5;
  }

  &[data-state="open"] {
    opacity: 1;
    transform: translateY(14px);
  }

  &[data-state="closed"] {
    opacity: 0;
    transform: scale(1.05);
  }
`;

const StyledTableHandleColumnTrigger = styled(TableHandleColumnTrigger)`
  border: none;
  display: flex;
`;

const StyledTableHandlePopoverContent = styled(TableHandlePopoverContent)`
  max-height: 25rem;
  min-width: 8rem;
  padding: 0.25rem;
  overflow: auto;
  background-color: white;
  border: 1px solid #d1d5db;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const StyledTableHandlePopoverItem = styled(TableHandlePopoverItem)`
  padding: 0.375rem 0.75rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  cursor: pointer;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const StyledTableHandleRowRoot = styled(TableHandleRowRoot)`
  display: flex;
  align-items: center;
  justify-content: center;
  // height: 1.5em;
  // width: 1.2em;
  background-color: white;
  border: solid 1px;
  border-color: #d1d5db; /* zinc-200 */
  border-radius: 4px;
  transform: translateX(14px);
`;

const StyledTableHandleRowTrigger = styled(TableHandleRowTrigger)`
  justify-content: flex-end;
  display: flex;
`;

export function TableHandle() {
  const editor = useEditor<EditorExtension>({ update: true });

  return (
    <StyledTableHandleRoot>
      <StyledTableHandleColumnRoot>
        <StyledTableHandleColumnTrigger>
          <DotsSix />
        </StyledTableHandleColumnTrigger>
        <StyledTableHandlePopoverContent>
          {editor.commands.addTableColumnBefore.canExec() && (
            <StyledTableHandlePopoverItem
              onSelect={editor.commands.addTableColumnBefore}
            >
              <span>Insert Left</span>
            </StyledTableHandlePopoverItem>
          )}
          {editor.commands.addTableColumnAfter.canExec() && (
            <StyledTableHandlePopoverItem
              onSelect={editor.commands.addTableColumnAfter}
            >
              <span>Insert Right</span>
            </StyledTableHandlePopoverItem>
          )}
          {editor.commands.deleteCellSelection.canExec() && (
            <StyledTableHandlePopoverItem
              onSelect={editor.commands.deleteCellSelection}
            >
              <span>Clear Contents</span>
              <span className="text-xs tracking-widest text-zinc-500 dark:text-zinc-500">
                Del
              </span>
            </StyledTableHandlePopoverItem>
          )}
          {editor.commands.deleteTableColumn.canExec() && (
            <StyledTableHandlePopoverItem
              onSelect={editor.commands.deleteTableColumn}
            >
              <span>Delete Column</span>
            </StyledTableHandlePopoverItem>
          )}
        </StyledTableHandlePopoverContent>
      </StyledTableHandleColumnRoot>
      <StyledTableHandleRowRoot>
        <StyledTableHandleRowTrigger>
          <DotsSixVertical />
        </StyledTableHandleRowTrigger>
        <StyledTableHandlePopoverContent>
          {editor.commands.addTableRowAbove.canExec() && (
            <StyledTableHandlePopoverItem
              onSelect={editor.commands.addTableRowAbove}
            >
              <span>Insert Above</span>
            </StyledTableHandlePopoverItem>
          )}
          {editor.commands.addTableRowBelow.canExec() && (
            <StyledTableHandlePopoverItem
              onSelect={editor.commands.addTableRowBelow}
            >
              <span>Insert Below</span>
            </StyledTableHandlePopoverItem>
          )}
          {editor.commands.deleteCellSelection.canExec() && (
            <StyledTableHandlePopoverItem
              onSelect={editor.commands.deleteCellSelection}
            >
              <span>Clear Contents</span>
              <span className="text-xs tracking-widest text-zinc-500 dark:text-zinc-500">
                Del
              </span>
            </StyledTableHandlePopoverItem>
          )}
          {editor.commands.deleteTableRow.canExec() && (
            <StyledTableHandlePopoverItem
              onSelect={editor.commands.deleteTableRow}
            >
              <span>Delete Row</span>
            </StyledTableHandlePopoverItem>
          )}
        </StyledTableHandlePopoverContent>
      </StyledTableHandleRowRoot>
    </StyledTableHandleRoot>
  );
}
