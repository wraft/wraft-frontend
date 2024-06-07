import React, { useState } from 'react';
import Router from 'next/router';
import {
  Focusable,
  Menu,
  MenuButton,
  MenuItem,
  MenuProvider,
} from '@ariakit/react';
import toast from 'react-hot-toast';
import { Text, Box, Flex, Button } from 'theme-ui';
import { Check, DotsThreeVertical, Share } from '@phosphor-icons/react';

import { SendIcon, ThreeDots, BackArrowIcon } from 'components/Icons';
import Modal from 'components/Modal';
import { deleteAPI } from 'utils/models';
import { FlowStateBlockProps, ContentInstance } from 'utils/types/content';

import { ConfirmDelete } from '..';

/**
 * Atom Component to show Flow State
 * @TODO move to atoms or ui
 * @param param0
 * @returns
 */
export const FlowStateBlock = ({
  state,
  activeFlow,
  id,
}: FlowStateBlockProps) => {
  const isCurrent = activeFlow && activeFlow.state.id === id ? true : false;
  return (
    <Flex
      as={Focusable}
      sx={{
        alignItems: 'center',
        ':last-child': {
          '.arrowicon': {
            display: 'none',
          },
          minWidth: 'fit-content',
        },
      }}>
      <Box
        sx={{
          fontSize: 'xxs',
          width: '18px',
          height: '18px',
          borderRadius: '9rem',
          bg: isCurrent ? 'green.500' : 'gray.500',
          textAlign: 'center',
          mr: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          p: 1,
        }}>
        <Check size={16} />
      </Box>
      <Text sx={{ fontSize: 'xs', textTransform: 'capitalize' }}>{state}</Text>
      <Box
        sx={{
          paddingLeft: 1,
          paddingRight: 0,
        }}>
        <BackArrowIcon className="arrowicon" width={20} size={20} stroke={1} />
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
  const [isDelete, setIsDelete] = useState<boolean>(false);
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
      Router.push('/contents');
    });
  };
  return (
    <MenuProvider>
      <MenuButton as={Button} variant="base">
        <DotsThreeVertical size={20} />
      </MenuButton>
      <Menu
        as={Box}
        aria-label="Manage Content"
        sx={{
          border: 'solid 1px',
          borderColor: 'border',
          borderRadius: 4,
          bg: 'gray.100',
          color: 'gray.900',
        }}>
        <MenuItem
          as={Box}
          onClick={() => setIsDelete(true)}
          sx={{ px: 3, py: 2, cursor: 'pointer', color: 'red.700' }}>
          Delete
        </MenuItem>
      </Menu>
      <Modal isOpen={isDelete} onClose={() => setIsDelete(false)}>
        <ConfirmDelete
          onConfirmDelete={() => deleteContent(id)}
          setOpen={setIsDelete}
          title="Delete Document"
          text={`Are you sure you want to delete this document ?`}
        />
      </Modal>
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
  <Flex sx={{ px: 3, py: 1 }}>
    <Flex sx={{ width: '70%' }}>
      <Box sx={{ mr: 3 }}>
        <Text as="h6" sx={{ color: 'gray.900', fontSize: 'xs', fontWeight: 400 }}>
          {content.content_type?.layout?.name} / {content.content_type?.name}
        </Text>
        <Flex>
          <Text
            as="h3"
            sx={{
              fontWeight: 'heading',
              fontSize: 'sm',
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
                bg: 'gray.500',
                ml: 2,
                color: 'text',
                px: 1,
                py: 0,
                borderRadius: '3px',
                letterSpacing: '0.2px',
                textTransform: 'uppercase',
                fontSize: 'xxs',
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
      <Share size={20} />
      <EditMenus id={content?.content?.id} />
    </Flex>
  </Flex>
);

export default ContentSidebar;
