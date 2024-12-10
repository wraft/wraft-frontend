import { useState } from 'react';
import {
  FileArchive,
  File,
  Spinner,
  Calendar,
  TextAlignLeft,
  TextT,
  Article,
  TreeStructure,
  PaintRoller,
  Blueprint,
  Layout,
} from '@phosphor-icons/react';
import { Text, Box, Flex } from 'theme-ui';
import styled from '@emotion/styled';
import { Button } from '@wraft/ui';

import Block from './Block';
import Accordion from './Accordion';

// import { Box } from './Box';

const FilePreview = styled.li`
  border-bottom: solid 1px #eee;
  padding-bottom: 3px;
  margin-bottom: 3px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #555;
`;

const FileList = styled.ul`
  list-style: none;
  padding-left: 0;
`;

interface TemplatePreviewProps {
  assets?: any;
  onImport?: any;
  onValidate?: any;
}
const TemplatePreview = ({
  assets,
  onImport,
  onValidate,
}: TemplatePreviewProps) => {
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);

  /**
   * Import from an upload instance
   */

  const doImport = () => {
    // setIsVerified(true);

    const assetId = assets[0]?.id;

    if (isVerified) {
      setIsImporting(true);
      onImport(assetId);
      setIsImporting(false);
    }
  };

  /**
   * Validate importable template files
   */
  const checkImport = () => {
    setIsVerified(true);
    const assetId = assets[0]?.id;
    onValidate(assetId);
    doImport();
  };

  return (
    <Box>
      <Box>
        <Box
          sx={{
            flex: 1,
            bg: 'white',
            border: 'solid 1px',
            borderColor: 'gray.600',
            borderRadius: '6px',
            overflow: 'hidden',
          }}>
          <Box
            // x="flex"
            sx={{
              px: 4,
              py: '12px',
              verticalAlign: 'center',
              display: 'flex',
              color: 'green.1200',
              borderBottom: 'solid 1px',
              borderColor: 'neutral.200',
              alignItems: 'center',
              gap: 2,
            }}>
            <FileArchive size={16} weight="thin" />
            <Text
              variant="pB"
              sx={{
                fontSize: '15px',
                letterSpacing: '-0.15px',
                display: 'inline-flex',
              }}>
              {assets[0].name}
            </Text>
            <Text
              variant="caps"
              sx={{ display: 'hidden', fontSize: 'xss', mb: 0, pb: 0 }}>
              {assets[0].id}
            </Text>
            <Box sx={{ ml: 'auto' }}>
              <Button variant="primary" onClick={checkImport}>
                {isImporting && <Spinner />}
                {isVerified ? 'Import' : 'Verify'}
              </Button>
            </Box>
          </Box>

          <Box variant="frame">
            <Box
              variant="flex"
              sx={{
                px: 0,
                pb: 2,
                borderBottom: 'solid 1px',
                borderColor: 'gray.600',
              }}>
              <Box sx={{ px: 4 }}>
                <Text
                  as="p"
                  variant="pB"
                  sx={{
                    fontSize: 'sm',
                    fontWeight: 400,
                    pt: 3,
                    mb: 2,
                    color: 'gray.900',
                  }}>
                  Imported Structures
                </Text>

                <Box
                  sx={{
                    borderBottom: 'solid 1px',
                    borderRight: 'solid 1px',
                    borderColor: 'gray.600',
                    mb: 3,
                  }}>
                  <Flex sx={{ flex: 1 }}>
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
                  </Flex>

                  <Accordion
                    title={assets[0]?.wraft_json?.variant?.name}
                    icon={<Blueprint />}
                    desc="Variant">
                    <Box sx={{ p: 2 }}>
                      <Text variant="pB" sx={{ fontSize: 'sm' }}>
                        {assets[0]?.wraft_json?.variant?.name} \
                      </Text>
                      <Text sx={{ fontSize: 'sm' }}>
                        {assets[0]?.wraft_json?.variant?.prefix}
                      </Text>
                      <Text as="p" sx={{ fontSize: 'xs', color: 'gray.900' }}>
                        {assets[0]?.wraft_json?.variant?.description}
                      </Text>
                    </Box>
                    <Box sx={{ px: 2, pb: 3 }}>
                      <Box sx={{ fontSize: 'sm' }}>
                        <Box
                          as="ul"
                          sx={{
                            listStyle: 'none',
                            paddingLeft: 0,
                            py: 2,
                          }}>
                          {assets[0]?.wraft_json?.variant?.fields?.map(
                            (field: any) => (
                              <Box
                                as="li"
                                key={field.name}
                                sx={{
                                  maxWidth: ['40%'],
                                  border: 'solid 1px',
                                  borderColor: 'gray.600',
                                  borderBottom: 0,
                                  px: 3,
                                  py: 1,
                                  ':last-child': {
                                    borderBottom: 'solid 1px',
                                    borderColor: 'gray.600',
                                  },
                                }}>
                                <Flex>
                                  <Text sx={{ fontSize: 'sm' }}>
                                    {field.name} <>{/* {field.type}{' '} */}</>
                                  </Text>
                                  <Flex sx={{ ml: 'auto', gap: 2 }}>
                                    <Text
                                      as="span"
                                      variant="caps"
                                      color="gray.900">
                                      {field.type}
                                    </Text>
                                    {field.type === 'String' && (
                                      <TextT size={14} weight="thin" />
                                    )}

                                    {field.type === 'Date' && (
                                      <Calendar size={14} weight="thin" />
                                    )}

                                    {field.type === 'Text' && (
                                      <TextAlignLeft size={14} weight="thin" />
                                    )}
                                  </Flex>
                                </Flex>
                              </Box>
                            ),
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Accordion>

                  <Accordion
                    title={assets[0]?.wraft_json?.theme?.name}
                    desc="Theme"
                    icon={<PaintRoller />}>
                    <Box sx={{ p: 2 }}>
                      <Box
                        sx={{
                          // display: 'grid',
                          // gridTemplateColumns: '1fr 1fr',
                          gap: 3,
                          mb: 3,
                        }}>
                        <Box>
                          <Text as="p" sx={{ my: 2, fontSize: 'sm' }}>
                            Colors
                          </Text>
                          <Box
                            sx={{
                              fontSize: 'sm',
                              display: 'flex',
                              alignItems: 'top',
                              border: 'solid 1px',
                              borderColor: 'gray.400',
                              // px: 3,
                              // py: 2,
                            }}>
                            <Box sx={{ display: 'flex', gap: 0 }}>
                              {Object.entries(
                                assets[0]?.wraft_json?.theme?.colors || {},
                              ).map(([colorName, colorValue]) => (
                                <Flex
                                  key={colorName}
                                  sx={{
                                    alignItems: 'flex-start',
                                    px: 3,
                                    py: 2,
                                    borderRight: 'solid 1px',
                                    borderColor: 'gray.600',
                                    justifyContent: 'flex-start',

                                    pr: 3,
                                  }}>
                                  <Box
                                    sx={{
                                      display: 'inline-block',
                                      width: '16px',
                                      height: '16px',
                                      bg: colorValue || 'primary',
                                      marginRight: '8px',
                                      verticalAlign: 'middle',
                                      borderRadius: '4px',
                                    }}
                                  />
                                  <Box>
                                    <Text
                                      // variant="caps"
                                      sx={{
                                        display: 'block',
                                        color: 'gray.1000',
                                        fontSize: 'xxs',
                                        mb: 0,
                                      }}>
                                      {colorName}
                                    </Text>
                                    <Text
                                      sx={{
                                        fontSize: 'xs',
                                        display: 'block',
                                        mt: 0,
                                        lineHeight: 1,
                                      }}>
                                      {colorValue}
                                    </Text>
                                  </Box>
                                </Flex>
                              ))}
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                      <Text as="p" sx={{ my: 2, fontSize: 'sm' }}>
                        Fonts
                      </Text>
                      <Box sx={{ fontSize: 'sm' }}>
                        <Box
                          as="ul"
                          style={{
                            listStyle: 'none',
                            paddingLeft: 0,
                          }}>
                          {assets[0]?.wraft_json?.theme?.fonts?.map(
                            (font: any) => (
                              <Box
                                as="li"
                                sx={{
                                  ml: 0,
                                  pl: 0,
                                  px: 2,
                                  py: 1,
                                  border: 'solid 1px',
                                  borderColor: 'gray.400',
                                  borderBottom: 0,
                                  ':last-child': {
                                    borderBottom: 'solid 1px',
                                    borderColor: 'gray.400',
                                  },
                                }}
                                key={font.fontName}>
                                <Flex sx={{ alignItems: 'center' }}>
                                  <TextT
                                    size={14}
                                    weight="thin"
                                    style={{ marginRight: '6px' }}
                                  />
                                  <Text variant="pM">{font.fontName}</Text>
                                </Flex>
                              </Box>
                            ),
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Accordion>
                </Box>

                {/* <Box sx={{ mt: 3 }}>
                  <Box
                    as="details"
                    sx={{
                      // mb: 2,
                      '& summary': {
                        cursor: 'pointer',
                        p: 2,
                        // bg: 'neutral.100',
                        // borderRadius: '4px',
                        bg: 'neutral.100',
                        border: 'solid 1px #ddd',
                        borderBottom: 0,
                      },
                    }}>
                    <Box as="summary">
                      <Text sx={{ fontSize: 'sm', fontWeight: 500 }}>
                        Theme
                      </Text>
                    </Box>
                  </Box>
                </Box> */}
              </Box>
            </Box>
          </Box>

          {/* <Box x="frame">
            <Box x="flex">
              <Text variant="pB" sx={{ width: '6rem', color: 'green.900' }}>
                Theme
              </Text>
              <Text as="p" variant="pR" sx={{ mt: 0, ml: 3 }}>
                Standard Tempalte from
              </Text>
            </Box>
          </Box> */}
        </Box>
      </Box>
    </Box>
  );
};

export default TemplatePreview;
