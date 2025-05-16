import { Button } from '@wraft/ui';
import { ArrowRight, Check } from '@phosphor-icons/react';

export const ApprovalHandler = ({ name, onClick }: any) => {
  return (
    <Button variant="primary" onClick={onClick} size="sm" fontSize="sm2">
      {name}
      <Check size={12} weight="bold" />
      {/* <ArrowRight size={14} stroke="bold" /> */}
    </Button>
  );
};
