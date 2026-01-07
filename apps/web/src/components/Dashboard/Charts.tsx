import React, { useEffect, useState } from 'react';
import styled from '@xstyled/emotion';
import { Box, Skeleton, Text } from '@wraft/ui';
import { useTheme } from '@xstyled/emotion';

import { BarChart } from 'common/charts/BarChart';
import { createChartConfig } from 'common/charts/ChartConfig';
import { fetchAPI } from 'utils/models';

// import { LineChart } from 'common/Charts';

/**
 * ContractChart
 * 
 * Fetches and displays contract statistics over time using a performant line chart.
 * Uses xstyled/emotion for styling and shadcn-like defaults.
 * Shows skeletons while loading and a friendly empty state if no data.
 * 
 * Accessible and themeable by default.
 * 
 * Sample API Response:
 * [
    {
        "confirmed": 0,
        "datetime": "2025-02-01T00:00:00Z",
        "pending": 1,
        "total": 1
    },
    {
        "confirmed": 2,
        "datetime": "2025-03-01T00:00:00Z",
        "pending": 1,
        "total": 3
    },
    {
        "confirmed": 2,
        "datetime": "2025-05-01T00:00:00Z",
        "pending": 2,
        "total": 4
    },
    {
        "confirmed": 0,
        "datetime": "2025-06-01T00:00:00Z",
        "pending": 3,
        "total": 3
    }
]
 * 
 */
interface ChartDataPoint {
  confirmed: number;
  datetime: string;
  pending: number;
  total: number;
}

const ChartContainer = styled(Box)`
  width: 100%;
  background-color: background-primary;
  border: 1px solid;
  border-color: border;
  border-radius: md;
  // padding: xl;
  min-height: 380px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
`;

const ContractChart: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [error, setError] = useState<string | null>(null);
  const theme: any = useTheme();

  useEffect(() => {
    setLoading(true);
    fetchAPI('contracts/chart?period=alltime&interval=month&select_by=insert')
      .then((res: ChartDataPoint[]) => {
        setChartData(res);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load chart data.');
        setLoading(false);
      });
  }, []);

  // Transform data for the LineChart component
  const transformedData = chartData.map((item) => ({
    name: new Date(item.datetime).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    }),
    total: item.total,
    pending: item.pending,
    confirmed: item.confirmed,
  }));

  // Create smart default chart configuration using theme colors
  const chartConfig = createChartConfig(
    [
      'total',
      // 'pending',
      // 'confirmed',
    ],
    {
      total: {
        label: 'Total Contracts',
        color: theme.colors?.green?.['400'] || '#d2f2e3',
      },
      // pending: { label: 'Pending Contracts', color: theme.colors?.green?.["700"] || '#8dceb3' },
      // confirmed: { label: 'Confirmed Contracts', color: theme.colors?.green?.["900"] || '#127d5d' },
    },
  );

  // Hide the block if there is no contract data and not loading or error
  if (!loading && !error && chartData.length === 0) {
    return null;
  }

  return (
    <ChartContainer>
      <Box px="xl" py="lg" borderBottom="1px solid" borderColor="border">
        <Text as="h4" fontWeight="heading" color="gray.1100" fontSize="md">
          Contracts Overview
        </Text>
      </Box>
      {loading ? (
        <>
          <Box mb="md">
            <Skeleton height="32px" width="40%" />
          </Box>
          <Skeleton height="220px" width="100%" />
        </>
      ) : error ? (
        <Box w="100%" textAlign="center" color="danger">
          <Text fontSize="md" fontWeight="medium">
            {error}
          </Text>
        </Box>
      ) : (
        <BarChart
          data={transformedData}
          dataKeys={[
            'total',
            // 'pending',
            // 'confirmed',
          ]}
          height={240}
          showGrid
          showLegend
          showTooltip
          config={chartConfig}
          hoverBarColor={theme.colors.green['400']}
        />
      )}
    </ChartContainer>
  );
};

export default ContractChart;
