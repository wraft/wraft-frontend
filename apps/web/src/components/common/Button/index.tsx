import { forwardRef } from 'react';

import {
  Button as AriakitButton,
  ButtonProps as AriakitButtonProps,
} from '@ariakit/react';
import styled from '@emotion/styled';

const ButtonWrapper = styled(AriakitButton)<ButtonProps>`
  background: ${(props: any) =>
    props?.variant === 'text' ? 'transparent' : props.theme.colors.primary};
  color: ${(props: any) =>
    props?.variant === 'text'
      ? props.theme.colors.gray[900]
      : props.theme.colors.white};
  width: ${(props: any) => (props?.variant === 'text' ? '' : `100%`)};
  alignText: ${(props: any) => (props?.variant === 'text' ? 'left' : 'center')}
  font-weight: 500;
  padding: ${(props: any) => (props?.variant === 'text' ? '0px' : '12px')};
  border: ${(props: any) =>
    props?.variant === 'text'
      ? 'none'
      : `1px solid ${props.theme.colors.primary}`};
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
    background-color: ${(props: any) =>
      props?.variant === 'text' ? 'transparent' : '#003604'};
  }
`;

type ButtonProps = AriakitButtonProps & {
  variant?: 'primary' | 'secondary' | 'invisible' | 'text';
  size?: 'small' | 'medium' | 'large';
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ ...rest }, ref) => {
    return <ButtonWrapper {...rest} ref={ref} />;
  },
);
Button.displayName = 'Button';

export default Button;
