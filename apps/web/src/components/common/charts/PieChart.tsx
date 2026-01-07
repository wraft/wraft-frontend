import React, { useState } from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Box, Text } from '@wraft/ui';
import { useTheme } from '@xstyled/emotion';
import { TrendUp } from '@phosphor-icons/react';

import { BlockTitle } from 'common/Atoms';

import { ChartConfig } from './ChartConfig';
import { ChartTooltipContent } from './ChartTooltip';

interface PieChartData {
  name: string;
  value: number;
  fill?: string;
}

interface PieChartProps {
  title?: string;
  description?: string;
  data: PieChartData[];
  height?: number;
  width?: string | number;
  colors?: string[];
  showLegend?: boolean;
  showTooltip?: boolean;
  innerRadius?: number;
  outerRadius?: number;
  trend?: {
    value: number;
    label: string;
  };
  footerText?: string;
  config?: ChartConfig;
}

// const CustomLegend = ({ payload }: any) => {
//   // Safety check for undefined payload - less strict
//   if (!payload) {
//     return null;
//   }

//   return (
//     <Box
//       as="div"
//       display="flex"
//       flexDirection="column"
//       gap="sm"
//       ml="lg"
//       minWidth="200px"
//       maxHeight="100%"
//       overflowY="auto">
//       {payload.map((entry: any, index: number) => (
//         <Box
//           as="div"
//           key={`item-${index}`}
//           display="flex"
//           alignItems="center"
//           gap="sm"
//           p="xs"
//           borderRadius="sm">
//           <Box
//             as="div"
//             style={{
//               width: '12px',
//               height: '12px',
//               borderRadius: '2px',
//               backgroundColor: entry.color,
//               flexShrink: 0,
//             }}
//           />
//           <Text fontSize="sm" color="text" fontWeight="medium" lineHeight="1.2">
//             {entry.value}
//           </Text>
//         </Box>
//       ))}
//     </Box>
//   );
// };

export const PieChart: React.FC<PieChartProps> = ({
  title,
  description,
  data,
  height = 300,
  width = '100%',
  colors,
  showLegend = true,
  showTooltip = true,
  innerRadius = 0,
  outerRadius = 80,
  trend,
  footerText,
  config = {},
}) => {
  const theme: any = useTheme();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const defaultColors = [
    theme.colors?.primary as string,
    theme.colors?.success as string,
    theme.colors?.secondary as string,
    theme.colors?.accent as string,
  ].filter(Boolean);

  const chartColors = colors || defaultColors;

  // Helper to get fill color for a segment
  const getFill = (entry: any, index: number) => {
    if (activeIndex === index) {
      return theme.colors.green['400'] || '#d2f2e3';
    }
    return (
      entry.fill ||
      config[entry.name]?.color ||
      chartColors[index % chartColors.length]
    );
  };

  return (
    <Box
      // border="1px solid"
      borderColor="border"
      borderRadius="md"
      overflow="hidden">
      {(title || description) && (
        <BlockTitle title={title} description={description} />
      )}
      <Box p="md">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          style={{ width, height }}>
          <Box as="div" flex="1" maxWidth="60%" h="100%">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={innerRadius}
                  outerRadius={outerRadius}
                  fill={theme.colors?.primary as string}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                  onMouseLeave={() => setActiveIndex(null)}>
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getFill(entry, index)}
                      onMouseEnter={() => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(null)}
                    />
                  ))}
                </Pie>
                {showTooltip && (
                  <Tooltip
                    content={<ChartTooltipContent config={config} hideLabel />}
                  />
                )}
              </RechartsPieChart>
            </ResponsiveContainer>
          </Box>
          {showLegend && (
            <Box
              as="div"
              display="flex"
              flexDirection="column"
              gap="xs"
              ml="lg"
              minWidth="200px"
              borderLeft="1px solid"
              borderColor="border"
              maxHeight="100%"
              py="0"
              px="md"
              minHeight="100%"
              overflowY="auto">
              {data.map((entry, index) => (
                <Box
                  as="div"
                  key={`legend-item-${index}`}
                  display="flex"
                  alignItems="center"
                  gap="sm"
                  p="xs"
                  borderRadius="sm"
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  style={{
                    cursor: 'pointer',
                    background:
                      activeIndex === index
                        ? theme.colors.green['200']
                        : undefined,
                  }}>
                  <Box
                    as="div"
                    style={{
                      width: '4px',
                      height: '12px',
                      borderRadius: '2px',
                      backgroundColor:
                        entry.fill ||
                        config[entry.name]?.color ||
                        chartColors[index % chartColors.length],
                      flexShrink: 0,
                    }}
                  />
                  <Text
                    fontSize="sm"
                    color="text-secondary"
                    fontWeight="regular"
                    lineHeight="1.2">
                    {entry.name}
                  </Text>
                </Box>
              ))}
            </Box>
          )}
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
