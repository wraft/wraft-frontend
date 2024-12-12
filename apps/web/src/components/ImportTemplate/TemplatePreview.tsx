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
}
const TemplatePreview = ({
  assets,
  onValidate,
  actionState,
}: TemplatePreviewProps) => {
  // const [isImporting, setIsImporting] = useState<boolean>(false);
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
      borderColor="gray.400"
      overflow="hidden">
      <Box
        px={4}
        // pt={2}
        display="flex"
        borderBottomStyle="solid"
        borderBottomColor="gray.100"
        borderBottomWidth={1}>
        <Box display="flex" alignItems="center" gap={2}>
          <FileArchive size={16} weight="thin" />
          <Text>{assets[0]?.name}</Text>
        </Box>
        <Box ml="auto" mr={1} mt={2} pt={1}>
          <Button variant="primary" onClick={checkImport}>
            {(actionState === 'IMPORTING' || actionState === 'VALIDATING') && (
              <Spinner />
            )}
            {actionState === 'IMPORTING'
              ? 'Importing...'
              : actionState === 'VALIDATING'
                ? 'Validating...'
                : isVerified
                  ? 'Import'
                  : 'Verify'}
          </Button>
        </Box>
      </Box>
      <Box
        border="solid 0"
        borderTopWidth={1}
        borderTopColor="gray.300"
        pb={4}
        px={4}
        pt={1}
        bg="white">
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
              title={assets[0]?.wraft_json?.variant?.name}
              icon={<Blueprint />}
              desc="Variant">
              <VariantBlock assets={assets} />
            </Accordion>
            <Accordion
              title={assets[0]?.wraft_json?.theme?.name}
              icon={<Blueprint />}
              desc="Theme">
              <ThemeBlock assets={assets} />
            </Accordion>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TemplatePreview;
