import React from 'react';
import { Box } from '@wraft/ui';
import { useTheme } from '@xstyled/emotion';

import { ChartConfig } from './ChartConfig';

interface ChartContainerProps {
  children: React.ReactNode;
  config: ChartConfig;
  className?: string;
  height?: number | string;
  width?: number | string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  children,
  className,
  height = '100%',
  width = '100%',
}) => {
  const theme: any = useTheme();

  const containerStyles = {
    position: 'relative' as const,
    width,
    height,
    '& .recharts-default-tooltip': {
      backgroundColor: theme.colors?.background as string,
      border: `1px solid ${theme.colors?.border as string}`,
      borderRadius: '4px',
      padding: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    '& .recharts-tooltip-label': {
      color: theme.colors?.text as string,
    },
    '& .recharts-legend-item-text': {
      color: theme.colors?.text as string,
    },
    '& .recharts-cartesian-axis-line': {
      stroke: theme.colors?.border as string,
    },
    '& .recharts-cartesian-axis-tick-line': {
      stroke: theme.colors?.border as string,
    },
    '& .recharts-cartesian-grid-horizontal line': {
      stroke: theme.colors?.border as string,
      opacity: 0.5,
    },
    '& .recharts-cartesian-grid-vertical line': {
      stroke: theme.colors?.border as string,
      opacity: 0.5,
    },
  };

  return (
    <Box as="div" className={className} style={containerStyles}>
      {children}
    </Box>
  );
};
