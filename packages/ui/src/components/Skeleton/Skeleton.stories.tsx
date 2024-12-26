// Skeleton.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";

import { Skeleton } from ".";

const meta = {
  title: "Layout/Skeleton",
  component: Skeleton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    width: { control: "text" },
    height: { control: "text" },
    variant: {
      control: "select",
      options: ["pulse", "wave", "shimmer"],
    },
    rounded: { control: "boolean" },
    animate: { control: "boolean" },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: {
    width: "200px",
    height: "20px",
  },
};

export const CircleAvatar = {
  decorators: [
    () => <Skeleton width={50} height={50} rounded={true} variant="shimmer" />,
  ],
} satisfies Story;

export const ProductCard = {
  decorators: [
    () => (
      <div
        style={{
          width: "300px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          padding: "16px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <Skeleton height={200} variant="wave" />
        <Skeleton height={24} width="70%" />
        <Skeleton height={16} width="40%" />
        <Skeleton height={20} width="30%" />
        <div style={{ display: "flex", gap: "8px" }}>
          <Skeleton width={80} height={32} />
          <Skeleton width={32} height={32} rounded={true} />
        </div>
      </div>
    ),
  ],
} satisfies Story;

export const BlogPost = {
  decorators: [
    () => (
      <div
        style={{
          width: "600px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Skeleton width={40} height={40} rounded={true} />
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Skeleton width={120} height={16} />
            <Skeleton width={80} height={12} />
          </div>
        </div>
        <Skeleton height={300} />
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <Skeleton height={20} />
          <Skeleton height={20} width="95%" />
          <Skeleton height={20} width="90%" />
        </div>
      </div>
    ),
  ],
} satisfies Story;

export const CommentSection = {
  decorators: [
    () => (
      <div
        style={{
          width: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {[...Array(3)].map((_, i) => (
          <div key={i} style={{ display: "flex", gap: "12px" }}>
            <Skeleton width={32} height={32} rounded={true} />
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <Skeleton height={16} width="40%" />
              <Skeleton height={14} width="90%" />
              <Skeleton height={14} width="75%" />
            </div>
          </div>
        ))}
      </div>
    ),
  ],
} satisfies Story;

export const DashboardStats = {
  decorators: [
    () => (
      <div
        style={{
          width: "800px",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
        }}
      >
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            style={{ padding: "16px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
          >
            <Skeleton height={16} width="60%" variant="pulse" />
            <div style={{ marginTop: "8px" }}>
              <Skeleton height={24} width="80%" />
            </div>
          </div>
        ))}
      </div>
    ),
  ],
} satisfies Story;

export const TableRow = {
  decorators: [
    () => (
      <div
        style={{
          width: "800px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "16px",
              padding: "12px",
            }}
          >
            <Skeleton height={16} />
            <Skeleton height={16} width="60%" />
            <Skeleton height={16} width="40%" />
            <Skeleton height={16} width="20%" />
          </div>
        ))}
      </div>
    ),
  ],
} satisfies Story;

export const MobileList = {
  decorators: [
    () => (
      <div
        style={{
          width: "360px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "8px",
            }}
          >
            <Skeleton width={64} height={64} />
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <Skeleton height={16} width="80%" />
              <Skeleton height={14} width="60%" />
              <div style={{ display: "flex", gap: "8px" }}>
                <Skeleton width={40} height={20} />
                <Skeleton width={60} height={20} />
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
  ],
} satisfies Story;
