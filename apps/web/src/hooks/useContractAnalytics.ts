import { useState, useEffect } from 'react';

interface ContractStats {
  totalContracts: number;
  expiringThisMonth: number;
  documentsThisWeek: number;
  totalValue: number;
}

interface ContractData {
  expiringContracts: Array<{
    name: string;
    contracts: number;
    documents: number;
  }>;
  documentsPerDay: Array<{
    name: string;
    count: number;
  }>;
  contractValue: Array<{
    name: string;
    value: number;
  }>;
}

// Generate random number between min and max
const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate dummy data based on timeRange
const generateDummyData = (
  timeRange: string,
): { stats: ContractStats; data: ContractData } => {
  // Adjust multipliers based on timeRange
  const multiplier =
    timeRange === '7d'
      ? 1
      : timeRange === '30d'
        ? 4
        : timeRange === '90d'
          ? 12
          : 52;

  // Generate expiring contracts data
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const expiringContracts = months.slice(0, multiplier).map((month) => ({
    name: month,
    contracts: getRandomNumber(5, 20),
    documents: getRandomNumber(30, 80),
  }));

  // Generate documents per day data
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const documentsPerDay = days.map((day) => ({
    name: day,
    count: getRandomNumber(5, 25),
  }));

  // Generate contract value distribution
  const contractValue = [
    { name: 'High Value', value: getRandomNumber(3000000, 5000000) },
    { name: 'Medium Value', value: getRandomNumber(1500000, 3000000) },
    { name: 'Low Value', value: getRandomNumber(500000, 1500000) },
    { name: 'Pending', value: getRandomNumber(200000, 1000000) },
  ];

  // Calculate stats
  const totalContracts = expiringContracts.reduce(
    (sum, item) => sum + item.contracts,
    0,
  );
  const expiringThisMonth = getRandomNumber(5, 15);
  const documentsThisWeek = documentsPerDay.reduce(
    (sum, item) => sum + item.count,
    0,
  );
  const totalValue = contractValue.reduce((sum, item) => sum + item.value, 0);

  return {
    stats: {
      totalContracts,
      expiringThisMonth,
      documentsThisWeek,
      totalValue,
    },
    data: {
      expiringContracts,
      documentsPerDay,
      contractValue,
    },
  };
};

export const useContractAnalytics = (timeRange: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [stats, setStats] = useState<ContractStats | null>(null);
  const [data, setData] = useState<ContractData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Generate and set dummy data
        const dummyData = generateDummyData(timeRange);
        setStats(dummyData.stats);
        setData(dummyData.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to generate contract analytics'),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  return {
    loading,
    error,
    stats,
    data,
  };
};
