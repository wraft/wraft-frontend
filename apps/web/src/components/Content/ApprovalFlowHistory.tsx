import React, { useEffect, useState } from 'react';
import { Box, Button, Flex, Spinner, Text } from '@wraft/ui';
import { format } from 'date-fns';

import { fetchAPI } from 'utils/models';

interface Log {
  entries: any[];
  total_entries: number;
}

const WorkflowStep = ({ description, createDate, isLast }: any) => (
  <Flex position="relative" gap="sm" align="self-start" py="md">
    {!isLast && (
      <Box
        position="absolute"
        left="3px"
        top="22px"
        w="2px"
        h="100%"
        bg="gray.300"
      />
    )}

    <Box pt="xs" position="relative" zIndex="1">
      <Box
        w="8px"
        h="8px"
        borderRadius="full"
        bg="gray.600"
        display="flex"
        alignItems="center"
        justifyContent="center"
      />
    </Box>
    <Box>
      <Text>{description}</Text>
      <Text color="text-secondary" fontSize="xs" whiteSpace="nowrap">
        {format(new Date(createDate), 'MMM dd, yyyy • h:mm a')}
      </Text>
    </Box>
  </Flex>
);

const ApprovalFlowHistory = ({ id }: any) => {
  const [entries, setEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [pageSize] = useState(15);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState(false);

  const loadData = async (page: number, append = false) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }

    try {
      const query = `page=${page}&sort=inserted_at_desc&page_size=${pageSize}`;
      const data = (await fetchAPI(`contents/${id}/logs?${query}`)) as Log;

      const newEntries = data?.entries || [];
      const total = data?.total_entries || 0;

      setEntries((prev) => (append ? [...prev, ...newEntries] : newEntries));
      setTotalEntries(total);
      setHasMore(
        (append ? entries.length + newEntries.length : newEntries.length) <
          total,
      );
    } catch (error) {
      console.error('Failed to load entries', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    if (id) {
      setCurrentPage(1);
      setEntries([]);
      loadData(1, false);
    } else {
      setIsLoading(false);
    }
  }, [id]);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadData(nextPage, true);
  };

  if (isLoading) {
    return (
      <Flex align="center" justify="center">
        <Spinner />
      </Flex>
    );
  }
  if (!isLoading && entries.length === 0) {
    return (
      <Box p="sm">
        <Text color="text-secondary">No Approval History</Text>
      </Box>
    );
  }
  return (
    <Box>
      {entries.map((item: any, index: number) => (
        <WorkflowStep
          key={index}
          createDate={item?.inserted_at}
          description={item?.message}
          isLast={index === entries.length - 1}
        />
      ))}

      {hasMore && (
        <Flex justify="center" mt="xl">
          <Button
            variant="tertiary"
            onClick={handleLoadMore}
            disabled={isLoadingMore}>
            {isLoadingMore ? (
              <Flex align="center" gap="xs">
                <Spinner />
              </Flex>
            ) : (
              'Show More'
            )}
          </Button>
        </Flex>
      )}
      {totalEntries > pageSize && (
        <Text fontSize="sm" color="text-secondary" textAlign="center" mt="xs">
          Showing {entries.length} of {totalEntries} entries
        </Text>
      )}
    </Box>
  );
};

export default ApprovalFlowHistory;
