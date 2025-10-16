/** @jsxImportSource @emotion/react */
import { useEditor } from "prosekit/react";
import { Plus, Trash } from "@phosphor-icons/react";
import type { Editor } from "prosekit/core";
import { useState, useEffect, useRef } from "react";
import { Box, Flex, Text } from "@wraft/ui";
import styled from "@emotion/styled";
import { findTable } from "prosekit/extensions/table";
import type { EditorExtension } from "./extension";

interface TableContextMenuProps {
  isReadonly?: boolean;
}

const MenuItem = styled(Flex)`
  cursor: pointer;
  border-radius: 2px;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const IconBox = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MENU_SIZE = { width: 200, height: 400, padding: 10 };

function getTableDimensions(editor: Editor) {
  if (!editor.view.state) return { rowCount: 0, columnCount: 0 };

  const tableNode = findTable(editor.view.state.selection.$from)?.node;
  return {
    rowCount: tableNode?.childCount ?? 0,
    columnCount: tableNode?.firstChild?.childCount ?? 0,
  };
}

function getMenuPosition(x: number, y: number) {
  return {
    x: Math.min(x, window.innerWidth - MENU_SIZE.width - MENU_SIZE.padding),
    y: Math.min(y, window.innerHeight - MENU_SIZE.height - MENU_SIZE.padding),
  };
}

export function TableContextMenu({ isReadonly }: TableContextMenuProps) {
  const editor = useEditor<EditorExtension>({ update: true });
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    if (isReadonly || !editor.view) return;
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const tableNode = findTable(editor.view.state.selection.$from);

      if (!tableNode || !target.closest("table, td, th, tr")) {
        closeMenu();
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      setPosition(getMenuPosition(e.clientX, e.clientY));
      setIsOpen(true);
    };

    const el = editor.view.dom;
    el.addEventListener("contextmenu", handleContextMenu);
    return () => el.removeEventListener("contextmenu", handleContextMenu);
  }, [editor, isReadonly]);

  useEffect(() => {
    const handleClickOrScroll = (e: Event) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener("click", handleClickOrScroll);
    document.addEventListener("scroll", handleClickOrScroll, true);

    return () => {
      document.removeEventListener("click", handleClickOrScroll);
      document.removeEventListener("scroll", handleClickOrScroll, true);
    };
  }, []);

  if (!isOpen || isReadonly) return null;

  const { rowCount, columnCount } = getTableDimensions(editor);

  return (
    <Box
      position="fixed"
      bg="white"
      min-width="8rem"
      border="1px solid"
      borderColor="border"
      boxShadow="0 2px 8px rgba(0,0,0,0.08)"
      p="xs"
      ref={menuRef}
      left={`${position.x}px`}
      top={`${position.y}px`}
    >
      {editor.commands.addTableRowAbove.canExec() && (
        <MenuItem
          align="center"
          gap="sm"
          p="sm"
          onClick={() => editor.commands.addTableRowAbove()}
        >
          <IconBox color="gray.1100">
            <Plus size={16} weight="bold" />
          </IconBox>
          <Text fontSize="sm">Insert row above</Text>
        </MenuItem>
      )}

      {editor.commands.addTableRowBelow.canExec() && (
        <MenuItem
          align="center"
          gap="sm"
          p="sm"
          onClick={() => editor.commands.addTableRowBelow()}
        >
          <IconBox color="gray.1100">
            <Plus size={16} weight="bold" />
          </IconBox>
          <Text fontSize="sm">Insert row below</Text>
        </MenuItem>
      )}

      {editor.commands.addTableColumnBefore.canExec() && (
        <MenuItem
          align="center"
          gap="sm"
          p="sm"
          onClick={() => editor.commands.addTableColumnBefore()}
        >
          <IconBox color="gray.1100">
            <Plus size={16} weight="bold" />
          </IconBox>
          <Text fontSize="sm">Insert column left</Text>
        </MenuItem>
      )}

      {editor.commands.addTableColumnAfter.canExec() && (
        <MenuItem
          align="center"
          gap="sm"
          p="sm"
          onClick={() => editor.commands.addTableColumnAfter()}
        >
          <IconBox color="gray.1100">
            <Plus size={16} weight="bold" />
          </IconBox>
          <Text fontSize="sm">Insert column right</Text>
        </MenuItem>
      )}

      {editor.commands.mergeTableCells.canExec() && (
        <MenuItem
          align="center"
          gap="sm"
          p="sm"
          onClick={() => editor.commands.mergeTableCells()}
        >
          <IconBox color="gray.1100">
            <Plus size={16} weight="bold" />
          </IconBox>
          <Text fontSize="sm">Merge cells</Text>
        </MenuItem>
      )}

      {editor.commands.splitTableCell.canExec() && (
        <MenuItem
          align="center"
          gap="sm"
          p="sm"
          onClick={() => editor.commands.splitTableCell()}
        >
          <IconBox color="gray.1100">
            <Plus size={16} weight="bold" />
          </IconBox>
          <Text fontSize="sm">Unmerge cells</Text>
        </MenuItem>
      )}

      <Box my="xs" border="1px solid" borderColor="border" />

      {editor.commands.deleteCellSelection.canExec() && (
        <MenuItem
          align="center"
          gap="sm"
          p="sm"
          onClick={() => editor.commands.deleteCellSelection()}
        >
          <IconBox color="gray.1100">
            <Trash size={16} weight="bold" />
          </IconBox>
          <Text fontSize="sm" flex={1}>
            Clear contents
          </Text>
          <Text fontSize="xs" color="text-secondary">
            Del
          </Text>
        </MenuItem>
      )}

      {editor.commands.deleteTableColumn.canExec() && (
        <MenuItem
          align="center"
          gap="sm"
          p="sm"
          onClick={() => {
            columnCount > 1
              ? editor.commands.deleteTableColumn()
              : editor.commands.deleteTable.canExec() &&
                editor.commands.deleteTable();
          }}
        >
          <IconBox color="gray.1100">
            <Trash size={16} weight="bold" />
          </IconBox>
          <Text fontSize="sm">Delete column</Text>
        </MenuItem>
      )}

      {editor.commands.deleteTableRow.canExec() && (
        <MenuItem
          align="center"
          gap="sm"
          p="sm"
          onClick={() => {
            rowCount > 1
              ? editor.commands.deleteTableRow()
              : editor.commands.deleteTable.canExec() &&
                editor.commands.deleteTable();
          }}
        >
          <IconBox color="gray.1100">
            <Trash size={16} weight="bold" />
          </IconBox>
          <Text fontSize="sm">Delete row</Text>
        </MenuItem>
      )}

      {editor.commands.deleteTable.canExec() && (
        <MenuItem
          align="center"
          gap="sm"
          p="sm"
          onClick={() => editor.commands.deleteTable()}
        >
          <IconBox color="gray.1100">
            <Trash size={16} weight="bold" />
          </IconBox>
          <Text fontSize="sm">Delete table</Text>
        </MenuItem>
      )}
    </Box>
  );
}
