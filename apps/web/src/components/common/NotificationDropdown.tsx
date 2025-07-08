import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { DropdownMenu, Box, Flex, Text, Button, Spinner } from '@wraft/ui';
import { Bell, Check } from '@phosphor-icons/react';

import { useNotifications } from '@hooks/useNotifications';
import { IconFrame } from 'common/Atoms';
import { TimeAgo } from 'common/Atoms';
import { useSocket } from 'contexts/SocketContext';

const NotificationDropdown: React.FC = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Only render on client side to avoid SSR issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Use hooks normally - the error handling is now in the hook itself
  const { connected } = useSocket();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } =
    useNotifications();

  // Don't render during SSR
  if (!isClient) {
    return (
      <Box position="relative" cursor="pointer">
        <IconFrame color="gray.1100">
          <Bell size={18} weight="regular" />
        </IconFrame>
      </Box>
    );
  }

  // Show only recent notifications (last 10)
  const recentNotifications = notifications.slice(0, 10);

  const handleNotificationClick = async (notification: any) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    // Navigate based on notification type
    if (
      notification.type === 'document_update' &&
      notification.data?.document_id
    ) {
      router.push(`/documents/${notification.data.document_id}`);
    } else if (
      notification.type === 'approval_request' &&
      notification.data?.document_id
    ) {
      router.push(`/approvals?document_id=${notification.data.document_id}`);
    } else if (
      notification.type === 'collaboration_invite' &&
      notification.data?.document_id
    ) {
      router.push(`/documents/${notification.data.document_id}`);
    } else if (
      notification.type === 'workflow_status' &&
      notification.data?.workflow_id
    ) {
      router.push(`/manage/workflows/${notification.data.workflow_id}`);
    }
  };

  const handleViewAll = () => {
    router.push('/notifications');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'document_update':
        return '📄';
      case 'approval_request':
        return '✅';
      case 'collaboration_invite':
        return '🤝';
      case 'workflow_status':
        return '⚡';
      default:
        return '📢';
    }
  };

  return (
    <DropdownMenu.Provider>
      <DropdownMenu.Trigger>
        <Box position="relative" cursor="pointer">
          <IconFrame color="gray.1100">
            <Bell size={18} weight={unreadCount > 0 ? 'fill' : 'regular'} />
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
          {/* Header */}
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

            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                title="Mark all as read">
                <Check size={16} />
              </Button>
            )}
          </Flex>

          {/* Notifications List */}
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
                <Bell size={48} weight="light" />
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
                  bg={notification.read ? 'transparent' : 'blue.50'}
                  onClick={() => handleNotificationClick(notification)}>
                  <Flex gap="sm" align="start">
                    <Box
                      w="32px"
                      h="32px"
                      bg="blue.500"
                      borderRadius="full"
                      color="white"
                      fontSize="sm"
                      display="flex"
                      alignItems="center"
                      justifyContent="center">
                      {getNotificationIcon(notification.type)}
                    </Box>

                    <Flex direction="column" flex="1" gap="xs">
                      <Text
                        fontSize="sm"
                        fontWeight={notification.read ? 'normal' : 'semibold'}
                        color={
                          notification.read ? 'text-secondary' : 'text-primary'
                        }>
                        {notification.message}
                      </Text>

                      <TimeAgo time={notification.created_at} />
                    </Flex>

                    {!notification.read && (
                      <Box
                        w="8px"
                        h="8px"
                        bg="blue.500"
                        borderRadius="full"
                        mt="xs"
                      />
                    )}
                  </Flex>
                </Box>
              ))}
          </Box>

          {/* Footer */}
          {recentNotifications.length > 0 && (
            <Flex
              justify="center"
              p="md"
              borderTop="1px solid"
              borderColor="border">
              <Button variant="ghost" size="sm" onClick={handleViewAll}>
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
