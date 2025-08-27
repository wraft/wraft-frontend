import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import {
  Text,
  Box,
  Flex,
  Grid,
  Button,
  Tab,
  useTab,
  Skeleton,
} from '@wraft/ui';
import { CheckIcon, PlusIcon } from '@phosphor-icons/react';

// import PublicTemplates from 'components/PublicTemplates';
// import PublicTemplates from 'components/ImportTemplate/PublicTemplates';
import { IconFrame, PageInner } from 'common/Atoms';
import { useAuth } from 'contexts/AuthContext';
import { fetchAPI } from 'utils/models';

import ContractChart from './Charts';
import DocumentTypesChart from './DocumentTypesChart';
import PendingDocumentBlock from './PendingDocument';
import UpcomingExpiryContracts from './UpcomingExpiryContracts';

interface BlockCardProps {
  title: string;
  desc: number;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost';
  w?: string;
}

interface DashboardStatsProps {
  daily_documents: number;
  pending_approvals: number;
  total_documents: number;
}

export const BlockCard = ({
  title,
  desc,
  icon,
  size = 'md',
  variant = 'default',
  w,
}: BlockCardProps) => {
  const sizeStyles = {
    sm: { px: 'sm', py: 'sm', fontSize: 'sm' },
    md: { px: 'md', py: 'md', fontSize: 'sm2' },
    lg: { px: 'lg', py: 'lg', fontSize: 'md' },
  };

  const currentSize = sizeStyles[size];

  const variantStyles = {
    default: {
      border: '1px solid',
      borderColor: 'border',
    },
    ghost: {
      border: 'none',
    },
  };

  const currentVariant = variantStyles[variant];

  return (
    <Flex
      bg="background-primary"
      gap="xs"
      borderRadius="md"
      px={currentSize.px}
      py={currentSize.py}
      w={w}
      {...currentVariant}>
      {icon && <IconFrame color="gray.800">{icon}</IconFrame>}
      <Flex flex={1} gap="xs">
        <Text
          as="h4"
          mr="md"
          fontSize={currentSize.fontSize}
          fontWeight="heading"
          mb={1}
          color="gray.1100">
          {title}
        </Text>
        <Text ml="auto" fontWeight="normal" fontSize="lg">
          {desc === 0 ? '' : desc}
        </Text>
      </Flex>
    </Flex>
  );
};

