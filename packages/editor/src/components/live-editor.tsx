import type { NodeJSON } from "prosekit/core";
import { createEditor, jsonFromNode, htmlFromNode } from "prosekit/core";
import { ProseKit } from "prosekit/react";
import {
  useMemo,
  useImperativeHandle,
  forwardRef,
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
} from "react";
import { Socket } from "phoenix";
import * as Y from "yjs";
import { prosemirrorJSONToYXmlFragment } from "y-prosemirror";
import { ListDOMSerializer } from "prosekit/extensions/list";
import type { Node } from "@prosekit/pm/model";
import type { Awareness } from "y-protocols/awareness";
import { markdownFromHTML } from "@helpers/markdown";
// import { IndexeddbPersistence } from "y-indexeddb";
import { getRandomColor } from "../lib/utils";
import { PhoenixChannelProvider } from "../lib/y-phoenix-channel";
import { defineCollaborativeExtension } from "./extension";
// import InlineMenu from "./inline-menu";
import SlashMenu from "./slash-menu";
import Toolbar from "./toolbar";
import TokenMenu from "./token-menu";
import * as S from "./styles";
import { TableHandle } from "./table-handle";

export interface Signer {
  id: string;
  name: string;
  email: string;
}

export interface SignersConfig {
  signers: Signer[];
}
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
  signersConfig?: SignersConfig;
}

export const LiveEditor = forwardRef(
  (
    {
      defaultContent,
      placeholder = "Write something, or ' / ' for commands…",
      className = "",
      isReadonly = true,
      tokens,
      socketUrl = "ws://localhost:4000",
      collabData,
      signersConfig = { signers: [] },
    }: EditorProps,
    ref,
  ) => {
    const [provider, setProvider] = useState<any>();
    const [updateContent, setUpdateContent] = useState<any>();
    const contentInitialized = useRef(false);
    const socketRef = useRef<Socket | null>(null);

    const doc = useMemo(
      () =>
        new Y.Doc({
          guid: collabData?.guid || null,
        }),
      [],
    );

    useLayoutEffect(() => {
      if (!socketRef.current) {
        socketRef.current = new Socket(`${socketUrl}/socket`);
        socketRef.current.connect();
      }

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }, [socketUrl]);

    const editor = useMemo(() => {
      if (provider) {
        provider?.destroy();
      }

      if (!socketRef.current) {
        socketRef.current = new Socket(`${socketUrl}/socket`);
        socketRef.current.connect();
      }

      const wsProvider = new PhoenixChannelProvider(
        socketRef.current,
        `doc_room:${collabData.roomId}`,
        doc,
      );

      setProvider(wsProvider);

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
        signersConfig,
      });

      return createEditor({ extension, defaultContent });
    }, [isReadonly]);

    useEffect(() => {
      if (!provider || !editor) return;

      const yXmlFragment = doc.getXmlFragment("prosemirror");
      const ymap = doc.getMap("doc-initial");

      // update content like placeholder update
      if (updateContent) {
        prosemirrorJSONToYXmlFragment(
          editor.schema,
          updateContent,
          yXmlFragment,
        );
      }

      const ymapObserver = (event: any) => {
        event.changes.keys.forEach((change: any, key: any) => {
          if (
            key === "initialLoad" &&
            defaultContent &&
            !contentInitialized.current
          ) {
            prosemirrorJSONToYXmlFragment(
              editor.schema,
              defaultContent,
              yXmlFragment,
            );
            contentInitialized.current = true;
          }
        });
      };

      ymap.observe(ymapObserver);

      return () => {
        ymap.unobserve(ymapObserver);
      };
    }, [provider, editor, defaultContent, doc, updateContent]);

    useEffect(() => {
      if (defaultContent) {
        contentInitialized.current = false;
      }
    }, [defaultContent]);

    useEffect(() => {
      return () => {
        doc.destroy();
        provider?.destroy();
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
        markdownFromHTML: (html: string | null | undefined) => {
          if (!html) return "";
          return markdownFromHTML(html);
        },
        insertBlock: (block: Node) => {
          const { selection, schema } = editor.state;
          const blockContent = schema.nodeFromJSON(block);
          return editor.commands.insertBlock(blockContent, selection);
        },
        updateState: (state: any) => {
          setUpdateContent(state);
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
      <>
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
                {/* {!isReadonly && <InlineMenu />} */}
                <SlashMenu />
                {tokens && <TokenMenu tokens={tokens} />}
                {/* <BlockHandle /> */}
                <TableHandle />
              </S.EditorContent>
            </S.EditorContainer>
          </ProseKit>
        </S.EditorWrapper>
      </>
    );
  },
);
