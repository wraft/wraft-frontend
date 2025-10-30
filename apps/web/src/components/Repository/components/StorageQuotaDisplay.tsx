import React from 'react';
import { Box, Text, Flex } from '@wraft/ui';
import { CloudIcon, HardDriveIcon } from '@phosphor-icons/react';

import { useStorageQuota } from '../hooks/useStorageQuota';

interface StorageQuotaDisplayProps {
  className?: string;
}

/**
 * Utility function to format bytes to human readable format
 */
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Component to display Google Drive storage quota information
 */
export const StorageQuotaDisplay: React.FC<StorageQuotaDisplayProps> = ({
  className,
}) => {
  const { quota, isLoading, error } = useStorageQuota();

  if (isLoading) {
    return (
      <Box p="sm" border="1px solid" borderColor="border" borderRadius="md">
        <Flex align="center" gap="xs">
          <CloudIcon size={16} />
          <Text fontSize="sm" color="text-secondary">
            Loading storage info...
          </Text>
        </Flex>
      </Box>
    );
  }

  if (error || !quota) {
    return (
      <Box
        className={className}
        p="sm"
        border="1px solid"
        borderColor="border"
        borderRadius="md">
        <Flex align="center" gap="xs">
          <HardDriveIcon size={16} />
          <Text fontSize="sm" color="text-secondary">
            Storage info unavailable
          </Text>
        </Flex>
      </Box>
    );
  }

  const totalBytes = parseInt(quota.limit);
  const usedBytes = parseInt(quota.usage);
  const usagePercentage = totalBytes > 0 ? (usedBytes / totalBytes) * 100 : 0;

  return (
    <Box
      className={className}
      p="sm"
      border="1px solid"
      borderColor="border"
      borderRadius="md">
      <Flex direction="column" gap="xs">
        <Flex align="center" justify="space-between">
          <Flex align="center" gap="xs">
            <CloudIcon size={16} />
            <Text fontSize="sm" fontWeight="medium">
              Google Drive Storage
            </Text>
          </Flex>
          <Text fontSize="xs" color="text-secondary">
            {formatBytes(usedBytes)} / {formatBytes(totalBytes)}
          </Text>
        </Flex>

        {/* Progress bar using CSS */}
        <Box
          w="100%"
          h="8px"
          backgroundColor="gray-200"
          borderRadius="full"
          overflow="hidden">
          <Box
            w={`${usagePercentage}%`}
            h="100%"
            backgroundColor={
              usagePercentage > 90
                ? 'red-500'
                : usagePercentage > 75
                  ? 'orange-500'
                  : 'green-500'
            }
            transition="width 0.3s ease"
          />
        </Box>

        <Flex justify="space-between" align="center">
          <Text fontSize="xs" color="text-secondary">
            {usagePercentage.toFixed(1)}% used
          </Text>
          <Text fontSize="xs" color="text-secondary">
            {formatBytes(totalBytes - usedBytes)} free
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};
