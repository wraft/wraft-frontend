import { createEditor, jsonFromNode, htmlFromNode } from "prosekit/core";
import { ProseKit } from "prosekit/react";
import { useMemo, useImperativeHandle, forwardRef } from "react";
import { ListDOMSerializer } from "prosekit/extensions/list";
import type { Node } from "@prosekit/pm/model";
import type { ProsemirrorNodeJSON } from "prosemirror-flat-list";
import { markdownFromHTML } from "@helpers/markdown";
import { migrateDocJSON } from "@helpers/migrate";
import { defineDefaultExtension } from "./extension";
import InlineMenu from "./inline-menu";
import SlashMenu from "./slash-menu";
import Toolbar from "./toolbar";
import TokenMenu from "./token-menu";
import * as S from "./styles";
import { TableHandle } from "./table-handle";
import { EditorConfigProvider } from "./editor-config";

export interface EditorProps {
  defaultContent?: any;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
  isReadonly?: boolean;
  tokens?: any;
  apiHost?: string;
}

export interface EditorRef {
  editor: any;
  helpers: {
    getJSON: () => any;
    getMarkdown: () => any;
    insterBlock: (block: Node) => any;
  };
}

export const Editor = forwardRef<EditorRef, EditorProps>(
  (
    {
      defaultContent = "",
      placeholder = "Write something, or ' / ' for commands…",
      className = "",
      isReadonly = true,
      tokens,
      apiHost,
    },
    ref,
  ) => {
    const editor = useMemo(() => {
      const extension = defineDefaultExtension({ placeholder, isReadonly });
      const newContent = migrateDocJSON(defaultContent);

      return createEditor({ extension, defaultContent: newContent as any });
    }, [isReadonly, defaultContent]);

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
      <EditorConfigProvider config={{ apiHost }}>
        <S.EditorWrapper className={`wraft-editor ${className}`}>
          <ProseKit editor={editor}>
            {!isReadonly && (
              <div className="toolbar">
                <Toolbar />
              </div>
            )}

            <S.EditorContainer>
              <S.EditorContent>
                <S.EditorContentInput ref={editor.mount} />
                {!isReadonly && <InlineMenu />}
                <SlashMenu />
                {tokens && <TokenMenu tokens={tokens} />}
                {/* <BlockHandle /> */}
                <TableHandle />
              </S.EditorContent>
            </S.EditorContainer>
          </ProseKit>
        </S.EditorWrapper>{" "}
      </EditorConfigProvider>
    );
  },
);
