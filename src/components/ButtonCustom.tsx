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
          color: `${dark ? 'gray.8' : 'bgWhite'}`,
          bg: `${dark ? 'bgWhite' : 'gray.8'}`,
          '&:hover': {
            bg: `${dark ? 'gray.1' : 'gray.6'}`,
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
          borderColor: 'green.5',
          py: [2, 1, 2],
          px: [4, 1, 3],
          color: 'green.5',
          bg: 'transparent',
          '&:hover': {
            bg: 'green.5',
            color: 'bgWhite',
          },
        }}>
        {text}
      </Button>
    );
};

export default ButtonCustom;
