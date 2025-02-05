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
import { Socket } from "phoenix";
import * as Y from "yjs";
import { prosemirrorJSONToYXmlFragment } from "y-prosemirror";
import { ListDOMSerializer } from "prosekit/extensions/list";
import { markdownFromHTML } from "@helpers/markdown";
import type { Node } from "@prosekit/pm/model";
import type { Awareness } from "y-protocols/awareness";
import { IndexeddbPersistence } from "y-indexeddb";
import { getRandomColor } from "../lib/utils";
import { PhoenixChannelProvider } from "../lib/y-phoenix-channel";
import { defineCollaborativeExtension } from "./extension";
import InlineMenu from "./inline-menu";
import SlashMenu from "./slash-menu";
import TagMenu from "./tag-menu";
import Toolbar from "./toolbar";
import TokenMenu from "./token-menu";
import * as S from "./styles";
import { TableHandle } from "./table-handle";

export interface EditorProps {
  defaultContent?: NodeJSON;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
  socketUrl?: string;
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
      socketUrl = "ws://localhost:4000",
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

      // const socket = new Socket("wss://api.stage.wraft.co/socket");
      const socket = new Socket(`${socketUrl}/socket`);
      // const socket = new Socket("ws://localhost:4000/socket");
      socket.connect();

      // const wsProvider = new WebsocketProvider(
      //   process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost:3000",
      //   collabData.roomId as string,
      //   doc,
      //   { connect: true, WebSocketPolyfill: WebSocket }
      // );
      const wsProvider = new PhoenixChannelProvider(
        socket,
        `doc_room:${collabData.roomId}`,
        doc,
      );

      // const _localProvider = new IndexeddbPersistence(collabData?.roomId, doc);

      // const { room, leave } = client.enterRoom(collabData.roomId);
      // const wsProvider = new LiveblocksYjsProvider(room, doc);
      setProvider(wsProvider);

      wsProvider.awareness.on("change", () => {
        const states = Array.from(wsProvider.awareness.getStates().values());
        // setAwarenessUsers(states);
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
      const ymap = doc.getMap("doc-initial");

      ymap.observe((event) => {
        event.changes.keys.forEach((change, key) => {
          if (key === "initialLoad") {
            prosemirrorJSONToYXmlFragment(
              editor.schema,
              defaultContent,
              yXmlFragment,
            );
          }
        });
      });

      //   ymap.observe((event) => {
      //     console.log('Observer triggered!');
      //     event.changes.keys.forEach((change, key) => {
      //         console.log(`Change on key: ${key}`, change);
      //     });
      // }

      // if (yXmlFragment.length === 0 && defaultContent) {
      // }

      // setTimeout(() => {
      //   if (yXmlFragment.length === 0 && defaultContent) {
      //     console.log("defaultContent", defaultContent);
      //     // prosemirrorJSONToYXmlFragment(
      //     //   editor.schema,
      //     //   {
      //     //     type: "doc",
      //     //     content: [
      //     //       {
      //     //         type: "paragraph",
      //     //         content: [
      //     //           {
      //     //             type: "text",
      //     //             text: "As requested, We would like",
      //     //           },
      //     //         ],
      //     //       },
      //     //     ],
      //     //   },
      //     //   yXmlFragment
      //     // );
      //   }
      // }, 500);
      // setTimeout(() => {
      //   if (yXmlFragment.length === 0 && defaultContent) {
      //     console.log("defaultContent", defaultContent);
      //     const ff = prosemirrorJSONToYXmlFragment(
      //       editor.schema,
      //       defaultContent,
      //       yXmlFragment
      //     );
      //     console.log("defaultContent[ff]", ff);
      //   }
      // }, 500);

      return editor;
    }, [isReadonly]);

    // useEffect(() => {
    //   const yXmlFragment = doc.getXmlFragment("prosemirror");
    //   if (yXmlFragment.length !== 0 && defaultContent) {
    //     prosemirrorJSONToYXmlFragment(
    //       editor.schema,
    //       defaultContent,
    //       yXmlFragment
    //     );
    //   }
    // }, [defaultContent]);

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
        provider,
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
              {/* {!isReadonly && <InlineMenu />} */}
              <SlashMenu />
              {tokens && <TokenMenu tokens={tokens} />}
              {/* <TagMenu /> */}
              {/* <BlockHandle /> */}
              <TableHandle />
            </S.EditorContent>
          </S.EditorContainer>
        </ProseKit>
      </div>
    );
  },
);
