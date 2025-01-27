import { useEffect, useMemo, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { IndexeddbPersistence } from "y-indexeddb";
import type { Awareness } from "y-protocols/awareness";

type PresenceState = Map<number, { user: any }>;

function mapToUsersArray(presence: PresenceState | null): any[] {
  if (!presence) return [];
  return Array.from(presence.values()).map((entry) => entry.user);
}

export default function useSharedPresence({
  currentUser,
  roomId,
}: {
  roomId: string;
  currentUser: any;
}) {
  const ydoc = useMemo(() => new Y.Doc(), []);
  const [users, setUsers] = useState<any[]>([]);
  const [awareness, setAwareness] = useState<any>(null);

  console.log("roomId pp", roomId);

  useEffect(() => {
    console.log("Setting up IndexeddbPersistence, WebsocketProvider observer");

    const _localProvider = new IndexeddbPersistence(roomId, ydoc);

    const provider = new WebsocketProvider(
      process.env.NEXT_PUBLIC_YJS_WEBSOCKET_URL || "ws://localhost:3000",
      roomId,
      ydoc,
      {
        connect: true,
        WebSocketPolyfill: WebSocket,
      },
    );
    provider.awareness.setLocalStateField("user", currentUser);
    setAwareness(provider.awareness);

    // provider.awareness.on("change", () => {
    //   const states: any = provider.awareness.getStates();
    //   // // console.log("Awareness change triggered", states);
    //   // const newPresenceArray = mapToUsersArray(states);
    //   // setUsers(newPresenceArray); // change presence state to be an array
    // });

    return () => {
      provider.disconnect();
    };
  }, [roomId]);

  return { ydoc, users, awareness };
}
