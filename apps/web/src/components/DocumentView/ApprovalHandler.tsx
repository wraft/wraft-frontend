import { Button } from '@wraft/ui';
import { Check } from '@phosphor-icons/react';

import { IconFrame } from 'common/Atoms';

export const ApprovalHandler = ({
  variant = 'primary',
  name,
  onClick,
}: any) => {
  return (
    <Button variant={variant} onClick={onClick} size="sm">
      {name}
      <IconFrame color="green.900">
        <Check size={12} weight="bold" />
      </IconFrame>
    </Button>
  );
};
