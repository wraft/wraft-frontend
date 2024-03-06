import React from 'react';
import { Button } from 'theme-ui';

interface props {
  text: string;
  price?: boolean;
  dark?: boolean;
}

const ButtonCustom = ({ text, price, dark }: props) => {
  if (price) {
    return (
      <Button
        sx={{
          cursor: 'pointer',
          fontWeight: 500,
          fontSize: 1,
          borderRadius: '4px',
          py: [2, 1, 2],
          px: [4, 1, 3],
          color: `${dark ? 'text' : 'backgroundWhite'}`,
          bg: `${dark ? 'backgroundWhite' : 'gray.900'}`,
          '&:hover': {
            bg: `${dark ? 'gray.200' : 'gray.700'}`,
          },
        }}>
        {text}
      </Button>
    );
  } else
    return (
      <Button
        sx={{
          cursor: 'pointer',
          fontWeight: 500,
          fontFamily: 'Satoshi',
          fontSize: [2, 2, 2],
          border: '1px solid',
          borderRadius: '4px',
          borderColor: 'border',
          py: [2, 1, 2],
          px: [4, 1, 3],
          color: 'text',
          bg: 'transparent',
          '&:hover': {
            bg: 'gray.600',
            color: 'backgroundWhite',
          },
        }}>
        {text}
      </Button>
    );
};

export default ButtonCustom;
