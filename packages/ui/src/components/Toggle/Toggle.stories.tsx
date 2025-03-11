import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { Toggle } from "./index";

export default {
  title: "Components/Toggle",
  component: Toggle,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md"],
      defaultValue: "xs",
    },
    variant: {
      control: "select",
      options: ["error", "focused", "info", "success", "warning"],
      defaultValue: "focused",
    },
    disabled: {
      control: "boolean",
      defaultValue: false,
    },
  },
} as Meta<typeof Toggle>;

type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  args: {
    size: "md",
    variant: "focused",
    disabled: false,
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <Toggle size="xs" />
      <Toggle size="sm" />
      <Toggle size="md" />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <Toggle variant="error" defaultChecked />
      <Toggle variant="success" defaultChecked />
      <Toggle variant="warning" defaultChecked />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <Toggle disabled />
      <Toggle disabled defaultChecked />
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);

    return (
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <Toggle
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <span>Toggle is {checked ? "ON" : "OFF"}</span>
      </div>
    );
  },
};
