import { HideIcon, ShowIcon } from "@wraft/icon";
import React from "react";

import { Button } from "../Button";

import { CreateWuiProps } from "@/system";

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
        <ShowIcon width="18px" height="18px" />
      ) : (
        <HideIcon width="18px" height="18px" />
      )}
    </Button>
  );
};
