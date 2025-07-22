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
import { Bell } from '@phosphor-icons/react';

import { getNotificationIcon } from 'components/Notification/NotificationUtil';

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

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [notificationsInitialized, setNotificationsInitialized] =
    useState(false);
  const [isClient, setIsClient] = useState(false);
  const channelsRef = useRef<Map<string, Channel>>(new Map());

  useEffect(() => {
    setIsClient(true);
  }, []);

  const authContext = useAuth();
  const { accessToken, userProfile } = authContext || {
    accessToken: null,
    userProfile: null,
  };

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

    newSocket.connect();
    setSocket(newSocket);

    return () => {
      channelsRef.current.forEach((channel) => {
        channel.leave();
      });
      channelsRef.current.clear();
      newSocket.disconnect();
      setSocket(null);
      setConnected(false);
      setNotificationsInitialized(false);
    };
  }, [accessToken, userProfile]);

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

  const handleNotification = (payload: any) => {
    const { message, body, event_type } = payload;

    toast.success(
      <div dangerouslySetInnerHTML={{ __html: message || body.message }} />,
      {
        duration: 4000,
        position: 'top-right',
        icon: getNotificationIcon(event_type) || <Bell />,
      },
    );

    window.dispatchEvent(new CustomEvent('notification', { detail: payload }));
  };

  const joinChannel = (channelName: string, params: any = {}) => {
    if (!socket) return null;

    if (channelsRef.current.has(channelName)) {
      return channelsRef.current.get(channelName)!;
    }

    const channel = socket.channel(channelName, params);

    channel
      .join()
      .receive('ok', (resp) => {
        console.log(`Joined channel ${channelName}`, resp);
        channelsRef.current.set(channelName, channel);
        if (channelName.startsWith('notification:')) {
          setNotificationsInitialized(true);
        }
      })
      .receive('error', (resp) => {
        console.error(`Failed to join channel ${channelName}`, resp);
      });

    return channel;
  };

  const leaveChannel = (channelName: string) => {
    const channel = channelsRef.current.get(channelName);
    if (channel) {
      channel.leave();
      channelsRef.current.delete(channelName);
    }
  };

  const sendMessage = (channelName: string, event: string, payload: any) => {
    const channel = channelsRef.current.get(channelName);
    if (channel) {
      channel.push(event, payload);
    }
  };

  const resetNotificationsState = () => {
    setNotificationsInitialized(false);
  };

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
