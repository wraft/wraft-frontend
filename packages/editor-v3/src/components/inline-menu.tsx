/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { useEditor } from "prosekit/react";
import { InlinePopover } from "prosekit/react/inline-popover";
import {
  TextB,
  TextItalic,
  TextStrikethrough,
  TextUnderline,
} from "@phosphor-icons/react";
import Button from "./button";
import type { EditorExtension } from "./extension";

const InlineMenuPopover = styled(InlinePopover)`
  z-index: 10;
  box-sizing: border-box;
  border: 1px solid #fff;
  background-color: #fff;
  display: flex;
  min-width: 120px;
  gap: 4px;
  overflow: auto;
  white-space: nowrap;
  border-radius: 4px;
  padding: 2px;
  box-shadow:
    0px 1px 3px 1px rgba(0, 0, 0, 0.15),
    0px 1px 2px 0px rgba(0, 0, 0, 0.3);
`;

export default function InlineMenu() {
  const editor = useEditor<EditorExtension>({ update: true });

  return (
    <>
      <InlineMenuPopover data-testid="inline-menu-main">
        <Button
          pressed={editor.marks.bold.isActive()}
          disabled={!editor.commands.toggleBold.canExec()}
          onClick={() => editor.commands.toggleBold()}
          tooltip="Bold"
        >
          <TextB size={18} />
        </Button>

        <Button
          pressed={editor.marks.italic.isActive()}
          disabled={!editor.commands.toggleItalic.canExec()}
          onClick={() => editor.commands.toggleItalic()}
          tooltip="Italic"
        >
          <TextItalic size={18} />
        </Button>

        <Button
          pressed={editor.marks.underline.isActive()}
          disabled={!editor.commands.toggleUnderline.canExec()}
          onClick={() => editor.commands.toggleUnderline()}
          tooltip="Underline"
        >
          <TextUnderline size={18} />
        </Button>

        <Button
          pressed={editor.marks.strike.isActive()}
          disabled={!editor.commands.toggleStrike.canExec()}
          onClick={() => editor.commands.toggleStrike()}
          tooltip="Strikethrough"
        >
          <TextStrikethrough size={18} />
        </Button>
      </InlineMenuPopover>
    </>
  );
}
