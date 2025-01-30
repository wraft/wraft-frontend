import React, { useState } from 'react';
import { Box, Flex, Text } from 'theme-ui';
import { ThreeDotIcon } from '@wraft/icon';
import { DropdownMenu } from '@wraft/ui';

import LayoutForm from 'components/Layout/LayoutForm';
import { Drawer } from 'common/Drawer';

/**
 *
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
              <DropdownMenu.Provider>
                <DropdownMenu.Trigger>
                  <ThreeDotIcon />
                </DropdownMenu.Trigger>
                <DropdownMenu aria-label="dropdown role">
                  <DropdownMenu.Item onClick={() => setIsOpen(true)}>
                    <Text>Edit</Text>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onClick={() => onDelete(id)}>
                    <Text>Delete</Text>
                  </DropdownMenu.Item>
                </DropdownMenu>
              </DropdownMenu.Provider>

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
