import { useState } from 'react';
import {
  FileArchive,
  Spinner,
  TextT,
  Article,
  TreeStructure,
  Layout,
  Blueprint,
} from '@phosphor-icons/react';
import { Box, Button, Flex, Text } from '@wraft/ui';

import Block, { BlockSection, List, ListParent } from './Block';
import { ActionState } from './ImporterWrapper';
import Accordion from './Accordion';

interface assetsProps {
  assets: any;
}

/** List Theme Details */

const ThemeBlock = ({ assets }: assetsProps) => {
  const theme: Record<string, any> | undefined =
    assets[0]?.data?.meta?.items?.theme || undefined;
  const fonts: Record<string, any> | undefined =
    assets[0]?.data?.meta?.packageContents?.fonts || undefined;
  return (
    <Box px="md" pb="md">
      <Box gap={3} mb={3}>
        <Box>
          <Text my={2}>Colors</Text>
          <Box>
            <Box display="flex" gap={3}>
              {Object.entries(theme?.colors || {}).map(
                ([colorName, colorValue]) => (
                  <Box key={colorName} display="flex">
                    <Box
                      w={20}
                      h={20}
                      bg={colorValue || 'primary'}
                      marginRight="8px"
                      alignItems="flex-start"
                      borderRadius="1rem"
                    />
                    <Box alignItems="flex-start">
                      <Text
                        fontSize="sm"
                        lineHeight={1}
                        m={0}
                        mb="xs"
                        color="gray.1100">
                        {colorName}
                      </Text>
                      <Text fontSize="sm" lineHeight={1}>
                        {typeof colorValue === 'string' ? colorValue : null}
                      </Text>
                    </Box>
                  </Box>
                ),
              )}
            </Box>
          </Box>
        </Box>
      </Box>
      <Text my="xs">Fonts</Text>
      <Box>
        <ListParent borderColor={'gray.500'}>
          {fonts &&
            fonts?.map((font: any) => (
              <List
                key={font.fontName}
                px="md"
                py="xs"
                borderColor={'gray.500'}>
                <Box display="flex" alignItems="center">
                  <TextT
                    size={14}
                    weight="thin"
                    style={{ marginRight: '6px' }}
                  />
                  <Text lineHeight={1}>{font.fontName}</Text>
                </Box>
              </List>
            ))}
        </ListParent>
      </Box>
    </Box>
  );
};

interface TemplatePreviewProps {
  assets?: any;
  onValidate?: any;
  actionState: ActionState;
  onImport?: any;
}
const TemplatePreview = ({
  assets,
  actionState,
  onImport,
}: TemplatePreviewProps) => {
  const [isVerified, _setIsVerified] = useState<boolean>(false);
  const metadata = assets[0]?.data?.meta?.metadata || assets[0]?.metadata;
  const error = assets[0]?.errors || null;
  /**
   * Validate  an Import
   */

  return (
    <Box
      bg="background-primary"
      borderRadius="md"
      border="solid 1px"
      borderColor="border"
      overflow="hidden">
      <Flex
        px="md"
        py="sm"
        bg="gray.100"
        borderBottomStyle="solid"
        borderBottomColor="border"
        borderBottomWidth={1}>
        <Box display="flex" alignItems="center" gap="sm">
          <FileArchive size={18} weight="thin" />
          <Text m="0">{assets[0]?.data?.file_details?.name}</Text>
        </Box>
        <Flex gap="sm" ml="auto" mr={1} mt={2} pt={1}>
          {/* <Button variant="secondary" onClick={checkImport}>
            {actionState === 'VALIDATING' ? 'Validating...' : 'Validate'}
          </Button> */}
          <Button onClick={onImport}>
            {(actionState === 'IMPORTING' || actionState === 'VALIDATING') && (
              <Spinner />
            )}
            {actionState === 'IMPORTING'
              ? 'Importing...'
              : actionState === 'VALIDATING'
                ? 'Validating...'
                : isVerified
                  ? 'Import'
                  : 'Import'}
          </Button>
        </Flex>
      </Flex>
      <Flex gap="sm" px="md" py="md">
        <Box w={'40%'} position="relative">
          <Box border="1px solid" borderColor="border" borderRadius="sm">
            <Text fontWeight="heading" px="sm" py="sm">
              Basic Info
            </Text>

            <BlockSection data={metadata} />
          </Box>
        </Box>

        <Box flex={1}>
          <Box>
            {assets[0]?.data?.meta?.items?.flow && (
              <Accordion
                header={
                  <Block
                    icon={<TreeStructure />}
                    title="Flow"
                    desc="Workflow"
                    clean={true}
                  />
                }>
                <BlockSection data={assets[0]?.data?.meta?.items?.flow} />
              </Accordion>
            )}

            {assets[0]?.data?.meta?.items?.layout && (
              <Accordion
                header={
                  <Block
                    icon={<Layout />}
                    title="Layout"
                    desc="Interface"
                    clean={true}
                  />
                }>
                <BlockSection data={assets[0]?.data?.meta?.items?.layout} />
              </Accordion>
            )}
            {assets[0]?.data?.meta?.items?.variant && (
              <Accordion
                header={
                  <Block
                    icon={<Blueprint />}
                    title={assets[0]?.data?.meta?.items?.variant?.name}
                    desc="Variant"
                    clean={true}
                  />
                }>
                <BlockSection data={assets[0]?.data?.meta?.items?.variant} />
              </Accordion>
            )}

            {assets[0]?.data?.meta?.items?.theme && (
              <Accordion
                header={
                  <Block
                    icon={<Blueprint />}
                    title={assets[0]?.data?.meta?.items?.theme?.name}
                    desc="Theme"
                    clean={true}
                  />
                }>
                <ThemeBlock assets={assets} />
              </Accordion>
            )}
            {assets[0]?.data?.meta?.buildSettings && (
              <Accordion
                header={
                  <Block
                    icon={<Blueprint />}
                    title="Build Settings"
                    desc=""
                    clean={true}
                  />
                }>
                <BlockSection data={assets[0]?.data?.meta?.buildSettings} />
              </Accordion>
            )}
            {assets[0]?.data?.meta?.fields && (
              <Accordion
                header={
                  <Block
                    icon={<Blueprint />}
                    title="Fields"
                    desc=""
                    clean={true}
                  />
                }>
                <BlockSection data={assets[0]?.data?.meta?.fields} />
              </Accordion>
            )}
            {assets[0]?.data?.meta?.packageContents && (
              <Accordion
                header={
                  <Block
                    icon={<Blueprint />}
                    title="Package Contents"
                    desc=""
                    clean={true}
                  />
                }>
                <BlockSection data={assets[0]?.data?.meta?.packageContents} />
              </Accordion>
            )}
          </Box>
          {error && error.length > 0 && (
            <Box>
              <Accordion
                error={true}
                header={
                  <Block
                    icon={<Article />}
                    title="Error"
                    desc={`${error.length} errors found`}
                    clean={true}
                  />
                }>
                <BlockSection data={error} />
              </Accordion>
            </Box>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default TemplatePreview;
