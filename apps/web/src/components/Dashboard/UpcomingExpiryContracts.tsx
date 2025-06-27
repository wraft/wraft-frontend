import React, { useEffect, useState, useCallback, useMemo } from 'react';
import router from 'next/router';
import { Box, Text, Skeleton, Pagination, Flex } from '@wraft/ui';
import styled from '@xstyled/emotion';

import { useAuth } from 'contexts/AuthContext';
import { fetchAPI } from 'utils/models';

import { DocumentCard } from './DocumentCard';

interface Meta {
  total_pages: number;
  total_entries: number;
  page_number: number;
}

type StatusType = 'expired' | 'upcoming';

interface UpcomingExpiryContractsProps {
  status: StatusType;
}

interface ContractGroup {
  label: string;
  priority: number;
  contracts: any[];
  color: string;
  icon?: string;
}

const GroupHeader = styled(Box)<{
  bg?: string;
}>`
  background: ${({ bg }) =>
    bg ||
    `linear-gradient(
      135deg,
      var(--theme-ui-colors-gray-100) 0%,
      var(--theme-ui-colors-gray-200) 100%
    )`};
  border-left: 3px solid;
  margin-bottom: 16px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateX(4px);
  }
`;

const UrgencyIndicator = styled(Box)<{
  urgency: 'critical' | 'warning' | 'info';
}>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ urgency }) => {
    switch (urgency) {
      case 'critical':
        return 'var(--colors-red-500)';
      case 'warning':
        return 'var(--colors-orange-500)';
      case 'info':
        return 'var(--colors-blue-500)';
      default:
        return 'var(--colors-gray-400)';
    }
  }};
  animation: ${({ urgency }) =>
    urgency === 'critical' ? 'pulse 2s infinite' : 'none'};

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

const ContractCountBadge = styled(Box)`
  background-color: var(--colors-gray-200);
  color: var(--colors-gray-700);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
`;

