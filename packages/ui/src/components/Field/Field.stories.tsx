import type { Meta } from "@storybook/react";

import { InputText } from "../InputText";

import { Field } from ".";

const meta: Meta<any> = {
  component: Field,
  title: "Forms/Field",
};

export const Basic = () => (
  <Field hint="A hint" label="Label">
    <InputText placeholder="Placeholder" />
  </Field>
);

export default meta;
