import React, { useMemo } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Box, Text, Flex } from '@wraft/ui';
import { useTheme } from '@xstyled/emotion';
import { TrendUp } from '@phosphor-icons/react';

import { BlockTitle } from 'common/Atoms';

import { DataPoint } from './LineChart';
import { ChartConfig } from './ChartConfig';
import { ChartTooltipContent } from './ChartTooltip';

interface BarChartProps {
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
  barSize?: number;
  trend?: {
    value: number;
    label: string;
  };
  footerText?: string;
  config?: ChartConfig;
  hideXAxis?: boolean;
  hideYAxis?: boolean;
  hideLabels?: boolean;
  /**
   * The color to use for the bar when hovered (activeBar fill). Defaults to theme green["400"].
   */
  hoverBarColor?: string;
}

const CustomAxisTick = ({ x, y, payload }: any) => {
  const theme: any = useTheme();
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
      fill={theme.colors?.text as string}>
      <text x={0} y={0} dy={16} textAnchor="middle">
        {value}
      </text>
    </Text>
  );
};

const CustomLegend = ({ payload }: any) => {
  const _theme: any = useTheme();
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

export const BarChart: React.FC<BarChartProps> = ({
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
  barSize = 30,
  trend,
  footerText,
  config = {},
  hideXAxis = true,
  hideYAxis = true,
  hideLabels = true,
  hoverBarColor,
}) => {
  const theme: any = useTheme();
  const defaultColors = [
    theme.colors?.primary as string,
    theme.colors?.success as string,
    theme.colors?.secondary as string,
    theme.colors?.accent as string,
  ].filter(Boolean);

  const chartColors = colors || defaultColors;

  // Memoized percentage change summary for efficiency and reactivity
  const percentageChanges: { key: string; percent: number }[] = useMemo(() => {
    if (!data || data.length < 2 || !dataKeys || dataKeys.length === 0)
      return [];
    return dataKeys.reduce<{ key: string; percent: number }[]>((acc, key) => {
      const current = Number(data[data.length - 1]?.[key]);
      const prev = Number(data[data.length - 2]?.[key]);
      if (!isNaN(current) && !isNaN(prev) && prev !== 0) {
        const percent = ((current - prev) / Math.abs(prev)) * 100;
        acc.push({ key, percent });
      }
      return acc;
    }, []);
  }, [data, dataKeys]);

  return (
    <Box
      // border="1px solid"
      // borderColor="border"
      borderRadius="md"
      overflow="hidden">
      {(title || description) &&
        !(
          dataKeys.length === 1 &&
          !description &&
          (title?.toLowerCase() === 'total' ||
            title?.toLowerCase() === 'total:')
        ) && <BlockTitle title={title} description={description} />}
      <Box px="xl" py="lg">
        <Box style={{ width, height }}>
          <ResponsiveContainer>
            <RechartsBarChart
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
                  stroke={theme.colors.green['400']}
                  opacity={0.5}
                />
              )}
              {!hideXAxis && (
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  stroke={theme.colors?.text as string}
                  tick={
                    hideLabels || dataKeys.length === 1 ? (
                      false
                    ) : (
                      <CustomAxisTick />
                    )
                  }
                />
              )}
              {!hideYAxis && (
                <YAxis
                  stroke={theme.colors?.text as string}
                  tick={
                    hideLabels || dataKeys.length === 1 ? (
                      false
                    ) : (
                      <CustomAxisTick />
                    )
                  }
                />
              )}
              {showTooltip && (
                <Tooltip
                  content={<ChartTooltipContent config={config} hideLabel />}
                />
              )}
              {showLegend && dataKeys.length > 1 && (
                <Legend content={<CustomLegend />} />
              )}
              {dataKeys.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={chartColors[index % chartColors.length]}
                  barSize={barSize}
                  activeBar={{
                    fill: hoverBarColor || theme.colors.green['400'],
                  }}
                  radius={4}
                />
              ))}
            </RechartsBarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
      {/* Percentage Change Summary */}
      {percentageChanges.length > 0 && (
        <Box px="md" pb="sm" display="flex" flexDirection="column" gap="xs">
          {percentageChanges.map(
            ({ key, percent }: { key: string; percent: number }) => {
              const isPositive = percent >= 0;
              const bg = isPositive
                ? theme.colors.green['200']
                : theme.colors.red['200'];
              const color = isPositive
                ? theme.colors.green['900']
                : theme.colors.red['900'];
              const Icon = isPositive ? TrendUp : undefined;
              return (
                <Box key={key} alignItems="center" gap="sm">
                  <Flex py="xs">
                    <Box
                      as="span"
                      display="inline-flex"
                      alignItems="center"
                      gap="xs"
                      px="sm"
                      py="2px"
                      borderRadius="full"
                      fontWeight="bold"
                      fontSize="sm"
                      style={{ background: bg, color }}>
                      {Icon && <TrendUp size={14} style={{ color }} />}
                      {percent >= 0 ? '+' : ''}
                      {percent.toFixed(2)}%
                    </Box>
                    <Text
                      as="span"
                      fontSize="sm"
                      color="text-secondary"
                      ml="xs">
                      from previous month
                    </Text>
                  </Flex>
                </Box>
              );
            },
          )}
        </Box>
      )}
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
            <Text fontSize="xs" color="textMuted">
              {footerText}
            </Text>
          )}
        </Box>
      )}
    </Box>
  );
};
