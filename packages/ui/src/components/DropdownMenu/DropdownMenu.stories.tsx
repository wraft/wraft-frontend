import type { Meta } from '@storybook/react';

import { DropdownMenu } from '.';

const meta: Meta<any> = {
  component: DropdownMenu,
  title: 'Compontent/DropdownMenu',
};
// export default {
// 	title: 'Components/DropdownMenu',
// 	component: DropdownMenu,
// }

export const Basic = () => (
  <DropdownMenu.Provider>
    <DropdownMenu.Trigger>menu</DropdownMenu.Trigger>
    <DropdownMenu aria-label="Switch Workspace">
      <DropdownMenu.Item>one</DropdownMenu.Item>
      <DropdownMenu.Item>two</DropdownMenu.Item>
      <DropdownMenu.Item>three</DropdownMenu.Item>
    </DropdownMenu>
  </DropdownMenu.Provider>
);

export default meta;
