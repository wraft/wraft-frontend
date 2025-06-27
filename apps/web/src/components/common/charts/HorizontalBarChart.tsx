import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Box, Text } from '@wraft/ui';
import { useTheme } from '@xstyled/emotion';
import { TrendUp } from '@phosphor-icons/react';

import { BlockTitle } from 'common/Atoms';

import { ChartConfig } from './ChartConfig';
import { ChartTooltipContent } from './ChartTooltip';

interface HorizontalBarChartProps {
  title?: string;
  description?: string;
  data: Array<{
    [key: string]: string | number;
  }>;
  dataKey: string;
  nameKey: string;
  height?: number;
  width?: string | number;
  color?: string;
  trend?: {
    value: number;
    label: string;
  };
  footerText?: string;
  config: ChartConfig;
}

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  title,
  description,
  data,
  dataKey,
  nameKey,
  height = 300,
  width = '100%',
  color,
  trend,
  footerText,
  config,
}) => {
  const theme: any = useTheme();

  return (
    <Box
      as="div"
      border="1px solid"
      borderColor="border"
      borderRadius="md"
      overflow="hidden">
      {(title || description) && (
        <BlockTitle title={title} description={description} />
      )}

      <Box p="md">
        <Box style={{ width, height }}>
          <ResponsiveContainer>
            <RechartsBarChart
              data={data}
              layout="vertical"
              margin={{
                top: 8,
                right: 16,
                left: 12,
                bottom: 8,
              }}>
              <XAxis
                type="number"
                dataKey={dataKey}
                hide
                stroke={theme.colors?.text as string}
              />
              <YAxis
                dataKey={nameKey}
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                stroke={theme.colors?.text as string}
                tick={{ fill: theme.colors?.text as string }}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent config={config} hideLabel />}
              />
              <Bar
                dataKey={dataKey}
                fill={
                  color ||
                  config[dataKey]?.color ||
                  (theme.colors?.primary as string)
                }
                radius={5}
              />
            </RechartsBarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
      {(trend || footerText) && (
        <Box
          p="md"
          borderTop="1px solid"
          borderColor="border"
          display="flex"
          flexDirection="column"
          gap="xs">
          {trend && (
            <Box
              display="flex"
              alignItems="center"
              gap="xs"
              fontSize="sm"
              fontWeight="medium">
              {trend.label} <TrendUp size={16} />
            </Box>
          )}
          {footerText && (
            <Text fontSize="sm" color="textMuted">
              {footerText}
            </Text>
          )}
        </Box>
      )}
    </Box>
  );
};
