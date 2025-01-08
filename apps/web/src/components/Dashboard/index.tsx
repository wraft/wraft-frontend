import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { Text, Box, Flex, Grid, Button } from '@wraft/ui';
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
  <Box
    bg="background-primary"
    border="1px solid"
    borderColor="border"
    borderRadius="sm"
    px="lg"
    py="xl">
    <File width={32} height={20} />
    <Flex ml={2} flex={1}>
      <Text fontWeight={500} mb={1} color="gray.1100">
        {title}
      </Text>
      <Text ml="auto">{desc}</Text>
    </Flex>
  </Box>
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
    <Box maxHeight="100vh" bg="background-secondary" p="lg">
      <Text color="text-secondary" fontSize="sm">
        {format(currentTime, 'EEEE, MMMM dd')}
      </Text>
      <Text fontWeight="heading" mb="xl" color="text-primary">
        {getGreeting()}, {userProfile?.name}
      </Text>
      <Flex my="lg" display="none" border="1px solid" borderColor="border">
        <Flex w="70%" alignItems="center">
          <Image
            src="/static/images/dashboardone.png"
            alt="Description of your image"
            width={0}
            height={0}
            style={{ width: 'auto', height: '180px' }}
          />
          <Box>
            <Box
              fontSize="base"
              fontWeight="heading"
              lineHeight="19.2px"
              mb={3}>
              Personalise your experience
            </Box>
            <Text as="p" fontSize="xs" mb={3}>
              Customise Wraft to suit to your experience. Lorem ipsum dolor sit
              amet, consectetur adipiscing elit
            </Text>
            <Button variant="primary">Watch demo</Button>
          </Box>
        </Flex>
        <Flex
          w="30%"
          // justifyContent: 'center',
          borderLeft="1px solid"
          borderColor="border"
          py={3}
          px={4}>
          <Box>
            <Box fontSize="sm" fontWeight="heading" mb="18px">
              Finish setup
            </Box>
            {finishSetup.map((data, i) => (
              <Flex alignItems="center" mb="18px" key={i}>
                <ApproveTick />
                <Box px={2} fontSize="xs">
                  {data.title}
                </Box>
              </Flex>
            ))}
          </Box>
        </Flex>
      </Flex>

      <Grid gap="md" templateColumns="repeat(4, 1fr)">
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
    </Box>
  );
};

export default Dashboard;
