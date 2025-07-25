import React, { useState, useEffect } from 'react';
import { Box, Flex, Text, Grid, Spinner } from '@wraft/ui';
import {
  ClockCounterClockwiseIcon,
  CurrencyDollarIcon,
  FilesIcon,
  MapPinIcon,
  TrendUpIcon,
  UsersIcon,
} from '@phosphor-icons/react';

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
      <Flex alignItems="center" justifyContent="center" h="200px">
        <Spinner size={32} />
      </Flex>
    );
  }

  const statCards = [
    {
      title: 'Total Documents',
      value: stats?.total_documents || 0,
      icon: FilesIcon,
      description: 'Documents across all vendors',
    },
    {
      title: 'Pending Approvals',
      value: stats?.pending_approvals || 0,
      icon: ClockCounterClockwiseIcon,
      description: 'Documents awaiting approval',
    },
    {
      title: 'Total Contract Value',
      value: stats?.total_contract_value
        ? new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact',
            maximumFractionDigits: 1,
          }).format(stats.total_contract_value)
        : '$0',
      icon: CurrencyDollarIcon,
      description: 'Combined value of all contracts',
    },
    {
      title: 'Total Contacts',
      value: stats?.total_contacts || 0,
      icon: UsersIcon,
      description: 'Vendor contacts registered',
    },
    {
      title: 'New This Month',
      value: stats?.new_this_month || 0,
      icon: TrendUpIcon,
      description: 'Vendors added this month',
    },
  ];

  return (
    <Box>
      <Grid
        gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
        gap="lg"
        mb="xl">
        {statCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <Box
              key={card.title}
              p="lg"
              borderRadius="md"
              boxShadow="sm"
              bg="white">
              <Flex alignItems="center" justifyContent="space-between" mb="md">
                <Box>
                  <Text variant="3xl" fontWeight="600" color="text-primary">
                    {card.value}
                  </Text>
                  <Text variant="lg" fontWeight="500" mb="xs">
                    {card.title}
                  </Text>
                  <Text color="text-secondary" fontSize="sm">
                    {card.description}
                  </Text>
                </Box>
                <Box p="md" borderRadius="lg" color="text-secondary">
                  <IconComponent size={24} />
                </Box>
              </Flex>
            </Box>
          );
        })}
      </Grid>
      {stats?.vendors_by_country && stats.vendors_by_country.length > 0 && (
        <Box p="lg" mt="lg" borderRadius="md" boxShadow="sm" bg="white">
          <Text variant="lg" fontWeight="600" mb="md">
            Vendors by Country
          </Text>
          <Grid
            gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
            gap="md">
            {stats.vendors_by_country.map((country: any) => (
              <Flex
                key={country.country}
                alignItems="center"
                justifyContent="space-between"
                p="md"
                borderRadius="md"
                bg="gray.50">
                <Flex alignItems="center" gap="sm">
                  <MapPinIcon size={16} />
                  <Text fontWeight="500">{country.country || 'Unknown'}</Text>
                </Flex>
                <Text fontWeight="600" color="blue.600">
                  {country.count}
                </Text>
              </Flex>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default VendorDashboard;
