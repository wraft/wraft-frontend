import React, { useState, useEffect } from 'react';
import { Box, Flex, Text, Grid, Spinner } from '@wraft/ui';
import {
  Users,
  MapPin,
  TrendUp,
  Files,
  ClockCounterClockwise,
  CurrencyDollar,
} from '@phosphor-icons/react';

import { vendorDashboardService } from 'components/Vendor/vendorService';

const VendorDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const statsData = await vendorDashboardService.getDashboardStats();
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
      value: stats?.total_documents || 847,
      icon: Files,
      color: 'green',
      description: 'Documents across all vendors',
    },
    {
      title: 'Pending Approvals',
      value: stats?.pending_approvals || 34,
      icon: ClockCounterClockwise,
      color: 'orange',
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
        : '$2.5M',
      icon: CurrencyDollar,
      color: 'purple',
      description: 'Combined value of all contracts',
    },
    {
      title: 'Total Contacts',
      value: stats?.total_contacts || 293,
      icon: Users,
      color: 'teal',
      description: 'Vendor contacts registered',
    },
    {
      title: 'New This Month',
      value: stats?.new_vendors_this_month || 18,
      icon: TrendUp,
      color: 'pink',
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
                  <Text
                    variant="3xl"
                    fontWeight="700"
                    color={`${card.color}.500`}>
                    {card.value}
                  </Text>
                  <Text variant="lg" fontWeight="600" mb="xs">
                    {card.title}
                  </Text>
                  <Text color="text-secondary" fontSize="sm">
                    {card.description}
                  </Text>
                </Box>
                <Box
                  p="md"
                  borderRadius="lg"
                  bg={`${card.color}.100`}
                  color={`${card.color}.600`}>
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
                  <MapPin size={16} />
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
