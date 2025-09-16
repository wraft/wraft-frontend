import React, { useEffect, useState } from 'react';
import { Box, Flex, Text } from '@wraft/ui';
import { Check } from '@phosphor-icons/react';
import { format } from 'date-fns';

import { IconFrame } from 'common/Atoms';
import { fetchAPI } from 'utils/models';

const WorkflowStep = ({ title, description, createDate }: any) => (
  <Flex
    position="relative"
    gap="sm"
    align="self-start"
    py="xxs"
    borderBottom="1px solid"
    borderColor="gray.400">
    <Box pt="xs">
      <Flex
        borderRadius="full"
        bg="gray.400"
        p="xxs"
        align="center"
        justify="center">
        <IconFrame color="primary">
          <Check size={10} weight="bold" />
        </IconFrame>
      </Flex>
    </Box>
    <Flex justify="space-between" flexGrow={1}>
      <Box>
        <Text>{description}</Text>
        <Text fontSize="sm" opacity="0.8">
          {format(new Date(createDate), 'MMM dd, yyyy • h:mm a')}
        </Text>
      </Box>
      <Box>
        <Text>{title}</Text>
      </Box>
    </Flex>
  </Flex>
);

const ApprovalFlowHistory = ({ id }: any) => {
  const [logs, setlogs] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = () => {
    fetchAPI(`contents/${id}/logs`)
      .then((data: any) => {
        setlogs(data.logs || []);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };
  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  if (!isLoading && logs.length === 0) {
    return <Text> No Approval History</Text>;
  }
  return (
    <Box
    // as="ul"
    // py: 3,
    // px: 3,
    // fontFamily: 'body',
    >
      {logs.map((item: any, index: number) => (
        <WorkflowStep
          key={index}
          // status={item?.status}
          createDate={item?.inserted_at}
          title={`${item?.action}`}
          // description={`${item?.review_status} by ${item?.approver?.name}`}
          description={`${item?.actor?.name}`}
        />
      ))}
    </Box>
  );
};

export default ApprovalFlowHistory;
