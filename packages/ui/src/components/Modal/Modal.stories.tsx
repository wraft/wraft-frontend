// Modal.stories.tsx
import { Meta, StoryFn } from "@storybook/react";
import React, { useState } from "react";

import { Modal } from "./index";

export default {
  title: "Components/Modal",
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
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <Modal
        {...args}
        open={isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm} // Pass onConfirm here
      >
        <div>
          <Modal.Header>Modal Header</Modal.Header>
          <div>{args.children}</div>
        </div>
      </Modal>
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  ariaLabel: "Default Modal",
  open: false,
  size: "md",
  children: <div>Confirm to send current content to Draft stage ?</div>,
};
