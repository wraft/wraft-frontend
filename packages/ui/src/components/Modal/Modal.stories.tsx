import { Meta, StoryFn } from "@storybook/react";
import React, { useState } from "react";

import { Box, Flex, Text } from "..";
import { Button } from "../Button";

import { Modal } from "./index";

export default {
  title: "Overlay/Modal",
  component: Modal,
  argTypes: {
    onClose: { action: "closed" },
    onConfirm: { action: "confirmed" },
  },
} as Meta;

const Template: StoryFn<any> = (args) => {
  const [isOpen, setIsOpen] = useState(args.open);

  const handleClose = () => {
    setIsOpen(false);
    args.onClose && args.onClose();
  };

  const handleConfirm = () => {
    setIsOpen(false);
    args.onConfirm && args.onConfirm();
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        {...args}
        open={isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
      >
        <Box p="md">
          <Modal.Header>Modal Header</Modal.Header>
          <Box my="md">{args.children}</Box>
          <Flex gap="md" justifyContent="flex-end">
            <Button variant="tertiary" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm</Button>
          </Flex>
        </Box>
      </Modal>
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  ariaLabel: "Default Modal",
  open: false,
  size: "md",
  children: <Text>Confirm to send current content to Draft stage?</Text>,
};

export const WithSmoothTransition = Template.bind({});
WithSmoothTransition.args = {
  ariaLabel: "Modal with Smooth Transition",
  open: false,
  size: "md",
  children: (
    <Box>
      <Text mb="md">This modal has smooth open and close transitions:</Text>
      <ul>
        <li>Fade in/out effect</li>
        <li>Subtle scaling animation</li>
        <li>Custom timing function for a polished feel</li>
      </ul>
    </Box>
  ),
};
