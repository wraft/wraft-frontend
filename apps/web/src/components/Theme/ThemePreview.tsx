import React from 'react';
import { Box, Text, Flex } from '@wraft/ui';
import styled from '@xstyled/emotion';

interface ThemePreviewProps {
  primaryColor: string;
  secondaryColor: string;
  bodyColor: string;
  fontFamily?: string;
}

const DocumentPage = styled(Box)`
  background: ${(props) => props.bg};
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.1),
    0 4px 8px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  width: 100%;
  max-width: 480px;
  min-height: 400px;
  position: relative;
  transition: background-color 0.2s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(0, 0, 0, 0.1) 20%,
      rgba(0, 0, 0, 0.1) 80%,
      transparent 100%
    );
  }
`;

const ThemePreview: React.FC<ThemePreviewProps> = ({
  primaryColor,
  secondaryColor,
  bodyColor,
  fontFamily = 'Georgia, serif',
}) => {
  return (
    <Box w="100%" h="530px" p="md" overflow="auto">
      <Box
        maxWidth="100%"
        h="100%"
        margin="0 auto"
        borderRadius="sm"
        overflow="hidden"
        border="1px solid"
        borderColor="gray.400">
        <Box
          bg="gray.400"
          borderBottom="1px solid "
          borderBottomColor="gray.600"
          padding="12px 16px"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          minHeight="3xl">
          <Text fontSize="md" fontWeight="heading">
            Document Preview
          </Text>
        </Box>

        <Box
          h="calc(100% - 10px)"
          mx="md"
          display="flex"
          justifyContent="center"
          alignItems="flex-start"
          padding="6px 4px"
          overflow="auto"
          w="390px">
          <DocumentPage bg={bodyColor}>
            <Box padding="25px 30px" lineHeight="1.6" fontFamily={fontFamily}>
              <Flex
                justifyContent="space-between"
                alignItems="flex-start"
                mb="3xl">
                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color={secondaryColor}
                    lineHeight="1.4"
                    transition="color 0.2s ease">
                    Star West International LLC
                  </Text>
                  <Text
                    fontSize="xs"
                    color={secondaryColor}
                    lineHeight="1.4"
                    transition="color 0.2s ease">
                    6391 Elgin St, Celina,
                  </Text>
                  <Text
                    fontSize="xs"
                    color={secondaryColor}
                    lineHeight="1.4"
                    style={{ transition: 'color 0.2s ease' }}>
                    Delaware 10299
                  </Text>
                </Box>
                <Box textAlign="right">
                  <Text
                    fontSize="xs"
                    color={secondaryColor}
                    mb="xl"
                    style={{ transition: 'color 0.2s ease' }}>
                    Contract: 01.01.2025
                  </Text>
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color={secondaryColor}
                    lineHeight="1.4"
                    transition="color 0.2s ease">
                    Biltrix Enterprises Ltd.
                  </Text>
                  <Text
                    fontSize="xs"
                    color={secondaryColor}
                    lineHeight="1.4"
                    transition="color 0.2s ease">
                    2012 Worthington Ave, Santa
                  </Text>
                  <Text
                    fontSize="xs"
                    color={secondaryColor}
                    lineHeight="1.4"
                    transition="color 0.2s ease">
                    Ana 92408 94548
                  </Text>
                </Box>
              </Flex>

              <Box textAlign="center" mb="xxl">
                <Text
                  as="h1"
                  fontSize="lg"
                  fontWeight="bold"
                  color={primaryColor}
                  transition="color 0.2s ease">
                  Agreement
                </Text>
              </Box>

              <Box mb="xxl">
                <Text
                  fontSize="sm"
                  color={secondaryColor}
                  lineHeight="1.6"
                  textAlign="justify"
                  transition="color 0.2s ease">
                  Contract Text: This Contract has been made out in four (4)
                  originals for Party A and Party B, each holding two (2), which
                  shall be equally authentic. During the valid credit period and
                  within the credit line, all the legal documents concerning the
                  creditor and debtor relationship between Party A and Party B
                  shall be deemed as an integral part of this Contract.
                </Text>
              </Box>

              <Box mb="xxl">
                <Text
                  fontSize="sm"
                  color={secondaryColor}
                  fontWeight="600"
                  transition="color 0.2s ease">
                  Contractor signatures
                </Text>
              </Box>
            </Box>
          </DocumentPage>
        </Box>
      </Box>
    </Box>
  );
};

export default ThemePreview;
