/** @jsxImportSource @emotion/react */

import { useEditor } from "prosekit/react";
import styled, { x } from "@xstyled/emotion";
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
  Image,
  TextStrikethrough,
  TextUnderline,
  Table,
} from "@phosphor-icons/react";
import Button from "./button";
import type { EditorExtension } from "./extension";
// import { ImageUploadPopover } from "./image-upload-popover";

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

export default function Toolbar() {
  const editor = useEditor<EditorExtension>({ update: true });
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

      {/* <ImageUploadPopover
        disabled={!editor.commands.insertImage.canExec()}
        tooltip="Insert Image"
      >
        <Image size={18} />
      </ImageUploadPopover> */}
      <Button
        pressed={editor.nodes.table.isActive()}
        disabled={!editor.commands.insertTable.canExec}
        onClick={() =>
          editor.commands.insertTable({ row: 3, col: 2, header: true })
        }
        tooltip="Table"
      >
        <Table size={18} />
      </Button>
    </ToolbarContainer>
  );
}
