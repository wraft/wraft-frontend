import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import ErrorBoundary from ".";

// Mock component to simulate an error
const ErrorThrowingComponent = () => {
  throw new Error("This is a test error.");
};

// Mock children to show normal rendering
const NormalComponent = () => <div>Everything is working fine!</div>;

const meta: Meta<typeof ErrorBoundary> = {
  title: "Components/ErrorBoundary",
  component: ErrorBoundary,
  argTypes: {
    message: {
      control: "text",
      defaultValue: "Something went wrong.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ErrorBoundary>;

export const Default: Story = {
  render: (args) => (
    <ErrorBoundary {...args}>
      <NormalComponent />
    </ErrorBoundary>
  ),
};

export const WithError: Story = {
  render: (args) => (
    <ErrorBoundary {...args}>
      <ErrorThrowingComponent />
    </ErrorBoundary>
  ),
};
