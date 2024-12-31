import type { Meta } from "@storybook/react";

import { Box } from "./index";

const meta: Meta<any> = {
  component: Box,
  title: "Layout/Box",
};

export const Basic = () => {
  return (
    <Box
      alignItems="center"
      backgroundColor="secondary"
      color="neutral.900"
      display="flex"
      justifyContent="center"
      p="xxl"
    >
      This is a Box with style form theme
    </Box>
  );
};

export const BasicWithVariant = () => {
  return (
    <Box variant="boxtwo" backgroundColor="green.500">
      This is a Box with style form theme
    </Box>
  );
};

export default meta;
