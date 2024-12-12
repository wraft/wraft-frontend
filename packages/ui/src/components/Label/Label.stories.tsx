import type { Meta } from "@storybook/react";

import { Label } from ".";

const meta: Meta<any> = {
  component: Label,
  title: "Forms/Label",
};

export const Basic = () => <Label>Default label</Label>;

export default meta;
