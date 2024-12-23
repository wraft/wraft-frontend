import type { Meta, StoryObj } from "@storybook/react";

import { Link } from "./index";

const meta: Meta<typeof Link> = {
  title: "Components/Link",
  component: Link,
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "outlined", "disabled", "googleLogin"],
    },
    size: {
      control: { type: "select" },
      options: ["xxs", "xs", "sm", "md", "lg", "full"],
    },
    type: {
      control: { type: "select" },
      options: ["link", "button"],
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Link>;

export const Primary: Story = {
  args: {
    children: "Primary Link",
    variant: "primary",
    type: "link",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary Link",
    variant: "secondary",
    type: "link",
  },
};

export const Outlined: Story = {
  args: {
    children: "Outlined Link",
    variant: "outlined",
    type: "link",
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled Link",
    variant: "disabled",
    type: "link",
    disabled: true,
  },
};

export const GoogleLogin: Story = {
  args: {
    children: "Google Login",
    variant: "googleLogin",
    type: "button",
  },
};
