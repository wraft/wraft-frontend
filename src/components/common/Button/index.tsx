import { forwardRef } from 'react';

import {
  Button as AriakitButton,
  ButtonProps as AriakitButtonProps,
} from '@ariakit/react';
import styled from '@emotion/styled';

const ButtonWrapper = styled(AriakitButton)`
  background: ${(props: any) => props?.theme?.colors.primary};
  color: ${(props: any) => props?.theme?.colors.white};
  width: 100%;
  font-weight: 500;
  padding: 12px;
  border-color: ${(props: any) => props?.theme?.colors.primary};
  border: 1px solid;
  border-radius: 4px;
  user-select: none;
  cursor: pointer;
  font-size: 14px;
  transition:
    color 0.15s ease-in-out,
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  :hover {
    background-color: #003604;
  }
`;

type ButtonProps = AriakitButtonProps & {
  variant?: 'primary' | 'secondary' | 'invisible';
  size?: 'small' | 'medium' | 'large';
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ ...rest }, ref) => {
    return <ButtonWrapper {...rest} ref={ref} />;
  },
);
Button.displayName = 'Button';

export default Button;
