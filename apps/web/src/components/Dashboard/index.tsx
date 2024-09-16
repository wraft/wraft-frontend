import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@wraft/ui';
import { format } from 'date-fns';
import { Text, Box, Flex, Container, Grid } from 'theme-ui';
import { File } from '@phosphor-icons/react';

import { ApproveTick } from 'components/Icons';
import { useAuth } from 'contexts/AuthContext';
import { fetchAPI } from 'utils/models';

import PendingDocumentBlock from './PendingDocument';

interface BlockCardProps {
  title: string;
  desc: number;
}
interface DashboardStatsProps {
  daily_documents: number;
  pending_approvals: number;
  total_documents: number;
}
const BlockCard = ({ title, desc }: BlockCardProps) => (
  <Flex
    sx={{
      maxWidth: '100%', // max-width: 33%;
      border: '1px solid',
      bg: 'gray.100',
      borderRadius: '4px',
      borderColor: 'gray.400',
      py: '22px',
      px: '18px',
      svg: {
        fill: 'gray.900',
      },
    }}>
    <File width={32} height={20} />
    <Flex ml={2} sx={{ flex: 1 }}>
      <Box
        sx={{
          fontSize: 'sm',
          fontWeight: 500,
          mb: 1,
          color: 'gray.1100',
        }}>
        {title}
      </Box>
      <Box
        sx={{
          ml: 'auto',
          fontSize: 'base',
          fontWeight: 300,
        }}>
        {desc}
      </Box>
    </Flex>
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
  const [dashboardStatus, setDashboardStatus] = useState<DashboardStatsProps>({
    daily_documents: 0,
    pending_approvals: 0,
    total_documents: 0,
  });
  // const [dashboardLoading, setDashboardLoading] = useState();
  const { userProfile } = useAuth();

  useEffect(() => {
    getDashboardStats();
  }, [userProfile?.organisation_id]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 50000);

    return () => clearInterval(intervalId);
  }, [userProfile?.organisation_id]);

  const getDashboardStats = () => {
    fetchAPI('dashboard_stats').then((data: any) => {
      setDashboardStatus(data);
    });
  };

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
      <Box sx={{ fontSize: 'sm', color: 'gray.900' }}>
        {format(currentTime, 'EEEE, MMMM dd')}
      </Box>
      <Box
        sx={{
          fontSize: 'sm',
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
                fontSize: 'base',
                fontWeight: 'heading',
                lineHeight: '19.2px',
                mb: 3,
              }}>
              Personalise your experience
            </Box>
            <Text as="p" sx={{ fontSize: 'xs', mb: 3 }}>
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
                fontSize: 'sm',
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
                    fontSize: 'xs',
                  }}>
                  {data.title}
                </Box>
              </Flex>
            ))}
          </Box>
        </Flex>
      </Flex>

      <Grid gap={3} columns={4}>
        <BlockCard
          title="Daily Total"
          desc={dashboardStatus?.daily_documents}
        />
        <BlockCard
          title="Total Documents"
          desc={dashboardStatus?.total_documents}
        />
        <BlockCard
          title="Pending Approvals"
          desc={dashboardStatus?.pending_approvals}
        />
      </Grid>

      <PendingDocumentBlock />
    </Container>
  );
};

export default Dashboard;
