/** @jsxImportSource @emotion/react */

import { useEditor } from "prosekit/react";
import styled from "@xstyled/emotion";
import {
  ArrowCounterClockwiseIcon,
  ArrowClockwiseIcon,
  TextBIcon,
  TextItalicIcon,
  TextHTwoIcon,
  TextHOneIcon,
  TextHThreeIcon,
  ListBulletsIcon,
  MinusIcon,
  TextStrikethroughIcon,
  TextUnderlineIcon,
  TableIcon,
  ImageIcon,
  ArrowsInLineVerticalIcon,
  NumberCircleOneIcon,
  NumberCircleTwoIcon,
  ListNumbersIcon,
  NumberCircleThreeIcon,
  NumberCircleFourIcon,
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
        <ArrowCounterClockwiseIcon size={18} />
      </Button>
      <Button
        pressed={false}
        disabled={!editor.commands.redo.canExec()}
        onClick={editor.commands.redo}
        tooltip="Redo"
      >
        <ArrowClockwiseIcon size={18} />
      </Button>
      <Button
        pressed={editor.marks.bold.isActive()}
        disabled={!editor.commands.toggleBold.canExec()}
        onClick={editor.commands.toggleBold}
        tooltip="Bold"
      >
        <TextBIcon size={18} />
      </Button>
      <Button
        pressed={editor.marks.italic.isActive()}
        disabled={!editor.commands.toggleItalic.canExec()}
        onClick={editor.commands.toggleItalic}
        tooltip="Italic"
      >
        <TextItalicIcon size={18} />
      </Button>
      <Button
        pressed={editor.marks.underline.isActive()}
        disabled={!editor.commands.toggleUnderline.canExec()}
        onClick={editor.commands.toggleUnderline}
        tooltip="Underline"
      >
        <TextUnderlineIcon size={18} />
      </Button>
      <Button
        pressed={editor.marks.strike.isActive()}
        disabled={!editor.commands.toggleStrike.canExec()}
        onClick={editor.commands.toggleStrike}
        tooltip="Strike"
      >
        <TextStrikethroughIcon size={18} />
      </Button>
      <Button
        pressed={editor.nodes.heading.isActive({ level: 1 })}
        disabled={!editor.commands.toggleHeading.canExec({ level: 1 })}
        onClick={() => editor.commands.toggleHeading({ level: 1 })}
        tooltip="Heading 1"
      >
        <TextHOneIcon size={18} />
      </Button>
      <Button
        pressed={editor.nodes.heading.isActive({ level: 2 })}
        disabled={!editor.commands.toggleHeading.canExec({ level: 2 })}
        onClick={() => editor.commands.toggleHeading({ level: 2 })}
        tooltip="Heading 2"
      >
        <TextHTwoIcon size={18} />
      </Button>
      <Button
        pressed={editor.nodes.heading.isActive({ level: 3 })}
        disabled={!editor.commands.toggleHeading.canExec({ level: 3 })}
        onClick={() => editor.commands.toggleHeading({ level: 3 })}
        tooltip="Heading 3"
      >
        <TextHThreeIcon size={18} />
      </Button>
      <Button
        pressed={editor.nodes.horizontalRule.isActive()}
        disabled={!editor.commands.insertHorizontalRule.canExec()}
        onClick={() => editor.commands.insertHorizontalRule()}
        tooltip="Divider"
      >
        <MinusIcon size={18} />
      </Button>
      <Button
        pressed={editor.nodes.list.isActive({ kind: "bullet" })}
        disabled={!editor.commands.toggleList.canExec({ kind: "bullet" })}
        onClick={() => editor.commands.wrapList({ kind: "bullet" })}
        tooltip="Bullet List"
      >
        <ListBulletsIcon size={18} />
      </Button>
      <Button
        pressed={editor.nodes.list.isActive({ kind: "ordered" })}
        disabled={!editor.commands.toggleList.canExec({ kind: "ordered" })}
        onClick={() => editor.commands.toggleList({ kind: "ordered" })}
        tooltip="Ordered List"
      >
        <ListNumbersIcon size={18} />
      </Button>
      <Button
        pressed={editor.nodes.list.isActive({ kind: "lower-alpha" })}
        disabled={!editor.commands.toggleList.canExec({ kind: "lower-alpha" })}
        onClick={() => editor.commands.toggleList({ kind: "lower-alpha" })}
        tooltip="Lower Alpha List"
      >
        <NumberCircleOneIcon size={18} />
      </Button>
      <Button
        pressed={editor.nodes.list.isActive({ kind: "upper-alpha" })}
        disabled={!editor.commands.toggleList.canExec({ kind: "upper-alpha" })}
        onClick={() => editor.commands.toggleList({ kind: "upper-alpha" })}
        tooltip="Upper Alpha List"
      >
        <NumberCircleTwoIcon size={18} />
      </Button>
      <Button
        pressed={editor.nodes.list.isActive({ kind: "lower-roman" })}
        disabled={!editor.commands.toggleList.canExec({ kind: "lower-roman" })}
        onClick={() => editor.commands.toggleList({ kind: "lower-roman" })}
        tooltip="Lower Roman List"
      >
        <NumberCircleThreeIcon size={18} />
      </Button>
      <Button
        pressed={editor.nodes.list.isActive({ kind: "upper-roman" })}
        disabled={!editor.commands.toggleList.canExec({ kind: "upper-roman" })}
        onClick={() => editor.commands.toggleList({ kind: "upper-roman" })}
        tooltip="Upper Roman List"
      >
        <NumberCircleFourIcon size={18} />
      </Button>

      <Button
        pressed={false}
        disabled={false}
        onClick={() => {
          try {
            if (editor.commands.toggleMultilevelList) {
              editor.commands.toggleMultilevelList();
            } else {
              console.warn("toggleMultilevelList command not available");
            }
          } catch (error) {
            console.error("Error toggling multilevel list:", error);
          }
        }}
        tooltip="Toggle Multilevel List"
      >
        <ListNumbersIcon size={18} />
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
        <TableIcon size={18} />
      </Button>

      <TableMenu isActive={isTableActive} />
      <Separator />

      <Button
        pressed={editor.nodes.pageBreak.isActive()}
        disabled={!editor.commands.insertPageBreak.canExec()}
        onClick={() => editor.commands.insertPageBreak()}
        tooltip="Page Break"
      >
        <ArrowsInLineVerticalIcon size={18} />
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
