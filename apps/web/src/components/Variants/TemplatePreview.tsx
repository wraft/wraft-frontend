import React from 'react';
import { Box, Flex, Text } from '@wraft/ui';

interface TemplatePreviewProps {
  layout: any;
  theme: any;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ layout, theme }) => {
  const hasLayout = layout?.id;
  const hasTheme = theme?.id;
  if (!hasLayout && !hasTheme) return null;

  const primaryColor = theme?.primary_color || '#17221f';
  const secondaryColor = theme?.secondary_color || '#7a8481';
  const bodyColor = theme?.body_color || '#17221f';
  const fontFamily = theme?.font || 'sans-serif';
  const frameFields = layout?.frame?.fields || [];
  const colors = [
    theme?.primary_color,
    theme?.secondary_color,
    theme?.body_color,
  ].filter(Boolean);

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
          Preview
        </Text>
        {hasLayout && (
          <Text
            fontSize="sm2"
            fontWeight="heading"
            color="text-primary"
            mt="xs">
            {layout.name}
          </Text>
        )}
      </Box>

      {/* Document mockup */}
      <Box px="lg" py="lg" flex={1} overflow="auto">
        <Box
          bg="background-primary"
          border="1px solid"
          borderColor="border"
          borderRadius="sm"
          style={{
            aspectRatio: hasLayout
              ? `${layout.width || 210} / ${layout.height || 297}`
              : '210 / 297',
            width: '100%',
            overflow: 'hidden',
          }}>
          <Box p="md" style={{ fontFamily }}>
            {/* Title block */}
            <Box
              mb="sm"
              style={{
                width: '60%',
                height: 8,
                borderRadius: 2,
                backgroundColor: primaryColor,
                opacity: 0.85,
              }}
            />

            {/* Subtitle block */}
            <Box
              mb="lg"
              style={{
                width: '40%',
                height: 5,
                borderRadius: 2,
                backgroundColor: secondaryColor,
                opacity: 0.5,
              }}
            />

            {/* Body lines */}
            <Flex direction="column" gap="xs">
              {[0.95, 0.88, 0.92, 0.7, 0.85, 0.6].map((w, i) => (
                <Box
                  key={i}
                  style={{
                    width: `${w * 100}%`,
                    height: 3,
                    borderRadius: 1,
                    backgroundColor: bodyColor,
                    opacity: 0.15,
                  }}
                />
              ))}
            </Flex>

            {/* Frame fields placeholder */}
            {frameFields.length > 0 && (
              <Box mt="lg">
                <Box
                  mb="xs"
                  style={{
                    width: '30%',
                    height: 4,
                    borderRadius: 1,
                    backgroundColor: secondaryColor,
                    opacity: 0.4,
                  }}
                />
                <Flex direction="column" gap="xxs">
                  {frameFields.slice(0, 5).map((f: any) => (
                    <Flex key={f.name} align="center" gap="xs">
                      <Box
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: '50%',
                          backgroundColor: primaryColor,
                          opacity: 0.4,
                          flexShrink: 0,
                        }}
                      />
                      <Text
                        fontSize="xxs"
                        color="text-secondary"
                        style={{
                          fontSize: 7,
                          lineHeight: 1.4,
                          opacity: 0.7,
                        }}>
                        {f.name}
                      </Text>
                    </Flex>
                  ))}
                  {frameFields.length > 5 && (
                    <Text
                      style={{
                        fontSize: 6,
                        opacity: 0.5,
                        color: 'var(--theme-ui-colors-text-secondary)',
                      }}>
                      +{frameFields.length - 5} more
                    </Text>
                  )}
                </Flex>
              </Box>
            )}

            {/* More body lines */}
            <Flex direction="column" gap="xs" mt="lg">
              {[0.9, 0.75, 0.82].map((w, i) => (
                <Box
                  key={i}
                  style={{
                    width: `${w * 100}%`,
                    height: 3,
                    borderRadius: 1,
                    backgroundColor: bodyColor,
                    opacity: 0.15,
                  }}
                />
              ))}
            </Flex>
          </Box>
        </Box>

        {/* Dimensions */}
        {hasLayout && layout.slug && (
          <Text
            fontSize="xxs"
            color="text-secondary"
            mt="sm"
            style={{ textAlign: 'center' }}>
            {layout.slug.toUpperCase()} &middot; {layout.width}&times;
            {layout.height}
            {layout.unit}
          </Text>
        )}
      </Box>

      {/* Theme info footer */}
      {hasTheme && (
        <Box px="lg" py="md" borderTop="1px solid" borderColor="border">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="xs" fontWeight="heading" color="text-primary">
                {theme.name}
              </Text>
              {theme.font && (
                <Text fontSize="xxs" color="text-secondary" mt="xxs">
                  {theme.font}
                </Text>
              )}
            </Box>
            {colors.length > 0 && (
              <Flex gap="xs" align="center">
                {colors.map((color: string, i: number) => (
                  <Box
                    key={i}
                    borderRadius="full"
                    border="1px solid"
                    borderColor="border"
                    style={{
                      width: 14,
                      height: 14,
                      backgroundColor: color,
                    }}
                  />
                ))}
              </Flex>
            )}
          </Flex>
        </Box>
      )}
    </Flex>
  );
};

export default TemplatePreview;
