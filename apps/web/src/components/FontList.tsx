import React from 'react';

import { CloseIcon, DeleteIcon, DocumentIcon, TickIcon } from '@wraft/icon';
import ProgressBar from '@wraft-ui/ProgressBar';
import { Box, Button, Flex, Text, useThemeUI } from 'theme-ui';

type Props = {
  assets: any[];
  onDelete?: (e: any) => void;
};

const FontList = ({ assets, onDelete }: Props) => {
  const themeui = useThemeUI();
  return (
    assets &&
    assets.length > 0 && (
      <Box
        sx={{
          borderRadius: '6px',
          overflow: 'hidden',
          border: 'solid 1px',
          borderColor: 'neutral.200',
        }}>
        {assets.map((item: any, index: number) => (
          <Flex
            key={item.id}
            sx={{
              py: 2,
              px: 3,
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: index < assets.length ? '1px solid' : 'none',
              borderColor: 'neutral.200',
            }}>
            <Flex sx={{ alignItems: 'center' }}>
              <Box
                mr={2}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <DocumentIcon
                  viewBox="0 0 24 24"
                  color={themeui?.theme?.colors?.gray?.[200] || '#2C3641'}
                />
              </Box>
              <Text as="p" variant="pM">
                {item.name.match(/(.+?)(?=-|$)/)?.[1]}
              </Text>
            </Flex>
            <Flex
              sx={{
                alignItems: 'center',
                width: '100px',
                justifyContent: 'space-between',
                textTransform: 'uppercase',
              }}>
              {item.progress ? (
                <ProgressBar progress={item.progress} />
              ) : (
                <>
                  <Text variant="capM" sx={{ color: 'gray.400' }}>
                    {item.name.match(/-(.+?)(?=\.[^.]*$|$)/)[1]}
                  </Text>
                  {item.success === true ? (
                    <Box
                      sx={{
                        height: '16px',
                        width: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bg: 'green.700',
                        borderRadius: '44px',
                      }}>
                      <TickIcon
                        color={themeui?.theme?.colors?.white as string}
                        height={12}
                        width={12}
                        viewBox="0 0 24 24"
                      />
                    </Box>
                  ) : item.success === false ? (
                    <Box
                      sx={{
                        height: '16px',
                        width: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bg: 'red.700',
                        borderRadius: '44px',
                      }}>
                      <CloseIcon
                        color={themeui?.theme?.colors?.white as string}
                        height={12}
                        width={12}
                        viewBox="0 0 24 24"
                      />
                    </Box>
                  ) : (
                    <Box sx={{ display: 'none' }} />
                  )}
                  {onDelete && (
                    <Button
                      variant="base"
                      sx={{ p: 0, m: 0 }}
                      onClick={(e) => {
                        e.preventDefault();
                        onDelete(item.id);
                      }}>
                      <DeleteIcon
                        width={16}
                        height={16}
                        viewBox="0 0 24 24"
                        color={themeui?.theme?.colors?.gray?.[200] || '#2C3641'}
                      />
                    </Button>
                  )}
                </>
              )}
            </Flex>
          </Flex>
        ))}
      </Box>
    )
  );
};

export default FontList;
