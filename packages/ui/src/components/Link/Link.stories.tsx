import type { Meta, StoryObj } from "@storybook/react";
import { HomeIcon, ArrowRightIcon } from "@wraft/icon";
import { padding } from "@xstyled/emotion";

import { Link } from "./index";

const meta: Meta<typeof Link> = {
  title: "Action/Link",
  component: Link,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
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
      control: "radio",
      options: ["link", "button"],
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Link>;

const Template: Story = {
  args: {
    type: "link",
  },
};

export const SimpleLink: Story = {
  ...Template,
  args: {
    ...Template.args,
    children: "Click here to learn  more",
    variant: "outlined",
    type: "link",
  },
};

export const ButtonLink: Story = {
  ...Template,
  args: {
    ...Template.args,
    children: (
      <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        Get Started
        <ArrowRightIcon />
      </span>
    ),
    variant: "outlined",
    type: "button",
    size: "md",
  },
};

export const IconLink: Story = {
  ...Template,
  args: {
    ...Template.args,
    children: (
      <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <HomeIcon />
        View Documentation
      </span>
    ),
    variant: "outlined",
    type: "link",
    size: "sm",
  },
};

export const DisabledLink: Story = {
  ...Template,
  args: {
    ...Template.args,
    children: "Not Available",
    variant: "disabled",
    type: "link",
    disabled: true,
  },
};

export const LinkVariant: Story = {
  args: {
    type: "link",
  },
  decorators: [
    (Story, context) => (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Link {...context.args} variant="outlined" type="link">
          Outlined Link
        </Link>
        <Link {...context.args} variant="primary" type="button">
          Primary Button Link
        </Link>
        <Link {...context.args} variant="secondary" type="link">
          Secondary Link
        </Link>
      </div>
    ),
  ],
};
