import React, { MouseEventHandler, useCallback } from 'react';
import { capitalCase } from '@remirror/core';
import { useHelpers } from '@remirror/react';

// export interface CommandButtonProps extends Omit<ButtonProps, 'type'> {
//     active?: boolean;
//     children?: React.ReactNode;
//     commandName?: string;
// }

export const CommandButton = ({
  active,
  children,
  commandName,
  ...buttonProps
}: any) => {
  const { getCommandOptions } = useHelpers();
  const options = commandName ? getCommandOptions(commandName) : undefined;

  const handleMouseDown: MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      e.preventDefault();
    },
    [],
  );

  return (
    <button
      type={active ? 'link' : 'text'}
      onMouseDown={handleMouseDown}
      {...buttonProps}>
      {children}
    </button>
  );
};
