import type { Meta } from "@storybook/react";

import { Text, TextVariant } from "./index";

import { theme } from "@/theme";

const meta: Meta<any> = {
  component: Text,
  title: "Typography/Text",
  argTypes: {
    variant: {
      default: false,
      description:
        "xs | sm | base | lg | xl | 2xl | 3xl | 4xl | 5xl | 6xl | 7xl | 8xl | 9xl",
      type: {
        name: "string",
      },
    },
    withDash: {
      control: "boolean",
      default: false,
      type: {
        name: "boolean",
      },
    },
    lines: {
      control: "number",
      default: false,
      type: {
        name: "number",
      },
    },
  },
  args: {
    variant: "xs",
    withDash: "",
  },
};

const textVariants: TextVariant[] = [
  "xs",
  "sm",
  "base",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
  "7xl",
  "8xl",
  "9xl",
];

export const Variants = {
  parameters: {
    docs: {
      description: {
        story:
          "The Text component is a fundamental UI element used to display and style text content within an application. It provides various typography options, such as font size, weight, color, and alignment, allowing for consistent and customizable presentation of textual information. This component is essential for conveying information clearly and effectively in the user interface.",
      },
    },
  },
  render: () => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: theme.space.xxl,
        }}
      >
        {textVariants.map((variant: TextVariant) => (
          <div key={variant}>
            <Text variant="base" m={0}>
              {`text-${variant}`}
            </Text>
            <br />
            <Text variant={variant} m={0}>
              Welcome to Wraft Design System!
            </Text>
          </div>
        ))}
      </div>
    );
  },
};

export const Truncation = {
  parameters: {
    docs: {
      description: {
        story:
          "Set the number of lines you want to display with lines. Your text will be displayed truncated with an ellipsis (...) at the end (if necessary).",
      },
    },
  },
  render: () => {
    return (
      <>
        <Text lines={1}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean quis
          viverra lectus, vel tristique turpis. Vivamus magna nulla, elementum
          in feugiat feugiat, egestas eget nibh. Ut ac justo vitae dolor iaculis
          gravida. In eu nisl lorem. Cras eu mauris et tortor suscipit accumsan.
          Duis ullamcorper nisl a justo ultricies, eu consequat risus imperdiet.
          Phasellus at metus cursus, fringilla tortor eu, scelerisque quam.
          Donec efficitur porta elit ac malesuada.
        </Text>
        <Text lines={3}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean quis
          viverra lectus, vel tristique turpis. Vivamus magna nulla, elementum
          in feugiat feugiat, egestas eget nibh. Ut ac justo vitae dolor iaculis
          gravida. In eu nisl lorem. Cras eu mauris et tortor suscipit accumsan.
          Duis ullamcorper nisl a justo ultricies, eu consequat risus imperdiet.
          Phasellus at metus cursus, fringilla tortor eu, scelerisque quam.
          Donec efficitur porta elit ac malesuada.
        </Text>
        <Text lines={3}>Lorem ipsum dolor sit amet</Text>
        <Text lines={3} variant="base">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean quis
          viverra lectus, vel tristique turpis. Vivamus magna nulla, elementum
          in feugiat feugiat, egestas eget nibh. Ut ac justo vitae dolor iaculis
          gravida. In eu nisl lorem. Cras eu mauris et tortor suscipit accumsan.
          Duis ullamcorper nisl a justo ultricies, eu consequat risus imperdiet.
          Phasellus at metus cursus, fringilla tortor eu, scelerisque quam.
          Donec efficitur porta elit ac malesuada.
        </Text>
      </>
    );
  },
};

export default meta;
