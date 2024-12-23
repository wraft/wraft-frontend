import { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Drawer, DrawerOptions, useDrawer } from "./index";

export default {
  title: "Components/Drawer",
  component: Drawer,
  decorators: [
    (Story) => (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    placement: {
      control: {
        type: "select",
      },
      options: ["top", "right", "bottom", "left"],
      description: "Position of the drawer",
      defaultValue: "right",
    },
    withBackdrop: {
      control: {
        type: "boolean",
      },
      description: "Show backdrop behind drawer",
      defaultValue: true,
    },
    hideOnInteractOutside: {
      control: {
        type: "boolean",
      },
      description: "Close drawer when clicking outside",
      defaultValue: true,
    },
  },
  tags: ["autodocs"],
} as Meta<DrawerOptions>;

// Helper component to handle drawer state
const DrawerDemo: React.FC<Partial<DrawerOptions>> = ({
  placement = "right",
  withBackdrop = true,
  hideOnInteractOutside = true,
}) => {
  const dialog = useDrawer();

  return (
    <>
      <button onClick={dialog.show}>Open Drawer</button>
      <Drawer
        store={dialog}
        placement={placement as DrawerOptions["placement"]}
        withBackdrop={withBackdrop}
        hideOnInteractOutside={hideOnInteractOutside}
      >
        <Drawer.Header>
          <Drawer.Title>Drawer Title</Drawer.Title>
          <button onClick={dialog.hide}>✕</button>
        </Drawer.Header>
        <div className="p-8">
          <h4 className="mb-4 text-lg font-medium">Drawer Content</h4>
          <p>This is the content of the drawer. You can put anything here.</p>
        </div>
      </Drawer>
    </>
  );
};

export const Default: StoryObj<DrawerOptions> = {
  render: () => <DrawerDemo />,
};

export const LeftPlacement: StoryObj<DrawerOptions> = {
  render: () => <DrawerDemo placement="left" />,
};

// export const TopPlacement: StoryObj<DrawerOptions> = {
//   render: () => <DrawerDemo placement="top" />
// };

// export const BottomPlacement: StoryObj<DrawerOptions> = {
//   render: () => <DrawerDemo placement="bottom" />
// };
