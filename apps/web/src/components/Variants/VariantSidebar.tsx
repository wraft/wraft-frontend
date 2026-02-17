import React, { memo } from 'react';
import { Box, Flex, Text } from '@wraft/ui';
import { Check, WarningCircle } from '@phosphor-icons/react';

interface SidebarProps {
  currentStep: number;
  onStepChange: (stepIndex: number) => void;
  steps: string[];
  showMappingStep: boolean;
  stepErrors?: boolean[];
}

const VariantSidebar: React.FC<SidebarProps> = memo(function VariantSidebar({
  currentStep,
  onStepChange,
  steps,
  showMappingStep,
  stepErrors = [],
}) {
  const displaySteps = showMappingStep ? steps : steps.slice(0, 4);

  return (
    <Flex
      direction="column"
      h="100%"
      w="220px"
      flexShrink={0}
      borderRight="1px solid"
      borderColor="border"
      bg="background-primary"
      py="xl"
      px="lg"
    >
      <Text
        fontSize="xs"
        fontWeight="600"
        color="text-secondary"
        mb="lg"
        style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
      >
        Steps
      </Text>

      <Flex direction="column" gap="0">
        {displaySteps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isLast = index === displaySteps.length - 1;
          const hasError = stepErrors[index] === true;

          return (
            <Flex
              key={step}
              direction="row"
              alignItems="stretch"
              cursor="pointer"
              onClick={() => onStepChange(index)}
              style={{ position: 'relative' }}
            >
              {/* Indicator column */}
              <Flex
                direction="column"
                alignItems="center"
                flexShrink={0}
                style={{ width: 24 }}
              >
                {/* Circle */}
                <Flex
                  w="24px"
                  h="24px"
                  borderRadius="xl"
                  align="center"
                  justify="center"
                  flexShrink={0}
                  bg={
                    hasError
                      ? 'red.100'
                      : isCompleted
                        ? 'gray.1000'
                        : isActive
                          ? 'gray.1000'
                          : 'background-secondary'
                  }
                  border="1px solid"
                  borderColor={
                    hasError
                      ? 'red.400'
                      : isActive
                        ? 'gray.1200'
                        : isCompleted
                          ? 'gray.1000'
                          : 'border'
                  }
                  style={{
                    transition: 'all 150ms ease',
                  }}
                >
                  {hasError ? (
                    <WarningCircle
                      size={14}
                      weight="fill"
                      color="var(--theme-ui-colors-red-700)"
                    />
                  ) : isCompleted ? (
                    <Check
                      size={12}
                      weight="bold"
                      color="var(--theme-ui-colors-background-primary)"
                    />
                  ) : (
                    <Text
                      fontSize="xs"
                      fontWeight="600"
                      color={isActive ? 'background-primary' : 'text-secondary'}
                    >
                      {index + 1}
                    </Text>
                  )}
                </Flex>

                {/* Connecting line */}
                {!isLast && (
                  <Box
                    style={{
                      width: 1,
                      flex: 1,
                      minHeight: 20,
                      backgroundColor: isCompleted
                        ? 'var(--theme-ui-colors-gray-800)'
                        : 'var(--theme-ui-colors-border)',
                      transition: 'background-color 150ms ease',
                    }}
                  />
                )}
              </Flex>

              {/* Label */}
              <Box ml="sm" pb={isLast ? '0' : 'lg'} pt="xxs">
                <Text
                  fontSize="sm"
                  fontWeight={isActive ? '600' : '400'}
                  color={
                    hasError
                      ? 'red.700'
                      : isActive
                        ? 'text-primary'
                        : isCompleted
                          ? 'text-primary'
                          : 'text-secondary'
                  }
                  style={{ transition: 'color 150ms ease' }}
                >
                  {step}
                </Text>
              </Box>
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
});

export default VariantSidebar;
