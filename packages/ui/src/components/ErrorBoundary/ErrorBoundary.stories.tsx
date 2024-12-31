import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import ErrorBoundary from ".";

interface ErrorBoundaryComponentProps {
  children: React.ReactNode;
  message?: string;
}

const ErrorThrowingComponent = () => {
  throw new Error("This is a test error.");
};

const NormalComponent = () => <div>Everything is working fine!</div>;

const meta: Meta<ErrorBoundaryComponentProps> = {
  title: "Layout/ErrorBoundary",
  component: ErrorBoundary,
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: false,
    },
    message: {
      control: { type: "text" },
      description: "Custom error message to display",
    },
  },
};

export default meta;

type Story = StoryObj<ErrorBoundaryComponentProps>;

export const Default: Story = {
  render: (args) => (
    <ErrorBoundary {...args}>
      <NormalComponent />
    </ErrorBoundary>
  ),
  args: {
    message: "Something went wrong.",
  },
};

export const WithError: Story = {
  render: (args) => (
    <ErrorBoundary {...args}>
      <ErrorThrowingComponent />
    </ErrorBoundary>
  ),
  args: {
    message: "Something went wrong.",
  },
};
