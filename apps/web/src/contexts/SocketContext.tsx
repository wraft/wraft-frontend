import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { Socket, Channel } from 'phoenix';
import toast from 'react-hot-toast';
import { Bell } from '@phosphor-icons/react';

import envConfig from 'utils/env';

import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
  notificationsInitialized: boolean;
  joinChannel: (channelName: string, params?: any) => Channel | null;
  leaveChannel: (channelName: string) => void;
  sendMessage: (channelName: string, event: string, payload: any) => void;
  resetNotificationsState: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

const MAX_RECONNECT_ATTEMPTS = 5;
const INITIAL_RECONNECT_DELAY = 10000;

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [notificationsInitialized, setNotificationsInitialized] =
    useState(false);
  const [isClient, setIsClient] = useState(false);
  const channelsRef = useRef<Map<string, Channel>>(new Map());
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const authContext = useAuth();
  const { accessToken, userProfile } = authContext || {
    accessToken: null,
    userProfile: null,
  };

  const initializeSocket = useCallback(() => {
    if (!isClient || !accessToken || !userProfile) {
      return null;
    }

    const socketUrl = envConfig.WEBSOCKET_URL || 'ws://localhost:4000';

    const newSocket = new Socket(`${socketUrl}/socket`, {
      params: {
        token: accessToken,
        user_id: userProfile.id,
        organisation_id: userProfile.organisation_id,
      },

      // enable this to see the socket logs in the console and debug
      // logger: (kind, msg, data) => {
      //   if (process.env.NODE_ENV === 'development') {
      //     console.log(`Phoenix Socket ${kind}: ${msg}`, data);
      //   }
      // },
    });

    newSocket.onOpen(() => {
      setConnected(true);
      reconnectAttemptsRef.current = 0;
    });

    newSocket.onClose(() => {
      setConnected(false);
      handleReconnect();
    });

    newSocket.onError(() => {
      setConnected(false);
      handleReconnect();
    });

    newSocket.connect();
    return newSocket;
  }, [accessToken, userProfile, isClient]);

  const handleReconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
      console.log('Max reconnection attempts reached');
      return;
    }

    const delay =
      INITIAL_RECONNECT_DELAY * Math.pow(2, reconnectAttemptsRef.current);
    // console.log(
    //   `Attempting to reconnect in ${delay}ms (attempt ${reconnectAttemptsRef.current + 1})`,
    // );

    reconnectTimeoutRef.current = setTimeout(() => {
      reconnectAttemptsRef.current += 1;
      const newSocket = initializeSocket();
      if (newSocket) {
        setSocket(newSocket);
      }
    }, delay);
  }, [initializeSocket]);

  useEffect(() => {
    const newSocket = initializeSocket();
    if (newSocket) {
      setSocket(newSocket);
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      channelsRef.current.forEach((channel) => {
        channel.leave();
      });
      channelsRef.current.clear();
      if (socket) {
        socket.disconnect();
      }
      setSocket(null);
      setConnected(false);
      setNotificationsInitialized(false);
    };
  }, [initializeSocket]);

  useEffect(() => {
    if (!socket || !connected || !userProfile) return;

    const userNotificationsChannelName = `user_notification:${userProfile.id}`;
    const organisationNotificationsChannelName = `organisation_notification:${userProfile.organisation_id}`;

    const userNotificationsChannel = joinChannel(userNotificationsChannelName);
    const organisationNotificationsChannel = joinChannel(
      organisationNotificationsChannelName,
    );

    if (userNotificationsChannel) {
      userNotificationsChannel.on('notification', (payload) => {
        handleNotification(payload);
      });
    }

    if (organisationNotificationsChannel) {
      organisationNotificationsChannel.on('notification', (payload) => {
        handleNotification(payload);
      });
    }

    return () => {
      if (userNotificationsChannel) {
        leaveChannel(userNotificationsChannelName);
      }
      if (organisationNotificationsChannel) {
        leaveChannel(organisationNotificationsChannelName);
      }
      setNotificationsInitialized(false);
    };
  }, [socket, connected, userProfile]);

  const handleNotification = useCallback((payload: any) => {
    const { message, body } = payload;

    toast.success(
      <div dangerouslySetInnerHTML={{ __html: message || body.message }} />,
      {
        duration: 4000,
        position: 'top-right',
        icon: <Bell size={42} />,
      },
    );

    window.dispatchEvent(new CustomEvent('notification', { detail: payload }));
  }, []);

  const joinChannel = useCallback(
    (channelName: string, params: any = {}) => {
      if (!socket) return null;

      if (channelsRef.current.has(channelName)) {
        return channelsRef.current.get(channelName)!;
      }

      const channel = socket.channel(channelName, params);

      channel
        .join()
        .receive('ok', () => {
          channelsRef.current.set(channelName, channel);
          if (channelName.startsWith('notification:')) {
            setNotificationsInitialized(true);
          }
        })
        .receive('error', (resp) => {
          console.error(`Failed to join channel ${channelName}`, resp);
        });

      return channel;
    },
    [socket],
  );

  const leaveChannel = useCallback((channelName: string) => {
    const channel = channelsRef.current.get(channelName);
    if (channel) {
      channel.leave();
      channelsRef.current.delete(channelName);
    }
  }, []);

  const sendMessage = useCallback(
    (channelName: string, event: string, payload: any) => {
      const channel = channelsRef.current.get(channelName);
      if (channel) {
        channel.push(event, payload);
      }
    },
    [],
  );

  const resetNotificationsState = useCallback(() => {
    setNotificationsInitialized(false);
  }, []);

  const value: SocketContextType = {
    socket,
    connected,
    notificationsInitialized,
    joinChannel,
    leaveChannel,
    sendMessage,
    resetNotificationsState,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export default SocketProvider;
