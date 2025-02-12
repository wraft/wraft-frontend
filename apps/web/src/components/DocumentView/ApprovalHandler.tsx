import { Button } from '@wraft/ui';
import { ArrowRight } from '@phosphor-icons/react';

export const ApprovalHandler = ({ name, onClick }: any) => {
  return (
    <Button variant="primary" onClick={onClick} size="sm">
      {name}
      <ArrowRight size={14} stroke="bold" />
    </Button>
  );
};
