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
    <Box w="100%" maxWidth="620px" minHeight="500px" maxHeight="400px">
      <Box
        bg={bodyColor}
        boxShadow="0 2px 4px rgba(0, 0, 0, 0.1),
                   0 4px 8px rgba(0, 0, 0, 0.05),
                   0 8px 16px rgba(0, 0, 0, 0.03);"
        background={`$(props) => props.bg || '#ffffff'}`}
        border-radius="4px"
        w="100%"
        position="relative"
        transition="all 0.2s ease">
        <Box padding="62px 92px" lineHeight="1.6" fontFamily={fontFamily}>
          <Flex
            justifyContent="space-between"
            alignItems="flex-start"
            mb="40px">
            <Box>
              <Text
                fontSize="sm"
                fontWeight="bold"
                color={primaryColor}
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
                color={primaryColor}
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
              This Agreement is entered into between Star West International LLC
              (&quot;Company&quot;) and Biltrix Enterprises Ltd.
              (&quot;Client&quot;) for the provision of consulting services in
              accordance with the terms and conditions set forth herein.
            </Text>
            <Text
              fontSize="sm"
              color={secondaryColor}
              lineHeight="1.7"
              textAlign="justify"
              mb="lg">
              WHEREAS, Company provides business consulting services; and
              WHEREAS, Client desires to engage Company for such services on the
              terms specified below.
            </Text>
            <Text
              fontSize="sm"
              color={secondaryColor}
              lineHeight="1.7"
              textAlign="justify"
              mb="lg">
              <Text as="span" fontWeight="600" color={primaryColor} mb="xs">
                1. Services
              </Text>
              Company shall provide business consulting services including
              market analysis, strategic planning, and operational guidance in
              accordance with professional standards and industry best
              practices.
            </Text>

            <Text
              fontSize="sm"
              color={secondaryColor}
              lineHeight="1.6"
              textAlign="justify"
              mb="md">
              <Text as="span" fontWeight="600" color={primaryColor} mb="xs">
                2. Term &amp; Payment
              </Text>
              This Agreement shall continue for twelve (12) months from the
              effective date. Client shall pay Company a monthly fee of $15,000,
              payable within 30 days of invoice receipt.
            </Text>

            <Text
              fontSize="sm"
              color={secondaryColor}
              lineHeight="1.6"
              textAlign="justify"
              mb="md">
              <Text as="span" fontWeight="600" color={primaryColor} mb="xs">
                3. Confidentiality
              </Text>
              Both parties agree to maintain the confidentiality of all
              proprietary information shared during the course of this
              engagement.
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
