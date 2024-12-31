import React, { useState } from 'react';
import Router from 'next/router';
import { Menu, MenuButton, MenuItem, MenuProvider } from '@ariakit/react';
import toast from 'react-hot-toast';
import { Text, Box, Flex, Button } from 'theme-ui';
import { DotsThreeVertical } from '@phosphor-icons/react';

import EmailComposer from 'components/EmailComposer';
import Modal from 'common/Modal';
import ConfirmDelete from 'common/ConfirmDelete';
import { deleteAPI } from 'utils/models';
import { ContentInstance } from 'utils/types/content';

interface EditMenuProps {
  id: string;
  nextState: any;
}
/**
 * Context Menu for Delete, Edit
 * @param param0
 * @returns
 */
export const EditMenus = ({ id, nextState }: EditMenuProps) => {
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isMailPopupOpen, setMailPopupOpen] = useState<boolean>(false);
  /**
   * Delete content
   * @param id
   */
  const deleteContent = (contentId: string) => {
    deleteAPI(`contents/${contentId}`).then(() => {
      toast.success('Deleted a content', {
        duration: 1000,
        position: 'top-right',
      });
      Router.push('/contents');
    });
  };
  return (
    <>
      <MenuProvider>
        <MenuButton
          as={Button}
          variant="btnIcon"
          sx={{ display: 'flex', p: 2 }}>
          <DotsThreeVertical weight="bold" size={16} />
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
          {nextState && nextState.is_user_eligible && (
            <MenuItem
              as={Box}
              onClick={() => Router.push(`/content/edit/${id}`)}
              sx={{ px: 3, py: 2, cursor: 'pointer' }}>
              Edit
            </MenuItem>
          )}
          <MenuItem
            as={Box}
            onClick={() => setIsDelete(true)}
            sx={{ px: 3, py: 2, cursor: 'pointer', color: 'red.700' }}>
            Delete
          </MenuItem>

          <MenuItem
            as={Box}
            onClick={() => setMailPopupOpen(true)}
            sx={{ px: 3, py: 2, cursor: 'pointer' }}>
            Send Mail
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

      <Modal isOpen={isMailPopupOpen}>
        <EmailComposer id={id} setOpen={setMailPopupOpen} />
      </Modal>
    </>
  );
};

/**
 * Content Sidebar Element
 * @content ContentInstance from `get contents/[id]`
 */
interface ContentSidebarProps {
  content: ContentInstance;
  nextState?: any;
  contentType?: any;
}

export const ContentSidebar = ({
  content,
  nextState,
  contentType,
}: ContentSidebarProps) => (
  <Flex sx={{ px: 3, py: 1 }}>
    <Flex>
      <Box sx={{ mr: 3 }}>
        <Text
          as="h6"
          sx={{ color: 'gray.900', fontSize: 'xs', fontWeight: 400 }}>
          {contentType?.layout?.name} / {contentType?.name}
        </Text>
        <Flex>
          <Text
            as="h3"
            sx={{
              fontWeight: 'heading',
              fontSize: 'sm',
              lineHeight: '24px',
            }}>
            {content?.content?.instance_id || contentType?.prefix}
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
                fontSize: 'xs',
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
        alignItems: 'baseline',
        gap: 1,
      }}>
      <EditMenus id={content?.content?.id} nextState={nextState} />
    </Flex>
  </Flex>
);
