import type { ButtonProps as AkButtonProps } from '@ariakit/react';
import { Button as AriakitButton } from '@ariakit/react';
import styled, { th, x } from '@xstyled/emotion';
import { forwardRef } from 'react';

import { Spinner } from '../Spinner';

export type Shape = 'circle' | 'square';
export type Size = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'full';
export type Variant =
  | 'primary'
  | 'secondary'
  | 'outlined'
  | 'disabled'
  | 'googleLogin'
  | 'ghost';

export interface ButtonOptions extends AkButtonProps {
  disabled?: boolean;
  children?: React.ReactNode;
  loading?: boolean;
  size?: Size;
  variant?: Variant;
  shape?: Shape;
}

const ButtonWrapper =
  styled(AriakitButton) <
  ButtonOptions >
  `
  cursor: pointer;
  user-select: none;
  display: flex;
  justify-content: center;
  position: relative;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  
  transition:
    color 0.15s ease-in-out,
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  ${({ variant }) => th(`buttons.${variant}`)};
  color: ${(props) => props.loading && 'transparent'};
  width: ${({ size }) => size === 'full' && '100%'};
  ${({ size }) =>
    size === 'full' &&
    `
    padding-top: 12px;
    padding-bottom: 12px;
  `}
`;

export const Button = forwardRef<HTMLButtonElement, ButtonOptions>(
  ({ variant = 'primary', children, loading = false, ...rest }, ref) => {
    return (
      <ButtonWrapper variant={variant} loading={loading} {...rest} ref={ref}>
        <x.div display="flex">
          {loading && (
            <x.div flex="0 1 auto">
              <Spinner />
            </x.div>
          )}
          <x.div flex="0 1 auto">{children}</x.div>
        </x.div>
      </ButtonWrapper>
    );
  },
);

Button.displayName = 'Button';
