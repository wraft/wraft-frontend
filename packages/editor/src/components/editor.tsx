import { createEditor, jsonFromNode, htmlFromNode } from "prosekit/core";
import { ProseKit } from "prosekit/react";
import { useMemo, useImperativeHandle, forwardRef } from "react";
import { ListDOMSerializer } from "prosekit/extensions/list";
import { markdownFromHTML } from "@helpers/markdown";
import type { Node } from "@prosekit/pm/model";
import { defineDefaultExtension } from "./extension";
import InlineMenu from "./inline-menu";
import SlashMenu from "./slash-menu";
import TagMenu from "./tag-menu";
import Toolbar from "./toolbar";
import TokenMenu from "./token-menu";
import * as S from "./styles";
import { TableHandle } from "./table-handle";

export interface EditorProps {
  defaultContent?: any;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
  isReadonly?: boolean;
  tokens?: any;
}

export const Editor = forwardRef(
  (
    {
      defaultContent = "",
      placeholder = "Write something, or ' / ' for commands…",
      className = "",
      isReadonly = true,
      tokens,
    }: EditorProps,
    ref,
  ) => {
    const editor = useMemo(() => {
      const extension = defineDefaultExtension({ placeholder, isReadonly });
      return createEditor({ extension, defaultContent });
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
              <TableHandle />
            </S.EditorContent>
          </S.EditorContainer>
        </ProseKit>
      </div>
    );
  },
);
