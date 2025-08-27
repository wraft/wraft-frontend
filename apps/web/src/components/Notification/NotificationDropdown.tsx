import React from 'react';
import { useRouter } from 'next/router';
import {
  Avatar,
  DropdownMenu,
  Box,
  Flex,
  Text,
  Button,
  Spinner,
} from '@wraft/ui';
import { BellIcon, CheckIcon, GearIcon } from '@phosphor-icons/react';

import { useNotifications } from '@hooks/useNotifications';
import { IconFrame } from 'common/Atoms';
import { TimeAgo } from 'common/Atoms';
import { useSocket } from 'contexts/SocketContext';

import {
  Notification,
  getNotificationIcon,
  handleNotificationNavigation,
} from './NotificationUtil';

interface NotificationDropdownProps {
  iconSize?: string;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  iconSize = '16',
}) => {
  const router = useRouter();

  const { connected } = useSocket();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } =
    useNotifications();

  const recentNotifications = notifications.slice(0, 10);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    handleNotificationNavigation(notification, router);
  };

  const handleViewAll = () => {
    router.push('/notifications');
  };

  const handleSettingsClick = () => {
    router.push('/manage/workspace/notification-settings');
  };

  return (
    <DropdownMenu.Provider>
      <DropdownMenu.Trigger>
        <Box position="relative" cursor="pointer">
          <IconFrame color="icon">
            <BellIcon
              size={iconSize}
              weight={unreadCount > 0 ? 'fill' : 'regular'}
            />
          </IconFrame>
          {unreadCount > 0 && (
            <Box
              position="absolute"
              top="-6px"
              right="-6px"
              bg="red.500"
              color="white"
              borderRadius="full"
              minWidth="18px"
              h="18px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="xs"
              fontWeight="bold"
              px="xs">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Box>
          )}
        </Box>
      </DropdownMenu.Trigger>

      <DropdownMenu aria-label="Notifications">
        <Box minWidth="380px" maxWidth="480px">
          <Flex
            justify="space-between"
            align="center"
            p="md"
            borderBottom="1px solid"
            borderColor="border">
            <Flex align="center" gap="sm">
              <Text fontSize="base" fontWeight="bold">
                Notifications
              </Text>
              {connected && (
                <Box
                  w="8px"
                  h="8px"
                  bg="green.500"
                  borderRadius="full"
                  title="Connected - receiving live updates"
                />
              )}
              {!connected && (
                <Box
                  w="8px"
                  h="8px"
                  bg="orange.500"
                  borderRadius="full"
                  title="Offline - notifications may be delayed"
                />
              )}
            </Flex>

            <Flex gap="sm">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  title="Mark all as read">
                  <CheckIcon size={16} />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSettingsClick}
                title="Notification settings">
                <GearIcon size={16} />
              </Button>
            </Flex>
          </Flex>

          <Box maxHeight="400px" overflowY="auto">
            {loading && (
              <Flex justify="center" p="lg">
                <Spinner size={24} />
              </Flex>
            )}

            {!loading && recentNotifications.length === 0 && (
              <Flex
                direction="column"
                align="center"
                justify="center"
                p="xl"
                color="text-secondary">
                <IconFrame color="icon">
                  <BellIcon size={48} weight="light" />
                </IconFrame>
                <Text mt="md" fontSize="sm">
                  No notifications yet
                </Text>
              </Flex>
            )}

            {!loading &&
              recentNotifications.map((notification) => (
                <Box
                  key={notification.id}
                  p="md"
                  borderBottom="1px solid"
                  borderColor="border"
                  cursor="pointer"
                  bg={notification.read ? 'transparent' : 'green.200'}
                  onClick={() => handleNotificationClick(notification)}>
                  <Flex gap="sm" align="start">
                    {notification.actor && !notification.actor.profile_pic && (
                      <Box
                        w="28px"
                        h="28px"
                        bg="gray.500"
                        borderRadius="full"
                        color="white"
                        fontSize="sm"
                        display="flex"
                        alignItems="center"
                        justifyContent="center">
                        {getNotificationIcon(notification.event_type)}
                      </Box>
                    )}
                    {notification.actor && (
                      <Box
                        w="28px"
                        h="28px"
                        bg="gray.500"
                        borderRadius="full"
                        color="white"
                        fontSize="sm"
                        display="flex"
                        alignItems="center"
                        justifyContent="center">
                        <Avatar
                          size="sm"
                          src={notification.actor?.profile_pic}
                          alt={notification.actor?.name}
                          name={notification.actor?.name}
                        />
                      </Box>
                    )}

                    <Flex direction="column" flex="1" gap="xs">
                      <Text
                        dangerouslySetInnerHTML={{
                          __html: notification.message,
                        }}
                        color={
                          notification.read ? 'text-primary' : 'text-primary'
                        }
                      />

                      <TimeAgo time={notification.inserted_at} />
                    </Flex>
                  </Flex>
                </Box>
              ))}
          </Box>

          {recentNotifications.length > 0 && (
            <Flex
              justify="center"
              p="sm"
              borderTop="1px solid"
              borderColor="border">
              <Button variant="ghost" onClick={handleViewAll}>
                View all notifications
              </Button>
            </Flex>
          )}
        </Box>
      </DropdownMenu>
    </DropdownMenu.Provider>
  );
};

export default NotificationDropdown;
