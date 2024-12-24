import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "../Button";

import { Spinner } from "./index";

const meta: Meta<typeof Spinner> = {
  title: "Components/Spinner",
  component: Spinner,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "number" },
      description: "Size of the spinner in pixels",
      defaultValue: 12,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

// Basic spinner variations using args
export const Default: Story = {
  args: {
    size: 12,
  },
};

export const Large: Story = {
  args: {
    size: 24,
  },
};

export const Small: Story = {
  args: {
    size: 8,
  },
};

// Required render for multiple components display
export const SpinnerSizes: Story = {
  decorators: [
    (Story) => (
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Spinner size={8} />
        <Spinner size={12} />
        <Spinner size={24} />
        <Spinner size={36} />
      </div>
    ),
  ],
};

// Example with button integrations
export const ButtonWithSpinner: Story = {
  decorators: [
    (Story) => (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Button variant="primary" loading>
          Loading Button
        </Button>
        <Button variant="primary">Normal Button</Button>
      </div>
    ),
  ],
};
