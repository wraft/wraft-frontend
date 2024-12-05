import { createEditor, jsonFromNode, htmlFromNode } from "prosekit/core";
import { ProseKit } from "prosekit/react";
import { useMemo, useImperativeHandle, forwardRef } from "react";
import styled from "@emotion/styled";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";
import { prosemirrorJSONToYXmlFragment } from "y-prosemirror";
import { ListDOMSerializer } from "prosekit/extensions/list";
import { markdownFromHTML } from "@helpers/markdown";
import type { Node } from "@prosekit/pm/model";
import {
  defineDefaultExtension,
  defineCollaborativeExtension,
} from "./extension";
import InlineMenu from "./inline-menu";
import SlashMenu from "./slash-menu";
import TagMenu from "./tag-menu";
import Toolbar from "./toolbar";
import TokenMenu from "./token-menu";

// import "prosekit/style.css";
// import "prosekit/basic/style.css";

export interface EditorProps {
  defaultContent?: any;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
  isCollaborative?: boolean;
  isReadonly?: boolean;
  tokens?: any;
}

const EditorContainer = styled.div`
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  min-height: 40rem;
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

  .ProseMirror .ProseMirror-yjs-cursor {
    position: absolute;
    border-left: black;
    border-left-style: solid;
    border-left-width: 2px;
    border-color: orange;
    height: 1em;
    word-break: normal;
    pointer-events: none;
  }

  .ProseMirror .ProseMirror-yjs-cursor > div {
    position: relative;
    top: -1.05em;
    font-size: 13px;
    background-color: rgb(250, 129, 0);
    font-family: serif;
    font-style: normal;
    font-weight: normal;
    line-height: normal;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    color: white;
    padding-left: 2px;
    padding-right: 2px;
  }
  .ProseMirror > .ProseMirror-yjs-cursor:first-child {
    margin-top: 16px;
  }

  .ProseMirror .tableWrapper {
    overflow-x: auto;
  }
  .ProseMirror table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    overflow: hidden;
    border-color: gray;
  }
  .ProseMirror td,
  .ProseMirror th {
    vertical-align: top;
    box-sizing: border-box;
    position: relative;
    border-width: 1px;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    border: 1px solid #ccc;
  }
  .ProseMirror .column-resize-handle {
    position: absolute;
    right: -2px;
    top: 0;
    bottom: 0;
    width: 4px;
    z-index: 20;
    background-color: HighlightText;
    pointer-events: none;
  }
  .ProseMirror.resize-cursor {
    cursor: ew-resize;
    cursor: col-resize;
  }
  .ProseMirror .selectedCell {
    --color: 210, 100%, 56%;
    background-color: hsla(var(--color), 20%);
    border: 1px double hsl(var(--color));
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

// export const Editor: React.FC<EditorProps> = ({
export const Editor = forwardRef(
  (
    {
      defaultContent = "",
      placeholder = "Write something, or ' / ' for commands…",
      className = "",
      isCollaborative = false,
      isReadonly = true,
      tokens,
    }: EditorProps,
    ref,
  ) => {
    const editor = useMemo(() => {
      const doc = new Y.Doc({
        gc: true,
        guid: "123e4567-e89b-12d3-a456-426614174000",
      });

      const wsProvider = new WebsocketProvider(
        "ws://localhost:3000",
        "editor-001",
        doc,
        {
          connect: true,
          WebSocketPolyfill: WebSocket,
        },
      );

      const awareness = wsProvider.awareness;
      const extension = isCollaborative
        ? defineCollaborativeExtension({
            placeholder,
            doc,
            awareness,
            isReadonly,
          })
        : defineDefaultExtension({ placeholder, isReadonly });

      const editor = createEditor({ extension, defaultContent });

      const yXmlFragment = doc.getXmlFragment("prosemirror");
      setTimeout(() => {
        if (yXmlFragment.length === 0 && defaultContent) {
          prosemirrorJSONToYXmlFragment(
            editor.schema,
            defaultContent,
            yXmlFragment,
          );
        }
      }, 3000);

      return editor;
    }, [defaultContent]);

    const helpers = useMemo(
      () => ({
        getJSON: () => {
          const record = jsonFromNode(editor.view.state.doc);
          return record;
        },

        getMarkdown: () => {
          const html = htmlFromNode(editor.view.state.doc, {
            DOMSerializer: ListDOMSerializer,
          });
          const record = markdownFromHTML(html);
          return record;
        },
        insterBlock: (block: Node) => {
          const { selection, schema } = editor.state;
          const blockContent = schema.nodeFromJSON(block);
          return editor.commands.insertBlock(blockContent, selection);
        },
      }),
      [editor],
    );

    useImperativeHandle(
      ref,
      () => ({
        editor,
        helpers,
      }),
      [editor],
    );

    return (
      <div className={`wraft-editor ${className}`}>
        <ProseKit editor={editor}>
          <EditorContainer>
            {!isReadonly && <Toolbar />}
            <EditorContent>
              <EditorContentInput ref={editor.mount} />
              {!isReadonly && <InlineMenu />}
              <SlashMenu />
              {tokens && <TokenMenu tokens={tokens} />}
              <TagMenu />
              {/* <BlockHandle /> */}
              {/* <TableHandle /> */}
            </EditorContent>
          </EditorContainer>
        </ProseKit>
      </div>
    );
  },
);
