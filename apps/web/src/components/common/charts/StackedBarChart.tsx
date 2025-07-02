import React, { useMemo } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Box, Flex, Text } from '@wraft/ui';
import { useTheme } from '@xstyled/emotion';
import { TrendUp } from '@phosphor-icons/react';

import { BlockTitle } from 'common/Atoms';

import { ChartConfig } from './ChartConfig';
import { ChartTooltipContent } from './ChartTooltip';

interface StackedBarChartProps {
  title?: string;
  description?: string;
  data: Array<{
    [key: string]: string | number;
  }>;
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
  config: ChartConfig;
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
      fill={theme?.colors?.['text-secondary']}>
      <text x={0} y={0} dy={16} textAnchor="middle">
        {value}
      </text>
    </Text>
  );
};

// const CustomLegend = ({ payload }: any) => {
//   const theme = useTheme() as any;
//   return (
//     <Box
//       display="flex"
//       justifyContent="center"
//       gap="md"
//       mt="sm"
//       bg={theme.colors['background-secondary']}
//       borderRadius="md"
//       p="xs"
//       border={`1px solid ${theme.colors.border}`}>
//       {payload.map((entry: any, index: number) => (
//         <Box key={`item-${index}`} display="flex" alignItems="center" gap="xs">
//           <Box
//             as="span"
//             style={{
//               width: '12px',
//               height: '12px',
//               borderRadius: '4px',
//               backgroundColor: entry.color,
//               display: 'inline-block',
//               marginRight: '0.5rem',
//             }}
//           />
//           <Text fontSize="sm" color={theme.colors.text}>
//             {entry.value}
//           </Text>
//         </Box>
//       ))}
//     </Box>
//   );
// };

export const StackedBarChart: React.FC<StackedBarChartProps> = ({
  title,
  description,
  data,
  dataKeys,
  height = 300,
  width = '100%',
  colors,
  showGrid = true,
  // showLegend = true,
  showTooltip = true,
  trend,
  footerText,
  config,
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
              margin={{
                top: 8,
                right: 16,
                left: 12,
                bottom: 8,
              }}>
              {showGrid && (
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme.colors['border']}
                  opacity={0.5}
                  vertical={false}
                />
              )}
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                stroke={theme.colors?.text as string}
                tick={<CustomAxisTick />}
              />
              {/* <YAxis
                stroke={theme.colors?.text as string}
                tick={<CustomAxisTick />}
              /> */}
              {showTooltip && (
                <Tooltip
                  content={<ChartTooltipContent config={config} hideLabel />}
                />
              )}
              {/* {showLegend && <Legend content={<CustomLegend />} />} */}
              {dataKeys.map((key, index) => {
                // Only the top bar (last in dataKeys) gets top radius, bottom bar (first) gets bottom radius
                let radius: number | [number, number, number, number] = [
                  0, 0, 0, 0,
                ];
                if (index === 0) {
                  // Bottom bar
                  radius = [0, 0, 4, 4];
                } else if (index === dataKeys.length - 1) {
                  // Top bar
                  radius = [4, 4, 0, 0];
                } // else middle bars keep [0,0,0,0]
                return (
                  <Bar
                    key={key}
                    dataKey={key}
                    stackId="a"
                    fill={
                      config[key]?.color ||
                      chartColors[index % chartColors.length] ||
                      theme.colors.green[600]
                    }
                    activeBar={{
                      fill: theme.colors['green.700'] || 'green',
                    }}
                    radius={radius}
                  />
                );
              })}
            </RechartsBarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
      {/* Percentage Change Summary for Stacked Chart */}
      {percentageChanges.length > 0 && (
        <Box px="md" pb="sm" display="flex" flexDirection="column" gap="xs">
          {percentageChanges.map(
            ({ key, percent }: { key: string; percent: number }) => {
              const isPositive = percent >= 0;
              const bg = isPositive
                ? theme.colors.green[200]
                : theme.colors.red[200];
              const color = isPositive
                ? theme.colors.green[900]
                : theme.colors.red[900];
              const Icon = isPositive ? TrendUp : undefined;
              return (
                <Box key={key} alignItems="center" gap="sm">
                  {/* <Flex>
                    <Text
                      fontSize="sm2"
                      color="text-secondary"
                      minWidth="120px">
                      {config?.[key]?.label || key}
                    </Text>
                  </Flex> */}
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
                      {/* <Text
                        as="span"
                        fontWeight="normal"
                        fontSize="xs"
                        ml="xs"
                        color={color}>
                        {isPositive ? 'increase' : 'decrease'}
                      </Text> */}
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
            <Text fontSize="sm" color="textMuted">
              {footerText}
            </Text>
          )}
        </Box>
      )}
    </Box>
  );
};
