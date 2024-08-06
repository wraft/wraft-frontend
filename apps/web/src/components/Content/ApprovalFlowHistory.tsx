import React, { useEffect, useState } from 'react';
import { Box, Flex } from 'theme-ui';

import { TimeAgo } from 'components/Atoms';
import { fetchAPI } from 'utils/models';

const WorkflowStep = ({ title, description, createDate }: any) => (
  <Flex
    as="li"
    className="progress__item--completed"
    sx={{
      position: 'relative',
      minHeight: '75px',
      counterIncrement: 'list',
      paddingLeft: '0.75rem',
      '&:before': {
        content: '""',
        position: 'absolute',
        left: '-1.6rem',
        top: '26px',
        height: '60%',
        width: '2px',
        borderLeft: '1px solid',
        borderColor: 'green.900',
      },
      '&:after': {
        content: 'counter(list)',
        position: 'absolute',
        top: '3px',
        left: '-2.2rem',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: 'transparent',
        color: '#fff',
        fontWeight: 400,
        fontSize: '13px',
        lineHeight: '1.3rem',
        textAlign: 'center',
      },
      '&:last-child': {
        '&:before': {
          border: 'none',
        },
      },
      '&.progress__item--completed': {
        opacity: 0.6,
        color: '#000',
        '&:after': {
          content: '"✓"',
          fontWeight: 400,
          background: 'green.500',
          color: 'green.900',
        },
      },
      '&.progress__item--active': {
        '&:after': {
          background: '#000',
          color: 'black',
        },
      },
    }}>
    <Box sx={{ width: '100%' }}>
      <Flex sx={{ justifyContent: 'space-between' }}>
        <Box
          sx={{
            fontWeight: 'bold',
            fontSize: '14px',
          }}>
          {title}
        </Box>
        <TimeAgo time={createDate} />
      </Flex>
      <Box
        sx={{
          fontSize: '12px',
          color: '#888888',
        }}>
        {description}
      </Box>
    </Box>
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
    return <Box p={4}>Loading...</Box>;
  }
  if (!isLoading && contents && contents.length === 0) {
    return <Box p={4}> No Approval History</Box>;
  }
  return (
    <Box
      as="ul"
      sx={{
        p: 4,
        fontFamily: 'body',
        position: 'relative',
        padding: '0 1rem 0 3.5rem',
        margin: '2rem 0 0',
        listStyle: 'none',
      }}>
      {contents &&
        contents.map((item: any, index: any) => (
          <WorkflowStep
            key={index}
            status={item?.status}
            createDate={item?.reviewed_at}
            title={`Flow: ${item?.to_state?.state}`}
            description={`${item?.review_status} by ${item?.approver?.name}`}
          />
        ))}
    </Box>
  );
};

export default ApprovalFlowHistory;
