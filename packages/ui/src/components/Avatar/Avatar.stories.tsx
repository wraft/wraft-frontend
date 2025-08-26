import { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Box } from "../Box";
import { Flex } from "../Flex";

import { Avatar } from ".";

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl", "xxl"],
      defaultValue: "md",
    },
    shape: {
      control: "radio",
      options: ["circle", "square"],
      defaultValue: "circle",
    },
    backgroundColor: {
      control: "color",
    },
    color: {
      control: "color",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    src: "https://i.pravatar.cc/300",
    alt: "User avatar",
    size: "md",
  },
};

export const WithInitials: Story = {
  args: {
    name: "John Doe",
    size: "md",
  },
};

export const Square: Story = {
  args: {
    name: "John Doe",
    shape: "square",
    size: "md",
  },
};

export const CustomColors: Story = {
  args: {
    name: "John Doe",
    backgroundColor: "#6366F1",
    color: "#ffffff",
    size: "md",
  },
};

export const Sizes: Story = {
  render: () => (
    <Flex alignItems="flex-end" gap="md">
      <Avatar name="XS" size="xs" />
      <Avatar name="SM" size="sm" />
      <Avatar name="MD" size="md" />
      <Avatar name="LG" size="lg" />
      <Avatar name="XL" size="xl" />
      <Avatar name="XXL" size="xxl" />
      <Avatar name="Custom" size={100} />
    </Flex>
  ),
};

export const WithImage: Story = {
  render: () => (
    <Flex alignItems="flex-end" gap="md">
      <Avatar src="https://i.pravatar.cc/300?img=1" size="xs" />
      <Avatar src="https://i.pravatar.cc/300?img=2" size="sm" />
      <Avatar src="https://i.pravatar.cc/300?img=3" size="md" />
      <Avatar src="https://i.pravatar.cc/300?img=4" size="lg" />
      <Avatar src="https://i.pravatar.cc/300?img=5" size="xl" />
      <Avatar src="https://i.pravatar.cc/300?img=6" size="xxl" />
    </Flex>
  ),
};

export const FallbackBehavior: Story = {
  render: () => (
    <Box>
      <Flex alignItems="center" gap="md" mb="md">
        <Avatar src="https://i.pravatar.cc/300" name="John Doe" size="md" />
        <Box>Valid image with fallback name</Box>
      </Flex>
      <Flex alignItems="center" gap="md">
        <Avatar
          src="https://invalid-image-url.com/avatar.png"
          name="Jane Smith"
          size="md"
        />
        <Box>Invalid image showing initials</Box>
      </Flex>
    </Box>
  ),
};
