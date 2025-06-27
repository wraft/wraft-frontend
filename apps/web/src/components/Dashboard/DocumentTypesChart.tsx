import React, { useEffect, useState } from 'react';
import styled from '@xstyled/emotion';
import { Box, Skeleton, Text } from '@wraft/ui';

import { PieChart } from 'common/charts/PieChart';
import { fetchAPI } from 'utils/models';

/**
 * DocumentTypesChart
 *
 * Fetches and displays document types distribution using a pie chart.
 * Shows the count of different document types (Contract, Invoice, Report, etc.)
 * with their respective colors from the API response.
 * Groups smaller elements (< 1% of total) into an "Others" category.
 *
 * Sample API Response:
 * {
 *   "data": [
 *     {
 *       "name": "Contract",
 *       "id": "123e4567-e89b-12d3-a456-426614174000",
 *       "count": 25,
 *       "color": "#FF5733"
 *     },
 *     {
 *       "name": "Invoice",
 *       "id": "123e4567-e89b-12d3-a456-426614174001",
 *       "count": 15,
 *       "color": "#33FF57"
 *     },
 *     {
 *       "name": "Report",
 *       "id": "123e4567-e89b-12d3-a456-426614174002",
 *       "count": 10,
 *       "color": "#3357FF"
 *     }
 *   ]
 * }
 */
interface DocumentTypeData {
  name: string;
  id: string;
  count: number;
  color: string;
}

interface TransformedDataItem {
  name: string;
  value: number;
  fill: string;
}

const ChartContainer = styled(Box)`
  width: 100%;
  background: background-secondary;
  border-radius: md;
  padding: xl;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
`;

const DocumentTypesChart: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<DocumentTypeData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchAPI('documents/by_content_type')
      .then((res: DocumentTypeData[]) => {
        setChartData(res || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load document types data.');
        setLoading(false);
      });
  }, []);

  // Transform data for the PieChart component with grouping logic
  const transformedData = React.useMemo(() => {
    const validData = chartData.filter((item) => item.count > 0);

    if (validData.length === 0) return [];

    // Calculate total count
    const totalCount = validData.reduce((sum, item) => sum + item.count, 0);

    // Calculate 1% threshold
    const threshold = totalCount * 0.01;

    // Separate items into main and others
    const mainItems: TransformedDataItem[] = [];
    const otherItems: DocumentTypeData[] = [];

    validData.forEach((item) => {
      if (item.count >= threshold) {
        mainItems.push({
          name: item.name,
          value: item.count,
          fill: item.color,
        });
      } else {
        otherItems.push(item);
      }
    });

    // If there are items to group into "Others", add them
    if (otherItems.length > 0) {
      const othersCount = otherItems.reduce((sum, item) => sum + item.count, 0);
      mainItems.push({
        name: 'Others',
        value: othersCount,
        fill: '#6B7280', // Gray color for "Others"
      });
    }

    return mainItems;
  }, [chartData]);

  // Create chart configuration with colors from API
  const chartConfig = React.useMemo(() => {
    const validData = chartData.filter((item) => item.count > 0);

    if (validData.length === 0) return {};

    // Calculate total count and threshold
    const totalCount = validData.reduce((sum, item) => sum + item.count, 0);
    const threshold = totalCount * 0.01;

    const config: Record<string, { label: string; color: string }> = {};

    validData.forEach((item) => {
      if (item.count >= threshold) {
        config[item.name] = {
          label: item.name,
          color: item.color,
        };
      }
    });

    // Add "Others" configuration if there are grouped items
    const otherItems = validData.filter((item) => item.count < threshold);
    if (otherItems.length > 0) {
      config['Others'] = {
        label: 'Others',
        color: '#6B7280',
      };
    }

    return config;
  }, [chartData]);

  return (
    <ChartContainer>
      <Text
        as="h4"
        fontWeight="heading"
        fontSize="base"
        mb="md"
        color="text-secondary">
        Document Types Distribution
      </Text>
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
      ) : chartData.length === 0 ? (
        // Empty state
        <Box
          w="100%"
          p="xl"
          textAlign="center"
          color="text-secondary"
          borderRadius="md"
          border="1px solid"
          borderColor="border"
          bg="gray.50">
          <Text fontSize="md" fontWeight="medium">
            No document types found.
          </Text>
          <Text fontSize="sm" mt="xs">
            There are no documents to display by type.
          </Text>
        </Box>
      ) : (
        <PieChart
          // showLabels={false}
          data={transformedData}
          height={240}
          showLegend
          showTooltip
          config={chartConfig}
          innerRadius={40}
          outerRadius={80}
        />
      )}
    </ChartContainer>
  );
};

export default DocumentTypesChart;
