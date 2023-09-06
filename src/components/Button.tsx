import React from 'react';
import { Button as ButtonTheme } from 'theme-ui';

interface props {
  text: string;
}

const Button = ({ text }: props) => {
  return (
    <ButtonTheme
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
    </ButtonTheme>
  );
};

export default Button;
