import React from 'react';
import { Button } from '@wraft/ui';
import { Box, Text } from 'theme-ui';

type Props = {
  onClick: () => void;
  text: string;
  children: React.ReactNode;
  disabled?: boolean;
};

const AnimatedButton = ({ onClick, text, children, disabled }: Props) => {
  return (
    <Button variant="none" onClick={onClick} disabled={disabled}>
      <Box
        sx={{
          display: 'flex',
          px: 3,
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '48px',
          minHeight: '36px',
          width: 'max-content',
          border: '1px solid',
          borderColor: 'border',
          borderRadius: '4px',
          transition: 'all 0.3s ease',
          '& .text': {
            color: 'green.600',
            minWidth: '0px',
            width: '0px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            transition: 'width 0.3s ease',
            '&::before': {
              content: 'attr(data-text)',
              position: 'relative',
              left: 0,
              right: 0,
              color: 'text',
              clipPath: 'inset(0 100% 0 0)',
              transition: 'clip-path 0.3s ease-out ',
            },
          },
          '& .icon': {
            color: 'gray.400',
          },
          ':hover': {
            borderColor: 'green.200',
            '& .icon': { color: 'green.600' },
            '& .text': {
              ml: 1,
              width: 'fit-content',
              '&::before': {
                clipPath: 'inset(0 0 0 0)',
              },
            },
          },
        }}>
        <Box
          className="icon"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {children}
        </Box>
        <Text as="p" className="text" data-text={text} />
      </Box>
    </Button>
  );
};

export default AnimatedButton;
