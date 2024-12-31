import type { Meta } from "@storybook/react";

import { Box } from "../Box";

import { Grid } from "./index";

const meta: Meta<any> = {
  component: Grid,
  title: "Layout/Grid",
  argTypes: {
    area: {
      description: `"-moz-initial" | "inherit" | "initial" | "revert" | "revert-layer" | "unset" | "auto" | string `,
      type: {
        name: "string",
      },
    },
    autoColumns: {
      description: `0 | "-moz-initial" | "inherit" | "initial" | "revert" | "revert-layer" | "unset" | "auto" | "max-content" | "min-content" `,
    },
    autoFlow: {
      description: `"row" | "column" | "-moz-initial" | "inherit" | "initial" | "revert" | "revert-layer" | "unset" | "dense" `,
      type: {
        name: "string",
      },
    },
    autoRows: {
      description: `0 | "-moz-initial" | "inherit" | "initial" | "revert" | "revert-layer" | "unset" | "auto" | "max-content" | "min-content"`,
      type: {
        name: "string",
      },
    },
    column: {
      description: `"-moz-initial" | "inherit" | "initial" | "revert" | "revert-layer" | "unset" | "auto"`,
      type: {
        name: "string",
      },
    },
    columnGap: {
      description: `string | number | true | symbol | {} | string `,
    },
    gap: {
      description: `string | number | true | symbol | {} | string `,
    },
    row: {
      description: `"-moz-initial" | "inherit" | "initial" | "revert" | "revert-layer" | "unset" | "auto" `,
      type: {
        name: "string",
      },
    },
  },
};

export const Basic = () => {
  return (
    <Grid gap="md" templateColumns="repeat(5, 1fr)">
      <Box backgroundColor="gray.400" h={50} w="100%" />
      <Box backgroundColor="orange.400" h={50} w="100%" />
      <Box backgroundColor="red.400" h={50} w="100%" />
      <Box backgroundColor="green.400" h={50} w="100%" />
      <Box backgroundColor="blue.400" h={50} w="100%" />
    </Grid>
  );
};

export const GridItem = () => {
  return (
    <Grid
      gap="md"
      h={400}
      templateColumns="repeat(4, 1fr)"
      templateRows="repeat(2, 1fr)"
    >
      <Grid.Item area="span 2 / span 1 / span 2 / span 1" bg="gray.400" />
      <Grid.Item bg="blue.400" column="span 2 / span 2" />
      <Grid.Item bg="orange.400" column="span 1 / span 1" />
      <Grid.Item bg="red.400" column="span 3 / span 3" />
    </Grid>
  );
};

export default meta;
