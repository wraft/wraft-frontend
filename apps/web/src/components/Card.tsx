import React, { useState } from 'react';
import { MenuProvider, Menu, MenuItem, MenuButton } from '@ariakit/react';
import { Box, Flex, Text, Button } from 'theme-ui';
import { EllipsisVIcon } from '@wraft/icon';

import { Drawer } from './common/Drawer';
import LayoutForm from './LayoutForm';

/**
 * Page Heading Section
 */

interface HeadingFrameProps {
  title?: string;
  side?: any;
}

interface IItemField {
  id?: string;
  name?: string;
  color?: string;
  decription?: string;
  onDelete?: any;
  model?: string;
  screenshot?: string;
  prefix?: string;
}

const LayoutCard = ({
  id,
  name,
  // model = 'content-types',
  // prefix,
  decription,
  screenshot,
  onDelete,
}: IItemField) => {
  // const menu = useMenuState();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Box variant="layout.m" sx={{ mb: 4, mr: 3, minWidth: '20ch' }}>
      <Box
        sx={{
          position: 'relative',
          border: 'solid 1px',
          bg: 'transparent',
          borderColor: 'border',
          borderRadius: 4,
        }}>
        <Box sx={{ pt: 0, pr: 0 }}>
          <Box
            sx={{
              height: '60px',
              backgroundImage: `url(${screenshot})`,
              bg: 'gray.300',
              width: '100%',
            }}>
            <Box
              sx={{
                position: 'absolute',
                textAlign: 'right',
                right: 2,
                top: 0,
              }}>
              <MenuProvider>
                <MenuButton
                  as={Button}
                  sx={{
                    border: 'solid 1px',
                    color: 'text-primary',
                    borderColor: 'border',
                    p: 1,
                    bg: 'neutral.200',
                    // pb: 1,
                    mt: 2,
                  }}>
                  <EllipsisVIcon width={24} height={16} />
                </MenuButton>
                <Menu
                  as={Box}
                  aria-label="Example"
                  sx={{
                    top: '-36px',
                    left: '0px',
                    border: 'solid 1px',
                    borderColor: 'border',
                    borderRadius: 4,
                    bg: 'white',
                    color: 'text-primary',
                    zIndex: 20,
                  }}>
                  <MenuItem
                    as={Button}
                    variant="buttons.base"
                    sx={{
                      py: 1,
                      color: 'red.800',
                      px: 3,
                    }}
                    onClick={() => {
                      onDelete(id);
                    }}>
                    Delete
                  </MenuItem>
                  <MenuItem as={Box} sx={{ width: '100%', px: 3, py: 1 }}>
                    <Button
                      variant="base"
                      onClick={() => {
                        setIsOpen(true);
                      }}>
                      <Text
                        sx={{
                          fontSize: 'base',
                          fontWeight: 500,
                          color: 'text-primary',
                        }}>
                        Edit
                      </Text>
                    </Button>
                  </MenuItem>
                </Menu>
              </MenuProvider>
              <Drawer open={isOpen} setOpen={setIsOpen}>
                <LayoutForm setOpen={setIsOpen} cId={id} />
              </Drawer>
            </Box>
          </Box>
          <Box sx={{ p: 3 }}>
            <Text
              sx={{
                fontSize: 'base',
                fontWeight: 500,
                color: 'text-secondary',
              }}>
              {name}
            </Text>
          </Box>
        </Box>
        <Text sx={{ fontSize: 0 }} color="gray.6">
          {decription}
        </Text>
      </Box>
    </Box>
  );
};

export const HeadingFrame = ({ title, side }: HeadingFrameProps) => (
  <Box variant="layout.frameHeading">
    <Flex>
      <Text variant="pageheading">{title}</Text>
      <Box sx={{ ml: 'auto', mr: 0, pt: 2 }}>
        {side && <Box sx={{ pt: 0 }}>{side}</Box>}
      </Box>
    </Flex>
  </Box>
);

export default LayoutCard;
