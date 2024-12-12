import { Text, Button } from 'theme-ui';
import { ArrowRight } from '@phosphor-icons/react';

export const ApprovalHandler = ({ name, onClick }: any) => {
  return (
    <Button
      variant="btnPrimaryInline"
      sx={{
        gap: 1,
        '&:hover': {
          svg: {
            color: 'green.800',
          },
        },
      }}
      onClick={onClick}>
      <Text variant="pB">{name}</Text>
      <ArrowRight size={16} stroke="bold" />
    </Button>
  );
};
