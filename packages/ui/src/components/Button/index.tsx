import type { ButtonProps as AkButtonProps } from '@ariakit/react'
import { Button as AriakitButton } from '@ariakit/react'
// import styled from '@emotion/styled'
import {css} from '@emotion/react';
import { forwardRef } from 'react';

import styled, {
  style,
  th,
  system,
  space,
  SpaceProps,
} from '@xstyled/emotion';


export type Shape = 'circle' | 'square'
export type Size = 'xxs' | 'xs' | 'sm' | 'md' | 'lg'
export type Variant =
  | 'primary'
  | 'secondary'
  | 'outlined'
  | 'disabled'
  
export interface ButtonOptions extends AkButtonProps {
  disabled?: boolean
  size?: Size
  variant?: Variant
  shape?: Shape
}

const ButtonWrapper = styled(AriakitButton)<ButtonOptions>`
  cursor: pointer;
  user-select: none;
  transition:
    color 0.15s ease-in-out,
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  ${({variant}) => th(`buttons.${variant}`)};
`;


export const Button = forwardRef<HTMLButtonElement, ButtonOptions>(
  ({ ...rest }, ref) => {
    return <ButtonWrapper {...rest} ref={ref} />;
  },
);

Button.displayName = 'Button';
