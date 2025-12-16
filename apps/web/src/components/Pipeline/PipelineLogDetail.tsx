import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Text, Flex, Spinner, Grid } from '@wraft/ui';
import {
  ClockIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  InfoIcon,
  CodeIcon,
} from '@phosphor-icons/react';
import toast from 'react-hot-toast';

import { StateBadge, TimeAgo, PageInner } from 'common/Atoms';
import { fetchAPI } from 'utils/models';

interface TriggerDetail {
  id: string;
  data: any;
  response: any;
  error: any;
  state: string;
  start_time: string;
  end_time: string;
  duration: number;
  zip_file: string | null;
  updated_at: string;
  inserted_at: string;
  creator: {
    id: string;
    name: string;
    email: string;
  };
}

const PipelineLogDetail = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [logDetail, setLogDetail] = useState<TriggerDetail | null>(null);
  const router = useRouter();
  const { logId } = router.query;

  useEffect(() => {
    if (logId) {
      loadLogDetail(logId as string);
    }
  }, [logId]);

  const loadLogDetail = async (triggerId: string) => {
    setLoading(true);
    try {
      const data = (await fetchAPI(`triggers/${triggerId}`)) as TriggerDetail;
      setLogDetail(data);
    } catch (error) {
      toast.error('Failed to load log details');
      router.push('/404');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (milliseconds: number | null | undefined) => {
    if (!milliseconds) return 'N/A';

    // If less than 1 second, show only milliseconds
    if (milliseconds < 1000) {
      return `${milliseconds}ms`;
    }

    // Convert to seconds
    const totalSeconds = Math.floor(milliseconds / 1000);
    const ms = milliseconds % 1000;

    // If less than 60 seconds, show seconds with milliseconds
    if (totalSeconds < 60) {
      return ms > 0 ? `${totalSeconds}s ${ms}ms` : `${totalSeconds}s`;
    }

    // For longer durations, show minutes, seconds, and milliseconds
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (ms > 0) {
      return `${minutes}m ${seconds}s ${ms}ms`;
    }
    return `${minutes}m ${seconds}s`;
  };

  const formatJSON = (obj: any) => {
    if (!obj) return 'N/A';
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return String(obj);
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" py="xl" h="50vh">
        <Spinner />
      </Flex>
    );
  }

  if (!logDetail) {
    return (
      <PageInner>
        <Box p="lg" textAlign="center">
          <Text fontSize="lg" color="text-secondary">
            Log not found
          </Text>
        </Box>
      </PageInner>
    );
  }

  const getStatusIcon = () => {
    if (logDetail.state === 'success') {
      return <CheckCircleIcon size={20} color="#22c55e" weight="fill" />;
    }
    if (
      logDetail.state === 'pending' ||
      logDetail.state === 'partially_completed'
    ) {
      return <XCircleIcon size={20} color="#ef4444" weight="fill" />;
    }
    return <XCircleIcon size={20} color="#ef4444" weight="fill" />;
  };

  return (
    <PageInner>
      <Box>
        <Box
          mb="lg"
          p="lg"
          bg="background-primary"
          borderRadius="md"
          border="1px solid"
          borderColor="border"
          boxShadow="sm">
          <Flex align="center" justify="space-between" mb="md">
            <Flex align="center" gap="md">
              {getStatusIcon()}
              <Box>
                <Text fontSize="sm" color="text-secondary" mb="xs">
                  Task ID
                </Text>
                <Text fontFamily="monospace" fontSize="md" fontWeight="600">
                  {logDetail.id}
                </Text>
              </Box>
            </Flex>
            <StateBadge
              color={
                logDetail.state == 'pending'
                  ? 'red.400'
                  : logDetail.state == 'success'
                    ? 'green.a400'
                    : logDetail.state == 'partially_completed'
                      ? 'red.400'
                      : 'red.400'
              }
              name={
                logDetail.state == 'success'
                  ? logDetail.state.replace(/_/g, ' ')
                  : 'error'
              }
            />
          </Flex>
        </Box>

        <Grid
          templateColumns="repeat(auto-fit, minmax(250px, 1fr))"
          gap="md"
          mb="lg">
          <Box
            p="lg"
            bg="background-primary"
            borderRadius="md"
            border="1px solid"
            borderColor="border"
            boxShadow="sm">
            <Flex align="center" gap="sm" mb="sm">
              <ClockIcon size={18} color="#6b7280" />
              <Text fontSize="sm" color="text-secondary" fontWeight="500">
                Duration
              </Text>
            </Flex>
            <Text fontSize="xl" fontWeight="heading" color="text-primary">
              {formatDuration(logDetail.duration)}
            </Text>
          </Box>

          <Box
            p="lg"
            bg="background-primary"
            borderRadius="md"
            border="1px solid"
            borderColor="border"
            boxShadow="sm">
            <Flex align="center" gap="sm" mb="sm">
              <ClockIcon size={18} color="#6b7280" />
              <Text fontSize="sm" color="text-secondary" fontWeight="500">
                Start Time
              </Text>
            </Flex>
            <Text fontSize="md" fontWeight="600" color="text-primary">
              {logDetail.start_time
                ? logDetail.start_time.replace('T', ' ').replace(/-/g, '/')
                : 'N/A'}
            </Text>
          </Box>

          <Box
            p="lg"
            bg="background-primary"
            borderRadius="md"
            border="1px solid"
            borderColor="border"
            boxShadow="sm">
            <Flex align="center" gap="sm" mb="sm">
              <ClockIcon size={18} color="#6b7280" />
              <Text fontSize="sm" color="text-secondary" fontWeight="500">
                End Time
              </Text>
            </Flex>
            <Text fontSize="md" fontWeight="600" color="text-primary">
              {logDetail.end_time
                ? logDetail.end_time.replace('T', ' ').replace(/-/g, '/')
                : 'N/A'}
            </Text>
          </Box>

          {logDetail.creator && (
            <Box
              p="lg"
              bg="background-primary"
              borderRadius="md"
              border="1px solid"
              borderColor="border"
              boxShadow="sm">
              <Flex align="center" gap="sm" mb="sm">
                <UserIcon size={18} color="#6b7280" />
                <Text fontSize="sm" color="text-secondary" fontWeight="500">
                  Created By
                </Text>
              </Flex>
              <Text fontSize="md" fontWeight="600" color="text-primary">
                {logDetail.creator.name}
              </Text>
              <Text fontSize="xs" color="text-secondary" mt="xs">
                {logDetail.creator.email}
              </Text>
            </Box>
          )}
        </Grid>
        <Box
          mb="lg"
          p="lg"
          bg="background-primary"
          borderRadius="md"
          border="1px solid"
          borderColor="border"
          boxShadow="sm">
          <Flex align="center" gap="sm" mb="md">
            <InfoIcon size={18} color="#6b7280" />
            <Text fontSize="md" fontWeight="heading">
              Additional Information
            </Text>
          </Flex>
          <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap="md">
            <Box>
              <Text fontSize="sm" color="text-secondary" mb="xs">
                Created At
              </Text>
              <TimeAgo time={logDetail.inserted_at} />
            </Box>
            <Box>
              <Text fontSize="sm" color="text-secondary" mb="xs">
                Updated At
              </Text>
              <TimeAgo time={logDetail.updated_at} />
            </Box>
          </Grid>
        </Box>

        {logDetail.data && (
          <Box
            mb="lg"
            p="lg"
            bg="background-primary"
            borderRadius="md"
            border="1px solid"
            borderColor="border"
            boxShadow="sm">
            <Flex align="center" gap="sm" mb="md">
              <CodeIcon size={18} color="#6b7280" />
              <Text fontSize="md" fontWeight="heading">
                Input Data
              </Text>
            </Flex>
            <Box
              p="md"
              bg="gray.50"
              borderRadius="sm"
              border="1px solid"
              borderColor="gray.200"
              maxH="500px"
              overflowY="auto"
              position="relative">
              <Text
                as="pre"
                fontSize="xs"
                fontFamily="monospace"
                whiteSpace="pre-wrap"
                style={{ wordBreak: 'break-word', margin: 0 }}>
                {formatJSON(logDetail.data)}
              </Text>
            </Box>
          </Box>
        )}

        {logDetail.response && (
          <Box
            mb="lg"
            p="lg"
            bg="background-primary"
            borderRadius="md"
            border="1px solid"
            borderColor="border"
            boxShadow="sm">
            <Flex align="center" gap="sm" mb="md">
              <CodeIcon size={18} color="#6b7280" />
              <Text fontSize="md" fontWeight="heading">
                Response
              </Text>
            </Flex>
            <Box
              p="md"
              bg="gray.50"
              borderRadius="sm"
              border="1px solid"
              borderColor="gray.200"
              maxH="500px"
              overflowY="auto"
              position="relative">
              <Text
                as="pre"
                fontSize="xs"
                fontFamily="monospace"
                whiteSpace="pre-wrap"
                style={{ wordBreak: 'break-word', margin: 0 }}>
                {formatJSON(logDetail.response)}
              </Text>
            </Box>
          </Box>
        )}

        {logDetail.error && Object.keys(logDetail.error).length > 0 && (
          <Box
            mb="lg"
            p="lg"
            bg="red.50"
            borderRadius="md"
            border="1px solid"
            borderColor="red.200"
            boxShadow="sm">
            <Flex align="center" gap="sm" mb="md">
              <XCircleIcon size={18} color="#ef4444" weight="fill" />
              <Text fontSize="md" fontWeight="heading" color="red.700">
                Error Details
              </Text>
            </Flex>
            <Box
              p="md"
              bg="white"
              borderRadius="sm"
              border="1px solid"
              borderColor="red.200"
              maxH="500px"
              overflowY="auto"
              position="relative">
              <Text
                as="pre"
                fontSize="xs"
                fontFamily="monospace"
                color="red.800"
                whiteSpace="pre-wrap"
                style={{ wordBreak: 'break-word', margin: 0 }}>
                {formatJSON(logDetail.error)}
              </Text>
            </Box>
          </Box>
        )}
      </Box>
    </PageInner>
  );
};

export default PipelineLogDetail;
