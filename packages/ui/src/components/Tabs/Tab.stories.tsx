import type { Meta, StoryObj } from "@storybook/react";

import { Box } from "../Box";

import { Tab, useTab } from ".";

const TabsExample = () => {
  const tab = useTab({ defaultSelectedId: "tab1" });

  return (
    <>
      <Tab.List aria-label="Tabs" store={tab}>
        <Tab id="tab1" store={tab}>
          Tab 1
        </Tab>
        <Tab id="tab2" store={tab}>
          Tab 2
        </Tab>
        <Tab id="tab3" store={tab}>
          Tab 3
        </Tab>
      </Tab.List>
      <Tab.Panel store={tab} tabId="tab1">
        Tab.Panel 1
      </Tab.Panel>
      <Tab.Panel store={tab} tabId="tab2">
        Tab.Panel 2
      </Tab.Panel>
      <Tab.Panel store={tab} tabId="tab3">
        Tab.Panel 3
      </Tab.Panel>
    </>
  );
};

const meta: Meta<typeof TabsExample> = {
  title: "Navigation/Tabs",
  component: TabsExample,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A flexible tabs component that allows switching between different content panels. Supports various styles and disabled states.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TabsExample>;

export const Default: Story = {
  args: {},
};

export const WithSelectedTab: Story = {
  args: {},
  render: () => {
    const tab = useTab({ defaultSelectedId: "tab2" });
    return (
      <>
        <Tab.List aria-label="Tabs" store={tab}>
          <Tab id="tab1" store={tab}>
            Tab 1
          </Tab>
          <Tab id="tab2" store={tab}>
            Tab 2
          </Tab>
          <Tab id="tab3" store={tab}>
            Tab 3
          </Tab>
        </Tab.List>
        <Tab.Panel store={tab} tabId="tab1">
          Tab.Panel 1
        </Tab.Panel>
        <Tab.Panel store={tab} tabId="tab2">
          Tab.Panel 2
        </Tab.Panel>
        <Tab.Panel store={tab} tabId="tab3">
          Tab.Panel 3
        </Tab.Panel>
      </>
    );
  },
};

export const BorderlessWithDisabled: Story = {
  args: {},
  render: () => {
    const tab = useTab({ defaultSelectedId: "tab1" });
    return (
      <>
        <Tab.List aria-label="Tabs" boxShadow="none" store={tab}>
          <Tab id="tab1" store={tab}>
            Tab 1
          </Tab>
          <Tab id="tab2" store={tab}>
            Tab 2
          </Tab>
          <Tab id="tab3" store={tab}>
            Tab 3
          </Tab>
          <Tab id="tab4" store={tab}>
            Tab 4
          </Tab>
          <Tab disabled id="tab5" store={tab}>
            Tab 5
          </Tab>
        </Tab.List>
        <Tab.Panel store={tab} tabId="tab1">
          Tab.Panel 1
        </Tab.Panel>
        <Tab.Panel store={tab} tabId="tab2">
          Tab.Panel 2
        </Tab.Panel>
        <Tab.Panel store={tab} tabId="tab3">
          Tab.Panel 3
        </Tab.Panel>
        <Tab.Panel store={tab} tabId="tab4">
          Tab.Panel 4
        </Tab.Panel>
        <Tab.Panel disabled store={tab} tabId="tab5">
          Tab.Panel 5
        </Tab.Panel>
      </>
    );
  },
};
export const Vertical: Story = {
  args: {},
  render: () => {
    const tab = useTab({ orientation: "vertical", defaultSelectedId: "tab2" });
    return (
      <Box display="flex">
        <Tab.List aria-label="Tabs" boxShadow="none" store={tab}>
          <Tab id="tab1" store={tab}>
            Tab 1
          </Tab>
          <Tab id="tab2" store={tab}>
            Tab 2
          </Tab>
          <Tab id="tab3" store={tab}>
            Tab 3
          </Tab>
          <Tab id="tab4" store={tab}>
            Tab 4
          </Tab>
          <Tab disabled id="tab5" store={tab}>
            Tab 5
          </Tab>
        </Tab.List>
        <Tab.Panel store={tab} tabId="tab1">
          Tab.Panel 1
        </Tab.Panel>
        <Tab.Panel store={tab} tabId="tab2">
          Tab.Panel 2
        </Tab.Panel>
        <Tab.Panel store={tab} tabId="tab3">
          Tab.Panel 3
        </Tab.Panel>
        <Tab.Panel store={tab} tabId="tab4">
          Tab.Panel 4
        </Tab.Panel>
        <Tab.Panel disabled store={tab} tabId="tab5">
          Tab.Panel 5
        </Tab.Panel>
      </Box>
    );
  },
};
