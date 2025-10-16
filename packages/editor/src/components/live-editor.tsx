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
import { migrateDocJSON } from "@helpers/migrate";
import type { ProsemirrorNodeJSON } from "prosemirror-flat-list";
import { getUserColor } from "../lib/utils";
import { PhoenixChannelProvider } from "../lib/y-phoenix-channel";
import { defineCollaborativeExtension } from "./extension";
import SlashMenu from "./slash-menu";
import Toolbar from "./toolbar";
import TokenMenu from "./token-menu";
import * as S from "./styles";
import { TableHandle } from "./table-handle";
import { EditorConfigProvider } from "./editor-config";
import InlineMenu from "./inline-menu";
import { TableContextMenu } from "./context-menu";

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
  authToken?: string;
  apiHost?: string;
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
      authToken,
      apiHost,
    }: EditorProps,
    ref,
  ) => {
    const [provider, setProvider] = useState<any>();
    const [updateContent, setUpdateContent] = useState<any>();
    const [isLoading, setIsLoading] = useState<any>(false);
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
        socketRef.current = new Socket(`${socketUrl}/socket`, {
          params: authToken ? { token: authToken } : {},
        });
        socketRef.current.connect();
      }

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }, [socketUrl, authToken]);

    const editor = useMemo(() => {
      if (provider) {
        provider?.destroy();
      }

      if (!socketRef.current) {
        return null;
      }

      const wsProvider = new PhoenixChannelProvider(
        socketRef.current,
        `doc_room:${collabData.roomId}`,
        doc,
        {
          params: authToken ? { token: authToken } : {},
        },
      );

      setProvider(wsProvider);

      if (collabData?.user) {
        wsProvider.awareness.setLocalState({
          user: { ...collabData.user, color: getUserColor(collabData.user.id) },
        });
      }

      setIsLoading(true);

      const extension = defineCollaborativeExtension({
        placeholder,
        doc,
        awareness: wsProvider.awareness as unknown as Awareness,
        isReadonly,
        signersConfig,
      });

      // const migratedContent = migrateDocJSON(defaultContent as ProsemirrorNodeJSON);

      return createEditor({ extension });
    }, [isReadonly, socketRef.current]);

    useEffect(() => {
      if (!provider || !editor) return;

      const yXmlFragment = doc.getXmlFragment("prosemirror");
      const ymap = doc.getMap("doc-initial");

      // update content like placeholder update
      if (updateContent) {
        const newContent = migrateDocJSON(updateContent as ProsemirrorNodeJSON);
        prosemirrorJSONToYXmlFragment(editor.schema, newContent, yXmlFragment);
      }

      const ymapObserver = (event: any) => {
        event.changes.keys.forEach((change: any, key: any) => {
          if (key === "content") {
            const { content } = ymap.toJSON();
            const newContent = migrateDocJSON(content as ProsemirrorNodeJSON);
            if (content) {
              prosemirrorJSONToYXmlFragment(
                editor.schema,
                newContent,
                yXmlFragment,
              );
            }
          }
        });
      };

      ymap.observe(ymapObserver);

      return () => {
        ymap.unobserve(ymapObserver);
      };
    }, [provider, editor, doc, updateContent]);

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
          if (!editor) return null;
          const record = jsonFromNode(editor.view.state.doc);
          return record;
        },

        getMarkdown: () => {
          if (!editor) return null;
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
          if (!editor) return null;
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
      <EditorConfigProvider config={{ apiHost }}>
        <S.EditorWrapper className={`wraft-editor ${className}`}>
          {isLoading && editor && (
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
                  <TableHandle isReadonly={isReadonly} />
                  <TableContextMenu isReadonly={isReadonly} />
                </S.EditorContent>
              </S.EditorContainer>
            </ProseKit>
          )}
        </S.EditorWrapper>
      </EditorConfigProvider>
    );
  },
);
