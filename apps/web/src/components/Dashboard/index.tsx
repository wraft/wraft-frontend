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
  Drawer,
  useDrawer,
} from '@wraft/ui';
import {
  BookOpenIcon,
  MagicWandIcon,
  XIcon,
  YoutubeLogoIcon,
} from '@phosphor-icons/react';

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

interface Template {
  id: string;
  name: string;
  description: string;
  file_name: string;
  file_size: string;
  thumbnail_url: string;
  zip_file_url: string;
}

interface TemplatesResponse {
  templates: Template[];
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

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dashboardStatus, setDashboardStatus] = useState<DashboardStatsProps>({
    daily_documents: 0,
    pending_approvals: 0,
    total_documents: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [templatesError, setTemplatesError] = useState<string | null>(null);
  const tab = useTab({ defaultSelectedId: 'recent_documents' });
  const { userProfile } = useAuth();
  const templateDrawer = useDrawer();

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

  const fetchPublicTemplates = async () => {
    try {
      setTemplatesLoading(true);
      setTemplatesError(null);
      console.log('Fetching public templates...');
      const data = (await fetchAPI(
        'template_assets/public/templates',
      )) as TemplatesResponse;
      console.log('Templates loaded:', data.templates);
      setTemplates(data.templates || []);
    } catch (error) {
      console.error('Failed to fetch public templates:', error);
      setTemplatesError('Failed to load templates. Please try again.');
      setTemplates([]);
    } finally {
      setTemplatesLoading(false);
    }
  };

  const handleTemplateInstall = async (template: Template) => {
    try {
      // For now, we'll just log the installation and show a success message
      // In a real implementation, this would call an install API
      console.log('Installing template:', template.name);

      // You can implement the actual installation logic here
      // For example: await fetchAPI('templates/install', { template_id: template.id });

      alert(`Template "${template.name}" installation started!`);
    } catch (error) {
      console.error('Failed to install template:', error);
      alert('Failed to install template. Please try again.');
    }
  };

  const handleOpenTemplateDrawer = () => {
    templateDrawer.show();
    // Always fetch fresh templates when drawer opens
    fetchPublicTemplates();
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
    <Box style={{ maxWidth: 'auto' }}>
      <Flex
        border="1px solid"
        borderColor="border"
        p="xl"
        borderRadius="lg"
        bg="background-primary"
        overflow="hidden">
        <Flex alignItems="center" p="lg">
          <Image
            src="/static/images/dashboardone.png"
            alt="Welcome to Wraft"
            width={0}
            height={0}
            style={{ width: 'auto', height: '130px' }}
          />
          <Flex direction="column" gap="sm" ml="lg" pr="lg">
            <Text fontSize="sm2" fontWeight="heading">
              Hi {userProfile?.name}! Welcome to Wraft
            </Text>
            <Text as="p" fontSize="sm2" color="text-secondary">
              Explore our quick demo or jumpstart your workflow with a
              ready-made template from our public library below.
            </Text>

            <Flex direction="row" gap="sm" mt="sm">
              <Button
                size="sm"
                variant="primary"
                onClick={handleOpenTemplateDrawer}>
                <IconFrame color="gray.800" mr="xs">
                  <MagicWandIcon size={16} />
                </IconFrame>
                Start with a Template
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  window.open(
                    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    '_blank',
                  );
                }}>
                <IconFrame color="gray.800" mr="xs">
                  <YoutubeLogoIcon size={16} />
                </IconFrame>
                Watch demo
              </Button>

              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  window.open('https://www.wraft.ai/docs', '_blank');
                }}>
                <IconFrame color="gray.800" mr="xs">
                  <BookOpenIcon size={16} />
                </IconFrame>
                Read Documentation
              </Button>
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
      <Box>
        <Text color="text-secondary" fontSize="sm">
          {format(currentTime, 'EEEE, MMMM dd')}
        </Text>
        <Text fontWeight="heading" mb="md" color="text-primary">
          {getGreeting()}, {userProfile?.name}
        </Text>
      </Box>

      {isLoading ? (
        <Box>
          {/* <Text as="h1" fontSize="2xl" fontWeight="heading" mb="lg">
            <Skeleton height="32px" width="200px" />
          </Text> */}
          <Grid gap="md" templateColumns="repeat(4, 1fr)" mb="md">
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

      {/* Template Drawer */}
      <Drawer
        store={templateDrawer}
        placement="right"
        withBackdrop={true}
        hideOnInteractOutside={true}
        open={templateDrawer.useState().open}>
        <Drawer.Header>
          <Drawer.Title>Choose a Template</Drawer.Title>
          <Button
            variant="ghost"
            size="sm"
            onClick={templateDrawer.hide}
            style={{ padding: '4px' }}>
            <XIcon size={14} weight="bold" />
          </Button>
        </Drawer.Header>

        <Box p="xl" pt="0">
          <Text fontSize="sm" color="text-secondary" mb="lg">
            Select from our collection of professional document templates to
            jumpstart your workflow.
          </Text>

          {/* Loading State */}
          {templatesLoading && (
            <Flex direction="column" gap="md">
              {[1, 2, 3].map((item) => (
                <Skeleton key={item} height="80px" width="100%" />
              ))}
            </Flex>
          )}

          {/* Error State */}
          {templatesError && (
            <Box
              border="1px solid"
              borderColor="red.300"
              borderRadius="md"
              p="md"
              bg="red.50"
              mb="lg">
              <Text fontSize="sm" color="red.600">
                {templatesError}
              </Text>
              <Button
                size="sm"
                variant="secondary"
                onClick={fetchPublicTemplates}
                style={{ marginTop: '8px' }}>
                Try Again
              </Button>
            </Box>
          )}

          {/* Templates List */}
          {!templatesLoading && !templatesError && templates.length > 0 && (
            <Box>
              <Text
                fontSize="sm"
                fontWeight="heading"
                mb="md"
                color="text-primary">
                Available Templates ({templates.length})
              </Text>
              <Flex direction="column" gap="md">
                {templates.map((template) => (
                  <Flex
                    key={template.id}
                    border="1px solid"
                    borderColor="border"
                    borderRadius="md"
                    p="md"
                    bg="background-primary"
                    alignItems="center"
                    gap="md">
                    {/* Template Thumbnail */}
                    <Box
                      w="60px"
                      h="70px"
                      borderRadius="sm"
                      overflow="hidden"
                      border="1px solid"
                      borderColor="border"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bg="gray.50">
                      {template.thumbnail_url ? (
                        <Image
                          src={template.thumbnail_url}
                          alt={template.name}
                          width={60}
                          height={60}
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <Text fontSize="xs" color="gray.600">
                          📄
                        </Text>
                      )}
                    </Box>

                    {/* Template Info */}
                    <Flex direction="column" flex={1} gap="xs">
                      <Text
                        fontSize="sm"
                        fontWeight="heading"
                        color="text-primary">
                        {template.name}
                      </Text>
                      <Text fontSize="sm" color="text-secondary">
                        {template.description}
                      </Text>
                      <Text fontSize="xs" color="text-secondary">
                        {template.file_size}
                      </Text>
                    </Flex>

                    {/* Install Button */}
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleTemplateInstall(template)}>
                      Install
                    </Button>
                  </Flex>
                ))}
              </Flex>
            </Box>
          )}

          {/* Empty State */}
          {!templatesLoading && !templatesError && templates.length === 0 && (
            <Box
              textAlign="center"
              py="xl"
              border="1px solid"
              borderColor="border"
              borderRadius="md"
              bg="background-primary">
              <Text fontSize="sm" color="text-secondary" mb="md">
                No templates available at the moment.
              </Text>
              <Button
                size="sm"
                variant="secondary"
                onClick={fetchPublicTemplates}>
                Refresh
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>
    </PageInner>
  );
};

export default Dashboard;
