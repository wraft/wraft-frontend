import { createEditor, jsonFromNode, htmlFromNode } from "prosekit/core";
import { ProseKit } from "prosekit/react";
import { useMemo, useImperativeHandle, forwardRef } from "react";
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
import * as S from "./styles";

export interface EditorProps {
  defaultContent?: any;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
  isCollaborative?: boolean;
  isReadonly?: boolean;
  tokens?: any;
}

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
          <S.EditorContainer>
            {!isReadonly && <Toolbar />}
            <S.EditorContent>
              <S.EditorContentInput ref={editor.mount} />
              {!isReadonly && <InlineMenu />}
              <SlashMenu />
              {tokens && <TokenMenu tokens={tokens} />}
              <TagMenu />
              {/* <BlockHandle /> */}
              {/* <TableHandle /> */}
            </S.EditorContent>
          </S.EditorContainer>
        </ProseKit>
      </div>
    );
  },
);
