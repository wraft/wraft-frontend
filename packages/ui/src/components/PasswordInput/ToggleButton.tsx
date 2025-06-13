import { HideIcon, ShowIcon } from "@wraft/icon";
import React from "react";

import { CreateWuiProps } from "@/system";

import { Button } from "../Button";

interface ToggleButtonOptions {
  isHidden: boolean;
}

type ToggleButtonProps = CreateWuiProps<typeof Button, ToggleButtonOptions>;

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  dataTestId,
  isHidden,
  onClick,
  title,
}) => {
  return (
    <Button
      aria-controls="password"
      aria-expanded={`${!isHidden}`}
      onClick={onClick}
      shape="circle"
      size="xs"
      title={title}
      variant="ghost"
    >
      {isHidden ? (
        <HideIcon width="18px" height="18px" />
      ) : (
        <ShowIcon width="18px" height="18px" />
      )}
    </Button>
  );
};
