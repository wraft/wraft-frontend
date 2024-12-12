import type { NodeJSON } from "prosekit/core";
import { createEditor, jsonFromNode, htmlFromNode } from "prosekit/core";
import { ProseKit } from "prosekit/react";
import {
  useMemo,
  useImperativeHandle,
  forwardRef,
  useState,
  useEffect,
} from "react";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";
import { prosemirrorJSONToYXmlFragment } from "y-prosemirror";
import { ListDOMSerializer } from "prosekit/extensions/list";
import { markdownFromHTML } from "@helpers/markdown";
import type { Node } from "@prosekit/pm/model";
import { createClient } from "@liveblocks/client";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import type { Awareness } from "y-protocols/awareness";
import { getRandomColor } from "../lib/utils";
import { defineCollaborativeExtension } from "./extension";
import InlineMenu from "./inline-menu";
import SlashMenu from "./slash-menu";
import TagMenu from "./tag-menu";
import Toolbar from "./toolbar";
import TokenMenu from "./token-menu";
import * as S from "./styles";
import { TableHandle } from "./table-handle";

const client = createClient({
  publicApiKey: "add-public-key",
});

export interface EditorProps {
  defaultContent?: NodeJSON;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
  isCollaborative?: boolean;
  isReadonly?: boolean;
  tokens?: any;
  collabData?: any;
}

export const LiveEditor = forwardRef(
  (
    {
      defaultContent,
      placeholder = "Write something, or ' / ' for commands…",
      className = "",
      isReadonly = true,
      tokens,
      collabData,
    }: EditorProps,
    ref,
  ) => {
    const [provider, setProvider] = useState<any>();

    const doc = useMemo(
      () =>
        new Y.Doc({
          guid: collabData?.guid || null,
        }),
      [],
    );

    const editor = useMemo(() => {
      if (provider) {
        provider?.destroy();
      }

      // const wsProvider = new WebsocketProvider(
      //   process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost:3000",
      //   collabData.roomId as string,
      //   doc,
      //   { connect: true, WebSocketPolyfill: WebSocket }
      // );

      const { room, leave } = client.enterRoom(collabData.roomId);
      const wsProvider = new LiveblocksYjsProvider(room, doc);
      setProvider(wsProvider);

      wsProvider.awareness.on("change", () => {
        const states = wsProvider.awareness.getStates();
        // console.log("states", states);
      });

      if (collabData?.user) {
        wsProvider.awareness.setLocalState({
          user: { ...collabData.user, color: getRandomColor() },
        });
      }

      const extension = defineCollaborativeExtension({
        placeholder,
        doc,
        awareness: wsProvider.awareness as unknown as Awareness,
        isReadonly,
      });

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
      }, 500);

      return editor;
    }, [isReadonly]);

    useEffect(() => {
      const yXmlFragment = doc.getXmlFragment("prosemirror");
      if (yXmlFragment.length !== 0 && defaultContent) {
        prosemirrorJSONToYXmlFragment(
          editor.schema,
          defaultContent,
          yXmlFragment,
        );
      }
    }, [defaultContent]);

    useEffect(() => {
      return () => {
        doc.destroy();
        provider.destroy();
      };
    }, []);

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
