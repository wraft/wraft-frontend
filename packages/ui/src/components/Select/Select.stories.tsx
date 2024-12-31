import type { Meta } from "@storybook/react";
import * as React from "react";

import { Tag } from "../Tag";

import { Select, SelectProps } from "./index";

const meta: Meta<any> = {
  component: Select,
  title: "Forms/Select",
};

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

export const Multiple = () => {
  const [value, setValue] = React.useState<SelectProps["value"]>();

  const handleChange = (newValue: SelectProps["value"]) => {
    setValue(newValue);
  };

  return (
    <Select
      isMultiple
      name="welcome"
      onChange={handleChange}
      options={ITEMS}
      value={value}
    />
  );
};
export const RenderMultiple = () => {
  const [value, setValue] = React.useState<SelectProps["value"]>();

  const handleChange = (newValue: SelectProps["value"]) => {
    setValue(newValue);
  };

  return (
    <Select
      isMultiple
      name="welcome"
      onChange={handleChange}
      options={ITEMS}
      renderMultiple={(values, handleRemove) => (
        <>
          {values.map((option) => {
            return (
              <Tag
                key={option.value}
                mr="sm"
                mt="sm"
                onRemove={() => handleRemove(option.value as string)}
                size="sm"
              >
                <div>{option.label}</div>
              </Tag>
            );
          })}
        </>
      )}
      value={value}
    />
  );
};
export const Searchable = () => {
  const [value, setValue] = React.useState<SelectProps["value"]>();

  const handleChange = (newValue: SelectProps["value"]) => {
    setValue(newValue);
  };

  return (
    <Select
      isSearchable
      name="welcome"
      onChange={handleChange}
      options={ITEMS}
      value={value}
    />
  );
};

export default meta;
