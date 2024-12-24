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

// Basic spinner stories
export const Default: Story = {
  args: {
    size: 12,
  },
};

// Button with spinner examples
export const ButtonLoading: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <Button variant="primary" loading>
        Loading...
      </Button>

      <Button variant="primary">Not Loading</Button>
    </div>
  ),
};

// Interactive loading state example
export const InteractiveButtonLoading: Story = {
  render: () => {
    return (
      <div style={{ display: "flex", gap: "20px" }}>
        <Button variant="primary" loading>
          Submit
        </Button>
        <Button variant="secondary" loading>
          Cancel
        </Button>
      </div>
    );
  },
};
