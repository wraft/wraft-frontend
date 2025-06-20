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
import type { Editor } from "prosekit/core";
import type { EditorExtension } from "./extension";

function getTableDimensions(editor: Editor): {
  rowCount: number;
  columnCount: number;
} {
  const { $from } = editor.view.state.selection;

  for (let i = $from.depth; i >= 0; i--) {
    const node = $from.node(i);
    if (node.type.name === "table") {
      const rowCount = node.childCount;
      const columnCount = node.firstChild?.childCount ?? 0;
      return { rowCount, columnCount };
    }
  }

  return { rowCount: 0, columnCount: 0 };
}

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

export function TableHandle({ isReadonly }: { isReadonly?: boolean }) {
  const editor = useEditor<EditorExtension>({ update: true });
  if (isReadonly) {
    return null;
  }

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
          {editor.commands.deleteTable.canExec() && (
            <StyledTableHandlePopoverItem
              onSelect={editor.commands.deleteTable}
            >
              <span>Delete Table</span>
            </StyledTableHandlePopoverItem>
          )}
          {editor.commands.mergeTableCells.canExec() && (
            <StyledTableHandlePopoverItem
              onSelect={editor.commands.mergeTableCells}
            >
              <span>Merge Cells</span>
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
              onSelect={() => {
                const { columnCount } = getTableDimensions(editor);

                columnCount > 1
                  ? editor.commands.deleteTableColumn()
                  : editor.commands.deleteTable.canExec() &&
                    editor.commands.deleteTable();
              }}
            >
              <span>Delete Column</span>
            </StyledTableHandlePopoverItem>
          )}

          {editor.commands.deleteTable.canExec() && (
            <StyledTableHandlePopoverItem
              onSelect={editor.commands.deleteTable}
            >
              <span>Delete Table</span>
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
          {editor.commands.mergeTableCells.canExec() && (
            <StyledTableHandlePopoverItem
              onSelect={editor.commands.mergeTableCells}
            >
              <span>Merge Cells</span>
            </StyledTableHandlePopoverItem>
          )}

          {editor.commands.splitTableCell.canExec() && (
            <StyledTableHandlePopoverItem
              onSelect={editor.commands.splitTableCell}
            >
              <span>Unmerge Cells</span>
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
              onSelect={() => {
                const { rowCount } = getTableDimensions(editor);

                rowCount > 1
                  ? editor.commands.deleteTableRow()
                  : editor.commands.deleteTable.canExec() &&
                    editor.commands.deleteTable();
              }}
            >
              <span>Delete Row</span>
            </StyledTableHandlePopoverItem>
          )}

          {editor.commands.deleteTable.canExec() && (
            <StyledTableHandlePopoverItem
              onSelect={editor.commands.deleteTable}
            >
              <span>Delete Table</span>
            </StyledTableHandlePopoverItem>
          )}
        </StyledTableHandlePopoverContent>
      </StyledTableHandleRowRoot>
    </StyledTableHandleRoot>
  );
}
