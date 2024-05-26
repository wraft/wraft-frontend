import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@wraft/ui';
import { format } from 'date-fns';
import { Text, Box, Flex, Container, Grid } from 'theme-ui';
import { File } from '@phosphor-icons/react';

import { useAuth } from '../../contexts/AuthContext';
import { ApproveTick, DocumentCountIcon } from '../Icons';
import PendingDocumentBlock from './PendingDocument';

interface BlockCardProps {
  title: string;
  desc: string;
}
const BlockCard = ({ title, desc }: BlockCardProps) => (
  <Flex
    sx={{
      border: '1px solid',
      bg: 'gray.100',
      borderRadius: '4px',
      borderColor: 'gray.500',
      py: '22px',
      px: '18px',
      svg: {
        fill: 'gray.800',
      },
    }}>
    <File width={40} height={20} />
    <Box ml={3}>
      <Box
        sx={{
          fontSize: 2,
          mb: 1,
          color: 'gray.a1000',
        }}>
        {title}
      </Box>
      <Box
        sx={{
          fontSize: 3,
          fontWeight: 100,
        }}>
        {desc}
      </Box>
    </Box>
  </Flex>
);

const finishSetup = [
  {
    title: 'Create a new template',
  },
  {
    title: 'Add a new layout',
  },
  {
    title: 'Customise a new theme',
  },
  {
    title: 'Create a new flow',
  },
];

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  // const [dashboardLoading, setDashboardLoading] = useState();
  const { userProfile } = useAuth();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 50000);

    return () => clearInterval(intervalId);
  }, [userProfile?.organisation_id]);

  const getGreeting = () => {
    const currentHour = currentTime.getHours();

    if (currentHour >= 0 && currentHour < 6) {
      return 'Good night';
    } else if (currentHour >= 6 && currentHour < 12) {
      return 'Good morning';
    } else if (currentHour >= 12 && currentHour < 17) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  };

  return (
    <Container
      variant="layout.pageFrame"
      sx={{ height: '100vh', bg: 'gray.200' }}>
      <Box sx={{ fontSize: 2, color: 'gray.900' }}>
        {format(currentTime, 'EEEE, MMMM dd')}
      </Box>
      <Box
        sx={{
          fontSize: 3,
          fontWeight: 'heading',
          fontFamily: 'body',
          mb: 3,
          color: 'gray.1200',
        }}>
        {getGreeting()}, {userProfile?.name}
      </Box>
      <Flex
        mt={4}
        mb="32px"
        sx={{ display: 'none', border: '1px solid', borderColor: 'border' }}>
        <Flex sx={{ width: '70%', alignItems: 'center' }}>
          <Image
            src="/static/images/dashboardone.png" // Adjust the path accordingly
            alt="Description of your image"
            width={0}
            height={0} // Set the desired height
            style={{ width: 'auto', height: '180px' }}
          />
          <Box>
            <Box
              sx={{
                fontSize: '16px',
                fontWeight: 'heading',
                lineHeight: '19.2px',
                mb: 3,
              }}>
              Personalise your experience
            </Box>
            <Text as="p" sx={{ fontSize: '12px', mb: 3 }}>
              Customise Wraft to suit to your experience. Lorem ipsum dolor sit
              amet, consectetur adipiscing elit
            </Text>
            <Button variant="primary">Watch demo</Button>
          </Box>
        </Flex>
        <Flex
          sx={{
            width: '30%',
            // justifyContent: 'center',
            borderLeft: '1px solid',
            borderColor: 'border',
            py: 3,
            px: 4,
          }}>
          <Box>
            <Box
              sx={{
                fontSize: '14px',
                fontWeight: 'heading',
                mb: '18px',
              }}>
              Finish setup
            </Box>
            {finishSetup.map((data, i) => (
              <Flex sx={{ alignItems: 'center', mb: '18px' }} key={i}>
                <ApproveTick />
                <Box
                  px={2}
                  sx={{
                    fontSize: '12px',
                  }}>
                  {data.title}
                </Box>
              </Flex>
            ))}
          </Box>
        </Flex>
      </Flex>

      <Grid gap={3} columns={2}>
        <BlockCard title="Total Documents" desc="4" />
        <BlockCard title="Pending Approvals" desc="2" />
      </Grid>

      <PendingDocumentBlock />
    </Container>
  );
};

export default Dashboard;
