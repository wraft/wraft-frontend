import React, { useEffect, useState } from 'react';
import { Box, Flex, Text } from '@wraft/ui';
import { Check } from '@phosphor-icons/react';

import { TimeAgo } from 'common/Atoms';
import { fetchAPI } from 'utils/models';

const WorkflowStep = ({ title, description, createDate }: any) => (
  <Flex
    className="progress__item--completed"
    position="relative"
    gap="sm"
    align="self-start">
    <Box pt="xs">
      <Flex
        borderRadius="full"
        bg="gray.400"
        p="xxs"
        align="center"
        justify="center">
        <Check size={12} weight="bold" />
      </Flex>
    </Box>
    <Flex justify="space-between" flexGrow={1}>
      <Box>
        <Text>{description}</Text>
        <TimeAgo time={createDate} ago={false} />
      </Box>
      <Box>
        <Text>{title}</Text>
      </Box>
    </Flex>
  </Flex>
);

const ApprovalFlowHistory = ({ id }: any) => {
  const [contents, setContents] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = () => {
    fetchAPI(`contents/${id}/approval_history`)
      .then((data: any) => {
        const res: any = data;
        setContents(res);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };
  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  if (!isLoading && contents && contents.length === 0) {
    return <Text> No Approval History</Text>;
  }
  return (
    <Box
    // as="ul"
    // py: 3,
    // px: 3,
    // fontFamily: 'body',
    >
      {contents &&
        contents.map((item: any, index: any) => (
          <WorkflowStep
            key={index}
            status={item?.status}
            createDate={item?.reviewed_at}
            title={`${item?.to_state?.state}`}
            // description={`${item?.review_status} by ${item?.approver?.name}`}
            description={`${item?.approver?.name}`}
          />
        ))}
    </Box>
  );
};

export default ApprovalFlowHistory;
