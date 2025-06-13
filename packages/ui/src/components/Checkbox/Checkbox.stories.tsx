import { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";

import { Box, Flex, Text } from "@/components";

import { Checkbox, CheckboxProps } from "./index";

export default {
  title: "Forms/Checkbox",
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component: `
Checkboxes allow users to select one or more items from a set of options, or to mark a task as completed.

## When to use
- When users need to select multiple options from a list
- When users need to toggle a single option on or off
- When presenting a list of options that are not mutually exclusive
- When users need to acknowledge terms and conditions

## Accessibility
- Checkboxes are implemented using native HTML input elements with type="checkbox"
- All checkboxes have proper labels and can be focused and activated using keyboard
- Supports indeterminate state for parent-child checkbox relationships
        `,
      },
    },
  },
  argTypes: {
    checked: {
      control: "boolean",
      description: "Whether the checkbox is checked",
    },
    disabled: {
      control: "boolean",
      description: "Whether the checkbox is disabled",
    },
    indeterminate: {
      control: "boolean",
      description: "Whether the checkbox is in an indeterminate state",
    },
    size: {
      control: { type: "select", options: ["xs", "sm", "md"] },
      description: "The size of the checkbox",
    },
    onChange: {
      action: "changed",
      description: "Callback when the checkbox state changes",
    },
  },
} as Meta<CheckboxProps>;

type Story = StoryObj<CheckboxProps>;

// Basic checkbox example
export const Default: Story = {
  args: {
    checked: false,
    disabled: false,
    indeterminate: false,
    size: "md",
  },
};

// Controlled checkbox example
export const Controlled: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);

    return (
      <Checkbox
        {...args}
        checked={checked}
        onChange={(e) => {
          setChecked(!checked);
          args.onChange?.(e);
        }}
      />
    );
  },
  args: {
    size: "md",
  },
};

// Checkbox with label
export const WithLabel: Story = {
  render: (args) => (
    <Flex alignItems="center">
      <Checkbox {...args} />
      <Text ml={2}>Accept terms and conditions</Text>
    </Flex>
  ),
  args: {
    size: "md",
  },
};

// Disabled states
export const DisabledStates: Story = {
  render: () => (
    <Flex direction="column" gap={3}>
      <Flex alignItems="center">
        <Checkbox disabled checked={false} />
        <Text ml={2}>Disabled unchecked</Text>
      </Flex>
      <Flex alignItems="center">
        <Checkbox disabled checked={true} />
        <Text ml={2}>Disabled checked</Text>
      </Flex>
      <Flex alignItems="center">
        <Checkbox disabled indeterminate />
        <Text ml={2}>Disabled indeterminate</Text>
      </Flex>
    </Flex>
  ),
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <Flex direction="column" gap={3}>
      <Flex alignItems="center">
        <Checkbox size="xs" />
        <Text ml={2}>Extra Small (xs)</Text>
      </Flex>
      <Flex alignItems="center">
        <Checkbox size="sm" />
        <Text ml={2}>Small (sm)</Text>
      </Flex>
      <Flex alignItems="center">
        <Checkbox size="md" />
        <Text ml={2}>Medium (md)</Text>
      </Flex>
    </Flex>
  ),
};

// Indeterminate example
export const IndeterminateExample: Story = {
  render: () => {
    const [checkedItems, setCheckedItems] = useState([false, false, false]);

    const allChecked = checkedItems.every(Boolean);
    const isIndeterminate = checkedItems.some(Boolean) && !allChecked;

    const handleParentChange = () => {
      const newValue = !allChecked;
      setCheckedItems(checkedItems.map(() => newValue));
    };

    const handleChildChange = (index: number) => {
      const newCheckedItems = [...checkedItems];
      newCheckedItems[index] = !newCheckedItems[index];
      setCheckedItems(newCheckedItems);
    };

    return (
      <Box>
        <Flex alignItems="center" mb={3}>
          <Checkbox
            checked={allChecked}
            indeterminate={isIndeterminate}
            onChange={handleParentChange}
          />
          <Text ml={2} fontWeight="bold">
            Parent Checkbox
          </Text>
        </Flex>

        <Box pl={6}>
          {checkedItems.map((checked, index) => (
            <Flex key={index} alignItems="center" mb={2}>
              <Checkbox
                checked={checked}
                onChange={() => handleChildChange(index)}
              />
              <Text ml={2}>Child Checkbox {index + 1}</Text>
            </Flex>
          ))}
        </Box>
      </Box>
    );
  },
};
