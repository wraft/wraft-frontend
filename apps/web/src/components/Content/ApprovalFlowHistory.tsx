import React, { useEffect, useState } from 'react';
import { Box, Button, Flex, Spinner, Text } from '@wraft/ui';
import { format } from 'date-fns';

import { fetchAPI } from 'utils/models';

const WorkflowStep = ({ title, description, createDate, isLast }: any) => (
  <Flex position="relative" gap="sm" align="self-start" py="md">
    {!isLast && (
      <Box
        position="absolute"
        left="8px"
        top="28px"
        w="2px"
        h="100%"
        bg="gray.300"
      />
    )}

    <Box pt="xs" position="relative" zIndex="1">
      <Box
        w="18px"
        h="18px"
        borderRadius="full"
        bg="gray.600"
        display="flex"
        alignItems="center"
        justifyContent="center">
        {/* <Box w="8px" h="8px" borderRadius="full" bg="white" /> */}
      </Box>
    </Box>

    <Flex justify="space-between" flexGrow={1}>
      <Box>
        <Text fontWeight="bold" color="gray.1100">
          {description}
        </Text>
        <Text fontSize="sm" opacity="0.8">
          {format(new Date(createDate), 'MMM dd, yyyy • h:mm a')}
        </Text>
      </Box>
      <Box>
        <Text color="gray.900">{title}</Text>
      </Box>
    </Flex>
  </Flex>
);

const ApprovalFlowHistory = ({ id }: any) => {
  const [entries, setEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState(false);

  const loadData = (page: number, append: boolean = false) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }
    const query = `page=${page}&sort=inserted_at_desc&page_size=10`;

    fetchAPI(`contents/${id}/logs?${query}`)
      .then((data: any) => {
        const newEntries = data.entries || [];

        if (append) {
          setEntries((prev) => [...prev, ...newEntries]);
        } else {
          setEntries(newEntries);
        }

        setTotalEntries(data.total_entries || 0);

        const totalLoaded = append
          ? entries.length + newEntries.length
          : newEntries.length;
        setHasMore(totalLoaded < (data.total_entries || 0));

        setIsLoading(false);
        setIsLoadingMore(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (id) {
      setCurrentPage(1);
      setEntries([]);
      loadData(1, false);
    }
  }, [id]);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadData(nextPage, true);
  };

  if (isLoading) {
    return (
      <Flex align="center" justify="center" h="100vh">
        <Spinner />
      </Flex>
    );
  }
  if (!isLoading && entries.length === 0) {
    return <Text> No Approval History</Text>;
  }
  return (
    <Box
    // as="ul"
    // py: 3,
    // px: 3,
    // fontFamily: 'body',
    >
      {entries.map((item: any, index: number) => (
        <WorkflowStep
          key={index}
          // status={item?.status}
          createDate={item?.inserted_at}
          title={`${item?.action}`}
          // description={`${item?.review_status} by ${item?.approver?.name}`}
          description={`${item?.actor?.name}`}
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

      <Text fontSize="sm" color="gray.600" textAlign="center" mt="xs">
        Showing {entries.length} of {totalEntries} entries
      </Text>
    </Box>
  );
};

export default ApprovalFlowHistory;
