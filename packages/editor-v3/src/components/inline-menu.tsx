/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import type { LinkAttrs } from "prosekit/extensions/link";
import type { EditorState } from "prosekit/pm/state";
import { useEditor } from "prosekit/react";
import { InlinePopover } from "prosekit/react/inline-popover";
import { useState } from "react";
import {
  Link,
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
  border: 1px solid var(--border-color);
  background-color: var(--background-color);
  box-shadow: var(--shadow-lg);
  display: flex;
  min-width: 120px;
  gap: 4px;
  overflow: auto;
  white-space: nowrap;
  border-radius: 4px;
  padding: 8px;
`;

const LinkPopover = styled(InlinePopover)`
  z-index: 10;
  box-sizing: border-box;
  border: 1px solid var(--border-color);
  background-color: var(--background-color);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  width: 16rem;
  border-radius: 8px;
  padding: 16px;
  gap: 8px;
  align-items: stretch;
`;

const StyledInput = styled.input`
  height: 36px;
  border-radius: 8px;
  width: 100%;
  padding: 8px 12px;
  font-size: 0.875rem;
  border: 1px solid var(--border-color);
  background-color: var(--input-bg-color);
  transition:
    border-color 0.2s,
    background-color 0.2s;
  &:focus-visible {
    outline: none;
    border-color: var(--focus-border-color);
  }
`;

const RemoveLinkButton = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  background-color: var(--button-bg-color);
  color: var(--button-text-color);
  height: 36px;
  padding: 0 12px;
  transition: background-color 0.2s;
  &:hover {
    background-color: var(--button-hover-bg-color);
  }
`;

export default function InlineMenu() {
  const editor = useEditor<EditorExtension>({ update: true });

  const [linkMenuOpen, setLinkMenuOpen] = useState(false);
  const toggleLinkMenuOpen = () => setLinkMenuOpen((open) => !open);

  const getCurrentLink = (state: EditorState): string | undefined => {
    const { $from } = state.selection;
    const marks = $from.marksAcross($from);
    if (!marks) {
      return;
    }
    for (const mark of marks) {
      if (mark.type.name === "link") {
        return (mark.attrs as LinkAttrs).href;
      }
    }
  };

  const handleLinkUpdate = (href?: string) => {
    if (href) {
      editor.commands.addLink({ href });
    } else {
      editor.commands.removeLink();
    }

    setLinkMenuOpen(false);
    editor.focus();
  };

  return (
    <>
      <InlineMenuPopover
        data-testid="inline-menu-main"
        onOpenChange={(open) => {
          if (!open) {
            setLinkMenuOpen(false);
          }
        }}
      >
        <Button
          pressed={editor.marks.bold.isActive()}
          disabled={!editor.commands.toggleBold.canExec()}
          onClick={() => editor.commands.toggleBold()}
          tooltip="Bold"
        >
          <TextB />
        </Button>

        <Button
          pressed={editor.marks.italic.isActive()}
          disabled={!editor.commands.toggleItalic.canExec()}
          onClick={() => editor.commands.toggleItalic()}
          tooltip="Italic"
        >
          <TextItalic />
        </Button>

        <Button
          pressed={editor.marks.underline.isActive()}
          disabled={!editor.commands.toggleUnderline.canExec()}
          onClick={() => editor.commands.toggleUnderline()}
          tooltip="Underline"
        >
          <TextUnderline />
        </Button>

        <Button
          pressed={editor.marks.strike.isActive()}
          disabled={!editor.commands.toggleStrike.canExec()}
          onClick={() => editor.commands.toggleStrike()}
          tooltip="Strikethrough"
        >
          <TextStrikethrough />
        </Button>

        {editor.commands.addLink.canExec({ href: "" }) && (
          <Button
            pressed={editor.marks.link.isActive()}
            onClick={() => {
              editor.commands.expandLink();
              toggleLinkMenuOpen();
            }}
            tooltip="Link"
          >
            <Link />
          </Button>
        )}
      </InlineMenuPopover>

      <LinkPopover
        placement={"bottom"}
        defaultOpen={false}
        open={linkMenuOpen}
        onOpenChange={setLinkMenuOpen}
        data-testid="inline-menu-link"
      >
        {linkMenuOpen && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const target = event.target as HTMLFormElement | null;
              const href = target?.querySelector("input")?.value.trim();
              handleLinkUpdate(href);
            }}
          >
            <StyledInput
              placeholder="Paste the link..."
              defaultValue={getCurrentLink(editor.state)}
            ></StyledInput>
          </form>
        )}
        {editor.marks.link.isActive() && (
          <RemoveLinkButton
            onClick={() => handleLinkUpdate()}
            onMouseDown={(event) => event.preventDefault()}
          >
            Remove link
          </RemoveLinkButton>
        )}
      </LinkPopover>
    </>
  );
}
