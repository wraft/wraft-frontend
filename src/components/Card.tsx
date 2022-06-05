import React from 'react';
import { Box, Flex, Text, Button } from 'theme-ui';

import Link from './NavLink';
// import { API_HOST } from '../utils/models';

import {
  useMenuState,
  Menu,
  MenuItem,
  MenuButton,
  // MenuSeparator,
} from 'reakit/Menu';

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

import { DotsVerticalRounded } from '@styled-icons/boxicons-regular/DotsVerticalRounded';

const LayoutCard = ({
  id,
  name,
  model = 'content-types',
  // prefix,
  decription,
  screenshot,
  onDelete,
}: IItemField) => {
  const menu = useMenuState();

  return (
    <Box variant="layout.m" sx={{ mb: 4, mr: 3, minWidth: '20ch' }}>
      <Box
        sx={{
          position: 'relative',
          border: 'solid 1px',
          bg: 'gray.0',
          borderColor: 'gray.3',
          borderRadius: 4,
          // height: '100px',
          // p: 3,
          // overflow: 'hidden',
        }}>
        <Box sx={{ pt: 0, pr: 0 }}>
          <Box
            sx={{
              height: '60px',
              backgroundImage: `url(${screenshot})`,
              bg: 'gray.2',
              width: '100%',
            }}>
            <Box
              sx={{
                position: 'absolute',
                textAlign: 'right',
                right: 2,
                top: 0,
              }}>
              {/* <Box as={MenuButton}> */}
              <MenuButton
                as={Button}
                {...menu}
                sx={{
                  border: 'solid 1px',
                  color: 'gray.6',
                  borderColor: 'gray.2',
                  p: 0,
                  bg: 'gray.0',
                  pb: 1,
                  mt: 2,
                }}>
                <DotsVerticalRounded width="16px" />
              </MenuButton>
              <Menu
                as={Box}
                {...menu}
                aria-label="Example"
                sx={{
                  border: 'solid 1px',
                  borderColor: 'gray.1',
                  borderRadius: 4,
                  bg: 'gray.0',
                  color: 'gray.9',
                }}>
                <MenuItem
                  as={Button}
                  sx={{
                    p: 0,
                    color: 'red.7',
                    bg: 'gray.0',
                    px: 3,
                    borderBottom: 'solid 1px',
                    borderColor: 'gray.1',
                  }}
                  {...menu}
                  onClick={() => {
                    onDelete(id);
                  }}>
                  Delete
                </MenuItem>
                <MenuItem {...menu} as={Box} sx={{ width: '100%', px: 3 }}>
                  <Link
                    href={`/manage/${model}/edit/[id]`}
                    path={`/manage/${model}/edit/${id}`}>
                    <Text sx={{ fontSize: 0, fontWeight: 500 }}>Edit</Text>
                  </Link>
                </MenuItem>
              </Menu>
            </Box>
          </Box>
          <Box sx={{ p: 3 }}>
            <Link href={`/manage/${model}/[id]`} path={`/${model}/${id}`}>
              <Text sx={{ fontSize: 1, fontWeight: 500 }}>{name}</Text>
            </Link>
          </Box>
        </Box>
        <Text sx={{ fontSize: 0 }} color="gray.6">
          {decription}
        </Text>
      </Box>
    </Box>
  );
};

/**
 * Page Heading Section
 */

interface HeadingFrameProps {
  title?: string;
  side?: any;
}

export const HeadingFrame = ({ title, side }: HeadingFrameProps) => (
  <Box variant="layout.frameHeading">
    <Flex>
      <Text variant="pageheading">{title}</Text>
      <Box sx={{ ml: 'auto', mr: 5 }}>{side && <Box>{side}</Box>}</Box>
    </Flex>
  </Box>
);

export default LayoutCard;
