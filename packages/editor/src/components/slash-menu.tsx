/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { useEditor } from "prosekit/react";
import {
  AutocompleteEmpty,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopover,
} from "prosekit/react/autocomplete";
import { useState } from "react";
import type { SmartTableJSON } from "../helpers/smart-table";
import type { EditorExtension } from "./extension";
import SmartTableModal from "./smart-table-modal";
import ConditionalBlockModal from "./conditional-block-modal";
import { useEditorConfig } from "./editor-config";

const StyledPopover = styled(AutocompletePopover)`
  position: relative;
  max-height: 400px;
  min-width: 120px;
  select: none;
  overflow: auto;
  white-space: nowrap;
  padding: 0.5rem;
  z-index: 10;
  box-sizing: border-box;
  border-radius: 0.5rem;
  border: 1px solid #fff;
  background-color: #fff;
  box-shadow:
    0px 1px 3px 1px rgba(0, 0, 0, 0.15),
    0px 1px 2px 0px rgba(0, 0, 0, 0.3);
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
  &[data-focused="true"] {
    background-color: #ccc;
  }
`;

export default function SlashMenu() {
  const editor = useEditor<EditorExtension>();
  const { tokens } = useEditorConfig();
  const [isSmartTableModalOpen, setIsSmartTableModalOpen] = useState(false);
  const [isConditionalBlockModalOpen, setIsConditionalBlockModalOpen] =
    useState(false);

  // Check if there are any Table type fields available
  const hasTableFields = (Array.isArray(tokens) ? tokens : []).some(
    (field: any) => {
      const fieldType =
        field.type ||
        field.fieldType ||
        (typeof field.field_type === "object"
          ? field.field_type?.name
          : field.field_type);
      const isTableType = fieldType === "Table" || fieldType === "table";
      const hasValidName = field.name || field.label;
      const hasValidMachineName =
        field.machine_name || field.machineName || field.name;
      return isTableType && hasValidName && hasValidMachineName;
    },
  );

  const handleInsertSmartTable = (
    tableJSON: SmartTableJSON,
    _tableName: string,
  ) => {
    const { state, view } = editor;
    const { schema, tr } = state;

    try {
      const tableNode = schema.nodeFromJSON(tableJSON);

      const transaction = tr.replaceSelectionWith(tableNode).scrollIntoView();

      view.dispatch(transaction);

      setIsSmartTableModalOpen(false);
    } catch (error) {
      // Handle error - could emit to error tracking service
      // For now, just keep modal open so user can retry
      if (error instanceof Error) {
        // Error occurred during insertion
      }
    }
  };

  return (
    <>
      <StyledPopover regex={/\/.*$/iu}>
        <StyledList>
          <StyledEmpty>No results</StyledEmpty>

          <StyledItem
            onSelect={() =>
              editor.commands.insertSignature({
                placeholder: true,
                // src: "https://placehold.co/200x100/8bd450/ffffff/png",
                width: 200,
                height: 100,
              })
            }
          >
            Signature
          </StyledItem>
          <StyledItem onSelect={() => editor.commands.setHeading({ level: 1 })}>
            Heading 1
          </StyledItem>
          <StyledItem onSelect={() => editor.commands.setHeading({ level: 2 })}>
            Heading 2
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
          {hasTableFields && (
            <StyledItem
              onSelect={() => {
                setIsSmartTableModalOpen(true);
              }}
            >
              Smart Table
            </StyledItem>
          )}

          <StyledItem
            onSelect={() => {
              setIsConditionalBlockModalOpen(true);
            }}
          >
            Conditional Block
          </StyledItem>
        </StyledList>
      </StyledPopover>

      <SmartTableModal
        isOpen={isSmartTableModalOpen}
        onClose={() => setIsSmartTableModalOpen(false)}
        onSubmit={handleInsertSmartTable}
        fields={tokens ?? []}
      />

      <ConditionalBlockModal
        isOpen={isConditionalBlockModalOpen}
        onClose={() => setIsConditionalBlockModalOpen(false)}
        onInsert={(attrs) => {
          editor.commands.insertConditionalBlock(attrs);
          setIsConditionalBlockModalOpen(false);
        }}
        fields={tokens ?? []}
      />
    </>
  );
}
