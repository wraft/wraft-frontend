import * as Y from "yjs";
import { useMemo } from "react";
import type { NodeJSON } from "@prosekit/core";
import { jsonFromNode, nodeFromJSON } from "@prosekit/core";
import { ProseMirrorNode } from "@prosekit/pm/model";
import {
  prosemirrorToYXmlFragment,
  prosemirrorJSONToYDoc,
} from "y-prosemirror";
import { WebsocketProvider } from "y-websocket";

export function useWebsocketProvider(
  documentId: string,
  doc: any,
  schema: any,
) {
  const ydoc = useMemo(() => {
    // if (schema?.nodes) {
    //   const ydoc = new Y.Doc({ guid: documentId });
    //   if (doc) {
    //     const yDocInstance = prosemirrorJSONToYDoc(schema, doc);
    //     // const update = Y.encodeStateAsUpdate(yDocInstance);
    //     // Object.assign(doc, yDocInstance);
    //     // Y.applyUpdate(doc, update);
    //     // Copy over the data from converted doc to our guid-enabled doc
    //     Object.assign(ydoc, yDocInstance);
    //   }

    //   return ydoc;
    // }
    return new Y.Doc({ guid: documentId });
  }, [documentId, doc, schema]);

  // Initialize a WebSocket connection to the specified server
  const provider = useMemo(
    () =>
      new WebsocketProvider("ws://localhost:3000/editor", "editor-001", ydoc),
    [doc],
  );

  const awareness = provider.awareness;
  // Return the awareness, provider, and Yjs document for use in components
  return { awareness, provider, ydoc };
}
