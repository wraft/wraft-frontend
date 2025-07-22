import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Pagination, Box, Text, Flex } from '@wraft/ui';
import styled from '@xstyled/emotion';
import { Avatar } from 'theme-ui';

import useNotifications from '@hooks/useNotifications';
import { TimeAgo } from 'common/Atoms';

import {
  getNotificationIcon,
  handleNotificationNavigation,
  Notification,
} from './NotificationUtil';

export const NotificationWrapper = styled(Box)``;

const NotificationList = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const {
    notifications,
    loading,
    markAsRead,
    fetchNotifications,
    paginationMeta,
  } = useNotifications();

  const router = useRouter();

  useEffect(() => {
    fetchNotifications(currentPage);
  }, [currentPage, fetchNotifications]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, page: newPage },
      },
      undefined,
      { shallow: true },
    );
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    handleNotificationNavigation(notification, router);
  };

  return (
    <NotificationWrapper py="lg" px="lg" w="100%">
      {loading ? (
        <Flex justify="center" py="xl">
          <Text>Loading notifications...</Text>
        </Flex>
      ) : notifications.length === 0 ? (
        <Flex justify="center" py="xl">
          <Text>No Notifications yet.</Text>
        </Flex>
      ) : (
        <Flex direction="column" bg="background-primary" w="70%">
          {notifications.map((notification) => (
            <Box
              key={notification.id}
              p="md"
              borderBottom="1px solid"
              borderColor="border"
              cursor="pointer"
              bg={notification.read ? 'background-primary' : 'green.100'}
              onClick={() => handleNotificationClick(notification)}>
              <Flex gap="sm" align="start">
                {notification.actor && !notification.actor.profile_pic && (
                  <Box
                    w="28px"
                    h="28px"
                    bg="green.500"
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
                    bg="green.500"
                    borderRadius="full"
                    color="white"
                    fontSize="sm"
                    display="flex"
                    alignItems="center"
                    justifyContent="center">
                    <Avatar
                      sx={{ width: '20px', height: '20px' }}
                      src={notification.actor?.profile_pic}
                    />
                  </Box>
                )}

                <Flex direction="column" flex="1" gap="xs">
                  <Text
                    dangerouslySetInnerHTML={{
                      __html: notification.message,
                    }}
                    color={
                      notification.read ? 'text-secondary' : 'text-primary'
                    }
                  />
                  <Flex justify="space-between" align="center">
                    <TimeAgo time={notification.inserted_at} />
                  </Flex>
                </Flex>
              </Flex>
            </Box>
          ))}
        </Flex>
      )}
      {paginationMeta && paginationMeta.totalPages > 1 && (
        <Box mx={0} mt={3}>
          <Pagination
            totalPage={paginationMeta.totalPages}
            initialPage={currentPage}
            onPageChange={handlePageChange}
            totalEntries={paginationMeta.totalEntries}
          />
        </Box>
      )}
    </NotificationWrapper>
  );
};

export default NotificationList;
