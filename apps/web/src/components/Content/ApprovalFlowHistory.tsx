import React, { useEffect, useState } from 'react';
import { Box, Flex, Text } from '@wraft/ui';
import { Check } from '@phosphor-icons/react';

import { TimeAgo } from 'common/Atoms';
import { fetchAPI } from 'utils/models';

const WorkflowStep = ({ title, name, createDate, profile_pic }: any) => (
  <Flex
    className="progress__item--completed"
    position="relative"
    gap="sm"
    align="self-start">
    {/* <Box pt="xs">
      <Flex
        borderRadius="full"
        bg="gray.700"
        p="xxs"
        align="center"
        justify="center">
        {profile_pic}
        <img src={profile_pic} alt="Profile Picture" />
      </Flex>
    </Box> */}
    <Flex justify="space-between" flexGrow={1}>
      <Flex gap="sm">
        <Text>{name}</Text>
        <Text as="span" fontStyle="italic" opacity="0.6">
          changed to
        </Text>
        <Text as="span" fontWeight="medium">
          {title}
        </Text>
      </Flex>
      <TimeAgo time={createDate} />
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
            profile_pic={item?.profile_pic}
            // description={`${item?.review_status} by ${item?.approver?.name}`}
            name={`${item?.approver?.name}`}
          />
        ))}
    </Box>
  );
};

export default ApprovalFlowHistory;
