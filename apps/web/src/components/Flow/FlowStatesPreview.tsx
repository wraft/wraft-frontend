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

const TYPE_CSS_COLORS: Record<string, string> = {
  reviewer: 'var(--theme-ui-colors-blue-600)',
  editor: 'var(--theme-ui-colors-green-600)',
  sign: 'var(--theme-ui-colors-purple-600)',
};

interface FlowState {
  id: string;
  state: string;
  order: number;
  type?: string;
}

interface FlowStatesPreviewProps {
  states: FlowState[];
  flowName?: string;
}

const FlowStatesPreview: React.FC<FlowStatesPreviewProps> = ({
  states,
  flowName,
}) => {
  if (!states?.length) return null;
  const sorted = [...states].sort((a, b) => a.order - b.order);

  return (
    <Flex
      direction="column"
      h="100%"
      w="240px"
      flexShrink={0}
      borderLeft="1px solid"
      borderColor="border"
      bg="background-primary">
      {/* Header */}
      <Box px="lg" py="lg" borderBottom="1px solid" borderColor="border">
        <Text
          fontSize="xs"
          fontWeight="600"
          color="text-secondary"
          style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Flow States
        </Text>
        {flowName && (
          <Text
            fontSize="sm2"
            fontWeight="heading"
            color="text-primary"
            mt="xs">
            {flowName}
          </Text>
        )}
      </Box>

      {/* States list */}
      <Box px="lg" py="lg" flex={1} overflow="auto">
        <Flex direction="column" gap="0">
          {sorted.map((state, index) => {
            const typeConfig = state.type
              ? STATE_TYPE_CONFIG[state.type]
              : null;
            const typeCssColor = state.type
              ? TYPE_CSS_COLORS[state.type]
              : 'var(--theme-ui-colors-gray-600)';
            const isLast = index === sorted.length - 1;

            return (
              <Flex
                key={state.id}
                direction="row"
                alignItems="stretch"
                style={{ position: 'relative' }}>
                {/* Indicator column */}
                <Flex
                  direction="column"
                  alignItems="center"
                  flexShrink={0}
                  style={{ width: 24 }}>
                  {/* Circle */}
                  <Flex
                    w="24px"
                    h="24px"
                    borderRadius="full"
                    align="center"
                    justify="center"
                    flexShrink={0}
                    bg="background-primary"
                    style={{
                      border: '2px solid',
                      borderColor: typeCssColor,
                    }}>
                    <Text
                      fontSize="xs"
                      fontWeight="heading"
                      color="text-primary"
                      style={{ lineHeight: 1 }}>
                      {index + 1}
                    </Text>
                  </Flex>

                  {/* Connecting line */}
                  {!isLast && (
                    <Box
                      style={{
                        width: 1,
                        flex: 1,
                        minHeight: 16,
                        backgroundColor: 'var(--theme-ui-colors-border)',
                      }}
                    />
                  )}
                </Flex>

                {/* Label */}
                <Box ml="sm" pb={isLast ? '0' : 'lg'} pt="xxs">
                  <Text
                    fontSize="sm"
                    fontWeight="heading"
                    color="text-primary"
                    style={{ lineHeight: 1.2 }}>
                    {state.state}
                  </Text>
                  {typeConfig && (
                    <Text
                      fontSize="xxs"
                      fontWeight="500"
                      color={typeConfig.color}
                      bg={typeConfig.bg}
                      px="xs"
                      py="xxs"
                      borderRadius="sm"
                      mt="xxs"
                      style={{ display: 'inline-block' }}>
                      {typeConfig.label}
                    </Text>
                  )}
                </Box>
              </Flex>
            );
          })}
        </Flex>
      </Box>

      {/* Footer summary */}
      <Box px="lg" py="md" borderTop="1px solid" borderColor="border">
        <Text fontSize="xxs" color="text-secondary">
          {sorted.length} {sorted.length === 1 ? 'state' : 'states'}
        </Text>
      </Box>
    </Flex>
  );
};

export default FlowStatesPreview;
