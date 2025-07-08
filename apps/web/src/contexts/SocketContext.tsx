import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { Socket, Channel } from 'phoenix';
import toast from 'react-hot-toast';

import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
  joinChannel: (channelName: string, params?: any) => Channel | null;
  leaveChannel: (channelName: string) => void;
  sendMessage: (channelName: string, event: string, payload: any) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const channelsRef = useRef<Map<string, Channel>>(new Map());

  // Only run on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Always call useAuth
  const authContext = useAuth();
  const { accessToken, userProfile } = authContext || {
    accessToken: null,
    userProfile: null,
  };

  // Initialize socket connection
  useEffect(() => {
    if (!isClient || !accessToken || !userProfile) {
      return;
    }

    const socketUrl =
      process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:4000';

    const newSocket = new Socket(`${socketUrl}/socket`, {
      params: {
        token: accessToken,
        user_id: userProfile.id,
        organisation_id: userProfile.organisation_id,
      },
      logger: (kind, msg, data) => {
        if (process.env.NODE_ENV === 'development') {
          console.log(`Phoenix Socket ${kind}: ${msg}`, data);
        }
      },
    });

    // Socket connection handlers
    newSocket.onOpen(() => {
      console.log('Phoenix socket connected');
      setConnected(true);
    });

    newSocket.onClose((event) => {
      console.log('Phoenix socket disconnected:', event);
      setConnected(false);
    });

    newSocket.onError((error) => {
      console.error('Phoenix socket error:', error);
      setConnected(false);
    });

    // Connect to socket
    newSocket.connect();
    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      channelsRef.current.forEach((channel) => {
        channel.leave();
      });
      channelsRef.current.clear();
      newSocket.disconnect();
      setSocket(null);
      setConnected(false);
    };
  }, [isClient, accessToken, userProfile]);

  // Join notifications channel when socket is connected
  useEffect(() => {
    if (!socket || !connected || !userProfile) return;

    const notificationsChannelName = `notification:${userProfile.id}`;
    const notificationsChannel = joinChannel(notificationsChannelName);

    if (notificationsChannel) {
      // Handle different notification types
      notificationsChannel.on('new_notification', (payload) => {
        handleNotification(payload);
      });

      notificationsChannel.on('message_created', (payload) => {
        handleNotification(payload);
      });

      notificationsChannel.on('document_updated', (payload) => {
        handleDocumentUpdate(payload);
      });

      notificationsChannel.on('approval_request', (payload) => {
        handleApprovalRequest(payload);
      });

      notificationsChannel.on('collaboration_invite', (payload) => {
        handleCollaborationInvite(payload);
      });

      notificationsChannel.on('workflow_status', (payload) => {
        handleWorkflowStatus(payload);
      });
    }

    return () => {
      if (notificationsChannel) {
        leaveChannel(notificationsChannelName);
      }
    };
  }, [socket, connected, userProfile]);

  // Notification handlers
  const handleNotification = (payload: any) => {
    const { message, body } = payload;

    toast.success(message || body, {
      duration: 4000,
      position: 'top-right',
    });

    // Dispatch custom event for other components to listen to
    window.dispatchEvent(new CustomEvent('notification', { detail: payload }));
  };

  const handleDocumentUpdate = (payload: any) => {
    const { user_name, action } = payload;

    toast(`${user_name} ${action} document`, {
      duration: 3000,
      position: 'top-right',
    });

    // Dispatch event for document components
    window.dispatchEvent(
      new CustomEvent('document_update', { detail: payload }),
    );
  };

  const handleApprovalRequest = (payload: any) => {
    const { document_title } = payload;

    toast(`Approval needed: ${document_title}`, {
      duration: 5000,
      position: 'top-right',
    });

    // Dispatch event for approval components
    window.dispatchEvent(
      new CustomEvent('approval_request', { detail: payload }),
    );
  };

  const handleCollaborationInvite = (payload: any) => {
    const { inviter_name, document_title } = payload;

    toast(`${inviter_name} invited you to collaborate on ${document_title}`, {
      duration: 4000,
      position: 'top-right',
    });

    // Dispatch event for collaboration components
    window.dispatchEvent(
      new CustomEvent('collaboration_invite', { detail: payload }),
    );
  };

  const handleWorkflowStatus = (payload: any) => {
    const { status, workflow_name } = payload;

    toast(`Workflow ${workflow_name} is now ${status}`, {
      duration: 3000,
      position: 'top-right',
    });

    // Dispatch event for workflow components
    window.dispatchEvent(
      new CustomEvent('workflow_status', { detail: payload }),
    );
  };

  // Join a channel
  const joinChannel = (channelName: string, params: any = {}) => {
    if (!socket) return null;

    // Check if channel already exists
    if (channelsRef.current.has(channelName)) {
      return channelsRef.current.get(channelName)!;
    }

    const channel = socket.channel(channelName, params);

    channel
      .join()
      .receive('ok', (resp) => {
        console.log(`Joined channel ${channelName}`, resp);
        channelsRef.current.set(channelName, channel);
      })
      .receive('error', (resp) => {
        console.error(`Failed to join channel ${channelName}`, resp);
      });

    return channel;
  };

  // Leave a channel
  const leaveChannel = (channelName: string) => {
    const channel = channelsRef.current.get(channelName);
    if (channel) {
      channel.leave();
      channelsRef.current.delete(channelName);
    }
  };

  // Send message to a channel
  const sendMessage = (channelName: string, event: string, payload: any) => {
    const channel = channelsRef.current.get(channelName);
    if (channel) {
      channel.push(event, payload);
    }
  };

  const value: SocketContextType = {
    socket,
    connected,
    joinChannel,
    leaveChannel,
    sendMessage,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  try {
    const context = useContext(SocketContext);
    if (context === undefined) {
      // Return safe defaults instead of throwing error during SSR or initial render
      return {
        socket: null,
        connected: false,
        joinChannel: () => null,
        leaveChannel: () => {},
        sendMessage: () => {},
      };
    }
    return context;
  } catch (error) {
    console.warn('useSocket called outside of provider context:', error);
    // Return safe defaults
    return {
      socket: null,
      connected: false,
      joinChannel: () => null,
      leaveChannel: () => {},
      sendMessage: () => {},
    };
  }
};

export default SocketProvider;
