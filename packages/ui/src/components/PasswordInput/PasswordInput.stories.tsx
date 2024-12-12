import type { Meta } from "@storybook/react";

import { PasswordInput } from ".";

const meta: Meta<any> = {
  component: PasswordInput,
  title: "Forms/PasswordInput",
};

export const Basic = () => (
  <PasswordInput name="password" placeholder="Enter your password" />
);

export default meta;
