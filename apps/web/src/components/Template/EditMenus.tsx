import Router from 'next/router';
import { DropdownMenu, Flex, Text } from '@wraft/ui';
import toast from 'react-hot-toast';
import { DotsThreeVertical, TrashSimple } from '@phosphor-icons/react';

import { deleteAPI } from 'utils/models';

interface IconMenuItemProps {
  icon: any;
  text: string;
}
const IconMenuItem = ({ icon, text }: IconMenuItemProps) => {
  return (
    <Flex align="center" gap="sm">
      {icon}
      {text && <Text>{text}</Text>}
    </Flex>
  );
};

interface EditMenuProps {
  id: string;
}

const EditMenus = ({ id }: EditMenuProps) => {
  const onDeleteTemplate = (contentId: string) => {
    deleteAPI(`data_templates/${contentId}`).then(() => {
      toast.success('Deleted the Template', {
        duration: 1000,
        position: 'top-right',
      });

      Router.push('/templates');
    });
  };
  return (
    <DropdownMenu.Provider>
      <DropdownMenu.Trigger>
        <DotsThreeVertical size={18} weight="bold" />
      </DropdownMenu.Trigger>

      <DropdownMenu aria-label="dropdown role">
        <DropdownMenu.Item onClick={() => onDeleteTemplate(id)}>
          <IconMenuItem text="Delete" icon={<TrashSimple />} />
        </DropdownMenu.Item>
      </DropdownMenu>
    </DropdownMenu.Provider>
  );
};

export default EditMenus;
