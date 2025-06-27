import React from 'react';
import { Box, Text } from '@wraft/ui';
import { useTheme } from '@xstyled/emotion';

import { ChartConfig } from './ChartConfig';

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: any;
  }>;
  label?: string;
  config: ChartConfig;
  hideLabel?: boolean;
  valueFormatter?: (value: number) => string;
  labelFormatter?: (value: any) => string;
}

export const ChartTooltipContent: React.FC<ChartTooltipProps> = ({
  active,
  payload,
  label,
  config,
  hideLabel = false,
  valueFormatter = (value) => value.toString(),
  labelFormatter,
}) => {
  const theme = useTheme() as any;

  if (!active || !payload?.length) {
    return null;
  }

  const formattedLabel = labelFormatter ? labelFormatter(label) : label;

  return (
    <Box
      as="div"
      p="sm"
      bg={theme.colors['background-secondary'] || '#f6f9f9'}
      border={`1px solid ${theme.colors.border}`}
      borderRadius="md"
      boxShadow="0 2px 8px rgba(0,0,0,0.08)"
      minWidth="180px">
      {!hideLabel && formattedLabel && (
        <Text
          as="p"
          fontSize="sm"
          fontWeight="medium"
          mb="xs"
          color={theme?.colors?.text}>
          {formattedLabel}
        </Text>
      )}
      {payload.map((entry, index) => (
        <Box
          key={entry.name}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          py="xs"
          borderBottom={
            index !== payload.length - 1
              ? `1px solid ${theme.colors.border}`
              : undefined
          }>
          <Box display="flex" alignItems="center" gap="xs">
            <Box
              as="span"
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '9999px',
                backgroundColor:
                  config[entry.name]?.color || theme?.colors?.primary,
                marginRight: '0.5rem',
                display: 'inline-block',
              }}
            />
            <Text
              as="span"
              fontSize="sm"
              color={theme?.colors?.text}
              fontWeight="medium">
              {config[entry.name]?.label || entry.name}
            </Text>
          </Box>
          <Text
            as="span"
            fontSize="sm"
            color={theme?.colors?.['text-secondary']}>
            {valueFormatter(entry.value)}
          </Text>
        </Box>
      ))}
    </Box>
  );
};

export const ChartTooltip: React.FC<
  Omit<ChartTooltipProps, 'config'> & { config?: ChartConfig }
> = (props) => {
  return <ChartTooltipContent {...props} config={props.config || {}} />;
};
