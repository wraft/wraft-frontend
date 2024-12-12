import type { Meta } from "@storybook/react";

import { InputText } from "./index";

const meta: Meta<any> = {
  component: InputText,
  title: "Forms/InputText",
};

export const Basic = () => <InputText name="firstName" placeholder="Welcome" />;

export default meta;
