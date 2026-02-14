import React, { useState, useEffect } from 'react';
import { Box, Flex, Text, Spinner } from '@wraft/ui';

import { vendorDashboardService } from 'components/Vendor/vendorService';

interface VendorDashboardProps {
  vendorId?: string;
}

const VendorDashboard: React.FC<VendorDashboardProps> = ({ vendorId }) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [vendorId]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const statsData =
        await vendorDashboardService.getDashboardStats(vendorId);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading vendor stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Flex align="center" justify="center" py="3xl">
        <Spinner size={20} />
      </Flex>
    );
  }

  if (!stats) return null;

  const statItems = [
    {
      label: 'Documents',
      value: stats?.total_documents || 0,
    },
    {
      label: 'Pending Approvals',
      value: stats?.pending_approvals || 0,
    },
    {
      label: 'Contract Value',
      value: stats?.total_contract_value
        ? new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact',
            maximumFractionDigits: 1,
          }).format(stats.total_contract_value)
        : '$0',
    },
    {
      label: 'Contacts',
      value: stats?.total_contacts || 0,
    },
    {
      label: 'New This Month',
      value: stats?.new_this_month || 0,
    },
  ];

  return (
    <Flex direction="column" gap="lg">
      <Box
        border="1px solid"
        borderColor="border"
        borderRadius="md"
        bg="background-primary"
        overflow="hidden">
        <Box px="lg" py="sm" borderBottom="1px solid" borderColor="border">
          <Text fontSize="sm" fontWeight="600" color="text-secondary">
            Activity
          </Text>
        </Box>
        <Box>
          {statItems.map((item, index) => (
            <Flex
              key={item.label}
              justify="space-between"
              align="center"
              px="lg"
              py="sm"
              borderBottom={index < statItems.length - 1 ? '1px solid' : 'none'}
              borderColor="border">
              <Text fontSize="sm" color="text-secondary">
                {item.label}
              </Text>
              <Text fontSize="sm2" fontWeight="600">
                {item.value}
              </Text>
            </Flex>
          ))}
        </Box>
      </Box>

      {stats?.vendors_by_country && stats.vendors_by_country.length > 0 && (
        <Box
          border="1px solid"
          borderColor="border"
          borderRadius="md"
          bg="background-primary"
          overflow="hidden">
          <Box px="lg" py="sm" borderBottom="1px solid" borderColor="border">
            <Text fontSize="sm" fontWeight="600" color="text-secondary">
              By Country
            </Text>
          </Box>
          <Box>
            {stats.vendors_by_country.map((country: any, index: number) => (
              <Flex
                key={country.country}
                justify="space-between"
                align="center"
                px="lg"
                py="sm"
                borderBottom={
                  index < stats.vendors_by_country.length - 1
                    ? '1px solid'
                    : 'none'
                }
                borderColor="border">
                <Text fontSize="sm" color="text-secondary">
                  {country.country || 'Unknown'}
                </Text>
                <Text fontSize="sm2" fontWeight="600">
                  {country.count}
                </Text>
              </Flex>
            ))}
          </Box>
        </Box>
      )}
    </Flex>
  );
};

export default VendorDashboard;
