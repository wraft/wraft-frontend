/**
 * Interactive LineChart Component
 *
 * Features:
 * - Interactive mode with chart selector buttons
 * - Automatic total calculations
 * - Date formatting for time-series data
 * - Customizable colors and styling
 * - Responsive design
 *
 * Usage Examples:
 *
 * // Basic line chart
 * <LineChart
 *   data={data}
 *   dataKeys={['desktop', 'mobile']}
 *   title="Page Views"
 *   description="Daily page views for the last 3 months"
 * />
 *
 * // Interactive line chart
 * <LineChart
 *   data={data}
 *   dataKeys={['desktop', 'mobile']}
 *   interactive={true}
 *   title="Interactive Chart"
 *   description="Click buttons to switch between data series"
 * />
 *
 * // With custom configuration
 * <LineChart
 *   data={data}
 *   dataKeys={['desktop', 'mobile']}
 *   config={{
 *     desktop: { label: 'Desktop Views', color: '#3b82f6' },
 *     mobile: { label: 'Mobile Views', color: '#10b981' }
 *   }}
 *   interactive={true}
 * />
 */

import React, { useState, useMemo } from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Box, Text } from '@wraft/ui';
import { useTheme } from '@xstyled/emotion';
import { TrendUp } from '@phosphor-icons/react';

import { BlockTitle } from 'common/Atoms';

import { ChartConfig } from './ChartConfig';
import { ChartTooltipContent } from './ChartTooltip';

export interface DataPoint {
  name: string;
  [key: string]: number | string;
}

interface LineChartProps {
  title?: string;
  description?: string;
  data: DataPoint[];
  dataKeys: string[];
  height?: number;
  width?: string | number;
  colors?: string[];
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  trend?: {
    value: number;
    label: string;
  };
  footerText?: string;
  config?: ChartConfig;
  interactive?: boolean;
  className?: string;
}

const CustomAxisTick = ({ x, y, payload }: any) => {
  const value =
    typeof payload.value === 'string'
      ? payload.value.slice(0, 3)
      : payload.value;
  return (
    <Text
      as="g"
      transform={`translate(${x},${y})`}
      fontSize="sm"
      color="text"
      fill="text-secondary">
      <text x={0} y={0} dy={16} textAnchor="middle">
        {value}
      </text>
    </Text>
  );
};

const CustomLegend = ({ payload }: any) => {
  return (
    <Box display="flex" justifyContent="center" gap="md" mt="sm">
      {payload.map((entry: any, index: number) => (
        <Box key={`item-${index}`} display="flex" alignItems="center" gap="xs">
          <Box
            as="div"
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '4px',
              backgroundColor: entry.color,
            }}
          />
          <Text fontSize="sm" color="text">
            {entry.value}
          </Text>
        </Box>
      ))}
    </Box>
  );
};

export const LineChart: React.FC<LineChartProps> = ({
  title,
  description,
  data,
  dataKeys,
  height = 300,
  width = '100%',
  colors,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  trend,
  footerText,
  config = {},
  interactive = false,
  className,
}) => {
  const theme: any = useTheme();
  const [activeChart, setActiveChart] = useState<string>(dataKeys[0]);

  // Use theme colors with fallbacks
  const defaultColors = [
    theme?.colors?.primary[500] || '#3b82f6',
    theme?.colors?.success[500] || '#10b981',
    theme?.colors?.secondary[500] || '#6b7280',
    // theme?.colors?.accent[500] || '#8b5cf6',
  ].filter(Boolean);

  const chartColors = colors || defaultColors;

  // Calculate totals for interactive mode
  const totals = useMemo(() => {
    const totalsObj: Record<string, number> = {};
    dataKeys.forEach((key) => {
      totalsObj[key] = data.reduce(
        (acc, curr) => acc + (Number(curr[key]) || 0),
        0,
      );
    });
    return totalsObj;
  }, [data, dataKeys]);

  // Create chart config if not provided
  const chartConfig = useMemo(() => {
    if (Object.keys(config).length > 0) return config;

    const newConfig: ChartConfig = {};
    dataKeys.forEach((key, index) => {
      newConfig[key] = {
        label: key.charAt(0).toUpperCase() + key.slice(1),
        color: chartColors[index % chartColors.length],
      };
    });
    return newConfig;
  }, [config, dataKeys, chartColors]);

  return (
    <Box
      as="div"
      border="1px solid"
      borderColor="border"
      borderRadius="md"
      overflow="hidden"
      className={className}>
      {(title || description) && (
        <BlockTitle title={title} description={description} />
      )}

      {interactive && (
        <Box display="flex" borderBottom="1px solid" borderColor="border">
          {dataKeys.map((key) => (
            <Box
              key={key}
              as="button"
              onClick={() => setActiveChart(key)}
              flex="1"
              p="md"
              textAlign="left"
              borderRight={
                key !== dataKeys[dataKeys.length - 1] ? '1px solid' : 'none'
              }
              borderColor="border"
              borderRadius="0"
              bg={activeChart === key ? 'primary' : 'transparent'}
              color={activeChart === key ? 'white' : 'text'}
              cursor="pointer">
              <Box display="flex" flexDirection="column" gap="xs">
                <Text fontSize="xs" color="textMuted">
                  {chartConfig[key]?.label || key}
                </Text>
                <Text fontSize="lg" fontWeight="bold">
                  {totals[key]?.toLocaleString() || '0'}
                </Text>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      <Box p="md">
        <Box style={{ width, height }}>
          <ResponsiveContainer>
            <RechartsLineChart
              data={data}
              margin={{
                top: 12,
                right: 12,
                left: 12,
                bottom: 12,
              }}>
              {showGrid && (
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme?.colors?.border || '#e5e7eb'}
                  opacity={0.5}
                  vertical={false}
                />
              )}
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                stroke={theme?.colors?.text || '#fff'}
                tick={<CustomAxisTick />}
                minTickGap={32}
                tickFormatter={(value) => {
                  if (typeof value === 'string' && value.includes('-')) {
                    const date = new Date(value);
                    return date.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });
                  }
                  return value;
                }}
              />
              {/* <YAxis
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                stroke={theme?.colors?.text || '#374151'}
                tick={<CustomAxisTick />}
              /> */}
              {showTooltip && (
                <Tooltip
                  content={
                    <ChartTooltipContent
                      config={chartConfig}
                      hideLabel={false}
                      labelFormatter={(value: any) => {
                        if (typeof value === 'string' && value.includes('-')) {
                          return new Date(value).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          });
                        }
                        return value;
                      }}
                    />
                  }
                />
              )}
              {showLegend && !interactive && (
                <Legend content={<CustomLegend />} />
              )}
              {interactive ? (
                <Line
                  type="monotone"
                  dataKey={activeChart}
                  stroke={chartConfig[activeChart]?.color || chartColors[0]}
                  activeDot={{
                    r: 8,
                    fill: chartConfig[activeChart]?.color || chartColors[0],
                    stroke: theme?.colors?.background || '#ffffff',
                    strokeWidth: 2,
                  }}
                  strokeWidth={2}
                  // dot={false}
                />
              ) : (
                dataKeys.map((key, index) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke="#eee"
                    activeDot={{
                      r: 4,
                      fill:
                        chartConfig[key]?.color ||
                        chartColors[index % chartColors.length],
                      stroke: theme?.colors?.background || '#ffffff',
                      strokeWidth: 1,
                    }}
                    strokeWidth={1}
                  />
                ))
              )}
            </RechartsLineChart>
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
