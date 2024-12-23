import { Meta, StoryFn } from "@storybook/react";

import { Skeleton, SkeletonProps } from ".";

export default {
  title: "Components/Skeleton",
  component: Skeleton,
  parameters: {
    controls: {
      expanded: true,
    },
  },
} as Meta;

const Template: StoryFn<SkeletonProps> = (args) => <Skeleton {...args} />;

export const Default = Template.bind({});
Default.args = {
  width: "100%",
  height: "4px",
};

Default.storyName = "Base Skeleton";

export const CustomSizes = Template.bind({});
CustomSizes.args = {
  width: "50%", // You can directly set the value here for interactive control
  height: "20px",
};

export const SkeletonInContext = Template.bind({});
SkeletonInContext.args = {
  width: "100%",
  height: "150px", // Simulating a card
};
SkeletonInContext.decorators = [
  (Story) => (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#F7F7F7",
        borderRadius: "8px",
      }}
    >
      <Story />
    </div>
  ),
];

SkeletonInContext.storyName = "Skeleton in a Card Context";
