import { useState } from 'react';
import {
  FileArchive,
  Spinner,
  Calendar,
  TextAlignLeft,
  TextT,
  Article,
  TreeStructure,
  Layout,
  Blueprint,
} from '@phosphor-icons/react';
import { x } from '@xstyled/emotion';
import { Button } from '@wraft/ui';

import { Box } from 'common/Box';
import { Text } from 'common/Text';

import Block, { List, ListParent } from './Block';
import { ActionState } from './ImporterWrapper';
import Accordion from './Accordion';

interface assetsProps {
  assets: any;
}

/** List Theme Details */

const ThemeBlock = ({ assets }: assetsProps) => {
  const assetFirst: Record<string, any> | undefined = assets[0] || undefined;
  return (
    <Box px={3} pb={2}>
      <Box gap={3} mb={3}>
        <Box>
          <Text my={2} fontSize="sm">
            Colors
          </Text>
          <Box>
            <Box display="flex" gap={3}>
              {Object.entries(assets[0]?.wraft_json?.theme?.colors || {}).map(
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
                        fontSize="xs"
                        lineHeight={1}
                        m={0}
                        mb={1}
                        color="gray.1100">
                        {colorName}
                      </Text>
                      <Text fontSize="xs" lineHeight={1} m={0}>
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
      <Text my={2} fontSize="sm">
        Fonts
      </Text>
      <Box>
        <ListParent borderColor={'gray.500'}>
          {assetFirst &&
            assetFirst.size > 0 &&
            assetFirst?.wraft_json?.theme?.fonts?.map((font: any) => (
              <List key={font.fontName} px={2} py={0} borderColor={'gray.500'}>
                <Box display="flex" alignItems="center">
                  <TextT
                    size={14}
                    weight="thin"
                    style={{ marginRight: '6px' }}
                  />
                  <Text fontSize="xs" lineHeight={1}>
                    {font.fontName}
                  </Text>
                </Box>
              </List>
            ))}
        </ListParent>
      </Box>
    </Box>
  );
};

/** List Variants */
const VariantBlock = ({ assets }: assetsProps) => {
  const assetFirst: Record<string, any> | undefined = assets[0] || undefined;
  return (
    <Box>
      <Box display="flex" gap={3} px={3} py={3}>
        <x.span fontSize="sm">{assets[0]?.wraft_json?.variant?.name}</x.span>
        <x.span fontSize="sm">{assets[0]?.wraft_json?.variant?.prefix}</x.span>
        <x.span fontSize="xs" color="gray.900">
          {assets[0]?.wraft_json?.variant?.description}
        </x.span>
      </Box>
      <Box px={3} pb={3} maxW={'80ch'}>
        <Box fontSize="sm">
          <ListParent borderColor={'gray.500'}>
            {assetFirst &&
              assetFirst?.wraft_json?.variant?.fields?.map((field: any) => (
                <List key={field.name} px={3} py={0} borderColor={'gray.500'}>
                  <Box display="flex" alignItems="center">
                    <Text fontSize="xs" lineHeight="heading">
                      {field.name}
                    </Text>
                    <Box
                      display="flex"
                      ml="auto"
                      gap={2}
                      mr={3}
                      alignItems="center">
                      <x.span color="gray.900" fontSize="xs">
                        {field.type}
                      </x.span>
                      {field.type === 'String' && <TextT size={16} />}
                      {field.type === 'Date' && <Calendar size={16} />}
                      {field.type === 'Text' && <TextAlignLeft size={16} />}
                    </Box>
                  </Box>
                </List>
              ))}
          </ListParent>
        </Box>
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
  onValidate,
  actionState,
  onImport,
}: TemplatePreviewProps) => {
  const [isVerified, setIsVerified] = useState<boolean>(false);

  /**
   * Validate  an Import
   */
  const checkImport = () => {
    const assetId = assets[0]?.id;
    onValidate(assetId);
  };

  return (
    <Box
      bg="gray.100"
      borderRadius="6px"
      border="solid 1px"
      borderColor="border"
      overflow="hidden">
      <Box
        px={3}
        mb={3}
        // pt={2}
        display="flex"
        borderBottomStyle="solid"
        borderBottomColor="gray.100"
        borderBottomWidth={1}>
        <Box display="flex" alignItems="center" gap={2}>
          <FileArchive size={16} weight="thin" />
          <Text>{assets[0]?.name}</Text>
        </Box>
        <Box display="flex" gap={2} ml="auto" mr={1} mt={2} pt={1}>
          <Button variant="secondary" onClick={checkImport}>
            {actionState === 'VALIDATING' ? 'Validating...' : 'Validate'}
          </Button>
          <Button variant="secondary" onClick={onImport}>
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
        </Box>
      </Box>
      <Box
        display="flex"
        pb={4}
        border="solid 0"
        borderTopWidth={1}
        borderTopColor="gray.300"
        px={4}
        py={3}
        bg="white">
        <Box w={'40%'} position="relative">
          <Box
            bg="white"
            mx={4}
            ml={0}
            mt={3}
            // pb="141.4%"
            h="80%"
            mb={4}
            pb={7}
            // w="100%"
            position="relative"
            border="1px solid"
            borderColor="gray.300"
            borderRadius={2}
            overflow="hidden"
            boxShadow="0 1px 3px rgba(0,0,0,0.1)">
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="gray.50"
            />
          </Box>
        </Box>
        <Box flex={1}>
          <Box pb={6}>
            <Box>
              <Box px={0} pb={1}>
                <Text fontSize="sm" fontWeight={500}>
                  Imported Structures
                </Text>
              </Box>
              <Box>
                <Block
                  icon={<Article />}
                  title={assets[0]?.wraft_json?.data_template?.title}
                  desc="Template"
                />
                <Block
                  icon={<TreeStructure />}
                  title={assets[0]?.wraft_json?.flow?.name}
                  desc="Flow"
                />
                <Block
                  icon={<Layout />}
                  title={assets[0]?.wraft_json?.layout?.name}
                  desc="Layout"
                />
                <Accordion
                  header={
                    <Block
                      icon={<Blueprint />}
                      title={assets[0]?.wraft_json?.variant?.name}
                      desc="Variant"
                      clean={true}
                    />
                  }>
                  <VariantBlock assets={assets} />
                </Accordion>
                <Accordion
                  header={
                    <Block
                      icon={<Blueprint />}
                      title={assets[0]?.wraft_json?.theme?.name}
                      desc="Theme"
                      clean={true}
                    />
                  }>
                  <ThemeBlock assets={assets} />
                </Accordion>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TemplatePreview;
