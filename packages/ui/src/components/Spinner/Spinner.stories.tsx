import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "../Button";

import { Spinner } from "./index";

const meta: Meta<typeof Spinner> = {
  title: "Layout/Spinner",
  component: Spinner,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#333333" },
        { name: "light", value: "#ffffff" },
      ],
    },
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

export const Default: Story = {
  decorators: [
    (Story) => (
      <div style={{ padding: "20px" }}>
        <Spinner size={12} />
      </div>
    ),
  ],
};

export const Large: Story = {
  decorators: [
    (Story) => (
      <div style={{ padding: "20px" }}>
        <Spinner size={24} />
      </div>
    ),
  ],
};

export const Small: Story = {
  decorators: [
    (Story) => (
      <div style={{ padding: "20px" }}>
        <Spinner size={8} />
      </div>
    ),
  ],
};

export const SpinnerSizes: Story = {
  decorators: [
    (Story) => (
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
          padding: "20px",
          background: "#333333",
          borderRadius: "8px",
        }}
      >
        <div>
          <Spinner size={8} />
          <div style={{ color: "white", fontSize: "12px", marginTop: "8px" }}>
            8px
          </div>
        </div>
        <div>
          <Spinner size={12} />
          <div style={{ color: "white", fontSize: "12px", marginTop: "8px" }}>
            12px
          </div>
        </div>
        <div>
          <Spinner size={24} />
          <div style={{ color: "white", fontSize: "12px", marginTop: "8px" }}>
            24px
          </div>
        </div>
        <div>
          <Spinner size={36} />
          <div style={{ color: "white", fontSize: "12px", marginTop: "8px" }}>
            36px
          </div>
        </div>
      </div>
    ),
  ],
};

export const ButtonWithSpinner: Story = {
  decorators: [
    (Story) => (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          padding: "20px",
        }}
      >
        <Button variant="primary" loading>
          Loading Button
        </Button>
      </div>
    ),
  ],
};

export const CustomBackground: Story = {
  decorators: [
    (Story) => (
      <div
        style={{
          padding: "20px",
          background: "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
          borderRadius: "8px",
          display: "flex",
          gap: "20px",
        }}
      >
        <Spinner size={24} />
      </div>
    ),
  ],
};
