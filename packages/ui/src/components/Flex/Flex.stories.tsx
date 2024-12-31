import type { Meta } from "@storybook/react";

import { Box } from "../Box";

import { Flex } from "./index";

const meta: Meta<any> = {
  component: Flex,
  title: "Layout/Flex",
  argTypes: {
    align: {
      description:
        "'-moz-initial' | 'inherit' | 'initial' | 'revert' | 'revert-layer' | 'unset' | 'center' | 'end' | 'flex-end' | 'flex-start' | 'self-end' | 'self-start' | 'start' | 'baseline' | 'normal' | 'stretch'",
      type: {
        name: "string",
      },
    },
    basis: {
      description: "string | number ",
    },
    direction: {
      description: `"row" | "-moz-initial" | "inherit" | "initial" | "revert" | "revert-layer" | "unset" | "column" | "column-reverse" | "row-reverse"`,
      type: {
        name: "string",
      },
    },
    grow: {
      description: `"-moz-initial" | "inherit" | "initial" | "revert" | "revert-layer" | "unset"`,
      type: {
        name: "string",
      },
    },
    justify: {
      description: `"right" | "left" | "-moz-initial" | "inherit" | "initial" | "revert" | "revert-layer" | "unset" | "center" | "end" | "flex-end" | "flex-start" | "start" | "normal" | "stretch" | "space-around" | "space-between" | "space-evenly"`,
      type: {
        name: "string",
      },
    },
    shrink: {
      description: `"-moz-initial" | "inherit" | "initial" | "revert" | "revert-layer" | "unset" `,
      type: {
        name: "string",
      },
    },
    wrap: {
      description: `"wrap" | "-moz-initial" | "inherit" | "initial" | "revert" | "revert-layer" | "unset" | "nowrap" | "wrap-reverse" `,
      type: {
        name: "string",
      },
    },
  },
};

export const Basic = () => {
  return (
    <Flex
      align="center"
      justify={{ xs: "center", md: "space-between" }}
      wrap="wrap"
    >
      <Box backgroundColor="gray.400" h={50} m="sm" w={50} />
      <Box backgroundColor="blue.400" h={50} m="sm" w={50} />
      <Box backgroundColor="orange.400" h={50} m="sm" w={50} />
      <Box backgroundColor="red.400" h={50} m="sm" w={50} />
      <Box backgroundColor="green.400" h={50} m="sm" w={50} />
    </Flex>
  );
};

export default meta;
