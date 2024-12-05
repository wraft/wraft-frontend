/** @jsxImportSource @emotion/react */

import { useEditor } from "prosekit/react";
import {
  AutocompleteEmpty,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopover,
} from "prosekit/react/autocomplete";
import styled from "@emotion/styled";
import type { EditorExtension } from "./extension";
import { tags } from "./tag-data";

const StyledPopover = styled(AutocompletePopover)`
  position: relative;
  display: block;
  max-height: 400px;
  min-width: 120px;
  user-select: none;
  overflow: auto;
  white-space: nowrap;
  padding: 1rem;
  z-index: 10;
  box-sizing: border-box;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  background-color: var(--background-color);
  box-shadow: var(--shadow-lg);
  &[data-state='']: hidden;
`;

const StyledEmpty = styled(AutocompleteEmpty)`
  position: relative;
  display: block;
  min-width: 120px;
  margin: 0.25rem 0;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
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
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  cursor: default;
  user-select: none;
  white-space: nowrap;
  outline: none;
  &:focus-visible {
    background-color: var(--focused-bg-color);
  }
`;

export default function TagMenu() {
  const editor = useEditor<EditorExtension>();

  const handleTagInsert = (id: number, label: string) => {
    editor.commands.insertMention({
      id: id.toString(),
      value: `#${label}`,
      kind: "tag",
    });
    editor.commands.insertText({ text: " " });
  };

  return (
    <StyledPopover regex={/#[\da-z]*$/i}>
      <AutocompleteList>
        <StyledEmpty>No results</StyledEmpty>

        {tags.map((tag) => (
          <StyledItem
            key={tag.id}
            onSelect={() => handleTagInsert(tag.id, tag.label)}
          >
            #{tag.label}
          </StyledItem>
        ))}
      </AutocompleteList>
    </StyledPopover>
  );
}
