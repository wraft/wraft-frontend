import React from 'react';
import { Box } from '@wraft/ui';

import { LineChart } from './LineChart';
import { ChartConfig } from './ChartConfig';

// Sample data similar to the reference code
const chartData = [
  { name: '2024-04-01', desktop: 222, mobile: 150 },
  { name: '2024-04-02', desktop: 97, mobile: 180 },
  { name: '2024-04-03', desktop: 167, mobile: 120 },
  { name: '2024-04-04', desktop: 242, mobile: 260 },
  { name: '2024-04-05', desktop: 373, mobile: 290 },
  { name: '2024-04-06', desktop: 301, mobile: 340 },
  { name: '2024-04-07', desktop: 245, mobile: 180 },
  { name: '2024-04-08', desktop: 409, mobile: 320 },
  { name: '2024-04-09', desktop: 59, mobile: 110 },
  { name: '2024-04-10', desktop: 261, mobile: 190 },
  { name: '2024-04-11', desktop: 327, mobile: 350 },
  { name: '2024-04-12', desktop: 292, mobile: 210 },
  { name: '2024-04-13', desktop: 342, mobile: 380 },
  { name: '2024-04-14', desktop: 137, mobile: 220 },
  { name: '2024-04-15', desktop: 120, mobile: 170 },
];

const chartConfig: ChartConfig = {
  desktop: {
    label: 'Desktop',
    color: '#3b82f6',
  },
  mobile: {
    label: 'Mobile',
    color: '#10b981',
  },
};

export const LineChartExample: React.FC = () => {
  return (
    <Box p="lg">
      <Box mb="xl">
        <h2>Basic Line Chart</h2>
        <LineChart
          data={chartData}
          dataKeys={['desktop', 'mobile']}
          title="Page Views"
          description="Daily page views for the last 2 weeks"
          height={300}
        />
      </Box>

      <Box mb="xl">
        <h2>Interactive Line Chart</h2>
        <LineChart
          data={chartData}
          dataKeys={['desktop', 'mobile']}
          config={chartConfig}
          interactive={true}
          title="Interactive Chart"
          description="Click buttons to switch between data series"
          height={300}
        />
      </Box>

      <Box>
        <h2>Single Series Interactive Chart</h2>
        <LineChart
          data={chartData}
          dataKeys={['desktop']}
          config={{
            desktop: {
              label: 'Desktop Views',
              color: '#3b82f6',
            },
          }}
          interactive={true}
          title="Desktop Views Only"
          description="Interactive chart with single data series"
          height={300}
        />
      </Box>
    </Box>
  );
};
