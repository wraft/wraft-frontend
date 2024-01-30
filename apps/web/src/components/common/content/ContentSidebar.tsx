import React from 'react';

import {
  Focusable,
  Menu,
  MenuButton,
  MenuItem,
  MenuProvider,
} from '@ariakit/react';
import toast from 'react-hot-toast';
import { Text, Box, Flex, Button } from 'theme-ui';

import { deleteAPI } from '../../../utils/models';
import {
  FlowStateBlockProps,
  ContentInstance,
} from '../../../utils/types/content';
import { SendIcon, ThreeDots, BackArrowIcon } from '../../Icons';
/**
 * Atom Component to show Flow State
 * @TODO move to atoms or ui
 * @param param0
 * @returns
 */
export const FlowStateBlock = ({
  state,
  order,
  activeFlow,
  id,
}: FlowStateBlockProps) => {
  const isCurrent = activeFlow && activeFlow.state.id === id ? true : false;
  return (
    <Flex
      as={Focusable}
      sx={{
        pb: 2,
        mr: 1,
        ':last-child': {
          svg: {
            display: 'none',
          },
        },
      }}>
      <Box
        sx={{
          mt: 2,
          fontSize: 0,
          width: '18px',
          height: '18px',
          color: isCurrent ? 'green.100' : 'green.500',
          borderRadius: '9rem',
          bg: isCurrent ? 'green.500' : 'green.100',
          textAlign: 'center',
          mr: 2,
          pt: '2px',
        }}>
        {order}
      </Box>
      <Text sx={{ fontSize: 1, pt: 2, textTransform: 'capitalize' }}>
        {state}
      </Text>
      <Box
        sx={{
          paddingLeft: 1,
          paddingRight: 0,
          paddingTop: 2,
        }}>
        <BackArrowIcon width={20} size={20} stroke={1} />
      </Box>
    </Flex>
  );
};

interface EditMenuProps {
  id: string;
}
/**
 * Context Menu for Delete, Edit
 * @param param0
 * @returns
 */
export const EditMenus = ({ id }: EditMenuProps) => {
  /**
   * Delete content
   * @param id
   */
  const deleteContent = (id: string) => {
    deleteAPI(`contents/${id}`).then(() => {
      toast.success('Deleted a content', {
        duration: 1000,
        position: 'top-right',
      });
    });
  };
  return (
    <MenuProvider>
      <MenuButton
        as={Button}
        sx={{
          border: 0,
          color: 'text',
          borderColor: 'border',
          p: 0,
          bg: 'neutral.100',
          pb: 1,
          mt: 0,
          ml: 1,
        }}>
        <ThreeDots width={24} />
      </MenuButton>
      <Menu
        as={Box}
        aria-label="Manage Content"
        sx={{
          border: 'solid 1px',
          borderColor: 'border',
          borderRadius: 4,
          bg: 'neutral.100',
          color: 'text',
        }}>
        <MenuItem onClick={() => deleteContent(id)}>Delete</MenuItem>
      </Menu>
    </MenuProvider>
  );
};

/**
 * Content Sidebar Element
 * @content ContentInstance from `get contents/[id]`
 */
interface ContentSidebarProps {
  content: ContentInstance;
}

const ContentSidebar = ({ content }: ContentSidebarProps) => (
  <Flex sx={{ px: 3 }}>
    <Flex sx={{ mb: 3, width: '70%' }}>
      <Box sx={{ mr: 3 }}>
        <Text as="h6" variant="labelcaps">
          {content.content_type?.layout?.name} / {content.content_type?.name}
        </Text>
        <Flex>
          <Text
            as="h3"
            sx={{
              fontWeight: 'heading',
              fontSize: 2,
              lineHeight: '24px',
            }}>
            {content.content?.instance_id}
          </Text>
          <Box>
            <Text
              as="span"
              sx={{
                display: 'inline-flex',
                fontWeight: 500,
                bg: 'gray.100',
                ml: 2,
                color: 'text',
                px: 1,
                py: 0,
                borderRadius: '3px',
                letterSpacing: '0.2px',
                textTransform: 'uppercase',
                fontSize: 0,
              }}>
              {content?.state?.state}
            </Text>
          </Box>
        </Flex>
      </Box>
    </Flex>
    <Flex
      sx={{
        ml: 'auto',
      }}>
      <SendIcon width={24} />
      <EditMenus id={content?.content.id} />
    </Flex>
  </Flex>
);

export default ContentSidebar;
