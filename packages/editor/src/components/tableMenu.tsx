// tableMenu.tsx
/** @jsxImportSource @emotion/react */
import { useEditor } from "prosekit/react";
import { CaretDown, Plus, Trash } from "@phosphor-icons/react";
import type { Editor } from "prosekit/core";
import { useState, useEffect, useRef } from "react";
import styled from "@xstyled/emotion";
import type { EditorExtension } from "./extension";

interface TableMenuProps {
  isActive: boolean;
}

const TableMenuContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const TableMenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  color: currentColor;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const MenuContent = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 100;
  max-height: 25rem;
  min-width: 12rem;
  padding: 0.25rem;
  overflow: auto;
  background-color: white;
  border: 1px solid #d1d5db;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const MenuItem = styled.div`
  padding: 0.375rem 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
`;

const MenuLabel = styled.div`
  flex: 1;
`;

const Shortcut = styled.div`
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  color: #71717a;
`;

export function TableMenu({ isActive }: TableMenuProps) {
  const editor = useEditor<EditorExtension>({ update: true });
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isActive) {
      setIsOpen(false);
    }
  }, [isActive]);

  if (!isActive) {
    return (
      <TableMenuContainer ref={menuRef}>
        <TableMenuButton disabled>
          <CaretDown size={18} color="#999" weight="fill" />
        </TableMenuButton>
      </TableMenuContainer>
    );
  }

  return (
    <TableMenuContainer ref={menuRef}>
      <TableMenuButton onClick={() => setIsOpen(!isOpen)}>
        <CaretDown size={18} color="#000" weight="fill" />
      </TableMenuButton>
      {isOpen && (
        <MenuContent>
          {editor.commands.addTableRowAbove.canExec() && (
            <MenuItem
              onClick={() => {
                editor.commands.addTableRowAbove();
                setIsOpen(false);
              }}
            >
              <IconContainer>
                <Plus size={16} weight="bold" />
              </IconContainer>
              <MenuLabel>Insert row above</MenuLabel>
            </MenuItem>
          )}
          {editor.commands.addTableRowBelow.canExec() && (
            <MenuItem
              onClick={() => {
                editor.commands.addTableRowBelow();
                setIsOpen(false);
              }}
            >
              <IconContainer>
                <Plus size={16} weight="bold" />
              </IconContainer>
              <MenuLabel>Insert row below</MenuLabel>
            </MenuItem>
          )}
          {editor.commands.addTableColumnBefore.canExec() && (
            <MenuItem
              onClick={() => {
                editor.commands.addTableColumnBefore();
                setIsOpen(false);
              }}
            >
              <IconContainer>
                <Plus size={16} weight="bold" />
              </IconContainer>
              <MenuLabel>Insert column left</MenuLabel>
            </MenuItem>
          )}
          {editor.commands.addTableColumnAfter.canExec() && (
            <MenuItem
              onClick={() => {
                editor.commands.addTableColumnAfter();
                setIsOpen(false);
              }}
            >
              <IconContainer>
                <Plus size={16} weight="bold" />
              </IconContainer>
              <MenuLabel>Insert column right</MenuLabel>
            </MenuItem>
          )}
          {editor.commands.deleteCellSelection.canExec() && (
            <MenuItem
              onClick={() => {
                editor.commands.deleteCellSelection();
                setIsOpen(false);
              }}
            >
              <IconContainer>
                <Trash size={16} weight="bold" />
              </IconContainer>
              <MenuLabel>Clear contents</MenuLabel>
              <Shortcut>Del</Shortcut>
            </MenuItem>
          )}
          {editor.commands.deleteTableColumn.canExec() && (
            <MenuItem
              onClick={() => {
                const { columnCount } = getTableDimensions(editor);
                columnCount > 1
                  ? editor.commands.deleteTableColumn()
                  : editor.commands.deleteTable.canExec() &&
                    editor.commands.deleteTable();
                setIsOpen(false);
              }}
            >
              <IconContainer>
                <Trash size={16} weight="bold" />
              </IconContainer>
              <MenuLabel>Delete column</MenuLabel>
            </MenuItem>
          )}
          {editor.commands.deleteTableRow.canExec() && (
            <MenuItem
              onClick={() => {
                const { rowCount } = getTableDimensions(editor);
                rowCount > 1
                  ? editor.commands.deleteTableRow()
                  : editor.commands.deleteTable.canExec() &&
                    editor.commands.deleteTable();
                setIsOpen(false);
              }}
            >
              <IconContainer>
                <IconContainer>
                  <Trash size={16} weight="bold" />
                </IconContainer>
              </IconContainer>
              <MenuLabel>Delete row</MenuLabel>
            </MenuItem>
          )}

          {editor.commands.deleteTable.canExec() && (
            <MenuItem
              onClick={() => {
                editor.commands.deleteTable();
                setIsOpen(false);
              }}
            >
              <IconContainer>
                <Trash size={16} weight="bold" />
              </IconContainer>
              <MenuLabel>Delete Table</MenuLabel>
            </MenuItem>
          )}

          {editor.commands.mergeTableCells.canExec() && (
            <MenuItem
              onClick={() => {
                editor.commands.mergeTableCells();
                setIsOpen(false);
              }}
            >
              <IconContainer>
                <Plus size={16} weight="bold" />
              </IconContainer>
              <MenuLabel>Merge cells</MenuLabel>
            </MenuItem>
          )}
        </MenuContent>
      )}
    </TableMenuContainer>
  );
}

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
