import type { Meta } from "@storybook/react";
import * as React from "react";

import { Select, SelectProps } from "./index";

const meta: Meta<any> = {
  component: Select,
  title: "Forms/Select",
  parameters: {
    docs: {
      description: {
        component:
          "The Select component is an input field used to query and retrieve information from a dataset or database. It often includes features like autocomplete, suggestions, and filters to improve the search experience. This component enables users to easily find specific content or data within an application, enhancing usability and efficiency.",
      },
    },
  },
};

type Item = { Title: string };

const ITEMS = [
  { value: "bold", label: "Bold" },
  { value: "italic", label: "Italic" },
  { value: "strikethrough", label: "Strikethrough" },
  { value: "underline", label: "Underline" },
];

export const Basic = () => {
  const [value, setValue] = React.useState<SelectProps["value"]>();

  const handleChange = (newValue: SelectProps["value"]) => {
    setValue(newValue);
  };

  return (
    <Select
      name="welcome"
      onChange={handleChange}
      options={ITEMS}
      value={value}
    />
  );
};

export default meta;
