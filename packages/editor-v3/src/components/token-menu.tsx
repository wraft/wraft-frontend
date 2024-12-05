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

const StyledPopover = styled(AutocompletePopover)`
  position: relative;
  display: block;
  max-height: 400px;
  min-width: 120px;
  user-select: none;
  overflow: auto;
  white-space: nowrap;
  padding: 8px;
  z-index: 10;
  box-sizing: border-box;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  background-color: white;
  box-shadow: var(--shadow-lg);
  box-shadow:
    0px 1px 3px 1px rgba(0, 0, 0, 0.15),
    0px 1px 2px 0px rgba(0, 0, 0, 0.3);
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
  &[data-focused="true"] {
    background-color: #ccc;
  }
`;

interface TokensAttrs {
  label: string;
  name: string;
  id: string;
}

export default function TokenMenu({ tokens }: any) {
  const editor = useEditor<EditorExtension>();

  const handleHolderInsert = (token: any) => {
    editor.commands.insertHolder({
      id: token.id,
      name: token.name,
      named: token.named || null,
    });
  };

  return (
    <StyledPopover regex={/@\w*$/}>
      <AutocompleteList>
        <StyledEmpty>No results</StyledEmpty>

        {tokens?.map((token: TokensAttrs) => (
          <StyledItem key={token.id} onSelect={() => handleHolderInsert(token)}>
            {token.label}
          </StyledItem>
        ))}
      </AutocompleteList>
    </StyledPopover>
  );
}
