import React from 'react';
import { Box, Flex, Text } from '@wraft/ui';

const STATE_TYPE_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  reviewer: { label: 'Review', color: 'blue.600', bg: 'blue.50' },
  editor: { label: 'Edit', color: 'green.600', bg: 'green.50' },
  sign: { label: 'Sign', color: 'purple.600', bg: 'purple.50' },
};

interface FlowState {
  id: string;
  state: string;
  order: number;
  type?: string;
}

interface FlowStatePipelineProps {
  states: FlowState[];
  size?: 'sm' | 'md';
}

const FlowStatePipeline: React.FC<FlowStatePipelineProps> = ({
  states,
  size = 'md',
}) => {
  if (!states?.length) return null;
  const sorted = [...states].sort((a, b) => a.order - b.order);

  const circleSize = size === 'sm' ? 20 : 28;
  const fontSize = size === 'sm' ? 'xxs' : 'xs';
  const labelSize = size === 'sm' ? 'xs' : 'sm';

  return (
    <Flex align="flex-start">
      {sorted.map((state, index) => {
        const typeConfig = state.type ? STATE_TYPE_CONFIG[state.type] : null;
        const isFirst = index === 0;
        const isLast = index === sorted.length - 1;

        return (
          <Flex
            key={state.id}
            direction="column"
            align="center"
            flex={1}
            style={{ minWidth: 0 }}>
            {/* Circle row with connectors */}
            <Flex
              align="center"
              justify="center"
              style={{
                width: '100%',
                height: circleSize,
                position: 'relative',
              }}>
              {/* Left connector */}
              {!isFirst && (
                <Box
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: '50%',
                    top: '50%',
                    height: 1,
                    backgroundColor: 'var(--theme-ui-colors-border)',
                  }}
                />
              )}
              {/* Right connector */}
              {!isLast && (
                <Box
                  style={{
                    position: 'absolute',
                    left: '50%',
                    right: 0,
                    top: '50%',
                    height: 1,
                    backgroundColor: 'var(--theme-ui-colors-border)',
                  }}
                />
              )}
              {/* Circle */}
              <Flex
                align="center"
                justify="center"
                bg="background-primary"
                borderRadius="full"
                flexShrink={0}
                style={{
                  width: circleSize,
                  height: circleSize,
                  border: `2px solid`,
                  borderColor: typeConfig
                    ? `var(--theme-ui-colors-${typeConfig.color.replace('.', '-')})`
                    : 'var(--theme-ui-colors-gray-600)',
                  position: 'relative',
                  zIndex: 1,
                }}>
                <Text
                  fontSize={fontSize}
                  fontWeight="heading"
                  color="text-primary"
                  style={{ lineHeight: 1 }}>
                  {index + 1}
                </Text>
              </Flex>
            </Flex>

            {/* State name */}
            <Text
              fontSize={labelSize}
              fontWeight="heading"
              color="text-primary"
              mt="sm"
              style={{
                textAlign: 'center',
                lineHeight: 1.2,
                wordBreak: 'break-word',
              }}>
              {state.state}
            </Text>

            {/* Type badge */}
            {typeConfig && (
              <Text
                fontSize="xxs"
                fontWeight="500"
                color={typeConfig.color}
                mt="xxs"
                style={{ textAlign: 'center' }}>
                {typeConfig.label}
              </Text>
            )}
          </Flex>
        );
      })}
    </Flex>
  );
};

export default FlowStatePipeline;
