import React from 'react';
import { Box, Flex, Text } from '@wraft/ui';
import { CheckIcon, FileIcon, TrashIcon, XIcon } from '@phosphor-icons/react';

import ProgressBar from 'common/ProgressBar';

type Props = {
  assets: any[];
  onDelete?: (e: any) => void;
};

const FontList = ({ assets, onDelete }: Props) => {
  return (
    assets &&
    assets.length > 0 && (
      <Box border="solid 1px" borderColor="border" borderRadius="xs">
        {assets.map((item: any, index: number) => (
          <Flex
            key={item.id}
            py="md"
            px="md"
            alignItems="center"
            justifyContent="space-between"
            borderBottom={index < assets.length - 1 ? '1px solid' : 'none'}
            borderColor="border">
            <Flex alignItems="center" justifyContent="center" gap="sm">
              <FileIcon size="18" />
              <Text>
                {item.name ? item.name.match(/(.+?)(?=-|$)/)?.[1] : 'Font'}
              </Text>
            </Flex>
            <Flex
              alignItems="center"
              justifyContent="space-between"
              textTransform="uppercase">
              {item.progress ? (
                <Flex justifyContent="center" alignItems="center">
                  <ProgressBar progress={item.progress} />
                </Flex>
              ) : (
                <>
                  <Text color="text-secondary" mr="md" fontSize="sm">
                    {item.name.match(/-(.+?)(?=\.[^.]*$|$)/)?.[1] ?? 'N/A'}
                  </Text>
                  {item.success === true ? (
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bg="green.800"
                      borderRadius="44px"
                      w="16px"
                      h="16px">
                      <CheckIcon size="12" color="#fff" />
                    </Box>
                  ) : item.success === false ? (
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bg="red.700"
                      borderRadius="44px"
                      color="#fff"
                      w="16px"
                      h="16px">
                      <XIcon size="12" />
                    </Box>
                  ) : (
                    <Box display="none" />
                  )}
                  {onDelete && (
                    <TrashIcon
                      size="16"
                      color="#2C3641"
                      cursor="pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        onDelete(item.id);
                      }}
                    />
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
