import type { Meta, StoryObj } from "@storybook/react";

import { Button } from ".";

const meta: Meta<typeof Button> = {
  component: Button,
  title: "Action/Button",
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outlined"],
    },
  },
  parameters: {
    // Add parameters for Storybook to handle component documentation and behavior.
    docs: {
      description: {
        component:
          "Use the `Button` component to render buttons with different styles and behaviors.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  render: (args) => <Button {...args}>{args.children}</Button>,
  args: {
    children: "Primary Button",
    variant: "primary",
  },
  parameters: {
    docs: {
      storyDescription:
        "A primary button used for main actions in forms and dialogs.",
    },
  },
};

export const Secondary: Story = {
  render: (args) => <Button {...args}>{args.children}</Button>,
  args: {
    children: "Secondary Button",
    variant: "secondary",
  },
};

export const Outlined: Story = {
  render: (args) => <Button {...args}>{args.children}</Button>,
  args: {
    children: "Outlined Button",
    variant: "outlined",
  },
};
