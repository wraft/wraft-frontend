import type { Meta, StoryObj } from "@storybook/react";

import Table from ".";

const meta: Meta<typeof Table> = {
  title: "Component/Table",
  component: Table,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Table>;

const sampleData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    status: "Active",
    role: "Admin",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    status: "Inactive",
    role: "User",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    status: "Active",
    role: "Editor",
    children: [
      {
        id: 4,
        name: "Sub Item 1",
        email: "sub1@example.com",
        status: "Active",
        role: "User",
      },
    ],
  },
];

const columns = [
  {
    id: "name",
    header: "Name",
    accessorKey: "name",
    size: 200,
  },
  {
    id: "email",
    header: "Email",
    accessorKey: "email",
    size: 250,
  },
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    size: 150,
  },
  {
    id: "role",
    header: "Role",
    accessorKey: "role",
    size: 150,
  },
];

export const Default: Story = {
  args: {
    data: sampleData,
    columns: columns,
    "aria-label": "Sample Table",
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
    skeletonRows: 3,
  },
};

export const Empty: Story = {
  args: {
    ...Default.args,
    data: [],
    emptyMessage: "No data available",
  },
};

export const CustomSkeletonRows: Story = {
  args: {
    ...Default.args,
    isLoading: true,
    skeletonRows: 7,
  },
};

export const SortableColumns: Story = {
  args: {
    ...Default.args,
    data: Array.from({ length: 10 }, (_, index) => ({
      id: index + 1,
      name: `User ${index + 1}`,
      email: `user${index + 1}@example.com`,
      status: index % 2 === 0 ? "Active" : "Inactive",
      role: index % 3 === 0 ? "Admin" : index % 3 === 1 ? "Editor" : "User",
    })),
  },
};