const UpcomingExpiryContracts: React.FC<UpcomingExpiryContractsProps> = ({
  status,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [contents, setContents] = useState<any>([]);
  const [pageMeta, setPageMeta] = useState<Meta>();
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { userProfile } = useAuth();

  useEffect(() => {
    loadData(currentPage);
  }, [userProfile?.organisation_id, currentPage]);

  const loadData = useCallback(
    async (page: number) => {
      setLoading(true);
      try {
        const pageNo =
          page > 0
            ? `?page=${page}&sort=inserted_at_desc&page_size=9&type=contract&status=${status}`
            : '';
        const data: any = await fetchAPI(`contents${pageNo}`);
        setContents(data.contents || []);
        setPageMeta(data);
      } finally {
        setLoading(false);
      }
    },
    [status],
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Group contracts by expiry time periods
  const groupedContracts = useMemo(() => {
    if (!contents || contents.length === 0) return [];

    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const groups: ContractGroup[] = [];

    // For expired contracts
    if (status === 'expired') {
      const expiredThisWeek = contents.filter((content: any) => {
        const expiryDate = new Date(content.content.meta?.expiry_date);
        return expiryDate >= weekAgo && expiryDate <= now;
      });

      const expiredThisMonth = contents.filter((content: any) => {
        const expiryDate = new Date(content.content.meta?.expiry_date);
        return expiryDate >= monthAgo && expiryDate < weekAgo;
      });

      const expiredOlder = contents.filter((content: any) => {
        const expiryDate = new Date(content.content.meta?.expiry_date);
        return expiryDate < monthAgo;
      });

      if (expiredThisWeek.length > 0) {
        groups.push({
          label: 'Expired This Week',
          priority: 1,
          contracts: expiredThisWeek,
          color: 'red.500',
        });
      }

      if (expiredThisMonth.length > 0) {
        groups.push({
          label: 'Expired This Month',
          priority: 2,
          contracts: expiredThisMonth,
          color: 'orange.500',
        });
      }

      if (expiredOlder.length > 0) {
        groups.push({
          label: 'Expired Earlier',
          priority: 3,
          contracts: expiredOlder,
          color: 'gray.500',
        });
      }
    } else {
      // For upcoming contracts
      const expiringThisWeek = contents.filter((content: any) => {
        const expiryDate = new Date(content.content.meta?.expiry_date);
        return expiryDate >= now && expiryDate <= nextWeek;
      });

      const expiringNextWeek = contents.filter((content: any) => {
        const expiryDate = new Date(content.content.meta?.expiry_date);
        const twoWeeksFromNow = new Date(
          now.getTime() + 14 * 24 * 60 * 60 * 1000,
        );
        return expiryDate > nextWeek && expiryDate <= twoWeeksFromNow;
      });

      const expiringThisMonth = contents.filter((content: any) => {
        const expiryDate = new Date(content.content.meta?.expiry_date);
        const twoWeeksFromNow = new Date(
          now.getTime() + 14 * 24 * 60 * 60 * 1000,
        );
        return expiryDate > twoWeeksFromNow && expiryDate <= nextMonth;
      });

      const expiringLater = contents.filter((content: any) => {
        const expiryDate = new Date(content.content.meta?.expiry_date);
        return expiryDate > nextMonth;
      });

      if (expiringThisWeek.length > 0) {
        groups.push({
          label: 'Expiring This Week',
          priority: 1,
          contracts: expiringThisWeek,
          color: 'red.500',
        });
      }

      if (expiringNextWeek.length > 0) {
        groups.push({
          label: 'Expiring Next Week',
          priority: 2,
          contracts: expiringNextWeek,
          color: 'orange.500',
        });
      }

      if (expiringThisMonth.length > 0) {
        groups.push({
          label: 'Expiring This Month',
          priority: 3,
          contracts: expiringThisMonth,
          color: 'yellow.500',
        });
      }

      if (expiringLater.length > 0) {
        groups.push({
          label: 'Expiring Later',
          priority: 4,
          contracts: expiringLater,
          color: 'blue.500',
        });
      }
    }

    return groups.sort((a, b) => a.priority - b.priority);
  }, [contents, status]);

  const getUrgencyLevel = (
    group: ContractGroup,
  ): 'critical' | 'warning' | 'info' => {
    if (group.priority === 1) return 'critical';
    if (group.priority === 2) return 'warning';
    return 'info';
  };

  const formatExpiryDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} ago`;
    } else if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else if (diffDays <= 7) {
      return `In ${diffDays} days`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  };

  return (
    <Box px="lg">
      {loading ? (
        // Show skeletons while loading
        <>
          {[...Array(5)].map((_, idx) => (
            <Box key={idx} mb="md">
              <Skeleton height="32px" width="100%" />
            </Box>
          ))}
        </>
      ) : groupedContracts.length > 0 ? (
        <>
          {groupedContracts.map((group) => (
            <Box key={group.label} mb="xl">
              <GroupHeader borderLeftColor={group.color} p="xs" mb="md">
                <Flex alignItems="center" gap="xs">
                  <UrgencyIndicator urgency={getUrgencyLevel(group)} />
                  <Text
                    fontSize="sm2"
                    fontWeight="heading"
                    color="text-secondary">
                    {group.label}
                  </Text>
                  <ContractCountBadge>
                    {group.contracts.length} contract
                    {group.contracts.length !== 1 ? 's' : ''}
                  </ContractCountBadge>
                </Flex>
              </GroupHeader>

              <Box>
                {group.contracts.map((content: any) => (
                  <Box key={content.id} mb="sm">
                    <DocumentCard
                      hideState={true}
                      content={content}
                      onClick={() => {
                        router.push(`/documents/${content.content.id}`);
                      }}
                    />
                    {content.content.meta?.expiry_date && (
                      <Box
                        mt="xs"
                        ml="lg"
                        p="xs"
                        bg="gray.50"
                        borderRadius="sm"
                        border="1px solid"
                        borderColor="gray.200">
                        <Flex alignItems="center" gap="xs">
                          <Text fontSize="xs" color="text-secondary">
                            Expires:
                          </Text>
                          <Text
                            fontSize="xs"
                            fontWeight="medium"
                            color={
                              group.priority <= 2 ? group.color : 'text-primary'
                            }>
                            {formatExpiryDate(content.content.meta.expiry_date)}
                          </Text>
                        </Flex>
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </>
      ) : (
        // Empty state
        <Box
          w="100%"
          p="xl"
          textAlign="center"
          color="text-secondary"
          borderRadius="md"
          border="1px solid"
          borderColor="border"
          bg="gray.100">
          <Text fontSize="md" fontWeight="medium">
            No {status} contracts found.
          </Text>
          <Text fontSize="sm" mt="xs">
            You have no {status} contracts to display.
          </Text>
        </Box>
      )}

      <Box mt="md">
        {pageMeta && pageMeta?.total_pages > 1 && (
          <Pagination
            totalPage={pageMeta.total_pages}
            initialPage={currentPage}
            onPageChange={handlePageChange}
            totalEntries={pageMeta.total_entries}
          />
        )}
      </Box>
    </Box>
  );
};

export default UpcomingExpiryContracts;
