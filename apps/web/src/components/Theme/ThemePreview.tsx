import React from 'react';
import { Box, Text, Flex } from '@wraft/ui';

interface DocumentPreviewProps {
  primaryColor?: string;
  secondaryColor?: string;
  bodyColor?: string;
  fontFamily?: string;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  primaryColor = '#2563eb',
  secondaryColor = '#374151',
  bodyColor = '#ffffff',
  fontFamily = 'Georgia, serif',
}) => {
  return (
    <Box
      w="100%"
      maxWidth="530px"
      margin="0 auto"
      position="relative"
      minHeight="500px"
      maxHeight="400px"
      mx="auto"
      ml="xxl">
      <Box
        bg={bodyColor}
        boxShadow="0 2px 4px rgba(0, 0, 0, 0.1),
                   0 4px 8px rgba(0, 0, 0, 0.05),
                   0 8px 16px rgba(0, 0, 0, 0.03);"
        background={`$(props) => props.bg || '#ffffff'}`}
        border-radius="4px"
        w="100%"
        maxWidth="556px"
        min-height=" 656px"
        position="relative"
        transition="all 0.2s ease">
        <Box padding="40px 60px" lineHeight="1.6" fontFamily={fontFamily}>
          <Flex
            justifyContent="space-between"
            alignItems="flex-start"
            mb="40px">
            <Box>
              <Text
                fontSize="sm"
                fontWeight="bold"
                color={secondaryColor}
                lineHeight="1.4"
                mb="xs">
                Star West International LLC
              </Text>
              <Text fontSize="xs" color={secondaryColor} lineHeight="1.4">
                6391 Elgin St, Celina,
              </Text>
              <Text fontSize="xs" color={secondaryColor} lineHeight="1.4">
                Delaware 10299
              </Text>
            </Box>
            <Box textAlign="right">
              <Text fontSize="xs" color={secondaryColor} mb="16px">
                Contract: 01.01.2025
              </Text>
              <Text
                fontSize="sm"
                fontWeight="bold"
                color={secondaryColor}
                lineHeight="1.4"
                mb="xs">
                Biltrix Enterprises Ltd.
              </Text>
              <Text fontSize="xs" color={secondaryColor} lineHeight="1.4">
                2012 Worthington Ave, Santa
              </Text>
              <Text fontSize="xs" color={secondaryColor} lineHeight="1.4">
                Ana 92408 94548
              </Text>
            </Box>
          </Flex>

          <Box textAlign="center" mb="xl">
            <Text
              as="h1"
              fontSize="xl"
              fontWeight="bold"
              color={primaryColor}
              letterSpacing="0.5px"
              textDecoration="underline">
              AGREEMENT
            </Text>
          </Box>
          <Box mb="xl">
            <Text
              fontSize="sm"
              color={secondaryColor}
              lineHeight="1.7"
              textAlign="justify"
              mb="md">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Earum
              natus at neque, eos magni et nulla iste temporibus, eius est
              nihil, amet cum placeat magnam vitae autem maiores harum impedit!
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti
              placeat similique quas hic omnis eveniet. Nobis temporibus tempora
              minima a qui. Molestiae in id commodi labore ipsam sit praesentium
              placeat?Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Cupiditate laudantium dolores expedita suscipit quis beatae
              dolorem, cum velit tempora ab eius inventore tempore labore
              dolorem, cum velit tempora ab eius inventore tempore labore
            </Text>
            <Text
              fontSize="sm"
              color={secondaryColor}
              lineHeight="1.7"
              textAlign="justify"
              mb="lg">
              <Text as="span" fontWeight="600" mb="xs">
                Disclaimer
              </Text>
              &quot;Licensee&quot; will provide full indemnification against any
              copyright infringement or other claims by third parties relating
              to the Term provided by the Licensor to &quot;Tune AM LLP&quot;
              either directly or
            </Text>

            <Text
              fontSize="sm"
              color={secondaryColor}
              lineHeight="1.6"
              textAlign="justify"
              mb="md">
              <Text as="span" fontWeight="600" mb="xs">
                Term &amp; copyright
              </Text>
              &quot;Licensee&quot; will provide full indemnification against any
              copyright infringement or other claims by third parties relating
              to the Term provided by the Licensor to &quot;Tune AM LLP&quot;
              either directly or through any of its authorized
              distribution/aggregation partners.
            </Text>
          </Box>

          <Box>
            <Text fontSize="sm" color={primaryColor} fontWeight="600" mb="lg">
              Contractor Signatures
            </Text>

            <Flex justifyContent="space-between" mt="lg">
              <Box>
                <Box
                  w="150px"
                  h="1px"
                  bg={secondaryColor}
                  opacity="0.3"
                  mb="sm"
                />
                <Text fontSize="xs" color={secondaryColor}>
                  Party A Signature
                </Text>
                <Text fontSize="xs" color={secondaryColor} opacity="0.7">
                  Date: ___________
                </Text>
              </Box>

              <Box textAlign="right">
                <Box
                  w="150px"
                  h="1px"
                  bg={secondaryColor}
                  opacity="0.3"
                  mb="sm"
                />
                <Text fontSize="xs" color={secondaryColor}>
                  Party B Signature
                </Text>
                <Text fontSize="xs" color={secondaryColor} opacity="0.7">
                  Date: ___________
                </Text>
              </Box>
            </Flex>
          </Box>
        </Box>
      </Box>
      <Box py="xl">
        <Text
          fontSize="md"
          fontWeight="heading"
          textAlign="center"
          color="gray.900">
          Document Preview
        </Text>
      </Box>
    </Box>
  );
};

export default DocumentPreview;