const finishSetup = [
  {
    title: 'Import Documents to Repository',
  },
  {
    title: 'Generate Templates from Existing documents',
  },
  {
    title: 'Create a new flow',
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
  const [isLoading, setIsLoading] = useState(true);
  const tab = useTab({ defaultSelectedId: 'recent_documents' });
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

  const getDashboardStats = async () => {
    try {
      setIsLoading(true);
      const data: any = await fetchAPI('dashboard_stats');
      if (
        data &&
        typeof data.daily_documents === 'number' &&
        typeof data.pending_approvals === 'number' &&
        typeof data.total_documents === 'number'
      ) {
        setDashboardStatus(data);
      } else {
        setDashboardStatus({
          daily_documents: 0,
          pending_approvals: 0,
          total_documents: 0,
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      setDashboardStatus({
        daily_documents: 0,
        pending_approvals: 0,
        total_documents: 0,
      });
    } finally {
      setIsLoading(false);
    }
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

  const renderEmptyState = () => (
    <Box>
      <Flex
        my="lg"
        border="1px solid"
        borderColor="border"
        borderRadius="md"
        overflow="hidden">
        <Flex w="70%" alignItems="center" p="lg">
          <Image
            src="/static/images/dashboardone.png"
            alt="Welcome to Wraft"
            width={0}
            height={0}
            style={{ width: 'auto', height: '130px' }}
          />
          <Flex direction="column" gap="sm" ml="lg" pr="lg">
            <Text fontSize="base" fontWeight="heading">
              Welcome to Wraft
            </Text>
            <Text as="p" fontSize="sm2">
              Get started by watching our demo and following the setup steps
              below
            </Text>

            <Flex direction="row" gap="sm" mt="sm">
              <Button size="sm" variant="secondary">
                Watch demo
              </Button>
              <Button size="sm" variant="secondary">
                <PlusIcon size={16} weight="bold" color="white" />
                <Text fontSize="sm2" fontWeight="heading" color="text-primary">
                  Create a new template
                </Text>
              </Button>
            </Flex>
          </Flex>
        </Flex>
        <Flex
          w="100%"
          borderLeft="1px solid"
          borderColor="border"
          py="md"
          px="md"
          pb="lg">
          <Flex
            direction="column"
            gap="lg"
            px="lg"
            pt="md"
            bg="background-secondary"
            flex={1}>
            <Box fontSize="sm2" fontWeight="body" color="text-secondary">
              Complete these steps to get started
            </Box>
            <Flex direction="column" gap="md">
              {finishSetup.map((data, i) => (
                <Flex alignItems="center" key={i} gap="sm">
                  <Box
                    bg="green.900"
                    borderRadius="full"
                    w="16"
                    h="16"
                    p="xs"
                    display="flex"
                    alignItems="center"
                    justifyContent="center">
                    <CheckIcon size={14} weight="bold" color="white" />
                  </Box>
                  <Text fontSize="md" fontWeight="heading" color="text-primary">
                    {data.title}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Box>
        <Box>{/* <PublicTemplates /> */}</Box>
      </Box>
    </Box>
  );

  return (
    <PageInner>
      <Text color="text-secondary" fontSize="sm">
        {format(currentTime, 'EEEE, MMMM dd')}
      </Text>
      <Text fontWeight="heading" mb="xl" color="text-primary">
        {getGreeting()}, {userProfile?.name}
      </Text>

      {isLoading ? (
        <Box>
          {/* <Text as="h1" fontSize="2xl" fontWeight="heading" mb="lg">
            <Skeleton height="32px" width="200px" />
          </Text> */}
          <Grid gap="md" templateColumns="repeat(4, 1fr)" mb="xl">
            <Skeleton height="120px" width="100%" />
            <Skeleton height="120px" width="100%" />
            <Skeleton height="120px" width="100%" />
            <Skeleton height="120px" width="100%" />
          </Grid>
          <Box>
            <Skeleton height="400px" width="100%" />
          </Box>
        </Box>
      ) : dashboardStatus.total_documents === 0 ? (
        renderEmptyState()
      ) : (
        <>
          <Grid gap="md" templateColumns="repeat(4, 1fr)">
            {dashboardStatus.daily_documents > 0 && (
              <BlockCard
                title="Daily Total"
                desc={dashboardStatus.daily_documents}
              />
            )}
            <BlockCard
              title="Total Documents"
              desc={dashboardStatus.total_documents}
            />
            <BlockCard
              title="Pending Approvals"
              desc={dashboardStatus.pending_approvals}
            />
          </Grid>

          <Flex mt="xl" gap="lg">
            <Box
              borderRadius="md2"
              variant="block"
              mt="0"
              w="50%"
              p="lg"
              pl="xs"
              // bg="background-primary"
            >
              <Tab.List aria-label="Content Tab" store={tab}>
                <Tab id="recent_documents" store={tab}>
                  Recent Documents
                </Tab>
                <Tab id="upcoming" store={tab}>
                  Expiring Contracts
                </Tab>
                {/* <Tab id="expired" store={tab}>
                  Expired Contracts
                </Tab> */}
              </Tab.List>
              <Box mt="lg">
                <Tab.Panel tabId="recent_documents" store={tab}>
                  <PendingDocumentBlock />
                </Tab.Panel>
                <Tab.Panel tabId="upcoming" store={tab}>
                  <UpcomingExpiryContracts status="upcoming" />
                </Tab.Panel>
                {/* <Tab.Panel tabId="expired" store={tab}>
                  <UpcomingExpiryContracts status="expired" />
                </Tab.Panel> */}
              </Box>
            </Box>
            <Flex direction="column" w="50%" gap="lg">
              <ContractChart />
              <DocumentTypesChart />
            </Flex>
          </Flex>
        </>
      )}
    </PageInner>
  );
};

export default Dashboard;
