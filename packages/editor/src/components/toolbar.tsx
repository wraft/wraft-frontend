/** @jsxImportSource @emotion/react */

import { useEditor } from "prosekit/react";
import styled from "@xstyled/emotion";
import {
  ArrowCounterClockwise,
  ArrowClockwise,
  TextB,
  TextItalic,
  TextHTwo,
  TextHOne,
  TextHThree,
  ListBullets,
  Minus,
  List,
  TextStrikethrough,
  TextUnderline,
  Table,
  Image as ImageIcon,
  ArrowsInLineVertical,
} from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import Button from "./button";
import type { EditorExtension } from "./extension";
import { ImageUploadPopover } from "./image-upload-popover";
import { TableMenu } from "./table-menu";

const ToolbarContainer = styled.divBox`
  z-index: 2;
  box-sizing: border-box;
  border-style: solid;
  border-width: 0 0 1px;
  display: flex;
  flex-wrap: wrap;
  gap: 1;
  px: 2;
  align-items: center;
`;

const Separator = styled.divBox`
  width: 1px;
  height: 24px;
  background-color: gray.600;
  margin: 0 4px;
`;

export default function Toolbar() {
  const editor = useEditor<EditorExtension>({ update: true });
  const [isTableActive, setIsTableActive] = useState(false);

  // Check if a table is in the current selection path
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- editor.view might be undefined during initial mount
    if (!editor.view) return;

    const checkTableActive = () => {
      const { $from } = editor.view.state.selection;

      // Check if any parent node is a table
      for (let i = $from.depth; i >= 0; i--) {
        if ($from.node(i).type.name === "table") {
          setIsTableActive(true);
          return;
        }
      }
      setIsTableActive(false);
    };

    // Add event listeners
    const handleDocumentClick = (e: MouseEvent) => {
      if (e.target instanceof Node && editor.view.dom.contains(e.target)) {
        // Only check table state for clicks inside the editor
        setTimeout(checkTableActive, 10);
      }
    };

    // Set up event listeners
    checkTableActive(); // Initial check
    const view = editor.view;
    view.dom.addEventListener("update", checkTableActive);
    document.addEventListener("click", handleDocumentClick);

    // Clean up
    return () => {
      view.dom.removeEventListener("update", checkTableActive);
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [editor]);

  return (
    <ToolbarContainer
      display="flex"
      bg="background-secondary"
      color="gray.1100"
      px={2}
      py={1}
      borderBottomColor="gray.500"
    >
      <Button
        pressed={false}
        disabled={!editor.commands.undo.canExec()}
        onClick={editor.commands.undo}
        tooltip="Undo"
      >
        <ArrowCounterClockwise size={18} />
      </Button>
      <Button
        pressed={false}
        disabled={!editor.commands.redo.canExec()}
        onClick={editor.commands.redo}
        tooltip="Redo"
      >
        <ArrowClockwise size={18} />
      </Button>
      <Button
        pressed={editor.marks.bold.isActive()}
        disabled={!editor.commands.toggleBold.canExec()}
        onClick={editor.commands.toggleBold}
        tooltip="Bold"
      >
        <TextB size={18} />
      </Button>
      <Button
        pressed={editor.marks.italic.isActive()}
        disabled={!editor.commands.toggleItalic.canExec()}
        onClick={editor.commands.toggleItalic}
        tooltip="Italic"
      >
        <TextItalic size={18} />
      </Button>
      <Button
        pressed={editor.marks.underline.isActive()}
        disabled={!editor.commands.toggleUnderline.canExec()}
        onClick={editor.commands.toggleUnderline}
        tooltip="Underline"
      >
        <TextUnderline size={18} />
      </Button>
      <Button
        pressed={editor.marks.strike.isActive()}
        disabled={!editor.commands.toggleStrike.canExec()}
        onClick={editor.commands.toggleStrike}
        tooltip="Strike"
      >
        <TextStrikethrough size={18} />
      </Button>
      <Button
        pressed={editor.nodes.heading.isActive({ level: 1 })}
        disabled={!editor.commands.toggleHeading.canExec({ level: 1 })}
        onClick={() => editor.commands.toggleHeading({ level: 1 })}
        tooltip="Heading 1"
      >
        <TextHOne size={18} />
      </Button>
      <Button
        pressed={editor.nodes.heading.isActive({ level: 2 })}
        disabled={!editor.commands.toggleHeading.canExec({ level: 2 })}
        onClick={() => editor.commands.toggleHeading({ level: 2 })}
        tooltip="Heading 2"
      >
        <TextHTwo size={18} />
      </Button>
      <Button
        pressed={editor.nodes.heading.isActive({ level: 3 })}
        disabled={!editor.commands.toggleHeading.canExec({ level: 3 })}
        onClick={() => editor.commands.toggleHeading({ level: 3 })}
        tooltip="Heading 3"
      >
        <TextHThree size={18} />
      </Button>
      <Button
        pressed={editor.nodes.horizontalRule.isActive()}
        disabled={!editor.commands.insertHorizontalRule.canExec()}
        onClick={() => editor.commands.insertHorizontalRule()}
        tooltip="Divider"
      >
        <Minus size={18} />
      </Button>
      <Button
        pressed={editor.nodes.list.isActive({ kind: "bullet" })}
        disabled={!editor.commands.toggleList.canExec({ kind: "bullet" })}
        onClick={() => editor.commands.toggleList({ kind: "bullet" })}
        tooltip="Bullet List"
      >
        <ListBullets size={18} />
      </Button>
      <Button
        pressed={editor.nodes.list.isActive({ kind: "ordered" })}
        disabled={!editor.commands.toggleList.canExec({ kind: "ordered" })}
        onClick={() => editor.commands.toggleList({ kind: "ordered" })}
        tooltip="Ordered List"
      >
        <List size={18} />
      </Button>
      <Button
        pressed={isTableActive} // Use isTableActive state instead of editor.nodes.table.isActive()
        disabled={!editor.commands.insertTable.canExec}
        onClick={() => {
          if (!isTableActive) {
            editor.commands.insertTable({ row: 3, col: 2, header: true });
          }
        }}
        tooltip="Table"
      >
        <Table size={18} />
      </Button>

      <TableMenu isActive={isTableActive} />
      <Separator />

      <Button
        pressed={editor.nodes.pageBreak.isActive()}
        disabled={!editor.commands.insertPageBreak.canExec()}
        onClick={() => editor.commands.insertPageBreak()}
        tooltip="Page Break"
      >
        <ArrowsInLineVertical size={18} />
      </Button>
      <ImageUploadPopover
        disabled={!editor.commands.insertImage.canExec()}
        tooltip="Insert Image"
      >
        <ImageIcon size={18} />
      </ImageUploadPopover>
    </ToolbarContainer>
  );
}
