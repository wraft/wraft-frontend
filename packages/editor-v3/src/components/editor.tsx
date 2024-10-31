import { createEditor, jsonFromNode } from "prosekit/core";
import { ProseKit } from "prosekit/react";
import { useMemo, useCallback } from "react";
import styled from "@emotion/styled";
import BlockHandle from "./block-handle";
import { defineExtension } from "./extension";
import InlineMenu from "./inline-menu";
import SlashMenu from "./slash-menu";
import TagMenu from "./tag-menu";
import Toolbar from "./toolbar";
import UserMenu from "./user-menu";
import { users } from "./user-data";

// import 'prosekit/basic/style.css'

export interface EditorProps {
  defaultContent?: any;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const EditorContainer = styled.div`
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  min-height: 9rem;
  overflow: hidden;
  border-radius: 0.375rem;
  border: 1px solid;
  border-color: #e5e7eb;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  display: flex;
  flex-direction: column;
  background-color: white;
  color: black;

  @media (prefers-color-scheme: dark) {
    border-color: #3f3f46;
  }
`;

const EditorContent = styled.div`
  position: relative;
  width: 100%;
  flex: 1;
  box-sizing: border-box;
  overflow-y: scroll;

  .holder {
    background: #ffe889;
    color: #000;
    padding: 2px;
  }
`;

const EditorContentInput = styled.div`
  box-sizing: border-box;
  min-height: 100%;
  padding: 2rem calc(max(4rem, 50% - 20rem));
  outline: none;

  & span[data-mention="user"] {
    color: #3b82f6;
  }

  & span[data-mention="tag"] {
    color: #8b5cf6;
  }

  & pre {
    color: white;
    background-color: #27272a;
  }
`;

export const Editor: React.FC<EditorProps> = ({
  defaultContent = "",
  onChange,
  placeholder = "Start typing...",
  className = "",
}) => {
  const editor = useMemo(() => {
    const extension = defineExtension({ placeholder });
    return createEditor({ extension, defaultContent });
  }, []);

  console.log("editor", editor);

  // Save the current document as a JSON string
  const handleSave = useCallback(() => {
    const record = jsonFromNode(editor.view.state.doc);
    console.log("handleSave", record);
  }, [editor]);

  return (
    <div className={`wraft-editor ${className}`}>
      <ProseKit editor={editor}>
        <EditorContainer>
          <Toolbar />
          <EditorContent>
            <EditorContentInput ref={editor.mount} />
            <InlineMenu />
            <SlashMenu />
            <UserMenu users={users} />
            <TagMenu />
            <BlockHandle />
          </EditorContent>
        </EditorContainer>
      </ProseKit>
      <button
        onClick={handleSave}
        className="m-1 border border-solid bg-white px-2 py-1 text-sm text-black disabled:cursor-not-allowed disabled:text-gray-500"
      >
        save
      </button>
    </div>
  );
};
