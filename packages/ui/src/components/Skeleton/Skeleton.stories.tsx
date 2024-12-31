import type { Meta, StoryObj } from "@storybook/react";

import { Skeleton } from ".";

interface SkeletonProps {
  width?: string;
  height: string;
}

const meta: Meta<SkeletonProps> = {
  title: "Layout/Skeleton",
  component: Skeleton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    width: {
      control: "text",
      description: "Width of the skeleton (default: 100%)",
      table: {
        defaultValue: { summary: "100%" },
      },
    },
    height: {
      control: "text",
      description: "Height of the skeleton (default: 4px)",
      table: {
        defaultValue: { summary: "4px" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<SkeletonProps>;

// Basic examples
export const Default: Story = {
  args: {
    width: "200px",
    height: "20px",
  },
};

export const Thin: Story = {
  args: {
    width: "300px",
    height: "4px",
  },
};

export const Square: Story = {
  args: {
    width: "100px",
    height: "100px",
  },
};

export const TextBlock = {
  decorators: [
    () => (
      <div
        style={{
          width: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <Skeleton width="100%" height="24px" />
        <Skeleton width="90%" height="24px" />
        <Skeleton width="95%" height="24px" />
      </div>
    ),
  ],
} satisfies Story;
