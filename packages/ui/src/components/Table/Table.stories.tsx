import type { Meta, StoryObj } from "@storybook/react";

import Table from ".";

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Table>;

// Sample data for our stories
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

// Default story
export const Default: Story = {
  args: {
    data: sampleData,
    columns: columns,
    "aria-label": "Sample Table",
  },
};

// Loading state story
export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
    skeletonRows: 3,
  },
};

// Empty state story
export const Empty: Story = {
  args: {
    ...Default.args,
    data: [],
    emptyMessage: "No data available",
  },
};

// Story with expandable rows
// export const ExpandableRows: Story = {
//   args: {
//     ...Default.args,
//     data: [
//       {
//         id: 1,
//         name: 'Parent 1',
//         email: 'parent1@example.com',
//         status: 'Active',
//         role: 'Admin',
//         children: [
//           {
//             id: 2,
//             name: 'Child 1.1',
//             email: 'child1@example.com',
//             status: 'Active',
//             role: 'User',
//           },
//           {
//             id: 3,
//             name: 'Child 1.2',
//             email: 'child2@example.com',
//             status: 'Inactive',
//             role: 'User',
//           },
//         ],
//       },
//       {
//         id: 4,
//         name: 'Parent 2',
//         email: 'parent2@example.com',
//         status: 'Active',
//         role: 'Editor',
//         children: [
//           {
//             id: 5,
//             name: 'Child 2.1',
//             email: 'child3@example.com',
//             status: 'Active',
//             role: 'User',
//           },
//         ],
//       },
//     ],
//   },
// };

// Story with custom number of skeleton rows
export const CustomSkeletonRows: Story = {
  args: {
    ...Default.args,
    isLoading: true,
    skeletonRows: 7,
  },
};

// Story with sortable columns
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
