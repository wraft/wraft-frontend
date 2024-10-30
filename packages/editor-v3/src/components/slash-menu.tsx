/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { useEditor } from "prosekit/react";
import {
  AutocompleteEmpty,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopover,
} from "prosekit/react/autocomplete";
import type { EditorExtension } from "./extension";

const StyledPopover = styled(AutocompletePopover)`
  position: relative;
  max-height: 400px;
  min-width: 120px;
  select: none;
  overflow: auto;
  white-space: nowrap;
  padding: 1rem;
  z-index: 10;
  box-sizing: border-box;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  background-color: var(--background-color);
  box-shadow: var(--shadow-lg);
`;

const StyledList = styled(AutocompleteList)``; // You can add styles if needed

const StyledEmpty = styled(AutocompleteEmpty)`
  position: relative;
  display: block;
  min-width: 120px;
  margin: 0.25rem 0;
  border-radius: 0.375rem;
  padding: 0.375rem 0.75rem;
  cursor: default;
  user-select: none;
  white-space: nowrap;
  outline: none;
  &:focus-visible {
    background-color: var(--focused-bg-color);
  }
`;

const StyledItem = styled(AutocompleteItem)`
  position: relative;
  display: block;
  min-width: 120px;
  margin: 0.25rem 0;
  border-radius: 0.375rem;
  padding: 0.375rem 0.75rem;
  cursor: default;
  user-select: none;
  white-space: nowrap;
  outline: none;
  &:focus-visible {
    background-color: var(--focused-bg-color);
  }
`;

export default function SlashMenu() {
  const editor = useEditor<EditorExtension>();

  return (
    <StyledPopover regex={/\/.*$/iu}>
      <StyledList>
        <StyledEmpty>No results</StyledEmpty>

        <StyledItem onSelect={() => editor.commands.setHeading({ level: 1 })}>
          Heading 1
        </StyledItem>
        <StyledItem onSelect={() => editor.commands.setHeading({ level: 2 })}>
          Heading 2
        </StyledItem>

        <StyledItem
          onSelect={() => editor.commands.wrapInList({ kind: "task" })}
        >
          Task list
        </StyledItem>

        <StyledItem
          onSelect={() => editor.commands.wrapInList({ kind: "bullet" })}
        >
          Bullet list
        </StyledItem>

        <StyledItem
          onSelect={() => editor.commands.wrapInList({ kind: "ordered" })}
        >
          Ordered list
        </StyledItem>

        <StyledItem
          onSelect={() => editor.commands.wrapInList({ kind: "toggle" })}
        >
          Toggle list
        </StyledItem>
      </StyledList>
    </StyledPopover>
  );
}
